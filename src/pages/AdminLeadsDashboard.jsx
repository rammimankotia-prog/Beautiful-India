import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminLeadsDashboard = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewChatLead, setViewChatLead] = useState(null);
    const [toastMsg, setToastMsg] = useState('');

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 3000);
    };

    const [dataSource, setDataSource] = useState('loading');

    const fetchLeads = async () => {
        setLoading(true);
        try {
            // Absolute path with cache-busting
            const res = await fetch(`/api-save-leads.php?t=${Date.now()}`, {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });

            if (res.ok) {
                const data = await res.json();
                const dataArray = Array.isArray(data) ? data : [];
                const sorted = dataArray.sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp));
                setLeads(sorted);
                setDataSource('server');
                localStorage.setItem('beautifulindia_admin_leads', JSON.stringify(sorted));
            } else {
                throw new Error(`Server returned ${res.status}`);
            }
        } catch (err) {
            console.error("Fetch leads error:", err);
            const saved = localStorage.getItem('beautifulindia_admin_leads');
            if (saved) {
                setLeads(JSON.parse(saved));
                setDataSource('cache');
            } else {
                setDataSource('error');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const saveLeadsLocally = (updatedLeads) => {
        setLeads(updatedLeads);
        localStorage.setItem('beautifulindia_admin_leads', JSON.stringify(updatedLeads));
    };

    const handleStatusUpdate = (id, newStatus) => {
        const updated = leads.map(l => l.id === id ? { ...l, status: newStatus } : l);
        saveLeadsLocally(updated);
        showToast(`Status updated to ${newStatus}`);
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this inquiry?")) {
            const updated = leads.filter(l => l.id !== id);
            saveLeadsLocally(updated);
            showToast("Inquiry deleted");
        }
    };

    const handleSync = async () => {
        try {
            const response = await fetch(`${import.meta.env.BASE_URL}api/save-leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leads)
            });
            if (response.ok) showToast("System updated!");
            else showToast("Stage for next update");
        } catch (error) {
            showToast("Stage for next update");
        }
    };

    const getSourceLabel = (lead) => {
        if (lead.source === 'Bharat Bot') return { label: 'Chatbot', icon: 'smart_toy', color: 'text-teal-600', bg: 'bg-teal-50' };
        if (lead.source === 'Bharat Darshan Page') return { label: 'Tour Inquiry', icon: 'explore', color: 'text-blue-600', bg: 'bg-blue-50' };
        if (lead.departureType) return { label: 'Quote Request', icon: 'request_quote', color: 'text-purple-600', bg: 'bg-purple-50' };
        return { label: 'Contact Form', icon: 'mail', color: 'text-slate-600', bg: 'bg-slate-50' };
    };

    const filteredLeads = leads.filter(l => {
        const matchesTab = activeTab === 'All' || l.status === activeTab;
        const q = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery || 
            (l.name && l.name.toLowerCase().includes(q)) || 
            (l.email && l.email.toLowerCase().includes(q)) || 
            (l.to && l.to.toLowerCase().includes(q));
        return matchesTab && matchesSearch;
    });

    return (
        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-500">
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
                    <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2">Leads & Queries</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold italic">Manage customer inquiries and bot conversations.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        dataSource === 'server' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-100 dark:border-emerald-900/30' 
                            : dataSource === 'cache'
                            ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-100 dark:border-amber-900/30'
                            : 'bg-red-50 dark:bg-red-950/20 text-red-600 border-red-100 dark:border-red-900/30'
                    }`}>
                        <span className="w-2 h-2 rounded-full animate-pulse bg-current"></span>
                        {dataSource === 'server' ? 'Server Live' : dataSource === 'cache' ? 'Local Cache' : 'Auth Error'}
                    </div>
                    <button onClick={handleSync} className="flex items-center gap-2 px-6 py-2.5 bg-[#0a6c75] text-white rounded-xl font-black hover:bg-[#085a62] transition-all text-sm shadow-lg shadow-teal-900/20">
                        <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                        Save to System
                    </button>
                    <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm ml-2">
                        {['All', 'New', 'Contacted', 'Closed'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 rounded-xl font-black text-xs transition-all ${activeTab === tab ? 'bg-[#0a6c75] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative group w-full max-w-2xl">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input 
                    type="text" 
                    placeholder="Search by name, email or destination..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:border-[#0a6c75] focus:ring-4 focus:ring-[#0a6c75]/5 outline-none transition-all font-bold text-slate-700 text-sm" 
                />
            </div>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0a6c75] rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold italic">Gathering inquiries...</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Source</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Profile</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filteredLeads.map(lead => {
                                const source = getSourceLabel(lead);
                                return (
                                    <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${source.bg} ${source.color}`}>
                                                <span className="material-symbols-outlined text-[18px]">{source.icon}</span>
                                                <span className="text-[11px] font-black uppercase tracking-tight">{source.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight mb-1">{lead.name || 'Anonymous'}</span>
                                                <span className="text-[10px] font-bold text-slate-400">{lead.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{lead.to || 'General'}</span>
                                                <span className="text-[10px] font-bold text-slate-400">{new Date(lead.createdAt || lead.timestamp).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <select 
                                                value={lead.status || 'New'}
                                                onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                                                className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-[#0a6c75] outline-none cursor-pointer"
                                            >
                                                <option value="New">New</option>
                                                <option value="Contacted">Contacted</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 text-slate-200">
                                                {lead.chatLog && (
                                                    <button onClick={() => setViewChatLead(lead)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 hover:text-[#0a6c75] transition-all">
                                                        <span className="material-symbols-outlined text-[20px]">forum</span>
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(lead.id)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Chat Modal */}
            {viewChatLead && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="px-8 py-6 bg-[#0a6c75] text-white flex justify-between items-center">
                            <h3 className="font-black text-lg uppercase tracking-tight">Conversation History</h3>
                            <button onClick={() => setViewChatLead(null)} className="hover:bg-white/20 p-2 rounded-xl transition-all">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc] space-y-4">
                            {viewChatLead.chatLog?.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm font-medium ${msg.sender === 'user' ? 'bg-[#0a6c75] text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLeadsDashboard;
