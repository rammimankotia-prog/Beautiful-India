import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminChatbotFlow = () => {
  const [flowSteps, setFlowSteps] = useState([]);
  const [manualQs, setManualQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAdminTab, setActiveAdminTab] = useState('flow'); // 'flow' or 'manual'

  useEffect(() => {
    fetchFlow();
  }, []);

  const fetchFlow = () => {
    setLoading(true);
    const flowPromise = fetch('http://localhost:3001/api/chatflow').then(res => res.json());
    const manualPromise = fetch('http://localhost:3001/api/chatbot-manual-qa').then(res => res.json()).catch(() => []);
    
    Promise.all([flowPromise, manualPromise])
      .then(([flowData, manualData]) => {
        setFlowSteps(flowData);
        setManualQs(manualData || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  };

  const saveFlow = () => {
    const endpoint = activeAdminTab === 'flow' ? 'chatflow' : 'chatbot-manual-qa';
    const dataToSend = activeAdminTab === 'flow' ? flowSteps : manualQs;

    fetch(`http://localhost:3001/api/${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend)
    })
    .then(res => res.json())
    .then(() => alert(`${activeAdminTab === 'flow' ? 'Chatflow' : 'Manual Q&A'} updated successfully!`))
    .catch(err => alert("Error saving: " + err.message));
  };

  const handleManualQChange = (index, field, value) => {
    const newQs = [...manualQs];
    newQs[index][field] = value;
    setManualQs(newQs);
  };

  const addManualQ = () => {
    setManualQs([...manualQs, { question: '', answer: '', category: 'General' }]);
  };

  const removeManualQ = (index) => {
    setManualQs(manualQs.filter((_, i) => i !== index));
  };

  const handleFlowFieldChange = (index, field, value) => {
    const newSteps = [...flowSteps];
    if (field === 'options') {
      newSteps[index].options = value.split(',').map(s => s.trim()).filter(s => s);
    } else {
      newSteps[index][field] = value;
    }
    setFlowSteps(newSteps);
  };

  const addStep = () => {
    setFlowSteps([
      ...flowSteps, 
      { id: Date.now(), questionText: "New Question...", options: [], type: 'text', required: true, mappedField: '' }
    ]);
  };

  const removeStep = (index) => {
    const newSteps = flowSteps.filter((_, i) => i !== index);
    setFlowSteps(newSteps);
  };

  const SidebarLink = ({ to, icon, label, active }) => (
    <Link 
      className={`flex items-center gap-3.5 px-4 py-3 rounded-[10px] transition-colors ${
        active 
          ? "bg-[#eefaf9] text-[#0a6c75]" 
          : "text-slate-600 hover:bg-slate-50"
      }`} 
      to={to}
    >
      <span className={`material-symbols-outlined text-[20px] ${active ? "text-[#0a6c75]" : "text-slate-500"}`}>{icon}</span>
      <span className="text-[15px] font-medium">{label}</span>
    </Link>
  );

  return (
    <div data-page="admin_chatbot_flow" className="h-screen w-full flex flex-col overflow-hidden bg-[#f4f7f6]">
       <header className="bg-white px-6 h-16 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border-4 border-[#0a6c75] border-t-transparent border-r-transparent rounded-tr-none rotate-45 flex items-center justify-center">
             <div className="w-3 h-3 bg-[#0a6c75] rounded-full"></div>
          </div>
          <span className="text-[#0a6c75] font-extrabold text-[17px] tracking-tight">Admin<span className="text-slate-900">Panel</span></span>
        </Link>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col hidden md:flex">
          <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
             <SidebarLink to="/admin/overview" icon="space_dashboard" label="Overview" />
             <SidebarLink to="/admin" icon="tour" label="Manage Tours" />
             <SidebarLink to="/admin/leads" icon="leaderboard" label="Leads Management" />
             <SidebarLink to="/admin/bookings" icon="group" label="Bookings" />
             <SidebarLink to="/admin/chatbot-flow" icon="smart_toy" label="Chatbot Flow" active />
             <SidebarLink to="/admin/themes" icon="category" label="Homepage Themes" />
             <SidebarLink to="/admin/guides" icon="map" label="Guides" />
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                           <span className="material-symbols-outlined text-3xl text-[#0a6c75]">smart_toy</span>
                           Wanderbot Intelligence Center
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Configure automated flows and manual Q&A knowledge base.</p>
                    </div>
                    <button onClick={saveFlow} className="bg-[#0a6c75] hover:bg-[#085a61] text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">save</span>
                        Save All Changes
                    </button>
                </div>

                <div className="flex border-b border-slate-200 mb-8 gap-10">
                    <button 
                        onClick={() => setActiveAdminTab('flow')}
                        className={`pb-4 text-[13px] font-black uppercase tracking-widest transition-all relative ${activeAdminTab === 'flow' ? 'text-[#0a6c75]' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Interactive Chat Flow
                        {activeAdminTab === 'flow' && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0a6c75] rounded-t-full"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveAdminTab('manual')}
                        className={`pb-4 text-[13px] font-black uppercase tracking-widest transition-all relative ${activeAdminTab === 'manual' ? 'text-[#0a6c75]' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Manual Q&A (FAQ)
                        {activeAdminTab === 'manual' && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0a6c75] rounded-t-full"></div>}
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                        <div className="w-10 h-10 border-4 border-[#0a6c75] border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-bold uppercase tracking-widest text-[11px]">Syncing with bot...</span>
                    </div>
                ) : activeAdminTab === 'flow' ? (
                    <div className="space-y-6">
                        {flowSteps.map((step, index) => (
                            <div key={step.id || index} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group">
                                <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                         <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-black text-[#0a6c75]">
                                             {index + 1}
                                         </div>
                                         <span className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Conversation Step {index + 1}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                         <label className="flex items-center gap-2 cursor-pointer">
                                             <input 
                                                type="checkbox" 
                                                checked={step.required !== false} 
                                                onChange={(e) => handleFlowFieldChange(index, 'required', e.target.checked)}
                                                className="w-4 h-4 rounded border-slate-300 text-[#0a6c75] focus:ring-[#0a6c75]" 
                                             />
                                             <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Required Field</span>
                                         </label>
                                         <button onClick={() => removeStep(index)} className="text-slate-300 hover:text-red-500 transition-colors ml-2">
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                         </button>
                                    </div>
                                </div>
                                
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bot Question / Prompt</label>
                                            <textarea 
                                                value={step.questionText}
                                                onChange={(e) => handleFlowFieldChange(index, 'questionText', e.target.value)}
                                                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0a6c75] focus:ring-1 focus:ring-[#0a6c75] resize-none h-24 text-sm font-medium"
                                                placeholder="What would you like to ask the user?"
                                            />
                                            <p className="text-[10px] text-slate-400 mt-1 italic italic">Tip: Use <code>{'{userName}'}</code> to personalize.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Input Type</label>
                                                <select 
                                                    value={step.type || 'text'}
                                                    onChange={(e) => handleFlowFieldChange(index, 'type', e.target.value)}
                                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0a6c75] text-sm font-bold text-slate-700"
                                                >
                                                    <option value="text">Text Entry</option>
                                                    <option value="options">Button Choices</option>
                                                    <option value="email">Email Address</option>
                                                    <option value="phone">Phone Number</option>
                                                    <option value="date">Date Picker</option>
                                                    <option value="number">Numeric Only</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Map to Field</label>
                                                <select 
                                                    value={step.mappedField || ''}
                                                    onChange={(e) => handleFlowFieldChange(index, 'mappedField', e.target.value)}
                                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0a6c75] text-sm font-bold text-slate-700"
                                                >
                                                    <option value="">(None - Bot Only)</option>
                                                    <option value="userName">User Full Name</option>
                                                    <option value="email">Email Address</option>
                                                    <option value="phone">Phone Number</option>
                                                    <option value="userInterest">Travel Interest</option>
                                                    <option value="departureDate">Departure Date</option>
                                                    <option value="budget">Budget Level</option>
                                                    <option value="travelers">No. of People</option>
                                                </select>
                                            </div>
                                        </div>

                                        {step.type === 'options' && (
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Options (Comma separated)</label>
                                                <input 
                                                    type="text"
                                                    value={step.options.join(', ')}
                                                    onChange={(e) => handleFlowFieldChange(index, 'options', e.target.value)}
                                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0a6c75] text-sm font-medium"
                                                    placeholder="Adventure, Romantic, Luxury..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button onClick={addStep} className="w-full bg-[#eefaf9] hover:bg-[#e4f5f3] text-[#0a6c75] font-black border-2 border-dashed border-[#0a6c75]/20 py-5 rounded-2xl transition-all flex justify-center items-center gap-3 uppercase tracking-widest text-xs">
                            <span className="material-symbols-outlined">add_circle</span> Add Conversation Step
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800">
                            <span className="material-symbols-outlined">lightbulb</span>
                            <p className="text-xs font-medium">These Q&A pairs allow the bot to answer common questions even if they aren't part of the main trip planning flow.</p>
                        </div>

                        {manualQs.map((item, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                     <div className="flex items-center gap-3">
                                         <span className="bg-[#0a6c75] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Manual Q&A</span>
                                         <input 
                                            type="text" 
                                            value={item.category || 'General'} 
                                            onChange={(e) => handleManualQChange(index, 'category', e.target.value)}
                                            className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-none bg-transparent focus:ring-0 w-32"
                                         />
                                     </div>
                                     <button onClick={() => removeManualQ(index)} className="text-slate-300 hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                     </button>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">User Might Ask:</label>
                                    <input 
                                        type="text"
                                        value={item.question}
                                        onChange={(e) => handleManualQChange(index, 'question', e.target.value)}
                                        className="w-full border-b border-slate-100 py-2 focus:outline-none focus:border-[#0a6c75] font-bold text-slate-700"
                                        placeholder="e.g. Do you provide visa assistance?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Bot Should Answer:</label>
                                    <textarea 
                                        value={item.answer}
                                        onChange={(e) => handleManualQChange(index, 'answer', e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-[#0a6c75] text-sm font-medium h-24 resize-none"
                                        placeholder="Yes, we have a dedicated team for visa documentation for all major countries..."
                                    />
                                </div>
                            </div>
                        ))}

                        <button onClick={addManualQ} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold border-2 border-dashed border-slate-300 py-5 rounded-2xl transition-colors flex justify-center items-center gap-2 uppercase tracking-widest text-[11px]">
                            <span className="material-symbols-outlined">quiz</span> Create New Q&A Pair
                        </button>
                    </div>
                )}
            </div>
        </main>
      </div>
    </div>
  );
};

export default AdminChatbotFlow;
