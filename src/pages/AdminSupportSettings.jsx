import React, { useState, useEffect } from 'react';
import settingsData from '../data/settings.json';

const AdminSupportSettings = () => {
    const [settings, setSettings] = useState(settingsData);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        // Fetch latest from API
        fetch(`${import.meta.env.BASE_URL}api-save-settings.php`)
            .then(res => res.json())
            .then(data => {
                if (data && data.whatsapp) setSettings(data);
            })
            .catch(() => {});
    }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const targetUrl = import.meta.env.MODE === 'development' ? '/api/save-settings' : `${import.meta.env.BASE_URL}api-save-settings.php`;
            const res = await fetch(targetUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...settings,
                    lastUpdated: new Date().toISOString()
                })
            });
            const result = await res.json();
            if (result.success) showToast('✅ Support settings synchronized across platform');
            else showToast('❌ Failed to save settings');
        } catch (err) {
            showToast('❌ Connection error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 lg:p-12 max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2">Support & Bot Intelligence</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold italic">Centralized intelligence and contact configuration for Bharat Darshan.</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
                >
                    {isSaving ? 'Synchronizing...' : 'Save & Sync Everywhere'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Global Contact Info */}
                <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined">contact_support</span>
                        </div>
                        <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Global Contact Hub</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary WhatsApp Number</label>
                            <input 
                                type="text"
                                value={settings.whatsapp}
                                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="+91 XXXX XXX XXX"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Support Email ID</label>
                            <input 
                                type="email"
                                value={settings.supportEmail}
                                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="support@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Support Phone</label>
                            <input 
                                type="text"
                                value={settings.supportPhone}
                                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Office Address</label>
                            <textarea 
                                value={settings.officeAddress}
                                onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all h-24 resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Bot Persona Settings */}
                <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined">smart_toy</span>
                        </div>
                        <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Bot Intelligence & Persona</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bot Name</label>
                            <input 
                                type="text"
                                value={settings.botName}
                                onChange={(e) => setSettings({ ...settings, botName: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Core Persona Description</label>
                            <p className="text-[9px] text-slate-400 font-bold mb-2 uppercase">Defines how the bot interacts with guests.</p>
                            <textarea 
                                value={settings.botPersona}
                                onChange={(e) => setSettings({ ...settings, botPersona: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all h-32 resize-none"
                            />
                        </div>

                        <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 text-center">
                             <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
                             </div>
                             <h4 className="text-[12px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest mb-1">Intelligence Module</h4>
                             <p className="text-[10px] text-slate-400 font-bold italic">The Matchmaking Engine is currently active and scanning the full Flagship Catalog.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-10 right-10 animate-in slide-in-from-bottom duration-300 z-[100]">
                    <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
                        <span className="material-symbols-outlined text-green-400 text-sm">verified</span>
                        <span className="text-[11px] font-black uppercase tracking-widest">{toast.msg}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSupportSettings;
