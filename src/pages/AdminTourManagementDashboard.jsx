
import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

/**
 * Auto-generated from: admin_tour_management_dashboard/code.html
 * Group: admin | Path: /admin
 */
const AdminTourManagementDashboard = () => {
  const [tours, setTours] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [viewMode, setViewMode] = React.useState('list'); // 'list' | 'folders'
  const [selectedDest, setSelectedDest] = React.useState(null);
  const [selectedState, setSelectedState] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('All Tours');
  const { formatPrice } = useCurrency();
  const [toastMsg, setToastMsg] = React.useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  React.useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = () => {
    setLoading(true);
    const saved = localStorage.getItem('beautifulindia_admin_tours');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTours(Array.isArray(parsed) ? parsed.filter(Boolean) : []);
        setLoading(false);
        return;
      } catch (e) { console.error("Parse error:", e); }
    }

    fetch(`${import.meta.env.BASE_URL}data/tours.json?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        setTours(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  };

  const saveTours = (updatedTours) => {
    setTours(updatedTours);
    localStorage.setItem('beautifulindia_admin_tours', JSON.stringify(updatedTours));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this tour?")) {
      const updated = tours.filter(t => t.id !== id);
      saveTours(updated);
      showToast('🗑️ Tour deleted from local storage');
    }
  };

  const handleSync = () => {
    localStorage.removeItem('beautifulindia_admin_tours');
    fetchTours();
    showToast('♻️ Resynced with system defaults');
  };

  return (
    <>
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-slate-900/95 backdrop-blur-md text-white text-sm font-bold px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 transition-all duration-300 transform translate-y-0 scale-100">
          <span className="material-symbols-outlined text-emerald-400">info</span>
          {toastMsg}
        </div>
      )}

      <div className="relative flex h-screen w-full flex-col group/design-root overflow-hidden">
{/* Top Nav Bar */}

<div className="flex flex-1 overflow-hidden">
{/* Sidebar Navigation */}
<aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col hidden md:flex">
<nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/overview">
<span className="material-symbols-outlined text-[20px] text-slate-500">space_dashboard</span>
<span className="text-[15px] font-medium">Overview</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] bg-[#eefaf9] text-[#0a6c75] transition-colors" to="/admin/tours">
<span className="material-symbols-outlined text-[20px] text-[#0a6c75]">tour</span>
<span className="text-[15px] font-medium">Manage Tours</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/leads">
<span className="material-symbols-outlined text-[20px] text-slate-500">leaderboard</span>
<span className="text-[15px] font-medium">Leads & Queries</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/bookings">
<span className="material-symbols-outlined text-[20px] text-slate-500">group</span>
<span className="text-[15px] font-medium">Bookings</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/guides">
<span className="material-symbols-outlined text-[20px] text-slate-500">menu_book</span>
<span className="text-[15px] font-medium">Guides & Blogs</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/categorization">
<span className="material-symbols-outlined text-[20px] text-slate-500">category</span>
<span className="text-[15px] font-medium">Categorization</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/referral/dashboard">
<span className="material-symbols-outlined text-[20px] text-slate-500">payments</span>
<span className="text-[15px] font-medium">Financials</span>
</Link>
</nav>
</aside>
{/* Main Content Area */}
<main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10">
<div className="  space-y-6">
{/* Page Header */}
<div className="flex flex-wrap justify-between items-center gap-4">
<div>
<nav className="flex text-xs font-medium text-slate-400 mb-2 gap-2 items-center">
<Link className="hover:text-primary" to="/admin">Admin</Link>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<span className="text-slate-600 dark:text-slate-300">Manage Tours</span>
</nav>
<h1 className="text-slate-900 dark:text-slate-100 text-3xl font-bold leading-tight tracking-tight">Manage Tours</h1>
<p className="text-slate-500 dark:text-slate-400 mt-1">View, edit, and create new tour packages.</p>
</div>
<div className="flex flex-wrap items-center gap-3">
  <button 
    onClick={handleSync}
    className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white border border-slate-200 text-slate-600 text-sm font-bold leading-normal hover:bg-slate-50 transition-colors shadow-sm gap-2"
  >
    <span className="material-symbols-outlined text-sm">sync</span>
    <span className="truncate">Reset to Default</span>
  </button>
  <button 
    onClick={async () => {
      try {
        console.log("Saving tours to system...");
        const targetUrl = import.meta.env.MODE === 'development' ? '/api/save-tours' : `${import.meta.env.BASE_URL}api-save-tours.php`;
        const response = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tours)
        });
        const result = await response.json();
        if (result.success) {
          showToast('✅ Tours Saved Permanently to System!');
        } else {
          throw new Error(result.error || 'Failed to save');
        }
      } catch (err) {
        console.error("Save error:", err);
        showToast('❌ Error saving to system. Check console.');
      }
    }}
    className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-emerald-600 text-white text-sm font-bold leading-normal hover:bg-emerald-700 transition-colors shadow-sm gap-2"
  >
    <span className="material-symbols-outlined text-sm">check_circle</span>
    <span className="truncate">Save to System</span>
  </button>
<Link to="/admin/tours/new?type=train" className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-[#0a6c75] text-white text-sm font-bold leading-normal hover:bg-[#085a62] transition-colors shadow-sm gap-2">
<span className="material-symbols-outlined text-sm">train</span>
<span className="truncate">Create Train Tour</span>
</Link>
<Link to="/admin/tours/new" className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary text-white text-sm font-medium leading-normal hover:bg-primary/90 transition-colors shadow-sm gap-2">
<span className="material-symbols-outlined text-sm">add</span>
<span className="truncate">Create New Tour</span>
</Link>
</div>
</div>
{/* Tabs & View Toggle */}
<div className="border-b border-slate-200 dark:border-slate-700 mb-6 flex justify-between items-end">
<nav aria-label="Tabs" className="flex gap-8 px-2">
  {['All Tours', 'Active', 'Train Tours', 'Drafts', 'Archived'].map(tab => (
    <button 
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-4 px-1 transition-colors ${
        activeTab === tab 
          ? 'border-primary text-primary font-bold' 
          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 font-medium'
      }`}
    >
      <span className="text-sm leading-normal">{tab}</span>
    </button>
  ))}
