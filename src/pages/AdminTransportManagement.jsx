import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminTransportManagement = () => {
    const [activeTab, setActiveTab] = useState('inventory');
    const [vehicles, setVehicles] = useState([]);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [toast, setToast] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        type: 'SUV',
        capacity: '',
        comfort: 'Premium',
        pricePerKm: '',
        pricePerDay: '',
        images: [], // Array of {url, isPrimary}
        status: 'active',
        features: 'AC, Music, Professional Driver'
    });

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [vRes, lRes] = await Promise.all([
                fetch(`/fleet_api/fleet_manager.php?t=${Date.now()}`, { cache: 'no-store' }),
                fetch(`/fleet_api/fleet_leads.php?t=${Date.now()}`, { cache: 'no-store' })
            ]);

            // Guard: if server returns HTML (SPA fallback), bail early
            const vCT = vRes.headers.get('content-type') || '';
            const lCT = lRes.headers.get('content-type') || '';

            let vData = [], lData = [];

            if (vCT.includes('application/json')) {
                try { vData = await vRes.json(); } catch(e) { console.error('Vehicles JSON parse error', e); }
            } else {
                const vText = await vRes.text();
                console.error('Vehicles API returned non-JSON:', vText.substring(0, 120));
            }

            if (lCT.includes('application/json')) {
                try { lData = await lRes.json(); } catch(e) { console.error('Leads JSON parse error', e); }
            } else {
                const lText = await lRes.text();
                console.error('Leads API returned non-JSON:', lText.substring(0, 120));
            }

            setVehicles(Array.isArray(vData) ? vData : []);
            setLeads(Array.isArray(lData) ? lData : []);
        } catch (err) {
            console.error('Error fetching transport data:', err);
            showToast('Failed to load data');
        }
        setLoading(false);
    };

    const handleOpenModal = (vehicle = null) => {
        if (vehicle) {
            setEditingVehicle(vehicle);
            setFormData({
                ...vehicle,
                images: vehicle.images || (vehicle.image ? [{url: vehicle.image, isPrimary: true}] : [])
            });
        } else {
            setEditingVehicle(null);
            setFormData({
                id: 'V' + Date.now(),
                name: '',
                type: 'SUV',
                capacity: '7',
                comfort: 'Premium',
                pricePerKm: '18',
                pricePerDay: '3500',
                images: [],
                status: 'active',
                features: 'AC, Music, Professional Driver'
            });
        }
        setShowModal(true);
    };

    const handleSaveVehicle = async (e) => {
        e.preventDefault();
        try {
            const finalData = {
                ...formData,
                features: typeof formData.features === 'string'
                    ? formData.features.split(',').map(s => s.trim())
                    : formData.features
            };

            const res = await fetch('/fleet_api/fleet_manager.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData)
            });

            const ct = res.headers.get('content-type') || '';
            if (!ct.includes('application/json')) {
                const raw = await res.text();
                console.error('Save API returned non-JSON:', raw.substring(0, 200));
                showToast('Server error: PHP not executing on this path');
                return;
            }

            const result = await res.json();
            if (result.success) {
                showToast(editingVehicle ? 'Vehicle updated!' : 'New vehicle added!');
                setShowModal(false);
                fetchData();
            } else {
                showToast(result.message || 'Save failed');
            }
        } catch (err) {
            console.error('Save error:', err);
            showToast('Network error');
        }
    };

    const handleDeleteVehicle = async (id) => {
        if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
        try {
            const res = await fetch(`/fleet_api/fleet_manager.php?action=delete&id=${id}`, { method: 'POST' });
            const ct = res.headers.get('content-type') || '';
            if (!ct.includes('application/json')) {
                const raw = await res.text();
                console.error('Delete API returned non-JSON:', raw.substring(0, 200));
                showToast('Server error on delete');
                return;
            }
            const result = await res.json();
            if (result.success) {
                showToast('Vehicle removed');
                setVehicles(prev => prev.filter(v => v.id !== id));
            } else {
                showToast(result.message || 'Delete failed');
            }
        } catch (err) {
            showToast('Network error');
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        showToast("Uploading media...");
        for (const file of files) {
            const formDataUpload = new FormData();
            formDataUpload.append('image', file);

            try {
                const res = await fetch('/api-upload-image.php', {
                    method: 'POST',
                    body: formDataUpload
                });
                const result = await res.json();
                if (result.success) {
                    setFormData(prev => {
                        const currentImages = prev.images || [];
                        return {
                            ...prev,
                            images: [
                                ...currentImages, 
                                { url: result.url, isPrimary: currentImages.length === 0 }
                            ]
                        };
                    });
                } else {
                    console.error("Server returned upload error:", result.error);
                    showToast("Upload failed: " + (result.error || "Unknown error"));
                }
            } catch (err) {
                console.error("Upload failed", err);
                showToast("Upload network error");
            }
        }
        showToast("Media updated!");
    };

    const setPrimaryImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.map((img, i) => ({
                ...img,
                isPrimary: i === index
            }))
        }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    return (
        <div data-page="admin_transport_management" className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-500">
            {/* Toast */}
            {toast && (
                <div className="fixed bottom-10 right-10 z-[200] animate-in slide-in-from-bottom duration-300">
                    <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
                        <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                        <span className="font-black text-xs uppercase tracking-widest">{toast}</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2">Fleet Command</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold italic">Manage your logistics, vehicles, and transport leads.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => handleOpenModal()}
                        className="bg-slate-900 dark:bg-slate-800 text-white font-black py-3.5 px-8 rounded-2xl transition-all shadow-lg flex items-center gap-2 text-xs uppercase tracking-widest active:scale-95"
                    >
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
                                            <div className="relative h-48 overflow-hidden rounded-[24px] border border-slate-100 dark:border-slate-800">
                                                <img 
                                                    src={vehicle.images?.find(i => i.isPrimary)?.url || vehicle.image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'} 
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" 
                                                    alt={vehicle.name} 
                                                />
                                                <div className="absolute top-4 left-4 flex gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg ${vehicle.status === 'active' ? 'bg-emerald-500/90 text-white' : 'bg-slate-500/90 text-white'}`}>
                                                        {vehicle.status}
                                                    </span>
                                                </div>
                                                <div className="absolute top-4 right-4 flex gap-2">
                                                    <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[8px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest shadow-lg border border-white/20">
                                                        {vehicle.images?.length || 0} Photos
                                                    </span>
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
                                    <button 
                                        onClick={() => handleOpenModal(vehicle)}
                                        className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteVehicle(vehicle.id)} className="w-12 h-12 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-500 transition-all">
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Add Placeholder */}
                    <button 
                        onClick={() => handleOpenModal()}
                        className="h-full min-h-[450px] rounded-[32px] border-4 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-4 text-slate-300 hover:border-primary hover:text-primary transition-all group"
                    >
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
                                            <p className="text-sm font-black text-slate-800 dark:text-slate-100">{new Date(lead.timestamp || lead.createdAt).toLocaleDateString()}</p>
                                            <p className="text-[10px] text-slate-400 uppercase">{new Date(lead.timestamp || lead.createdAt).toLocaleTimeString()}</p>
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 lg:p-10">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowModal(false)}></div>
                    <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <form onSubmit={handleSaveVehicle}>
                            <div className="p-8 lg:p-12 space-y-8 max-h-[85vh] overflow-y-auto">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
                                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Vehicle Specifications</p>
                                    </div>
                                    <button type="button" onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Vehicle Name</label>
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="e.g. Toyota Innova Crysta"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 dark:text-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Vehicle Type</label>
                                        <select 
                                            value={formData.type}
                                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 dark:text-slate-200"
                                        >
                                            <option>SUV</option>
                                            <option>Sedan</option>
                                            <option>Tempo Traveler</option>
                                            <option>Mini Coach</option>
                                            <option>Hatchback</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Seating Capacity</label>
                                        <input 
                                            required
                                            type="number" 
                                            placeholder="e.g. 7"
                                            value={formData.capacity}
                                            onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 dark:text-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Comfort Level</label>
                                        <select 
                                            value={formData.comfort}
                                            onChange={(e) => setFormData({...formData, comfort: e.target.value})}
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 dark:text-slate-200"
                                        >
                                            <option>Economy</option>
                                            <option>Standard</option>
                                            <option>Premium</option>
                                            <option>Luxury</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Price Per KM (₹)</label>
                                        <input 
                                            required
                                            type="number" 
                                            placeholder="e.g. 18"
                                            value={formData.pricePerKm}
                                            onChange={(e) => setFormData({...formData, pricePerKm: e.target.value})}
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 dark:text-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Price Per Day (₹)</label>
                                        <input 
                                            required
                                            type="number" 
                                            placeholder="e.g. 3500"
                                            value={formData.pricePerDay}
                                            onChange={(e) => setFormData({...formData, pricePerDay: e.target.value})}
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 dark:text-slate-200"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Vehicle Features (Comma Separated)</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. AC, Music System, First Aid, Luggage Space"
                                        value={formData.features}
                                        onChange={(e) => setFormData({...formData, features: e.target.value})}
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 dark:text-slate-200"
                                    />
                                </div>

                                {/* Media Management */}
                                <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Vehicle Media Library</label>
                                        <label className="cursor-pointer group">
                                            <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                                            <span className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                                                <span className="material-symbols-outlined text-sm">cloud_upload</span>
                                                Upload Photos
                                            </span>
                                        </label>
                                    </div>

                                    {formData.images.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {formData.images.map((img, idx) => (
                                                <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden group border-2 border-slate-100 dark:border-slate-800">
                                                    <img src={img.url} className="w-full h-full object-cover" alt="" />
                                                    
                                                    {/* Badges */}
                                                    {img.isPrimary && (
                                                        <div className="absolute top-2 left-2 bg-primary text-white text-[8px] font-black uppercase px-2 py-1 rounded-md shadow-lg">Primary</div>
                                                    )}

                                                    {/* Controls Overlay */}
                                                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        {!img.isPrimary && (
                                                            <button 
                                                                type="button"
                                                                onClick={() => setPrimaryImage(idx)}
                                                                className="size-8 rounded-lg bg-white/20 backdrop-blur-md text-white hover:bg-primary transition-colors flex items-center justify-center"
                                                                title="Set as Primary"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">star</span>
                                                            </button>
                                                        )}
                                                        <button 
                                                            type="button"
                                                            onClick={() => removeImage(idx)}
                                                            className="size-8 rounded-lg bg-white/20 backdrop-blur-md text-white hover:bg-red-500 transition-colors flex items-center justify-center"
                                                            title="Delete"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 text-slate-300">
                                            <span className="material-symbols-outlined text-4xl">add_photo_alternate</span>
                                            <p className="text-[10px] font-black uppercase tracking-widest">No images uploaded yet</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <button 
                                        type="submit"
                                        className="flex-1 py-5 bg-slate-900 text-white rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                                    >
                                        {editingVehicle ? 'Update Fleet' : 'Add to Fleet'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTransportManagement;
