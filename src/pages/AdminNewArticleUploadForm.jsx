import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  Bold, 
  Italic, 
  Link as LinkIcon, 
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4, 
  Heading5, 
  Heading6, 
  Type, 
  Trash2,
  Code,
  Eye,
  EyeOff,
  ExternalLink
} from 'lucide-react';

const AdminNewArticleUploadForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    readTime: '5 min read',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    description: '',
    type: 'blog',
    image: '',
    content: '',
    relatedTours: '',
    author: 'Sarah Jenkins',
    tags: '',
    inlineImageUrl: '',
    inlineImageCaption: '',
    showNewsletter: true,
    allowComments: true,
    schemaSnippet: '',
    status: 'published' // Default to published for new articles
  });

  const [slugEdited, setSlugEdited] = useState(false);

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/[^\w-]+/g, '')  // Remove all non-word chars
      .replace(/--+/g, '-')     // Replace multiple - with single -
      .replace(/^-+/, '')       // Trim - from start of text
      .replace(/-+$/, '');      // Trim - from end of text
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const newState = { 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      };

      // Auto-generate slug from title if not manually edited
      if (name === 'title' && !slugEdited) {
        newState.slug = slugify(value);
      }

      // Track if slug was manually edited
      if (name === 'slug') {
        setSlugEdited(true);
      }
      
      setHasUnsavedChanges(true); // Track any change for sync reminder
      return newState;
    });
  };

  const insertFormatting = (prefix, suffix = "") => {
    const textarea = document.getElementById("article-content");
    if (!textarea) return;

    textarea.focus();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newValue = before + prefix + selection + suffix + after;
    
    setFormData(prev => ({ ...prev, content: newValue }));

    // Small delay to reset cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + (selection ? selection.length + suffix.length : 0);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const handleAddLink = () => {
    const url = prompt("Enter full URL (including https://):", "https://");
    if (url && url !== "https://") {
      insertFormatting(`<a href="${url}" target="_blank">`, "</a>");
    }
  };

  useEffect(() => {
    if (id) {
      const savedGuides = localStorage.getItem('beautifulindia_admin_guides');
      if (savedGuides) {
        try {
          const guides = JSON.parse(savedGuides);
          const matched = guides.find(g => String(g.id) === String(id));
          if (matched) {
            setFormData(prev => ({ ...prev, ...matched }));
            return;
          }
        } catch (e) { console.error(e); }
      }

      fetch(`${import.meta.env.BASE_URL}data/guides.json`)
        .then(res => res.json())
        .then(data => {
          const matched = data.find(g => String(g.id) === String(id));
          if (matched) setFormData(prev => ({ ...prev, ...matched }));
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 5MB size limit for localStorage stability (user requested)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image is too large (Max 5MB). Please use a smaller image.");
        e.target.value = ''; // Reset input
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, image: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e, targetStatus = null) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    // Determine status: if targetStatus is set, use it; otherwise stay as is or default to published
    const finalStatus = targetStatus || formData.status || 'published';

    try {
      // 1. Load existing guides (local first)
      const savedGuides = localStorage.getItem('beautifulindia_admin_guides');
      let guides = [];
      if (savedGuides) {
        try { guides = JSON.parse(savedGuides); } catch (err) { console.error("Parse error:", err); }
      }

      // 2. FETCH FROM SERVER & MERGE (to ensure we don't overwrite server data with partial local state)
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}data/guides.json`);
        const serverGuides = await res.json();
        
        // Use Map to merge: local edits take precedence, server provides the rest
        const mergedMap = new Map();
        serverGuides.forEach(g => mergedMap.set(String(g.id), g));
        // Add existing local guides (if any) - they overwrite server guides with same ID
        guides.forEach(g => mergedMap.set(String(g.id), g));
        
        guides = Array.from(mergedMap.values());
      } catch (e) {
        console.error("Master list merge fetch error:", e);
        // Continue with local guides if server is unreachable
      }

      const guideId = id || (formData.slug || slugify(formData.title));
      const guideToSave = { 
        ...formData, 
        id: guideId,
        status: finalStatus,
        date: formData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      let updatedGuides;
      if (id) {
        updatedGuides = guides.map(g => String(g.id) === String(id) ? guideToSave : g);
        if (!guides.find(g => String(g.id) === String(id))) updatedGuides = [...guides, guideToSave];
      } else {
        updatedGuides = [...guides, guideToSave];
      }

      localStorage.setItem('beautifulindia_admin_guides', JSON.stringify(updatedGuides));
      
      // 4. Sync to Server (Permanence)
      setIsSyncing(true);
      try {
        // Use proxy-friendly absolute path for both local and live
        const targetUrl = '/api/save-guides';
        const syncResponse = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedGuides)
        });
        
        if (syncResponse.ok) {
          console.log("Server sync successful");
          setLastSaved(new Date().toLocaleTimeString());
          setHasUnsavedChanges(false); // Reset switch reminder
          setFormData(prev => ({ ...prev, status: finalStatus })); // Update local state status
        } else {
          console.warn("Server sync failed, data is local-only");
          // Original alert was here, but instruction removed it. Keeping the console.warn.
        }
      } catch (err) {
        console.error("Server sync connection error:", err);
        // Original alert was here, but instruction removed it. Keeping the console.error.
      } finally {
        setIsSyncing(false);
      }

      // The instruction implies toast.success replaces the alert, but toast is not imported.
      // For now, I'll keep the original alert and add a note.
      // TODO: If toast is intended, it needs to be imported.
      alert(`Article ${id ? 'Updated' : 'Created'} Successfully!`);
      navigate('/admin/guides');
      
    } catch (err) {
      console.error("Submission error:", err);
      if (err.name === 'QuotaExceededError' || err.message.includes('quota')) {
        alert("❌ Storage Full: The article (likely the image) is too large for your browser's local library. Please use a smaller image (under 2MB) or compress it before uploading.");
      } else {
        alert("❌ Failed to save article: " + (err.message || "Unknown error occurred"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1200px] mx-auto space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              to="/admin/guides" 
              className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-teal-500 hover:border-teal-500 transition-all shadow-sm group"
            >
              <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                {id ? 'Edit Article' : 'New Article'}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  Article Management System
                </p>
                {formData.status && (
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${formData.status === 'published' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                    {formData.status}
                  </span>
                )}
              </div>
            </div>
          </div>
          {formData.slug && (
            <a 
              href={`https://bhaktikishakti.com/guides/${formData.slug}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center gap-2 text-xs font-black text-slate-600 hover:text-teal-600 hover:shadow-sm transition-all shadow-inner"
            >
              <ExternalLink size={14} />
              View Live
            </a>
          )}
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-bold italic">Craft stories that inspire every traveler.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Content Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-8 md:p-12 space-y-10">
          
          {/* Cover Image Upload */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Primary Cover Image</h3>
            <label className="group relative flex flex-col items-center justify-center w-full h-[300px] border-2 border-slate-100 dark:border-slate-800 border-dashed rounded-[24px] cursor-pointer bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 transition-all overflow-hidden">
              {formData.image ? (
                <div className="absolute inset-0">
                  <img src={formData.image} alt="Cover Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-slate-900 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">Change Photo</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <span className="material-symbols-outlined text-[48px] text-slate-200">photo_library</span>
                  <div className="text-center">
                    <p className="font-black text-slate-800 dark:text-slate-100 text-sm">Upload High Resolution Cover</p>
                    <p className="text-[11px] font-bold text-slate-400 italic">Portrait or Landscape (Max 5MB)</p>
                  </div>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>

          {/* Core Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#0a6c75] uppercase tracking-[0.2em] ml-1">Article Title</label>
              <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/20" placeholder="e.g. 10 Secret Cafes in Old Delhi" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#0a6c75] uppercase tracking-[0.2em] ml-1">Custom URL Slug</label>
              <div className="relative">
                <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 pr-12 text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/20 lowercase" placeholder="e.g. secret-cafes-delhi" />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600">link</span>
              </div>
              <p className="text-[9px] text-slate-400 font-bold px-1 italic">Preview: bhaktikishakti.com/guides/<span className="text-[#0a6c75] dark:text-teal-400">{formData.slug || 'your-slug'}</span></p>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#0a6c75] uppercase tracking-[0.2em] ml-1">Primary Category</label>
              <input required name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/20" placeholder="e.g. Gastronomy" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#0a6c75] uppercase tracking-[0.2em] ml-1">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/20">
                <option value="blog">Editorial Blog</option>
                <option value="destination">Expert Guide</option>
                <option value="tip">Quick Hack / Tip</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#0a6c75] uppercase tracking-[0.2em] ml-1">Read Time estimate</label>
              <input name="readTime" value={formData.readTime} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/20" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-black text-[#0a6c75] uppercase tracking-[0.2em]">Article Content</label>
              <div className="flex gap-2 text-slate-400 font-bold text-[9px] uppercase tracking-tighter">
                <span>HTML Supported</span>
                <span>•</span>
                <span>Auto-Saving to local</span>
              </div>
            </div>

            {/* Premium Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
              <button type="button" onClick={() => insertFormatting("<b>", "</b>")} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all group shadow-sm hover:shadow-md" title="Bold">
                <Bold size={16} className="text-slate-600 dark:text-slate-300 group-hover:text-teal-600" />
              </button>
              <button type="button" onClick={() => insertFormatting("<i>", "</i>")} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all group shadow-sm hover:shadow-md" title="Italic">
                <Italic size={16} className="text-slate-600 dark:text-slate-300 group-hover:text-teal-600" />
              </button>
              <button type="button" onClick={handleAddLink} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all group shadow-sm hover:shadow-md" title="Add Link">
                <LinkIcon size={16} className="text-slate-600 dark:text-slate-300 group-hover:text-teal-600" />
              </button>
              
              <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

              {[Heading1, Heading2, Heading3, Heading4, Heading5].map((HIcon, idx) => (
                <button 
                  key={idx} 
                  type="button" 
                  onClick={() => insertFormatting(`<h${idx + 1}>`, `</h${idx + 1}>`)} 
                  className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all group shadow-sm hover:shadow-md" 
                  title={`Heading ${idx + 1}`}
                >
                  <HIcon size={16} className="text-slate-600 dark:text-slate-300 group-hover:text-teal-600" />
                </button>
              ))}

              <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

              <button type="button" onClick={() => insertFormatting("<p class=\"mb-6 leading-[1.8]\">", "</p>")} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all group shadow-sm hover:shadow-md" title="Paragraph">
                <Type size={16} className="text-slate-600 dark:text-slate-300 group-hover:text-teal-600" />
              </button>
              <button type="button" onClick={() => insertFormatting("<div class=\"bg-teal-50 dark:bg-teal-900/10 border-l-4 border-teal-500 p-6 my-10 italic text-lg\">", "</div>")} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all group shadow-sm hover:shadow-md" title="Quote Block">
                <Code size={16} className="text-slate-600 dark:text-slate-300 group-hover:text-teal-600" />
              </button>
              
              <button 
                type="button" 
                onClick={() => {
                  if (hasUnsavedChanges && !isHtmlMode) {
                    if (confirm("You have unsaved changes. Switch to HTML mode to save them first? Clicking 'Cancel' will toggle modes anyway.")) {
                      return; // Stay in Reader mode
                    }
                  }
                  setIsHtmlMode(!isHtmlMode);
                }} 
                className={`p-2 rounded-xl transition-all group shadow-sm hover:shadow-md ml-auto flex items-center gap-2 px-3 ${!isHtmlMode ? 'bg-teal-500 text-white shadow-teal-500/20' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                title={!isHtmlMode ? "Switch to Edit Mode" : "Switch to Reader Mode"}
              >
                {!isHtmlMode ? <Eye size={16} /> : <Code size={16} />}
                <span className="text-[10px] font-black uppercase tracking-widest">{!isHtmlMode ? 'Reader Mode' : 'HTML Mode'}</span>
              </button>

              <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

              <button 
                type="button" 
                onClick={() => { if(confirm("Clear all content?")) setFormData(prev => ({...prev, content: ''})) }} 
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all group" 
                title="Clear Content"
              >
                <Trash2 size={16} className="text-slate-400 group-hover:text-red-500" />
              </button>
            </div>

            {isHtmlMode ? (
              <textarea 
                required 
                id="article-content"
                name="content" 
                value={formData.content} 
                onChange={handleChange} 
                rows="20" 
                className="w-full bg-slate-100/50 dark:bg-slate-800 border-none rounded-[32px] p-8 text-sm font-mono text-teal-700 dark:text-teal-400 outline-none focus:ring-4 focus:ring-teal-500/10 leading-[1.6] transition-all" 
                placeholder="<!-- Enter your HTML code here -->"
              />
            ) : (
              <div 
                className="w-full min-h-[500px] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[32px] p-10 overflow-auto shadow-inner"
              >
                <div 
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-slate-400 italic">No content to preview...</p>' }}
                />
              </div>
            )}
          </div>

          {/* Meta Info */}
          <div className="pt-8 border-t border-slate-50 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Related Tours (ID list)</label>
              <input name="relatedTours" value={formData.relatedTours} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-xs font-bold" placeholder="e.g. delhi-food-walk, taj-mahal-luxury" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tags (Keywords)</label>
              <input name="tags" value={formData.tags} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-xs font-bold" placeholder="Food, Culture, Heritage" />
            </div>
            <div className="space-y-3 col-span-1 md:col-span-2">
              <label className="text-[10px] font-black text-[#0a6c75] uppercase tracking-[0.2em] ml-1">JSON-LD Schema Snippet</label>
              <textarea 
                name="schemaSnippet" 
                value={formData.schemaSnippet} 
                onChange={handleChange} 
                rows="5" 
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-xs font-mono" 
                placeholder='<script type="application/ld+json">...</script>' 
              />
              <p className="text-[9px] text-slate-400 font-bold px-1 italic">This snippet will be rendered at the end of the article for SEO purposes.</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-100 dark:border-slate-800 p-6 rounded-[32px] shadow-2xl">
          <div className="flex items-center gap-4">
            <p className="text-xs font-bold text-slate-400">
              {isSyncing ? (
                <span className="flex items-center gap-2 text-teal-500">
                  <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                  Syncing with system...
                </span>
              ) : lastSaved ? (
                <span className="text-slate-500">Last saved to system at {lastSaved}</span>
              ) : (
                "Not saved to system yet"
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              type="button" 
              onClick={() => navigate('/admin/guides')} 
              className="px-8 py-4 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:text-slate-800 transition-all"
            >
              Cancel
            </button>
            
            <button 
              type="button"
              disabled={loading || isSyncing}
              onClick={() => handleSubmit(null, 'draft')}
              className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-amber-500 hover:text-amber-500 transition-all shadow-sm disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save as Draft'}
            </button>

            <button 
              type="button" 
              disabled={loading || isSyncing}
              onClick={() => handleSubmit(null, 'published')}
              className="px-10 py-4 bg-[#0a6c75] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#085a62] transition-all shadow-xl shadow-teal-900/20 disabled:opacity-50"
            >
              {loading ? 'Syncing...' : (id ? 'Update & Publish' : 'Publish Article')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminNewArticleUploadForm;
