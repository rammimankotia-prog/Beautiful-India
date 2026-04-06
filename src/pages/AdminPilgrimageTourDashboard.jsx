import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const AdminPilgrimageTourDashboard = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    // Protection to ensure only admin users
    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'master_admin')) {
            navigate('/');
        }
    }, [user, navigate]);

    const fetchTours = async () => {
        try {
            const res = await fetch(`${import.meta.env.BASE_URL}data/pk_pilgrimage_tours.json?t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                setTours(data);
            } else {
                setTours([]);
            }
        } catch (error) {
            console.error('Failed to fetch pilgrimages:', error);
            setTours([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTours();
    }, []);

    const handleDelete = async (slug) => {
        if (!window.confirm('Are you absolutely sure you want to permanently delete this Pilgrimage Yatra?')) return;
        
        try {
            // Filter out the tour to delete
            const updatedTours = tours.filter(t => t.slug !== slug);

            const response = await fetch(`${import.meta.env.BASE_URL}api-save-pk-pilgrimages.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTours)
            });

            if (!response.ok) throw new Error('Delete failed');
            fetchTours();
        } catch (error) {
            console.error('Error deleting tour:', error);
            alert('Failed to delete tour.');
        }
    };

    const handleQuickStatusToggle = async (tour) => {
        const newStatus = tour.status === 'publish' ? 'draft' : 'publish';
        
        try {
            // Update the specific tour in the array
            const updatedTours = tours.map(t => 
                t.slug === tour.slug 
                ? { ...t, status: newStatus, lastModified: new Date().toISOString() } 
                : t
            );

            const response = await fetch(`${import.meta.env.BASE_URL}api-save-pk-pilgrimages.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTours)
            });

            if (!response.ok) throw new Error('Status update failed');
            fetchTours();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status.');
        }
    };

    const filteredTours = tours.filter(tour => 
        (tour.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tour.slug || '').toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.created || 0) - new Date(a.created || 0));

    const stats = {
        total: tours.length,
        published: tours.filter(t => t.status === 'publish').length,
        draft: tours.filter(t => t.status !== 'publish').length
    };

    return (
        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">Sacred Directory</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold italic">Curating and managing the divine journeys of Bharat.</p>
                </div>
                <Link 
                    to="/admin/pilgrimages/create"
                    className="group flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase text-xs tracking-[2px] transition-all hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 active:translate-y-0"
                >
                    <span className="material-symbols-outlined transition-transform group-hover:rotate-90">add_circle</span>
                    Initialize New Yatra
                </Link>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Pilgrimages', value: stats.total, icon: 'temple_hindu', color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/30' },
                    { label: 'Live on Portal', value: stats.published, icon: 'visibility', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
                    { label: 'Staged / Drafts', value: stats.draft, icon: 'edit_note', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' }
                ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                        <div className={`${s.bg} w-14 h-14 rounded-2xl flex items-center justify-center ${s.color} mb-6 group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined text-[32px]">{s.icon}</span>
                        </div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</h3>
                        <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Content Explorer */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Active Itineraries</h2>
                    <div className="relative min-w-[320px]">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input 
                            type="text"
                            placeholder="Find a sacred path..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm dark:text-white"
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-20 text-center text-slate-500">
                             <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
                            <p className="font-bold italic">Synchronizing sacred records...</p>
                        </div>
                    ) : filteredTours.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[2px] text-slate-400">Sacred Journey / Yatra Details</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[2px] text-slate-400 w-48 text-center">Current Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[2px] text-slate-400 w-48 text-right">Management</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {filteredTours.map((tour) => (
                                        <tr key={tour.slug} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-24 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow border-2 border-white dark:border-slate-700">
                                                        {tour.gallery && tour.gallery[0] ? (
                                                            <img src={tour.gallery[0]} alt={tour.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <span className="material-symbols-outlined text-slate-300">temple_hindu</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight mb-1">{tour.title}</h3>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md uppercase">{tour.slug}</span>
                                                            {tour.duration && <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">• {tour.duration}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <button 
                                                    onClick={() => handleQuickStatusToggle(tour)}
                                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                        tour.status === 'publish' 
                                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                                                        : 'bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                                                    }`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full bg-current ${tour.status === 'publish' ? 'animate-pulse' : ''}`}></span>
                                                    {tour.status === 'publish' ? 'Published' : 'Draft Mode'}
                                                </button>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-end gap-3">
                                                    <a 
                                                        href={`/pilgrimage-tours/${tour.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 text-slate-400 hover:text-primary hover:shadow-xl transition-all border border-slate-50 dark:border-slate-700"
                                                        title="Live Preview"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">open_in_new</span>
                                                    </a>
                                                    <Link 
                                                        to={`/admin/pilgrimages/edit/${tour.slug}`}
                                                        className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 text-slate-400 hover:text-blue-500 hover:shadow-xl transition-all border border-slate-50 dark:border-slate-700"
                                                        title="Modify Itinerary"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">edit_square</span>
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(tour.slug)}
                                                        className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:shadow-xl hover:border-red-100 dark:hover:border-red-900/30 transition-all border border-slate-50 dark:border-slate-700"
                                                        title="Remove Journey"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">delete_sweep</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-24 text-center">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[32px] flex items-center justify-center mx-auto mb-8 rotate-12 group-hover:rotate-0 transition-transform">
                                <span className="material-symbols-outlined text-5xl text-slate-300">temple_hindu</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3">No Divine Paths Discovered</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-10 font-bold italic">The record is empty. Perhaps a new sacred journey is waiting to be inscribed?</p>
                            <Link 
                                to="/admin/pilgrimages/create"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-[2px] hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1"
                            >
                                <span className="material-symbols-outlined">add_circle</span>
                                Ignite First Yatra
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPilgrimageTourDashboard;
