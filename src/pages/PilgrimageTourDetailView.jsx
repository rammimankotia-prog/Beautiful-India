import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// ─── Normalize nested JSON → flat field names used by JSX ───────────────────
const normalizeTour = (t) => {
    // destination / type may be stored as string OR array
    const toArray = (val) =>
        !val ? [] : Array.isArray(val) ? val : [val];

    // Dates: stored as "YYYY-MM-DD - YYYY-MM-DD" string in meta.dates
    const datesRaw = t.meta?.dates || '';
    const [dateStart] = datesRaw.split(' - ');

    return {
        ...t,
        // Content
        content: t.content?.visual_html ?? t.content ?? '',
        // Gallery
        tour_gallery: t.gallery || t.tour_gallery || [],
        // Itinerary
        tour_itinerary: t.itinerary || t.tour_itinerary || [],
        // Taxonomies
        tour_destination: toArray(t.taxonomies?.destination || t.tour_destination),
        tour_type:        toArray(t.taxonomies?.type        || t.tour_type),
        // Meta fields
        tour_city_path:     t.meta?.city_path     || t.tour_city_path     || '',
        tour_price_single:  t.meta?.price_single  || t.tour_price_single  || '',
        tour_price_couple:  t.meta?.price_couple  || t.tour_price_couple  || '',
        tour_price_group:   t.meta?.price_group   || t.tour_price_group   || '',
        tour_dates_ongoing: t.meta?.is_ongoing === true ? 'true'
                          : (t.tour_dates_ongoing || 'false'),
        tour_dates_start: dateStart || t.tour_dates_start || '',
        // Inclusions
        tour_transport: toArray(t.meta?.transport_options),
        tour_hotels:    toArray(t.meta?.hotel_options),
        tour_meals:     toArray(t.meta?.meal_options),
        tour_inclusions: t.meta?.inclusions || [],
        tour_exclusions: t.meta?.exclusions || [],
        // Price fallback
        price: t.meta?.price_single || t.price || '',
    };
};

