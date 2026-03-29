import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { safeCacheTours, STORAGE_KEYS } from '../utils/storage';
import { calculateTourMatches } from '../utils/matchmaking';

const BharatBotRecommendedToursView = () => {
    const location = useLocation();
    const capturedData = location.state || {};
    const { userName = 'Explorer', userInterest = 'Adventure' } = capturedData;
    const [recommendedTours, setRecommendedTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const { formatPrice } = useCurrency();

    useEffect(() => {
        const fetchRecommendedTours = async () => {
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
                    const saved = localStorage.getItem(STORAGE_KEYS.TOURS);
                    if (saved !== null) {
                        try {
                            const parsed = JSON.parse(saved);
                            if (Array.isArray(parsed)) allToursList = parsed.filter(Boolean);
                        } catch(e) {}
                    }
                }

                // Filter out paused/draft
                const activeTours = allToursList.filter(t => t.status !== 'paused' && t.status !== 'draft');

                // Use the Intelligent Matchmaking Engine
                const matches = calculateTourMatches(capturedData, activeTours);

                setRecommendedTours(matches.length > 0 ? matches : activeTours.slice(0, 3));
                setLoading(false);
            } catch (err) {
                console.error("Fetch tours error:", err);
                setLoading(false);
            }
        };
        fetchRecommendedTours();
    }, [capturedData]);

    return (
        <div data-page="bharatbot_recommended_tours_view" className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen py-12 px-4">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">auto_awesome</span> Intelligent Matching Complete
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                        Curated for {userName}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold italic text-lg">
                        We've analyzed our flagship catalog to find your perfect Indian expedition.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Finalizing Rankings...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recommendedTours.map((tour, index) => (
                            <Link 
                                key={tour.id} 
                                to={`/tour/${tour.id}`} 
                                className="group bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all hover:-translate-y-2 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <div className="h-64 relative overflow-hidden">
                                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                                            <span className="material-symbols-outlined text-sm text-primary fill-primary">verified</span>
                                            <span className="text-[10px] font-black text-slate-900 tracking-widest uppercase">{tour.matchScore}% Match</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{tour.nature || tour.theme}</p>
                                        <h3 className="text-xl font-black text-white leading-tight">{tour.title}</h3>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Starting from</p>
                                            <p className="text-2xl font-black text-primary">{formatPrice(tour.price || tour.pricing?.perPrice, true)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Duration</p>
                                            <p className="text-lg font-black text-slate-800 dark:text-slate-100">{tour.duration}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-primary">psychology</span>
                                        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 italic">
                                            Matches your preference for <span className="text-primary font-black uppercase">{userInterest}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-lg shadow-primary/20 group-hover:bg-primary/90 transition-colors">
                                        View Expedition <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Secondary Actions */}
                <div className="flex flex-col items-center gap-6 pt-12">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Not quite what you're looking for?</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/tours" className="px-10 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:border-primary transition-all shadow-sm">
                            Browse All Expeditions
                        </Link>
                        <Link to="/bharatbot" className="px-10 py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                            Restart Matchmaker
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BharatBotRecommendedToursView;
