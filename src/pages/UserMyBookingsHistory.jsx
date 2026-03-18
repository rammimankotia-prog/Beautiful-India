
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Auto-generated from: user_my_bookings_history/code.html
 * Group: account | Path: /account/bookings
 */
const UserMyBookingsHistory = () => {
  return (
    <div data-page="user_my_bookings_history">
      <div className="flex min-h-screen">
{/* Sidebar Navigation */}
<aside className="w-72 bg-white dark:bg-slate-900 border-r border-primary/10 flex flex-col fixed h-full">
<div className="p-6">
<div className="flex items-center gap-3 mb-8">
<div className="size-10 rounded-full bg-primary flex items-center justify-center text-white">
<span className="material-symbols-outlined">explore</span>
</div>
<div>
<h1 className="text-primary font-bold text-lg leading-tight">Beautiful India</h1>
<p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Bespoke Journeys</p>
</div>
</div>
<nav className="flex flex-col gap-2">
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-primary/5 transition-colors" href="#">
<span className="material-symbols-outlined">person</span>
<span className="font-medium text-sm">Profile</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white shadow-lg shadow-primary/20" href="#">
<span className="material-symbols-outlined">confirmation_number</span>
<span className="font-medium text-sm">My Bookings</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-primary/5 transition-colors" href="#">
<span className="material-symbols-outlined">favorite</span>
<span className="font-medium text-sm">Saved Trips</span>
</a>
<div className="h-px bg-primary/10 my-4"></div>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-primary/5 transition-colors" href="#">
<span className="material-symbols-outlined">settings</span>
<span className="font-medium text-sm">Account Settings</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors" href="#">
<span className="material-symbols-outlined">logout</span>
<span className="font-medium text-sm">Sign Out</span>
</a>
</nav>
</div>
<div className="mt-auto p-6 border-t border-primary/10">
<div className="flex items-center gap-3">
<div className="size-10 rounded-full bg-slate-200 dark:bg-slate-800 bg-cover bg-center" data-alt="User profile portrait in sidebar" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCaoaY6M6nc_5B5k8UzYb-PjtjZefF_SbyfPrbXIw_qVHAM6L7PENTTxRj53PY3sCgcm_4wJPfCjHWm1VRc71KiWvxvoUwzJqzMVcmWSc6J04SDSkA-bAqxD79Bfg3QuxRQ887gkVeKVJfx19dzpM8O8IS86z3SzHdkSNRt1kAshe44QODYM1Y4zGpv6nV-YW2haS4vsPIRq1Tc8TqUborZ2emPDpZfwWqUUo7DUN9jBNfFGwLTiq6fs11DDkkJ-0OWKky0rspCUBBl')" }}></div>
<div>
<p className="text-sm font-bold truncate ">Alex Rivers</p>
<p className="text-xs text-slate-500">Premium Member</p>
</div>
</div>
</div>
</aside>
{/* Main Content Area */}
<main className="flex-1 ml-72 p-8">

{/* Tabs Section */}
<div className="mb-8 border-b border-primary/10">
<div className="flex gap-8">
<button className="pb-4 border-b-2 border-primary text-primary font-bold text-sm">Upcoming Trips (2)</button>
<button className="pb-4 border-b-2 border-transparent text-slate-500 dark:text-slate-400 font-bold text-sm hover:text-primary transition-colors">Past Adventures (14)</button>
</div>
</div>
{/* Upcoming Trips Section */}
<section className="space-y-6 mb-12">
<div className="flex items-center justify-between">
<h3 className="text-lg font-bold flex items-center gap-2">
<span className="material-symbols-outlined text-primary">calendar_month</span>
                        Upcoming Trips
                    </h3>
</div>
<div className="grid grid-cols-1 gap-6">
{/* Booking Card 1 */}
<div className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-primary/5 hover:shadow-md transition-shadow flex h-52">
<div className="w-72 relative flex-shrink-0 overflow-hidden">
<div className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110" data-alt="Tropical villa in Bali with pool" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA8JTtzu6M0EaJn00YpWDl8YS5pBUhhsT5QAkEI7sP-y-UrAW3IdXJzQrOOIGYGprkYG8m816bbZmqxwWEnX0LGd86g_11UgwE_nyKaJUyxvuIy8rCBlV7FH7lD24NP11rhG4L9pJC4g_48oX97QUmW3x53yLfDJct520kgYtVxTVMJS3UJgu-UkL1TB3CPFACg9hBhCTYxyTjnaM0hhydYyazyQPXXfNHkAc7y5k741iqYayudTfW8ncIe8lW_hzdGg2qjjngPCBZE')" }}></div>
<div className="absolute top-4 left-4">
<span className="bg-primary/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Confirmed</span>
</div>
</div>
<div className="flex-1 p-6 flex flex-col">
<div className="flex justify-between items-start mb-2">
<div>
<p className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">Adventure Tour</p>
<h4 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Magical Bali Retreat &amp; Wellness</h4>
</div>
<p className="text-xs font-medium text-slate-400">ID: #WL-88291</p>
</div>
<div className="flex gap-6 mt-1">
<div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
<span className="material-symbols-outlined text-sm">event</span>
                                    Oct 12 - Oct 20, 2023
                                </div>
