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
            const existingTour = tours.find(t => t.slug === slug);
            if (!existingTour) return;

            // Mark as trashed instead of hard delete, or pass DELETE method. 
            // The API supports DELETE.
            const response = await fetch(`${import.meta.env.BASE_URL}api-save-pk-pilgrimages.php`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug })
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
            const updatedTour = { ...tour, status: newStatus, lastModified: new Date().toISOString() };
            const response = await fetch(`${import.meta.env.BASE_URL}api-save-pk-pilgrimages.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTour)
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

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-6 lg:p-10 animate-in fade-in duration-500">
                {/* Header section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Pilgrimage Directory</h1>
                        <p className="text-slate-500 font-medium mt-1">Manage sacred journeys and yatras.</p>
                    </div>
                    <Link 
                        to="/admin/pilgrimages/create"
                        className="flex items-center gap-2 px-6 py-3 bg-[#0a6c75] hover:bg-[#005a63] text-white rounded-xl font-bold transition-all shadow-lg shadow-teal-900/20 whitespace-nowrap"
                    >
                        <span className="material-symbols-outlined">add_circle</span>
                        Create Yatra
                    </Link>
                </div>

                {/* Filters */}
                <div className="glass-panel p-4 flex gap-4">
                    <div className="flex-1 relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input 
                            type="text"
                            placeholder="Search by title or slug..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#0a6c75] focus:border-transparent outline-none transition-all dark:text-white"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="glass-panel overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-slate-500">
                            <span className="material-symbols-outlined animate-spin text-4xl mb-4 text-[#0a6c75]">autorenew</span>
                            <p>Loading directory...</p>
                        </div>
                    ) : filteredTours.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                        <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400">Yatra</th>
                                        <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400 w-48">Status</th>
                                        <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400 w-32">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTours.map((tour) => (
                                        <tr key={tour.slug} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                                                        {tour.tour_gallery && tour.tour_gallery[0] ? (
                                                            <img src={tour.tour_gallery[0]} alt={tour.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <span className="material-symbols-outlined text-slate-300">image</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{tour.title}</h3>
                                                        <p className="text-xs text-slate-400 font-mono mt-1">{tour.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <button 
                                                    onClick={() => handleQuickStatusToggle(tour)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${tour.status === 'publish' ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/10 dark:text-green-500' : 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-500/10 dark:text-amber-500'}`}
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                    {tour.status === 'publish' ? 'Published' : 'Draft'}
                                                </button>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <a 
                                                        href={`/pilgrimage-tours/${tour.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-[#0a6c75] transition-colors"
                                                        title="View"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                    </a>
                                                    <Link 
                                                        to={`/admin/pilgrimages/edit/${tour.slug}`}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-500 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(tour.slug)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                                        title="Delete"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-16 text-center">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-4xl text-slate-300">not_listed_location</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Yatras Found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto mb-6">You haven't added any pilgrimages yet, or none match your search.</p>
                            <Link 
                                to="/admin/pilgrimages/create"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0a6c75] text-white rounded-xl font-bold hover:bg-[#005a63] transition-colors shadow-lg"
                            >
                                <span className="material-symbols-outlined">add_circle</span>
                                Create First Yatra
                            </Link>
                        </div>
                    )}
                </div>
            </div>
    );
};

export default AdminPilgrimageTourDashboard;
