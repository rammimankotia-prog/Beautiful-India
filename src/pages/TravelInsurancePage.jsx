import React from 'react';
import { ShieldCheck, Umbrella, HeartPulse, Plane } from 'lucide-react';

const TravelInsurancePage = () => {
    return (
        <div className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[400px] overflow-hidden bg-slate-900 flex items-center">
                <div className="absolute inset-0 opacity-40">
                    <img 
                        src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=2000" 
                        alt="Travel Insurance" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <span className="inline-block px-4 py-1.5 bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded-full text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] mb-6">
                        Safety First
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter mb-6">
                        Travel with <br /> <span className="text-blue-500 text-shadow-glow">Peace of Mind.</span>
                    </h1>
                    <p className="text-lg text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
                        Secure your journey against unforeseen events. From medical emergencies to trip cancellations, we've got you covered.
                    </p>
                </div>
            </div>

            {/* Coverage Grid */}
            <div className="container mx-auto px-6 py-24 -mt-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: 'Medical Cover', desc: 'Up to ₹1 Crore coverage for hospitalization and medical emergencies during your trip.', icon: HeartPulse, color: 'text-red-500', bg: 'bg-red-50' },
                        { title: 'Trip Cancellation', desc: 'Get refunded for non-refundable bookings if you need to cancel for covered reasons.', icon: Plane, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { title: 'Baggage Loss', desc: 'Assistance and compensation for lost, stolen, or delayed checked-in baggage.', icon: Umbrella, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                        { title: '24/7 Support', desc: 'Global assistance hotline for emergencies, legal aid, and concierge services.', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50' }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all hover:-translate-y-2 group">
                            <div className={`${item.bg} dark:bg-slate-800 w-16 h-16 rounded-3xl flex items-center justify-center ${item.color} mb-8 group-hover:scale-110 transition-transform`}>
                                <item.icon size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-4">{item.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Why Insurance? */}
            <div className="container mx-auto px-6 py-24">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-slate-100 leading-tight tracking-tighter">
                            Why do you need <br /> Travel Insurance?
                        </h2>
                        <div className="space-y-6">
                            {[
                                "Avoid high medical costs in foreign countries or remote areas.",
                                "Protection against flight delays and missed connections.",
                                "Coverage for loss of passport and travel documents.",
                                "Personal liability and legal assistance on the go."
                            ].map((point, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="size-8 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                        <ShieldCheck size={16} />
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 font-bold">{point}</p>
                                </div>
                            ))}
                        </div>
                        <button className="px-10 py-5 bg-slate-900 dark:bg-slate-800 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-colors uppercase tracking-widest text-xs">
                            Get a Quote Now
                        </button>
                    </div>
                    <div className="flex-1 relative">
                        <div className="absolute -inset-4 bg-blue-500/10 blur-3xl rounded-full"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=800" 
                            alt="Happy Traveler" 
                            className="w-full h-[500px] object-cover rounded-[64px] relative z-10 shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TravelInsurancePage;
