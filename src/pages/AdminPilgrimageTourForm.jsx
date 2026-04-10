import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { STORAGE_KEYS, safeCacheTours } from '../utils/storage';

const AdminPilgrimageTourForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        id: '',
        title: '',
        slug: '',
        tour_destination: [],
        tour_type: [],
        tour_price: '',
        tour_duration: '',
        tour_description: '',
        tour_highlights: '',
        tour_image: '',
        tour_gallery: [],
        tour_status: 'active',
        is_featured: false,
        last_updated: new Date().toISOString()
    });

    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingValue, setEditingValue] = useState("");
    const [uploadQueue, setUploadQueue] = useState([]);

    useEffect(() => {
        if (isEdit) {
            const allTours = JSON.parse(localStorage.getItem(STORAGE_KEYS.PILGRIMAGE_TOURS) || '[]');
            const tour = allTours.find(t => t.id === id || t.slug === id);
            if (tour) {
                setFormData({
                    ...tour,
                    tour_destination: tour.tour_destination || [],
                    tour_type: tour.tour_type || [],
                    tour_gallery: tour.tour_gallery || []
                });
            }
        }
    }, [id, isEdit]);

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        if (name === 'title' && !isEdit) {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            }));
        }
    };

    const handleArrayInput = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [`${field}_temp`]: value,
            [field]: value.split(',').map(v => v.trim()).filter(v => v !== '')
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const finalData = {
                ...formData,
                id: formData.id || formData.slug,
                last_updated: new Date().toISOString()
            };

            const allTours = JSON.parse(localStorage.getItem(STORAGE_KEYS.PILGRIMAGE_TOURS) || '[]');
            let updatedTours;
            
            if (isEdit) {
                updatedTours = allTours.map(t => (t.id === id || t.slug === id) ? finalData : t);
            } else {
                updatedTours = [finalData, ...allTours];
            }

            // 1. Sync LocalStorage
            safeCacheTours(updatedTours, STORAGE_KEYS.PILGRIMAGE_TOURS);

            // 2. Sync Backend
            const response = await fetch('/api-save-pilgrimage-tours.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTours)
            });

            if (!response.ok) throw new Error('Network response was not ok');

            navigate('/admin/pilgrimages');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Protocol Sync Failed. Check terminal logs.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        processFiles(files);
    };

    const processFiles = (files) => {
        files.forEach(file => {
            const queueId = Math.random().toString(36).substr(2, 9);
            setUploadQueue(prev => [...prev, { id: queueId, name: file.name, progress: 0, status: 'uploading' }]);

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    tour_gallery: [...prev.tour_gallery, reader.result],
                    tour_image: prev.tour_image || reader.result
                }));
                setUploadQueue(prev => prev.map(item => item.id === queueId ? { ...item, progress: 100, status: 'done' } : item));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            tour_gallery: prev.tour_gallery.filter((_, i) => i !== index)
        }));
    };

    const setMainImage = (url) => {
        setFormData(prev => ({ ...prev, tour_image: url }));
    };

    const startEditing = (idx) => {
        setEditingIndex(idx);
        setEditingValue(formData.tour_gallery[idx]);
    };

    const commitEdit = (idx) => {
        const newGallery = [...formData.tour_gallery];
        newGallery[idx] = editingValue;
        setFormData(prev => ({ ...prev, tour_gallery: newGallery }));
        setEditingIndex(null);
    };

    const dismissQueueItem = (id) => {
        setUploadQueue(prev => prev.filter(item => item.id !== id));
    };

    const handleDragStart = (e, index) => { e.dataTransfer.setData('index', index); };
    const handleDragEnd = (e) => { e.target.classList.remove('opacity-50'); };
    const handleDragOver = (e) => { e.preventDefault(); };
    const handleDrop = (e, targetIdx) => {
        const sourceIdx = e.dataTransfer.getData('index');
        const newGallery = [...formData.tour_gallery];
        const [movedItem] = newGallery.splice(sourceIdx, 1);
        newGallery.splice(targetIdx, 0, movedItem);
        setFormData(prev => ({ ...prev, tour_gallery: newGallery }));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                {/* Protocol Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                            <span className="material-symbols-outlined text-sm">security</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Admin Protocol</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                            {isEdit ? 'Refining Sacred Instance' : 'Forge Spiritual Gateway'}
                        </h1>
                        <p className="text-slate-500 font-bold italic text-sm">Synchronizing pilgrimage data with the core motherboard.</p>
                    </div>

                    <div className="flex gap-4">
                        <Link to="/admin/pilgrimages" className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[20px] text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-primary hover:text-primary transition-all shadow-sm">
                            Abort Mission
                        </Link>
                        <button 
                            onClick={handleSave}
                            disabled={loading}
                            className="px-10 py-4 bg-primary text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Processing Sync...' : (isEdit ? 'Seal Record' : 'Launch Instance')}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Panel: Primary Data */}
                    <div className="lg:col-span-12 space-y-12">
                        
                        {/* Core Data Block */}
                        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Spiritual Title</label>
                                        <div className="relative group">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">title</span>
                                            <input 
                                                type="text" name="title" value={formData.title} onChange={handleInput}
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-xs font-bold outline-none focus:border-primary transition-all text-slate-700 dark:text-slate-200"
                                                placeholder="e.g., Vaishno Devi Divine Yatra"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Slug</label>
                                            <input 
                                                type="text" name="slug" value={formData.slug} onChange={handleInput}
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-4 text-xs font-bold outline-none focus:border-primary transition-all text-slate-700 dark:text-slate-200"
                                                placeholder="vaishno-devi-yatra"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Time Horizon</label>
                                            <input 
                                                type="text" name="tour_duration" value={formData.tour_duration} onChange={handleInput}
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-4 text-xs font-bold outline-none focus:border-primary transition-all text-slate-700 dark:text-slate-200"
                                                placeholder="e.g., 3 Days / 2 Nights"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Base Offering (₹)</label>
                                            <input 
                                                type="number" name="tour_price" value={formData.tour_price} onChange={handleInput}
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-4 text-xs font-bold outline-none focus:border-primary transition-all text-slate-700 dark:text-slate-200"
                                                placeholder="4999"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Visibility Status</label>
                                            <select 
                                                name="tour_status" value={formData.tour_status} onChange={handleInput}
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-4 text-xs font-bold outline-none focus:border-primary transition-all text-slate-700 dark:text-slate-200 appearance-none"
                                            >
                                                <option value="active">Protocol Active</option>
                                                <option value="draft">Internal Draft</option>
                                                <option value="paused">Sync Paused</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-slate-900 rounded-3xl space-y-4">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative">
                                                <input 
                                                    type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleInput}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-12 h-6 bg-slate-700 rounded-full peer peer-checked:bg-primary transition-all shadow-inner"></div>
                                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-all shadow-lg"></div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-white uppercase tracking-widest group-hover:text-primary transition-colors">Featured Shrine</span>
                                                <span className="text-[9px] text-slate-400 font-bold italic uppercase tracking-tighter">Primary visibility on holostic terminals.</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Narrative Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">description</span>
                                    Spiritual Narrative (HTML Supported)
                                </label>
                                <textarea 
                                    name="tour_description" value={formData.tour_description} onChange={handleInput}
                                    className="w-full h-[400px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 text-xs font-bold outline-none focus:border-primary transition-all text-slate-700 dark:text-slate-200 leading-relaxed shadow-sm"
                                    placeholder="Inscribe the full spiritual experience here..."
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">verified</span>
                                    Divine Highlights (One per line)
                                </label>
                                <textarea 
                                    name="tour_highlights" value={formData.tour_highlights} onChange={handleInput}
                                    className="w-full h-[400px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 text-xs font-bold outline-none focus:border-primary transition-all text-slate-700 dark:text-slate-200 leading-relaxed shadow-sm"
                                    placeholder="• VIP Darshan Access&#10;• Luxury Stay Included&#10;• Sattvic Meal Plan..."
                                />
                            </div>
                        </div>

                        {/* Media Vault & Metadata */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary">gallery_thumbnail</span>
                                        <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Sacred Media Vault</h2>
                                    </div>
                                    <label className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest cursor-pointer hover:bg-emerald-500 transition-all">
                                        Upload Assets
                                        <input type="file" multiple onChange={handleImageUpload} className="hidden" />
                                    </label>
                                </div>

                                {uploadQueue.length > 0 && (
                                    <div className="space-y-3 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-200 dark:border-slate-700">
                                        {uploadQueue.map(item => (
                                            <div key={item.id} className="space-y-1.5 px-1">
                                                <div className="flex justify-between items-center">
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
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Spiritual Destination Hubs</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">location_on</span>
                                        <input 
                                            type="text" 
                                            value={formData.tour_destination_temp || formData.tour_destination.join(', ')}
                                            onChange={(e) => handleArrayInput('tour_destination', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-xs font-bold outline-none focus:border-primary transition-all text-slate-700 dark:text-slate-200"
                                            placeholder="E.g., Katra, Varanasi, Puri"
                                        />
                                    </div>
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
        </div>
    );
};

export default AdminPilgrimageTourForm;
