import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  CheckCircle, 
  ShieldCheck,
  Calendar,
  ArrowRight
} from 'lucide-react';

const ConsultSpecialistModal = ({ isOpen, onClose, tourTitle, topic = "India Expedition" }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    travelDate: '',
    groupSize: '1',
    interests: [],
    message: '',
    whatsappConsent: true
  });
  const [status, setStatus] = useState('idle'); 
  const [errorMsg, setErrorMsg] = useState('');

  const CONTACT_INFO = {
    whatsapp: "+916005159433",
    email: "destiny.tnt@gmail.com"
  };

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const leadData = {
      id: `CONSULT-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      to: tourTitle || 'General Expert Consultation',
      message: formData.message,
      source: 'Specialist Consultation',
      createdAt: new Date().toISOString(),
      status: 'New'
    };

    try {
      const response = await fetch(`/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setTimeout(() => onClose(), 4000);
      } else {
        throw new Error(result.message || 'Failed to submit inquiry');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-500" onClick={onClose}></div>

      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in slide-in-from-bottom duration-700 h-[92vh] sm:h-auto sm:max-h-[90vh] flex flex-col lg:flex-row">
        
        {/* Left Side: Persona & Trust */}
        <div className="lg:w-2/5 bg-slate-900 relative overflow-hidden flex flex-col min-h-[220px] lg:min-h-[300px]">
            <div className="absolute inset-0 opacity-40">
                <img 
                    src="https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&q=80" 
                    className="w-full h-full object-cover"
                    alt="Specialist Backdrop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            </div>

            <div className="relative z-10 p-12 mt-auto space-y-8">
                <div className="space-y-4">
                    <span className="px-4 py-2 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary rounded-full text-[10px] font-black uppercase tracking-[4px]">
                        Certified Specialist
                    </span>
                    <h2 className="text-4xl font-serif font-black text-white leading-tight">Mita, our <br /><span className="text-primary">Destination Curator</span></h2>
                    <p className="text-slate-400 font-medium text-sm leading-relaxed italic">
                        "I've spent 15 years charting India's most rugged paths. Let me refine your itinerary to ensure absolute perfection."
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 pt-6">
                    <div className="flex items-center gap-4 text-white/60">
                        <CheckCircle className="text-primary" size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[3px]">Tailor-made itineraries</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/60">
                        <CheckCircle className="text-primary" size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[3px]">24/7 Ground support</span>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/10 flex gap-6">
                    <a href={`https://wa.me/${CONTACT_INFO.whatsapp.replace('+', '')}`} className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
                        <MessageSquare size={20} />
                    </a>
                    <a href={`mailto:${CONTACT_INFO.email}`} className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all">
                        <Mail size={20} />
                    </a>
                </div>
            </div>
        </div>

        {/* Right Side: High-End Intake Form */}
        <div className="lg:w-3/5 flex flex-col bg-white dark:bg-slate-950 relative overflow-hidden">
            <div className="p-6 sm:p-14 flex-1 overflow-y-auto custom-scrollbar">
                <button 
                  onClick={onClose}
                  className="absolute top-8 right-8 w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 hover:scale-110 transition-all z-20"
                >
                  <X size={24} />
                </button>

                {status === 'success' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom duration-700">
                    <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-inner">
                      <CheckCircle size={48} />
                    </div>
                    <h2 className="text-4xl font-serif font-black text-slate-900 dark:text-white mb-4 tracking-tighter">Request Received!</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-sm mx-auto mb-8 font-medium italic">
                        Mita has been notified. You will receive a personalized curriculum and initial quote via WhatsApp within 2 hours.
                    </p>
                    <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 px-8 py-4 rounded-3xl border border-emerald-100 dark:border-emerald-800">
                        <ShieldCheck className="text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[4px] text-emerald-700 dark:text-emerald-400">Priority Lead Logged</span>
                    </div>
                  </div>
                ) : (
                   <form onSubmit={handleSubmit} className="space-y-10">
                       <div className="space-y-3">
                          <div className="flex items-center gap-3">
                             <div className="h-0.5 w-10 bg-primary opacity-30"></div>
                             <span className="text-[10px] font-black uppercase tracking-[6px] text-primary">Your Journey Starts Here</span>
                          </div>
                          <h3 className="text-3xl sm:text-5xl font-serif font-black text-slate-900 dark:text-white tracking-tighter leading-none italic">
                             Begin Curating <br />Your <span className="text-primary not-italic">Expedition.</span>
                          </h3>
                          <p className="text-slate-500 font-medium italic text-sm">
                             Customizing details for: <span className="text-slate-900 dark:text-white font-black uppercase tracking-[3px] ml-1">{tourTitle || topic}</span>
                          </p>
                       </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                         {/* Name Input with Deep Inset Label */}
                         <div className="group relative">
                             <div className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-focus-within:bg-primary/10 group-focus-within:text-primary transition-all shadow-sm">
                                <User size={20} />
                             </div>
                             <div className="pl-24 pr-8 py-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-white/5 focus-within:border-primary/30 rounded-[2rem] transition-all">
                                 <label className="block text-[9px] font-black uppercase tracking-[3px] text-slate-500 dark:text-slate-400 mb-0.5 opacity-80">Appellation / Full Name</label>
                                 <input 
                                     type="text"
                                     name="name"
                                     required
                                     placeholder="e.g. Alexander Walker"
                                     value={formData.name}
                                     onChange={handleChange}
                                     className="w-full bg-transparent outline-none text-slate-900 dark:text-white font-black text-base placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                 />
                             </div>
                         </div>

                         {/* Email Input */}
                         <div className="group relative">
                             <div className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-focus-within:bg-primary/10 group-focus-within:text-primary transition-all shadow-sm">
                                <Mail size={20} />
                             </div>
                             <div className="pl-24 pr-8 py-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-white/5 focus-within:border-primary/30 rounded-[2rem] transition-all">
                                 <label className="block text-[9px] font-black uppercase tracking-[3px] text-slate-500 dark:text-slate-400 mb-0.5 opacity-80">Digital Address / Email</label>
                                 <input 
                                     type="email"
                                     name="email"
                                     required
                                     placeholder="alex@expedition.com"
                                     value={formData.email}
                                     onChange={handleChange}
                                     className="w-full bg-transparent outline-none text-slate-900 dark:text-white font-black text-base placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                 />
                             </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                         {/* Phone Input */}
                         <div className="group relative">
                             <div className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-focus-within:bg-primary/10 group-focus-within:text-primary transition-all shadow-sm">
                                <Phone size={20} />
                             </div>
                             <div className="pl-24 pr-8 py-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-white/5 focus-within:border-primary/30 rounded-[2rem] transition-all">
                                 <label className="block text-[9px] font-black uppercase tracking-[3px] text-slate-500 dark:text-slate-400 mb-0.5 opacity-80">Mobile Hotline / WhatsApp</label>
                                 <input 
                                     type="tel"
                                     name="phone"
                                     required
                                     placeholder="+91 — — — — —"
                                     value={formData.phone}
                                     onChange={handleChange}
                                     className="w-full bg-transparent outline-none text-slate-900 dark:text-white font-black text-base placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                 />
                             </div>
                         </div>

                         {/* Date Input */}
                         <div className="group relative">
                             <div className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-focus-within:bg-primary/10 group-focus-within:text-primary transition-all shadow-sm">
                                <Calendar size={20} />
                             </div>
                             <div className="pl-24 pr-8 py-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-white/5 focus-within:border-primary/30 rounded-[2rem] transition-all">
                                 <label className="block text-[9px] font-black uppercase tracking-[3px] text-slate-500 dark:text-slate-400 mb-0.5 opacity-80">Planned Departure</label>
                                 <input 
                                     type="month"
                                     name="travelDate"
                                     required
                                     value={formData.travelDate}
                                     onChange={handleChange}
                                     className="w-full bg-transparent outline-none text-slate-900 dark:text-white font-black text-base"
                                 />
                             </div>
                         </div>
                      </div>

                      {/* Interests Chips */}
                      <div className="space-y-5">
                         <div className="flex items-center gap-3">
                             <span className="text-[9px] font-black uppercase tracking-[4px] text-slate-400">Expedition Interests</span>
                             <div className="h-px flex-1 bg-slate-100 dark:bg-white/5"></div>
                         </div>
                         <div className="flex flex-wrap gap-2 md:gap-3">
                             {['Heritage', 'Off-roading', 'Luxury', 'Cuisine', 'Support'].map(interest => (
                                 <button
                                     key={interest}
                                     type="button"
                                     onClick={() => handleInterestToggle(interest)}
                                     className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border-2 ${
                                         formData.interests.includes(interest) 
                                         ? 'bg-slate-900 text-white border-slate-900 dark:bg-primary dark:border-primary shadow-xl shadow-primary/20 scale-105' 
                                         : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-white/5 hover:border-primary/30 active:scale-95'
                                     }`}
                                 >
                                     {interest}
                                 </button>
                             ))}
                         </div>
                      </div>

                      {/* WhatsApp Consent and Submit Bar */}
                      <div className="flex flex-col sm:flex-row gap-6 items-center pt-4">
                         <div 
                            className={`flex flex-1 items-center gap-5 p-6 rounded-[2rem] border-2 transition-all cursor-pointer ${formData.whatsappConsent ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-white/5'}`}
                            onClick={() => setFormData(p => ({...p, whatsappConsent: !p.whatsappConsent}))}
                         >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${formData.whatsappConsent ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white dark:bg-slate-800 text-slate-300'}`}>
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.766-5.764-5.771zm3.391 8.244c-.144.405-.837.778-1.148.822-.311.043-.69.058-1.11-.082s-.939-.218-1.57-.501c-1.424-.638-2.33-2.094-2.401-2.188-.071-.094-.61-2.112-.61-5.112 0-3 .54-4.512.61-4.606.071-.094.131-.137.2-.137h.1l.01.002.046.002c.11.002.261.025.36.262l.4 1.117.066.16c.045.1.06.18.01.29-.05.11-.12.24-.2.37l-.14.21-.132.17c-.1.14-.11.23-.05.34.05.1.25.43.52.68.35.31.64.41.77.47s.24.08.33.1.2.04.28-.06c.07-.12.3-.39.42-.58s.22-.16.38-.1c.16.07.97.46 1.13.54.17.08.28.12.32.18.04.06.04.34-.1.74z"/></svg>
                            </div>
                            <div className="flex-1">
                                <p className={`text-[10px] font-black uppercase tracking-[2px] ${formData.whatsappConsent ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}`}>WhatsApp Quote</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase">High Priority Response</p>
                            </div>
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.whatsappConsent ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 dark:border-slate-700'}`}>
                                {formData.whatsappConsent && <CheckCircle size={14} className="text-white" />}
                            </div>
                         </div>

                         <button 
                            type="submit"
                            disabled={status === 'loading'}
                            className="h-24 sm:h-auto sm:aspect-square sm:w-28 bg-primary text-white rounded-[2rem] sm:rounded-[2.5rem] font-black text-[10px] uppercase tracking-[4px] shadow-2xl shadow-primary/30 hover:bg-slate-900 transition-all flex flex-col items-center justify-center gap-3 group shrink-0"
                         >
                            {status === 'loading' ? (
                                <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <ArrowRight className="group-hover:translate-x-2 transition-transform h-8 w-8" strokeWidth={3} />
                                    <span className="hidden sm:block">Begin</span>
                                </>
                            )}
                         </button>
                      </div>
                   </form>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultSpecialistModal;
