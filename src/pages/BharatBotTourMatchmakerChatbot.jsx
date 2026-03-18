import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BharatBotTourMatchmakerChatbot = () => {
    const navigate = useNavigate();
    const [flowSteps, setFlowSteps] = useState([]);
    const [manualQs, setManualQs] = useState([]);
    const [messages, setMessages] = useState([]);
    const [step, setStep] = useState(1);
    const [capturedData, setCapturedData] = useState({});
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [typingText, setTypingText] = useState('');

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
                    }, 1500);
                }
            })
            .catch(err => console.error("Error fetching chatflow:", err));

        // Fetch Manual Q&A
        fetch(`${import.meta.env.BASE_URL}data/manual-qa.json`)
            .then(res => res.json())
            .then(data => setManualQs(data))
            .catch(() => {});
    }, []);

    const validateInput = (config, val) => {
        if (config.required && !val) return "This field is required.";
        if (config.type === 'email' && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val)) return "Please enter a valid email address.";
        if (config.type === 'phone' && !/^\d{10,}$/.test(val.replace(/\D/g,''))) return "Please enter a valid phone number.";
        if (config.type === 'date') {
            const date = new Date(val);
            if (isNaN(date.getTime())) return "Please enter a valid date.";
            if (date < new Date().setHours(0,0,0,0)) return "Date cannot be in the past.";
        }
        return null;
    };

    const handleNextStep = (text, userChoice = null) => {
        const userInput = userChoice || text;
        const currentStepConfig = flowSteps[step - 1];

        const error = validateInput(currentStepConfig || {}, userInput);
        if (error) {
            alert(error);
            return;
        }

        const newMessages = [...messages, { id: Date.now(), sender: 'user', text: userInput }];
        setMessages(newMessages);
        setIsBotTyping(true);

        // Check if it's a manual Q&A match first (simple lexical match for now)
        const manualMatch = manualQs.find(mq => mq.question.toLowerCase().includes(userInput.toLowerCase()) || userInput.toLowerCase().includes(mq.question.toLowerCase()));
        
        if (manualMatch) {
            setTimeout(() => {
                setIsBotTyping(false);
                setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: manualMatch.answer }]);
            }, 1500);
            return;
        }

        setTimeout(() => {
            const currentStepConfig = flowSteps[step - 1];
            let newData = { ...capturedData };
            
            if (currentStepConfig?.mappedField) {
                newData[currentStepConfig.mappedField] = userInput;
            }
            setCapturedData(newData);

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
                 }, 1000);
            } else {
                setIsBotTyping(false);
            }
        }, 500);
    };

    const handleViewRecommendations = async () => {
        // Submit Lead to Backend
        try {
            // Mocked for static site
            console.log('Lead submitted (mock):', {
                ...capturedData,
                source: 'Bharat Bot',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error submitting lead:", error);
        }

        // Navigate with state
        navigate('/bharatbot/recommendations', { state: capturedData });
    };

    return (
        <div data-page="bharatbot_tour_matchmaker_chatbot">
            <div className="layout- flex h-full grow flex-col">
                <main className="flex-1 flex justify-center py-10 px-4 bg-sand-50 dark:bg-slate-900/50">
                    <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-primary/10 h-[700px]">
                        {/* Chat Header */}
                        <div className="bg-primary px-8 py-6 flex items-center justify-between text-white">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                                    <span className="material-symbols-outlined text-3xl">smart_toy</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold tracking-tight">Bharat Bot</h2>
                                    <p className="text-white/80 text-[10px] flex items-center gap-1 uppercase font-black tracking-widest">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse"></span> Online
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="px-8 py-4 border-b border-slate-50 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-1.5">
                                <p className="text-primary font-black text-[10px] uppercase tracking-widest">Matching Progress</p>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Step {step} of {Math.max(4, flowSteps.length)}</p>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-primary h-full transition-all duration-700 ease-out" style={{ width: `${(step/Math.max(4, flowSteps.length))*100}%` }}></div>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-50/30 dark:bg-slate-900/30">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'bot' ? 'bg-primary/10 text-primary' : 'bg-sunset/10 text-sunset'}`}>
                                        <span className="material-symbols-outlined text-sm">{msg.sender === 'bot' ? 'smart_toy' : 'person'}</span>
                                    </div>
                                    <div className={`flex flex-col gap-1 max-w-[80%]`}>
                                        <span className={`text-[9px] font-black text-slate-400 uppercase tracking-widest ${msg.sender === 'user' ? 'text-right' : 'ml-1'}`}>
                                            {msg.sender === 'bot' ? 'Bharat Bot' : 'You'}
                                        </span>
                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm border border-primary/5 ${
                                            msg.sender === 'bot' 
                                            ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none' 
                                            : 'bg-primary text-white rounded-br-none font-medium'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isBotTyping && (
                                <div className="flex items-end gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-sm animate-bounce">smart_toy</span>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none shadow-sm border border-primary/5 flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            )}

                            {/* Dynamic Options Area */}
                            {flowSteps.length > 0 && Math.min(step, flowSteps.length) === step && (!flowSteps[step-1].options || flowSteps[step-1].options.length === 0) && (
                                <div className="ml-11 flex flex-col gap-3">
                                    <input 
                                        type={flowSteps[step-1].type || 'text'}
                                        className="bg-white dark:bg-slate-800 border-2 border-primary/10 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary shadow-sm"
                                        placeholder={`Enter your ${flowSteps[step-1].mappedField || 'answer'}...`}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && e.target.value) {
                                                handleNextStep(e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                    />
                                    <p className="text-[10px] text-slate-400 italic">Press Enter to continue</p>
                                </div>
                            )}

                            {flowSteps.length > 0 && step < flowSteps.length && flowSteps[step-1].options.length > 0 && (
                                <div className="flex flex-wrap gap-3 ml-11">
                                    {flowSteps[step-1].options.map(choice => (
                                        <button 
                                            key={choice}
                                            onClick={() => handleNextStep('', choice)}
                                            className="px-6 py-2.5 rounded-full bg-white dark:bg-slate-800 border-2 border-primary/20 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                                        >
                                            {choice}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {flowSteps.length > 0 && step === flowSteps.length && flowSteps[step-1].options.length > 0 && (
                                <div className="ml-11">
                                    <button 
                                        onClick={handleViewRecommendations}
                                        className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity shadow-lg"
                                    >
                                        {flowSteps[step-1].options[0]} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Chat Footer */}
                        <div className="p-6 border-t border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl">
                                <input 
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400 font-medium" 
                                    placeholder="Type a message..." 
                                    type="text"
                                    disabled={step > 0}
                                />
                                <button disabled={step > 0} className="bg-primary text-white size-10 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50">
                                    <span className="material-symbols-outlined text-xl">send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default BharatBotTourMatchmakerChatbot;
