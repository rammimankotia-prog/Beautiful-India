import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

// Smarter slug matching
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

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
        <div className="bg-gray-200 h-52 w-full" />
        <div className="p-5 space-y-3">
            <div className="h-3 bg-gray-200 rounded w-2/3" />
            <div className="h-5 bg-gray-200 rounded w-full" />
            <div className="h-5 bg-gray-200 rounded w-4/5" />
            <div className="flex gap-4 pt-1">
                <div className="h-3 bg-gray-200 rounded w-16" />
                <div className="h-3 bg-gray-200 rounded w-16" />
            </div>
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
        </div>
    </div>
);

// ─── Filter Panel (reused in both sidebar & drawer) ──────────────────────────
const FilterPanel = ({
    tours, destination, setDestination,
    stateRegion, setStateRegion,
    themeFilters, handleThemeChange,
    travelStyle, setTravelStyle,
    durationFilters, handleDurationChange, setDurationFilters,
    budgetUsd, setBudgetUsd,
    formatPrice, resetFilters,
    isDurationOpen, setIsDurationOpen,
}) => (
    <div className="space-y-6">
        {/* Destination */}
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Destination</label>
            <div className="relative">
                <select
                    className="w-full appearance-none border border-gray-200 rounded-xl p-3 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all cursor-pointer font-medium"
                    value={destination}
                    onChange={(e) => { setDestination(e.target.value); setStateRegion('All States'); }}
                >
                    <option>Any Destination</option>
                    {[...new Set(tours.map(t => t.destination).filter(Boolean))].map(dest => (
                        <option key={dest} value={dest}>{dest}</option>
                    ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xl">expand_more</span>
            </div>
        </div>

        {/* State / Region */}
        {destination !== 'Any Destination' && (
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">State / Region</label>
                <div className="relative">
                    <select
                        className="w-full appearance-none border border-gray-200 rounded-xl p-3 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all cursor-pointer font-medium"
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

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Theme */}
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Theme</label>
            <div className="flex flex-wrap gap-2">
                {['Adventure', 'Relaxation', 'Cultural', 'Wildlife', 'Honeymoon'].map(theme => (
                    <button
                        key={theme}
                        type="button"
                        onClick={() => {
                            const syntheticEvent = { target: { value: theme, checked: !themeFilters.includes(theme) } };
                            handleThemeChange(syntheticEvent);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold border transition-all ${themeFilters.includes(theme)
                            ? 'bg-primary text-white border-primary shadow-md'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:text-primary'
                        }`}
                    >
                        {theme}
                    </button>
                ))}
            </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Travel Style */}
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Travel Style</label>
            <div className="flex flex-wrap gap-2">
                {['Any', 'Group', 'Solo', 'Family', 'Honeymoon'].map(style => (
                    <button
                        key={style}
                        type="button"
                        onClick={() => setTravelStyle(style)}
                        className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold border transition-all ${travelStyle === style
                            ? 'bg-primary text-white border-primary shadow-md'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:text-primary'
                        }`}
                    >
                        {style === 'Any' ? 'All' : style}
                    </button>
                ))}
            </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Duration */}
        <div>
            <button
                className="flex justify-between items-center w-full group"
                onClick={() => setIsDurationOpen(!isDurationOpen)}
            >
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Duration (Days)</span>
                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors text-xl">
                    {isDurationOpen ? 'expand_less' : 'expand_more'}
                </span>
            </button>
            {isDurationOpen && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                    {['1 to 3', '4 to 6', '7 to 9', '10 to 12', '13 or more'].map(duration => (
                        <label key={duration} className="flex items-center gap-2 cursor-pointer group/dur">
                            <input
                                type="checkbox"
                                value={duration}
                                checked={durationFilters.includes(duration)}
                                onChange={handleDurationChange}
                                className="w-4 h-4 rounded border-gray-300 accent-primary cursor-pointer"
                            />
                            <span className="text-[13px] text-gray-600 group-hover/dur:text-gray-900 transition-colors">{duration}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Budget */}
        <div>
            <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Budget</label>
                <span className="text-xs font-bold text-primary">{formatPrice(budgetUsd)}</span>
            </div>
            <input
                type="range" min="0" max="1000000" step="5000"
                value={budgetUsd}
                onChange={(e) => setBudgetUsd(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1.5 font-medium">
                <span>{formatPrice(0)}</span>
                <span>{formatPrice(1000000)}+</span>
            </div>
        </div>

        {/* Reset */}
        <button
            onClick={resetFilters}
            className="w-full bg-primary/8 hover:bg-primary/15 text-primary font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
        >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Reset All Filters
        </button>
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const ToursDiscoveryFiltering1 = () => {
    const { regionSlug } = useParams();
    const [searchParams] = useSearchParams();
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const { formatPrice } = useCurrency();

    // Filter states
    const [destination, setDestination] = useState('Any Destination');
    const [stateRegion, setStateRegion] = useState('All States');
    const [themeFilters, setThemeFilters] = useState([]);
    const [travelStyle, setTravelStyle] = useState('Any');
    const [budgetUsd, setBudgetUsd] = useState(1000000);
    const [durationFilters, setDurationFilters] = useState([]);
    const [visibleCount, setVisibleCount] = useState(6);
    const [isDurationOpen, setIsDurationOpen] = useState(true);
    const [compareList, setCompareList] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false); // Mobile drawer

    useEffect(() => {
        const urlTheme = searchParams.get('theme');
        const urlDest = searchParams.get('destination');
        if (urlTheme) setThemeFilters([urlTheme]);
        if (urlDest) setStateRegion(urlDest);
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
            .catch(err => { console.error('Failed to fetch tours:', err); setLoading(false); });
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

    // Lock scroll when drawer is open
    useEffect(() => {
        document.body.style.overflow = isFilterOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isFilterOpen]);

    const handleThemeChange = useCallback((e) => {
        const { value, checked } = e.target;
        setThemeFilters(prev => checked ? [...prev, value] : prev.filter(t => t !== value));
    }, []);

    const handleDurationChange = useCallback((e) => {
        const { value, checked } = e.target;
        setDurationFilters(prev => checked ? [...prev, value] : prev.filter(d => d !== value));
    }, []);

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
        setBudgetUsd(1000000);
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
        if (travelStyle && travelStyle !== 'Any') {
            const tStyle = tour.style || 'Group';
            if (tStyle.toLowerCase() !== travelStyle.toLowerCase()) return false;
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
            } else return false;
        }
        if (tour.price > budgetUsd) return false;
        return true;
    });

    const processedTours = filteredTours.slice(0, visibleCount);

    const activeFilterCount = themeFilters.length + durationFilters.length +
        (travelStyle !== 'Any' ? 1 : 0) +
        (destination !== 'Any Destination' ? 1 : 0) +
        (stateRegion !== 'All States' ? 1 : 0);

    const toggleCompare = (tour) => {
        setCompareList(prev => {
            const isSelected = prev.some(t => t.id === tour.id);
            if (isSelected) return prev.filter(t => t.id !== tour.id);
            if (prev.length >= 4) { alert('You can compare up to 4 packages.'); return prev; }
            return [...prev, tour];
        });
    };

    const pageTitle = searchParams.get('theme')
        ? `${searchParams.get('theme').charAt(0).toUpperCase() + searchParams.get('theme').slice(1)} Tour Packages`
        : searchParams.get('destination')
            ? `${searchParams.get('destination')} Tour Packages`
            : stateRegion !== 'All States'
                ? `${stateRegion} Tour Packages`
                : 'Discover India\'s Best Tours';

    const filterProps = {
        tours, destination, setDestination, stateRegion, setStateRegion,
        themeFilters, handleThemeChange, travelStyle, setTravelStyle,
        durationFilters, handleDurationChange, setDurationFilters,
        budgetUsd, setBudgetUsd, formatPrice, resetFilters,
        isDurationOpen, setIsDurationOpen,
    };

    return (
        <div data-page="tours_discovery_filtering_1" className="min-h-screen bg-[#f6f8f8]">

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <section className="relative h-[220px] md:h-[320px] flex items-end overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=1400"
                    alt={pageTitle}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                <div className="relative z-10 w-full pb-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-[1400px] mx-auto">
                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-1.5 text-white/60 text-xs font-medium mb-3">
                            <Link to="/" className="hover:text-white transition-colors">Home</Link>
                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                            <span className="text-white/80">Tour Packages</span>
                            {stateRegion !== 'All States' && (
                                <>
                                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                    <span className="text-white">{stateRegion}</span>
                                </>
                            )}
                        </nav>
                        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">{pageTitle}</h1>
                        <p className="text-white/70 text-sm mt-1.5 font-medium">
                            {loading ? 'Loading...' : `${filteredTours.length} handpicked experiences — best prices guaranteed`}
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Active Filter Pills (mobile only) ────────────────────────── */}
            {activeFilterCount > 0 && (
                <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                        {destination !== 'Any Destination' && (
                            <span className="flex-shrink-0 flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full">
                                📍 {destination}
                                <button onClick={() => setDestination('Any Destination')} className="ml-1 hover:text-red-500"><span className="material-symbols-outlined text-[14px]">close</span></button>
                            </span>
                        )}
                        {stateRegion !== 'All States' && (
                            <span className="flex-shrink-0 flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full">
                                📌 {stateRegion}
                                <button onClick={() => setStateRegion('All States')} className="ml-1 hover:text-red-500"><span className="material-symbols-outlined text-[14px]">close</span></button>
                            </span>
                        )}
                        {themeFilters.map(t => (
                            <span key={t} className="flex-shrink-0 flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full">
                                🏷️ {t}
                                <button onClick={() => setThemeFilters(prev => prev.filter(x => x !== t))} className="ml-1 hover:text-red-500"><span className="material-symbols-outlined text-[14px]">close</span></button>
                            </span>
                        ))}
                        {travelStyle !== 'Any' && (
                            <span className="flex-shrink-0 flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full">
                                👤 {travelStyle}
                                <button onClick={() => setTravelStyle('Any')} className="ml-1 hover:text-red-500"><span className="material-symbols-outlined text-[14px]">close</span></button>
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* ── Main Layout ──────────────────────────────────────────────── */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8 items-start">

                    {/* ── Desktop Sidebar ──────────────────────────────────── */}
                    <aside className="hidden lg:block w-72 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:sticky lg:top-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px] text-primary">tune</span>
                                Filters
                            </h2>
                            {activeFilterCount > 0 && (
                                <button onClick={resetFilters} className="text-xs text-gray-400 hover:text-red-500 font-bold transition-colors flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">refresh</span> Reset
                                </button>
                            )}
                        </div>
                        <FilterPanel {...filterProps} />
                    </aside>

                    {/* ── Tour Cards Area ───────────────────────────────────── */}
                    <div className="flex-1 min-w-0">

                        {/* Results Header + Mobile Filter Button */}
                        <div className="flex items-center justify-between mb-6 gap-4">
                            <div>
                                <h2 className="text-xl font-extrabold text-gray-900">
                                    {stateRegion !== 'All States' ? `Tours in ${stateRegion}` : 'All Tours'}
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {loading ? 'Loading...' : `${filteredTours.length} packages found`}
                                </p>
                            </div>
                            {/* Mobile Filter Trigger */}
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="lg:hidden flex-shrink-0 flex items-center gap-2 bg-primary text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95"
                            >
                                <span className="material-symbols-outlined text-[18px]">tune</span>
                                Filters
                                {activeFilterCount > 0 && (
                                    <span className="bg-white text-primary text-xs font-black w-5 h-5 rounded-full flex items-center justify-center leading-none">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        ) : filteredTours.length === 0 ? (
                            <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                                <span className="material-symbols-outlined text-5xl text-gray-300 block mb-4">search_off</span>
                                <h3 className="text-lg font-bold text-gray-700 mb-2">No tours found</h3>
                                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters.</p>
                                <button onClick={resetFilters} className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-colors">
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {processedTours.map((tour, index) => {
                                        const locationStr = [tour.subregion, tour.stateRegion, tour.destination].filter(Boolean).join(', ');
                                        const themeTag = tour.nature || tour.theme || 'Adventure';
                                        const tourDestSegment = encodeURIComponent((tour.destination || 'global').toLowerCase().replace(/\s+/g, '-'));
                                        const tourStateSegment = encodeURIComponent((tour.stateRegion || 'state').toLowerCase().replace(/\s+/g, '-'));
                                        const tourSubSegment = encodeURIComponent((tour.subregion || 'subregion').toLowerCase().replace(/\s+/g, '-'));
                                        const tourTitleSegment = encodeURIComponent((tour.title || 'tour').toLowerCase().replace(/\s+/g, '-'));
                                        const detailUrl = `/tours/${tourDestSegment}/${tourStateSegment}/${tourSubSegment}/${tourTitleSegment}`;

                                        return (
                                            <div
                                                key={tour.id}
                                                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group overflow-hidden"
                                                style={{ animationDelay: `${index * 60}ms` }}
                                            >
                                                {/* Image */}
                                                <div className="relative h-52 overflow-hidden bg-gray-100">
                                                    <img
                                                        src={tour.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=75'}
                                                        alt={`${tour.title} - ${tour.destination} tour package`}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                    />
                                                    {/* Gradient overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                                                    {/* Theme tag */}
                                                    <div className="absolute top-3 left-3">
                                                        <span className="bg-white/95 backdrop-blur-sm text-primary text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wide">
                                                            {themeTag}
                                                        </span>
                                                    </div>

                                                    {/* Wishlist */}
                                                    <button className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm p-1.5 rounded-full text-white hover:bg-red-500 transition-colors z-10 w-8 h-8 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-[17px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                                    </button>

                                                    {/* Duration badge */}
                                                    {tour.duration && (
                                                        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                                                            <span className="material-symbols-outlined text-[13px]">schedule</span>
                                                            {tour.duration}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Compare toggle */}
                                                <div className="px-4 pt-3 pb-0">
                                                    <label className="flex items-center gap-2 cursor-pointer group/compare w-fit">
                                                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${compareList.some(t => t.id === tour.id) ? 'bg-red-500 border-red-500' : 'border-gray-300 group-hover/compare:border-red-400'}`}>
                                                            {compareList.some(t => t.id === tour.id) && <span className="material-symbols-outlined text-white text-[11px]">check</span>}
                                                        </div>
                                                        <input type="checkbox" className="hidden" checked={compareList.some(t => t.id === tour.id)} onChange={() => toggleCompare(tour)} />
                                                        <span className={`text-[11px] font-bold uppercase tracking-wide ${compareList.some(t => t.id === tour.id) ? 'text-red-500' : 'text-gray-400 group-hover/compare:text-red-400'} transition-colors`}>
                                                            {compareList.some(t => t.id === tour.id) ? 'Added' : '+ Compare'}
                                                        </span>
                                                    </label>
                                                </div>

                                                {/* Content */}
                                                <div className="p-4 flex flex-col flex-grow">
                                                    {locationStr && (
                                                        <div className="flex items-center gap-1 text-gray-400 text-[12px] font-medium mb-1.5">
                                                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                                                            <span className="truncate">{locationStr}</span>
                                                        </div>
                                                    )}
                                                    <h3 className="text-[16px] font-bold text-gray-900 mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                        {tour.title}
                                                    </h3>

                                                    <div className="flex items-center gap-4 text-gray-400 text-[12px] font-medium mb-4">
                                                        <div className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[15px]">group</span>
                                                            {tour.style || 'Group'}
                                                        </div>
                                                        {tour.category && (
                                                            <div className="flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-[15px]">category</span>
                                                                {tour.category}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mt-auto border-t border-gray-100 pt-3 flex items-center justify-between">
                                                        <div>
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">From</span>
                                                            <span className="text-[20px] font-extrabold text-primary leading-tight">{formatPrice(tour.price, true)}</span>
                                                        </div>
                                                        <Link
                                                            to={detailUrl}
                                                            className="flex items-center gap-1 bg-primary/8 hover:bg-primary text-primary hover:text-white text-[12px] font-bold px-4 py-2 rounded-xl transition-all"
                                                        >
                                                            View Details
                                                            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Load More */}
                                {filteredTours.length > visibleCount && (
                                    <div className="mt-10 flex justify-center">
                                        <button
                                            onClick={() => setVisibleCount(prev => prev + 6)}
                                            className="bg-white border-2 border-gray-200 hover:border-primary text-gray-700 hover:text-primary font-bold py-3 px-10 rounded-2xl transition-all shadow-sm hover:shadow-md group flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">expand_more</span>
                                            Load More Tours
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Mobile Filter Drawer ──────────────────────────────────────── */}
            {/* Overlay */}
            <div
                className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsFilterOpen(false)}
            />
            {/* Drawer */}
            <div
                className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 transition-transform duration-400 ease-out shadow-2xl ${isFilterOpen ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ maxHeight: '90vh' }}
            >
                {/* Drag Handle */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 bg-gray-200 rounded-full" />
                </div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                    <h3 className="text-base font-extrabold text-gray-900">
                        Filters {activeFilterCount > 0 && <span className="ml-1 bg-primary text-white text-xs font-black px-2 py-0.5 rounded-full">{activeFilterCount}</span>}
                    </h3>
                    <button
                        onClick={() => setIsFilterOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <span className="material-symbols-outlined text-gray-600 text-[18px]">close</span>
                    </button>
                </div>
                {/* Drawer Body */}
                <div className="overflow-y-auto px-5 py-5" style={{ maxHeight: 'calc(90vh - 120px)' }}>
                    <FilterPanel {...filterProps} />
                </div>
                {/* Drawer Footer */}
                <div className="px-5 py-4 border-t border-gray-100 bg-white">
                    <button
                        onClick={() => setIsFilterOpen(false)}
                        className="w-full bg-primary text-white font-black py-4 rounded-2xl text-sm tracking-wide hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                    >
                        Show {filteredTours.length} Tours
                    </button>
                </div>
            </div>

            {/* ── Compare Bar ──────────────────────────────────────────────── */}
            {compareList.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-8px_30px_-8px_rgba(0,0,0,0.15)] border-t border-gray-100 z-30">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto no-scrollbar">
                            <span className="flex-shrink-0 bg-red-50 text-red-500 border border-red-100 px-3 py-1.5 rounded-lg text-xs font-black">
                                {compareList.length} / 4
                            </span>
                            <div className="flex gap-2">
                                {compareList.map(tour => (
                                    <div key={tour.id} className="relative flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden border-2 border-white shadow group">
                                        <img src={tour.image} alt={tour.title} loading="lazy" className="w-full h-full object-cover" />
                                        <button onClick={() => toggleCompare(tour)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white text-[16px]">close</span>
                                        </button>
                                    </div>
                                ))}
                                {[...Array(Math.max(0, 4 - compareList.length))].map((_, i) => (
                                    <div key={`empty-${i}`} className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
                                        <span className="material-symbols-outlined text-gray-300 text-[18px]">add</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto flex-shrink-0">
                            <button onClick={() => setCompareList([])} className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors">Clear</button>
                            <Link
                                to={`/tours/compare?ids=${compareList.map(t => t.id).join(',')}`}
                                onClick={(e) => { if (compareList.length < 2) e.preventDefault(); }}
                                className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-black uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 ${compareList.length > 1 ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
                                Compare
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToursDiscoveryFiltering1;
