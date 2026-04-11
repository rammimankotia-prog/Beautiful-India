import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useData } from '../context/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ConsultSpecialistModal from '../components/ConsultSpecialistModal';
import BikeTourMap from '../components/BikeTourMap';
import SEO from '../components/SEO';
import GoogleAuthModal from './GoogleAuthModal';

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
  
  // Widget states
  const [bookingGuests, setBookingGuests] = useState(1);
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Booking modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '' });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingError, setBookingError] = useState('');

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

  const getDynamicPriceData = () => {
    if (!tour) return { basePrice: 0, totalPrice: 0, advance: 0, barRate: 0, discountRate: 0, groupDiscountAmount: 0 };
    
    // Parse valid numbers
    const pPerson = parseFloat(tour.pricePerPerson) || tour.price;
    const pCouple = parseFloat(tour.pricePerCouple) || (pPerson * 2);
    const pGroup = parseFloat(tour.pricePerGroup);
    const gSize = parseInt(tour.groupSize) || 4;
    const bar = parseFloat(tour.barRate) || (pPerson * 1.55);

    let currentBase = pPerson;
    const baseWithoutDiscount = (bookingGuests === 2) ? (pCouple / 2) : pPerson;
    const totalWithoutGroupDiscount = baseWithoutDiscount * bookingGuests;
    
    if (bookingGuests === 1) {
      currentBase = pPerson;
    } else if (bookingGuests === 2) {
      currentBase = pCouple / 2;
    } else if (bookingGuests === 3) {
      currentBase = pPerson; 
    } else if (bookingGuests >= (parseInt(tour.groupDiscountMinGuests) || 4)) {
       // Group discount triggers
       if (tour.groupDiscountPercentage) {
          const discountVal = pPerson * (parseFloat(tour.groupDiscountPercentage) / 100);
          currentBase = pPerson - discountVal;
       } else if (pGroup && bookingGuests >= gSize) {
          currentBase = pGroup / gSize;
       } else {
          currentBase = pPerson; // Fallback
       }
    }

    const total = currentBase * bookingGuests;
    const groupDiscountAmount = totalWithoutGroupDiscount - total;
    const advance = Math.round(total * 0.30);
    const aggregatedBar = bar * bookingGuests;
    const discountRate = Math.round(100 - (total / aggregatedBar) * 100);

    return { 
       basePrice: currentBase, 
       totalPrice: total, 
       advance, 
       barRate: bar, 
       discountRate: discountRate > 0 ? discountRate : 0,
       groupDiscountAmount: groupDiscountAmount > 0 ? groupDiscountAmount : 0,
       totalBeforeGroupDiscount: totalWithoutGroupDiscount
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

  let similarTours = sameStateTours.length >= 4 
    ? sameStateTours.slice(0, 4) 
    : (() => {
        const destMatched = allTours.filter(t => t.id !== (tour?.id) && (t.destination === tour?.destination));
        const combined = [...sameStateTours, ...destMatched.filter(d => !sameStateTours.some(s => s.id === d.id))];
        if (combined.length < 4) {
          const others = allTours.filter(t => t.id !== (tour?.id) && t.status !== 'paused' && !combined.some(c => c.id === t.id));
          return [...combined, ...others].slice(0, 4);
        }
        return combined.slice(0, 4);
      })();

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
                      Embark on an unforgettable journey specifically designed for the discerning traveler. Our {tour.duration} {tour.title} package combines thrilling activities with hand-picked premium accommodations. From the moment you arrive, every detail is care of by our professional guides.
                    </p>
                  </div>

                  {/* Highlights */}
                  {tour.highlights && (
                    <div className="flex flex-col gap-6 mt-4 p-8 border border-slate-200 dark:border-slate-800 rounded-[2rem] bg-white dark:bg-slate-900 shadow-sm border-t-0 border-l-0 border-r-0 border-b-2">
                      <h3 className="text-[26px] font-bold text-slate-800 dark:text-slate-200">Tour Highlights</h3>
                      <div className="flex flex-col gap-y-6">
                        {(() => {
                           // Normalize and robustly split into individual points
                           const raw = Array.isArray(tour.highlights) ? tour.highlights.join('\n') : (tour.highlights || '');
                           return raw.split(/(?:\n|<br\s*\/?>|<\/?p>|<\/?div>|<\/?li>)/i)
                             .map(h => h.replace(/<[^>]*>/g, '').trim()) // Strip remaining tags and trim
                             .filter(h => h.length > 0 && !/^<\/?ul>$/.test(h));
                        })().map((highlight, idx) => (
                          <div key={idx} className="flex gap-4 text-[#334155] dark:text-slate-300 items-start group">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100/50 dark:bg-emerald-950/30 text-[#0a6c75] dark:text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                              <span className="material-symbols-outlined text-[20px] font-bold" style={{fontVariationSettings: "'FILL' 0, 'wght' 700"}}>check</span>
                            </div>
                            <span className="leading-relaxed text-[17px] font-medium text-[#334155] dark:text-slate-300 m-0 p-0 pt-0.5" dangerouslySetInnerHTML={{ __html: highlight.trim() }}></span>
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
                              const text = typeof item === 'object' ? item.text : item;
                              const option = typeof item === 'object' ? item.option : 'Included in Package';
                              const iconName = getInclusionIcon(text);
                              return (
                                <li key={idx} className="flex items-start gap-4 group">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100/50 dark:border-emerald-800/50 shadow-sm text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-[20px]">{iconName}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[15px] font-bold text-slate-800 dark:text-slate-100 leading-tight">{text}</span>
                                    <span className="text-[11px] font-medium text-emerald-600/70 dark:text-emerald-400/50 uppercase tracking-tighter mt-1">{option}</span>
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
                              const text = typeof item === 'object' ? item.text : item;
                              const option = typeof item === 'object' ? item.option : 'Extra Charges Apply';
                              const iconName = getInclusionIcon(text);
                              return (
                                <li key={idx} className="flex items-start gap-4 group opacity-80 hover:opacity-100 transition-opacity">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-400 dark:text-slate-500 shrink-0 group-hover:bg-rose-50 dark:group-hover:bg-rose-900/20 group-hover:text-rose-500 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">{iconName}</span>
                                  </div>
                                  <div className="flex flex-col border-l-2 border-slate-100 dark:border-slate-800 pl-4">
                                    <span className="text-[15px] font-bold text-slate-500 dark:text-slate-400 leading-tight line-through decoration-slate-300 dark:decoration-slate-700">{text}</span>
                                    <span className="text-[11px] font-medium text-rose-500/70 dark:text-rose-400/50 uppercase tracking-tighter mt-1">{option}</span>
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

                  {/* FAQ */}
                  {tour.faq && tour.faq.length > 0 && tour.faq.some(f => f.question) && (
                    <div id="section-faq" className="flex flex-col gap-6 mt-12 scroll-mt-24">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Frequently Asked Questions</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary rounded">{tour.faq.filter(f => f.question).length} Q&A</span>
                      </div>
                      <div className="flex flex-col gap-3">
                        {tour.faq.filter(f => f.question).map((item, idx) => (
                          <div
                            key={idx}
                            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                              openFaq === idx
                                ? 'border-primary/30 bg-primary/5 dark:bg-primary/10 shadow-sm'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/20'
                            }`}
                          >
                            <button
                              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                            >
                              <span className={`text-base font-bold leading-snug ${
                                openFaq === idx ? 'text-primary' : 'text-slate-800 dark:text-slate-100'
                              }`}>
                                {item.question}
                              </span>
                              <span className={`material-symbols-outlined text-[20px] shrink-0 transition-transform duration-300 ${
                                openFaq === idx ? 'rotate-180 text-primary' : 'text-slate-400'
                              }`}>expand_more</span>
                            </button>
                            {openFaq === idx && (
                              <div className="px-6 pb-5">
                                <div
                                  className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed prose prose-sm dark:prose-invert"
                                  dangerouslySetInnerHTML={{ __html: formatContent(item.answer) }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
                {/* Sidebar (Right Column) */}
                <aside className="lg:col-span-1">
                   <div className="flex flex-col gap-6 sticky top-24">
                      {/* ── Package Highlights Widget ── */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/70 shadow-sm overflow-hidden">
                        {/* Coloured header */}
                        <div className="bg-gradient-to-r from-primary/8 to-transparent px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800/60">
                          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Package Highlights</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">At a Glance</p>
                        </div>

                        <div className="px-5 py-5 space-y-5">

                          {/* Route flow */}
                          {tour.cityPath && (
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">Route</p>
                              <div className="flex flex-wrap items-center gap-1.5">
                                {tour.cityPath.split(/➔|-|->/).map((city, idx, arr) => (
                                  <React.Fragment key={idx}>
                                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg">
                                      {city.trim()}
                                    </span>
                                    {idx < arr.length - 1 && (
                                      <span className="text-[11px] font-black text-primary">›</span>
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Hotel + Meals */}
                          {((tour.hotelCategory && tour.hotelCategory.length > 0) || (tour.mealPlan && tour.mealPlan.length > 0)) && (
                            <div className="grid grid-cols-2 gap-3">
                              {tour.hotelCategory && tour.hotelCategory.length > 0 && (
                                <div>
                                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 mb-1.5">Hotel</p>
                                  <div className="flex flex-wrap gap-1">
                                    {tour.hotelCategory.map(cat => (
                                      <span key={cat} className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/40 px-2 py-1 rounded-lg">
                                        <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        {cat.replace('_', ' ')}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {tour.mealPlan && tour.mealPlan.length > 0 && (
                                <div>
                                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 mb-1.5">Meals</p>
                                  <div className="flex flex-wrap gap-1">
                                    {tour.mealPlan.map(meal => (
                                      <span key={meal} className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/40 px-2 py-1 rounded-lg">
                                        <span className="material-symbols-outlined text-[12px]">restaurant_menu</span>
                                        {meal}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Transport */}
                          {tour.transport && (
                            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl px-3.5 py-3 border border-slate-100 dark:border-slate-700/40">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-primary text-[17px]">{getInclusionIcon(tour.transport)}</span>
                              </div>
                              <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 leading-none mb-0.5">Transport</p>
                                <p className="text-[12px] font-bold text-slate-700 dark:text-slate-200 capitalize">{tour.transport} — Included</p>
                              </div>
                            </div>
                          )}

                          {/* Services */}
                          {tour.tourFeatures && tour.tourFeatures.length > 0 && (
                            <div className="pt-1">
                              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2.5">Included Services</p>
                              <div className="flex flex-wrap gap-2">
                                {tour.tourFeatures.map(feature => {
                                  const mapping = {
                                    accommodation: { icon: 'hotel', label: 'Accommodation' },
                                    sightseeing:   { icon: 'photo_camera', label: 'Sightseeing' },
                                    stay:          { icon: 'bed', label: 'Stay' },
                                    transfers:     { icon: 'airport_shuttle', label: 'Transfers' }
                                  };
                                  const item = mapping[feature] || { icon: 'check_circle', label: feature };
                                  return (
                                    <span key={feature} className="inline-flex items-center gap-1.5 bg-slate-800 dark:bg-slate-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-tight hover:bg-primary transition-colors duration-200 cursor-default">
                                      <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
                                      {item.label}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                        </div>
                      </div>

                      {/* ── Booking Widget ── */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/70 shadow-sm overflow-hidden">

                        {/* Price header */}
                        <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800/60">
                          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-400 mb-2">Reserve Your Spot</p>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-bold text-slate-400">₹</span>
                            <span className="text-[2rem] font-black text-slate-900 dark:text-white tracking-tight tabular-nums leading-none">
                              {getDynamicPriceData().totalPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[11px] font-medium text-slate-400 ml-1">/ total</span>
                          </div>
                          {getDynamicPriceData().groupDiscountAmount > 0 && (
                            <div className="flex items-center gap-1.5 mt-2.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 px-2.5 py-1 rounded-full w-fit">
                              <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                              Group discount: -₹{getDynamicPriceData().groupDiscountAmount.toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>

                        <div className="px-5 py-5 space-y-4">

                          {/* Guests + Date */}
                          <div className="grid grid-cols-2 gap-2.5">
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-700/50">
                              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">Guests</p>
                              <div className="flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={() => setBookingGuests(prev => Math.max(1, prev - 1))}
                                  disabled={bookingGuests <= 1}
                                  className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-all ${
                                    bookingGuests > 1
                                      ? 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-primary hover:bg-primary hover:text-white hover:border-primary shadow-sm'
                                      : 'border-slate-100 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-[15px]">remove</span>
                                </button>
                                <span className="text-base font-black text-slate-800 dark:text-white tabular-nums">{bookingGuests}</span>
                                <button
                                  type="button"
                                  onClick={() => setBookingGuests(prev => Math.min(20, prev + 1))}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-primary hover:bg-primary hover:text-white hover:border-primary shadow-sm transition-all"
                                >
                                  <span className="material-symbols-outlined text-[15px]">add</span>
                                </button>
                              </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-700/50">
                              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">Start Date</p>
                              <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-slate-400 text-[13px] flex-shrink-0">calendar_today</span>
                                <input
                                  type="date"
                                  value={bookingDate}
                                  min={new Date().toISOString().split('T')[0]}
                                  onChange={(e) => setBookingDate(e.target.value)}
                                  className="bg-transparent text-[11px] font-bold text-slate-700 dark:text-slate-200 outline-none w-full"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Booking Summary card */}
                          <div className="rounded-2xl border border-slate-100 dark:border-slate-800/60 overflow-hidden">
                            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700/50">
                              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Booking Summary</p>
                            </div>
                            <div className="px-4 pt-3.5 pb-3 space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[12px] text-slate-500">Base Price</span>
                                <span className="text-[13px] font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                                  ₹{getDynamicPriceData().totalBeforeGroupDiscount.toLocaleString('en-IN')}
                                </span>
                              </div>
                              {getDynamicPriceData().groupDiscountAmount > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-[12px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[13px]">verified</span>
                                    Group Discount
                                  </span>
                                  <span className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                    -₹{getDynamicPriceData().groupDiscountAmount.toLocaleString('en-IN')}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Total</span>
                                <span className="text-[18px] font-black text-slate-900 dark:text-white tabular-nums">
                                  ₹{getDynamicPriceData().totalPrice.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>

                            {/* Pay Now gradient callout */}
                            <div className="mx-3 mb-3 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/15 px-4 py-3 flex items-center justify-between">
                              <div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.18em] leading-none mb-0.5">Pay Now — 30%</p>
                                <p className="text-[9px] text-slate-500 italic">Secures your booking at this price</p>
                              </div>
                              <p className="text-[20px] font-black text-primary tabular-nums leading-none">
                                ₹{getDynamicPriceData().advance.toLocaleString('en-IN')}
                              </p>
                            </div>

                            <div className="px-4 pb-3 flex justify-between items-center">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Service Fee</span>
                              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">Included ✓</span>
                            </div>
                          </div>

                          {/* CTA */}
                          <button
                            onClick={() => setIsBookingModalOpen(true)}
                            className="w-full py-3.5 bg-primary hover:bg-primary/90 active:scale-[0.98] text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-primary/25 transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[17px]">flash_on</span>
                            Book This Tour
                          </button>

                          <p className="text-[10px] text-center text-slate-400">
                            🔒 Free cancellation within 48 hours
                          </p>

                        </div>
                      </div>

                      {/* Specialist Banner */}
                      <button 
                        onClick={() => setIsQuoteModalOpen(true)}
                        className="group flex flex-col gap-4 p-8 bg-slate-900 dark:bg-white rounded-[2.5rem] text-left transition-all hover:-translate-y-1 shadow-2xl shadow-slate-900/20"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-primary/10 flex items-center justify-center text-white dark:text-primary">
                               <span className="material-symbols-outlined text-2xl font-black">support_agent</span>
                            </div>
                            <div>
                               <h5 className="text-white dark:text-slate-900 font-black text-lg leading-tight uppercase tracking-tight">Need Help?</h5>
                               <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">Talk to a Specialist</p>
                            </div>
                         </div>
                         <p className="text-slate-300 dark:text-slate-600 text-sm font-medium leading-relaxed italic">"Our destination experts can customize this itinerary to match your specific pace and preferences."</p>
                         <div className="flex items-center gap-2 text-primary dark:text-slate-900 text-[10px] font-black uppercase tracking-widest mt-2 group-hover:gap-4 transition-all">
                            Personalize My Trip
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                         </div>
                      </button>
                   </div>
                </aside>
              </div>
              
              {/* Similar Tours Section */}
              <div className="mt-24 pt-12 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-10">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Similar Expeditions</h3>
                    <p className="text-slate-500 font-bold italic text-sm">Hand-picked alternatives that you might love.</p>
                  </div>
                  <Link to="/tours" className="text-[11px] font-black text-primary uppercase tracking-[4px] hover:tracking-[6px] transition-all">Explore All →</Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {similarTours.map((t, i) => (
                    <Link to={`/tour/${t.slug || t.id}`} key={i} className="group relative flex flex-col gap-4 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 overflow-hidden">
                       <div className="relative aspect-[4/3] overflow-hidden">
                          <img src={t.image} alt={t.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute bottom-4 left-4 flex flex-col">
                             <span className="text-[9px] font-black text-white/70 uppercase tracking-widest mb-1">{t.destination}</span>
                             <h4 className="text-white font-bold leading-tight line-clamp-1">{t.title}</h4>
                          </div>
                          <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 px-2 py-1 rounded-lg text-[10px] font-black text-white uppercase">
                             {t.duration}
                          </div>
                       </div>
                       <div className="px-6 pb-6 pt-2 flex items-center justify-between">
                          <div className="flex flex-col">
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Starts At</span>
                             <div className="flex items-baseline gap-1">
                                <span className="text-[11px] font-bold text-primary">₹</span>
                                <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">{t.price?.toLocaleString('en-IN') || '---'}</span>
                             </div>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                             <span className="material-symbols-outlined text-lg">arrow_forward</span>
                          </div>
                       </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── Book This Tour Modal ── */}
      {isBookingModalOpen && (() => {
        const pd = getDynamicPriceData();
        const tourUrl = window.location.href;
        const handleClose = () => {
          setIsBookingModalOpen(false);
          setBookingSubmitted(false);
          setBookingError('');
          setBookingForm({ name: '', email: '', phone: '' });
        };
        const handleSubmit = async (e) => {
          e.preventDefault();
          setBookingSubmitting(true);
          setBookingError('');
          const payload = {
            // Contact
            name: bookingForm.name,
            email: bookingForm.email,
            phone: bookingForm.phone,
            // Tour details
            to: tour.title,
            source: 'Tour Booking Form',
            type: 'Tour Booking Query',
            tourUrl,
            departureDate: bookingDate,
            travelers: `${bookingGuests} Guest${bookingGuests > 1 ? 's' : ''}`,
            // Pricing snapshot
            basePrice: `₹${pd.totalBeforeGroupDiscount.toLocaleString('en-IN')}`,
            groupDiscount: pd.groupDiscountAmount > 0 ? `-₹${pd.groupDiscountAmount.toLocaleString('en-IN')}` : 'N/A',
            totalPrice: `₹${pd.totalPrice.toLocaleString('en-IN')}`,
            advanceAmount: `₹${pd.advance.toLocaleString('en-IN')} (30%)`,
            // Meta
            status: 'New',
            timestamp: new Date().toISOString(),
          };
          try {
            const res = await fetch(`${import.meta.env.BASE_URL}api-save-leads.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
              setBookingSubmitted(true);
            } else {
              throw new Error(data.message || 'Submission failed');
            }
          } catch (err) {
            setBookingError(err.message || 'Something went wrong. Please try again.');
          } finally {
            setBookingSubmitting(false);
          }
        };
        return (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={handleClose} />

            {/* Sheet */}
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-400 flex flex-col max-h-[95vh]">

              {/* Gradient top strip */}
              <div className="h-1 w-full bg-gradient-to-r from-primary via-emerald-400 to-primary" />

              {/* Header */}
              <div className="px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-primary mb-0.5">Confirm Your Booking</p>
                  <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight line-clamp-2">{tour.title}</h2>
                </div>
                <button onClick={handleClose} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all flex-shrink-0 ml-4">
                  <span className="material-symbols-outlined text-[19px]">close</span>
                </button>
              </div>

              <div className="overflow-y-auto flex-1">

                {bookingSubmitted ? (
                  /* Success state */
                  <div className="px-6 py-12 flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-emerald-500 text-[36px]">check_circle</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Booking Query Received!</h3>
                    <p className="text-sm text-slate-500 max-w-xs">Our team will contact you within 2 hours to confirm your booking and advance payment details.</p>
                    <button onClick={handleClose} className="mt-4 px-8 py-3 bg-primary text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-lg shadow-primary/25">
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

                    {/* Pricing Summary (read-only) */}
                    <div className="rounded-2xl border border-slate-100 dark:border-slate-800/60 overflow-hidden">
                      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700/50">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Price Summary</p>
                      </div>
                      <div className="px-4 py-3 space-y-2.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[12px] text-slate-500">{bookingGuests} Guest{bookingGuests > 1 ? 's' : ''} · {bookingDate}</span>
                          <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200 tabular-nums">₹{pd.totalBeforeGroupDiscount.toLocaleString('en-IN')}</span>
                        </div>
                        {pd.groupDiscountAmount > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-[12px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">verified</span>Group Discount
                            </span>
                            <span className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">-₹{pd.groupDiscountAmount.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Total</span>
                          <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums">₹{pd.totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Advance payment callout */}
                      <div className="mx-3 mb-3 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/15 px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.18em] leading-none mb-0.5">Pay Now — 30% Advance</p>
                          <p className="text-[9px] text-slate-500 italic">Blocks your seat at this price</p>
                        </div>
                        <p className="text-[20px] font-black text-primary tabular-nums">₹{pd.advance.toLocaleString('en-IN')}</p>
                      </div>

                      {/* Tour URL */}
                      <div className="px-4 pb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400 text-[14px]">link</span>
                        <p className="text-[10px] text-slate-400 truncate">{tourUrl}</p>
                      </div>
                    </div>

                    {/* Contact fields */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Your Details</p>

                      {/* Name */}
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[17px]">person</span>
                        <input
                          type="text"
                          required
                          placeholder="Full Name"
                          value={bookingForm.name}
                          onChange={e => setBookingForm(p => ({ ...p, name: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600"
                        />
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[17px]">mail</span>
                        <input
                          type="email"
                          required
                          placeholder="Email Address"
                          value={bookingForm.email}
                          onChange={e => setBookingForm(p => ({ ...p, email: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600"
                        />
                      </div>

                      {/* Mobile */}
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[17px]">smartphone</span>
                        <input
                          type="tel"
                          required
                          placeholder="Mobile / WhatsApp Number"
                          value={bookingForm.phone}
                          onChange={e => setBookingForm(p => ({ ...p, phone: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    {/* Error */}
                    {bookingError && (
                      <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-[12px] font-bold text-red-600 dark:text-red-400">
                        {bookingError}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={bookingSubmitting}
                      className="w-full py-4 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-primary/25 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {bookingSubmitting ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</>
                      ) : (
                        <><span className="material-symbols-outlined text-[17px]">send</span>Submit Booking Query</>
                      )}
                    </button>

                    <p className="text-[10px] text-center text-slate-400">🔒 Your information is secure and will not be shared.</p>
                  </form>
                )}

              </div>
            </div>
          </div>
        );
      })()}

      {/* Consult Specialist Modal */}
      <ConsultSpecialistModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
        tourTitle={tour.title}
        tourImage={tour.image}
      />
    </div>
  );
};

export default TourDetailView;
