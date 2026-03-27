import React from 'react';
import { Link } from 'react-router-dom';

const AdminArticleManagementDashboard = () => {
  const [guides, setGuides] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [toastMsg, setToastMsg] = React.useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  React.useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    setLoading(true);
    try {
      // 1. Fetch Master List from Server (Ground Truth)
      const res = await fetch(`${import.meta.env.BASE_URL}data/guides.json`);
      if (res.ok) {
        const remoteGuides = await res.json();
        setGuides(remoteGuides);
        // Keep a backup in localStorage for session stability
        localStorage.setItem('beautifulindia_admin_guides', JSON.stringify(remoteGuides));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      // Fallback to local storage ONLY if server is down
      const saved = localStorage.getItem('beautifulindia_admin_guides');
      if (saved) setGuides(JSON.parse(saved));
    } finally {
      setLoading(false);
    }
  };


  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(guides, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `bharat_darshan_guides_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showToast("⬇️ Backup downloaded");
  };

  const saveGuides = (updated) => {
    setGuides(updated);
    localStorage.setItem('beautifulindia_admin_guides', JSON.stringify(updated));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are You Sure? This will delete the article from the website permanently.")) {
      const updated = guides.filter(g => g.id !== id);
      
      setIsSyncing(true);
      try {
        const response = await fetch('/api/save-guides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
        
        if (response.ok) {
          setGuides(updated);
          localStorage.setItem('beautifulindia_admin_guides', JSON.stringify(updated));
          showToast("🗑️ Article deleted successfully");
        } else {
          showToast("❌ Delete failed on server");
        }
      } catch (e) {
        showToast("❌ Connection error: Delete cancelled");
      } finally {
        setIsSyncing(false);
      }
    }
  };


  // Manual Sync is no longer needed in Direct mode



  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-500">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-bottom duration-300">
          <div className="bg-slate-900/90 text-white px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border border-white/10">
            <span className="material-symbols-outlined text-teal-400">info</span>
            <span className="font-black text-sm tracking-widest uppercase">{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2">Guides & Articles</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold italic">Manage travel tips, blogs, and destination guides.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 rounded-xl font-black hover:border-slate-400 transition-all text-sm shadow-sm"
            title="Download JSON Backup"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            Export
          </button>
          <button 
            onClick={fetchGuides}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 rounded-xl font-black hover:border-teal-500 transition-all text-sm shadow-sm ${loading ? 'opacity-50' : ''}`}
          >
            <span className={`material-symbols-outlined text-[20px] ${loading ? 'animate-spin' : ''}`}>refresh</span>
            Refresh List
          </button>

          <Link 
            to="/admin/guides/new"
            className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#0a6c75] rounded-xl font-black hover:border-teal-500 transition-all text-sm shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Create New
          </Link>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Article</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stats</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {loading ? (
                <tr>
                   <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-slate-100 border-t-[#0a6c75] rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-bold italic">Loading your library...</p>
                      </div>
                   </td>
                </tr>
              ) : guides.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold italic">No articles found. Start by creating one!</td>
                </tr>
              ) : guides.map(guide => (
                <tr key={guide.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 bg-cover bg-center border border-slate-200 dark:border-slate-700" style={{ backgroundImage: `url('${guide.image}')` }}></div>
                      <div>
                        <p className="font-black text-slate-800 dark:text-slate-100 group-hover:text-[#0a6c75] transition-colors">{guide.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">ID: {guide.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{guide.category}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-slate-500">{guide.readTime || '5 min'} read</span>
                      <span className="text-[9px] font-black text-slate-300 uppercase">{guide.type || 'Inspiration'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex flex-col gap-1 items-end">
                      <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${
                        guide.status === 'draft' 
                          ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-100 dark:border-amber-900/30' 
                          : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-100 dark:border-emerald-900/30'
                      }`}>
                        {guide.status || 'published'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/guides/edit/${guide.id}`} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-lg hover:border-teal-500 transition-all">Edit</Link>
                      <button onClick={() => handleDelete(guide.id)} className="px-4 py-2 bg-red-50 dark:bg-red-950/20 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-100 transition-all">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminArticleManagementDashboard;
