import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

/**
 * Auto-generated from: tours_discovery_filtering_6/code.html
 * Group: tours | Path: /tours/filter/6
 */
const ToursDiscoveryFiltering6 = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const { formatPrice } = useCurrency();

    useEffect(() => {
        const fetchTours = async () => {
            try {
                let allToursList = [];
                const saved = localStorage.getItem('beautifulindia_admin_tours');
                if (saved !== null) {
                    try {
                        const parsed = JSON.parse(saved);
                        if (Array.isArray(parsed)) allToursList = parsed.filter(Boolean);
                    } catch(e) {}
                } else {
                    const res = await fetch(`${import.meta.env.BASE_URL}data/tours.json?t=${Date.now()}`);
                    if (res.ok) {
                        allToursList = await res.json();
                        if (allToursList && Array.isArray(allToursList) && allToursList.length > 0) {
                            localStorage.setItem('beautifulindia_admin_tours', JSON.stringify(allToursList));
                        }
                    }
                }
                setTours(allToursList.filter(t => t.status !== 'paused' && t.status !== 'draft').slice(0, 9));
                setLoading(false);
            } catch (err) {
                console.error("Fetch tours error:", err);
                setLoading(false);
            }
        };
        fetchTours();
    }, []);
  return (
    <div data-page="tours_discovery_filtering_6">
      <main className="  px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
<aside className="w-full md:w-72 flex-shrink-0">
<div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-800 sticky top-24">
<h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold leading-tight mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">filter_list</span>
                    Filter Tours
                </h3>
<div className="mb-6">
<label className="flex flex-col w-full">
<p className="text-neutral-900 dark:text-neutral-100 text-sm font-medium leading-normal mb-2">Destination</p>
<select className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-neutral-200 dark:border-neutral-600 bg-surface-light dark:bg-surface-dark h-12 px-4 text-sm font-normal cursor-pointer">
<option value="">Any Destination</option>
<option value="europe">Europe</option>
<option value="asia">Asia</option>
<option value="americas">Americas</option>
<option value="africa">Africa</option>
<option value="oceania">Oceania</option>
</select>
</label>
</div>
<div className="mb-6">
<p className="text-neutral-900 dark:text-neutral-100 text-sm font-medium leading-normal mb-3">Theme &amp; Nature</p>
<div className="flex flex-col gap-3">
<label className="flex items-center gap-3 cursor-pointer group">
<input checked="" className="form-checkbox text-primary rounded border-neutral-200 dark:border-neutral-600 focus:ring-primary w-5 h-5" type="checkbox"/>
<span className="text-neutral-600 dark:text-neutral-200 text-sm group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">Adventure</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input className="form-checkbox text-primary rounded border-neutral-200 dark:border-neutral-600 focus:ring-primary w-5 h-5" type="checkbox"/>
<span className="text-neutral-600 dark:text-neutral-200 text-sm group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">Relaxation</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input checked="" className="form-checkbox text-primary rounded border-neutral-200 dark:border-neutral-600 focus:ring-primary w-5 h-5" type="checkbox"/>
<span className="text-neutral-600 dark:text-neutral-200 text-sm group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">Cultural</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input className="form-checkbox text-primary rounded border-neutral-200 dark:border-neutral-600 focus:ring-primary w-5 h-5" type="checkbox"/>
<span className="text-neutral-600 dark:text-neutral-200 text-sm group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">Wildlife</span>
</label>
</div>
</div>
<div className="mb-6">
<p className="text-neutral-900 dark:text-neutral-100 text-sm font-medium leading-normal mb-3">Travel Style</p>
<div className="flex flex-col gap-3">
<label className="flex items-center gap-3 cursor-pointer group">
<input checked="" className="form-radio text-primary border-neutral-200 dark:border-neutral-600 focus:ring-primary w-5 h-5" name="style" type="radio"/>
<span className="text-neutral-600 dark:text-neutral-200 text-sm group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">Group</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input className="form-radio text-primary border-neutral-200 dark:border-neutral-600 focus:ring-primary w-5 h-5" name="style" type="radio"/>
<span className="text-neutral-600 dark:text-neutral-200 text-sm group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">Solo</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input className="form-radio text-primary border-neutral-200 dark:border-neutral-600 focus:ring-primary w-5 h-5" name="style" type="radio"/>
<span className="text-neutral-600 dark:text-neutral-200 text-sm group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">Family</span>
</label>
</div>
</div>
<div className="mb-6">
<div className="flex justify-between items-center mb-3">
<p className="text-neutral-900 dark:text-neutral-100 text-sm font-medium leading-normal">Budget</p>
<span className="text-primary text-sm font-bold">$0 - $5,000</span>
</div>
<input className="w-full" max="10000" min="0" type="range" value="5000"/>
<div className="flex justify-between text-xs text-neutral-600 mt-2">
<span>$0</span>
<span>$10k+</span>
</div>
</div>
<button className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors rounded-lg py-3 px-4 font-bold text-sm">
<span className="material-symbols-outlined text-sm">restart_alt</span>
                    Reset Filters
                </button>
</div>
</aside>
<section className="flex-1">
<div className="mb-8">
<h1 className="text-neutral-900 dark:text-neutral-100 text-4xl font-black leading-tight tracking-[-0.033em] mb-2">Discover All Tours</h1>
<p className="text-neutral-600 dark:text-neutral-200 text-base font-normal">Showing 24 tours matching your filters.</p>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {loading ? (
        [1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-xl"></div>)
    ) : (
        tours.map(tour => {
            const tourDestSegment = encodeURIComponent((tour.destination || 'global').toLowerCase().replace(/\s+/g, '-'));
            const tourStateSegment = encodeURIComponent((tour.stateRegion || 'state').toLowerCase().replace(/\s+/g, '-'));
            const tourSubSegment = encodeURIComponent((tour.subregion || 'subregion').toLowerCase().replace(/\s+/g, '-'));
            const tourTitleSegment = encodeURIComponent((tour.title || 'tour').toLowerCase().replace(/\s+/g, '-'));
            const detailUrl = `/tours/${tourDestSegment}/${tourStateSegment}/${tourSubSegment}/${tourTitleSegment}`;

            return (
                <Link key={tour.id} to={detailUrl} className="bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-neutral-100 dark:border-neutral-800 group hover:shadow-md transition-shadow block">
                    <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url('${tour.image}')` }}>
                        <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors">
                            <span className="material-symbols-outlined text-sm">favorite</span>
                        </button>
                        <div className="absolute bottom-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded">{tour.category || 'Tour'}</div>
                    </div>
                    <div className="p-5">
                        <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-200 text-xs font-medium mb-2">
                            <span className="material-symbols-outlined text-[16px]">location_on</span>
                            <span>{tour.stateRegion}, {tour.destination}</span>
                        </div>
                        <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold leading-tight mb-2 line-clamp-2">{tour.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-200 mb-4">
                            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> {tour.duration}</div>
                            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">groups</span> Group</div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
                            <div>
                                <span className="text-xs text-neutral-600 dark:text-neutral-200 block">From</span>
                                <span className="text-primary font-bold text-lg">{formatPrice(tour.price, true)}</span>
                            </div>
                            <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-primary transition-colors flex items-center gap-1">
                                View Details <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </div>
                        </div>
                    </div>
                </Link>
            );
        })
    )}
</div>
<div className="mt-10 flex justify-center">
<button className="bg-surface-light dark:bg-surface-dark border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 font-bold py-3 px-8 rounded-lg hover:border-primary hover:text-primary transition-colors">
                    Load More Tours
                </button>
</div>
</section>
</main>
    </div>
  );
};

export default ToursDiscoveryFiltering6;
