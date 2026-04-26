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
    tour_itinerary: [],
    tour_transport: [],
    tour_hotels: [],
    tour_meals: []
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
    const [uploadQueue, setUploadQueue] = useState([]); // { id, file, name, progress, status, error }
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingValue, setEditingValue] = useState('');

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'master_admin')) {
            navigate('/');
        }
    }, [user, navigate]);

    const mapNestedToFlatten = (nested) => ({
        ...initialFormState,
        id: nested.id,
        title: nested.title,
        slug: nested.slug,
        content: nested.content?.visual_html || '',
        status: nested.status,
        tour_destination: nested.taxonomies?.destination ? [nested.taxonomies.destination] : [],
        tour_type: nested.taxonomies?.type ? [nested.taxonomies.type] : [],
        tour_price_single: nested.meta?.price_single || '',
        tour_price_couple: nested.meta?.price_couple || '',
        tour_price_group: nested.meta?.price_group || '',
        tour_dates_ongoing: nested.meta?.is_ongoing ? 'true' : 'false',
        tour_city_path: nested.meta?.city_path || '',
        tour_transport: nested.meta?.transport_options || [],
        tour_hotels: nested.meta?.hotel_options || [],
        tour_meals: nested.meta?.meal_options || [],
        tour_gallery: nested.gallery || [],
        tour_itinerary: nested.itinerary || [],
        created: nested.createdAt
    });

    useEffect(() => {
        if (slug) {
            setLoading(true);
            fetch(`${import.meta.env.BASE_URL}data/pk_pilgrimage_tours.json?t=${Date.now()}`)
                .then(res => res.json())
                .then(data => {
                    const cleanParamSlug = (slug || '').replace(/\/$/, '').toLowerCase();
                    const found = data.find(t => (t.slug || '').replace(/\/$/, '').toLowerCase() === cleanParamSlug);
                    if (found) setFormData(mapNestedToFlatten(found));
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

    // Sync visual editor when switching TO visual mode
    useEffect(() => {
        if (editorMode === 'visual' && editorRef.current) {
            editorRef.current.innerHTML = formData.content || '';
        }
    }, [editorMode]);

    // Also sync visual editor when async data loads (editing existing tour)
    useEffect(() => {
        if (editorMode === 'visual' && editorRef.current) {
            // Only update if editor is NOT focused (user isn't typing)
            if (document.activeElement !== editorRef.current) {
                editorRef.current.innerHTML = formData.content || '';
            }
        }
    }, [formData.content]);

    // --- Gallery: URL add ---
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

    // --- Gallery: Reorder Drag & Drop (existing images) ---
    const handleDragStart = (e, index) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('imageIndex', index.toString());
        e.target.style.opacity = '0.4';
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        const sourceIndex = parseInt(e.dataTransfer.getData('imageIndex'), 10);
        if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;
        const newGallery = [...formData.tour_gallery];
        const [movedItem] = newGallery.splice(sourceIndex, 1);
        newGallery.splice(targetIndex, 0, movedItem);
        handleChange('tour_gallery', newGallery);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    // --- Gallery: File Upload ---
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    const uploadFile = async (fileObj) => {
        const { id, file } = fileObj;

        // Validate size
        if (file.size > MAX_FILE_SIZE) {
            setUploadQueue(q => q.map(i => i.id === id ? { ...i, status: 'error', error: 'Exceeds 5 MB limit' } : i));
            return;
        }
        // Validate type
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
            setUploadQueue(q => q.map(i => i.id === id ? { ...i, status: 'error', error: 'Invalid file type' } : i));
            return;
        }

        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${import.meta.env.BASE_URL}api-upload-image.php`);

            xhr.upload.onprogress = (evt) => {
                if (evt.lengthComputable) {
                    const pct = Math.round((evt.loaded / evt.total) * 100);
                    setUploadQueue(q => q.map(i => i.id === id ? { ...i, progress: pct } : i));
                }
            };

            xhr.onload = () => {
                try {
                    const res = JSON.parse(xhr.responseText);
                    if (res.success) {
                        setUploadQueue(q => q.map(i => i.id === id ? { ...i, status: 'done', progress: 100, url: res.url } : i));
                        setFormData(prev => ({ ...prev, tour_gallery: [...prev.tour_gallery, res.url] }));
                    } else {
                        setUploadQueue(q => q.map(i => i.id === id ? { ...i, status: 'error', error: res.error || 'Upload failed' } : i));
                    }
                } catch {
                    setUploadQueue(q => q.map(i => i.id === id ? { ...i, status: 'error', error: 'Server error' } : i));
                }
                resolve();
            };

            xhr.onerror = () => {
                setUploadQueue(q => q.map(i => i.id === id ? { ...i, status: 'error', error: 'Network error' } : i));
                resolve();
            };

            xhr.send(formDataUpload);
        });
    };

    const enqueueFiles = (files) => {
        const newItems = Array.from(files).map(file => ({
            id: `${file.name}_${Date.now()}_${Math.random()}`,
            file,
            name: file.name,
            progress: 0,
            status: 'uploading', // uploading | done | error
            error: null,
            url: null,
        }));
        setUploadQueue(prev => [...prev, ...newItems]);
        newItems.forEach(item => uploadFile(item));
    };

    const handleFilePick = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            enqueueFiles(e.target.files);
            e.target.value = '';
        }
    };

    const handleDropZone = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            enqueueFiles(e.dataTransfer.files);
        }
    };

    const dismissQueueItem = (id) => {
        setUploadQueue(q => q.filter(i => i.id !== id));
    };

    // --- Inline Edit ---
    const startEditing = (idx) => {
        setEditingIndex(idx);
        setEditingValue(formData.tour_gallery[idx]);
    };

    const commitEdit = (idx) => {
        updateImage(idx, editingValue);
        setEditingIndex(null);
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

    const handleCheckboxToggle = (field, value) => {
        setFormData(prev => {
            const current = Array.isArray(prev[field]) ? prev[field] : [];
            if (current.includes(value)) {
                return { ...prev, [field]: current.filter(v => v !== value) };
            } else {
                return { ...prev, [field]: [...current, value] };
            }
        });
    };

    // --- Save ---
    const mapFlattenToNested = (flat) => ({
        id: flat.id || `pk_${Date.now()}`,
        slug: (flat.slug || '').replace(/\/$/, ''),
        title: flat.title,
        status: flat.status,
        createdAt: flat.created || new Date().toISOString(),
        lastModified: new Date().toISOString(),
        taxonomies: {
            destination: Array.isArray(flat.tour_destination) ? flat.tour_destination[0] || '' : (flat.tour_destination || ''),
            type: Array.isArray(flat.tour_type) ? flat.tour_type[0] || '' : (flat.tour_type || '')
        },
        meta: {
            price_single: flat.tour_price_single,
            price_couple: flat.tour_price_couple,
            price_group: flat.tour_price_group,
            dates: (flat.tour_dates_start && flat.tour_dates_end) ? `${flat.tour_dates_start} - ${flat.tour_dates_end}` : '',
            is_ongoing: flat.tour_dates_ongoing === 'true',
            city_path: flat.tour_city_path,
            batch_status: flat.status === 'publish' ? 'Open' : 'Draft',
            transport_options: flat.tour_transport || [],
            hotel_options: flat.tour_hotels || [],
            meal_options: flat.tour_meals || []
        },
        seo: {
            meta_title: flat.title,
            meta_description: (flat.content || '').replace(/<[^>]*>?/gm, '').substring(0, 160)
        },
        content: {
            visual_html: flat.content,
            raw_html: flat.content
        },
        gallery: flat.tour_gallery,
        featuredImage: flat.tour_gallery[0] || '',
        itinerary: flat.tour_itinerary
    });

    const handleSave = async () => {
        if (!formData.title || !formData.slug) {
            alert('Title and slug are required.');
            return;
        }

        setSaving(true);
        try {
            // 1. Fetch current database
            const resFetch = await fetch(`${import.meta.env.BASE_URL}data/pk_pilgrimage_tours.json?t=${Date.now()}`);
            let currentTours = [];
            if (resFetch.ok) {
                currentTours = await resFetch.json();
            }

            // 2. Prepare nested tour data
            const nestedTour = mapFlattenToNested(formData);

            // 3. Merge into array
            let updatedTours;
            const existingIndex = currentTours.findIndex(t => t.slug === (slug || formData.slug));
            
            if (existingIndex > -1) {
                updatedTours = [...currentTours];
                updatedTours[existingIndex] = nestedTour;
            } else {
                updatedTours = [...currentTours, nestedTour];
            }

            // 4. Save entire array
            const resSave = await fetch(`/api-save-pk-pilgrimages.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTours)
            });

            if (!resSave.ok) {
                const errorText = await resSave.text();
                throw new Error(`Server Error: ${resSave.status} ${errorText.substring(0, 100)}`);
            }

            const saveResult = await resSave.json();
            if (!saveResult.success) {
                throw new Error(saveResult.error || 'Unknown server error');
            }
            
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
        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(200%); }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }

                /* Scrollbar overrides */
            `}</style>
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">
                        {slug ? `Edit Journey` : 'Inscribe New Yatra'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold italic">
                        {slug ? `Modifying the sacred itinerary for ${formData.title}` : 'Creating a new path for the divine seekers.'}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                        <select 
                            value={formData.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                            className={`pl-10 pr-8 py-4 rounded-2xl font-black uppercase tracking-[2px] text-[10px] outline-none transition-all appearance-none cursor-pointer border shadow-sm ${
                                formData.status === 'publish' 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                                : 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                            }`}
                        >
                            <option value="draft">Draft Protocol</option>
                            <option value="publish">Live Broadcast</option>
                        </select>
                        <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] ${formData.status === 'publish' ? 'text-emerald-500 animate-pulse' : 'text-amber-500'}`}>
                            {formData.status === 'publish' ? 'online_prediction' : 'edit_notifications'}
                        </span>
                    </div>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="group relative flex items-center gap-3 px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase text-xs tracking-[2px] transition-all hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 overflow-hidden"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 dark:via-slate-900/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        
                        <span className={`material-symbols-outlined transition-transform ${saving ? 'animate-spin' : 'group-hover:scale-110'}`}>
                            {saving ? 'progress_activity' : 'verified_user'}
                        </span>
                        {saving ? 'Syncing...' : 'Seal Record'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Primary Column */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Divine Identity */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-6">
                            <span className="material-symbols-outlined text-primary">auto_awesome</span>
                            <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Divine Identity</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Journey Title</label>
                                <input 
                                    type="text" 
                                    value={formData.title} 
                                    onChange={handleTitleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-[24px] px-6 py-4 font-serif font-black text-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-800 dark:text-white"
                                    placeholder="E.g., Complete Chardham Yatra 2026"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Universal Slug</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-slate-300">link</span>
                                        <input 
                                            type="text" 
                                            value={formData.slug} 
                                            onChange={(e) => handleChange('slug', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-[20px] pl-12 pr-4 py-3 font-mono text-xs outline-none focus:border-primary transition-all text-slate-600 dark:text-slate-300"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Base Price (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                                        <input 
                                            type="number" 
                                            value={formData.price || ''} 
                                            onChange={(e) => handleChange('price', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-[20px] pl-10 pr-4 py-3 font-black text-lg outline-none focus:border-primary transition-all text-slate-800 dark:text-white"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Package Inclusions (Transport, Hotels, Meals) */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-6">
                            <span className="material-symbols-outlined text-primary">verified</span>
                            <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Package Inclusions</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Transport */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Transport</h3>
                                <div className="space-y-3">
                                    {['Private Car', 'Tempo Traveller', 'Bus', 'Train', 'Flight'].map(opt => (
                                        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input 
                                                    type="checkbox"
                                                    checked={formData.tour_transport?.includes(opt)}
                                                    onChange={() => handleCheckboxToggle('tour_transport', opt)}
                                                    className="peer w-5 h-5 rounded border-2 border-slate-200 dark:border-slate-700 checked:bg-orange-500 checked:border-orange-500 appearance-none transition-all cursor-pointer"
                                                />
                                                <span className="material-symbols-outlined absolute text-white text-[14px] left-[3px] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">check</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-orange-500 transition-colors">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Hotel */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Hotels</h3>
                                <div className="space-y-3">
                                    {['3-Star Hotel', '4-Star Premium', '5-Star Luxury', 'Heritage Property', 'Dharamshala'].map(opt => (
                                        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input 
                                                    type="checkbox"
                                                    checked={formData.tour_hotels?.includes(opt)}
                                                    onChange={() => handleCheckboxToggle('tour_hotels', opt)}
                                                    className="peer w-5 h-5 rounded border-2 border-slate-200 dark:border-slate-700 checked:bg-orange-500 checked:border-orange-500 appearance-none transition-all cursor-pointer"
                                                />
                                                <span className="material-symbols-outlined absolute text-white text-[14px] left-[3px] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">check</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-orange-500 transition-colors">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Meal Plan */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Meals</h3>
                                <div className="space-y-3">
                                    {['CP (Breakfast Only)', 'MAP (Breakfast & Dinner)', 'AP (All Meals)', 'Pure Veg / Jain'].map(opt => (
                                        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input 
                                                    type="checkbox"
                                                    checked={formData.tour_meals?.includes(opt)}
                                                    onChange={() => handleCheckboxToggle('tour_meals', opt)}
                                                    className="peer w-5 h-5 rounded border-2 border-slate-200 dark:border-slate-700 checked:bg-orange-500 checked:border-orange-500 appearance-none transition-all cursor-pointer"
                                                />
                                                <span className="material-symbols-outlined absolute text-white text-[14px] left-[3px] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">check</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-orange-500 transition-colors">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Engine */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-800 pb-6">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">description</span>
                                <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Content Engine</h2>
                            </div>
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                                <button 
                                    onClick={() => setEditorMode('visual')}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[2px] transition-all ${editorMode === 'visual' ? 'bg-white shadow-xl dark:bg-slate-700 text-primary' : 'text-slate-400 opacity-60 hover:opacity-100'}`}
                                >
                                    Aesthetics
                                </button>
                                <button 
                                    onClick={() => setEditorMode('html')}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[2px] transition-all ${editorMode === 'html' ? 'bg-white shadow-xl dark:bg-slate-700 text-primary' : 'text-slate-400 opacity-60 hover:opacity-100'}`}
                                >
                                    Raw Code
                                </button>
                            </div>
                        </div>

                        {editorMode === 'visual' && (
                            <div className="flex flex-wrap gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
                                {[
                                    { cmd: 'bold', icon: 'format_bold' },
                                    { cmd: 'italic', icon: 'format_italic' },
                                    { cmd: 'underline', icon: 'format_underlined' },
                                    { divider: true },
                                    { cmd: 'formatBlock', val: '<h2>', label: 'H2' },
                                    { cmd: 'formatBlock', val: '<h3>', label: 'H3' },
                                    { divider: true },
                                    { cmd: 'insertUnorderedList', icon: 'format_list_bulleted' },
                                    { cmd: 'createLink', prompt: 'URL:', icon: 'link' }
                                ].map((btn, i) => (
                                    btn.divider ? (
                                        <div key={i} className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                    ) : (
                                        <button 
                                            key={i}
                                            onClick={() => btn.prompt ? execCommand(btn.cmd, prompt(btn.prompt)) : execCommand(btn.cmd, btn.val)} 
                                            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 hover:border-primary hover:text-primary rounded-xl shadow-sm transition-all"
                                        >
                                            {btn.icon ? <span className="material-symbols-outlined text-[20px]">{btn.icon}</span> : <span className="font-black text-xs">{btn.label}</span>}
                                        </button>
                                    )
                                ))}
                            </div>
                        )}

                        <div className="relative group">
                            {editorMode === 'html' ? (
                                <textarea 
                                    className="w-full h-[500px] bg-slate-900 text-emerald-400 font-mono text-sm p-8 rounded-[32px] outline-none border-4 border-transparent focus:border-primary/10 transition-all shadow-2xl"
                                    value={formData.content}
                                    onChange={(e) => handleChange('content', e.target.value)}
                                    placeholder="<!-- Begin writing your sacred story here... -->"
                                />
                            ) : (
                                <div
                                    ref={editorRef}
                                    contentEditable
                                    onInput={handleVisualInput}
                                    className="w-full min-h-[500px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 outline-none focus:ring-4 focus:ring-primary/5 transition-all prose prose-lg dark:prose-invert prose-orange max-w-none text-slate-700 dark:text-slate-300 shadow-inner overflow-auto leading-relaxed marker:text-orange-500"
                                    suppressContentEditableWarning
                                    data-placeholder="Start composing the yatra story here…"
                                />
                            )}
                        </div>
                    </div>

                    {/* Sacred Sequence (Itinerary) */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8">
                        <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-6">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">route</span>
                                <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Sacred Sequence</h2>
                            </div>
                            <button 
                                onClick={addItineraryDay} 
                                className="flex items-center gap-2 px-5 py-2 bg-primary/10 text-primary hover:bg-primary text-[10px] font-black uppercase tracking-wider rounded-xl transition-all hover:text-white"
                            >
                                <span className="material-symbols-outlined text-[18px]">add_circle</span> Add Milestone
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            {formData.tour_itinerary.map((day, idx) => (
                                <div key={idx} className="group relative bg-slate-50 dark:bg-slate-800/50 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800/80 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none">
                                    <div className="absolute top-6 right-6 translate-x-4 -translate-y-4 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                        <button 
                                            onClick={() => removeItineraryDay(idx)} 
                                            className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20 active:scale-95 transition-transform"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                                        </button>
                                    </div>
                                    <div className="flex items-start gap-6">
                                        <div className="w-14 h-14 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-slate-200/50 dark:shadow-none shrink-0 border border-slate-100 dark:border-slate-600 transition-transform group-hover:scale-105">
                                            {day.day}
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <input 
                                                type="text" 
                                                value={day.title}
                                                onChange={(e) => updateItineraryDay(idx, 'title', e.target.value)}
                                                placeholder="Inscribe milestone title..."
                                                className="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-700 px-0 py-2 font-black text-xl text-slate-800 dark:text-white outline-none focus:border-primary transition-all"
                                            />
                                            <textarea 
                                                value={day.description}
                                                onChange={(e) => updateItineraryDay(idx, 'description', e.target.value)}
                                                placeholder="Detailed description of the day's divine events..."
                                                className="w-full h-32 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm outline-none focus:ring-4 focus:ring-primary/5 transition-all font-mono text-slate-600 dark:text-slate-400 shadow-inner"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {formData.tour_itinerary.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-300 dark:text-slate-700 border-4 border-dashed border-slate-50 dark:border-slate-800/50 rounded-[40px]">
                                    <span className="material-symbols-outlined text-[64px] mb-4 opacity-20">history_edu</span>
                                    <p className="font-black uppercase tracking-widest text-[11px]">The scroll is empty. Add a new milestone.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Secondary Column */}
                <div className="lg:col-span-1 space-y-8">
                    
                    {/* Taxonomies & Routing */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-6">
                            <span className="material-symbols-outlined text-primary">sell</span>
                            <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Taxonomies & Routing</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Destinations</label>
                                <input 
                                    type="text" 
                                    value={formData.tour_destination.join(', ')} 
                                    onChange={(e) => handleArrayInput('tour_destination', e.target.value)}
                                    placeholder="Uttarakhand, Haridwar"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 text-sm outline-none focus:border-primary transition-all text-slate-600 dark:text-slate-300"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Tour Types</label>
                                <input 
                                    type="text" 
                                    value={formData.tour_type.join(', ')} 
                                    onChange={(e) => handleArrayInput('tour_type', e.target.value)}
                                    placeholder="Chardham, Heritage"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 text-sm outline-none focus:border-primary transition-all text-slate-600 dark:text-slate-300"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Sacred Path (Cities)</label>
                                <textarea 
                                    value={formData.tour_city_path} 
                                    onChange={(e) => handleChange('tour_city_path', e.target.value)}
                                    placeholder="Haridwar, Barkot, Uttarkashi..."
                                    className="w-full h-24 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 text-sm outline-none focus:border-primary transition-all text-slate-600 dark:text-slate-300 resize-none font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Logistics & Economics */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-6">
                            <span className="material-symbols-outlined text-primary">payments</span>
                            <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Economics</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Single Occupancy</label>
                                <input 
                                    type="number" 
                                    value={formData.tour_price_single} 
                                    onChange={(e) => handleChange('tour_price_single', e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 text-sm outline-none focus:border-primary transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Couple</label>
                                <input 
                                    type="number" 
                                    value={formData.tour_price_couple} 
                                    onChange={(e) => handleChange('tour_price_couple', e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 text-sm outline-none focus:border-primary transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Group Rate</label>
                                <input 
                                    type="number" 
                                    value={formData.tour_price_group} 
                                    onChange={(e) => handleChange('tour_price_group', e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 text-sm outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50 dark:border-slate-800 space-y-5">
                            <label className="flex items-center gap-4 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox"
                                        checked={formData.tour_dates_ongoing === 'true'}
                                        onChange={(e) => handleChange('tour_dates_ongoing', e.target.checked ? 'true' : 'false')}
                                        className="peer w-6 h-6 rounded-lg border-2 border-slate-200 dark:border-slate-700 checked:bg-primary checked:border-primary appearance-none transition-all cursor-pointer"
                                    />
                                    <span className="material-symbols-outlined absolute text-white text-[18px] left-0 translate-x-[3px] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">done_all</span>
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[2px] text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">Flexible Departures</span>
                            </label>

                            {formData.tour_dates_ongoing !== 'true' && (
                                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Departure</label>
                                        <input 
                                            type="date" 
                                            value={formData.tour_dates_start} 
                                            onChange={(e) => handleChange('tour_dates_start', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-[10px] uppercase font-black outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Return</label>
                                        <input 
                                            type="date" 
                                            value={formData.tour_dates_end} 
                                            onChange={(e) => handleChange('tour_dates_end', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-[10px] uppercase font-black outline-none"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ═══════════════ MEDIA VAULT ═══════════════ */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-6">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">perm_media</span>
                                <div>
                                    <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Media Vault</h2>
                                    <p className="text-[9px] text-slate-300 dark:text-slate-600 mt-0.5">Max 5 MB · JPG, PNG, WebP, GIF</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-300 dark:text-slate-600">{formData.tour_gallery.length} image{formData.tour_gallery.length !== 1 ? 's' : ''}</span>
                            </div>
                        </div>

                        {/* ── Drop Zone ── */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                            onDragLeave={() => setIsDragOver(false)}
                            onDrop={handleDropZone}
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative flex flex-col items-center justify-center gap-3 py-10 rounded-[28px] border-2 border-dashed cursor-pointer transition-all select-none ${
                                isDragOver
                                    ? 'border-primary bg-primary/5 scale-[1.01]'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                                isDragOver ? 'bg-primary text-white scale-110' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}>
                                <span className="material-symbols-outlined text-[32px]">
                                    {isDragOver ? 'file_download' : 'cloud_upload'}
                                </span>
                            </div>
                            <div className="text-center">
                                <p className="font-black text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    {isDragOver ? 'Release to Upload' : 'Drop images here or click to browse'}
                                </p>
                                <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-1">Multiple files supported · Max 5 MB each</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                multiple
                                className="hidden"
                                onChange={handleFilePick}
                            />
                        </div>

                        {/* ── Upload Queue (progress) ── */}
                        {uploadQueue.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 mb-3">Upload Queue</p>
                                {uploadQueue.map(item => (
                                    <div key={item.id} className={`flex items-center gap-3 rounded-2xl p-3 border transition-all ${
                                        item.status === 'error'
                                            ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30'
                                            : item.status === 'done'
                                            ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30'
                                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'
                                    }`}>
                                        {/* Icon */}
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                            item.status === 'error' ? 'bg-red-100 dark:bg-red-900/20 text-red-500'
                                            : item.status === 'done' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-500'
                                            : 'bg-primary/10 text-primary'
                                        }`}>
                                            <span className="material-symbols-outlined text-[18px]">
                                                {item.status === 'error' ? 'error' : item.status === 'done' ? 'check_circle' : 'upload'}
                                            </span>
                                        </div>
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate">{item.name}</p>
                                            {item.status === 'uploading' && (
                                                <div className="mt-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary rounded-full transition-all duration-300"
                                                        style={{ width: `${item.progress}%` }}
                                                    />
                                                </div>
                                            )}
                                            {item.status === 'error' && (
                                                <p className="text-[9px] text-red-400 mt-0.5">{item.error}</p>
                                            )}
                                            {item.status === 'done' && (
                                                <p className="text-[9px] text-emerald-500 mt-0.5 truncate font-mono">{item.url}</p>
                                            )}
                                        </div>
                                        {/* Dismiss */}
                                        {item.status !== 'uploading' && (
                                            <button
                                                onClick={() => dismissQueueItem(item.id)}
                                                className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-slate-500 rounded-lg transition-all hover:bg-slate-100 dark:hover:bg-slate-700 shrink-0"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">close</span>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ── URL add (manual) ── */}
                        <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-[24px] border border-slate-200/50 dark:border-slate-800 shadow-inner">
                            <input
                                type="text"
                                value={newImage}
                                onChange={(e) => setNewImage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addImage()}
                                placeholder="Or paste an image URL..."
                                className="flex-1 bg-transparent px-5 py-3 text-xs outline-none text-slate-600 dark:text-slate-300 font-bold"
                            />
                            <button onClick={addImage} className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-[18px] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                <span className="material-symbols-outlined">add_link</span>
                            </button>
                        </div>

                        {/* ── Image List ── */}
                        <div className="space-y-3 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
                            {formData.tour_gallery.length === 0 && uploadQueue.filter(q => q.status === 'uploading').length === 0 && (
                                <div className="flex flex-col items-center justify-center py-10 text-slate-200 dark:text-slate-700">
                                    <span className="material-symbols-outlined text-[48px] mb-2 opacity-30">photo_library</span>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">No images yet</p>
                                </div>
                            )}

                            {formData.tour_gallery.map((img, idx) => (
                                <div
                                    key={`${img}-${idx}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, idx)}
                                    onDragEnd={handleDragEnd}
                                    onDrop={(e) => handleDrop(e, idx)}
                                    onDragOver={handleDragOver}
                                    className="group flex items-center gap-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 rounded-[24px] p-2.5 cursor-move transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:border-primary/20"
                                >
                                    {/* Thumbnail */}
                                    <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm shrink-0 border border-slate-100 dark:border-slate-800 relative group-hover:border-primary/30 transition-colors">
                                        <img src={img} alt={`gallery-${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        {idx === 0 && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-primary text-white text-[7px] font-black uppercase text-center leading-4">Cover</div>
                                        )}
                                        {idx > 0 && (
                                            <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/50 backdrop-blur text-white text-[9px] font-black rounded-md flex items-center justify-center">{idx + 1}</div>
                                        )}
                                    </div>

                                    {/* URL (inline edit) */}
                                    <div className="flex-1 min-w-0">
                                        {editingIndex === idx ? (
                                            <input
                                                autoFocus
                                                type="text"
                                                value={editingValue}
                                                onChange={(e) => setEditingValue(e.target.value)}
                                                onBlur={() => commitEdit(idx)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(idx); if (e.key === 'Escape') setEditingIndex(null); }}
                                                className="w-full bg-white dark:bg-slate-900 border border-primary rounded-lg px-3 py-1.5 text-[10px] font-mono outline-none text-slate-700 dark:text-slate-200"
                                            />
                                        ) : (
                                            <p
                                                className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 truncate cursor-text hover:text-primary transition-colors"
                                                title={img}
                                                onClick={() => startEditing(idx)}
                                            >
                                                {img}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                                        {/* Edit */}
                                        <button
                                            onClick={() => startEditing(idx)}
                                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all active:scale-95"
                                            title="Edit URL"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">edit</span>
                                        </button>
                                        {/* Delete */}
                                        <button
                                            onClick={() => removeImage(idx)}
                                            className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-all active:scale-95"
                                            title="Remove"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">delete</span>
                                        </button>
                                        {/* Drag handle */}
                                        <div className="w-6 flex items-center justify-center text-slate-300 dark:text-slate-700">
                                            <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                                        </div>
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
