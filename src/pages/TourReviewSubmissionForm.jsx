
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

/**
 * Auto-generated from: tour_review_submission_form/code.html
 * Group: account | Path: /account/review
 */
const TourReviewSubmissionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tourId = queryParams.get('tourId') || '1';
  const tourName = queryParams.get('tourName') || 'Amalfi Coast Sunset Trek';

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a rating");
    if (!comment) return alert("Please share your experience");

    setSubmitting(true);
    const reviewData = {
      tourId,
      userName: 'Antigravity Traveler', // Simulated logged in user
      userImage: `https://i.pravatar.cc/150?u=${Math.random()}`,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch('http://localhost:3001/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (res.ok) {
        alert("Thank you for your review!");
        navigate(-1); // Go back to tour page
      }
    } catch (err) {
      console.error("Review submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-page="tour_review_submission_form">
      <div className="layout- flex h-full grow flex-col">
        <main className="flex-1 flex justify-center py-10 px-4 md:px-10 lg:px-40">
          <div className="layout-content- flex flex-col flex-1 gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary text-sm font-medium mb-2">
                <Link className="hover:underline" to="/">Home</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-slate-500">Write a Review</span>
              </div>
              <h1 className="text-teal-dark dark:text-slate-100 text-4xl font-black leading-tight tracking-tight">Tour Review Submission</h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Your feedback helps fellow travelers find their next adventure.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-48 h-32 bg-center bg-no-repeat bg-cover rounded-lg shrink-0 overflow-hidden" 
                   style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596760407110-2f759c2b7188?auto=format&fit=crop&w=400&q=80')" }}>
              </div>
              <div className="flex-1 text-center md:text-left">
                <span className="text-primary text-xs font-bold uppercase tracking-widest">Currently Reviewing</span>
                <h3 className="text-teal-dark dark:text-slate-100 text-2xl font-bold mt-1">{tourName}</h3>
                <p className="text-slate-500 text-sm mt-1">Completed Recently • Guided Group Tour</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <section className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">grade</span>
                  Overall Experience
                </h2>
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button 
                        key={s}
                        type="button" 
                        onClick={() => setRating(s)}
                        className={`transition-transform hover:scale-110 ${rating >= s ? 'text-amber-400' : 'text-[#FFDDD2]'}`}
                      >
                        <span className="material-symbols-outlined !text-5xl" style={{ fontVariationSettings: `'FILL' ${rating >= s ? 1 : 0}` }}>star</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-slate-500 font-medium">Click to rate your overall trip</p>
                </div>
              </section>

              <section className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">edit_note</span>
                  Share your experience
                </h2>
                <div className="space-y-4">
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary p-4 text-slate-700 dark:text-slate-300 placeholder:text-slate-400" 
                    placeholder="What were the highlights? Any tips for other travelers?" 
                    rows="8"
                    required
                  ></textarea>
                </div>
              </section>

              <div className="flex flex-col md:flex-row items-center justify-end gap-6 pt-6">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="flex-1 md:px-12 py-4 bg-teal-dark dark:bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TourReviewSubmissionForm;

