import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useData } from '../context/DataContext';
import { safeCacheTours } from '../utils/storage';

const AdminTourManagementDashboard = () => {
  const { tours, setTours, loading, refreshData } = useData();
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

  const fetchTours = () => {
    refreshData();
  };

  const saveTours = (updatedTours) => {
    setTours(updatedTours);
    safeCacheTours('beautifulindia_cache_tours', updatedTours);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this tour?")) {
      const updated = tours.filter(t => t.id !== id);
      saveTours(updated);
      showToast('🗑️ Tour deleted from local storage');
    }
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
          <button 
            onClick={fetchTours}
            className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all text-sm shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>
          
          <button 
            onClick={async () => {
              try {
                const targetUrl = import.meta.env.MODE === 'development' ? '/api/save-tours' : `${import.meta.env.BASE_URL}api-save-tours.php`;
                const response = await fetch(targetUrl, {
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
                        {tours
                          .filter(tour => {
                             if (viewMode === 'folders' && selectedDest && selectedState) {
                                const tourDest = Array.isArray(tour.destination) ? tour.destination[0] : tour.destination;
                                const tourState = Array.isArray(tour.stateRegion) ? tour.stateRegion[0] : tour.stateRegion;
                                if ((tourDest || 'Uncategorized') !== selectedDest || (tourState || 'Unspecified') !== selectedState) return false;
                             }
                             if (activeTab === 'Active' && tour.status !== 'active') return false;
                             if (activeTab === 'Train Tours' && tour.transport !== 'train') return false;
                             if (activeTab === 'Drafts' && tour.status !== 'draft') return false;
                             return true; 
                          })
                          .map(tour => (
                            <tr key={tour.id} className="hover:bg-slate-50/50 transition-colors group">
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-10 rounded-lg bg-cover bg-center shadow-sm" style={{ backgroundImage: `url('${tour.image}')` }}></div>
                                     <div className="flex flex-col">
                                        <span className="text-sm font-black text-slate-800 dark:text-slate-100">{tour.title}</span>
                                        <span className="text-[10px] font-bold text-slate-400">{tour.id}</span>
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
                                  <span className="text-sm font-black text-slate-800 dark:text-slate-100">{formatPrice(tour.pricePerPerson || tour.price, true)}</span>
                               </td>
                               <td className="px-8 py-6">
                                  <select 
                                    value={tour.status || 'active'} 
                                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-emerald-600 outline-none cursor-pointer"
                                    onChange={(e) => {
                                      const updated = tours.map(t => t.id === tour.id ? { ...t, status: e.target.value } : t);
                                      saveTours(updated);
                                    }}
                                  >
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="paused">Paused</option>
                                  </select>
                               </td>
                               <td className="px-8 py-6 text-right">
                                  <div className="flex justify-end gap-2 text-slate-300">
                                     <Link to={`/admin/tours/edit/${tour.id}`} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 hover:text-[#0a6c75] transition-all">
                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                     </Link>
                                     <button onClick={() => handleDelete(tour.id)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                     </button>
                                  </div>
                               </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
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
