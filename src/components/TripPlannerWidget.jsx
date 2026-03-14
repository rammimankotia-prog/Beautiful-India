import React, { useState, useEffect, useRef } from 'react';

const TripPlannerWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Welcome to the Trip Planner! Where do you want to travel?' }
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
            nextMessages.push({ sender: 'bot', text: 'Our travel expert will need your contact details to guide you on planning your trip' });
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
            // Mock submission for static site
            console.log("Trip Planner Lead submitted (mocked):", {
                name: updatedData.name,
                to: updatedData.destination,
                departureDate: updatedData.date,
                duration: updatedData.duration,
                email: updatedData.email,
                phone: updatedData.phone,
                status: 'New',
                chatLog: [...newMessages, { sender: 'bot', text: 'Thank you! We have received your query and will contact you shortly.' }]
            });
        }
        
        setFormData(updatedData);

        if (nextMessages.length > 0) {
            // Simulate typing delay
            setTimeout(() => {
                setMessages(prev => [...prev, ...nextMessages]);
            }, 500);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Chatbot Toggle Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-[#0a6c75] rounded-full flex items-center justify-center shadow-2xl hover:bg-[#07565e] transition-transform hover:scale-105"
                >
                    <span className="material-symbols-outlined text-white text-[32px]">chat</span>
                </button>
            )}

            {/* Chatbot Window */}
            {isOpen && (
                <div className="w-[350px] h-[500px] bg-white rounded-t-xl rounded-bl-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-[#0a6c75] text-white p-4 flex items-center justify-between shadow-sm z-10">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">explore</span>
                            <span className="font-extrabold tracking-wide text-[16px]">Trip Planner</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:text-slate-200 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-[#f8fafc] flex flex-col gap-3 relative">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div 
                                    className={`
                                        max-w-[75%] px-4 py-2.5 rounded-[18px] text-[14px] leading-relaxed relative
                                        ${msg.sender === 'user' 
                                            ? 'bg-[#0a6c75] text-white rounded-tr-sm shadow-sm' 
                                            : 'bg-[#e2e8f0] text-slate-700 rounded-tl-sm shadow-sm font-medium'
                                        }
                                    `}
                                >
                                    {/* Small arrow pointers for realism */}
                                    <div className={`absolute top-0 w-3 h-3 ${msg.sender === 'user' ? '-right-1.5 bg-[#0a6c75]' : '-left-1.5 bg-[#e2e8f0]'} transform rotate-45 -z-10`}></div>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    {step < 6 && (
                        <div className="p-3 bg-[#f1f5f9] border-t border-slate-200 flex items-center gap-2">
                            <input 
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => { if(e.key === 'Enter') handleSend() }}
                                placeholder={placeholders[step] || "Type your answer..."}
                                className="flex-1 bg-white border border-slate-300 rounded-[6px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#0a6c75] focus:ring-1 focus:ring-[#0a6c75] transition-all text-slate-700"
                            />
                            <button 
                                onClick={handleSend}
                                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-[6px] text-[13px] font-bold uppercase tracking-wide transition-colors shadow-sm h-full flex items-center justify-center"
                            >
                                Send
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TripPlannerWidget;
