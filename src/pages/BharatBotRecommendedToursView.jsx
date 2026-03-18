import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

/**
 * Auto-generated from: wanderbot_recommended_tours_view/code.html
 * Group: ai | Path: /wanderbot/recommendations
 */
const BharatBotRecommendedToursView = () => {
    const location = useLocation();
    const capturedData = location.state || {};
    const { userName = 'Explorer', userInterest = 'Adventure', budget = 'Standard', travelers = '2' } = capturedData;
    const [recommendedTours, setRecommendedTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const { formatPrice } = useCurrency();

    useEffect(() => {
        const fetchRecommendedTours = async () => {
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

                // Filter out paused/draft
                const activeTours = allToursList.filter(t => t.status !== 'paused' && t.status !== 'draft');

                // Find tours that match the interest (case-insensitive) or just take first 3 if none match
                const matches = activeTours.filter(t =>
                    t.nature?.toLowerCase().includes(userInterest.toLowerCase()) ||
                    t.theme?.toLowerCase().includes(userInterest.toLowerCase()) ||
                    t.title?.toLowerCase().includes(userInterest.toLowerCase())
                );

                setRecommendedTours(matches.length > 0 ? matches : activeTours.slice(0, 3));
                setLoading(false);
            } catch (err) {
                console.error("Fetch tours error:", err);
                setLoading(false);
            }
        };
        fetchRecommendedTours();
    }, [userInterest]);

    return (
        <div data-page="wanderbot_recommended_tours_view">
            <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <div className="layout- flex h-full grow flex-col">
                    {/* Navigation Bar */}

                    {/* Main Content Area (Chat Style) */}
                    <main className="flex-1 flex flex-col   w-full px-4 py-8">
                        <div className="flex flex-col gap-8">
                            {/* Chat Header */}
                            <div className="text-center space-y-2">
                                <h1 className="text-slate-900 dark:text-slate-100 text-3xl md:text-4xl font-extrabold tracking-tight">Bharat Bot: Your Personalized Recommendations</h1>
                                <p className="text-slate-500 dark:text-slate-400">Based on your recent travel survey and interests</p>
                            </div>
                            {/* Bot Message */}
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 rounded-full p-2 shrink-0">
                                    <span className="material-symbols-outlined text-primary">smart_toy</span>
                                </div>
                                <div className="flex flex-col gap-2 ">
                                    <div className="bg-white dark:bg-slate-800 border border-primary/10 shadow-sm rounded-xl rounded-tl-none p-5">
                                        <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                                            Great to meet you, <strong>{userName}</strong>! Based on your preference for <strong>{userInterest}</strong> and your budget for a <strong>{budget}</strong> experience for <strong>{travelers}</strong> traveler(s), I've curated these exclusive tour packages just for you. Which one sparks your wanderlust?
                                        </p>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium ml-1">Bharat Bot • Just now</span>
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center py-20 text-slate-400 font-bold">Bharat Bot is curating your matches...</div>
                            ) : (
                                /* Horizontal Carousel */
                                <div className="relative w-full overflow-hidden">
                                    <div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x px-2">
                                        {recommendedTours.map(tour => {
                                            const tourDestSegment = encodeURIComponent((tour.destination || 'global').toLowerCase().replace(/\s+/g, '-'));
                                            const tourStateSegment = encodeURIComponent((tour.stateRegion || 'state').toLowerCase().replace(/\s+/g, '-'));
                                            const tourSubSegment = encodeURIComponent((tour.subregion || 'subregion').toLowerCase().replace(/\s+/g, '-'));
                                            const tourTitleSegment = encodeURIComponent((tour.title || 'tour').toLowerCase().replace(/\s+/g, '-'));
                                            const detailUrl = `/tours/${tourDestSegment}/${tourStateSegment}/${tourSubSegment}/${tourTitleSegment}`;
                                            
                                            return (
                                            <Link key={tour.id} to={detailUrl} className="min-w-[320px] max-w-[320px] snap-center bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md border border-primary/5 hover:shadow-xl transition-shadow group block">
                                                <div className="h-48 w-full bg-slate-200 relative overflow-hidden">
                                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={tour.image} alt={tour.title} />
                                                    {tour.popular && (
                                                        <div className="absolute top-3 left-3">
                                                            <span className="bg-primary/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">Bestseller</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-5 flex flex-col gap-3">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 truncate">{tour.title}</h3>
                                                        <p className="text-primary font-bold text-xl">{formatPrice(tour.price, true)} <span className="text-xs font-normal text-slate-400">/ person</span></p>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-primary/5 dark:bg-primary/20 p-2 rounded-lg">
                                                        <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                                                        <p className="text-[12px] font-semibold text-primary">Top Match for {userInterest}</p>
                                                    </div>
                                                    <div className="w-full border border-primary text-primary group-hover:bg-primary group-hover:text-white py-2 rounded-lg text-sm font-bold transition-all text-center">View Details</div>
                                                </div>
                                            </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
                                <Link className="w-full sm:w-auto min-w-[200px] h-14 px-8 bg-primary text-white font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2" to="/tours">
                                    <span>See All Matches</span>
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </Link>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
` }} />
        </div>
    );
};

export default BharatBotRecommendedToursView;
