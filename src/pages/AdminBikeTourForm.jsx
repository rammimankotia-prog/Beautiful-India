import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { STORAGE_KEYS, safeCacheTours } from '../utils/storage';

const AdminBikeTourForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        destination: '',
        duration: '',
        price: '',
        content: '',
        image: '',
        images: [],
        type: 'Adventure',
        status: 'active',
        bestTimeToVisit: '',
        featured: false,
        showInMenu: true,
        schemaMarkup: ''
    });

    const [loading, setLoading] = useState(false);
    const [isHtmlMode, setIsHtmlMode] = useState(false);
    const [isSchemaHtmlMode, setIsSchemaHtmlMode] = useState(true);

    useEffect(() => {
        if (isEdit) {
            const allTours = JSON.parse(localStorage.getItem(STORAGE_KEYS.BIKE_TOURS) || '[]');
            const tour = allTours.find(t => t.id === id || t.slug === id);
            if (tour) {
                setFormData({
                    ...tour,
                    images: tour.images || []
                });
            }
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
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

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, reader.result],
                    image: prev.image || reader.result
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const finalData = {
                ...formData,
                id: formData.id || formData.slug,
                updatedAt: new Date().toISOString()
            };

            const allTours = JSON.parse(localStorage.getItem(STORAGE_KEYS.BIKE_TOURS) || '[]');
            let updatedTours;
            
            if (isEdit) {
                updatedTours = allTours.map(t => (t.id === id || t.slug === id) ? finalData : t);
            } else {
                updatedTours = [finalData, ...allTours];
            }

            // 1. Sync LocalStorage for instant preview
            safeCacheTours(updatedTours, STORAGE_KEYS.BIKE_TOURS);

            // 2. Sync Backend File
            const response = await fetch('/api-save-bike-tours.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTours)
            });

            if (!response.ok) throw new Error('Failed to synchronize with backend');

            navigate('/admin/bike-tours');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Critial Error: Backend Protocol Sync Failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-6 md:p-12">
            <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-primary/30"></span>
                        Strategic Adventure Protocol
                    </p>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                        {isEdit ? 'Re-Engineer Tour' : 'Initiate New Bike Expedition'}
                    </h1>
                </div>

                <div className="flex gap-4">
                    <Link to="/admin/bike-tours" className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-primary hover:text-primary transition-all">
                        Abort Protocol
                    </Link>
                    <button 
                        onClick={handleSubmit} disabled={loading}
                        className="px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Processing Sync...' : (isEdit ? 'Authorize Update' : 'Initialize Launch')}
                    </button>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-10">
                
                {/* Core Manifest Section */}
                <section className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <span className="material-symbols-outlined text-primary">analytics</span>
                            <h2 className="text-lg font-black uppercase tracking-widest text-[#0a6c75]">Core Manifest</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-tighter text-slate-400">Expedition Alpha (Title)</label>
                                <input 
                                    type="text" name="title" value={formData.title} onChange={handleChange} required
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[20px] px-6 py-4 text-sm font-bold outline-none focus:border-primary transition-all text-slate-700 dark:text-slate-200"
                                    placeholder="e.g. Ladakh Mountain Pass Raid 2026"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-tighter text-slate-400">System Slug</label>
                                    <input 
                                        type="text" name="slug" value={formData.slug} onChange={handleChange} required
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[20px] px-6 py-4 text-xs font-bold outline-none focus:border-primary transition-all text-slate-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-tighter text-slate-400">Hub Destination</label>
                                    <input 
                                        type="text" name="destination" value={formData.destination} onChange={handleChange} required
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[20px] px-6 py-4 text-sm font-bold outline-none focus:border-primary transition-all"
                                        placeholder="Leh, Ladakh"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-tighter text-slate-400">Temporal Span</label>
                                    <input 
                                        type="text" name="duration" value={formData.duration} onChange={handleChange} required
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[20px] px-6 py-4 text-sm font-bold outline-none focus:border-primary transition-all"
                                        placeholder="9 Days / 8 Nights"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-tighter text-slate-400">Offering Value (₹)</label>
                                    <input 
                                        type="number" name="price" value={formData.price} onChange={handleChange} required
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[20px] px-6 py-4 text-sm font-bold outline-none focus:border-primary transition-all"
                                        placeholder="12999"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">gallery_thumbnail</span>
                                <h2 className="text-lg font-black uppercase tracking-widest text-[#0a6c75]">Visual Intel</h2>
                            </div>
                            <label className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-emerald-600 transition-all">
                                Upload Assets
                                <input type="file" multiple onChange={handleImageUpload} className="hidden" />
                            </label>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {formData.images.map((img, idx) => (
                                <div key={idx} className="group relative aspect-square rounded-[24px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
                                    <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all p-3 flex flex-col justify-end gap-2">
                                        <button 
                                            onClick={() => removeImage(idx)}
                                            className="w-full h-8 flex items-center justify-center bg-rose-500/80 backdrop-blur-md text-white rounded-xl hover:bg-rose-500 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">delete</span>
                                        </button>
                                        <button 
                                            onClick={() => setFormData(p => ({...p, image: img}))}
                                            className={`w-full py-1 text-[8px] font-black uppercase rounded-lg transition-all ${formData.image === img ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
                                        >
                                            {formData.image === img ? 'Primary' : 'Set Main'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Adventure Narrative Section */}
                <section className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                        <h2 className="text-lg font-black uppercase tracking-widest text-[#0a6c75] flex items-center gap-2">
                            <span className="material-symbols-outlined">auto_stories</span>
                            Expedition Narrative
                        </h2>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                            <button 
                                type="button" onClick={() => setIsHtmlMode(false)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!isHtmlMode ? 'bg-white shadow-md text-primary' : 'text-slate-400'}`}
                            >
                                Aesthetics
                            </button>
                            <button 
                                type="button" onClick={() => setIsHtmlMode(true)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isHtmlMode ? 'bg-white shadow-md text-primary' : 'text-slate-400'}`}
                            >
                                Source Code
                            </button>
                        </div>
                    </div>

                    <div className="relative group">
                        {isHtmlMode ? (
                            <textarea 
                                name="content" value={formData.content} onChange={handleChange} required
                                className="w-full h-[400px] bg-slate-900 text-emerald-500 font-mono text-sm p-8 rounded-[32px] border border-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="Paste your HTML module here..."
                            />
                        ) : (
                            <div 
                                className="w-full min-h-[400px] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 md:p-12 overflow-y-auto prose dark:prose-invert max-w-none shadow-inner"
                                dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-slate-400 italic font-medium">No content synced. Switch to Source Code to paste HTML module.</p>' }}
                            />
                        )}
                    </div>
                </section>

                {/* SEO & Meta Section */}
                <section className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <h2 className="text-lg font-black uppercase tracking-widest text-[#0a6c75] flex items-center gap-2">
                            <span className="material-symbols-outlined">data_object</span>
                            SEO & Schema Markup
                        </h2>
                        <button 
                            type="button" onClick={() => setIsSchemaHtmlMode(!isSchemaHtmlMode)}
                            className="text-[10px] font-black text-slate-400 uppercase hover:text-primary transition-colors"
                        >
                            Toggle Source Mode
                        </button>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-tighter text-slate-400">JSON-LD Schema Markup</label>
                        <textarea 
                            name="schemaMarkup" value={formData.schemaMarkup} onChange={handleChange}
                            className={`w-full h-40 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[20px] p-5 text-sm font-bold outline-none focus:border-primary ${isSchemaHtmlMode ? 'font-mono text-emerald-600 bg-slate-900' : ''}`}
                            placeholder='e.g. { "@context": "https://schema.org", "@type": "Tour", ... }'
                        />
                    </div>
                </section>

                {/* Control Panel Section */}
                <section className="bg-slate-50 dark:bg-slate-800/20 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 flex flex-wrap gap-10 items-center justify-between">
                    <div className="flex flex-wrap gap-8 items-center">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" name="showInMenu" checked={formData.showInMenu} onChange={handleChange}
                                className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">Show in Main Menu</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Inject into Header/Footer automatisch</span>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" name="featured" checked={formData.featured} onChange={handleChange}
                                className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">Featured Adventure</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Display on Home and Search priority</span>
                            </div>
                        </label>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Publish History Status</span>
                            <select 
                                name="status" value={formData.status} onChange={handleChange}
                                className="bg-white dark:bg-slate-800 border-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 outline-none shadow-sm"
                            >
                                <option value="active">Publish Live</option>
                                <option value="draft">Save Draft</option>
                                <option value="paused">Pause Listing</option>
                            </select>
                        </div>
                    </div>
                </section>
            </form>
        </div>
    );
};

export default AdminBikeTourForm;
