import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

/**
 * Auto-generated from: tours_discovery_filtering_5/code.html
 * Group: tours | Path: /tours/filter/5
 */
const ToursDiscoveryFiltering5 = () => {
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
                setTours(allToursList.filter(t => t.status !== 'paused' && t.status !== 'draft').slice(0, 3));
                setLoading(false);
            } catch (err) {
                console.error("Fetch tours error:", err);
                setLoading(false);
            }
        };
        fetchTours();
    }, []);
  return (
    <div data-page="tours_discovery_filtering_5">
      <main className="  px-4 sm:px-6 lg:px-8 py-12">
<div className="mb-12 text-center">
<h1 className="text-neutral-900 dark:text-neutral-100 text-5xl font-black leading-tight tracking-[-0.033em] mb-4">Explore the World</h1>
<p className="text-neutral-600 dark:text-neutral-200 text-lg   font-normal">From the historic streets of Europe to the vibrant cultures of Asia, find your next extraordinary adventure among our curated regions.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
<div className="destination-card relative group h-[400px] rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-neutral-100 dark:border-neutral-800 bg-surface-dark">
<div className="absolute inset-0 bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBuLPtDSCXKNAqZFgYgt6nxXLGxR2-9qpjjDOAN2g6h_DifaIPiCRkKEZREoz_5IxOOhvY3a0sIuOyW1yku1KvXbU7kZHfzR0qfUjvPFDHuJt5iyuThuR4YKQ7r7YRLAxpA066Aian3Ni8Fuo0ewOoUswj5yTGD3PBunGNoAJeifjVqgTN_JY2wx2TmfjE2a5qyfqWRFLUCXx4EuCs05qT_XTgUNfRU443cdWf8429H2BzOBJlkPNpo_FHFERGSyMBipB4qxa_C8NON')" }}>
<div className="overlay absolute inset-0 bg-black/40 transition-colors duration-300"></div>
</div>
<div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
<div className="flex justify-between items-end">
<div>
<h2 className="text-3xl font-black mb-2">Europe</h2>
<p className="text-white/90 text-sm  mb-4">Discover centuries of history, diverse cultures, and iconic landmarks across the continent.</p>
</div>
<div className="flex flex-col items-end">
<span className="bg-primary/90 backdrop-blur-sm text-white px-4 py-1 rounded-full text-xs font-bold mb-2">124 Tours Available</span>
<div className="flex items-center gap-2 group-hover:gap-4 transition-all duration-300 font-bold">
                            Explore <span className="material-symbols-outlined">arrow_forward</span>
</div>
</div>
</div>
</div>
</div>
<div className="destination-card relative group h-[400px] rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-neutral-100 dark:border-neutral-800 bg-surface-dark">
<div className="absolute inset-0 bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBIcovQFfOLPdlxNn6R-8pyzC0H6qe0Be-k0tuboj9ZRB7GXZREF1A4tTGLQ1uSD9lb2bifrtI6mEndWLQyPShLPkixteIMm0oCkqCe0ydqokg_EWwwjcWQv0teX74sGAEhNPRrVCfNZrO_Y6KLj0Ow6DdoiAvUQnU-lM4M3vPj1vrKtSxQP2aPPaWW3QiJ1fhziWciEBdvKi92GsYFWg_59GMYK_chyIhAMQKY1rRME0Mh4xQrf8Q3mhDag4pKGaaru3NvE_9OBOzM')" }}>
<div className="overlay absolute inset-0 bg-black/40 transition-colors duration-300"></div>
</div>
<div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
<div className="flex justify-between items-end">
<div>
<h2 className="text-3xl font-black mb-2">Asia</h2>
<p className="text-white/90 text-sm  mb-4">Experience the perfect blend of ancient traditions, stunning natural landscapes, and futuristic cities.</p>
</div>
<div className="flex flex-col items-end">
<span className="bg-primary/90 backdrop-blur-sm text-white px-4 py-1 rounded-full text-xs font-bold mb-2">98 Tours Available</span>
<div className="flex items-center gap-2 group-hover:gap-4 transition-all duration-300 font-bold">
                            Explore <span className="material-symbols-outlined">arrow_forward</span>
