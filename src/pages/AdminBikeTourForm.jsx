import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

const AdminBikeTourForm = ({ tour, onSave, onCancel }) => {
    const { refetchData } = useData();
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        slug: '',
        destination: '',
        country: 'India',
        duration: '',
        mainImage: '',
        content: '',
        highlights: [],
        itinerary: [],
        pricing: { perPerson: 39000 },
        inclusions: [],
        exclusions: [],
        status: 'active'
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (tour) {
            setFormData({
                ...tour,
                pricing: tour.pricing || { perPerson: 39000 },
                highlights: tour.highlights || [],
                itinerary: tour.itinerary || [],
                inclusions: tour.inclusions || [],
                exclusions: tour.exclusions || []
            });
        }
    }, [tour]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => {
            const newE = { ...prev };
            delete newE[name];
            return newE;
        });
    };

    const handlePricingChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            pricing: { ...prev.pricing, perPerson: parseInt(value) || 0 }
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title?.trim()) newErrors.title = "Title is required";
        if (!formData.slug?.trim()) newErrors.slug = "Slug is required";
        if (!formData.destination?.trim()) newErrors.destination = "Destination is required";
        if (!formData.pricing?.perPerson) newErrors.pricing = "Price is required";
        if (!formData.content?.trim()) newErrors.content = "Tour description is required";
        if (!formData.mainImage?.trim()) newErrors.images = "At least one image is required";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            // Smooth scroll to the first error
            const firstErrorKey = Object.keys(newErrors)[0];
            const element = document.getElementById(firstErrorKey) || document.getElementById('media-gallery');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
            }
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            const response = await fetch('/data/bike-tours.json');
            let tours = await response.json();

            if (tour) {
                tours = tours.map(t => t.slug === tour.slug ? formData : t);
            } else {
                tours.push(formData);
            }

            const saveResponse = await fetch('/api-save-bike-tours.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tours)
            });

            if (saveResponse.ok) {
                await refetchData();
                onSave();
            }
        } catch (error) {
            console.error('Error saving tour:', error);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-serif font-black text-slate-900 dark:text-white">
                    {tour ? 'Edit Bike Expedition' : 'New Bike Expedition'}
                </h2>
                <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <span className="material-symbols-outlined text-3xl">close</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expedition Title</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl outline-none focus:border-primary transition-all font-bold ${errors.title ? 'border-red-500' : 'border-transparent'}`}
                            placeholder="e.g. Leh and Leh Grand Circuit"
                        />
                        {errors.title && <p className="text-red-500 text-[10px] font-bold italic mt-1">{errors.title}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">URL Slug</label>
                        <input
                            id="slug"
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl outline-none focus:border-primary transition-all font-bold ${errors.slug ? 'border-red-500' : 'border-transparent'}`}
                            placeholder="leh-and-leh-grand-circuit"
                        />
                        {errors.slug && <p className="text-red-500 text-[10px] font-bold italic mt-1">{errors.slug}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destination</label>
                        <input
                            id="destination"
                            type="text"
                            name="destination"
                            value={formData.destination}
                            onChange={handleChange}
                            className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl outline-none focus:border-primary transition-all font-bold ${errors.destination ? 'border-red-500' : 'border-transparent'}`}
                            placeholder="e.g. Ladakh"
                        />
                        {errors.destination && <p className="text-red-500 text-[10px] font-bold italic mt-1">{errors.destination}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Starting Price (₹)</label>
                        <input
                            id="pricing"
                            type="number"
                            value={formData.pricing.perPerson}
                            onChange={handlePricingChange}
                            className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl outline-none focus:border-primary transition-all font-bold ${errors.pricing ? 'border-red-500' : 'border-transparent'}`}
                        />
                        {errors.pricing && <p className="text-red-500 text-[10px] font-bold italic mt-1">{errors.pricing}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl outline-none focus:border-primary transition-all font-bold"
                        >
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                </div>

                {/* Content Editor */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expedition Description (HTML Content)</label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl outline-none focus:border-primary transition-all font-bold min-h-[300px] ${errors.content ? 'border-red-500' : 'border-transparent'}`}
                        placeholder="Provide detailed expedition narration in HTML format..."
                    />
                    {errors.content && <p className="text-red-500 text-[10px] font-bold italic mt-1">{errors.content}</p>}
                </div>

                {/* Main Image */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cover Image URL</label>
                    <input
                        id="images"
                        type="text"
                        name="mainImage"
                        value={formData.mainImage}
                        onChange={handleChange}
                        className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl outline-none focus:border-primary transition-all font-bold ${errors.images ? 'border-red-500 animate-bounce' : 'border-transparent'}`}
                        placeholder="/ladakh-bike-expedition.png"
                    />
                    {errors.images && <p className="text-red-500 text-[10px] font-bold italic mt-1">{errors.images}</p>}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-6 pt-10 border-t border-slate-100 dark:border-slate-800">
                    <button type="button" onClick={onCancel} className="px-10 py-4 text-slate-400 font-black uppercase text-xs tracking-[4px] hover:text-slate-600 transition-all">Cancel</button>
                    <button type="submit" className="px-12 py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-[4px] shadow-2xl shadow-primary/30 hover:bg-slate-900 focus:outline-none transition-all">
                        {tour ? 'Seal Record' : 'Launch Expedition'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminBikeTourForm;
