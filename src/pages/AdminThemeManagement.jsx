import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminThemeManagement = () => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTheme, setEditingTheme] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState('');
  const [order, setOrder] = useState('');

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = () => {
    fetch(`${import.meta.env.BASE_URL}data/themes.json`)
      .then(res => res.json())
      .then(data => {
         setThemes(data.sort((a,b) => (a.order || 0) - (b.order || 0)));
         setLoading(false);
      })
      .catch(err => {
         console.error("Error fetching themes:", err);
         setLoading(false);
      });
  };

  const handleEdit = (theme) => {
    setEditingTheme(theme.id);
    setTitle(theme.title || '');
    setSubtitle(theme.subtitle || '');
    setImage(theme.image || '');
    setOrder(theme.order || '');
  };

  const cancelEdit = () => {
    setEditingTheme(null);
    setTitle('');
    setSubtitle('');
    setImage('');
    setOrder('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = { 
      id: editingTheme || Date.now(),
      title, 
      subtitle, 
      image, 
      order: parseInt(order) || 0 
    };

    console.log(`Theme ${editingTheme ? 'updated' : 'created'} (mocked):`, payload);
    
    if (editingTheme) {
      setThemes(themes.map(t => t.id === editingTheme ? payload : t).sort((a,b) => (a.order || 0) - (b.order || 0)));
    } else {
      setThemes([...themes, payload].sort((a,b) => (a.order || 0) - (b.order || 0)));
    }
    
    cancelEdit();
  };

  const handleDelete = (id) => {
    if(!window.confirm("Are you sure you want to delete this theme?")) return;
    console.log("Theme deleted (mocked):", id);
    setThemes(themes.filter(t => t.id !== id));
  };

  const SidebarLink = ({ to, icon, label, active }) => (
    <Link 
      className={`flex items-center gap-3.5 px-4 py-3 rounded-[10px] transition-colors ${
        active 
          ? "bg-[#eefaf9] text-[#0a6c75]" 
          : "text-slate-600 hover:bg-slate-50"
      }`} 
      to={to}
    >
      <span className={`material-symbols-outlined text-[20px] ${active ? "text-[#0a6c75]" : "text-slate-500"}`}>{icon}</span>
      <span className="text-[15px] font-medium">{label}</span>
    </Link>
  );

  return (
    <div data-page="admin_theme_management" className="h-screen w-full flex flex-col overflow-hidden bg-[#f4f7f6]">
       <header className="bg-white px-6 h-16 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border-4 border-[#0a6c75] border-t-transparent border-r-transparent rounded-tr-none rotate-45 flex items-center justify-center">
             <div className="w-3 h-3 bg-[#0a6c75] rounded-full"></div>
          </div>
          <span className="text-[#0a6c75] font-extrabold text-[17px] tracking-tight">Admin<span className="text-slate-900">Panel</span></span>
        </Link>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col hidden md:flex">
          <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
            <SidebarLink to="/admin/overview" icon="space_dashboard" label="Overview" />
             <SidebarLink to="/admin" icon="tour" label="Manage Tours" />
             <SidebarLink to="/admin/bookings" icon="group" label="Bookings" />
             <SidebarLink to="/admin/themes" icon="category" label="Homepage Themes" active />
             <SidebarLink to="/admin/guides" icon="map" label="Guides" />
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manage Homepage Themes</h1>
                        <p className="text-slate-500 font-medium mt-1">Add, edit, or remove themes shown on the landing page.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   
                   {/* Form */}
                   <div className="lg:col-span-1">
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
                          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                             <span className="material-symbols-outlined text-primary">{editingTheme ? 'edit' : 'add_circle'}</span>
                             {editingTheme ? 'Edit Theme' : 'Add New Theme'}
                          </h2>
                          <form onSubmit={handleSave} className="space-y-4">
                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Theme Title</label>
                                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g. Wildlife" />
                             </div>
                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Subtitle</label>
                                <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g. 20+ destinations" />
                             </div>
                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Image URL</label>
                                <input required type="text" value={image} onChange={e => setImage(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="https://..." />
                                {image && <img src={image} alt="Preview" className="mt-2 h-20 rounded-lg object-cover w-full border border-slate-100" />}
                             </div>
                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Display Order</label>
                                <input type="number" value={order} onChange={e => setOrder(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                             </div>

                             <div className="pt-4 flex gap-3">
                                <button type="submit" className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-[#005a63] transition-colors">
                                   {editingTheme ? 'Update' : 'Save Theme'}
                                </button>
                                {editingTheme && (
                                    <button type="button" onClick={cancelEdit} className="px-5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                       Cancel
                                    </button>
                                )}
                             </div>
                          </form>
                      </div>
                   </div>

                   {/* List */}
                   <div className="lg:col-span-2">
                       {loading ? (
                           <p className="text-slate-500">Loading...</p>
                       ) : (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {themes.map(theme => (
                                   <div key={theme.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4 overflow-hidden relative shadow-sm hover:shadow-md transition-shadow">
                                       <img src={theme.image} alt={theme.title} className="w-24 h-24 rounded-xl object-cover" />
                                       <div className="flex-1">
                                           <h3 className="font-black text-slate-800 text-lg">{theme.title}</h3>
                                           <p className="text-sm font-medium text-slate-500 mb-2">{theme.subtitle}</p>
                                           <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded inline-block">Order: {theme.order || 0}</span>
                                       </div>
                                       
                                       <div className="absolute top-2 right-2 flex flex-col gap-2">
                                           <button onClick={() => handleEdit(theme)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors">
                                              <span className="material-symbols-outlined text-[16px]">edit</span>
                                           </button>
                                           <button onClick={() => handleDelete(theme.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                                              <span className="material-symbols-outlined text-[16px]">delete</span>
                                           </button>
                                       </div>
                                   </div>
                               ))}
                           </div>
                       )}
                   </div>

                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default AdminThemeManagement;
