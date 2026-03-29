import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminBikeTourDashboard = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [toastMsg, setToastMsg] = useState('');

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 3000);
    };

    const fetchTours = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/v1/bike-tours/admin');
            const data = await response.json();
            setTours(data);
        } catch (error) {
            console.error('Error fetching bike tours:', error);
            showToast('❌ Failed to load tours');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTours();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this bicycle tour?')) return;

        try {
            const response = await fetch(`/api/v1/bike-tours/admin/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setTours(tours.filter(t => t._id !== id));
                showToast('🗑️ Tour deleted successfully');
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            showToast('❌ Deletion failed');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const response = await fetch(`/api/v1/bike-tours/admin/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                setTours(tours.map(t => t._id === id ? { ...t, status: newStatus } : t));
                showToast(`✅ Status updated to ${newStatus}`);
            }
        } catch (error) {
            showToast('❌ Status update failed');
        }
    };

    const filteredTours = tours.filter(tour => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Active') return tour.status === 'active';
        if (activeTab === 'Drafts') return tour.status === 'draft';
        if (activeTab === 'Paused') return tour.status === 'paused';
        return true;
    });

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
                    <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2 flex items-center gap-3">
                        <span className="material-symbols-outlined text-4xl">pedal_bike</span>
                        Bicycle Tours
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold italic">Manage your premium bicycle tour modules and cycling adventures.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={fetchTours}
                        className="flex items-center justify-center w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <span className="material-symbols-outlined">refresh</span>
                    </button>
                    <Link to="/admin/bike-tours/new" className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-black hover:bg-primary-dark transition-all text-sm shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined font-black">add</span>
                        New Bike Tour
                    </Link>
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
                                                    <img 
                                                        src={tour.mainImage} 
                                                        alt={tour.title} 
                                                        className="w-14 h-10 rounded-lg object-cover shadow-sm bg-slate-100" 
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-slate-800 dark:text-slate-100">{tour.title}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                            {tour.destination}, {tour.country} • {tour.duration}
                                                        </span>
                                                    </div>
                                                </div>
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
                                                    <Link to={`/admin/bike-tours/edit/${tour._id}`} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 hover:text-primary transition-all">
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </Link>
                                                    <button onClick={() => handleDelete(tour._id)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
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
