
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Auto-generated from: wanderbot_limited_time_flash_sale_card/code.html
 * Group: ai | Path: /wanderbot/flash-sale
 */
const BharatBotLimitedTimeFlashSaleCard = () => {
  return (
    <div data-page="wanderbot_limited_time_flash_sale_card">
      <div className="layout- flex h-full grow flex-col">
{/* Navigation */}

{/* Main Content (Chat Interface Simulation) */}
<main className="flex-1 flex justify-center py-10 px-4">
<div className="w-full  flex flex-col gap-6">
{/* Chat Message Bubble (Bot) */}
<div className="flex gap-3 items-start">
<div className="size-10 rounded-full bg-teal-accent flex items-center justify-center text-white shrink-0">
<span className="material-symbols-outlined">smart_toy</span>
</div>
<div className="bg-sand dark:bg-slate-800 p-4 rounded-xl rounded-tl-none shadow-sm text-slate-800 dark:text-slate-200 border border-teal-accent/10">
<p className="font-medium">Found something special for your next trip! Check out this exclusive flash sale for Beautiful India members.</p>
</div>
</div>
{/* FLASH SALE CARD */}
<div className="relative overflow-hidden rounded-xl shadow-2xl transition-transform hover:scale-[1.01] duration-300">
{/* Background Image with Overlay */}
<div className="absolute inset-0 bg-cover bg-center" data-alt="Luxury safari tent at sunset with elephants in the distance" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAp6-MsCpdixj4XL5geIHWJq0aKXXC7gcEemsq3WE9EkeKHAlJa4OXsggVP1rLH6mSBSZui9XMWktehNkSdnnYhVZdIuTfZ78bq9fAn3MgBFfRjJFH5uLuAdV1EiSK23xv-OOdjgrbtw4sytX6sp8o1V_Wj_A2SWkd7LCdd-X_77e-2S1wqVJ9MpiKer2gCZOP0Eg1D95VdtYx_DhDxDAgJYP8XH86gms11w5m5n6Htp8QT-DeOrcJQ72sifWDpzeHonUr2hMFMM5gL')" }}>
</div>
<div className="absolute inset-0 bg-teal-accent/60 backdrop-blur-[2px]"></div>
{/* Card Content */}
<div className="relative z-10 p-8 flex flex-col items-center text-center text-white min-h-[420px] justify-between">
<div className="flex flex-col gap-4">
<span className="inline-block px-3 py-1 bg-primary text-slate-900 font-bold text-xs uppercase tracking-widest rounded-full self-center">Limited Time</span>
<h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight font-montserrat">
                                Flash Sale: <br/>
<span className="text-primary">25% Off</span> Next 24 Hours!
                            </h2>
<p className="text-lg font-medium leading-relaxed   opacity-95">
                                Book any <span className="text-primary font-bold">Adventure tour</span> within the next day and save $250. 
                                <br/>
                                Use Code: <span className="bg-white/20 px-2 py-0.5 rounded border border-white/30 text-white font-mono">EXPLORE25</span>
</p>
</div>
{/* Countdown Timer */}
<div className="flex gap-3 py-6 w-full justify-center">
<div className="flex flex-col items-center gap-1 group">
<div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/20 backdrop-blur-md border border-primary/40 shadow-inner">
<p className="text-primary text-2xl font-bold font-montserrat">23</p>
</div>
<p className="text-primary/80 text-xs font-bold uppercase tracking-tighter">Hours</p>
</div>
<div className="text-primary text-2xl font-bold pt-4">:</div>
<div className="flex flex-col items-center gap-1 group">
<div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/20 backdrop-blur-md border border-primary/40 shadow-inner">
<p className="text-primary text-2xl font-bold font-montserrat">59</p>
</div>
<p className="text-primary/80 text-xs font-bold uppercase tracking-tighter">Minutes</p>
</div>
<div className="text-primary text-2xl font-bold pt-4">:</div>
<div className="flex flex-col items-center gap-1 group">
<div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/20 backdrop-blur-md border border-primary/40 shadow-inner">
<p className="text-primary text-2xl font-bold font-montserrat">59</p>
</div>
<p className="text-primary/80 text-xs font-bold uppercase tracking-tighter">Seconds</p>
</div>
</div>
{/* Action Button */}
<button className="w-full  flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 bg-primary text-slate-900 text-lg font-bold tracking-[0.02em] font-montserrat shadow-lg hover:shadow-primary/40 transition-all hover:-translate-y-0.5 active:translate-y-0">
                            Claim Offer
                            <span className="material-symbols-outlined ml-2">arrow_forward</span>
</button>
</div>
</div>
{/* Chat Input Simulation */}
<div className="mt-4 flex gap-2 items-center">
<div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-6 py-3 shadow-sm flex items-center">
<input className="w-full bg-transparent border-none focus:ring-0 text-slate-800 dark:text-slate-100" placeholder="Type your destination..." type="text"/>
<span className="material-symbols-outlined text-slate-400 cursor-pointer">send</span>
</div>
<button className="size-12 rounded-full bg-teal-accent text-white flex items-center justify-center shadow-md">
<span className="material-symbols-outlined">mic</span>
</button>
</div>
</div>
</main>
{/* Footer */}

</div>
    </div>
  );
};

export default BharatBotLimitedTimeFlashSaleCard;
