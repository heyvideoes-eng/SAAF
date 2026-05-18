import React from 'react';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import { 
  BarChart3, 
  Users2, 
  ShieldCheck, 
  AlertCircle, 
  TrendingUp, 
  ArrowUpRight,
  Filter,
  Download,
  Layers,
  Map as MapIcon
} from 'lucide-react';

const AuthorityDashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = React.useState<'24H' | '7D' | '30D' | 'ALL'>('24H');

  const getFilteredKpis = () => {
    const data: Record<'24H' | '7D' | '30D' | 'ALL', Array<{ label: string; value: string; change: string; trend: string; color: string }>> = {
      '24H': [
        { label: 'Overall City Compliance', value: '94.2%', change: '+1.2%', trend: 'UP', color: 'text-emerald-500' },
        { label: 'Average Resolution Time', value: '1.4h', change: '-12m', trend: 'DOWN', color: 'text-blue-500' },
        { label: 'Active Workforce', value: '124', change: '100% On-shift', trend: 'STABLE', color: 'text-amber-500' },
        { label: 'Open Critical Cases', value: '12', change: '-4 since 8AM', trend: 'DOWN', color: 'text-red-500' },
      ],
      '7D': [
        { label: 'Overall City Compliance', value: '91.8%', change: '+2.4%', trend: 'UP', color: 'text-emerald-500' },
        { label: 'Average Resolution Time', value: '1.8h', change: '+15m', trend: 'UP', color: 'text-blue-500' },
        { label: 'Active Workforce', value: '118', change: '95% Average', trend: 'STABLE', color: 'text-amber-500' },
        { label: 'Open Critical Cases', value: '18', change: '+3 this week', trend: 'UP', color: 'text-red-500' },
      ],
      '30D': [
        { label: 'Overall City Compliance', value: '89.5%', change: '-0.8%', trend: 'DOWN', color: 'text-emerald-500' },
        { label: 'Average Resolution Time', value: '2.1h', change: '+45m', trend: 'UP', color: 'text-blue-500' },
        { label: 'Active Workforce', value: '121', change: '98% Average', trend: 'STABLE', color: 'text-amber-500' },
        { label: 'Open Critical Cases', value: '25', change: '+12 this month', trend: 'UP', color: 'text-red-500' },
      ],
      'ALL': [
        { label: 'Overall City Compliance', value: '92.4%', change: 'Baseline', trend: 'STABLE', color: 'text-emerald-500' },
        { label: 'Average Resolution Time', value: '1.9h', change: 'SLA Met', trend: 'STABLE', color: 'text-blue-500' },
        { label: 'Active Workforce', value: '120', change: 'Full Strength', trend: 'STABLE', color: 'text-amber-500' },
        { label: 'Open Critical Cases', value: '8', change: 'LTS Stable', trend: 'DOWN', color: 'text-red-500' },
      ]
    };
    return data[timeFilter];
  };

  const kpis = getFilteredKpis();

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = [15, 23, 42]; // #0f172a
    const accentColor = [37, 99, 235]; // #2563eb
    const textColor = [51, 65, 85]; // #334155
    const lightBg = [248, 250, 252]; // #f8fafc

    // 1. Header Block (Midnight Blue banner)
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 45, 'F');

    // Accent line below banner
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(0, 45, 210, 2, 'F');

    // Header Typography
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('SAAF OS • CITY INTELLIGENCE PLATFORM', 15, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // light grey
    doc.text('STRATEGIC OVERSIGHT & GOVERNANCE REPORT', 15, 25);
    
    const timeText = `TIME HORIZON FILTER: ${timeFilter}`;
    doc.text(timeText, 15, 30);

    // Date & Time (Top Right)
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    const dateStr = `Generated: ${new Date().toLocaleString()}`;
    doc.text(dateStr, 210 - 15 - doc.getTextWidth(dateStr), 18);

    const docId = `SECURE ID: SAAF-REP-${Math.floor(100000 + Math.random() * 900000)}`;
    doc.text(docId, 210 - 15 - doc.getTextWidth(docId), 25);

    // 2. Body Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Global Municipal KPI Matrix', 15, 60);

    // 3. KPI Grid (4 beautifully placed rectangles)
    const startY = 66;
    const boxWidth = 42;
    const boxHeight = 25;
    const gap = 8;

    kpis.forEach((kpi, idx) => {
      const x = 15 + idx * (boxWidth + gap);

      // Light background card
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.roundedRect(x, startY, boxWidth, boxHeight, 3, 3, 'F');

      // Thin accent border
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(x, startY, boxWidth, boxHeight, 3, 3, 'D');

      // KPI Value
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text(kpi.value, x + boxWidth / 2, startY + 11, { align: 'center' });

      // KPI Label
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      
      // Handle word wrapping for labels
      const splitLabel = doc.splitTextToSize(kpi.label, boxWidth - 4);
      doc.text(splitLabel, x + boxWidth / 2, startY + 18, { align: 'center' });
    });

    // 4. Section: Ward Performance Matrix Table
    const tableY = startY + boxHeight + 15;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Sector Performance & SLA Telemetry', 15, tableY);

    // Draw custom table header
    const thY = tableY + 5;
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(15, thY, 180, 8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('SECTOR / WARD AREA', 18, thY + 5.5);
    doc.text('ACTIVE CASES', 80, thY + 5.5);
    doc.text('STAFF LOAD', 120, thY + 5.5);
    doc.text('SLA COMPLIANCE', 160, thY + 5.5);

    // Draw rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    let rowY = thY + 8;

    [1, 2, 3, 4, 5].forEach((i) => {
      // Zebra striping
      if (i % 2 === 0) {
        doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
        doc.rect(15, rowY, 180, 8, 'F');
      }

      // Draw cell lines
      doc.setDrawColor(241, 245, 249);
      doc.line(15, rowY + 8, 195, rowY + 8);

      doc.text(`Ward Area Alpha ${i}`, 18, rowY + 5.5);
      doc.text('24 Pending', 80, rowY + 5.5);
      doc.text('12 Staff', 120, rowY + 5.5);
      doc.text('92%', 160, rowY + 5.5);

      rowY += 8;
    });

    // 5. Section: Escalation Queue
    const escY = rowY + 15;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Active Strategic Escalation Queue', 15, escY);

    const ethY = escY + 5;
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(15, ethY, 180, 8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('CASE ID', 18, ethY + 5.5);
    doc.text('INCIDENT DESCRIPTION', 50, ethY + 5.5);
    doc.text('DURATION', 125, ethY + 5.5);
    doc.text('CRITICALITY', 160, ethY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    let erowY = ethY + 8;

    const escalations = [
      { id: '#892', msg: 'SLA Breach: Sector 4', time: '12m active', priority: 'HIGH' },
      { id: '#895', msg: 'Unverified Audit: Node 02', time: '2h active', priority: 'NORMAL' },
      { id: '#901', msg: 'Staff Anomaly Detected', time: '4h active', priority: 'MEDIUM' }
    ];

    escalations.forEach((item, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
        doc.rect(15, erowY, 180, 8, 'F');
      }

      doc.setDrawColor(241, 245, 249);
      doc.line(15, erowY + 8, 195, erowY + 8);

      doc.text(item.id, 18, erowY + 5.5);
      doc.text(item.msg, 50, erowY + 5.5);
      doc.text(item.time, 125, erowY + 5.5);
      doc.text(item.priority, 160, erowY + 5.5);

      erowY += 8;
    });

    // 6. Security Footer
    const footerY = 280;
    doc.setDrawColor(226, 232, 240);
    doc.line(15, footerY - 5, 195, footerY - 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('SAAF SECURITY OVERRIDE MATRIX • AUTHENTICATED SYSTEM LEDGER', 15, footerY);

    const pgStr = 'Page 1 of 1';
    doc.text(pgStr, 195 - doc.getTextWidth(pgStr), footerY);

    // Download PDF
    doc.save(`SAAF_Strategic_Oversight_${timeFilter}.pdf`);
  };

  return (
    <div className="space-y-12">
      {/* Header Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Command Control Center</h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-2">Strategic Oversight & Operational Governance</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
           <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
              {['24H', '7D', '30D', 'ALL'].map(t => (
                <button 
                  key={t} 
                  onClick={() => setTimeFilter(t as any)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all duration-300 focus:outline-none ${
                    timeFilter === t 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                      : 'text-slate-500 hover:text-white transition-colors'
                  }`}
                >
                  {t}
                </button>
              ))}
           </div>
           <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 focus:outline-none transition-all duration-300 active:scale-95">
              <Filter size={14} /> Global Filters
           </button>
           <button 
             onClick={generatePDF}
             className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-300 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-600/20 focus:outline-none"
           >
              <Download size={14} /> Generate Report
           </button>
        </div>
      </div>

      {/* Analytical KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {kpis.map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0f172a] border border-white/5 p-8 rounded-3xl space-y-6 group hover:border-blue-500/30 transition-all shadow-2xl shadow-black/50"
          >
            <div className="flex justify-between items-start">
               <div className={`p-3 rounded-2xl bg-white/5 ${kpi.color}`}>
                  <BarChart3 size={24} />
               </div>
               <div className="text-right">
                  <div className={`flex items-center gap-1 text-[10px] font-black ${kpi.trend === 'UP' ? 'text-emerald-500' : 'text-blue-500'}`}>
                    <ArrowUpRight size={12} />
                    {kpi.change}
                  </div>
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">vs Previous</span>
               </div>
            </div>
            <div>
               <p className="text-4xl font-black text-white tracking-tighter">{kpi.value}</p>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">{kpi.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Governance Surface */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Workload Distribution Matrix */}
        <div className="xl:col-span-8 bg-[#0f172a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
             <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider">Ward Performance Matrix</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Cross-departmental efficiency tracking</p>
             </div>
             <button className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-colors">
                <Layers size={20} />
             </button>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] bg-black/20">
                      <th className="px-10 py-6">Sector / Area</th>
                      <th className="px-10 py-6">Active Cases</th>
                      <th className="px-10 py-6">Staff Load</th>
                      <th className="px-10 py-6">SLA Compliance</th>
                      <th className="px-10 py-6 text-right">Details</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {[1, 2, 3, 4, 5].map(i => (
                     <tr key={i} className="group hover:bg-white/[0.01] transition-colors cursor-pointer">
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-4">
                              <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                              <span className="text-sm font-bold text-white tracking-tight">Ward Area Alpha {i}</span>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-sm font-bold text-slate-300">24 Pending</td>
                        <td className="px-10 py-8 text-sm font-bold text-slate-300">12 Staff</td>
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-4">
                              <div className="flex-1 h-1.5 bg-white/5 rounded-full min-w-[100px] overflow-hidden">
                                 <div className="h-full bg-emerald-500" style={{ width: '92%' }} />
                              </div>
                              <span className="text-xs font-black text-emerald-500">92%</span>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <ArrowUpRight size={18} className="text-slate-700 group-hover:text-white transition-colors inline-block" />
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>

        {/* Real-time Incident Feed */}
        <div className="xl:col-span-4 space-y-10">
           <div className="bg-[#0f172a] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                 <ShieldCheck size={18} className="text-blue-500" />
                 Escalation Queue
              </h3>
              <div className="space-y-8">
                 {[
                   { id: '#892', msg: 'SLA Breach: Sector 4', time: '12m ago', priority: 'HIGH' },
                   { id: '#895', msg: 'Unverified Audit: Node 02', time: '2h ago', priority: 'NORMAL' },
                   { id: '#901', msg: 'Staff Anomaly Detected', time: '4h ago', priority: 'MEDIUM' }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-6 group cursor-pointer">
                      <div className={`w-1 h-10 rounded-full ${item.priority === 'HIGH' ? 'bg-red-500' : 'bg-blue-600'} group-hover:scale-y-110 transition-transform`} />
                      <div>
                         <p className="text-sm font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">{item.msg}</p>
                         <div className="flex items-center gap-3 mt-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                            <span className="text-blue-500">{item.id}</span>
                            <div className="w-1 h-1 rounded-full bg-slate-800" />
                            <span>{item.time}</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-12 py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all">
                 Review All Alerts
              </button>
           </div>

           <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-600/20 overflow-hidden relative group cursor-pointer">
              <div className="relative z-10">
                 <MapIcon size={32} className="mb-6 group-hover:scale-110 transition-transform duration-500" />
                 <h3 className="text-2xl font-black tracking-tighter mb-4">City Map Overhaul</h3>
                 <p className="text-sm text-blue-100 font-medium leading-relaxed opacity-80">View high-resolution geographical distribution of all active cases and staff deployments.</p>
                 <div className="mt-10 flex items-center gap-4 text-xs font-black uppercase tracking-widest">
                    Launch Geospatial Hub <ArrowUpRight size={18} />
                 </div>
              </div>
              <Layers className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
