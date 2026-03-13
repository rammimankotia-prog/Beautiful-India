
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Auto-generated from: waitlist_join_confirmation_email/code.html
 * Group: emails | Path: /emails/waitlist
 */
const WaitlistJoinConfirmationEmail = () => {
  return (
    <div data-page="waitlist_join_confirmation_email">
      <div className=" w-full bg-white dark:bg-slate-900 shadow-xl rounded-xl overflow-hidden border border-primary/10">
{/* Header Section */}

{/* Hero Image */}
<div className="relative h-64 w-full bg-cover bg-center flex items-end" data-alt="Commercial airplane flying through blue sky clouds" style={{ backgroundImage: "linear-gradient(to top, rgba(0,108,117,0.7), transparent), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDsOGEZrow46ml8CiadNXIhpHVCCTH_7vxzBKa-APoz63t6feo-HlaX1PdlrRX17vYH76TT_cjcWjQ_6zTylzkw8HnutegcRV5UtBHweEv-5TbDrk-MUPZ38eWijveRB8S-Bb9FnBgiTgxHZu0bYGtgV7GepLi9E9aHRBBSvOe5L9pOxgbdS6eqHHE8UZYse6j0XSU4u4mkVSiJRB5X3ZdenPsFrlyPIzjKLQY4LsnZ7wZGs7UxiQmee5lfx-A4pZbEr6mV3sJV_T1Q')" }}>
<div className="p-8">
<span className="inline-block px-3 py-1 bg-accent text-primary text-xs font-bold rounded-full mb-3 uppercase tracking-widest">Waitlist Confirmation</span>
<h2 className="text-white text-4xl font-bold leading-tight">You’re on the List!</h2>
</div>
</div>
{/* Main Body Content */}
<div className="p-8 space-y-6">
<div className="space-y-3">
<h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Success! You've joined the waitlist.</h3>
<p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    We’ll notify you immediately if a spot opens up or if we add new dates for this adventure. Our team is working hard to accommodate more explorers like you!
                </p>
</div>
{/* Tour Card */}
<div className="bg-background-light dark:bg-slate-800 rounded-xl p-4 flex gap-4 items-center border border-primary/5">
<div className="h-20 w-24 rounded-lg bg-cover bg-center shrink-0 shadow-sm" data-alt="Beautiful sunset over the Amalfi Coast cliffs" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB4eZre5DNnW9B6rgqPijcaQIim4Tcvo0xMOrjDDPpuSBKBaOnjuw3jP_aN2MUSkAaWpQFYzQOU_hypX4GoV6KpavRXJyfxFl1w4d-gQe6huD2UweqfTPhIpGMvC631_eRGFaci1Jc1T1Qd5psPU-hMxeebcueXdqc9PTFHrLgZCN3b0GEWbXbUUhOr_LjzlmEntb6JfUJc4293_XPQ_LwT5Hz4xdq7ozL0ea0t6KzmL9Dqbzuyymg8IogixEd1jdcrBp5FquQijJFm')" }}>
</div>
<div className="flex-1">
<p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Upcoming Adventure</p>
<p className="text-lg font-bold text-slate-900 dark:text-slate-100">Amalfi Coast Sunset Trek</p>
<div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm mt-1">
<span className="material-symbols-outlined text-sm">event_available</span>
<span>Waitlist Status: <span className="text-primary font-semibold">Confirmed</span></span>
</div>
</div>
</div>
{/* CTA Section */}
<div className="pt-4 flex flex-col items-center gap-4">
<button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
                    Explore Similar Tours
                    <span className="material-symbols-outlined">arrow_forward</span>
</button>
<p className="text-sm text-slate-400 dark:text-slate-500 italic">Don't want to wait? Check out our other available departures.</p>
</div>
</div>
{/* Footer */}

</div>
    </div>
  );
};

export default WaitlistJoinConfirmationEmail;
