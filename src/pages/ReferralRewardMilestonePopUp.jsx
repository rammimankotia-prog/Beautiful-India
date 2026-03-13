
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Auto-generated from: referral_reward_milestone_pop_up/code.html
 * Group: rewards | Path: /referral/milestone
 */
const ReferralRewardMilestonePopUp = () => {
  return (
    <div data-page="referral_reward_milestone_pop_up">
      {/* Background Mockup to show Context */}
<div className="relative min-h-screen w-full flex flex-col opacity-40 pointer-events-none select-none">

<main className="p-10 grid grid-cols-3 gap-6">
<div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl col-span-2"></div>
<div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
<div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
<div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
<div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
</main>
</div>
{/* Celebration Modal Overlay */}
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
{/* Backdrop */}
<div className="absolute inset-0 bg-primary/20 backdrop-blur-sm"></div>
{/* Modal Container */}
<div className="relative w-full  overflow-hidden rounded-xl bg-white dark:bg-background-dark shadow-2xl flex flex-col md:flex-row border border-white/20">
{/* Festive Image Sidebar/Background */}
<div className="relative w-full md:w-5/12 min-h-[300px] md:min-h-full overflow-hidden">
<div className="absolute inset-0 bg-cover bg-center" data-alt="Traveler celebrating on a sunlit mountain peak" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBQw_oJPn95PyLTH6eM5BBHBamDfnFYNCI2Odykm0m5G7EPloxSfaXKz1OFGgAoMg7r1-8sWutOUdqnA0w1iWMgHJSx_CkpyoLbfPrkt81Anqs8pshajMjjkWnYBxzUtFzNbyGl2R3PFRWvA2075V7GetvB1M8B4qPtz3b7KlTh1GMFAkTmxHdiU7ddXzNF1u52NQsBuFPpp7NamXGdqNFEDhp2AYsWtJnk-QAGNPiLdlDS5CBiialnWPwPn8kr17ZUFZD4g9UbbkIr')" }}>
{/* Gradient Overlay */}
<div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
</div>
<div className="absolute bottom-6 left-6 right-6">
<h3 className="font-accent text-2xl font-bold text-white leading-tight">Your journey just got better.</h3>
</div>
</div>
{/* Content Area */}
<div className="flex-1 p-8 md:p-12 flex flex-col items-center text-center relative">
{/* Close Button */}
<button className="absolute top-4 right-4 text-slate-400 hover:text-primary transition-colors">
<span className="material-symbols-outlined">close</span>
</button>
{/* Icon/Badge */}
<div className="mb-6 relative">
<div className="absolute inset-0 bg-secondary/50 blur-2xl rounded-full"></div>
<div className="relative bg-secondary text-primary size-24 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800">
<span className="material-symbols-outlined text-5xl fill-current">featured_seasonal_and_gifts</span>
</div>
</div>
{/* Headline */}
<h2 className="font-accent text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                    Congratulations! <br/>
<span className="text-primary">You’ve Unlocked a New Milestone</span>
</h2>
{/* Description */}
<p className="text-slate-600 dark:text-slate-300 text-lg mb-8  font-display leading-relaxed">
                    By referring <span className="font-bold text-primary">5 friends</span>, you've earned your choice of a <span className="font-semibold italic">Free Weekend Getaway</span> or a <span className="font-semibold italic">Premium Travel Kit</span>.
                </p>
{/* Reward Choices Mockup */}
<div className="grid grid-cols-2 gap-4 w-full mb-10">
<div className="p-3 border-2 border-primary/10 rounded-lg bg-primary/5 flex flex-col items-center gap-2 group hover:border-primary/40 transition-all cursor-pointer">
<span className="material-symbols-outlined text-primary text-3xl">flight_takeoff</span>
<span className="text-xs font-bold uppercase tracking-wider text-slate-500">Weekend Trip</span>
</div>
<div className="p-3 border-2 border-primary/10 rounded-lg bg-primary/5 flex flex-col items-center gap-2 group hover:border-primary/40 transition-all cursor-pointer">
<span className="material-symbols-outlined text-primary text-3xl">luggage</span>
<span className="text-xs font-bold uppercase tracking-wider text-slate-500">Travel Kit</span>
</div>
</div>
{/* CTA Button */}
<button className="w-full bg-primary hover:bg-primary/90 text-white font-accent font-bold py-4 px-8 rounded-xl shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-1 active:scale-95 text-lg">
                    Claim Your Reward
                </button>
{/* Footer Text */}
<p className="mt-6 text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold">
                    Referral ID: WE-99420-PRO
                </p>
</div>
</div>
</div>
    </div>
  );
};

export default ReferralRewardMilestonePopUp;
