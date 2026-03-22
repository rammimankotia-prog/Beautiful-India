import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import categoriesData from '../data/categories.json';

const destinations = [
  {
    id: 1,
    name: 'Himachal Pradesh',
    slug: 'himachal',
    tagline: 'Land of Snow & Serenity',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    packages: 245,
    startingFrom: 8999,
    duration: '4–10 Days',
    badge: '🏔️ Mountains',
    highlights: ['Shimla', 'Manali', 'Dharamshala', 'Kasol', 'Spiti Valley'],
    bestTime: 'Mar – Jun & Oct – Nov',
    themes: ['Adventure', 'Honeymoon', 'Family', 'Solo'],
  },
  {
    id: 2,
    name: 'Kashmir',
    slug: 'kashmir',
    tagline: 'Paradise on Earth',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    packages: 312,
    startingFrom: 12999,
    duration: '5–8 Days',
    badge: '❄️ Snow',
    highlights: ['Dal Lake', 'Gulmarg', 'Pahalgam', 'Sonamarg', 'Yusmarg'],
    bestTime: 'Mar – Nov',
    themes: ['Honeymoon', 'Family', 'Photography'],
  },
  {
    id: 3,
    name: 'Rajasthan',
    slug: 'rajasthan',
    tagline: 'The Land of Kings',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    packages: 189,
    startingFrom: 7499,
    duration: '5–12 Days',
    badge: '🏯 Heritage',
    highlights: ['Jaipur', 'Udaipur', 'Jaisalmer', 'Jodhpur', 'Pushkar'],
    bestTime: 'Oct – Mar',
    themes: ['Heritage', 'Cultural', 'Luxury', 'Family'],
  },
  {
    id: 4,
    name: 'Kerala',
    slug: 'kerala',
    tagline: 'God\'s Own Country',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    packages: 276,
    startingFrom: 9499,
    duration: '5–9 Days',
    badge: '🌿 Nature',
    highlights: ['Munnar', 'Alleppey', 'Wayanad', 'Thekkady', 'Kovalam'],
    bestTime: 'Sep – Mar',
    themes: ['Honeymoon', 'Wellness', 'Backwaters', 'Nature'],
  },
  {
    id: 5,
    name: 'Ladakh',
    slug: 'ladakh',
    tagline: 'Where Heaven Meets Earth',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80',
    packages: 143,
    startingFrom: 15999,
    duration: '7–12 Days',
    badge: '🚵 Adventure',
    highlights: ['Leh', 'Pangong Lake', 'Nubra Valley', 'Tso Moriri', 'Zanskar'],
    bestTime: 'Jun – Sep',
    themes: ['Adventure', 'Bike Trip', 'Photography', 'Solo'],
  },
  {
    id: 6,
    name: 'Goa',
    slug: 'goa',
    tagline: 'Sun, Sand & Serenity',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    packages: 198,
    startingFrom: 5999,
    duration: '3–6 Days',
    badge: '🏖️ Beach',
    highlights: ['Calangute', 'Anjuna', 'Old Goa', 'Dudhsagar', 'Panaji'],
    bestTime: 'Nov – Feb',
    themes: ['Honeymoon', 'Friends', 'Family', 'Budget'],
  },
  {
    id: 7,
    name: 'Uttarakhand',
    slug: 'uttarakhand',
    tagline: 'Dev Bhoomi – Land of Gods',
    image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
    packages: 211,
    startingFrom: 7999,
    duration: '4–8 Days',
    badge: '🙏 Spiritual',
    highlights: ['Rishikesh', 'Haridwar', 'Nainital', 'Mussoorie', 'Jim Corbett'],
    bestTime: 'Mar – Jun & Sep – Nov',
    themes: ['Pilgrimage', 'Adventure', 'Nature', 'Yoga'],
  },
  {
    id: 8,
    name: 'Andaman Islands',
    slug: 'andaman',
    tagline: 'Jewels of the Bay of Bengal',
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
    packages: 127,
    startingFrom: 18999,
    duration: '5–8 Days',
    badge: '🤿 Underwater',
    highlights: ['Port Blair', 'Havelock Island', 'Neil Island', 'Ross Island', 'Baratang'],
    bestTime: 'Oct – May',
    themes: ['Honeymoon', 'Scuba Diving', 'Family', 'Photography'],
  },
];


