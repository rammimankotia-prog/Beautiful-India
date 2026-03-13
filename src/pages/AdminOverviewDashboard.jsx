
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

const AdminOverviewDashboard = () => {
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalLeads: 0,
        totalReviews: 0,
        revenue: 0
    });
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { formatPrice } = useCurrency();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [bookingsRes, leadsRes, reviewsRes, toursRes] = await Promise.all([
                    fetch('http://localhost:3001/api/bookings'),
                    fetch('http://localhost:3001/api/leads'),
                    fetch('http://localhost:3001/api/reviews'),
                    fetch('http://localhost:3001/api/tours')
                ]);

                const bookings = await bookingsRes.json();
                const leads = await leadsRes.json();
                const reviews = await reviewsRes.json();
                const tours = await toursRes.json();

                // Process Stats
                const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0);
                setStats({
                    totalBookings: bookings.length,
                    totalLeads: leads.length,
                    totalReviews: reviews.length,
                    revenue: totalRevenue
                });

                // Combine for Activity Feed
                const allActivity = [
                    ...bookings.map(b => ({
                        id: `b-${b.id}`,
                        type: 'booking',
                        title: `New Booking: ${b.tourName || 'Package'}`,
                        user: b.customerName || 'Explorer',
                        time: b.date || b.timestamp,
                        icon: 'shopping_cart',
                        color: 'bg-emerald-500'
                    })),
                    ...leads.map(l => ({
                        id: `l-${l.id}`,
                        type: 'lead',
                        title: `Lead Inquiry: ${l.to}`,
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
                    }))
                ];

                // Sort by time descending
                setActivities(allActivity.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 15));
                setLoading(false);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
                <div className="p-8">
                    <Link to="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                            <span className="material-symbols-outlined text-white">explore</span>
                        </div>
                        <span className="font-black text-xl tracking-tighter uppercase text-slate-800">Admin</span>
                    </Link>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <Link className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold" to="/admin">
                        <span className="material-symbols-outlined">space_dashboard</span>
                        <span>Overview</span>
                    </Link>
                    <Link className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-bold transition-all" to="/admin/bookings">
                        <span className="material-symbols-outlined">group</span>
                        <span>Bookings</span>
                    </Link>
                    <Link className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-bold transition-all" to="/admin/queries">
                        <span className="material-symbols-outlined">contact_support</span>
                        <span>Queries</span>
                    </Link>
                    <Link className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-bold transition-all" to="/admin/tours">
                         <span className="material-symbols-outlined">tour</span>
                         <span>Tours</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-10">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Executive Overview</h1>
                            <p className="text-slate-500 font-bold mt-1 italics">Your business at a glance.</p>
                        </div>
                        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">System Live: Port 3001</span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                        {[
                            { label: 'Total Revenue', value: formatPrice(stats.revenue), icon: 'payments', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: 'Total Bookings', value: stats.totalBookings, icon: 'receipt_long', color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'Tour Inquiries', value: stats.totalLeads, icon: 'campaign', color: 'text-purple-600', bg: 'bg-purple-50' },
                            { label: 'Happy Reviews', value: stats.totalReviews, icon: 'sentiment_very_satisfied', color: 'text-amber-600', bg: 'bg-amber-50' }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                                <div className={`${stat.bg} w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color} mb-6`}>
                                    <span className="material-symbols-outlined text-[32px]">{stat.icon}</span>
                                </div>
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</h3>
                                <p className="text-3xl font-black text-slate-800">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Recent Activity Feed */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-8 px-2">
                                <h2 className="text-2xl font-black text-slate-800">Recent Activity</h2>
                                <button className="text-primary font-black text-xs uppercase tracking-widest hover:underline">View All Logs</button>
                            </div>
                            
                            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-4">
                                {loading ? (
                                    <div className="h-64 flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {activities.map((act) => (
                                            <div key={act.id} className="flex items-center gap-6 p-6 rounded-3xl hover:bg-slate-50 transition-colors group">
                                                <div className={`${act.color} text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                                    <span className="material-symbols-outlined">{act.icon}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-black text-slate-800 leading-tight mb-1">{act.title}</p>
                                                    <p className="text-sm text-slate-500 font-bold">by {act.user}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(act.time).toLocaleDateString()}</p>
                                                    <p className="text-[10px] font-bold text-slate-300">{new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions / Performance */}
                        <div className="space-y-8">
                            <div className="bg-[#0a3161] p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-black mb-4">Wanderlust Growth</h3>
                                    <p className="text-slate-300 text-sm font-bold mb-8 italic">You've hit 100% of your targets this month!</p>
                                    <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mb-4">
                                        <div className="bg-primary h-full w-[85%] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)]"></div>
                                    </div>
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                                        <span>Progress</span>
                                        <span>85%</span>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-white/5 text-[200px] select-none">trending_up</span>
                            </div>

                            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                                <h3 className="text-lg font-black text-slate-800 mb-6 px-2">Quick Commands</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <Link to="/admin/tours/new" className="flex flex-col items-center justify-center p-6 rounded-3xl border border-slate-50 hover:border-primary hover:bg-primary/5 transition-all gap-3 group">
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">add_location</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-primary transition-colors text-center">New Tour</span>
                                    </Link>
                                    <Link to="/admin/guides/new" className="flex flex-col items-center justify-center p-6 rounded-3xl border border-slate-50 hover:border-blue-500 hover:bg-blue-50 transition-all gap-3 group">
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-500 transition-colors">article</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-blue-500 transition-colors text-center">New Article</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminOverviewDashboard;
