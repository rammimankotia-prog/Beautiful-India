
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Auto-generated from: booking_cancellation_confirmation_email/code.html
 * Group: emails | Path: /emails/cancel-confirm
 */
const BookingCancellationConfirmationEmail = () => {
  return (
    <div data-page="booking_cancellation_confirmation_email">
      <div className=" w-full bg-white dark:bg-slate-900 shadow-xl rounded-xl overflow-hidden border border-primary/10">
{/* Header / Logo Section */}

{/* Main Content */}
<main className="p-8 space-y-8">
{/* Confirmation Hero */}
<div className="text-center space-y-3">
<div className="inline-flex items-center justify-center p-3 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 mb-2">
<span className="material-symbols-outlined text-3xl">check_circle</span>
</div>
<h2 className="text-slate-900 dark:text-slate-100 text-3xl font-extrabold font-display">Cancellation Confirmed</h2>
<p className="text-slate-600 dark:text-slate-400 font-montserrat">We've processed your request. Your booking has been successfully cancelled.</p>
</div>
{/* Booking Summary Card */}
<div className="bg-sand dark:bg-slate-800/50 rounded-xl p-6 border border-primary/5">
<h3 className="text-xs font-bold text-primary tracking-widest uppercase mb-4 font-montserrat">Cancelled Booking Summary</h3>
<div className="flex flex-col md:flex-row gap-6">
<div className="flex-1 space-y-2">
<p className="text-slate-900 dark:text-slate-100 text-lg font-bold font-display">Alpine Lakes &amp; Peaks Expedition</p>
<div className="space-y-1">
<div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-montserrat">
<span className="material-symbols-outlined text-sm">calendar_today</span>
<span>Oct 15 - Oct 20, 2024</span>
</div>
<div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-montserrat">
<span className="material-symbols-outlined text-sm">confirmation_number</span>
<span>Booking ID: #WEP-98231</span>
</div>
</div>
</div>
<div className="w-full md:w-32 h-32 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden shrink-0">
<img className="w-full h-full object-cover" data-alt="Scenic mountain landscape with blue alpine lakes" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjgnPy0HVtsXOBvmiNVM3mfDL7b958_ttOD5VYnKh65FzxgPmJgMFS63w4z1E1V_6LfazV0vFqPTebSg7hxSXDvWHJfSXi1ElRvziRKgb8cr6-BIAxcI8BwbtCWJ2J5qcU7_mJMmGtoZk9QOZpZ_ezKWOVNlbXi6QpGqNMBXmRcrSMX71FB4T3Yw2ikXYhA08qSFFutwWiaz61WohPRU_1J24GhY6ldqtmfmMDU7NXuda07RAlq7DNbCWNnQ3KIHh7eRMM_ug0YXZf"/>
</div>
</div>
</div>
{/* Refund Details */}
<div className="divide-y divide-primary/10 border-t border-b border-primary/10 py-2">
<div className="flex justify-between py-4">
<span className="text-slate-600 dark:text-slate-400 font-montserrat">Processed Refund Amount</span>
<span className="text-slate-900 dark:text-slate-100 font-bold font-display text-lg">$1,245.00</span>
</div>
<div className="flex justify-between py-4">
<span className="text-slate-600 dark:text-slate-400 font-montserrat">Refund Method</span>
<span className="text-slate-900 dark:text-slate-100 font-medium font-montserrat">Original Payment (Visa **** 4242)</span>
</div>
<div className="flex justify-between py-4">
<span className="text-slate-600 dark:text-slate-400 font-montserrat">Estimated Time for Credit</span>
<span className="text-slate-900 dark:text-slate-100 font-medium font-montserrat">5-7 Business Days</span>
</div>
</div>
{/* Supportive Note */}
<div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-6 text-center italic text-slate-700 dark:text-slate-300 font-montserrat leading-relaxed">
                "We're sorry to see you go, but we hope to help you plan your next adventure soon. Your comfort and flexibility are our top priorities."
            </div>
{/* CTA Button */}
<div className="flex justify-center pt-2">
<button className="bg-secondary text-primary hover:bg-secondary/80 transition-colors font-bold font-display px-8 py-4 rounded-xl shadow-sm flex items-center gap-2 text-lg">
                    Browse Other Tours
                    <span className="material-symbols-outlined">explore</span>
</button>
</div>
</main>
{/* Footer */}

</div>
    </div>
  );
};

export default BookingCancellationConfirmationEmail;
