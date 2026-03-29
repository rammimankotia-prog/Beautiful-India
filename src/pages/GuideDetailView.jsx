
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  ArrowLeft, 
  Bookmark, 
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
  Mail
} from 'lucide-react';
import { useData } from '../context/DataContext';
import QueryModal from '../components/QueryModal';

const GuideDetailView = () => {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [guides, setGuides] = useState([]);
  const [latestGuides, setLatestGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { tours } = useData();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.BASE_URL}data/guides.json?t=${Date.now()}`);
        const globalData = await res.json();
        
        setGuides(globalData);
        
        const found = globalData.find(g => String(g.id) === String(id) || g.slug === id);
        
        const isPreview = window.location.search.includes('preview=true');
        if (found && found.status === 'draft' && !isPreview) {
          setGuide(null);
        } else {
          setGuide(found);
        }

        const publishedOnly = globalData.filter(g => g.status !== 'draft');
        const sorted = [...publishedOnly].sort((a, b) => new Date(b.date || '') - new Date(a.date || ''));
        setLatestGuides(sorted.slice(0, 3));
      } catch (error) {
        console.error("Error loading guide:", error);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };

    fetchData();
  }, [id]);

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
          <h1 className="text-5xl font-serif font-black text-slate-900 dark:text-white mb-6">Lost in the Clouds?</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg leading-relaxed">The travel guide you're seeking has wandered off the map. Let's get you back on track.</p>
          <Link to="/guides" className="bg-primary text-white px-10 py-5 rounded-2xl font-black hover:bg-primary-dark transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 uppercase tracking-widest text-sm">
            <ArrowLeft size={20} /> Explore All Guides
          </Link>
        </div>
      </div>
    );
  }

  const relatedTours = tours
    .filter(t => {
      const gTitle = (guide.title || '').toLowerCase();
      const gDest = (guide.destination || '').toLowerCase();
      const gCat = (guide.category || '').toLowerCase();
      
      const tTitle = (t.title || '').toLowerCase();
      const tDest = Array.isArray(t.destination) ? t.destination.join(' ').toLowerCase() : (t.destination || '').toLowerCase();
      const tTheme = (t.theme || '').toLowerCase();
      
      return tTitle.includes(gDest) || tDest.includes(gDest) || tTheme.includes(gCat) || tTitle.includes(gCat);
    })
    .slice(0, 3);

  const calculateReadTime = (content) => {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const plainText = content.replace(/<[^>]*>/g, ''); // Basic HTML strip
    const words = plainText.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const formatContent = (content) => {
    if (!content) return "";
    
    // If it's already HTML, just return it
    if (/<(p|div|h[1-6]|ul|ol|li|blockquote|section|article)/i.test(content)) {
      return content;
    }

    // Otherwise, do basic formatting
    return content
      .split(/\n\s*\n/)
      .map(para => {
        let text = para.trim();
        if (!text) return "";
        
        // Basic Markdown-like support for bold/italic if it's plain text
        text = text
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\n/g, '<br />');

        // Handle blockquotes started with >
        if (text.startsWith('>')) {
          return `<blockquote>${text.substring(1).trim()}</blockquote>`;
        }
        
        return `<p>${text}</p>`;
      })
      .join('');
  };

  const dynamicReadTime = calculateReadTime(guide.content);


  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-500 overflow-x-hidden">
      <Helmet>
        <title>{guide.seoTitle || `${guide.title} | The Beautiful India`}</title>
        <meta name="description" content={guide.metaDescription || guide.description || guide.title} />
        <meta property="og:title" content={guide.seoTitle || guide.title} />
        <meta property="og:image" content={guide.image} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Scroll Progress Bar */}
      <div className="scroll-progress"></div>

      {/* Back to Top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 z-[100] p-4 bg-primary text-white rounded-2xl shadow-2xl transition-all duration-500 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'} hover:scale-110 active:scale-90`}
      >
        <ChevronUp size={24} />
      </button>

      {/* Hero Section */}
      <header className="relative w-full h-[85vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img 
            src={guide.image} 
            alt={guide.title}
            className="w-full h-full object-cover animate-zoom-in"
            style={{ 
              objectPosition: `${guide.imagePositionX || 50}% ${guide.imagePositionY || 50}%` 
            }}
          />
        </div>

        {/* Dynamic Mask Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent hidden lg:block"></div>
        
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 lg:px-20 xl:px-32 pb-20 max-w-screen-2xl mx-auto w-full">
          <div className="animate-fade-up">
            <div className="flex flex-wrap gap-4 mb-8">
              <span className="bg-primary/90 text-white text-[10px] font-black px-5 py-2 rounded-xl uppercase tracking-[0.2em] backdrop-blur-xl border border-white/20">
                {guide.category || 'Travel'}
              </span>
              <span className="bg-white/10 text-white text-[10px] font-bold px-5 py-2 rounded-xl uppercase tracking-[0.2em] backdrop-blur-xl border border-white/20 whitespace-nowrap">
                {dynamicReadTime > 0 ? `${dynamicReadTime} min read` : '5 min read'}
              </span>
            </div>
            
            <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-serif font-black leading-[1.05] mb-10 drop-shadow-2xl max-w-5xl tracking-tighter">
              {guide.title}
            </h1>
            
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4 group">
                <div className="w-16 h-16 rounded-3xl border-2 border-primary p-1 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:rotate-6">
                  <img 
                    src={guide.authorImg || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"} 
                    alt={guide.author || "Travel Expert"}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div>
                  <p className="text-white font-serif italic text-xl leading-none mb-2">{guide.author || "Travel Expert"}</p>
                  <p className="text-slate-400 text-xs flex items-center gap-2 uppercase font-black tracking-widest">
                    <Calendar size={14} className="text-primary" /> {guide.date || "March 2026"}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => document.querySelector('main').scrollIntoView({ behavior: 'smooth' })}
                className="hidden sm:flex items-center gap-3 ml-auto opacity-60 hover:opacity-100 transition-all hover:translate-y-2 cursor-pointer group/scroll"
              >
                <p className="text-white text-[10px] uppercase font-black tracking-widest group-hover/scroll:text-primary transition-colors">Scroll to Begin</p>
                <div className="w-px h-12 bg-gradient-to-b from-white to-transparent group-hover/scroll:from-primary"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20 xl:px-32 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative">
          
        {/* Left Column: Social Floating (Desktop only) */}
        <div className="hidden xl:block xl:col-span-1">
          <div className="sticky top-32 flex flex-col gap-4">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest rotate-180 [writing-mode:vertical-lr] mb-4">Share Story</span>
             {[Facebook, Twitter, Instagram, LinkIcon].map((Icon, i) => (
                <button key={i} className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:bg-primary hover:text-white hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                  <Icon size={20} />
                </button>
             ))}
          </div>
        </div>

        {/* Article Body */}
        <article className="lg:col-span-11 xl:col-span-7 2xl:col-span-8">
          <div 
            className="article-content max-w-none animate-fade-up"
            dangerouslySetInnerHTML={{ __html: formatContent(guide.content) }} 
          />

          {/* Social Share (Mobile/Tablet) */}
          <div className="xl:hidden mt-20 pt-12 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-10">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Bookmark size={20} />
               </div>
               <span className="font-serif text-xl font-bold dark:text-white">Save for later</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Share Article:</span>
              <div className="flex gap-3">
                {[Facebook, Twitter, Instagram, LinkIcon].map((Icon, i) => (
                  <button key={i} className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500 hover:bg-primary hover:text-white transition-all">
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ad Space Mid Article */}
          <div className="my-24 glass-card rounded-[3rem] p-12 text-center relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150"></div>
             <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black mb-6">Partner Spotlight</p>
             <div className="min-h-[200px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl group-hover:border-primary/30 transition-colors">
                <ExternalLink size={40} className="text-slate-300 dark:text-slate-700 mb-4" />
                <span className="text-slate-400 italic font-medium uppercase tracking-widest text-xs">Curated Local Experiences</span>
             </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-11 xl:col-span-4 2xl:col-span-3 space-y-16">
          
          {/* Expert Advice Card */}
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/40 to-secondary/40 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/20 group-hover:rotate-6 transition-transform">
                <TrendingUp size={32} className="text-white" />
              </div>
              <h3 className="text-3xl font-serif font-black mb-6 leading-tight">Plan your <span className="text-primary italic">dream trip</span> with us.</h3>
              <p className="text-slate-300 font-medium mb-10 leading-relaxed text-lg">Our destination experts can craft a personalized itinerary based on this guide.</p>
              <button 
                onClick={() => setIsQueryModalOpen(true)}
                className="w-full bg-white text-slate-900 font-black py-5 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-2xl uppercase tracking-widest text-sm translate-y-0 active:scale-95 group-hover:-translate-y-1"
              >
                Let's Start Planning
              </button>
            </div>
          </div>

          {/* Latest Articles Widget */}
          <div className="glass-card rounded-[3rem] p-10">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-serif font-black text-slate-900 dark:text-white">Editorial Picks</h3>
              <div className="w-10 h-1bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            </div>
            <div className="space-y-10">
              {latestGuides.map(lg => (
                <Link key={lg.id} to={`/guides/${lg.id}`} className="flex gap-6 group">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl border-4 border-white dark:border-slate-800 transition-transform duration-500 group-hover:-rotate-3">
                    <img src={lg.image} alt={lg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-primary text-[9px] uppercase font-black tracking-widest mb-2">{lg.category || 'Travel'}</p>
                    <h4 className="font-serif font-bold text-slate-900 dark:text-white text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {lg.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/guides" className="mt-12 w-full flex items-center justify-center py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors border-t border-slate-100 dark:border-slate-800 gap-2">
               View Directory <ArrowLeft className="rotate-180" size={14} />
            </Link>
          </div>

          {/* Sticky Sidebar Ad Placeholder */}
          <div className="sticky top-32">
             <div className="glass-card rounded-[2rem] p-8 border-dashed border-2 border-slate-200 dark:border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-6">Sponsor Message</p>
                <div className="h-[450px] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950/40 rounded-2xl">
                   <Smartphone size={32} className="text-slate-300 dark:text-slate-800 mb-4 opacity-50" />
                   <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Premium Ad Placement</span>
                </div>
             </div>
          </div>
        </aside>
      </main>

      {/* Related Tours Section */}
      {relatedTours.length > 0 && (
        <section className="bg-slate-50 dark:bg-slate-900/20 py-32 px-6 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div className="animate-fade-up">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">Curated Experiences</p>
                  <h2 className="text-5xl md:text-6xl font-serif font-black text-slate-900 dark:text-white tracking-tighter">Explore Beyond <span className="text-primary italic">the Guide.</span></h2>
                </div>
                <Link to="/tours" className="flex items-center gap-3 text-slate-400 hover:text-primary font-black transition-all uppercase tracking-widest text-xs group">
                  Discover All Tours <div className="p-2 rounded-full border border-slate-200 dark:border-slate-800 group-hover:bg-primary group-hover:text-white transition-all"><ArrowLeft className="rotate-180" size={16} /></div>
                </Link>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {relatedTours.map((tour, idx) => (
                 <Link 
                   key={tour.id} 
                   to={`/tours/${tour.slug || tour.id}`} 
                   className="group flex flex-col bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-xl hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-700 hover:-translate-y-3"
                   style={{ transitionDelay: `${idx * 100}ms` }}
                 >
                    <div className="relative h-80 overflow-hidden">
                      <img src={tour.image} alt={tour.title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                      <div className="absolute top-6 left-6 flex gap-2">
                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl px-4 py-2 rounded-xl shadow-2xl border border-white/20">
                          <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{tour.duration}</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    </div>
                    <div className="p-10 flex flex-col flex-1">
                      <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-4">{tour.theme || 'Premium Tour'}</p>
                      <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-6 group-hover:text-primary transition-colors leading-snug">{tour.title}</h3>
                      
                      <div className="mt-auto pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Price per person</p>
                          <p className="text-2xl font-black text-slate-900 dark:text-white">₹{tour.price || 'TBA'}</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white group-hover:bg-primary group-hover:text-white group-hover:rotate-12 transition-all duration-500 shadow-inner">
                          <ArrowLeft className="rotate-180" size={24} />
                        </div>
                      </div>
                    </div>
                 </Link>
               ))}
             </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="bg-white dark:bg-slate-950 py-32 px-6 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]"></div>
        
        <div className="max-w-5xl mx-auto glass-card rounded-[4rem] p-12 md:p-24 text-center relative z-10">
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-12 shadow-2xl rotate-6 transition-transform hover:rotate-12 duration-500">
            <Mail size={48} />
          </div>
          <h2 className="text-5xl md:text-7xl font-serif font-black text-slate-900 dark:text-white mb-8 tracking-tighter">Travel <span className="text-primary italic">Inside Out.</span></h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">Join our community of 50,000+ explorers and receive hand-picked guides and exclusive offers every week.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto p-2 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
            <input 
              type="email" 
              placeholder="Email address" 
              className="flex-1 px-8 py-5 bg-transparent outline-none text-slate-900 dark:text-white font-bold placeholder:text-slate-400 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
            />
            <button className="bg-slate-900 dark:bg-primary text-white font-black px-10 py-5 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs">
              Subscribe
            </button>
          </div>
          <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest">NO SPAM. JUST PURE ADVENTURE.</p>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 w-full p-6 lg:hidden z-[90] animate-in slide-in-from-bottom duration-700 delay-1000">
        <button 
          onClick={() => setIsQueryModalOpen(true)}
          className="w-full bg-slate-950 dark:bg-primary text-white font-black py-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center gap-4 active:scale-95 transition-all text-xs uppercase tracking-[0.2em] border border-white/10"
        >
          <Smartphone size={18} />
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
