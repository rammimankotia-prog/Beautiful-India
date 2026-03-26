
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
  Facebook,
  Twitter,
  Instagram,
  Link as LinkIcon,
  ExternalLink
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
  const { tours } = useData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch system guides
        const res = await fetch(`${import.meta.env.BASE_URL}data/guides.json`);
        const globalData = await res.json();
        
        // Load local articles from admin
        let localGuides = [];
        const saved = localStorage.getItem('beautifulindia_admin_guides');
        if (saved) {
          try { localGuides = JSON.parse(saved); } catch (e) { console.error(e); }
        }

        const combined = [...globalData, ...localGuides];
        setGuides(combined);
        
        // Latest articles (sorted by date, newest first)
        const sorted = [...combined].sort((a, b) => new Date(b.date || '') - new Date(a.date || ''));
        setLatestGuides(sorted.slice(0, 3));
        
        // Find the specific guide (by ID or Slug)
        const found = combined.find(g => String(g.id) === String(id) || g.slug === id);
        setGuide(found);
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">Guide Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">The travel guide you are looking for doesn't exist or has been moved.</p>
        <Link to="/guides" className="bg-teal-600 text-white px-6 py-3 rounded-full font-bold hover:bg-teal-700 transition-colors flex items-center gap-2">
          <ArrowLeft size={20} /> Back to All Guides
        </Link>
      </div>
    );
  }

  // Related guides (exclude current, match category)
  const relatedGuides = guides
    .filter(g => String(g.id) !== String(id) && g.category === guide.category)
    .slice(0, 3);
  
  // Related Tours (match category/destination)
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

  // Helper to format raw text content into HTML paragraphs if not already tagged
  const formatContent = (content) => {
    if (!content) return "";
    
    // If the content is already heavily tagged with block elements, return as is
    if (/<(p|div|h[1-6]|ul|ol|li|blockquote|section|article)/i.test(content)) {
      // Still replace single newlines with <br/> in non-tag areas if needed? 
      // For now, assume if they use tags, they know what they are doing.
      return content;
    }

    // Convert double newlines to paragraphs and single newlines to <br/>
    return content
      .split(/\n\s*\n/)
      .map(para => `<p class="mb-6 leading-[1.8]">${para.replace(/\n/g, '<br />')}</p>`)
      .join('');
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <Helmet>
        <title>{guide.title} | The Beautiful India</title>
        <meta name="description" content={guide.description || guide.title} />
        <meta property="og:title" content={guide.title} />
        <meta property="og:image" content={guide.image} />
      </Helmet>

      {/* Hero Section */}
      <header className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
        <img 
          src={guide.image} 
          alt={guide.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        
        <div className="absolute inset-0 flex flex-col justify-end px-4 md:px-12 lg:px-24 pb-16 max-w-7xl mx-auto w-full">
          <div className="animate-fade-in-up">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-teal-500/90 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md">
                {guide.category || 'Travel'}
              </span>
              <span className="bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md border border-white/30">
                {guide.readTime || '5 min read'}
              </span>
            </div>
            
            <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-8 drop-shadow-2xl max-w-4xl tracking-tight">
              {guide.title}
            </h1>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-teal-400 p-0.5 overflow-hidden shadow-xl">
                  <img 
                    src={guide.authorImg || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"} 
                    alt={guide.author || "Travel Expert"}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-none mb-1">{guide.author || "Travel Expert"}</p>
                  <p className="text-slate-300 text-sm flex items-center gap-1.5">
                    <Calendar size={14} className="text-teal-400" /> {guide.date || "March 2026"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-24 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 relative">
          
        {/* Ad Space (Sticky Sidebar or Top) */}
        <div className="col-span-1 lg:hidden mb-12">
           <div className="bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-8 border border-dashed border-slate-300 dark:border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-4">Sponsored Content</p>
              {/* AD CODE HERE */}
              <div className="h-[100px] flex items-center justify-center italic text-slate-400">
                Ad Space Ready
              </div>
           </div>
        </div>

        {/* Article Body */}
        <article className="lg:col-span-8">
          <div 
            className="prose prose-teal prose-xl max-w-none dark:prose-invert 
              prose-headings:font-black prose-headings:tracking-tight 
              prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-[1.8]
              prose-img:rounded-3xl prose-img:shadow-2xl prose-blockquote:border-teal-500 
              prose-blockquote:bg-teal-50/50 dark:prose-blockquote:bg-teal-900/10 prose-blockquote:p-8 prose-blockquote:rounded-2xl prose-blockquote:italic"
            dangerouslySetInnerHTML={{ __html: formatContent(guide.content) }} 
          />

          {/* Social Share & Interaction */}
          <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white mr-2 flex items-center gap-2 uppercase tracking-widest">
                <Bookmark size={18} className="text-teal-500" /> Save Article
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Share:</span>
              <div className="flex gap-2">
                {[Facebook, Twitter, Instagram, LinkIcon].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 hover:bg-teal-500 hover:text-white transition-all cursor-pointer">
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ad Space Mid Article (Simulated) */}
          <div className="my-16 bg-slate-50 dark:bg-slate-900/30 rounded-3xl p-10 border border-slate-200/50 dark:border-white/5 text-center">
             <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-4">Advertisement</p>
             <div className="min-h-[250px] flex items-center justify-center bg-white/50 dark:bg-black/20 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <span className="text-slate-400 italic font-medium">Responsive Display Ad</span>
             </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-12">
          
          {/* Author/Expert Advice Card */}
          <div className="bg-gradient-to-br from-teal-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <TrendingUp size={40} className="mb-6 opacity-50 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-black mb-4 leading-tight">Need Expert Help Planning This?</h3>
              <p className="text-teal-50 font-medium mb-8 leading-relaxed opacity-90">Our local travel specialists can curate a custom itinerary based on this guide.</p>
              <button 
                onClick={() => setIsQueryModalOpen(true)}
                className="w-full bg-white text-teal-700 font-black py-4 rounded-2xl hover:bg-teal-50 transition-colors shadow-lg uppercase tracking-widest text-sm"
              >
                Consult a Specialist
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          {/* Latest Articles Widget */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-white dark:border-white/5 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
              Latest Articles
            </h3>
            <div className="space-y-8">
              {latestGuides.map(lg => (
                <Link key={lg.id} to={`/guides/${lg.id}`} className="flex gap-4 group">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg border border-white dark:border-slate-800">
                    <img src={lg.image} alt={lg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug group-hover:text-teal-500 transition-colors">
                      {lg.title}
                    </h4>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-slate-400 text-[9px] uppercase font-black tracking-widest">{lg.category || 'Travel'}</p>
                      <p className="text-slate-300 text-[9px] font-bold">{lg.date ? new Date(lg.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sticky Sidebar Ad */}
          <div className="sticky top-24 pt-4">
             <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-4">Advertisement</p>
                <div className="h-[400px] flex items-center justify-center bg-white/50 dark:bg-black/20 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                   <span className="text-slate-400 italic text-sm">Large Skyscraper Ad</span>
                </div>
             </div>
          </div>
        </aside>
      </main>

      {/* Related Tours Section - BEFORE newsletter */}
      {relatedTours.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24 py-20 border-t border-slate-50 dark:border-slate-900">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <p className="text-xs font-black text-teal-600 uppercase tracking-[0.3em] mb-3">Tailored Experiences</p>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Tours Inspired by this Guide</h2>
              </div>
              <Link to="/tours" className="flex items-center gap-2 text-slate-400 hover:text-teal-500 font-bold transition-colors uppercase tracking-widest text-xs">
                View All Tours <ArrowLeft className="rotate-180" size={16} />
              </Link>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
             {relatedTours.map(tour => (
               <Link key={tour.id} to={`/tours/${tour.slug || tour.id}`} className="group flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="relative h-64 overflow-hidden">
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg">
                      <p className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-widest">{tour.duration}</p>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-3">{tour.theme || 'Premium Tour'}</p>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-teal-600 transition-colors line-clamp-1">{tour.title}</h3>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 dark:border-slate-800">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Starting from</p>
                        <p className="text-lg font-black text-slate-900 dark:text-white">₹{tour.price || 'TBA'}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all">
                        <ArrowLeft className="rotate-180" size={20} />
                      </div>
                    </div>
                  </div>
               </Link>
             ))}
           </div>
        </section>
      )}

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 w-full p-4 lg:hidden z-[90] animate-in slide-in-from-bottom duration-500 delay-1000">
        <button 
          onClick={() => setIsQueryModalOpen(true)}
          className="w-full bg-slate-900 dark:bg-teal-600 text-white font-black py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all text-sm uppercase tracking-widest border border-white/10"
        >
          <Smartphone size={18} />
          Consult a Specialist
        </button>
      </div>

      {/* Lead Modal Integration */}
      <QueryModal 
        isOpen={isQueryModalOpen} 
        onClose={() => setIsQueryModalOpen(false)} 
        topic={guide.title}
        source="Travel Guide"
      />

      {/* Newsletter Bottom Bar */}
      <section className="bg-slate-100 dark:bg-slate-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-teal-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-12">
            <MessageCircle size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Stay ahead of the crowd.</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">Join 50,000+ travel enthusiasts and get our freshest destination guides delivered weekly.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-8 py-5 rounded-3xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-teal-500 outline-none shadow-xl text-slate-900 dark:text-white font-medium"
            />
            <button className="bg-slate-900 dark:bg-teal-500 text-white font-black px-10 py-5 rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">
              Join Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuideDetailView;
