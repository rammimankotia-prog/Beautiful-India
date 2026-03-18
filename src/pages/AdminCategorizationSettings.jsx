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
  states: 'States & Countries',
  subregions: 'Subregions & Cities',
  themes: 'Travel Themes',
  natures: 'Tour Nature',
  styles: 'Accommodation Styles',
  hotelCategories: 'Hotel Ratings',
  accommodationTypes: 'Stay Types',
  transports: 'Transport Modes'
};

const OBJECT_CATEGORIES = ['themes', 'hotelCategories', 'accommodationTypes', 'transports'];

const SidebarLink = ({ to, icon, label, active }) => (
  <Link
    className={`flex items-center gap-3.5 px-4 py-3 rounded-[10px] transition-colors ${active ? 'bg-[#eefaf9] text-[#0a6c75]' : 'text-slate-600 hover:bg-slate-50'}`}
    to={to}
  >
    <span className={`material-symbols-outlined text-[20px] ${active ? 'text-[#0a6c75]' : 'text-slate-500'}`}>{icon}</span>
    <span className="text-[15px] font-medium">{label}</span>
  </Link>
);

const AdminCategorizationSettings = () => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [newItems, setNewItems] = useState({ 
    destinations: '', states: '', subregions: '', themes: '', natures: '', 
    styles: '', hotelCategories: '', accommodationTypes: '', transports: '' 
  });
  const [toastMsg, setToastMsg] = useState('');
  const [expandedKey, setExpandedKey] = useState('states'); // open states by default

  useEffect(() => {
    const saved = localStorage.getItem('beautifulindia_admin_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCategories({ ...DEFAULT_CATEGORIES, ...parsed });
      } catch (e) { console.error(e); }
    }
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
    const val = (value || newItems[key] || '').trim();
    if (!val) return;
    
    // Check if exists (handle both string and object arrays)
    const currentList = categories[key] || [];
    const exists = currentList.some(item => 
      typeof item === 'string' ? item === val : item.value === val || item.label === val
    );
    
    if (exists) { showToast(`⚠️ "${val}" already exists`); return; }
    
    let itemToAdd = val;
    if (OBJECT_CATEGORIES.includes(key)) {
      itemToAdd = { 
        value: val.toLowerCase().replace(/\s+/g, '_'), 
        label: val, 
        icon: '📍', 
        count: key === 'themes' ? '0 Packages' : undefined
      };
      
      // Special icons for specific object types if known
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
    <div data-page="admin_categorization_settings" className="min-h-screen bg-slate-50 flex flex-col">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-slate-900/95 backdrop-blur-md text-white text-sm font-bold px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 transition-all duration-300 transform translate-y-0 scale-100">
          <span className="material-symbols-outlined text-emerald-400">info</span>
          {toastMsg}
        </div>
      )}

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex-col hidden md:flex">
          <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
            <SidebarLink to="/admin/overview" icon="space_dashboard" label="Overview" />
            <SidebarLink to="/admin/tours" icon="tour" label="Manage Tours" />
            <SidebarLink to="/admin/bookings" icon="group" label="Bookings" />
            <SidebarLink to="/admin/guides" icon="menu_book" label="Guides & Blogs" />
            <SidebarLink to="/admin/categorization" icon="category" label="Categorization" active />
            <SidebarLink to="/referral/dashboard" icon="payments" label="Financials" />
            <SidebarLink to="/admin/queries" icon="contact_support" label="Queries" />
            <SidebarLink to="/admin/leads" icon="smart_toy" label="Chatbot Leads" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-5xl mx-auto space-y-8 pb-20">

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <nav className="flex text-xs font-medium text-slate-400 mb-2 gap-2 items-center">
                  <Link className="hover:text-primary" to="/admin">Admin</Link>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span className="text-slate-600">Categorization</span>
                </nav>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Categorization Settings</h1>
                <p className="text-slate-500 mt-1 text-sm font-medium">Manage destinations, themes, and tour nature settings.</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="flex gap-3">
                  <button
                    onClick={handleSync}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl shadow-sm hover:border-primary hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">sync</span> Reset to Defaults
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
                        if (result.success) {
                          showToast('✅ Saved successfully to categories.json');
                        } else {
                          showToast('❌ Error saving system configuration');
                          console.error('Save error:', result.error);
                        }
                      } catch (err) {
                        showToast('❌ Error connecting to the server');
                        console.error('Fetch error:', err);
                      }
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-[20px]">check_circle</span> Save to System
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-medium italic">Saves permanently to categories.json</p>
              </div>
            </div>

            {/* How it works banner */}
            <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 flex items-start gap-4">
              <span className="material-symbols-outlined text-primary text-3xl mt-0.5">help</span>
              <div>
                <p className="font-bold text-teal-800 text-sm mb-1">How this works</p>
                <p className="text-teal-700 text-[13px] leading-relaxed">
                  Adding or removing items here updates your local browser immediately. To make these changes <strong>permanent</strong> for all users, click "Save to System" and then ask me to commit the changes.
                </p>
              </div>
            </div>

            {/* Category Panels */}
            {Object.keys(DEFAULT_CATEGORIES).map(key => {
              const meta = CATEGORY_META[key] || { icon: '📦', color: 'bg-slate-50', badge: 'bg-slate-100', desc: 'Category' };
              const preset = PRESETS[key] || { chips: [], label: 'Presets', icon: '✨' };
              const isOpen = expandedKey === key;
              const currentItems = categories[key] || [];

              return (
                <div key={key} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
                  <button
                    onClick={() => setExpandedKey(isOpen ? null : key)}
                    className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{meta.icon}</span>
                      <div>
                        <h2 className="text-base font-bold text-slate-900">{DISPLAY_NAMES[key] || key}</h2>
                        <p className="text-xs text-slate-400 mt-0.5">{meta.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${meta.badge}`}>
                        {currentItems.length} items
                      </span>
                      <span className="material-symbols-outlined text-slate-400 text-[22px] transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                        expand_more
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100">
                      <div className="px-6 pt-5 pb-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Live Items</p>
                        {currentItems.length === 0 ? (
                          <div className="border-2 border-dashed border-slate-100 rounded-2xl p-8 text-center">
                            <p className="text-sm text-slate-400 italic">Empty. Choose from presets below.</p>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {currentItems.map((item, idx) => (
                              <span
                                key={idx}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${meta.color} shadow-sm transition-all`}
                              >
                                {typeof item === 'string' ? item : (
                                  <>
                                    <span className="opacity-80">{item.icon}</span>
                                    <span>{item.label}</span>
                                  </>
                                )}
                                <button
                                  onClick={() => handleRemove(key, item)}
                                  className="hover:bg-red-500 hover:text-white rounded-lg p-0.5 transition-all -mr-1"
                                >
                                  <span className="material-symbols-outlined text-[16px] block">close</span>
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="px-6 pb-6 bg-slate-50/30 border-t border-slate-100 pt-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Add Presets</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {preset.chips.map(chip => {
                            const alreadyAdded = currentItems.some(i => 
                              typeof i === 'string' ? i === chip : i.value === chip || i.label === chip
                            );
                            return (
                              <button
                                key={chip}
                                onClick={() => !alreadyAdded && handleAdd(key, chip)}
                                disabled={alreadyAdded}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                                  alreadyAdded
                                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-default opacity-60'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary hover:shadow-md active:scale-95'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[16px]">{alreadyAdded ? 'check' : 'add'}</span>
                                {chip}
                              </button>
                            );
                          })}
                        </div>

                        <div className="flex gap-2 items-center bg-white p-2 rounded-2xl border border-slate-200 shadow-inner group-focus-within:border-primary">
                          <input
                            type="text"
                            placeholder={`Define custom ${DISPLAY_NAMES[key] || key}…`}
                            value={newItems[key] || ''}
                            onChange={(e) => setNewItems(prev => ({ ...prev, [key]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd(key)}
                            className="flex-1 px-4 py-2 text-sm focus:outline-none bg-transparent"
                          />
                          <button
                            onClick={() => handleAdd(key)}
                            disabled={!(newItems[key] || '').trim()}
                            className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 disabled:opacity-20 transition-all active:scale-95"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminCategorizationSettings;
