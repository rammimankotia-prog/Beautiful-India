
import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  ShieldCheck,
  Smartphone,
  Calendar
} from 'lucide-react';

const QueryModal = ({ isOpen, onClose, topic, source = "Article Inquiry" }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    whatsappConsent: true
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  // Reset form on open
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const leadData = {
      id: `QM-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
      ...formData,
      to: topic || 'General Inquiry',
      source: source,                       // e.g. "Travel Guide Page", "Article Inquiry", etc.
      createdAt: new Date().toISOString(),
      status: 'New'
    };

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setTimeout(() => { onClose(); }, 3000);
      } else {
        throw new Error(result.message || 'Failed to submit inquiry');
      }
    } catch (err) {
      console.error("Submission error:", err);
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 h-[90vh] sm:h-auto sm:max-h-[95vh] flex flex-col">
        
        {/* Header Decor */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-indigo-500 to-teal-500"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all z-10"
        >
          <X size={20} />
        </button>

        {status === 'success' ? (
          <div className="p-12 flex flex-col items-center text-center animate-in slide-in-from-bottom duration-500">
            <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-inner">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Inquiry Received!</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-xs mx-auto mb-8 font-medium">
              Our travel specialists will curate your dream itinerary and contact you within 24 hours.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-900/20 px-6 py-2.5 rounded-full">
              <ShieldCheck size={18} />
              Saved to Admin Panel
            </div>
          </div>
        ) : (
            <div className="flex-1 overflow-y-auto min-h-0 p-5 sm:p-10 custom-scrollbar">
              <div className="mb-6 sm:mb-8 pr-6">
                <span className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400 px-3 sm:px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 sm:mb-4">
                  <Smartphone size={14} />
                  Consult a Specialist
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight mb-2 tracking-tight">
                  Let's plan your journey to {topic || 'India'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                  Fill in your details and we'll get back to you shortly.
                </p>
              </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Name */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] sm:text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest pl-1">Full Name *</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
                  <input 
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-teal-500/30 focus:bg-white dark:focus:bg-slate-800 outline-none rounded-xl sm:rounded-2xl text-sm sm:text-base text-slate-900 dark:text-white font-bold transition-all placeholder:font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest pl-1">Email Address *</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
                    <input 
                      type="email"
                      name="email"
                      required
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-teal-500/30 focus:bg-white dark:focus:bg-slate-800 outline-none rounded-xl sm:rounded-2xl text-sm sm:text-base text-slate-900 dark:text-white font-bold transition-all placeholder:font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest pl-1">Phone Number *</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
                    <input 
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 00000 00000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-teal-500/30 focus:bg-white dark:focus:bg-slate-800 outline-none rounded-xl sm:rounded-2xl text-sm sm:text-base text-slate-900 dark:text-white font-bold transition-all placeholder:font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] sm:text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest pl-1">Custom Requirements</label>
                <div className="relative group">
                  <MessageSquare className="absolute left-4 top-4 sm:top-5 text-slate-500 dark:text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
                  <textarea 
                    name="message"
                    rows={3}
                    placeholder="Tell us about your travel plans..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-teal-500/30 focus:bg-white dark:focus:bg-slate-800 outline-none rounded-xl sm:rounded-2xl text-sm sm:text-base text-slate-900 dark:text-white font-bold transition-all placeholder:font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm resize-none"
                  ></textarea>
                </div>
              </div>

              {/* WhatsApp Consent */}
              <label className="flex items-start sm:items-center gap-3 cursor-pointer group bg-slate-50 dark:bg-slate-800/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-transparent hover:border-emerald-500/20 transition-all">
                <div className="relative mt-0.5 sm:mt-0 flex items-center shrink-0">
                  <input 
                    type="checkbox"
                    name="whatsappConsent"
                    checked={formData.whatsappConsent}
                    onChange={handleChange}
                    className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-slate-300 rounded-lg checked:bg-emerald-500 checked:border-emerald-500 transition-all appearance-none cursor-pointer"
                  />
                  {formData.whatsappConsent && (
                    <CheckCircle className="absolute inset-0 m-auto text-white" size={14} strokeWidth={4} />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wide">WhatsApp Updates</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Receive itineraries and quotes directly on WhatsApp</span>
                </div>
              </label>

              {status === 'error' && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl border border-red-100 dark:border-red-900/30 animate-shake">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-full h-14 sm:h-16 bg-slate-900 dark:bg-teal-600 text-white rounded-xl sm:rounded-[1.25rem] font-black text-xs sm:text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:grayscale"
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Inquiry
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest px-4">
                By submitting, you agree to our privacy policy and terms of service.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryModal;
