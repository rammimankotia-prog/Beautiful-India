import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Auto-generated from: tours_discovery_filtering_4/code.html
 * Group: tours | Path: /tours/filter/4
 */
const ToursDiscoveryFiltering4 = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                let allToursList = [];
                const saved = localStorage.getItem('wanderlust_admin_tours');
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
                            localStorage.setItem('wanderlust_admin_tours', JSON.stringify(allToursList));
                        }
                    }
                }
                setTours(allToursList.filter(t => t.status !== 'paused' && t.status !== 'draft').slice(0, 4));
                setLoading(false);
            } catch (err) {
                console.error("Fetch tours error:", err);
                setLoading(false);
            }
        };
        fetchTours();
    }, []);
  return (
    <div data-page="tours_discovery_filtering_4">
      <main className="  px-6 lg:px-12 py-12">
<section className="mb-16">
<div className="relative group cursor-pointer overflow-hidden rounded-sm bg-neutral-900">
<div className="grid lg:grid-cols-2 gap-0 items-stretch min-h-[500px]">
<div className="relative overflow-hidden h-full min-h-[350px]">
<img alt="Featured Post" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnMHLzNRcEdCeZewkenlrb-2PfktWUyNAIPzIyDe2oRLEPiIe84WiLN79_Ze-DOUkiEcs2Vp-BEd-El9JBtHosezFRMxi6ARCQAfcfl38JNsXyy7WnwvC42jV1kA5NHe_CPW2R_JdlndbBXAgu5z85WERgdAErB7HxOprdYPKNWL0Ead5fQwrmu_yfgqCJKIGhNPrjT7rbbVHaun18A-UVTNaWG_Vwo1--rnu1ncrSwR2p8s4337TWnMDT2PwxssX1uBcG_6bsV2SK"/>
</div>
<div className="bg-surface-dark p-8 lg:p-16 flex flex-col justify-center border-l border-neutral-800">
<div className="flex items-center gap-4 mb-6">
<span className="text-primary text-[10px] font-black tracking-[0.2em] uppercase">Featured Article</span>
<span className="h-[1px] w-12 bg-primary"></span>
</div>
<h1 className="font-serif italic text-4xl lg:text-6xl text-white mb-6 leading-tight">Finding Solitude in the Sands of Cappadocia</h1>
<p className="text-neutral-400 text-lg font-light leading-relaxed mb-8 line-clamp-3">
                        Beyond the iconic hot air balloons lies a landscape of ancient secrets and silent valleys. We explore the lesser-known trails of Turkey's magical region where history is carved into the very stone.
                    </p>
<div className="flex items-center justify-between border-t border-neutral-800 pt-8">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-cover bg-center border border-neutral-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsc1X1myj6atwLxEc2WGjlstCh9gDpK-e5bs3QZ9iki8zMP9VfQMsLR7r0CuwfflVpn6F55_Qf5O79t4XEAZB8fgRXOnAC6771jR5ZzUDkBqVFPIw-mv-Ydvf1NPnIzO17dSGdCs4Fzu9zxpwBzg-NI1QMfbAgYqt71XzArPa5LeBPXy5_XyYGtk2bexc4qxsPJRD4cVWYYjZrlkL9k7OIF5RpX59FSte-YeAeXe3exo22smINhs6-_DTdN4oRx2FYxqfijINipbKg')" }}></div>
<div>
<p className="text-white text-xs font-bold tracking-wide">Eleanor Vance</p>
<p className="text-neutral-500 text-[10px] uppercase tracking-tighter">October 12, 2023</p>
</div>
</div>
<a className="text-primary text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 group/link" href="#">
                            Read Story <span className="material-symbols-outlined transition-transform group-hover/link:translate-x-1">arrow_right_alt</span>
</a>
</div>
</div>
</div>
</div>
</section>
<div className="flex flex-col lg:row-reverse lg:flex-row gap-16">
<section className="flex-1">
<div className="flex items-center justify-between mb-10 pb-4 border-b border-neutral-100 dark:border-neutral-800">
<h2 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">Latest Stories</h2>
<div className="flex gap-4">
<button className="text-primary"><span className="material-symbols-outlined">grid_view</span></button>
<button className="text-neutral-400"><span className="material-symbols-outlined">view_list</span></button>
</div>
</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-10">
        {loading ? (
            [1, 2].map(i => <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-sm"></div>)
        ) : (
            tours.map(tour => {
                const tourDestSegment = encodeURIComponent((tour.destination || 'global').toLowerCase().replace(/\s+/g, '-'));
                const tourStateSegment = encodeURIComponent((tour.stateRegion || 'state').toLowerCase().replace(/\s+/g, '-'));
                const tourSubSegment = encodeURIComponent((tour.subregion || 'subregion').toLowerCase().replace(/\s+/g, '-'));
                const tourTitleSegment = encodeURIComponent((tour.title || 'tour').toLowerCase().replace(/\s+/g, '-'));
                const detailUrl = `/tours/${tourDestSegment}/${tourStateSegment}/${tourSubSegment}/${tourTitleSegment}`;

                return (
                    <article key={tour.id} className="group">
                      <div className="relative aspect-[4/3] overflow-hidden mb-6 rounded-sm">
                        <img alt={tour.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={tour.image}/>
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest px-3 py-1.5 text-neutral-900">{tour.category || 'Travel'}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.15em]">{tour.duration} Package</p>
                        <Link to={detailUrl} className="font-serif text-2xl text-neutral-900 dark:text-neutral-100 leading-snug hover:text-primary transition-colors cursor-pointer block">{tour.title}</Link>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed line-clamp-2">{tour.description}</p>
                        <div className="pt-4 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">By Bharat Darshan</span>
                          <Link className="text-xs font-black uppercase tracking-widest text-neutral-900 dark:text-neutral-100 hover:text-primary transition-colors" to={detailUrl}>Read More</Link>
                        </div>
                      </div>
                    </article>
                );
            })
        )}
      </div>
<div className="mt-16 flex justify-center">
<button className="group flex flex-col items-center gap-4">
<span className="h-12 w-[1px] bg-neutral-200 dark:bg-neutral-800 group-hover:bg-primary transition-colors"></span>
<span className="text-xs font-black uppercase tracking-[0.4em] text-neutral-400 group-hover:text-primary transition-colors">Load More</span>
</button>
</div>
</section>
<aside className="w-full lg:w-80 flex-shrink-0">
<div className="sticky top-28 space-y-12">
<div>
<h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-900 dark:text-white mb-6 flex items-center gap-3">
                        Categories <span className="h-[1px] flex-1 bg-neutral-100 dark:bg-neutral-800"></span>
</h4>
<ul className="space-y-4">
<li className="flex justify-between items-center group cursor-pointer">
<span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-primary transition-colors">Destinations</span>
<span className="text-[10px] font-bold text-neutral-300">12</span>
</li>
<li className="flex justify-between items-center group cursor-pointer">
<span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-primary transition-colors">Travel Tips</span>
<span className="text-[10px] font-bold text-neutral-300">08</span>
</li>
<li className="flex justify-between items-center group cursor-pointer">
<span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-primary transition-colors">Culture &amp; Art</span>
<span className="text-[10px] font-bold text-neutral-300">15</span>
</li>
<li className="flex justify-between items-center group cursor-pointer">
<span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-primary transition-colors">Luxury Escapes</span>
<span className="text-[10px] font-bold text-neutral-300">04</span>
</li>
</ul>
</div>
<div>
<h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-900 dark:text-white mb-6 flex items-center gap-3">
                        Recent Posts <span className="h-[1px] flex-1 bg-neutral-100 dark:bg-neutral-800"></span>
</h4>
<div className="space-y-6">
<div className="flex gap-4 group cursor-pointer">
<div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-800 flex-shrink-0 rounded-sm overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnMHLzNRcEdCeZewkenlrb-2PfktWUyNAIPzIyDe2oRLEPiIe84WiLN79_Ze-DOUkiEcs2Vp-BEd-El9JBtHosezFRMxi6ARCQAfcfl38JNsXyy7WnwvC42jV1kA5NHe_CPW2R_JdlndbBXAgu5z85WERgdAErB7HxOprdYPKNWL0Ead5fQwrmu_yfgqCJKIGhNPrjT7rbbVHaun18A-UVTNaWG_Vwo1--rnu1ncrSwR2p8s4337TWnMDT2PwxssX1uBcG_6bsV2SK"/>
</div>
<div>
<h5 className="text-xs font-bold text-neutral-900 dark:text-white leading-snug group-hover:text-primary transition-colors">The Best Sunrise Spots in the World</h5>
<p className="text-[10px] text-neutral-400 uppercase mt-1">Sep 28, 2023</p>
</div>
</div>
<div className="flex gap-4 group cursor-pointer">
<div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-800 flex-shrink-0 rounded-sm overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuLPtDSCXKNAqZFgYgt6nxXLGxR2-9qpjjDOAN2g6h_DifaIPiCRkKEZREoz_5IxOOhvY3a0sIuOyW1yku1KvXbU7kZHfzR0qfUjvPFDHuJt5iyuThuR4YKQ7r7YRLAxpA066Aian3Ni8Fuo0ewOoUswj5yTGD3PBunGNoAJeifjVqgTN_JY2wx2TmfjE2a5qyfqWRFLUCXx4EuCs05qT_XTgUNfRU443cdWf8429H2BzOBJlkPNpo_FHFERGSyMBipB4qxa_C8NON"/>
</div>
<div>
<h5 className="text-xs font-bold text-neutral-900 dark:text-white leading-snug group-hover:text-primary transition-colors">Gourmet Trails: Eating through Lyon</h5>
<p className="text-[10px] text-neutral-400 uppercase mt-1">Sep 24, 2023</p>
</div>
</div>
<div className="flex gap-4 group cursor-pointer">
<div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-800 flex-shrink-0 rounded-sm overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIcovQFfOLPdlxNn6R-8pyzC0H6qe0Be-k0tuboj9ZRB7GXZREF1A4tTGLQ1uSD9lb2bifrtI6mEndWLQyPShLPkixteIMm0oCkqCe0ydqokg_EWwwjcWQv0teX74sGAEhNPRrVCfNZrO_Y6KLj0Ow6DdoiAvUQnU-lM4M3vPj1vrKtSxQP2aPPaWW3QiJ1fhziWciEBdvKi92GsYFWg_59GMYK_chyIhAMQKY1rRME0Mh4xQrf8Q3mhDag4pKGaaru3NvE_9OBOzM"/>
</div>
<div>
<h5 className="text-xs font-bold text-neutral-900 dark:text-white leading-snug group-hover:text-primary transition-colors">Packing Light for a 3-Month Trip</h5>
<p className="text-[10px] text-neutral-400 uppercase mt-1">Sep 15, 2023</p>
</div>
</div>
</div>
</div>
<div className="bg-neutral-100 dark:bg-neutral-800 p-8 text-center rounded-sm">
<span className="material-symbols-outlined text-primary text-3xl mb-4">mail</span>
<h4 className="font-serif text-xl mb-3 dark:text-white">Join the Newsletter</h4>
<p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">Receive curated travel stories and hidden destination guides twice a month.</p>
<input className="w-full bg-white dark:bg-neutral-900 border-none px-4 py-3 text-xs mb-3 focus:ring-1 focus:ring-primary outline-none" placeholder="Email Address" type="email"/>
<button className="w-full bg-neutral-900 dark:bg-primary text-white text-[10px] font-black uppercase tracking-widest py-3 hover:opacity-90 transition-opacity">Subscribe</button>
</div>
</div>
</aside>
</div>
</main>
    </div>
  );
};

export default ToursDiscoveryFiltering4;
