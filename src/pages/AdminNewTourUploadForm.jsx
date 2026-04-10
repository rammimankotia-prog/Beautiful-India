import React, { useState, useEffect } from 'react';

const AdminNewTourUploadForm = ({ existingTour, onComplete }) => {
    const [formData, setFormData] = useState({
        id: Date.now(),
        title: '',
        slug: '',
        destination: '',
        stateRegion: '',
        duration: '10 Days / 9 Nights',
        price: '',
        availableFrom: '',
        availableTo: '',
        bookingEnd: '',
        theme: 'Nature & Landscape',
        nature: 'Private',
        minPersons: 2,
        maxPersons: 12,
        highlights: [],
        itinerary: [],
        inclusions: [],
        exclusions: [],
        description: '',
        image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80',
        images: [],
        status: 'active',
        featured: false
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (existingTour) {
            setFormData(existingTour);
        }
    }, [existingTour]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleArrayChange = (field, index, value) => {
        const newArr = [...formData[field]];
        newArr[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArr }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleItineraryChange = (index, field, value) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[index] = { ...newItinerary[index], [field]: value };
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    const addItineraryDay = () => {
        setFormData(prev => ({
            ...prev,
            itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: '', description: '', tags: '', services: [] }]
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Mandatory fields check
        if (!formData.title?.trim()) newErrors.title = "Tour title is required";
        if (!formData.slug?.trim()) newErrors.slug = "URL slug is required";
        if (!formData.destination?.trim()) newErrors.destination = "Destination is required";
        if (!formData.price) newErrors.price = "Starting price is required";
        if (!formData.description?.trim()) newErrors.description = "Tour description is required";
        if (!formData.image && (!formData.images || formData.images.length === 0)) {
            newErrors.images = "At least one gallery image is required";
        }

        setErrors(newErrors);

        // Fail-fast behavior with scroll-to-error
        if (Object.keys(newErrors).length > 0) {
            const firstErrorField = Object.keys(newErrors)[0];
            const errorElement = document.getElementById(firstErrorField) || document.getElementById('media-gallery');
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                errorElement.focus();
            }
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!validateForm()) {
            setMessage({ type: 'error', text: 'Please complete all required fields.' });
            return;
        }

        setLoading(true);

        try {
            // First get existing tours
            const getResponse = await fetch(`${import.meta.env.BASE_URL}data/tours.json?t=${Date.now()}`);
            const tours = await getResponse.json();

            let updatedTours;
            if (existingTour) {
                updatedTours = tours.map(t => t.id === existingTour.id ? formData : t);
            } else {
                updatedTours = [formData, ...tours];
            }

            // Save updated array
            const response = await fetch(`${import.meta.env.BASE_URL}api-save-tours.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTours)
            });

            if (response.ok) {
                setMessage({ type: 'success', text: existingTour ? 'Tour updated successfully!' : 'New tour launched successfully!' });
                if (onComplete) {
                    setTimeout(() => onComplete(formData), 1500);
                }
            } else {
                throw new Error('Failed to save tour');
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Critical Error: Could not synchronize with database.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in fade-in duration-700">
            {/* Header */}
            <div className="bg-slate-900 p-8 md:p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-4xl font-serif font-black italic tracking-tight">{existingTour ? 'Refine Experience' : 'New Expedition Launch'}</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic">Structured Tour Data Management</p>
                    </div>
                    <button 
                        onClick={() => onComplete && onComplete()}
                        className="p-3 bg-white/10 hover:bg-white/20 transition-all rounded-2xl group"
                    >
                        <span className="material-symbols-outlined text-white group-hover:rotate-90 transition-transform">close</span>
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-16">
                
                {/* Visual Feedback Message */}
                {message.text && (
                    <div className={`p-6 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top duration-500 ${
                        message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-rose-50 text-rose-800 border-rose-100'
                    } border`}>
                        <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                        <p className="font-bold text-sm tracking-tight">{message.text}</p>
                    </div>
                )}

                {/* Section 1: Identity */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined font-black">badge</span>
                        </div>
                        <h3 className="text-xl font-serif font-black text-slate-800 dark:text-white italic">Identity & Routing</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tour Title <span className="text-rose-500">*</span></label>
                            <input
                                id="title"
                                required
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Royal Rajasthan Heritage Trail"
                                className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-2xl outline-none focus:border-primary transition-all font-bold ${errors.title ? 'border-red-500' : 'border-transparent'}`}
                            />
                            {errors.title && <p className="text-red-500 text-[10px] font-bold italic mt-1">{errors.title}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">URL Slug <span className="text-rose-500">*</span></label>
                            <input
                                id="slug"
                                required
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="royal-rajasthan-heritage"
                                className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-2xl outline-none focus:border-primary transition-all font-bold ${errors.slug ? 'border-red-500' : 'border-transparent'}`}
                            />
                            {errors.slug && <p className="text-red-500 text-[10px] font-bold italic mt-1">{errors.slug}</p>}
                        </div>
                    </div>
                </div>

                {/* Section 2: Logistics */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined font-black">location_on</span>
                        </div>
                        <h3 className="text-xl font-serif font-black text-slate-800 dark:text-white italic">Logistics & Location</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Main Destination <span className="text-rose-500">*</span></label>
                            <input
                                id="destination"
                                required
                                name="destination"
                                value={formData.destination}
                                onChange={handleChange}
                                placeholder="e.g. Jaipur, Rajasthan"
                                className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-2xl outline-none focus:border-primary transition-all font-bold ${errors.destination ? 'border-red-500' : 'border-transparent'}`}
                            />
                            {errors.destination && <p className="text-red-500 text-[10px] font-bold italic mt-1">{errors.destination}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">State/Region</label>
                            <input
                                name="stateRegion"
                                value={formData.stateRegion}
                                onChange={handleChange}
                                placeholder="e.g. North India"
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent rounded-2xl outline-none focus:border-primary transition-all font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Duration String</label>
                            <input
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent rounded-2xl outline-none focus:border-primary transition-all font-bold"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: Economy */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined font-black">payments</span>
                        </div>
                        <h3 className="text-xl font-serif font-black text-slate-800 dark:text-white italic">Investment Details</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Base Price (INR) <span className="text-rose-500">*</span></label>
                            <input
                                id="price"
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-2xl outline-none focus:border-primary transition-all font-bold ${errors.price ? 'border-red-500' : 'border-transparent'}`}
                            />
                            {errors.price && <p className="text-red-500 text-[10px] font-bold italic mt-1">{errors.price}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Theme</label>
                            <select
                                name="theme"
                                value={formData.theme}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent rounded-2xl outline-none focus:border-primary transition-all font-bold"
                            >
                                <option>Nature & Landscape</option>
                                <option>Cultural Heritage</option>
                                <option>Religious & Spiritual</option>
                                <option>Wildlife Safaris</option>
                                <option>Adventure & Sports</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Booking Nature</label>
                            <select
                                name="nature"
                                value={formData.nature}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent rounded-2xl outline-none focus:border-primary transition-all font-bold"
                            >
                                <option>Private</option>
                                <option>Fixed Departure</option>
                                <option>Customized</option>
                            </select>
                        </div>
                        <div className="space-y-2 flex flex-col justify-end pb-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                    className="w-5 h-5 accent-primary"
                                />
                                <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Feature on Home</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Description Editor */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tour Narration (Full HTML/Visual Story) <span className="text-rose-500">*</span></label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`w-full px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-[2rem] outline-none focus:border-primary transition-all font-medium text-slate-700 dark:text-slate-200 min-h-[400px] leading-relaxed ${errors.description ? 'border-red-500' : 'border-transparent'}`}
                        placeholder="Write a compelling story about this tour using rich markdown or HTML..."
                    />
                    {errors.description && <p className="text-red-500 text-[10px] font-bold italic mt-1">{errors.description}</p>}
                </div>

                {/* Media Gallery */}
                <div id="media-gallery" className="space-y-8 bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600">
                                <span className="material-symbols-outlined font-black">photo_library</span>
                            </div>
                            <h3 className="text-xl font-serif font-black text-slate-800 dark:text-white italic">Visual Asset Gallery <span className="text-rose-500">*</span></h3>
                        </div>
                        <button 
                            type="button"
                            onClick={() => addArrayItem('images')}
                            className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            Add Image URL
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {formData.images.map((url, idx) => (
                            <div key={idx} className="flex gap-4 items-start relative group">
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => handleArrayChange('images', idx, e.target.value)}
                                    placeholder="https://image-url.com/asset.jpg"
                                    className={`flex-1 px-6 py-4 bg-white dark:bg-slate-800 border-2 rounded-2xl outline-none focus:border-primary font-bold text-xs ${errors.images ? 'border-red-500 animate-bounce' : 'border-slate-100 dark:border-slate-700'}`}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => removeArrayItem('images', idx)}
                                    className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dynamic List Sections (Highlights & Inclusions) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
                    {/* Highlights */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="font-serif font-black text-lg italic text-slate-800 dark:text-white">Experience Highlights</h4>
                            <button type="button" onClick={() => addArrayItem('highlights')} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">+ Add Point</button>
                        </div>
                        <div className="space-y-4">
                            {formData.highlights.map((h, i) => (
                                <div key={i} className="flex gap-3">
                                    <input value={h} onChange={(e) => handleArrayChange('highlights', i, e.target.value)} className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-xs font-bold border border-transparent focus:border-primary transition-all outline-none" />
                                    <button onClick={() => removeArrayItem('highlights', i)} className="text-slate-300 hover:text-rose-500"><span className="material-symbols-outlined text-sm">close</span></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Inclusions */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="font-serif font-black text-lg italic text-slate-800 dark:text-white">Standard Inclusions</h4>
                            <button type="button" onClick={() => addArrayItem('inclusions')} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">+ Add Option</button>
                        </div>
                        <div className="space-y-6">
                            {formData.inclusions.map((inc, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="flex-1 space-y-2">
                                        <input 
                                            placeholder="Label (e.g. Flight)" 
                                            value={inc.text || ''} 
                                            onChange={(e) => {
                                                const newArr = [...formData.inclusions];
                                                newArr[i] = { ...newArr[i], text: e.target.value };
                                                setFormData(prev => ({ ...prev, inclusions: newArr }));
                                            }}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-xs font-black border border-transparent focus:border-primary transition-all outline-none" 
                                        />
                                        <input 
                                            placeholder="Details (e.g. Economy Class)" 
                                            value={inc.option || ''} 
                                            onChange={(e) => {
                                                const newArr = [...formData.inclusions];
                                                newArr[i] = { ...newArr[i], option: e.target.value };
                                                setFormData(prev => ({ ...prev, inclusions: newArr }));
                                            }}
                                            className="w-full bg-slate-50 dark:bg-slate-800/20 p-3 rounded-xl text-[10px] font-bold opacity-60 border border-transparent focus:border-primary transition-all outline-none" 
                                        />
                                    </div>
                                    <button onClick={() => removeArrayItem('inclusions', i)} className="text-slate-300 hover:text-rose-500 pt-4"><span className="material-symbols-outlined text-sm">close</span></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Final Submission */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4 text-slate-400">
                        <span className="material-symbols-outlined text-sm animate-pulse">lock</span>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">Your changes are automatically versioned</p>
                    </div>
                    
                    <div className="flex gap-6 w-full md:w-auto">
                        <button 
                            type="button" 
                            onClick={() => onComplete && onComplete()}
                            className="flex-1 px-10 py-5 text-slate-400 font-black uppercase text-xs tracking-[4px] hover:text-slate-600 transition-all"
                        >
                            Abort
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex-[2] md:flex-none px-16 py-5 bg-primary text-white rounded-[1.5rem] font-black uppercase text-xs tracking-[4px] shadow-2xl shadow-primary/30 hover:bg-slate-900 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Synchronizing...' : (existingTour ? 'Push Updates' : 'Launch Expedition')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminNewTourUploadForm;