</nav>
<div className="mb-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex gap-1">
  <button onClick={() => setViewMode('list')} className={`px-4 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}>
    <span className="material-symbols-outlined text-[18px]">list</span> List View
  </button>
  <button onClick={() => { setViewMode('folders'); setSelectedDest(null); setSelectedState(null); }} className={`px-4 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors ${viewMode === 'folders' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}>
    <span className="material-symbols-outlined text-[18px]">folder</span> Folder View
  </button>
</div>
</div>
{/* Dynamic View Content */}
{viewMode === 'folders' && !selectedDest && (
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {[...new Set(tours.map(t => t.destination || 'Uncategorized'))].map(dest => (
      <div key={dest} onClick={() => setSelectedDest(dest)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center p-8 rounded-xl cursor-pointer hover:shadow-lg hover:border-primary transition-all group">
          <span className="material-symbols-outlined text-[54px] text-slate-300 group-hover:text-primary transition-colors mb-3 block">folder</span>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white capitalize">{dest}</h3>
          <p className="text-sm text-slate-500 mt-1">{tours.filter(t => (t.destination || 'Uncategorized') === dest).length} Tours</p>
      </div>
    ))}
  </div>
)}

{viewMode === 'folders' && selectedDest && !selectedState && (
  <div>
    <button onClick={() => setSelectedDest(null)} className="mb-6 text-primary font-bold flex items-center hover:opacity-80 transition-opacity"><span className="material-symbols-outlined mr-1">arrow_back</span> Back to Destinations</button>
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...new Set(tours.filter(t => (t.destination || 'Uncategorized') === selectedDest).map(t => t.stateRegion || 'Unspecified'))].map(state => (
        <div key={state} onClick={() => setSelectedState(state)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center p-8 rounded-xl cursor-pointer hover:shadow-lg hover:border-[#0a6c75] transition-all group">
            <span className="material-symbols-outlined text-[54px] text-primary/40 group-hover:text-[#0a6c75] transition-colors mb-3 block">folder_open</span>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white capitalize">{state}</h3>
            <p className="text-sm text-slate-500 mt-1">{tours.filter(t => (t.destination || 'Uncategorized') === selectedDest && (t.stateRegion || 'Unspecified') === state).length} Tours</p>
        </div>
      ))}
    </div>
  </div>
)}

{((viewMode === 'list') || (viewMode === 'folders' && selectedDest && selectedState)) && (
  <div>
    {viewMode === 'folders' && (
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setSelectedState(null)} className="text-primary font-bold flex items-center hover:opacity-80 transition-opacity"><span className="material-symbols-outlined mr-1">arrow_back</span> Back to States in {selectedDest}</button>
        <Link to="/admin/tours/new" className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold shadow-sm hover:bg-primary/90 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span> Create Tour in {selectedState}
        </Link>
      </div>
    )}
    
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
    <thead>
    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tour Name</th>
    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Destination / State</th>
    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Duration</th>
    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hierarchy</th>
    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
    </tr>
    </thead>
    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
    {loading ? (
      <tr><td colSpan="7" className="text-center py-10">Loading tours...</td></tr>
    ) : tours
        .filter(tour => {
           // 1. Filter by Folder if in folder view and something is selected
           if (viewMode === 'folders' && selectedDest && selectedState) {
              if ((tour.destination || 'Uncategorized') !== selectedDest || (tour.stateRegion || 'Unspecified') !== selectedState) {
                return false;
              }
           }
           
           // 2. Filter by Tab (Additive)
           if (activeTab === 'Active' && tour.status !== 'active') return false;
           if (activeTab === 'Train Tours' && tour.transport !== 'train') return false;
           if (activeTab === 'Drafts' && tour.status !== 'draft') return false;
           if (activeTab === 'Archived' && tour.status !== 'paused') return false;
           
           return true; 
        })
        .map(tour => (
    <tr key={tour.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
    <td className="px-6 py-4 whitespace-nowrap">
    <div className="flex items-center gap-3">
    <div className="h-10 w-10 rounded bg-slate-200 dark:bg-slate-700 bg-cover bg-center flex-shrink-0" data-alt={tour.title} style={{ backgroundImage: `url('${tour.image}')` }}></div>
    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{tour.title}</span>
    </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
      <div className="flex flex-col">
        <span className="font-semibold text-slate-700">{tour.destination || 'Global'}</span>
        <span className="text-xs text-slate-400">{tour.stateRegion || 'Unspecified'}</span>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{tour.duration}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
  <div className="flex flex-col">
    <span>{formatPrice(tour.pricePerPerson || tour.price, true)}</span>
    {tour.pricePerCouple && <span className="text-xs text-pink-500 font-normal">{formatPrice(tour.pricePerCouple, true)} /couple</span>}
  </div>
</td>
    <td className="px-6 py-4 whitespace-nowrap">
    <input 
      type="number" 
      value={tour.order || 0} 
      onChange={(e) => {
        const newOrder = parseInt(e.target.value);
        const updated = tours.map(t => t.id === tour.id ? { ...t, order: newOrder } : t);
        saveTours(updated);
        showToast(`✅ Order updated for ${tour.title}`);
      }}
      className="w-16 px-2 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
    />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
    <select 
      value={tour.status || 'active'} 
      onChange={(e) => {
        const newStatus = e.target.value;
        const updated = tours.map(t => t.id === tour.id ? { ...t, status: newStatus } : t);
        saveTours(updated);
        showToast(`✅ Status updated to ${newStatus}`);
      }}
      className={`text-xs font-medium px-2.5 py-1 rounded-full border-none cursor-pointer focus:ring-1 focus:ring-primary ${
        tour.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
      }`}
    >
    <option value="active">Active</option>
    <option value="paused">Paused</option>
    </select>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
    <Link 
      to={`/admin/tours/edit/${tour.id}`}
      className="text-primary hover:text-primary/80 transition-colors p-2 rounded hover:bg-primary/10">
    <span className="material-symbols-outlined text-xl">edit</span>
    </Link>
    <button 
      onClick={() => handleDelete(tour.id)}
      className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 ml-1">
    <span className="material-symbols-outlined text-xl">delete</span>
    </button>
    </td>
    </tr>
    ))}
    </tbody>
    </table>
    </div>
    {/* Pagination */}
    <div className="bg-white dark:bg-slate-900 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between sm:px-6">
    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
    <div>
    <p className="text-sm text-slate-700 dark:text-slate-400">
                                            Showing <span className="font-medium">1</span> to <span className="font-medium">{tours.length}</span> of <span className="font-medium">{tours.length}</span> results
                                        </p>
    </div>
    <div>
    <nav aria-label="Pagination" className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
    <a className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700" href="#">
    <span className="sr-only">Previous</span>
    <span className="material-symbols-outlined text-xl">chevron_left</span>
    </a>
    <a aria-current="page" className="z-10 bg-primary/10 dark:bg-primary/20 border-primary text-primary relative inline-flex items-center px-4 py-2 border text-sm font-medium" href="#">
                                                1
                                            </a>
    <a className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium" href="#">
                                                2
                                            </a>
    <a className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium" href="#">
                                                3
                                            </a>
    <span className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-400">
                                                ...
                                            </span>
    <a className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium" href="#">
                                                10
                                            </a>
    <a className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700" href="#">
    <span className="sr-only">Next</span>
    <span className="material-symbols-outlined text-xl">chevron_right</span>
    </a>
    </nav>
    </div>
    </div>
    </div>
    </div>
  </div>
)}
</div>
</main>
</div>
</div>
    </>
  );
};

export default AdminTourManagementDashboard;
