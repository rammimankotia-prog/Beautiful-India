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
    tour_meals: [],
    tour_inclusions: [],
    tour_exclusions: []
};

const AdminPilgrimageTourForm = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    
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
        tour_inclusions: nested.meta?.inclusions || [],
        tour_exclusions: nested.meta?.exclusions || [],
        tour_gallery: nested.gallery || [],
        tour_itinerary: nested.itinerary || [],
        created: nested.createdAt
    });

    useEffect(() => {
        if (slug) {
            setLoading(true);
            const normalizedSlug = slug.replace(/\/$/, '');
            fetch(`${import.meta.env.BASE_URL}data/pk_pilgrimage_tours.json?t=${Date.now()}`)
                .then(res => res.json())
                .then(data => {
                    const found = data.find(t => (t.slug || '').replace(/\/$/, '') === normalizedSlug);
                    if (found) {
                        setFormData(mapNestedToFlatten(found));
                    } else {
                        console.warn(`Tour with slug "${normalizedSlug}" not found in database.`);
                    }
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [slug]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when field is edited
        if (formErrors[field]) {
            setFormErrors(prev => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.title?.trim()) errors.title = "Title is mandatory";
        
        const hasDestination = Array.isArray(formData.tour_destination) && formData.tour_destination.length > 0;
        if (!hasDestination) errors.destination = "At least one destination is required";

        const hasPrice = (formData.price && formData.price > 0) || 
                         (formData.tour_price_single && formData.tour_price_single > 0) || 
                         (formData.tour_price_couple && formData.tour_price_couple > 0) || 
                         (formData.tour_price_group && formData.tour_price_group > 0);
        if (!hasPrice) errors.price = "At least one price field is required";

        if (!formData.tour_gallery || formData.tour_gallery.length === 0) {
            errors.image = "At least one image is mandatory";
        }

        if (!formData.content?.trim()) {
            errors.content = "Tour description is mandatory";
        }

        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            // Scroll to the first error
            const firstErrorField = Object.keys(errors)[0];
            const element = document.getElementById(firstErrorField) || document.getElementsByName(firstErrorField)[0];
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return false;
        }
        return true;
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
    // Improved handleArrayInput to allow commas while typing
    const handleArrayInput = (field, evtValue) => {
        setFormData(prev => ({ ...prev, [field + '_temp']: evtValue }));
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
        slug: flat.slug,
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
            transport_options: flat.tour_transport || [],
            hotel_options: flat.tour_hotels || [],
            meal_options: flat.tour_meals || [],
            inclusions: flat.tour_inclusions || [],
            exclusions: flat.tour_exclusions || []
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
        if (!validateForm()) {
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
            const resSave = await fetch(`${import.meta.env.BASE_URL}api-save-pk-pilgrimages.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTours)
            });

            if (!resSave.ok) throw new Error('Failed to save data');
            
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
                                    id="title"
                                    value={formData.title} 
                                    onChange={handleTitleChange}
                                    className={`w-full bg-slate-50 dark:bg-slate-800/50 border rounded-[24px] px-6 py-4 font-serif font-black text-2xl outline-none focus:ring-4 transition-all text-slate-800 dark:text-white ${formErrors.title ? "border-red-500 focus:ring-red-500/10 focus:border-red-500" : "border-slate-100 dark:border-slate-800 focus:ring-primary/5 focus:border-primary"}`}
                                    placeholder="E.g., Complete Chardham Yatra 2026"
                                />
                                {formErrors.title && <p className="text-[10px] text-red-500 mt-2 font-black italic ml-1">*{formErrors.title}</p>}
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
                                            className={`w-full bg-slate-50 dark:bg-slate-800/50 border rounded-[20px] pl-12 pr-4 py-3 font-mono text-xs outline-none focus:border-primary transition-all text-slate-600 dark:text-slate-300 ${formErrors.slug ? "border-red-500" : "border-slate-100 dark:border-slate-800"}`}
                                        />
                                    </div>
                                    {formErrors.slug && <p className="text-[9px] text-red-500 mt-1 font-black italic ml-1">*{formErrors.slug}</p>}
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Base Price (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                                        <input 
                                            type="number" 
                                            id="price"
                                            value={formData.price || ''} 
                                            onChange={(e) => handleChange('price', e.target.value)}
                                            className={`w-full bg-slate-50 dark:bg-slate-800/50 border rounded-[20px] pl-10 pr-4 py-3 font-black text-lg outline-none focus:border-primary transition-all text-slate-800 dark:text-white ${formErrors.price ? "border-red-500" : "border-slate-100 dark:border-slate-800"}`}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {formErrors.price && <p className="text-[9px] text-red-500 mt-1 font-black italic ml-1">*{formErrors.price}</p>}
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

                    {/* Detailed Inclusions & Exclusions */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50 dark:border-slate-800 pb-6">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">lists</span>
                                <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Detailed Terms (Inclusions & Exclusions)</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Inclusions */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">add_task</span> Inclusions
                                    </h3>
                                    <button 
                                        onClick={() => setFormData(prev => ({ ...prev, tour_inclusions: [...prev.tour_inclusions, { text: '', option: '' }] }))}
                                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                                    >
                                        + Add Inclusion
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {formData.tour_inclusions.map((item, idx) => (
                                        <div key={idx} className="flex gap-2 items-center group">
                                            <input 
                                                type="text" 
                                                placeholder="Service name..."
                                                value={item.text}
                                                onChange={(e) => {
                                                    const newInc = [...formData.tour_inclusions];
                                                    newInc[idx].text = e.target.value;
                                                    handleChange('tour_inclusions', newInc);
                                                }}
                                                className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-emerald-500 transition-all font-bold"
                                            />
                                            <input 
                                                type="text" 
                                                placeholder="Option..."
                                                value={item.option}
                                                onChange={(e) => {
                                                    const newInc = [...formData.tour_inclusions];
                                                    newInc[idx].option = e.target.value;
                                                    handleChange('tour_inclusions', newInc);
                                                }}
                                                className="w-24 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-[10px] outline-none focus:border-emerald-500 transition-all font-black uppercase tracking-tighter text-emerald-600"
                                            />
                                            <button 
                                                onClick={() => {
                                                    const newInc = [...formData.tour_inclusions];
                                                    newInc.splice(idx, 1);
                                                    handleChange('tour_inclusions', newInc);
                                                }}
                                                className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">close</span>
                                            </button>
                                        </div>
                                    ))}
                                    {formData.tour_inclusions.length === 0 && (
                                        <p className="text-[10px] text-slate-400 italic">No inclusions defined.</p>
                                    )}
                                </div>
                            </div>

                            {/* Exclusions */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">cancel_schedule_send</span> Exclusions
                                    </h3>
                                    <button 
                                        onClick={() => setFormData(prev => ({ ...prev, tour_exclusions: [...prev.tour_exclusions, { text: '', option: '' }] }))}
                                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                                    >
                                        + Add Exclusion
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {formData.tour_exclusions.map((item, idx) => (
                                        <div key={idx} className="flex gap-2 items-center group">
                                            <input 
                                                type="text" 
                                                placeholder="Service name..."
                                                value={item.text}
                                                onChange={(e) => {
                                                    const newExc = [...formData.tour_exclusions];
                                                    newExc[idx].text = e.target.value;
                                                    handleChange('tour_exclusions', newExc);
                                                }}
                                                className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-rose-500 transition-all font-bold"
                                            />
                                            <input 
                                                type="text" 
                                                placeholder="Option..."
                                                value={item.option}
                                                onChange={(e) => {
                                                    const newExc = [...formData.tour_exclusions];
                                                    newExc[idx].option = e.target.value;
                                                    handleChange('tour_exclusions', newExc);
                                                }}
                                                className="w-24 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-[10px] outline-none focus:border-rose-500 transition-all font-black uppercase tracking-tighter text-rose-600"
                                            />
                                            <button 
                                                onClick={() => {
                                                    const newExc = [...formData.tour_exclusions];
                                                    newExc.splice(idx, 1);
                                                    handleChange('tour_exclusions', newExc);
                                                }}
                                                className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">close</span>
                                            </button>
                                        </div>
                                    ))}
                                    {formData.tour_exclusions.length === 0 && (
                                        <p className="text-[10px] text-slate-400 italic">No exclusions defined.</p>
                                    )}
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

                        <div className="space-y-4">
                            <div id="content" className="flex items-center justify-between px-1">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Master Narrative</label>
                                {editorMode === 'visual' && (
                                    <div className="flex gap-1">
                                        {['bold', 'italic', 'formatBlock_h2', 'formatBlock_h3', 'insertUnorderedList'].map(cmd => (
                                            <button 
                                                key={cmd} 
                                                onClick={() => {
                                                    const parts = cmd.split('_');
                                                    execCommand(parts[0], parts[1]);
                                                }}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">{cmd === 'formatBlock_h2' ? 'h2' : cmd === 'formatBlock_h3' ? 'h3' : cmd}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className={`relative border rounded-[32px] overflow-hidden transition-all duration-500 ${formErrors.content ? "border-red-500 ring-2 ring-red-500/10 shadow-lg shadow-red-500/5 animate-pulse" : "border-slate-100 dark:border-slate-800"}`}>
                                {editorMode === 'html' ? (
                                    <textarea 
                                        value={formData.content}
                                        onChange={(e) => handleChange('content', e.target.value)}
                                        className="w-full min-h-[500px] bg-slate-900 text-emerald-400 p-8 font-mono text-sm outline-none resize-y"
                                        placeholder="Paste divine HTML content here..."
                                    />
                                ) : (
                                    <div 
                                        ref={editorRef}
                                        contentEditable
                                        onInput={handleVisualInput}
                                        className="w-full min-h-[500px] bg-white dark:bg-slate-900 p-8 prose dark:prose-invert max-w-none outline-none overflow-y-auto cursor-text shadow-inner"
                                        style={{ fontFamily: 'var(--font-serif)' }}
                                    />
                                )}
                            </div>
                            {formErrors.content && <p className="text-[10px] text-red-500 font-black italic ml-2">*{formErrors.content}</p>}
                        </div>
                    </div>

                    {/* Itinerary Progress */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8">
                        <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-6">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">route</span>
                                <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Sacred Itinerary Progress</h2>
                            </div>
                            <button 
                                onClick={addItineraryDay}
                                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[2px] shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all"
                            >
                                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                                Reveal Another Day
                            </button>
                        </div>

                        <div className="space-y-8">
                            {formData.tour_itinerary.map((day, idx) => (
                                <div key={idx} className="group relative bg-slate-50/50 dark:bg-slate-800/30 rounded-[35px] border border-slate-100 dark:border-slate-800 p-8 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none">
                                    <div className="absolute -top-3 left-10 px-5 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-[2px] text-primary shadow-sm z-10">
                                        Day 0{day.day} Sequence
                                    </div>
                                    <button 
                                        onClick={() => removeItineraryDay(idx)}
                                        className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-xl"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                    </button>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
                                        <div className="md:col-span-1">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Daily Revelation</label>
                                                <input 
                                                    type="text" 
                                                    value={day.title}
                                                    onChange={(e) => updateItineraryDay(idx, 'title', e.target.value)}
                                                    className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-primary transition-all shadow-sm"
                                                    placeholder="E.g., The Sacred Aarti"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Experience Description</label>
                                                <textarea 
                                                    value={day.description}
                                                    onChange={(e) => updateItineraryDay(idx, 'description', e.target.value)}
                                                    className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-medium outline-none focus:border-primary transition-all shadow-sm min-h-[120px]"
                                                    placeholder="Narrate the spiritual milestones of this day..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {formData.tour_itinerary.length === 0 && (
                                <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/30 rounded-[35px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                                    <p className="text-xs font-bold text-slate-400 italic">No itinerary steps defined. The path remains hidden.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Secondary Column: Parameters */}
                <div className="space-y-8">
                    
                    {/* Visual Media Vault */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8 sticky top-6">
                        <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-6">
                            <span className="material-symbols-outlined text-primary">collections</span>
                            <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Media Vault</h2>
                        </div>

                        <div className="space-y-6">
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={() => setIsDragOver(false)}
                                onDrop={handleDropZone}
                                id="image"
                                className={`relative flex flex-col items-center justify-center w-full h-[250px] border-2 border-dashed rounded-[35px] cursor-pointer transition-all group overflow-hidden ${isDragOver ? 'border-primary bg-primary/5' : formErrors.image ? 'border-red-500 bg-red-50/10 animate-pulse' : 'border-slate-200 dark:border-slate-800 hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleFilePick}
                                    className="hidden" 
                                    multiple 
                                    accept="image/*"
                                />
                                <div className="flex flex-col items-center gap-3 transition-transform group-hover:scale-110">
                                    <span className={`material-symbols-outlined text-5xl group-hover:text-primary transition-colors ${formErrors.image ? 'text-red-400' : 'text-slate-200'}`}>
                                        {formErrors.image ? 'warning' : 'cloud_upload'}
                                    </span>
                                    <div className="text-center">
                                        <p className={`text-xs font-black uppercase tracking-widest ${formErrors.image ? 'text-red-600' : 'text-slate-800 dark:text-white'}`}>
                                            {formErrors.image ? formErrors.image : 'Summon Journey Photos'}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 italic">Drag & drop or click to reveal</p>
                                    </div>
                                </div>
                            </div>
                            {formErrors.image && <p className="text-[10px] text-red-500 font-black italic ml-2 text-center animate-bounce">*{formErrors.image}</p>}

                            {/* Upload Queue */}
                            {uploadQueue.length > 0 && (
                                <div className="space-y-3">
                                    {uploadQueue.map(item => (
                                        <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-black text-slate-500 truncate max-w-[150px] uppercase tracking-tighter">{item.name}</span>
                                                <span className={`text-[10px] font-black uppercase ${item.status === 'error' ? 'text-rose-500' : 'text-primary'}`}>
                                                    {item.status === 'done' ? 'Protocol Sync' : item.status === 'error' ? 'Sync Failed' : `${item.progress}%`}
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-300 ${item.status === 'error' ? 'bg-rose-500' : 'bg-primary'}`}
                                                    style={{ width: `${item.progress}%` }}
                                                />
                                            </div>
                                            {item.error && <p className="text-[9px] text-rose-500 font-bold mt-1 uppercase tracking-tighter">! {item.error}</p>}
                                            {item.status !== 'uploading' && (
                                                <button onClick={() => dismissQueueItem(item.id)} className="mt-2 text-[9px] font-black text-slate-400 uppercase hover:text-primary">Dismiss</button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                {formData.tour_gallery.map((img, idx) => (
                                    <div 
                                        key={idx} 
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, idx)}
                                        onDragEnd={handleDragEnd}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, idx)}
                                        className="group relative aspect-square rounded-[30px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm cursor-grab active:cursor-grabbing"
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all p-3 flex flex-col justify-end gap-2">
                                            {editingIndex === idx ? (
                                                <input 
                                                    autoFocus
                                                    value={editingValue}
                                                    onBlur={() => commitEdit(idx)}
                                                    onKeyDown={(e) => e.key === 'Enter' && commitEdit(idx)}
                                                    onChange={(e) => setEditingValue(e.target.value)}
                                                    className="w-full bg-white dark:bg-slate-800 rounded-lg py-1 px-2 text-[10px] font-bold outline-none"
                                                />
                                            ) : (
                                                <button 
                                                    onClick={() => startEditing(idx)}
                                                    className="w-full h-8 flex items-center justify-center bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/40 transition-all border border-white/20"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">edit</span>
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => removeImage(idx)}
                                                className="w-full h-8 flex items-center justify-center bg-rose-500/80 backdrop-blur-md text-white rounded-xl hover:bg-rose-500 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Route & Taxonomies Grid */}
                        <div className="space-y-8 pt-4">
                            <div className="space-y-4">
                                <label id="destination" className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Spiritual Destination Hubs</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">location_on</span>
                                    <input 
                                        type="text" 
                                        value={formData.tour_destination_temp || formData.tour_destination.join(', ')}
                                        onChange={(e) => handleArrayInput('tour_destination', e.target.value)}
                                        className={`w-full bg-slate-50 dark:bg-slate-800/50 border rounded-2xl pl-12 pr-4 py-4 text-xs font-bold outline-none focus:border-primary transition-all text-slate-700 dark:text-slate-200 ${formErrors.destination ? 'border-red-500' : 'border-slate-100 dark:border-slate-800'}`}
                                        placeholder="E.g., Katra, Varanasi, Puri"
                                    />
                                </div>
                                {formErrors.destination && <p className="text-[10px] text-red-500 font-black italic ml-2">*{formErrors.destination}</p>}
                            </div>

                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Universal Tag System</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">sell</span>
                                    <input 
                                        type="text" 
                                        value={formData.tour_type_temp || formData.tour_type.join(', ')}
                                        onChange={(e) => handleArrayInput('tour_type', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-xs font-bold outline-none focus:border-primary transition-all text-slate-700 dark:text-slate-200"
                                        placeholder="Devotional, Nature, Family..."
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPilgrimageTourForm;
