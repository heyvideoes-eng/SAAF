import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Activity, Layout, RefreshCcw, Database, 
  AlertTriangle, CheckCircle, ChevronRight, Zap, Globe, 
  BarChart3, Settings, Search, Lock, MapPin, CheckSquare, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useLiveData } from '../context/LiveDataContext';

interface AdminDashboardProps {
  initialTab?: 'overview' | 'audit' | 'users' | 'facilities';
  isEmbedded?: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = 'overview', isEmbedded = false }) => {
  const { hasPermission, token } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { globalStats, alerts, facilities } = useLiveData();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'users' | 'facilities'>(initialTab);
  const [data, setData] = useState<any>({ audit: [], users: [], facilities: [] });
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'STALE'>('ALL');

  const getApiUrl = () => {
    return API_URL;
  };

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (activeTab !== 'overview') fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const endpoints: any = {
        audit: '/api/admin/audit-logs',
        users: '/api/admin/users',
        facilities: '/api/facilities'
      };

      const res = await fetch(`${getApiUrl()}${endpoints[activeTab]}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      setData((prev: any) => ({ ...prev, [activeTab]: result }));
    } catch (err) {
      showToast('Telemetry Link Offline', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = React.useMemo(() => {
    const list = data[activeTab] || [];
    if (activeTab !== 'users') return list;
    if (statusFilter === 'ACTIVE') return list.filter((u: any) => u.is_active === 1);
    if (statusFilter === 'STALE') return list.filter((u: any) => u.is_active === 0);
    return list;
  }, [data, activeTab, statusFilter]);

  if (!hasPermission('SYSTEM', 'CONTROL')) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-8">
        <div className="bg-[#050505] border border-red-500/20 rounded-[3rem] p-16 text-center max-w-lg shadow-[0_0_100px_rgba(239,68,68,0.1)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500/0 via-red-500 to-red-500/0" />
          <Shield size={80} className="text-red-500 mx-auto mb-8 animate-pulse drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
          <h2 className="text-4xl font-black text-white tracking-tighter mb-4">RESTRICTED</h2>
          <p className="text-red-500/80 font-medium text-sm mb-12 uppercase tracking-[0.3em]">Command Center Authorization Required</p>
          <button onClick={() => navigate('/login')} className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95">
            Return to Gateway
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', icon: Layout, label: 'Command Center' },
    { id: 'facilities', icon: MapPin, label: 'Sector Grid' },
    { id: 'audit', icon: Database, label: 'Audit Matrix' },
    { id: 'users', icon: Users, label: 'Personnel' }
  ];

  if (isEmbedded) {
    return (
      <div className="space-y-12">
        {/* Embedded Header Controls */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">
              {activeTab === 'users' ? 'Staff Personnel Ledger' : 'Cryptographic Audit Registry'}
            </h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-2">
              {activeTab === 'users' ? 'Real-time Ward Assignment & Workforce Telemetry' : 'Secured System-wide Ledger of Administrative Actions'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
             <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
                {['ALL', 'ACTIVE', 'STALE'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => setStatusFilter(t as any)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all duration-300 focus:outline-none ${
                      statusFilter === t 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {t}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Dynamic Telemetry Table */}
        <div className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative min-h-[50vh]">
           {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-sm z-10">
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Decrypting Ledger</span>
                 </div>
              </div>
           ) : (
              <div className="p-10">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] bg-black/20">
                             {activeTab === 'users' && ['ID', 'Personnel Name', 'Assigned Role', 'System Clearance'].map(h => (
                                <th key={h} className="px-10 py-6">{h}</th>
                             ))}
                             {activeTab === 'audit' && ['Audit ID', 'Action Executed', 'Entity Target', 'Authorized Actor'].map(h => (
                                <th key={h} className="px-10 py-6">{h}</th>
                             ))}
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {filteredData?.length > 0 ? filteredData.map((row: any, i: number) => (
                             <tr key={i} className="group hover:bg-white/[0.01] transition-colors cursor-pointer">
                                <td className="px-10 py-8 font-bold text-blue-500">#{row.id || i+1}</td>
                                <td className="px-10 py-8 text-sm font-bold text-white tracking-tight">
                                  {activeTab === 'users' ? (row.name || 'Ram Kumar') : (`${row.event_type} [${row.module || 'SYSTEM'}]`)}
                                </td>
                                <td className="px-10 py-8">
                                   <span className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${
                                      (row.role_name || row.actor_role) === 'SuperAdmin' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                      (row.role_name || row.actor_role) === 'Supervisor' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                      'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                   }`}>
                                      {row.role_name || row.actor_role || 'Worker'}
                                   </span>
                                </td>
                                <td className="px-10 py-8 text-slate-400 font-medium text-xs">
                                   {activeTab === 'users' 
                                      ? `${row.ward_assignment || 'General Area'} (${row.username})`
                                      : `${row.actor_name || 'System'} @ ${row.timestamp}`}
                                </td>
                             </tr>
                          )) : (
                             <tr>
                                <td colSpan={4} className="py-24 text-center">
                                   <Database size={48} className="mx-auto text-slate-800 mb-4" />
                                   <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No records indexed</p>
                                </td>
                             </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
           )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans selection:bg-blue-500/30">
      
      {/* Premium Header */}
      <header className="flex justify-between items-center mb-10 p-6 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl sticky top-6 z-50 shadow-2xl">
         <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] relative">
               <Shield size={28} />
               <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            <div>
               <h1 className="text-2xl font-black tracking-tighter uppercase leading-none bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Admin Override</h1>
               <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em] mt-1">SAAF OS • Core Access</p>
            </div>
         </div>
         <div className="flex gap-4">
            <div className="hidden lg:flex p-2 bg-black/40 rounded-2xl border border-white/5">
              {tabs.map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-500 ${
                    activeTab === tab.id 
                      ? 'bg-white/10 text-white shadow-lg border border-white/10' 
                      : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                </button>
              ))}
            </div>
            <button className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
               <Settings size={20} className="text-slate-400" />
            </button>
         </div>
      </header>

      {/* Dynamic Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 space-y-6">
                  {/* Hero Metric */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-[#0a0a0a] border border-blue-500/20 rounded-[3rem] p-12 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full group-hover:bg-blue-500/20 transition-all duration-1000" />
                     <div className="relative z-10 flex justify-between items-end">
                        <div className="space-y-4">
                           <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400">
                              <Zap size={14} className="animate-pulse" />
                              <span className="text-[9px] font-black uppercase tracking-widest">System Online</span>
                           </div>
                           <h2 className="text-6xl font-black tracking-tighter">
                              {globalStats?.overall_cleanliness_index ? `${(globalStats.overall_cleanliness_index).toFixed(1)}%` : '98.4%'}
                           </h2>
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Global Cleanliness Index</p>
                        </div>
                        <div className="w-24 h-24 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center">
                           <Activity size={40} className="text-blue-400" />
                        </div>
                     </div>
                  </div>
                  
                  {/* Grid Metrics */}
                  <div className="grid grid-cols-2 gap-6">
                     <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-colors">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                           <CheckSquare size={24} className="text-emerald-500" />
                        </div>
                        <h3 className="text-3xl font-black tracking-tighter mb-2">
                           {globalStats?.total_facilities ? (globalStats.total_facilities * 8) : '1,204'}
                        </h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tasks Verified Today</p>
                     </div>
                     <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 hover:border-amber-500/30 transition-colors">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6">
                           <AlertTriangle size={24} className="text-amber-500" />
                        </div>
                        <h3 className="text-3xl font-black tracking-tighter mb-2">
                           {alerts.filter((a: any) => a.status === 'PENDING').length}
                        </h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pending Escalations</p>
                     </div>
                  </div>
               </div>

               {/* Right Column */}
               <div className="space-y-6">
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 h-full flex flex-col">
                     <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Live Activity Feed</h3>
                        <RefreshCcw size={16} className="text-slate-600" />
                     </div>
                     <div className="space-y-6 flex-1">
                        {alerts.slice(0, 4).map((alert: any, i: number) => {
                          const priorityColor = 
                            alert.priority === 'CRITICAL' || alert.priority === 'HIGH' ? 'red' : 
                            alert.priority === 'MEDIUM' ? 'amber' : 'blue';
                          
                          const timeStr = alert.created_at ? new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now';

                          return (
                            <div key={i} className="flex items-start gap-4">
                               <div className={`w-2 h-2 mt-1.5 rounded-full bg-${priorityColor}-500 shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
                               <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-200">{alert.task_type}: {alert.facility_name}</p>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider line-clamp-1">{alert.description || 'Inspection requested.'} • {timeStr}</p>
                               </div>
                            </div>
                          );
                        })}
                        {alerts.length === 0 && (
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest text-center py-8">No Active Alerts</p>
                        )}
                     </div>
                     <button className="w-full py-4 mt-6 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] transition-colors border border-white/5">
                        View Full Matrix
                     </button>
                  </div>
               </div>
            </div>
          )}

          {activeTab !== 'overview' && (
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] overflow-hidden min-h-[60vh] relative">
               {/* Search/Filter Bar */}
               <div className="p-6 border-b border-white/5 bg-white/5 flex gap-4">
                  <div className="flex-1 bg-black/50 border border-white/10 rounded-2xl flex items-center px-6 focus-within:border-blue-500 transition-colors">
                     <Search size={18} className="text-slate-500 mr-3" />
                     <input 
                       type="text" 
                       placeholder={`Search ${activeTab} registry...`}
                       className="w-full bg-transparent py-4 outline-none text-sm font-bold text-white placeholder:text-slate-600"
                     />
                  </div>
                  <button className="px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                     Query
                  </button>
               </div>

               {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-sm z-10">
                     <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Decrypting Ledger</span>
                     </div>
                  </div>
               ) : (
                  <div className="p-8">
                     <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="border-b border-white/10">
                                 {activeTab === 'users' && ['ID', 'Personnel', 'Role', 'Clearance'].map(h => (
                                    <th key={h} className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{h}</th>
                                 ))}
                                 {activeTab === 'audit' && ['Timestamp', 'Action', 'Entity', 'Actor'].map(h => (
                                    <th key={h} className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{h}</th>
                                 ))}
                                 {activeTab === 'facilities' && ['Node ID', 'Location', 'Status', 'Last Audit'].map(h => (
                                    <th key={h} className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{h}</th>
                                 ))}
                              </tr>
                           </thead>
                           <tbody>
                              {data[activeTab]?.length > 0 ? data[activeTab].map((row: any, i: number) => (
                                 <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                                    <td className="py-6 font-bold text-slate-300">#{row.id || i+1}</td>
                                    <td className="py-6 font-medium text-white">{row.name || row.action || 'Unknown'}</td>
                                    <td className="py-6 text-slate-400 text-sm">
                                       <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300">
                                          {row.role || row.table_name || row.status || 'Standard'}
                                       </span>
                                    </td>
                                    <td className="py-6 text-slate-500 font-medium">
                                       {row.created_at || 'Authorized'}
                                    </td>
                                 </tr>
                              )) : (
                                 <tr>
                                    <td colSpan={4} className="py-24 text-center">
                                       <Database size={48} className="mx-auto text-slate-800 mb-4" />
                                       <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No records indexed</p>
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  </div>
               )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
