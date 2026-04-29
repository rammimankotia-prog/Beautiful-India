import React, { useState, useEffect, useRef } from 'react';
import settingsData from '../data/settings.json';

const TripPlannerWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [settings, setSettings] = useState(settingsData);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: `Namaste, Welcome to The Beautiful India - Bharat Darshan. My name is ${settingsData.botName || 'Maayra'}. Where do you want to travel?` }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [step, setStep] = useState(0);
    const messagesEndRef = useRef(null);

    // Form data collected during chat
    const [formData, setFormData] = useState({
        destination: '',
        date: '',
        duration: '',
        email: '',
        phone: '',
        name: ''
    });

    const placeholders = [
        "Type your destination...",
        "e.g. 24 March",
        "e.g. 4 days",
        "Your email address...",
        "Your phone number...",
        "Your full name..."
    ];

    useEffect(() => {
        // Try to fetch latest settings from API
        fetch(`${import.meta.env.BASE_URL}api-save-settings.php`)
            .then(res => res.json())
            .then(data => {
                if (data && data.whatsapp) setSettings(data);
            })
            .catch(() => {});
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userText = inputValue;
        const newMessages = [...messages, { sender: 'user', text: userText }];
        setMessages(newMessages);
        setInputValue('');

        let updatedData = { ...formData };
        let nextMessages = [];

        // Logic based on current step
        if (step === 0) {
            updatedData.destination = userText;
            nextMessages.push({ sender: 'bot', text: 'When are you planning to travel?' });
            setStep(1);
        } else if (step === 1) {
            updatedData.date = userText;
            nextMessages.push({ sender: 'bot', text: 'For how many days will your trip be?' });
            setStep(2);
        } else if (step === 2) {
            updatedData.duration = userText;
            nextMessages.push({ sender: 'bot', text: 'Noted!' });
            nextMessages.push({ sender: 'bot', text: `Our travel expert will need your contact details to guide you on planning your trip. You can also reach us directly at ${settings.whatsapp}` });
            nextMessages.push({ sender: 'bot', text: 'Please share your Email ID' });
            setStep(3);
        } else if (step === 3) {
            updatedData.email = userText;
            nextMessages.push({ sender: 'bot', text: 'Please share your Phone Number' });
            setStep(4);
        } else if (step === 4) {
            updatedData.phone = userText;
            nextMessages.push({ sender: 'bot', text: 'Lastly, what is your Name?' });
            setStep(5);
        } else if (step === 5) {
            updatedData.name = userText;
            nextMessages.push({ sender: 'bot', text: 'Thank you! We have received your query and will contact you shortly.' });
            setStep(6);
            
            // Post to backend
            try {
                await fetch('/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: `WIDGET-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
                        name: updatedData.name,
                        to: updatedData.destination,
                        departureDate: updatedData.date,
                        duration: updatedData.duration,
                        email: updatedData.email,
                        phone: updatedData.phone,
                        source: 'Home Page Widget',   // ← Source: Home Page
                        createdAt: new Date().toISOString(),
                        status: 'New'
                    })
                });
            } catch (err) {
                console.error("Lead submission error:", err);
            }
        }
        
        setFormData(updatedData);

        if (nextMessages.length > 0) {
            // Simulate typing delay
            setTimeout(() => {
                setMessages(prev => [...prev, ...nextMessages]);
            }, 800);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 font-sans">
            {/* Chatbot Toggle Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-2xl flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:scale-105 transition-all p-3 border border-white/20 backdrop-blur-sm"
                >
                    <span className="material-symbols-outlined text-white text-3xl">chat_bubble</span>
                    <span className="absolute -top-1 -right-1 size-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                </button>
            )}

            {/* Chatbot Window */}
            {isOpen && (
                <div className="w-[calc(100vw-32px)] sm:w-[380px] h-[550px] bg-white dark:bg-slate-900 rounded-[30px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden border border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom-10 duration-500">
                    {/* Header */}
                    <div className="bg-primary text-white p-6 flex items-center justify-between shadow-lg z-10">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md">
                                <span className="material-symbols-outlined text-xl">smart_toy</span>
                            </div>
                            <div>
                                <span className="block font-black tracking-tight text-[16px] leading-tight">{settings.botName}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Always Online</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform duration-300">
                            <span className="material-symbols-outlined text-[24px]">close</span>
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col gap-4 scroll-smooth custom-scrollbar">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div 
                                    className={`
                                        max-w-[85%] px-5 py-3 rounded-[22px] text-[14px] leading-relaxed relative shadow-sm
                                        ${msg.sender === 'user' 
                                            ? 'bg-primary text-white rounded-tr-sm' 
                                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm border border-slate-100 dark:border-slate-700'
                                        }
                                    `}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    {step < 6 && (
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <input 
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => { if(e.key === 'Enter') handleSend() }}
                                    placeholder={placeholders[step] || "Type your answer..."}
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-[14px] px-2 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 font-medium"
                                />
                                <button 
                                    onClick={handleSend}
                                    className="size-10 bg-primary text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-all shadow-md active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-xl">send</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
            `}} />
        </div>
    );
};

export default TripPlannerWidget;
