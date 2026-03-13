
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Auto-generated from: booking_cancellation_request_form/code.html
 * Group: booking | Path: /booking/cancel
 */
const BookingCancellationRequestForm = () => {
  return (
    <div data-page="booking_cancellation_request_form">
      <div className="layout- flex h-full grow flex-col">
{/* Top Navigation Bar */}

{/* Main Content */}
<main className="flex flex-1 justify-center py-8 px-4 md:px-0 bg-brand-sand/30 dark:bg-background-dark">
<div className="layout-content- flex flex-col  flex-1 gap-6">
{/* Breadcrumbs */}
<div className="flex flex-wrap items-center gap-2 text-sm font-medium">
<a className="text-slate-500 hover:text-primary transition-colors" href="#">Home</a>
<span className="text-slate-400 material-symbols-outlined text-sm">chevron_right</span>
<a className="text-slate-500 hover:text-primary transition-colors" href="#">My Bookings</a>
<span className="text-slate-400 material-symbols-outlined text-sm">chevron_right</span>
<span className="text-slate-900 dark:text-slate-100">Cancellation Request</span>
</div>
{/* Page Header */}
<div className="flex flex-col gap-2">
<h1 className="text-slate-900 dark:text-slate-100 text-3xl md:text-4xl font-black leading-tight tracking-tight">Cancel Your Booking</h1>
<p className="text-slate-600 dark:text-slate-400 text-base font-normal">Please review your booking details and our refund policy carefully before confirming your request.</p>
</div>
{/* Booking Summary Card */}
<div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
<div className="flex flex-col md:flex-row items-stretch">
<div className="p-6 flex-[2_2_0px] flex flex-col justify-center">
<span className="text-primary text-xs font-bold uppercase tracking-wider mb-1">Current Booking</span>
<h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight mb-2">Alpine Adventure: Swiss Peaks Tour</h3>
<div className="flex flex-col gap-2">
<div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
<span className="material-symbols-outlined text-sm">calendar_month</span>
<span>Oct 12 - Oct 18, 2023</span>
</div>
<div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
<span className="material-symbols-outlined text-sm">confirmation_number</span>
<span>Booking ID: <span className="font-mono">#WEP-992834</span></span>
</div>
</div>
</div>
<div className="w-full md:w-64 bg-center bg-no-repeat bg-cover aspect-video md:aspect-auto" data-alt="Snowy mountain peaks in the Swiss Alps" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCeJnXzebPobCEHrrGUPboIwnTo59mMJPvy4BuFED2BA3LOd6_qF5vy4RevW_BAfkgWPtGEDkOSV9eoZMzGlN3ORyIXt_fZqF5y2F4lAX6M9mwvoooGqpQ1PoQcNFHsgZVie0WwiBsrvLq4rfGMyaoKCCigcpRtFD8spIEKE9xr0G_WjZVqJhqy4yapM7RxSG2FiGl_w46cm4zsbupa7HLU9fhmU_mUX6LCVSQU6KyJwpsPt9FivFcu_DMOmhWy40tz1QlL0ttIUCmn')" }}></div>
</div>
</div>
{/* Cancellation Form Section */}
<div className="bg-white dark:bg-slate-900 rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-8">
<div>
<h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">assignment_late</span>
                            Cancellation Details
                        </h2>
<div className="grid grid-cols-1 gap-6">
{/* Reason for Cancellation */}
<div className="flex flex-col gap-2">
<label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Reason for Cancellation</label>
<select className="form-select rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary">
<option disabled="" selected="" value="">Select a reason</option>
<option>Change of plans</option>
<option>Medical emergency</option>
<option>Travel restrictions</option>
<option>Financial reasons</option>
<option>Found a better deal</option>
<option>Other</option>
</select>
</div>
{/* Additional Comments */}
<div className="flex flex-col gap-2">
<label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Additional Comments (Optional)</label>
<textarea className="form-textarea rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary min-h-[120px]" placeholder="Tell us more about why you're cancelling..."></textarea>
</div>
</div>
</div>
{/* Refund Breakdown */}
<div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 border border-primary/20">
<h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-4">Refund Summary</h3>
<div className="space-y-3">
<div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
<span>Original Paid Amount</span>
<span>$1,450.00</span>
</div>
<div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
<span>Cancellation Fee (15%)</span>
<span className="text-red-500">-$217.50</span>
</div>
<div className="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
<div className="flex justify-between items-center">
<span className="text-slate-900 dark:text-slate-100 font-bold">Estimated Refund Amount</span>
<span className="text-2xl font-black text-primary">$1,232.50</span>
</div>
</div>
<p className="mt-4 text-xs text-slate-500 dark:text-slate-400 italic">
                            * Refund will be processed back to your original payment method within 5-10 business days.
                        </p>
</div>
{/* Actions */}
<div className="flex flex-col gap-4 mt-2">
<button className="w-full bg-[#102022] hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                            Confirm Cancellation
                        </button>
<a className="w-full text-center text-primary font-semibold py-2 hover:underline" href="#">
                            Keep My Booking
                        </a>
</div>
</div>
{/* Policy Notice */}
<div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
<span className="material-symbols-outlined text-amber-600 dark:text-amber-500">info</span>
<p className="text-sm text-amber-800 dark:text-amber-200">
<strong>Cancellation Policy:</strong> Cancellations made less than 7 days before departure are non-refundable. For this trip, you are eligible for a partial refund as you are 14 days out from departure.
                    </p>
</div>

</div>
</main>
</div>
    </div>
  );
};

export default BookingCancellationRequestForm;
