import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import {
  Calendar,
  Clock,
  User,
  Share2,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  MessageCircle,
  TrendingUp,
  MapPin,
  Smartphone,
  Facebook,
  Twitter,
  Instagram,
  Link as LinkIcon,
  ExternalLink,
  ChevronUp,
  Mail,
  CheckCircle,
  Copy,
  List,
  Sparkles,
  PhoneCall,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import QueryModal from '../components/QueryModal';

/* ─────────────────────────────────────────────
   Toast helper
───────────────────────────────────────────── */
const useToast = () => {
  const [toast, setToast] = useState(null);
  const show = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  return { toast, show };
};

const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-8 py-4 rounded-2xl shadow-2xl text-white text-sm font-bold uppercase tracking-widest animate-fade-up
        ${toast.type === 'success' ? 'bg-primary' : 'bg-slate-900'}`}
    >
      <CheckCircle size={18} />
      {toast.msg}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Extract h2 headings from HTML content for ToC
───────────────────────────────────────────── */
const extractHeadings = (html) => {
  if (!html) return [];
  const matches = [...html.matchAll(/<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/gi)];
  if (matches.length > 0) {
    return matches.map((m) => ({
      id: m[1],
      text: m[2].replace(/<[^>]*>/g, ''),
    }));
  }
  // Fallback: extract text without ids
  const fallback = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)];
  return fallback.map((m, i) => ({
    id: `section-${i}`,
    text: m[1].replace(/<[^>]*>/g, ''),
  }));
};

/* ─────────────────────────────────────────────
   Inject ids into h2 tags so ToC links work
───────────────────────────────────────────── */
const injectHeadingIds = (html) => {
  if (!html) return '';
  let counter = 0;
  return html.replace(/<h2([^>]*)>/gi, (match, attrs) => {
    if (/id="/i.test(attrs)) return match;
    const id = `section-${counter++}`;
    return `<h2${attrs} id="${id}">`;
  });
};

/* ─────────────────────────────────────────────
   Stable device fingerprint — no login required
───────────────────────────────────────────── */
const getOrCreateDeviceId = () => {
  const KEY = 'bi_device_id';
  let did = localStorage.getItem(KEY);
  if (!did) {
    did = 'dev-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
    localStorage.setItem(KEY, did);
  }
  return did;
};

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const SAVED_GUIDES_API = `${API_BASE}/api-saved-guides.php`;

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const GuideDetailView = () => {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [guides, setGuides] = useState([]);
  const [latestGuides, setLatestGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const { tours } = useData();
  const { toast, show: showToast } = useToast();
  const articleRef = useRef(null);

  /* ── Scroll listeners ── */
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);

      // Active ToC section
      const headings = document.querySelectorAll('.article-content h2[id]');
      let current = '';
      headings.forEach((el) => {
        if (window.scrollY >= el.offsetTop - 140) {
          current = el.id;
        }
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Fetch guide data ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.BASE_URL}data/guides.json?t=${Date.now()}`);
        const globalData = await res.json();
        setGuides(globalData);

        const found = globalData.find(
          (g) => String(g.id) === String(id) || g.slug === id
        );

        const isPreview = window.location.search.includes('preview=true');
        if (found && found.status === 'draft' && !isPreview) {
          setGuide(null);
        } else {
          setGuide(found);
        }

        const publishedOnly = globalData.filter((g) => g.status !== 'draft');
        const sorted = [...publishedOnly].sort(
          (a, b) => new Date(b.date || '') - new Date(a.date || '')
        );
        setLatestGuides(sorted.slice(0, 3));
      } catch (error) {
        console.error('Error loading guide:', error);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };
    fetchData();
  }, [id]);

  /* ── Bookmark state: localStorage (instant) + server sync ── */
  useEffect(() => {
    if (!id) return;
    // 1. Immediate: check localStorage so UI is instant
    const localSaved = JSON.parse(localStorage.getItem('savedGuides') || '[]');
    setIsSaved(localSaved.includes(id));

    // 2. Background: authoritative sync from server
    const deviceId = getOrCreateDeviceId();
    fetch(`${SAVED_GUIDES_API}?deviceId=${encodeURIComponent(deviceId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.saved) {
          // Merge server list into localStorage
          localStorage.setItem('savedGuides', JSON.stringify(data.saved));
          setIsSaved(data.saved.includes(id));
        }
      })
      .catch(() => { /* silently fall back to localStorage */ });
  }, [id]);

  /* ─────────────── Loading / Not-found states ─────────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl text-center max-w-lg border border-slate-100 dark:border-slate-800">
          <h1 className="text-5xl font-serif font-black text-slate-900 dark:text-white mb-6">
            Lost in the Clouds?
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg leading-relaxed">
            The travel guide you're seeking has wandered off the map. Let's get you back on track.
          </p>
          <Link
            to="/guides"
            className="bg-primary text-white px-10 py-5 rounded-2xl font-black hover:bg-primary-dark transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 uppercase tracking-widest text-sm"
          >
            <ArrowLeft size={20} /> Explore All Guides
          </Link>
        </div>
      </div>
    );
  }

  /* ─────────────── Helpers ─────────────── */
  const gDest = (guide.destination || '').toLowerCase();
  const gCat = (guide.category || '').toLowerCase();

  let relatedTours = (tours || []).filter((t) => {
    const tTitle = (t.title || '').toLowerCase();
    const tDest = Array.isArray(t.destination)
      ? t.destination.join(' ').toLowerCase()
      : (t.destination || '').toLowerCase();
    const tTheme = (t.theme || '').toLowerCase();
    return (
      (gDest && (tTitle.includes(gDest) || tDest.includes(gDest))) ||
      (gCat && (tTheme.includes(gCat) || tTitle.includes(gCat)))
    );
  });

  // If we don't have exactly 3 related tours, fill the rest with random active tours
  if (relatedTours.length < 3) {
    const relatedIds = new Set(relatedTours.map(t => t.id || t.slug));
    const remainingCount = 3 - relatedTours.length;
    
    const otherActiveTours = tours.filter(t => 
      t.status === 'active' && !relatedIds.has(t.id || t.slug)
    );
    
    // Shuffle the other tours
    const shuffledOthers = [...otherActiveTours].sort(() => 0.5 - Math.random());
    relatedTours = [...relatedTours, ...shuffledOthers.slice(0, remainingCount)];
  }

  // Ensure we only ever show a maximum of 3
  relatedTours = relatedTours.slice(0, 3);

  const calculateReadTime = (content) => {
    if (!content) return 0;
    const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  const formatContent = (content) => {
    if (!content) return '';
    if (/<(p|div|h[1-6]|ul|ol|li|blockquote|section|article)/i.test(content)) {
      return injectHeadingIds(content);
    }
    const html = content
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
    return injectHeadingIds(html);
  };

  const processedContent = formatContent(guide.content);
  const tocHeadings = extractHeadings(processedContent);
  const dynamicReadTime = calculateReadTime(guide.content);
  const pageUrl = window.location.href;
  const shareTitle = encodeURIComponent(guide.title || '');

  /* ─────────────── Action handlers ─────────────── */
  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(pageUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleShareReddit = () => {
    window.open(
      `https://www.reddit.com/submit?url=${encodeURIComponent(pageUrl)}&title=${shareTitle}`,
      '_blank',
      'width=600,height=600'
    );
  };

  const handleSharePlurk = () => {
    window.open(
      `https://www.plurk.com/?qualifier=shares&content=${encodeURIComponent(pageUrl)}%20(${shareTitle})`,
      '_blank',
      'width=600,height=600'
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      showToast('Link copied to clipboard!');
    } catch {
      showToast('Could not copy link', 'error');
    }
  };

  const handleBookmark = async () => {
    const action = isSaved ? 'remove' : 'save';
    const nextSaved = !isSaved;

    // 1. Optimistic UI update
    setIsSaved(nextSaved);
    const localSaved = JSON.parse(localStorage.getItem('savedGuides') || '[]');
    const updatedLocal = action === 'save'
      ? [...new Set([...localSaved, id])]
      : localSaved.filter((s) => s !== id);
    localStorage.setItem('savedGuides', JSON.stringify(updatedLocal));
    showToast(nextSaved ? 'Guide saved!' : 'Removed from saved guides');

    // 2. Persist to server
    const deviceId = getOrCreateDeviceId();
    try {
      const res = await fetch(SAVED_GUIDES_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, slug: id, action }),
      });
      const data = await res.json();
      if (data?.saved) {
        // Keep localStorage in sync with server truth
        localStorage.setItem('savedGuides', JSON.stringify(data.saved));
      }
    } catch {
      // Server unavailable — localStorage already updated as fallback
      console.warn('[Bookmark] Server sync failed, using localStorage only');
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    showToast("You're subscribed! Welcome aboard 🎉");
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
      setTocOpen(false);
    }
  };

  /* ─────────────── Share icons map ─────────────── */
  const shareButtons = [
    { Icon: Facebook, label: 'Facebook', action: handleShareFacebook },
    { Icon: Twitter, label: 'Twitter', action: handleShareTwitter },
    { Icon: (props) => (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 13h4M2.5 17h4M2.5 9h4M10 5.5V11c0 .5.5 1 1 1h9c.5 0 1-.5 1-1V5.5c0-.5-.5-1-1-1h-9c-.5 0-1 .5-1 1zM10 13v5.5c0 .5.5 1 1 1h9c.5 0 1-.5 1-1V13c0-.5-.5-1-1-1h-9c-.5 0-1 .5-1 1z" />
      </svg>
    ), label: 'Plurk', action: handleSharePlurk },
    { Icon: (props) => (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M17 12h-5M12 17v-5M12 7v5M7 12h5"/>
      </svg>
    ), label: 'Reddit', action: handleShareReddit },
    { Icon: LinkIcon, label: 'Copy link', action: handleCopyLink },
  ];

  /* ═══════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════ */
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-500 overflow-x-hidden">
      <SEO 
        title={guide.seoTitle || guide.title}
        description={guide.metaDescription || guide.description || guide.title}
        image={guide.image}
        url={pageUrl}
        schema={guide.schemaSnippet}
      />

      {/* Scroll Progress Bar */}
      <div className="scroll-progress"></div>

      {/* Toast */}
      <Toast toast={toast} />

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed bottom-8 right-8 z-[100] p-4 bg-primary text-white rounded-2xl shadow-2xl transition-all duration-500 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'} hover:scale-110 active:scale-90`}
      >
        <ChevronUp size={24} />
      </button>

      {/* ── Hero ── */}
      <header className="relative w-full h-[65vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={guide.image}
            alt={guide.title}
            fetchpriority="high"
            className="w-full h-full object-cover animate-zoom-in"
            style={{
              objectPosition: `${guide.imagePositionX || 50}% ${guide.imagePositionY || 50}%`,
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent hidden lg:block"></div>

        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20 xl:px-32 pt-20 pb-12 max-w-screen-2xl mx-auto w-full">
          <div className="animate-fade-up">
            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="bg-primary/90 text-white text-[10px] font-black px-5 py-2 rounded-xl uppercase tracking-[0.2em] backdrop-blur-xl border border-white/20">
                {guide.category || 'Travel'}
              </span>
              <span className="bg-white/10 text-white text-[10px] font-bold px-5 py-2 rounded-xl uppercase tracking-[0.2em] backdrop-blur-xl border border-white/20 flex items-center gap-2">
                <Clock size={12} />
                {dynamicReadTime > 0 ? `${dynamicReadTime} min read` : '5 min read'}
              </span>
              {guide.destination && (
                <span className="bg-white/10 text-white text-[10px] font-bold px-5 py-2 rounded-xl uppercase tracking-[0.2em] backdrop-blur-xl border border-white/20 flex items-center gap-2">
                  <MapPin size={12} />
                  {guide.destination}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-white text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-black leading-[1.05] mb-10 drop-shadow-2xl max-w-5xl tracking-tighter">
              {guide.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-6 md:gap-8">
              {/* Author */}
              <div className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-2xl border-2 border-primary p-0.5 overflow-hidden shadow-2xl">
                  <img
                    src={guide.authorImg || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'}
                    alt={guide.author || 'Travel Expert'}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div>
                  <p className="text-white font-serif italic text-lg leading-none mb-1">
                    {guide.author || 'Travel Expert'}
                  </p>
                  <p className="text-slate-400 text-[10px] flex items-center gap-2 uppercase font-black tracking-widest">
                    <Calendar size={11} className="text-primary" />
                    {guide.date || 'March 2026'}
                  </p>
                </div>
              </div>

              {/* Share buttons in hero */}
              <div className="ml-auto hidden sm:flex items-center gap-3">
                {shareButtons.map(({ Icon, label, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    aria-label={label}
                    title={label}
                    className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-primary hover:scale-110 transition-all"
                  >
                    <Icon size={16} />
                  </button>
                ))}
              </div>

              {/* Scroll hint */}
              <button
                onClick={() => document.querySelector('main').scrollIntoView({ behavior: 'smooth' })}
                className="hidden lg:flex items-center gap-3 opacity-60 hover:opacity-100 transition-all hover:translate-y-2 cursor-pointer group/scroll"
              >
                <p className="text-white text-[10px] uppercase font-black tracking-widest group-hover/scroll:text-primary transition-colors">
                  Scroll to Begin
                </p>
                <div className="w-px h-10 bg-gradient-to-b from-white to-transparent group-hover/scroll:from-primary"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile ToC toggle ── */}
      {tocHeadings.length > 0 && (
        <div className="xl:hidden bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-black text-xs uppercase tracking-widest w-full"
          >
            <List size={16} className="text-primary" />
            Contents
            <ChevronUp
              size={16}
              className={`ml-auto text-slate-400 transition-transform ${tocOpen ? '' : 'rotate-180'}`}
            />
          </button>
          {tocOpen && (
            <nav className="mt-4 space-y-2 animate-fade-up">
              {tocHeadings.map((h) => (
                <button
                  key={h.id}
                  onClick={() => scrollToSection(h.id)}
                  className={`block w-full text-left text-sm py-2 px-4 rounded-xl transition-all
                    ${activeSection === h.id
                      ? 'bg-primary text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5'
                    }`}
                >
                  {h.text}
                </button>
              ))}
            </nav>
          )}
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-10 py-12 lg:py-20 grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-10 relative">

        {/* Left: Desktop Social Float */}
        <div className="hidden xl:flex xl:col-span-1 flex-col items-center pt-2">
          <div className="sticky top-32 flex flex-col items-center gap-4">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest rotate-180 [writing-mode:vertical-lr] mb-2">
              Share Story
            </span>
            {shareButtons.map(({ Icon, label, action }) => (
              <button
                key={label}
                onClick={action}
                aria-label={label}
                title={label}
                className="w-11 h-11 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:bg-primary hover:text-white hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
              >
                <Icon size={18} />
              </button>
            ))}
            {/* Bookmark */}
            <button
              onClick={handleBookmark}
              aria-label="Save guide"
              title={isSaved ? 'Remove bookmark' : 'Save for later'}
              className={`mt-2 w-11 h-11 rounded-2xl flex items-center justify-center border transition-all cursor-pointer
                ${isSaved
                  ? 'bg-primary text-white border-primary shadow-xl'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:bg-primary hover:text-white hover:shadow-xl'
                }`}
            >
              {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          </div>
        </div>

        {/* Center: Article Body */}
        <article className="xl:col-span-8 min-w-0" ref={articleRef}>
          <div
            className="article-content animate-fade-up"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />

          {/* Mobile share + bookmark row */}
          <div className="xl:hidden mt-16 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-3 font-serif text-lg font-bold transition-colors ${isSaved ? 'text-primary' : 'text-slate-700 dark:text-white'}`}
            >
              {isSaved ? <BookmarkCheck size={22} className="text-primary" /> : <Bookmark size={22} />}
              {isSaved ? 'Guide Saved' : 'Save for later'}
            </button>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Share:</span>
              {shareButtons.map(({ Icon, label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  aria-label={label}
                  className="w-11 h-11 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500 hover:bg-primary hover:text-white transition-all"
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Mid-article Partner Spotlight */}
          <div className="my-20 glass-card rounded-[2.5rem] p-10 md:p-14 text-center relative overflow-hidden group border border-slate-100 dark:border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150 pointer-events-none"></div>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black mb-5">Partner Spotlight</p>
            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Explore curated local experiences — handpicked by our destination experts just for this guide.
            </p>
            <button
              onClick={() => setIsQueryModalOpen(true)}
              className="inline-flex items-center gap-3 bg-primary text-white font-black px-10 py-4 rounded-2xl shadow-xl hover:bg-primary-dark hover:scale-[1.03] active:scale-95 transition-all uppercase tracking-widest text-[10px]"
            >
              <Sparkles size={16} />
              Explore Local Experiences
            </button>
          </div>
        </article>

        {/* Right: Sidebar */}
        <aside className="xl:col-span-3 min-w-0">
          <div className="sticky top-28 space-y-8">

            {/* Expert Advice CTA */}
            <div className="bg-slate-900 dark:bg-slate-900/80 rounded-[2.5rem] p-10 text-white shadow-[0_40px_100px_-20px_rgba(13,148,136,0.25)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/20 group-hover:rotate-6 transition-transform">
                  <TrendingUp size={28} className="text-primary" />
                </div>
                <h3 className="text-3xl font-serif font-black mb-6 leading-[1.15] tracking-tight">
                  Plan your{' '}
                  <span className="text-primary italic border-b-2 border-primary/30">dream trip</span>{' '}
                  with us.
                </h3>
                <p className="text-slate-400 text-base mb-8 leading-relaxed">
                  Our destination experts can craft a personalized itinerary based on this guide.
                </p>
                <button
                  onClick={() => setIsQueryModalOpen(true)}
                  className="w-full bg-primary text-white font-black py-5 rounded-[1.5rem] hover:bg-white hover:text-slate-900 transition-all shadow-2xl uppercase tracking-[0.2em] text-[10px] active:scale-95 group-hover:-translate-y-1"
                >
                  Let's Start Planning
                </button>
              </div>
            </div>

            {/* Table of Contents (desktop) */}
            {tocHeadings.length > 0 && (
              <div className="glass-card rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                  <List size={18} className="text-primary" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-widest">
                    Contents
                  </h3>
                </div>
                <nav className="flex flex-col gap-1">
                  {tocHeadings.map((h, i) => (
                    <button
                      key={h.id}
                      onClick={() => scrollToSection(h.id)}
                      className={`flex items-start gap-3 w-full text-left py-1.5 px-4 rounded-xl text-sm transition-all group/toc
                        ${activeSection === h.id
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary/5'
                        }`}
                    >
                      <span className={`text-[10px] font-black mt-0.5 flex-shrink-0 ${activeSection === h.id ? 'text-primary' : 'text-slate-300 dark:text-slate-700'}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="leading-snug">{h.text}</span>
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* Editorial Picks */}
            <div className="glass-card rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-serif font-black text-slate-900 dark:text-white">
                  Editorial Picks
                </h3>
              </div>
              <div className="space-y-7">
                {latestGuides.map((lg) => (
                  <Link
                    key={lg.id}
                    to={`/guides/${lg.slug || lg.id}`}
                    className="flex gap-5 group"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg border-2 border-white dark:border-slate-800 transition-transform duration-500 group-hover:-rotate-2">
                      <img
                        src={lg.image}
                        alt={lg.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <p className="text-primary text-[9px] uppercase font-black tracking-widest mb-1">
                        {lg.category || 'Travel'}
                      </p>
                      <h4 className="font-serif font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                        {lg.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                to="/guides"
                className="mt-8 w-full flex items-center justify-center py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors border-t border-slate-100 dark:border-slate-800 gap-2"
              >
                View Directory <ArrowLeft className="rotate-180" size={13} />
              </Link>
            </div>

            {/* Mini CTA – replaces dead ad placeholder */}
            <div className="rounded-[2rem] overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 p-8 text-center">
              <PhoneCall size={32} className="text-primary mx-auto mb-4 opacity-80" />
              <p className="text-slate-900 dark:text-white font-serif font-bold text-lg mb-2 leading-snug">
                Have Questions?
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                Talk to a travel specialist about this destination.
              </p>
              <button
                onClick={() => setIsQueryModalOpen(true)}
                className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white font-black py-3.5 rounded-xl transition-all text-[10px] uppercase tracking-widest active:scale-95 border border-primary/30 hover:border-primary"
              >
                Ask an Expert
              </button>
            </div>

            {/* Social Links Block */}
            <div className="glass-card rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">
                Connect with Us
              </h3>
              <div className="flex flex-wrap gap-4">
                <a href="https://www.facebook.com/honeymoon.package/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#3b5998] flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="Honeymoon Packages">
                  <Facebook size={18} className="text-white" />
                </a>
                <a href="https://www.facebook.com/TouristDestinationsofIndia" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#3b5998] flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="Tourist Destinations">
                  <Facebook size={18} className="text-white" />
                </a>
                <a href="https://www.instagram.com/holidaydestinations9/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                  <Instagram size={18} className="text-white" />
                </a>
                <a href="https://www.reddit.com/r/holidaydestination/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#ff4500] flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M24 11.5c0-1.654-1.346-3-3-3-.674 0-1.296.226-1.802.603-2.181-1.503-5.111-2.457-8.384-2.58l1.735-5.432 4.764 1.041c.044.872.766 1.568 1.649 1.568 1.01 0 1.832-.821 1.832-1.832s-.822-1.832-1.832-1.832c-.803 0-1.48.518-1.72 1.233l-5.234-1.144c-.23-.051-.458.082-.531.31l-1.954 6.114c-3.353.078-6.386 1.026-8.636 2.56-.505-.386-1.14-.622-1.828-.622-1.654 0-3 1.346-3 3 0 1.135.635 2.119 1.572 2.628-.024.122-.037.245-.037.372 0 3.309 4.029 6 9 6s9-2.691 9-6c0-.124-.013-.245-.036-.364.95-.503 1.598-1.5 1.598-2.636zm-18.067 2.132c.738 0 1.334.597 1.334 1.334s-.596 1.334-1.334 1.334-1.334-.597-1.334-1.334.596-1.334 1.334-1.334zm10.741 4.562c-1.144 1.144-3.084 1.654-4.674 1.654-1.591 0-3.531-.51-4.674-1.654-.195-.195-.195-.512 0-.707.196-.195.513-.195.708 0 .86.86 2.522 1.278 3.966 1.278 1.444 0 3.106-.418 3.966-1.278.195-.195.512-.195.707 0 .196.195.196.512 0 .707zm-1.008-3.228c-.738 0-1.334-.597-1.334-1.334s.596-1.334 1.334-1.334 1.334.597 1.334 1.334-.596 1.334-1.334 1.334z"/></svg>
                </a>
                <a href="https://www.plurk.com/HolidayDestinations" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#cf4732] flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.75 16.5h-9.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h9.5c.414 0 .75.336.75.75s-.336.75-.75.75zm0-3h-9.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h9.5c.414 0 .75.336.75.75s-.336.75-.75.75zm0-3h-9.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h9.5c.414 0 .75.336.75.75s-.336.75-.75.75z"/></svg>
                </a>
              </div>
            </div>

          </div>
        </aside>
      </main>

      {/* ── Related Tours ── */}
      {relatedTours.length > 0 && (
        <section className="bg-slate-50 dark:bg-slate-900/20 py-28 px-6 overflow-hidden">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
              <div className="animate-fade-up">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">
                  Curated Experiences
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-slate-900 dark:text-white tracking-tighter">
                  Explore Beyond{' '}
                  <span className="text-primary italic">the Guide.</span>
                </h2>
              </div>
              <Link
                to="/tours"
                className="flex items-center gap-3 text-slate-400 hover:text-primary font-black transition-all uppercase tracking-widest text-xs group"
              >
                Discover All Tours{' '}
                <div className="p-2 rounded-full border border-slate-200 dark:border-slate-800 group-hover:bg-primary group-hover:text-white transition-all">
                  <ArrowLeft className="rotate-180" size={16} />
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedTours.map((tour, idx) => (
                <Link
                  key={tour.id}
                  to={`/tours/${tour.slug || tour.id}`}
                  className="group flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-700 hover:-translate-y-3"
                  style={{ transitionDelay: `${idx * 80}ms` }}
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    />
                    <div className="absolute top-5 left-5">
                      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl px-4 py-2 rounded-xl shadow-xl">
                        <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">
                          {tour.duration}
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-3">
                      {tour.theme || 'Premium Tour'}
                    </p>
                    <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-5 group-hover:text-primary transition-colors leading-snug">
                      {tour.title}
                    </h3>
                    <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Price per person
                        </p>
                        <p className="text-xl font-black text-slate-900 dark:text-white">
                          ₹{tour.price || 'TBA'}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white group-hover:bg-primary group-hover:text-white group-hover:rotate-12 transition-all duration-500">
                        <ArrowLeft className="rotate-180" size={22} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Newsletter ── */}
      <section className="bg-white dark:bg-slate-950 py-28 px-6 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-3xl mx-auto glass-card rounded-[3rem] p-10 md:p-20 text-center relative z-10 border border-slate-100 dark:border-slate-800">
          {subscribed ? (
            <div className="animate-fade-up py-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle size={40} className="text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
                You're in!
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                Welcome to the community. Expect hand-picked stories every week.
              </p>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-[1.5rem] flex items-center justify-center mx-auto mb-10 shadow-xl rotate-6 hover:rotate-12 transition-transform duration-500">
                <Mail size={40} />
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
                Travel{' '}
                <span className="text-primary italic">Inside Out.</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
                Join our community of 50,000+ explorers and receive hand-picked guides and exclusive offers every week.
              </p>

              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto p-2.5 bg-slate-50 dark:bg-slate-900 backdrop-blur-xl rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  aria-label="Email address"
                  className="flex-1 px-6 py-4 bg-transparent outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400 placeholder:text-sm placeholder:font-normal text-sm"
                />
                <button
                  type="submit"
                  className="bg-slate-900 dark:bg-primary text-white font-black px-10 py-4 rounded-[1.5rem] shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.2em] text-[10px] whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
              <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                No spam. Just pure adventure.
              </p>
            </>
          )}
        </div>
      </section>

      {/* ── Sticky Mobile CTA ── */}
      <div className="fixed bottom-0 left-0 w-full p-4 xl:hidden z-[90] pointer-events-none">
        <button
          onClick={() => setIsQueryModalOpen(true)}
          className="pointer-events-auto w-full bg-slate-950 dark:bg-primary text-white font-black py-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex items-center justify-center gap-3 active:scale-95 transition-all text-xs uppercase tracking-[0.2em] border border-white/10"
        >
          <PhoneCall size={18} />
          Plan this Journey
        </button>
      </div>

      {/* Query Modal */}
      <QueryModal
        isOpen={isQueryModalOpen}
        onClose={() => setIsQueryModalOpen(false)}
        topic={guide.title}
        source="Travel Guide"
      />
    </div>
  );
};

export default GuideDetailView;
