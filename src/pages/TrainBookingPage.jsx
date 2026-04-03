import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { sortedCodes } from '../data/countryCodes';

const TrainBookingPage = () => {
  const navigate = useNavigate();
  const [bookingType, setBookingType] = useState('individual'); // 'individual' or 'group'
  const [journeyDetails, setJourneyDetails] = useState({
    date: '',
    fromStation: '',
    toStation: '',
    trainPref: '',
    coachPref: '',
    seatPref: '',
    timePref: ''
  });

  const [hasOnwardJourney, setHasOnwardJourney] = useState(false);
  const [onwardDetails, setOnwardDetails] = useState({
    date: '',
    fromStation: '',
    toStation: '',
    trainPref: '',
    coachPref: '',
    seatPref: '',
    timePref: ''
  });
  
  const [passengers, setPassengers] = useState([
    { 
      firstName: '', lastName: '', age: '', idType: '', idNumber: '', foodPref: '', nationality: 'Indian', passport: '', 
      mobile: '', countryCode: '+91', email: '', whatsappConsent: false 
    }
  ]);
  
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  const maxPassengers = bookingType === 'individual' ? 6 : 10;

  const handleBookingTypeChange = (type) => {
    setBookingType(type);
    // Trim passengers if switching from group to individual and count > 6
    if (type === 'individual' && passengers.length > 6) {
      setPassengers(passengers.slice(0, 6));
    }
  };

  const handleJourneyChange = (type, field, value) => {
    if (type === 'onward') {
      setOnwardDetails(prev => ({ ...prev, [field]: value }));
    } else {
      setJourneyDetails(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  };

  const addPassenger = () => {
    if (passengers.length < maxPassengers) {
      setPassengers([...passengers, { firstName: '', lastName: '', age: '', idType: '', idNumber: '', foodPref: '', nationality: 'Indian', passport: '' }]);
    }
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!declarationAccepted) {
      alert("Please accept the declaration to proceed.");
      return;
    }

    const payload = {
      bookingType,
      journeyDetails,
      hasOnwardJourney,
      onwardDetails,
      passengers,
      timestamp: new Date().toISOString(),
      status: 'New'
    };

    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/train-queries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        alert("Booking request submitted successfully! Our team will contact you shortly.");
        navigate('/booking/train-success', { state: { query: data.query || payload } });
      } else {
        throw new Error('Failed to save booking request');
      }
    } catch (error) {
      console.error("Submission error details:", error);
      alert("There was an error submitting your request. Please try again or contact us directly.");
    }
  };

  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Service",
    "name": "Train Ticket Booking Service",
    "provider": {
      "@type": "Organization",
      "name": "The Beautiful India - Bharat Darshan",
      "url": "https://bhaktikishakti.com"
    },
    "description": "Professional IRCTC train ticket booking service for individuals and groups. Transparent service fees and reliable support.",
    "areaServed": "IN",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Train Booking Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Individual Train Booking (Max 6 Passengers)"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Group Train Booking (Max 10 Passengers)"
          }
        }
      ]
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 md:px-10 font-sans text-slate-900 transition-colors duration-300">
      <Helmet>
        <title>Train Ticket Booking | Fast & Reliable IRCTC Services - Beautiful India</title>
        <meta name="description" content="Book IRCTC train tickets across India with ease. Individual and group bookings available with transparent service fees and 24/7 support. Secure your journey today with Bharat Darshan." />
        <meta name="keywords" content="train ticket booking, IRCTC booking service, individual train booking, group train tickets India, Bharat Darshan train query, Indian Railways booking agency" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bhaktikishakti.com/booking/train" />
        <meta property="og:title" content="Train Ticket Booking | Reliable IRCTC Services in India" />
        <meta property="og:description" content="Hassle-free train ticket bookings for individuals and groups. Transparent pricing and expert support for your Indian railway journey." />
        <meta property="og:image" content="https://bhaktikishakti.com/assets/train-banner.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://bhaktikishakti.com/booking/train" />
        <meta property="twitter:title" content="Train Ticket Booking | Beautiful India" />
        <meta property="twitter:description" content="Book your train tickets with The Beautiful India. Fast, reliable, and transparent IRCTC booking services." />

        {/* Schema Markup */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-[#006D77] dark:text-teal-400 mb-3 tracking-tight">
            IRCTC Train Ticket Booking
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Please provide accurate passenger details as per official government IDs for seamless ticket issuance and a hassle-free journey.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800 transition-all duration-500">
          
          {/* Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800/50 p-2 m-4 md:m-8 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => handleBookingTypeChange('individual')}
              className={`flex-1 py-4 text-sm font-bold rounded-xl transition-all duration-300 ${bookingType === 'individual' ? 'bg-[#006D77] text-white shadow-lg shadow-[#006D77]/20 scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              Individual <span className="text-[10px] block opacity-80">(Max 6 Passengers)</span>
            </button>
            <button 
              onClick={() => handleBookingTypeChange('group')}
              className={`flex-1 py-4 text-sm font-bold rounded-xl transition-all duration-300 ${bookingType === 'group' ? 'bg-[#006D77] text-white shadow-lg shadow-[#006D77]/20 scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              Group <span className="text-[10px] block opacity-80">(Max 10 Passengers)</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-12">
            
            {/* Section 1: Journey Details */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="material-symbols-outlined text-[#006D77] dark:text-teal-400">train</span>
                General Journey Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Date of Journey <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    required
                    value={journeyDetails.date}
                    onChange={(e) => handleJourneyChange('outward', 'date', e.target.value)}
                    className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-[#006D77] dark:focus:border-teal-400 focus:ring-1 focus:ring-[#006D77] outline-none transition-all font-medium shadow-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Travel From <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="Departure Station"
                    value={journeyDetails.fromStation}
                    onChange={(e) => handleJourneyChange('outward', 'fromStation', e.target.value)}
                    className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-[#006D77] dark:focus:border-teal-400 focus:ring-1 focus:ring-[#006D77] outline-none transition-all font-medium shadow-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Travel To <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="Destination Station"
                    value={journeyDetails.toStation}
                    onChange={(e) => handleJourneyChange('outward', 'toStation', e.target.value)}
                    className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-[#006D77] dark:focus:border-teal-400 focus:ring-1 focus:ring-[#006D77] outline-none transition-all font-medium shadow-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Train Preference / Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 12001, Rajdhani"
                    value={journeyDetails.trainPref}
                    onChange={(e) => handleJourneyChange('outward', 'trainPref', e.target.value)}
                    className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-[#006D77] dark:focus:border-teal-400 focus:ring-1 focus:ring-[#006D77] outline-none transition-all font-medium shadow-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Coach Preference <span className="text-red-500">*</span></label>
                  <select 
                    required
                    value={journeyDetails.coachPref}
                    onChange={(e) => handleJourneyChange('outward', 'coachPref', e.target.value)}
                    className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-[#006D77] dark:focus:border-teal-400 focus:ring-1 focus:ring-[#006D77] outline-none transition-all font-medium shadow-sm"
                  >
                    <option value="">Select Coach</option>
                    <option value="Sleeper">Sleeper (SL)</option>
                    <option value="3rd AC">3rd AC (3A)</option>
                    <option value="2nd AC">2nd AC (2A)</option>
                    <option value="First Class">First Class (1A)</option>
                    <option value="Executive Class">Executive Class (EC)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Seat Preference</label>
                  <select 
                    value={journeyDetails.seatPref}
                    onChange={(e) => handleJourneyChange('outward', 'seatPref', e.target.value)}
                    className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-[#006D77] dark:focus:border-teal-400 focus:ring-1 focus:ring-[#006D77] outline-none transition-all font-medium shadow-sm"
                  >
                    <option value="">No Preference</option>
                    <option value="lower">Lower Berth</option>
                    <option value="middle">Middle Berth</option>
                    <option value="upper">Upper Berth</option>
                    <option value="side_lower">Side Lower</option>
                    <option value="side_upper">Side Upper</option>
                    <option value="window">Window Seat (CC)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Time Preference</label>
                  <select 
                    value={journeyDetails.timePref}
                    onChange={(e) => handleJourneyChange('outward', 'timePref', e.target.value)}
                    className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-[#006D77] dark:focus:border-teal-400 focus:ring-1 focus:ring-[#006D77] outline-none transition-all font-medium shadow-sm"
                  >
                    <option value="">Any Time</option>
                    <option value="morning">Morning (6 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                    <option value="evening">Evening (6 PM - 12 AM)</option>
                    <option value="night">Night (12 AM - 6 AM)</option>
                  </select>
                </div>
              </div>

              {/* Onward Journey Toggle */}
              <div className="mt-8 flex items-center gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 w-fit transition-all hover:bg-slate-100 dark:hover:bg-slate-800/60 shadow-sm">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      checked={hasOnwardJourney}
                      onChange={(e) => setHasOnwardJourney(e.target.checked)}
                      className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-200 dark:border-slate-700 transition-all checked:border-[#006D77] checked:bg-[#006D77] dark:checked:border-teal-400 dark:checked:bg-teal-400"
                    />
                    <span className="material-symbols-outlined absolute left-0 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none text-base w-full text-center font-bold">check</span>
                  </div>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Add Same Details for Onward Journey / Return Trip</span>
                </label>
              </div>

              {/* Section 1.5: Onward Journey Details */}
              {hasOnwardJourney && (
                <div className="mt-10 pt-8 border-t-2 border-dashed border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
                  <h3 className="text-sm font-black text-[#006D77] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">forward</span>
                    Onward / Return Journey Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Date of Journey <span className="text-red-500">*</span></label>
                      <input 
                        type="date" required
                        value={onwardDetails.date}
                        onChange={(e) => handleJourneyChange('onward', 'date', e.target.value)}
                        className="h-12 px-4 rounded-xl border border-slate-200 focus:border-[#006D77] focus:ring-1 focus:ring-[#006D77] outline-none transition-all font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Travel From <span className="text-red-500">*</span></label>
                      <input 
                        type="text" required
                        placeholder="Departure Station"
                        value={onwardDetails.fromStation}
                        onChange={(e) => handleJourneyChange('onward', 'fromStation', e.target.value)}
                        className="h-12 px-4 rounded-xl border border-slate-200 focus:border-[#006D77] focus:ring-1 focus:ring-[#006D77] outline-none transition-all font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Travel To <span className="text-red-500">*</span></label>
                      <input 
                        type="text" required
                        placeholder="Destination Station"
                        value={onwardDetails.toStation}
                        onChange={(e) => handleJourneyChange('onward', 'toStation', e.target.value)}
                        className="h-12 px-4 rounded-xl border border-slate-200 focus:border-[#006D77] focus:ring-1 focus:ring-[#006D77] outline-none transition-all font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Train Preference / Number</label>
                      <input 
                        type="text" placeholder="e.g. 12002, Rajdhani"
                        value={onwardDetails.trainPref}
                        onChange={(e) => handleJourneyChange('onward', 'trainPref', e.target.value)}
                        className="h-12 px-4 rounded-xl border border-slate-200 focus:border-[#006D77] focus:ring-1 focus:ring-[#006D77] outline-none transition-all font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Coach Preference <span className="text-red-500">*</span></label>
                      <select 
                        required
                        value={onwardDetails.coachPref}
                        onChange={(e) => handleJourneyChange('onward', 'coachPref', e.target.value)}
                        className="h-12 px-4 rounded-xl border border-slate-200 focus:border-[#006D77] focus:ring-1 focus:ring-[#006D77] outline-none transition-all font-medium bg-white"
                      >
                        <option value="">Select Coach</option>
                        <option value="Sleeper">Sleeper (SL)</option>
                        <option value="3rd AC">3rd AC (3A)</option>
                        <option value="2nd AC">2nd AC (2A)</option>
                        <option value="First Class">First Class (1A)</option>
                        <option value="Executive Class">Executive Class (EC)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Seat Preference</label>
                      <select 
                        value={onwardDetails.seatPref}
                        onChange={(e) => handleJourneyChange('onward', 'seatPref', e.target.value)}
                        className="h-12 px-4 rounded-xl border border-slate-200 focus:border-[#006D77] focus:ring-1 focus:ring-[#006D77] outline-none transition-all font-medium bg-white"
                      >
                        <option value="">No Preference</option>
                        <option value="lower">Lower Berth</option>
                        <option value="middle">Middle Berth</option>
                        <option value="upper">Upper Berth</option>
                        <option value="side_lower">Side Lower</option>
                        <option value="side_upper">Side Upper</option>
                        <option value="window">Window Seat (CC)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Time Preference</label>
                      <select 
                        value={onwardDetails.timePref}
                        onChange={(e) => handleJourneyChange('onward', 'timePref', e.target.value)}
                        className="h-12 px-4 rounded-xl border border-slate-200 focus:border-[#006D77] focus:ring-1 focus:ring-[#006D77] outline-none transition-all font-medium bg-white"
                      >
                        <option value="">Any Time</option>
                        <option value="morning">Morning (6 AM - 12 PM)</option>
                        <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                        <option value="evening">Evening (6 PM - 12 AM)</option>
                        <option value="night">Night (12 AM - 6 AM)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Section 2: Passenger Details */}
            <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="flex items-center justify-between mb-8 pb-2 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <span className="material-symbols-outlined text-[#006D77] dark:text-teal-400">groups</span>
                  Passenger Details
                </h2>
                <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">{passengers.length} / {maxPassengers} Added</span>
              </div>

              <div className="space-y-8">
                {passengers.map((p, i) => (
                  <div key={i} className={`p-6 md:p-10 rounded-[2rem] border-2 transition-all duration-300 ${i === 0 ? 'border-[#006D77]/20 bg-[#006D77]/5 dark:bg-[#006D77]/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50'}`}>
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <span className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-lg transition-all ${i === 0 ? 'bg-[#006D77] text-white shadow-lg shadow-[#006D77]/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700'}`}>{i + 1}</span>
                        <div>
                          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{i === 0 ? 'Primary Guest (Passenger 1)' : `Passenger ${i + 1}`}</h3>
                          {i === 0 && <span className="text-[10px] text-[#006D77] dark:text-teal-400 font-bold uppercase tracking-[0.2em]">Main Contact for Ticket Delivery</span>}
                        </div>
                      </div>
                      {i > 0 && (
                        <button 
                          type="button"
                          onClick={() => removePassenger(i)} 
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-500 hover:text-white transition-all transform hover:rotate-90"
                          title="Remove Passenger"
                        >
                          <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">First Name <span className="text-red-500 font-black">*</span></label>
                        <input 
                          type="text" required
                          value={p.firstName} onChange={(e) => handlePassengerChange(i, 'firstName', e.target.value)}
                          className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-[#006D77] dark:focus:border-teal-400 transition-all text-sm font-semibold shadow-sm"
                          placeholder="e.g. John"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Last Name <span className="text-red-500 font-black">*</span></label>
                        <input 
                          type="text" required
                          value={p.lastName} onChange={(e) => handlePassengerChange(i, 'lastName', e.target.value)}
                          className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-[#006D77] dark:focus:border-teal-400 transition-all text-sm font-semibold shadow-sm"
                          placeholder="e.g. Doe"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Age <span className="text-red-500 font-black">*</span></label>
                        <input 
                          type="number" required min="1" max="120"
                          value={p.age} onChange={(e) => handlePassengerChange(i, 'age', e.target.value)}
                          className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-[#006D77] dark:focus:border-teal-400 transition-all text-sm font-semibold shadow-sm"
                          placeholder="Age"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">ID Type</label>
                        <select 
                          required
                          value={p.idType} onChange={(e) => handlePassengerChange(i, 'idType', e.target.value)}
                          className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-[#006D77] dark:focus:border-teal-400 transition-all text-sm font-semibold shadow-sm"
                        >
                          <option value="">Select ID Type</option>
                          <option value="aadhaar">Aadhaar Card</option>
                          <option value="pan">PAN Card</option>
                          <option value="passport">Passport</option>
                          <option value="voter">Voter ID</option>
                          <option value="dl">Driving License</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">ID Number</label>
                        <input 
                          type="text" required
                          value={p.idNumber} onChange={(e) => handlePassengerChange(i, 'idNumber', e.target.value)}
                          className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-[#006D77] dark:focus:border-teal-400 transition-all text-sm font-semibold shadow-sm"
                          placeholder="ID Card Number"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Food Preference <span className="text-red-500 font-black">*</span></label>
                        <select 
                          required
                          value={p.foodPref} onChange={(e) => handlePassengerChange(i, 'foodPref', e.target.value)}
                          className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-[#006D77] dark:focus:border-teal-400 transition-all text-sm font-semibold shadow-sm"
                        >
                          <option value="">Select Food</option>
                          <option value="no-food">No Food</option>
                          <option value="veg">Veg</option>
                          <option value="nonveg">Non-Veg</option>
                          <option value="jain">Jain</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Nationality <span className="text-red-500 font-black">*</span></label>
                        <input 
                          type="text" required
                          value={p.nationality} onChange={(e) => handlePassengerChange(i, 'nationality', e.target.value)}
                          className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-[#006D77] dark:focus:border-teal-400 transition-all text-sm font-semibold shadow-sm"
                          placeholder="e.g. Indian"
                        />
                      </div>
                        {(() => {
                          const isNonIndian = p.nationality && p.nationality.toLowerCase().trim() !== 'indian';
                          return (
                            <>
                              <label className={`text-[10px] font-bold uppercase tracking-widest ${isNonIndian ? 'text-orange-500 dark:text-orange-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                Passport Number {isNonIndian && <span className="text-red-500 font-black">*</span>}
                              </label>
                              <input 
                                type="text" required={isNonIndian}
                                value={p.passport} onChange={(e) => handlePassengerChange(i, 'passport', e.target.value)}
                                className={`h-12 px-4 rounded-xl border shadow-sm outline-none transition-all text-sm font-semibold ${isNonIndian ? 'border-orange-200 dark:border-orange-800/50 bg-orange-50/30 dark:bg-orange-950/20 text-orange-900 dark:text-orange-100' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100'}`}
                                placeholder="A00000000"
                              />
                            </>
                          );
                        })()}
                      </div>

                      {i === 0 && (
                        <>
                          <div className="flex flex-col gap-2 md:col-span-1 lg:col-span-2">
                            <label className="text-[10px] font-bold text-[#006D77] dark:text-teal-400 uppercase tracking-widest">Mobile Number (Primary) <span className="text-red-500">*</span></label>
                            <div className="relative flex flex-col sm:flex-row gap-3">
                              {/* Searchable Country Code Picker */}
                              <div className="relative group/cc w-full sm:w-auto">
                                <CountryCodeSelector 
                                  value={p.countryCode} 
                                  onChange={(val) => handlePassengerChange(i, 'countryCode', val)} 
                                />
                              </div>
                              <input 
                                type="tel" required
                                value={p.mobile} onChange={(e) => handlePassengerChange(i, 'mobile', e.target.value)}
                                className="flex-1 h-12 px-5 rounded-xl border border-[#006D77]/30 dark:border-teal-400/30 bg-white dark:bg-slate-800 outline-none focus:border-[#006D77] dark:focus:border-teal-400 transition-all text-base font-black text-[#006D77] dark:text-teal-300 placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm shadow-[#0a6c75]/5 w-full"
                                placeholder="XXXXX XXXXX"
                              />
                            </div>
                            
                            {/* WhatsApp Consent */}
                            <label className="flex items-center gap-2 mt-3 cursor-pointer group/wa">
                              <div className="relative flex items-center">
                                <input 
                                  type="checkbox" 
                                  checked={p.whatsappConsent}
                                  onChange={(e) => handlePassengerChange(i, 'whatsappConsent', e.target.checked)}
                                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 dark:border-slate-600 transition-all checked:border-[#25D366] checked:bg-[#25D366] dark:checked:border-green-400 dark:checked:bg-green-400"
                                />
                                <span className="material-symbols-outlined absolute left-0 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none text-xs w-full text-center font-bold">check</span>
                              </div>
                              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover/wa:text-[#25D366] dark:group-hover/wa:text-green-400 transition-colors">
                                we can contact you on whatsapp on given number
                              </span>
                            </label>
                          </div>
                          <div className="flex flex-col gap-2 md:col-span-1 lg:col-span-2">
                            <label className="text-[10px] font-bold text-[#006D77] dark:text-teal-400 uppercase tracking-widest">Email ID (For Ticket Delivery) <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#006D77]/50 dark:text-teal-400/50 text-xl pointer-events-none">mail</span>
                              <input 
                                type="email" required
                                value={p.email} onChange={(e) => handlePassengerChange(i, 'email', e.target.value)}
                                className="w-full h-12 pl-12 pr-5 rounded-xl border border-[#006D77]/30 dark:border-teal-400/30 bg-white dark:bg-slate-800 outline-none focus:border-[#006D77] dark:focus:border-teal-400 transition-all text-base font-black text-[#006D77] dark:text-teal-300 placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm shadow-[#0a6c75]/5"
                                placeholder="you@example.com"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

              {passengers.length < maxPassengers && (
                <button 
                  type="button"
                  onClick={addPassenger}
                  className="mt-8 flex items-center justify-center gap-2 w-full py-5 border-2 border-dashed border-slate-200 rounded-3xl text-slate-500 font-bold hover:border-[#006D77]/30 hover:text-[#006D77] hover:bg-slate-50 transition-all group"
                >
                  <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add_circle</span>
                  Add Another Passenger
                </button>
              )}
            </section>

            {/* Section 3: Declaration & Submit */}
            <section className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center">
              <label className="flex items-start gap-4 cursor-pointer mb-12 group max-w-2xl px-4 py-3 rounded-2xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="relative flex items-center mt-1">
                  <input 
                    type="checkbox" 
                    required
                    checked={declarationAccepted}
                    onChange={(e) => setDeclarationAccepted(e.target.checked)}
                    className="peer h-7 w-7 cursor-pointer appearance-none rounded-lg border-2 border-slate-200 dark:border-slate-700 transition-all checked:border-[#006D77] checked:bg-[#006D77] dark:checked:border-teal-400 dark:checked:bg-teal-400"
                  />
                  <span className="material-symbols-outlined absolute left-0 text-white dark:text-slate-900 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none text-xl w-full text-center font-black">check</span>
                </div>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-relaxed tracking-tight">
                  I declare that all the information provided related to the passengers is true and correct as per official documents. I understand that incorrect information may lead to boarding refusal.
                </span>
              </label>

              <button 
                type="submit"
                disabled={!declarationAccepted}
                className={`group relative w-full md:w-auto px-16 py-6 rounded-[2rem] font-black text-xl transition-all shadow-2xl transform active:scale-95 ${declarationAccepted ? 'bg-gradient-to-r from-[#006D77] to-[#0ea5e9] dark:from-teal-500 dark:to-blue-500 text-white hover:shadow-[#006D77]/40 scale-[1.05]' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'}`}
              >
                <div className="flex items-center justify-center gap-3">
                  <span>Request Booking Now</span>
                  <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </div>
              </button>
            </section>
          </form>

          {/* Important Terms & Policies Section */}
          <div className="p-8 md:p-12 bg-slate-900 border-t border-slate-800 dark:border-slate-700 text-white pb-16">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-teal-400">verified_user</span>
              Important Terms & Policies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {[
                { icon: 'payments', text: 'Full advance payment is required to issue the train tickets.' },
                { icon: 'trending_up', text: 'Fare prices for most trains in India are dynamic. The final price charged will be the actual fare applicable at the time of ticket issuance.' },
                { icon: 'info', text: "Our agency, 'The Beautiful India - Bharat Darshan', does not hide markup inside the ticket fare. We charge a flat, transparent service fee of INR 200 + 18% GST per person, per sector / per journey." },
                { icon: 'schedule', text: 'We do not accept last-minute cancellations or amendments outside of our official company office hours (Indian Standard Time).' },
                { icon: 'badge', text: 'Passengers must carry and show original proof of identity and age to the Train Ticket Examiner (TTE) during the journey, as per IRCTC rules.' },
                { icon: 'gavel', text: 'We strictly follow all rules and guidelines set by the IRCTC for travel agencies. Any changes after issuing the ticket are subject to availability and IRCTC ticket rules.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <span className="material-symbols-outlined text-teal-400 group-hover:scale-110 transition-transform text-xl shrink-0">{item.icon}</span>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium group-hover:text-white transition-colors">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="mt-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
          The Beautiful India - Official Booking Partner
        </div>

      </div>
    </main>
  );
};

/**
 * Searchable Country Code Selector Component
 */
const CountryCodeSelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  const selected = sortedCodes.find(c => c.code === value) || sortedCodes[0];

  const filtered = sortedCodes.filter(c => 
    c.country.toLowerCase().includes(search.toLowerCase()) || 
    c.code.includes(search)
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative h-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 px-4 rounded-xl border border-[#006D77]/30 dark:border-teal-400/30 bg-white dark:bg-slate-800 flex items-center gap-2 hover:border-[#006D77] dark:hover:border-teal-400 transition-all min-w-[100px] shadow-sm"
      >
        <span className="text-xl">{selected.flag}</span>
        <span className="text-sm font-bold text-[#006D77] dark:text-teal-400">{selected.code}</span>
        <span className={`material-symbols-outlined text-slate-400 text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-slate-50 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input 
                autoFocus
                type="text"
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-3 text-sm bg-slate-50 dark:bg-slate-800 rounded-lg border-none focus:ring-1 focus:ring-[#006D77]/20 dark:focus:ring-teal-400/20 outline-none text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto py-2">
            {filtered.length > 0 ? (
              filtered.map((c, idx) => (
                <button
                  key={`${c.code}-${idx}`}
                  type="button"
                  onClick={() => {
                    onChange(c.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left ${value === c.code ? 'bg-[#006D77]/5 dark:bg-teal-400/10' : ''}`}
                >
                  <span className="text-2xl">{c.flag ? c.flag : '🌐'}</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none mb-1">{c.country}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{c.code}</span>
                  </div>
                  {value === c.code && <span className="material-symbols-outlined text-[#006D77] dark:text-teal-400 text-sm ml-auto">check</span>}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-slate-400 text-xs italic">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainBookingPage;
