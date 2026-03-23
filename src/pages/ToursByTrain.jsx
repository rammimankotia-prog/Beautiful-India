import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

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

// ─── Filter Panel ─────────────────────────────────────────────────────────────
const FilterPanel = ({
    tours, 
    themeFilters, 
    handleThemeChange,
    durationFilters, 
    handleDurationChange,
    budgetUsd, 
    setBudgetUsd,
    formatPrice, 
    resetFilters,
}) => (
    <div className="space-y-6">
        {/* Theme */}
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Theme</label>
            <div className="flex flex-wrap gap-2">
                {['Adventure', 'Relaxation', 'Cultural', 'Wildlife', 'Honeymoon', 'Spiritual'].map(theme => (
                    <button
                        key={theme}
                        type="button"
                        onClick={() => {
                            const syntheticEvent = { target: { value: theme, checked: !themeFilters.includes(theme) } };
                            handleThemeChange(syntheticEvent);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold border transition-all ${themeFilters.includes(theme)
                            ? 'bg-[#0a6c75] text-white border-[#0a6c75] shadow-md'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-[#0a6c75]/50 hover:text-[#0a6c75]'
                        }`}
                    >
                        {theme}
                    </button>
                ))}
            </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Duration */}
        <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">Duration (Days)</label>
            <div className="grid grid-cols-1 gap-2">
                {['1 to 3', '4 to 6', '7 to 9', '10 to 12', '13 or more'].map(duration => (
                    <label key={duration} className="flex items-center gap-2 cursor-pointer group/dur">
                        <input
                            type="checkbox"
                            value={duration}
                            checked={durationFilters.includes(duration)}
                            onChange={handleDurationChange}
                            className="w-4 h-4 rounded border-gray-300 accent-[#0a6c75] cursor-pointer"
                        />
                        <span className="text-[13px] text-gray-600 group-hover/dur:text-gray-900 transition-colors font-medium">{duration}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Budget */}
        <div>
            <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Budget</label>
                <span className="text-xs font-bold text-[#0a6c75]">{formatPrice(budgetUsd, true)}</span>
            </div>
            <input
                type="range" min="0" max="1000000" step="5000"
                value={budgetUsd}
                onChange={(e) => setBudgetUsd(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0a6c75]"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1.5 font-medium">
                <span>{formatPrice(0, true)}</span>
                <span>{formatPrice(1000000, true)}+</span>
            </div>
        </div>

        {/* Reset */}
        <button
            onClick={resetFilters}
            className="w-full bg-[#0a6c75]/8 hover:bg-[#0a6c75]/15 text-[#0a6c75] font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
        >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Reset Filters
        </button>
    </div>
);

const ToursByTrain = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const { formatPrice } = useCurrency();

    // Filter & Sort states
    const [themeFilters, setThemeFilters] = useState([]);
    const [budgetUsd, setBudgetUsd] = useState(1000000);
    const [durationFilters, setDurationFilters] = useState([]);
    const [sortOption, setSortOption] = useState('default');
    const [visibleCount, setVisibleCount] = useState(9);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                let processedTours = [];
                const res = await fetch(`${import.meta.env.BASE_URL || '/'}data/tours.json?t=${Date.now()}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && Array.isArray(data)) {
                        const allTours = data.filter(Boolean); // Filter out null/undefined entries
                        localStorage.setItem('beautifulindia_admin_tours', JSON.stringify(allTours));
                        processedTours = allTours;
                    }
                } else {
                    // Fallback to localStorage if fetch fails
                    const saved = localStorage.getItem('beautifulindia_admin_tours');
                    if (saved !== null) {
                        try {
                            const parsed = JSON.parse(saved);
                            if (Array.isArray(parsed)) {
                                const allTours = parsed.filter(Boolean); // Filter out null/undefined entries
                                processedTours = allTours;
                            }
                        } catch(e) {
                            console.error("Failed to parse tours from localStorage:", e);
                        }
                    }
                }
                const trainTours = processedTours.filter(t => t.transport === 'train' && t.status !== 'paused');
                setTours(trainTours);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch tours:', err);
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

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
        setThemeFilters([]);
        setBudgetUsd(1000000);
        setDurationFilters([]);
        setSortOption('default');
        setVisibleCount(9);
    };

    const filteredTours = tours.filter(tour => {
        if (themeFilters.length > 0) {
            const hasTheme = themeFilters.some(theme =>
                (tour.theme && tour.theme.toLowerCase() === theme.toLowerCase()) ||
                (tour.nature && tour.nature.toLowerCase() === theme.toLowerCase())
            );
            if (!hasTheme) return false;
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

    const sortedTours = [...filteredTours].sort((a, b) => {
        switch (sortOption) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'duration-low':
                return (parseInt(a.duration) || 0) - (parseInt(b.duration) || 0);
            case 'duration-high':
                return (parseInt(b.duration) || 0) - (parseInt(a.duration) || 0);
            default:
                return 0;
        }
    });

    const activeFilterCount = themeFilters.length + durationFilters.length + (budgetUsd < 1000000 ? 1 : 0);

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <section className="relative h-[250px] md:h-[400px] flex items-end overflow-hidden bg-slate-900">
                <img
                    src="https://images.unsplash.com/photo-1532375811400-d7b686259045?auto=format&fit=crop&q=80&w=1600"
                    alt="Travel by Train in India"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <div className="relative z-10 w-full pb-12 px-6">
                    <div className="max-w-7xl mx-auto">
                        <nav className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest mb-4">
                            <Link to="/" className="hover:text-white transition-colors">Home</Link>
                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                            <span className="text-amber-400">Train Tours</span>
                        </nav>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">Travel by Train</h1>
                        <p className="text-white/70 text-sm md:text-base mt-3 max-w-2xl font-medium leading-relaxed">
                            Discover the soul of Bharat through iconic rail journeys. From luxury trains to scenic coastal routes, experience India like never before.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Main Layout ──────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* Sidebar Filters */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm sticky top-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#0a6c75]">filter_list</span>
                                    Filters
                                </h2>
                                {activeFilterCount > 0 && (
                                    <button onClick={resetFilters} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">Reset</button>
                                )}
                            </div>
                            <FilterPanel 
                                tours={tours}
                                themeFilters={themeFilters}
                                handleThemeChange={handleThemeChange}
                                durationFilters={durationFilters}
                                handleDurationChange={handleDurationChange}
                                budgetUsd={budgetUsd}
                                setBudgetUsd={setBudgetUsd}
                                formatPrice={formatPrice}
                                resetFilters={resetFilters}
                            />
                        </div>
                    </aside>

                    {/* Listing Area */}
                    <div className="flex-1">
                        {/* Header + Mobile Trigger */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800">
                                    {loading ? 'Discovering Tours...' : `${filteredTours.length} Iconic Rail Journeys`}
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">Handpicked experiences across Bharat</p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {/* Sorting Dropdown */}
                                <div className="relative group">
                                    <select
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                        className="appearance-none bg-white border border-slate-100 px-5 py-2.5 pr-10 rounded-2xl text-xs font-bold text-slate-700 hover:border-amber-400/50 hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                                    >
                                        <option value="default">Sort by: Default</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="duration-low">Duration: Shortest First</option>
                                        <option value="duration-high">Duration: Longest First</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base group-hover:text-amber-500 transition-colors">expand_more</span>
                                </div>

                                <button
                                    onClick={() => setIsFilterOpen(true)}
                                    className="lg:hidden flex items-center gap-2 bg-[#0a6c75] text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg shadow-[#0a6c75]/20"
                                >
                                    <span className="material-symbols-outlined text-[18px]">tune</span>
                                    Filters
                                    {activeFilterCount > 0 && <span className="bg-white text-[#0a6c75] text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">{activeFilterCount}</span>}
                                </button>
                            </div>
                        </div>

                        {/* Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        ) : filteredTours.length === 0 ? (
                            <div className="bg-white rounded-3xl p-20 text-center border border-slate-100 shadow-sm">
                                <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">train_off</span>
                                <h3 className="text-xl font-bold text-slate-700">No train tours found</h3>
                                <p className="text-slate-500 mt-2 mb-8">Try adjusting your filters to find more journeys.</p>
                                <button onClick={resetFilters} className="bg-[#0a6c75] text-white font-black px-8 py-3 rounded-2xl hover:bg-[#085a62] transition-colors">Clear All Filters</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {sortedTours.slice(0, visibleCount).map((tour) => (
                                    <article key={tour.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-amber-400/50 hover:shadow-xl transition-all duration-300 group flex flex-col">
                                        <div className="relative h-56 overflow-hidden">
                                            <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">Premium Rail</span>
                                                <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">{tour.duration}</span>
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <div className="flex items-center gap-1 text-[#0a6c75] text-[11px] font-black uppercase tracking-wider mb-2">
                                                <span className="material-symbols-outlined text-[14px]">location_on</span>
                                                {Array.isArray(tour.stateRegion) ? tour.stateRegion.join(', ') : tour.stateRegion}
                                            </div>
                                            <h3 className="text-lg font-black text-slate-800 mb-2 leading-snug group-hover:text-[#0a6c75] transition-colors line-clamp-2">{tour.title}</h3>
                                            <p className="text-slate-500 text-sm mb-6 line-clamp-2 font-medium leading-relaxed">{tour.description}</p>
                                            
                                            <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                                                <div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Starts at</div>
                                                    <div className="text-[22px] font-black text-slate-900">{formatPrice(tour.price, true)}</div>
                                                </div>
                                                <Link to={`/tour/${tour.id}`} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-amber-400 group-hover:text-slate-900 transition-all duration-300">
                                                    <span className="material-symbols-outlined font-black">arrow_outward</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {/* Load More */}
                        {!loading && filteredTours.length > visibleCount && (
                            <div className="mt-12 flex justify-center">
                                <button
                                    onClick={() => setVisibleCount(prev => prev + 9)}
                                    className="bg-white border-2 border-slate-100 text-slate-700 font-black px-10 py-4 rounded-3xl hover:border-amber-400 hover:text-[#0a6c75] transition-all flex items-center gap-2 group shadow-sm hover:shadow-md"
                                >
                                    <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">expand_more</span>
                                    View More Journeys
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Mobile Filter Drawer ──────────────────────────────────────── */}
            <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-500 ${isFilterOpen ? 'visible' : 'invisible'}`}>
                <div 
                    className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500 ${isFilterOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsFilterOpen(false)}
                />
                <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isFilterOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-800">Filter Journeys</h3>
                        <button onClick={() => setIsFilterOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><span className="material-symbols-outlined">close</span></button>
                    </div>
                    <FilterPanel 
                        tours={tours}
                        themeFilters={themeFilters}
                        handleThemeChange={handleThemeChange}
                        durationFilters={durationFilters}
                        handleDurationChange={handleDurationChange}
                        budgetUsd={budgetUsd}
                        setBudgetUsd={setBudgetUsd}
                        formatPrice={formatPrice}
                        resetFilters={resetFilters}
                    />
                    <button
                        onClick={() => setIsFilterOpen(false)}
                        className="w-full mt-8 bg-[#0a6c75] text-white font-black py-4 rounded-2xl shadow-xl shadow-[#0a6c75]/20"
                    >
                        Show {filteredTours.length} Results
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ToursByTrain;
