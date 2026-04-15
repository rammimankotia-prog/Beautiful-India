import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminChatbotFlow = () => {
  const [flowSteps, setFlowSteps] = useState([]);
  const [manualQs, setManualQs] = useState([]);
  const [settings, setSettings] = useState({ chatbotEnabled: true });
  const [loading, setLoading] = useState(true);
  const [activeAdminTab, setActiveAdminTab] = useState('flow');

  useEffect(() => {
    fetchFlow();
  }, []);

  const fetchFlow = () => {
    setLoading(true);
    const flowPromise = fetch(`${import.meta.env.BASE_URL}data/chatflow.json`).then(res => res.json());
    const manualPromise = fetch(`${import.meta.env.BASE_URL}data/manual-qa.json`).then(res => res.json()).catch(() => []);
    const settingsPromise = fetch(`${import.meta.env.BASE_URL}data/settings.json?t=${Date.now()}`).then(res => res.json()).catch(() => ({ chatbotEnabled: true }));
    
    Promise.all([flowPromise, manualPromise, settingsPromise])
      .then(([flowData, manualData, settingsData]) => {
        setFlowSteps(flowData);
        setManualQs(manualData || []);
        if (settingsData) setSettings(prev => ({ ...prev, ...settingsData }));
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  };

  const saveFlow = async () => {
    const endpoint = activeAdminTab === 'flow' ? '/api/chatflow' : '/api/manual-qa';
    const data = activeAdminTab === 'flow' ? flowSteps : manualQs;
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        alert(`${activeAdminTab === 'flow' ? 'Chatflow' : 'Manual Q&A'} updated successfully!`);
      } else {
        alert("Failed to save. Check server logs.");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Network error while saving.");
    }
  };

  const toggleChatbotEnabled = async () => {
    const newEnabled = !settings.chatbotEnabled;
    const newSettings = { ...settings, chatbotEnabled: newEnabled };
    setSettings(newSettings);
    
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/save-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (!res.ok) {
        alert("Failed to sync Master Switch. Status: " + res.status);
        console.error("Save error text:", await res.text());
      }
    } catch (err) {
      console.error("Settings save error:", err);
      alert("Network error while syncing Master Switch.");
    }
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
      { id: Date.now(), questionText: "New Question...", options: [], type: 'text', required: true, mappedField: '', action: 'NONE' }
    ]);
  };

  const removeStep = (index) => {
    setFlowSteps(flowSteps.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1200px] mx-auto space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-3xl text-[#0a6c75]">smart_toy</span>
              <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Bharat Bot Intelligence</h1>
           </div>
           <p className="text-slate-500 dark:text-slate-400 font-bold italic">Command center for your AI travel assistant.</p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 pl-4 pr-3 rounded-2xl shadow-sm">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500 mr-4">Master Switch</span>
                <button 
                  onClick={toggleChatbotEnabled}
                  className={`w-16 h-8 rounded-full transition-colors flex items-center p-1 cursor-pointer outline-none ${settings.chatbotEnabled !== false ? 'bg-[#0a6c75]' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                    <div className={`w-6 h-6 bg-white rounded-full transition-transform shadow-md flex items-center justify-center ${settings.chatbotEnabled !== false ? 'translate-x-8' : 'translate-x-0'}`}>
                        <span className={`material-symbols-outlined text-[14px] ${settings.chatbotEnabled !== false ? 'text-[#0a6c75]' : 'text-slate-400'}`}>
                            {settings.chatbotEnabled !== false ? 'check' : 'close'}
                        </span>
                    </div>
                </button>
            </div>
            
            <button onClick={saveFlow} className="bg-[#0a6c75] hover:bg-[#085a62] text-white font-black py-3 px-8 rounded-2xl transition-all shadow-lg flex items-center gap-2 text-sm uppercase tracking-widest active:scale-95">
                <span className="material-symbols-outlined text-[20px]">verified</span>
                Commit Intelligence
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 gap-12">
        {['flow', 'manual'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveAdminTab(tab)}
            className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeAdminTab === tab ? 'text-[#0a6c75]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tab === 'flow' ? 'Core Decision Tree' : 'Knowledge Base (FAQ)'}
            {activeAdminTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0a6c75] rounded-t-full"></div>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center gap-4 text-slate-400">
          <div className="w-10 h-10 border-4 border-slate-100 border-t-[#0a6c75] rounded-full animate-spin"></div>
          <p className="font-black text-[10px] uppercase tracking-widest italic">Syncing neural paths...</p>
        </div>
      ) : activeAdminTab === 'flow' ? (
        <div className="space-y-8">
           {flowSteps.map((step, index) => (
             <div key={step.id || index} className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:border-teal-100 dark:hover:border-teal-900 group">
                <div className="px-8 py-5 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center font-black text-[#0a6c75] shadow-sm italic text-lg">
                        {index + 1}
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Flow Phase</span>
                   </div>
                   <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={step.required !== false} onChange={(e) => handleFlowFieldChange(index, 'required', e.target.checked)} className="w-4 h-4 rounded-[4px] border-slate-200 text-[#0a6c75] focus:ring-0" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mandatory</span>
                      </label>
                      <button onClick={() => removeStep(index)} className="text-slate-300 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                   </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <label className="text-[9px] font-black text-[#0a6c75] uppercase tracking-[0.3em] ml-1">Bot Prompt</label>
                      <textarea 
                        value={step.questionText}
                        onChange={(e) => handleFlowFieldChange(index, 'questionText', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-5 text-sm font-bold min-h-[120px] outline-none focus:ring-2 focus:ring-teal-500/20"
                        placeholder="What should Bharat Bot say here?"
                      />
                   </div>
                   <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Response Type</label>
                          <select value={step.type || 'text'} onChange={(e) => handleFlowFieldChange(index, 'type', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-black uppercase tracking-widest appearance-none cursor-pointer">
                            <option value="text">Free Text</option>
                            <option value="options">Selection Chips</option>
                            <option value="email">Email Verified</option>
                            <option value="phone">Phone Verified</option>
                            <option value="date">Calendar UI</option>
                            <option value="number">Numeric Range</option>
                          </select>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Data Key</label>
                          <select value={step.mappedField || ''} onChange={(e) => handleFlowFieldChange(index, 'mappedField', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-black uppercase tracking-widest appearance-none cursor-pointer">
                            <option value="">Bot Dialogue</option>
                            <option value="userName">Full Name</option>
                            <option value="userInterest">Interests</option>
                            <option value="budget">Budget Tier</option>
                            <option value="travelers">Head Count</option>
                            <option value="duration">Travel Duration</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] ml-1">Intelligent Action</label>
                            <select value={step.action || 'NONE'} onChange={(e) => handleFlowFieldChange(index, 'action', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-black uppercase tracking-widest appearance-none cursor-pointer text-primary">
                                <option value="NONE">No Action</option>
                                <option value="RECOMMEND_TOURS">Suggest Flagship Tours</option>
                                <option value="SAVE_LEAD">Save Priority Lead</option>
                                <option value="FINISH">End Conversation</option>
                            </select>
                        </div>
                      </div>
                      {step.type === 'options' && (
                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-[#0a6c75] uppercase tracking-[0.2em] ml-1">Chip Options (Comma Separated)</label>
                          <input type="text" value={step.options.join(', ')} onChange={(e) => handleFlowFieldChange(index, 'options', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold" placeholder="Adventure, Luxury, Religious..." />
                        </div>
                      )}
                   </div>
                </div>
             </div>
           ))}
           <button onClick={addStep} className="w-full py-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px] text-slate-400 hover:text-[#0a6c75] hover:border-[#0a6c75] hover:bg-[#0a6c75]/5 transition-all flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-3xl">add_circle</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Append Conversation Node</span>
           </button>
        </div>
      ) : (
        <div className="space-y-8">
           {manualQs.map((item, index) => (
             <div key={index} className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-8 space-y-6">
                <div className="flex justify-between items-center">
                   <input type="text" value={item.category || 'General'} onChange={(e) => handleManualQChange(index, 'category', e.target.value)} className="text-[10px] font-black text-[#0a6c75] uppercase tracking-[0.4em] bg-transparent border-none p-0 focus:ring-0 w-40" />
                   <button onClick={() => removeManualQ(index)} className="text-slate-300 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
                </div>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Example Inquiry</label>
                      <input type="text" value={item.question} onChange={(e) => handleManualQChange(index, 'question', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm font-bold" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Standardized Response</label>
                      <textarea value={item.answer} onChange={(e) => handleManualQChange(index, 'answer', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-5 text-sm font-medium h-24 outline-none focus:ring-2 focus:ring-teal-500/20" />
                   </div>
                </div>
             </div>
           ))}
           <button onClick={addManualQ} className="w-full py-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px] text-slate-400 hover:text-slate-600 transition-all flex items-center justify-center gap-3">
              <span className="material-symbols-outlined italic">quiz</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Add Intelligence Entry</span>
           </button>
        </div>
      )}
    </div>
  );
};

export default AdminChatbotFlow;
