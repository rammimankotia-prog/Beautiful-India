
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Auto-generated from: travel_advisory_safety_guide/code.html
 * Group: content | Path: /guides/safety
 */
const TravelAdvisorySafetyGuide = () => {
  return (
    <div data-page="travel_advisory_safety_guide">
      <div className="layout- flex h-full grow flex-col">
{/* Top Navigation Bar */}

<main className="flex-1   w-full px-4 md:px-8 py-8 flex flex-col gap-8">
{/* Hero Map Section */}
<section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
<div className="lg:col-span-3">
<div className="relative rounded-xl overflow-hidden shadow-xl h-[450px] border border-primary/10">
{/* Simulated Map Interface */}
<div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 bg-cover bg-center" data-alt="Interactive world map showing safety regions" data-location="World Map" style={{ backgroundImage: "url('https://placeholder.pics/svg/300')" }}>
{/* Overlay for interactive feel */}
<div className="absolute inset-0 bg-primary/5"></div>
</div>
{/* Search on Map */}
<div className="absolute top-6 left-6 right-6 md:right-auto md:w-96 z-10">
<div className="flex w-full items-stretch rounded-lg shadow-2xl overflow-hidden">
<div className="bg-white dark:bg-background-dark text-primary flex items-center justify-center pl-4">
<span className="material-symbols-outlined">location_on</span>
</div>
<input className="form-input w-full border-none bg-white dark:bg-background-dark text-slate-900 dark:text-slate-100 focus:ring-0 h-12 font-body px-4" placeholder="Search for a country or region" value=""/>
<button className="bg-primary text-white px-4 flex items-center justify-center">
<span className="material-symbols-outlined">search</span>
</button>
</div>
</div>
{/* Map Controls */}
<div className="absolute bottom-6 right-6 flex flex-col gap-2">
<button className="bg-white dark:bg-background-dark p-2 rounded-lg shadow-lg text-primary hover:bg-sand transition-colors">
<span className="material-symbols-outlined">add</span>
</button>
<button className="bg-white dark:bg-background-dark p-2 rounded-lg shadow-lg text-primary hover:bg-sand transition-colors">
<span className="material-symbols-outlined">remove</span>
</button>
<button className="bg-white dark:bg-background-dark p-2 rounded-lg shadow-lg text-primary hover:bg-sand transition-colors">
<span className="material-symbols-outlined">my_location</span>
</button>
</div>
{/* Safety Legend */}
<div className="absolute bottom-6 left-6 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md p-3 rounded-lg border border-primary/20 shadow-lg text-xs font-body">
<div className="font-bold text-primary mb-2 uppercase tracking-widest">Safety Levels</div>
<div className="flex items-center gap-2 mb-1">
<span className="size-3 rounded-full bg-emerald-500"></span> <span>Exercise Normal Precautions</span>
</div>
<div className="flex items-center gap-2 mb-1">
<span className="size-3 rounded-full bg-yellow-400"></span> <span>Increased Caution</span>
</div>
<div className="flex items-center gap-2 mb-1">
<span className="size-3 rounded-full bg-orange-500"></span> <span>Reconsider Travel</span>
</div>
<div className="flex items-center gap-2">
<span className="size-3 rounded-full bg-red-600"></span> <span>Do Not Travel</span>
</div>
</div>
</div>
</div>
{/* Sidebar: Real-time Alerts */}
<aside className="lg:col-span-1 flex flex-col gap-4">
<div className="bg-secondary rounded-xl p-5 text-white shadow-lg h-full flex flex-col">
<div className="flex items-center gap-2 mb-6">
<span className="material-symbols-outlined fill-current">notifications_active</span>
<h3 className="text-lg font-bold font-display">Global Travel Alerts</h3>
</div>
<div className="space-y-4 flex-1 overflow-y-auto pr-1">
{/* Alert Item */}
<div className="bg-white/10 p-3 rounded-lg border-l-4 border-warning-orange">
<div className="flex justify-between items-start mb-1">
<span className="text-[10px] font-bold uppercase tracking-wider text-warning-orange">Emergency</span>
<span className="text-[10px] opacity-70">2h ago</span>
</div>
<p className="text-sm font-semibold font-body">Southeast Asia: Severe Weather Advisory</p>
<p className="text-xs opacity-80 mt-1">Tropical storm warning for coastal regions...</p>
</div>
<div className="bg-white/10 p-3 rounded-lg border-l-4 border-blue-300">
<div className="flex justify-between items-start mb-1">
<span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">Update</span>
<span className="text-[10px] opacity-70">5h ago</span>
</div>
<p className="text-sm font-semibold font-body">EU: New ETIAS requirement updates</p>
<p className="text-xs opacity-80 mt-1">Schengen zone visa-waiver entry changes...</p>
</div>
<div className="bg-white/10 p-3 rounded-lg border-l-4 border-yellow-400">
<div className="flex justify-between items-start mb-1">
<span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">Caution</span>
<span className="text-[10px] opacity-70">1d ago</span>
</div>
<p className="text-sm font-semibold font-body">South America: Strike Action Notice</p>
<p className="text-xs opacity-80 mt-1">Transport disruptions expected in major hubs...</p>
</div>
</div>
<button className="mt-6 w-full py-3 bg-white text-secondary rounded-lg font-bold text-sm hover:bg-sand transition-colors">
                            Subscribe to SMS Alerts
                        </button>
</div>
</aside>
</section>
{/* Safety Topics Grid */}
<section>
<div className="flex items-end justify-between mb-6">
<div>
<h2 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100">Safety Essentials</h2>
<p className="text-slate-500 dark:text-slate-400 font-body">Comprehensive guides for every traveler</p>
</div>
<a className="text-primary font-bold text-sm hover:underline flex items-center gap-1" href="#">
                        View All Topics <span className="material-symbols-outlined text-sm">arrow_forward</span>
</a>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
{/* Health & Vaccinations */}
<div className="bg-white dark:bg-background-dark p-6 rounded-xl shadow-sm border border-primary/10 hover:shadow-md transition-shadow group">
<div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined text-3xl">vaccines</span>
</div>
<h4 className="text-lg font-bold font-display mb-2">Health &amp; Vaccinations</h4>
<p className="text-sm text-slate-600 dark:text-slate-400 font-body leading-relaxed mb-4">Required shots and health advisories for your specific destination.</p>
<a className="text-primary font-bold text-sm flex items-center gap-1" href="#">
                            Learn More <span className="material-symbols-outlined text-xs">open_in_new</span>
</a>
</div>
{/* Local Laws & Customs */}
<div className="bg-white dark:bg-background-dark p-6 rounded-xl shadow-sm border border-primary/10 hover:shadow-md transition-shadow group">
<div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined text-3xl">gavel</span>
</div>
<h4 className="text-lg font-bold font-display mb-2">Local Laws &amp; Customs</h4>
<p className="text-sm text-slate-600 dark:text-slate-400 font-body leading-relaxed mb-4">Essential cultural etiquette and legal guidelines to avoid fines.</p>
<a className="text-primary font-bold text-sm flex items-center gap-1" href="#">
                            Learn More <span className="material-symbols-outlined text-xs">open_in_new</span>
</a>
</div>
{/* Emergency Contacts */}
<div className="bg-white dark:bg-background-dark p-6 rounded-xl shadow-sm border border-primary/10 hover:shadow-md transition-shadow group">
<div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined text-3xl">emergency</span>
</div>
<h4 className="text-lg font-bold font-display mb-2">Emergency Contacts</h4>
<p className="text-sm text-slate-600 dark:text-slate-400 font-body leading-relaxed mb-4">Consulates, hospitals, and local police numbers for 200+ countries.</p>
<a className="text-primary font-bold text-sm flex items-center gap-1" href="#">
                            Learn More <span className="material-symbols-outlined text-xs">open_in_new</span>
</a>
</div>
{/* Travel Insurance */}
<div className="bg-white dark:bg-background-dark p-6 rounded-xl shadow-sm border border-primary/10 hover:shadow-md transition-shadow group">
<div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined text-3xl">shield_with_heart</span>
</div>
<h4 className="text-lg font-bold font-display mb-2">Travel Insurance</h4>
<p className="text-sm text-slate-600 dark:text-slate-400 font-body leading-relaxed mb-4">Comprehensive coverage plans for theft, health, and trip cancellations.</p>
<a className="text-primary font-bold text-sm flex items-center gap-1" href="#">
                            Learn More <span className="material-symbols-outlined text-xs">open_in_new</span>
</a>
</div>
</div>
</section>
{/* Safety Checklist Section */}
<section className="bg-sand dark:bg-primary/5 rounded-2xl p-8 border border-primary/10">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
<div>
<h2 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 mb-4">Ultimate Departure Checklist</h2>
<p className="text-slate-600 dark:text-slate-400 font-body mb-8">Before you head to the airport, ensure you've ticked off these essential safety steps for a worry-free journey.</p>
<div className="space-y-4">
<label className="flex items-center gap-4 bg-white dark:bg-background-dark p-4 rounded-xl cursor-pointer border border-transparent hover:border-primary/30 transition-all">
<input className="size-5 rounded text-primary focus:ring-primary border-slate-300" type="checkbox"/>
<span className="font-body text-slate-700 dark:text-slate-200">Register with your embassy (Smart Traveler Programs)</span>
</label>
<label className="flex items-center gap-4 bg-white dark:bg-background-dark p-4 rounded-xl cursor-pointer border border-transparent hover:border-primary/30 transition-all">
<input className="size-5 rounded text-primary focus:ring-primary border-slate-300" type="checkbox"/>
<span className="font-body text-slate-700 dark:text-slate-200">Share itinerary &amp; GPS access with trusted contacts</span>
</label>
<label className="flex items-center gap-4 bg-white dark:bg-background-dark p-4 rounded-xl cursor-pointer border border-transparent hover:border-primary/30 transition-all">
<input className="size-5 rounded text-primary focus:ring-primary border-slate-300" type="checkbox"/>
<span className="font-body text-slate-700 dark:text-slate-200">Download offline maps and emergency contact cards</span>
</label>
<label className="flex items-center gap-4 bg-white dark:bg-background-dark p-4 rounded-xl cursor-pointer border border-transparent hover:border-primary/30 transition-all">
<input className="size-5 rounded text-primary focus:ring-primary border-slate-300" type="checkbox"/>
<span className="font-body text-slate-700 dark:text-slate-200">Verify validity of travel insurance medical coverage</span>
</label>
</div>
<button className="mt-8 bg-primary text-white px-8 py-3 rounded-xl font-bold font-display shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2">
<span className="material-symbols-outlined">download</span> Download PDF Checklist
                        </button>
</div>
<div className="hidden lg:block relative">
<div className="rounded-2xl overflow-hidden shadow-2xl rotate-2">
<img alt="Traveler checking gear" className="w-full h-96 object-cover" data-alt="Traveler checking their backpack and essential items before a trip" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRYfFOtYK--RsWXwKpWpZNLXrO51vgqrRCw-C2NbKWkkl78dhtDfGFDe5RVCAmwivJpw5CHvmDBt4HnfwNJo5GhhPXez1N-1gkyhX5-ESzD3M7VgwH60sJ3UqggxzacGm7Z_rLC6i-VqR8VQZI7lW3_grnwd8G_9nFA1FSgD7d9mQ0thvPNiFv8wz9XU9eHm1u9r9_DF8J1Z1PJIMynXiDnMUnBsEgLhTFKVc7yLDIGopDYVCrBfetLkbxoOWVh8M0Gur5r7jgYV5S"/>
</div>
<div className="absolute -bottom-6 -left-6 bg-warning-orange p-6 rounded-xl shadow-xl  -rotate-2 border border-white/20">
<div className="flex items-center gap-3 mb-2 text-secondary">
<span className="material-symbols-outlined font-bold">priority_high</span>
<span className="font-bold font-display uppercase tracking-widest text-xs">Pro Tip</span>
</div>
<p className="text-sm font-body text-secondary font-medium leading-relaxed">Always keep a physical copy of your passport and visa in a separate bag from the originals.</p>
</div>
</div>
</div>
</section>
</main>
{/* Footer */}

</div>
    </div>
  );
};

export default TravelAdvisorySafetyGuide;
