import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BharatBotChatPopup from './BharatBotChatPopup';

const BharatBotFloatingButton = () => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [hasAutoOpened, setHasAutoOpened] = useState(false);

    useEffect(() => {
        // Targeted visibility per user request
        const targetRoutes = ['/tours', '/tour/', '/pilgrimage-tours', '/bike-tours', '/guides'];
        const shouldShow = targetRoutes.some(route => location.pathname.startsWith(route));
        setIsVisible(shouldShow);

        // Reset auto-open state on route change if needed, 
        // but typically we only want to auto-open once per session or per fresh land.
    }, [location.pathname]);

    useEffect(() => {
        // 10 Second Auto-Trigger Logic
        if (isVisible && !isOpen && !hasAutoOpened) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                setHasAutoOpened(true);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, isOpen, hasAutoOpened]);

    if (!isVisible) return null;

    return (
        <>
            {isOpen && (
                <BharatBotChatPopup 
                    onClose={() => {
                        setIsOpen(false);
                        // Prevent re-opening automatically if user closes it
                        setHasAutoOpened(true);
                    }} 
                />
            )}
            
            <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end gap-3 group/main">
                {/* WhatsApp Button */}
                {!isOpen && (
                    <div className="flex flex-col items-end gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                         {/* Tooltip */}
                        <div className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl opacity-0 hover:opacity-100 transition-all duration-300 shadow-xl border border-white/10 whitespace-nowrap group/wa">
                            WhatsApp Expert
                        </div>
                        <a 
                            href="https://wa.me/916005159433"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="size-14 md:size-16 bg-[#25D366] hover:bg-[#128C7E] rounded-[20px] shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group/wa border-4 border-white dark:border-slate-900"
                        >
                            <svg viewBox="0 0 24 24" className="size-8 text-white fill-current">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.433 5.632 1.434h.005c6.551 0 11.89-5.335 11.893-11.892a11.826 11.826 0 00-3.484-8.413z" />
                            </svg>
                        </a>
                    </div>
                )}

                {/* Tooltip Bot */}
                {!isOpen && (
                    <div className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl opacity-0 group-hover/main:opacity-100 transition-all duration-300 translate-y-2 group-hover/main:translate-y-0 shadow-xl border border-white/10 whitespace-nowrap">
                        Plan Your Trip with AI
                    </div>
                )}
                
                <button 
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (!isOpen) setHasAutoOpened(true);
                    }}
                    className={`relative size-16 md:size-20 bg-[#0a6c75] hover:bg-[#085a62] rounded-[24px] shadow-[0_20px_40px_-10px_rgba(10,108,117,0.4)] flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 group overflow-hidden border-4 border-white dark:border-slate-900 ${isOpen ? 'rotate-90' : ''}`}
                >
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
                    
                    {/* Robot Icon */}
                    <div className="relative transform transition-transform duration-500">
                        <span className="material-symbols-outlined text-white text-3xl md:text-4xl leading-none">
                            {isOpen ? 'close' : 'smart_toy'}
                        </span>
                    </div>
                </button>
            </div>
        </>
    );
};

export default BharatBotFloatingButton;
