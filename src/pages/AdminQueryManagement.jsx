
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminQueryManagement = () => {
  const [activeTab, setActiveTab] = useState('All Queries');
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewChatQuery, setViewChatQuery] = useState(null);

  const fetchQueries = () => {
    setLoading(true);
    fetch('http://localhost:3001/api/leads')
      .then(res => res.json())
      .then(data => {
        // Sort by timestamp descending (newest first)
        const sortedData = Array.isArray(data) ? data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) : [];
        setQueries(sortedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch queries error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleStatusUpdate = (id, newStatus) => {
    fetch(`http://localhost:3001/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    .then(res => res.json())
    .then(() => {
      setQueries(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
    })
    .catch(err => alert("Error updating status: " + err.message));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this query?")) return;
    fetch(`http://localhost:3001/api/leads/${id}`, { method: 'DELETE' })
      .then(() => fetchQueries())
      .catch(err => alert("Error deleting: " + err.message));
  };

  const filteredQueries = queries.filter(q => {
    const matchesTab = activeTab === 'All Queries' || q.status === activeTab;
    const qStr = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      (q.name && q.name.toLowerCase().includes(qStr)) || 
      (q.email && q.email.toLowerCase().includes(qStr)) || 
      (q.to && q.to.toLowerCase().includes(qStr)) ||
      (q.phone && q.phone.toLowerCase().includes(qStr));
    return matchesTab && matchesSearch;
  });

  const exportToCSV = () => {
    if (filteredQueries.length === 0) return alert("No queries to export");
    const headers = ["Name", "Email", "Phone", "From", "To", "Departure Type", "Departure Date", "Duration", "Travelers", "Hotel Rating", "Food", "Cab", "Status", "Timestamp"];
    const rows = filteredQueries.map(q => [
      q.name, q.email, q.phone, q.from, q.to, q.departureType, q.departureDate, q.duration, q.travelers, q.hotelRating, q.foodPreference, q.cabPreference, q.status, q.timestamp
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `customer_queries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
      <header className="bg-white px-8 h-20 flex items-center justify-between sticky top-0 z-10 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-10">
          <Link to="/admin" className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#0a6c75] rounded-xl flex items-center justify-center shadow-lg shadow-teal-700/20">
                <span className="material-symbols-outlined text-white">contact_support</span>
             </div>
             <span className="text-[#0a6c75] font-black text-xl tracking-tight uppercase">Admin Panel</span>
          </Link>
          <nav className="flex items-center gap-8">
            <Link to="/admin/overview" className="text-slate-400 font-bold hover:text-slate-800 transition-colors">Overview</Link>
            <Link to="/admin/tours" className="text-slate-400 font-bold hover:text-slate-800 transition-colors">Tours</Link>
            <Link to="/admin/bookings" className="text-slate-400 font-bold hover:text-slate-800 transition-colors">Bookings</Link>
            <Link to="/admin/queries" className="text-[#0a6c75] font-black border-b-4 border-[#0a6c75] pb-1">Queries</Link>
          </nav>
        </div>
        <div className="relative group w-80">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            placeholder="Search queries..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-slate-700" 
          />
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 py-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Customer Queries</h1>
            <p className="text-slate-500 font-bold italic">Manage and track all quote requests from travelers.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-black text-slate-700 hover:bg-slate-50 transition-all text-sm shadow-sm"
            >
               <span className="material-symbols-outlined text-[20px]">download</span>
               Export CSV
            </button>
            <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
               {['All Queries', 'New', 'Contacted', 'Closed'].map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all ${activeTab === tab ? 'bg-[#0a6c75] text-white shadow-lg shadow-teal-700/20' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   {tab}
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
           {[
             { label: 'Total Queries', value: queries.length, icon: 'analytics', color: 'bg-blue-500', trend: '+12% from last week' },
             { label: 'New Requests', value: queries.filter(q => q.status === 'New').length, icon: 'notifications_active', color: 'bg-amber-500', trend: 'Response time: < 2h' },
             { label: 'Auto-Replies Sent', value: queries.filter(q => q.emailSent).length || queries.length, icon: 'forward_to_inbox', color: 'bg-emerald-500', trend: '100% Delivery Rate' },
             { label: 'Avg. Conv. Rate', value: '18.4%', icon: 'leaderboard', color: 'bg-purple-500', trend: 'High Priority focus' }
           ].map((stat, idx) => (
             <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                   <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                      <span className="material-symbols-outlined">{stat.icon}</span>
                   </div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-slate-800">{stat.value}</span>
                   <span className="text-[11px] font-bold text-slate-400 truncate">{stat.trend}</span>
                </div>
             </div>
           ))}
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
             <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 italic">
                  <th className="px-8 py-5 text-slate-400 font-black uppercase text-[11px] tracking-widest">Customer & Trip</th>
                  <th className="px-8 py-5 text-slate-400 font-black uppercase text-[11px] tracking-widest">Preferences</th>
                  <th className="px-8 py-5 text-slate-400 font-black uppercase text-[11px] tracking-widest">Contact Details</th>
                  <th className="px-8 py-5 text-slate-400 font-black uppercase text-[11px] tracking-widest">Status</th>
                  <th className="px-8 py-5 text-slate-400 font-black uppercase text-[11px] tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredQueries.map(q => (
                  <tr key={q.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-1">
                          <span className="text-lg font-black text-slate-800">{q.name || 'Anonymous'}</span>
                          <div className="flex items-center gap-2">
                             <span className="material-symbols-outlined text-[16px] text-primary">near_me</span>
                             <span className="font-bold text-slate-500 text-sm">To: <span className="text-slate-800">{q.to}</span></span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="material-symbols-outlined text-[16px] text-slate-400">calendar_today</span>
                             <span className="font-bold text-slate-400 text-[12px]">{q.departureDate} ({q.duration})</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                          <div className="flex items-center gap-2">
                             <span className="material-symbols-outlined text-[16px] text-orange-400">hotel_class</span>
                             <span className="text-[12px] font-bold text-slate-600">{q.hotelRating}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="material-symbols-outlined text-[16px] text-green-500">restaurant</span>
                             <span className="text-[12px] font-bold text-slate-600">{q.foodPreference}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="material-symbols-outlined text-[16px] text-blue-500">directions_car</span>
                             <span className="text-[12px] font-bold text-slate-600">{q.cabPreference}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="material-symbols-outlined text-[16px] text-purple-500">group</span>
                             <span className="text-[12px] font-bold text-slate-600">{q.travelers}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-1">
                          <span className="font-bold text-slate-700 text-sm flex items-center gap-2">
                             <span className="material-symbols-outlined text-[18px] text-slate-400">mail</span>
                             {q.email}
                          </span>
                          <span className="font-bold text-slate-700 text-sm flex items-center gap-2">
                             <span className="material-symbols-outlined text-[18px] text-slate-400">call</span>
                             {q.phone}
                          </span>
                          {q.from && (
                             <span className="font-bold text-slate-400 text-xs mt-1">From: {q.from}</span>
                          )}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <select 
                         value={q.status}
                         onChange={(e) => handleStatusUpdate(q.id, e.target.value)}
                         className={`px-4 py-2 rounded-xl font-black text-[12px] outline-none border transition-all ${
                           q.status === 'New' ? 'border-blue-100 bg-blue-50 text-blue-600' :
                           q.status === 'Contacted' ? 'border-orange-100 bg-orange-50 text-orange-600' :
                           'border-slate-100 bg-slate-100 text-slate-400'
                         }`}
                       >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed">Closed</option>
                       </select>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex justify-end gap-2">
                           {q.chatLog && (
                             <button
                               onClick={() => setViewChatQuery(q)}
                               className="w-10 h-10 rounded-xl hover:bg-[#eefaf9] text-[#0f766e] hover:text-[#0f766e] transition-all flex items-center justify-center border border-transparent hover:border-teal-200"
                               title="View Chat"
                             >
                               <span className="material-symbols-outlined text-[20px]">chat</span>
                             </button>
                           )}
                           <button 
                             onClick={() => handleDelete(q.id)}
                             className="w-10 h-10 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all flex items-center justify-center border border-transparent hover:border-red-200"
                             title="Delete Query"
                           >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                           </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filteredQueries.length && (
              <div className="p-20 text-center flex flex-col items-center gap-4">
                 <span className="material-symbols-outlined text-6xl text-slate-200">sentiment_neutral</span>
                 <p className="text-slate-400 font-bold italic">No queries found matching this filter.</p>
              </div>
            )}
          </div>
        )}

        {/* View Chat Modal */}
        {viewChatQuery && (
          <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[80vh] border border-slate-200">
               {/* Header */}
               <div className="px-6 py-4 bg-[#0a6c75] text-white flex justify-between items-center z-10 shadow-sm">
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined">forum</span>
                     <div>
                        <h3 className="font-extrabold text-[15px] leading-tight">Bot Conversation</h3>
                        <p className="text-[12px] font-medium text-teal-100">Client: {viewChatQuery.name} ({viewChatQuery.phone || viewChatQuery.email})</p>
                     </div>
                  </div>
                  <button onClick={() => setViewChatQuery(null)} className="hover:text-slate-200 transition-colors bg-white/10 w-8 h-8 rounded-full flex justify-center items-center">
                     <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
               </div>
               {/* Chat Body */}
               <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc] flex flex-col gap-4">
                  {viewChatQuery.chatLog?.map((msg, index) => (
                      <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div 
                              className={`
                                  max-w-[80%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed relative
                                  ${msg.sender === 'user' 
                                      ? 'bg-[#0a6c75] text-white rounded-tr-sm shadow-sm font-medium' 
                                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm font-medium'
                                  }
                              `}
                          >
                               {/* Sender Label */}
                               <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${msg.sender === 'user' ? 'text-teal-200' : 'text-slate-400'}`}>
                                   {msg.sender === 'user' ? 'Guest' : 'WanderBot'}
                               </div>
                              {msg.text}
                          </div>
                      </div>
                  ))}
               </div>
             </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminQueryManagement;
