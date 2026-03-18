
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Auto-generated from: gift_card_checkout_delivery/code.html
 * Group: gifts | Path: /gift-cards/checkout
 */
const GiftCardCheckoutDelivery = () => {
  return (
    <div data-page="gift_card_checkout_delivery">
      <div className="relative flex min-h-screen flex-col">
{/* Top Navigation */}

<main className=" flex w-full  flex-1 flex-col px-6 lg:px-20 py-10">
{/* Breadcrumbs */}
<nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
<a className="hover:text-primary" href="#">Gift Cards</a>
<span className="material-symbols-outlined text-sm">chevron_right</span>
<a className="hover:text-primary" href="#">Personalize</a>
<span className="material-symbols-outlined text-sm">chevron_right</span>
<span className="text-primary font-bold">Checkout &amp; Delivery</span>
</nav>
<div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
{/* Left Column: Checkout Details */}
<div className="lg:col-span-8 flex flex-col gap-10">
<section>
<h2 className="mb-2 text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">Checkout &amp; Delivery</h2>
<p className="text-slate-600 dark:text-slate-400">Complete your purchase securely and choose how to send your holiday gift.</p>
</section>
{/* Delivery Method Selection */}
<section className="flex flex-col gap-6">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary">local_shipping</span>
<h3 className="text-xl font-bold">Delivery Method</h3>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<label className="group relative flex cursor-pointer items-start gap-4 rounded-xl border-2 border-primary bg-white p-5 transition-all dark:bg-slate-900">
<input checked="" className="mt-1 h-4 w-4 text-primary focus:ring-primary" name="delivery" type="radio"/>
<div className="flex flex-col gap-1">
<span className="font-bold">Send Digitally (Email)</span>
<span className="text-sm text-slate-500">Deliver instantly to their inbox. Eco-friendly and fast.</span>
</div>
<span className="material-symbols-outlined ml-auto text-primary">mail</span>
</label>
<label className="group relative flex cursor-pointer items-start gap-4 rounded-xl border-2 border-slate-200 bg-white p-5 transition-all hover:border-primary/50 dark:border-slate-800 dark:bg-slate-900">
<input className="mt-1 h-4 w-4 text-primary focus:ring-primary" name="delivery" type="radio"/>
<div className="flex flex-col gap-1">
<span className="font-bold">Print at Home</span>
<span className="text-sm text-slate-500">Get a high-quality PDF to hand-deliver or mail yourself.</span>
</div>
<span className="material-symbols-outlined ml-auto text-slate-400">print</span>
</label>
</div>
<div className="flex flex-col gap-4 rounded-xl bg-primary/5 p-6 border border-primary/10">
<div className="flex flex-col gap-2">
<label className="text-sm font-semibold">Recipient Email Address</label>
<input className="w-full rounded-lg border-slate-200 bg-white px-4 py-2.5 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800" placeholder="john.doe@beautifulindia.com" type="email"/>
</div>
<div className="flex flex-col gap-2">
<label className="text-sm font-semibold">Delivery Date</label>
<div className="relative">
<input className="w-full rounded-lg border-slate-200 bg-white px-4 py-2.5 pr-10 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800" type="text" value="Today (Instant)"/>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">calendar_month</span>
</div>
</div>
</div>
</section>
{/* Payment Method */}
<section className="flex flex-col gap-6">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary">payments</span>
<h3 className="text-xl font-bold">Payment Method</h3>
</div>
<div className="rounded-xl border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-900">
{/* Credit Card Option */}
<div className="p-6 border-b border-slate-100 dark:border-slate-800">
<div className="mb-6 flex items-center justify-between">
<label className="flex items-center gap-3 cursor-pointer">
<input checked="" className="h-4 w-4 text-primary focus:ring-primary" name="payment" type="radio"/>
<span className="font-bold">Credit or Debit Card</span>
</label>
<div className="flex gap-2">
<div className="h-6 w-9 rounded bg-slate-100 p-1 flex items-center justify-center dark:bg-slate-800">
<img alt="Visa" data-alt="Visa payment network logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUkTRB3Vq8WbadBRDCpBglFiRdOPZr8Ve9Ss4xnLBAvm-xG80CyP4hq3eYb6bpctipQzy63v9wGSEZhdEDf1wFd-yUp_WFv167g5UKR05dbCVBnwmHHMoVa5Iuxb1jaofK2syI-sKOq6GDfW4ZA9bDUgScOYcsbU0jL2PdTBVKsICvOrbamsc6cpH3h-N80_IabYggBULpZEsdEKur-jX03S1-6DUG0xBLlVZTI3UTJNKqe3U5wdvonXta841fZJihG8h72qNtWNNW"/>
</div>
<div className="h-6 w-9 rounded bg-slate-100 p-1 flex items-center justify-center dark:bg-slate-800">
<img alt="Mastercard" data-alt="Mastercard payment network logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYlsWv-1dYJG9rtPUXIki0r-2feodKIFMeqJ79JKQhDJcdoQX6QnhSDWc5X3N1XWrmO8692v0wnZg-NQJ1oZeGlPKymriu664_e67iNNz3fAzJzCsOxE05cpucLtfGcMJUYrdo61xD10HhqfnU1wjzyRXq1ClCQwMFHkMicl_loN8f06qs_Jlmuzw79ddv9QH5NdRnt-4px2tF6qq9YhMLCLhKD_Aq4GJ07FHMsmAUcsI8yg-P-7qOqa9o_ojc7aLwUdisV0APdPfs"/>
</div>
</div>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="col-span-2 flex flex-col gap-2">
<label className="text-xs font-bold uppercase tracking-wider text-slate-500">Card Number</label>
<div className="relative">
<input className="w-full rounded-lg border-slate-200 bg-white px-4 py-3 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800" placeholder="+916005159433000 0000" type="text"/>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
</div>
</div>
<div className="flex flex-col gap-2">
<label className="text-xs font-bold uppercase tracking-wider text-slate-500">Expiry Date</label>
<input className="w-full rounded-lg border-slate-200 bg-white px-4 py-3 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800" placeholder="MM / YY" type="text"/>
</div>
<div className="flex flex-col gap-2">
<label className="text-xs font-bold uppercase tracking-wider text-slate-500">CVV</label>
<input className="w-full rounded-lg border-slate-200 bg-white px-4 py-3 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800" placeholder="123" type="text"/>
</div>
</div>
</div>
{/* PayPal Option */}
<div className="p-6 bg-slate-50 dark:bg-slate-900/50">
<label className="flex items-center gap-3 cursor-pointer">
<input className="h-4 w-4 text-primary focus:ring-primary" name="payment" type="radio"/>
<span className="font-bold">PayPal</span>
<span className="ml-auto text-sm text-slate-500 italic">You'll be redirected to PayPal's secure site.</span>
</label>
</div>
</div>
</section>
{/* Action */}
<button className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-[0.98]">
                    Complete Payment - $100.00
                </button>
</div>
{/* Right Column: Sidebar Summary */}
<aside className="lg:col-span-4">
<div className="sticky top-28 flex flex-col gap-6 rounded-2xl border border-primary/20 bg-white p-6 shadow-xl dark:bg-slate-900">
<div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
<h3 className="text-xl font-bold">Order Summary</h3>
<span className="material-symbols-outlined text-primary">receipt_long</span>
</div>
<div className="flex flex-col gap-6">
{/* Card Design Preview */}
<div className="relative overflow-hidden rounded-xl bg-primary/10 p-4 ring-1 ring-primary/20">
<div className="flex items-center gap-4">
<div className="h-16 w-16 overflow-hidden rounded-lg bg-white shadow-sm">
<div className="h-full w-full bg-gradient-to-br from-primary/40 to-primary/80" data-alt="Festive holiday patterns with snowflakes and pine trees"></div>
</div>
<div className="flex flex-col">
<span className="text-sm font-bold text-primary">Holiday Edition</span>
<span className="text-xs text-slate-500">Digital Gift Card Design</span>
</div>
</div>
</div>
{/* Details List */}
<div className="flex flex-col gap-4">
<div className="flex justify-between items-center text-sm">
<div className="flex items-center gap-2 text-slate-500">
<span className="material-symbols-outlined text-[18px]">person</span>
<span>Recipient</span>
</div>
<span className="font-semibold">John Doe</span>
</div>
<div className="flex justify-between items-center text-sm">
<div className="flex items-center gap-2 text-slate-500">
<span className="material-symbols-outlined text-[18px]">card_giftcard</span>
<span>Gift Amount</span>
</div>
<span className="font-semibold">$100.00</span>
</div>
<div className="flex justify-between items-center text-sm">
<div className="flex items-center gap-2 text-slate-500">
<span className="material-symbols-outlined text-[18px]">mail</span>
<span>Delivery Method</span>
</div>
<span className="font-semibold">Email Delivery</span>
</div>
<div className="flex justify-between items-center text-sm">
<div className="flex items-center gap-2 text-slate-500">
<span className="material-symbols-outlined text-[18px]">local_taxi</span>
<span>Taxes &amp; Fees</span>
</div>
<span className="font-semibold">$0.00</span>
</div>
</div>
{/* Total Price */}
<div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
<span className="text-lg font-bold">Total Price</span>
<span className="text-2xl font-black text-primary">$100.00</span>
</div>
{/* Security Badge */}
<div className="flex items-center justify-center gap-3 rounded-lg bg-slate-50 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest dark:bg-slate-800/50">
<span className="material-symbols-outlined text-[20px] text-green-600">verified_user</span>
                            Secure Transaction
                        </div>
</div>
</div>
{/* Trust Indicators */}
<div className="mt-6 flex flex-col gap-4 px-2">
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-primary text-[20px]">security</span>
<p className="text-xs text-slate-500">Your personal data is encrypted and secure with us. We never store full credit card numbers.</p>
</div>
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-primary text-[20px]">update</span>
<p className="text-xs text-slate-500">Instant delivery. Recipient will receive an email within minutes of purchase.</p>
</div>
</div>
</aside>
</div>
</main>
{/* Footer */}

</div>
    </div>
  );
};

export default GiftCardCheckoutDelivery;
