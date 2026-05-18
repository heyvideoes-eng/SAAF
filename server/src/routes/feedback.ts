import express from 'express';
import { db } from '../db/setup.js';
import { supabase, isSupabaseConfigured } from '../db/supabase.js';
import { io } from '../socket.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const feedbackList = db.prepare(`
      SELECT f.*, fac.name as facility_name, fac.location as facility_location
      FROM user_feedback f
      JOIN facilities fac ON f.facility_id = fac.id
      ORDER BY f.id DESC
      LIMIT 50
    `).all();
    res.json(feedbackList);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { facility_id, rating, issue_type, comment, photo_url, lat, lng } = req.body;
    
    const timestamp = new Date().toISOString();
    
    const feedback = db.prepare(`
      INSERT INTO user_feedback (facility_id, rating, issue_type, comment, photo_url, lat, lng, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(facility_id, rating, issue_type || 'NONE', comment || '', photo_url || '', lat || null, lng || null, timestamp);

    if (isSupabaseConfigured()) {
      await supabase.from('user_feedback').insert({
        facility_id,
        rating,
        issue_type: issue_type || 'NONE',
        comment: comment || '',
        photo_url: photo_url || '',
        lat: lat || null,
        lng: lng || null
      });
    }

    const feedbackId = feedback.lastInsertRowid;

    // Logic: Auto-trigger maintenance task for low ratings
    if (rating <= 2) {
      console.log(`⚠️ [Feedback] Low rating detected for facility ${facility_id}. Auto-triggering task.`);
      
      const taskReason = issue_type !== 'NONE' ? `Citizen Report: ${issue_type}` : 'Low Rating Alert';
      const taskDesc = comment ? `Citizen Feedback: "${comment}"` : 'Facility received a very low rating. Immediate inspection required.';
      
      const task = db.prepare(`
        INSERT INTO maintenance_tasks (facility_id, status, priority, issue_reason, description, created_at)
        VALUES (?, 'PENDING', 'HIGH', ?, ?, ?)
      `).run(facility_id, taskReason, taskDesc, timestamp);

      if (isSupabaseConfigured()) {
        await supabase.from('maintenance_tasks').insert({
          facility_id,
          status: 'PENDING',
          priority: 'HIGH',
          issue_reason: taskReason,
          description: taskDesc
        });
      }

      // Emit Live Alert
      io.emit('maintenance_alert', {
        id: task.lastInsertRowid,
        facility_id,
        alert_type: 'CITIZEN_REPORT',
        message: taskReason,
        severity: 'HIGH',
        timestamp
      });
      
      // Update cleanliness status to RED if it was GREEN
      db.prepare(`
        INSERT INTO cleanliness_status (facility_id, status, reason, updated_at)
        VALUES (?, 'RED', ?, ?)
      `).run(facility_id, 'Multiple Citizen Complaints', timestamp);

      if (isSupabaseConfigured()) {
        await supabase.from('cleanliness_status').insert({
          facility_id,
          status: 'RED',
          reason: 'Multiple Citizen Complaints'
        });
      }
      
      io.emit('status_change', {
        facility_id,
        new_status: 'RED',
        reason: 'Citizen Complaints'
      });
    }

    // Fetch facility metadata for socket payload
    const facilityName = (db.prepare('SELECT name FROM facilities WHERE id = ?').get(facility_id) as any)?.name || 'SBM Toilet Hub';
    const facilityLocation = (db.prepare('SELECT location FROM facilities WHERE id = ?').get(facility_id) as any)?.location || 'Municipal Area';

    io.emit('feedback_submitted', {
      id: feedbackId,
      facility_id,
      rating,
      issue_type: issue_type || 'NONE',
      comment: comment || '',
      photo_url: photo_url || '',
      resolution_status: 'OPEN',
      lat: lat || null,
      lng: lng || null,
      timestamp,
      facility_name: facilityName,
      facility_location: facilityLocation
    });

    res.json({ 
      status: 'success', 
      feedback_id: feedbackId,
      task_triggered: rating <= 2 
    });
  } catch (error: any) {
    console.error('Feedback Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/feedback/:id - Track progress
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Support both raw numeric ID, SAAF-00XXXX and ENC-SEC-XXXX formats
    const rawId = id.includes('-') ? id.split('-').pop() : id;
    const numericId = parseInt(rawId || '', 10);

    const feedback = db.prepare(`
      SELECT f.*, fac.name as facility_name, fac.location as facility_location
      FROM user_feedback f
      JOIN facilities fac ON f.facility_id = fac.id
      WHERE f.id = ?
    `).get(numericId);

    if (!feedback) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(feedback);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
