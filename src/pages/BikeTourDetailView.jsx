import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import QueryModal from '../components/QueryModal';

const BikeTourDetailView = () => {
    const { slug } = useParams();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

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
            }
        } catch (error) {
            console.error('Error fetching bike tour:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTour();
        return () => {
            const schemaScript = document.getElementById('tour-schema');
            if (schemaScript) schemaScript.remove();
        };
    }, [slug]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Preparing your adventure...</p>
            </div>
        );
    }

    if (!tour) {
        return (
            <div className="text-center py-40 space-y-6">
                <span className="material-symbols-outlined text-7xl text-slate-200">sentiment_dissatisfied</span>
                <h2 className="text-3xl font-black text-slate-800">Tour Not Found</h2>
                <Link to="/tours/bike-tours" className="inline-block px-8 py-3 bg-primary text-white rounded-full font-black uppercase text-xs tracking-widest">Back to Listings</Link>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen pb-20">
            {/* Gallery Section */}
            <section className="max-w-[1400px] mx-auto px-6 pt-10 grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px]">
                <div className="md:col-span-2 h-full rounded-[32px] overflow-hidden shadow-2xl group relative">
                    <img src={tour.mainImage} alt={tour.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-10 left-10 right-10">
                        <span className="px-4 py-1.5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-[4px] mb-4 inline-block">Featured Voyage</span>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">{tour.title}</h1>
                    </div>
                </div>
                <div className="hidden md:grid grid-cols-2 grid-rows-2 col-span-2 gap-4 h-full">
                    {(tour.images?.slice(1, 5) || []).map((img, i) => (
                        <div key={i} className="rounded-[24px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group relative">
                            <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        </div>
                    ))}
                    {(!tour.images || tour.images.length < 5) && [1,2,3,4].slice(tour.images?.length - 1 || 0).map(i => (
                         <div key={i} className="rounded-[24px] bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-300">
                             <span className="material-symbols-outlined text-4xl">image</span>
                         </div>
                    ))}
                </div>
            </section>

            {/* Main Content Layout */}
            <main className="max-w-[1400px] mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Left Side: Details */}
                <div className="lg:col-span-2 space-y-16">
                    {/* Tour Meta */}
                    <div className="flex flex-wrap gap-8 items-center border-b border-slate-100 dark:border-slate-800 pb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">schedule</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</p>
                                <p className="text-sm font-black text-slate-800 dark:text-white uppercase">{tour.duration}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <span className="material-symbols-outlined">network_check</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Difficulty</p>
                                <p className="text-sm font-black text-slate-800 dark:text-white uppercase">{tour.difficulty || 'Moderate'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <span className="material-symbols-outlined">directions_bike</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tour Type</p>
                                <p className="text-sm font-black text-slate-800 dark:text-white uppercase">{tour.tourType || 'Bicycle'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Highlights Section */}
                    {tour.highlights?.length > 0 && (
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Experience <span className="text-primary italic">Highlights</span></h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {tour.highlights.map((h, i) => (
                                    <li key={i} className="flex gap-4 items-start bg-slate-50 dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                        <span className="material-symbols-outlined text-primary font-black">check_circle</span>
                                        <p className="text-slate-600 dark:text-slate-300 font-bold leading-relaxed">{h}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Main Description (HTML Article) */}
                    <section className="space-y-8 prose dark:prose-invert max-w-none prose-h2:text-3xl prose-h2:font-black prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-loose prose-p:font-medium">
                        <div dangerouslySetInnerHTML={{ __html: tour.content }} />
                    </section>

                    {/* Equipment Section */}
                    {tour.equipment?.length > 0 && (
                        <section className="p-10 bg-slate-900 rounded-[40px] text-white space-y-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 opacity-10 blur-2xl">
                                <span className="material-symbols-outlined text-[300px]">pedal_bike</span>
                            </div>
                            <h2 className="text-3xl font-black tracking-tight relative z-10">Professional <span className="text-primary">Gear</span> Included</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
                                {tour.equipment.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined text-xl">verified</span>
                                        </div>
                                        <span className="font-black uppercase tracking-widest text-xs">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Places Covered */}
                    {tour.coveredPlaces?.length > 0 && (
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">The <span className="text-primary italic">Route</span> We Cycle</h2>
                            <div className="flex flex-wrap gap-4">
                                {tour.coveredPlaces.map((place, i) => (
                                    <React.Fragment key={i}>
                                        <div className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                                            <p className="text-sm font-black text-slate-700 dark:text-slate-200">{place}</p>
                                        </div>
                                        {i < tour.coveredPlaces.length - 1 && (
                                            <div className="flex items-center text-slate-300">
                                                <span className="material-symbols-outlined">trending_flat</span>
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Side: Sticky Booking Widget */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Private Experience</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-slate-800 dark:text-white">₹{tour.pricing?.perPerson || 'Custom'}</span>
                                <span className="text-slate-400 font-bold text-sm italic">per person</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                                <div className="flex items-center gap-3 text-emerald-600">
                                    <span className="material-symbols-outlined text-sm">bolt</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Instant Confirmation Available</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500">
                                    <span className="material-symbols-outlined text-sm">history_edu</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Free Cancellation (24h Notice)</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => setIsQueryModalOpen(true)}
                                className="w-full py-5 bg-primary text-white rounded-[24px] font-black text-sm uppercase tracking-[2px] shadow-xl shadow-primary/30 hover:bg-black transition-all transform hover:-translate-y-1 active:translate-y-0"
                            >
                                Check Availability
                            </button>

                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connect with an Expert</p>
                                <div className="flex justify-center gap-6 mt-4">
                                    <a href="https://wa.me/91XXXXXXXXXX" className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                        <i className="fa-brands fa-whatsapp text-lg"></i>
                                    </a>
                                    <a href="tel:+91XXXXXXXXXX" className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                        <span className="material-symbols-outlined text-lg">call</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* What's Included Quick Look */}
                        {tour.whatsIncluded?.length > 0 && (
                            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">What's Included</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {tour.whatsIncluded.slice(0, 4).map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-slate-500">
                                            <span className="material-symbols-outlined text-[14px]">done</span>
                                            <span className="text-[10px] font-bold uppercase tracking-tight">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Query Modal */}
            <QueryModal isOpen={isQueryModalOpen} onClose={() => setIsQueryModalOpen(false)} tourTitle={tour.title} />
        </div>
    );
};

export default BikeTourDetailView;
