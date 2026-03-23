
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminTrainQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [filter, setFilter] = useState('All');

  const fetchQueries = () => {
    setLoading(true);
    fetch(`${import.meta.env.BASE_URL}api/train-queries`)
      .then(res => res.json())
      .then(data => {
        setQueries(Array.isArray(data) ? data.reverse() : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const filteredQueries = queries.filter(q => filter === 'All' || q.status === filter);

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-500">
        
        <div className="flex justify-between items-center mb-8">
           <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Recent Queries</h2>
              <p className="text-slate-500 font-bold italic">Manage train travel requests from guests</p>
           </div>
           <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
             {['All', 'New', 'Contacted', 'Closed'].map(t => (
               <button 
                 key={t}
                 onClick={() => setFilter(t)}
                 className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${filter === t ? 'bg-[#006D77] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 {t}
               </button>
             ))}
           </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-[#006D77] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
             <table className="w-full text-left">
                <thead>
                   <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Guest & Status</th>
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Outward Journey</th>
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Return/Onward</th>
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Passengers</th>
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {filteredQueries.map(q => (
                     <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                           <div className="flex flex-col">
                              <span className="font-black text-slate-800 text-lg">{q.passengers[0]?.firstName} {q.passengers[0]?.lastName}</span>
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{q.id}</span>
                              <div className="mt-2 text-[10px] font-black rounded-lg px-2 py-1 w-fit border border-slate-200 bg-white uppercase text-slate-400">
                                 {q.status}
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex flex-col gap-1">
                              <span className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                 <span className="material-symbols-outlined text-[18px] text-[#006D77]">calendar_today</span>
                                 {q.journeyDetails.date}
                              </span>
                              <span className="font-bold text-slate-500 text-xs">
                                 {q.journeyDetails.fromStation} → {q.journeyDetails.toStation}
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           {q.hasOnwardJourney ? (
                             <div className="flex flex-col gap-1">
                                <span className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                   <span className="material-symbols-outlined text-[18px] text-orange-400">event_repeat</span>
                                   {q.onwardDetails.date}
                                </span>
                                <span className="font-bold text-slate-500 text-xs">
                                   {q.onwardDetails.fromStation} → {q.onwardDetails.toStation}
                                </span>
                             </div>
                           ) : (
                             <span className="text-slate-300 font-bold italic text-xs">No Return</span>
                           )}
                        </td>
                        <td className="px-8 py-6">
                           <span className="px-3 py-1 bg-slate-100 rounded-full text-[11px] font-black text-slate-500 uppercase">
                              {q.passengers.length} Traveler{q.passengers.length > 1 ? 's' : ''}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button 
                             onClick={() => setSelectedQuery(q)}
                             className="px-6 py-2 bg-[#006D77] text-white rounded-xl font-black text-xs hover:bg-[#005a63] transition-all shadow-lg shadow-[#006D77]/20"
                           >
                              VIEW
                           </button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
             {!filteredQueries.length && (
               <div className="p-20 text-center flex flex-col items-center gap-4">
                  <span className="material-symbols-outlined text-6xl text-slate-200">train</span>
                  <p className="text-slate-400 font-bold italic">No train queries found.</p>
               </div>
             )}
          </div>
        )}

        {/* DETAILS MODAL */}
        {selectedQuery && (
          <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
                <div className="px-8 py-6 bg-[#006D77] text-white flex justify-between items-center shrink-0">
                   <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined bg-white/20 p-2 rounded-xl">train</span>
                      <div>
                         <h3 className="font-black text-xl tracking-tight uppercase">Train Query Details</h3>
                         <p className="text-teal-100 text-[10px] font-black uppercase tracking-widest tracking-widest">{selectedQuery.id} • {new Date(selectedQuery.timestamp).toLocaleString()}</p>
                      </div>
                   </div>
                   <button onClick={() => setSelectedQuery(null)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
                      <span className="material-symbols-outlined">close</span>
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-slate-50/50">
                   
                   {/* JOURNEY DETAILS */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                         <h4 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">flight_takeoff</span>
                            Outward Journey
                         </h4>
                         <div className="space-y-4">
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                               <span className="text-xs font-bold text-slate-500 italic">Date</span>
                               <span className="text-sm font-black text-slate-800">{selectedQuery.journeyDetails.date}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                               <span className="text-xs font-bold text-slate-500 italic">Route</span>
                               <span className="text-sm font-black text-slate-800">{selectedQuery.journeyDetails.fromStation} → {selectedQuery.journeyDetails.toStation}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                               <span className="text-xs font-bold text-slate-500 italic">Train Preference</span>
                               <span className="text-sm font-black text-slate-800">{selectedQuery.journeyDetails.trainPref || 'Any'}</span>
                            </div>
                            <div className="flex justify-between">
                               <span className="text-xs font-bold text-slate-500 italic">Preferences</span>
                               <span className="text-sm font-black text-slate-800 uppercase text-[11px]">{selectedQuery.journeyDetails.seatPref || 'Any'} Seat • {selectedQuery.journeyDetails.timePref || 'Any'} Time</span>
                            </div>
                         </div>
                      </div>

                      <div className={`p-6 rounded-3xl border border-slate-100 shadow-sm ${selectedQuery.hasOnwardJourney ? 'bg-white' : 'bg-slate-100 opacity-60'}`}>
                         <h4 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">flight_land</span>
                            Return / Onward Journey
                         </h4>
                         {selectedQuery.hasOnwardJourney ? (
                            <div className="space-y-4">
                               <div className="flex justify-between border-b border-slate-50 pb-2">
                                  <span className="text-xs font-bold text-slate-500 italic">Date</span>
                                  <span className="text-sm font-black text-slate-800">{selectedQuery.onwardDetails.date}</span>
                               </div>
                               <div className="flex justify-between border-b border-slate-50 pb-2">
                                  <span className="text-xs font-bold text-slate-500 italic">Route</span>
                                  <span className="text-sm font-black text-slate-800">{selectedQuery.onwardDetails.fromStation} → {selectedQuery.onwardDetails.toStation}</span>
                               </div>
                               <div className="flex justify-between border-b border-slate-50 pb-2">
                                  <span className="text-xs font-bold text-slate-500 italic">Train Preference</span>
                                  <span className="text-sm font-black text-slate-800">{selectedQuery.onwardDetails.trainPref || 'Any'}</span>
                               </div>
                               <div className="flex justify-between">
                                  <span className="text-xs font-bold text-slate-500 italic">Preferences</span>
                                  <span className="text-sm font-black text-slate-800 uppercase text-[11px]">{selectedQuery.onwardDetails.seatPref || 'Any'} Seat • {selectedQuery.onwardDetails.timePref || 'Any'} Time</span>
                               </div>
                            </div>
                         ) : (
                            <div className="h-24 flex items-center justify-center text-slate-400 font-bold italic text-sm">No return journey requested</div>
                         )}
                      </div>
                   </div>

                   {/* PASSENGER INFO */}
                   <div>
                      <h4 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                         <span className="material-symbols-outlined text-sm">groups</span>
                         Passenger Details ({selectedQuery.passengers.length})
                      </h4>
                      <div className="space-y-4">
                         {selectedQuery.passengers.map((p, idx) => (
                           <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-wrap gap-x-12 gap-y-4">
                              <div className="flex items-center gap-4">
                                 <span className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full font-black text-xs text-slate-500">{idx + 1}</span>
                                 <div>
                                    <p className="text-sm font-black text-slate-800">{p.firstName} {p.lastName}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.age} years • {p.nationality}</p>
                                 </div>
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-bold text-slate-400 uppercase">ID Details</span>
                                 <span className="text-xs font-black text-slate-700">{p.idType}: {p.idNumber}</span>
                                 {p.passport && <span className="text-[10px] text-orange-600 font-black">Passport: {p.passport}</span>}
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-bold text-slate-400 uppercase">Food Pref.</span>
                                 <span className="text-xs font-black text-slate-700 capitalize">{p.foodPref || 'Not specified'}</span>
                              </div>
                              {idx === 0 && (
                                <>
                                  <div className="flex flex-col">
                                     <span className="text-[10px] font-bold text-[#006D77] uppercase">Mobile</span>
                                     <span className="text-xs font-black text-slate-800">{p.countryCode} {p.mobile}</span>
                                     {p.whatsappConsent && <span className="text-[10px] text-green-600 font-black flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> WhatsApp Subscribed</span>}
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="text-[10px] font-bold text-[#006D77] uppercase">Email</span>
                                     <span className="text-xs font-black text-slate-800">{p.email}</span>
                                  </div>
                                </>
                              )}
                           </div>
                         ))}
                      </div>
                   </div>

                </div>

                <div className="px-8 py-5 bg-white border-t border-slate-100 flex justify-between items-center shrink-0">
                   <div className="flex items-center gap-4">
                      <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-[#006D77] transition-all cursor-pointer">
                         <option>New</option>
                         <option>Contacted</option>
                         <option>Closed</option>
                      </select>
                   </div>
                   <button onClick={() => setSelectedQuery(null)} className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-black transition-all shadow-xl">
                      CLOSE VIEW
                   </button>
                </div>
             </div>
          </div>
        )}

      </div>
  );
};

export default AdminTrainQueries;
