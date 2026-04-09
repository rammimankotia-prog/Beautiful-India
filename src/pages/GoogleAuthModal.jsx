import React, { useState } from 'react';

const GoogleAuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSimulateLogin = () => {
    setIsLoading(true);
    // Simulate a network delay for realism
    setTimeout(() => {
      setIsLoading(false);
      // Return mock user payload
      onSuccess({
        name: "Test Traveler",
        email: "traveler@example.com",
        picture: "https://i.pravatar.cc/150?u=traveler"
      });
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl p-8 flex flex-col items-center animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        {/* Modal Header */}
        <div className="w-16 h-16 bg-[#4285F4]/10 rounded-full flex items-center justify-center mb-6">
           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
           </svg>
        </div>

        <h3 className="text-xl font-black text-slate-900 dark:text-white text-center mb-2">Sign in Required</h3>
        <p className="text-sm text-slate-500 text-center mb-8">
          Please sign in with Google to securely process your booking and reserve your dates.
        </p>

        {/* Action Button */}
        <button 
          onClick={handleSimulateLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm disabled:opacity-50"
        >
          {isLoading ? (
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          )}
          {isLoading ? 'Connecting...' : 'Continue with Google'}
        </button>

        <p className="text-[10px] text-slate-400 mt-6 text-center">
           This is a simulated authentication flow for demonstration purposes.
        </p>

      </div>
    </div>
  );
};

export default GoogleAuthModal;
