import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const BharatBotChatPopup = ({ onClose }) => {
    const navigate = useNavigate();
    const [flowSteps, setFlowSteps] = useState([]);
    const [messages, setMessages] = useState([]);
    const [step, setStep] = useState(1);
    const [capturedData, setCapturedData] = useState({});
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isBotTyping, isAnalyzing]);

    useEffect(() => {
        // Fetch Flow from existing chatflow.json
        fetch(`${import.meta.env.BASE_URL}data/chatflow.json`)
            .then(res => res.json())
            .then(data => {
                setFlowSteps(data);
                if (data.length > 0) {
                    setIsBotTyping(true);
                    setTimeout(() => {
                        setIsBotTyping(false);
                        setMessages([{ id: 1, sender: 'bot', text: data[0].questionText }]);
                    }, 1200);
                }
            })
            .catch(err => console.error("Error fetching chatflow:", err));
    }, []);

    const handleNextStep = (text, userChoice = null) => {
        const userInput = userChoice || text;
        if (!userInput) return;

        const currentStepConfig = flowSteps[step - 1];
        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userInput }]);
        setIsBotTyping(true);
        setInputText('');

        setTimeout(() => {
            let newData = { ...capturedData };
            if (currentStepConfig?.mappedField) {
                newData[currentStepConfig.mappedField] = userInput;
            }
            setCapturedData(newData);

            // Check for triggered action
            if (currentStepConfig?.action === 'RECOMMEND_TOURS') {
                setIsBotTyping(false);
                setIsAnalyzing(true);
                setTimeout(() => {
                    navigate('/bharatbot/recommendations', { state: newData });
                    onClose();
                }, 2500);
                return;
            }

            if (currentStepConfig?.action === 'SAVE_LEAD') {
                saveLead(newData);
            }

            let nextStepNum = step + 1;
            if (nextStepNum <= flowSteps.length) {
                let botResponse = flowSteps[nextStepNum - 1].questionText;
                
                // Inject variables
                Object.keys(newData).forEach(key => {
                    botResponse = botResponse.replace(`{${key}}`, newData[key]);
                });
                
                setTimeout(() => {
                    setIsBotTyping(false);
                    setStep(nextStepNum);
                    setMessages(prev => [...prev, { id: Date.now() + 2, sender: 'bot', text: botResponse }]);
                }, 800);
            } else {
                setIsBotTyping(false);
            }
        }, 500);
    };

    const saveLead = async (data) => {
        try {
            const payload = {
                id: `BOT-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
                name: data.name || data.customerName || 'Chatbot User',
                phone: data.phone || data.mobileNumber || data.mobile || '',
                email: data.email || '',
                to: data.destination || data.to || data.travelDestination || 'General Inquiry',
                departureDate: data.travelDate || data.departureDate || '',
                travelers: data.travelers || data.groupSize || '',
                message: data.message || data.notes || '',
                source: 'Bharat Bot',          // ← Shows as "Chatbot" in admin
                createdAt: new Date().toISOString(),
                status: 'New',
                // Store the full chat data as extra context
                chatData: data
            };

            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (!result.success) {
                console.warn("Lead save warning:", result.message);
            }
        } catch (err) {
            console.error("Lead saving error:", err);
        }
    };

    return (
        <div className="fixed bottom-24 sm:bottom-28 right-4 sm:right-8 w-[calc(100%-2rem)] sm:w-[380px] h-[calc(100dvh-140px)] sm:h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 z-[99999] border border-slate-200">
            {/* Header: Based on reference image */}
            <div className="bg-[#0a6c75] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-white text-xl">navigation</span>
                    <h3 className="text-white font-bold text-sm tracking-wide">Trip Planner</h3>
                </div>
                <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-[#f8fafd] custom-scrollbar">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 sm:p-3.5 rounded-2xl text-[12px] sm:text-[13px] leading-relaxed shadow-sm ${
                            msg.sender === 'bot' 
                            ? 'bg-[#e5ecf3] text-slate-700 rounded-bl-none' 
                            : 'bg-[#0a6c75] text-white rounded-br-none'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                
                {isBotTyping && (
                    <div className="flex justify-start">
                        <div className="bg-[#e5ecf3] p-3 rounded-2xl rounded-bl-none flex gap-1">
                            <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                            <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        </div>
                    </div>
                )}

                {isAnalyzing && (
                    <div className="flex flex-col items-center justify-center py-6 gap-3">
                        <div className="size-8 border-3 border-[#0a6c75]/20 border-t-[#0a6c75] rounded-full animate-spin"></div>
                        <p className="text-[11px] font-black text-[#0a6c75] uppercase tracking-widest text-center">Finding your perfect match...</p>
                    </div>
                )}

                {/* Choice Chips: Based on reference image */}
                {!isBotTyping && !isAnalyzing && flowSteps[step-1]?.options?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {flowSteps[step-1].options.map(choice => (
                            <button 
                                key={choice}
                                onClick={() => handleNextStep('', choice)}
                                className="px-4 py-2 rounded-full border border-[#0a6c75] text-[#0a6c75] text-[12px] font-bold hover:bg-[#0a6c75] hover:text-white transition-all bg-white shadow-sm"
                            >
                                {choice}
                            </button>
                        ))}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Footer: Based on reference image */}
            <div className="p-3 sm:p-4 bg-slate-100 border-t border-slate-200">
                <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-slate-200">
                    <input 
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Select or type your destination..."
                        className="flex-1 bg-transparent border-none outline-none px-2 sm:px-3 text-[12px] sm:text-[13px] text-slate-600 placeholder:text-slate-400"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && inputText) handleNextStep(inputText);
                        }}
                    />
                    <button 
                        onClick={() => inputText && handleNextStep(inputText)}
                        className="bg-[#3b82f6] text-white px-3 sm:px-5 py-2 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors"
                    >
                        SEND
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            `}} />
        </div>
    );
};

export default BharatBotChatPopup;
