
import React from 'react';
import { Link } from 'react-router-dom';

const 24HourTripDepartureCountdownEmail = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            
<div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
<div className="layout-container flex h-full grow flex-col">
<!-- Navigation -->
<header className="flex items-center justify-between border-b border-primary/20 bg-background-light dark:bg-background-dark px-6 md:px-40 py-5">
<div className="flex items-center gap-3">
<div className="text-accent-teal">
<span className="material-symbols-outlined text-3xl">explore</span>
</div>
<h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold tracking-tight">Wanderlust Explorer Pro</h2>
</div>
<div className="hidden md:flex items-center gap-8">
<a className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-accent-teal transition-colors" href="#">My Trips</a>
<a className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-accent-teal transition-colors" href="#">Discovery</a>
<a className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-accent-teal transition-colors" href="#">Support</a>
</div>
<div className="flex items-center gap-4">
<button className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/20 text-slate-900 dark:text-slate-100">
<span className="material-symbols-outlined">notifications</span>
</button>
<div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary" data-alt="User profile picture of a traveler" style={{ backgroundImage: "url("https://lh3.googleusercontent.com/aida-public/AB6AXuCb0gUcxM_1BtdyqzaMdvEb3u0clIRQF1R9eE-8QijxhjIkKISbgx8QqmWe7bvC2dzcGISR96GMHUaVP6sTlOr0JmWG_TquSPHh9By5IvoxzNa1ymbKVmvSMeHHetKSxX3HRBDdttOqSEpbuKwiM3q3NaskGyQqBLSn6ogAA4O9WYXKWIxedFSuddpxzkKSBGlilNfST7xb4C1EmjjNH8IxfXf5t9V1YYl183ZpWNS8nq7SHYEvukkwfrmt_7wX_ChtJKwNYV6At20L")" }}></div>
</div>
</header>
<main className="flex-1 max-w-[960px] mx-auto w-full px-4 py-8">
<!-- Hero Countdown Section -->
<div className="relative overflow-hidden rounded-xl bg-accent-teal mb-8">
<div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" data-alt="Breathtaking mountain vista during golden hour sunrise" style={{ backgroundImage: "url("https://lh3.googleusercontent.com/aida-public/AB6AXuBtu9sBVI6jfJimBFzc8PneVnsGfcdBjui0-6ct6OasS_Jn1ypN-mhOvkjm-7L_rkXvkD90cMkhz_-pt9rvUbEv_2UcQPODwfkcCK_riD-XXbKEKV4gJoGZrxaPZz7irQJsKpBjOQPiVMODgEy7yfR4pgHMdfwbPMg46jeLSLm5lj7xWb8lGlu3OZ-w619aLpYIfoUw5-afrlP7Q6ANPNbafE9S0zFLkK_dwkZ9Cdmos-OlAY_jfvbl2k5XrYkwwI6FpocvVNLi9Zng")" }}></div>
<div className="relative z-10 flex flex-col items-center justify-center py-16 px-6 text-center">
<span className="bg-primary text-slate-900 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Tomorrow's Adventure</span>
<h1 className="text-white text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">Final Countdown: Your Adventure Starts Tomorrow!</h1>
<!-- Animated-style Clock -->
<div className="flex gap-4 md:gap-8">
<div className="flex flex-col items-center">
<div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl w-20 h-24 flex items-center justify-center mb-2 shadow-xl">
<span className="text-white text-4xl font-bold">24</span>
</div>
<span className="text-white/80 text-xs font-medium uppercase tracking-widest">Hours</span>
</div>
<div className="flex flex-col items-center">
<div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl w-20 h-24 flex items-center justify-center mb-2 shadow-xl">
<span className="text-white text-4xl font-bold">00</span>
</div>
<span className="text-white/80 text-xs font-medium uppercase tracking-widest">Minutes</span>
</div>
<div className="flex flex-col items-center">
<div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl w-20 h-24 flex items-center justify-center mb-2 shadow-xl">
<span className="text-white text-4xl font-bold">00</span>
</div>
<span className="text-white/80 text-xs font-medium uppercase tracking-widest">Seconds</span>
</div>
</div>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
<!-- Quick Access Section -->
<div className="lg:col-span-2 space-y-6">
<div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-primary/10 shadow-sm">
<h3 className="text-accent-teal font-bold text-lg mb-4 flex items-center gap-2">
<span className="material-symbols-outlined">bolt</span> Quick Access
                            </h3>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<div className="flex flex-col gap-3 p-4 bg-background-light dark:bg-background-dark rounded-lg">
