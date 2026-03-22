import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

/**
 * Success page for Train Booking Inquiries.
 * Displays the Query ID and informs the user about the next steps.
 */
const TrainBookingSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get query data from navigation state or use defaults
    const { query } = location.state || {
        query: { 
            id: "TQ-" + Date.now(),
            journeyDetails: { fromStation: "Your Source", toStation: "Your Destination" }
        }
    };

    return (
        <div data-page="train_booking_success">
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8fafc] font-sans">
                {/* Hero Section with Luxury Train Image */}
                <div className="relative w-full h-[350px] overflow-hidden shadow-2xl">
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                        style={{ 
                            backgroundImage: "linear-gradient(180deg, rgba(10, 108, 117, 0.4) 0%, rgba(10, 108, 117, 0.9) 100%), url('/C:/Users/raman/.gemini/antigravity/brain/bec65649-3e43-4332-84f4-989292881309/indian_luxury_train_hero_1774168414931.png')" 
                        }}
                    >
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border-4 border-white/30 animate-bounce">
                                <span className="material-symbols-outlined text-white text-5xl">train</span>
                            </div>
                            <h1 className="text-white text-4xl md:text-5xl font-black tracking-tight mb-2 drop-shadow-lg">Inquiry Received!</h1>
                            <p className="text-teal-50 text-xl font-medium max-w-2xl opacity-90">Your train travel request has been submitted successfully.</p>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <main className="flex-1 flex justify-center -mt-20 px-4 pb-20 relative z-10">
                    <div className="max-w-3xl w-full">
                        <div className="bg-white rounded-[40px] shadow-2xl shadow-teal-900/10 border border-teal-50 overflow-hidden">
                            <div className="p-10 md:p-14 text-center">
                                {/* Status Badge */}
                                <div className="inline-flex items-center gap-2 bg-[#eefaf9] px-6 py-2.5 rounded-full mb-8 border border-teal-100">
                                    <span className="text-[#0a6c75] text-xs font-black uppercase tracking-widest">Query Reference:</span>
                                    <span className="text-[#0a6c75] text-sm font-black tracking-wider">{query.id}</span>
                                </div>

                                <div className="space-y-6 mb-12">
                                    <h2 className="text-3xl font-black text-slate-800 leading-tight">What Happens Next?</h2>
                                    <p className="text-slate-600 text-lg leading-relaxed max-w-lg mx-auto">
                                        Thank you for choosing <span className="font-black text-[#0a6c75]">Beautiful India</span>. Our dedicated train travel desk is now reviewing your request.
                                    </p>
                                </div>

                                {/* Next Steps Timeline */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14 text-left">
                                    <div className="flex flex-col items-center text-center md:items-start md:text-left gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#0a6c75] shadow-md">
                                            <span className="material-symbols-outlined">assignment_turned_in</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 text-sm mb-1 uppercase tracking-tight">Step 1: Review</p>
                                            <p className="text-xs text-slate-500 font-bold leading-relaxed">Checking seat availability and best class options for your route.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center text-center md:items-start md:text-left gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#0a6c75] shadow-md">
                                            <span className="material-symbols-outlined">support_agent</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 text-sm mb-1 uppercase tracking-tight">Step 2: Contact</p>
                                            <p className="text-xs text-slate-500 font-bold leading-relaxed">Our expert will call you within 24 hours with a personalized quote.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center text-center md:items-start md:text-left gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#0a6c75] shadow-md">
                                            <span className="material-symbols-outlined">confirmation_number</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 text-sm mb-1 uppercase tracking-tight">Step 3: Secure</p>
                                            <p className="text-xs text-slate-500 font-bold leading-relaxed">Complete your payment and receive your e-tickets instantly.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link to="/tours" className="flex-1 max-w-xs py-5 bg-[#0a6c75] text-white font-black rounded-2xl hover:bg-[#085a62] transition-all shadow-xl shadow-teal-900/20 flex items-center justify-center gap-2 group uppercase tracking-widest text-xs">
                                        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">explore</span>
                                        Browse Tour Packages
                                    </Link>
                                    <Link to="/" className="flex-1 max-w-xs py-5 bg-white border-2 border-slate-200 text-slate-600 font-black rounded-2xl hover:border-[#0a6c75] hover:text-[#0a6c75] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                                        <span className="material-symbols-outlined">home</span>
                                        Back to Home
                                    </Link>
                                </div>
                            </div>

                            {/* Need Help Footer */}
                            <div className="bg-[#f1f5f9] p-8 text-center border-t border-slate-100">
                                <p className="text-slate-500 font-bold text-sm">
                                    Need immediate assistance? Call us at <span className="text-[#0a6c75] font-black">+91 60051 59433</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TrainBookingSuccessPage;
