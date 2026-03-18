import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

/**
 * Auto-generated from: checkout_payment_method/code.html
 * Group: booking | Path: /checkout/payment
 */
const CheckoutPaymentMethod = () => {
    const [phone, setPhone] = useState('+916005159433');
    const location = useLocation();
    const navigate = useNavigate();
    const { tour, travelers } = location.state || { 
        tour: { title: "Swiss Alps Grand Expedition", price: 1200, duration: "7-Day Trek", image: "https://images.unsplash.com/photo-1506929113674-bc7f0f7cf49b?auto=format&fit=crop&w=600&q=80" }, 
        travelers: [{ name: "Guest" }] 
    };

    const { formatPrice } = useCurrency();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCompleteBooking = async () => {
        setIsSubmitting(true);
        const bookingData = {
            customerName: travelers[0].name,
            customerEmail: travelers[0].email || 'no-email@beautifulindia.com',
            tourTitle: tour.title,
            tourId: tour.id,
            amount: (tour.price * travelers.length + tour.price * 0.05),
            status: 'Confirmed'
        };

        try {
            // Mocked for static site
            console.log("Booking submitted (mocked):", bookingData);
            const result = {
                ...bookingData,
                id: `MOCK-${Date.now()}`
            };
            navigate('/booking/success', { state: { booking: result, tour } });
        } catch (error) {
            console.error("Error creating booking:", error);
            alert("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div data-page="checkout_payment_method">
            <div className="layout- flex flex-col min-h-screen">
{/* Top Navigation */}

{/* Main Content Section */}
<main className="flex-1   w-full px-6 py-8 lg:px-20">
{/* Breadcrumbs */}
<div className="flex items-center gap-2 text-sm mb-8 text-slate-500 dark:text-slate-400 font-medium">
<span>Tours</span>
<span className="material-symbols-outlined text-xs">chevron_right</span>
<span>Booking Details</span>
<span className="material-symbols-outlined text-xs">chevron_right</span>
<span className="text-slate-900 dark:text-slate-100">Payment</span>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
{/* Left Column: Payment Process */}
<div className="lg:col-span-2 space-y-8">
<div>
<h1 className="text-4xl font-black mb-2">Checkout</h1>
<p className="text-slate-500 dark:text-slate-400">Securely complete your booking for your next adventure.</p>
<p className="text-slate-500 font-bold mb-4">Please note that after clicking 'Complete Payment', your booking will be confirmed instantly. You can also contact our support team at <span className="text-primary">+916005159433</span> for any questions.</p>
</div>
{/* Step Indicator */}
<div className="flex border-b border-slate-200 dark:border-slate-800">
<div className="flex-1 py-4 text-center border-b-2 border-transparent text-slate-400">
<span className="font-bold text-sm tracking-wide uppercase">1. Details</span>
</div>
<div className="flex-1 py-4 text-center border-b-2 border-primary text-slate-900 dark:text-white">
<span className="font-bold text-sm tracking-wide uppercase">2. Payment</span>
</div>
<div className="flex-1 py-4 text-center border-b-2 border-transparent text-slate-400">
<span className="font-bold text-sm tracking-wide uppercase">3. Confirmation</span>
</div>
</div>
{/* Payment Options */}
<div className="space-y-4">
<h3 className="text-lg font-bold">Select Payment Method</h3>
{/* Card Option */}
<div className="border-2 border-primary bg-primary/5 rounded-xl p-5">
<label className="flex items-start gap-4 cursor-pointer">
<input checked={true} readOnly className="mt-1 w-5 h-5 text-primary focus:ring-primary border-slate-300" name="payment" type="radio"/>
<div className="flex-1">
<div className="flex justify-between items-center mb-4">
<div>
<p className="font-bold text-slate-900 dark:text-white">Credit or Debit Card</p>
<p className="text-xs text-slate-500">Secure encrypted transaction via Stripe</p>
</div>
<div className="flex gap-2">
<span className="material-symbols-outlined text-slate-400">credit_card</span>
</div>
</div>
{/* Card Details Form */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
<div className="md:col-span-2">
<label className="block text-xs font-bold uppercase text-slate-500 mb-1">Card Number</label>
<div className="relative">
<input className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary px-4 py-2" placeholder="0000 0000 0000 0000" type="text"/>
<div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
<span className="w-8 h-5 bg-slate-200 rounded-sm"></span>
<span className="w-8 h-5 bg-slate-200 rounded-sm"></span>
</div>
</div>
</div>
<div>
<label className="block text-xs font-bold uppercase text-slate-500 mb-1">Expiry Date</label>
<input className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary px-4 py-2" placeholder="MM / YY" type="text"/>
</div>
<div>
<label className="block text-xs font-bold uppercase text-slate-500 mb-1">CVV</label>
<input className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary px-4 py-2" placeholder="123" type="text"/>
</div>
</div>
</div>
</label>
</div>
</div>
{/* Security Badge */}
<div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl">
<span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-3xl">verified_user</span>
<div>
<p className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">Secure Checkout</p>
<p className="text-emerald-700 dark:text-emerald-400/80 text-xs">Your personal and payment data is encrypted and protected.</p>
</div>
</div>
</div>
{/* Right Column: Sidebar */}
<div className="space-y-6">
<div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-8">
<h3 className="text-xl font-bold mb-6">Booking Summary</h3>
<div className="flex gap-4 mb-6">
<div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
<img alt={tour.title} className="w-full h-full object-cover" src={tour.image}/>
</div>
<div>
<h4 className="font-bold text-sm leading-tight mb-1">{tour.title}</h4>
<div className="flex items-center gap-1 text-xs text-slate-500">
<span className="material-symbols-outlined text-xs">calendar_today</span>
<span>Next Departure • {tour.duration}</span>
</div>
</div>
</div>
<div className="space-y-3 py-6 border-y border-slate-100 dark:border-slate-800">
<div className="flex justify-between text-sm">
<span className="text-slate-500">Base Price ({travelers.length} Adults)</span>
<span className="font-semibold">{formatPrice(tour.price * travelers.length)}</span>
</div>
<div className="flex justify-between text-sm">
<span className="text-slate-500">Service Fee</span>
<span className="font-semibold">{formatPrice(tour.price * 0.05)}</span>
</div>
</div>
<div className="pt-6">
<div className="flex justify-between items-end mb-8">
<span className="text-slate-900 dark:text-white font-bold text-lg">Total Amount</span>
<div className="text-right">
<span className="block text-2xl font-black text-slate-900 dark:text-white">{formatPrice(tour.price * travelers.length + tour.price * 0.05)}</span>
<span className="text-[10px] text-slate-400 uppercase tracking-widest">Inclusive of all taxes</span>
</div>
</div>
<button 
    onClick={handleCompleteBooking}
    disabled={isSubmitting}
    className="w-full py-4 bg-primary text-white font-black rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
>
    <span className="material-symbols-outlined">lock</span>
    {isSubmitting ? 'Processing...' : 'Complete Booking'}
</button>
<p className="text-center text-[10px] text-slate-400 mt-4 px-4">
    By clicking 'Complete Booking' you agree to our Terms of Service.
</p>
</div>
</div>
</div>
</div>
</main>
</div>
        </div>
    );
};

export default CheckoutPaymentMethod;
