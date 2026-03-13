
import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

/**
 * Auto-generated from: admin_booking_management_dashboard/code.html
 * Group: admin | Path: /admin/bookings
 */
const AdminBookingManagementDashboard = () => {
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('All');
  const [dateRange, setDateRange] = React.useState('All Time');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState({ key: 'id', direction: 'desc' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const { formatPrice } = useCurrency();

  const fetchBookings = () => {
    setLoading(true);
    fetch('http://localhost:3001/api/bookings')
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

  React.useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = (id, newStatus) => {
    fetch(`http://localhost:3001/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    .then(res => res.json())
    .then(() => {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    })
    .catch(err => alert("Error updating status: " + err.message));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this booking record?")) return;
    
    fetch(`http://localhost:3001/api/bookings/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      setBookings(prev => prev.filter(b => b.id !== id));
    })
    .catch(err => alert("Error deleting booking: " + err.message));
  };

  const getFilteredAndSortedBookings = () => {
    let result = [...bookings];

    // Status Filter
    if (filter !== 'All') {
      result = result.filter(b => b.status === filter);
    }

    // Date Range Filter (Basic implementation based on booking.date string)
    const now = new Date();
    if (dateRange === 'Last 30 Days') {
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      result = result.filter(b => new Date(b.date) >= thirtyDaysAgo);
    } else if (dateRange === 'Year to Date') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      result = result.filter(b => new Date(b.date) >= startOfYear);
    }

    // Custom Date Filters
    if (startDate) {
      result = result.filter(b => {
        const d = new Date(b.date);
        return d >= new Date(startDate);
      });
    }
    if (endDate) {
      result = result.filter(b => {
        const d = new Date(b.date);
        // Set end date to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return d <= end;
      });
    }

    // Sorting
    result.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Handle numeric comparisons
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
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const exportToCSV = () => {
    if (processedBookings.length === 0) return alert("No data to export");
    const headers = ["Booking ID", "Customer", "Email", "Tour", "Date", "Amount", "Status"];
    const rows = processedBookings.map(b => [
      b.id, b.customerName, b.customerEmail, b.tourTitle, b.date, b.amount, b.status
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div data-page="admin_booking_management_dashboard">
      <div className="relative flex h-screen w-full flex-col group/design-root overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col hidden md:flex">
<nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-bold transition-all" to="/admin/overview">
<span className="material-symbols-outlined">space_dashboard</span>
<span>Overview</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/tours">
<span className="material-symbols-outlined text-[20px] text-slate-500">tour</span>
<span className="text-[15px] font-medium">Manage Tours</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] bg-[#eefaf9] text-[#0a6c75] transition-colors" to="/admin/bookings">
<span className="material-symbols-outlined text-[20px] text-[#0a6c75]">group</span>
<span className="text-[15px] font-medium">Bookings</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/guides">
<span className="material-symbols-outlined text-[20px] text-slate-500">map</span>
<span className="text-[15px] font-medium">Guides</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/guides/new">
<span className="material-symbols-outlined text-[20px] text-slate-500">edit_document</span>
<span className="text-[15px] font-medium">Write a Blog</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/categorization">
<span className="material-symbols-outlined text-[20px] text-slate-500">category</span>
<span className="text-[15px] font-medium">Categorization</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/referral/dashboard">
<span className="material-symbols-outlined text-[20px] text-slate-500">payments</span>
<span className="text-[15px] font-medium">Financials</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/queries">
<span className="material-symbols-outlined text-[20px] text-slate-500">contact_support</span>
<span className="text-[15px] font-medium">Queries</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/leads">
<span className="material-symbols-outlined text-[20px] text-slate-500">smart_toy</span>
<span className="text-[15px] font-medium">Chatbot Leads</span>
</Link>
</nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <nav className="flex text-xs font-medium text-slate-400 mb-2 gap-2 items-center">
                  <Link className="hover:text-primary" to="/admin">Admin</Link>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span className="text-slate-600 dark:text-slate-300">Booking Management</span>
                </nav>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Tour Booking Management</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Oversee and process all tour reservations across the platform.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-sand transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">download</span>
                  Export CSV
                </button>
                <Link 
                  to="/tours"
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  New Booking
                </Link>
              </div>
            </div>
{/* Stats Overview */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-primary/10 rounded-lg text-primary">
<span className="material-symbols-outlined">calendar_month</span>
</div>
<span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
</div>
<p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total Bookings (Mo)</p>
<h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{bookings.length}</h3>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-primary/10 rounded-lg text-primary">
<span className="material-symbols-outlined">payments</span>
</div>
<span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+8.2%</span>
</div>
<p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Revenue This Month</p>
<h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
  {formatPrice(bookings.reduce((sum, b) => sum + (b.amount || 0), 0))}
</h3>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-primary/10 rounded-lg text-primary">
<span className="material-symbols-outlined">pending_actions</span>
</div>
<span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">14 New</span>
</div>
<p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Pending Approvals</p>
<h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{bookings.filter(b => b.status === 'Pending').length}</h3>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-primary/10 rounded-lg text-primary">
<span className="material-symbols-outlined">person_add</span>
</div>
<span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+5.1%</span>
</div>
<p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Conversion Rate</p>
<h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
  {((bookings.length / 500) * 100).toFixed(1)}%
</h3>
</div>
</div>
{/* Table Filters */}
<div className="bg-white dark:bg-slate-900 rounded-t-xl border-x border-t border-slate-100 dark:border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4">
<div className="flex flex-wrap items-center gap-2">
  {['All', 'Confirmed', 'Pending', 'Cancelled'].map(f => (
    <button 
      key={f}
      onClick={() => setFilter(f)}
      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
        filter === f ? 'bg-primary text-white shadow-md' : 'hover:bg-sand dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
      }`}
    >
      {f === 'All' ? 'All Bookings' : f}
    </button>
  ))}
</div>
<div className="flex items-center gap-3">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">calendar_today</span>
<select 
  value={dateRange}
  onChange={(e) => setDateRange(e.target.value)}
  className="pl-10 pr-4 py-2 bg-sand dark:bg-slate-800 border-none rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
>
<option>All Time</option>
<option>Last 30 Days</option>
<option>Last Quarter</option>
<option>Year to Date</option>
</select>
</div>
<div className="flex items-center gap-2">
  <div className="flex flex-col">
    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">From</label>
    <input 
      type="date" 
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="px-3 py-1.5 bg-sand dark:bg-slate-800 border-none rounded-lg text-xs font-medium focus:ring-1 focus:ring-primary cursor-pointer w-[130px]"
    />
  </div>
  <div className="flex flex-col">
    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">To</label>
    <input 
      type="date" 
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="px-3 py-1.5 bg-sand dark:bg-slate-800 border-none rounded-lg text-xs font-medium focus:ring-1 focus:ring-primary cursor-pointer w-[130px]"
    />
  </div>
  {(startDate || endDate) && (
    <button 
      onClick={() => { setStartDate(''); setEndDate(''); }}
      className="mt-4 p-1.5 text-slate-400 hover:text-red-500 transition-colors"
      title="Clear Custom Dates"
    >
      <span className="material-symbols-outlined text-lg">close</span>
    </button>
  )}
</div>
<button className="p-2 text-slate-500 hover:bg-sand dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
<span className="material-symbols-outlined">filter_list</span>
</button>
</div>
</div>
{/* Bookings Table */}
<div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-x-auto rounded-b-xl shadow-sm">
<table className="w-full text-left border-collapse min-w-[1000px]">
<thead>
<tr className="bg-sand/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
<th onClick={() => requestSort('id')} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-primary transition-colors">
  <div className="flex items-center gap-1">
    Booking ID
    {sortConfig.key === 'id' && <span className="material-symbols-outlined text-xs">{sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>}
  </div>
</th>
<th onClick={() => requestSort('customerName')} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-primary transition-colors">
  <div className="flex items-center gap-1">
    Customer
    {sortConfig.key === 'customerName' && <span className="material-symbols-outlined text-xs">{sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>}
  </div>
</th>
<th onClick={() => requestSort('tourTitle')} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-primary transition-colors">
  <div className="flex items-center gap-1">
    Tour Title
    {sortConfig.key === 'tourTitle' && <span className="material-symbols-outlined text-xs">{sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>}
  </div>
</th>
<th onClick={() => requestSort('date')} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-primary transition-colors">
  <div className="flex items-center gap-1">
    Date
    {sortConfig.key === 'date' && <span className="material-symbols-outlined text-xs">{sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>}
  </div>
</th>
<th onClick={() => requestSort('amount')} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-primary transition-colors">
  <div className="flex items-center gap-1">
    Amount
    {sortConfig.key === 'amount' && <span className="material-symbols-outlined text-xs">{sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>}
  </div>
</th>
<th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
<th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-50 dark:divide-slate-800">
{/* Row 1 */}
{loading ? (
  <tr><td colSpan="7" className="text-center py-10 text-slate-500">Loading bookings...</td></tr>
) : paginatedBookings.length === 0 ? (
  <tr><td colSpan="7" className="text-center py-10 text-slate-500">No bookings found matching your criteria.</td></tr>
) : paginatedBookings.map(booking => (
<tr key={booking.id} className="hover:bg-sand/20 dark:hover:bg-slate-800/20 transition-colors">
<td className="px-6 py-4 whitespace-nowrap">
<span className="font-mono text-xs font-bold text-primary">#{booking.id}</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600">
  {booking.customerName.split(' ').map(n => n[0]).join('')}
</div>
<div>
<p className="text-sm font-bold text-slate-900 dark:text-slate-100">{booking.customerName}</p>
<p className="text-xs text-slate-500">{booking.customerEmail}</p>
</div>
</div>
</td>
<td className="px-6 py-4">
<p className="text-sm font-medium text-slate-700 dark:text-slate-300">{booking.tourTitle}</p>
</td>
<td className="px-6 py-4 whitespace-nowrap">
<p className="text-xs font-medium text-slate-600 dark:text-slate-400">{booking.date}</p>
</td>
<td className="px-6 py-4 whitespace-nowrap">
<p className="text-sm font-bold text-slate-900 dark:text-slate-100">{formatPrice(booking.amount)}</p>
</td>
<td className="px-6 py-4 whitespace-nowrap">
<span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
  booking.status === 'Confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
  booking.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
}`}>
<span className={`size-1.5 rounded-full mr-1.5 ${
  booking.status === 'Confirmed' ? 'bg-green-500' :
  booking.status === 'Pending' ? 'bg-amber-500' :
  'bg-red-500'
}`}></span>
                                    {booking.status}
                                </span>
</td>
<td className="px-6 py-4 text-right whitespace-nowrap">
<div className="flex items-center justify-end gap-2 text-slate-600">
<Link 
  to="/booking/success" 
  state={{ booking, tour: { title: booking.tourTitle, image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e' } }}
  className="p-1.5 hover:text-primary transition-colors" 
  title="View Receipt"
>
<span className="material-symbols-outlined text-xl">visibility</span>
</Link>
<button 
  onClick={() => {
    const next = prompt(`Change status for ${booking.id} to:`, booking.status);
    if(next && next !== booking.status) handleStatusUpdate(booking.id, next);
  }}
  className="p-1.5 hover:text-primary transition-colors" 
  title="Edit Status"
>
<span className="material-symbols-outlined text-xl">edit</span>
</button>
<button 
  onClick={() => {
    if(window.confirm(`Are you sure you want to CANCEL booking ${booking.id}?`)) handleStatusUpdate(booking.id, 'Cancelled');
  }}
  className="p-1.5 hover:text-red-500 transition-colors" 
  title="Refund / Cancel"
>
<span className="material-symbols-outlined text-xl">undo</span>
</button>
<button 
  onClick={() => handleDelete(booking.id)}
  className="p-1.5 hover:text-red-600 transition-colors" 
  title="Delete Permanently"
>
<span className="material-symbols-outlined text-xl text-[18px]">delete</span>
</button>
</div>
</td>
</tr>
))}
</tbody>
</table>
</div>
{/* Pagination */}
<div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
<p className="text-sm text-slate-500">
  Showing {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} bookings
</p>
<div className="flex items-center gap-1">
<button 
  disabled={currentPage === 1}
  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
  className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-sand transition-colors disabled:opacity-30"
>
<span className="material-symbols-outlined text-lg">chevron_left</span>
</button>
{[...Array(totalPages)].map((_, i) => (
  <button 
    key={i}
    onClick={() => setCurrentPage(i + 1)}
    className={`size-9 flex items-center justify-center rounded-lg font-bold text-sm ${
      currentPage === i + 1 ? 'bg-primary text-white' : 'hover:bg-sand dark:hover:bg-slate-800'
    }`}
  >
    {i + 1}
  </button>
))}
<button 
  disabled={currentPage === totalPages || totalPages === 0}
  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
  className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-sand transition-colors disabled:opacity-30"
>
<span className="material-symbols-outlined text-lg">chevron_right</span>
</button>
</div>
</div>
</main>

      </div>
    </div>
  </div>
);
};

export default AdminBookingManagementDashboard;
