import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import categoriesData from '../data/categories.json';

const { 
  categories: DEFAULT_CATEGORIES, 
  presets: PRESETS, 
  meta: CATEGORY_META 
} = categoriesData;

const DISPLAY_NAMES = {
  destinations: 'Primary Destinations (Regions)',
  states: 'Indian States & Union Territories',
  subregions: 'Subregions & Cities',
  themes: 'Travel Themes',
  natures: 'Tour Nature',
  styles: 'Accommodation Styles',
  hotelCategories: 'Hotel Ratings',
  accommodationTypes: 'Stay Types',
  transports: 'Transport Modes'
};

const OBJECT_CATEGORIES = ['themes', 'hotelCategories', 'accommodationTypes', 'transports'];

// ─── Normalization Helpers (Synced with Discovery Page) ───
const normalizeBucket = (s) => {
    const val = String(s || "").toLowerCase().trim();
    if (val === 'kashmir' || val === 'jammu and kashmir' || val === 'jammu & kashmir') return 'jammu and kashmir';
    return val;
};

const displayState = (s) => {
    const val = normalizeBucket(s);
    if (val === 'jammu and kashmir') return 'Jammu and Kashmir';
    return String(s).trim();
};

const AdminCategorizationSettings = () => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [newItems, setNewItems] = useState({ 
    destinations: '', states: '', subregions: '', themes: '', natures: '', 
    styles: '', hotelCategories: '', accommodationTypes: '', transports: '' 
  });
  const [toastMsg, setToastMsg] = useState('');
  const [expandedKey, setExpandedKey] = useState('states');

  useEffect(() => {
    // Dynamically fetch the latest categories from the server
    fetch(`${import.meta.env.BASE_URL}data/categories.json?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        const payload = data.categories || data;
        if (payload) {
          setCategories({ ...DEFAULT_CATEGORIES, ...payload });
          localStorage.setItem('beautifulindia_admin_categories', JSON.stringify(payload));
        }
      })
      .catch(err => {
        console.error("Failed to fetch live categories:", err);
        // Fallback to localStorage if the fetch fails
        const saved = localStorage.getItem('beautifulindia_admin_categories');
        if (saved) {
          try {
            setCategories({ ...DEFAULT_CATEGORIES, ...JSON.parse(saved) });
          } catch (e) {
            console.error(e);
          }
        }
      });
  }, []);

  const saveCategories = (newCats) => {
    setCategories(newCats);
    localStorage.setItem('beautifulindia_admin_categories', JSON.stringify(newCats));
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleAdd = (key, value) => {
    let val = (value || newItems[key] || '').trim();
    if (!val) return;
    
    // Normalize if it's a state or destination
    if (key === 'states' || key === 'destinations') {
        val = displayState(val);
    }
    
    const currentList = categories[key] || [];
    const exists = currentList.some(item => {
      const itemVal = typeof item === 'string' ? item : item.label;
      if (key === 'states' || key === 'destinations') {
          return displayState(itemVal) === displayState(val);
      }
      return itemVal === val;
    });
    
    if (exists) { showToast(`⚠️ "${val}" already exists`); return; }
    
    let itemToAdd = val;
    if (OBJECT_CATEGORIES.includes(key)) {
      itemToAdd = { 
        value: val.toLowerCase().replace(/\s+/g, '_'), 
        label: val, 
        icon: '📍', 
        count: key === 'themes' ? '0 Packages' : undefined
      };
      if (key === 'hotelCategories') itemToAdd.icon = '⭐';
      if (key === 'accommodationTypes') itemToAdd.icon = '🏨';
      if (key === 'transports') itemToAdd.icon = '🚌';
    }
    
    const updated = { ...categories, [key]: [...currentList, itemToAdd] };
    saveCategories(updated);
    if (!value) setNewItems(prev => ({ ...prev, [key]: '' }));
    showToast(`✅ Added "${val}"`);
  };

  const handleRemove = (key, item) => {
    const itemValue = typeof item === 'string' ? item : item?.label || 'Item';
    const currentList = categories[key] || [];
    const updated = { ...categories, [key]: currentList.filter(i => 
      typeof i === 'string' ? i !== item : i.label !== itemValue
    ) };
    saveCategories(updated);
    showToast(`🗑️ Removed "${itemValue}"`);
  };

  const handleSync = () => {
    saveCategories(DEFAULT_CATEGORIES);
    showToast('♻️ Synced with system defaults');
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
          <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2">Categorization Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold italic">Manage destinations, themes, and travel configurations.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleSync} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-black text-slate-500 text-xs hover:border-teal-500 transition-all">
            <span className="material-symbols-outlined text-sm">sync</span> Reset
          </button>
          <button 
            onClick={async () => {
              try {
                const targetUrl = import.meta.env.MODE === 'development' ? '/api/save-categories' : `${import.meta.env.BASE_URL}api-save-categories.php`;
                const res = await fetch(targetUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(categories)
                });
                const result = await res.json();
                if (result.success) showToast('✅ Saved to system');
                else showToast('❌ System error');
              } catch (err) { showToast('❌ Connection error'); }
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0a6c75] text-white rounded-xl font-black hover:bg-[#085a62] transition-all text-sm shadow-lg shadow-teal-900/20"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            Save to System
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Object.keys(DEFAULT_CATEGORIES).map(key => {
          const meta = CATEGORY_META[key] || { icon: '📦', color: 'bg-slate-50', badge: 'bg-slate-100', desc: 'Category' };
          const preset = PRESETS[key] || { chips: [], label: 'Presets', icon: '✨' };
          const isOpen = expandedKey === key;
          const currentItems = categories[key] || [];

          return (
            <div key={key} className={`bg-white dark:bg-slate-900 rounded-[32px] border transition-all ${isOpen ? 'border-teal-100 dark:border-teal-900 ring-4 ring-teal-50 dark:ring-teal-900/10' : 'border-slate-100 dark:border-slate-800 shadow-sm'}`}>
              <button onClick={() => setExpandedKey(isOpen ? null : key)} className="w-full flex items-center justify-between p-6 text-left">
                <div className="flex items-center gap-4">
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{meta.icon}</span>
                  <div>
                    <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">{DISPLAY_NAMES[key] || key}</h2>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{meta.desc}</p>
                  </div>
                </div>
                <span className={`material-symbols-outlined text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
              </button>

              {isOpen && (
                <div className="px-6 pb-8 space-y-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex flex-wrap gap-2">
                    {currentItems.map((item, idx) => (
                      <span key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[11px] font-black text-slate-600 dark:text-slate-300">
                        {typeof item === 'string' ? item : item.label}
                        <button onClick={() => handleRemove(key, item)} className="hover:text-red-500"><span className="material-symbols-outlined text-sm">close</span></button>
                      </span>
                    ))}
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Add from presets</p>
                    <div className="flex flex-wrap gap-1.5">
                      {preset.chips.map(chip => (
                        <button 
                          key={chip} 
                          onClick={() => handleAdd(key, chip)}
                          className="px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-500 hover:border-teal-500 hover:text-teal-600 transition-all"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Custom title..."
                        value={newItems[key] || ''}
                        onChange={(e) => setNewItems(prev => ({ ...prev, [key]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd(key)}
                        className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-teal-500/20"
                      />
                      <button onClick={() => handleAdd(key)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Add</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminCategorizationSettings;
