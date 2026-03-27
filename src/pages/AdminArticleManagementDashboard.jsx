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
      // 1. Fetch Master List from Server
      let remoteGuides = [];
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}data/guides.json?t=${Date.now()}`);
        if (res.ok) remoteGuides = await res.json();
      } catch (e) { console.warn("Remote guides unavailable:", e); }

      // 2. Fetch Local Drafts/Edits
      const saved = localStorage.getItem('beautifulindia_admin_guides');
      let localGuides = [];
      if (saved) {
        try { localGuides = JSON.parse(saved); } catch (e) { console.error("Parse error:", e); }
      }

      // 3. Merge them (Local edits/new articles take precedence by ID)
      const mergedMap = new Map();
      // Server is the ground truth for state
      remoteGuides.forEach(g => mergedMap.set(String(g.id), g));
      // Local overrides (if user has unsynced changes)
      localGuides.forEach(g => mergedMap.set(String(g.id), g));

      const finalGuides = Array.from(mergedMap.values());
      setGuides(finalGuides);
      
      // Keep localStorage in sync with the merged state for stability
      localStorage.setItem('beautifulindia_admin_guides', JSON.stringify(finalGuides));

    } catch (err) {
      console.error("Fetch error:", err);
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
    if (window.confirm("Are you sure you want to delete this article everywhere?")) {
      const updated = guides.filter(g => g.id !== id);
      saveGuides(updated);
      
      // Auto-Sync to server immediately on delete
      setIsSyncing(true);
      try {
        const targetUrl = import.meta.env.MODE === 'development' ? '/api/save-guides' : `${import.meta.env.BASE_URL}api-save-guides.php`;
        const response = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
        if (response.ok) {
          showToast("🗑️ Article deleted permanently");
        } else {
          showToast("🗑️ Deleted locally (Sync to server manually)");
        }
      } catch (e) {
        showToast("🗑️ Deleted locally (No connection to sync)");
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const targetUrl = import.meta.env.MODE === 'development' ? '/api/save-guides' : `${import.meta.env.BASE_URL}api-save-guides.php`;
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guides)
      });
      const result = await response.json();
      if (result.success) {
        showToast("✅ System updated successfully!");
      } else {
        showToast("❌ Error saving to system");
      }
    } catch (error) {
      showToast("❌ Connection error");
    } finally {
      setIsSyncing(false);
    }
  };

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
            onClick={handleSync}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-6 py-2.5 bg-[#0a6c75] text-white rounded-xl font-black hover:bg-[#085a62] transition-all text-sm shadow-lg shadow-teal-900/20 ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className={`material-symbols-outlined text-[20px] ${isSyncing ? 'animate-spin' : ''}`}>
              {isSyncing ? 'sync' : 'cloud_upload'}
            </span>
            {isSyncing ? 'Syncing...' : 'Save to System'}
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
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100 dark:border-emerald-900/30">Published</span>
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
