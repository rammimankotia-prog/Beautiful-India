import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

const AdminPilgrimageTourForm = ({ tour, onSave, onCancel }) => {
    const { refetchData } = useData();
    const [formData, setFormData] = useState({
        id: Date.now(),
        title: '',
        slug: '',
        content: '',
        status: 'publish',
        gallery: [],
        itinerary: [],
        taxonomies: {
            destination: [],
            type: []
        },
        meta: {
            city_path: '',
            price_single: '',
            price_couple: '',
            price_group: '',
            is_ongoing: false,
            dates: '',
            inclusions: [],
            exclusions: [],
            transport_options: [],
            hotel_options: [],
            meal_options: []
        }
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (tour) {
            setFormData({
                ...tour,
                taxonomies: {
                    destination: tour.taxonomies?.destination || [],
                    type: tour.taxonomies?.type || []
                },
                meta: {
                    ...tour.meta,
                    inclusions: tour.meta?.inclusions || [],
                    exclusions: tour.meta?.exclusions || [],
                    transport_options: tour.meta?.transport_options || [],
                    hotel_options: tour.meta?.hotel_options || [],
                    meal_options: tour.meta?.meal_options || []
                }
            });
        }
    }, [tour]);

    const handleMetaChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            meta: { ...prev.meta, [field]: value }
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Identity validation
        if (!formData.title?.trim()) newErrors.title = "Yatra title is mandatory";
        if (!formData.slug?.trim()) newErrors.slug = "Slug requires valid format";
        
        // Logistics validation
        if (!formData.taxonomies?.destination?.length) newErrors.destination = "Define at least one destination";
        
        // Economy validation
        if (!formData.meta?.price_single) newErrors.price = "Enter a valid base price";
        
        // Content validation
        if (!formData.content?.trim()) newErrors.content = "Journey narration is missing";
        
        // Media validation
        if (!formData.gallery?.length) newErrors.gallery = "At least one sacred image is required";

        setErrors(newErrors);

        // Fail-fast behavior with scroll-to-error
        if (Object.keys(newErrors).length > 0) {
            const firstErrorKey = Object.keys(newErrors)[0];
            const errorElement = document.getElementById(firstErrorKey) || document.getElementById('media-gallery-p');
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                errorElement.focus();
            }
            return false;
        }
        return true;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            // Robust sync: fetch-merge-repost
            const res = await fetch(`${import.meta.env.BASE_URL}data/pk_pilgrimage_tours.json?t=${Date.now()}`);
            let allTours = await res.json();

            if (tour) {
                allTours = allTours.map(t => t.id === tour.id ? formData : t);
            } else {
                allTours = [formData, ...allTours];
            }

            const saveRes = await fetch(`${import.meta.env.BASE_URL}api-save-pilgrimage.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(allTours)
            });

            if (saveRes.ok) {
                await refetchData();
                onSave();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h2 className="text-4xl font-serif font-black text-slate-900 dark:text-white italic">
                        {tour ? 'Refine Pilgrimage' : 'New Sacred Yatra'}
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mt-2 italic shadow-orange-500/20">Divine Journey Configuration</p>
                </div>
                <button onClick={onCancel} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all shadow-sm">
                    <span className="material-symbols-outlined text-3xl">close</span>
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-16">
                
                {/* Section 1: Identity & Spirit */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950/30 rounded-xl flex items-center justify-center text-orange-600">
                            <span className="material-symbols-outlined font-black">temple_hindu</span>
                        </div>
                        <h3 className="text-xl font-serif font-black text-slate-800 dark:text-white italic">Identity & Spirit</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Yatra Title <span className="text-rose-500 font-bold">*</span></label>
                            <input
                                id="title"
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-2xl outline-none focus:border-orange-500 transition-all font-bold ${errors.title ? 'border-orange-500/50' : 'border-transparent'}`}
                                placeholder="e.g. Vaishno Devi Special Yatra"
                            />
                            {errors.title && <p className="text-orange-500 text-[10px] font-bold italic mt-1">{errors.title}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">URL Slug <span className="text-rose-500 font-bold">*</span></label>
                            <input
                                id="slug"
                                value={formData.slug}
                                onChange={e => setFormData({...formData, slug: e.target.value})}
                                className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-2xl outline-none focus:border-orange-500 transition-all font-bold ${errors.slug ? 'border-orange-500/50' : 'border-transparent'}`}
                                placeholder="vaishno-devi-special"
                            />
                            {errors.slug && <p className="text-orange-500 text-[10px] font-bold italic mt-1">{errors.slug}</p>}
                        </div>
                    </div>
                </div>

                {/* Section 2: Celestial Logistics */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950/30 rounded-xl flex items-center justify-center text-orange-600">
                            <span className="material-symbols-outlined font-black">route</span>
                        </div>
                        <h3 className="text-xl font-serif font-black text-slate-800 dark:text-white italic">Celestial Logistics</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Base Price (INR) <span className="text-rose-500 font-bold">*</span></label>
                            <input
                                id="price"
                                type="number"
                                value={formData.meta.price_single}
                                onChange={e => handleMetaChange('price_single', e.target.value)}
                                className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-2xl outline-none focus:border-orange-500 transition-all font-bold ${errors.price ? 'border-orange-500/50' : 'border-transparent'}`}
                            />
                            {errors.price && <p className="text-orange-500 text-[10px] font-bold italic mt-1">{errors.price}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destinations (Comma-separated) <span className="text-rose-500 font-bold">*</span></label>
                            <input
                                id="destination"
                                value={formData.taxonomies.destination.join(', ')}
                                onChange={e => setFormData({...formData, taxonomies: {...formData.taxonomies, destination: e.target.value.split(',').map(d=>d.trim())}})}
                                className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-2xl outline-none focus:border-orange-500 transition-all font-bold ${errors.destination ? 'border-orange-500/50' : 'border-transparent'}`}
                            />
                            {errors.destination && <p className="text-orange-500 text-[10px] font-bold italic mt-1">{errors.destination}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Yatra Status</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData({...formData, status: e.target.value})}
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent rounded-2xl outline-none focus:border-orange-500 transition-all font-bold"
                            >
                                <option value="publish">Publicly Visible</option>
                                <option value="draft">Hidden / Draft</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section 3: Spiritual Narration */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Spiritual Narration (Visual HTML Story) <span className="text-rose-500 font-bold">*</span></label>
                    <textarea
                        id="content"
                        value={formData.content}
                        onChange={e => setFormData({...formData, content: e.target.value})}
                        className={`w-full px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-[2rem] outline-none focus:border-orange-500 transition-all font-medium text-slate-700 dark:text-slate-200 min-h-[400px] leading-relaxed ${errors.content ? 'border-orange-500/50' : 'border-transparent'}`}
                        placeholder="Describe the divine experience using visual HTML tags..."
                    />
                    {errors.content && <p className="text-orange-500 text-[10px] font-bold italic mt-1">{errors.content}</p>}
                </div>

                {/* Sacred Media Vault */}
                <div id="media-gallery-p" className="space-y-8 bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-serif font-black text-slate-800 dark:text-white italic">Sacred Media Vault <span className="text-rose-500 font-bold">*</span></h3>
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, gallery: [...formData.gallery, '']})}
                            className="px-6 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105"
                        >+ Add Image</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {formData.gallery.map((url, i) => (
                            <div key={i} className="flex gap-3">
                                <input
                                    id="gallery"
                                    value={url}
                                    onChange={e => {
                                        const newGal = [...formData.gallery];
                                        newGal[i] = e.target.value;
                                        setFormData({...formData, gallery: newGal});
                                    }}
                                    className={`flex-1 px-6 py-4 bg-white dark:bg-slate-800 border-2 rounded-2xl outline-none focus:border-orange-500 font-bold text-xs ${errors.gallery ? 'border-orange-500/50 animate-bounce' : 'border-slate-100 dark:border-slate-700'}`}
                                    placeholder="https://image-url.com/asset.jpg"
                                />
                                <button type="button" onClick={() => setFormData({...formData, gallery: formData.gallery.filter((_,idx)=>idx!==i)})} className="p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                        ))}
                    </div>
                    {errors.gallery && <p className="text-orange-500 text-[10px] font-bold italic mt-1">{errors.gallery}</p>}
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 text-slate-400">
                        <span className="material-symbols-outlined text-sm animate-pulse">check_circle</span>
                        <p className="text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Verified State Synchronized</p>
                    </div>
                    <div className="flex gap-6 w-full md:w-auto">
                        <button type="button" onClick={onCancel} className="flex-1 px-10 py-5 text-slate-400 font-black uppercase text-xs tracking-[4px] hover:text-slate-600 transition-all">Cancel</button>
                        <button type="submit" className="flex-[2] md:flex-none px-16 py-5 bg-orange-600 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-[4px] shadow-2xl shadow-orange-600/30 hover:bg-orange-700 active:scale-95 transition-all">
                            {tour ? 'Refine Record' : 'Launch Yatra'}
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default AdminPilgrimageTourForm;
