import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLiveData } from '../../context/LiveDataContext';

const Navbar: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [isHighContrast, setIsHighContrast] = useState(false);
  const { user } = useAuth();
  const { govtMode, setGovtMode } = useLiveData();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleContrast = () => {
    const newVal = !isHighContrast;
    setIsHighContrast(newVal);
    if (newVal) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-atmosBg/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-atmosAccent font-bold text-2xl tracking-tighter">SANiTRAX</span>
          <span className="text-[10px] bg-atmosAccent/20 text-atmosAccent px-1.5 py-0.5 rounded font-mono font-bold tracking-widest">GOVT</span>
        </Link>
        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
          <span className="text-[8px] font-bold uppercase tracking-widest">Citizen</span>
          <button 
            onClick={() => {
              setGovtMode(!govtMode);
              navigate(govtMode ? '/' : '/admin');
            }}
            className="w-8 h-4 bg-white/10 rounded-full relative p-0.5"
          >
            <motion.div 
              animate={{ x: govtMode ? 16 : 0 }}
              className="w-3 h-3 rounded-full bg-atmosAccent"
            />
          </button>
          <span className="text-[8px] font-bold uppercase tracking-widest">Govt Mode</span>
        </div>

        <div className="hidden md:flex items-center gap-6 border-l border-white/10 pl-8">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 text-atmosSuccess">
            <motion.div 
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-current"
            />
            <span>Data Live: {time.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden xl:flex items-center gap-6 mr-6 border-r border-white/10 pr-8">
           <Link to="/" className="text-[10px] text-atmosTextMuted font-bold uppercase tracking-widest hover:text-atmosAccent transition-colors">Pulse</Link>
           <Link to="/welfare" className="text-[10px] text-atmosTextMuted font-bold uppercase tracking-widest hover:text-atmosAccent transition-colors">Welfare</Link>
           <Link to="/admin" className="text-[10px] text-atmosTextMuted font-bold uppercase tracking-widest hover:text-atmosAccent transition-colors">Admin</Link>
           <Link to="/inspector" className="text-[10px] text-atmosTextMuted font-bold uppercase tracking-widest hover:text-atmosAccent transition-colors">Audit</Link>
        </div>

        <button 
          onClick={toggleContrast}
          className="p-2 rounded-full border border-white/10 text-atmosTextMuted hover:text-atmosText transition-all"
        >
          <Globe size={16} />
        </button>

        <div className="flex items-center gap-3 bg-atmosBgAlt border border-white/5 rounded-full pl-4 pr-1 py-1 cursor-pointer" onClick={() => navigate('/login')}>
           <div className="flex flex-col items-end pr-2">
              <span className="text-[10px] text-atmosText font-bold uppercase leading-none mb-1">{user?.name || 'Guest'}</span>
              <span className="text-[8px] text-atmosAccent font-bold uppercase tracking-widest leading-none">{user?.role || 'admin'}</span>
           </div>
           <div className="p-2 bg-atmosAccent/10 text-atmosAccent rounded-full">
             <Activity size={16} />
           </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
