import React from 'react';

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-in fade-in duration-700">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl animate-pulse">explore</span>
            </div>
        </div>
        <div className="flex flex-col items-center gap-2">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Preparing your adventure...</h2>
            <p className="text-sm font-bold text-slate-400 italic">Optimizing for the best experience</p>
        </div>
    </div>
);

export default LoadingSpinner;
