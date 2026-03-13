import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ── These defaults MUST stay in sync with BharatDarshanPage.jsx and the tour upload form ──
const DEFAULT_CATEGORIES = {
  destinations: ['India', 'International', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania'],
  states: [
    'Himachal Pradesh', 'Kashmir', 'Rajasthan', 'Kerala', 'Ladakh', 'Goa',
    'Uttarakhand', 'Andaman Islands', 'Sikkim', 'Assam', 'Meghalaya',
    'Arunachal Pradesh', 'Karnataka', 'Tamil Nadu', 'Maharashtra',
    'Gujarat', 'Madhya Pradesh', 'Uttar Pradesh', 'West Bengal', 'Jammu'
  ],
  subregions: [
    'Shimla', 'Manali', 'Dharamshala', 'Kasol', 'Spiti Valley', 'Kullu',
    'Srinagar', 'Gulmarg', 'Pahalgam', 'Sonamarg',
    'Jaipur', 'Udaipur', 'Jaisalmer', 'Jodhpur',
    'Munnar', 'Alleppey', 'Wayanad', 'Kovalam',
    'Leh', 'Pangong Lake', 'Nubra Valley',
    'North Goa', 'South Goa',
    'Rishikesh', 'Haridwar', 'Nainital', 'Mussoorie',
    'Port Blair', 'Havelock Island', 'Neil Island'
  ],
  themes: ['honeymoon', 'family', 'solo', 'group', 'adventure', 'pilgrimage', 'photography', 'luxury', 'trekking', 'beach', 'wildlife', 'cultural'],
  natures: ['group', 'private', 'self-drive', 'cruise', 'solo', 'honeymoon'],
  styles: ['budget', 'standard', 'comfort', 'luxury', 'ultra-luxury']
};

// Preset chips for one-click adding — so you never have to type common values
const PRESETS = {
  destinations: {
    label: 'Common Regions',
    icon: '🌍',
    chips: ['India', 'International', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania']
  },
  states: {
    label: 'Bharat Darshan Destinations',
    icon: '📍',
    chips: [
      'Himachal Pradesh', 'Kashmir', 'Rajasthan', 'Kerala', 'Ladakh',
      'Goa', 'Uttarakhand', 'Andaman Islands', 'Sikkim', 'Assam',
      'Meghalaya', 'Arunachal Pradesh', 'Karnataka', 'Tamil Nadu',
      'Maharashtra', 'Gujarat', 'West Bengal', 'Jammu', 'Puducherry'
    ]
  },
  subregions: {
    label: 'Popular Cities & Spots',
    icon: '🏙️',
    chips: [
      'Shimla', 'Manali', 'Dharamshala', 'Kasol', 'Spiti Valley',
      'Srinagar', 'Gulmarg', 'Pahalgam',
      'Jaipur', 'Udaipur', 'Jaisalmer',
      'Munnar', 'Alleppey', 'Wayanad',
      'Leh', 'Pangong Lake', 'Nubra Valley',
      'Rishikesh', 'Haridwar', 'Nainital',
      'Port Blair', 'Havelock Island',
      'Gangtok', 'Darjeeling'
    ]
  },
  themes: {
    label: 'Homepage Theme Tiles',
    icon: '🏷️',
    chips: ['honeymoon', 'family', 'solo', 'group', 'adventure', 'pilgrimage', 'photography', 'luxury', 'trekking', 'beach', 'wildlife', 'cultural']
  },
  natures: {
    label: 'Tour Nature',
    icon: '🤝',
    chips: ['group', 'private', 'self-drive', 'cruise', 'solo', 'honeymoon']
  },
  styles: {
    label: 'Accommodation Tiers',
    icon: '🏨',
    chips: ['budget', 'standard', 'comfort', 'luxury', 'ultra-luxury']
  }
};

const CATEGORY_META = {
  destinations: { icon: '🌍', color: 'bg-blue-50 border-blue-200 text-blue-700', badge: 'bg-blue-100 text-blue-700', desc: 'Top-level world regions (India, Europe, Asia…)' },
  states:       { icon: '📍', color: 'bg-teal-50 border-teal-200 text-teal-700', badge: 'bg-teal-100 text-teal-700', desc: 'Indian states & international countries — drives homepage destination chips' },
  subregions:   { icon: '🏙️', color: 'bg-emerald-50 border-emerald-200 text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', desc: 'Cities and local highlights within each state' },
  themes:       { icon: '🏷️', color: 'bg-purple-50 border-purple-200 text-purple-700', badge: 'bg-purple-100 text-purple-700', desc: 'Travel themes — drives "Travel by Theme" section on homepage' },
  natures:      { icon: '🤝', color: 'bg-amber-50 border-amber-200 text-amber-700', badge: 'bg-amber-100 text-amber-700', desc: 'Tour group types (Group, Solo, Honeymoon…)' },
  styles:       { icon: '🏨', color: 'bg-pink-50 border-pink-200 text-pink-700', badge: 'bg-pink-100 text-pink-700', desc: 'Accommodation tiers (Budget → Ultra-Luxury)' }
};

const DISPLAY_NAMES = {
  destinations: 'Primary Destinations (Regions)',
  states: 'States & Countries',
  subregions: 'Subregions & Cities',
  themes: 'Travel Themes',
  natures: 'Tour Nature',
  styles: 'Accommodation Styles'
};

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
  const [newItems, setNewItems] = useState({ destinations: '', states: '', subregions: '', themes: '', natures: '', styles: '' });
  const [toastMsg, setToastMsg] = useState('');
  const [expandedKey, setExpandedKey] = useState('states'); // open states by default

  useEffect(() => {
    const saved = localStorage.getItem('wanderlust_admin_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCategories({ ...DEFAULT_CATEGORIES, ...parsed });
      } catch (e) { console.error(e); }
    }
  }, []);

  const saveCategories = (newCats) => {
    setCategories(newCats);
    localStorage.setItem('wanderlust_admin_categories', JSON.stringify(newCats));
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleAdd = (key, value) => {
    const val = (value || newItems[key]).trim();
    if (!val) return;
    if (categories[key].includes(val)) { showToast(`"${val}" already exists`); return; }
    const updated = { ...categories, [key]: [...categories[key], val] };
    saveCategories(updated);
    if (!value) setNewItems(prev => ({ ...prev, [key]: '' }));
    showToast(`✅ Added "${val}"`);
  };

  const handleRemove = (key, item) => {
    const updated = { ...categories, [key]: categories[key].filter(i => i !== item) };
    saveCategories(updated);
    showToast(`🗑️ Removed "${item}"`);
  };

  const handleSync = () => {
    saveCategories(DEFAULT_CATEGORIES);
    showToast('✅ Synced all categories with Bharat Darshan defaults');
  };

  return (
    <div data-page="admin_categorization_settings" className="min-h-screen bg-slate-50">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[999] bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-2xl animate-pulse">
          {toastMsg}
        </div>
      )}

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex-col hidden md:flex">
          <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
            <SidebarLink to="/admin/overview" icon="space_dashboard" label="Overview" />
            <SidebarLink to="/admin/tours" icon="tour" label="Manage Tours" />
            <SidebarLink to="/admin/bookings" icon="group" label="Bookings" />
            <SidebarLink to="/admin/guides" icon="map" label="Guides" />
            <SidebarLink to="/admin/guides/new" icon="edit_document" label="Write a Blog" />
            <SidebarLink to="/admin/categorization" icon="category" label="Categorization" active />
            <SidebarLink to="/referral/dashboard" icon="payments" label="Financials" />
            <SidebarLink to="/admin/queries" icon="contact_support" label="Queries" />
            <SidebarLink to="/admin/leads" icon="smart_toy" label="Chatbot Leads" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-5xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <nav className="flex text-xs font-medium text-slate-400 mb-2 gap-2 items-center">
                  <Link className="hover:text-primary" to="/admin">Admin</Link>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span className="text-slate-600">Categorization</span>
                </nav>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Categorization Settings</h1>
                <p className="text-slate-500 mt-1 text-sm font-medium">Manage all lookup options that drive homepage filters, tour upload form, and discovery pages.</p>
              </div>
              <div className="flex gap-3">
                <Link to="/admin/tours/new" className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">add</span> Upload Tour
                </Link>
                <button
                  onClick={handleSync}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl shadow-sm hover:border-primary hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">sync</span> Sync Defaults
                </button>
              </div>
            </div>

            {/* How it works banner */}
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-5 flex items-start gap-4">
              <span className="material-symbols-outlined text-primary text-3xl mt-0.5">tips_and_updates</span>
              <div>
                <p className="font-bold text-teal-800 text-sm mb-1">How this connects to your homepage</p>
                <p className="text-teal-700 text-[13px] leading-relaxed">
                  <strong>States & Countries</strong> populate the Bharat Darshan destination chips on your homepage. &nbsp;
                  <strong>Travel Themes</strong> drive the "Travel by Theme" section. &nbsp;
                  All values here are the same ones shown in the <strong>Tour Upload Form</strong>. Syncing keeps everything consistent.
                </p>
              </div>
            </div>

            {/* Category Panels */}
            {Object.keys(DEFAULT_CATEGORIES).map(key => {
              const meta = CATEGORY_META[key];
              const preset = PRESETS[key];
              const isOpen = expandedKey === key;

              return (
                <div key={key} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Panel Header — click to expand */}
                  <button
                    onClick={() => setExpandedKey(isOpen ? null : key)}
                    className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50/80 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{meta.icon}</span>
                      <div>
                        <h2 className="text-base font-bold text-slate-900">{DISPLAY_NAMES[key]}</h2>
                        <p className="text-xs text-slate-400 mt-0.5">{meta.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${meta.badge}`}>
                        {categories[key].length} items
                      </span>
                      <span className="material-symbols-outlined text-slate-400 text-[22px] transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                        expand_more
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100">
                      {/* Current Items as chips */}
                      <div className="px-6 pt-5 pb-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Current Values</p>
                        {categories[key].length === 0 ? (
                          <p className="text-sm text-slate-400 italic border border-dashed border-slate-200 rounded-xl py-5 text-center">
                            No items yet. Add from presets below or type your own.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {categories[key].map((item, idx) => (
                              <span
                                key={idx}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${meta.color}`}
                              >
                                {item}
                                <button
                                  onClick={() => handleRemove(key, item)}
                                  className="hover:bg-red-100 hover:text-red-600 rounded-full p-0.5 transition-colors ml-0.5"
                                  title={`Remove ${item}`}
                                >
                                  <span className="material-symbols-outlined text-[14px] block">close</span>
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Preset Quick-Add Row */}
                      <div className="px-6 pb-4 bg-slate-50/60 border-t border-slate-100 pt-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                          {preset.icon} {preset.label} — click to add
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {preset.chips.map(chip => {
                            const alreadyAdded = categories[key].includes(chip);
                            return (
                              <button
                                key={chip}
                                onClick={() => !alreadyAdded && handleAdd(key, chip)}
                                disabled={alreadyAdded}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                                  alreadyAdded
                                    ? 'bg-primary/10 text-primary border-primary/30 cursor-default'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary hover:bg-primary/5 cursor-pointer'
                                }`}
                              >
                                {alreadyAdded && <span className="material-symbols-outlined text-[14px]">check</span>}
                                {!alreadyAdded && <span className="material-symbols-outlined text-[14px]">add</span>}
                                {chip}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom Add Input */}
                      <div className="px-6 pb-5">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Add Custom Value</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder={`Type a new ${DISPLAY_NAMES[key].toLowerCase().replace(/s$/, '').split(' ').pop()}…`}
                            value={newItems[key]}
                            onChange={(e) => setNewItems(prev => ({ ...prev, [key]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd(key)}
                            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                          />
                          <button
                            onClick={() => handleAdd(key)}
                            disabled={!newItems[key].trim()}
                            className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[18px]">add</span> Add
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

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-pulse { animation: slideInUp 0.3s ease; }
      `}} />
    </div>
  );
};

export default AdminCategorizationSettings;
