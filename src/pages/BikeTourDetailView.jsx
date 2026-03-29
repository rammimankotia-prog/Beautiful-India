import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import QueryModal from '../components/QueryModal';
import ConsultSpecialistModal from '../components/ConsultSpecialistModal';

const BikeTourDetailView = () => {
    const { slug } = useParams();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [relatedTours, setRelatedTours] = useState([]);

    const fetchTour = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/v1/bike-tours/slug/${slug}`);
            if (response.ok) {
                const data = await response.json();
                setTour(data);
                
                // Inject Schema Markup
                if (data.schemaMarkup) {
                    try {
                        const script = document.createElement('script');
                        script.type = 'application/ld+json';
                        script.text = data.schemaMarkup;
                        script.id = 'tour-schema';
                        document.head.appendChild(script);
                    } catch (e) {
                        console.error('Schema injection failed', e);
                    }
                }

                // Fetch related tours (same type or destination)
                const relatedRes = await fetch(`/api/v1/bike-tours?tourType=${data.tourType}`);
                if (relatedRes.ok) {
                    const relatedData = await relatedRes.json();
                    setRelatedTours(relatedData.filter(t => t._id !== data._id).slice(0, 3));
                }
            }
        } catch (error) {
            console.error('Error fetching bike tour:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTour();
        window.scrollTo(0, 0);
        return () => {
            const schemaScript = document.getElementById('tour-schema');
            if (schemaScript) schemaScript.remove();
        };
    }, [slug]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="w-16 h-16 border-8 border-slate-100 border-t-primary rounded-full animate-spin"></div>
                <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Charting the course...</p>
            </div>
        );
    }

    if (!tour) {
        return (
            <div className="text-center py-60 space-y-10">
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-6xl text-slate-200">explore</span>
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-serif font-black text-slate-800">The Path is Missing</h2>
                    <p className="text-slate-500 font-medium">This adventure is currently being re-charted.</p>
                </div>
                <Link to="/tours/bike-tours" className="inline-block px-12 py-5 bg-primary text-white rounded-full font-black uppercase text-xs tracking-[4px] shadow-2xl shadow-primary/30 hover:bg-slate-900 transition-all">Back to Fleet</Link>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen pb-40">
            {/* Scroll Progress Bar */}
            <div className="scroll-progress"></div>

            {/* Premium Hero / Gallery */}
            <section className="relative h-[85vh] overflow-hidden group">
                <img 
                    src={tour.mainImage} 
                    alt={tour.title} 
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[3s] ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90"></div>
                
                <div className="absolute inset-x-0 bottom-0 py-20">
                    <div className="max-w-[1400px] mx-auto px-10 space-y-8 animate-fade-up">
                        <div className="flex gap-4">
                            <span className="px-6 py-2 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-[6px] shadow-xl shadow-primary/20">
                                {tour.tourType === 'Bike' ? 'Motorbike' : 'Cycling'}
                            </span>
                            <span className="px-6 py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-[6px]">
                                {tour.duration}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-serif font-black text-white leading-[1.1] tracking-tighter max-w-4xl">
                            {tour.title}
                        </h1>
                        <p className="text-white/60 text-xl font-medium tracking-[8px] uppercase">{tour.destination}</p>
                    </div>
                </div>
            </section>

            {/* Main Content Layout */}
            <main className="max-w-[1400px] mx-auto px-10 mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
                    {/* Left Side: Editorial Storytelling */}
                    <div className="lg:col-span-2 space-y-24">
                        {/* Highlights Grid */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <h2 className="text-[10px] font-black uppercase tracking-[8px] text-primary">The Vibe</h2>
                                <h3 className="text-4xl font-serif font-black text-slate-900 dark:text-white leading-tight italic">
                                    Conquer the terrain with <span className="text-primary italic">unrivaled style.</span>
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                {tour.highlights?.slice(0, 3).map((h, i) => (
                                    <div key={i} className="flex gap-6 items-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] border border-slate-100 dark:border-slate-800 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined font-black">star</span>
                                        </div>
                                        <p className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">{h}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Editorial Body */}
                        <section className="article-content max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: tour.content }} />
                        </section>

                        {/* Interactive Itinerary / Tabs */}
                        <section className="space-y-12">
                            <div className="flex gap-10 border-b border-slate-100 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
                                {['At a Glance', 'Inclusions', 'Equipment'].map((tab) => (
                                    <button 
                                        key={tab}
                                        onClick={() => setActiveTab(tab.toLowerCase())}
                                        className={`text-[10px] font-black uppercase tracking-[6px] pb-4 transition-all whitespace-nowrap ${activeTab === tab.toLowerCase() ? 'text-primary border-b-2 border-primary' : 'text-slate-300 hover:text-slate-900'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="animate-fade-up">
                                {activeTab === 'at a glance' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="p-10 bg-slate-900 rounded-[48px] text-white space-y-6">
                                            <h4 className="text-2xl font-serif italic text-primary">The Route</h4>
                                            <div className="space-y-6 pt-4">
                                                {tour.coveredPlaces?.map((place, i) => (
                                                    <div key={i} className="flex items-center gap-6">
                                                        <span className="text-primary font-serif font-black text-2xl">0{i+1}</span>
                                                        <span className="text-xs font-black uppercase tracking-[4px]">{place}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-10 bg-primary/5 rounded-[48px] space-y-6 border border-primary/10">
                                            <h4 className="text-2xl font-serif italic text-primary">Essential Skills</h4>
                                            <div className="space-y-4">
                                                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                                    This is a <span className="text-primary font-black uppercase tracking-widest px-2">{tour.difficulty}</span> voyage. Suitable for riders with intermediate to advanced skills who crave rugged beauty and physical challenge.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'inclusions' && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {tour.whatsIncluded?.map((item, i) => (
                                            <div key={i} className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm flex items-center gap-4">
                                                <span className="material-symbols-outlined text-emerald-500 font-black">check_circle</span>
                                                <span className="text-[10px] font-black uppercase tracking-tighter text-slate-600 dark:text-slate-300">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {activeTab === 'equipment' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {tour.equipment?.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                                <span className="text-xs font-black uppercase tracking-widest">{item}</span>
                                                <span className="material-symbols-outlined text-primary">verified</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Side: Floating High-Status Widget */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 glass-card rounded-[64px] p-12 space-y-12">
                            <div className="space-y-4 border-b border-black/5 dark:border-white/5 pb-10">
                                <p className="text-[10px] font-black text-primary uppercase tracking-[8px]">Availability Limited</p>
                                <div className="flex flex-col">
                                    <span className="text-6xl font-serif font-black text-slate-900 dark:text-white">₹{tour.pricing?.perPerson?.toLocaleString() || 'Custom'}</span>
                                    <span className="text-slate-400 font-bold text-sm italic mt-2">Premium Individual Cabin / Ride</span>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 text-emerald-600">
                                        <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[14px] font-black">verified_user</span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Guaranteed Best Price</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-500">
                                        <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[14px] font-black">history</span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Flexible Re-scheduling</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setIsQueryModalOpen(true)}
                                    className="w-full py-6 bg-slate-900 dark:bg-primary text-white rounded-full font-black text-sm uppercase tracking-[4px] shadow-2xl hover:bg-slate-800 dark:hover:bg-white dark:hover:text-primary transition-all group overflow-hidden relative"
                                >
                                    <span className="relative z-10">Initiate Inquiry</span>
                                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                                </button>

                                <div className="text-center pt-6">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] mb-6 underline decoration-primary/30 underline-offset-8">Talk to an Adventurer</p>
                                    <div className="flex justify-center gap-10">
                                        <a href="https://wa.me/916005159433" className="group flex flex-col items-center gap-2">
                                            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-xl group-hover:-translate-y-2">
                                                <i className="fa-brands fa-whatsapp text-2xl"></i>
                                            </div>
                                            <span className="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">WhatsApp</span>
                                        </a>
                                        <a href="tel:+916005159433" className="group flex flex-col items-center gap-2">
                                            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-xl group-hover:-translate-y-2">
                                                <span className="material-symbols-outlined text-2xl font-black">call</span>
                                            </div>
                                            <span className="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Call Instantly</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Voyages */}
                {relatedTours.length > 0 && (
                    <section className="mt-40 pt-40 border-t border-slate-100 dark:border-slate-800 space-y-16">
                        <div className="flex justify-between items-end">
                            <div className="space-y-4">
                                <h2 className="text-[10px] font-black uppercase tracking-[8px] text-primary">Discover More</h2>
                                <h3 className="text-5xl font-serif font-black leading-tight">Similar <span className="text-primary italic">Expeditions</span></h3>
                            </div>
                            <Link to="/tours/bike-tours" className="px-10 py-4 border border-slate-200 dark:border-slate-800 rounded-full text-[10px] font-black uppercase tracking-[4px] hover:bg-slate-900 hover:text-white transition-all">View All Voyages</Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {relatedTours.map((t, index) => (
                                <Link 
                                    key={t._id} 
                                    to={`/tours/bike-tours/${t.slug}`} 
                                    className="group space-y-6"
                                >
                                    <div className="aspect-[16/10] rounded-[40px] overflow-hidden shadow-xl group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] transition-all duration-700">
                                        <img src={t.mainImage} alt={t.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                                    </div>
                                    <div className="space-y-2 px-4">
                                        <p className="text-primary text-[10px] font-black uppercase tracking-[4px]">{t.destination}</p>
                                        <h4 className="text-2xl font-serif font-black text-slate-800 dark:text-white group-hover:text-primary transition-colors">{t.title}</h4>
                                        <p className="text-slate-400 font-black text-xs">₹{t.pricing?.perPerson?.toLocaleString() || 'Custom'}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* Consult Specialist Modal */}
            <ConsultSpecialistModal isOpen={isQueryModalOpen} onClose={() => setIsQueryModalOpen(false)} tourTitle={tour.title} />
        </div>
    );
};

export default BikeTourDetailView;
