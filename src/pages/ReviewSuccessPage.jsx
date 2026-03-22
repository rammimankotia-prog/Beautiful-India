import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ReviewSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 md:px-10 font-sans text-slate-900 dark:text-slate-100">
      <Helmet>
        <title>Review Submitted | Beautiful India</title>
      </Helmet>
      
      <div className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 md:p-16 shadow-2xl shadow-emerald-500/10 border border-emerald-50 dark:border-slate-700 text-center relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-emerald-400 opacity-20 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-teal-400 opacity-20 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-8 shadow-inner border-4 border-white dark:border-slate-800">
                <span className="material-symbols-outlined text-emerald-500 text-5xl">verified</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-emerald-600 dark:text-emerald-400 mb-4 tracking-tight">
                Thank You!
            </h1>
            
            <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-lg mx-auto leading-relaxed">
                Thank you for sharing your stories and rating. Your feedback is incredibly valuable and helps fellow travelers find their perfect journey through Beautiful India.
            </p>

            <div className="w-full flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate(-2)}
                  className="px-8 py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-black rounded-xl transition-all uppercase tracking-wide text-sm flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Return to Tour
                </button>
                <Link 
                  to="/tours"
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-600/30 uppercase tracking-wide text-sm flex items-center justify-center gap-2"
                >
                    Explore More Tours
                    <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                </Link>
            </div>
        </div>
      </div>
    </main>
  );
};

export default ReviewSuccessPage;
