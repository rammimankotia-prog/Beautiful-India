import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminLeadsDashboard = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewLead, setViewLead] = useState(null);   // Full details drawer
    const [toastMsg, setToastMsg] = useState('');

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 3000);
    };

    const [dataSource, setDataSource] = useState('loading');

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/leads?t=${Date.now()}`, {
                headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'Expires': '0' }
            });
            if (!res.ok) throw new Error(`Server returned ${res.status}`);
            const text = await res.text();
            // Guard against HTML responses (SPA fallback)
            if (text.trim().startsWith('<')) throw new Error('Received HTML instead of JSON');
            const data = JSON.parse(text);
            const dataArray = Array.isArray(data) ? data : [];
            const sorted = dataArray.sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp));
            setLeads(sorted);
            setDataSource('server');
            localStorage.setItem('beautifulindia_admin_leads', JSON.stringify(sorted));
        } catch (err) {
            console.error("Fetch leads error:", err);
            const saved = localStorage.getItem('beautifulindia_admin_leads');
            if (saved) { setLeads(JSON.parse(saved)); setDataSource('cache'); }
            else { setDataSource('error'); }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLeads(); }, []);

    const saveLeadsLocally = (updatedLeads) => {
        setLeads(updatedLeads);
        localStorage.setItem('beautifulindia_admin_leads', JSON.stringify(updatedLeads));
    };

    const handleStatusUpdate = (id, newStatus) => {
        const updated = leads.map(l => l.id === id ? { ...l, status: newStatus } : l);
        saveLeadsLocally(updated);
        // Also update drawer if open
        if (viewLead && viewLead.id === id) setViewLead(prev => ({ ...prev, status: newStatus }));
        showToast(`Status updated to ${newStatus}`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this inquiry permanently? This cannot be undone.")) return;
        // Optimistic UI update first
        const prevLeads = [...leads];
        const updated = leads.filter(l => l.id !== id);
        setLeads(updated);
        localStorage.setItem('beautifulindia_admin_leads', JSON.stringify(updated));
        if (viewLead && viewLead.id === id) setViewLead(null);
        try {
            const res = await fetch(`/api/leads?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
            const text = await res.text();
            // Guard against HTML (SPA fallback)
            if (text.trim().startsWith('<')) throw new Error('API route not found - received HTML');
            const result = JSON.parse(text);
            if (result.success) {
                showToast("✓ Lead deleted from server");
                fetchLeads(); // re-sync from server
            } else {
                throw new Error(result.message || 'Delete failed on server');
            }
        } catch (err) {
            console.error("Delete error:", err);
            // Rollback optimistic update
            setLeads(prevLeads);
            localStorage.setItem('beautifulindia_admin_leads', JSON.stringify(prevLeads));
            showToast("Delete failed: " + err.message);
        }
    };

    const handleSync = async () => {
        try {
            const response = await fetch(`/api/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leads)
            });
            if (response.ok) showToast("System updated!");
            else showToast("Sync failed");
        } catch (error) {
            showToast("Sync error");
        }
    };

    const getSourceLabel = (lead) => {
        const s = lead.source || '';
        if (s === 'Bharat Bot' || s === 'BharatBot Popup') return { label: 'Chatbot', icon: 'smart_toy', color: 'text-teal-600', bg: 'bg-teal-50' };
        if (s === 'Contact Us Page') return { label: 'Contact Page', icon: 'contact_mail', color: 'text-indigo-600', bg: 'bg-indigo-50' };
        if (s === 'Home Page Widget' || s === 'Floating Widget') return { label: 'Home Widget', icon: 'home', color: 'text-emerald-600', bg: 'bg-emerald-50' };
        if (s === 'Travel Guide Page' || s === 'Travel Guide') return { label: 'Travel Guide', icon: 'menu_book', color: 'text-violet-600', bg: 'bg-violet-50' };
        if (s === 'Tour Booking Form') return { label: 'Tour Booking', icon: 'confirmation_number', color: 'text-primary', bg: 'bg-primary/10' };
        if (s === 'Specialist Consultation') return { label: 'Specialist', icon: 'support_agent', color: 'text-purple-600', bg: 'bg-purple-50' };
        if (s === 'Bharat Darshan Page') return { label: 'Tour Inquiry', icon: 'explore', color: 'text-blue-600', bg: 'bg-blue-50' };
        if (s === 'Article Inquiry') return { label: 'Article', icon: 'article', color: 'text-orange-600', bg: 'bg-orange-50' };
        if (s === 'Transport Fleet') return { label: 'Transport', icon: 'directions_car', color: 'text-rose-600', bg: 'bg-rose-50' };
        if (lead.departureType) return { label: 'Quote Request', icon: 'request_quote', color: 'text-purple-600', bg: 'bg-purple-50' };
        return { label: s || 'Contact Form', icon: 'mail', color: 'text-slate-600', bg: 'bg-slate-50' };
    };

    const fmtDate = (d) => {
        if (!d) return '—';
        try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
        catch { return d; }
    };

    const filteredLeads = leads.filter(l => {
        const matchesTab = activeTab === 'All' || l.status === activeTab;
        const q = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery ||
            (l.name && l.name.toLowerCase().includes(q)) ||
            (l.email && l.email.toLowerCase().includes(q)) ||
            (l.to && l.to.toLowerCase().includes(q)) ||
            (l.phone && l.phone.toLowerCase().includes(q));
        return matchesTab && matchesSearch;
    });

    const statusColor = (s) => {
        if (s === 'New') return 'bg-blue-50 text-blue-700 border-blue-100';
        if (s === 'Contacted') return 'bg-amber-50 text-amber-700 border-amber-100';
        return 'bg-slate-100 text-slate-500 border-slate-200';
    };

    return (
        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-500">
            {/* Toast */}
            {toastMsg && (
                <div className="fixed bottom-10 right-10 z-[200] animate-in slide-in-from-bottom duration-300">
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
                        dataSource === 'server' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        dataSource === 'cache'  ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                   'bg-red-50 text-red-600 border-red-100'
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
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 rounded-xl font-black text-xs transition-all ${activeTab === tab ? 'bg-[#0a6c75] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative group w-full max-w-2xl">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input type="text" placeholder="Search by name, email, phone or destination..."
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:border-[#0a6c75] focus:ring-4 focus:ring-[#0a6c75]/5 outline-none transition-all font-bold text-slate-700 text-sm" />
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
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Source</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tour / Destination</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Booking Info</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="material-symbols-outlined text-5xl text-slate-200">inbox</span>
                                            <p className="text-slate-400 font-bold italic">No queries found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredLeads.map(lead => {
                                const src = getSourceLabel(lead);
                                const isBooking = lead.source === 'Tour Booking Form';
                                return (
                                    <tr key={lead.id} className="hover:bg-slate-50/40 transition-colors group cursor-pointer" onClick={() => setViewLead(lead)}>
                                        {/* Source */}
                                        <td className="px-6 py-5">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${src.bg} ${src.color}`}>
                                                <span className="material-symbols-outlined text-[15px]">{src.icon}</span>
                                                <span className="text-[10px] font-black uppercase tracking-tight">{src.label}</span>
                                            </div>
                                        </td>
                                        {/* Customer */}
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight">{lead.name || 'Anonymous'}</span>
                                                <span className="text-[10px] font-bold text-slate-400 mt-0.5">{lead.email || '—'}</span>
                                                {lead.phone && <span className="text-[10px] font-bold text-slate-400">{lead.phone}</span>}
                                            </div>
                                        </td>
                                        {/* Tour */}
                                        <td className="px-6 py-5 max-w-[200px]">
                                            <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight line-clamp-2">{lead.to || 'General Inquiry'}</span>
                                            <span className="block text-[10px] font-bold text-slate-400 mt-1">{fmtDate(lead.createdAt || lead.timestamp)}</span>
                                        </td>
                                        {/* Booking Info */}
                                        <td className="px-6 py-5">
                                            {isBooking ? (
                                                <div className="flex flex-col gap-1">
                                                    {lead.travelers && (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="material-symbols-outlined text-[13px] text-slate-400">group</span>
                                                            <span className="text-[11px] font-bold text-slate-600">{lead.travelers}</span>
                                                        </div>
                                                    )}
                                                    {lead.departureDate && (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="material-symbols-outlined text-[13px] text-slate-400">calendar_today</span>
                                                            <span className="text-[11px] font-bold text-slate-600">{lead.departureDate}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-slate-300 italic">—</span>
                                            )}
                                        </td>
                                        {/* Pricing */}
                                        <td className="px-6 py-5">
                                            {isBooking && lead.totalPrice ? (
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-black text-slate-800">{lead.totalPrice}</span>
                                                    {lead.advanceAmount && (
                                                        <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg w-fit">30% → {lead.advanceAmount.split(' ')[0]}</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-slate-300 italic">—</span>
                                            )}
                                        </td>
                                        {/* Status */}
                                        <td className="px-6 py-5" onClick={e => e.stopPropagation()}>
                                            <select value={lead.status || 'New'}
                                                onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                                                className={`px-3 py-1.5 rounded-xl font-black text-[11px] outline-none border cursor-pointer transition-all ${statusColor(lead.status || 'New')}`}>
                                                <option value="New">New</option>
                                                <option value="Contacted">Contacted</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </td>
                                        {/* Actions */}
                                        <td className="px-6 py-5 text-right" onClick={e => e.stopPropagation()}>
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => setViewLead(lead)}
                                                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-primary/10 hover:text-primary text-slate-300 transition-all"
                                                    title="View Full Details">
                                                    <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                                                </button>
                                                <button onClick={() => handleDelete(lead.id)}
                                                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 text-slate-300 transition-all"
                                                    title="Delete">
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

            {/* ── Full Details Drawer ── */}
            {viewLead && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-end" onClick={() => setViewLead(null)}>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

                    {/* Panel */}
                    <div className="relative w-full max-w-md h-full bg-white dark:bg-slate-950 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300"
                        onClick={e => e.stopPropagation()}>

                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Query Details</p>
                                <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight line-clamp-1">{viewLead.name || 'Anonymous'}</h3>
                            </div>
                            <button onClick={() => setViewLead(null)}
                                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all">
                                <span className="material-symbols-outlined text-[19px]">close</span>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">

                            {/* Status + Source badges */}
                            <div className="flex items-center gap-3 flex-wrap">
                                {(() => {
                                    const src = getSourceLabel(viewLead);
                                    return (
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-tight ${src.bg} ${src.color}`}>
                                            <span className="material-symbols-outlined text-[15px]">{src.icon}</span>
                                            {src.label}
                                        </span>
                                    );
                                })()}
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-tight border ${statusColor(viewLead.status || 'New')}`}>
                                    {viewLead.status || 'New'}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold ml-auto">{fmtDate(viewLead.createdAt || viewLead.timestamp)}</span>
                            </div>

                            {/* Contact Info */}
                            <Section title="Contact Information" icon="contact_page">
                                <Row label="Full Name" value={viewLead.name} icon="person" />
                                <Row label="Email" value={viewLead.email} icon="mail" isLink={viewLead.email ? `mailto:${viewLead.email}` : null} />
                                <Row label="Mobile / WhatsApp" value={viewLead.phone} icon="smartphone" isLink={viewLead.phone ? `tel:${viewLead.phone}` : null} />
                            </Section>

                            {/* Tour / Trip Info */}
                            <Section title="Tour & Trip Details" icon="explore">
                                <Row label="Tour / Destination" value={viewLead.to} icon="near_me" />
                                <Row label="Travel Date" value={viewLead.departureDate} icon="calendar_today" />
                                <Row label="Guests / Travelers" value={viewLead.travelers} icon="group" />
                                {viewLead.from && <Row label="Departure From" value={viewLead.from} icon="flight_takeoff" />}
                                {viewLead.duration && <Row label="Duration" value={viewLead.duration} icon="schedule" />}
                                {viewLead.tourUrl && (
                                    <div className="flex flex-col gap-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tour URL</p>
                                        <a href={viewLead.tourUrl} target="_blank" rel="noreferrer"
                                            className="text-[11px] font-bold text-primary hover:underline truncate flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[13px]">link</span>
                                            {viewLead.tourUrl}
                                        </a>
                                    </div>
                                )}
                            </Section>

                            {/* Pricing Breakdown — only for Tour Booking Form */}
                            {(viewLead.totalPrice || viewLead.basePrice || viewLead.advanceAmount) && (
                                <Section title="Pricing Breakdown" icon="payments">
                                    <div className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                                        {viewLead.basePrice && (
                                            <div className="flex justify-between items-center px-4 py-2.5 border-b border-slate-50 dark:border-slate-800">
                                                <span className="text-[11px] font-bold text-slate-500">Base Price</span>
                                                <span className="text-[12px] font-black text-slate-700 tabular-nums">{viewLead.basePrice}</span>
                                            </div>
                                        )}
                                        {viewLead.groupDiscount && viewLead.groupDiscount !== 'N/A' && (
                                            <div className="flex justify-between items-center px-4 py-2.5 border-b border-slate-50 dark:border-slate-800">
                                                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[13px]">verified</span>Group Discount
                                                </span>
                                                <span className="text-[12px] font-black text-emerald-600 tabular-nums">{viewLead.groupDiscount}</span>
                                            </div>
                                        )}
                                        {viewLead.totalPrice && (
                                            <div className="flex justify-between items-center px-4 py-3 bg-slate-50 dark:bg-slate-800/50">
                                                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Total</span>
                                                <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums">{viewLead.totalPrice}</span>
                                            </div>
                                        )}
                                    </div>
                                    {viewLead.advanceAmount && (
                                        <div className="mt-3 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/15 px-4 py-3 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.15em]">30% Advance to Book</p>
                                                <p className="text-[9px] text-slate-500 italic">Secures this price</p>
                                            </div>
                                            <p className="text-xl font-black text-primary tabular-nums">{viewLead.advanceAmount.split(' ')[0]}</p>
                                        </div>
                                    )}
                                </Section>
                            )}

                            {/* Preferences (older query type) */}
                            {(viewLead.hotelRating || viewLead.foodPreference || viewLead.cabPreference) && (
                                <Section title="Preferences" icon="tune">
                                    {viewLead.hotelRating && <Row label="Hotel Category" value={viewLead.hotelRating} icon="hotel" />}
                                    {viewLead.foodPreference && <Row label="Meal Plan" value={viewLead.foodPreference} icon="restaurant" />}
                                    {viewLead.cabPreference && <Row label="Transport" value={viewLead.cabPreference} icon="directions_car" />}
                                </Section>
                            )}

                            {/* Message / Notes */}
                            {viewLead.message && (
                                <Section title="Message" icon="notes">
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{viewLead.message}</p>
                                </Section>
                            )}

                            {/* Status Updater */}
                            <Section title="Update Status" icon="edit_square">
                                <div className="flex gap-2 flex-wrap">
                                    {['New', 'Contacted', 'Closed'].map(s => (
                                        <button key={s}
                                            onClick={() => handleStatusUpdate(viewLead.id, s)}
                                            className={`px-5 py-2 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all border ${
                                                (viewLead.status || 'New') === s ? statusColor(s) + ' font-black' : 'border-slate-200 text-slate-400 hover:border-slate-300'
                                            }`}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </Section>

                            {/* Quick Actions */}
                            <div className="flex gap-3 pt-2">
                                {viewLead.email && (
                                    <a href={`mailto:${viewLead.email}`}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest hover:bg-slate-700 transition-all">
                                        <span className="material-symbols-outlined text-[16px]">mail</span>Email
                                    </a>
                                )}
                                {viewLead.phone && (
                                    <a href={`tel:${viewLead.phone}`}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-[11px] uppercase tracking-widest hover:bg-emerald-700 transition-all">
                                        <span className="material-symbols-outlined text-[16px]">call</span>Call
                                    </a>
                                )}
                                {viewLead.phone && (
                                    <a href={`https://wa.me/${viewLead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all flex-shrink-0">
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.766-5.764-5.771zm3.391 8.244c-.144.405-.837.778-1.148.822-.311.043-.69.058-1.11-.082s-.939-.218-1.57-.501c-1.424-.638-2.33-2.094-2.401-2.188-.071-.094-.61-2.112-.61-5.112 0-3 .54-4.512.61-4.606.071-.094.131-.137.2-.137h.1l.01.002.046.002c.11.002.261.025.36.262l.4 1.117.066.16c.045.1.06.18.01.29-.05.11-.12.24-.2.37l-.14.21-.132.17c-.1.14-.11.23-.05.34.05.1.25.43.52.68.35.31.64.41.77.47s.24.08.33.1.2.04.28-.06c.07-.12.3-.39.42-.58s.22-.16.38-.1c.16.07.97.46 1.13.54.17.08.28.12.32.18.04.06.04.34-.1.74z"/></svg>
                                    </a>
                                )}
                            </div>

                            {/* Danger zone */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button onClick={() => handleDelete(viewLead.id)}
                                    className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">delete</span>Delete this query
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ── Helpers ── */
const Section = ({ title, icon, children }) => (
    <div className="space-y-3">
        <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[15px] text-slate-400">{icon}</span>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</p>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="space-y-2">{children}</div>
    </div>
);

const Row = ({ label, value, icon, isLink }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[14px] text-slate-400">{icon}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</span>
                {isLink ? (
                    <a href={isLink} className="text-sm font-bold text-primary hover:underline">{value}</a>
                ) : (
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{value}</span>
                )}
            </div>
        </div>
    );
};

export default AdminLeadsDashboard;
