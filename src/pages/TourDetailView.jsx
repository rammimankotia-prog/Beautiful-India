import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useData } from '../context/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ConsultSpecialistModal from '../components/ConsultSpecialistModal';
import BikeTourMap from '../components/BikeTourMap';
import SEO from '../components/SEO';

/* ─────────────────────────────────────────────
   Format Content Helper (Consistent with Guides)
───────────────────────────────────────────── */
const formatContent = (content) => {
  if (!content) return '';
  if (/<(p|div|h[1-6]|ul|ol|li|blockquote|section|article|span)/i.test(content)) {
    return content;
  }
  return content
    .split(/\n\s*\n/)
    .map((para) => {
      let text = para.trim();
      if (!text) return '';
      text = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br />');
      if (text.startsWith('>')) return `<blockquote>${text.substring(1).trim()}</blockquote>`;
      return `<p>${text}</p>`;
    })
    .join('');
};

/* ─────────────────────────────────────────────
   Inclusions & Exclusions Icon Helper
───────────────────────────────────────────── */
const getInclusionIcon = (text) => {
  const t = text.toLowerCase();
  if (t.includes('hotel') || t.includes('stay') || t.includes('accommodation') || t.includes('lodge')) return 'hotel';
  if (t.includes('breakfast') || t.includes('meal') || t.includes('dinner') || t.includes('lunch') || t.includes('food')) return 'restaurant';
  if (t.includes('flight') || t.includes('airport') || t.includes('airfare')) return 'flight';
  if (t.includes('cab') || t.includes('taxi') || t.includes('transfer') || t.includes('car') || t.includes('vehicle')) return 'airport_shuttle';
  if (t.includes('sightseeing') || t.includes('tour') || t.includes('guide') || t.includes('monument')) return 'photo_camera';
  if (t.includes('train') || t.includes('rail')) return 'train';
  if (t.includes('entry') || t.includes('ticket') || t.includes('fee') || t.includes('permit') || t.includes('tax')) return 'confirmation_number';
  if (t.includes('welcome') || t.includes('drink') || t.includes('refreshment')) return 'local_bar';
  if (t.includes('insurance')) return 'security';
  if (t.includes('medical') || t.includes('health') || t.includes('first aid')) return 'medical_services';
  if (t.includes('visa')) return 'assignment_ind';
  return 'task_alt'; // high contrast default for inclusions
};

/**
 * Auto-generated from: tour_detail_view/code.html
 * Group: tours | Path: /tours/detail
 */
