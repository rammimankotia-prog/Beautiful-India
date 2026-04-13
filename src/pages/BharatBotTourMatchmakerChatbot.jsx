import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BharatBotTourMatchmakerChatbot = () => {
    const navigate = useNavigate();
    const [flowSteps, setFlowSteps] = useState([]);
    const [manualQs, setManualQs] = useState([]);
    const [messages, setMessages] = useState([]);
    const [step, setStep] = useState(1);
    const [capturedData, setCapturedData] = useState({});
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isBotTyping, isAnalyzing]);

    useEffect(() => {
        // Fetch Flow
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

        // Fetch Manual Q&A
        fetch(`${import.meta.env.BASE_URL}data/manual-qa.json`)
            .then(res => res.json())
            .then(data => setManualQs(data))
            .catch(() => {});
    }, []);

    const handleNextStep = (text, userChoice = null) => {
        const userInput = userChoice || text;
        if (!userInput) return;

        const currentStepConfig = flowSteps[step - 1];
        const newMessages = [...messages, { id: Date.now(), sender: 'user', text: userInput }];
        setMessages(newMessages);
        setIsBotTyping(true);

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
                handleViewRecommendations(newData);
                return;
            }

            if (currentStepConfig?.action === 'SAVE_LEAD') {
                handleSaveLead(newData);
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

    const handleViewRecommendations = async (finalData) => {
        // Intelligence Loop
        setTimeout(() => {
            navigate('/bharatbot/recommendations', { state: finalData || capturedData });
        }, 3500);
    };

    const handleSaveLead = async (data) => {
        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    id: `cb-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    source: 'BharatBot Dynamic',
                    status: 'New'
                })
            });
        } catch (err) {
            console.error("Lead saving error:", err);
        }
    };

    return (
        <div data-page="bharatbot_tour_matchmaker_chatbot" className="bg-[#fdfcfb] dark:bg-slate-950 min-h-screen">
            <div className="layout- flex h-full grow flex-col">
                <main className="flex-1 flex justify-center items-center py-6 px-4 md:py-12">
                    <div className="w-full max-w-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden border border-white/40 dark:border-slate-800/40 h-[750px] relative">
                        
                        {/* Premium Header */}
                        <div className="px-10 py-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50">
                            <div className="flex items-center gap-5">
                                <div className="relative">
                                    <div className="size-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 transition-transform hover:rotate-0">
                                        <span className="material-symbols-outlined text-3xl text-white">explore</span>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 size-4 bg-green-500 rounded-full border-4 border-white dark:border-slate-900"></div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none mb-1.5">Bharat Bot</h2>
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-0.5">
                                            {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-[10px] text-amber-400 fill-amber-400">star</span>)}
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialist Curator</span>
                                    </div>
                                </div>
                            </div>
                            <Link to="/tours" className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </Link>
                        </div>

                        {/* Progress Tracker */}
                        <div className="px-10 py-5 bg-slate-50/30 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                             <div className="flex gap-2">
                                {[...Array(Math.max(4, flowSteps.length))].map((_, i) => (
                                    <div key={i} className={`h-1 rounded-full transition-all duration-700 ${i < step ? 'w-8 bg-primary' : 'w-4 bg-slate-200 dark:bg-slate-800'}`}></div>
                                ))}
                             </div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Matching Module 1.0</span>
                        </div>

                        {/* Chat Canvas */}
                        <div className="flex-1 p-8 space-y-8 overflow-y-auto scroll-smooth custom-scrollbar">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                                    <div className={`size-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                                        msg.sender === 'bot' 
                                        ? 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-primary' 
                                        : 'bg-primary text-white'
                                    }`}>
                                        <span className="material-symbols-outlined text-xl">{msg.sender === 'bot' ? 'smart_toy' : 'person'}</span>
                                    </div>
                                    <div className={`flex flex-col gap-2 max-w-[80%]`}>
                                        <div className={`p-5 rounded-[24px] text-[15px] leading-relaxed shadow-sm transition-all hover:shadow-md ${
                                            msg.sender === 'bot' 
                                            ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700/50' 
                                            : 'bg-slate-900 border-none text-white rounded-tr-none font-medium'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isBotTyping && (
                                <div className="flex items-start gap-4 animate-in fade-in duration-300">
                                    <div className="size-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-xl text-primary animate-pulse">smart_toy</span>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-5 rounded-[24px] rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700/50 flex gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            )}

                            {isAnalyzing && (
                                <div className="flex flex-col items-center justify-center py-10 gap-6 animate-in zoom-in-95 duration-700">
                                    <div className="relative">
                                        <div className="size-24 rounded-full border-4 border-primary/10 border-t-primary animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-3xl text-primary animate-bounce">auto_awesome</span>
                                        </div>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Analyzing Expedition Catalog</h3>
                                        <p className="text-sm text-slate-400 font-bold italic">Cross-referencing {capturedData.userInterest || 'adventure'} archetypes with your preferences...</p>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Interactive Zone */}
                        <div className="p-8 border-t border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50">
                            {flowSteps.length > 0 && Math.min(step, flowSteps.length) === step && !isAnalyzing && (
                                <div className="space-y-4">
                                    {(!flowSteps[step-1].options || flowSteps[step-1].options.length === 0) ? (
                                        <div className="relative group">
                                            <input 
                                                autoFocus
                                                type={flowSteps[step-1].type || 'text'}
                                                className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-5 pr-16 text-sm font-bold shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                                placeholder={`Type your ${flowSteps[step-1].mappedField || 'answer'}...`}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.target.value) {
                                                        handleNextStep(e.target.value);
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                            <button className="absolute right-4 top-1/2 -translate-y-1/2 size-10 bg-primary text-white rounded-2xl flex items-center justify-center hover:scale-105 transition-transform">
                                                <span className="material-symbols-outlined">arrow_forward</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {flowSteps[step-1].options.map(choice => (
                                                <button 
                                                    key={choice}
                                                    onClick={() => handleNextStep('', choice)}
                                                    className="px-8 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black uppercase tracking-widest hover:border-primary hover:bg-primary/5 transition-all shadow-sm active:scale-95"
                                                >
                                                    {choice}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
            `}} />
        </div>
    );
};

export default BharatBotTourMatchmakerChatbot;