</div>
</div>
</div>
</div>
</div>
<div className="destination-card relative group h-[400px] rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-neutral-100 dark:border-neutral-800 bg-surface-dark">
<div className="absolute inset-0 bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDnMHLzNRcEdCeZewkenlrb-2PfktWUyNAIPzIyDe2oRLEPiIe84WiLN79_Ze-DOUkiEcs2Vp-BEd-El9JBtHosezFRMxi6ARCQAfcfl38JNsXyy7WnwvC42jV1kA5NHe_CPW2R_JdlndbBXAgu5z85WERgdAErB7HxOprdYPKNWL0Ead5fQwrmu_yfgqCJKIGhNPrjT7rbbVHaun18A-UVTNaWG_Vwo1--rnu1ncrSwR2p8s4337TWnMDT2PwxssX1uBcG_6bsV2SK')" }}>
<div className="overlay absolute inset-0 bg-black/40 transition-colors duration-300"></div>
</div>
<div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
<div className="flex justify-between items-end">
<div>
<h2 className="text-3xl font-black mb-2">South America</h2>
<p className="text-white/90 text-sm  mb-4">From the Amazon rainforest to the peaks of the Andes, embark on a journey of natural wonder.</p>
</div>
<div className="flex flex-col items-end">
<span className="bg-primary/90 backdrop-blur-sm text-white px-4 py-1 rounded-full text-xs font-bold mb-2">65 Tours Available</span>
<div className="flex items-center gap-2 group-hover:gap-4 transition-all duration-300 font-bold">
                            Explore <span className="material-symbols-outlined">arrow_forward</span>
</div>
</div>
</div>
</div>
</div>
<div className="destination-card relative group h-[400px] rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-neutral-100 dark:border-neutral-800 bg-surface-dark">
<div className="absolute inset-0 bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsc1X1myj6atwLxEc2WGjlstCh9gDpK-e5bs3QZ9iki8zMP9VfQMsLR7r0CuwfflVpn6F55_Qf5O79t4XEAZB8fgRXOnAC6771jR5ZzUDkBqVFPIw-mv-Ydvf1NPnIzO17dSGdCs4Fzu9zxpwBzg-NI1QMfbAgYqt71XzArPa5LeBPXy5_XyYGtk2bexc4qxsPJRD4cVWYYjZrlkL9k7OIF5RpX59FSte-YeAeXe3exo22smINhs6-_DTdN4oRx2FYxqfijINipbKg')" }}>
<div className="overlay absolute inset-0 bg-black/40 transition-colors duration-300"></div>
</div>
<div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
<div className="flex justify-between items-end">
<div>
<h2 className="text-3xl font-black mb-2">Africa</h2>
<p className="text-white/90 text-sm  mb-4">Encounter magnificent wildlife, breathtaking deserts, and the rich heritage of various cultures.</p>
</div>
<div className="flex flex-col items-end">
<span className="bg-primary/90 backdrop-blur-sm text-white px-4 py-1 rounded-full text-xs font-bold mb-2">42 Tours Available</span>
<div className="flex items-center gap-2 group-hover:gap-4 transition-all duration-300 font-bold">
                            Explore <span className="material-symbols-outlined">arrow_forward</span>
</div>
</div>
</div>
</div>
</div>
</div>
<section className="mt-20">
<div className="flex items-center justify-between mb-8">
<h2 className="text-neutral-900 dark:text-neutral-100 text-2xl font-bold">Top Picks This Month</h2>
<a className="text-primary font-bold flex items-center gap-1 hover:underline" href="#">
                View all tours <span className="material-symbols-outlined text-[20px]">arrow_outward</span>
</a>
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
                        {tour.popular && (
                            <div className="absolute bottom-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded">Popular</div>
                        )}
                    </div>
                    <div className="p-5">
                        <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold mb-2">{tour.title}</h3>
                        <p className="text-neutral-600 dark:text-neutral-200 text-sm mb-4 line-clamp-2">{tour.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
                            <span className="text-primary font-bold text-lg">{formatPrice(tour.price, true)}</span>
                            <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-primary transition-colors flex items-center gap-1">
                                Details <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </div>
                        </div>
                    </div>
                </Link>
            );
        })
    )}
</div>
</section>
</main>
    </div>
  );
};

export default ToursDiscoveryFiltering5;
