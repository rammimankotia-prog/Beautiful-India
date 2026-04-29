import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const leadPayload = {
      id: `CONT-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
      to: form.subject,                // what the inquiry is about
      source: 'Contact Us Page',       // ← exact page source label
      createdAt: new Date().toISOString(),
      status: 'New'
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      });
      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setError('Something went wrong. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  const contactCards = [
    {
      icon: 'call',
      label: 'Call Us',
      value: '+916005159433',
      sub: 'Mon – Sat, 9 AM – 7 PM IST',
      color: 'bg-primary/10 text-primary',
      href: 'tel:+916005159433'
    },
    {
      icon: 'mail',
      label: 'Email Us',
      value: 'customercare@beautifulindia.com',
      sub: 'We reply within 24 hours',
      color: 'bg-emerald-50 text-emerald-600',
      href: 'mailto:customercare@beautifulindia.com'
    },
    {
      icon: 'location_on',
      label: 'Our Office',
      value: 'New Delhi, India',
      sub: '123, India Gate Road, 110001',
      color: 'bg-orange-50 text-orange-500',
      href: '#map'
    },
    {
      icon: 'chat',
      label: 'Live Chat',
      value: 'Chat with an Expert',
      sub: 'Available 24 × 7',
      color: 'bg-purple-50 text-purple-500',
      href: '/wanderbot'
    }
  ];

  const subjects = ['General Inquiry', 'Tour Booking', 'Customise a Tour', 'Group Travel', 'Cancellation / Refund', 'Partnership', 'Other'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ── Hero Banner ── */}
      <div className="relative bg-slate-900 overflow-hidden">
        {/* Background image overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />

        <div className="relative px-4 md:px-10 lg:px-40 py-20 md:py-28">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-white font-semibold">Contact Us</span>
          </div>

          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-5">
              <span className="material-symbols-outlined text-[14px]">support_agent</span>
              We're here to help
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
              Let's Plan Your<br />
              <span className="text-primary">Dream Trip</span>
            </h1>
            <p className="text-slate-500 font-bold mb-4">Chat with Bharat Bot, our AI travel expert.</p>
            <p className="text-slate-300 text-lg leading-relaxed">
              Have a question or need help booking? Our travel experts are ready to assist you — by phone, email, or live chat.
            </p>
          </div>
        </div>
      </div>

      {/* ── Contact Cards ── */}
      <div className="px-4 md:px-10 lg:px-40 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactCards.map((card, i) => (
            <a
              key={i}
              href={card.href}
              className="group bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-md hover:shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1 flex flex-col gap-3"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}>
                <span className="material-symbols-outlined text-[22px]">{card.icon}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{card.label}</p>
                <p className="font-black text-slate-800 dark:text-slate-100 text-sm group-hover:text-primary transition-colors leading-tight">{card.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
              </div>
              <span className="material-symbols-outlined text-[18px] text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all self-end mt-auto">arrow_forward</span>
            </a>
          ))}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="px-4 md:px-10 lg:px-40 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left: Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 md:p-10">
              <div className="mb-8">
                <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Send a Message</p>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">Get in Touch</h2>
                <p className="text-slate-500 mt-1 text-sm">Fill in the form and our team will get back to you within 24 hours.</p>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-500 text-4xl">check_circle</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white">Message Sent!</h3>
                  <p className="text-slate-500 text-sm max-w-xs">Thank you for reaching out. Our team will contact you within 24 hours.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' }); }}
                    className="mt-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">person</span>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="Rahul Sharma"
                          value={form.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Email Address *</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">mail</span>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="rahul@email.com"
                          value={form.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone + Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">call</span>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+91 98765 43210"
                          value={form.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Subject *</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">topic</span>
                        <select
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                        >
                          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Message *</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us about your dream trip — destination, travel dates, group size, special requests..."
                      value={form.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-300 resize-none"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-black rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 text-sm uppercase tracking-wide disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">send</span>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right: Info + Map */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Office Hours */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
              <h3 className="font-black text-slate-800 dark:text-white text-base mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                Office Hours
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { day: 'Monday – Friday', time: '9:00 AM – 7:00 PM' },
                  { day: 'Saturday', time: '10:00 AM – 5:00 PM' },
                  { day: 'Sunday', time: 'Closed' }
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800 pb-2 last:border-0 last:pb-0">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">{row.day}</span>
                    <span className={`font-black ${row.time === 'Closed' ? 'text-red-400' : 'text-slate-800 dark:text-slate-100'}`}>{row.time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl px-3 py-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold">Currently Open · Live chat available 24×7</span>
              </div>
            </div>

            {/* Map Placeholder */}
            <div
              id="map"
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden flex-1 min-h-[220px] relative"
            >
              <iframe
                title="Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.901!2d77.2295!3d28.6129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x77bc84a28ae0ac7%3A0x1!2sIndia+Gate!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '220px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Social Links */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
              <h3 className="font-black text-slate-800 dark:text-white text-base mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">share</span>
                Follow Us
              </h3>
              <div className="flex items-center gap-3">
                {[
                  { icon: '📘', label: 'Facebook', color: 'hover:bg-blue-50 hover:text-blue-600' },
                  { icon: '📸', label: 'Instagram', color: 'hover:bg-pink-50 hover:text-pink-600' },
                  { icon: '🐦', label: 'Twitter', color: 'hover:bg-sky-50 hover:text-sky-500' },
                  { icon: '▶️', label: 'YouTube', color: 'hover:bg-red-50 hover:text-red-500' },
                ].map((s, i) => (
                  <button key={i} title={s.label} className={`w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-lg transition-all border border-slate-100 dark:border-slate-700 ${s.color}`}>
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick FAQs ── */}
      <div className="px-4 md:px-10 lg:px-40 pb-20">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 md:p-10">
          <div className="text-center mb-8">
            <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Quick Answers</p>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">Common Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              { q: 'How quickly do you respond?', a: 'We respond to all email queries within 24 hours. Phone and live chat are available during office hours.' },
              { q: 'Can I customise a tour package?', a: 'Absolutely! All our packages are fully customizable. Tell us your preferences and we\'ll build the perfect itinerary.' },
              { q: 'Do you offer group discounts?', a: 'Yes, we offer attractive discounts for groups of 10 or more. Contact us for a custom group quote.' },
              { q: 'How do I cancel or modify a booking?', a: 'Use our Booking Cancellation form or email us. Most bookings allow free cancellation 30 days before departure.' },
            ].map((faq, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
                <h4 className="font-black text-slate-800 dark:text-slate-100 text-sm mb-2 flex items-start gap-2">
                  <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{i + 1}</span>
                  {faq.q}
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