const PilgrimageTourDetailView = () => {
    const { slug } = useParams();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeDay, setActiveDay] = useState(0);

    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [bookingForm, setBookingForm] = useState({
        name: '',
        phone: '',
        departureDate: '',
        travelers: 'Individual'
    });

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch(`${import.meta.env.BASE_URL}api-save-leads.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'Pilgrimage Inquiry',
                    to: tour.title,
                    ...bookingForm,
                    status: 'New'
                })
            });
            if (response.ok) {
                setSubmitSuccess(true);
                setTimeout(() => {
                    setIsBookingModalOpen(false);
                    setSubmitSuccess(false);
                    setBookingForm({ name: '', phone: '', departureDate: '', travelers: 'Individual' });
                }, 2500);
            }
        } catch (error) {
            console.error(error);
        }
        setIsSubmitting(false);
    };

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const response = await fetch(`${import.meta.env.BASE_URL}data/pk_pilgrimage_tours.json?t=${Date.now()}`);
                if (!response.ok) throw new Error('Data not found');
                const data = await response.json();
                // Clean slug to handle potential trailing slashes from URL or stored data
                const cleanParamSlug = (slug || '').replace(/\/$/, '').toLowerCase();
                const found = data.find(t => {
                    const cleanStoredSlug = (t.slug || '').replace(/\/$/, '').toLowerCase();
                    return cleanStoredSlug === cleanParamSlug && (t.status === 'publish' || t.status === 'published');
                });
                setTour(found ? normalizeTour(found) : null);
            } catch (err) {
                console.error(err);
                setTour(null);
            } finally {
                setLoading(false);
            }
        };
        fetchTour();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!tour) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-center px-4">
                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">location_off</span>
                <h1 className="text-3xl font-serif font-black text-slate-800 dark:text-white mb-2">Yatra Not Found</h1>
                <p className="text-slate-500 mb-8">The spiritual journey you are looking for does not exist or has been removed.</p>
                <Link to="/pilgrimage-tours" className="px-8 py-3 bg-orange-500 text-white rounded-full font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors">
                    Back to Pilgrimages
                </Link>
            </div>
        );
    }

    const mainImage = tour.tour_gallery.length > 0
        ? tour.tour_gallery[0]
        : 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80';

    const cityPath = tour.tour_city_path
        ? tour.tour_city_path.split(',').map(c => c.trim()).filter(Boolean)
        : [];

    const formatDate = (d) => {
        if (!d) return '';
        try { return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
        catch { return d; }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pb-32">

            {/* ── Hero ────────────────────────────────────────────── */}
            <div className="relative h-[70vh] lg:h-[80vh] bg-slate-900">
                <img
                    src={mainImage}
                    alt={tour.title}
                    className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

                <div className="absolute inset-x-0 bottom-0 p-8 md:p-16 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-3xl space-y-4">
                            {tour.tour_destination.length > 0 && (
                                <span className="inline-block px-4 py-1.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-[3px] rounded-full shadow-lg">
                                    {tour.tour_destination[0]}
                                </span>
                            )}
                            <h1 className="text-4xl md:text-7xl font-serif font-black text-white leading-tight drop-shadow-xl">
                                {tour.title}
                            </h1>
                            {cityPath.length > 0 && (
                                <div className="flex items-center gap-2 text-orange-200 text-sm font-medium flex-wrap">
                                    <span className="material-symbols-outlined text-[18px]">route</span>
                                    {cityPath.join(' → ')}
                                </div>
                            )}
                            {/* Tour type badges */}
                            {tour.tour_type.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {tour.tour_type.map((t, i) => (
                                        <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Grid ────────────────────────────────────────── */}
            <main className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16 relative">

                {/* ── Left: Content ──────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-16">

                    {/* Signature Inclusions */}
                    {(tour.tour_transport?.length > 0 || tour.tour_hotels?.length > 0 || tour.tour_meals?.length > 0) && (
                        <section className="bg-orange-50/50 dark:bg-orange-950/20 p-8 rounded-[32px] border border-orange-100 dark:border-orange-900/30">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-orange-500 text-[18px]">verified</span>
                                Signature Inclusions
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {tour.tour_transport?.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold">
                                            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600">
                                                <span className="material-symbols-outlined text-[16px]">airport_shuttle</span>
                                            </div>
                                            Transport
                                        </div>
                                        <div className="flex flex-col gap-1 pl-10 text-sm font-medium text-slate-600 dark:text-slate-300">
                                            {tour.tour_transport.map(opt => <span key={opt}>• {opt}</span>)}
                                        </div>
                                    </div>
                                )}
                                {tour.tour_hotels?.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold">
                                            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600">
                                                <span className="material-symbols-outlined text-[16px]">hotel</span>
                                            </div>
                                            Hotels
                                        </div>
                                        <div className="flex flex-col gap-1 pl-10 text-sm font-medium text-slate-600 dark:text-slate-300">
                                            {tour.tour_hotels.map(opt => <span key={opt}>• {opt}</span>)}
                                        </div>
                                    </div>
                                )}
                                {tour.tour_meals?.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold">
                                            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600">
                                                <span className="material-symbols-outlined text-[16px]">restaurant</span>
                                            </div>
                                            Meals
                                        </div>
                                        <div className="flex flex-col gap-1 pl-10 text-sm font-medium text-slate-600 dark:text-slate-300">
                                            {tour.tour_meals.map(opt => <span key={opt}>• {opt}</span>)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Detailed Terms (Inclusions/Exclusions) */}
                    {(tour.tour_inclusions?.length > 0 || tour.tour_exclusions?.length > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Inclusions */}
                            {tour.tour_inclusions?.length > 0 && (
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-2 px-2">
                                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                        What's Included
                                    </h3>
                                    <ul className="space-y-4">
                                        {tour.tour_inclusions.map((item, idx) => (
                                            <li key={idx} className="flex flex-col p-4 bg-emerald-50/30 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                                                <span className="text-sm font-black text-slate-800 dark:text-slate-200">{item.text}</span>
                                                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400/70 uppercase tracking-tighter mt-1">{item.option}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Exclusions */}
                            {tour.tour_exclusions?.length > 0 && (
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 flex items-center gap-2 px-2">
                                        <span className="material-symbols-outlined text-[20px]">cancel</span>
                                        Not Included
                                    </h3>
                                    <ul className="space-y-4">
                                        {tour.tour_exclusions.map((item, idx) => (
                                            <li key={idx} className="flex flex-col p-4 bg-rose-50/20 dark:bg-rose-950/10 rounded-2xl border border-rose-100/50 dark:border-rose-900/20 opacity-80">
                                                <span className="text-sm font-black text-slate-700 dark:text-slate-300 line-through decoration-rose-200">{item.text}</span>
                                                <span className="text-[11px] font-bold text-rose-500 dark:text-rose-400/70 uppercase tracking-tighter mt-1">{item.option}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* About the Yatra */}
                    {tour.content && (
                        <section className="space-y-6">
                            <h2 className="text-3xl font-serif font-black text-slate-800 dark:text-white uppercase tracking-widest border-b-2 border-orange-500/20 pb-4 inline-block">
                                The Journey
                            </h2>
                            <div
                                className="prose prose-lg dark:prose-invert prose-orange max-w-none text-slate-600 dark:text-slate-300 leading-relaxed marker:text-orange-500"
                                dangerouslySetInnerHTML={{ __html: tour.content }}
                            />
                        </section>
                    )}

                    {/* Path of Devotion */}
                    {cityPath.length > 0 && (
                        <section className="space-y-8 bg-orange-50/50 dark:bg-orange-950/20 p-8 md:p-12 rounded-[40px] border border-orange-100 dark:border-orange-900/30">
                            <h2 className="text-2xl font-serif font-black text-slate-800 dark:text-white uppercase tracking-widest text-center">
                                Path of Devotion
                            </h2>
                            <div className="relative pt-6">
                                <div className="absolute top-[45px] left-8 right-8 h-1 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 dark:from-orange-900 dark:via-orange-600 dark:to-orange-900 rounded-full hidden md:block"></div>
                                <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-4 overflow-x-auto pb-6 snap-x">
                                    {cityPath.map((city, idx) => (
                                        <div key={idx} className="flex flex-col items-center flex-shrink-0 w-32 snap-center group">
                                            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border-4 border-orange-400 group-hover:border-orange-600 flex items-center justify-center shadow-lg transition-colors mb-4 relative">
                                                <span className="material-symbols-outlined text-orange-500 text-[20px]">location_on</span>
                                                {idx !== cityPath.length - 1 && (
                                                    <div className="absolute top-12 left-1/2 -ml-[2px] w-1 h-12 bg-orange-200 dark:bg-orange-900 md:hidden"></div>
                                                )}
                                            </div>
                                            <span className="text-center font-bold text-slate-700 dark:text-slate-200 text-sm">{city}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Daily Itinerary */}
                    {tour.tour_itinerary && tour.tour_itinerary.length > 0 && (
                        <section className="space-y-8">
                            <h2 className="text-3xl font-serif font-black text-slate-800 dark:text-white uppercase tracking-widest border-b-2 border-orange-500/20 pb-4 inline-block">
                                Daily Itinerary
                            </h2>
                            <div className="space-y-6 relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-6 pl-8 md:pl-12">
                                {tour.tour_itinerary.map((day, idx) => (
                                    <div
                                        key={idx}
                                        className="relative group cursor-pointer"
                                        onClick={() => setActiveDay(activeDay === idx ? null : idx)}
                                    >
                                        <div className={`absolute -left-[42px] md:-left-[58px] top-1 w-6 h-6 rounded-full border-4 transition-colors ${activeDay === idx ? 'bg-orange-500 border-orange-200 dark:border-orange-900' : 'bg-slate-300 dark:bg-slate-700 border-white dark:border-slate-950 group-hover:bg-orange-400'}`}></div>
                                        <div className={`bg-white dark:bg-slate-900 border ${activeDay === idx ? 'border-orange-500 shadow-xl shadow-orange-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-orange-300'} rounded-3xl p-6 transition-all duration-300`}>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-orange-500 text-[10px] font-black uppercase tracking-[2px] mb-1">Day {day.day}</p>
                                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">{day.title}</h3>
                                                </div>
                                                <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${activeDay === idx ? 'rotate-180 text-orange-500' : ''}`}>
                                                    expand_circle_down
                                                </span>
                                            </div>
                                            <div className={`grid transition-all duration-300 ${activeDay === idx ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                                                <div className="overflow-hidden">
                                                    <div
                                                        className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800"
                                                        dangerouslySetInnerHTML={{ __html: day.description }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Gallery */}
                    {tour.tour_gallery.length > 0 && (
                        <section className="space-y-8 pb-12">
                            <h2 className="text-3xl font-serif font-black text-slate-800 dark:text-white uppercase tracking-widest border-b-2 border-orange-500/20 pb-4 inline-block">
                                Sacred Sights
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {tour.tour_gallery.map((img, idx) => (
                                    <div key={idx} className={`rounded-2xl overflow-hidden aspect-square ${idx === 0 ? 'col-span-2 row-span-2' : ''}`}>
                                        <img
                                            src={img}
                                            alt={`Gallery ${idx + 1}`}
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 cursor-pointer"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* ── Right: Sidebar ─────────────────────────────────── */}
                <aside className="lg:col-span-1 hidden lg:block">
                    <div className="sticky top-32 space-y-8">

                        {/* Price Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                            <h3 className="text-xs font-black uppercase tracking-[3px] text-slate-400 mb-6">Investment in Devotion</h3>
                            <div className="space-y-4">
                                {tour.tour_price_single && (
                                    <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-slate-600 dark:text-slate-300 font-medium">Per Individual</span>
                                        <span className="text-2xl font-black text-slate-900 dark:text-white">₹{Number(tour.tour_price_single).toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                {tour.tour_price_couple && (
                                    <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-slate-600 dark:text-slate-300 font-medium">For Couples</span>
                                        <span className="text-2xl font-black text-slate-900 dark:text-white">₹{Number(tour.tour_price_couple).toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                {tour.tour_price_group && (
                                    <div className="flex justify-between items-center pb-2">
                                        <span className="text-slate-600 dark:text-slate-300 font-medium">Group Rate</span>
                                        <span className="text-2xl font-black text-slate-900 dark:text-white">₹{Number(tour.tour_price_group).toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                {!tour.tour_price_single && !tour.tour_price_couple && !tour.tour_price_group && tour.price && (
                                    <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-slate-600 dark:text-slate-300 font-medium">Base Price</span>
                                        <span className="text-2xl font-black text-slate-900 dark:text-white">₹{Number(tour.price).toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <button 
                                    onClick={() => setIsBookingModalOpen(true)}
                                    className="w-full mt-4 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-colors shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">event_available</span>
                                    Reserve Now
                                </button>
                                <p className="text-center text-xs text-slate-400">Secure payment. No hidden fees.</p>
                            </div>
                        </div>

                        {/* Yatra Specs */}
                        <div className="bg-orange-50 dark:bg-orange-950/20 rounded-[32px] p-8 border border-orange-100 dark:border-orange-900/30">
                            <h3 className="text-xs font-black uppercase tracking-[3px] text-orange-800 dark:text-orange-400 mb-6">Yatra Details</h3>
                            <ul className="space-y-5">
                                {/* Dates */}
                                <li className="flex items-center gap-4 text-orange-900 dark:text-orange-200">
                                    <span className="material-symbols-outlined text-orange-500 bg-white dark:bg-slate-900 p-2 rounded-full shadow-sm shrink-0">event</span>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-orange-500/70">Dates</p>
                                        <p className="font-medium text-sm">
                                            {tour.tour_dates_ongoing === 'true'
                                                ? 'Flexible Departures'
                                                : (tour.tour_dates_start ? formatDate(tour.tour_dates_start) : 'TBA')}
                                        </p>
                                    </div>
                                </li>

                                {/* Tour Type */}
                                {tour.tour_type.length > 0 && (
                                    <li className="flex items-start gap-4 text-orange-900 dark:text-orange-200">
                                        <span className="material-symbols-outlined text-orange-500 bg-white dark:bg-slate-900 p-2 rounded-full shadow-sm shrink-0">self_improvement</span>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-orange-500/70">Type</p>
                                            <p className="font-medium text-sm">{tour.tour_type.join(', ')}</p>
                                        </div>
                                    </li>
                                )}

                                {/* Destination */}
                                {tour.tour_destination.length > 0 && (
                                    <li className="flex items-start gap-4 text-orange-900 dark:text-orange-200">
                                        <span className="material-symbols-outlined text-orange-500 bg-white dark:bg-slate-900 p-2 rounded-full shadow-sm shrink-0">location_on</span>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-orange-500/70">Destination</p>
                                            <p className="font-medium text-sm">{tour.tour_destination.join(', ')}</p>
                                        </div>
                                    </li>
                                )}

                                {/* Images count */}
                                {tour.tour_gallery.length > 0 && (
                                    <li className="flex items-center gap-4 text-orange-900 dark:text-orange-200">
                                        <span className="material-symbols-outlined text-orange-500 bg-white dark:bg-slate-900 p-2 rounded-full shadow-sm shrink-0">photo_library</span>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-orange-500/70">Gallery</p>
                                            <p className="font-medium text-sm">{tour.tour_gallery.length} Sacred Image{tour.tour_gallery.length !== 1 ? 's' : ''}</p>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </aside>
            </main>

            {/* ── Sticky Mobile Booking Bar ───────────────────────── */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-[0_-20px_40px_rgba(0,0,0,0.05)] lg:hidden">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Starting From</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">
                            {(tour.tour_price_single || tour.price)
                                ? `₹${Number(tour.tour_price_single || tour.price).toLocaleString('en-IN')}`
                                : 'Get Quote'}
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsBookingModalOpen(true)}
                        className="px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-black uppercase tracking-widest text-xs transition-colors shadow-lg shadow-orange-600/30 flex items-center gap-2"
                    >
                        <span>Book</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                </div>
            </div>
            {/* ── Booking Modal Overlay ── */}
            {isBookingModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-200 dark:border-slate-800">
                        {/* Close btn */}
                        <button 
                            onClick={() => setIsBookingModalOpen(false)}
                            className="absolute top-6 right-6 w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        
                        <div className="p-8">
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 font-serif relative z-10 w-[80%]">
                                Secure Your Yatra
                                <span className="absolute bottom-1 left-0 w-1/3 h-3 bg-orange-400/20 -z-10 rounded-full"></span>
                            </h3>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-8 italic">
                                Fill in your details below to reserve <span className="text-orange-600 dark:text-orange-400">{tour.title}</span>.
                            </p>
                            
                            {submitSuccess ? (
                                <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 border border-orange-100 dark:border-orange-800/50">
                                    <span className="material-symbols-outlined text-4xl text-orange-500">task_alt</span>
                                    <p className="font-black text-center">Inquiry Sent Successfully!</p>
                                    <p className="text-xs text-center font-medium opacity-80">Our travel guide will contact you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleBookingSubmit} className="space-y-5">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 whitespace-nowrap">Full Name</label>
                                        <input required type="text" value={bookingForm.name} onChange={e => setBookingForm({...bookingForm, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-3.5 rounded-xl outline-none focus:bg-white focus:border-orange-500 font-bold text-slate-700 dark:text-slate-200 transition-all font-sans text-sm" placeholder="e.g. Rahul Sharma" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 whitespace-nowrap">Mobile Number</label>
                                        <input required type="tel" value={bookingForm.phone} onChange={e => setBookingForm({...bookingForm, phone: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-3.5 rounded-xl outline-none focus:bg-white focus:border-orange-500 font-bold text-slate-700 dark:text-slate-200 transition-all font-sans text-sm" placeholder="+91" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 whitespace-nowrap">Departure Date</label>
                                            <input required type="date" value={bookingForm.departureDate} onChange={e => setBookingForm({...bookingForm, departureDate: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-3.5 rounded-xl outline-none focus:bg-white focus:border-orange-500 font-bold text-slate-700 dark:text-slate-200 transition-all font-sans text-sm" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 whitespace-nowrap">Travel Type</label>
                                            <select required value={bookingForm.travelers} onChange={e => setBookingForm({...bookingForm, travelers: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-3.5 rounded-xl outline-none focus:bg-white focus:border-orange-500 font-bold text-slate-700 dark:text-slate-200 transition-all font-sans text-sm">
                                                <option value="Individual">Individual</option>
                                                <option value="Group">Group</option>
                                                <option value="Couple">Couple</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="w-full mt-2 py-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl font-black uppercase tracking-widest text-sm transition-colors shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined">send</span>
                                                Submit Inquiry
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PilgrimageTourDetailView;
