
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Auto-generated from: referral_rewards_dashboard/code.html
 * Group: rewards | Path: /referral/dashboard
 */
const ReferralRewardsDashboard = () => {
  return (
    <div data-page="referral_rewards_dashboard">
      <div className="layout- flex h-full grow flex-col">

<main className="  w-full px-6 py-10">
{/* Hero Header Section */}
<div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
<div className="">
<h1 className="text-slate-900 dark:text-slate-100 text-4xl font-extrabold tracking-tight font-montserrat mb-3">Referral Rewards Dashboard</h1>
<p className="text-slate-600 dark:text-slate-400 text-lg">Share your passion for discovery with friends and unlock exclusive travel perks and credits.</p>
</div>
<div className="flex gap-3">
<button className="bg-primary text-white px-6 py-3 rounded-xl font-bold font-montserrat flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform">
<span className="material-symbols-outlined text-xl">share</span>
                        Share Link
                    </button>
</div>
</div>
{/* Milestone Progress Card */}
<div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-2xl p-8 mb-8 shadow-sm">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
<div>
<h3 className="text-xl font-bold font-montserrat text-slate-900 dark:text-slate-100">Next Milestone: <span className="text-primary">Free Day Trip to Tuscany</span></h3>
<p className="text-slate-500 mt-1">You're getting closer! Invite more friends to reach the goal.</p>
</div>
<div className="text-right">
<span className="text-3xl font-black text-primary font-montserrat">$300</span>
<span className="text-slate-400 font-bold"> / $400</span>
</div>
</div>
<div className="relative w-full h-4 bg-sand dark:bg-primary/10 rounded-full overflow-hidden mb-4">
<div className="absolute top-0 left-0 h-full bg-accent rounded-full" style={{ width: "75%" }}></div>
</div>
<div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
<span className="material-symbols-outlined text-primary text-lg">info</span>
                    Earn <span className="text-primary font-bold px-1">$100</span> more to claim your free day trip voucher.
                </div>
</div>
{/* Stats Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
<div className="bg-white dark:bg-background-dark/50 border border-primary/10 p-6 rounded-2xl shadow-sm hover:border-primary/30 transition-colors">
<div className="flex justify-between items-start mb-4">
<div className="p-3 bg-primary/10 rounded-xl text-primary">
<span className="material-symbols-outlined">payments</span>
</div>
<span className="text-emerald-500 text-sm font-bold bg-emerald-50 px-2 py-1 rounded">+15% this month</span>
</div>
<p className="text-slate-500 font-semibold font-montserrat text-sm uppercase tracking-wider">Total Credits Earned</p>
<p className="text-4xl font-black text-slate-900 dark:text-slate-100 mt-1">$1,250</p>
</div>
<div className="bg-white dark:bg-background-dark/50 border border-primary/10 p-6 rounded-2xl shadow-sm hover:border-primary/30 transition-colors">
<div className="flex justify-between items-start mb-4">
<div className="p-3 bg-primary/10 rounded-xl text-primary">
<span className="material-symbols-outlined">pending_actions</span>
</div>
<span className="text-slate-400 text-sm font-bold bg-slate-50 px-2 py-1 rounded">Stable</span>
</div>
<p className="text-slate-500 font-semibold font-montserrat text-sm uppercase tracking-wider">Pending Referrals</p>
<p className="text-4xl font-black text-slate-900 dark:text-slate-100 mt-1">8</p>
</div>
<div className="bg-white dark:bg-background-dark/50 border border-primary/10 p-6 rounded-2xl shadow-sm hover:border-primary/30 transition-colors">
<div className="flex justify-between items-start mb-4">
<div className="p-3 bg-primary/10 rounded-xl text-primary">
<span className="material-symbols-outlined">flight_takeoff</span>
</div>
<span className="text-emerald-500 text-sm font-bold bg-emerald-50 px-2 py-1 rounded">+2 new</span>
</div>
<p className="text-slate-500 font-semibold font-montserrat text-sm uppercase tracking-wider">Successful Trips</p>
<p className="text-4xl font-black text-slate-900 dark:text-slate-100 mt-1">14</p>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
{/* Referral List */}
<div className="lg:col-span-2 space-y-6">
<h2 className="text-2xl font-bold font-montserrat text-slate-900 dark:text-slate-100">Referral History</h2>
<div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-2xl overflow-hidden shadow-sm">
<table className="w-full text-left">
<thead className="bg-sand dark:bg-primary/5">
<tr>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Friend</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date Joined</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Credit</th>
</tr>
</thead>
<tbody className="divide-y divide-primary/10">
<tr>
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">EM</div>
<div>
<p className="font-bold text-slate-900 dark:text-slate-100">Elena Martinez</p>
<p className="text-xs text-slate-400">elena.m@beautifulindia.com</p>
</div>
</div>
</td>
<td className="px-6 py-5 text-slate-600 dark:text-slate-400 text-sm">Oct 12, 2023</td>
<td className="px-6 py-5">
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                            Booking Completed
                                        </span>
</td>
<td className="px-6 py-5 font-bold text-primary">$50.00</td>
</tr>
<tr>
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">JD</div>
<div>
<p className="font-bold text-slate-900 dark:text-slate-100">Julian David</p>
<p className="text-xs text-slate-400">julian.d@beautifulindia.com</p>
</div>
</div>
</td>
<td className="px-6 py-5 text-slate-600 dark:text-slate-400 text-sm">Nov 02, 2023</td>
<td className="px-6 py-5">
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                            Signed Up
                                        </span>
</td>
<td className="px-6 py-5 font-bold text-slate-400">$0.00</td>
</tr>
<tr>
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">SC</div>
<div>
<p className="font-bold text-slate-900 dark:text-slate-100">Sarah Chen</p>
<p className="text-xs text-slate-400">schen@beautifulindia.com</p>
</div>
</div>
</td>
<td className="px-6 py-5 text-slate-600 dark:text-slate-400 text-sm">Nov 14, 2023</td>
<td className="px-6 py-5">
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                                            Invited
                                        </span>
</td>
<td className="px-6 py-5 font-bold text-slate-400">$0.00</td>
</tr>
</tbody>
</table>
</div>
</div>
{/* Invite Section */}
<div className="space-y-6">
<h2 className="text-2xl font-bold font-montserrat text-slate-900 dark:text-slate-100">Invite More Friends</h2>
<div className="bg-primary text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
<div className="absolute -right-10 -bottom-10 size-40 bg-white/10 rounded-full"></div>
<div className="relative z-10">
<h3 className="text-xl font-bold font-montserrat mb-4">Share the adventure</h3>
<p className="text-white/80 text-sm mb-6 leading-relaxed">Give your friends 10% off their first trip and get $50 travel credit when they book.</p>
<div className="space-y-4">
<div className="bg-white/10 rounded-xl p-4 border border-white/20">
<p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Your Referral Link</p>
<div className="flex items-center justify-between gap-2">
<span className="truncate font-mono text-sm">beautifulindia.com/ref/explorer_99</span>
<button className="text-white hover:text-accent transition-colors">
<span className="material-symbols-outlined text-xl">content_copy</span>
</button>
</div>
</div>
<div className="grid grid-cols-4 gap-2">
<button className="h-12 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all">
<span className="material-symbols-outlined">social_leaderboard</span>
</button>
<button className="h-12 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all">
<span className="material-symbols-outlined">alternate_email</span>
</button>
<button className="h-12 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all">
<span className="material-symbols-outlined">chat</span>
</button>
<button className="h-12 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all">
<span className="material-symbols-outlined">add</span>
</button>
</div>
<button className="w-full bg-accent text-primary font-black py-4 rounded-xl shadow-lg hover:brightness-105 active:scale-95 transition-all font-montserrat">
                                    SEND EMAIL INVITES
                                </button>
</div>
</div>
</div>
<div className="bg-sand dark:bg-primary/5 border border-primary/10 rounded-2xl p-6">
<div className="flex items-start gap-4">
<div className="text-primary mt-1">
<span className="material-symbols-outlined text-3xl">emoji_events</span>
</div>
<div>
<h4 className="font-bold font-montserrat text-slate-900 dark:text-slate-100">Top Referrer Status</h4>
<p className="text-sm text-slate-500 mt-1">You are in the top 5% of explorers this month! Keep it up to win a trip to Bali.</p>
</div>
</div>
</div>
</div>
</div>
</main>

</div>
    </div>
  );
};

export default ReferralRewardsDashboard;
