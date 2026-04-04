import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [bookingsRes, leadsRes, reviewsRes, trainRes] = await Promise.all([
                    fetch(`${import.meta.env.BASE_URL}data/bookings.json`),
                    fetch(`${import.meta.env.BASE_URL}data/leads.json`),
                    fetch(`${import.meta.env.BASE_URL}data/reviews.json`),
                    fetch(`${import.meta.env.BASE_URL}data/train_queries.json`)
                ]);

                const bookings = await bookingsRes.json();
                const leads = await leadsRes.json();
                const reviews = await reviewsRes.json();
                const trainQueries = await trainRes.json();

                const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.amount || b.price) || 0), 0);
                setStats({
                    totalBookings: bookings.length,
                    totalLeads: leads.length,
                    totalReviews: reviews.length,
                    totalTrainQueries: trainQueries.length,
                    revenue: totalRevenue
                });

                const allActivity = [
                    ...bookings.map(b => ({
                        id: `b-${b.id}`,
                        type: 'booking',
                        title: `New Booking: ${b.tourTitle || 'Package'}`,
                        user: b.customerName || 'Explorer',
                        time: b.date || b.timestamp,
                        icon: 'shopping_cart',
                        color: 'bg-emerald-500'
                    })),
                    ...leads.map(l => ({
                        id: `l-${l.id}`,
                        type: 'lead',
                        title: `Lead Inquiry: ${l.to || 'General'}`,
                        user: l.name,
                        time: l.createdAt || l.timestamp,
                        icon: 'contact_support',
                        color: 'bg-blue-500'
                    })),
                    ...reviews.map(r => ({
                        id: `r-${r.id}`,
                        type: 'review',
                        title: `New ${r.rating}★ Review`,
                        user: r.userName,
                        time: r.createdAt,
                        icon: 'grade',
                        color: 'bg-amber-500'
                    })),
                    ...trainQueries.map(t => ({
                        id: `t-${t.id}`,
                        type: 'train',
                        title: `Train Inquiry: ${t.journeyDetails?.fromStation} to ${t.journeyDetails?.toStation}`,
                        user: t.passengers?.[0]?.firstName || 'Guest',
                        time: t.timestamp,
                        icon: 'train',
                        color: 'bg-orange-500'
                    }))
                ];

                setActivities(allActivity.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10));
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
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{new Date(act.time).toLocaleDateString()}</p>
                                            <p className="text-[10px] font-bold text-slate-300 uppercase">{new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="space-y-8">
                    <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-2 uppercase tracking-tight">System Growth</h3>
                            <p className="text-slate-400 text-xs font-bold mb-8 italic">You've hit 92% of your monthly engagement target!</p>
                            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-4">
                                <div className="bg-[#0a6c75] h-full w-[92%] rounded-full shadow-[0_0_15px_rgba(10,108,117,0.5)] transition-all"></div>
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <span>Performance</span>
                                <span className="text-white">92%</span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-white/5 text-[220px] select-none group-hover:scale-110 transition-transform duration-700">insights</span>
                    </div>

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
