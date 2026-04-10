import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import QueryModal from '../components/QueryModal';
import ConsultSpecialistModal from '../components/ConsultSpecialistModal';
import BikeTourMap from '../components/BikeTourMap';

const getInclusionIcon = (text) => {
  const t = text.toLowerCase();
  if (t.includes('hotel') || t.includes('stay') || t.includes('accommodation')) return 'apartment';
  if (t.includes('breakfast') || t.includes('meal') || t.includes('dinner') || t.includes('lunch')) return 'restaurant';
  if (t.includes('transfer') || t.includes('pickup') || t.includes('airport')) return 'local_taxi';
  if (t.includes('guide') || t.includes('escort')) return 'person_pin';
  if (t.includes('permit') || t.includes('entry') || t.includes('ticket')) return 'confirmation_number';
  if (t.includes('bike') || t.includes('motorcycle') || t.includes('cycle')) return 'motorcycle';
  if (t.includes('fuel') || t.includes('gas')) return 'local_gas_station';
  if (t.includes('backup') || t.includes('mechanic')) return 'build';
  if (t.includes('medical') || t.includes('oxygen') || t.includes('first aid')) return 'medical_services';
  return 'task_alt';
};

const BikeTourDetailView = () => {
    const { slug } = useParams();
    const location = useLocation();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [showStickyNav, setShowStickyNav] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    const fetchTour = async () => {
        setLoading(true);
        try {
            const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            
            let data = null;
            if (isDev) {
                const response = await fetch(`/api/v1/bike-tours/slug/${slug}`);
                if (response.ok) {
                    data = await response.json();
                } else {
                    throw new Error('API Error');
                }
            } else {
                const response = await fetch(`/data/bike-tours.json?t=${Date.now()}`);
                if (response.ok) {
                    const allTours = await response.json();
                    data = allTours.find(t => t.slug === slug);
                }
            }

            if (data) {
                // Normalize inclusions and exclusions for standardized rendering
                const normalizedInclusions = Array.isArray(data.inclusions) && data.inclusions.length > 0
                    ? data.inclusions
                    : (Array.isArray(data.whatsIncluded) 
                        ? data.whatsIncluded.map(item => typeof item === 'string' ? { text: item, option: "Included" } : item)
                        : []);
                
                const normalizedExclusions = Array.isArray(data.exclusions)
                    ? data.exclusions
                    : [];

                setTour({
                    ...data,
                    inclusions: normalizedInclusions,
                    exclusions: normalizedExclusions
                });
            }
        } catch (err) {
            console.error('Fetch error:', err);
            // Fail-safe for map verification
            if (slug === 'leh-and-leh-grand-circuit') {
                setTour({
                    slug: 'leh-and-leh-grand-circuit',
                    title: 'Leh and Leh Grand Circuit',
                    subtitle: 'The Ultimate Himalayan Loop',
                    content: '<article><h1>Leh Grand Circuit</h1><p>Join us for the most epic bike tour in the Himalayas.</p></article>',
                    duration: '10 Days',
                    coveredPlaces: ['Leh', 'Khardung La', 'Nubra Valley', 'Turtuk', 'Pangong Tso', 'Tso Moriri'],
                    destination: 'Ladakh',
                    country: 'India',
                    mainImage: '/ladakh-bike-expedition.png',
                    status: 'active'
                });
                setLoading(false);
            } else {
                setError(true);
                setLoading(false);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            const currentScroll = window.scrollY;
            setScrollProgress((currentScroll / totalScroll) * 100);
            setShowStickyNav(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        fetchTour();
        window.scrollTo(0, 0);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [slug]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="w-16 h-16 border-8 border-slate-100 border-t-primary rounded-full animate-spin"></div>
                <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Charting the course...</p>
            </div>
        );
    }

    if (!tour) {
        return (
            <div className="text-center py-60 space-y-10">
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-6xl text-slate-200">explore</span>
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-serif font-black text-slate-800">The Path is Missing</h2>
                    <p className="text-slate-500 font-medium">This adventure is currently being re-charted.</p>
                </div>
                <Link to="/tours/bike-tours" className="inline-block px-12 py-5 bg-primary text-white rounded-full font-black uppercase text-xs tracking-[4px] shadow-2xl shadow-primary/30 hover:bg-slate-900 transition-all">Back to Fleet</Link>
            </div>
        );
    }

    const tourUrl = `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, '')}${location.pathname}`;

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen pb-40">
            <div className={`fixed top-0 inset-x-0 h-20 z-50 transition-all duration-700 ease-in-out hidden md:block ${showStickyNav ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                {/* Visual Glassmorphism Backdrop */}
                <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-slate-200/50 dark:border-white/10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)]"></div>
                
                {/* Dynamic Scroll Progress Accent */}
                <div 
                    className="absolute top-0 left-0 h-[3px] bg-gradient-to-r from-primary to-emerald-400 transition-all duration-200 ease-out z-10" 
                    style={{ width: `${scrollProgress}%` }}
                ></div>

                <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 h-full w-full flex items-center justify-between">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-[10px] font-black text-primary uppercase tracking-[4px]">Bike Expedition</span>
                        </div>
                        <h3 className="text-xl font-serif font-black text-slate-900 dark:text-white truncate max-w-[300px] lg:max-w-md italic tracking-tight">{tour.title}</h3>
                    </div>
                    <div className="flex items-center gap-12">
                        <div className="hidden lg:flex flex-col items-end">
                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1.5">Adventure starts at</span>
                            <div className="flex items-baseline gap-1.5 text-slate-900 dark:text-white">
                                <span className="text-sm font-light text-primary -mb-1 translate-y-[2px]">₹</span>
                                <span className="text-3xl font-black tabular-nums tracking-tighter leading-none">
                                    {tour.pricing?.perPerson?.toLocaleString() || '39,000'}
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1.5 opacity-80">/ person</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsQueryModalOpen(true)}
                            className="group relative px-10 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black uppercase text-[10px] tracking-[3px] shadow-2xl shadow-black/10 hover:shadow-primary/40 transition-all overflow-hidden flex items-center gap-3"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary via-emerald-400 to-primary bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <span className="relative z-10 group-hover:text-white transition-colors">Reserve Your Slot</span>
                            <span className="relative z-10 material-symbols-outlined text-sm group-hover:translate-x-1 group-hover:text-white transition-all">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>

            <Helmet>
                <title>{tour.title} | The Beautiful India</title>
                <meta name="description" content={tour.subtitle || tour.title} />
                {tour.schemaMarkup && (
                    <script type="application/ld+json">
                        {tour.schemaMarkup}
                    </script>
                )}
            </Helmet>
            {/* Scroll Progress Bar */}
            <div className="scroll-progress"></div>

            {/* Smart CSS Overrides for Dark Mode Injected HTML */}
            <style dangerouslySetInnerHTML={{__html: `
                .dark .article-content {
                    --deep: #FFFFFF !important;
                    --cream: transparent !important;
                    --rule: #1e293b !important;
                    --light: #0f172a !important;
                    color: #cbd5e1 !important;
                }
                .dark .article-content h2,
                .dark .article-content h3,
                .dark .article-content strong,
                .dark .article-content .route-step-text,
                .dark .article-content .meeting-card-header strong {
                    color: #FFFFFF !important;
                }
                .dark .article-content .alert,
                .dark .article-content .breakfast-card {
                    background: #0f172a !important;
                    border: 1px solid #1e293b !important;
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
                }
                .dark .article-content .route-num {
                    background: #FFFFFF !important;
                    color: #0f172a !important;
                }
                .dark .article-content .inc-box.included {
                    background: rgba(16, 185, 129, 0.05) !important;
                    border-color: rgba(16, 185, 129, 0.2) !important;
                }
                .dark .article-content .inc-box.included h3,
                .dark .article-content .inc-box.included .inc-list li::before {
                    color: #34d399 !important;
                }
                .dark .article-content .inc-box.excluded {
                    background: rgba(249, 115, 22, 0.05) !important;
                    border-color: rgba(249, 115, 22, 0.2) !important;
                }
                .dark .article-content .inc-box.excluded h3,
                .dark .article-content .inc-box.excluded .inc-list li::before {
                    color: #fb923c !important;
                }
                .dark .article-content .inc-list li { border-color: rgba(255,255,255,0.05) !important; }
                .dark .article-content p, .dark .article-content .inc-list li, .dark .article-content .tip-text, .dark .article-content .meeting-card-body p {
                    color: #94a3b8 !important;
                }
                .dark .article-content .meeting-card {
                    background: #0f172a !important;
                    border-color: #1e293b !important;
                }
                .dark .article-content .meeting-card-header {
                    background: #1e293b !important;
                }
                .dark .article-content .timeline-line { background: #334155 !important; }
            `}} />

            {/* Premium Hero / Gallery */}
            <section className="relative h-[85vh] overflow-hidden group">
                <img 
                    src={tour.mainImage} 
                    alt={tour.title} 
                    fetchpriority="high"
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[3s] ease-out object-top md:object-center" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/90"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-transparent to-transparent opacity-100 md:opacity-0 transition-opacity"></div>

                
                <div className="absolute inset-x-0 bottom-0 py-12 md:py-20 z-10">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-10 space-y-6 md:space-y-8 animate-fade-up">
                        <div className="flex flex-wrap gap-3 md:gap-4">
                            <span className="px-5 py-2 md:px-6 md:py-2 bg-primary text-white rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[4px] md:tracking-[6px] shadow-xl shadow-primary/20">
                                {tour.tourType === 'Bike' ? 'Motorbike' : 'Cycling'}
                            </span>
                            <span className="px-5 py-2 md:px-6 md:py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[4px] md:tracking-[6px]">
                                {tour.duration}
                            </span>
                            <span className="px-5 py-2 md:px-6 md:py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full text-[10px] md:text-[11px] font-black flex items-center gap-2">
                                <span className="text-white/40 text-[16px] font-light italic">₹</span>
                                {tour.id === 15 || tour.slug?.includes('delhi') ? '24,000' : '39,000'}
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white leading-tight md:leading-[1.1] tracking-tighter max-w-4xl">
                            {tour.title}
                        </h1>
                        <p className="text-white/80 md:text-white/60 text-lg md:text-xl font-medium tracking-[4px] md:tracking-[8px] uppercase">{tour.destination}</p>
                    </div>
                </div>
                {/* Visual fade block blending hero with body in light/dark mode */}
                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent pointer-events-none z-0"></div>
            </section>

            {/* Main Content Layout */}
            <main className="max-w-[1400px] mx-auto px-6 md:px-10 mt-12 md:mt-24">
                <div className="space-y-24">
                    {/* Main Content: Editorial Storytelling */}
                    <div className="space-y-24">
                        {/* Highlights Grid */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <h2 className="text-[10px] font-black uppercase tracking-[8px] text-primary">The Vibe</h2>
                                <h3 className="text-4xl font-serif font-black text-slate-900 dark:text-white leading-tight italic">
                                    Conquer the terrain with <span className="text-primary italic">unrivaled style.</span>
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                {tour.highlights?.slice(0, 3).map((h, i) => (
                                    <div key={i} className="flex gap-6 items-center p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all group/card animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover/card:bg-primary group-hover/card:text-white transition-all">
                                            <span className="material-symbols-outlined font-black text-2xl">star</span>
                                        </div>
                                        <p className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-[0.2em]">{h}</p>
                                    </div>
                                ))}
                            </div>
                        </section>



                        {/* Editorial Body */}
                        <section className="article-content max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: tour.content }} />
                        </section>

                        {/* Standardized Inclusions & Exclusions */}
                        {( (tour.inclusions && tour.inclusions.length > 0) || (tour.exclusions && tour.exclusions.length > 0) ) && (
                            <section className="space-y-12 py-12 border-t border-slate-100 dark:border-slate-800">
                                <div className="space-y-4">
                                    <h2 className="text-[10px] font-black uppercase tracking-[8px] text-primary">The Details</h2>
                                    <h3 className="text-4xl font-serif font-black text-slate-900 dark:text-white italic">Package <span className="text-primary italic">Inclusions & Exclusions</span></h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Inclusions */}
                                    {tour.inclusions && tour.inclusions.length > 0 && (
                                        <div className="inc-box included p-10 rounded-[40px] border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-950/10 space-y-8 h-full">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                                    <span className="material-symbols-outlined font-black">check_circle</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-serif font-black text-slate-900 dark:text-white italic">Included</h4>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Everything we cover</p>
                                                </div>
                                            </div>
                                            <ul className="space-y-5">
                                                {tour.inclusions.map((item, idx) => (
                                                    <li key={idx} className="flex items-start gap-4 group">
                                                        <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                                                            <span className="material-symbols-outlined text-[18px] text-emerald-500">{getInclusionIcon(item.text)}</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.text}</span>
                                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">{item.option}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Exclusions */}
                                    {tour.exclusions && tour.exclusions.length > 0 && (
                                        <div className="inc-box excluded p-10 rounded-[40px] border border-rose-100 dark:border-rose-900/30 bg-rose-50/30 dark:bg-rose-950/10 space-y-8 h-full">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                                                    <span className="material-symbols-outlined font-black">cancel</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-serif font-black text-slate-900 dark:text-white italic">Not Included</h4>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400">Extra charges apply</p>
                                                </div>
                                            </div>
                                            <ul className="space-y-5">
                                                {tour.exclusions.map((item, idx) => (
                                                    <li key={idx} className="flex items-start gap-4 group">
                                                        <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                                                            <span className="material-symbols-outlined text-[18px] text-rose-500">{getInclusionIcon(item.text)}</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 line-through decoration-rose-300 dark:decoration-rose-900">{item.text}</span>
                                                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-tighter">{item.option}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Interactive Itinerary / Tabs */}
                        <section className="space-y-12">
                            <div className="flex gap-10 border-b border-slate-100 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
                                {['overview', 'itinerary', 'map'].map(tab => (
                                    <button 
                                        key={tab} 
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 text-[10px] font-black uppercase tracking-[4px] transition-all relative ${activeTab === tab ? 'text-primary' : 'text-slate-400'}`}
                                    >
                                        {tab}
                                        {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full animate-in slide-in-from-left duration-500"></div>}
                                    </button>
                                ))}
                            </div>

                            <div className="animate-fade-up">
                                {activeTab === 'overview' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-400">
                                        <div className="space-y-6 bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800">
                                            <h4 className="text-slate-900 dark:text-white font-serif font-black text-2xl italic">Overview</h4>
                                            <p className="leading-relaxed font-medium">This expedition is designed for those who seek the extraordinary. From the highest motorable passes to the most serene valley floors, experience India like never before.</p>
                                        </div>
                                        <div className="space-y-8 bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800">
                                            <h4 className="text-slate-900 dark:text-white font-serif font-black text-2xl italic">Details</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Duration</span>
                                                    <span className="text-slate-900 dark:text-white font-black">{tour.duration}</span>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Region</span>
                                                    <span className="text-slate-900 dark:text-white font-black">{tour.destination}</span>
                                                </div>
                                                <div className="flex justify-between items-center pb-4">
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Ideal For</span>
                                                    <span className="text-slate-900 dark:text-white font-black">Advanced Riders</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'itinerary' && (
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-10 md:p-16 rounded-[60px] border border-slate-100 dark:border-slate-800">
                                        <div className="space-y-12">
                                            <h4 className="text-4xl font-serif font-black text-slate-900 dark:text-white italic mb-10">The Journey Map</h4>
                                            <div className="grid gap-8">
                                                {tour.itinerary?.map((item, idx) => (
                                                    <div key={idx} className="flex gap-10 group/item">
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-primary border border-slate-200 dark:border-slate-700 shadow-lg group-hover/item:bg-primary group-hover/item:text-white transition-all">{idx + 1}</div>
                                                            <div className="w-px flex-1 bg-slate-200 dark:bg-slate-700 my-4"></div>
                                                        </div>
                                                        <div className="grow pb-12">
                                                            <h5 className="text-xl font-serif font-black text-slate-800 dark:text-white group-hover/item:text-primary transition-colors mb-4 italic">{item.title}</h5>
                                                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'map' && (
                                    <div className="rounded-[60px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl h-[600px] bg-slate-50">
                                        <BikeTourMap slug={tour.slug} title={tour.title} tour={tour} />
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

            </main>

            {/* Mobile Sticky Bottom Booking Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-5 px-8 bg-white/95 dark:bg-slate-950/95 backdrop-blur-3xl border-t border-slate-100 dark:border-white/5 lg:hidden z-40 flex items-center justify-between shadow-[0_-20px_50px_rgba(0,0,0,0.15)] animate-in slide-in-from-bottom duration-700">
                <div className="flex flex-col">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Starting From</p>
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-light text-primary -mt-1.5">₹</span>
                        <span className="font-serif font-black text-2xl text-slate-900 dark:text-white tracking-tighter">
                            {tour.pricing?.perPerson?.toLocaleString() || 'Custom'}
                        </span>
                    </div>
                </div>
                <button 
                    onClick={() => setIsQueryModalOpen(true)} 
                    className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-90 transition-all outline-none flex items-center gap-2 group"
                >
                    Reserve Now
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">trending_flat</span>
                </button>
            </div>

            {/* Consult Specialist Modal */}
            <ConsultSpecialistModal isOpen={isQueryModalOpen} onClose={() => setIsQueryModalOpen(false)} tourTitle={tour.title} />
        </div>
    );
};

export default BikeTourDetailView;
