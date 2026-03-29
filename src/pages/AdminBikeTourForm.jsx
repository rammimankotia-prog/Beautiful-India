import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const AdminBikeTourForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [isHtmlMode, setIsHtmlMode] = useState(false);
    const [isSchemaHtmlMode, setIsSchemaHtmlMode] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        subtitle: '',
        duration: '',
        coveredPlaces: [],
        destination: '',
        country: '',
        tourType: 'Bicycle',
        difficulty: 'Easy',
        equipment: [],
        pricing: {
            perPerson: 0,
            perCouple: 0,
            perGroup: {
                price: 0,
                minPersons: 1
            }
        },
        mainImage: '',
        images: [],
        content: '',
        schemaMarkup: '',
        showInMenu: true,
        status: 'draft',
        featured: false,
        highlights: [],
        whatsIncluded: []
    });

    useEffect(() => {
        if (isEdit) {
            const fetchTour = async () => {
                try {
                    const response = await fetch(`/api/v1/bike-tours/${id}`);
                    const data = await response.json();
                    setFormData(data);
                } catch (error) {
                    console.error('Error fetching bike tour:', error);
                }
            };
            fetchTour();
        }
    }, [id, isEdit]);

    // Auto-generate slug from title
    useEffect(() => {
        if (!isEdit && formData.title) {
            const generatedSlug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "");
            setFormData(prev => ({ ...prev, slug: generatedSlug }));
        }
    }, [formData.title, isEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox' && name !== 'showInMenu' && name !== 'featured') {
            // Handled separately for arrays
            return;
        }
        
        if (name.includes('.')) {
            const [parent, child, subchild] = name.split('.');
            setFormData(prev => {
                if (subchild) {
                    return {
                        ...prev,
                        [parent]: {
                            ...prev[parent],
                            [child]: {
                                ...prev[parent][child],
                                [subchild]: value
                            }
                        }
                    };
                }
                return {
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: value
                    }
                };
            });
        } else {
            setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleArrayChange = (name, index, value) => {
        const newArray = [...formData[name]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [name]: newArray }));
    };

    const addToArray = (name) => {
        setFormData(prev => ({ ...prev, [name]: [...prev[name], ''] }));
    };

    const removeFromArray = (name, index) => {
        setFormData(prev => ({ ...prev, [name]: prev[name].filter((_, i) => i !== index) }));
    };

    const handleEquipmentToggle = (item) => {
        const newEquipment = formData.equipment.includes(item)
            ? formData.equipment.filter(e => e !== item)
            : [...formData.equipment, item];
        setFormData(prev => ({ ...prev, equipment: newEquipment }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        Promise.all(files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (ev) => resolve(ev.target.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        })).then(base64Urls => {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...base64Urls],
                mainImage: prev.mainImage || base64Urls[0]
            }));
        });
    };

    const removeImage = (index) => {
        setFormData(prev => {
            const newImages = prev.images.filter((_, i) => i !== index);
            return {
                ...prev,
                images: newImages,
                mainImage: prev.mainImage === prev.images[index] ? (newImages[0] || '') : prev.mainImage
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = isEdit ? `/api/v1/bike-tours/admin/${id}` : '/api/v1/bike-tours/admin';
            const method = isEdit ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                alert(isEdit ? 'Tour updated successfully!' : 'Tour created successfully!');
                navigate('/admin/bike-tours');
            } else {
                const err = await response.json();
                throw new Error(err.message || 'Failed to save');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const equipmentOptions = ['Helmet', 'Water', 'E-bike', 'Road bike', 'Repair Kit', 'First Aid'];

    return (
        <div className="p-6 lg:p-10 max-w-[1200px] mx-auto space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <nav className="flex text-xs font-medium text-slate-400 mb-2 gap-2 items-center">
                    <Link className="hover:text-primary" to="/admin">Admin</Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <Link className="hover:text-primary" to="/admin/bike-tours">Bicycle Tours</Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-slate-600 dark:text-slate-300 font-bold">{isEdit ? 'Edit Bike Tour' : 'Add New Bike Tour'}</span>
                </nav>
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white">
                    {isEdit ? 'Edit Bicycle Voyage' : 'Create Cycling Adventure'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-bold italic">
                    Configure the premium details of your bicycle tour module.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                {/* Basic Info Section */}
                <section className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                    <h2 className="text-lg font-black uppercase tracking-widest text-[#0a6c75] border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">info</span>
                        Core Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-tighter text-slate-400">Tour Title *</label>
                            <input 
                                type="text" name="title" value={formData.title} onChange={handleChange} required
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all"
                                placeholder="e.g. Himalayan Cycling Expedition"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-tighter text-slate-400">URL Slug *</label>
                            <input 
                                type="text" name="slug" value={formData.slug} onChange={handleChange} required
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all font-mono"
                                placeholder="himalayan-cycling-expedition"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-tighter text-slate-400">Duration *</label>
                            <input 
                                type="text" name="duration" value={formData.duration} onChange={handleChange} required
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all"
                                placeholder="e.g. 5 Days / 4 Nights"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-tighter text-slate-400">Difficulty Level</label>
                            <select 
                                name="difficulty" value={formData.difficulty} onChange={handleChange}
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all"
                            >
                                <option value="Easy">Easy (Casual Riders)</option>
                                <option value="Moderate">Moderate (Active Cyclists)</option>
                                <option value="Challenging">Challenging (Athletes)</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-tighter text-slate-400">Destination *</label>
                            <input 
                                type="text" name="destination" value={formData.destination} onChange={handleChange} required
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all"
                                placeholder="e.g. Ladakh"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-tighter text-slate-400">Country *</label>
                            <input 
                                type="text" name="country" value={formData.country} onChange={handleChange} required
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all"
                                placeholder="e.g. India"
                            />
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                    <h2 className="text-lg font-black uppercase tracking-widest text-[#0a6c75] border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">payments</span>
                        Pricing Logic
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-tighter text-slate-400">Per Person Price</label>
                            <input 
                                type="number" name="pricing.perPerson" value={formData.pricing.perPerson} onChange={handleChange}
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-tighter text-slate-400">Per Couple Price</label>
                            <input 
                                type="number" name="pricing.perCouple" value={formData.pricing.perCouple} onChange={handleChange}
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-tighter text-slate-400">Group Price / Min Persons</label>
                            <div className="flex gap-2">
                                <input 
                                    type="number" name="pricing.perGroup.price" value={formData.pricing.perGroup.price} onChange={handleChange}
                                    className="w-2/3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all"
                                    placeholder="Price"
                                />
                                <input 
                                    type="number" name="pricing.perGroup.minPersons" value={formData.pricing.perGroup.minPersons} onChange={handleChange}
                                    className="w-1/3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all"
                                    placeholder="Min"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Logistics Section */}
                <section className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                    <h2 className="text-lg font-black uppercase tracking-widest text-[#0a6c75] border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">settings_accessibility</span>
                        Equipment & Logistics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-tighter text-slate-400">Bicycle Equipment Provided</label>
                            <div className="grid grid-cols-2 gap-3">
                                {equipmentOptions.map(item => (
                                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                                        <div 
                                            onClick={() => handleEquipmentToggle(item)}
                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formData.equipment.includes(item) ? 'bg-primary border-primary' : 'border-slate-300'}`}
                                        >
                                            {formData.equipment.includes(item) && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                                        </div>
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-black uppercase tracking-tighter text-slate-400">Places Covered</label>
                                <button type="button" onClick={() => addToArray('coveredPlaces')} className="text-[10px] font-black text-primary uppercase hover:underline">+ Add Place</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.coveredPlaces.map((place, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <input 
                                            type="text" value={place} onChange={(e) => handleArrayChange('coveredPlaces', i, e.target.value)}
                                            className="bg-transparent text-xs font-bold outline-none text-slate-700 dark:text-slate-200 w-24"
                                            placeholder="City/Point"
                                        />
                                        <button type="button" onClick={() => removeFromArray('coveredPlaces', i)} className="text-red-400 hover:text-red-500">
                                            <span className="material-symbols-outlined text-[14px]">close</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Media Section */}
                <section className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                    <h2 className="text-lg font-black uppercase tracking-widest text-[#0a6c75] border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">image</span>
                        Tour Gallery
                    </h2>
                    <div className="space-y-6">
                        <input 
                            type="file" multiple accept="image/*" onChange={handleImageUpload} id="bike-image-upload" className="hidden"
                        />
                        <label htmlFor="bike-image-upload" className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[24px] cursor-pointer hover:border-primary hover:bg-slate-50 transition-all group">
                            <span className="material-symbols-outlined text-4xl text-slate-300 group-hover:text-primary transition-colors mb-2">upload_file</span>
                            <span className="text-sm font-bold text-slate-500">Click to upload 5MB max images (Multi-select enabled)</span>
                        </label>

                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {formData.images.map((img, i) => (
                                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 group">
                                        <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button 
                                                type="button" onClick={() => setFormData(prev => ({ ...prev, mainImage: img }))}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.mainImage === img ? 'bg-primary text-white' : 'bg-white text-slate-600'}`}
                                                title="Set as Main Image"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">star</span>
                                            </button>
                                            <button 
                                                type="button" onClick={() => removeImage(i)}
                                                className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Content Section (with HTML Toggle) */}
                <section className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <h2 className="text-lg font-black uppercase tracking-widest text-[#0a6c75] flex items-center gap-2">
                            <span className="material-symbols-outlined">edit_note</span>
                            Tour Content
                        </h2>
                        <div className="flex items-center gap-4">
                            <button 
                                type="button" onClick={() => setIsHtmlMode(!isHtmlMode)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isHtmlMode ? 'bg-slate-800 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">{isHtmlMode ? 'code' : 'view_quilt'}</span>
                                {isHtmlMode ? 'Source Code' : 'Visual Mode'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-tighter text-slate-400">Main Itinerary & Details Article</label>
                        {isHtmlMode ? (
                            <textarea 
                                name="content" value={formData.content} onChange={handleChange}
                                className="w-full h-80 bg-slate-900 text-emerald-400 p-6 rounded-2xl font-mono text-sm border border-slate-800 focus:border-primary outline-none"
                                placeholder="Paste your <article> tags here..."
                            />
                        ) : (
                            <div className="space-y-4">
                                <textarea 
                                    name="content" value={formData.content} onChange={handleChange}
                                    className="w-full h-64 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[20px] p-5 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-primary"
                                    placeholder="Write your tour description here. Use HTML mode for complex formatting."
                                />
                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 items-start">
                                    <span className="material-symbols-outlined text-amber-500">lightbulb</span>
                                    <p className="text-[11px] text-amber-700 font-bold italic">PRO TIP: Switch to Source Code mode to paste rich editorial layouts directly from your CMS or content writer.</p>
                                </div>
                            </div>
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

                    <div className="flex gap-4">
                        <Link to="/admin/bike-tours" className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">Cancel</Link>
                        <button 
                            type="submit" disabled={loading}
                            className="px-10 py-3 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Processing...
                                </div>
                            ) : (isEdit ? 'Update Adventure' : 'Launch Adventure')}
                        </button>
                    </div>
                </section>
            </form>
        </div>
    );
};

export default AdminBikeTourForm;
