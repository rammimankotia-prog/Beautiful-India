import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const PilgrimageCard = ({ tour, index }) => {
    // Generate urgency badge based on ongoing or dates
    const isOngoing = tour.tour_dates_ongoing === 'true';
    const hasDates = tour.tour_dates_start && tour.tour_dates_end;
    
    // Status text
    let badgeText = "Booking Open";
    let badgeColor = "bg-green-500";
    if (!isOngoing && hasDates) {
        const start = new Date(tour.tour_dates_start);
        const diffDays = Math.ceil((start - new Date()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) {
            badgeText = "Departed";
            badgeColor = "bg-slate-500";
        } else if (diffDays <= 30) {
            badgeText = "Filling Fast";
            badgeColor = "bg-red-500 animate-pulse";
        } else {
            badgeText = "Seats Available";
            badgeColor = "bg-orange-500";
        }
    } else if (isOngoing) {
        badgeText = "Daily Departures";
        badgeColor = "bg-primary";
    }

    const mainImage = tour.tour_gallery && tour.tour_gallery.length > 0 ? tour.tour_gallery[0] : 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80';

    return (
        <div 
            className="group bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 flex flex-col h-full"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                    src={mainImage} 
                    alt={tour.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700"></div>
                
                {/* Urgency Badge */}
                <div className="absolute top-6 left-6">
                    <span className={`px-4 py-2 ${badgeColor} backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[2px] text-white shadow-lg`}>
                        {badgeText}
                    </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-orange-400 text-[10px] font-black uppercase tracking-[3px] mb-2">
                        {tour.tour_destination?.[0] || 'India'}
                    </p>
                    <h3 className="text-white text-2xl font-serif font-bold leading-tight drop-shadow-md">
                        {tour.title}
                    </h3>
                </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <span className="material-symbols-outlined text-[18px]">event</span>
                        <span className="font-medium text-xs">
                           {isOngoing ? 'Flexible Dates' : hasDates ? `${new Date(tour.tour_dates_start).toLocaleDateString('en-GB')} - ${new Date(tour.tour_dates_end).toLocaleDateString('en-GB')}` : 'TBA'}
                        </span>
                    </div>
                    {tour.tour_city_path && (
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 col-span-2">
                            <span className="material-symbols-outlined text-[18px]">route</span>
                            <span className="font-medium text-xs truncate" title={tour.tour_city_path}>
                                {tour.tour_city_path.replace(/,/g, ' → ')}
                            </span>
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
                    <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[2px] mb-1">Starting from</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">
                            {tour.tour_price_single ? (
                                <>
                                    <span className="text-sm mr-1 text-primary">₹</span>
                                    {Number(tour.tour_price_single).toLocaleString('en-IN')}
                                </>
                            ) : 'Quote'}
                        </p>
                    </div>
                    <Link 
                        to={`/pilgrimage-tours/${tour.slug}`}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-[11px] font-black uppercase tracking-wider transition-colors shadow-lg shadow-red-600/30"
                    >
                        View Yatra
                    </Link>
                </div>
            </div>
        </div>
    );
};

const PilgrimageToursListingPage = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [filters, setFilters] = useState({
        destination: searchParams.get('destination') || '',
        tourType: searchParams.get('tourType') || ''
    });

    const fetchTours = async () => {
        setLoading(true);
        try {
            // Target the sandboxed JSON
            const response = await fetch(`${import.meta.env.BASE_URL}data/pk_pilgrimage_tours.json?t=${Date.now()}`);
            if (!response.ok) throw new Error('File not found');
            let data = await response.json();
            
            // Apply filtering logic
            if (filters.destination) {
                data = data.filter(t => t.tour_destination?.includes(filters.destination));
            }
            if (filters.tourType) {
                data = data.filter(t => t.tour_type?.includes(filters.tourType));
            }
            
            // Exclude drafts/trashed
            data = data.filter(t => t.status === 'publish');
            
            setTours(data);
        } catch (error) {
            console.error('Error fetching pilgrimage tours:', error);
            setTours([]); // fallback
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

    // Extract dynamic filters from all active tours (we could memoize this if we fetched all tours separately, but for MVP it's fine)
    // Actually, to get all possible destinations we should fetch them once without filters.
    // For now, we will hardcode the most popular or use a separate state to store ALL tours before filtering
    const [allDestinations, setAllDestinations] = useState([]);
    const [allTypes, setAllTypes] = useState([]);

    useEffect(() => {
         const fetchAll = async () => {
             try {
                const response = await fetch(`${import.meta.env.BASE_URL}data/pk_pilgrimage_tours.json?t=${Date.now()}`);
                const data = await response.json();
                const dSet = new Set();
                const tSet = new Set();
                data.forEach(t => {
                    t.tour_destination?.forEach(d => dSet.add(d));
                    t.tour_type?.forEach(type => tSet.add(type));
                });
                setAllDestinations(Array.from(dSet));
                setAllTypes(Array.from(tSet));
             } catch(e) {}
         };
         fetchAll();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Spiritual Hero Section */}
            <header className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-orange-950">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80" 
                        className="w-full h-full object-cover opacity-50 contrast-125"
                        alt="Pilgrimage India"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-900/40 via-transparent to-slate-950/90"></div>
                </div>

                <div className="relative z-10 text-center space-y-6 max-w-4xl px-4 mt-16 text-white text-shadow-sm">
                    <span className="inline-block px-5 py-1.5 border-2 border-orange-500/50 text-orange-300 rounded-full text-[10px] font-black uppercase tracking-[4px] bg-black/40 backdrop-blur-md">
                        Spiritual Journeys
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-widest drop-shadow-xl">
                        Sacred <span className="text-orange-400">Yatras</span>
                    </h1>
                    <p className="text-orange-100/80 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                        Embark on a divine journey across India's most holy destinations. Hand-picked spiritual experiences with expert guidance and premium care.
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-8 -mt-16 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 sticky top-24 border border-slate-200 dark:border-slate-800 shadow-xl shadow-black/5">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-serif font-black text-slate-800 dark:text-white uppercase tracking-widest">Filter Yatras</h2>
                                {(filters.destination || filters.tourType) && (
                                    <button 
                                        onClick={() => updateFilter('destination', '') & updateFilter('tourType', '')}
                                        className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            <div className="space-y-8">
                                {/* Destinations */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-400">Sacred Region</label>
                                    <div className="flex flex-col gap-2">
                                        <button 
                                            onClick={() => updateFilter('destination', '')}
                                            className={`text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${!filters.destination ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                        >
                                            All Regions
                                        </button>
                                        {allDestinations.map(d => (
                                            <button 
                                                key={d}
                                                onClick={() => updateFilter('destination', d)}
                                                className={`text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${filters.destination === d ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Yatra Types */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-400">Yatra Type</label>
                                    <div className="flex flex-col gap-2">
                                        {allTypes.map(type => (
                                            <button 
                                                key={type}
                                                onClick={() => updateFilter('tourType', filters.tourType === type ? '' : type)}
                                                className={`text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${filters.tourType === type ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400' : 'border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Listing */}
                    <div className="lg:col-span-3">
                        <div className="mb-8">
                            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white uppercase tracking-widest">
                                {loading ? 'Seeking...' : `Available Packages (${tours.length})`}
                            </h2>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="aspect-[3/4] bg-slate-200 dark:bg-slate-800 rounded-[32px] animate-pulse"></div>
                                ))}
                            </div>
                        ) : tours.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
                                {tours.map((tour, index) => (
                                    <PilgrimageCard key={tour.id} tour={tour} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
                                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4 inline-block">self_improvement</span>
                                <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300 mb-2">No Yatras Found</h3>
                                <p className="text-slate-400 text-sm mb-6">We couldn't find any pilgrimages matching your criteria.</p>
                                <button 
                                    onClick={() => { updateFilter('destination', ''); updateFilter('tourType', ''); }}
                                    className="px-6 py-2.5 bg-orange-500 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PilgrimageToursListingPage;