const metroCitiesIndia = [
  {
    name: 'Delhi',
    description: 'The Heart of India, where history meets modernity.',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
    slug: 'delhi'
  },
  {
    name: 'Mumbai',
    description: 'The City of Dreams and the financial capital of India.',
    image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=600&q=80',
    slug: 'mumbai'
  },
  {
    name: 'Kolkatta',
    description: 'The City of Joy, known for its rich culture and heritage.',
    image: 'https://images.unsplash.com/photo-1558431382-bb74994135b3?auto=format&fit=crop&w=600&q=80',
    slug: 'kolkatta'
  },
  {
    name: 'Chennai',
    description: 'The Gateway to South India, famous for its temples and beaches.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
    slug: 'chennai'
  }
];

const faqs = [
  { q: 'What is Bharat Darshan?', a: 'Bharat Darshan is our curated collection of domestic India travel packages, inspired by the philosophy of exploring the incredible diversity of Bharat (India). From snowy peaks to tropical backwaters, desert sands to island shores – we cover all of India\'s wonders.' },
  { q: 'How do I book a Bharat Darshan package?', a: 'Simply browse our destinations, click on your preferred package, and use the "Get a Quote" or "Book Now" button. You can also use our trip planner chatbot (bottom right) to get personalized recommendations.' },
  { q: 'Can packages be customized?', a: 'Absolutely! Every package under Bharat Darshan is 100% customizable. Our travel experts will work with you to tailor the itinerary, accommodation, transport, and dates as per your preferences.' },
  { q: 'What is the best time to travel in India?', a: 'October to March is generally pleasant for most Indian destinations. Hill stations like Himachal and Kashmir are best in summer (Apr–Jun). Goa and Rajasthan peak in winter (Nov–Feb). We recommend based on your desired destination.' },
  { q: 'Do packages include flights?', a: 'Our base packages cover hotel stays, local transport, sightseeing, and meals (as mentioned). Flights or trains are optional and can be added on request. Our team will give you the best-price options.' },
];

const BharatDarshanPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [openFaq, setOpenFaq] = useState(null);
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', destination: '' });
  const [submitted, setSubmitted] = useState(false);
  const [allTours, setAllTours] = useState([]);
  const [loadingTours, setLoadingTours] = useState(true);
  
  // Dynamic Categories from JSON + LocalStorage override
  const [categories, setCategories] = useState(categoriesData.categories);

  useEffect(() => {
    const saved = localStorage.getItem('beautifulindia_admin_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCategories(prev => ({ ...prev, ...parsed }));
      } catch (e) { console.error('Failed to load saved categories:', e); }
    }
  }, []);

  const themes = categories.themes;
  const filters = ['All', ...categories.states.slice(0, 7)]; // Or specific thematic filters

  const resultsRef = useRef(null);

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
            const res = await fetch(`${import.meta.env.BASE_URL || '/'}data/tours.json?t=${Date.now()}`);
            if (res.ok) {
                allToursList = await res.json();
                if (allToursList && Array.isArray(allToursList) && allToursList.length > 0) {
                    localStorage.setItem('beautifulindia_admin_tours', JSON.stringify(allToursList));
                }
            }
        }
        
        // Only show active or undefined (legacy) status tours on frontend
        setAllTours(allToursList.filter(t => t.status !== 'paused' && t.status !== 'draft'));
      } catch (err) {
        console.error('Failed to fetch tours:', err);
      } finally {
        setLoadingTours(false);
      }
    };
    fetchTours();
  }, []);

  const scrollToResults = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


  // Map filter pill label → destination names to use in URL
  const filterDestinationMap = {
    Mountains:  ['Himachal Pradesh', 'Kashmir', 'Ladakh', 'Uttarakhand'],
    Heritage:   ['Rajasthan'],
    Beach:      ['Goa', 'Andaman Islands'],
    Adventure:  ['Ladakh', 'Uttarakhand', 'Himachal Pradesh'],
    Spiritual:  ['Uttarakhand'],
    Nature:     ['Kerala'],
  };

  const filteredDest = activeFilter === 'All'
    ? destinations
    : destinations.filter(d => 
        d.badge.includes(activeFilter) || 
        d.name.toLowerCase() === activeFilter.toLowerCase()
      );

  // Refine tour filtering logic
  const filteredTourPackages = activeFilter === 'All'
    ? allTours.slice(0, 8) // Show top 8 by default
    : allTours.filter(t => {
        const query = activeFilter.toLowerCase();
        return (
          t.theme?.toLowerCase().includes(query) || 
          t.stateRegion?.toLowerCase().includes(query) ||
          (t.title?.toLowerCase().includes(query)) ||
          destinations.find(d => d.name === t.stateRegion && d.badge.toLowerCase().includes(query))
        );
      });

  const handleThemeClick = (themeLabel) => {
    if (activeFilter === themeLabel) {
      setActiveFilter('All');
    } else {
      setActiveFilter(themeLabel);
      scrollToResults();
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitted(true);
      console.log('Lead submitted (mock for static site):', leadForm);
    } catch (err) {
      console.error('Failed to submit lead:', err);
    }
  };

  return (
    <main className="font-sans bg-[#f8fafc]">
      <Helmet>
        <title>Bharat Darshan - Explore the Incredible Soul of India | Tours & Packages</title>
        <meta name="description" content="Discover India's beauty with Bharat Darshan. Curated tour packages for Himachal, Kashmir, Rajasthan, Kerala, and more. 100% customizable trips to India's top destinations." />
        <meta name="keywords" content="Bharat Darshan, India Tours, Tour Packages India, Travel India, Himachal Tours, Rajasthan Packages, Kerala Backwaters, Incredible India" />
        <meta property="og:title" content="Bharat Darshan - Discover the Soul of India" />
        <meta property="og:description" content="Explore expertly curated tour packages for every Indian state. From the Himalayas to coastal beaches, plan your perfect trip with Bharat Darshan." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://rammimankotia-prog.github.io/Beautiful-India" />
      </Helmet>

      {/* ── Hero (TravelTriangle-style) ── */}
      <section
        className="relative overflow-hidden flex items-center justify-center"
        style={{
          minHeight: 540,
          background: 'linear-gradient(135deg, #f0fdf9 0%, #e6f7f5 55%, #fef9f0 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-10" style={{ background: '#006D77', transform: 'translate(-30%, -30%)' }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-10" style={{ background: '#ff9933', transform: 'translate(30%, 30%)' }} />

        {/* Couple illustration — left */}
        <img
          src="/india_couple_hero.png"
          alt="Indian couple at Taj Mahal"
          className="absolute bottom-0 left-0 h-full w-auto object-contain object-bottom pointer-events-none select-none"
          style={{ zIndex: 1 }}
        />

        {/* Family illustration — right */}
        <img
          src="/india_family_hero.png"
          alt="Indian family at temple"
          className="absolute bottom-0 right-0 h-full w-auto object-contain object-bottom pointer-events-none select-none"
          style={{ zIndex: 1 }}
        />

        {/* Centre content */}
        <div className="relative z-10 text-center max-w-xl px-8 py-20 pb-28">
          {/* Brand pill */}
          <span className="inline-block bg-[#006D77]/10 text-[#006D77] font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#006D77]/20 mb-5">
            🇮🇳 Bharat Darshan
          </span>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Customize &amp; Book<br />
            <span style={{ color: '#006D77' }}>Amazing Holiday Packages</span>
          </h1>

          <p className="text-base text-[#5a7a7d] font-medium max-w-lg mx-auto mb-8 leading-relaxed">
            From the mighty Himalayas to palm-fringed beaches — explore Bharat in all its glory with expertly curated packages.
          </p>

          {/* Search bar */}
          <div className="flex items-center bg-white rounded-full shadow-xl border border-[#006D77]/10 px-5 py-2 mb-3" style={{ boxShadow: '0 8px 32px rgba(0,109,119,0.18)' }}>
            <span className="material-symbols-outlined text-[#006D77] mr-2 text-[20px]">location_on</span>
            <input
              className="flex-1 border-none outline-none text-[15px] font-semibold text-slate-800 bg-transparent"
              placeholder="Type a destination..."
              type="text"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            />
            <a href="#destinations">
              <button
                className="bg-[#006D77] text-white font-black text-[14px] rounded-full border-none cursor-pointer whitespace-nowrap transition-all hover:bg-[#004d55]"
                style={{ padding: '12px 28px', fontFamily: 'Montserrat, sans-serif' }}
              >
                Explore
              </button>
            </a>
          </div>

          <p className="text-slate-400 text-[12px]">
            Destination not sure?{' '}
            <Link to="/wanderbot" className="text-[#006D77] font-bold hover:underline">Ask Bharat Bot ↗</Link>
          </p>
        </div>

        {/* Stats strip */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-6 md:gap-14 py-3 px-8 md:px-12 rounded-full z-10 w-[92%] md:w-auto overflow-hidden"
          style={{ background: 'rgba(0, 50, 55, 0.65)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
        >
          {[['2,500+', 'Packages'], ['50+', 'Destinations'], ['1 Lakh+', 'Happy Travelers'], ['100%', 'Customizable']].map(([num, lab]) => (
            <div key={lab} className="text-center px-1">
              <div className="text-[16px] md:text-[20px] font-black leading-tight" style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{num}</div>
              <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: 'rgba(255,255,255,0.85)' }}>{lab}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Travel by Theme ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800">Travel by Theme</h2>
          <p className="text-slate-500 mt-2 text-sm md:text-base">Find packages crafted for your unique travel style</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {themes.map(t => (
            <div
              key={t.label}
              onClick={() => handleThemeClick(t.label)}
              className={`flex flex-col items-center p-4 rounded-2xl border transition-all cursor-pointer group ${activeFilter === t.label ? 'bg-teal-50 border-[#0a6c75] shadow-md ring-1 ring-[#0a6c75]' : 'bg-white border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1'}`}
            >
              <div className="text-2xl md:text-3xl mb-2">{t.icon}</div>
              <div className={`text-[12px] md:text-[13px] font-bold transition-colors text-center ${activeFilter === t.label ? 'text-[#0a6c75]' : 'text-slate-700 group-hover:text-[#0a6c75]'}`}>{t.label}</div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5 text-center">{t.count}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Destinations ── */}
      <section id="destinations" className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800">Popular Destinations</h2>
            <p className="text-slate-500 mt-1">Handpicked destinations across incredible India</p>
          </div>
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all ${activeFilter === f ? 'bg-[#0a6c75] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div ref={resultsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDest.map(dest => (
            <article key={dest.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer">
              {/* Image */}
              <Link to={`/tours?destination=${encodeURIComponent(dest.name)}`} className="block relative h-48 overflow-hidden">
                <img src={dest.image} alt={`Travel packages for ${dest.name} - ${dest.tagline}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute top-3 left-3 bg-white/90 text-slate-700 text-[11px] font-black px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {dest.badge}
                </span>
                <div className="absolute bottom-3 left-3">
                  <h3 className="text-white font-extrabold text-lg leading-tight">{dest.name}</h3>
                  <p className="text-white/80 text-[12px] font-medium">{dest.tagline}</p>
                </div>
              </Link>
              {/* Body */}
              <div className="p-4">
                {/* Highlights */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {dest.highlights.slice(0, 3).map(h => (
                    <span key={h} className="text-[11px] font-bold text-[#0f766e] bg-[#f0fdfa] px-2 py-0.5 rounded-full">{h}</span>
                  ))}
                  {dest.highlights.length > 3 && (
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">+{dest.highlights.length - 3} more</span>
                  )}
                </div>
                {/* Meta */}
                <div className="flex justify-between items-center text-[12px] text-slate-500 font-bold mb-4">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> {dest.duration}</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">wb_sunny</span> {dest.bestTime}</span>
                </div>
                {/* Price + CTA */}
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Starting From</div>
                    <div className="text-[20px] font-black text-[#0a6c75]">₹{dest.startingFrom.toLocaleString('en-IN')}</div>
                  </div>
                  <Link to={`/tours?destination=${encodeURIComponent(dest.name)}`} className="px-4 py-2 bg-[#0a6c75] text-white text-[12px] font-black rounded-xl hover:bg-[#07565e] transition-colors shadow-sm">
                    Explore
                  </Link>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-50 text-[11px] text-slate-400 font-bold text-center">
                  {dest.packages} packages available
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── Featured Tour Packages ── */}
        <section className="mt-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-800">Recommended Tour Packages</h2>
              <p className="text-slate-500 mt-1">Best-selling itineraries based on your {activeFilter === 'All' ? 'interests' : `interest in ${activeFilter}`}</p>
            </div>
            <Link to="/tours" className="text-[#0a6c75] font-black text-sm flex items-center gap-1 hover:gap-2 transition-all">
              View All Tours <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {loadingTours ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="bg-white h-80 rounded-2xl border border-slate-100 shadow-sm" />
              ))}
            </div>
          ) : filteredTourPackages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTourPackages.map(tour => (
                <article key={tour.id}>
                  <Link to={`/tour/${tour.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full">
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                      <img src={tour.image} alt={tour.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#0a6c75] text-[10px] font-black px-2 py-0.5 rounded-full">
                        {tour.duration}
                      </div>
                    </div>
                    {/* Body */}
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="text-[10px] font-black text-[#0a6c75] uppercase tracking-wider mb-1">{tour.stateRegion}</div>
                      <h3 className="font-extrabold text-slate-800 text-[14px] leading-tight mb-2 line-clamp-2">{tour.title}</h3>
                      <p className="text-slate-500 text-[12px] line-clamp-2 mb-4 flex-1">{tour.description}</p>
                      <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-50">
                        <div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase">Starting At</div>
                          <div className="text-[16px] font-black text-[#0a6c75]">₹{parseInt(tour.price).toLocaleString('en-IN')}</div>
                        </div>
                        <span className="material-symbols-outlined text-slate-300 group-hover:text-[#0a6c75] transition-colors">arrow_circle_right</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
              <span className="material-symbols-outlined text-5xl text-slate-200 mb-4">search_off</span>
              <h3 className="text-lg font-black text-slate-800">No matching tours found</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">We couldn't find specific tours for "{activeFilter}" right now. Try selecting another category or view all tours.</p>
              <button 
                onClick={() => setActiveFilter('All')}
                className="mt-6 px-6 py-2.5 bg-[#0a6c75] text-white font-black text-[13px] rounded-xl shadow-md hover:bg-[#07565e] transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </section>

      {/* ── Top 4 Metro Cities ── */}
      <section className="bg-[#f1f5f9] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-800">Top 4 Metro Cities of India</h2>
            <p className="text-slate-500 mt-2">Explore the vibrant urban landscapes and cultural hubs of Bharat</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {metroCitiesIndia.map(city => (
              <article key={city.name} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="relative h-44 overflow-hidden">
                  <img src={city.image} alt={`Tourism and tour packages in ${city.name}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <h3 className="text-white font-extrabold text-xl">{city.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-slate-500 text-sm font-medium mb-4 leading-relaxed">
                    {city.description}
                  </p>
                  <Link to={`/tours?destination=${city.name}`} className="inline-flex items-center text-[#0a6c75] font-black text-sm hover:translate-x-1 transition-transform">
                    View Tours <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Travel by Train ── */}
      <section className="py-20 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-amber-400/30">
                <span className="material-symbols-outlined text-[14px]">train</span> Luxury Rail Journeys
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">Travel by Train</h2>
              <p className="text-white/60 mt-2 max-w-xl">Experience the scenic beauty of India through the windows of a train. Romantic, sustainable, and iconic.</p>
            </div>
            <Link to="/tours/tours-by-train" className="px-8 py-3.5 bg-amber-400 text-slate-900 font-black rounded-2xl hover:bg-amber-300 transition-all shadow-xl shadow-amber-400/20 flex items-center gap-2 whitespace-nowrap">
              View All Train Tours <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allTours.filter(t => t.transport === 'train' && t.showOnHome !== false).slice(0, 3).map(tour => (
              <article key={tour.id} className="group relative bg-[#0f172a] rounded-3xl overflow-hidden border border-white/10 hover:border-amber-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-400/10">
                <div className="relative h-64 overflow-hidden">
                  <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">Train Tour</span>
                    <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full border border-white/20 uppercase tracking-tighter">{tour.duration}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-amber-400 flex items-center gap-1 mb-2">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider">{tour.stateRegion}</span>
                  </div>
                  <h3 className="text-xl font-black text-white mb-3 leading-tight group-hover:text-amber-400 transition-colors line-clamp-1">{tour.title}</h3>
                  <p className="text-white/50 text-sm mb-6 line-clamp-2 font-medium">{tour.description}</p>
                  
                  <div className="flex items-center justify-between pt-5 border-t border-white/5">
                    <div>
                      <div className="text-[10px] text-white/40 font-black uppercase tracking-widest">Starts at</div>
                      <div className="text-2xl font-black text-white">₹{parseInt(tour.price).toLocaleString('en-IN')}</div>
                    </div>
                    <Link to={`/tour/${tour.id}`} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white group-hover:bg-amber-400 group-hover:text-slate-900 transition-all duration-300">
                      <span className="material-symbols-outlined">arrow_outward</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Bharat Darshan ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-800">Why Bharat Darshan?</h2>
            <p className="text-slate-500 mt-2">We don't just plan trips. We create memories.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'tune', title: '100% Customizable', desc: 'Every package is tailored to your style, budget, and travel dates. No two trips are the same.' },
              { icon: 'verified_user', title: 'Verified Partners', desc: 'Hotels, guides, and transport are all pre-verified by our team for quality and safety.' },
              { icon: 'support_agent', title: '24/7 Support', desc: 'Our dedicated travel managers are available round-the-clock before, during & after your trip.' },
              { icon: 'price_check', title: 'Best Price Guarantee', desc: 'We offer the most competitive prices in the market. We\'ll match any lower quote you find.' },
              { icon: 'map', title: 'Expert Itineraries', desc: 'Curated by experienced travelers and locals who know these destinations inside out.' },
              { icon: 'eco', title: 'Responsible Tourism', desc: 'We partner with eco-friendly and community-based operators to support sustainable travel.' },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#eefaf9] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#0a6c75]">{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-[14px] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lead Capture ── */}
      <section id="get-quote" className="py-20" style={{ background: 'linear-gradient(135deg, #0a6c75 0%, #065f46 100%)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white">Plan Your Bharat Darshan Trip</h2>
            <p className="text-white/75 mt-2">Get a free, personalized quote in under 24 hours</p>
          </div>
          {!submitted ? (
            <form onSubmit={handleLeadSubmit} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-white font-bold text-[13px] mb-2">Your Name</label>
                  <input
                    required
                    type="text" placeholder="Rahul Kumar"
                    value={leadForm.name}
                    onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                    className="w-full bg-white/90 border-0 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-white text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-white font-bold text-[13px] mb-2">Phone Number</label>
                  <input
                    required
                    type="tel" placeholder="+91 98765 43210"
                    value={leadForm.phone}
                    onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                    className="w-full bg-white/90 border-0 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-white text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-white font-bold text-[13px] mb-2">Destination of Interest</label>
                  <select
                    value={leadForm.destination}
                    onChange={e => setLeadForm({ ...leadForm, destination: e.target.value })}
                    className="w-full bg-white/90 border-0 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-white text-[14px]"
                  >
                    <option value="">Select a destination</option>
                    {destinations.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    <option value="Not Sure">Not Sure Yet – Suggest Me!</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-white text-[#0a6c75] font-black text-[15px] rounded-xl hover:bg-teal-50 transition-colors shadow-xl">
                Get Free Quote →
              </button>
              <p className="text-white/60 text-[11px] text-center mt-3">No spam. Our travel expert will call you within 24 hours.</p>
            </form>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-white mb-4 block">check_circle</span>
              <h2 className="text-2xl font-black text-white mb-2">We got your request!</h2>
              <p className="text-white/80">Our travel expert will contact you within 24 hours with a personalized Bharat Darshan itinerary.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-800">Frequently Asked Questions</h2>
          <p className="text-slate-500 mt-2">Everything you need to know about Bharat Darshan trips</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center px-6 py-4 text-left"
              >
                <span className="font-bold text-slate-800 text-[15px]">{faq.q}</span>
                <span className="material-symbols-outlined text-[#0a6c75] ml-4 shrink-0">
                  {openFaq === idx ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 text-slate-600 text-[14px] leading-relaxed border-t border-slate-50 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default BharatDarshanPage;
