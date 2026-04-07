import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const SignInPage = () => {
    const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, signup, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redir if already logged in
    useEffect(() => {
        if (user) {
            const origin = location.state?.from?.pathname || '/admin/overview';
            navigate(origin);
        }
    }, [user, navigate, location]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        // Simulate network request
        setTimeout(() => {
            if (mode === 'signin') {
                const result = login(email, password);
                if (result.success) {
                    const origin = location.state?.from?.pathname || '/admin/overview';
                    navigate(origin);
                } else {
                    setError(result.message || 'Invalid credentials. Please try again.');
                }
            } else {
                const result = signup(name, email, password);
                if (result.success) {
                    setSuccess('Request sent successfully! The Master Admin will review your account soon.');
                    setName('');
                    setEmail('');
                    setPassword('');
                    setTimeout(() => setMode('signin'), 3000);
                } else {
                    setError(result.message);
                }
            }
            setIsSubmitting(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Helmet>
                <title>Sign In | Bharat Darshan Admin</title>
            </Helmet>
            
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 transform transition-all duration-300">
                
                {/* Visual Header */}
                <div className="relative h-40 bg-gradient-to-br from-[#006D77] to-[#005a63] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0,50 C20,20 40,80 60,30 C80,-20 100,60 100,50 L100,100 L0,100 Z" fill="#ffffff" />
                        </svg>
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                        <Link to="/" className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-3 transform rotate-3 hover:rotate-0 transition-transform">
                            <span className="material-symbols-outlined text-4xl text-[#006D77]">admin_panel_settings</span>
                        </Link>
                        <h1 className="text-2xl font-black text-white tracking-tight uppercase">
                            {mode === 'signin' ? 'Admin Sign In' : 'Request Access'}
                        </h1>
                    </div>
                </div>

                <div className="p-8 pt-6">
                    <p className="text-slate-500 text-center text-sm mb-8 font-medium">
                        {mode === 'signin' 
                            ? 'Please enter your credentials to access the management dashboard.' 
                            : 'Fill in your details to request an administrative account.'}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[13px] text-center font-bold animate-pulse flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">error</span>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-[13px] text-center font-bold flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                {success}
                            </div>
                        )}

                        {mode === 'signup' && (
                            <div className="space-y-1.5">
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400 text-[20px]">person</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary block p-4 pl-12 transition-all outline-none placeholder:text-slate-400 font-bold"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 text-[20px]">mail</span>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary block p-4 pl-12 transition-all outline-none placeholder:text-slate-400 font-bold"
                                    placeholder="admin@bharatdarshan.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-1">
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Password</label>
                                <a href="#" className="text-[11px] font-black text-[#006D77] hover:underline uppercase tracking-tighter">Forgot Password?</a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 text-[20px]">lock</span>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary block p-4 pl-12 transition-all outline-none placeholder:text-slate-400 font-bold"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full text-white bg-[#006D77] hover:bg-[#005a63] font-black rounded-xl text-sm px-5 py-4 text-center shadow-lg shadow-teal-900/10 transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center relative overflow-hidden group disabled:opacity-70 disabled:hover:translate-y-0 uppercase tracking-widest"
                        >
                            {isSubmitting ? (
                                <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                            ) : (
                                <>
                                    <span className="relative z-10 flex items-center gap-2">
                                        {mode === 'signin' ? 'Sign In' : 'Request Access'}
                                        <span className="material-symbols-outlined text-[18px]">
                                            {mode === 'signin' ? 'login' : 'send'}
                                        </span>
                                    </span>
                                    <div className="absolute inset-0 h-full w-full bg-white/10 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button 
                            onClick={() => {
                                setMode(mode === 'signin' ? 'signup' : 'signin');
                                setError('');
                                setSuccess('');
                            }}
                            className="text-xs font-black text-[#006D77] hover:underline uppercase tracking-widest"
                        >
                            {mode === 'signin' ? "Don't have an account? Request Access" : "Already have a request? Back to Sign In"}
                        </button>
                    </div>

                    <div className="mt-10 pt-6 border-t border-slate-50 text-center">
                         <Link to="/" className="text-xs font-black text-slate-400 hover:text-[#006D77] transition-colors uppercase tracking-[0.15em] flex items-center justify-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            Back to Website
                         </Link>
                    </div>
                </div>
            </div>
            
            {/* Design accents */}
            <div className="fixed bottom-0 left-0 p-10 opacity-10 pointer-events-none hidden lg:block">
                <span className="material-symbols-outlined text-[200px] text-primary select-none">temple_hindu</span>
            </div>
            <div className="fixed top-0 right-0 p-10 opacity-10 pointer-events-none hidden lg:block">
                <span className="material-symbols-outlined text-[200px] text-primary select-none">travel_explore</span>
            </div>
        </div>
    );
};

export default SignInPage;
