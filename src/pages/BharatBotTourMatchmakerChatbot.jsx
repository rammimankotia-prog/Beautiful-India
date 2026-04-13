import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BharatBotTourMatchmakerChatbot = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [step, setStep] = useState(1);
    const [capturedData, setCapturedData] = useState({
        name: '',
        category: '',
        destination: '',
        email: '',
        phone: '',
        requestedTourId: '',
        requestedTourName: '',
    });
    const [recommendedTours, setRecommendedTours] = useState([]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isBotTyping, isAnalyzing, recommendedTours]);

    // Initial Greeting
    useEffect(() => {
        setIsBotTyping(true);
        setTimeout(() => {
            setIsBotTyping(false);
            setMessages([{ 
                id: 1, 
                sender: 'bot', 
                text: "Namaste! Welcome to Bhakti Ki Shakti. 🙏 Where are you dreaming of going...?" 
            }]);
        }, 1200);
    }, []);

    const saveLead = async (dataToSave) => {
        try {
            await axios.post(`${import.meta.env.BASE_URL}api/v1/chatbot/lead`, {
                name: dataToSave.name,
                email: dataToSave.email,
                phone: dataToSave.phone,
                requestedTourId: dataToSave.requestedTourId,
                requestedTourName: dataToSave.requestedTourName,
                // store all chat history except recommendations list
                conversationHistory: messages.map(m => ({ 
                    role: m.sender, 
                    content: m.text 
                }))
            });
        } catch (error) {
            console.error("Failed to capture lead", error);
        }
    };

    const fetchRecommendations = async (queryText) => {
        setIsAnalyzing(true);
        try {
            const res = await axios.post(`${import.meta.env.BASE_URL}api/v1/chatbot/recommend`, { text: queryText });
            const tours = res.data;
            setTimeout(() => {
                setIsAnalyzing(false);
                setRecommendedTours(tours);
                if (tours.length > 0) {
                     setMessages(prev => [...prev, { 
                        id: Date.now() + 2, 
                        sender: 'bot', 
                        text: "I've found some brilliant options! Which of these catches your eye?" 
                     }]);
                } else {
                     setMessages(prev => [...prev, { 
                        id: Date.now() + 2, 
                        sender: 'bot', 
                        text: "I don't have exactly that right now, but our experts can customize it! Would you like me to send you details?" 
                     }]);
                }
                setStep(4);
            }, 3000); // simulate thinking
        } catch (error) {
            setIsAnalyzing(false);
            console.error(error);
            setStep(4);
        }
    };

    const handleNextStep = (text, userChoice = null, tourChoice = null) => {
        const userInput = userChoice || text;
        if (!userInput && !tourChoice) return;

        const newMessages = [...messages, { 
            id: Date.now(), 
            sender: 'user', 
            text: tourChoice ? `I like: ${tourChoice.title}` : userInput 
        }];
        setMessages(newMessages);
        
        let newData = { ...capturedData };

        if (step === 1) {
            // Received Destination Intent, ask Name
            setIsBotTyping(true);
            newData.destination = userInput;
            setCapturedData(newData);
            setTimeout(() => {
                setIsBotTyping(false);
                setMessages(prev => [...prev, { 
                    id: Date.now() + 1, 
                    sender: 'bot', 
                    text: "Excellent choice! Before I pull up the best itineraries, who do I have the pleasure of chatting with?" 
                }]);
                setStep(2);
            }, 800);
        } 
        else if (step === 2) {
            // Received Name, ask Preference
            setIsBotTyping(true);
            newData.name = userInput;
            setCapturedData(newData);
            setTimeout(() => {
                setIsBotTyping(false);
                setMessages(prev => [...prev, { 
                    id: Date.now() + 1, 
                    sender: 'bot', 
                    text: `Nice to meet you, ${userInput}! Are you looking for a Spiritual Pilgrimage, a Motorcycle Expedition, or a Leisure Holiday?` 
                }]);
                setStep(3);
            }, 800);
        }
        else if (step === 3) {
             // Received Category, Fetch Recommendations
             newData.category = userInput;
             setCapturedData(newData);
             const queryCombo = `${newData.destination} ${newData.category}`;
             fetchRecommendations(queryCombo);
        }
        else if (step === 4) {
             // Received Selected Tour
             setIsBotTyping(true);
             if (tourChoice) {
                 newData.requestedTourId = tourChoice._id;
                 newData.requestedTourName = tourChoice.title;
             }
             setCapturedData(newData);
             setTimeout(() => {
                setIsBotTyping(false);
                setMessages(prev => [...prev, { 
                    id: Date.now() + 1, 
                    sender: 'bot', 
                    text: "Great choice! Our full itinerary has day-by-day details and pricing. Where should I send the complete PDF? Please enter your Email ID or WhatsApp Number." 
                }]);
                setStep(5);
             }, 800);
        }
        else if (step === 5) {
             // Received Contact Info, Save Lead
             setIsBotTyping(true);
             if (userInput.includes('@')) {
                 newData.email = userInput;
             } else {
                 newData.phone = userInput;
             }
             setCapturedData(newData);
             
             saveLead(newData).then(() => {
                 setTimeout(() => {
                    setIsBotTyping(false);
                    setMessages(prev => [...prev, { 
                        id: Date.now() + 1, 
                        sender: 'bot', 
                        text: "Got it! Thank you 🙏. Our travel expert will send the details and reach out shortly. Have a great day!" 
                    }]);
                    setStep(6);
                 }, 800);
             });
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
                                {[1, 2, 3, 4, 5, 6].map((st) => (
                                    <div key={st} className={`h-1 rounded-full transition-all duration-700 ${st <= step ? 'w-8 bg-primary' : 'w-4 bg-slate-200 dark:bg-slate-800'}`}></div>
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
                                        <p className="text-sm text-slate-400 font-bold italic">Cross-referencing parameters with our travel index...</p>
                                    </div>
                                </div>
                            )}

                            {/* Render Recommended Tours */}
                            {!isAnalyzing && step === 4 && recommendedTours.length > 0 && (
                                <div className="flex flex-col gap-3 py-4 animate-in slide-in-from-bottom-5">
                                    {recommendedTours.map((tour) => (
                                        <button 
                                            key={tour._id}
                                            onClick={() => handleNextStep('', null, tour)}
                                            className="text-left bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-5 rounded-[24px] hover:border-primary hover:bg-primary/5 transition-all group flex items-center justify-between"
                                        >
                                            <div className="pr-4">
                                                <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">{tour.title}</h4>
                                                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{tour.chatbotTeaser}</p>
                                            </div>
                                            <div className="size-10 shrink-0 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center group-hover:bg-primary transition-colors">
                                                <span className="material-symbols-outlined text-slate-400 group-hover:text-white transition-colors">arrow_forward</span>
                                            </div>
                                        </button>
                                    ))}
                                    <button 
                                        onClick={() => handleNextStep('None of these', null, { _id: 'custom', title: 'I want a Custom Package' })}
                                        className="text-center mt-2 text-sm font-bold text-primary hover:underline"
                                    >
                                        None of these, I want a Custom Route
                                    </button>
                                </div>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Interactive Zone */}
                        <div className="p-8 border-t border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50">
                            {!isAnalyzing && step !== 6 && (
                                <div className="space-y-4">
                                    {step === 3 ? (
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {['Spiritual Pilgrimage', 'Motorcycle Expedition', 'Leisure & Heritage', 'Wildlife'].map(choice => (
                                                <button 
                                                    key={choice}
                                                    onClick={() => handleNextStep('', choice)}
                                                    className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black uppercase tracking-widest hover:border-primary hover:bg-primary/5 transition-all shadow-sm active:scale-95"
                                                >
                                                    {choice}
                                                </button>
                                            ))}
                                        </div>
                                    ) : step !== 4 && (
                                        <div className="relative group">
                                            <input 
                                                autoFocus
                                                type={step === 5 ? "text" : "text"}
                                                className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-5 pr-16 text-sm font-bold shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none text-slate-900 dark:text-white"
                                                placeholder={step === 5 ? "Enter Email or Phone..." : "Type your answer..."}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.target.value) {
                                                        handleNextStep(e.target.value);
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                            <button 
                                               onClick={(e) => {
                                                  const input = e.currentTarget.previousElementSibling;
                                                  if(input.value) {
                                                      handleNextStep(input.value);
                                                      input.value = '';
                                                  }
                                               }}
                                               className="absolute right-4 top-1/2 -translate-y-1/2 size-10 bg-primary text-white rounded-2xl flex items-center justify-center hover:scale-105 transition-transform">
                                                <span className="material-symbols-outlined">send</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                            {step === 6 && (
                                <div className="text-center py-4 text-sm font-bold text-slate-400">
                                    Conversation Finished. <a href="/tours" className="text-primary hover:underline ml-2">Browse All Tours</a>
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
