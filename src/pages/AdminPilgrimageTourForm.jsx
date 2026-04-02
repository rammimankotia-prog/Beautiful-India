import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const initialFormState = {
    title: '',
    slug: '',
    content: '',
    status: 'draft',
    tour_destination: [],
    tour_type: [],
    price: '',
    tour_price_single: '',
    tour_price_couple: '',
    tour_price_group: '',
    tour_dates_start: '',
    tour_dates_end: '',
    tour_dates_ongoing: 'false',
    tour_city_path: '',
    tour_gallery: [],
    tour_itinerary: []
};

const AdminPilgrimageTourForm = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    
    // Editor State
    const [editorMode, setEditorMode] = useState('html'); // 'html' | 'visual'
    const editorRef = useRef(null);

    // Gallery State
    const [newImage, setNewImage] = useState('');

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'master_admin')) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (slug) {
            setLoading(true);
            fetch(`${import.meta.env.BASE_URL}data/pk_pilgrimage_tours.json?t=${Date.now()}`)
                .then(res => res.json())
                .then(data => {
                    const found = data.find(t => t.slug === slug);
                    if (found) setFormData({ ...initialFormState, ...found });
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [slug]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const generateSlug = (text) => {
        return text.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e) => {
        const val = e.target.value;
        if (!slug) {
            setFormData(prev => ({ ...prev, title: val, slug: generateSlug(val) }));
        } else {
            handleChange('title', val);
        }
    };

    // --- Dual Mode Editor ---
    const execCommand = (command, value = null) => {
        if (editorMode === 'visual') {
            document.execCommand(command, false, value);
            if (editorRef.current) {
                handleChange('content', editorRef.current.innerHTML);
            }
        }
    };

    const handleVisualInput = () => {
        if (editorRef.current) {
            handleChange('content', editorRef.current.innerHTML);
        }
    };

    useEffect(() => {
        if (editorMode === 'visual' && editorRef.current) {
            if (editorRef.current.innerHTML !== formData.content) {
                editorRef.current.innerHTML = formData.content;
            }
        }
    }, [editorMode]);

    // --- Gallery Drag & Drop ---
    const addImage = () => {
        if (newImage && newImage.trim() !== '') {
            setFormData(prev => ({ ...prev, tour_gallery: [...prev.tour_gallery, newImage.trim()] }));
            setNewImage('');
        }
    };

    const removeImage = (index) => {
        const arr = [...formData.tour_gallery];
        arr.splice(index, 1);
        handleChange('tour_gallery', arr);
    };

    const updateImage = (index, value) => {
        const arr = [...formData.tour_gallery];
        arr[index] = value;
        handleChange('tour_gallery', arr);
    };

    const handleDragStart = (e, index) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData('imageIndex', index.toString());
        e.target.style.opacity = '0.4';
    };

    const handleDragEnd = (e) => {
         e.target.style.opacity = '1';
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        const sourceIndex = parseInt(e.dataTransfer.getData('imageIndex'), 10);
        if (sourceIndex === targetIndex || isNaN(sourceIndex)) return;

        const newGallery = [...formData.tour_gallery];
        const [movedItem] = newGallery.splice(sourceIndex, 1);
        newGallery.splice(targetIndex, 0, movedItem);
        handleChange('tour_gallery', newGallery);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = "move";
    };

    // --- Itinerary ---
    const addItineraryDay = () => {
        setFormData(prev => ({
            ...prev,
            tour_itinerary: [...prev.tour_itinerary, { day: prev.tour_itinerary.length + 1, title: '', description: '' }]
        }));
    };

    const removeItineraryDay = (index) => {
        const arr = [...formData.tour_itinerary];
        arr.splice(index, 1);
        // reindex
        arr.forEach((item, i) => item.day = i + 1);
        handleChange('tour_itinerary', arr);
    };

    const updateItineraryDay = (index, field, value) => {
        const arr = [...formData.tour_itinerary];
        arr[index][field] = value;
        handleChange('tour_itinerary', arr);
    };

    // --- Array Fields Helper ---
    const handleArrayInput = (field, evtValue) => {
        const arr = evtValue.split(',').map(s => s.trim()).filter(Boolean);
        handleChange(field, arr);
    };

    // --- Save ---
    const handleSave = async () => {
        if (!formData.title || !formData.slug) {
            alert('Title and slug are required.');
            return;
        }

        setSaving(true);
        try {
            const dataToSave = {
                ...formData,
                lastModified: new Date().toISOString(),
                created: formData.created || new Date().toISOString()
            };

            const res = await fetch(`${import.meta.env.BASE_URL}api-save-pk-pilgrimages.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave)
            });

            if (!res.ok) throw new Error('Failed to save data');
            alert('Yatra saved successfully!');
            navigate('/admin/pilgrimages');
        } catch (error) {
            console.error('Error saving yatra:', error);
            alert('Failed to save Yatra.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Devotional Journey...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20 p-6 lg:p-10 animate-in fade-in duration-500">
                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 shadow-sm border-t-4 border-[#0a6c75]">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                            {slug ? `Edit Yatra: ${formData.title}` : 'Create New Sacred Yatra'}
                        </h1>
                        <p className="text-slate-500 font-medium text-sm mt-1">Standalone Pilgrimage Module Editor</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select 
                            value={formData.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                            className={`px-4 py-2.5 rounded-xl font-bold uppercase tracking-widest text-xs outline-none transition-colors ${formData.status === 'publish' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}
                        >
                            <option value="draft">Draft</option>
                            <option value="publish">Publish</option>
                        </select>
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-8 py-3 bg-[#0a6c75] hover:bg-[#005a63] text-white rounded-xl font-bold transition-all disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">{saving ? 'hourglass_empty' : 'save'}</span>
                            {saving ? 'Saving...' : 'Save Yatra'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Primary Column */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Core Info */}
                        <div className="glass-panel p-6 space-y-6">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">Core Identity</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Yatra Title *</label>
                                    <input 
                                        type="text" 
                                        value={formData.title} 
                                        onChange={handleTitleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-serif font-black text-xl outline-none focus:border-[#0a6c75] text-slate-800 dark:text-white"
                                        placeholder="E.g., Complete Chardham Yatra 2026"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">URL Slug *</label>
                                    <input 
                                        type="text" 
                                        value={formData.slug} 
                                        onChange={(e) => handleChange('slug', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 font-mono text-sm outline-none focus:border-[#0a6c75] text-slate-600 dark:text-slate-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Base Price / Starting Price (₹) *</label>
                                    <input 
                                        type="number" 
                                        value={formData.price || ''} 
                                        onChange={(e) => handleChange('price', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 font-mono text-sm outline-none focus:border-[#0a6c75] text-slate-600 dark:text-slate-300"
                                        placeholder="e.g. 25000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dual-Mode Editor */}
                        <div className="glass-panel p-6 space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Content Engine</h2>
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                                    <button 
                                        onClick={() => setEditorMode('visual')}
                                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${editorMode === 'visual' ? 'bg-white shadow dark:bg-slate-700 text-[#0a6c75]' : 'text-slate-500'}`}
                                    >
                                        Visual
                                    </button>
                                    <button 
                                        onClick={() => setEditorMode('html')}
                                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${editorMode === 'html' ? 'bg-white shadow dark:bg-slate-700 text-[#0a6c75]' : 'text-slate-500'}`}
                                    >
                                        Raw HTML
                                    </button>
                                </div>
                            </div>

                            {editorMode === 'visual' && (
                                <div className="flex flex-wrap gap-2 mb-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <button onClick={() => execCommand('bold')} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 hover:bg-slate-200 rounded shadow-sm"><span className="font-bold">B</span></button>
                                    <button onClick={() => execCommand('italic')} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 hover:bg-slate-200 rounded shadow-sm"><span className="italic">I</span></button>
                                    <button onClick={() => execCommand('underline')} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 hover:bg-slate-200 rounded shadow-sm"><span className="underline">U</span></button>
                                    <div className="w-px h-8 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                                    <button onClick={() => execCommand('formatBlock', 'H2')} className="px-2 h-8 flex items-center justify-center bg-white dark:bg-slate-700 hover:bg-slate-200 rounded shadow-sm text-xs font-bold">H2</button>
                                    <button onClick={() => execCommand('formatBlock', 'H3')} className="px-2 h-8 flex items-center justify-center bg-white dark:bg-slate-700 hover:bg-slate-200 rounded shadow-sm text-xs font-bold">H3</button>
                                    <div className="w-px h-8 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                                    <button onClick={() => execCommand('insertUnorderedList')} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 hover:bg-slate-200 rounded shadow-sm"><span className="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
                                    <button onClick={() => execCommand('createLink', prompt('URL:'))} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 hover:bg-slate-200 rounded shadow-sm"><span className="material-symbols-outlined text-[18px]">link</span></button>
                                </div>
                            )}

                            {editorMode === 'html' ? (
                                <textarea 
                                    className="w-full h-80 bg-slate-800 text-green-400 font-mono text-sm p-4 rounded-xl outline-none focus:ring-2 ring-[#0a6c75]"
                                    value={formData.content}
                                    onChange={(e) => handleChange('content', e.target.value)}
                                    placeholder="<p>Enter your HTML here...</p>"
                                />
                            ) : (
                                <div 
                                    ref={editorRef}
                                    contentEditable
                                    onInput={handleVisualInput}
                                    className="w-full min-h-[320px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 outline-none focus:border-[#0a6c75] prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300"
                                    suppressContentEditableWarning
                                />
                            )}
                        </div>

                        {/* Itinerary Matrix */}
                        <div className="glass-panel p-6 space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Daily Itinerary</h2>
                                <button onClick={addItineraryDay} className="flex items-center gap-1 text-[#0a6c75] hover:text-teal-700 font-bold text-xs uppercase cursor-pointer bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full">
                                    <span className="material-symbols-outlined text-[16px]">add</span> Add Day
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {formData.tour_itinerary.map((day, idx) => (
                                    <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-3 relative group">
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => removeItineraryDay(idx)} className="text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/30 p-1 rounded-md"><span className="material-symbols-outlined text-[18px]">close</span></button>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#0a6c75] text-white rounded-lg flex items-center justify-center font-black text-xl shadow-md">
                                                {day.day}
                                            </div>
                                            <div className="flex-1">
                                                <input 
                                                    type="text" 
                                                    value={day.title}
                                                    onChange={(e) => updateItineraryDay(idx, 'title', e.target.value)}
                                                    placeholder="Day Title (e.g. Arrival in Haridwar)"
                                                    className="w-full bg-transparent border-b border-slate-300 dark:border-slate-600 px-2 py-1 font-bold text-slate-800 dark:text-white outline-none focus:border-[#0a6c75]"
                                                />
                                            </div>
                                        </div>
                                        <textarea 
                                            value={day.description}
                                            onChange={(e) => updateItineraryDay(idx, 'description', e.target.value)}
                                            placeholder="HTML Description of activities..."
                                            className="w-full h-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-[#0a6c75] mt-2 font-mono text-slate-600 dark:text-slate-400"
                                        />
                                    </div>
                                ))}
                                {formData.tour_itinerary.length === 0 && (
                                    <div className="text-center py-6 text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                        No itinerary defined. Click "Add Day" to begin.
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Secondary Column */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* Categorization & Location */}
                        <div className="glass-panel p-6 space-y-4">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">Taxonomies & Routing</h2>
                            
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Destinations (Comma separated)</label>
                                <input 
                                    type="text" 
                                    value={formData.tour_destination.join(', ')} 
                                    onChange={(e) => handleArrayInput('tour_destination', e.target.value)}
                                    placeholder="Uttarakhand, Haridwar"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#0a6c75] text-slate-600 dark:text-slate-300"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tour Types (Comma separated)</label>
                                <input 
                                    type="text" 
                                    value={formData.tour_type.join(', ')} 
                                    onChange={(e) => handleArrayInput('tour_type', e.target.value)}
                                    placeholder="Chardham, Heritage"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#0a6c75] text-slate-600 dark:text-slate-300"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">City Route Path (Iterative)</label>
                                <textarea 
                                    value={formData.tour_city_path} 
                                    onChange={(e) => handleChange('tour_city_path', e.target.value)}
                                    placeholder="Haridwar, Barkot, Uttarkashi, Guptkashi, Badrinath"
                                    className="w-full h-16 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#0a6c75] text-slate-600 dark:text-slate-300"
                                />
                                <p className="text-[10px] text-slate-400 mt-1">Comma mapped for map visualization.</p>
                            </div>
                        </div>

                        {/* Logistics */}
                        <div className="glass-panel p-6 space-y-4">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">Logistics & Economics</h2>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Single Price</label>
                                    <input 
                                        type="number" 
                                        value={formData.tour_price_single} 
                                        onChange={(e) => handleChange('tour_price_single', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0a6c75]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Couple Price</label>
                                    <input 
                                        type="number" 
                                        value={formData.tour_price_couple} 
                                        onChange={(e) => handleChange('tour_price_couple', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0a6c75]"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Group Rate Price</label>
                                    <input 
                                        type="number" 
                                        value={formData.tour_price_group} 
                                        onChange={(e) => handleChange('tour_price_group', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0a6c75]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox"
                                            checked={formData.tour_dates_ongoing === 'true'}
                                            onChange={(e) => handleChange('tour_dates_ongoing', e.target.checked ? 'true' : 'false')}
                                            className="w-4 h-4 text-[#0a6c75] rounded border-slate-300"
                                        />
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Daily / Flexible Departures</span>
                                    </label>
                                </div>

                                {formData.tour_dates_ongoing !== 'true' && (
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-bold text-slate-500 mb-1">Start Date</label>
                                            <input 
                                                type="date" 
                                                value={formData.tour_dates_start} 
                                                onChange={(e) => handleChange('tour_dates_start', e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-[11px] outline-none"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-bold text-slate-500 mb-1">End Date</label>
                                            <input 
                                                type="date" 
                                                value={formData.tour_dates_end} 
                                                onChange={(e) => handleChange('tour_dates_end', e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-[11px] outline-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Gallery Array Manager */}
                        <div className="glass-panel p-6 space-y-4">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">Media Gallery Engine</h2>
                            
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    value={newImage}
                                    onChange={(e) => setNewImage(e.target.value)}
                                    placeholder="Image URL"
                                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0a6c75]"
                                />
                                <button onClick={addImage} className="bg-[#0a6c75] text-white px-3 py-2 rounded-lg font-bold hover:bg-[#005a63] transition-colors"><span className="material-symbols-outlined text-[20px]">add</span></button>
                            </div>

                            <p className="text-[10px] text-slate-400">Drag to reorder. Index 0 is the featured cover image.</p>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                {formData.tour_gallery.map((img, idx) => (
                                    <div 
                                        key={`${img}-${idx}`} 
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, idx)}
                                        onDragEnd={handleDragEnd}
                                        onDrop={(e) => handleDrop(e, idx)}
                                        onDragOver={handleDragOver}
                                        className="flex items-center gap-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2 cursor-move hover:border-[#0a6c75] transition-colors"
                                    >
                                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={img} alt="thumb" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <input 
                                                type="text" 
                                                value={img} 
                                                onChange={(e) => updateImage(idx, e.target.value)}
                                                className="w-full bg-transparent text-xs font-mono text-slate-700 dark:text-slate-300 outline-none border-b border-transparent focus:border-[#0a6c75] transition-colors py-1"
                                            />
                                        </div>
                                        <button onClick={() => removeImage(idx)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg shrink-0">
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                        <div className="w-6 flex items-center justify-center text-slate-300">
                                            <span className="material-symbols-outlined">drag_indicator</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
    );
};

export default AdminPilgrimageTourForm;
