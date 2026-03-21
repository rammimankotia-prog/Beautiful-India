import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sortedCodes } from '../data/countryCodes';

const TrainBookingPage = () => {
  const navigate = useNavigate();
  const [bookingType, setBookingType] = useState('individual'); // 'individual' or 'group'
  const [journeyDetails, setJourneyDetails] = useState({
    date: '',
    fromStation: '',
    toStation: '',
    trainPref: '',
    seatPref: '',
    timePref: ''
  });

  const [hasOnwardJourney, setHasOnwardJourney] = useState(false);
  const [onwardDetails, setOnwardDetails] = useState({
    date: '',
    fromStation: '',
    toStation: '',
    trainPref: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!declarationAccepted) {
      alert("Please accept the declaration to proceed.");
      return;
    }
    console.log("Booking Request:", { bookingType, journeyDetails, passengers });
    alert("Booking request submitted successfully! Our team will contact you shortly.");
    navigate('/booking/success');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-10 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-[#006D77] mb-3">Train Tour Booking Form</h1>
          <p className="text-slate-500 font-medium">Please provide accurate passenger details as per official government IDs.</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
          
          {/* Tabs */}
          <div className="flex bg-slate-100 p-2 m-6 rounded-2xl">
            <button 
              onClick={() => handleBookingTypeChange('individual')}
              className={`flex-1 py-4 text-sm font-bold rounded-xl transition-all ${bookingType === 'individual' ? 'bg-[#006D77] text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Individual <span className="text-[10px] block opacity-80">(Max 6 Passengers)</span>
            </button>
            <button 
              onClick={() => handleBookingTypeChange('group')}
              className={`flex-1 py-4 text-sm font-bold rounded-xl transition-all ${bookingType === 'group' ? 'bg-[#006D77] text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Group <span className="text-[10px] block opacity-80">(Max 10 Passengers)</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-12">
            
            {/* Section 1: Journey Details */}
            <section>
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 mb-6 pb-2 border-b border-slate-100">
                <span className="material-symbols-outlined text-[#006D77]">train</span>
                General Journey Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Date of Journey <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    required
                    value={journeyDetails.date}
                    onChange={(e) => handleJourneyChange('outward', 'date', e.target.value)}
                    className="h-12 px-4 rounded-xl border border-slate-200 focus:border-[#006D77] focus:ring-1 focus:ring-[#006D77] outline-none transition-all font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Travel From <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="Departure Station"
                    value={journeyDetails.fromStation}
                    onChange={(e) => handleJourneyChange('outward', 'fromStation', e.target.value)}
                    className="h-12 px-4 rounded-xl border border-slate-200 focus:border-[#006D77] focus:ring-1 focus:ring-[#006D77] outline-none transition-all font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Travel To <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="Destination Station"
                    value={journeyDetails.toStation}
                    onChange={(e) => handleJourneyChange('outward', 'toStation', e.target.value)}
                    className="h-12 px-4 rounded-xl border border-slate-200 focus:border-[#006D77] focus:ring-1 focus:ring-[#006D77] outline-none transition-all font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Train Preference / Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 12001, Rajdhani"
                    value={journeyDetails.trainPref}
                    onChange={(e) => handleJourneyChange('outward', 'trainPref', e.target.value)}
                    className="h-12 px-4 rounded-xl border border-slate-200 focus:border-[#006D77] focus:ring-1 focus:ring-[#006D77] outline-none transition-all font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Seat Preference</label>
                  <select 
                    value={journeyDetails.seatPref}
                    onChange={(e) => handleJourneyChange('outward', 'seatPref', e.target.value)}
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
                    value={journeyDetails.timePref}
                    onChange={(e) => handleJourneyChange('outward', 'timePref', e.target.value)}
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

              {/* Onward Journey Toggle */}
              <div className="mt-8 flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 w-fit">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      checked={hasOnwardJourney}
                      onChange={(e) => setHasOnwardJourney(e.target.checked)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-200 transition-all checked:border-[#006D77] checked:bg-[#006D77]"
                    />
                    <span className="material-symbols-outlined absolute left-0 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none text-sm w-full text-center font-bold">check</span>
                  </div>
                  <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Add Same Details for Onward Journey / Return Trip</span>
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
            <section>
              <div className="flex items-center justify-between mb-8 pb-2 border-b border-slate-100">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                  <span className="material-symbols-outlined text-[#006D77]">groups</span>
                  Passenger Details
                </h2>
                <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{passengers.length} / {maxPassengers} Added</span>
              </div>

              <div className="space-y-8">
                {passengers.map((p, i) => (
                  <div key={i} className={`p-6 md:p-8 rounded-2xl border-2 transition-all ${i === 0 ? 'border-[#006D77]/20 bg-[#006D77]/5' : 'border-slate-100 bg-white'}`}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <span className={`w-10 h-10 flex items-center justify-center rounded-full font-black text-sm ${i === 0 ? 'bg-[#006D77] text-white' : 'bg-slate-200 text-slate-600'}`}>{i + 1}</span>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">{i === 0 ? 'Primary Guest (Passenger 1)' : `Passenger ${i + 1}`}</h3>
                          {i === 0 && <span className="text-[10px] text-[#006D77] font-bold uppercase tracking-widest">Main Contact for Tickets</span>}
                        </div>
                      </div>
                      {i > 0 && (
                        <button 
                          type="button"
                          onClick={() => removePassenger(i)} 
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">First Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text" required
                          value={p.firstName} onChange={(e) => handlePassengerChange(i, 'firstName', e.target.value)}
                          className="h-11 px-4 rounded-xl border border-slate-200 outline-none focus:border-[#006D77] transition-all text-sm font-medium"
                          placeholder="e.g. John"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text" required
                          value={p.lastName} onChange={(e) => handlePassengerChange(i, 'lastName', e.target.value)}
                          className="h-11 px-4 rounded-xl border border-slate-200 outline-none focus:border-[#006D77] transition-all text-sm font-medium"
                          placeholder="e.g. Doe"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Age <span className="text-red-500">*</span></label>
                        <input 
                          type="number" required min="1" max="120"
                          value={p.age} onChange={(e) => handlePassengerChange(i, 'age', e.target.value)}
                          className="h-11 px-4 rounded-xl border border-slate-200 outline-none focus:border-[#006D77] transition-all text-sm font-medium"
                          placeholder="Age"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID Type</label>
                        <select 
                          required
                          value={p.idType} onChange={(e) => handlePassengerChange(i, 'idType', e.target.value)}
                          className="h-11 px-4 rounded-xl border border-slate-200 outline-none focus:border-[#006D77] transition-all text-sm font-medium bg-white"
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
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID Number</label>
                        <input 
                          type="text" required
                          value={p.idNumber} onChange={(e) => handlePassengerChange(i, 'idNumber', e.target.value)}
                          className="h-11 px-4 rounded-xl border border-slate-200 outline-none focus:border-[#006D77] transition-all text-sm font-medium"
                          placeholder="ID Card Number"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Food Preference</label>
                        <select 
                          value={p.foodPref} onChange={(e) => handlePassengerChange(i, 'foodPref', e.target.value)}
                          className="h-11 px-4 rounded-xl border border-slate-200 outline-none focus:border-[#006D77] transition-all text-sm font-medium bg-white"
                        >
                          <option value="veg">Veg</option>
                          <option value="nonveg">Non-Veg</option>
                          <option value="jain">Jain</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nationality <span className="text-red-500">*</span></label>
                        <input 
                          type="text" required
                          value={p.nationality} onChange={(e) => handlePassengerChange(i, 'nationality', e.target.value)}
                          className="h-11 px-4 rounded-xl border border-slate-200 outline-none focus:border-[#006D77] transition-all text-sm font-medium"
                          placeholder="e.g. Indian"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        {(() => {
                          const isNonIndian = p.nationality && p.nationality.toLowerCase().trim() !== 'indian';
                          return (
                            <>
                              <label className={`text-[10px] font-bold uppercase tracking-widest ${isNonIndian ? 'text-orange-500' : 'text-slate-400'}`}>
                                Passport Number {isNonIndian && <span className="text-red-500">*</span>}
                              </label>
                              <input 
                                type="text" required={isNonIndian}
                                value={p.passport} onChange={(e) => handlePassengerChange(i, 'passport', e.target.value)}
                                className={`h-11 px-4 rounded-xl border outline-none transition-all text-sm font-medium ${isNonIndian ? 'border-orange-200 bg-orange-50/30' : 'border-slate-200'}`}
                                placeholder="A00000000"
                              />
                            </>
                          );
                        })()}
                      </div>

                      {i === 0 && (
                        <>
                          <div className="flex flex-col gap-2 md:col-span-1 lg:col-span-2">
                            <label className="text-[10px] font-bold text-[#006D77] uppercase tracking-widest">Mobile Number (Primary) *</label>
                            <div className="relative flex gap-2">
                              {/* Searchable Country Code Picker */}
                              <div className="relative group/cc">
                                <CountryCodeSelector 
                                  value={p.countryCode} 
                                  onChange={(val) => handlePassengerChange(i, 'countryCode', val)} 
                                />
                              </div>
                              <input 
                                type="tel" required
                                value={p.mobile} onChange={(e) => handlePassengerChange(i, 'mobile', e.target.value)}
                                className="flex-1 h-11 px-4 rounded-xl border border-[#006D77]/30 outline-none focus:border-[#006D77] transition-all text-sm font-bold text-[#006D77]"
                                placeholder="XXXXX XXXXX"
                              />
                            </div>
                            
                            {/* WhatsApp Consent */}
                            <label className="flex items-center gap-2 mt-2 cursor-pointer group/wa">
                              <div className="relative flex items-center">
                                <input 
                                  type="checkbox" 
                                  checked={p.whatsappConsent}
                                  onChange={(e) => handlePassengerChange(i, 'whatsappConsent', e.target.checked)}
                                  className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-300 transition-all checked:border-[#25D366] checked:bg-[#25D366]"
                                />
                                <span className="material-symbols-outlined absolute left-0 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none text-[10px] w-full text-center">check</span>
                              </div>
                              <span className="text-[10px] font-bold text-slate-500 group-hover/wa:text-[#25D366] transition-colors">
                                we can contact you on whatsapp on given number
                              </span>
                            </label>
                          </div>
                          <div className="flex flex-col gap-2 md:col-span-1 lg:col-span-2">
                            <label className="text-[10px] font-bold text-[#006D77] uppercase tracking-widest">Email ID (For Ticket Delivery) *</label>
                            <input 
                              type="email" required
                              value={p.email} onChange={(e) => handlePassengerChange(i, 'email', e.target.value)}
                              className="h-11 px-4 rounded-xl border border-[#006D77]/30 outline-none focus:border-[#006D77] transition-all text-sm font-bold text-[#006D77]"
                              placeholder="you@example.com"
                            />
                          </div>
                        </>
                      )}
                    </div>
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
            <section className="pt-8 border-t border-slate-100 flex flex-col items-center">
              <label className="flex items-start gap-4 cursor-pointer mb-10 group max-w-2xl">
                <div className="relative flex items-center mt-1">
                  <input 
                    type="checkbox" 
                    required
                    checked={declarationAccepted}
                    onChange={(e) => setDeclarationAccepted(e.target.checked)}
                    className="peer h-6 w-6 cursor-pointer appearance-none rounded-md border-2 border-slate-200 transition-all checked:border-[#006D77] checked:bg-[#006D77]"
                  />
                  <span className="material-symbols-outlined absolute left-0 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none text-base w-full text-center">check</span>
                </div>
                <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors leading-relaxed">
                  I declare that all the information provided related to the passengers is true and correct.
                </span>
              </label>

              <button 
                type="submit"
                disabled={!declarationAccepted}
                className={`w-full md:w-auto px-16 py-5 rounded-2xl font-black text-lg transition-all shadow-xl ${declarationAccepted ? 'bg-[#006D77] text-white hover:bg-[#005a63] shadow-[#006D77]/20 hover:scale-[1.02]' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
              >
                Request Booking
              </button>
            </section>
          </form>

          {/* Important Terms & Policies Section */}
          <div className="p-8 md:p-12 bg-slate-900 text-white pb-16">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#FFDDD2]">verified_user</span>
              Important Terms & Policies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-[#FFDDD2] text-xl shrink-0">payments</span>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">Full advance payment is required to issue the train tickets.</p>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-[#FFDDD2] text-xl shrink-0">trending_up</span>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">Fare prices for most trains in India are dynamic. The final price charged will be the actual fare applicable at the time of ticket issuance.</p>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-[#FFDDD2] text-xl shrink-0">info</span>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">Our agency, <strong className="text-white">'The Beautiful India - Bharat Darshan'</strong>, does not hide markup inside the ticket fare. We charge a flat, transparent service fee of INR 200 + 18% GST per person, per sector / per journey.</p>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-[#FFDDD2] text-xl shrink-0">schedule</span>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">We do not accept last-minute cancellations or amendments outside of our official company office hours (Indian Standard Time).</p>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-[#FFDDD2] text-xl shrink-0">badge</span>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">Passengers must carry and show original proof of identity and age to the Train Ticket Examiner (TTE) during the journey, as per IRCTC rules.</p>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-[#FFDDD2] text-xl shrink-0">gavel</span>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">We strictly follow all rules and guidelines set by the IRCTC for travel agencies. Any changes after issuing the ticket are subject to availability and IRCTC ticket rules.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="mt-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
          The Beautiful India - Official Booking Partner
        </div>

      </div>
    </div>
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
        className="h-11 px-3 rounded-xl border border-[#006D77]/30 bg-white flex items-center gap-2 hover:border-[#006D77] transition-all min-w-[90px]"
      >
        <span className="text-lg">{selected.flag}</span>
        <span className="text-xs font-bold text-[#006D77]">{selected.code}</span>
        <span className="material-symbols-outlined text-slate-400 text-sm">expand_more</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-100 shadow-2xl rounded-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-slate-50 sticky top-0 bg-white">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input 
                autoFocus
                type="text"
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 rounded-lg border-none focus:ring-1 focus:ring-[#006D77]/20 outline-none"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto py-2">
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
                  className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left ${value === c.code ? 'bg-[#006D77]/5' : ''}`}
                >
                  <span className="text-lg">{c.flag}</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-900 leading-none">{c.country}</span>
                    <span className="text-[10px] text-slate-400 mt-1">{c.code}</span>
                  </div>
                  {value === c.code && <span className="material-symbols-outlined text-[#006D77] text-sm ml-auto">check</span>}
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
