import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const AdminNewArticleUploadForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
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
    allowComments: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  useEffect(() => {
    if (id) {
      // First check localStorage
      const savedGuides = localStorage.getItem('wanderlust_admin_guides');
      if (savedGuides) {
        try {
          const guides = JSON.parse(savedGuides);
          const matched = guides.find(g => String(g.id) === String(id));
          if (matched) {
            setFormData(prev => ({ ...prev, ...matched }));
            return;
          }
        } catch (e) {
          console.error("Local storage error:", e);
        }
      }

      fetch(`${import.meta.env.BASE_URL}data/guides.json`)
        .then(res => res.json())
        .then(data => {
          const matched = data.find(g => String(g.id) === String(id));
          if (matched) setFormData(prev => ({ ...prev, ...matched }));
        })
        .catch(err => {
          console.error("Failed to load guide:", err);
        });
    }
  }, [id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, image: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const savedGuides = localStorage.getItem('wanderlust_admin_guides');
    let guides = [];
    if (savedGuides) {
      try {
        guides = JSON.parse(savedGuides);
      } catch (err) {
        console.error("Error parsing guides:", err);
      }
    }

    const guideToSave = { 
      ...formData, 
      id: id || Date.now().toString(),
      date: formData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    let updatedGuides;
    if (id) {
      updatedGuides = guides.map(g => String(g.id) === String(id) ? guideToSave : g);
      if (!guides.find(g => String(g.id) === String(id))) {
        updatedGuides = [...guides, guideToSave];
      }
    } else {
      updatedGuides = [...guides, guideToSave];
    }

    localStorage.setItem('wanderlust_admin_guides', JSON.stringify(updatedGuides));
    alert(`Article ${id ? 'Updated' : 'Created'} Successfully! (Stored in Local Storage)`);
    
    setLoading(false);
    navigate('/admin/guides');
  };

  return (
    <div data-page="admin_new_article_upload_form">
      <div className="relative flex h-screen w-full flex-col group/design-root overflow-hidden bg-[#f8fafc]">
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col hidden md:flex">
            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
              <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin">
                <span className="material-symbols-outlined text-[20px] text-slate-500">space_dashboard</span>
                <span className="text-[15px] font-medium">Overview</span>
              </Link>
              <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin">
                <span className="material-symbols-outlined text-[20px] text-slate-500">tour</span>
                <span className="text-[15px] font-medium">Manage Tours</span>
              </Link>
              <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] bg-[#eefaf9] text-[#0a6c75] transition-colors" to="/admin/guides">
<span className="material-symbols-outlined text-[20px] text-[#0a6c75]">menu_book</span>
<span className="text-[15px] font-medium">Guides & Blogs</span>
</Link>
              <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/categorization">
                <span className="material-symbols-outlined text-[20px] text-slate-500">category</span>
                <span className="text-[15px] font-medium">Categorization</span>
              </Link>
              <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/bookings">
                <span className="material-symbols-outlined text-[20px] text-slate-500">group</span>
                <span className="text-[15px] font-medium">Bookings</span>
              </Link>
              <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/referral/dashboard">
                <span className="material-symbols-outlined text-[20px] text-slate-500">payments</span>
                <span className="text-[15px] font-medium">Financials</span>
              </Link>
              <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/leads">
                <span className="material-symbols-outlined text-[20px] text-slate-500">smart_toy</span>
                <span className="text-[15px] font-medium">Chatbot Leads</span>
              </Link>
            </nav>
          </aside>
          
          <main className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="max-w-[800px] mx-auto">
              <div className="mb-8">
                <Link to="/admin/guides" className="text-[#0a6c75] text-[13px] font-bold flex items-center gap-1 hover:underline mb-2">
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  Back to Guides
                </Link>
                <h1 className="text-3xl font-extrabold text-[#0a6c75] tracking-tight">{id ? 'Edit Guide' : 'Create New Guide'}</h1>
                <p className="text-slate-500 mt-1 font-medium">Fill out the details below to publish a new travel guide or tip.</p>
              </div>

              <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[13px] font-extrabold text-[#0a6c75] mb-2">Article Title</label>
                    <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-[#f8fafc] border border-slate-200 text-slate-900 text-[14px] font-medium rounded-[8px] focus:ring-1 focus:ring-[#0f766e] focus:border-[#0f766e] block p-3" placeholder="e.g. Exploring the Swiss Alps" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-extrabold text-[#0a6c75] mb-2">Category / Tag</label>
                    <input required type="text" name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#f8fafc] border border-slate-200 text-slate-900 text-[14px] font-medium rounded-[8px] focus:ring-1 focus:ring-[#0f766e] focus:border-[#0f766e] block p-3" placeholder="e.g. Destinations, Tips, City Life" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-extrabold text-[#0a6c75] mb-2">Read Time</label>
                    <input required type="text" name="readTime" value={formData.readTime} onChange={handleChange} className="w-full bg-[#f8fafc] border border-slate-200 text-slate-900 text-[14px] font-medium rounded-[8px] focus:ring-1 focus:ring-[#0f766e] focus:border-[#0f766e] block p-3" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-extrabold text-[#0a6c75] mb-2">Article Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-[#f8fafc] border border-slate-200 text-slate-900 text-[14px] font-medium rounded-[8px] focus:ring-1 focus:ring-[#0f766e] focus:border-[#0f766e] block p-3">
                      <option value="blog">Blog Post</option>
                      <option value="destination">Destination Guide</option>
                      <option value="tip">Travel Tip / Hack</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-extrabold text-[#0a6c75] mb-2">Author Name</label>
                    <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full bg-[#f8fafc] border border-slate-200 text-slate-900 text-[14px] font-medium rounded-[8px] focus:ring-1 focus:ring-[#0f766e] focus:border-[#0f766e] block p-3" placeholder="e.g. Sarah Jenkins" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-extrabold text-[#0a6c75] mb-2">Tags (comma separated)</label>
                    <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full bg-[#f8fafc] border border-slate-200 text-slate-900 text-[14px] font-medium rounded-[8px] focus:ring-1 focus:ring-[#0f766e] focus:border-[#0f766e] block p-3" placeholder="e.g. Switzerland, Hiking, Alps" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-[13px] font-extrabold text-[#0a6c75] mb-2">Short Description</label>
                  <textarea required name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full bg-[#f8fafc] border border-slate-200 text-slate-900 text-[14px] font-medium rounded-[8px] focus:ring-1 focus:ring-[#0f766e] focus:border-[#0f766e] block p-3" placeholder="Brief summary of the article..." />
                </div>

                <div className="mb-6">
                  <label className="block text-[13px] font-extrabold text-[#0a6c75] mb-2">Blog Content (Full Text)</label>
                  <textarea required name="content" value={formData.content} onChange={handleChange} rows="8" className="w-full bg-[#f8fafc] border border-slate-200 text-slate-900 text-[14px] font-medium rounded-[8px] focus:ring-1 focus:ring-[#0f766e] focus:border-[#0f766e] block p-3" placeholder="Write the full blog post content here. You can use Markdown or plain text..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[13px] font-extrabold text-[#0a6c75] mb-2">Inline Content Image URL</label>
                    <input type="text" name="inlineImageUrl" value={formData.inlineImageUrl} onChange={handleChange} className="w-full bg-[#f8fafc] border border-slate-200 text-slate-900 text-[14px] font-medium rounded-[8px] focus:ring-1 focus:ring-[#0f766e] focus:border-[#0f766e] block p-3" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-[13px] font-extrabold text-[#0a6c75] mb-2">Inline Image Caption</label>
                    <input type="text" name="inlineImageCaption" value={formData.inlineImageCaption} onChange={handleChange} className="w-full bg-[#f8fafc] border border-slate-200 text-slate-900 text-[14px] font-medium rounded-[8px] focus:ring-1 focus:ring-[#0f766e] focus:border-[#0f766e] block p-3" placeholder="e.g. Scenic railway in Switzerland" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-[13px] font-extrabold text-[#0a6c75] mb-2">Related Tours (Right Sidebar)</label>
                  <input type="text" name="relatedTours" value={formData.relatedTours} onChange={handleChange} className="w-full bg-[#f8fafc] border border-slate-200 text-slate-900 text-[14px] font-medium rounded-[8px] focus:ring-1 focus:ring-[#0f766e] focus:border-[#0f766e] block p-3" placeholder="e.g. Swiss Alps Trek, Jungfrau Region Workshop" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border border-slate-200 rounded-xl p-5 bg-slate-50">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="showNewsletter" checked={formData.showNewsletter} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-[#0a6c75] focus:ring-[#0a6c75]" />
                    <div>
                      <span className="block text-[14px] font-extrabold text-slate-900">Include Newsletter Widget</span>
                      <span className="block text-[12px] text-slate-500">Show the "Get Travel Tips" box on the right sidebar.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="allowComments" checked={formData.allowComments} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-[#0a6c75] focus:ring-[#0a6c75]" />
                    <div>
                      <span className="block text-[14px] font-extrabold text-slate-900">Enable Comments & Replies</span>
                      <span className="block text-[12px] text-slate-500">Show discussion thread and "Leave a Reply" query form.</span>
                    </div>
                  </label>
                </div>

                <div className="mb-8">
                  <label className="block text-[13px] font-extrabold text-[#0a6c75] mb-2">Cover Image (Upload)</label>
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-[10px] cursor-pointer bg-slate-50 hover:bg-slate-100 relative overflow-hidden">
                    {formData.image ? (
                        <img src={formData.image} alt="Cover Preview" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <span className="material-symbols-outlined text-[30px] text-slate-400 mb-2">cloud_upload</span>
                          <p className="mb-1 text-[13px] font-bold text-slate-600">Click to upload image</p>
                          <p className="text-[11px] font-medium text-slate-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button type="submit" disabled={loading} className="px-8 py-3 bg-[#0a6c75] text-white text-[14px] font-extrabold rounded-[8px] hover:bg-[#07565e] transition-colors shadow-sm disabled:opacity-50">
                    {loading ? 'Saving...' : 'Publish Guide'}
                  </button>
                </div>

              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminNewArticleUploadForm;
