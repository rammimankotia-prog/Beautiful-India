import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const BikeTourCard = ({ tour, index }) => {
    return (
        <div 
            className="group bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-4 transition-all duration-700 animate-fade-up"
            style={{ animationDelay: `${index * 150}ms` }}
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                    src={tour.mainImage} 
                    alt={tour.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700"></div>
                
                <div className="absolute top-6 left-6 flex gap-2">
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-[10px] font-black uppercase tracking-[2px] text-white">
                        {tour.duration}
                    </span>
                    {tour.tourType === 'Bike' && (
                        <span className="px-4 py-2 bg-primary/80 backdrop-blur-xl border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-[2px] text-white">
                            Motorbike
                        </span>
                    )}
                </div>

                <div className="absolute bottom-8 left-8 right-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-700">
                    <p className="text-primary text-[10px] font-black uppercase tracking-[4px] mb-2">{tour.destination}</p>
                    <h3 className="text-white text-2xl font-serif font-black leading-tight">
                        {tour.title}
                    </h3>
                </div>
            </div>
            
            <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[3px] mb-1">Starting from</p>
                        <p className="text-3xl font-serif font-black text-slate-900 dark:text-white">
                            <span className="text-lg mr-1 text-primary">₹</span>
                            {tour.pricing?.perPerson || tour.pricing?.perGroup?.price || 'Quote'}
                        </p>
                    </div>
                    <Link 
                        to={`/tours/bike-tours/${tour.slug}`}
                        className="w-14 h-14 bg-slate-900 dark:bg-primary flex items-center justify-center text-white rounded-full hover:bg-primary dark:hover:bg-white dark:hover:text-primary transition-all shadow-xl shadow-primary/20 rotate-[-45deg] hover:rotate-0"
                    >
                        <span className="material-symbols-outlined font-black">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const BikeTourListingPage = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [filters, setFilters] = useState({
        country: searchParams.get('country') || '',
        destination: searchParams.get('destination') || '',
        tourType: searchParams.get('tourType') || ''
    });

    const fetchTours = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams(filters).toString();
            const response = await fetch(`/api/v1/bike-tours?${query}`);
            const data = await response.json();
            setTours(data);
        } catch (error) {
            console.error('Error fetching bike tours:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTours();
    }, [filters]);

    const updateFilter = (name, value) => {
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        setSearchParams(newFilters);
    };

    const countries = [...new Set(tours.map(t => t.country))];
    const destinations = [...new Set(tours.map(t => t.destination))];

    return (
        <div className="min-h-screen bg-background-light dark:bg-slate-950 pb-40">
            {/* Cinematic Hero */}
            <header className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1444491741275-3747c53c99b4?auto=format&fit=crop&q=80" 
                        className="w-full h-full object-cover opacity-60 scale-105 animate-zoom-in"
                        alt="Adventure Hero"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950"></div>
                </div>

                <div className="relative z-10 text-center space-y-8 max-w-4xl px-6">
                    <span className="inline-block px-6 py-2 bg-primary/20 backdrop-blur-xl border border-primary/30 text-primary rounded-full text-[10px] font-black uppercase tracking-[6px] animate-fade-up">
                        Boundless Horizons
                    </span>
                    <h1 className="text-6xl md:text-9xl font-serif font-black text-white tracking-tighter animate-fade-up" style={{ animationDelay: '200ms' }}>
                        The Art of <span className="text-primary italic">Adventure</span>
                    </h1>
                    <p className="text-slate-300 text-lg md:text-2xl font-medium leading-relaxed max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '400ms' }}>
                        Curated two-wheeled expeditions through India's most breathtaking landscapes. From Himalayan peaks to tropical shores.
                    </p>
                    <div className="pt-10 animate-fade-up" style={{ animationDelay: '600ms' }}>
                        <span className="material-symbols-outlined text-white text-5xl animate-bounce">expand_more</span>
                    </div>
                </div>
            </header>

            <main className="max-w-[1500px] mx-auto px-6 -mt-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Glassmorphism Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="glass-card rounded-[48px] p-10 sticky top-24 border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
                            <div className="flex items-center justify-between mb-12">
                                <h2 className="text-2xl font-serif font-black text-slate-800 dark:text-white">Curate</h2>
                                <button 
                                    onClick={() => setFilters({ country: '', destination: '', tourType: '' })}
                                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-slate-900 transition-colors"
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="space-y-12">
                                {/* Country */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Territory</label>
                                    <div className="flex flex-col gap-3">
                                        <button 
                                            onClick={() => updateFilter('country', '')}
                                            className={`text-left px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${!filters.country ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-white/5'}`}
                                        >
                                            Everywhere
                                        </button>
                                        {countries.map(c => (
                                            <button 
                                                key={c}
                                                onClick={() => updateFilter('country', c)}
                                                className={`text-left px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${filters.country === c ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-white/5'}`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Destination Selector */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Enclave</label>
                                    <select 
                                        value={filters.destination}
                                        onChange={(e) => updateFilter('destination', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest outline-none focus:border-primary transition-colors text-slate-700 dark:text-slate-200"
                                    >
                                        <option value="">All Destinations</option>
                                        {destinations.map(d => (
                                            <option key={d} value={d} className="bg-slate-900">{d}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tour Type */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Expedition Mode</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { id: 'Bicycle', label: 'Cycling', icon: 'pedal_bike' },
                                            { id: 'Bike', label: 'Motorbike', icon: 'two_wheeler' }
                                        ].map(type => (
                                            <button 
                                                key={type.id}
                                                onClick={() => updateFilter('tourType', filters.tourType === type.id ? '' : type.id)}
                                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all group ${filters.tourType === type.id ? 'bg-slate-900 text-white shadow-2xl' : 'text-slate-500 hover:bg-white/5 border border-transparent hover:border-white/10'}`}
                                            >
                                                <span className={`material-symbols-outlined text-lg ${filters.tourType === type.id ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>{type.icon}</span>
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Listing */}
                    <div className="lg:col-span-3">
                        <div className="flex flex-wrap justify-between items-end mb-16 gap-6">
                            <div className="animate-fade-up">
                                <h2 className="text-4xl font-serif font-black text-slate-900 dark:text-white mb-2 leading-none">
                                    {loading ? 'Sourcing Experiences...' : `${tours.length} Voyages Found`}
                                </h2>
                                <p className="text-slate-500 font-medium italic">Hand-crafted adventures for the connoisseur of travel.</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {[1, 2, 4].map(i => (
                                    <div key={i} className="aspect-[4/5] bg-slate-100 dark:bg-slate-900 rounded-[48px] animate-pulse"></div>
                                ))}
                            </div>
                        ) : tours.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 xl:gap-16">
                                {tours.map((tour, index) => (
                                    <BikeTourCard key={tour._id} tour={tour} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-40 space-y-10 glass-card rounded-[64px]">
                                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto animate-float">
                                    <span className="material-symbols-outlined text-5xl text-slate-200">route</span>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-serif font-black text-slate-400">The path is currently being charted.</h3>
                                    <p className="text-slate-500 font-medium">No voyages match your current criteria. Broaden your horizon?</p>
                                </div>
                                <button 
                                    onClick={() => setFilters({ country: '', destination: '', tourType: '' })}
                                    className="px-12 py-5 bg-primary text-white rounded-full font-black uppercase text-xs tracking-[4px] shadow-2xl shadow-primary/30 hover:bg-slate-900 transition-all"
                                >
                                    Browse All Adventures
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Specialist CTA */}
            <div className="fixed bottom-10 right-10 z-[100] group">
                <div className="absolute right-full mr-4 bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                    <div className="bg-slate-900 text-white px-6 py-4 rounded-3xl whitespace-nowrap shadow-2xl border border-white/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Tailor-made</p>
                        <p className="text-sm font-bold">Consult a Travel Specialist</p>
                    </div>
                </div>
                <button className="w-20 h-20 bg-primary text-white rounded-full shadow-[0_20px_50px_rgba(13,148,136,0.4)] flex items-center justify-center hover:scale-110 transition-transform active:scale-95 animate-float">
                    <span className="material-symbols-outlined text-3xl font-black">support_agent</span>
                </button>
            </div>
        </div>
    );
};

export default BikeTourListingPage;
