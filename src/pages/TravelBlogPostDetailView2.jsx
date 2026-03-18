
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Auto-generated from: travel_blog_post_detail_view_2/code.html
 * Group: content | Path: /blog/post-2
 */
const TravelBlogPostDetailView2 = () => {
  return (
    <div data-page="travel_blog_post_detail_view_2">
      <div className="relative flex min-h-screen flex-col">

<main className="flex-1   w-full px-4 md:px-12 lg:px-24 py-8 md:py-12">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
<aside className="lg:col-span-3">
<div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
<nav className="space-y-1">
<a className="nav-item active-nav-item" href="#">
<span className="material-symbols-outlined text-[22px]">person</span>
<span className="font-semibold text-sm">Personal Info</span>
</a>
<a className="nav-item" href="#">
<span className="material-symbols-outlined text-[22px]">security</span>
<span className="font-semibold text-sm">Security</span>
</a>
<a className="nav-item" href="#">
<span className="material-symbols-outlined text-[22px]">settings</span>
<span className="font-semibold text-sm">Preferences</span>
</a>
<a className="nav-item" href="#">
<span className="material-symbols-outlined text-[22px]">payments</span>
<span className="font-semibold text-sm">Payment Methods</span>
</a>
<div className="my-4 border-t border-slate-100"></div>
<a className="nav-item text-red-500 hover:bg-red-50" href="#">
<span className="material-symbols-outlined text-[22px]">logout</span>
<span className="font-semibold text-sm">Sign Out</span>
</a>
</nav>
</div>
</aside>
<div className="lg:col-span-9 space-y-8">
<section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
<div className="p-6 md:p-8 border-b border-slate-50">
<h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
<p className="text-sm text-slate-500 mt-1">Update your personal details and how others see you.</p>
</div>
<div className="p-6 md:p-8">
<form className="space-y-8">
<div className="flex flex-col md:flex-row items-center gap-8">
<div className="relative group">
<img alt="Current profile picture" className="size-28 rounded-full object-cover border-4 border-sand shadow-inner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgzAdvjJjmM4bKST1DuKXWK_W9QpkBRvvNmMzQ1AFdZT6bCOBAVCr6RLGeJnkrTdX2AekF_fc17R0PKW97_mziyzVj7Fn-L-0FT7bdX25_ZkBe4llU_QUFPm7NuLp_ps6MDBYCHN_i181fQ5Rtvz4SjVBlNVg1Wzvsk0RGsEzO4uFXEogXItgrCClGOCoZVoI7YA5L_TDzcoDRGsZQHY7HNdhNExkT0tLXPLu6OA-nGs61NGOqwaDcZbcX1JgazF1LUUpzekjpCMzJ"/>
<button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" type="button">
<span className="material-symbols-outlined text-white">photo_camera</span>
</button>
</div>
<div className="flex-1 text-center md:text-left">
<h4 className="font-bold text-slate-800">Profile Photo</h4>
<p className="text-xs text-slate-500 mt-1 mb-4">JPG, GIF or PNG. Max size of 800K</p>
<div className="flex flex-wrap justify-center md:justify-start gap-3">
<button className="bg-deep-teal text-white text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity" type="button">Upload New</button>
<button className="bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors" type="button">Remove</button>
</div>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="text-sm font-bold text-slate-700">Full Name</label>
<input className="w-full rounded-lg border-slate-200 bg-sand/50 text-sm focus:border-deep-teal focus:ring-deep-teal" placeholder="e.g. John Doe" type="text" value="Alex Thompson"/>
</div>
<div className="space-y-2">
<label className="text-sm font-bold text-slate-700">Email Address</label>
<input className="w-full rounded-lg border-slate-200 bg-sand/50 text-sm focus:border-deep-teal focus:ring-deep-teal" placeholder="e.g. alex@beautifulindia.com" type="email" value="customercare@beautifulindia.com"/>
</div>
<div className="space-y-2">
<label className="text-sm font-bold text-slate-700">Phone Number</label>
<input className="w-full rounded-lg border-slate-200 bg-sand/50 text-sm focus:border-deep-teal focus:ring-deep-teal" placeholder="+91 00000 00000" type="tel" value="+916005159433"/>
</div>
<div className="space-y-2">
<label className="text-sm font-bold text-slate-700">Location</label>
<select className="w-full rounded-lg border-slate-200 bg-sand/50 text-sm focus:border-deep-teal focus:ring-deep-teal">
<option>United States</option>
<option>United Kingdom</option>
<option>Canada</option>
<option>Australia</option>
</select>
</div>
<div className="md:col-span-2 space-y-2">
<label className="text-sm font-bold text-slate-700">Bio</label>
<textarea className="w-full rounded-lg border-slate-200 bg-sand/50 text-sm focus:border-deep-teal focus:ring-deep-teal" placeholder="Tell us about your travel style and experiences..." rows="4">Avid explorer and photographer. Love hiking through the Swiss Alps and discovering hidden cafés in Paris. Always looking for the next adventure!</textarea>
</div>
</div>
</form>
</div>
</section>
<section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
<div className="p-6 md:p-8 border-b border-slate-50">
<h2 className="text-xl font-bold text-slate-900">Travel Preferences</h2>
<p className="text-sm text-slate-500 mt-1">We'll use these to recommend your perfect tours.</p>
</div>
<div className="p-6 md:p-8">
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
<label className="relative flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-sand/30 hover:bg-ocean-blue/10 cursor-pointer transition-all">
<input checked="" className="rounded text-deep-teal focus:ring-deep-teal size-5" type="checkbox"/>
<span className="text-sm font-semibold">Adventure</span>
</label>
<label className="relative flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-sand/30 hover:bg-ocean-blue/10 cursor-pointer transition-all">
<input checked="" className="rounded text-deep-teal focus:ring-deep-teal size-5" type="checkbox"/>
<span className="text-sm font-semibold">Luxury</span>
</label>
<label className="relative flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-sand/30 hover:bg-ocean-blue/10 cursor-pointer transition-all">
<input className="rounded text-deep-teal focus:ring-deep-teal size-5" type="checkbox"/>
<span className="text-sm font-semibold">Cultural</span>
</label>
<label className="relative flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-sand/30 hover:bg-ocean-blue/10 cursor-pointer transition-all">
<input checked="" className="rounded text-deep-teal focus:ring-deep-teal size-5" type="checkbox"/>
<span className="text-sm font-semibold">Wildlife</span>
</label>
<label className="relative flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-sand/30 hover:bg-ocean-blue/10 cursor-pointer transition-all">
<input className="rounded text-deep-teal focus:ring-deep-teal size-5" type="checkbox"/>
<span className="text-sm font-semibold">Family</span>
</label>
<label className="relative flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-sand/30 hover:bg-ocean-blue/10 cursor-pointer transition-all">
<input className="rounded text-deep-teal focus:ring-deep-teal size-5" type="checkbox"/>
<span className="text-sm font-semibold">Culinary</span>
</label>
<label className="relative flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-sand/30 hover:bg-ocean-blue/10 cursor-pointer transition-all">
<input className="rounded text-deep-teal focus:ring-deep-teal size-5" type="checkbox"/>
<span className="text-sm font-semibold">Photography</span>
</label>
<label className="relative flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-sand/30 hover:bg-ocean-blue/10 cursor-pointer transition-all">
<input checked="" className="rounded text-deep-teal focus:ring-deep-teal size-5" type="checkbox"/>
<span className="text-sm font-semibold">Eco-Tourism</span>
</label>
</div>
</div>
</section>
<div className="flex items-center justify-end gap-4 pb-12">
<button className="px-6 py-2.5 rounded-lg text-slate-500 font-bold text-sm hover:text-deep-teal transition-colors">Discard Changes</button>
<button className="bg-deep-teal text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-deep-teal/20 hover:opacity-90 transition-opacity">Save All Changes</button>
</div>
</div>
</div>
</main>

</div>
    </div>
  );
};

export default TravelBlogPostDetailView2;
