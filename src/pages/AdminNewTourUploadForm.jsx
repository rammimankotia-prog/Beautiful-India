import React from "react";
import { Link } from "react-router-dom";
import categoriesData from "../data/categories.json";
import { safeCacheTours, STORAGE_KEYS } from "../utils/storage";

/**
 * Auto-generated from: admin_new_tour_upload_form/code.html
 * Group: admin | Path: /admin/tours/new
 */
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

/* ─────────────────────────────────────────────
   Format Content Helper 
 ───────────────────────────────────────────── */
const formatContent = (content) => {
  if (!content) return '';
  if (/<(p|div|h[1-6]|ul|ol|li|blockquote|section|article|span|br)/i.test(content)) {
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
   Rich Text Editor Component
 ───────────────────────────────────────────── */
const RichTextEditor = ({ value, onChange, placeholder, minHeight = "min-h-[160px]" }) => {
  const [mode, setMode] = React.useState('visual');
  const editorRef = React.useRef(null);
  
  React.useEffect(() => {
    if (mode === 'visual' && editorRef.current && editorRef.current.innerHTML !== (value || '')) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value, mode]);

  const handleVisualInput = (e) => {
    onChange(e.currentTarget.innerHTML);
  };

  const execCommand = (command, val = null) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
        editorRef.current.focus();
    }
  };

  return (
    <div className="border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all bg-white dark:bg-slate-900 flex flex-col shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 p-2.5 bg-slate-50 dark:bg-slate-900/50">
        <div className={`flex flex-wrap gap-1 items-center transition-all ${mode === 'html' ? 'opacity-30 pointer-events-none blur-[1px]' : ''}`}>
          {[
              { cmd: 'bold', icon: 'format_bold', label: 'Bold' },
              { cmd: 'italic', icon: 'format_italic', label: 'Italic' },
              { cmd: 'underline', icon: 'format_underlined', label: 'Underline' },
              { divider: true },
              { cmd: 'formatBlock', val: '<h2>', label: 'H2', text: 'H2' },
              { cmd: 'formatBlock', val: '<h3>', label: 'H3', text: 'H3' },
              { divider: true },
              { cmd: 'insertUnorderedList', icon: 'format_list_bulleted', label: 'Bullet List' },
              { cmd: 'createLink', prompt: 'Enter URL (e.g. https://google.com):', icon: 'link', label: 'Add Link' }
          ].map((btn, i) => (
              btn.divider ? (
                  <div key={i} className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1.5"></div>
              ) : (
                  <button 
                      key={i}
                      type="button"
                      onClick={() => {
                        if (btn.cmd === 'createLink') {
                          const url = prompt(btn.prompt);
                          if (url) execCommand(btn.cmd, url);
                        } else {
                          execCommand(btn.cmd, btn.val);
                        }
                      }} 
                      className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary hover:shadow-sm rounded-lg transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      title={btn.label}
                  >
                      {btn.icon ? <span className="material-symbols-outlined text-[18px]">{btn.icon}</span> : <span className="font-black text-[10px] tracking-tight">{btn.text}</span>}
                  </button>
              )
          ))}
        </div>

        <div className="flex bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 h-[34px] self-start sm:self-auto shrink-0 shadow-inner">
            <button 
                type="button"
                onClick={() => setMode('visual')}
                className={`px-4 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${mode === 'visual' ? 'bg-white shadow-md dark:bg-slate-700 text-primary scale-[1.02]' : 'text-slate-500 hover:text-slate-400'}`}
            >
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                Aesthetics
            </button>
            <button 
                type="button"
                onClick={() => setMode('html')}
                className={`px-4 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${mode === 'html' ? 'bg-white shadow-md dark:bg-slate-700 text-primary scale-[1.02]' : 'text-slate-500 hover:text-slate-400'}`}
            >
                <span className="material-symbols-outlined text-[14px]">code</span>
                Raw Code
            </button>
        </div>
      </div>
      
      <div className="relative bg-white dark:bg-slate-900">
        {mode === 'html' ? (
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full bg-slate-950 text-emerald-400 font-mono text-[13px] p-5 border-0 focus:ring-0 resize-y placeholder-slate-800 ${minHeight} leading-relaxed selection:bg-emerald-500/20`}
            spellCheck="false"
            placeholder={`<!--\n${placeholder}\n-->`}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleVisualInput}
            className={`w-full p-5 outline-none prose prose-sm dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 ${minHeight} overflow-auto cursor-text leading-relaxed marker:text-primary list-disc selection:bg-primary/10`}
            suppressContentEditableWarning
            data-placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
};

const AdminNewTourUploadForm = ({ onComplete }) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const existingId = params.get("id");

  const [formData, setFormData] = React.useState({
    title: "",
    slug: "",
    duration: "",
    price: "",
    couplePrice: "",
    groupPrice: "",
    destinations: [],
    categories: [],
    transport: [],
    stayTypes: [],
    mealPlans: [],
    nature: "Adventure",
    availableFrom: "",
    availableTo: "",
    noAvailableTo: false,
    content: "",
    highlights: "",
    itinerary: [],
    images: [],
    image: "",
    isFeatured: false,
    status: "active",
  });

  const [loading, setLoading] = React.useState(false);
  const [existingTour, setExistingTour] = React.useState(null);

  // Load existing data if edit mode
  React.useEffect(() => {
    if (existingId) {
      const allTours = JSON.parse(localStorage.getItem(STORAGE_KEYS.TOURS) || "[]");
      const tour = allTours.find((t) => t.id === existingId || t.slug === existingId);
      if (tour) {
        setExistingTour(tour);
        setFormData({
          ...tour,
          destinations: tour.destinations || [],
          categories: tour.categories || [],
          transport: tour.transport || [],
          stayTypes: tour.stayTypes || [],
          mealPlans: tour.mealPlans || [],
          itinerary: tour.itinerary || [],
          images: tour.images || [],
        });
      }
    }
  }, [existingId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayInput = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value.split(",").map((v) => v.trim()).filter((v) => v),
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const newImg = { url: reader.result, caption: "" };
            setFormData(prev => {
                const updatedImages = [...(prev.images || []), newImg];
                return {
                    ...prev,
                    images: updatedImages,
                    image: prev.image || reader.result // Set first as main if none
                };
            });
        };
        reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImageCaption = (index, caption) => {
    setFormData(prev => {
        const newImages = [...prev.images];
        newImages[index].caption = caption;
        return { ...prev, images: newImages };
    });
  };

  const addItineraryDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, title: "", description: "", hotel: "", meals: [], transport: "" },
      ],
    }));
  };

  const removeItineraryDay = (index) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index).map((day, i) => ({ ...day, day: i + 1 })),
    }));
  };

  const updateItineraryDay = (index, updates) => {
    setFormData((prev) => {
      const newItinerary = [...prev.itinerary];
      newItinerary[index] = { ...newItinerary[index], ...updates };
      return { ...prev, itinerary: newItinerary };
    });
  };

  const handleSubmit = async (e, forcedStatus = null) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const submissionData = {
        ...formData,
        id: formData.slug || formData.title.toLowerCase().replace(/ /g, "-"),
        status: forcedStatus || formData.status,
        updatedAt: new Date().toISOString(),
      };

      const allTours = JSON.parse(localStorage.getItem(STORAGE_KEYS.TOURS) || "[]");
      let updatedTours;
      
      if (existingId) {
        updatedTours = allTours.map(t => (t.id === existingId || t.slug === existingId) ? submissionData : t);
      } else {
        updatedTours = [submissionData, ...allTours];
      }

      // 1. Save to LocalStorage for immediate UI feedback
      safeCacheTours(updatedTours);

      // 2. Save to Backend JSON
      const response = await fetch('/api-save-tours.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTours)
      });

      if (!response.ok) throw new Error("Backend synchronization failed");

      if (onComplete) onComplete();
      navigate("/admin");
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to save changes. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const categories = categoriesData;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Link to="/admin" className="hover:text-primary transition-colors">Dashboard</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-primary font-bold">Standardized Expedition Protocol</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              {existingTour ? "Modify Journey" : "Forge New Expedition"}
            </h1>
          </div>
          
          <div className="flex gap-4">
            <button 
                type="button" 
                onClick={() => navigate("/admin")}
                className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-primary hover:text-primary transition-all shadow-sm"
            >
                Abandon
            </button>
            <button 
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
                {loading ? "Syncing..." : (existingTour ? "Seal Record" : "Launch Project")}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section: Core Identity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8">
              <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-6">
                <span className="material-symbols-outlined text-primary">fingerprint</span>
                <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Core Identity</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Tour Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-300"
                    placeholder="E.g., Golden Triangle Expedition"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Tour Slug</label>
                    <input 
                      type="text" 
                      name="slug" 
                      value={formData.slug} 
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary transition-all text-slate-900 dark:text-white"
                      placeholder="golden-triangle-expedition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration</label>
                    <input 
                      type="text" 
                      name="duration" 
                      value={formData.duration} 
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary transition-all text-slate-900 dark:text-white"
                      placeholder="e.g., 5 Days / 4 Nights"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Pricing Vault */}
            <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8">
              <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-6">
                <span className="material-symbols-outlined text-primary">payments</span>
                <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Pricing Vault</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Per Person</label>
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-primary transition-colors">₹</span>
                    <input 
                      type="number" 
                      name="price" 
                      value={formData.price} 
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm font-black outline-none focus:border-primary transition-all text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Per Couple</label>
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-primary transition-colors">₹</span>
                    <input 
                      type="number" 
                      name="couplePrice" 
                      value={formData.couplePrice} 
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm font-black outline-none focus:border-primary transition-all text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Group (Min 4)</label>
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-primary transition-colors">₹</span>
                    <input 
                      type="number" 
                      name="groupPrice" 
                      value={formData.groupPrice} 
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm font-black outline-none focus:border-primary transition-all text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Narrative & Content */}
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-10">
            <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-6">
              <span className="material-symbols-outlined text-primary">auto_stories</span>
              <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Narrative & Logistics</h2>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">The Story (Description)</label>
                <RichTextEditor 
                  value={formData.content} 
                  onChange={(val) => setFormData(prev => ({ ...prev, content: val }))} 
                  placeholder="Inscribe the journey details here... HTML supported."
                  minHeight="min-h-[300px]"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Expedition Highlights (Bullet Points)</label>
                <RichTextEditor 
                  value={formData.highlights} 
                  onChange={(val) => setFormData(prev => ({ ...prev, highlights: val }))} 
                  placeholder="E.g., 5-Star Accommodations, Exotic Cuisines, Private Transfers..."
                  minHeight="min-h-[160px]"
                />
              </div>
            </div>
          </div>

          {/* Section: Taxonomies & Routing */}
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-10">
            <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-6">
              <span className="material-symbols-outlined text-primary">hub</span>
              <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Taxonomies & Routing</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Strategic Destinations</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">location_on</span>
                    <input 
                      type="text" 
                      value={formData.destinations.join(", ")} 
                      onChange={(e) => handleArrayInput("destinations", e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none focus:border-primary transition-all text-slate-900 dark:text-white"
                      placeholder="E.g., Delhi, Agra, Jaipur"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Universal Tagging (Categories)</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">sell</span>
                    <input 
                      type="text" 
                      value={formData.categories.join(", ")} 
                      onChange={(e) => handleArrayInput("categories", e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none focus:border-primary transition-all text-slate-900 dark:text-white"
                      placeholder="Heritage, Luxury, Adventure..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nature of Expedition</label>
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                    {categories.natures.map((nature) => (
                      <button
                        key={nature.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, nature: nature.value })}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          formData.nature === nature.value
                            ? "bg-white shadow-xl dark:bg-slate-700 text-primary scale-[1.05] z-10"
                            : "text-slate-400 opacity-60"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">{nature.icon}</span>
                        {nature.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-slate-900 rounded-3xl space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={formData.isFeatured} 
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-slate-700 rounded-full peer peer-checked:bg-primary transition-all shadow-inner"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-all shadow-lg"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white uppercase tracking-widest group-hover:text-primary transition-colors">Promote as Featured</span>
                      <span className="text-[9px] text-slate-400 font-bold italic">Boost to homepage and top search results.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Visual Gallery Vault */}
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-6">
              <span className="material-symbols-outlined text-primary">gallery_thumbnail</span>
              <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Media Vault</h2>
            </div>

            <div className="space-y-6">
              <label className="relative flex flex-col items-center justify-center w-full h-[240px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:border-primary hover:bg-slate-100 transition-all group overflow-hidden">
                <input
                  type="file" multiple accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                />
                <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-4xl text-slate-300 group-hover:text-primary transition-colors">cloud_upload</span>
                  <div className="text-center">
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Inscribe Journey Photos</p>
                    <p className="text-[10px] text-slate-400 font-bold italic">Upload multiple JPEG/WebP assets (Max 5MB each)</p>
                  </div>
                </div>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {(formData.images || []).map((img, index) => (
                  <div key={index} className="group relative h-[180px] rounded-[24px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
                    <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={img.caption} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all p-4 flex flex-col justify-end gap-3">
                      <input 
                        type="text" 
                        value={img.caption} 
                        onChange={(e) => updateImageCaption(index, e.target.value)}
                        className="w-full bg-white/20 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1.5 text-[10px] text-white font-bold outline-none placeholder:text-white/40 shadow-xl"
                        placeholder="Inscribe caption..."
                      />
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setFormData(p => ({ ...p, image: img.url }))} className="flex-1 py-1.5 bg-white text-slate-900 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-400 hover:text-white transition-all shadow-xl">Main Hero</button>
                        <button type="button" onClick={() => removeImage(index)} className="w-8 h-8 bg-white/10 backdrop-blur-md text-white rounded-lg flex items-center justify-center hover:bg-red-500 transition-all shadow-xl border border-white/10">
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Final Submission */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4 text-slate-400">
                <span className="material-symbols-outlined text-sm animate-pulse">lock</span>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">Your changes are automatically versioned</p>
            </div>
            
            <div className="flex gap-6 w-full md:w-auto">
                <button 
                    type="button" 
                    onClick={() => navigate("/admin")}
                    className="flex-1 px-10 py-5 text-slate-400 font-black uppercase text-xs tracking-[4px] hover:text-slate-600 transition-all"
                >
                    Abandon
                </button>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-[2] md:flex-none px-16 py-5 bg-primary text-white rounded-[1.5rem] font-black uppercase text-xs tracking-[4px] shadow-2xl shadow-primary/30 hover:bg-slate-900 active:scale-95 transition-all disabled:opacity-50"
                >
                    {loading ? 'Synchronizing...' : (existingTour ? 'Push Updates' : 'Launch Expedition')}
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminNewTourUploadForm;
