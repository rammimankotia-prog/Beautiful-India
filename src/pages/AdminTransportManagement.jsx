import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminTransportManagement = () => {
    const [activeTab, setActiveTab] = useState('inventory');
    const [vehicles, setVehicles] = useState([]);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [vRes, lRes] = await Promise.all([
                fetch(`${import.meta.env.BASE_URL}data/transport-vehicles.json`),
                fetch(`${import.meta.env.BASE_URL}data/transport-leads.json`)
            ]);
            const vData = await vRes.json();
            const lData = await lRes.json();
            setVehicles(vData);
            setLeads(lData);
        } catch (err) {
            console.error("Error fetching transport data:", err);
        }
        setLoading(false);
    };

    const handleDeleteVehicle = (id) => {
        if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
        setVehicles(vehicles.filter(v => v.id !== id));
        // Simulation: in real app, we would POST to an API to save the JSON
    };

    return (
        <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2">Fleet Command</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold italic">Manage your logistics, vehicles, and transport leads.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-slate-900 dark:bg-slate-800 text-white font-black py-3.5 px-8 rounded-2xl transition-all shadow-lg flex items-center gap-2 text-xs uppercase tracking-widest active:scale-95">
                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                        Add New Vehicle
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 p-1.5 bg-slate-100 dark:bg-slate-900 w-fit rounded-3xl border border-slate-200 dark:border-slate-800">
                <button 
                    onClick={() => setActiveTab('inventory')}
                    className={`px-8 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">directions_car</span>
                        Inventory
                    </span>
                </button>
                <button 
                    onClick={() => setActiveTab('leads')}
                    className={`px-8 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">contact_support</span>
                        Queries & Leads
                    </span>
                </button>
                <button 
                    onClick={() => setActiveTab('calendar')}
                    className={`px-8 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'calendar' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">event_available</span>
                        Availability
                    </span>
                </button>
            </div>

            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold italic">Loading fleet data...</p>
                </div>
            ) : activeTab === 'inventory' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {vehicles.map(vehicle => (
                        <div key={vehicle.id} className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group">
                            <div className="h-48 relative overflow-hidden bg-slate-50 dark:bg-slate-800">
                                <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'} />
                                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-[9px] font-black text-slate-800 uppercase tracking-widest shadow-sm">
                                    {vehicle.type}
                                </div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{vehicle.name}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{vehicle.capacity} Seater • {vehicle.comfort}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${vehicle.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                        {vehicle.status}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Per KM</p>
                                        <p className="text-lg font-black text-slate-800 dark:text-slate-100">₹{vehicle.pricePerKm}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Per Day</p>
                                        <p className="text-lg font-black text-slate-800 dark:text-slate-100">₹{vehicle.pricePerDay}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-6 border-t border-slate-50 dark:border-slate-800">
                                    <button className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-colors">Edit</button>
                                    <button onClick={() => handleDeleteVehicle(vehicle.id)} className="w-12 h-12 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-500 transition-all">
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Add Placeholder */}
                    <button className="h-full min-h-[450px] rounded-[32px] border-4 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-4 text-slate-300 hover:border-primary hover:text-primary transition-all group">
                        <span className="material-symbols-outlined text-5xl group-hover:scale-110 transition-transform">add_circle</span>
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Add New Vehicle</span>
                    </button>
                </div>
            ) : activeTab === 'leads' ? (
                <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Inquiry Date</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle Request</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {leads.length > 0 ? leads.map(lead => (
                                    <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-slate-800 dark:text-slate-100">{new Date(lead.timestamp).toLocaleDateString()}</p>
                                            <p className="text-[10px] text-slate-400 uppercase">{new Date(lead.timestamp).toLocaleTimeString()}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-slate-800 dark:text-slate-100">{lead.name}</p>
                                            <p className="text-[10px] text-slate-400 uppercase">{lead.phone}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest">{lead.vehicle}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{lead.pickup} ➔ {lead.drop}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{lead.tripType}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest">{lead.status}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center">
                                            <div className="space-y-4">
                                                <span className="material-symbols-outlined text-5xl text-slate-200">inbox</span>
                                                <p className="text-slate-400 font-bold italic tracking-wide">No transport inquiries yet.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800">
                    <span className="material-symbols-outlined text-6xl text-slate-200 mb-6">event_available</span>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">Inventory Calendar</h3>
                    <p className="text-slate-400 font-bold max-w-md mx-auto mt-2">Coming soon: A visual calendar to track vehicle availability and maintenance schedules.</p>
                </div>
            )}
        </div>
    );
};

export default AdminTransportManagement;
