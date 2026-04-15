import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BharatBotChatPopup from './BharatBotChatPopup';

const BharatBotFloatingButton = () => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [hasAutoOpened, setHasAutoOpened] = useState(false);

    useEffect(() => {
        // Targeted visibility for the Chatbot only
        const targetRoutes = ['/tours', '/tour/', '/pilgrimage-tours', '/bike-tours', '/guides'];
        let shouldShow = targetRoutes.some(route => location.pathname.startsWith(route));
        
        // Check global settings for chatbot toggle
        fetch(`${import.meta.env.BASE_URL}data/settings.json?t=${Date.now()}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.chatbotEnabled === false) {
                    shouldShow = false;
                }
                setIsVisible(shouldShow);
            })
            .catch(() => {
                // If no settings found, default to visible for target routes
                setIsVisible(shouldShow);
            });
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
                        setHasAutoOpened(true);
                    }} 
                />
            )}
            
            {/* The bot button is now positioned slightly higher to stack above the global WhatsApp button */}
            <div className="fixed bottom-[104px] md:bottom-32 right-8 z-[9999] flex flex-col items-end gap-3 group">
                {/* Tooltip */}
                {!isOpen && (
                    <div className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-xl border border-white/10 whitespace-nowrap">
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
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
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
