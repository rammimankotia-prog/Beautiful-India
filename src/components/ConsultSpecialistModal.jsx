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
      ...formData,
      topic: tourTitle || topic,
      source: "Specialist Consultation",
      timestamp: new Date().toISOString(),
      status: 'High Priority'
    };

    try {
      const response = await fetch(`/api-save-leads.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-10 sm:p-0">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-500" onClick={onClose}></div>

      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in slide-in-from-bottom duration-700 max-h-[90vh] flex flex-col lg:flex-row">
        
        {/* Left Side: Persona & Trust */}
        <div className="lg:w-2/5 bg-slate-900 relative overflow-hidden flex flex-col min-h-[300px]">
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
        <div className="lg:w-3/5 flex flex-col bg-white dark:bg-slate-950 relative">
            <div className="p-8 sm:p-14 flex-1 overflow-y-auto no-scrollbar">
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
                  <form onSubmit={handleSubmit} className="space-y-12">
                     <div className="space-y-4">
                        <h3 className="text-4xl font-serif font-black text-slate-900 dark:text-white tracking-tighter">Your Journey <span className="text-primary italic">Starts Here.</span></h3>
                        <p className="text-slate-500 font-medium italic">Planning for: <span className="text-primary font-black uppercase tracking-widest">{tourTitle || topic}</span></p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Name */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 ml-2">Appellation</label>
                            <div className="relative group">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                                <input 
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary/20 outline-none rounded-3xl text-slate-900 dark:text-white font-black transition-all"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 ml-2">Digital Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                                <input 
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary/20 outline-none rounded-3xl text-slate-900 dark:text-white font-black transition-all"
                                />
                            </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Phone */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 ml-2">Mobile Hotline</label>
                            <div className="relative group">
                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                                <input 
                                    type="tel"
                                    name="phone"
                                    required
                                    placeholder="+91 Phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary/20 outline-none rounded-3xl text-slate-900 dark:text-white font-black transition-all"
                                />
                            </div>
                        </div>

                        {/* Date */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 ml-2">Departure</label>
                            <div className="relative group">
                                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                                <input 
                                    type="month"
                                    name="travelDate"
                                    required
                                    value={formData.travelDate}
                                    onChange={handleChange}
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary/20 outline-none rounded-3xl text-slate-900 dark:text-white font-black transition-all"
                                />
                            </div>
                        </div>
                     </div>

                     {/* Interests */}
                     <div className="space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 ml-2">Expedition Interests</label>
                        <div className="flex flex-wrap gap-3">
                            {['Heritage', 'Off-roading', 'Luxury', 'Cuisine', 'Support'].map(interest => (
                                <button
                                    key={interest}
                                    type="button"
                                    onClick={() => handleInterestToggle(interest)}
                                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                                        formData.interests.includes(interest) 
                                        ? 'bg-slate-900 text-white border-slate-900 dark:bg-primary dark:border-primary' 
                                        : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700 hover:border-primary'
                                    }`}
                                >
                                    {interest}
                                </button>
                            ))}
                        </div>
                     </div>

                     <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between group cursor-pointer" onClick={() => setFormData(p => ({...p, whatsappConsent: !p.whatsappConsent}))}>
                        <div className="flex gap-4 items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${formData.whatsappConsent ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-300'}`}>
                                <i className="fa-brands fa-whatsapp text-2xl"></i>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[2px] text-emerald-700 dark:text-emerald-400">Receive Quote via WhatsApp</p>
                                <p className="text-[8px] font-bold text-emerald-600/60 uppercase">High Priority Response</p>
                            </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.whatsappConsent ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 dark:border-slate-700'}`}>
                            {formData.whatsappConsent && <CheckCircle className="text-white" size={14} />}
                        </div>
                     </div>

                     <button 
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full h-20 bg-primary text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[6px] shadow-2xl shadow-primary/30 hover:bg-slate-900 transition-all flex items-center justify-center gap-6 group"
                     >
                        {status === 'loading' ? 'Processing...' : (
                            <>
                                <span>Begin Curating</span>
                                <ArrowRight className="group-hover:translate-x-4 transition-transform" />
                            </>
                        )}
                     </button>
                  </form>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultSpecialistModal;
