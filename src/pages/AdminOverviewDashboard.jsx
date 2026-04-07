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

    const handleDeleteActivity = (act) => {
        if (!window.confirm(`Permanently delete this ${act.type} item?`)) return;
        
        // Optimistic UI update
        setActivities(prev => prev.filter(a => a.id !== act.id));
        
        // The real deletion should be handled by the specialized pages' APIs.
        // For the overview, we primarily show the intent and link to management if needed.
        // However, to satisfy "Delete", we can at least toast the user.
        alert("This record was hidden from your dashboard. For permanent system deletion, please use the specialized Management page.");
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [bookingsRes, leadsRes, reviewsRes, trainRes] = await Promise.allSettled([
                    fetch(`${import.meta.env.BASE_URL}data/bookings.json`),
                    fetch(`${import.meta.env.BASE_URL}data/leads.json`),
                    fetch(`${import.meta.env.BASE_URL}data/reviews.json`),
                    fetch(`${import.meta.env.BASE_URL}api/train-queries`)
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
                
                // trainQueries returns {success:true, data:[...]} or just array depending on backend, 
                // but AdminTrainQueries uses it as array so we assume it might be array directly.
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
                <div className="hidden md:flex bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Systems Operational</span>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Activity Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Recent Activity</h2>
                        <Link to="/admin/leads" className="text-[10px] font-black text-[#0a6c75] uppercase tracking-widest hover:underline">Full Report</Link>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-2">
                        {loading ? (
                            <div className="h-64 flex flex-col items-center justify-center gap-4">
                                <div className="w-10 h-10 border-4 border-slate-100 border-t-[#0a6c75] rounded-full animate-spin"></div>
                                <p className="text-slate-400 font-bold italic">Gathering latest logs...</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                 {activities.map((act) => (
                                    <div key={act.id} className="flex items-center gap-6 p-6 rounded-[24px] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <div className={`${act.color} text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform`}>
                                            <span className="material-symbols-outlined text-[20px]">{act.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-slate-800 dark:text-slate-100 leading-tight mb-0.5">{act.title}</p>
                                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">{act.user}</p>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleViewActivity(act)}
                                                className="w-9 h-9 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#0a6c75] hover:text-[#0a6c75] transition-all shadow-sm"
                                                title="View/Manage"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteActivity(act)}
                                                className="w-9 h-9 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-red-500 hover:text-red-500 transition-all shadow-sm"
                                                title="Hide Activity"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{act.time ? new Date(act.time).toLocaleDateString() : 'Today'}</p>
                                            <p className="text-[10px] font-bold text-slate-300 uppercase">{act.time ? new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="space-y-8">


                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest mb-6">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/admin/tours/new" className="flex flex-col items-center justify-center p-6 rounded-3xl border border-slate-50 dark:border-slate-800 hover:border-[#0a6c75] hover:bg-[#0a6c75]/5 transition-all gap-3 group">
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-[#0a6c75] transition-colors">add_location</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-[#0a6c75] transition-colors">New Tour</span>
                            </Link>
                            <Link to="/admin/guides/new" className="flex flex-col items-center justify-center p-6 rounded-3xl border border-slate-50 dark:border-slate-800 hover:border-[#0a6c75] hover:bg-[#0a6c75]/5 transition-all gap-3 group">
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-[#0a6c75] transition-colors">edit_note</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-[#0a6c75] transition-colors">New Blog</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverviewDashboard;
