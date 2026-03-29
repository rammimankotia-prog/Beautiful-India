import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const BikeTourCard = ({ tour }) => {
    return (
        <div className="group bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
            <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                    src={tour.mainImage} 
                    alt={tour.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-[#0a6c75]">
                        {tour.duration}
                    </span>
                    {tour.difficulty && (
                        <span className={`px-3 py-1 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white ${
                            tour.difficulty === 'Easy' ? 'bg-emerald-500/80' :
                            tour.difficulty === 'Moderate' ? 'bg-amber-500/80' :
                            'bg-rose-500/80'
                        }`}>
                            {tour.difficulty}
                        </span>
                    )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white/80 text-[10px] font-black uppercase tracking-[3px] mb-1">
                        {tour.destination}, {tour.country}
                    </p>
                    <h3 className="text-white text-xl font-black leading-tight group-hover:text-primary transition-colors">
                        {tour.title}
                    </h3>
                </div>
            </div>
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 italic">Starting from</p>
                        <p className="text-2xl font-black text-slate-800 dark:text-white">
                            <span className="text-xs mr-1 text-[#0a6c75]">₹</span>
                            {tour.pricing?.perPerson || tour.pricing?.perGroup?.price || 'Quote'}
                        </p>
                    </div>
                    <Link 
                        to={`/tours/bike-tours/${tour.slug}`}
                        className="flex items-center gap-2 px-6 py-3 bg-[#0a6c75] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-[#0a6c75]/20"
                    >
                        View Tour
                        <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
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
    
    // Filters state
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Hero Section */}
            <header className="relative py-20 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/40 via-transparent to-transparent"></div>
                </div>
                <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center space-y-6">
                    <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary rounded-full text-[10px] font-black uppercase tracking-[4px] border border-primary/30">
                        Bicycle Adventures
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                        Eco-Friendly <span className="text-primary italic">Journeys</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-slate-400 font-bold italic text-lg md:text-xl">
                        Explore the hidden gems of India on two wheels. From the majestic Himalayas to the serene backwaters of Kerala.
                    </p>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-6 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    {/* Sidebar Filters */}
                    <aside className="lg:col-span-1 space-y-8">
                        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-xl sticky top-24">
                            <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <h2 className="text-lg font-black uppercase tracking-widest text-[#0a6c75]">Filters</h2>
                                <button 
                                    onClick={() => setFilters({ country: '', destination: '', tourType: '' })}
                                    className="text-[10px] font-black text-slate-400 uppercase hover:text-primary"
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="space-y-8">
                                {/* Country Filter */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Country</label>
                                    <div className="flex flex-col gap-2">
                                        <button 
                                            onClick={() => updateFilter('country', '')}
                                            className={`text-left px-4 py-2 rounded-xl text-xs font-bold transition-all ${!filters.country ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-500 hover:bg-slate-50'}`}
                                        >
                                            All Countries
                                        </button>
                                        {countries.map(c => (
                                            <button 
                                                key={c}
                                                onClick={() => updateFilter('country', c)}
                                                className={`text-left px-4 py-2 rounded-xl text-xs font-bold transition-all ${filters.country === c ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-500 hover:bg-slate-50'}`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Destination Filter */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destination</label>
                                    <select 
                                        value={filters.destination}
                                        onChange={(e) => updateFilter('destination', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold outline-none"
                                    >
                                        <option value="">All Destinations</option>
                                        {destinations.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tour Type */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bicycle Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Bike', 'Bicycle'].map(type => (
                                            <button 
                                                key={type}
                                                onClick={() => updateFilter('tourType', filters.tourType === type ? '' : type)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all ${filters.tourType === type ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-400 hover:border-primary'}`}
                                            >
                                                {type === 'Bicycle' ? 'Cycling' : 'Motorbike'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="flex flex-wrap justify-between items-center mb-10 gap-4">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                                    {loading ? 'Searching...' : `${tours.length} Experiences Found`}
                                </h2>
                                <p className="text-slate-500 text-sm font-bold italic">Curated bicycle tours for every skill level.</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[1, 2, 4].map(i => (
                                    <div key={i} className="aspect-[4/5] bg-slate-100 dark:bg-slate-900 rounded-[32px] animate-pulse"></div>
                                ))}
                            </div>
                        ) : tours.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                                {tours.map(tour => (
                                    <BikeTourCard key={tour._id} tour={tour} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-40 space-y-6">
                                <span className="material-symbols-outlined text-7xl text-slate-200">pedal_bike</span>
                                <h3 className="text-2xl font-black text-slate-400 italic">No bicycle tours found in this region.</h3>
                                <button 
                                    onClick={() => setFilters({ country: '', destination: '', tourType: '' })}
                                    className="px-8 py-3 bg-primary text-white rounded-full font-black uppercase text-xs tracking-widest"
                                >
                                    Browse All Adventures
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BikeTourListingPage;
