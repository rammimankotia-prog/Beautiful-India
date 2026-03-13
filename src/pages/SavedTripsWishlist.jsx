
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Auto-generated from: saved_trips_wishlist/code.html
 * Group: account | Path: /account/wishlist
 */
const SavedTripsWishlist = () => {
  return (
    <div data-page="saved_trips_wishlist">
      <div className="layout- flex h-full grow flex-col">
{/* Top Navigation Bar */}

{/* Main Content Area */}
<main className="flex-1 px-4 md:px-10 lg:px-20 py-8   w-full">
{/* Header Section */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
<div className="space-y-2">
<h1 className="text-accent-teal dark:text-primary text-4xl font-black font-montserrat tracking-tight">Saved Trips Wishlist</h1>
<p className="text-slate-600 dark:text-slate-400 text-lg">Curate your dream adventures and share them with your travel partners.</p>
</div>
<div className="flex gap-3">
<button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-bold hover:shadow-md transition-all">
<span className="material-symbols-outlined text-xl">share</span>
<span>Share Wishlist</span>
</button>
<button className="flex items-center gap-2 px-6 py-3 bg-accent-teal text-white rounded-xl font-bold hover:bg-accent-teal/90 transition-all shadow-lg shadow-accent-teal/20">
<span className="material-symbols-outlined text-xl">explore</span>
<span>Discover More</span>
</button>
</div>
</div>
{/* Tabs/Filters */}
<div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 gap-8">
<button className="border-b-4 border-accent-teal dark:border-primary text-accent-teal dark:text-primary px-2 py-4 font-bold text-sm uppercase tracking-wider">All Saved (6)</button>
<button className="text-slate-400 dark:text-slate-500 px-2 py-4 font-bold text-sm uppercase tracking-wider hover:text-slate-600">Upcoming</button>
<button className="text-slate-400 dark:text-slate-500 px-2 py-4 font-bold text-sm uppercase tracking-wider hover:text-slate-600">Archived</button>
</div>
{/* Wishlist Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
{/* Tour Card 1 */}
<Link to="/tours/2" className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 block">
<div className="relative aspect-[4/3] overflow-hidden">
<img alt="Amalfi Coast" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Sunny view of colorful buildings on Amalfi Coast cliffside" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj_C8KSIm3vUgA3J3sAwjRVER0oYvaQ7e5L_SSPrsC6pguxQJSx0xOoG7Wpjtknwaicf-4CT0r0xD2xPTg5adxVTP8ZygLoTJCMp1G1lhVGx5lspQq2qik55z298-aLlfYa7ALzW2GB2St91VUTgnOC3Y9DHzBX_HBMQMdiOtxxi3cQnLmsMGqN1yW7ivCkFgZG9NIydoBU3k_8gRDMvcvNq0TX7KljF-wz76NpCnEyXCuH27aXCLMD185u_ywhxTDEAUHacZ49x3I"/>
<button className="absolute top-4 right-4 h-10 w-10 bg-white/90 dark:bg-slate-900/90 rounded-full flex items-center justify-center text-primary shadow-lg backdrop-blur-sm">
<span className="material-symbols-outlined fill-1">favorite</span>
</button>
<div className="absolute bottom-4 left-4">
<span className="bg-accent-teal text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">7 Days</span>
</div>
</div>
<div className="p-5 space-y-2">
<h3 className="text-slate-900 dark:text-slate-100 font-bold text-lg font-montserrat group-hover:text-accent-teal transition-colors">Amalfi Coast Escape</h3>
<div className="flex items-center gap-1 text-amber-500">
<span className="material-symbols-outlined text-sm">star</span>
<span className="text-sm font-bold">4.9</span>
<span className="text-slate-400 font-normal text-xs ml-1">(124 reviews)</span>
</div>
<div className="pt-2 flex items-center justify-between border-t border-slate-50 dark:border-slate-700">
<p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Starting from</p>
<p className="text-accent-teal dark:text-primary font-extrabold text-xl">$1,200</p>
</div>
</div>
</Link>
{/* Tour Card 2 */}
<div className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700">
<div className="relative aspect-[4/3] overflow-hidden">
<img alt="Kyoto Zen" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Serene Japanese temple and zen garden in Kyoto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFEg8IGyEoEXz-RRs2DqIAE6fRQgvINEu-jtq9E3jK8JsnvzfoJ4syLCubg5H_q8zPZgeLHETe1t7UwF76Qh11VCqB0O1kQeyQZVgD2-jr67SJb0QkPMMkIBUYjm9wlblqXMACTns7qP99x1R2hNPG3VpnPDi1f3Cr9c8ZB088m3hREaM837H0kajnaGvZ3zuTh42FAyL0DTwAzlF_1ahBTpmAHGHRWXmcl8PONlP3HO-EfkCBeSpGANyIZmIV0yotJn-ZJNM8YmsG"/>
<button className="absolute top-4 right-4 h-10 w-10 bg-white/90 dark:bg-slate-900/90 rounded-full flex items-center justify-center text-primary shadow-lg backdrop-blur-sm">
<span className="material-symbols-outlined fill-1">favorite</span>
</button>
<div className="absolute bottom-4 left-4">
<span className="bg-accent-teal text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">5 Days</span>
</div>
</div>
<div className="p-5 space-y-2">
<h3 className="text-slate-900 dark:text-slate-100 font-bold text-lg font-montserrat group-hover:text-accent-teal transition-colors">Kyoto Zen Gardens</h3>
<div className="flex items-center gap-1 text-amber-500">
<span className="material-symbols-outlined text-sm">star</span>
<span className="text-sm font-bold">4.8</span>
<span className="text-slate-400 font-normal text-xs ml-1">(89 reviews)</span>
</div>
<div className="pt-2 flex items-center justify-between border-t border-slate-50 dark:border-slate-700">
<p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Starting from</p>
<p className="text-accent-teal dark:text-primary font-extrabold text-xl">$950</p>
</div>
</div>
</div>
{/* Tour Card 3 */}
<div className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700">
<div className="relative aspect-[4/3] overflow-hidden">
<img alt="Safari" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Majestic elephant walking through the African savanna at sunset" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrX_RxiBSESutQlpUEQpKJS52pGTdz9T7CfJGq1hX4-GOG9z07VJrJrxMWTIv5fOU21WuNn-sijI4vd_pMRCFIhGIMKUk_6Z6n_QGT6nsCun7Rz3ge0IaYytMgNro9ysEZyzzTLNCgIxx8jLdgYPFniSSehWe_2yfJD9xmx5_WB_SGWaghj1hJ29R3QPuhKs25txsY9OkzekWBZIPIQoyH8__pW7nbCNqdqZnG4f8HkQvZ0Z3ISPErRRPcGfdcgekq_SezLBUIZ_oM"/>
<button className="absolute top-4 right-4 h-10 w-10 bg-white/90 dark:bg-slate-900/90 rounded-full flex items-center justify-center text-primary shadow-lg backdrop-blur-sm">
<span className="material-symbols-outlined fill-1">favorite</span>
</button>
<div className="absolute bottom-4 left-4">
<span className="bg-accent-teal text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">10 Days</span>
</div>
</div>
<div className="p-5 space-y-2">
<h3 className="text-slate-900 dark:text-slate-100 font-bold text-lg font-montserrat group-hover:text-accent-teal transition-colors">Safari Adventure</h3>
<div className="flex items-center gap-1 text-amber-500">
<span className="material-symbols-outlined text-sm">star</span>
<span className="text-sm font-bold">5.0</span>
<span className="text-slate-400 font-normal text-xs ml-1">(210 reviews)</span>
</div>
<div className="pt-2 flex items-center justify-between border-t border-slate-50 dark:border-slate-700">
<p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Starting from</p>
<p className="text-accent-teal dark:text-primary font-extrabold text-xl">$2,400</p>
</div>
</div>
</div>
{/* Tour Card 4 */}
<div className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700">
<div className="relative aspect-[4/3] overflow-hidden">
<img alt="Iceland" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Vibrant green northern lights over an Icelandic mountain range" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClWGcqiE_I117bh7GqeJjjzEkWf2sjrN40EYjrGIDTIJP796AKJ--QEcb65DejQ6zRiIvVhxbAXLATsVYWHNDtTBFFsHjb7Zo8insG26ZM5gQ_hS7Gdz6xdD01PXLgr86jnIc0xSw2Mt_9MUTkNIK-W_2HuZ7Fx-K_mn0BiQLdfEj68vn0qRunEl_VgBsVn8RgXyxWyN8a8HWlKl_0PZtRW4K0-6juYPWSdbUMY8PUGoS6AEi5Gm3Fy9L1p3W83ESDXxaKJkoK3Qy3"/>
<button className="absolute top-4 right-4 h-10 w-10 bg-white/90 dark:bg-slate-900/90 rounded-full flex items-center justify-center text-primary shadow-lg backdrop-blur-sm">
<span className="material-symbols-outlined fill-1">favorite</span>
</button>
<div className="absolute bottom-4 left-4">
<span className="bg-accent-teal text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">6 Days</span>
</div>
</div>
<div className="p-5 space-y-2">
<h3 className="text-slate-900 dark:text-slate-100 font-bold text-lg font-montserrat group-hover:text-accent-teal transition-colors">Icelandic Wonders</h3>
<div className="flex items-center gap-1 text-amber-500">
<span className="material-symbols-outlined text-sm">star</span>
<span className="text-sm font-bold">4.7</span>
<span className="text-slate-400 font-normal text-xs ml-1">(156 reviews)</span>
</div>
<div className="pt-2 flex items-center justify-between border-t border-slate-50 dark:border-slate-700">
<p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Starting from</p>
<p className="text-accent-teal dark:text-primary font-extrabold text-xl">$1,800</p>
</div>
</div>
</div>
{/* Tour Card 5 */}
<div className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700">
<div className="relative aspect-[4/3] overflow-hidden">
<img alt="Swiss Alps" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Snow capped mountain peaks of the Swiss Alps under a blue sky" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADrXwXIvSd8BZOrWMvi-0QbtuJPD9wdVql5IABt2sbpXQ1yhTfvCtJcwnfG7r3H-1_fqHj5xapi4ogCZIIVsiKsrfrgP-UcyJoFHDpQFozFMUiXPb1c5G5-cRuIULqEpLqxJLTfzATPWtrtYRI5hbIA_20l9fen5u-3LbcLUH2a_ugzEnp2BVdU9jsM4WTCBf8tlaiCL_sKK9PenxrWUr7fdLmY5P21CBkxgn00nAK56994R6Hp4mFu6loK5sd4ktGAhpJiNq-yiXV"/>
<button className="absolute top-4 right-4 h-10 w-10 bg-white/90 dark:bg-slate-900/90 rounded-full flex items-center justify-center text-primary shadow-lg backdrop-blur-sm">
<span className="material-symbols-outlined fill-1">favorite</span>
</button>
<div className="absolute bottom-4 left-4">
<span className="bg-accent-teal text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">8 Days</span>
</div>
</div>
<div className="p-5 space-y-2">
<h3 className="text-slate-900 dark:text-slate-100 font-bold text-lg font-montserrat group-hover:text-accent-teal transition-colors">Swiss Alps Trek</h3>
<div className="flex items-center gap-1 text-amber-500">
<span className="material-symbols-outlined text-sm">star</span>
<span className="text-sm font-bold">4.9</span>
<span className="text-slate-400 font-normal text-xs ml-1">(92 reviews)</span>
</div>
<div className="pt-2 flex items-center justify-between border-t border-slate-50 dark:border-slate-700">
<p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Starting from</p>
<p className="text-accent-teal dark:text-primary font-extrabold text-xl">$1,550</p>
</div>
</div>
</div>
{/* Tour Card 6 */}
<div className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700">
<div className="relative aspect-[4/3] overflow-hidden">
<img alt="Greek Island" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="White and blue buildings overlooking the turquoise Aegean sea in Greece" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1g3Yk4fWCo-vDmewVeH4W2vbI6BoblROWkX6RZ8v6feomRFlWjoTFW4OxDn3w3xXV1enAOA6IBv-WZcg2QN8uDsK5MyHduLHzKGIluZrMfwUnGcJtzqvNNXcu0q74MhUiZRULaXBc7mCJb0RPlfXig0mVvpYaLhN0VFVmZ0hspdclegslX7G_vXBC0t1smiCYtud-WRmRrI456BV0qInwsaXyCBzFlpKneGRlTo_5-aLHR7HEnpRwXJVMq-ZfL21w9KAwGqnVewro"/>
<button className="absolute top-4 right-4 h-10 w-10 bg-white/90 dark:bg-slate-900/90 rounded-full flex items-center justify-center text-primary shadow-lg backdrop-blur-sm">
<span className="material-symbols-outlined fill-1">favorite</span>
</button>
<div className="absolute bottom-4 left-4">
<span className="bg-accent-teal text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">7 Days</span>
</div>
</div>
<div className="p-5 space-y-2">
<h3 className="text-slate-900 dark:text-slate-100 font-bold text-lg font-montserrat group-hover:text-accent-teal transition-colors">Greek Island Hopping</h3>
<div className="flex items-center gap-1 text-amber-500">
<span className="material-symbols-outlined text-sm">star</span>
<span className="text-sm font-bold">4.8</span>
<span className="text-slate-400 font-normal text-xs ml-1">(187 reviews)</span>
</div>
<div className="pt-2 flex items-center justify-between border-t border-slate-50 dark:border-slate-700">
<p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Starting from</p>
<p className="text-accent-teal dark:text-primary font-extrabold text-xl">$1,100</p>
</div>
</div>
</div>
</div>
{/* Empty State Illustration (Hidden when there are items) */}
<div className="hidden flex-col items-center justify-center py-20 px-6 text-center  ">
<div className="w-64 h-64 mb-8 bg-primary/20 rounded-full flex items-center justify-center">
<span className="material-symbols-outlined text-accent-teal text-8xl">explore_off</span>
</div>
<h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-montserrat mb-3">Your wishlist is empty</h2>
<p className="text-slate-500 dark:text-slate-400 mb-8">Start exploring our curated collections and save your favorite tours to see them here.</p>
<button className="bg-accent-teal text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
                    Browse Popular Tours
                </button>
</div>
{/* Suggestions Section */}
<section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 pb-20">
<div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4 text-center md:text-left">
<div>
<h2 className="text-2xl font-bold font-montserrat text-slate-900 dark:text-slate-100">Recommended for You</h2>
<p className="text-slate-500 dark:text-slate-400">Based on your saved tours and browsing history.</p>
</div>
<a className="text-accent-teal font-bold flex items-center gap-1 hover:underline" href="#">
                        View All Recommendations
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
</a>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
<div className="flex flex-col sm:flex-row gap-6 bg-primary/10 dark:bg-primary/5 p-6 rounded-2xl border border-primary/20">
<div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden shrink-0">
<img alt="Bali" className="w-full h-full object-cover" data-alt="Aerial view of lush green rice terraces in Bali" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGIz2jAazHSBisZEw1yGVPvQJUC401KSm2TuyMhIzd3l4CWJdnzRNfWDcMBiisr9FYnw30rJPAeuHddo0jy2L3ruMUOPK4MxDlon7ke1su5Z1OeHTsxUht6kRBVhGUkNNX_JC6HS6i8qBaebpUOX6xvqYrUFN_T2pNdJn3QIpwNY8RsiUW6M9Kaj0_-9cNxg7j-k5paa0KlF_b50bbhPTysXQixoZInnE9j-Ulo02doSAfg6-vZ5Laufyf3UmexZXKyPLNXPz04yrB"/>
</div>
<div className="flex flex-col justify-center">
<h4 className="font-bold text-lg text-slate-900 dark:text-slate-100">Bali Spiritual Journey</h4>
<p className="text-slate-600 dark:text-slate-400 text-sm mt-1">9 Days • Cultural &amp; Spiritual Experience</p>
<div className="mt-4 flex items-center gap-4">
<span className="text-accent-teal font-bold">$1,450</span>
<button className="text-sm font-bold border-b-2 border-slate-900 dark:border-slate-100">Quick View</button>
</div>
</div>
</div>
<div className="flex flex-col sm:flex-row gap-6 bg-primary/10 dark:bg-primary/5 p-6 rounded-2xl border border-primary/20">
<div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden shrink-0">
<img alt="India" className="w-full h-full object-cover" data-alt="The Taj Mahal palace glowing in soft morning light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTXKGdN5Ywc0dxxBpn-AtAZRJ7w3XD_vUSOi4tbnmJma0ef9PmFo5uzQIt3BqhTFMk-v-f5gPIzLg18pyiRVE1i8mI2kV-FyeMTic76R3t4Cc3rNECLDpdShIoW27_4bYnN3n1WsOYzLs771d64Ozq59m9nSLhSu_hDnA9WRRVOP9LZyf4hMb1g9GS54xbF5zUMOITAZnUMwynCvFfaV2yKZaxXTMv70u8IQd3DYPosKhf5zaClOafmLpUsg0hx1RVZ_CsOwvjtzgC"/>
</div>
<div className="flex flex-col justify-center">
<h4 className="font-bold text-lg text-slate-900 dark:text-slate-100">Golden Triangle Heritage</h4>
<p className="text-slate-600 dark:text-slate-400 text-sm mt-1">6 Days • Historic Landmarks Tour</p>
<div className="mt-4 flex items-center gap-4">
<span className="text-accent-teal font-bold">$820</span>
<button className="text-sm font-bold border-b-2 border-slate-900 dark:border-slate-100">Quick View</button>
</div>
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

export default SavedTripsWishlist;
