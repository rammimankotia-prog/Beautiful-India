
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Auto-generated from: terms_of_service_layout/code.html
 * Group: legal | Path: /terms
 */
const TermsOfServiceLayout = () => {
  return (
    <div data-page="terms_of_service_layout">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
<div className="layout- flex h-full grow flex-col">
{/* Top Navigation Bar */}

<main className="flex-1   w-full px-6 py-8 md:py-12">
{/* Breadcrumbs & Header */}
<div className="mb-10">
<div className="flex items-center gap-2 text-primary text-sm font-medium mb-4">
<Link className="flex items-center gap-1 hover:underline" to="/">
<span className="material-symbols-outlined text-sm">arrow_back</span>
                            Back to Home
                        </Link>
<span className="text-slate-300">/</span>
<span className="text-slate-500">Legal</span>
</div>
<div className="flex flex-col gap-2">
<h1 className="text-slate-900 dark:text-slate-100 text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] font-display">Terms of Service</h1>
<p className="text-primary/70 text-base font-medium">Last updated: March 10, 2026</p>
</div>
</div>
<div className="flex flex-col lg:flex-row gap-12">
{/* Sidebar Navigation */}
<aside className="lg:w-1/4">
<div className="sticky top-24 flex flex-col gap-1 bg-white dark:bg-slate-800 p-4 rounded-xl border border-primary/10 shadow-sm">
<h3 className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">Navigation</h3>
<Link to="/terms#introduction" className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 text-primary font-semibold transition-all">
<span className="material-symbols-outlined">info</span>
<span>Introduction</span>
</Link>
<Link to="/terms#booking-conditions" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-all">
<span className="material-symbols-outlined">calendar_month</span>
<span>Booking Conditions</span>
</Link>
<Link to="/terms#cancellation-policy" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-all">
<span className="material-symbols-outlined">cancel</span>
<span>Cancellation Policy</span>
</Link>
<Link to="/terms#user-conduct" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-all">
<span className="material-symbols-outlined">person_check</span>
<span>User Conduct</span>
</Link>
<Link to="/terms#privacy-policy" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-all">
<span className="material-symbols-outlined">shield_person</span>
<span>Privacy Policy</span>
</Link>
</div>
</aside>
{/* Main Content */}
<div className="lg:w-3/4 bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-700">
<div className="tos-content prose prose-slate  dark:prose-invert">
<section id="introduction" className="mb-12">
<h2 className="text-2xl font-extrabold text-[#0a6c75] mb-4 pb-2 border-b border-slate-100 flex items-center gap-3">
  <span className="bg-[#eefaf9] text-[#0f766e] w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span> 
  Introduction
</h2>
<p>Welcome to Beautiful India Explorer Pro. These Terms of Service ("Terms") govern your access to and use of our platform, including our website, mobile applications, and tour management services (collectively, the "Services").</p>
<p>By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services. Beautiful India Explorer Pro acts as an intermediary between travelers and tour operators, providing a centralized discovery and booking engine.</p>
</section>
<section id="booking-conditions" className="mb-12">
<h2 className="text-2xl font-extrabold text-[#0a6c75] mb-4 pb-2 border-b border-slate-100 flex items-center gap-3">
  <span className="bg-[#eefaf9] text-[#0f766e] w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span> 
  Booking Conditions
</h2>
<p>All bookings made through Beautiful India are subject to availability and the specific terms provided by the tour operator. When you make a booking, you are entering into a direct contract with the service provider.</p>
<ul className="space-y-3 text-slate-600 dark:text-slate-300 mb-6">
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-[#0a6c75] mt-0.5 text-[20px]">check_circle</span> <span>Users must be at least <strong className="text-slate-800">18 years old</strong> to make a booking.</span></li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-[#0a6c75] mt-0.5 text-[20px]">check_circle</span> <span>Full payment or a deposit is required at the time of booking, depending on the tour specific policy.</span></li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-[#0a6c75] mt-0.5 text-[20px]">check_circle</span> <span>Accurate personal information must be provided for all travelers.</span></li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-[#0a6c75] mt-0.5 text-[20px]">check_circle</span> <span>Currency conversion rates are approximate and may vary based on your financial institution.</span></li>
</ul>
</section>
<section id="cancellation-policy" className="mb-12">
<h2 className="text-2xl font-extrabold text-[#0a6c75] mb-4 pb-2 border-b border-slate-100 flex items-center gap-3">
  <span className="bg-[#eefaf9] text-[#0f766e] w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span> 
  Cancellation Policy
</h2>
<p>We understand that plans can change. Our cancellation policies are designed to be fair to both travelers and our tour partners. Each tour may have its own specific cancellation window:</p>
<div className="bg-[#fff7ed] p-6 rounded-xl border-l-[4px] border-orange-500 my-6 shadow-sm">
<p className="font-extrabold text-orange-800 mb-2 flex items-center gap-2"><span className="material-symbols-outlined">warning</span> Standard Cancellation Window:</p>
<p className="text-sm text-orange-900 leading-relaxed mb-0">Cancellations made <strong className="bg-orange-100 px-1 rounded">7 days prior</strong> to departure qualify for a <strong className="bg-orange-100 px-1 rounded">90% refund</strong>. Cancellations made within <strong className="bg-orange-100 px-1 rounded">48 hours</strong> are non-refundable unless specified otherwise by the operator.</p>
</div>
<p>Refunds will be processed through the original payment method within 5-10 business days. Beautiful India reserves the right to charge a processing fee for certain cancellation types.</p>
</section>
<section id="user-conduct" className="mb-12">
<h2 className="text-2xl font-extrabold text-[#0a6c75] mb-4 pb-2 border-b border-slate-100 flex items-center gap-3">
  <span className="bg-[#eefaf9] text-[#0f766e] w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span> 
  User Conduct
</h2>
<p>To maintain a safe and positive community, all users agree to:</p>
<ul className="space-y-3 text-slate-600 dark:text-slate-300 mt-4">
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-[#0a6c75] mt-0.5 text-[20px]">person_check</span> <span>Provide truthful and accurate information in reviews and bookings.</span></li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-[#0a6c75] mt-0.5 text-[20px]">gavel</span> <span>Respect local laws and customs during tours.</span></li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-[#0a6c75] mt-0.5 text-[20px]">block</span> <span>Not use the platform for any illegal or unauthorized purpose.</span></li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-[#0a6c75] mt-0.5 text-[20px]">security</span> <span>Not attempt to scrape, crawl, or bypass the platform's security measures.</span></li>
</ul>
</section>
<section id="privacy-policy" className="mb-12">
<h2 className="text-2xl font-extrabold text-[#0a6c75] mb-4 pb-2 border-b border-slate-100 flex items-center gap-3">
  <span className="bg-[#eefaf9] text-[#0f766e] w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span> 
  Privacy Policy
</h2>
<p>Your privacy is important to us. Our use of your personal information is governed by our separate Privacy Policy. By using our Services, you consent to the collection and use of your data as outlined in that policy.</p>
<p>We implement industry-standard encryption and security measures to protect your sensitive data, including payment information and identity documents required for international travel bookings.</p>
</section>
<div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-700">
<p className="text-slate-500 text-sm">If you have any questions regarding these terms, please contact our legal department at <a className="text-primary font-medium hover:underline" href="mailto:legal@beautifulindia.com">legal@beautifulindia.com</a>.</p>
</div>
</div>
</div>
</div>
</main>
{/* Footer */}

</div>
</div>
    </div>
  );
};

export default TermsOfServiceLayout;