<span className="material-symbols-outlined text-accent-teal">confirmation_number</span>
<div>
<p className="text-xs text-slate-500 font-semibold uppercase">Digital Ticket</p>
<p className="text-sm font-bold">WE-7492-X</p>
</div>
<a className="text-xs text-accent-teal font-bold hover:underline" href="#">Download PDF</a>
</div>
<div className="flex flex-col gap-3 p-4 bg-background-light dark:bg-background-dark rounded-lg">
<span className="material-symbols-outlined text-accent-teal">hotel</span>
<div>
<p className="text-xs text-slate-500 font-semibold uppercase">Stay Address</p>
<p className="text-sm font-bold truncate">Avenue des Champs-Élysées 75008</p>
</div>
<a className="text-xs text-accent-teal font-bold hover:underline" data-location="Paris" href="#">View on Map</a>
</div>
<div className="flex flex-col gap-3 p-4 bg-background-light dark:bg-background-dark rounded-lg">
<span className="material-symbols-outlined text-accent-teal">emergency_share</span>
<div>
<p className="text-xs text-slate-500 font-semibold uppercase">Emergency Contact</p>
<p className="text-sm font-bold">+1 (555) 012-3456</p>
</div>
<a className="text-xs text-accent-teal font-bold hover:underline" href="#">Contact Support</a>
</div>
</div>
</div>
<div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-primary/10 text-center">
<h2 className="text-2xl font-bold mb-4">You're just 24 hours away!</h2>
<p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
                                Everything is set for your departure. Your local guide is ready, the weather looks perfect, and your itinerary is synced.
                            </p>
<button className="bg-primary text-slate-900 px-10 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95">
                                Open My Trip Hub
                            </button>
</div>
</div>
<!-- Side Info -->
<div className="space-y-6">
<div className="bg-accent-teal text-white p-6 rounded-xl shadow-lg">
<h4 className="font-bold text-lg mb-4">Pack Your Bags!</h4>
<ul className="space-y-4">
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-primary">check_circle</span>
<span className="text-sm">Universal power adapter</span>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-primary">check_circle</span>
<span className="text-sm">Printed backup of travel insurance</span>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-primary">check_circle</span>
<span className="text-sm">Comfortable walking shoes</span>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-primary">check_circle</span>
<span className="text-sm">Weather-appropriate layers</span>
</li>
</ul>
</div>
<div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-primary/10">
<h4 className="font-bold mb-4">Live Weather</h4>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-4xl text-yellow-500">sunny</span>
<div>
<p className="text-2xl font-bold">24°C</p>
<p className="text-sm text-slate-500">Sunny, Clear Skies</p>
</div>
</div>
</div>
</div>
</div>
<!-- Footer Sign-off -->
<footer className="border-t border-primary/20 pt-12 pb-8 text-center">
<div className="flex justify-center gap-6 mb-8">
<a className="text-accent-teal hover:opacity-80 transition-opacity" href="#">
<span className="material-symbols-outlined text-2xl">share</span>
</a>
<a className="text-accent-teal hover:opacity-80 transition-opacity" href="#">
<span className="material-symbols-outlined text-2xl">public</span>
</a>
<a className="text-accent-teal hover:opacity-80 transition-opacity" href="#">
<span className="material-symbols-outlined text-2xl">alternate_email</span>
</a>
</div>
<p className="text-slate-900 dark:text-slate-100 font-bold text-xl mb-2 italic">Safe Travels,</p>
<p className="text-accent-teal font-bold mb-8">The Wanderlust Explorer Pro Team</p>
<div className="text-xs text-slate-500 space-y-2">
<p>© 2024 Wanderlust Explorer Pro. All rights reserved.</p>
<p>You received this email because you have an upcoming trip. <a className="underline" href="#">Manage notifications</a></p>
</div>
</footer>
</main>
</div>
</div>

        </div>
    );
};

export default 24HourTripDepartureCountdownEmail;
