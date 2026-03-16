
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

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = () => {
        setLoading(true);
        const saved = localStorage.getItem('wanderlust_admin_leads');
        if (saved) {
            try {
                setLeads(JSON.parse(saved));
                setLoading(false);
                return;
            } catch (e) {
                console.error("Parse error:", e);
            }
        }

        fetch(`${import.meta.env.BASE_URL}data/leads.json`)
            .then(res => res.json())
            .then(data => {
                const dataArray = Array.isArray(data) ? data : [];
                const sorted = dataArray.sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp));
                setLeads(sorted);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch leads error:", err);
                setLoading(false);
            });
    };

    const saveLeadsLocally = (updatedLeads) => {
        setLeads(updatedLeads);
        localStorage.setItem('wanderlust_admin_leads', JSON.stringify(updatedLeads));
    };

    const handleStatusUpdate = (id, newStatus) => {
        const updated = leads.map(l => l.id === id ? { ...l, status: newStatus } : l);
        saveLeadsLocally(updated);
        showToast(`Status updated to ${newStatus}`);
    };

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
        const updated = leads.filter(l => l.id !== id);
        saveLeadsLocally(updated);
        showToast("Inquiry deleted");
    };

    const handleSync = async () => {
        try {
            const response = await fetch(`${import.meta.env.BASE_URL}api/save-leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leads)
            });
            if (response.ok) {
                showToast("System updated successfully!");
            } else {
                console.warn("API for saving leads not found, changes are kept in session.");
                showToast("Changes staged for next system update.");
            }
        } catch (error) {
            console.error("Sync error:", error);
            showToast("Changes staged for next system update.");
        }
    };

    const getSourceLabel = (lead) => {
        if (lead.source === 'Wanderbot') return { label: 'Chatbot', icon: 'smart_toy', color: 'text-teal-600', bg: 'bg-teal-50' };
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
            (l.phone && l.phone.toLowerCase().includes(q)) ||
            (l.to && l.to.toLowerCase().includes(q));
        return matchesTab && matchesSearch;
    });

    const exportToCSV = () => {
        if (filteredLeads.length === 0) return alert("No leads to export");
        const headers = ["Name", "Email", "Phone", "Source", "Destination", "Status", "Date"];
        const rows = filteredLeads.map(l => [
            l.name || 'N/A', 
            l.email || 'N/A', 
            l.phone || 'N/A', 
            getSourceLabel(l).label, 
            l.to || 'N/A', 
            l.status || 'New', 
            new Date(l.createdAt || l.timestamp).toLocaleDateString()
        ]);
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `leads_and_queries_${new Date().toISOString().split('T')[0]}.csv`);
        link.click();
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
             {/* Sidebar Navigation */}
            <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col hidden md:flex">
                <div className="p-8">
                    <Link to="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0a6c75] rounded-xl flex items-center justify-center shadow-lg">
                            <span className="material-symbols-outlined text-white">leaderboard</span>
                        </div>
                        <span className="font-black text-xl tracking-tighter uppercase text-slate-800">Admin</span>
                    </Link>
                </div>
                <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/overview">
                        <span className="material-symbols-outlined text-[20px] text-slate-500">space_dashboard</span>
                        <span className="text-[15px] font-medium">Overview</span>
                    </Link>
                    <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/tours">
                        <span className="material-symbols-outlined text-[20px] text-slate-500">tour</span>
                        <span className="text-[15px] font-medium">Manage Tours</span>
                    </Link>
                    <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] bg-[#eefaf9] text-[#0a6c75] transition-colors" to="/admin/leads">
                        <span className="material-symbols-outlined text-[20px] text-[#0a6c75]">leaderboard</span>
                        <span className="text-[15px] font-medium">Leads & Queries</span>
                    </Link>
                    <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/bookings">
                        <span className="material-symbols-outlined text-[20px] text-slate-500">group</span>
                        <span className="text-[15px] font-medium">Bookings</span>
                    </Link>
                    <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/guides">
                        <span className="material-symbols-outlined text-[20px] text-slate-500">map</span>
                        <span className="text-[15px] font-medium">Guides</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-10">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Leads & Queries</h1>
                            <p className="text-slate-500 font-bold italic">Consolidated view of all customer inquiries and bot conversations.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handleSync}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#0a6c75] text-white rounded-xl font-black hover:bg-[#085a62] transition-all text-sm shadow-lg shadow-teal-900/20"
                            >
                                <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                                Save to System
                            </button>
                            <button 
                                onClick={exportToCSV}
                                className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-black text-slate-700 hover:bg-slate-50 transition-all text-sm shadow-sm"
                            >
                                <span className="material-symbols-outlined text-[20px]">download</span>
                                Export CSV
                            </button>
                            <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm ml-2">
                                {['All', 'New', 'Contacted', 'Closed'].map(tab => (
                                    <button 
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-5 py-2 rounded-xl font-black text-xs transition-all ${activeTab === tab ? 'bg-[#0a6c75] text-white shadow-lg shadow-teal-700/20' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative group w-full mb-10">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input 
                            type="text" 
                            placeholder="Search leads, names, emails..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:bg-white focus:border-[#0a6c75] focus:ring-4 focus:ring-[#0a6c75]/5 outline-none transition-all font-bold text-slate-700 text-sm" 
                        />
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="h-96 flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-bold italic">Gathering all your inquiries...</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-8 py-5 text-slate-400 font-black uppercase text-[10px] tracking-widest">Inquiry Source</th>
                                        <th className="px-8 py-5 text-slate-400 font-black uppercase text-[10px] tracking-widest">Customer Profile</th>
                                        <th className="px-8 py-5 text-slate-400 font-black uppercase text-[10px] tracking-widest">Interest Details</th>
                                        <th className="px-8 py-5 text-slate-400 font-black uppercase text-[10px] tracking-widest">Lead Status</th>
                                        <th className="px-8 py-5 text-slate-400 font-black uppercase text-[10px] tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredLeads.map(lead => {
                                        const source = getSourceLabel(lead);
                                        return (
                                            <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${source.bg} ${source.color}`}>
                                                        <span className="material-symbols-outlined text-[18px]">{source.icon}</span>
                                                        <span className="text-[11px] font-black uppercase tracking-tight">{source.label}</span>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-slate-400 mt-2 px-1">
                                                        {new Date(lead.createdAt || lead.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-base font-black text-slate-800 leading-tight mb-1">{lead.name || 'Anonymous Explorer'}</span>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-sm">mail</span>
                                                                {lead.email || 'No email'}
                                                            </span>
                                                            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-sm">call</span>
                                                                {lead.phone || 'No phone'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-sm text-[#0a6c75]">pin_drop</span>
                                                            <span className="text-sm font-black text-slate-700">{lead.to || 'General Inquiry'}</span>
                                                        </div>
                                                        {lead.departureDate && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-sm text-slate-400">calendar_month</span>
                                                                <span className="text-[11px] font-bold text-slate-400">{lead.departureDate} ({lead.duration})</span>
                                                            </div>
                                                        )}
                                                        {lead.userInterest && (
                                                            <span className="text-[11px] font-bold text-slate-400">Interest: {lead.userInterest}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <select 
                                                        value={lead.status || 'New'}
                                                        onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                                                        className={`px-4 py-2 rounded-xl font-black text-[11px] outline-none border transition-all ${
                                                            lead.status === 'New' || !lead.status ? 'border-blue-100 bg-blue-50 text-blue-600' :
                                                            lead.status === 'Contacted' ? 'border-orange-100 bg-orange-50 text-orange-600' :
                                                            'border-slate-100 bg-slate-100 text-slate-400'
                                                        }`}
                                                    >
                                                        <option value="New">NEW Inquiry</option>
                                                        <option value="Contacted">CONTACTED</option>
                                                        <option value="Closed">CLOSED</option>
                                                    </select>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-2 text-slate-300">
                                                        {lead.chatLog && (
                                                            <button 
                                                                onClick={() => setViewChatLead(lead)}
                                                                className="w-10 h-10 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all flex items-center justify-center border border-transparent hover:border-teal-100"
                                                                title="View Bot Conversation"
                                                            >
                                                                <span className="material-symbols-outlined text-[22px]">forum</span>
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => handleDelete(lead.id)}
                                                            className="w-10 h-10 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center border border-transparent hover:border-red-100"
                                                            title="Delete Inquiry"
                                                        >
                                                            <span className="material-symbols-outlined text-[22px]">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            
                            {!filteredLeads.length && (
                                <div className="p-24 text-center flex flex-col items-center gap-4">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                                        <span className="material-symbols-outlined text-4xl text-slate-200">drafts</span>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800">No matching inquiries</h3>
                                    <p className="text-slate-400 font-bold italic">Try adjusting your filters or search query.</p>
                                    <button 
                                        onClick={() => { setActiveTab('All'); setSearchQuery(''); }}
                                        className="mt-4 px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-black text-sm hover:bg-slate-200 transition-all"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Chat Log Modal */}
            {viewChatLead && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[85vh] border border-slate-200">
                        <div className="px-8 py-6 bg-[#0a6c75] text-white flex justify-between items-center z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <span className="material-symbols-outlined">smart_toy</span>
                                </div>
                                <div>
                                    <h3 className="font-black text-lg leading-tight uppercase tracking-tight">WanderBot History</h3>
                                    <p className="text-[12px] font-bold text-teal-100 opacity-80">{viewChatLead.name}</p>
                                </div>
                            </div>
                            <button onClick={() => setViewChatLead(null)} className="hover:bg-white/20 transition-colors w-10 h-10 rounded-xl flex justify-center items-center">
                                <span className="material-symbols-outlined text-[24px]">close</span>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc] flex flex-col gap-6">
                            {viewChatLead.chatLog?.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`
                                        max-w-[85%] px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-sm
                                        ${msg.sender === 'user' 
                                            ? 'bg-[#0a6c75] text-white rounded-tr-sm font-medium' 
                                            : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm font-medium'
                                        }
                                    `}>
                                        <div className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${msg.sender === 'user' ? 'text-teal-200' : 'text-slate-400'}`}>
                                            {msg.sender === 'user' ? 'Visitor' : 'WanderBot'}
                                        </div>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            {toastMsg && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
                    <div className="bg-slate-900/90 text-white px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border border-white/10">
                        <span className="material-symbols-outlined text-teal-400">check_circle</span>
                        <span className="font-black text-sm tracking-wide">{toastMsg}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLeadsDashboard;
