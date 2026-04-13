import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BharatBotFloatingButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Only show on tour-related pages
  const isTourPage = location.pathname.startsWith('/tour') || location.pathname.startsWith('/tours');
  const isChatPage = location.pathname.startsWith('/bharatbot');

  useEffect(() => {
    if (isTourPage && !isChatPage) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [location.pathname, isTourPage, isChatPage]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[9999] animate-in slide-in-from-right-10 duration-700">
      <div className="relative group">
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-xl shadow-2xl whitespace-nowrap border border-slate-800">
            Chat with Bharat Bot 🤖
            <div className="absolute top-full right-6 w-2 h-2 bg-slate-900 rotate-45 -mt-1 border-r border-b border-slate-800"></div>
          </div>
        </div>

        {/* Pulsing Aura */}
        <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity"></div>

        {/* Main Button */}
        <button
          onClick={() => navigate('/bharatbot')}
          className="relative size-16 bg-primary hover:bg-primary/90 text-white rounded-full shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.5)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        >
          <span className="material-symbols-outlined text-3xl transition-transform group-hover:rotate-12">smart_toy</span>
          
          {/* Notification Dot */}
          <div className="absolute top-0 right-0 size-4 bg-rose-500 rounded-full border-4 border-slate-50 dark:border-slate-950"></div>
        </button>
      </div>
    </div>
  );
};

export default BharatBotFloatingButton;
