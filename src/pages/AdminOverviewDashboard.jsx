import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

const AdminOverviewDashboard = () => {
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalLeads: 0,
        totalReviews: 0,
        totalTrainQueries: 0,
        revenue: 0
    });
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();

    const handleViewActivity = (act) => {
        switch(act.type) {
            case 'booking': navigate('/admin/bookings'); break;
            case 'lead': navigate('/admin/leads'); break;
            case 'review': navigate('/admin/guides'); break;
            case 'train': navigate('/admin/train-queries'); break;
            default: navigate('/admin/overview');
        }
    };

    const handleDeleteActivity = async (act) => {
        if (!window.confirm(`Permanently delete this ${act.type} item?`)) return;
        
        try {
            const rawId = act.id.split('-').slice(1).join('-'); // Handle cases where ID might contain dashes
            let endpoint = '';
            
            switch(act.type) {
                case 'booking': endpoint = '/api/bookings'; break;
                case 'lead': endpoint = '/api/leads'; break;
                case 'review': endpoint = '/api/reviews'; break;
                case 'train': endpoint = '/api/train-queries'; break;
                default: return;
            }

            const res = await fetch(`${endpoint}?id=${rawId}`, { method: 'DELETE' });
            if (res.ok) {
                setActivities(prev => prev.filter(a => a.id !== act.id));
                // Update the stats too
                setStats(prev => ({
                    ...prev,
                    totalBookings: act.type === 'booking' ? prev.totalBookings - 1 : prev.totalBookings,
                    totalLeads: act.type === 'lead' ? prev.totalLeads - 1 : prev.totalLeads,
                    totalReviews: act.type === 'review' ? prev.totalReviews - 1 : prev.totalReviews,
                    totalTrainQueries: act.type === 'train' ? prev.totalTrainQueries - 1 : prev.totalTrainQueries,
                }));
            } else {
                alert("Failed to delete the record from the server.");
            }
        } catch (error) {
            console.error("Delete activity error:", error);
            alert("An error occurred while deleting.");
        }
    };

    const [dataSource, setDataSource] = useState('loading');

    const fetchData = async () => {
        setLoading(true);
        try {
            // Updated to absolute paths with cache-busting for all data sources
            const timestamp = Date.now();
            const fetchOptions = {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            };

            const [bookingsRes, leadsRes, reviewsRes, trainRes] = await Promise.allSettled([
                fetch(`/data/bookings.json?t=${timestamp}`, fetchOptions),
                fetch(`/data/leads.json?t=${timestamp}`, fetchOptions),
                fetch(`/data/reviews.json?t=${timestamp}`, fetchOptions),
                fetch(`/api/train-queries?t=${timestamp}`, fetchOptions)
            ]);

            const getJson = async (res) => {
                if (res.status === 'fulfilled' && res.value.ok) {
                    try { return await res.value.json(); } catch(e) { return []; }
                }
                return [];
            };

            const bookings = await getJson(bookingsRes);
            const leads = await getJson(leadsRes);
            const reviews = await getJson(reviewsRes);
            let trainQueriesRaw = await getJson(trainRes);
            const trainQueries = Array.isArray(trainQueriesRaw) ? trainQueriesRaw : [];

            const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.amount || b.price) || 0), 0);
            setStats({
                totalBookings: bookings.length,
                totalLeads: leads.length,
                totalReviews: reviews.length,
                totalTrainQueries: trainQueries.length,
                revenue: totalRevenue
            });

            // Set data source to server if at least one critical request was ok
            const allOk = [bookingsRes, leadsRes, reviewsRes, trainRes].some(r => r.status === 'fulfilled' && r.value.ok);
            setDataSource(allOk ? 'server' : 'cache');

                const allActivity = [
                    ...bookings.map(b => {
                        let type = 'booking';
                        let icon = 'shopping_cart';
                        let color = 'bg-emerald-500';
                        let titlePrefix = 'New Booking';

                        if (b.tourTitle?.toLowerCase().includes('bike')) {
                            type = 'bike';
                            icon = 'motorcycle';
                            color = 'bg-orange-500';
                            titlePrefix = 'Bike Tour Booking';
                        } else if (b.tourTitle?.toLowerCase().includes('pilgrimage')) {
                            type = 'pilgrimage';
                            icon = 'temple_hindu';
                            color = 'bg-amber-600';
                            titlePrefix = 'Pilgrimage Booking';
                        } else if (b.id?.toString().startsWith('TRN') || b.tourTitle?.toLowerCase().includes('train')) {
                            type = 'train_booking';
                            icon = 'train';
                            color = 'bg-blue-600';
                            titlePrefix = 'Train Booking';
                        }

                        return {
                            id: `b-${b.id}`,
                            type,
                            title: `${titlePrefix}: ${b.tourTitle || 'Package'}`,
                            user: b.customerName || 'Explorer',
                            time: b.date || b.timestamp,
                            icon,
                            color
                        };
                    }),
                    ...leads.map(l => {
                        let type = 'lead';
                        let icon = 'contact_support';
                        let color = 'bg-blue-500';
                        let title = `Lead Inquiry: ${l.to || 'General'}`;

                        if (l.source === 'Wanderbot' || l.source === 'Chatbot') {
                            type = 'chatbot';
                            icon = 'smart_toy';
                            color = 'bg-purple-500';
                            title = 'Chatbot Query';
                        } else if (l.to?.toLowerCase().includes('bike')) {
                            type = 'bike_inquiry';
                            icon = 'motorcycle';
                            color = 'bg-orange-400';
                            title = `Bike Trip Inquiry`;
                        } else if (l.to?.toLowerCase().includes('pilgrimage')) {
                            type = 'pilgrimage_inquiry';
                            icon = 'temple_hindu';
                            color = 'bg-amber-500';
                            title = `Pilgrimage Inquiry`;
                        }

                        return {
                            id: `l-${l.id}`,
                            type,
                            title,
                            user: l.name || 'Anonymous',
                            time: l.createdAt || l.timestamp,
                            icon,
                            color
                        };
                    }),
                    ...reviews.map(r => ({
                        id: `r-${r.id}`,
                        type: 'review',
                        title: `New ${r.rating}★ Review`,
                        user: r.userName || 'Verified Traveler',
                        time: r.createdAt || r.timestamp,
                        icon: 'grade',
                        color: 'bg-amber-400'
                    })),
                    ...trainQueries.map(t => ({
                        id: `t-${t.id}`,
                        type: 'train',
                        title: `Train Query: ${t.from} ➔ ${t.to}`,
                        user: t.name || 'Passenger',
                        time: t.createdAt || t.timestamp,
                        icon: 'train',
                        color: 'bg-indigo-500'
                    }))
                ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

                setActivities(allActivity);
                setLoading(false);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
                setLoading(false);
            }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2">Executive Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold italic">Everything you need to know today.</p>
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
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                {[
                    { label: 'Total Revenue', value: formatPrice(stats.revenue, true), icon: 'payments', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
                    { label: 'Total Bookings', value: stats.totalBookings, icon: 'receipt_long', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20' },
                    { label: 'Fresh Leads', value: stats.totalLeads, icon: 'campaign', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/20' },
                    { label: 'Train Queries', value: stats.totalTrainQueries, icon: 'train', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/20' },
                    { label: 'User Feedback', value: stats.totalReviews, icon: 'grade', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/20' }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                        <div className={`${stat.bg} w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color} mb-6 group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined text-[32px]">{stat.icon}</span>
                        </div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</h3>
                        <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Executive Command Center - Full Width */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 px-2">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Executive Command Center</h2>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Category: Tour Inventory */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-2">Tour Inventory</p>
                        <div className="grid grid-cols-1 gap-4">
                            <Link to="/admin/tours/new" className="flex items-center gap-6 p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/10 hover:bg-emerald-500 hover:text-white transition-all group shadow-sm border border-emerald-100/50 dark:border-emerald-900/20">
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform shadow-sm">
                                    <span className="material-symbols-outlined text-[32px]">add_location_alt</span>
                                </div>
                                <div>
                                    <span className="text-sm font-black uppercase tracking-widest block">Upload Tours</span>
                                    <span className="text-[10px] font-bold opacity-60">Create new packages</span>
                                </div>
                            </Link>
                            <Link to="/admin/bike-tours/new" className="flex items-center gap-6 p-6 rounded-3xl bg-orange-50/50 dark:bg-orange-950/10 hover:bg-orange-500 hover:text-white transition-all group shadow-sm border border-orange-100/50 dark:border-orange-900/20">
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform shadow-sm">
                                    <span className="material-symbols-outlined text-[32px]">motorcycle</span>
                                </div>
                                <div>
                                    <span className="text-sm font-black uppercase tracking-widest block">Bike Tours</span>
                                    <span className="text-[10px] font-bold opacity-60">Adventure inventory</span>
                                </div>
                            </Link>
                            <Link to="/admin/train-queries" className="flex items-center gap-6 p-6 rounded-3xl bg-blue-50/50 dark:bg-blue-950/10 hover:bg-blue-500 hover:text-white transition-all group shadow-sm border border-blue-100/50 dark:border-blue-900/20">
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shadow-sm">
                                    <span className="material-symbols-outlined text-[32px]">train</span>
                                </div>
                                <div>
                                    <span className="text-sm font-black uppercase tracking-widest block">Train Tours</span>
                                    <span className="text-[10px] font-bold opacity-60">Railway packages</span>
                                </div>
                            </Link>
                            <Link to="/admin/categorization" className="flex items-center gap-6 p-6 rounded-3xl bg-teal-50/50 dark:bg-teal-950/10 hover:bg-teal-500 hover:text-white transition-all group shadow-sm border border-teal-100/50 dark:border-teal-900/20">
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-teal-500 group-hover:scale-110 transition-transform shadow-sm">
                                    <span className="material-symbols-outlined text-[32px]">category</span>
                                </div>
                                <div>
                                    <span className="text-sm font-black uppercase tracking-widest block">Add Destination</span>
                                    <span className="text-[10px] font-bold opacity-60">Manage locations</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Category: Business Operations */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-2">Business Operations</p>
                        <div className="grid grid-cols-1 gap-4">
                            <Link to="/admin/chatbot-flow" className="flex items-center gap-6 p-6 rounded-3xl bg-purple-50/50 dark:bg-purple-950/10 hover:bg-purple-600 hover:text-white transition-all group shadow-sm border border-purple-100/50 dark:border-purple-900/20">
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform shadow-sm">
                                    <span className="material-symbols-outlined text-[32px]">smart_toy</span>
                                </div>
                                <div>
                                    <span className="text-sm font-black uppercase tracking-widest block">Manage ChatBot</span>
                                    <span className="text-[10px] font-bold opacity-60">Agentic AI Flow</span>
                                </div>
                            </Link>
                            <Link to="/admin/leads" className="flex items-center gap-6 p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/10 hover:bg-indigo-600 hover:text-white transition-all group shadow-sm border border-indigo-100/50 dark:border-indigo-900/20">
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform shadow-sm">
                                    <span className="material-symbols-outlined text-[32px]">group</span>
                                </div>
                                <div>
                                    <span className="text-sm font-black uppercase tracking-widest block">Manage Leads</span>
                                    <span className="text-[10px] font-bold opacity-60">Sales pipeline</span>
                                </div>
                            </Link>
                            <Link to="/admin/transport" className="flex items-center gap-6 p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/10 hover:bg-rose-600 hover:text-white transition-all group shadow-sm border border-rose-100/50 dark:border-rose-900/20">
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform shadow-sm">
                                    <span className="material-symbols-outlined text-[32px]">commute</span>
                                </div>
                                <div>
                                    <span className="text-sm font-black uppercase tracking-widest block">Manage Fleet</span>
                                    <span className="text-[10px] font-bold opacity-60">Logistics control</span>
                                </div>
                            </Link>
                            <Link to="/admin/users" className="flex items-center gap-6 p-6 rounded-3xl bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-900 hover:text-white transition-all group shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-100 group-hover:scale-110 transition-transform shadow-sm">
                                    <span className="material-symbols-outlined text-[32px]">badge</span>
                                </div>
                                <div>
                                    <span className="text-sm font-black uppercase tracking-widest block">Manage Users</span>
                                    <span className="text-[10px] font-bold opacity-60">Staff permissions</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Category: Content & Strategy */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-2">Content Strategy</p>
                        <div className="grid grid-cols-1 gap-4">
                            <Link to="/admin/guides/new" className="flex items-center gap-6 p-6 rounded-3xl bg-pink-50/50 dark:bg-pink-950/10 hover:bg-pink-600 hover:text-white transition-all group shadow-sm border border-pink-100/50 dark:border-pink-900/20">
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform shadow-sm">
                                    <span className="material-symbols-outlined text-[32px]">auto_stories</span>
                                </div>
                                <div>
                                    <span className="text-sm font-black uppercase tracking-widest block">Publish Blog</span>
                                    <span className="text-[10px] font-bold opacity-60">Article management</span>
                                </div>
                            </Link>
                            <Link to="/admin/theme" className="flex items-center gap-6 p-6 rounded-3xl bg-cyan-50/50 dark:bg-cyan-950/10 hover:bg-cyan-600 hover:text-white transition-all group shadow-sm border border-cyan-100/50 dark:border-cyan-900/20">
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform shadow-sm">
                                    <span className="material-symbols-outlined text-[32px]">palette</span>
                                </div>
                                <div>
                                    <span className="text-sm font-black uppercase tracking-widest block">Design Theme</span>
                                    <span className="text-[10px] font-bold opacity-60">UI/UX Settings</span>
                                </div>
                            </Link>
                            {/* Fill placeholder to keep grid balanced */}
                            <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50/30 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-700 opacity-50 grayscale">
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-300">
                                    <span className="material-symbols-outlined text-[32px]">more_horiz</span>
                                </div>
                                <div>
                                    <span className="text-sm font-black uppercase tracking-widest block">Coming Soon</span>
                                    <span className="text-[10px] font-bold">New Module</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50/30 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-700 opacity-50 grayscale">
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-300">
                                    <span className="material-symbols-outlined text-[32px]">more_horiz</span>
                                </div>
                                <div>
                                    <span className="text-sm font-black uppercase tracking-widest block">Coming Soon</span>
                                    <span className="text-[10px] font-bold">New Module</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Feed - Below Command Center */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">System Pulse (Recent)</h2>
                    <Link to="/admin/leads" className="text-[10px] font-black text-[#0a6c75] uppercase tracking-widest hover:underline">Full Analytics</Link>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden p-4">
                    {loading ? (
                        <div className="h-96 flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-12 border-4 border-slate-100 border-t-[#0a6c75] rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-bold italic tracking-wide">Syncing real-time intelligence...</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                                {activities.length > 0 ? activities.map((act) => (
                                <div key={act.id} className="flex items-center gap-6 p-6 rounded-[32px] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                                    <div className={`${act.color} text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform`}>
                                        <span className="material-symbols-outlined text-[24px]">{act.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black text-slate-800 dark:text-slate-100 leading-tight mb-1 text-lg">{act.title}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-black text-slate-400 uppercase tracking-widest">{act.type}</span>
                                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">{act.user}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                        <button 
                                            onClick={() => handleViewActivity(act)}
                                            className="w-11 h-11 flex items-center justify-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#0a6c75] hover:text-[#0a6c75] transition-all shadow-sm"
                                            title="Open Record"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteActivity(act)}
                                            className="w-11 h-11 flex items-center justify-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-red-500 hover:text-red-500 transition-all shadow-sm"
                                            title="Dismiss"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">close</span>
                                        </button>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-[11px] font-black text-slate-800 dark:text-slate-200 tracking-tighter">{act.time ? new Date(act.time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Today'}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{act.time ? new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-20 text-center">
                                    <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">Inbox</span>
                                    <p className="text-slate-400 font-bold">No recent activities to report.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOverviewDashboard;
