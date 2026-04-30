import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

const FleetListingPage = () => {
    const { formatPrice } = useCurrency();
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters State
    const [filters, setFilters] = useState({
        destination: '',
        capacity: '',
        comfort: '',
        tripType: 'outstation'
    });

    // Booking Details State
    const [bookingDetails, setBookingDetails] = useState({
        fromDate: '',
        toDate: '',
        pickup: '',
        drop: '',
        time: '10:00 AM'
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [inquiryForm, setInquiryForm] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetch(`/fleet_api/fleet_manager.php?t=${Date.now()}`)
            .then(async res => {
                const ct = res.headers.get('content-type') || '';
                if (!ct.includes('application/json')) {
                    throw new Error('API returned non-JSON. SPA fallback hit?');
                }
                return res.json();
            })
            .then(data => {
                setVehicles(Array.isArray(data) ? data : []);
                setFilteredVehicles(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading fleet:", err);
                setVehicles([]);
                setFilteredVehicles([]);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let results = vehicles;
        if (filters.destination) {
            results = results.filter(v => v.destinations.includes(filters.destination));
        }
        if (filters.capacity) {
            results = results.filter(v => v.capacity >= parseInt(filters.capacity));
        }
        if (filters.comfort) {
            results = results.filter(v => v.comfort === filters.comfort);
        }
        setFilteredVehicles(results);
    }, [filters, vehicles]);

    const handleInquiry = (vehicle) => {
        setSelectedVehicle(vehicle);
        setShowModal(true);
    };

    const submitInquiry = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`/fleet_api/fleet_leads.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...inquiryForm,
                    to: selectedVehicle.name,
                    source: 'Transport Fleet',
                    departureDate: bookingDetails.fromDate || 'Not specified',
                    returnDate: bookingDetails.toDate || 'Not specified',
                    pickup: bookingDetails.pickup,
                    status: 'New'
                })
            });
            if (res.ok) {
                alert("Thank you! Your inquiry has been received. Our team will contact you shortly.");
                setShowModal(false);
                setInquiryForm({ name: '', phone: '', email: '', message: '' });
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("Connection error.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div data-page="fleet_listing_page" className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[450px] overflow-hidden">
                <img 
                    src="/transport_fleet_hero_1777310382480.png" 
                    alt="Transport Hero" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent flex items-center">
                    <div className="container mx-auto px-6">
                        <div className="max-w-2xl space-y-6">
                            <span className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-primary font-black text-[10px] uppercase tracking-[0.2em]">
                                Premium Fleet Management
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter">
                                Ride in Comfort, <br /> Explore with <span className="text-primary">Style.</span>
                            </h1>
                            <p className="text-lg text-slate-200 font-medium max-w-lg">
                                From luxury MUVs for family trips to rugged SUVs for Himalayan adventures. Your journey starts here.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-16">
                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-80 space-y-8">
                        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-8">Refine Search</h3>
                            
                            <div className="space-y-8">
                                <section className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                                    <select 
                                        value={filters.destination}
                                        onChange={(e) => setFilters({...filters, destination: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    >
                                        <option value="">All Regions</option>
                                        <option value="Kashmir">Jammu & Kashmir</option>
                                        <option value="Ladakh">Ladakh</option>
                                        <option value="Delhi">Delhi / NCR</option>
                                        <option value="Agra">Agra (Taj Mahal)</option>
                                        <option value="Jaipur">Jaipur (Pink City)</option>
                                    </select>
                                </section>

                                <section className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacity</p>
                                    <select 
                                        value={filters.capacity}
                                        onChange={(e) => setFilters({...filters, capacity: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    >
                                        <option value="">Any Capacity</option>
                                        <option value="4">4 Seater</option>
                                        <option value="6">6 Seater</option>
                                        <option value="7">7 Seater</option>
                                        <option value="9">9+ Seater</option>
                                    </select>
                                </section>

                                <section className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Comfort Class</p>
                                    <div className="space-y-2">
                                        {['AC', 'Non-AC'].map(type => (
                                            <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                                <input 
                                                    type="radio" 
                                                    name="comfort" 
                                                    className="w-5 h-5 rounded-full border-slate-200 text-primary focus:ring-0" 
                                                    onChange={() => setFilters({...filters, comfort: type})}
                                                    checked={filters.comfort === type}
                                                />
                                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">{type} Vehicles</span>
                                            </label>
                                        ))}
                                    </div>
                                </section>


                            </div>
                        </div>

                        {/* Special Offers */}
                        <div className="space-y-6">
                            {/* Airport Transfer */}
                            <div className="bg-gradient-to-br from-[#0a6c75] to-[#085a62] rounded-[32px] p-8 text-white space-y-4 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                <h4 className="text-2xl font-black leading-tight">Airport Transfers <br />@ Flat Rates</h4>
                                <p className="text-white/70 text-xs font-bold leading-relaxed">Book a luxury sedan for Srinagar or Delhi airport at pre-fixed affordable prices.</p>
                                <button className="px-6 py-2.5 bg-white text-[#0a6c75] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">Book Now</button>
                            </div>

                            {/* Train Tickets */}
                            <div className="bg-gradient-to-br from-[#c2410c] to-[#9a3412] rounded-[32px] p-8 text-white space-y-4 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                <h4 className="text-2xl font-black leading-tight">Book Train <br />Tickets</h4>
                                <p className="text-white/70 text-xs font-bold leading-relaxed">Hassle-free train bookings across India. Fast, secure, and instant confirmation.</p>
                                <Link 
                                    to="/booking/train" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-block px-6 py-2.5 bg-white text-[#c2410c] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
                                >
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <div className="flex-1 space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Available Fleet</h2>
                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black text-slate-500 uppercase">{filteredVehicles.length} Models</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {loading ? (
                                Array(4).fill(0).map((_, i) => (
                                    <div key={i} className="h-[450px] bg-white dark:bg-slate-900 rounded-[40px] animate-pulse"></div>
                                ))
                            ) : filteredVehicles.length > 0 ? (
                                filteredVehicles.map(vehicle => (
                                    <div key={vehicle.id} className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2">
                                        <div className="relative h-64 overflow-hidden">
                                            <img 
                                                src={vehicle.images?.find(i => i.isPrimary)?.url || vehicle.image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'} 
                                                alt={vehicle.name} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'}
                                            />
                                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                                <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-slate-800 uppercase tracking-widest shadow-lg">
                                                    {vehicle.type}
                                                </span>
                                            </div>
                                            <div className="absolute bottom-6 right-6">
                                                <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
                                                    <span className="material-symbols-outlined">{vehicle.capacity > 7 ? 'shuttle' : 'directions_car'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="p-8 space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-1">{vehicle.name}</h3>
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                            <span className="material-symbols-outlined text-[16px]">person</span> {vehicle.capacity} Seats
                                                        </span>
                                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                        <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                                            <span className="material-symbols-outlined text-[16px]">ac_unit</span> {vehicle.comfort}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Starting From</p>
                                                    <p className="text-2xl font-black text-[#0a6c75]">₹{Number(vehicle.pricePerDay).toLocaleString('en-IN')}<span className="text-sm font-bold text-slate-400">/day</span></p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {vehicle.features.map(feat => (
                                                    <span key={feat} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-[9px] font-bold text-slate-500 uppercase">{feat}</span>
                                                ))}
                                            </div>

                                            <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center gap-4">
                                                <button 
                                                    onClick={() => handleInquiry(vehicle)}
                                                    className="flex-1 py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 transition-colors shadow-lg active:scale-95"
                                                >
                                                    Generate Inquiry
                                                </button>
                                                <Link 
                                                    to={`/transport/${vehicle.id}`}
                                                    className="size-14 flex items-center justify-center border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:border-primary hover:text-primary transition-all group/btn"
                                                >
                                                    <span className="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center space-y-6">
                                    <span className="material-symbols-outlined text-6xl text-slate-200">car_crash</span>
                                    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">No vehicles match your criteria.</h3>
                                    <p className="text-slate-400 font-bold max-w-sm mx-auto">Try adjusting your filters or contact our support team for a custom arrangement.</p>
                                    <button onClick={() => setFilters({destination:'', capacity:'', comfort:'', tripType:'outstation'})} className="px-8 py-3 bg-primary text-white rounded-full text-xs font-black uppercase tracking-widest">Reset All Filters</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-slate-900 py-24 text-white overflow-hidden relative">
                 <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                        <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">The Golden Standard</span>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">Why Book Your Cab with Us?</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: 'Verified Drivers', desc: 'All our pilots are police-verified with minimum 5+ years of experience in Himalayan terrains.', icon: 'verified_user' },
                            { title: 'Zero Hidden Charges', desc: 'Pre-fixed rates including fuel, toll, and state taxes. What you see is what you pay.', icon: 'currency_rupee' },
                            { title: '24/7 Roadside Support', desc: 'On-ground assistance and backup vehicle guarantee in case of technical issues.', icon: 'support_agent' }
                        ].map(item => (
                            <div key={item.title} className="space-y-4 text-center">
                                <div className="size-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary border border-white/10">
                                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                                </div>
                                <h4 className="text-xl font-black tracking-tight">{item.title}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>

            {/* Inquiry Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
                    <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 space-y-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">Secure Booking Inquiry</span>
                                    <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Interested in {selectedVehicle?.name}?</h3>
                                </div>
                                <button onClick={() => setShowModal(false)} className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <form onSubmit={submitInquiry} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                                    <input 
                                        required
                                        type="text" 
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                        value={inquiryForm.name}
                                        onChange={(e) => setInquiryForm({...inquiryForm, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                                    <input 
                                        required
                                        type="tel" 
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                        value={inquiryForm.phone}
                                        onChange={(e) => setInquiryForm({...inquiryForm, phone: e.target.value})}
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                                    <input 
                                        required
                                        type="email" 
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                        value={inquiryForm.email}
                                        onChange={(e) => setInquiryForm({...inquiryForm, email: e.target.value})}
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Any Special Requests?</label>
                                    <textarea 
                                        rows="3"
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold resize-none"
                                        value={inquiryForm.message}
                                        onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
                                    ></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <button 
                                        disabled={submitting}
                                        className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
                                    >
                                        {submitting ? 'Sending Request...' : 'Send Inquiry Request'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FleetListingPage;
