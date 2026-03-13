import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const SignInModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Simulate network request
    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        onClose();
        setEmail('');
        setPassword('');
      } else {
        setError('Please enter both email and password.');
      }
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all translate-y-0 scale-100 opacity-100 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10 p-1 bg-white/50 rounded-full hover:bg-slate-100"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Header/Banner Area */}
        <div className="relative h-32 bg-primary overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M0,50 C20,20 40,80 60,30 C80,-20 100,60 100,50 L100,100 L0,100 Z" fill="#ffffff" />
              </svg>
            </div>
            <div className="relative z-10 flex flex-col items-center mt-4">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center mb-2 transform rotate-3">
                    <span className="material-symbols-outlined text-3xl text-primary transform -rotate-3">flight_takeoff</span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide">Welcome Back</h2>
            </div>
        </div>

        <div className="p-8 pt-6">
          <p className="text-slate-500 text-center text-sm mb-6">Sign in to uncover your next great adventure.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm text-center font-medium animate-pulse">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">mail</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary block p-3.5 pl-10 transition-all shadow-sm outline-none placeholder:text-slate-400"
                  placeholder="traveler@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 ml-1 pr-1">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-xs font-semibold text-primary hover:text-[#005a63] transition-colors">Forgot?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">lock</span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary block p-3.5 pl-10 transition-all shadow-sm outline-none placeholder:text-slate-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white bg-primary hover:bg-[#005a63] font-bold rounded-xl text-base px-5 py-3.5 text-center shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:-translate-y-0.5 mt-2 flex items-center justify-center relative overflow-hidden group disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
              ) : (
                <>
                  <span className="relative z-10">Sign In</span>
                  <div className="absolute inset-0 h-full w-full bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out"></div>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
             Don't have an account yet? <a href="#" className="font-bold text-primary hover:underline">Create Account</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