<div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
<span className="material-symbols-outlined text-sm">location_on</span>
                                    Ubud, Indonesia
                                </div>
</div>
<div className="mt-auto flex items-center justify-between pt-4 border-t border-primary/5">
<div className="flex -space-x-2">
<div className="size-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 bg-cover bg-center" data-alt="Traveler avatar thumbnail" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB--ijT2z24OQruu7FSBKFT7v9se9KF0nVM84iXX4rUoXd6SFDGrZZx2HeIN0kir7ZZIxlpiP7c8sPO6tiZTo2-44QlupP0QaTYQERUY9IL9VapcBSvADbaB0s5mk4boilsnxgLMPyWAb7QMe-WOPgjoC_UBtkBOon5GbQeMr_q6Z2cYhvTSEeJ1SiWAbheMR4AjsnAoExGr1CeKFsOE26hJFwjGuB9Zu0VVaLNieFDBbmiGvEPyH9w4QP_g968EXu1dVUqGEIl8FDw')" }}></div>
<div className="size-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 bg-cover bg-center" data-alt="Traveler avatar thumbnail" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuArjxSlSYTaZ2bgyYQBlScEqUCq_zUL6N-lnADEdpmGk-a-ovL-eqqCi3QUtCKX8A3CTBvSW0Vi2SmXNgRB2hCb9JgGKY76gKHeYINg4UGTOTbtIfspYZAkQfIazpvuhX0oWGTW0ODBspmPGXqd-PfyK-UkgBqJsTDmYQsIkUS3IYn3kiw2rR5RyMvIx4sTEjeBOIMFVUciKwdYHyhYUn2uHcF8LLS18VzdHonzaljZHOPNHnPZWF-fXmcPSs3Hw_RlNRgHnNFY8vyy')" }}></div>
<div className="size-8 rounded-full border-2 border-white dark:border-slate-900 bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                        +1
                                    </div>
</div>
<div className="flex gap-3">
<button className="px-6 py-2 rounded-lg text-primary text-sm font-bold border border-primary hover:bg-primary/5 transition-colors">Manage</button>
<button className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors flex items-center gap-2">
                                        View Details
                                    </button>
</div>
</div>
</div>
</div>
{/* Booking Card 2 */}
<div className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-primary/5 hover:shadow-md transition-shadow flex h-52">
<div className="w-72 relative flex-shrink-0 overflow-hidden">
<div className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110" data-alt="Colorful houses on Amalfi Coast cliff" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAFtC0eMTm-ILoBrVRbm4SFtBbTa81yL8t6McFnjHXwtGvsD7xsjRWI2YPpkFrl-GN1hYSrShVnH3_uY337T6Q3uHGHjWmOuCckolz-iZACl8vQkFKe_NPwJ0ZTj1FWOwJwGH5AoFfjZ6w7nURtlgrSaDosajNasi6XCJ_Kv2IM5OP2DlG0HPpB-DdjQeCzHfk4yhmiL5TOnPuKwmkJaBTmSFJy_fQZH9lwDJynFSMts4tHLbuwFSChYiOkH991Qk3UVihrC1zYva9U')" }}></div>
<div className="absolute top-4 left-4">
<span className="bg-amber-500 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Pending Payment</span>
</div>
</div>
<div className="flex-1 p-6 flex flex-col">
<div className="flex justify-between items-start mb-2">
<div>
<p className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">Sightseeing</p>
<h4 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Amalfi Coast Luxury Escape</h4>
</div>
<p className="text-xs font-medium text-slate-400">ID: #WL-89442</p>
</div>
<div className="flex gap-6 mt-1">
<div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
<span className="material-symbols-outlined text-sm">event</span>
                                    Nov 05 - Nov 12, 2023
                                </div>
