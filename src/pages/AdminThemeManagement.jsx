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
    
    if (editingTheme) {
      setThemes(themes.map(t => t.id === editingTheme ? payload : t).sort((a,b) => (a.order || 0) - (b.order || 0)));
    } else {
      setThemes([...themes, payload].sort((a,b) => (a.order || 0) - (b.order || 0)));
    }
    
    cancelEdit();
    alert(`Theme ${editingTheme ? 'updated' : 'created'} successfully!`);
  };

  const handleDelete = (id) => {
    if(!window.confirm("Are you sure you want to delete this theme?")) return;
    setThemes(themes.filter(t => t.id !== id));
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-6">
        <div>
           <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2">Discovery Themes</h1>
           <p className="text-slate-500 dark:text-slate-400 font-bold italic">Curate the themed collections on your homepage.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Editor Form */}
        <div className="lg:col-span-4">
           <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-8 sticky top-10 shadow-sm">
              <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#0a6c75]">{editingTheme ? 'edit_note' : 'add_circle'}</span>
                {editingTheme ? 'Update Collection' : 'New Collection'}
              </h2>
              <form onSubmit={handleSave} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Theme Title</label>
                    <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/20" placeholder="e.g. Alpine Treks" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Count / Subtitle</label>
                    <input value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/20" placeholder="e.g. 15 Packages" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image Reference</label>
                    <input required value={image} onChange={e => setImage(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/20" placeholder="https://..." />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sort Order</label>
                    <input type="number" value={order} onChange={e => setOrder(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/20" />
                 </div>

                 <div className="pt-4 flex flex-col gap-3">
                    <button type="submit" className="w-full bg-[#0a6c75] text-white font-black py-3 rounded-xl hover:bg-[#085a62] transition-all text-xs uppercase tracking-widest shadow-lg shadow-teal-900/10">
                       {editingTheme ? 'Sync Changes' : 'Launch Collection'}
                    </button>
                    {editingTheme && (
                      <button type="button" onClick={cancelEdit} className="w-full bg-slate-100 text-slate-600 font-black py-3 rounded-xl hover:bg-slate-200 transition-all text-[10px] uppercase tracking-widest">
                         Dismiss
                      </button>
                    )}
                 </div>
              </form>
           </div>
        </div>

        {/* Live List */}
        <div className="lg:col-span-8">
           {loading ? (
             <div className="py-20 flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-3 border-slate-100 border-t-[#0a6c75] rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing themes...</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {themes.map(theme => (
                  <div key={theme.id} className="group bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 p-4 flex gap-5 overflow-hidden relative shadow-sm hover:shadow-xl hover:border-teal-100 dark:hover:border-teal-900 transition-all">
                     <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-100 dark:border-slate-700 flex-shrink-0">
                        <img src={theme.image} alt={theme.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     </div>
                     <div className="flex-1 py-1">
                        <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg leading-tight mb-1">{theme.title}</h3>
                        <p className="text-[11px] font-bold text-[#0a6c75] uppercase tracking-wider mb-3">{theme.subtitle}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">Rank: {theme.order || 0}</span>
                        </div>
                     </div>
                     
                     <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={() => handleEdit(theme)} className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-[#0a6c75] hover:bg-[#0a6c75]/10 flex items-center justify-center transition-all">
                           <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(theme.id)} className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-all">
                           <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminThemeManagement;
