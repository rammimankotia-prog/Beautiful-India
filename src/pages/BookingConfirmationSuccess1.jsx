import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

/**
 * Auto-generated from: booking_confirmation_success_1/code.html
 * Group: booking | Path: /booking/success
 */
const BookingConfirmationSuccess1 = () => {
  const location = useLocation();
  const { formatPrice } = useCurrency();
  const { booking, tour } = location.state || {
    booking: { id: "BK-" + Math.floor(Math.random() * 100000), amount: 1260 },
    tour: { title: "Spiti Valley Expedition", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800" }
  };

  return (
    <div data-page="booking_confirmation_success_1">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            {/* Left side: Image */}
            <div className="md:w-1/2 h-64 md:h-auto relative">
              <img src={tour.image} alt={tour.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Right side: Content */}
            <div className="md:w-1/2 p-10 flex flex-col justify-center items-center text-center md:text-left md:items-start">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-5xl">check_circle</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                Booking Confirmed!
              </h1>

              <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
                Thank you for choosing Beautiful India. Your adventure to <span className="font-bold text-primary">{tour.title}</span> is now reserved.
              </p>

              <div className="w-full space-y-4 mb-10 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Booking ID:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{booking.id}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Total Paid:</span>
                  <span className="font-bold text-primary text-lg">{formatPrice(booking.amount, true)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold uppercase">Confirmed</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Link to="/" className="flex-1 py-4 bg-primary text-white font-bold rounded-xl text-center hover:opacity-90 transition-all shadow-lg shadow-primary/20 print:hidden">
                  Go to Home
                </Link>
                <button 
                  onClick={() => window.print()}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 print:hidden"
                >
                  <span className="material-symbols-outlined">print</span>
                  Print Receipt
                </button>
              </div>

              <p className="mt-8 text-xs text-slate-500 leading-relaxed">
                A confirmation email with all details and instructions has been sent to your inbox. Please check your spam folder if you don't see it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default BookingConfirmationSuccess1;