<div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
<span className="material-symbols-outlined text-sm">location_on</span>
                                    Positano, Italy
                                </div>
</div>
<div className="mt-auto flex items-center justify-between pt-4 border-t border-primary/5">
<div className="flex items-center gap-2">
<span className="text-xs font-bold text-amber-600">Action Required: Complete Payment</span>
</div>
<div className="flex gap-3">
<button className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">Complete Booking</button>
</div>
</div>
</div>
</div>
</div>
</section>
{/* Past Adventures Section */}
<section className="space-y-6">
<div className="flex items-center justify-between">
<h3 className="text-lg font-bold flex items-center gap-2">
<span className="material-symbols-outlined text-primary">history</span>
                        Past Adventures
                    </h3>
<button className="text-sm font-bold text-primary hover:underline">View All History</button>
</div>
<div className="grid grid-cols-1 gap-4">
{/* Past Trip Card 1 */}
<div className="bg-white/60 dark:bg-slate-900/60 rounded-xl p-4 border border-primary/5 flex items-center gap-4 hover:bg-white dark:hover:bg-slate-900 transition-colors">
<div className="size-20 rounded-lg overflow-hidden flex-shrink-0">
<div className="w-full h-full bg-center bg-cover" data-alt="Eiffel Tower in Paris at sunset" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBwwwWNrst8iDPVofDP29HlQHWLjJhKm_8Dm4o8xhOZfHmMzqsbxpjy5Co-nIsL1LoHA5Gi0_PsoMHUdWjkpsBuE3eX8G9TYZ7Zd6BXENyGWjJHPSY1Q1fuFfnj_u6XZPjKbvRvEmwxRkSdd1hcVlsBYsrxkZQfR7lkZy1Umg1zF11hUfA-ABvSAxRTh738sQrX36gbhP5hnMYp2XPPuvAMGvbhkEC0tL1E9WYz0mmJ5buXjEjkuyWFxbj3L7MSLkqITj0LgcjEp_pB')" }}></div>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<div>
<h5 className="font-bold text-slate-900 dark:text-slate-100">Parisian Lights &amp; Gastronomy</h5>
<p className="text-xs text-slate-500 dark:text-slate-400">Completed on Aug 15, 2023 • 5 Nights</p>
</div>
<div className="flex items-center gap-2">
<span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Completed</span>
</div>
</div>
</div>
<div className="flex gap-2">
<button className="size-10 flex items-center justify-center rounded-lg border border-primary/20 text-primary hover:bg-primary/5 transition-colors" title="Download Invoice">
<span className="material-symbols-outlined">download_for_offline</span>
</button>
<button className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors">Review Trip</button>
</div>
</div>
{/* Past Trip Card 2 */}
<div className="bg-white/60 dark:bg-slate-900/60 rounded-xl p-4 border border-primary/5 flex items-center gap-4 hover:bg-white dark:hover:bg-slate-900 transition-colors">
<div className="size-20 rounded-lg overflow-hidden flex-shrink-0">
<div className="w-full h-full bg-center bg-cover" data-alt="The Taj Mahal in Agra India" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD4FNsjOv_bQAhgKamN7HBC7xA3CNMYCflt_qKl7u3iTz4T6ASJzChf_LwdonzAlXmXkPkaTVYlI1tUqv_C-4tpZLCetlJeqbmA5OWtWwSaXn0u1iPAs6jBOLUwfufsS9XId4aMPP-ovx4KyvubPBXRsqfLXNc4zoQvWeI8MD85Bs1xoAq30cCUwg0fxKYMQA2Xb9iEuKHHiQRME0r76MGk5V2Q8EgKjGdzG1jgJQ1i0Fl5BilxcfrA8lSCKVdtsbZU2_6byVpBhxKs')" }}></div>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<div>
<h5 className="font-bold text-slate-900 dark:text-slate-100">Golden Triangle Cultural Tour</h5>
<p className="text-xs text-slate-500 dark:text-slate-400">Completed on Jun 22, 2023 • 10 Nights</p>
</div>
<div className="flex items-center gap-2">
<span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Completed</span>
</div>
</div>
</div>
<div className="flex gap-2">
<button className="size-10 flex items-center justify-center rounded-lg border border-primary/20 text-primary hover:bg-primary/5 transition-colors" title="Download Invoice">
<span className="material-symbols-outlined">download_for_offline</span>
</button>
<button className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors">Review Trip</button>
</div>
</div>
</div>
</section>
</main>
</div>
    </div>
  );
};

export default UserMyBookingsHistory;
