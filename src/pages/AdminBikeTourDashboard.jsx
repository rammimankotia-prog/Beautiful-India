import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminBikeTourDashboard = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [leads, setLeads] = useState([]);
    const [toastMsg, setToastMsg] = useState('');

    const fetchLeads = async () => {
        try {
            // Only try to fetch PHP leads if we're not in a dev environment that leaks PHP source
            const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            if (isDev) return; 

            const response = await fetch('/api-save-leads.php');
            if (!response.ok) return;
            const data = await response.json();
            setLeads(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching leads:', error);
        }
    };

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 3000);
    };

    const fetchTours = async () => {
        setLoading(true);
        try {
            const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const targetUrl = isDev 
                ? '/api/v1/bike-tours/admin' 
                : `/data/bike-tours.json?t=${Date.now()}`;
                
            const response = await fetch(targetUrl);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Server responded with ${response.status}`);
            }
            const data = await response.json();
            setTours(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching bike tours:', error);
            showToast(`❌ Error: ${error.message}`);
            setTours([]); // Fallback to empty
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTours();
        fetchLeads();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this bicycle tour?')) return;

        try {
            const isDev = window.location.hostname === 'localhost';
            const updatedTours = tours.filter(t => (t._id || t.id) !== id);

            if (isDev) {
                // Node.js Delete
                const response = await fetch(`/api/v1/bike-tours/admin/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setTours(updatedTours);
                    showToast('🗑️ Tour deleted successfully');
                } else {
                    throw new Error('Failed to delete on server');
                }
            } else {
                // PHP Persistence (Save the entire list)
                const response = await fetch('/api-save-bike-tours.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedTours)
                });
                const result = await response.json();
                if (result.success) {
                    setTours(updatedTours);
                    showToast('🗑️ Tour deleted successfully');
                } else {
                    throw new Error(result.error || 'Failed to save to server');
                }
            }
        } catch (error) {
            console.error('Delete Error:', error);
            showToast(`❌ Deletion failed: ${error.message}`);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const isDev = window.location.hostname === 'localhost';
            const updatedTours = tours.map(t => (t._id || t.id) === id ? { ...t, status: newStatus } : t);

            if (isDev) {
                // Node.js Update
                const response = await fetch(`/api/v1/bike-tours/admin/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });
                if (response.ok) {
                    setTours(updatedTours);
                    showToast(`✅ Status updated to ${newStatus}`);
                } else {
                    throw new Error('Update failed');
                }
            } else {
                // PHP Persistence (Save the entire list)
                const response = await fetch('/api-save-bike-tours.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedTours)
                });
                const result = await response.json();
                if (result.success) {
                    setTours(updatedTours);
                    showToast(`✅ Status updated to ${newStatus}`);
                } else {
                    throw new Error(result.error || 'Failed to save to server');
                }
            }
        } catch (error) {
            console.error('Status Error:', error);
            showToast(`❌ Status update failed: ${error.message}`);
        }
    };

    const filteredTours = Array.isArray(tours) ? tours.filter(tour => {
        if (!tour) return false;
        // Status Filter
        let passesStatus = true;
        if (activeTab === 'Active') passesStatus = tour.status === 'active';
        else if (activeTab === 'Drafts') passesStatus = tour.status === 'draft';
        else if (activeTab === 'Paused') passesStatus = tour.status === 'paused';

        // Type Filter
        let passesType = true;
        if (typeFilter !== 'All') passesType = tour.tourType === typeFilter;

        return passesStatus && passesType;
    }) : [];

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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2">Bicycle & Bike Expeditions</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold italic">Manage your premium cycling and motorcycling tour portfolio.</p>
                </div>
                <Link 
                    to="/admin/bike-tours/new"
                    className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-all w-fit"
                >
                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    Create New Expedition
                </Link>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined font-black">tour</span>
                        </div>
                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg tracking-widest uppercase">Live</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white">{tours.length}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Expeditions</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined font-black">person_pin_circle</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Bicycle: {tours.filter(t => t.tourType === 'Bicycle').length}</span>
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">Bike: {tours.filter(t => t.tourType === 'Bike').length}</span>
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white">Distribution</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Tour Type Mix</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined font-black">group</span>
                        </div>
                        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg tracking-widest uppercase">Inbound</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white">{leads.length}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Leads</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined font-black">priority_high</span>
                        </div>
                        <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg tracking-widest uppercase">Action Required</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white">{leads.filter(l => l.status === 'High Priority' || l.status === 'New').length}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Priority Leads</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-700">
                <nav className="flex gap-8 px-2">
                    {['All', 'Active', 'Drafts', 'Paused'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-1 text-sm font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                        <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-bold italic">Loading bicycle tours...</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tour Details</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing Model</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Difficulty</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredTours.length > 0 ? filteredTours.map(tour => (
                                        <tr key={tour._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    {tour.mainImage && (
                                                        <img 
                                                            src={tour.mainImage} 
                                                            alt={tour.title} 
                                                            className="w-14 h-10 rounded-lg object-cover shadow-sm bg-slate-100" 
                                                        />
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-slate-800 dark:text-slate-100">{tour.title}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                            {tour.destination}, {tour.country} • {tour.duration}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${
                                                    tour.tourType === 'Bike' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {tour.tourType || 'Bicycle'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex gap-2">
                                                        <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">Person: {tour.pricing?.perPerson || 0}</span>
                                                        <span className="text-[10px] font-black bg-purple-50 text-purple-600 px-2 py-0.5 rounded uppercase">Couple: {tour.pricing?.perCouple || 0}</span>
                                                    </div>
                                                    <span className="text-[10px] font-black bg-pink-50 text-pink-600 px-2 py-0.5 rounded uppercase w-fit">Group: {tour.pricing?.perGroup?.price || 0} (Min {tour.pricing?.perGroup?.minPersons || 0})</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                                                    tour.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                                                    tour.difficulty === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-rose-100 text-rose-700'
                                                }`}>
                                                    {tour.difficulty}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <select 
                                                    value={tour.status} 
                                                    onChange={(e) => handleStatusUpdate(tour._id, e.target.value)}
                                                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer focus:text-primary transition-colors"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="draft">Draft</option>
                                                    <option value="paused">Paused</option>
                                                </select>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2 text-slate-300">
                                                    <Link to={`/admin/bike-tours/edit/${tour._id || tour.id}`} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 hover:text-primary transition-all">
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </Link>
                                                    <button onClick={() => handleDelete(tour._id || tour.id)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <span className="material-symbols-outlined text-4xl text-slate-200">inventory_2</span>
                                                    <p className="text-slate-400 font-bold italic">No bicycle tours found matching this filter.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBikeTourDashboard;
