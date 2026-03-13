
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Auto-generated from: secure_password_reset_email/code.html
 * Group: emails | Path: /emails/password-reset
 */
const SecurePasswordResetEmail = () => {
  return (
    <div data-page="secure_password_reset_email">
      <div className=" w-full bg-white dark:bg-slate-900 shadow-xl rounded-xl overflow-hidden border border-brand-teal/10">

<main className="px-10 py-12 flex flex-col items-center text-center">
<div className="mb-8 p-4 bg-background-light dark:bg-slate-800 rounded-full">
<span className="material-symbols-outlined text-brand-teal text-4xl">lock_reset</span>
</div>
<h1 className="text-slate-900 dark:text-slate-100 text-3xl font-bold leading-tight mb-4">
                Reset Your Password
            </h1>
<p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-10 ">
                We received a request to reset the password for your <span className="font-semibold text-brand-teal">Wanderlust Explorer Pro</span> account. Click the secure button below to choose a new password.
            </p>
<a className="inline-flex items-center justify-center px-10 py-4 bg-primary hover:bg-primary/90 text-brand-teal font-bold text-lg rounded-lg transition-colors shadow-sm tracking-wide" href="#">
                Set New Password
            </a>
<div className="mt-12 pt-8 border-t border-background-light dark:border-slate-800 w-full">
<p className="text-slate-500 dark:text-slate-500 text-sm italic mb-4">
                    If you didn't request this, you can safely ignore this email. Your password will remain unchanged.
                </p>
<p className="text-slate-400 dark:text-slate-600 text-xs">
                    This link will expire in 24 hours for your security.
                </p>
</div>
</main>

</div>
    </div>
  );
};

export default SecurePasswordResetEmail;
