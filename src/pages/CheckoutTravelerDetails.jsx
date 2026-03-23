import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

/**
 * Auto-generated from: checkout_traveler_details/code.html
 * Group: booking | Path: /checkout/traveler
 */
const CheckoutTravelerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const tour = location.state?.tour || { title: "Swiss Alps Scenic Expedition", price: 1200, duration: "7 Days", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLxgDyaZMiLVwrnzOtmWiUiTMMpBEuE_B8MV4IQDe5XIPLka_YpySUxcs6KsDugITyZEzBQwnxgrv2V_4XAJDfMc371IORRKkmrpSkrRsSOL31XyCxgpRTTphOOlVRzphMuSI7HiMoH_6G_jFI6g7uYgDXLKaSig98XDvFn2oyzdKLqwqe8jJkksWidp-81tP4KD5PjFwMv0-RFSE9VNLTa8tLE4aiISmwi3fBzrhm971oytq76R0NG82SF_FFIVZjaiKzF8k1d5xj" };

  const [travelers, setTravelers] = useState([
    { name: '', email: '', phone: '', passport: '' }
  ]);

  const handleTravelerChange = (index, field, value) => {
    const newTravelers = [...travelers];
    newTravelers[index][field] = value;
    setTravelers(newTravelers);
  };

  const handleAddTraveler = () => {
    setTravelers([...travelers, { name: '', email: '', phone: '', passport: '' }]);
  };

  const handleRemoveTraveler = (index) => {
    if (travelers.length > 1) {
      setTravelers(travelers.filter((_, i) => i !== index));
    }
  };

  const handleContinue = () => {
    navigate('/checkout/payment', { state: { tour, travelers } });
  };

  return (
    <div data-page="checkout_traveler_details">
      <div className="layout- flex h-full grow flex-col">
{/* Top Navigation */}

<main className="flex-1 px-6 md:px-20 py-8   w-full">
{/* Progress Bar Section */}
<div className="flex flex-col gap-4 mb-10">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">1</span>
<p className="text-slate-900 dark:text-slate-100 text-base font-bold leading-normal">Traveler Details</p>
</div>
<div className="flex items-center gap-2 opacity-40">
<span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-400 text-white text-xs font-bold">2</span>
<p className="text-slate-900 dark:text-slate-100 text-base font-medium leading-normal">Payment</p>
</div>
<div className="flex items-center gap-2 opacity-40">
<span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-400 text-white text-xs font-bold">3</span>
<p className="text-slate-900 dark:text-slate-100 text-base font-medium leading-normal">Confirmation</p>
</div>
</div>
<div className="h-2 w-full rounded-full bg-primary/20">
<div className="h-2 rounded-full bg-primary" style={{ width: "33%" }}></div>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
{/* Left Section: Form */}
<div className="lg:col-span-2 flex flex-col gap-8">
<div>
<h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight tracking-[-0.033em]">Traveler Details</h1>
<p className="text-primary/70 text-base font-normal leading-normal mt-2">Please enter the information as it appears on official travel documents like your passport.</p>
</div>
{/* Traveler Forms */}
{travelers.map((t, i) => (
<div key={i} className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-xl p-6 shadow-sm">
<div className="flex items-center justify-between mb-6 border-b border-primary/10 pb-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary">{i === 0 ? 'account_circle' : 'group'}</span>
<h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold">{i === 0 ? 'Primary Traveler' : `Traveler ${i + 1}`}</h2>
</div>
{i > 0 && (
<button onClick={() => handleRemoveTraveler(i)} className="text-primary text-sm font-semibold hover:underline">Remove</button>
)}
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<label className="flex flex-col gap-2">
<span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Full Name</span>
<input value={t.name} onChange={(e) => handleTravelerChange(i, 'name', e.target.value)} className="form-input rounded-lg border-primary/20 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4" placeholder="e.g. Johnathan Doe" type="text"/>
</label>
{i === 0 && (
<>
<label className="flex flex-col gap-2">
<span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Email Address</span>
<input value={t.email} onChange={(e) => handleTravelerChange(i, 'email', e.target.value)} className="form-input rounded-lg border-primary/20 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4" placeholder="john@beautifulindia.com" type="email"/>
</label>
<label className="flex flex-col gap-2">
<span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Phone Number</span>
<input value={t.phone} onChange={(e) => handleTravelerChange(i, 'phone', e.target.value)} className="form-input rounded-lg border-primary/20 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4" placeholder="+91 60051 59433" type="tel"/>
</label>
</>
)}
<label className="flex flex-col gap-2">
<span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Passport Number</span>
<input value={t.passport} onChange={(e) => handleTravelerChange(i, 'passport', e.target.value)} className="form-input rounded-lg border-primary/20 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4" placeholder="A00000000" type="text"/>
</label>
</div>
</div>
))}

<button onClick={handleAddTraveler} className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-primary/30 rounded-xl text-primary font-bold hover:bg-primary/5 transition-colors">
<span className="material-symbols-outlined">add_circle</span>
                        Add Another Traveler
                    </button>
<div className="flex justify-end mt-4">
<button onClick={handleContinue} className="bg-primary text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center">
                            Continue to Payment
                        </button>
</div>
</div>
{/* Right Section: Sidebar Booking Summary */}
<aside className="flex flex-col gap-6">
<div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-xl overflow-hidden shadow-sm sticky top-24">
<div className="relative h-48 w-full">
<img alt={tour.title} className="h-full w-full object-cover" src={tour.image}/>
<div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {tour.popular ? 'Bestseller' : 'Top Choice'}
                            </div>
</div>
<div className="p-6">
<h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-2 leading-tight">{tour.title}</h3>
<div className="flex items-center gap-2 text-primary/70 text-sm mb-4">
<span className="material-symbols-outlined text-base">location_on</span>
<span>{tour.destination || 'Global Destination'}</span>
</div>
<div className="space-y-3 py-4 border-y border-primary/10">
<div className="flex justify-between items-center text-sm">
<span className="text-slate-600 dark:text-slate-400">Date:</span>
<span className="font-semibold text-slate-900 dark:text-slate-100">Next Departure</span>
</div>
<div className="flex justify-between items-center text-sm">
<span className="text-slate-600 dark:text-slate-400">Travelers:</span>
<span className="font-semibold text-slate-900 dark:text-slate-100">{travelers.length} Adult(s)</span>
</div>
<div className="flex justify-between items-center text-sm">
<span className="text-slate-600 dark:text-slate-400">Duration:</span>
<span className="font-semibold text-slate-900 dark:text-slate-100">{tour.duration}</span>
</div>
</div>
<div className="pt-6 space-y-2">
<div className="flex justify-between items-center text-sm">
<span className="text-slate-600 dark:text-slate-400">Base Price (x{travelers.length})</span>
                        <span className="text-slate-900 dark:text-slate-100">{formatPrice(tour.price * travelers.length, true)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Service Fee & Taxes (5%)</span>
                        <span className="text-slate-900 dark:text-slate-100">{formatPrice(tour.price * 0.05, true)}</span>
                      </div>
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-base font-bold text-slate-900 dark:text-white">Total Amount</span>
                        <span className="text-2xl font-black text-primary">{formatPrice(tour.price * travelers.length + tour.price * 0.05, true)}</span>
</div>
</div>
</div>
</div>
</aside>
</div>
</main>
</div>
    </div>
  );
};

export default CheckoutTravelerDetails;
