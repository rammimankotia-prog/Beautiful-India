import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ── animated counter hook ── */
const useCounter = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
};

/* ── intersection observer hook ── */
const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
};

/* ── Stat card with animated counter ── */
const StatCard = ({ value, suffix = '', label, icon, inView }) => {
  const count = useCounter(value, 1800, inView);
  return (
    <div className="flex flex-col items-center text-center gap-1">
      <span className="material-symbols-outlined text-primary text-3xl mb-1">{icon}</span>
      <p className="text-3xl md:text-4xl font-black text-slate-800">{count}{suffix}</p>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
  );
};

/* ── Region card ── */
const RegionCard = ({ image, name, tagline, description, icon }) => (
  <div className="group relative overflow-hidden rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 cursor-default h-[340px]">
    <img src={image} alt={name} className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
      <span className="text-2xl mb-2">{icon}</span>
      <p className="text-xs font-black uppercase tracking-widest text-primary/80 mb-1">{tagline}</p>
      <h3 className="text-xl font-black leading-tight mb-2">{name}</h3>
      <p className="text-white/70 text-xs leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500">{description}</p>
    </div>
  </div>
);

/* ── contact form ── */
const MiniContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = async e => {
    e.preventDefault(); setLoading(true);
    await new Promise(r => setTimeout(r, 1100));
    setLoading(false); setSent(true);
  };
  if (sent) return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
        <span className="material-symbols-outlined text-emerald-500 text-4xl">check_circle</span>
      </div>
      <h4 className="font-black text-slate-800 text-lg">Thank you!</h4>
      <p className="text-slate-500 text-sm">We'll get back to you within 24 hours.</p>
    </div>
  );
  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">person</span>
          <input name="name" required value={form.name} onChange={handle} placeholder="Your Name" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white placeholder:text-slate-300" />
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">mail</span>
          <input name="email" type="email" required value={form.email} onChange={handle} placeholder="Your Email" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white placeholder:text-slate-300" />
        </div>
      </div>
      <textarea name="message" required rows={4} value={form.message} onChange={handle} placeholder="Tell us about your dream India trip..." className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white placeholder:text-slate-300 resize-none" />
      <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-black rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 text-sm uppercase tracking-wide disabled:opacity-70">
        {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span className="material-symbols-outlined text-[18px]">send</span> Send Message</>}
      </button>
    </form>
  );
};

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
const AboutUsPage = () => {
  const [statsRef, statsInView] = useInView();
  const [activeRegion, setActiveRegion] = useState(0);

  const regions = [
    {
      name: 'The Himalayas',
      tagline: 'Soul of the Mountains',
      icon: '🏔️',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      description: 'Find peace in the eternal silence of the Himalayas — where misty peaks touch the sky, ancient forests echo with birdsong, and crystal-clear rivers rush through hidden valleys. The Himalayas are a global destination for inner strength: home to centuries-old ashrams and world-renowned yoga and meditation centres that draw seekers from every continent. Come close to nature, breathe the purest air on Earth, and rediscover yourself.',
    },
    {
      name: 'Jammu & Kashmir',
      tagline: 'Crown of India',
      icon: '❄️',
      image: '/kashmir-snow-mountains.png',
      description: 'Kashmir — the Crown of India — is a land of breathtaking snowfall, pristine Dal Lake, and heart-stirring adventure. From the holy pilgrimage of Amarnath Yatra, where Lord Shiva\'s ice lingam stands naturally formed in a cave at 13,000 ft, to the divine blessings of Mata Vaishno Devi, this land is as spiritual as it is spectacular. Ski the slopes of Gulmarg, glide on a shikara across Dal Lake at sunrise, or simply marvel at a sunset over Pir Panjal.',
    },
    {
      name: 'Himachal Pradesh',
      tagline: 'Dev Bhoomi — Land of Gods',
      icon: '🌲',
      image: '/shimla-ridge.png',
      description: '"Dev Bhoomi" — sacred land of the gods — derives its very name from Raja Himachal, the father of Goddess Parvati and in-law of Bhagwan Shiva. Manali\'s snow-capped passes, Shimla\'s colonial charm, Kullu\'s golden valley, the Tibetan tranquillity of Dharamshala and McLeod Ganj — every town here has a story. Rooftop monasteries, apple orchards in bloom, and pine forests stretching to the horizon await you.',
    },
    {
      name: 'Punjab — Land of Five Rivers',
      tagline: 'Heartbeat of Bharat',
      icon: '🌾',
      image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800&q=80',
      description: 'Punjab — the land of five rivers — has the power to feed an entire nation. Golden wheat fields sway in the wind, painted tractors hum across the fertile earth, and the aroma of fresh langar drifts from every gurdwara. The people of Punjab are known worldwide for their generosity, simple living, and high thinking. No guest leaves Punjab hungry, and no visitor leaves untouched by the warmth of its people.',
    },
    {
      name: 'Delhi, Haryana & Rajasthan',
      tagline: 'Land of Rajputana Warriors',
      icon: '🏰',
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
      description: 'From the bustling lanes of Old Delhi to the royal grandeur of Jaipur\'s Amber Fort, from the sand dunes of Jaisalmer to the temples of Pushkar — this belt of India carries the warrior spirit of the Rajputs. The Taj Mahal glows at dawn in Agra. Haryana\'s ancient Kurukshetra echoes with the Mahabharata. Each city tells the story of courage, culture, and legacy.',
    },
    {
      name: 'Gujarat & Maharashtra',
      tagline: 'Land of the Marathas',
      icon: '🦚',
      image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80',
      description: 'The Rann of Kutch transforms into a silver mirror under the full moon during the famous Rann Utsav. Somnath and Dwarka hold the spiritual heritage of Lord Krishna. Maharashtra\'s Mumbai never sleeps; Ajanta and Ellora caves are UNESCO wonders carved by human hands and divine inspiration. Ganesha Chaturthi, Gudi Padwa, and the Ganpati processions of Pune fill the air with joy and colour.',
    },
    {
      name: 'Madhya Pradesh & Uttar Pradesh',
      tagline: 'Heart of Bharat',
      icon: '🪔',
      image: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&q=80',
      description: 'Mathura and Vrindavan are the birthplace and playground of Lord Krishna — every lane sings of divine love. Ayodhya, the birthplace of Lord Ram, now shines with the magnificent Ram Mandir. Kashi Vishwanath and the ghats of Varanasi offer moksha at the banks of the Ganga. The Kumbh and Mahakumbh at Prayagraj are the world\'s largest human gatherings — a spectacle of faith, devotion, and unity.',
    },
    {
      name: 'South & Northeast India',
      tagline: 'Diversity in Every Step',
      icon: '🌴',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
      description: 'Kerala\'s backwaters, Tamil Nadu\'s temple towers, Karnataka\'s Hampi ruins, Andhra\'s spice trails — each southern state has its own language, cuisine, classical dance form, and centuries of wisdom. The Northeast is India\'s hidden jewel: Meghalaya\'s living root bridges, Nagaland\'s Hornbill Festival, Assam\'s Kaziranga. Every state holds its own dignity and history, equally important to the mosaic that is India.',
    },
  ];

  const festivals = ['Holi', 'Diwali', 'Kumbh & Mahakumbh', 'Ganesh Chaturthi', 'Gudi Padwa', 'Baisakhi', 'Hornbill Festival', 'Rann Utsav', 'Eid', 'Christmas'];
  const services = [
    { icon: 'hotel', label: 'Hotel Bookings', desc: 'Premium stays from budget to luxury via our verified hotel network' },
    { icon: 'flight', label: 'Flight Tickets', desc: 'Domestic & international flights at minimal service charges' },
    { icon: 'train', label: 'Train Bookings', desc: 'Tatkal and advance reservations across all Indian Railways routes' },
    { icon: 'directions_car', label: 'Cab Services', desc: 'Comfortable, safe cabs for pick-ups, drops, and full-day hire' },
    { icon: 'tour', label: 'Guided Tours', desc: 'Expert-curated inbound & international tour packages' },
    { icon: 'backpack', label: 'Custom Packages', desc: 'Tailor-made itineraries built around your dates, budget & interests' },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] overflow-x-hidden relative">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />


      {/* ════ HERO ════ */}
      <section className="relative h-[90vh] min-h-[560px] flex items-end overflow-hidden">
        {/* Full bleed background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1800&q=85"
            alt="Incredible India"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/20" />
        </div>

        {/* Floating badge */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full">
          <span className="text-orange-400 text-base">🇮🇳</span>
          <p className="text-white text-xs font-black uppercase tracking-widest">The Beautiful India · Bharat Darshan</p>
        </div>

        {/* Hero text */}
        <div className="relative z-10 px-4 md:px-10 lg:px-40 pb-16 md:pb-24 max-w-5xl">
          <p className="text-primary font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-primary inline-block" /> Est. from Destiny Tours &amp; Travels · 14+ Years of Excellence
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6">
            Discover the Soul<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">of Incredible India</span>
          </h1>
          <p className="text-white/75 text-lg md:text-xl max-w-2xl leading-relaxed">
            From the snow-kissed peaks of Kashmir to the sun-drenched beaches of Kerala — we are your trusted guide to every wonder of <strong className="text-white">Bharat Darshan</strong>.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link to="/tours" className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-black rounded-xl text-sm uppercase tracking-wide hover:bg-primary/90 active:scale-95 transition-all shadow-xl shadow-primary/30">
              <span className="material-symbols-outlined text-[18px]">explore</span> Explore Tours
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur-sm text-white border border-white/30 font-black rounded-xl text-sm uppercase tracking-wide hover:bg-white/20 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-[18px]">chat</span> Talk to an Expert
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 right-8 flex flex-col items-center gap-1 text-white/40">
          <span className="material-symbols-outlined text-[20px] animate-bounce">keyboard_arrow_down</span>
          <p className="text-[9px] font-black uppercase tracking-widest">Scroll</p>
        </div>
      </section>

      {/* ════ STATS RIBBON ════ */}
      <section ref={statsRef} className="bg-white border-b border-slate-100 shadow-sm">
        <div className="px-4 md:px-10 lg:px-40 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x divide-slate-100">
            <StatCard value={14} suffix="+" label="Years of Experience" icon="workspace_premium" inView={statsInView} />
            <StatCard value={5000} suffix="+" label="Happy Travellers" icon="favorite" inView={statsInView} />
            <StatCard value={200} suffix="+" label="Hotel Tie-ups" icon="hotel" inView={statsInView} />
            <StatCard value={50} suffix="+" label="Destinations Covered" icon="location_on" inView={statsInView} />
          </div>
        </div>
      </section>

      {/* ════ OUR STORY ════ */}
      <section className="px-4 md:px-10 lg:px-40 py-20 md:py-28 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Images mosaic */}
          <div className="grid grid-cols-2 gap-3 h-[480px]">
            <img src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=500&q=80" alt="Kashmir" className="rounded-3xl object-cover w-full h-full" />
            <div className="flex flex-col gap-3">
              <img src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80" alt="Kerala" className="rounded-3xl object-cover w-full flex-1" />
              <img src="https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?auto=format&fit=crop&w=400&q=80" alt="Punjab" className="rounded-3xl object-cover w-full flex-1" />
            </div>
          </div>

          {/* Right: Story */}
          <div>
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-5">
              <span className="material-symbols-outlined text-[14px]">history</span> Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight mb-5">
              From <span className="text-primary">Destiny Tours</span> to<br />The Beautiful India
            </h2>
            <div className="flex flex-col gap-4 text-slate-600 leading-relaxed text-sm">
              <p>
                More than <strong>14 years ago</strong>, we took our first steps in the travel and hotel industry under the name <strong>Destiny Tours and Travels</strong>. Over the years, we organised hundreds of inbound and international tours, built a wide network of hotel partners and transport operators, and most importantly — earned the trust of thousands of guests who experienced India through our eyes.
              </p>
              <p>
                Today, we are reborn as <strong className="text-slate-800">The Beautiful India — Bharat Darshan</strong>. The new name reflects a deeper purpose: to share not just a destination, but the soul of this extraordinary country. Every state, every culture, every festival, every language — all woven together into one <em>beautiful</em> tapestry.
              </p>
              <p>
                Our extensive tie-ups with hotels, airlines, railways, and cab operators allow us to craft packages that are <strong>precisely tailored</strong> to your needs — whether that's a complete tour, or individual bookings for rooms, flights, trains, or cabs. And we do it all with <strong>minimal service charges</strong>, because your trust is our greatest asset.
              </p>
            </div>

            {/* Trust pillars */}
            <div className="grid grid-cols-2 gap-3 mt-8">
              {[
                { icon: 'handshake', label: '200+ Hotel Tie-ups', desc: 'Budget to luxury, across all of India' },
                { icon: 'currency_rupee', label: 'Minimal Charges', desc: 'Transparent, honest pricing always' },
                { icon: 'verified', label: 'Verified Partners', desc: 'Only trusted transport & hotel partners' },
                { icon: 'support_agent', label: '24×7 Expert Support', desc: 'Our team is always a call away' },
              ].map((p, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl p-4 flex gap-3 items-start border border-slate-100">
                  <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">{p.icon}</span>
                  <div>
                    <p className="font-black text-slate-800 text-xs">{p.label}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ BHARAT DARSHAN — INDIA INTRO ════ */}
      <section className="relative py-20 md:py-28 overflow-hidden">

        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1600&q=80" alt="India map" className="w-full h-full object-cover opacity-[0.15]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fafaf9] via-white/80 to-[#fafaf9]" />

        </div>
        <div className="relative px-4 md:px-10 lg:px-40">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 border border-orange-100 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-5">
              🇮🇳 Bharat Darshan
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight mb-5">
              One Country,<br /><span className="text-primary">Infinite Wonders</span>
            </h2>
            <p className="text-slate-500 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
              India stretches from the icy northern peaks to the tropical southern shores, from the golden western deserts to the misty northeastern forests. Every season here unveils a different facet of the same reality — a land of <strong className="text-slate-700">diverse cultures, hundreds of languages, thousands of festivals, and one beating heart</strong>. All states, all religions, all people — equally important, equally beautiful. This unity in diversity is the very soul of <em>The Beautiful India</em>.
            </p>
          </div>

          {/* Region cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {regions.slice(0, 4).map((r, i) => <RegionCard key={i} {...r} />)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
            {regions.slice(4).map((r, i) => <RegionCard key={i} {...r} />)}
          </div>
        </div>
      </section>

      {/* ════ FESTIVALS ════ */}
      <section className="bg-slate-900 py-16 overflow-hidden relative">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #006D77 0%, transparent 60%), radial-gradient(circle at 80% 20%, #e83e4a 0%, transparent 60%)' }} />
        <div className="relative px-4 md:px-10 lg:px-40">
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">🎊 Experience Vibrant India</h2>
            <p className="text-slate-400 text-sm mb-1">Join us for the festivals that make India come alive</p>
            <Link to="/festivals" className="inline-flex items-center gap-1.5 text-primary text-xs font-black uppercase tracking-widest hover:underline mt-2">
              <span className="material-symbols-outlined text-[14px]">open_in_new</span> View all festival guides
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              { name: 'Holi', id: 'holi', emoji: '🎨' },
              { name: 'Diwali', id: 'diwali', emoji: '🪔' },
              { name: 'Kumbh & Mahakumbh', id: 'kumbh-mahakumbh', emoji: '🕉️' },
              { name: 'Ganesh Chaturthi', id: 'ganesh-chaturthi', emoji: '🐘' },
              { name: 'Gudi Padwa', id: 'gudi-padwa', emoji: '🏮' },
              { name: 'Baisakhi', id: 'baisakhi', emoji: '🌾' },
              { name: 'Hornbill Festival', id: 'hornbill-festival', emoji: '🦜' },
              { name: 'Rann Utsav', id: 'rann-utsav', emoji: '🌕' },
              { name: 'Eid', id: 'eid', emoji: '🌙' },
              { name: 'Christmas', id: 'christmas', emoji: '🎄' },
            ].map((f, i) => (
              <Link
                key={i}
                to={`/festivals#${f.id}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black border border-white/10 text-white/80 hover:text-white hover:scale-105 hover:border-white/30 transition-all"
                style={{ backgroundColor: `hsl(${i * 36}, 40%, 20%)` }}
              >
                <span>{f.emoji}</span> {f.name}
                <span className="material-symbols-outlined text-[12px] opacity-50">arrow_forward</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════ SERVICES ════ */}
      <section className="px-4 md:px-10 lg:px-40 py-20 md:py-28 bg-slate-50">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-5">
            <span className="material-symbols-outlined text-[14px]">star</span> What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800">Everything You Need,<br />All in One Place</h2>
          <p className="text-slate-500 mt-3 text-base max-w-xl mx-auto">Our hotel and transport network lets us deliver individual services or full packages — always at minimal service charges.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <div key={i} className="group bg-white rounded-3xl p-7 border border-slate-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 group-hover:bg-primary transition-colors rounded-2xl flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-[24px] transition-colors">{s.icon}</span>
              </div>
              <h3 className="font-black text-slate-800 text-base mb-2">{s.label}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════ MISSION & VISION ════ */}
      <section className="px-4 md:px-10 lg:px-40 py-20 md:py-28">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-5">
            <span className="material-symbols-outlined text-[14px]">flag</span> Purpose &amp; Direction
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800">Our Mission &amp; Vision</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80" alt="Mission" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/95 to-primary/80" />
            </div>
            <div className="relative p-10 text-white">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-white text-3xl">rocket_launch</span>
              </div>
              <h3 className="text-2xl font-black mb-4">Our Mission</h3>
              <p className="text-white/85 leading-relaxed text-sm mb-5">
                To provide every guest with an <strong className="text-white">authentic experience of rich, real India</strong>. Wherever you travel with us, you will feel the warmth of genuine Indian hospitality — from the first namaste to the final farewell.
              </p>
              <p className="text-white/85 leading-relaxed text-sm mb-5">
                We want you to witness India <em>alive</em> — its colours in Holi, its lights in Diwali, its devotion at Kumbh, its music at Rann Utsav, its harvest spirit in Baisakhi, the tribal richness of Hornbill, and the community warmth of Gudi Padwa and Ganesh Pujan.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['Authenticity', 'Hospitality', 'Cultural Depth', 'Personalisation'].map(t => (
                  <span key={t} className="px-3 py-1 bg-white/20 rounded-full text-[11px] font-black uppercase tracking-wide">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80" alt="Vision" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 to-slate-900/80" />
            </div>
            <div className="relative p-10 text-white">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-white text-3xl">visibility</span>
              </div>
              <h3 className="text-2xl font-black mb-4">Our Vision</h3>
              <p className="text-white/85 leading-relaxed text-sm mb-4">
                <strong className="text-white">India's vision is our vision.</strong> We are aligned with the national dream of <em>Viksit Bharat 2047</em> — a developed, confident India standing tall on the world stage.
              </p>
              <p className="text-white/85 leading-relaxed text-sm mb-5">
                Every tour we organise contributes to <strong className="text-white">employment generation</strong> across local communities. We are committed to <em>Swachh Bharat</em>, reducing our carbon footprint, and embracing modern technologies — including AI — to deliver smarter, greener, more personalised travel experiences.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { icon: 'work', label: 'Employment' },
                  { icon: 'clean_hands', label: 'Swachh Bharat' },
                  { icon: 'psychology', label: 'AI-Powered' },
                ].map(v => (
                  <div key={v.label} className="bg-white/10 rounded-2xl p-3 flex flex-col items-center gap-1 text-center">
                    <span className="material-symbols-outlined text-white/80 text-[20px]">{v.icon}</span>
                    <p className="text-[10px] font-black uppercase tracking-wide text-white/70">{v.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ TEAM ════ */}
      <section className="px-4 md:px-10 lg:px-40 py-20 bg-slate-50">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-5">
            <span className="material-symbols-outlined text-[14px]">group</span> Meet the Experts
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800">Your Travel Dream Team</h2>
          <p className="text-slate-500 mt-3 text-sm max-w-2xl mx-auto">
            Given India's vast geography and seasonal diversity, our expert team is here to guide you with the best places, routes, timing, and seasons — personalised just for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { name: 'Raman Singh', role: 'Managing Director', img: 'https://api.dicebear.com/7.x/avataaars/png?seed=Raman&mouth=smile&eyes=default&clothing=blazerAndShirt&skinColor=edb98a&backgroundColor=b6e3f4', expertise: 'North India & Himalayas' },
            { name: 'Priya Sharma', role: 'Senior Travel Consultant', img: 'https://api.dicebear.com/7.x/avataaars/png?seed=Priya&top=straight02&hairColor=2c1b18&mouth=smile&eyes=default&clothing=blazerAndShirt&skinColor=edb98a&accessoriesProbability=0&facialHairProbability=0&backgroundColor=ffdfbf', expertise: 'South India & Kerala' },
            { name: 'Arjun Singh Randhawa', role: 'Tour Operations Head', img: 'https://api.dicebear.com/7.x/avataaars/png?seed=Arjun&top=turban&facialHair=beardMajestic&facialHairProbability=100&mouth=smile&eyes=default&clothing=blazerAndShirt&skinColor=edb98a&backgroundColor=d1d5db', expertise: 'Rajasthan & Desert Routes' },
            { name: 'Kavita Singh', role: 'Customer Experience Lead', img: 'https://api.dicebear.com/7.x/avataaars/png?seed=Kavita&top=bigHair&hairColor=2c1b18&mouth=smile&eyes=default&clothing=blazerAndShirt&skinColor=edb98a&accessoriesProbability=0&facialHairProbability=0&backgroundColor=c0aede', expertise: 'Spiritual & Heritage Tours' },
          ].map((m, i) => (
            <div key={i} className="bg-white rounded-3xl p-7 border border-slate-100 hover:shadow-xl transition-all duration-300 text-center group">
              <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 border-4 border-primary/10 group-hover:border-primary/30 transition-colors">
                <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="font-black text-slate-800 text-sm">{m.name}</h4>
              <p className="text-primary text-[11px] font-bold uppercase tracking-wider mt-0.5">{m.role}</p>
              <div className="mt-3 flex items-center justify-center gap-1.5 bg-slate-50 rounded-xl px-3 py-1.5">
                <span className="material-symbols-outlined text-[12px] text-slate-400">location_on</span>
                <p className="text-[10px] text-slate-500 font-semibold">{m.expertise}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Signature / MD Note ── */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-100 p-8 md:p-12 shadow-sm">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-primary/10 shrink-0">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Raman&backgroundColor=b6e3f4" alt="Raman Singh" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <span className="text-primary text-4xl font-black leading-none select-none">"</span>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed tracking-wide italic mt-1">
                India is not just a place — it is a feeling. When you stand at the ghats of Varanasi at dawn, or watch the sun set behind Dal Lake in Kashmir, or feel the silence of a Himalayan forest — you understand why we call it <strong>The Beautiful India</strong>. Our team of seasoned travellers and planners is here, every step of the way, to make sure <em>your</em> India story is unforgettable. Thank you for trusting us with your journey.
              </p>

              {/* Signature visual */}
              <div className="mt-5 flex items-center gap-5">
                <div>
                  {/* Signature styled with Caveat font */}
                  <p className="text-4xl text-primary mb-1 select-none" style={{ fontFamily: "'Caveat', cursive" }}>Raman Singh</p>
                  <p className="font-black text-slate-800 text-sm">Raman Singh</p>
                  <p className="text-primary text-[11px] font-bold uppercase tracking-widest">Managing Director, The Beautiful India</p>
                </div>
                <div className="hidden md:flex flex-col items-center gap-1 ml-auto bg-primary/5 border border-primary/10 rounded-2xl px-5 py-3">
                  <span className="material-symbols-outlined text-primary text-2xl">favorite</span>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest text-center">Made with love<br />for Bharat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ CONTACT / CTA ════ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1600&q=80" alt="Travel CTA" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60" />
        </div>
        <div className="relative px-4 md:px-10 lg:px-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            {/* Left: CTA text */}
            <div className="text-white">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                <span className="material-symbols-outlined text-[14px]">waving_hand</span> Let's Connect
              </span>
              <h2 className="text-3xl md:text-5xl font-black leading-tight mb-6">
                Your India<br />Awaits You 🇮🇳
              </h2>
              <p className="text-white/75 text-base leading-relaxed mb-8">
                Whether you want to plan a complete tour package, book a hotel room, or simply ask our experts which season to visit Ladakh — we are here, anytime you need us.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: 'call', label: '+916005159433', sub: 'Mon–Sat, 9 AM – 7 PM IST' },
                  { icon: 'mail', label: 'customercare@beautifulindia.com', sub: 'Reply within 24 hours' },
                  { icon: 'location_on', label: 'New Delhi, India', sub: '123 India Gate Road, 110001' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-[20px]">{c.icon}</span>
                    </div>
                    <div>
                      <p className="font-black text-white text-sm">{c.label}</p>
                      <p className="text-white/50 text-xs">{c.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <h3 className="font-black text-slate-800 text-xl mb-1">Plan Your Trip</h3>
              <p className="text-slate-400 text-sm mb-6">Fill in your details and we'll reach out within 24 hours.</p>
              <MiniContactForm />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUsPage;
