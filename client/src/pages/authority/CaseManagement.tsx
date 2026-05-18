import React from 'react';
import { 
  ListFilter, 
  Search, 
  MoreVertical, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Filter
} from 'lucide-react';

const CaseManagement: React.FC = () => {
  const [caseFilter, setCaseFilter] = React.useState<'ALL' | 'PENDING' | 'ACTIVE' | 'RESOLVED'>('ALL');
  
  const [caseList, setCaseList] = React.useState([
    { id: 'CAS-1024', title: 'Major Leak: Sector 4', worker: 'Rohan S.', status: 'IN_PROGRESS', time: '2h active', priority: 'URGENT' },
    { id: 'CAS-1025', title: 'Trash Overflow: Market', worker: 'Anita M.', status: 'ASSIGNED', time: '10m ago', priority: 'HIGH' },
    { id: 'CAS-1026', title: 'Odor Report: Central', worker: 'Unassigned', status: 'PENDING', time: '1h ago', priority: 'NORMAL' },
    { id: 'CAS-1027', title: 'Wall Graffiti: Park', worker: 'Suresh K.', status: 'COMPLETED', time: 'Finished', priority: 'LOW' },
  ]);

  const [editingCase, setEditingCase] = React.useState<any | null>(null);
  const [editWorker, setEditWorker] = React.useState('');
  const [editPriority, setEditPriority] = React.useState('');
  const [editStatus, setEditStatus] = React.useState('');

  React.useEffect(() => {
    if (editingCase) {
      setEditWorker(editingCase.worker);
      setEditPriority(editingCase.priority);
      setEditStatus(editingCase.status);
    }
  }, [editingCase]);

  const specialists = ['Rohan S.', 'Anita M.', 'Suresh K.', 'Priya N.', 'Amit P.', 'Unassigned'];
  const priorities = ['URGENT', 'HIGH', 'NORMAL', 'LOW'];
  const statuses = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'];

  const handleSaveChanges = () => {
    if (!editingCase) return;
    setCaseList(prev => prev.map(c => {
      if (c.id === editingCase.id) {
        return {
          ...c,
          worker: editWorker,
          priority: editPriority,
          status: editStatus,
          time: editStatus === 'COMPLETED' ? 'Finished' : c.time === 'Finished' ? '10m ago' : c.time
        };
      }
      return c;
    }));
    setEditingCase(null);
  };

  const filteredCases = React.useMemo(() => {
    if (caseFilter === 'ALL') return caseList;
    return caseList.filter(c => {
      if (caseFilter === 'PENDING') return c.status === 'PENDING' || c.status === 'ASSIGNED';
      if (caseFilter === 'ACTIVE') return c.status === 'IN_PROGRESS';
      if (caseFilter === 'RESOLVED') return c.status === 'COMPLETED';
      return true;
    });
  }, [caseFilter, caseList]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Case Management</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Internal Workflow & Task Distribution</p>
        </div>
        <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 focus:outline-none transition-all duration-300 active:scale-95">
               <Filter size={14} /> All Departments
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all duration-300 shadow-xl shadow-blue-600/20 focus:outline-none">
               Batch Actions
            </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="bg-[#0f172a] border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-2xl">
         <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search case by ID, worker name, or location..." className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-xs text-white outline-none focus:border-blue-500/50" />
         </div>
         <div className="h-6 w-[1px] bg-white/5 hidden md:block" />
         <div className="flex items-center gap-3 bg-black/20 p-1 rounded-xl border border-white/5">
            {['ALL', 'PENDING', 'ACTIVE', 'RESOLVED'].map(s => (
              <button 
                key={s} 
                onClick={() => setCaseFilter(s as any)}
                className={`px-4 py-2 rounded-lg text-[9px] font-black transition-all duration-300 focus:outline-none ${
                  caseFilter === s 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-slate-500 hover:text-white transition-colors'
                }`}
              >
                {s}
              </button>
            ))}
         </div>
      </div>

      {/* Case Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {filteredCases.map((c, i) => (
          <div key={i} className="bg-[#0f172a] border border-white/5 rounded-[2rem] p-8 space-y-8 group hover:border-blue-500/30 transition-all shadow-2xl">
             <div className="flex justify-between items-start">
                <div className="space-y-1">
                   <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{c.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        c.priority === 'URGENT' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'
                      }`}>{c.priority}</span>
                   </div>
                   <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{c.title}</h3>
                </div>
                <button className="p-2 text-slate-600 hover:text-white transition-colors">
                   <MoreVertical size={20} />
                </button>
             </div>

             <div className="grid grid-cols-2 gap-8 pt-4 border-t border-white/5">
                <div className="space-y-2">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Assigned Specialist</p>
                   <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                      <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center text-[10px]">{c.worker.charAt(0)}</div>
                      {c.worker}
                   </div>
                </div>
                <div className="space-y-2">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Status / Duration</p>
                   <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                      <Clock size={16} className="text-blue-500" />
                      {c.time}
                   </div>
                </div>
             </div>

             <div className="flex items-center justify-between pt-4">
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                  c.status === 'COMPLETED' ? 'text-emerald-500' : 'text-amber-500'
                }`}>
                   <div className={`w-2 h-2 rounded-full animate-pulse ${
                     c.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500'
                   }`} />
                   {c.status.replace('_', ' ')}
                </div>
                 <button 
                   onClick={() => setEditingCase(c)}
                   className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest group-hover:gap-3 transition-all hover:text-blue-400 focus:outline-none active:scale-95"
                 >
                    Manage Case <ArrowRight size={14} />
                 </button>
              </div>
           </div>
         ))}
       </div>

      {/* Premium Case Override & Management Portal Modal */}
      {editingCase && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6 transition-all duration-300">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
            {/* Header Glowing Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600/0 via-blue-600 to-blue-600/0" />
            
            {/* Header */}
            <div>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{editingCase.id} • CORE OVERRIDE</span>
              <h2 className="text-2xl font-black text-white tracking-tighter mt-1">{editingCase.title}</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Operational Governance & Field Reassignment</p>
            </div>

            <div className="space-y-6">
              {/* Specialist Selector */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Assign Specialist Team</label>
                <div className="grid grid-cols-3 gap-2">
                  {specialists.map(sp => (
                    <button
                      key={sp}
                      onClick={() => setEditWorker(sp)}
                      className={`py-2 px-3 rounded-xl text-[10px] font-bold border transition-all duration-300 focus:outline-none ${
                        editWorker === sp
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-black/30 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {sp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Selector */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Criticality Index (Priority)</label>
                <div className="grid grid-cols-4 gap-2">
                  {priorities.map(pr => (
                    <button
                      key={pr}
                      onClick={() => setEditPriority(pr)}
                      className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition-all duration-300 focus:outline-none ${
                        editPriority === pr
                          ? pr === 'URGENT' ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-500/20' :
                            pr === 'HIGH' ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-500/20' :
                            'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-black/30 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {pr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Workflow Status Selector */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">System Integration Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {statuses.map(st => (
                    <button
                      key={st}
                      onClick={() => setEditStatus(st)}
                      className={`py-2.5 px-3 rounded-xl text-[10px] font-bold border transition-all duration-300 focus:outline-none ${
                        editStatus === st
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-black/30 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-white/5">
              <button
                onClick={() => setEditingCase(null)}
                className="flex-1 py-4 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white transition-all duration-300 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 focus:outline-none active:scale-95"
              >
                Cancel Override
              </button>
              <button
                onClick={handleSaveChanges}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 focus:outline-none active:scale-95"
              >
                Deploy Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseManagement;
