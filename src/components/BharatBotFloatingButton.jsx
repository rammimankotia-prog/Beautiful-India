import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BharatBotFloatingButton = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show on tour related routes
        const tourRoutes = ['/tours', '/tour/', '/tours/detail', '/tours/bike-tours', '/pilgrimage-tours'];
        const shouldShow = tourRoutes.some(route => location.pathname.startsWith(route)) || location.pathname === '/';
        setIsVisible(shouldShow);
    }, [location.pathname]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end gap-3 group">
            {/* Tooltip */}
            <div className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-xl border border-white/10 whitespace-nowrap">
                Plan Your Trip with AI
            </div>
            
            <button 
                onClick={() => navigate('/bharatbot')}
                className="relative size-16 md:size-20 bg-primary hover:bg-[#085a62] rounded-[24px] shadow-[0_20px_40px_-10px_rgba(10,108,117,0.4)] flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 group overflow-hidden border-4 border-white dark:border-slate-900"
            >
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
                
                {/* Pulse Effect */}
                <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20 group-hover:block hidden"></div>
                
                {/* Robot Icon */}
                <div className="relative transform group-hover:rotate-12 transition-transform duration-500">
                    <span className="material-symbols-outlined text-white text-3xl md:text-4xl leading-none">smart_toy</span>
                </div>
                
                {/* Tiny Badge */}
                <div className="absolute top-2 right-2 size-3 bg-red-500 rounded-full border-2 border-primary animate-bounce"></div>
            </button>
            
            {/* Decorative Sparkles */}
            <div className="absolute -top-4 -left-4 pointer-events-none">
                 <span className="material-symbols-outlined text-amber-400 text-lg animate-pulse">sparkles</span>
            </div>
        </div>
    );
};

export default BharatBotFloatingButton;
