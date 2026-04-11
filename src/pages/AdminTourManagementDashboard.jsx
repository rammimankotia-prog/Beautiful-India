import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useData } from '../context/DataContext';
import { safeCacheTours, STORAGE_KEYS } from '../utils/storage';

const TOURS_PER_PAGE = 15;

const AdminTourManagementDashboard = () => {
  const { tours, setTours, loading, refreshData } = useData();
  const [viewMode, setViewMode] = React.useState('list'); // 'list' | 'folders'
  const [selectedDest, setSelectedDest] = React.useState(null);
  const [selectedState, setSelectedState] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('All Tours');
  const { formatPrice } = useCurrency();
  const [toastMsg, setToastMsg] = React.useState('');

  // New state for search, sort, pagination
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortOrder, setSortOrder] = React.useState('newest'); // 'newest' | 'oldest'
  const [currentPage, setCurrentPage] = React.useState(1);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const [dataSource, setDataSource] = React.useState('loading');

  React.useEffect(() => {
    if (!loading) {
      setDataSource(tours.length > 0 ? 'server' : 'cache');
    }
  }, [loading, tours]);

  // Reset page to 1 whenever filter/search/sort/tab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOrder, activeTab, selectedDest, selectedState, viewMode]);

  const fetchTours = () => {
    refreshData();
  };

  const persistToursToServer = async (updatedTours) => {
    try {
      const response = await fetch(`/api-save-tours.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTours)
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return true;
    } catch (err) {
      console.error("Failed to persist tours to server:", err);
      showToast('❌ Server Save Failed');
      return false;
    }
  };

  const saveTours = (updatedTours, persist = false) => {
    setTours(updatedTours);
    safeCacheTours(STORAGE_KEYS.TOURS, updatedTours);
    if (persist) persistToursToServer(updatedTours);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tour package permanently?")) {
      const updated = tours.filter(t => t.id !== id);
      saveTours(updated, true);
      showToast('🗑️ Tour deleted successfully');
    }
  };

  // ── Derived filtered + sorted + paginated list ──────────────────────────────
  const filteredAndSorted = React.useMemo(() => {
    let list = [...tours];

    // Tab filter
    if (activeTab === 'Active') list = list.filter(t => t.status === 'active');
    else if (activeTab === 'Train Tours') list = list.filter(t => t.transport === 'train');
    else if (activeTab === 'Drafts') list = list.filter(t => t.status === 'draft');
    else if (activeTab === 'Archived') list = list.filter(t => t.status === 'archived');

    // Folder filter
    if (viewMode === 'folders' && selectedDest && selectedState) {
      list = list.filter(t => {
        const tourDest = Array.isArray(t.destination) ? t.destination[0] : t.destination;
        const tourState = Array.isArray(t.stateRegion) ? t.stateRegion[0] : t.stateRegion;
        return (tourDest || 'Uncategorized') === selectedDest && (tourState || 'Unspecified') === selectedState;
      });
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(t => {
        const dest = Array.isArray(t.destination) ? t.destination.join(' ') : (t.destination || '');
        const state = Array.isArray(t.stateRegion) ? t.stateRegion.join(' ') : (t.stateRegion || '');
        return (
          (t.title || '').toLowerCase().includes(q) ||
          (t.slug || '').toLowerCase().includes(q) ||
          (t.id || '').toLowerCase().includes(q) ||
          dest.toLowerCase().includes(q) ||
          state.toLowerCase().includes(q) ||
          (t.description || '').toLowerCase().includes(q)
        );
      });
    }

    // Sort — use original array index as insertion-order proxy
    // (tours have slug-based IDs and no reliable createdAt)
    const getIndex = (t) => {
      const idx = tours.indexOf(t);
      return idx === -1 ? 0 : idx;
    };

    list.sort((a, b) => {
      const aIdx = getIndex(a);
      const bIdx = getIndex(b);
      // "Newest first" → higher index (last added) comes first
      return sortOrder === 'newest' ? bIdx - aIdx : aIdx - bIdx;
    });

    return list;
  }, [tours, activeTab, viewMode, selectedDest, selectedState, searchQuery, sortOrder]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / TOURS_PER_PAGE));
  const paginatedTours = filteredAndSorted.slice(
    (currentPage - 1) * TOURS_PER_PAGE,
    currentPage * TOURS_PER_PAGE
  );

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  // Render page number buttons (smart window)
  const pageButtons = () => {
    const pages = [];
    const WINDOW = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - WINDOW && i <= currentPage + WINDOW)
      ) {
        pages.push(i);
      } else if (
        i === currentPage - WINDOW - 1 ||
        i === currentPage + WINDOW + 1
      ) {
        pages.push('...');
      }
    }
    // Deduplicate consecutive '...'
    return pages.filter((v, idx, arr) => !(v === '...' && arr[idx - 1] === '...'));
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-bottom duration-300">
          <div className="bg-slate-900/90 text-white px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border border-white/10">
            <span className="material-symbols-outlined text-teal-400">check_circle</span>
            <span className="font-black text-sm tracking-wide uppercase tracking-widest">{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2">Tour Management</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold italic">Create, edit and manage your beautiful India tour packages.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
            dataSource === 'server' 
              ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-100 dark:border-emerald-900/30' 
              : dataSource === 'cache'
              ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-100 dark:border-amber-900/30'
              : 'bg-red-50 dark:bg-red-950/20 text-red-600 border-red-100 dark:border-red-900/30'
          }`}>
            <span className="w-2 h-2 rounded-full animate-pulse bg-current"></span>
            {dataSource === 'server' ? 'Server Live' : dataSource === 'cache' ? 'Local Cache' : 'Syncing...'}
          </div>
          <button 
            onClick={fetchTours}
            className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all text-sm shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>
          
          <button 
            onClick={async () => {
              try {
                const response = await fetch(`/api-save-tours.php`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(tours)
                });
                const result = await response.json();
                if (result.success) showToast('✅ Tours Saved Permanently!');
                else throw new Error(result.error);
              } catch (err) {
                showToast('❌ Save Error');
              }
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-black hover:bg-emerald-700 transition-all text-sm shadow-lg"
          >
            <span className="material-symbols-outlined">cloud_upload</span>
            Save to System
          </button>

          <Link to="/admin/tours/new" className="flex items-center gap-2 px-6 py-2.5 bg-[#0a6c75] text-white rounded-xl font-black hover:bg-[#085a62] transition-all text-sm shadow-lg shadow-teal-900/20">
            <span className="material-symbols-outlined">add</span>
            New Package
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700 flex justify-between items-end">
        <nav className="flex gap-8 px-2">
          {['All Tours', 'Active', 'Train Tours', 'Drafts', 'Archived'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-1 text-sm font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === tab ? 'border-[#0a6c75] text-[#0a6c75]' : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="mb-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex gap-1">
          <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#0a6c75]' : 'text-slate-500'}`}>
            <span className="material-symbols-outlined text-[18px]">list</span> LIST
          </button>
          <button onClick={() => { setViewMode('folders'); setSelectedDest(null); setSelectedState(null); }} className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 transition-all ${viewMode === 'folders' ? 'bg-white shadow-sm text-[#0a6c75]' : 'text-slate-500'}`}>
            <span className="material-symbols-outlined text-[18px]">folder</span> FOLDERS
          </button>
        </div>
      </div>

      {/* ── Search + Sort toolbar ── */}
      {(viewMode === 'list' || (viewMode === 'folders' && selectedDest && selectedState)) && (
        <div className="flex flex-wrap items-center gap-4">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[240px] max-w-[480px]">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">search</span>
            <input
              id="tour-search-input"
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search tours by name, destination, keyword…"
              className="w-full pl-12 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a6c75]/40 focus:border-[#0a6c75] transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 shadow-sm">
            <span className="material-symbols-outlined text-[18px] text-slate-400">sort</span>
            <select
              id="tour-sort-select"
              value={sortOrder}
              onChange={e => { setSortOrder(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Result count */}
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
            {filteredAndSorted.length} tour{filteredAndSorted.length !== 1 ? 's' : ''} found
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
             <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0a6c75] rounded-full animate-spin"></div>
             <p className="text-slate-400 font-bold italic">Loading packages...</p>
          </div>
        ) : (
          <>
            {viewMode === 'folders' && !selectedDest && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {[...new Set(tours.map(t => {
                  const dest = Array.isArray(t.destination) ? t.destination[0] : t.destination;
                  return dest || 'Uncategorized';
                }))].map(dest => (
                  <div key={dest} onClick={() => setSelectedDest(dest)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl cursor-pointer hover:shadow-xl hover:border-[#0a6c75] transition-all group text-center">
                      <span className="material-symbols-outlined text-4xl text-slate-300 group-hover:text-[#0a6c75] transition-colors mb-2 block">folder</span>
                      <h3 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest">{dest}</h3>
                      <p className="text-[10px] font-bold text-slate-400 mt-1">{tours.filter(t => {
                        const tourDest = Array.isArray(t.destination) ? t.destination[0] : t.destination;
                        return (tourDest || 'Uncategorized') === dest;
                      }).length} Tours</p>
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'folders' && selectedDest && !selectedState && (
              <div className="space-y-6">
                <button onClick={() => setSelectedDest(null)} className="text-[#0a6c75] font-black uppercase text-xs flex items-center gap-2 hover:opacity-70 transition-opacity">
                   <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Destinations
                </button>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {[...new Set(tours.filter(t => {
                    const tourDest = Array.isArray(t.destination) ? t.destination[0] : t.destination;
                    return (tourDest || 'Uncategorized') === selectedDest;
                  }).map(t => {
                    const state = Array.isArray(t.stateRegion) ? t.stateRegion[0] : t.stateRegion;
                    return state || 'Unspecified';
                  }))].map(state => (
                    <div key={state} onClick={() => setSelectedState(state)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl cursor-pointer hover:shadow-xl hover:border-[#0a6c75] transition-all group text-center">
                        <span className="material-symbols-outlined text-4xl text-primary/30 group-hover:text-[#0a6c75] transition-colors mb-2 block">folder_open</span>
                        <h3 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest">{state}</h3>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {((viewMode === 'list') || (viewMode === 'folders' && selectedDest && selectedState)) && (
              <div className="space-y-6">
                {viewMode === 'folders' && (
                  <button onClick={() => setSelectedState(null)} className="text-[#0a6c75] font-black uppercase text-xs flex items-center gap-2 hover:opacity-70 transition-opacity">
                     <span className="material-symbols-outlined text-sm">arrow_back</span> Back to {selectedDest}
                  </button>
                )}
                
                <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tour Package</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {paginatedTours.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-8 py-16 text-center">
                              <span className="material-symbols-outlined text-5xl text-slate-200 dark:text-slate-700 block mb-3">search_off</span>
                              <p className="text-slate-400 font-bold italic text-sm">No tours match your search.</p>
                              {searchQuery && (
                                <button
                                  onClick={() => setSearchQuery('')}
                                  className="mt-4 text-[#0a6c75] font-black text-xs uppercase tracking-widest hover:underline"
                                >
                                  Clear search
                                </button>
                              )}
                            </td>
                          </tr>
                        ) : (
                          paginatedTours.map(tour => (
                            <tr key={tour.id} className="hover:bg-slate-50/50 transition-colors group">
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-10 rounded-lg bg-cover bg-center shadow-sm" style={{ backgroundImage: `url('${tour.image}')` }}></div>
                                     <div className="flex flex-col">
                                        <span className="text-sm font-black text-slate-800 dark:text-slate-100">{tour.title}</span>
                                        <span className="text-[10px] font-bold text-slate-400">{tour.slug || tour.id}</span>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="flex flex-col">
                                     <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{Array.isArray(tour.destination) ? tour.destination.join(', ') : tour.destination}</span>
                                     <span className="text-[10px] font-bold text-slate-400">{Array.isArray(tour.stateRegion) ? tour.stateRegion.join(', ') : tour.stateRegion}</span>
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                                    {formatPrice(tour.pricePerPerson || tour.price || 0, true)}
                                  </span>
                               </td>
                               <td className="px-8 py-6">
                                  <select 
                                    value={tour.status || 'active'} 
                                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-emerald-600 outline-none cursor-pointer"
                                    onChange={(e) => {
                                      const newStatus = e.target.value;
                                      const updated = tours.map(t => t.id === tour.id ? { ...t, status: newStatus } : t);
                                      saveTours(updated, true);
                                      showToast(`✅ Status updated to ${newStatus}`);
                                    }}
                                  >
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="paused">Paused</option>
                                  </select>
                               </td>
                               <td className="px-8 py-6 text-right">
                                   <div className="flex justify-end gap-2 text-slate-300">
                                     <Link to={`/admin/tours/edit/${tour.slug || tour.id}`} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 hover:text-[#0a6c75] transition-all">
                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                     </Link>
                                     <button onClick={() => handleDelete(tour.id)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                     </button>
                                  </div>
                               </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* ── Pagination Bar ── */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                      {/* Left: page info */}
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Page {currentPage} of {totalPages} &nbsp;·&nbsp; {filteredAndSorted.length} tours
                      </p>

                      {/* Right: page buttons */}
                      <div className="flex items-center gap-1">
                        {/* Prev */}
                        <button
                          id="pagination-prev"
                          disabled={currentPage === 1}
                          onClick={() => goToPage(currentPage - 1)}
                          className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white hover:text-[#0a6c75] disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        </button>

                        {pageButtons().map((btn, idx) =>
                          btn === '...'
                            ? <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm font-bold select-none">…</span>
                            : (
                              <button
                                key={btn}
                                id={`pagination-page-${btn}`}
                                onClick={() => goToPage(btn)}
                                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black transition-all border ${
                                  currentPage === btn
                                    ? 'bg-[#0a6c75] text-white border-[#0a6c75] shadow-sm'
                                    : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-white hover:text-[#0a6c75]'
                                }`}
                              >
                                {btn}
                              </button>
                            )
                        )}

                        {/* Next */}
                        <button
                          id="pagination-next"
                          disabled={currentPage === totalPages}
                          onClick={() => goToPage(currentPage + 1)}
                          className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white hover:text-[#0a6c75] disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminTourManagementDashboard;
