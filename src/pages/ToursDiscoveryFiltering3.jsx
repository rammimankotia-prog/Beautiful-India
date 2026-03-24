import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { safeCacheTours, STORAGE_KEYS } from '../utils/storage';

/**
 * Auto-generated from: tours_discovery_filtering_3/code.html
 * Group: tours | Path: /tours/filter/3
 */
const ToursDiscoveryFiltering3 = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const { formatPrice } = useCurrency();

    useEffect(() => {
        const fetchTours = async () => {
            try {
                let allToursList = [];
                const baseUrl = import.meta.env.BASE_URL || '/';
                const apiUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}data/tours.json?t=${Date.now()}`;
                const res = await fetch(apiUrl);
                if (res.ok) {
                    const data = await res.json();
                    if (data && Array.isArray(data)) {
                        allToursList = data.filter(Boolean);
                        safeCacheTours(STORAGE_KEYS.TOURS, allToursList);
                    }
                } else {
                    // Fallback to localStorage if fetch fails
                    const saved = localStorage.getItem(STORAGE_KEYS.TOURS);
                    if (saved !== null) {
                        try {
                            const parsed = JSON.parse(saved);
                            if (Array.isArray(parsed)) allToursList = parsed.filter(Boolean);
                        } catch(e) {}
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
    <div data-page="tours_discovery_filtering_3">
      <main>
<section className="relative h-[600px] flex items-center justify-center overflow-hidden">
<div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCM19sk8EBOtfcndG0GPfyQz7WQ3ZkkWu5wHw1wSyLDwdZXCi8bo_OjAW45z9bqGE3eXDsy3xi-oj7bY7x1y8uxwzj_pjs-Viz_1slz_FOVg0n-GbxgycTeYrw7nSHXG3sOZ7MD2h6N7xU-mD5Rnim9EE1xdP8VMQyf9GOBnMAKBJHJR-mCwjttdAnwzuFUFgaipcYmBYhRfznZ5eSNdCYloRwwqrZsLVOUDKQLMgPg7o3boEfcNcvJa9tjB8N39AauCEz63y2FZxZA')" }}></div>
<div className="absolute inset-0 hero-overlay"></div>
<div className="relative z-10 text-center px-4  w-full">
<h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-lg">Discover Your Next Adventure</h1>
<p className="text-white/90 text-xl mb-10  ">Explore the world's most breathtaking locations with our expert-led boutique tours.</p>
<div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2  ">
<div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-neutral-100">
<span className="material-symbols-outlined text-neutral-600 mr-3">location_on</span>
<input className="w-full border-none focus:ring-0 text-sm font-medium placeholder:text-neutral-400" placeholder="Where to?" type="text"/>
</div>
<div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-neutral-100">
<span className="material-symbols-outlined text-neutral-600 mr-3">calendar_month</span>
<input className="w-full border-none focus:ring-0 text-sm font-medium placeholder:text-neutral-400" placeholder="When?" type="text"/>
</div>
<button className="bg-primary text-white font-bold py-4 px-8 rounded-xl hover:bg-opacity-95 transition-all flex items-center justify-center gap-2">
<span className="material-symbols-outlined">search</span>
                    Search Tours
                </button>
</div>
</div>
</section>
        <section className="py-20 px-4 sm:px-6 lg:px-8  ">
            <div className="flex items-end justify-between mb-12">
                <div>
                    <span className="text-primary font-bold uppercase tracking-widest text-sm block mb-2">Curated Experiences</span>
                    <h2 className="text-4xl font-black text-neutral-900">Featured Tours</h2>
                </div>
                <Link className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all border-b-2 border-primary/20 hover:border-primary pb-1" to="/tours">
                    View All <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-2xl"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tours.map(tour => {
                        const displayState = Array.isArray(tour.stateRegion) ? tour.stateRegion.join(', ') : tour.stateRegion;
                        const displayDest = Array.isArray(tour.destination) ? tour.destination.join(', ') : tour.destination;
                        const detailUrl = `/tour/${tour.id}`;

                        return (
                            <Link key={tour.id} to={detailUrl} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-neutral-100 group block">
                                <div className="h-64 relative overflow-hidden">
                                    <img alt={tour.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={tour.image} />
                                    {tour.popular && (
                                        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Top Rated</div>
                                    )}
                                    <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-primary transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">favorite</span>
                                    </button>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-1 text-primary text-xs font-bold uppercase mb-3">
                                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                                        <span>{displayState}, {displayDest}</span>
                                    </div>
                                    <p className="text-slate-500 font-bold mb-6 italic">Hand-picked by Beautiful India experts</p>
                                    <h3 className="text-xl font-bold mb-3 text-neutral-900 group-hover:text-primary transition-colors">{tour.title}</h3>
                                    <div className="flex items-center gap-6 text-sm text-neutral-600 mb-6">
                                        <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">schedule</span> {tour.duration}</div>
                                        <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">star</span> 4.9 (120)</div>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-neutral-50 pt-6">
                                        <div>
                                            <span className="text-xs text-neutral-600 block">Starting from</span>
                                            <span className="text-2xl font-black text-primary">{formatPrice(tour.price, true)}</span>
                                        </div>
                                        <div className="bg-sand text-primary font-bold py-2.5 px-5 rounded-lg group-hover:bg-primary group-hover:text-white transition-all">Details</div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </section>
<section className="bg-sand py-24 px-4 sm:px-6 lg:px-8">
<div className=" ">
<div className="text-center mb-16">
<span className="text-primary font-bold uppercase tracking-widest text-sm block mb-2">Testimonials</span>
<h2 className="text-4xl font-black text-primary">Voices of Adventure</h2>
<div className="w-24 h-1 bg-sunset  mt-4 rounded-full"></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
<div className="bg-white p-8 rounded-2xl shadow-sm border border-primary/10 flex flex-col h-full hover:shadow-md transition-shadow">
<div className="flex gap-1 mb-6">
<span className="material-symbols-outlined testimonial-star text-sunset">star</span>
<span className="material-symbols-outlined testimonial-star text-sunset">star</span>
<span className="material-symbols-outlined testimonial-star text-sunset">star</span>
<span className="material-symbols-outlined testimonial-star text-sunset">star</span>
<span className="material-symbols-outlined testimonial-star text-sunset">star</span>
</div>
<blockquote className="text-primary italic text-lg font-medium mb-8 flex-grow">
                        "The Cappadocia tour was beyond my wildest dreams. Sleeping in cave hotels and seeing the sunrise from a balloon is a memory I'll cherish forever."
                    </blockquote>
<div className="flex items-center gap-4 mt-auto">
<img alt="Sarah J." className="w-14 h-14 rounded-full object-cover border-2 border-sunset shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARX3oQb2YBFrkip5ChcbezFaO1957DuTs8CGeBV8-yWEikQzUbmmNX41ToPVBdB2bIECGUGa1dbmO7CPjOgXXBb58gDiaVbLzRUcJeJQHpHV2-005YPMCuayRihg_FXWeKdtEKCUZO0s0Cks5I_suTBRVwBOQGbCQ5bix9d7zsmjqJCQCw7KI1beuy3D0jRMBj3fEqyXYYfTGcOM9HuBEuyrT-fu1_mbmGvlWZYLWKFbKb06Om_BR3270fJ6v_0veKFI887w1rxP7g"/>
<div>
<h4 className="font-bold text-primary leading-tight">Sarah Jenkins</h4>
<p className="text-xs text-neutral-600 font-semibold uppercase tracking-wide mt-1">Magic Skies &amp; Ancient Caves</p>
</div>
</div>
</div>
<div className="bg-white p-8 rounded-2xl shadow-sm border border-primary/10 flex flex-col h-full hover:shadow-md transition-shadow">
<div className="flex gap-1 mb-6">
<span className="material-symbols-outlined testimonial-star text-sunset">star</span>
<span className="material-symbols-outlined testimonial-star text-sunset">star</span>
<span className="material-symbols-outlined testimonial-star text-sunset">star</span>
<span className="material-symbols-outlined testimonial-star text-sunset">star</span>
<span className="material-symbols-outlined testimonial-star text-sunset">star</span>
</div>
<blockquote className="text-primary italic text-lg font-medium mb-8 flex-grow">
                        "Exceptional attention to detail. Our guide in Paris knew every hidden corner, making the history of France come alive in a way no book ever could."
                    </blockquote>
<div className="flex items-center gap-4 mt-auto">
<img alt="David M." className="w-14 h-14 rounded-full object-cover border-2 border-sunset shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKQD_iCYOe0e4woRE4cSNHp4JdHWK7fm64jmR30K2hjpLxWpbyULm6RbApqDvpZ-1mXPUDrZAK6cS1dEqjYFP-8FbTo4cXxhAZDRVkR7WuCGYvEzUyNyo5bIzcwuxbuYOyjjGoDlKXU2DharMa1NTNV1Okwqb2P5zixvMAgp_3QuJ1e5Q9caySrPUxnmcHId3aO2qRlFoZMXURrsyPCWuhzJi1nmGn8mMwpMjyTMe6g1x-aWaCpQtQa4QY57KThC2u3JYcnLPS1Jja"/>
<div>
<h4 className="font-bold text-primary leading-tight">David Miller</h4>
<p className="text-xs text-neutral-600 font-semibold uppercase tracking-wide mt-1">European Highlights</p>
</div>
</div>
</div>
<div className="bg-white p-8 rounded-2xl shadow-sm border border-primary/10 flex flex-col h-full hover:shadow-md transition-shadow">
<div className="flex gap-1 mb-6">
<span className="material-symbols-outlined testimonial-star text-sunset">star</span>
<span className="material-symbols-outlined testimonial-star text-sunset">star</span>
<span className="material-symbols-outlined testimonial-star text-sunset">star</span>
<span className="material-symbols-outlined testimonial-star text-sunset">star</span>
<span className="material-symbols-outlined testimonial-star text-sunset">star</span>
</div>
<blockquote className="text-primary italic text-lg font-medium mb-8 flex-grow">
                        "The most peaceful week of my life. Wanderlust truly understands how to curate a relaxing escape without missing the local culture of Bali."
                    </blockquote>
<div className="flex items-center gap-4 mt-auto">
<img alt="Elena R." className="w-14 h-14 rounded-full object-cover border-2 border-sunset shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1ixX6051O4uBBkzuUVzpPDYVpGdbV3JHfsxBBeqNXhQ_SmfD4tvZcF7ndaJHBZUXGNP4PSGS05OKUgoWZ2bFAe1eUQV_oNEQgvcgIDzUQuYRvMLLVMEpsqUI2nRsyFcNLqpp9KIBmau3dNXuTu89HdUOD6y3fH2HB9DZWhxmiLRHYjgCm52LJHtxp-bfTczylXbalxvZ-38xJ8hHymczcHBJ05Q81ZM86_zCiWMidM4npjU6lT0PlpIcMc2T1pTCzEdX8aPv4qkJ5"/>
<div>
<h4 className="font-bold text-primary leading-tight">Elena Rodriguez</h4>
<p className="text-xs text-neutral-600 font-semibold uppercase tracking-wide mt-1">Island Escape Retreat</p>
</div>
</div>
</div>
</div>
</div>
</section>
<section className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-t border-neutral-50">
<div className=" ">
<div className="text-center mb-16">
<span className="text-primary font-bold uppercase tracking-widest text-sm block mb-2">Travel Stories</span>
<h2 className="text-4xl font-black text-neutral-900">Latest from the Blog</h2>
<div className="w-24 h-1 bg-sunset  mt-4 rounded-full"></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
<article className="group">
<div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 shadow-md border-4 border-white">
<img alt="Hidden gems of Europe" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuLPtDSCXKNAqZFgYgt6nxXLGxR2-9qpjjDOAN2g6h_DifaIPiCRkKEZREoz_5IxOOhvY3a0sIuOyW1yku1KvXbU7kZHfzR0qfUjvPFDHuJt5iyuThuR4YKQ7r7YRLAxpA066Aian3Ni8Fuo0ewOoUswj5yTGD3PBunGNoAJeifjVqgTN_JY2wx2TmfjE2a5qyfqWRFLUCXx4EuCs05qT_XTgUNfRU443cdWf8429H2BzOBJlkPNpo_FHFERGSyMBipB4qxa_C8NON"/>
</div>
<span className="text-primary font-bold text-xs uppercase mb-3 block">Destination Guides</span>
<h3 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-primary transition-colors leading-tight">10 Hidden Gems in Central Europe You Can't Miss</h3>
<p className="text-neutral-600 text-base mb-4 line-clamp-2">Escape the crowds and discover the charming cobblestone streets and secret gardens of these lesser-known European treasures...</p>
<a className="inline-flex items-center gap-2 text-primary font-black text-sm group/btn" href="#">
                        Read Article 
                        <span className="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
</a>
</article>
<article className="group">
<div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 shadow-md border-4 border-white">
<img alt="Travel photography tips" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnMHLzNRcEdCeZewkenlrb-2PfktWUyNAIPzIyDe2oRLEPiIe84WiLN79_Ze-DOUkiEcs2Vp-BEd-El9JBtHosezFRMxi6ARCQAfcfl38JNsXyy7WnwvC42jV1kA5NHe_CPW2R_JdlndbBXAgu5z85WERgdAErB7HxOprdYPKNWL0Ead5fQwrmu_yfgqCJKIGhNPrjT7rbbVHaun18A-UVTNaWG_Vwo1--rnu1ncrSwR2p8s4337TWnMDT2PwxssX1uBcG_6bsV2SK"/>
</div>
<span className="text-primary font-bold text-xs uppercase mb-3 block">Travel Tips</span>
<h3 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-primary transition-colors leading-tight">Mastering Adventure Photography on the Go</h3>
<p className="text-neutral-600 text-base mb-4 line-clamp-2">Learn how to capture the perfect sunrise over the desert or the raw energy of a bustling market with these simple professional tips...</p>
<a className="inline-flex items-center gap-2 text-primary font-black text-sm group/btn" href="#">
                        Read Article 
                        <span className="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
</a>
</article>
<article className="group">
<div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 shadow-md border-4 border-white">
<img alt="Sustainable travel" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIcovQFfOLPdlxNn6R-8pyzC0H6qe0Be-k0tuboj9ZRB7GXZREF1A4tTGLQ1uSD9lb2bifrtI6mEndWLQyPShLPkixteIMm0oCkqCe0ydqokg_EWwwjcWQv0teX74sGAEhNPRrVCfNZrO_Y6KLj0Ow6DdoiAvUQnU-lM4M3vPj1vrKtSxQP2aPPaWW3QiJ1fhziWciEBdvKi92GsYFWg_59GMYK_chyIhAMQKY1rRME0Mh4xQrf8Q3mhDag4pKGaaru3NvE_9OBOzM"/>
</div>
<span className="text-primary font-bold text-xs uppercase mb-3 block">Sustainable Living</span>
<h3 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-primary transition-colors leading-tight">How to be a Conscious Traveler in 2024</h3>
<p className="text-neutral-600 text-base mb-4 line-clamp-2">Traveling responsibly doesn't mean sacrificing luxury. We explore how to support local communities while enjoying premium experiences...</p>
<a className="inline-flex items-center gap-2 text-primary font-black text-sm group/btn" href="#">
                        Read Article 
                        <span className="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
</a>
</article>
</div>
</div>
</section>
</main>
    </div>
  );
};

export default ToursDiscoveryFiltering3;
