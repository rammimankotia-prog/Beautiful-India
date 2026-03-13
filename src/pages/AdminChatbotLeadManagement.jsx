import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminChatbotLeadManagement = () => {
  const [activeTab, setActiveTab] = useState('All Leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [assignModalLead, setAssignModalLead] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState('new');
  const [showFiltersMenu, setShowFiltersMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Newest First');
  const [showManualEntryMenu, setShowManualEntryMenu] = useState(false);
  const [manualEntryForm, setManualEntryForm] = useState({
    name: '', email: '', phone: '', interest: 'Adventure', message: ''
  });
  const [agentForm, setAgentForm] = useState({
    whatsapp: '',
    region: 'North India',
    assignedDate: new Date().toISOString().split('T')[0],
    status: 'Assigned'
  });

  useEffect(() => {
    fetchLeads();
    fetchAgents();
  }, []);

  const fetchLeads = () => {
    fetch('http://localhost:3001/api/leads')
      .then(res => res.json())
      .then(data => setLeads(data))
      .catch(err => console.error("Error fetching leads:", err));
  };
  
  const fetchAgents = () => {
    fetch('http://localhost:3001/api/agents')
      .then(res => res.json())
      .then(data => setAgents(data))
      .catch(err => console.error("Error fetching agents:", err));
  };

  const handleAssignSubmit = async () => {
    try {
      let finalAgentId = selectedAgentId;
      
      if (selectedAgentId === 'new') {
        const agRes = await fetch('http://localhost:3001/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
             name: agentForm.name,
             agencyName: agentForm.agencyName,
             email: agentForm.email,
             whatsapp: agentForm.whatsapp,
             region: agentForm.region
          })
        });
        const agData = await agRes.json();
        finalAgentId = agData.id;
        setAgents([...agents, agData]);
      }

      await fetch(`http://localhost:3001/api/leads/${assignModalLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           status: agentForm.status,
           agentId: finalAgentId,
           assignedDate: agentForm.assignedDate
        })
      });

      fetchLeads();
      setAssignModalLead(null);
      // Reset Form just in case
      setAgentForm({ ...agentForm, name: '', agencyName: '', email: '', whatsapp: '' });
      setSelectedAgentId('new');
    } catch (error) {
       console.error("Assignment failed", error);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    fetch(`http://localhost:3001/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    .then(res => res.json())
    .then(updatedLead => {
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    })
    .catch(err => console.error("Error updating lead:", err));
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Interest', 'Status', 'CreatedAt'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        lead.id,
        `"${lead.userName || lead.name || ''}"`,
        `"${lead.email || ''}"`,
        `"${lead.phone || ''}"`,
        `"${lead.userInterest || lead.interest || ''}"`,
        lead.status || 'New',
        lead.createdAt || lead.created || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `wanderlust_leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleManualEntrySubmit = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: manualEntryForm.name,
          email: manualEntryForm.email,
          phone: manualEntryForm.phone,
          interest: manualEntryForm.interest,
          message: manualEntryForm.message
        })
      });
      const newLead = await res.json();
      setLeads([newLead, ...leads]);
      setShowManualEntryMenu(false);
      setManualEntryForm({ name: '', email: '', phone: '', interest: 'Adventure', message: '' });
    } catch (err) {
      console.error("Failed to add manual lead", err);
    }
  };

  const newCount = leads.filter(l => l.status === 'New').length;
  const contactedCount = leads.filter(l => l.status === 'Contacted').length;
  const bookedCount = leads.filter(l => l.status === 'Booked').length;
  const tabs = ['All Leads', `New (${newCount})`, `Contacted (${contactedCount})`, `Booked (${bookedCount})`];

  const getBadgeColors = (interest) => {
    switch (interest) {
      case 'Adventure': return 'bg-orange-100 text-orange-700';
      case 'Luxury': return 'bg-purple-100 text-purple-700';
      case 'Cultural': return 'bg-green-100 text-green-700';
      case 'Photography': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'New': return { dot: 'bg-blue-600', text: 'text-blue-600', label: 'New' };
      case 'Contacted': return { dot: 'bg-orange-500', text: 'text-orange-500', label: 'Contacted' };
      case 'Booked': return { dot: 'bg-green-600', text: 'text-green-600', label: 'Booked' };
      default: return { dot: 'bg-slate-500', text: 'text-slate-500', label: status };
    }
  };

  return (
    <div className="min-h-[100vh] bg-[#f8fafc] font-sans overflow-y-auto" data-page="admin_chatbot_lead_management">
      {/* Top Navigation */}
      <header className="bg-white px-6 h-16 flex items-center justify-between sticky top-0 z-10 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-8 h-full">
          {/* Logo */}
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#0a6c75] rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[20px]">smart_toy</span>
            </div>
            <span className="text-[#0a6c75] font-extrabold text-[17px] tracking-tight">WanderBot Admin</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-7 h-full">
            <Link to="/admin" className="text-slate-500 text-[13px] font-bold tracking-wide hover:text-slate-800 h-full flex items-center pt-0.5">Dashboard</Link>
            <Link to="/admin/leads" className="text-[#0a6c75] text-[13px] font-bold tracking-wide border-b-[3px] border-[#0a6c75] h-full flex items-center pt-[5px]">Leads</Link>
            <Link to="/admin" className="text-slate-500 text-[13px] font-bold tracking-wide hover:text-slate-800 h-full flex items-center pt-0.5">Tours</Link>
            <Link to="/admin/bookings" className="text-slate-500 text-[13px] font-bold tracking-wide hover:text-slate-800 h-full flex items-center pt-0.5">Bookings</Link>
            <Link to="/admin/queries" className="text-slate-500 text-[13px] font-bold tracking-wide hover:text-slate-800 h-full flex items-center pt-0.5">Queries</Link>
            <Link to="/admin/guides/new" className="text-slate-500 text-[13px] font-bold tracking-wide hover:text-slate-800 h-full flex items-center pt-0.5">Write a Blog</Link>
            <Link to="/admin/categorization" className="text-slate-500 text-[13px] font-bold tracking-wide hover:text-slate-800 h-full flex items-center pt-0.5">Categorization</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group/search hidden md:block mr-2">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#f1f5f9] border border-transparent focus:bg-white focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] rounded-md text-[13px] w-64 placeholder:text-slate-400 font-medium outline-none transition-all" 
            />
          </div>
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f1f5f9] text-[#0f766e] hover:bg-[#e2e8f0] transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#e6f2f2] text-[#0f766e] hover:bg-teal-100 transition-colors">
            <span className="material-symbols-outlined text-[20px]">person</span>
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 cursor-pointer ml-1">
             <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 py-10 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0a6c75] tracking-tight">Chatbot Lead Management</h1>
            <p className="text-slate-500 text-[15px] font-medium mt-1.5">Real-time performance metrics and lead distribution for WanderBot conversions.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#eefaf9] text-[#0f766e] font-bold hover:bg-teal-50 transition-colors text-[13px]">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export CSV
            </button>
            <button onClick={() => setShowManualEntryMenu(true)} className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0a6c75] text-white font-bold hover:bg-[#07565e] transition-colors text-[13px] shadow-sm">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Manual Entry
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-[14px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-400 text-[11px] font-extrabold tracking-widest uppercase">Total Leads</span>
              <span className="bg-[#ccfbf1] text-[#0f766e] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">+14.2%</span>
            </div>
            <div>
              <div className="text-[34px] leading-none font-extrabold text-[#0a6c75] mb-2 tracking-tight">{leads.length}</div>
              <p className="text-slate-400 text-[12px] font-medium">Last 30 days vs previous period</p>
            </div>
          </div>

          <div className="bg-white rounded-[14px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-400 text-[11px] font-extrabold tracking-widest uppercase">Conversion Rate</span>
              <span className="bg-[#ccfbf1] text-[#0f766e] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">+2.4%</span>
            </div>
            <div>
              <div className="text-[34px] leading-none font-extrabold text-[#0a6c75] mb-2 tracking-tight">
                 {leads.length > 0 ? Math.round((bookedCount / leads.length) * 100) : 0}%
              </div>
              <p className="text-slate-400 text-[12px] font-medium">Session to Lead acquisition</p>
            </div>
          </div>

          <div className="bg-white rounded-[14px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-400 text-[11px] font-extrabold tracking-widest uppercase">Top Theme</span>
              <span className="text-[#0d9488] text-[11px] font-extrabold">Trending</span>
            </div>
            <div>
              <div className="text-[34px] leading-none font-extrabold text-[#0a6c75] mb-2 tracking-tight">Adventure</div>
              <p className="text-slate-400 text-[12px] font-medium">42% of total requested interests</p>
            </div>
          </div>
        </div>

        {/* Pipeline Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <h2 className="text-[22px] font-extrabold text-[#1e293b]">Active Pipeline</h2>
          <div className="flex gap-2 relative">
            <button 
              onClick={() => { setShowFiltersMenu(!showFiltersMenu); setShowSortMenu(false); }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-bold text-[#0a6c75] hover:bg-slate-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <span className="material-symbols-outlined text-[17px]">filter_list</span> Filters {selectedFilter !== 'All' && <span className="w-2 h-2 rounded-full bg-orange-500"></span>}
            </button>
            
            {showFiltersMenu && (
              <div className="absolute top-12 left-0 w-48 bg-white border border-slate-200 shadow-lg rounded-lg z-20 py-2">
                <div className="px-4 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Assignment</div>
                <button onClick={() => { setSelectedFilter('All'); setShowFiltersMenu(false); }} className={`w-full text-left px-4 py-2 text-[13px] font-bold hover:bg-slate-50 ${selectedFilter === 'All' ? 'text-[#0a6c75]' : 'text-slate-700'}`}>All Leads</button>
                <button onClick={() => { setSelectedFilter('Assigned'); setShowFiltersMenu(false); }} className={`w-full text-left px-4 py-2 text-[13px] font-bold hover:bg-slate-50 ${selectedFilter === 'Assigned' ? 'text-[#0a6c75]' : 'text-slate-700'}`}>Assigned to Agent</button>
                <button onClick={() => { setSelectedFilter('Unassigned'); setShowFiltersMenu(false); }} className={`w-full text-left px-4 py-2 text-[13px] font-bold hover:bg-slate-50 ${selectedFilter === 'Unassigned' ? 'text-[#0a6c75]' : 'text-slate-700'}`}>Unassigned</button>
              </div>
            )}

            <button 
              onClick={() => { setShowSortMenu(!showSortMenu); setShowFiltersMenu(false); }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-bold text-[#0a6c75] hover:bg-slate-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <span className="material-symbols-outlined text-[17px]">sort</span> Sort
            </button>
            
            {showSortMenu && (
              <div className="absolute top-12 right-0 w-48 bg-white border border-slate-200 shadow-lg rounded-lg z-20 py-2">
                <div className="px-4 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Order By</div>
                <button onClick={() => { setSelectedSort('Newest First'); setShowSortMenu(false); }} className={`w-full text-left px-4 py-2 text-[13px] font-bold hover:bg-slate-50 ${selectedSort === 'Newest First' ? 'text-[#0a6c75]' : 'text-slate-700'}`}>Newest First</button>
                <button onClick={() => { setSelectedSort('Oldest First'); setShowSortMenu(false); }} className={`w-full text-left px-4 py-2 text-[13px] font-bold hover:bg-slate-50 ${selectedSort === 'Oldest First' ? 'text-[#0a6c75]' : 'text-slate-700'}`}>Oldest First</button>
                <button onClick={() => { setSelectedSort('Name A-Z'); setShowSortMenu(false); }} className={`w-full text-left px-4 py-2 text-[13px] font-bold hover:bg-slate-50 ${selectedSort === 'Name A-Z' ? 'text-[#0a6c75]' : 'text-slate-700'}`}>Name A-Z</button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6 gap-8 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[13px] font-extrabold whitespace-nowrap transition-colors ${activeTab === tab ? 'text-[#0a6c75] border-b-[3px] border-[#0a6c75]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-2 mb-6 overscroll-x-auto overflow-hidden">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mr-2 shrink-0">Filter by Region:</span>
          {['All Regions', 'North India', 'South India', 'East India', 'West India', 'Central India', 'Northeast India'].map(region => (
            <button 
              key={region}
              onClick={() => setSelectedFilter(region)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all whitespace-nowrap ${selectedFilter === region ? 'bg-[#0a6c75] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-[#0a6c75]/30'}`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-200 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-[#0a6c75] text-[11px] font-extrabold uppercase tracking-widest">
                  <th className="px-6 py-4">Lead Name</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Tour Interest</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Chat</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.filter(lead => {
                  let matchesTab = true;
                  if (activeTab.includes('New') && lead.status !== 'New') matchesTab = false;
                  else if (activeTab.includes('Contacted') && lead.status !== 'Contacted') matchesTab = false;
                  else if (activeTab.includes('Booked') && lead.status !== 'Booked') matchesTab = false;

                  let matchesSearch = true;
                  if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    const name = lead.userName || lead.name || '';
                    const email = lead.email || '';
                    const interest = lead.userInterest || lead.interest || '';
                    matchesSearch = name.toLowerCase().includes(q) || 
                                    email.toLowerCase().includes(q) || 
                                    interest.toLowerCase().includes(q) ||
                                    (lead.status || '').toLowerCase().includes(q);
                  }

                  if (selectedFilter === 'Assigned' && !lead.agentId) matchesSearch = false;
                  if (selectedFilter === 'Unassigned' && lead.agentId) matchesSearch = false;
                  
                  // region filter
                  const regionOptions = ['North India', 'South India', 'East India', 'West India', 'Central India', 'Northeast India'];
                  if (regionOptions.includes(selectedFilter)) {
                    const agent = agents.find(a => String(a.id) === String(lead.agentId));
                    if (!agent || agent.region !== selectedFilter) matchesSearch = false;
                  }

                  return matchesTab && matchesSearch;
                }).sort((a, b) => {
                  if (selectedSort === 'Newest First') return new Date(b.createdAt || b.created || 0) - new Date(a.createdAt || a.created || 0);
                  if (selectedSort === 'Oldest First') return new Date(a.createdAt || a.created || 0) - new Date(b.createdAt || b.created || 0);
                  if (selectedSort === 'Name A-Z') return (a.userName || a.name || '').localeCompare(b.userName || b.name || '');
                  return 0;
                }).map(lead => {
                  const statusInfo = getStatusDisplay(lead.status || 'New');
                  const name = lead.userName || lead.name || 'Unknown User';
                  const interest = lead.userInterest || lead.interest || 'General';
                  const created = lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : (lead.created || 'Recently');
                  
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-extrabold text-[14px]">{name}</span>
                          <span className="text-slate-400 text-[12px] font-medium mt-0.5">{created}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-slate-600 font-medium text-[13px]">{lead.email || 'No email provided'}</span>
                          <span className="text-slate-400 text-[12px] font-medium mt-0.5">{lead.phone || 'No phone provided'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide ${getBadgeColors(interest)}`}>
                          {interest}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-2 font-bold text-[13px] ${statusInfo.text}`}>
                          <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`}></span>
                          {statusInfo.label}
                        </span>
                        {lead.agentId && (
                           <div className="text-[11px] font-bold text-slate-500 mt-1 flex flex-col gap-0.5">
                             <div className="flex items-center gap-1">
                               <span className="material-symbols-outlined text-[13px] text-slate-400">support_agent</span>
                               {agents.find(a => String(a.id) === String(lead.agentId))?.name || 'Agent'}
                             </div>
                             <div className="flex items-center gap-1">
                               <span className="material-symbols-outlined text-[11px] text-[#0a6c75]">location_on</span>
                               <span className="text-[10px] uppercase tracking-wider text-[#0a6c75] font-black">{agents.find(a => String(a.id) === String(lead.agentId))?.region || 'Unknown'}</span>
                             </div>
                           </div>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button className="text-[#0a6c75] hover:text-teal-900 transition-colors">
                          <span className="material-symbols-outlined text-[20px]">forum</span>
                        </button>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2.5">
                          {lead.status === 'Booked' ? (
                            <>
                              <button onClick={() => alert('Lead already converted and marked as Completed.')} className="px-4 py-1.5 rounded-[6px] bg-[#eefaf9] text-[#0f766e] text-[12px] font-extrabold hover:bg-teal-100 transition-colors">Completed</button>
                              <button onClick={() => alert(`Showing detailed history for ${name}.`)} className="px-4 py-1.5 rounded-[6px] border border-slate-200 text-slate-600 bg-white text-[12px] font-extrabold hover:bg-slate-50 transition-colors">Details</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleStatusChange(lead.id, lead.status === 'New' ? 'Contacted' : 'Booked')} className="px-4 py-1.5 rounded-[6px] bg-[#0a6c75] text-white text-[12px] font-extrabold hover:bg-[#07565e] transition-colors shadow-sm bg-[#0f766e]">Follow Up</button>
                              <button onClick={() => setAssignModalLead(lead)} className="px-4 py-1.5 rounded-[6px] border border-slate-200 text-slate-600 bg-white text-[12px] font-extrabold hover:bg-slate-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">Assign</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination & Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] font-medium text-slate-500 mb-14">
          <span>Showing <strong className="text-slate-800 font-extrabold">1 to 10</strong> of 248 leads</span>
          <div className="flex items-center gap-1.5">
            <button className="w-[34px] h-[34px] flex items-center justify-center rounded-[6px] border border-slate-200 hover:bg-slate-50 transition-colors text-slate-400 bg-white"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
            <button className="w-[34px] h-[34px] flex items-center justify-center rounded-[6px] bg-[#0a6c75] text-white font-extrabold shadow-sm">1</button>
            <button className="w-[34px] h-[34px] flex items-center justify-center rounded-[6px] border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-slate-600 font-extrabold">2</button>
            <button className="w-[34px] h-[34px] flex items-center justify-center rounded-[6px] border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-slate-600 font-extrabold">3</button>
            <button className="w-[34px] h-[34px] flex items-center justify-center rounded-[6px] border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600 bg-white"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-slate-400 text-[13px] gap-4 font-medium">
          <p>&copy; 2024 Wanderlust Travel Agency. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Support Center</a>
          </div>
        </div>

        {/* Assignment Modal */}
        {assignModalLead && (
          <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-[14px] shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-[20px] font-extrabold text-[#0a6c75] tracking-tight">Assign Lead</h3>
                <button onClick={() => setAssignModalLead(null)} className="text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <p className="text-slate-500 text-[13px] font-medium mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
                You are assigning query for <strong className="text-slate-800">{assignModalLead.userName || assignModalLead.name || 'Unknown User'}</strong>.
              </p>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Select Agent</label>
                  <select 
                    value={selectedAgentId} 
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    className="w-full border border-slate-200 rounded-[8px] px-3.5 py-2.5 text-[14px] text-slate-800 font-medium focus:ring-2 focus:ring-[#0a6c75]/20 focus:border-[#0a6c75] outline-none transition-all shadow-sm"
                  >
                    <option value="new" className="font-bold text-[#0a6c75]">+ Create New Agent</option>
                    {agents.map(ag => <option key={ag.id} value={ag.id}>{ag.name} ({ag.agencyName})</option>)}
                  </select>
                </div>

                {selectedAgentId === 'new' && (
                  <div className="p-4 bg-[#f8fafc] border border-slate-200 rounded-[10px] space-y-3.5 relative overflow-hidden">
                     <div className="w-1 absolute left-0 top-0 bottom-0 bg-[#0a6c75]"></div>
                     <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">New Agent Details</h4>
                      <input type="text" placeholder="Full Name" value={agentForm.name} onChange={e => setAgentForm({...agentForm, name: e.target.value})} className="w-full border border-slate-200 rounded-[6px] px-3 py-2 text-[13px] focus:border-[#0a6c75] outline-none transition-colors" />
                     <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="Agency Name" value={agentForm.agencyName} onChange={e => setAgentForm({...agentForm, agencyName: e.target.value})} className="w-full border border-slate-200 rounded-[6px] px-3 py-2 text-[13px] focus:border-[#0a6c75] outline-none transition-colors" />
                        <select 
                          value={agentForm.region} 
                          onChange={e => setAgentForm({...agentForm, region: e.target.value})}
                          className="w-full border border-slate-200 rounded-[6px] px-3 py-2 text-[13px] focus:border-[#0a6c75] outline-none transition-colors bg-white font-bold text-[#0a6c75]"
                        >
                          <option value="North India">North India</option>
                          <option value="South India">South India</option>
                          <option value="East India">East India</option>
                          <option value="West India">West India</option>
                          <option value="Central India">Central India</option>
                          <option value="Northeast India">Northeast India</option>
                        </select>
                     </div>
                     <input type="email" placeholder="Email Address" value={agentForm.email} onChange={e => setAgentForm({...agentForm, email: e.target.value})} className="w-full border border-slate-200 rounded-[6px] px-3 py-2 text-[13px] focus:border-[#0a6c75] outline-none transition-colors" />
                     <input type="text" placeholder="WhatsApp Number" value={agentForm.whatsapp} onChange={e => setAgentForm({...agentForm, whatsapp: e.target.value})} className="w-full border border-slate-200 rounded-[6px] px-3 py-2 text-[13px] focus:border-[#0a6c75] outline-none transition-colors" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Assigned Date</label>
                    <input type="date" value={agentForm.assignedDate} onChange={e => setAgentForm({...agentForm, assignedDate: e.target.value})} className="w-full border border-slate-200 rounded-[8px] px-3.5 py-2 text-[13px] font-medium text-slate-700 focus:border-[#0a6c75] outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Query Status</label>
                    <select value={agentForm.status} onChange={e => setAgentForm({...agentForm, status: e.target.value})} className="w-full border border-slate-200 rounded-[8px] px-3.5 py-2 text-[13px] font-bold text-[#0a6c75] focus:border-[#0a6c75] outline-none">
                       <option value="Assigned">Assigned</option>
                       <option value="Contacted">Contacted</option>
                       <option value="Booked">Booked</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-slate-100">
                <button onClick={() => setAssignModalLead(null)} className="px-5 py-2.5 text-slate-500 font-extrabold text-[13px] hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleAssignSubmit} className="px-5 py-2.5 bg-[#0a6c75] text-white font-extrabold text-[13px] rounded-lg shadow-sm hover:bg-[#07565e] transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manual Entry Modal */}
        {showManualEntryMenu && (
          <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-[14px] shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
              <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-4">
                <h3 className="text-[20px] font-extrabold text-[#0a6c75] tracking-tight flex items-center gap-2">
                   <span className="material-symbols-outlined">person_add</span>
                   Add Manual Lead
                </h3>
                <button onClick={() => setShowManualEntryMenu(false)} className="text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                   <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Full Name</label>
                   <input type="text" placeholder="John Doe" value={manualEntryForm.name} onChange={e => setManualEntryForm({...manualEntryForm, name: e.target.value})} className="w-full border border-slate-200 rounded-[8px] px-3.5 py-2 text-[13px] focus:border-[#0a6c75] outline-none transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Email</label>
                     <input type="email" placeholder="john@example.com" value={manualEntryForm.email} onChange={e => setManualEntryForm({...manualEntryForm, email: e.target.value})} className="w-full border border-slate-200 rounded-[8px] px-3.5 py-2 text-[13px] focus:border-[#0a6c75] outline-none transition-colors" />
                   </div>
                   <div>
                     <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Phone Details</label>
                     <input type="tel" placeholder="+1..." value={manualEntryForm.phone} onChange={e => setManualEntryForm({...manualEntryForm, phone: e.target.value})} className="w-full border border-slate-200 rounded-[8px] px-3.5 py-2 text-[13px] focus:border-[#0a6c75] outline-none transition-colors" />
                   </div>
                </div>
                <div>
                   <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Primary Interest</label>
                   <select value={manualEntryForm.interest} onChange={e => setManualEntryForm({...manualEntryForm, interest: e.target.value})} className="w-full border border-slate-200 rounded-[8px] px-3.5 py-2 text-[13px] font-medium text-slate-800 focus:border-[#0a6c75] outline-none bg-white">
                      <option value="Adventure">Adventure</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Photography">Photography</option>
                      <option value="Wildlife">Wildlife</option>
                   </select>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Initial Message / Notes</label>
                  <textarea rows="3" placeholder="Customer requirements..." value={manualEntryForm.message} onChange={e => setManualEntryForm({...manualEntryForm, message: e.target.value})} className="w-full border border-slate-200 rounded-[8px] px-3.5 py-2.5 text-[13px] focus:border-[#0a6c75] outline-none transition-colors resize-none"></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setShowManualEntryMenu(false)} className="px-5 py-2text-slate-500 font-extrabold text-[13px] hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleManualEntrySubmit} className="px-5 py-2 bg-[#0a6c75] text-white font-extrabold text-[13px] rounded-lg shadow-sm hover:bg-[#07565e] transition-colors flex items-center gap-2">
                   Save Lead
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminChatbotLeadManagement;