const TourDetailView = () => {
  const { title, id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itineraryExpanded, setItineraryExpanded] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [numDays, setNumDays] = useState(10);
  const [allTours, setAllTours] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showStickyNav, setShowStickyNav] = useState(false);
  const { formatPrice } = useCurrency();
  const { tours, reviews, loading: dataLoading, error: dataError } = useData();

  const getPriceSubLabel = () => {
    if (!tour) return { short: 'person', long: 'Person on twin sharing' };
    if (tour.pricePerPerson) return { short: 'person', long: 'Person on twin sharing' };
    if (tour.pricePerCouple) return { short: 'couple', long: 'Couple' };
    if (tour.pricePerGroup) return { short: `group of ${tour.groupSize || '?'}`, long: `Group of ${tour.groupSize || '?'}` };
    return { 
      short: tour.priceBasis === 'per_package' ? 'pkg' : 'person',
      long: tour.priceBasis === 'per_package' ? 'Package' : 'Person on twin sharing'
    };
  };

  const scrollToSection = (id) => {
    setActiveTab(id.replace('section-', ''));
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Optional: Update active tab on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'itinerary', 'inclusions', 'faq'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const id = `section-${sections[i]}`;
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveTab(sections[i]);
            break;
          }
        }
      }
      
      // Show/Hide sticky nav based on scroll depth
      setShowStickyNav(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (dataLoading || !tours) return;

    setLoading(true);
    // Find the tour whose slug OR id matches the :title or :id parameter
    const lookupSlug = title || id;
    const matchedTour = tours.find(t => 
      t.slug === lookupSlug || 
      t.id === lookupSlug || 
      (t.title && t.title.toLowerCase().replace(/\s+/g, '-') === lookupSlug?.toLowerCase())
    );

    if (matchedTour) {
      setTour(matchedTour);
      setError(null);
    } else {
      // If no match found, show error or fallback if no params provided
      if (!title && !id && tours.length > 0) {
        setTour(tours[0]);
      } else {
        setError('Tour not found');
      }
    }
    setAllTours(tours);
    setLoading(false);
  }, [title, id, tours, dataLoading]);

  const openSpecialistModal = () => {
    setIsQuoteModalOpen(true);
  };

  const sameStateTours = allTours.filter(t => {
    if (!tour || t.id === tour.id) return false;
    
    // Normalize both to arrays for overlap check
    const currentRegions = (Array.isArray(tour.stateRegion) ? tour.stateRegion : [tour.stateRegion]).filter(Boolean);
    const targetRegions = (Array.isArray(t.stateRegion) ? t.stateRegion : [t.stateRegion]).filter(Boolean);
    
    // Check if any region overlaps
    return currentRegions.some(region => targetRegions.includes(region));
  });

  const similarTours = sameStateTours.length > 0 
    ? sameStateTours.slice(0, 4) 
    : allTours
        .filter(t => t.id !== (tour?.id) && (t.destination === tour?.destination))
        .slice(0, 4);

  if (loading || dataLoading) return <LoadingSpinner />;
  
  if (error || dataError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <span className="material-symbols-outlined text-red-500 text-6xl opacity-20">error</span>
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-none mb-2">Something went wrong</h2>
          <p className="text-slate-500 font-bold italic">{error || dataError}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 h-12 bg-primary text-white rounded-xl font-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!tour || (tour.status === 'paused')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <span className="material-symbols-outlined text-slate-200 dark:text-slate-800 text-8xl">map</span>
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2 uppercase">Tour Destination Found?</h2>
          <p className="text-slate-500 font-bold italic max-w-md mx-auto">This specific trail seems to be hidden. Let's get you back on track to explore more of Beautiful India.</p>
        </div>
        <Link 
          to="/tours"
          className="px-8 h-12 bg-primary text-white rounded-xl flex items-center gap-2 font-black hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/30"
        >
          <span className="material-symbols-outlined">explore</span>
          Browse All Tours
        </Link>
      </div>
    );
  }

  // Build itinerary from tour data or fall back to defaults
  const itinerary = tour.itinerary && tour.itinerary.length > 0
    ? tour.itinerary
    : [
      { day: 1, title: 'Arrival & Orientation', description: 'Meet your personal guide at the airport and transfer to your luxury boutique hotel. Evening welcome dinner with local specialties.' },
      { day: 2, title: 'Exploratory Journey', description: 'A deep dive into the most famous landmarks of the region. Guided private tour followed by an afternoon of leisure.' },
      { day: 3, title: 'Cultural Immersion', description: 'Experience the local culture with a guided tour of the city and a traditional dinner.' },
      { day: 4, title: 'Departure', description: 'Farewell breakfast and transfer to the airport.' },
    ];

  // Always show first 2 days; show rest when expanded
  const visibleDays = itineraryExpanded ? itinerary : itinerary.slice(0, 2);
  const hiddenCount = itinerary.length - 2;

  // Generate months based on Operation Period
  const getAvailableMonths = () => {
    if (!tour.availableFrom) {
      // Fallback: Show next 6 months from today
      const months = [];
      const today = new Date();
      for (let i = 0; i < 6; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
        months.push(d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }));
      }
      return months;
    }

    const start = new Date(tour.availableFrom);
    const end = tour.availableTo ? new Date(tour.availableTo) : new Date(start.getFullYear(), start.getMonth() + 12, 1);
    const months = [];
    let current = new Date(start.getFullYear(), start.getMonth(), 1);

    // Limit to safety margin of 24 months to prevent infinite loops if data is weird
    let safety = 0;
    while (current <= end && safety < 24) {
      months.push(current.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }));
      current.setMonth(current.getMonth() + 1);
      safety++;
    }
    return months;
  };
  const availableMonths = getAvailableMonths();

  return (
    <div data-page="tour_detail_view" className="bg-white dark:bg-slate-950">
      {tour && (
        <SEO 
          title={`${tour.title} - ${tour.duration} Tour Package`}
          description={tour.description ? tour.description.substring(0, 160).replace(/<[^>]*>/g, '') + '...' : `Explore ${tour.title} with our custom tour package.`}
          keywords={`${tour.title}, ${tour.destination}, ${tour.stateRegion}, India Tour, Travel Package`}
          image={tour.image || (tour.images && tour.images[0])}
          type="article"
          schema={tour.schemaSnippet}
        />
      )}
      {/* ── Fixed Scroll-Only Sub-Navigation ── */}
      <div className={`fixed top-0 left-0 right-0 z-[100] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-lg hidden md:flex items-center justify-between px-6 lg:px-20 py-3 transition-all duration-500 ease-in-out ${
        showStickyNav ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {['overview', 'itinerary', 'inclusions', 'faq'].map((tab) => {
            if (tab === 'inclusions' && (!tour.inclusions || tour.inclusions.length === 0)) return null;
            if (tab === 'faq' && (!tour.faq || tour.faq.length === 0)) return null;
            
            const labels = {
              overview: 'Overview',
              itinerary: 'Itinerary',
              inclusions: 'Inclusions / Exclusions',
              faq: 'FAQ'
            };
            return (
              <button
                key={tab}
                onClick={() => scrollToSection(`section-${tab}`)}
                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-6 bg-primary/5 pl-6 pr-2 py-2 rounded-full border border-primary/20 shrink-0">
           <div className="flex flex-col items-end">
             <span className="text-[10px] uppercase font-black text-primary/60 leading-none mb-1 tracking-widest">Adventure starts at</span>
             <div className="flex items-baseline gap-1">
               <span className="text-slate-400 font-medium text-lg">₹</span>
               <span className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">
                 {tour.price?.toLocaleString('en-IN') || '---'}
               </span>
               <span className="text-[10px] uppercase font-bold text-slate-500">/{getPriceSubLabel().short}</span>
             </div>
           </div>
           <button onClick={() => setIsQuoteModalOpen(true)} className="bg-primary text-white text-xs font-black px-6 py-3 rounded-full hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 uppercase tracking-wider">
             Get Personalized Quote
           </button>
        </div>
      </div>

      <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        {/* Top Navigation */}

        <main className="flex h-full grow flex-col pb-20">
          <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
            <div className="flex flex-col flex-1 w-full gap-6">

              {/* ── Premium Header ── */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-8">
                {/* Left: Title + Badges */}
                <div className="flex flex-col gap-3 flex-1">
                  {/* Breadcrumb */}
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">explore</span>
                    {tour.destination || 'India'} · {tour.stateRegion || ''}
                  </p>
                  <h1 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white">{tour.title}</h1>
                  {/* Info Pills */}
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {tour.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full text-xs font-bold">
                      <span className="material-symbols-outlined text-[14px]">route</span>
                      Curated Route
                    </span>
                    {tour.availableFrom && (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-200/60">
                        <span className="material-symbols-outlined text-[14px]">event_available</span>
                        Valid till {tour.availableTo ? new Date(tour.availableTo).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Ongoing'}
                      </span>
                    )}
                    {tour.bookingEnd && (
                      <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 border border-orange-200/60 px-3 py-1.5 rounded-full text-xs font-black animate-pulse">
                        <span className="material-symbols-outlined text-[14px]">alarm</span>
                        Book by {new Date(tour.bookingEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Price + CTA */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                   <div className="text-right">
                     <span className="text-[10px] uppercase font-black text-primary leading-none mb-1 tracking-widest block">Adventure starts at</span>
                     <div className="flex items-baseline gap-1 justify-end">
                       <span className="text-slate-400 font-medium text-xl">₹</span>
                       <span className="text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">
                         {tour.price?.toLocaleString('en-IN') || '---'}
                       </span>
                       <span className="text-[10px] uppercase font-bold text-slate-500 ml-1">/{getPriceSubLabel().short}</span>
                     </div>
                   </div>
                  {(tour.nature === 'group' || tour.nature === 'private') && tour.minPersons > 1 && (
                    <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wide">
                      Min {tour.minPersons} Persons
                    </span>
                  )}
                  <button
                    onClick={openSpecialistModal}
                    className="flex items-center gap-2 cursor-pointer px-8 h-12 bg-primary text-secondary-900 text-sm font-black rounded-xl hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/30 uppercase tracking-wide"
                  >
                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                    Book Now
                  </button>
                </div>
              </div>
              {/* ── Image Gallery ── */}
              {(() => {
                const rawImages = tour.images && tour.images.length > 0 ? tour.images : (tour.image ? [tour.image] : []);
                const normalized = rawImages.map(img =>
                  typeof img === 'string' ? { url: img, caption: '' } : (img?.url ? img : { url: String(img), caption: '' })
                );
                const placeholders = [
                  "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1506929113674-bc7f0f7cf49b?auto=format&fit=crop&w=600&q=80"
                ];
                while (normalized.length < 5) normalized.push({ url: placeholders[normalized.length % 4], caption: '' });

                const Thumb = ({ img, className = '', large = false }) => (
                  <div className={`relative overflow-hidden rounded-2xl group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 ${className}`}>
                    <div
                      className="absolute inset-0 bg-center bg-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      style={{ backgroundImage: `url('${img.url}')` }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent transition-opacity duration-300 ${large ? 'opacity-80' : 'opacity-0 group-hover:opacity-100'}`} />
                    {img.caption && (
                      <div className={`absolute bottom-0 left-0 right-0 px-4 py-3 transition-all duration-300 ${large ? '' : 'translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100'}`}>
                        <p className="text-white text-sm font-semibold leading-snug drop-shadow">{img.caption}</p>
                      </div>
                    )}
                  </div>
                );

                const userPhotos = normalized.filter(img => img.url && !img.url.includes('unsplash'));
                const extraCount = Math.max(normalized.length - 5, 0);

                return (
                  <>

                    {/* Hero Grid — adaptive based on real photo count */}
                    {(() => {
                      const count = userPhotos.length;
                      if (count === 0) {
                        // No real photos — show 1 placeholder hero
                        return (
                          <div style={{ height: '400px' }}>
                            <Thumb img={{ url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80', caption: tour.title }} className="h-full w-full" large />
                          </div>
                        );
                      }
                      if (count === 1) {
                        return (
                          <div style={{ height: '400px' }}>
                            <Thumb img={userPhotos[0]} className="h-full w-full" large />
                          </div>
                        );
                      }
                      if (count === 2) {
                        return (
                          <div className="grid grid-cols-2 gap-3" style={{ height: '400px' }}>
                            <Thumb img={userPhotos[0]} className="h-full" large />
                            <Thumb img={userPhotos[1]} className="h-full" />
                          </div>
                        );
                      }
                      if (count === 3) {
                        return (
                          <div className="grid grid-cols-3 gap-3" style={{ height: '400px' }}>
                            <Thumb img={userPhotos[0]} className="col-span-2 h-full" large />
                            <div className="flex flex-col gap-3 h-full">
                              <Thumb img={userPhotos[1]} className="flex-1" />
                              <Thumb img={userPhotos[2]} className="flex-1" />
                            </div>
                          </div>
                        );
                      }
                      // 4+ photos — 2-col right with "View All" on last cell
                      const extraCount = Math.max(count - 5, 0);
                      return (
                        <div className="grid grid-cols-4 grid-rows-2 gap-3" style={{ height: '480px' }}>
                          <Thumb img={userPhotos[0]} className="col-span-2 row-span-2" large />
                          <Thumb img={userPhotos[1]} className="h-full" />
                          <Thumb img={userPhotos[2]} className="h-full" />
                          {count >= 4 ? <Thumb img={userPhotos[3]} className="h-full" /> : <div className="h-full rounded-2xl bg-slate-100 dark:bg-slate-800" />}
                          <div className="relative overflow-hidden rounded-2xl cursor-pointer group shadow-md hover:shadow-2xl transition-all duration-300 h-full">
                            <div className="absolute inset-0 bg-center bg-cover transition-transform duration-700 group-hover:scale-110"
                              style={{ backgroundImage: `url('${(userPhotos[4] || userPhotos[count - 1]).url}')` }} />
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-300 flex flex-col items-center justify-center gap-1">
                              <span className="material-symbols-outlined text-white text-3xl">photo_library</span>
                              <span className="text-white font-bold text-sm">
                                {extraCount > 0 ? `+${extraCount} More` : 'View All'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Premium Photo Strip */}
                    {userPhotos.length > 0 && (
                      <div className="mt-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[16px]">photo_library</span>
                            Photo Gallery · {userPhotos.length} photos
                          </h4>
                          <span className="text-[10px] text-slate-400 italic">Scroll to explore →</span>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                          {userPhotos.map((img, i) => (
                            <div key={i} className="flex-shrink-0 group cursor-pointer" style={{ scrollSnapAlign: 'start', width: '152px' }}>
                              <div className="relative w-full h-24 rounded-xl overflow-hidden shadow-sm group-hover:shadow-lg transition-shadow duration-300">
                                <div
                                  className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                                  style={{ backgroundImage: `url('${img.url}')` }}
                                />
                                <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-black/60 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                  {i + 1}
                                </div>
                              </div>
                              <p className={`text-[11px] mt-1.5 leading-tight line-clamp-2 text-center px-0.5 font-medium ${img.caption ? 'text-slate-600 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600 italic'}`}>
                                {img.caption || `Photo ${i + 1}`}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Content Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-4">
                {/* Main Content (Left Column) */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                  {/* Tags */}
                  <div className="flex gap-3 flex-wrap">
                    <div className="flex h-8 items-center justify-center gap-x-2 rounded-full bg-primary/10 px-4">
                      <span className="material-symbols-outlined text-primary text-sm">explore</span>
                      <p className="text-primary text-sm font-semibold leading-normal">{tour.nature || 'Adventure'}</p>
                    </div>
                    <div className="flex h-8 items-center justify-center gap-x-2 rounded-full bg-primary/10 px-4">
                      <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                      <p className="text-primary text-sm font-semibold leading-normal">{tour.theme || 'Premium Experience'}</p>
                    </div>
                    {tour.bookingEnd && (
                      <div className="flex h-8 items-center justify-center gap-x-2 rounded-full bg-orange-100 dark:bg-orange-900/20 px-4 border border-orange-200 dark:border-orange-900/30">
                        <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-sm">alarm</span>
                        <span className="text-orange-700 dark:text-orange-300 text-[11px] font-black uppercase tracking-widest">Book by {new Date(tour.bookingEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    )}
                  </div>
                  {/* Description */}
                  <div id="section-overview" className="prose prose-lg dark:prose-invert  text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                    <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4 scroll-mt-24">Overview</h3>
                    <div 
                      className="mb-4"
                      dangerouslySetInnerHTML={{ __html: formatContent(tour.description) }} 
                    />
                    <p>
                      Embark on an unforgettable journey specifically designed for the discerning traveler. Our {tour.duration} {tour.title} package combines thrilling activities with hand-picked premium accommodations. From the moment you arrive, every detail is taken care of by our professional guides.
                    </p>
                  </div>

                  {/* Highlights */}
                  {tour.highlights && (
                    <div className="flex flex-col gap-6 mt-4 p-8 border border-slate-200 dark:border-slate-800 rounded-[2px] bg-white dark:bg-slate-900 shadow-sm border-t-0 border-l-0 border-r-0 border-b-2">
                      <h3 className="text-[26px] font-bold text-slate-800 dark:text-slate-200">Highlights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {(Array.isArray(tour.highlights) ? tour.highlights : tour.highlights.split('\n')).filter(Boolean).map((highlight, idx) => (
                          <div key={idx} className="flex gap-4 text-[#334155] dark:text-slate-300 items-start">
                            <span className="material-symbols-outlined text-[#0a6c75] text-[20px] shrink-0 font-bold" style={{fontVariationSettings: "'FILL' 0, 'wght' 700"}}>check</span>
                            <span className="leading-relaxed text-[16px]">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Itinerary */}
                  <div id="section-itinerary" className="flex flex-col gap-6 mt-4 scroll-mt-24">
                    <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Proposed Itinerary</h3>
                    <div className="relative space-y-0">
                      {visibleDays.map((item, idx) => {
                        const isLast = idx === visibleDays.length - 1;
                        return (
                          <div key={item.day} className="relative flex gap-5 pb-8">
                            {/* Vertical connector — hidden for last item */}
                            {!isLast && (
                              <div className="absolute left-[9px] top-5 bottom-0 w-0.5 bg-primary/25" />
                            )}
                            {/* Circle dot */}
                            <div className="relative z-10 flex-shrink-0 mt-1.5">
                              <div className="w-5 h-5 bg-white dark:bg-slate-800 border-[3px] border-primary rounded-full ring-4 ring-primary/10 shadow-sm" />
                            </div>
                            {/* Text content */}
                            <div className="flex-1 pt-0">
                              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-3">
                                <div className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-primary/10 text-primary dark:bg-primary/20 font-black text-[13px] border border-primary/20 uppercase tracking-widest w-fit shadow-sm">
                                  Day {item.day}
                                </div>
                                <h4 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
                                  {item.title}
                                </h4>
                              </div>
                              <div className={`text-text-secondary-light dark:text-text-secondary-dark leading-relaxed prose prose-sm dark:prose-invert ${item.tags || (item.services && item.services.length) ? 'mb-3' : ''}`} dangerouslySetInnerHTML={{ __html: formatContent(item.description) }} />
                              
                              {/* Highlight Tags */}
                              {item.tags && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {(Array.isArray(item.tags) ? item.tags.join(',') : item.tags).split(/[#,]+/).map((tag, tIdx) => {
                                    const cleanTag = tag.trim();
                                    if (!cleanTag) return null;
                                    return (
                                      <span key={tIdx} className="inline-flex items-center gap-1 bg-primary/5 text-primary border border-primary/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                        <span className="material-symbols-outlined text-[12px]">label</span>
                                        {cleanTag}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Services Included */}
                              {item.services && Array.isArray(item.services) && item.services.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {item.services.map((svcId, sIdx) => {
                                    const serviceMap = {
                                      breakfast: { icon: 'free_breakfast', label: 'Breakfast', color: 'text-amber-600 dark:text-amber-500' },
                                      lunch: { icon: 'lunch_dining', label: 'Lunch', color: 'text-green-600 dark:text-green-500' },
                                      dinner: { icon: 'dinner_dining', label: 'Dinner', color: 'text-orange-600 dark:text-orange-500' },
                                      stay: { icon: 'hotel', label: 'Stay', color: 'text-blue-600 dark:text-blue-500' },
                                      transfer: { icon: 'airport_shuttle', label: 'Transfer', color: 'text-purple-600 dark:text-purple-500' },
                                      sightseeing: { icon: 'photo_camera', label: 'Sightseeing', color: 'text-teal-600 dark:text-teal-500' },
                                      flight: { icon: 'flight', label: 'Flight', color: 'text-sky-600 dark:text-sky-500' },
                                      train: { icon: 'train', label: 'Train', color: 'text-indigo-600 dark:text-indigo-500' }
                                    };
                                    const svc = serviceMap[svcId.toLowerCase()];
                                    if (!svc) return null;
                                    return (
                                      <div key={sIdx} className={`flex items-center gap-1 text-[11px] font-semibold ${svc.color} bg-slate-50 dark:bg-slate-900/50 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm`}>
                                        <span className="material-symbols-outlined text-[14px]">{svc.icon}</span>
                                        {svc.label}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {itinerary.length > 2 && (
                        <button
                          onClick={() => setItineraryExpanded(!itineraryExpanded)}
                          className="text-primary font-medium hover:underline flex items-center gap-1 mt-4 transition-all"
                        >
                          {itineraryExpanded
                            ? <>Show Less <span className="material-symbols-outlined text-sm">expand_less</span></>
                            : <>View Full Itinerary ({hiddenCount} more days) <span className="material-symbols-outlined text-sm">expand_more</span></>
                          }
                        </button>
                      )}
                    </div>
                  </div>

                  
                  {/* Route Map Section */}
                  {(tour.mapData || tour.coordinates) && (
                    <div id="section-map" className="flex flex-col gap-6 mt-12 scroll-mt-24">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Route Map</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary rounded">Interactive</span>
                      </div>
                      <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm h-[400px] md:h-[500px]">
                        <BikeTourMap slug={tour.slug} title={tour.title} tour={tour} />
                      </div>
                    </div>
                  )}

                  {/* Inclusions & Exclusions */}
                  {(tour.inclusions || tour.exclusions) && (
                    <div id="section-inclusions" className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 scroll-mt-24">
                      {/* Inclusions */}
                      {tour.inclusions && (
                        <div className="flex flex-col gap-6 bg-emerald-50/40 dark:bg-emerald-950/20 p-8 rounded-[2rem] border border-emerald-100/50 dark:border-emerald-800/30 h-full shadow-sm hover:shadow-md transition-all duration-300">
                          <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-800/30 pb-4">
                            <h4 className="text-2xl font-black flex items-center gap-3 text-emerald-900 dark:text-emerald-100">
                              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                                <span className="material-symbols-outlined text-2xl">check_circle</span>
                              </span>
                              What's Included
                            </h4>
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded">Guaranteed</span>
                          </div>
                          <ul className="grid grid-cols-1 gap-5">
                            {(Array.isArray(tour.inclusions) ? tour.inclusions : tour.inclusions.split('\n')).filter(Boolean).map((item, idx) => {
                              const iconName = getInclusionIcon(item);
                              return (
                                <li key={idx} className="flex items-start gap-4 group">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100/50 dark:border-emerald-800/50 shadow-sm text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-[20px]">{iconName}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[15px] font-bold text-slate-800 dark:text-slate-100 leading-tight">{item}</span>
                                    <span className="text-[11px] font-medium text-emerald-600/70 dark:text-emerald-400/50 uppercase tracking-tighter mt-1">Included in Package</span>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {/* Exclusions */}
                      {tour.exclusions && (
                        <div className="flex flex-col gap-6 bg-slate-50 dark:bg-slate-950/20 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800/50 h-full shadow-sm hover:shadow-md transition-all duration-300">
                          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/30 pb-4">
                            <h4 className="text-2xl font-black flex items-center gap-3 text-slate-900 dark:text-slate-100">
                              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                <span className="material-symbols-outlined text-2xl">cancel</span>
                              </span>
                              Not Included
                            </h4>
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded">Excluded</span>
                          </div>
                          <ul className="grid grid-cols-1 gap-5">
                            {(Array.isArray(tour.exclusions) ? tour.exclusions : tour.exclusions.split('\n')).filter(Boolean).map((item, idx) => {
                              const iconName = getInclusionIcon(item);
                              return (
                                <li key={idx} className="flex items-start gap-4 group opacity-80 hover:opacity-100 transition-opacity">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-400 dark:text-slate-500 shrink-0 group-hover:bg-rose-50 dark:group-hover:bg-rose-900/20 group-hover:text-rose-500 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">{iconName}</span>
                                  </div>
                                  <div className="flex flex-col border-l-2 border-slate-100 dark:border-slate-800 pl-4">
                                    <span className="text-[15px] font-bold text-slate-500 dark:text-slate-400 leading-tight line-through decoration-slate-300 dark:decoration-slate-700">{item}</span>
                                    <span className="text-[11px] font-medium text-rose-500/70 dark:text-rose-400/50 uppercase tracking-tighter mt-1">Extra Charges Apply</span>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                          
                          <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800/30">
                            <p className="text-[11px] italic text-slate-400 text-center font-medium">Please check with our experts for any specific requirements or customizations not listed above.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
                {/* Sidebar (Right Column) */}
                <div className="lg:col-span-1">
                  <div className="flex flex-col gap-0 sticky top-24">
                    {/* Upper Features Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl rounded-b-none p-5 shadow-sm border-b-0">
                      <div className="space-y-5">
                        {/* Hotel Selection */}
                        <div>
                          <p className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2">Hotel included in package:</p>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer group">
                              <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center p-0.5">
                                <div className="w-full h-full bg-primary rounded-full"></div>
                              </div>
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">3 Star</span>
                            </label>
                          </div>
                        </div>

                        {/* Cities Path */}
                        <div>
                          <p className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1">Cities:</p>
                          <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-snug">
                            {tour.cityPath || `${tour.stateRegion} (2D) → ${tour.destination} (2D) → ${tour.subregion || 'Local'} (2D)`}
                          </p>
                        </div>

                        {/* Service Icons */}
                        <div className="grid grid-cols-5 gap-1 pt-2">
                          {[
                            { icon: 'apartment', label: '3 Stars' },
                            { icon: 'explore', label: 'Sightseeing' },
                            { icon: 'restaurant', label: 'Breakfast' },
                            { icon: 'bed', label: 'Stay' },
                            { icon: 'local_taxi', label: 'Transfers' }
                          ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1">
                              <span className="material-symbols-outlined text-slate-700 dark:text-slate-300 text-xl font-light">{item.icon}</span>
                              <span className="text-[9px] text-slate-500 font-bold text-center uppercase leading-tight">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Middle Pricing Card */}
                    <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 p-5 flex flex-col gap-4 border-b-2">
                       <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Starting from:</p>
                            <div className="flex items-baseline gap-2">
                               <span className="text-2xl font-black text-emerald-600 dark:text-emerald-500">{formatPrice(tour.price, true)}/-</span>
                               <span className="text-sm text-slate-400 line-through font-medium">{formatPrice(Math.round(tour.price * 1.15), true)}/-</span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-bold mt-1">Per {getPriceSubLabel().long}.</p>
                            <p className="text-[10px] text-orange-600 dark:text-orange-400 font-black mt-1 uppercase italic">Hotel cost may vary - submit details for rates!</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Price For Month</p>
                             <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer">
                                {availableMonths.map(month => (
                                  <option key={month} value={month}>{month}</option>
                                ))}
                             </select>
                          </div>
                       </div>
                    </div>

                    {/* Bottom Action Card */}
                    <div className="flex flex-col gap-3">
                      <button onClick={() => setIsQuoteModalOpen(true)} className="w-full flex cursor-pointer items-center justify-center rounded-none rounded-b-xl h-14 bg-[#ff5a5f] text-white text-lg font-black hover:brightness-110 transition-all shadow-xl uppercase tracking-wider">
                        Customize & Get Quotes
                      </button>
                      <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 mt-4">
                         <h4 className="text-[13px] font-extrabold text-[#0a6c75] mb-4 uppercase tracking-tighter">Essential Information</h4>
                         <div className="space-y-4">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border border-primary/20 shadow-sm shrink-0">
                                  <span className="material-symbols-outlined text-primary">sunny</span>
                               </div>
                               <div>
                                  <p className="text-[11px] text-slate-500 font-bold uppercase">Best Time To Visit</p>
                                  <p className="text-sm font-black text-slate-800 dark:text-slate-100 italic">{tour.bestTimeToVisit || 'Year-round'}</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border border-primary/20 shadow-sm shrink-0">
                                  <span className="material-symbols-outlined text-primary">group</span>
                               </div>
                               <div>
                                  <p className="text-[11px] text-slate-500 font-bold uppercase">Group Size</p>
                                  <p className="text-sm font-black text-slate-800 dark:text-slate-100">{tour.minPersons > 1 ? `Min ${tour.minPersons}` : 'Private'} Persons</p>
                               </div>
                            </div>
                         </div>
                         <p className="text-[10px] text-center text-slate-400 font-bold mt-4 border-t border-primary/10 pt-3 italic">Free cancellation up to 30 days before departure.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── FAQ Section ── */}
              {/* ── FAQ Section ── */}
              {tour.faq && tour.faq.length > 0 && tour.faq.some(f => f.question && f.answer) && (
                <div id="section-faq" className="mt-20 mb-12 scroll-mt-24">
                  {/* Header */}
                  <div className="flex flex-col items-center text-center mb-12">
                    <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-4">
                      <span className="material-symbols-outlined text-[16px]">help</span>
                      Tour Queries
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Got Questions? We Have Answers.</h2>
                    <p className="text-slate-500 mt-3 text-lg max-w-2xl mx-auto italic font-medium">Everything you need to know before embarking on your Beautiful India journey.</p>
                  </div>

                  {/* Accordion */}
                  <div className="max-w-3xl mx-auto flex flex-col gap-4">
                    {tour.faq.filter(f => f.question && f.answer).map((item, idx) => (
                      <div
                        key={idx}
                        className={`rounded-[1.5rem] border transition-all duration-500 overflow-hidden ${
                          openFaq === idx
                            ? 'border-primary/40 bg-white dark:bg-slate-900 shadow-2xl shadow-primary/5'
                            : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/20 hover:shadow-lg'
                        }`}
                      >
                        <button
                          onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                          className="flex justify-between items-center w-full px-8 py-6 text-left focus:outline-none group"
                        >
                          <div className="flex items-center gap-5">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 font-black text-xs ${
                              openFaq === idx ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'
                            }`}>
                              Q
                            </div>
                            <span className={`dark:text-slate-100 font-extrabold text-lg transition-colors duration-300 ${openFaq === idx ? 'text-primary' : 'text-slate-800'}`}>{item.question}</span>
                          </div>
                          <div className={`w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all duration-500 ${
                            openFaq === idx ? 'bg-primary border-primary text-white rotate-180' : 'text-slate-400'
                          }`}>
                            <span className="material-symbols-outlined text-[20px]">expand_more</span>
                          </div>
                        </button>
                        <div className={`transition-all duration-500 ease-in-out px-8 ${
                          openFaq === idx ? 'pb-8 opacity-100 max-h-[500px]' : 'max-h-0 opacity-0 pointer-events-none'
                        }`}>
                          <div className="flex gap-5 border-t border-slate-50 dark:border-slate-800 pt-6">
                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-black text-xs">
                              A
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed font-medium">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Similar Tours ── */}
              {similarTours.length > 0 && (
                <div className="mt-16 mb-16">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">You Might Also Like</p>
                      <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">Similar Tour Packages</h3>
                    </div>
                    <Link to="/tours" className="hidden md:flex items-center gap-1.5 text-primary font-black text-xs uppercase tracking-wider hover:gap-3 transition-all">
                      View All <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {similarTours.map((t, idx) => {
                      const tSlug = encodeURIComponent((t.title || 'tour').toLowerCase().replace(/\s+/g, '-'));
                      const firstRegion = Array.isArray(t.stateRegion) ? t.stateRegion[0] : t.stateRegion;
                      const tPath = `/tours/${encodeURIComponent((t.destination || 'global').toLowerCase())}/${encodeURIComponent((firstRegion || 'region').toLowerCase())}/${encodeURIComponent((t.subRegion || 'sub-region').toLowerCase())}/${tSlug}`;
                      const imgSrc = (() => {
                        if (!t.image) return 'https://images.unsplash.com/photo-1596760407110-2f759c2b7188?auto=format&fit=crop&w=400&q=80';
                        if (typeof t.image === 'string') return t.image;
                        if (t.image?.url) return t.image.url;
                        return 'https://images.unsplash.com/photo-1596760407110-2f759c2b7188?auto=format&fit=crop&w=400&q=80';
                      })();
                      return (
                        <Link key={idx} to={tPath} className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col h-full active:scale-[0.98]">
                          <div className="relative h-52 overflow-hidden">
                            <img src={imgSrc} alt={t.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black text-primary shadow">
                              {t.duration || 'Flexible'}
                            </div>
                          </div>
                          <div className="p-4 flex flex-col flex-1">
                            <h4 className="font-black text-slate-800 dark:text-slate-100 text-sm leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">{t.title}</h4>
                            <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                              <div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Starts from</p>
                                <p className="text-base font-black text-primary">{formatPrice(t.price)}</p>
                              </div>
                              <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Traveler Reviews ── */}
              <div className="mt-20 mb-12">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-12 pb-8 border-b border-slate-100 dark:border-slate-800">
                  <div className="max-w-xl">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">
                      Authentic Stories
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-none">Traveler Reviews</h2>
                    <p className="text-slate-500 mt-4 text-lg font-medium italic leading-relaxed">Discover why over 40,000 travelers trust us with their dream holidays to Beautiful India.</p>
                  </div>
                  {/* Rating Badge */}
                  <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl px-8 py-5 shadow-2xl shadow-primary/5">
                    <div className="text-center group">
                      <p className="text-5xl font-black text-slate-900 dark:text-white leading-none mb-1 group-hover:scale-110 transition-transform">4.9</p>
                      <div className="flex text-amber-400 mt-1 justify-center gap-0.5">{'★★★★★'.split('').map((s, i) => <span key={i} className="text-xl drop-shadow-sm">{s}</span>)}</div>
                    </div>
                    <div className="w-px h-16 bg-slate-200 dark:bg-slate-700" />
                    <div className="flex flex-col gap-1">
                      <p className="text-lg font-black text-primary uppercase tracking-wider">Exceptional</p>
                      <p className="text-xs text-slate-400 font-bold">Based on {reviews.filter(r => r.tourId === tour.id).length || 24} Verified Reviews</p>
                    </div>
                  </div>
                </div>

                {/* Review Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {reviews.filter(r => r.tourId === tour.id).length > 0 ? (
                    reviews.filter(r => r.tourId === tour.id).map((review) => (
                      <div key={review.id} className="group bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative flex flex-col gap-6">
                        {/* Quote mark icon */}
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center -mt-12 mb-2 shadow-lg shadow-white dark:shadow-slate-900 ring-8 ring-white dark:ring-slate-950">
                           <span className="material-symbols-outlined text-primary text-2xl">format_quote</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed text-base font-medium flex-1">
                          "{review.comment}"
                        </p>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                          <div className="flex items-center gap-4">
                            <img src={review.userImage || 'https://i.pravatar.cc/150?u=raman'} alt={review.userName} className="w-12 h-12 rounded-2xl object-cover shadow-md border border-white dark:border-slate-800 ring-2 ring-primary/5" />
                            <div>
                              <p className="font-black text-slate-900 dark:text-white text-[15px]">{review.userName}</p>
                              <div className="flex text-amber-400 text-[10px] mt-0.5">
                                {Array.from({ length: review.rating || 5 }).map((_, i) => <span key={i} className="drop-shadow-sm">★</span>)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-black uppercase tracking-widest px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/20 rounded-md">
                            <span className="material-symbols-outlined text-[14px]">verified</span>
                            Verified
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    [1, 2, 3].map(i => (
                      <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 animate-pulse">
                         <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full mb-6" />
                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4 mb-3" />
                        <div className="h-4 bg-slate-50 dark:bg-slate-800/50 rounded w-full mb-2" />
                        <div className="h-4 bg-slate-50 dark:bg-slate-800/50 rounded w-5/6 mb-8" />
                        <div className="flex items-center gap-4 pt-6 border-t border-slate-50 dark:border-slate-800">
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                          <div className="space-y-2">
                            <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
                            <div className="h-2 w-16 bg-slate-50 dark:bg-slate-800/50 rounded" />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* CTA */}
                <div className="mt-16 text-center">
                  <Link
                    to={`/account/review?tourId=${tour.id}&tourName=${encodeURIComponent(tour.title)}`}
                    className="inline-flex items-center gap-3 px-10 py-5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] font-black text-slate-800 dark:text-white hover:border-primary hover:text-primary dark:hover:text-primary transition-all shadow-xl hover:shadow-primary/10 text-sm uppercase tracking-[0.15em]"
                  >
                    <span className="material-symbols-outlined">rate_review</span>
                    Share Your Experience
                  </Link>
                </div>
              </div>

              {/* ── Confidence Bar (Trust Signals) ── */}
              <div className="mt-8 mb-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-[#006D77]/5 dark:bg-slate-900 border border-[#006D77]/10 dark:border-slate-800 rounded-[2.5rem]">
                  {[
                    { icon: 'verified_user', title: 'Verified Experts', desc: '100% Genuine Local Agents' },
                    { icon: 'shield_lock', title: 'Safe & Secure', desc: 'ISO Certified Payments' },
                    { icon: 'stars', title: 'Best Price Today', desc: 'Cheaper than Direct Booking' },
                    { icon: 'support_agent', title: '24/7 Support', desc: 'Round-the-clock Assistant' },
                  ].map((signal, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center group cursor-default">
                       <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#006D77] dark:text-primary mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                         <span className="material-symbols-outlined text-3xl font-light">{signal.icon}</span>
                       </div>
                       <h5 className="font-black text-slate-800 dark:text-white text-sm mb-1">{signal.title}</h5>
                       <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold italic tracking-tight">{signal.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

            {/* ── Standardized Booking Modal ── */}
      <ConsultSpecialistModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
        tour={tour} 
      />


    </div>
  );
};

export default TourDetailView;
