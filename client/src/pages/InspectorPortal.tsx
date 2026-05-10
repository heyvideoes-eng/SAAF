import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ClipboardCheck, Camera, MapPin, CheckCircle2, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLiveData } from '../context/LiveDataContext';
import { useToast } from '../context/ToastContext';

const InspectorPortal: React.FC = () => {
  const navigate = useNavigate();
  const { facilities } = useLiveData();
  const { showToast } = useToast();
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [step, setStep] = useState<'SELECT' | 'FORM' | 'SUCCESS'>('SELECT');
  
  const [checklist, setChecklist] = useState({
    visibility: false,
    water_availability: false,
    lighting: false,
    remarks: '',
    photo: null as string | null
  });

  const handleCapture = () => {
    const mockPhoto = `https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800`;
    setChecklist(prev => ({ ...prev, photo: mockPhoto }));
    showToast('Evidence Photo Captured', 'success');
  };

  const handleSubmit = async () => {
    showToast('Finalizing Report...', 'info');
    setTimeout(() => {
      setStep('SUCCESS');
      showToast('Inspection Record Saved', 'success');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-atmosBg pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-atmosAccent text-[10px] font-bold uppercase tracking-widest mb-2">
              <ClipboardCheck size={14} />
              Official Government Inspection
            </div>
            <h1 className="text-3xl font-bold text-atmosText tracking-tighter">
              Field <span className="text-atmosAccentSoft">Validator</span>
            </h1>
          </div>
          {step !== 'SELECT' && (
            <button onClick={() => setStep('SELECT')} className="flex items-center gap-2 text-atmosTextMuted hover:text-white transition-colors">
              <ArrowLeft size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Back</span>
            </button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {step === 'SELECT' && (
            <div className="grid gap-4">
              {facilities.map(f => (
                <button
                  key={f.id}
                  onClick={() => { setSelectedFacility(f); setStep('FORM'); }}
                  className="w-full p-6 bg-atmosBgAlt/60 border border-white/5 rounded-3xl hover:border-atmosAccent/30 text-left transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="text-lg font-bold text-atmosText">{f.name}</div>
                    <div className="text-xs text-atmosTextMuted mt-1">{f.location}</div>
                  </div>
                  <ClipboardCheck className="text-atmosTextMuted" size={20} />
                </button>
              ))}
            </div>
          )}

          {step === 'FORM' && (
            <div className="bg-atmosBgAlt/60 border border-white/10 rounded-[2.5rem] p-8">
              <h2 className="text-2xl font-bold text-atmosText mb-8">{selectedFacility?.name}</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(['visibility', 'water_availability', 'lighting'] as const).map(id => (
                    <button
                      key={id}
                      onClick={() => setChecklist(prev => ({ ...prev, [id]: !prev[id] }))}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${checklist[id] ? 'bg-atmosSuccess/10 border-atmosSuccess/30 text-atmosSuccess' : 'bg-white/5 border-white/5 text-atmosTextMuted'}`}
                    >
                      <span className="text-xs font-bold uppercase tracking-widest">{id.replace('_', ' ')}</span>
                      {checklist[id] ? <CheckCircle2 size={18} /> : <div className="w-[18px] h-[18px] border-2 border-current/20 rounded-full" />}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={handleCapture} className="aspect-video bg-white/5 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 overflow-hidden">
                    {checklist.photo ? <img src={checklist.photo} className="w-full h-full object-cover" alt="Verification" /> : <Camera className="text-atmosTextMuted" size={32} />}
                  </button>
                  <div className="bg-white/5 rounded-3xl p-6">
                    <div className="flex items-center gap-3 text-atmosTextMuted">
                      <MapPin size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">GPS: 30.2705 N, 78.0055 E</span>
                    </div>
                    <textarea 
                      placeholder="Remarks..." 
                      className="w-full bg-transparent border-b border-white/10 py-2 text-sm text-atmosText focus:border-atmosAccent outline-none mt-4"
                      value={checklist.remarks}
                      onChange={e => setChecklist(prev => ({ ...prev, remarks: e.target.value }))}
                    />
                  </div>
                </div>
                <button onClick={handleSubmit} className="w-full h-16 bg-atmosAccent text-white rounded-3xl font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg shadow-atmosAccent/20">
                  <Save size={20} /> Complete Audit
                </button>
              </div>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="bg-atmosBgAlt/60 border border-atmosSuccess/20 rounded-[2.5rem] p-12 text-center">
              <CheckCircle2 className="text-atmosSuccess mx-auto mb-6" size={48} />
              <h2 className="text-3xl font-bold text-atmosText mb-4">Inspection Certified</h2>
              <button onClick={() => navigate('/admin')} className="px-8 py-4 bg-atmosAccent text-white rounded-2xl text-xs font-bold uppercase tracking-widest">Back to Dashboard</button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InspectorPortal;
