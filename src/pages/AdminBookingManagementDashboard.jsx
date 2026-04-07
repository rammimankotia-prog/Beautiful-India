import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

const AdminBookingManagementDashboard = () => {
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('All');
  const [dateRange, setDateRange] = React.useState('All Time');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [toastMsg, setToastMsg] = React.useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };
  const [sortConfig, setSortConfig] = React.useState({ key: 'id', direction: 'desc' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedBooking, setSelectedBooking] = React.useState(null);
  const itemsPerPage = 10;
  const { formatPrice } = useCurrency();

  const fetchBookings = () => {
    setLoading(true);
    const saved = localStorage.getItem('beautifulindia_admin_bookings');
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
        setLoading(false);
        return;
      } catch (e) {
        console.error("Parse error:", e);
      }
    }

    fetch(`${import.meta.env.BASE_URL}data/bookings.json`)
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch bookings error:", err);
        setLoading(false);
      });
  };

  const saveBookings = (updated) => {
    setBookings(updated);
    localStorage.setItem('beautifulindia_admin_bookings', JSON.stringify(updated));
  };

  React.useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = (id, newStatus) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: newStatus } : b);
    saveBookings(updated);
    showToast(`Status updated to ${newStatus}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this booking permanently?")) {
      const updated = bookings.filter(b => b.id !== id);
      saveBookings(updated);
      showToast("Booking deleted");
    }
  };

  const handleSync = async () => {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/save-bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookings)
      });
      if (response.ok) {
        showToast("System updated successfully!");
      } else {
        showToast("Stage for next sync.");
      }
    } catch (error) {
      showToast("Stage for next sync.");
    }
  };

  const getFilteredAndSortedBookings = () => {
    let result = [...bookings];

    if (filter !== 'All') {
      result = result.filter(b => b.status === filter);
    }

    const now = new Date();
    if (dateRange === 'Last 30 Days') {
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      result = result.filter(b => new Date(b.date) >= thirtyDaysAgo);
    } else if (dateRange === 'Year to Date') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      result = result.filter(b => new Date(b.date) >= startOfYear);
    }

    if (startDate) {
      result = result.filter(b => new Date(b.date) >= new Date(startDate));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(b => new Date(b.date) <= end);
    }

    result.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === 'amount' || sortConfig.key === 'id') {
        aVal = parseFloat(String(aVal).replace('BK-', '')) || 0;
        bVal = parseFloat(String(bVal).replace('BK-', '')) || 0;
      }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  };

  const processedBookings = getFilteredAndSortedBookings();
  const totalItems = processedBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedBookings = processedBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const requestSort = (key) => {
    let direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const exportToCSV = () => {
    if (processedBookings.length === 0) return alert("Nothing to export");
    const headers = ["ID", "Customer", "Tour", "Date", "Amount", "Status"];
    const rows = processedBookings.map(b => [b.id, b.customerName, b.tourTitle, b.date, b.amount, b.status]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bookings.csv";
    link.click();
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-500">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-bottom duration-300">
          <div className="bg-slate-900/90 text-white px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border border-white/10">
            <span className="material-symbols-outlined text-teal-400">check_circle</span>
            <span className="font-black text-sm tracking-widest uppercase">{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2">Booking Management</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold italic">Oversee and process all tour reservations.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleSync} className="flex items-center gap-2 px-6 py-2.5 bg-[#0a6c75] text-white rounded-xl font-black hover:bg-[#085a62] transition-all text-sm shadow-lg shadow-teal-900/20">
            <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
            Save to System
          </button>
          <button onClick={exportToCSV} className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-black text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all text-sm shadow-sm">
            <span className="material-symbols-outlined text-[20px]">download</span>
            CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Bookings</p>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{bookings.length}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Revenue</p>
          <h3 className="text-2xl font-black text-[#0a6c75]">{formatPrice(bookings.reduce((sum, b) => sum + (b.amount || 0), 0), true)}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Pending Invoices</p>
          <h3 className="text-2xl font-black text-orange-500">{bookings.filter(b => b.status === 'Pending').length}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Confirmed Tours</p>
          <h3 className="text-2xl font-black text-teal-600">{bookings.filter(b => b.status === 'Confirmed').length}</h3>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl">
            {['All', 'Confirmed', 'Pending', 'Cancelled'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${filter === f ? 'bg-white dark:bg-slate-700 text-[#0a6c75] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl">
                <span className="material-symbols-outlined text-slate-400 text-sm">calendar_month</span>
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer"
                >
                  <option>All Time</option>
                  <option>Last 30 Days</option>
                  <option>Year to Date</option>
                </select>
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/30 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                <th onClick={() => requestSort('id')} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-[#0a6c75]">ID</th>
                <th onClick={() => requestSort('customerName')} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-[#0a6c75]">Customer</th>
                <th onClick={() => requestSort('tourTitle')} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-[#0a6c75]">Tour</th>
                <th onClick={() => requestSort('date')} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-[#0a6c75]">Date</th>
                <th onClick={() => requestSort('amount')} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-[#0a6c75]">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-bold italic">Loading bookings...</td></tr>
              ) : paginatedBookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-6 font-black text-[#0a6c75] text-xs">#{b.id}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight mb-1">{b.customerName}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{b.customerEmail}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-600 dark:text-slate-400">{b.tourTitle}</td>
                  <td className="px-8 py-6 text-[11px] font-black text-slate-400">{b.date}</td>
                  <td className="px-8 py-6 font-black text-slate-800 dark:text-slate-100">{formatPrice(b.amount, true)}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 text-slate-300 group-hover:text-slate-400 hover:text-slate-600 transition-colors">
                      <button onClick={() => setSelectedBooking(b)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-teal-50 hover:text-teal-600 transition-all border border-transparent hover:border-teal-100" title="View Booking">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                      <button onClick={() => { handleDelete(b.id); setSelectedBooking(null); }} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100" title="Delete Booking">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Page {currentPage} of {totalPages || 1}
          </p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30"
            >
              Previous
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* View Booking Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[90vh] border border-slate-200">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0a6c75]/10 text-[#0a6c75] rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-800">Booking Details</h3>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">#{selectedBooking.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-slate-600 transition-colors w-10 h-10 bg-white rounded-full flex justify-center items-center shadow-sm border border-slate-200">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 shadow-sm">
                 <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Customer Name</span>
                    <span className="text-sm font-black text-slate-800">{selectedBooking.customerName}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Email</span>
                    <span className="text-sm font-bold text-slate-600">{selectedBooking.customerEmail}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Tour Package</span>
                    <span className="text-sm font-black text-[#0a6c75] text-right ml-4">{selectedBooking.tourTitle}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Booking Date</span>
                    <span className="text-sm font-bold text-slate-600">{selectedBooking.date}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Amount</span>
                    <span className="text-sm font-black text-slate-800">{formatPrice(selectedBooking.amount, true)}</span>
                 </div>
                 <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Status</span>
                    <select 
                      value={selectedBooking.status}
                      onChange={(e) => {
                        handleStatusUpdate(selectedBooking.id, e.target.value);
                        setSelectedBooking({ ...selectedBooking, status: e.target.value });
                      }}
                      className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg outline-none focus:border-[#0a6c75] font-black text-slate-700 text-xs shadow-sm cursor-pointer"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                 </div>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => { handleDelete(selectedBooking.id); setSelectedBooking(null); }} 
                className="px-6 py-2.5 bg-red-50 text-red-500 font-black uppercase tracking-widest text-[11px] rounded-xl flex items-center gap-2 hover:bg-red-100 transition-all border border-red-100"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span> Delete Booking
              </button>
              <button 
                onClick={() => setSelectedBooking(null)} 
                className="px-6 py-2.5 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] rounded-xl flex items-center gap-2 hover:bg-black transition-all shadow-lg"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingManagementDashboard;
