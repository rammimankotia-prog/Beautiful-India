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
    imagePositionX: 50,
    imagePositionY: 50,
    content: '',
    relatedTours: '',
    author: 'Sarah Jenkins',
    tags: '',
    inlineImageUrl: '',
    inlineImageCaption: '',
    showNewsletter: true,
    allowComments: true,
    schemaSnippet: '',
    seoTitle: '',
    metaDescription: '',
    metaKeywords: '',
    status: 'published' // Default to published for new articles
  });

  const [isAdjustingImage, setIsAdjustingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);


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
      // 1. Fetch source of truth from server only
      // Added cache-busting and no-cache headers to ensure we get the latest data
      fetch(`${import.meta.env.BASE_URL}data/guides.json?t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
        .then(res => res.json())
        .then(data => {
          const matched = data.find(g => String(g.id) === String(id));
          if (matched) {
            setFormData(prev => ({ ...prev, ...matched }));
          }
        })
        .catch(err => console.error("Failed to load article from server:", err));
    }
  }, [id]);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image is too large (Max 5MB). Please use a smaller image.");
        e.target.value = ''; // Reset input
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, image: event.target.result, imagePositionX: 50, imagePositionY: 50 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = (e) => {
    e.preventDefault();
    if(confirm("Permanently remove cover image? It will be cleared from this draft.")) {
      setFormData(prev => ({ ...prev, image: '', imagePositionX: 50, imagePositionY: 50 }));
      setHasUnsavedChanges(true);
    }
  };

  const handleImageMouseMove = (e) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setFormData(prev => ({ 
      ...prev, 
      imagePositionX: Math.max(0, Math.min(100, x)),
      imagePositionY: Math.max(0, Math.min(100, y))
    }));
    setHasUnsavedChanges(true);
  };

  // Auto-Save Effect
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    
    const interval = setInterval(() => {
      console.log("Auto-saving draft to local storage...");
      localStorage.setItem('beautifulindia_article_autosave', JSON.stringify({
        ...formData,
        lastAutoSave: new Date().toISOString()
      }));
      setLastSaved(`Auto-saved at ${new Date().toLocaleTimeString()}`);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [formData, hasUnsavedChanges]);

  // Load Auto-Save if available
  useEffect(() => {
    if (!id) {
       const autosave = localStorage.getItem('beautifulindia_article_autosave');
       if (autosave) {
         try {
           const parsed = JSON.parse(autosave);
           if (confirm(`A recent un-published draft from ${new Date(parsed.lastAutoSave).toLocaleTimeString()} was found. Load it?`)) {
             setFormData(prev => ({ ...prev, ...parsed }));
             setHasUnsavedChanges(true);
           } else {
             localStorage.removeItem('beautifulindia_article_autosave');
           }
         } catch (e) { console.error(e); }
       }
    }
  }, [id]);

  const handleSubmit = async (e, targetStatus = null) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    // Determine status: if targetStatus is set, use it; otherwise stay as is or default to published
    const finalStatus = targetStatus || formData.status || 'published';

    try {
      // 1. Fetch current live guides to ensure we don't drop other articles
      let currentGuides = [];
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}data/guides.json?t=${Date.now()}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        currentGuides = await res.json();
      } catch (e) {
        console.error("Master list fetch error:", e);
        throw new Error("Could not reach the server to retrieve the article list. Please check your internet connection.");
      }

      const guideId = id || (formData.slug || slugify(formData.title));
      const guideToSave = { 
        ...formData, 
        id: guideId,
        status: finalStatus,
        date: formData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        lastModified: new Date().toISOString()
      };

      // 2. Direct Server Write (Atomic Save)
      setIsSyncing(true); 
      let errorDetail = "";
      
      const targetUrl = '/api/save-guides';
      const syncResponse = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guideToSave) // Now sending ONLY the current article
      });

      
      if (syncResponse.ok) {
        const result = await syncResponse.json();
        if (result.success) {
          // Success Path
          localStorage.removeItem('beautifulindia_article_autosave'); // Clear backup
          alert(`✅ Article successfully ${id ? 'updated' : 'published'}! It is now live on the website.`);
          navigate('/admin/guides');
          return;
        } else {
          errorDetail = result.error || "Server rejected the update.";
        }
      } else {
        errorDetail = `Server returned Error ${syncResponse.status} (${syncResponse.statusText})`;
      }
      
      // Failure Path
      throw new Error(errorDetail);

    } catch (err) {
      console.error("Submission error:", err);
      alert(`❌ FAILED TO PUBLISH\n\nReason: ${err.message}\n\nYour work is still being held in the editor. You can try saving again or copy your text to move it elsewhere.`);
    } finally {
      setIsSyncing(false);
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
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Primary Cover Image</h3>
              {formData.image && (
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsAdjustingImage(!isAdjustingImage)}
                    className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${isAdjustingImage ? 'bg-teal-500 border-teal-500 text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-teal-500'}`}
                  >
                    {isAdjustingImage ? 'Finish Adjustment' : 'Adjust Position'}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleImageDelete}
                    className="p-1.5 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-xl hover:bg-red-100 transition-all border border-red-100 dark:border-red-900/30"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
            <label 
              className={`group relative flex flex-col items-center justify-center w-full h-[300px] border-2 border-slate-100 dark:border-slate-800 border-dashed rounded-[24px] overflow-hidden transition-all ${isAdjustingImage ? 'cursor-move ring-4 ring-teal-500/20 border-teal-500' : 'cursor-pointer bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100'}`}
              onMouseDown={() => isAdjustingImage && setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleImageMouseMove}
            >
              {formData.image ? (
                <div className="absolute inset-0 select-none">
                  <img 
                    src={formData.image} 
                    alt="Cover Preview" 
                    className="w-full h-full object-cover transition-transform duration-500" 
                    style={{ 
                      objectPosition: `${formData.imagePositionX || 50}% ${formData.imagePositionY || 50}%`,
                      transform: isAdjustingImage ? 'scale(1.05)' : 'scale(1)'
                    }} 
                  />
                  {!isAdjustingImage && (
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white text-slate-900 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest pointer-events-none">Change Photo</span>
                    </div>
                  )}
                  {isAdjustingImage && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-teal-900/10">
                       <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-teal-500/30">
                          <span className="material-symbols-outlined text-teal-600 animate-pulse">drag_pan</span>
                          <span className="text-[10px] font-black uppercase text-teal-800 tracking-widest">Dragging: {Math.round(formData.imagePositionX)}% x {Math.round(formData.imagePositionY)}%</span>
                       </div>
                    </div>
                  )}
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
              {!isAdjustingImage && <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />}
            </label>
            {isAdjustingImage && (
              <p className="text-[9px] font-bold text-slate-400 italic text-center uppercase tracking-widest">Hold left-click and drag to adjust the visual center of your cover photo</p>
            )}
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

        {/* SEO & Social Metadata Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-8 md:p-12 space-y-8">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-teal-500">search</span>
            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">SEO & Social Metadata</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#0a6c75] uppercase tracking-[0.2em] ml-1">SEO Page Title</label>
              <input 
                name="seoTitle" 
                value={formData.seoTitle || ''} 
                onChange={handleChange} 
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/20" 
                placeholder="e.g. Best Travel Guide to Swiss Alps | The Beautiful India" 
              />
              <p className="text-[9px] text-slate-400 font-bold px-1 italic">Optimal length: 50-60 characters. Current: <span className={(formData.seoTitle?.length || 0) > 60 ? 'text-red-500' : 'text-teal-500'}>{formData.seoTitle?.length || 0}</span></p>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#0a6c75] uppercase tracking-[0.2em] ml-1">Meta Description</label>
              <textarea 
                name="metaDescription" 
                value={formData.metaDescription || ''} 
                onChange={handleChange} 
                rows="3" 
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/20" 
                placeholder="Brief summary for search engine results..." 
              />
              <p className="text-[9px] text-slate-400 font-bold px-1 italic">Optimal length: 150-160 characters. Current: <span className={(formData.metaDescription?.length || 0) > 160 ? 'text-red-500' : 'text-teal-500'}>{formData.metaDescription?.length || 0}</span></p>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#0a6c75] uppercase tracking-[0.2em] ml-1">Meta Keywords (Comma separated)</label>
              <input 
                name="metaKeywords" 
                value={formData.metaKeywords || ''} 
                onChange={handleChange} 
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/20" 
                placeholder="e.g. Switzerland, Alps, Travel Guide, Hiking" 
              />
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
              className="px-8 py-4 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:text-slate-800 transition-all font-sans"
            >
              Cancel
            </button>
            
            <button 
              type="button"
              disabled={loading || isSyncing}
              onClick={() => handleSubmit(null, 'draft')}
              className="group px-8 py-4 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-100 dark:hover:bg-amber-950/40 hover:border-amber-500 transition-all shadow-sm flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">draft</span>
              {loading ? 'Saving...' : 'Save as Draft'}
            </button>

            <button 
              type="button" 
              disabled={loading || isSyncing}
              onClick={() => handleSubmit(null, 'published')}
              className="group px-10 py-4 bg-slate-900 dark:bg-teal-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-[#0a6c75] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">publish</span>
              {loading ? (id ? 'Saving...' : 'Publishing...') : (id ? 'Update Website' : 'Publish to Website')}
            </button>


          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminNewArticleUploadForm;
