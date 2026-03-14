import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

// Smarter slug matching: tries exact slug, then checks if stateRegion contains the slug words
const findTourBySlug = (tours, slug) => {
    if (!slug) return null;
    const decoded = decodeURIComponent(slug).toLowerCase();
    let match = tours.find(t => t.stateRegion && t.stateRegion.toLowerCase().replace(/\s+/g, '-') === decoded);
    if (match) return match;
    match = tours.find(t => t.stateRegion && t.stateRegion.toLowerCase().includes(decoded));
    if (match) return match;
    match = tours.find(t => t.stateRegion && decoded.includes(t.stateRegion.toLowerCase()));
    return match || null;
};

const ToursDiscoveryFiltering1 = () => {
    const { regionSlug } = useParams();
    const [searchParams] = useSearchParams();
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const { formatPrice, getLocalAmount, convertToUsd } = useCurrency();

    // Filter states
    const [destination, setDestination] = useState('Any Destination');
    const [stateRegion, setStateRegion] = useState('All States');
    const [themeFilters, setThemeFilters] = useState([]);
    const [travelStyle, setTravelStyle] = useState('Any');
    const [budgetUsd, setBudgetUsd] = useState(500000);
    const [durationFilters, setDurationFilters] = useState([]);
    const [visibleCount, setVisibleCount] = useState(6);
    const [isDurationOpen, setIsDurationOpen] = useState(true);
    const [compareList, setCompareList] = useState([]);

    // Apply URL query params on mount: ?theme=honeymoon  /  ?destination=Kashmir
    useEffect(() => {
        const urlTheme = searchParams.get('theme');
        const urlDest  = searchParams.get('destination');
        if (urlTheme) setThemeFilters([urlTheme.toLowerCase()]);
        if (urlDest)  setStateRegion(urlDest);
    }, []);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/tours.json`)
            .then(res => res.json())
            .then(data => {
                setTours(data);
                if (regionSlug) {
                    const matchedTour = findTourBySlug(data, regionSlug);
                    if (matchedTour) {
                        setDestination(matchedTour.destination || 'Any Destination');
                        setStateRegion(matchedTour.stateRegion);
                    }
                }
                setLoading(false);
            })
            .catch(err => { console.error("Failed to fetch tours:", err); setLoading(false); });
    }, []);

    useEffect(() => {
        if (regionSlug && tours.length > 0) {
            const matchedTour = findTourBySlug(tours, regionSlug);
            if (matchedTour) {
                setDestination(matchedTour.destination || 'Any Destination');
                setStateRegion(matchedTour.stateRegion);
            }
        } else if (!regionSlug && !searchParams.get('destination')) {
            setDestination('Any Destination');
            setStateRegion('All States');
        }
    }, [regionSlug, tours]);


    const handleThemeChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setThemeFilters([...themeFilters, value]);
        } else {
            setThemeFilters(themeFilters.filter(t => t !== value));
        }
    };

    const handleDurationChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setDurationFilters([...durationFilters, value]);
        } else {
            setDurationFilters(durationFilters.filter(d => d !== value));
        }
    };

    const resetFilters = () => {
        if (regionSlug && tours.length > 0) {
            const matchedTour = findTourBySlug(tours, regionSlug);
            if (matchedTour) {
                setDestination(matchedTour.destination || 'Any Destination');
                setStateRegion(matchedTour.stateRegion);
            } else {
                setDestination('Any Destination');
                setStateRegion('All States');
            }
        } else {
            setDestination('Any Destination');
            setStateRegion('All States');
        }
        setThemeFilters([]);
        setTravelStyle('Any');
        setBudgetUsd(500000); 
        setDurationFilters([]);
        setVisibleCount(6);
    };

    const filteredTours = tours.filter(tour => {
        
        if (destination !== 'Any Destination' && tour.destination) {
             if (tour.destination.toLowerCase() !== destination.toLowerCase()) return false;
        }

        if (stateRegion !== 'All States') {
             if (!tour.stateRegion || tour.stateRegion.toLowerCase() !== stateRegion.toLowerCase()) return false;
        }
        
        if (themeFilters.length > 0) {
            const hasTheme = themeFilters.some(theme => 
                (tour.theme && tour.theme.toLowerCase() === theme.toLowerCase()) || 
                (tour.nature && tour.nature.toLowerCase() === theme.toLowerCase())
            );
            if (!hasTheme) return false;
        }

        if (travelStyle) {
            const tStyle = tour.style || 'Group'; // default
            if (tStyle.toLowerCase() !== travelStyle.toLowerCase() && travelStyle !== 'Any') return false;
        }

        if (durationFilters.length > 0) {
            if (!tour.duration) return false;
            const days = parseInt(tour.duration, 10);
            if (!isNaN(days)) {
                const matches = durationFilters.some(filter => {
                    if (filter === '1 to 3') return days >= 1 && days <= 3;
                    if (filter === '4 to 6') return days >= 4 && days <= 6;
                    if (filter === '7 to 9') return days >= 7 && days <= 9;
                    if (filter === '10 to 12') return days >= 10 && days <= 12;
                    if (filter === '13 or more') return days >= 13;
                    return false;
                });
                if (!matches) return false;
            } else {
                return false;
            }
        }

        if (tour.price > budgetUsd) {
            return false;
        }

        return true;
    });

    const processedTours = filteredTours.slice(0, visibleCount);

    const mockLocations = ["Cappadocia, Turkey", "Paris, France", "Bali, Indonesia"];

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6);
    };

    const toggleCompare = (tour) => {
        setCompareList(prev => {
            const isSelected = prev.some(t => t.id === tour.id);
            if (isSelected) {
                return prev.filter(t => t.id !== tour.id);
            } else {
                if (prev.length >= 4) {
                    alert('You can compare a maximum of 4 packages at a time.');
                    return prev;
                }
                return [...prev, tour];
            }
        });
    };

    return (
        <div data-page="tours_discovery_filtering_1" className="min-h-screen bg-[#f4f7f6]">
            {/* Hero Banner — shown for destination slug OR query param filters */}
            {(regionSlug && stateRegion !== 'All States') || searchParams.get('theme') || searchParams.get('destination') ? (
                <div
                    className="relative py-14 px-6 text-center overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #0a6c75 0%, #065f46 100%)' }}
                >
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <Link to="/" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-[13px] font-bold mb-4 transition-colors">
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            Back to Bharat Darshan
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-2" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.25)' }}>
                            {searchParams.get('theme')
                                ? `${searchParams.get('theme').charAt(0).toUpperCase() + searchParams.get('theme').slice(1)} Tour Packages`
                                : searchParams.get('destination')
                                    ? `${searchParams.get('destination')} Tour Packages`
                                    : `${stateRegion} Tour Packages`}
                        </h1>
                        <div className="flex flex-wrap justify-center gap-2 mt-3 mb-2">
                            {themeFilters.map(t => (
                                <span key={t} className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full capitalize border border-white/30">
                                    🏷️ {t}
                                </span>
                            ))}
                            {stateRegion !== 'All States' && (
                                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
                                    📍 {stateRegion}
                                </span>
                            )}
                        </div>
                        <p className="text-white/80 font-medium text-base">
                            {filteredTours.length > 0
                                ? `${filteredTours.length} handpicked packages — fully customizable, best prices guaranteed`
                                : 'Explore our curated collection of tours'}
                        </p>
                    </div>
                </div>
            ) : null}

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                        <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[22px]">tune</span> 
                            Filter Tours
                        </h2>

                        {/* Destination & State */}
                        <div className="mb-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Destination</label>
                                <div className="relative">
                                    <select 
                                        className="w-full appearance-none border border-gray-300 rounded-lg p-3 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
                                        value={destination}
                                        onChange={(e) => {
                                            setDestination(e.target.value);
                                            setStateRegion('All States'); // Reset state when dest changes
                                        }}
                                    >
                                        <option>Any Destination</option>
                                        {[...new Set(tours.map(t => t.destination).filter(Boolean))].map(dest => (
                                            <option key={dest} value={dest}>{dest}</option>
                                        ))}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xl">expand_more</span>
                                </div>
                            </div>
                            
                            {destination !== 'Any Destination' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">State / Region</label>
                                    <div className="relative">
                                    <select 
                                        className="w-full appearance-none border border-gray-300 rounded-lg p-3 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
                                        value={stateRegion}
                                        onChange={(e) => setStateRegion(e.target.value)}
                                    >
                                        <option>All States</option>
                                        {[...new Set(tours.filter(t => t.destination === destination).map(t => t.stateRegion).filter(Boolean))].map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xl">expand_more</span>
                                </div>
                            </div>
                        )}
                    </div>

                        {/* Theme & Nature */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-800 mb-3">Theme & Nature</label>
                            <div className="space-y-3">
                                {['Adventure', 'Relaxation', 'Cultural', 'Wildlife'].map(theme => (
                                    <label key={theme} className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            value={theme}
                                            checked={themeFilters.includes(theme)}
                                            onChange={handleThemeChange}
                                            className="w-5 h-5 rounded border border-gray-300 text-primary accent-primary cursor-pointer"
                                        />
                                        <span className="text-[15px] text-gray-600 group-hover:text-gray-900 transition-colors">{theme}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Travel Style */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-800 mb-3">Travel Style</label>
                            <div className="space-y-3">
                                        {['Any', 'Group', 'Solo', 'Family', 'Honeymoon'].map(style => (
                                            <label key={style} className="flex items-center gap-3 cursor-pointer group">
                                                <input 
                                                    type="radio" 
                                                    name="travelStyle"
                                                    value={style}
                                                    checked={travelStyle === style}
                                                    onChange={(e) => setTravelStyle(e.target.value)}
                                                    className="w-4 h-4 border-gray-300 text-primary accent-primary cursor-pointer"
                                                />
                                                <span className="text-[15px] text-gray-600 group-hover:text-gray-900 transition-colors">
                                                    {style === 'Any' ? 'All Styles' : style}
                                                </span>
                                            </label>
                                        ))}
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="mb-6">
                            <div 
                                className="flex justify-between items-center mb-4 cursor-pointer group"
                                onClick={() => setIsDurationOpen(!isDurationOpen)}
                            >
                                <label className="text-sm font-semibold text-gray-800 cursor-pointer group-hover:text-primary transition-colors">Duration ( in Days )</label>
                                <span className="material-symbols-outlined text-gray-500 group-hover:text-primary transition-colors">
                                    {isDurationOpen ? 'expand_less' : 'expand_more'}
                                </span>
                            </div>
                            
                            {isDurationOpen && (
                                <div>
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                        {['1 to 3', '4 to 6', '7 to 9', '10 to 12'].map(duration => (
                                            <label key={duration} className="flex items-center gap-3 cursor-pointer group">
                                                <input 
                                                    type="checkbox" 
                                                    value={duration}
                                                    checked={durationFilters.includes(duration)}
                                                    onChange={handleDurationChange}
                                                    className="w-5 h-5 rounded border border-gray-300 text-primary accent-primary cursor-pointer"
                                                />
                                                <span className="text-[15px] text-gray-600 group-hover:text-gray-900 transition-colors">{duration}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="mt-4">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input 
                                                type="checkbox" 
                                                value="13 or more"
                                                checked={durationFilters.includes("13 or more")}
                                                onChange={handleDurationChange}
                                                className="w-5 h-5 rounded border border-gray-300 text-primary accent-primary cursor-pointer"
                                            />
                                            <span className="text-[15px] text-gray-600 group-hover:text-gray-900 transition-colors">13 or more</span>
                                        </label>
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <button 
                                            onClick={() => setDurationFilters([])}
                                            className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors tracking-wide"
                                        >
                                            CLEAR
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Budget */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-semibold text-gray-800">Budget</label>
                                <span className="text-sm font-bold text-primary">{formatPrice(0)} - {formatPrice(budgetUsd)}</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="1000000"
                                step="1000" 
                                value={budgetUsd}
                                onChange={(e) => setBudgetUsd(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between items-center text-xs font-medium text-gray-400 mt-2">
                                <span>{formatPrice(0)}</span>
                                <span>{formatPrice(1000000)}+</span>
                            </div>
                        </div>

                        {/* Reset Filters */}
                        <button 
                            onClick={resetFilters}
                            className="w-full bg-[#EBF4F5] hover:bg-[#dfeeee] text-primary font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">refresh</span>
                            Reset Filters
                        </button>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="mb-8">
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 font-display tracking-tight">
                                {stateRegion !== 'All States' ? `Tours in ${stateRegion}` : 'Discover All Tours'}
                            </h1>
                            <p className="text-[15px] text-[#649a9e] font-medium">Showing {filteredTours.length} tours matching your filters.</p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {processedTours.map((tour, index) => {
                                        const locationStr = [tour.subregion, tour.stateRegion, tour.destination].filter(Boolean).join(', ') || tour.location || mockLocations[index % mockLocations.length];
                                        const themeTag = tour.nature || tour.theme || 'Adventure';
                                        
                                        const tourDestSegment = encodeURIComponent((tour.destination || 'global').toLowerCase().replace(/\s+/g, '-'));
                                        const tourStateSegment = encodeURIComponent((tour.stateRegion || 'state').toLowerCase().replace(/\s+/g, '-'));
                                        const tourSubSegment = encodeURIComponent((tour.subregion || 'subregion').toLowerCase().replace(/\s+/g, '-'));
                                        const tourTitleSegment = encodeURIComponent((tour.title || 'tour').toLowerCase().replace(/\s+/g, '-'));
                                        const detailUrl = `/tours/${tourDestSegment}/${tourStateSegment}/${tourSubSegment}/${tourTitleSegment}`;
                                        
                                        return (
                                            <div key={tour.id} className="bg-white rounded-[20px] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group overflow-hidden">
                                                {/* Image Container */}
                                                <div className="relative h-[220px] overflow-hidden">
                                                    <img 
                                                        src={tour.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80'} 
                                                        alt={tour.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                                    />
                                                    
                                                    {/* Heart Icon */}
                                                    <button className="absolute top-4 right-4 bg-white/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-[#006D77]/80 transition-colors z-10 w-8 h-8 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                                    </button>
                                                    
                                                    {/* Tag */}
                                                    <div className="absolute bottom-4 left-4 bg-[#006D77] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm tracking-wide z-10">
                                                        {themeTag}
                                                    </div>
                                                </div>

                                                {/* Add to Compare */}
                                                <div className="px-5 pt-3">
                                                    <label className="flex items-center gap-2 cursor-pointer group/compare">
                                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${compareList.some(t => t.id === tour.id) ? 'bg-[#ff5a5f] border-[#ff5a5f]' : 'border-gray-300 bg-white group-hover/compare:border-[#ff5a5f]'}`}>
                                                            {compareList.some(t => t.id === tour.id) && <span className="material-symbols-outlined text-white text-[14px] font-black">check</span>}
                                                        </div>
                                                        <input 
                                                            type="checkbox" 
                                                            className="hidden" 
                                                            checked={compareList.some(t => t.id === tour.id)}
                                                            onChange={() => toggleCompare(tour)}
                                                        />
                                                        <span className={`text-[12px] font-bold tracking-wide uppercase ${compareList.some(t => t.id === tour.id) ? 'text-[#ff5a5f]' : 'text-gray-500 group-hover/compare:text-[#ff5a5f]'} transition-colors`}>
                                                            {compareList.some(t => t.id === tour.id) ? 'Added to Compare' : '+ Add to Compare'}
                                                        </span>
                                                    </label>
                                                </div>

                                                {/* Content */}
                                                <div className="p-5 flex flex-col flex-grow">
                                                    <div className="flex items-center gap-1 text-gray-500 text-[13px] font-medium mb-2">
                                                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                        {locationStr}
                                                    </div>
                                                    
                                                    <h3 className="text-[19px] font-bold text-gray-900 mb-4 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                        {tour.title}
                                                    </h3>
                                                    
                                                    <div className="flex items-center gap-5 text-gray-500 text-[13px] font-medium mb-5">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="material-symbols-outlined text-[18px]">schedule</span>
                                                            {tour.duration}
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="material-symbols-outlined text-[18px]">group</span>
                                                            {tour.style || 'Group'}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-auto border-t border-gray-100 pt-4 flex items-end justify-between">
                                                        <div>
                                                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">From</span>
                                                            <span className="text-[22px] font-extrabold text-[#006D77] leading-none">{formatPrice(tour.price, true)}</span>
                                                        </div>
                                                        <Link 
                                                            to={detailUrl}
                                                            className="text-[14px] font-bold text-gray-900 flex items-center gap-1 hover:text-[#006D77] transition-colors"
                                                        >
                                                            View Details
                                                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {filteredTours.length > visibleCount && (
                                    <div className="mt-12 flex justify-center">
                                        <button 
                                            onClick={handleLoadMore}
                                            className="bg-white border border-gray-200 text-gray-800 font-bold py-3 px-8 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">expand_more</span>
                                            Load More Tours
                                        </button>
                                    </div>
                                )}
                                {filteredTours.length === 0 && (
                                    <div className="text-center py-20">
                                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">search_off</span>
                                        <h3 className="text-xl font-bold text-gray-700 mb-2">No tours found</h3>
                                        <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                                        <button 
                                            onClick={resetFilters}
                                            className="mt-6 text-primary font-bold hover:underline"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Sticky Compare Bar */}
            {compareList.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.15)] border-t border-gray-200 z-50 animate-in slide-in-from-bottom-full duration-300">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="bg-[#ff5a5f]/10 text-[#ff5a5f] px-4 py-2 rounded-xl border border-[#ff5a5f]/20">
                                <span className="font-black text-xl">{compareList.length}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest block leading-tight">vs</span>
                            </div>
                            <div className="flex gap-4">
                                {compareList.map(tour => (
                                    <div key={tour.id} className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 border-white shadow-md group">
                                        <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                                        <button 
                                            onClick={() => toggleCompare(tour)}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <span className="material-symbols-outlined text-[12px] font-black">close</span>
                                        </button>
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                                            <p className="text-[8px] text-white font-bold truncate text-center">{tour.title}</p>
                                        </div>
                                    </div>
                                ))}
                                {/* Empty placeholders */}
                                {[...Array(Math.max(0, 4 - compareList.length))].map((_, i) => (
                                    <div key={`empty-${i}`} className="w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 opacity-50">
                                        <span className="material-symbols-outlined text-gray-300">add</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                            <button 
                                onClick={() => setCompareList([])}
                                className="text-sm font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors"
                            >
                                Clear All
                            </button>
                            <Link 
                                to={`/tours/compare?ids=${compareList.map(t => t.id).join(',')}`}
                                className={`w-full md:w-auto px-10 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${compareList.length > 1 ? 'bg-[#ff5a5f] text-white hover:bg-[#e0484d] hover:-translate-y-1 shadow-red-500/30' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                onClick={(e) => { if (compareList.length < 2) e.preventDefault(); }}
                            >
                                <span className="material-symbols-outlined">compare_arrows</span>
                                Compare Now
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToursDiscoveryFiltering1;
