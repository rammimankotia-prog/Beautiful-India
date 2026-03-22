
import React from 'react';
import { Link } from 'react-router-dom';
import categoriesData from '../data/categories.json';

/**
 * Auto-generated from: admin_new_tour_upload_form/code.html
 * Group: admin | Path: /admin/tours/new
 */
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const AdminNewTourUploadForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  const typeParam = searchParams.get('type');
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    slug: '',
    title: '',
    description: '',
    destination: '',
    stateRegion: '',
    subregion: '',
    duration: '',
    bestTimeToVisit: '',
    price: '',
    priceBasis: 'per_person', // 'per_person', 'per_package'
    pricePerPerson: '',
    pricePerCouple: '',
    pricePerGroup: '',
    groupSize: 10,
    minPersons: 1,
    status: 'active',
    order: 0,
    theme: '',
    nature: 'group',
    style: '',
    priceCategory: '',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200',
    images: [],
    inclusions: '',
    exclusions: '',
    highlights: '',
    isFeatured: false,
    itinerary: [{ day: 1, title: '', description: '', tags: [], services: [] }],
    faq: [{ question: '', answer: '' }],
    bookingStart: '',
    bookingEnd: '',
    availableFrom: '',
    availableTo: '',
    cityPath: '',
    hotelCategory: [], 
    accommodationType: 'mixed',
    mixedAccommodations: [],
    transport: typeParam === 'train' ? 'train' : 'mixed',
    mixedTransports: [],
    homePagePlacements: [],
    noBookingEnd: false,
    noAvailableTo: false
  });

  const [categories, setCategories] = React.useState({
    ...categoriesData.categories,
    destinationStates: categoriesData.categories.destinationStates || {
      'India': categoriesData.categories.states,
      'International': ['Thailand', 'Bali', 'Dubai', 'Singapore', 'Maldives', 'Sri Lanka', 'Nepal', 'Bhutan']
    },
    subregionsByState: categoriesData.categories.subregionsByState || {
      'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala', 'Kasol', 'Spiti Valley'],
      'Kashmir': ['Srinagar', 'Gulmarg', 'Pahalgam', 'Sonamarg'],
      'Kerala': ['Munnar', 'Alleppey', 'Wayanad'],
      'Ladakh': ['Leh', 'Pangong Lake', 'Nubra Valley'],
      'Goa': ['North Goa', 'South Goa'],
      'Uttarakhand': ['Rishikesh', 'Haridwar', 'Nainital'],
      'Andaman Islands': ['Port Blair', 'Havelock Island'],
    },
    hotelCategories: categoriesData.categories.hotelCategories || [
      { value: '3_star', label: '3 Star', icon: '⭐' },
      { value: '4_star', label: '4 Star', icon: '⭐⭐' },
      { value: '5_star', label: '5 Star', icon: '⭐⭐⭐' },
      { value: 'budget', label: 'Budget', icon: '💰' }
    ],
    accommodationTypes: categoriesData.categories.accommodationTypes || [
      { value: 'hotel', label: 'Hotel', icon: '🏨' },
      { value: 'resort', label: 'Resort', icon: '🌴' },
      { value: 'houseboat', label: 'Houseboat', icon: '🚢' }
    ],
    transports: categoriesData.categories.transports || [
      { value: 'mixed', label: 'Mixed', icon: '🚗' },
      { value: 'train', label: 'Train', icon: '🚆' }
    ],
    natures: categoriesData.categories.natures || [],
    styles: categoriesData.categories.styles || []
  });

  // Derive THEME_MAP from dynamic themes + fallback defaults
  const THEME_MAP = React.useMemo(() => {
    const map = {};
    categories.themes.forEach(t => {
      map[t.value] = { label: t.label, icon: t.icon };
    });
    return map;
  }, [categories.themes]);

  // Emoji map for state quick-picks — fallback icon for custom destinations
  const DEST_ICON_MAP = {
    'Himachal Pradesh': '🏔️', 'Kashmir': '❄️', 'Rajasthan': '🏯',
    'Kerala': '🌿', 'Ladakh': '🚵', 'Goa': '🏖️', 'Uttarakhand': '🙏',
    'Andaman Islands': '🤿', 'Sikkim': '🌸', 'Assam': '🌿', 'Meghalaya': '⛅',
    'Arunachal Pradesh': '🏞️', 'Karnataka': '🕌', 'Tamil Nadu': '🛕',
    'Maharashtra': '🏙️', 'Gujarat': '🦁', 'West Bengal': '🐯',
    'Madhya Pradesh': '🐘', 'Uttar Pradesh': '🕌', 'Jammu': '❄️',
    'Puducherry': '🌊', 'Darjeeling': '🍵', 'Coorg': '☕', 'Ooty': '🌄',
  };

  React.useEffect(() => {
    const saved = localStorage.getItem('beautifulindia_admin_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Map flat `states` from categorization settings → destinationStates.India
        if (parsed.states && Array.isArray(parsed.states)) {
          parsed.destinationStates = {
            ...(parsed.destinationStates || {}),
            India: parsed.states,
          };
          delete parsed.states;
        }
        // `themes` from localStorage may be plain strings — convert to objects
        if (parsed.themes && Array.isArray(parsed.themes)) {
          parsed.themes = parsed.themes.map(t => {
            if (typeof t === 'string') {
              return { value: t, label: t.charAt(0).toUpperCase() + t.slice(1), icon: '🏷️' };
            }
            return t;
          });
        }
        setCategories(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to parse categories', e);
      }
    }
  }, []); // Run only once on mount to avoid infinite loops with THEME_MAP

  React.useEffect(() => {
    if (id) {
      // First check localStorage for session changes
      const savedTours = localStorage.getItem('beautifulindia_admin_tours');
      if (savedTours) {
        try {
          const tours = JSON.parse(savedTours);
          const matched = tours.find(t => String(t.id) === String(id));
          if (matched) {
            setFormData(prev => ({ ...prev, ...matched, slug: matched.slug || matched.id || '' }));
            console.log("Loaded tour from localStorage session");
            return;
          }
        } catch (e) {
          console.error("Local storage error:", e);
        }
      }

      fetch(`${import.meta.env.BASE_URL}data/tours.json`)
        .then(res => res.json())
        .then(data => {
          const matched = data.find(t => String(t.id) === String(id));
          if (matched) setFormData(prev => ({ ...prev, ...matched, slug: matched.slug || matched.id || '' }));
        })
        .catch(err => {
          console.error("Failed to load tour:", err);
        });
    }
  }, [id]);

  // Handle auto-slug generation
  React.useEffect(() => {
    if (!isEdit && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Only auto-update if the user hasn't manually edited the slug yet
      // or if the slug is currently empty
      if (!formData.slug || formData.slug === (formData._lastAutoSlug || '')) {
        setFormData(prev => ({ ...prev, slug: generatedSlug, _lastAutoSlug: generatedSlug }));
      }
    }
  }, [formData.title, isEdit]);

  // Get states filtered by selected destination
  const availableStates = React.useMemo(() => {
    if (!formData.destination) return [];
    return categories.destinationStates[formData.destination] || [];
  }, [formData.destination, categories.destinationStates]);

  // Get subregions filtered by selected stateRegion
  const availableSubregions = React.useMemo(() => {
    if (!formData.stateRegion) return [];
    return categories.subregionsByState[formData.stateRegion] || [];
  }, [formData.stateRegion, categories.subregionsByState]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...(formData.itinerary || [])];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setFormData(prev => ({ ...prev, itinerary: newItinerary }));
  };

  const insertFormatting = (index, prefix, suffix = "", isMain = false) => {
    const textarea = isMain ? document.getElementById('main-description') : document.getElementById(`day-desc-${index}`);
    if (!textarea) return;

    textarea.focus();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newValue = before + prefix + selection + suffix + after;
    
    if (isMain) {
      setFormData(prev => ({ ...prev, description: newValue }));
    } else {
      handleItineraryChange(index, "description", newValue);
    }

    // Use a small delay to allow React to update the state before setting focus/cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + (selection ? selection.length + suffix.length : 0);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const handleAddDay = () => {
    const newItinerary = [...(formData.itinerary || [])];
    const nextDay = newItinerary.length > 0 ? newItinerary[newItinerary.length - 1].day + 1 : 1;
    newItinerary.push({ day: nextDay, title: '', description: '', tags: [], services: [] });
    setFormData(prev => ({ ...prev, itinerary: newItinerary }));
  };

  const handleRemoveDay = (index) => {
    const newItinerary = [...(formData.itinerary || [])];
    newItinerary.splice(index, 1);
    // Re-index days safely
    const reindexedItinerary = newItinerary.map((item, i) => ({ ...item, day: i + 1 }));
    setFormData(prev => ({ ...prev, itinerary: reindexedItinerary }));
  };

  const handleFaqChange = (index, field, value) => {
    const newFaq = [...(formData.faq || [])];
    newFaq[index] = { ...newFaq[index], [field]: value };
    setFormData(prev => ({ ...prev, faq: newFaq }));
  };

  const handleAddFaq = () => {
    const newFaq = [...(formData.faq || [])];
    newFaq.push({ question: '', answer: '' });
    setFormData(prev => ({ ...prev, faq: newFaq }));
  };

  const handleRemoveFaq = (index) => {
    const newFaq = [...(formData.faq || [])];
    newFaq.splice(index, 1);
    setFormData(prev => ({ ...prev, faq: newFaq }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);

    try {
      // Always fetch the latest tours from the server
      let tours = [];
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}data/tours.json?t=${Date.now()}`);
        if (res.ok) tours = await res.json();
      } catch (err) {
        console.error("Error fetching tours from server:", err);
      }

      const tourToSave = { ...formData };
      
      // Process itinerary tags: convert string to array
      if (tourToSave.itinerary) {
        tourToSave.itinerary = tourToSave.itinerary.map(day => ({
          ...day,
          tags: typeof day.tags === 'string' 
            ? day.tags.split(',').map(t => t.trim()).filter(Boolean) 
            : (Array.isArray(day.tags) ? day.tags : [])
        }));
      }

      // Generate ID from title slug (e.g. "Golden Triangle Tour" → "golden-triangle-tour")
      const isNumericId = tourToSave.id && /^\d+$/.test(String(tourToSave.id));
      if (!tourToSave.id || !isEdit || isNumericId) {
      // Generate ID from slug (or title if slug is empty)
      const baseSlug = (tourToSave.slug || tourToSave.title || 'untitled-tour')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')  // Remove special chars
        .replace(/\s+/g, '-')           // Spaces → hyphens
        .replace(/-+/g, '-')            // Collapse multiple hyphens
        .replace(/^-|-$/g, '');         // Trim leading/trailing hyphens
      
      // If editing AND the slug hasn't changed from the original ID, keep the original ID
      if (isEdit && !isNumericId && tourToSave.slug === id) {
        tourToSave.id = id;
      } else {
        // Ensure uniqueness: if slug already exists (and not this tour), append a number
        let finalSlug = baseSlug;
        let counter = 1; // User said "if the slug is already added... automatically add single numeric value"
        
        // Loop to find an available slug
        while (tours.some(t => String(t.id) === finalSlug && (!isEdit || String(t.id) !== String(id)))) {
          finalSlug = `${baseSlug}-${counter}`;
          counter++;
        }
        tourToSave.id = finalSlug;
        tourToSave.slug = finalSlug; // Sync record as well
      }
      }


      // Sync new pricing fields to legacy 'price' field for backward compatibility
      if (tourToSave.pricePerPerson) {
        tourToSave.price = tourToSave.pricePerPerson;
      } else if (tourToSave.pricePerCouple) {
        tourToSave.price = tourToSave.pricePerCouple;
      } else if (tourToSave.pricePerGroup) {
        tourToSave.price = tourToSave.pricePerGroup;
      }

      // Handle 'No end date' flags
      if (tourToSave.noBookingEnd) {
        tourToSave.bookingEnd = '';
      }
      if (tourToSave.noAvailableTo) {
        tourToSave.availableTo = '';
      }

      let updatedTours;
      if (isEdit) {
        updatedTours = tours.map(t => String(t.id) === String(id) ? tourToSave : t);
        // If it wasn't found (first time editing), add it
        if (!tours.find(t => String(t.id) === String(id))) {
          updatedTours = [...tours, tourToSave];
        }
      } else {
        updatedTours = [...tours, tourToSave];
      }

      // Save to server via PHP API
      const targetUrl = import.meta.env.MODE === 'development' 
        ? '/api/save-tours' 
        : `${import.meta.env.BASE_URL}api-save-tours.php`;
      
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTours)
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save to server');
      }

      // Also update localStorage as a cache for faster page loads
      localStorage.setItem('beautifulindia_admin_tours', JSON.stringify(updatedTours));
      
      const statusMsg = tourToSave.status === 'draft' ? 'Draft Saved' : (isEdit ? 'Tour Updated' : 'Tour Published');
      alert(`${statusMsg} Successfully!`);
      
      setLoading(false);
      navigate('/admin/tours');
    } catch (err) {
      console.error("Save error:", err);
      alert(`Error saving tour: ${err.message}. Please try again.`);
      setLoading(false);
    }
  };

  // ── Image helpers — images are stored as { url, caption } objects ──
  const normalizeImages = (raw) => {
    if (!raw || raw.length === 0) return [];
    return raw.map(img => {
      if (typeof img === 'string') return { url: img, caption: '' };
      if (img && img.url) return img;
      return { url: String(img), caption: '' };
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width, height = img.height;
            const MAX = 1200;
            if (width > height && width > MAX) { height *= MAX / width; width = MAX; }
            else if (height > MAX) { width *= MAX / height; height = MAX; }
            canvas.width = width; canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/webp', 0.85));
          };
          img.onerror = reject;
          img.src = ev.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })).then(base64Urls => {
      setFormData(prev => {
        const existing = normalizeImages(prev.images && prev.images.length > 0 ? prev.images : (prev.image ? [prev.image] : []));
        // Use filename (without extension) as default caption
        const newImgs = base64Urls.map((url, i) => ({
          url,
          caption: (files[i]?.name || '').replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
        }));
        const all = [...existing, ...newImgs];
        return { ...prev, images: all, image: all[0]?.url || prev.image };
      });
    });
  };

  const handleCaptionChange = (index, caption) => {
    setFormData(prev => {
      const imgs = normalizeImages(prev.images);
      imgs[index] = { ...imgs[index], caption };
      return { ...prev, images: imgs };
    });
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => {
      const imgs = normalizeImages(prev.images && prev.images.length > 0 ? prev.images : (prev.image ? [prev.image] : []));
      imgs.splice(index, 1);
      return { ...prev, images: imgs, image: imgs[0]?.url || '' };
    });
  };

  const [draggedImgIdx, setDraggedImgIdx] = React.useState(null);
  const handleDragStartImg = (idx) => setDraggedImgIdx(idx);
  const handleDragOverImg = (e) => e.preventDefault();
  const handleDropImg = (idx) => {
    if (draggedImgIdx === null || draggedImgIdx === idx) return;
    setFormData(prev => {
      const imgs = normalizeImages(prev.images && prev.images.length > 0 ? prev.images : (prev.image ? [prev.image] : []));
      const [moved] = imgs.splice(draggedImgIdx, 1);
      imgs.splice(idx, 0, moved);
      return { ...prev, images: imgs, image: imgs[0]?.url || '' };
    });
    setDraggedImgIdx(null);
  };

  return (
    <div data-page="admin_new_tour_upload_form">
      <div className="relative flex h-screen w-full flex-col group/design-root overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col hidden md:flex">
            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin">
<span className="material-symbols-outlined text-[20px] text-slate-500">space_dashboard</span>
<span className="text-[15px] font-medium">Overview</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] bg-[#eefaf9] text-[#0a6c75] transition-colors" to="/admin">
<span className="material-symbols-outlined text-[20px] text-[#0a6c75]">tour</span>
<span className="text-[15px] font-medium">Manage Tours</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/bookings">
<span className="material-symbols-outlined text-[20px] text-slate-500">group</span>
<span className="text-[15px] font-medium">Bookings</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/guides">
<span className="material-symbols-outlined text-[20px] text-slate-500">menu_book</span>
<span className="text-[15px] font-medium">Guides & Blogs</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/categorization">
<span className="material-symbols-outlined text-[20px] text-slate-500">category</span>
<span className="text-[15px] font-medium">Categorization</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/referral/dashboard">
<span className="material-symbols-outlined text-[20px] text-slate-500">payments</span>
<span className="text-[15px] font-medium">Financials</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/queries">
<span className="material-symbols-outlined text-[20px] text-slate-500">contact_support</span>
<span className="text-[15px] font-medium">Queries</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/leads">
<span className="material-symbols-outlined text-[20px] text-slate-500">smart_toy</span>
<span className="text-[15px] font-medium">Chatbot Leads</span>
</Link>
</nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10">
            {/* Page Heading component adapted */}
            <div className="flex flex-col gap-2 mb-8">
              <nav className="flex text-xs font-medium text-slate-400 mb-2 gap-2 items-center">
                <Link className="hover:text-primary" to="/admin">Admin</Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <Link className="hover:text-primary" to="/admin/tours">Tours</Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                {typeParam === 'train' ? (
                  <>
                    <span className="text-slate-600 dark:text-slate-300">Train Tours</span>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-slate-600 dark:text-slate-300 font-bold">Create New Train tour</span>
                  </>
                ) : (
                  <span className="text-slate-600 dark:text-slate-300">{isEdit ? 'Edit Tour' : 'Add New'}</span>
                )}
              </nav>
              <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight">
                {typeParam === 'train' ? 'Create New Train Tour' : (isEdit ? 'Edit Tour Package' : 'Create New Tour')}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal">{isEdit ? 'Modify the existing tour details below.' : 'Fill in the comprehensive details below to publish a new tour package.'}</p>
            </div>
{/* Form Container */}
<div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
<form className="p-6 md:p-8 space-y-8" onSubmit={handleSubmit}>
{/* Section 1: Basic Info */}
<div className="space-y-6">
<h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Basic Information</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* Title */}
<div className="col-span-1 md:col-span-2 space-y-4">
  <label className="flex flex-col flex-1">
    <span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Tour Title <span className="text-red-500">*</span></span>
    <input 
      name="title"
      value={formData.title}
      onChange={handleChange}
      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-400 dark:placeholder-slate-500 transition-colors" 
      placeholder="e.g. 7-Day Majestic Alps Adventure" 
      required="" 
      type="text"
    />
  </label>
  
  <label className="flex flex-col flex-1">
    <div className="flex items-center justify-between pb-2">
      <span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal">Tour Slug <span className="text-[10px] text-slate-400 ml-2">(Used in URL)</span></span>
      <button 
        type="button" 
        onClick={() => {
          const s = (formData.title || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          setFormData(prev => ({ ...prev, slug: s }));
        }}
        className="text-[10px] text-primary hover:underline"
      >
        Regenerate from Title
      </button>
    </div>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">/tours/dest/state/sub/</span>
      <input 
        name="slug"
        value={formData.slug}
        onChange={handleChange}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white pl-36 pr-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-400 dark:placeholder-slate-500 transition-colors font-mono" 
        placeholder="majestic-alps-adventure" 
        type="text"
      />
    </div>
    <p className="text-[10px] text-slate-400 mt-1">Leave empty to auto-generate from title. If the slug exists, a number will be appended automatically.</p>
  </label>
</div>

{/* ── HOTEL & ACCOMMODATION (Shifted here - Multi-select) ── */}
<div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 dark:bg-slate-800/30 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
  
  {(() => {
    const isSameDayTour = (formData.duration || '').toLowerCase().includes('same day') || (formData.duration || '').toLowerCase().includes('1 day');
    
    return (
      <>
        {!isSameDayTour && (
          <>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">star</span> Hotel Category
                <span className="text-[10px] font-normal text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full ml-auto">Multi-select</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.hotelCategories.map(cat => {
                  const isSelected = (formData.hotelCategory || []).includes(cat.value);
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => {
                        const current = formData.hotelCategory || [];
                        const updated = current.includes(cat.value)
                          ? current.filter(v => v !== cat.value)
                          : [...current, cat.value];
                        setFormData(prev => ({ ...prev, hotelCategory: updated }));
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-md transform scale-105'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary/50'
                      }`}
                    >
                      <span>{cat.icon}</span> {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">apartment</span> Accommodation Type
                <span className="text-[10px] font-normal text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full ml-auto">Single-select</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.accommodationTypes.map(type => {
                  const isSelected = formData.accommodationType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, accommodationType: type.value }))}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        isSelected
                          ? 'bg-[#0a6c75] text-white border-[#0a6c75] shadow-md transform scale-105'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0a6c75]/50'
                      }`}
                    >
                      <span>{type.icon}</span> {type.label}
                    </button>
                  );
                })}
              </div>

              {formData.accommodationType === 'mixed' && (
                <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-xl mt-4 border border-slate-200 dark:border-slate-700 w-full">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">account_tree</span> Specific Mixed Stays
                    <span className="text-[10px] font-normal text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full ml-auto">Multi-select</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.accommodationTypes.filter(t => t.value !== 'mixed').map(type => {
                      const isSelected = (formData.mixedAccommodations || []).includes(type.value);
                      return (
                        <button
                          key={`mixed-${type.value}`}
                          type="button"
                          onClick={() => {
                            const current = formData.mixedAccommodations || [];
                            const updated = current.includes(type.value)
                              ? current.filter(v => v !== type.value)
                              : [...current, type.value];
                            setFormData(prev => ({ ...prev, mixedAccommodations: updated }));
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold border transition-all ${
                            isSelected
                              ? 'bg-[#0a6c75] text-white border-[#0a6c75] shadow-md transform scale-105'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0a6c75]/50'
                          }`}
                        >
                          <span>{type.icon}</span> {type.label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-slate-400 mt-3 italic">Select all modes of stay involved in this tour.</p>
                </div>
              )}
            </div>
          </>
        )}
      </>
    );
  })()}

  <div className="col-span-1 md:col-span-2">
    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-5 mt-2">
      <span className="material-symbols-outlined text-[18px]">directions_transit</span> Transport Type
      <span className="text-[10px] font-normal text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full ml-auto">Single-select</span>
    </p>
    <div className="flex flex-wrap gap-2">
      {categories.transports.map(tr => {
        const isSelected = formData.transport === tr.value;
        return (
          <button
            key={tr.value}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, transport: tr.value }))}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
              isSelected
                ? 'bg-[#0a6c75] text-white border-[#0a6c75] shadow-md transform scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0a6c75]/50'
            }`}
          >
            <span>{tr.icon}</span> {tr.label}
          </button>
        );
      })}
    </div>

    {formData.transport === 'mixed' && (
      <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-xl mt-4 border border-slate-200 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">account_tree</span> Specific Mixed Transport Types
          <span className="text-[10px] font-normal text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full ml-auto">Multi-select</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.transports.filter(t => t.value !== 'mixed').map(tr => {
            const isSelected = (formData.mixedTransports || []).includes(tr.value);
            return (
              <button
                key={`mixed-${tr.value}`}
                type="button"
                onClick={() => {
                  const current = formData.mixedTransports || [];
                  const updated = current.includes(tr.value)
                    ? current.filter(v => v !== tr.value)
                    : [...current, tr.value];
                  setFormData(prev => ({ ...prev, mixedTransports: updated }));
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold border transition-all ${
                  isSelected
                    ? 'bg-[#0a6c75] text-white border-[#0a6c75] shadow-md transform scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0a6c75]/50'
                }`}
              >
                <span>{tr.icon}</span> {tr.label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-3 italic">Select all modes of transport involved in this multi-leg journey.</p>
      </div>
    )}
  </div>
</div>
{/* City Path */}
<div className="col-span-1 md:col-span-2">
<label className="flex flex-col flex-1">
<span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">City Path (Highlight Cities)</span>
<input 
  name="cityPath"
  value={formData.cityPath || ''}
  onChange={handleChange}
  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-400 dark:placeholder-slate-500 transition-colors" 
  placeholder="e.g. Kashmir (2D) → Srinagar (2D) → Gulmarg (2D) - Pahalgam (1D)" 
  type="text"
/>
</label>
</div>
{/* Description (Rich Text Mock) */}
<div className="col-span-1 md:col-span-2">
<label className="flex flex-col flex-1">
<span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Description</span>
<div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors">
      {/* Toolbar */}
      <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 px-3 py-2 flex gap-2 text-slate-500 dark:text-slate-400">
        <button 
          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors" 
          type="button" 
          onClick={() => insertFormatting(null, '**', '**', true)}
          title="Bold"
        >
          <span className="material-symbols-outlined text-sm">format_bold</span>
        </button>
        <button 
          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors" 
          type="button" 
          onClick={() => insertFormatting(null, '- ', '', true)}
          title="Bullet List"
        >
          <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
        </button>
        <button 
          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors" 
          type="button" 
          onClick={() => insertFormatting(null, '[', '](https://)', true)}
          title="Insert Link"
        >
          <span className="material-symbols-outlined text-sm">link</span>
        </button>
      </div>
      <textarea 
        id="main-description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 text-sm border-0 focus:ring-0 min-h-[160px] resize-y placeholder-slate-400" 
        placeholder="Write a compelling description of the tour..."
      ></textarea>
</div>
</label>
</div>
{/* Highlights */}
<div className="col-span-1 md:col-span-2">
<label className="flex flex-col flex-1">
<span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Highlights (one per line)</span>
<textarea
  name="highlights"
  value={formData.highlights || ''}
  onChange={handleChange}
  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-400 min-h-[120px] resize-y"
  placeholder="Enjoy a trekking trip to Vaishno Devi Temple&#10;Enjoy skiing at Gulmarg"
></textarea>
</label>
</div>
{/* Best Time to Visit */}
<div className="col-span-1 md:col-span-2 mt-4">
<label className="flex flex-col flex-1">
<span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Best Time to Visit</span>
<input 
  name="bestTimeToVisit"
  value={formData.bestTimeToVisit || ''}
  onChange={handleChange}
  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-400 dark:placeholder-slate-500 transition-colors" 
  placeholder="e.g. Mar - Jun & Oct - Nov" 
  type="text"
/>
</label>
</div>
</div>
</div>

{/* Section: Pricing & Duration */}
<div className="space-y-6">
<h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
  <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
  Pricing & Duration
</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* Duration */}
<div>
<label className="flex flex-col flex-1">
<span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Tour Duration <span className="text-red-500">*</span></span>
<input 
  name="duration"
  value={formData.duration || ''}
  onChange={handleChange}
  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-400 dark:placeholder-slate-500 transition-colors" 
  placeholder="e.g. 5 Days / 4 Nights" 
  type="text"
/>
</label>
</div>
{/* Price Category */}
<div>
<label className="flex flex-col flex-1">
<span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Price Category</span>
<select 
  name="priceCategory"
  value={formData.priceCategory || ''}
  onChange={handleChange}
  className="custom-select w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
>
<option value="">Select category</option>
<option value="budget">💰 Budget</option>
<option value="standard">⭐ Standard</option>
<option value="premium">💎 Premium</option>
<option value="luxury">👑 Luxury</option>
</select>
</label>
</div>
</div>

{/* Pricing Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
  {/* Per Person Price */}
  <div className={`relative rounded-2xl border-2 p-5 transition-all ${
    formData.pricePerPerson ? 'border-primary/40 bg-primary/5 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30'
  }`}>
    <div className="flex items-center gap-2 mb-3">
      <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
        <span className="material-symbols-outlined text-blue-600 text-[18px]">person</span>
      </span>
      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Per Person</span>
    </div>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
      <input 
        name="pricePerPerson"
        value={formData.pricePerPerson || ''}
        onChange={handleChange}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white pl-8 pr-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-400 transition-colors font-semibold" 
        placeholder="e.g. 15000" 
        type="number"
        min="0"
      />
    </div>
    <p className="text-[11px] text-slate-400 mt-2">Standard price for one traveler</p>
  </div>

  {/* Per Couple Price */}
  <div className={`relative rounded-2xl border-2 p-5 transition-all ${
    formData.pricePerCouple ? 'border-pink-400/40 bg-pink-50/50 dark:bg-pink-900/10 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30'
  }`}>
    <div className="flex items-center gap-2 mb-3">
      <span className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
        <span className="material-symbols-outlined text-pink-600 text-[18px]">favorite</span>
      </span>
      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Per Couple</span>
      {formData.pricePerPerson && formData.pricePerCouple && Number(formData.pricePerCouple) < Number(formData.pricePerPerson) * 2 && (
        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-auto">SAVE {Math.round(100 - (Number(formData.pricePerCouple) / (Number(formData.pricePerPerson) * 2)) * 100)}%</span>
      )}
    </div>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
      <input 
        name="pricePerCouple"
        value={formData.pricePerCouple || ''}
        onChange={handleChange}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white pl-8 pr-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-400 transition-colors font-semibold" 
        placeholder="e.g. 25000" 
        type="number"
        min="0"
      />
    </div>
    <p className="text-[11px] text-slate-400 mt-2">Discounted price for 2 travelers together</p>
  </div>

  {/* Per Group Price */}
  <div className={`relative rounded-2xl border-2 p-5 transition-all ${
    formData.pricePerGroup ? 'border-emerald-400/40 bg-emerald-50/50 dark:bg-emerald-900/10 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30'
  }`}>
    <div className="flex items-center gap-2 mb-3">
      <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
        <span className="material-symbols-outlined text-emerald-600 text-[18px]">groups</span>
      </span>
      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Per Group</span>
      {formData.pricePerPerson && formData.pricePerGroup && formData.groupSize && Number(formData.pricePerGroup) < Number(formData.pricePerPerson) * Number(formData.groupSize) && (
        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-auto">SAVE {Math.round(100 - (Number(formData.pricePerGroup) / (Number(formData.pricePerPerson) * Number(formData.groupSize))) * 100)}%</span>
      )}
    </div>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
      <input 
        name="pricePerGroup"
        value={formData.pricePerGroup || ''}
        onChange={handleChange}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white pl-8 pr-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-400 transition-colors font-semibold" 
        placeholder="e.g. 100000" 
        type="number"
        min="0"
      />
    </div>
    <div className="mt-2 flex items-center gap-2">
      <span className="text-[11px] text-slate-400">Group size:</span>
      <input 
        name="groupSize"
        value={formData.groupSize || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, groupSize: parseInt(e.target.value) || '' }))}
        className="w-16 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-2 py-1 text-xs text-center focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
        placeholder="10" 
        type="number"
        min="2"
      />
      <span className="text-[11px] text-slate-400">persons</span>
    </div>
  </div>
</div>

{/* Pricing Preview */}
{(formData.pricePerPerson || formData.pricePerCouple || formData.pricePerGroup) && (
  <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl px-5 py-4">
    <div className="flex items-center gap-2 mb-2">
      <span className="material-symbols-outlined text-primary text-[18px]">receipt_long</span>
      <span className="text-sm font-bold text-teal-800 dark:text-teal-300">Price Preview (as seen by visitors)</span>
    </div>
    <div className="flex flex-wrap gap-4 text-sm">
      {formData.pricePerPerson && (
        <span className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-teal-200 dark:border-teal-800">
          <span className="material-symbols-outlined text-blue-500 text-[16px]">person</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">₹{Number(formData.pricePerPerson).toLocaleString('en-IN')}</span>
          <span className="text-slate-400 text-xs">/person</span>
        </span>
      )}
      {formData.pricePerCouple && (
        <span className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-pink-200 dark:border-pink-800">
          <span className="material-symbols-outlined text-pink-500 text-[16px]">favorite</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">₹{Number(formData.pricePerCouple).toLocaleString('en-IN')}</span>
          <span className="text-slate-400 text-xs">/couple</span>
        </span>
      )}
      {formData.pricePerGroup && (
        <span className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <span className="material-symbols-outlined text-emerald-500 text-[16px]">groups</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">₹{Number(formData.pricePerGroup).toLocaleString('en-IN')}</span>
          <span className="text-slate-400 text-xs">/group of {formData.groupSize || '?'}</span>
        </span>
      )}
    </div>
  </div>
)}
</div>

{/* Section 2: Categorization */}
<div className="space-y-8">
<div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Categorization &amp; Discovery</h2>
  <span className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full">Controls where this tour appears on the homepage &amp; tours page</span>
</div>

{/* ── POPULAR DESTINATION QUICK-PICKS ── */}
<div>
  <div className="flex items-center justify-between mb-2">
    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
      📍 Popular Destination
      <span className="font-normal text-slate-400 ml-1">(Quick-pick from Bharat Darshan)</span>
    </p>
    <Link
      to="/admin/categorization"
      target="_blank"
      className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
    >
      <span className="material-symbols-outlined text-[14px]">edit</span>
      Manage destinations ↗
    </Link>
  </div>
  <div className="flex flex-wrap gap-2 mb-4">
    {(categories.destinationStates?.India || categories.destinationStates?.india || []).map(stateName => (
      <button
        key={stateName}
        type="button"
        onClick={() => setFormData(prev => ({ ...prev, destination: 'India', stateRegion: stateName, subregion: '' }))}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
          formData.stateRegion === stateName
            ? 'bg-primary text-white border-primary shadow-sm'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
        }`}
      >
        <span>{DEST_ICON_MAP[stateName] || '📍'}</span> {stateName}
      </button>
    ))}
  </div>
</div>

{/* ── TRAVEL THEME CHIPS ── */}
<div>
  <div className="flex items-center justify-between mb-2">
    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
      🏷️ Travel Theme
      <span className="font-normal text-slate-400 ml-1">(Appears in "Travel by Theme" on homepage)</span>
    </p>
    <Link
      to="/admin/categorization"
      target="_blank"
      className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
    >
      <span className="material-symbols-outlined text-[14px]">edit</span>
      Manage themes ↗
    </Link>
  </div>
  <div className="flex flex-wrap gap-2 mb-4">
    {(categories.themes || []).map(t => {
      const themeObj = typeof t === 'string' 
        ? { value: t, label: t.charAt(0).toUpperCase() + t.slice(1), icon: '🏷️' } 
        : t;
      return (
        <button
          key={themeObj.value}
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, theme: themeObj.value }))}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
            formData.theme === themeObj.value
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
          }`}
        >
          <span>{themeObj.icon || '🏷️'}</span> {themeObj.label || themeObj.value}
        </button>
      );
    })}
  </div>
</div>

{/* ── TOUR NATURE CHIPS ── */}
<div>
  <div className="flex items-center justify-between mb-2">
    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
      🤝 Tour Nature
      <span className="font-normal text-slate-400 ml-1">(Group type, Private, etc.)</span>
    </p>
    <Link
      to="/admin/categorization"
      target="_blank"
      className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
    >
      <span className="material-symbols-outlined text-[14px]">edit</span>
      Manage nature ↗
    </Link>
  </div>
  <div className="flex flex-wrap gap-2 mb-4">
    {(categories.natures || []).map(n => {
      const val = typeof n === 'string' ? n : n.value;
      const lab = typeof n === 'string' ? n.charAt(0).toUpperCase() + n.slice(1) : n.label;
      return (
        <button
          key={val}
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, nature: val }))}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
            formData.nature === val
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
          }`}
        >
          <span>{formData.nature === val ? '✅' : '🤝'}</span> {lab}
        </button>
      );
    })}
  </div>
</div>

{/* ── ACCOMMODATION STYLE CHIPS ── */}
{(() => {
  const isSameDayTour = (formData.duration || '').toLowerCase().includes('same day') || (formData.duration || '').toLowerCase().includes('1 day');
  if (isSameDayTour) return null;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          🏨 Accommodation Style
          <span className="font-normal text-slate-400 ml-1">(Budget vs Luxury tier)</span>
        </p>
        <Link
          to="/admin/categorization"
          target="_blank"
          className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          <span className="material-symbols-outlined text-[14px]">edit</span>
          Manage styles ↗
        </Link>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {(categories.styles || []).map(s => {
          const val = typeof s === 'string' ? s : s.value;
          const lab = typeof s === 'string' ? s.charAt(0).toUpperCase() + s.slice(1) : s.label;
          return (
            <button
              key={val}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, style: val }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                formData.style === val
                  ? 'bg-[#0a6c75] text-white border-[#0a6c75] shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0a6c75] hover:text-[#0a6c75]'
              }`}
            >
              <span>{formData.style === val ? '✨' : '🏨'}</span> {lab}
            </button>
          );
        })}
      </div>
    </div>
  );
})()}



{/* Live Preview Badge */}
{(formData.stateRegion || formData.theme) && (
  <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl px-5 py-4 flex flex-wrap items-center gap-3">
    <span className="material-symbols-outlined text-primary text-[20px]">visibility</span>
    <span className="text-sm font-semibold text-teal-800 dark:text-teal-300">This tour will appear when visitors:</span>
    {formData.stateRegion && (
      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
        📍 Click "{formData.stateRegion}" on homepage
      </span>
    )}
    {formData.theme && (
      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
        🏷️ Filter by "{formData.theme.charAt(0).toUpperCase() + formData.theme.slice(1)}" theme
      </span>
    )}
  </div>
)}


{/* Conditional: Min Persons for Group/Private Tours */}
{(formData.nature === 'group' || formData.nature === 'private') && (
  <div>
    <label className="flex flex-col flex-1">
      <span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Minimum Persons Required</span>
      <input 
        name="minPersons"
        value={formData.minPersons}
        onChange={(e) => setFormData(prev => ({ ...prev, minPersons: parseInt(e.target.value) }))}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-400" 
        min="1" 
        type="number"
      />
      <p className="text-xs text-slate-500 mt-1">Specify for "Group" or "Private" pricing tiers.</p>
    </label>
  </div>
)}
</div>{/* end Section 2 */}

{/* Section: Visibility & Ordering */}
<div className="space-y-6">
<h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Visibility & Ordering</h2>
{/* Status and Visibility */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="flex flex-col flex-1">
<span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Status</span>
<select 
  name="status"
  value={formData.status}
  onChange={handleChange}
  className="custom-select w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
>
<option value="active">Active</option>
<option value="paused">Paused</option>
</select>
</label>
</div>

{/* Dynamic Home Page Placements */}
<div className="col-span-1 md:col-span-2 space-y-3">
  <span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2 block">Show this tour on the Home Page in the following sections:</span>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {['Popular Destinations', 'Recommended Tour Packages', 'Top 4 Metro Cities of India', 'Travel by Train'].map(section => (
      <label key={section} className="flex items-center gap-3 cursor-pointer group bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors">
        <div className="relative flex items-center justify-center">
          <input 
            type="checkbox"
            name="homePagePlacements"
            checked={(formData.homePagePlacements || []).includes(section)}
            onChange={(e) => {
              const currentPlacements = formData.homePagePlacements || [];
              const newPlacements = e.target.checked 
                ? [...currentPlacements, section]
                : currentPlacements.filter(p => p !== section);
              setFormData(prev => ({ ...prev, homePagePlacements: newPlacements }));
            }}
            className="peer appearance-none w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded cursor-pointer checked:bg-primary checked:border-primary transition-colors focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
          <span className="material-symbols-outlined absolute text-white text-sm opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">check</span>
        </div>
        <span className="text-slate-800 dark:text-slate-200 text-sm font-semibold group-hover:text-primary transition-colors">{section}</span>
      </label>
    ))}
  </div>
</div>
{/* Display Order */}
<div>
<label className="flex flex-col flex-1">
<span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Display Hierarchy (Order)</span>
<input 
  name="order"
  value={formData.order}
  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-400" 
  min="0" 
  placeholder="e.g. 1" 
  type="number"
/>
<p className="text-xs text-slate-500 mt-1">Lower numbers appear first on the website.</p>
</label>
</div>
</div>
{/* Is Featured */}
<div className="mt-6 flex items-center">
<label className="flex items-center cursor-pointer">
<input 
  name="isFeatured"
  type="checkbox"
  checked={formData.isFeatured || false}
  onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
  className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary focus:ring-2 cursor-pointer transition-colors"
/>
<span className="ml-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Feature on Home Page</span>
</label>
<p className="ml-8 mt-1 text-xs text-slate-500">Checking this box will display this tour in the "Featured Tours" section on the main landing page.</p>
</div>
</div>
{/* Section 3: Itinerary */}
<div className="space-y-6">
  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Day-by-Day Itinerary</h2>
    <button 
      type="button" 
      onClick={handleAddDay}
      className="text-sm bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium transition-colors"
    >
      <span className="material-symbols-outlined text-[18px]">add</span> Add Day
    </button>
  </div>
  
  <div className="space-y-4">
    {(formData.itinerary || []).map((day, index) => (
      <div key={index} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">Day {day.day}</h3>
          {(formData.itinerary || []).length > 1 && (
            <button 
              type="button" 
              onClick={() => handleRemoveDay(index)}
              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-1 rounded transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <label className="flex flex-col">
            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium pb-1">Day Title</span>
            <input 
              value={day.title || ''}
              onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
              placeholder="e.g. Arrival & Orientation" 
              type="text"
            />
          </label>
          <label className="flex flex-col">
            <div className="flex items-center justify-between pb-1">
              <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">Day Description</span>
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700/50">
                <button 
                  type="button" 
                  onClick={() => insertFormatting(index, '**', '**')} 
                  className="p-1 hover:text-primary transition-colors flex items-center gap-0.5" 
                  title="Bold"
                >
                  <span className="material-symbols-outlined text-[18px]">format_bold</span>
                </button>
                <div className="w-[1px] h-3 bg-slate-200 dark:bg-slate-700" />
                <button 
                  type="button" 
                  onClick={() => insertFormatting(index, '- ')} 
                  className="p-1 hover:text-primary transition-colors flex items-center gap-0.5" 
                  title="Bullet List"
                >
                  <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                </button>
                <div className="w-[1px] h-3 bg-slate-200 dark:bg-slate-700" />
                <button 
                  type="button" 
                  onClick={() => insertFormatting(index, '[', '](https://)')} 
                  className="p-1 hover:text-primary transition-colors flex items-center gap-0.5" 
                  title="Insert Link"
                >
                  <span className="material-symbols-outlined text-[18px]">link</span>
                </button>
              </div>
            </div>
            <textarea 
              id={`day-desc-${index}`}
              value={day.description || ''}
              onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[120px] resize-y" 
              placeholder="Describe the activities for this day... (Use toolbar to format)"
            ></textarea>
          </label>
          {/* Highlight Tags */}
          <label className="flex flex-col">
            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium pb-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-primary">label</span>
              Highlight Tags
            </span>
            <input 
              value={typeof day.tags === 'string' ? day.tags : (Array.isArray(day.tags) ? day.tags.join(', ') : '')}
              onChange={(e) => handleItineraryChange(index, 'tags', e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
              placeholder="e.g. Dal Lake, Gondola Ride, Gulmarg (comma-separated)" 
              type="text"
            />
            <p className="text-xs text-slate-400 mt-1">These appear as pill-shaped tags on the tour detail page.</p>
          </label>
          {/* Services Checkboxes */}
          <div className="flex flex-col">
            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium pb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-primary">room_service</span>
              Services Included
            </span>
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'breakfast', icon: 'free_breakfast', label: 'Breakfast', color: 'text-amber-600' },
                { id: 'lunch',     icon: 'lunch_dining',   label: 'Lunch',     color: 'text-green-600' },
                { id: 'dinner',    icon: 'dinner_dining',  label: 'Dinner',    color: 'text-orange-600' },
                { id: 'stay',      icon: 'hotel',          label: 'Stay',      color: 'text-blue-600' },
                { id: 'transfer',  icon: 'airport_shuttle',label: 'Transfer',  color: 'text-purple-600' },
                { id: 'sightseeing',icon:'photo_camera', label:'Sightseeing', color:'text-teal-600' },
                { id: 'flight',    icon: 'flight',         label: 'Flight',    color: 'text-sky-600' },
                { id: 'train',     icon: 'train',          label: 'Train',     color: 'text-indigo-600' },
              ].map(svc => {
                const currentServices = Array.isArray(day.services) ? day.services : [];
                const isSelected = currentServices.includes(svc.id);
                return (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => {
                      const updated = isSelected
                        ? currentServices.filter(s => s !== svc.id)
                        : [...currentServices, svc.id];
                      handleItineraryChange(index, 'services', updated);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-primary/10 border-primary/40 text-primary shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-primary/30'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${svc.color}`} style={{fontVariationSettings:"'FILL' 0, 'wght' 300"}}>{svc.icon}</span>
                    <span className="text-xs font-semibold">{svc.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
{/* Section 4: FAQs */}
<div className="space-y-6">
  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
    <button 
      type="button" 
      onClick={handleAddFaq}
      className="text-sm bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium transition-colors"
    >
      <span className="material-symbols-outlined text-[18px]">add</span> Add FAQ
    </button>
  </div>
  
  <div className="space-y-4">
    {(formData.faq || []).map((item, index) => (
      <div key={index} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">Question {index + 1}</h3>
          {(formData.faq || []).length > 1 && (
            <button 
              type="button" 
              onClick={() => handleRemoveFaq(index)}
              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-1 rounded transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <label className="flex flex-col">
            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium pb-1">Question</span>
            <input 
              value={item.question || ''}
              onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
              placeholder="e.g. Is this tour suitable for children?" 
              type="text"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium pb-1">Answer</span>
            <textarea 
              value={item.answer || ''}
              onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px] resize-y" 
              placeholder="Your answer..."
            ></textarea>
          </label>
        </div>
      </div>
    ))}
  </div>
</div>
{/* Section 4.5: Inclusions & Exclusions */}
<div className="space-y-6 mb-12">
  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Package Inclusions & Exclusions</h2>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Inclusions */}
    <label className="flex flex-col flex-1">
      <span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Inclusions (one per line)</span>
      <textarea
        name="inclusions"
        value={formData.inclusions || ''}
        onChange={handleChange}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-400 min-h-[120px] resize-y"
        placeholder="Accommodation&#10;Meals&#10;Transportation"
      ></textarea>
    </label>
    {/* Exclusions */}
    <label className="flex flex-col flex-1">
      <span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Exclusions (one per line)</span>
      <textarea
        name="exclusions"
        value={formData.exclusions || ''}
        onChange={handleChange}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-400 min-h-[120px] resize-y"
        placeholder="Visas&#10;Personal travel insurance&#10;Optional activities"
      ></textarea>
    </label>
  </div>
</div>

{/* Section 5: Media Gallery */}
<div className="space-y-6">
  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Media Gallery</h2>
    <span className="text-xs text-slate-400">
      {normalizeImages(formData.images).length} photo{normalizeImages(formData.images).length !== 1 ? 's' : ''} · First photo is the primary cover
    </span>
  </div>

  {/* Drop Zone - Using div + ref to avoid form submission interference */}
  <div
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      // Programmatically trigger the hidden file input
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.click();
    }}
    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
    onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); }}
    onDrop={(e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleImageUpload({ target: { files: e.dataTransfer.files } });
      }
    }}
    className="flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 px-6 py-10 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-primary/50 transition-all group"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.getElementById('file-upload')?.click(); } }}
  >
    <span className="material-symbols-outlined text-5xl text-slate-400 group-hover:text-primary transition-colors mb-3">add_photo_alternate</span>
    <p className="text-sm font-semibold text-primary">Click to upload photos</p>
    <p className="text-xs text-slate-400 mt-1">Select multiple photos at once · JPG, PNG, WEBP</p>
    <p className="text-xs text-slate-400">Photos are auto-compressed to WebP for fast loading</p>
  </div>
  {/* Hidden file input - placed outside the clickable div to prevent event conflicts */}
  <input
    onChange={handleImageUpload}
    accept="image/*"
    className="sr-only"
    id="file-upload"
    multiple
    name="file-upload"
    type="file"
  />

  {/* Photo Grid with captions */}
  {normalizeImages(formData.images && formData.images.length > 0 ? formData.images : (formData.image ? [formData.image] : [])).length > 0 && (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {normalizeImages(formData.images && formData.images.length > 0 ? formData.images : (formData.image ? [formData.image] : [])).map((img, idx) => (
        <div
          key={idx}
          draggable
          onDragStart={() => handleDragStartImg(idx)}
          onDragOver={handleDragOverImg}
          onDrop={() => handleDropImg(idx)}
          className="group flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-move"
        >
          {/* Image thumbnail */}
          <div className="relative aspect-video bg-slate-100 dark:bg-slate-700">
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: `url(${img.url})` }}
            />
            {/* Overlay controls */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="text-white/80 text-[10px] font-medium tracking-wide">Drag to reorder</span>
            </div>
            {/* Primary badge */}
            {idx === 0 && (
              <div className="absolute top-2 left-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold z-10 flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]">star</span> Primary
              </div>
            )}
            {/* Delete button */}
            <button
              onClick={() => handleRemoveImage(idx)}
              type="button"
              className="absolute top-2 right-2 z-10 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
              title="Remove photo"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
          {/* Caption input */}
          <div className="p-2">
            <input
              type="text"
              value={img.caption || ''}
              onChange={(e) => handleCaptionChange(idx, e.target.value)}
              placeholder={idx === 0 ? 'e.g. Taj Mahal at sunrise' : `Caption for photo ${idx + 1}…`}
              className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2.5 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-300 dark:placeholder-slate-600"
            />
          </div>
        </div>
      ))}
    </div>
  )}

  {/* Helper tip */}
  {normalizeImages(formData.images).length > 0 && (
    <p className="text-xs text-slate-400 flex items-center gap-1">
      <span className="material-symbols-outlined text-[14px]">info</span>
      Captions appear below photos in the tour gallery on the user-facing tour page.
    </p>
  )}
</div>

{/* Redesigned Booking & Operation Dates section */}
<div className="mt-12 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
  <div className="flex items-center gap-3 mb-6">
    <div className="bg-primary/10 p-2 rounded-lg text-primary flex items-center justify-center">
      <span className="material-symbols-outlined text-[20px]">calendar_today</span>
    </div>
    <div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-none">Booking & Operation Dates</h2>
      <p className="text-xs text-slate-500 mt-1">Define when travelers can book and when the tour operates.</p>
    </div>
  </div>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {/* Booking Period */}
    <div className="space-y-4 pt-1">
      <label className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
          <span className="w-1 h-1 bg-primary rounded-full"></span> Booking Starts
        </span>
        <input 
          type="date" 
          name="bookingStart"
          value={formData.bookingStart || ''}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-sm"
        />
      </label>
    </div>

    <div className="space-y-4 pt-1">
      <label className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
          <span className="w-1 h-1 bg-red-400 rounded-full"></span> Booking Ends
        </span>
        <input 
          type="date" 
          name="bookingEnd"
          value={formData.noBookingEnd ? '' : (formData.bookingEnd || '')}
          onChange={handleChange}
          disabled={formData.noBookingEnd}
          className={`w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-sm ${formData.noBookingEnd ? 'opacity-40 cursor-not-allowed' : ''}`}
        />
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input 
          type="checkbox" 
          checked={formData.noBookingEnd || false}
          onChange={(e) => setFormData(prev => ({ ...prev, noBookingEnd: e.target.checked, bookingEnd: e.target.checked ? '' : prev.bookingEnd }))}
          className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
        />
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">No end date (open-ended)</span>
      </label>
    </div>

    {/* Operation Period */}
    <div className="space-y-4 pt-1 sm:border-l sm:pl-6 border-slate-200 dark:border-slate-700 lg:border-l-0 lg:pl-0">
      <label className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
          <span className="w-1 h-1 bg-emerald-400 rounded-full"></span> Operation From
        </span>
        <input 
          type="date" 
          name="availableFrom"
          value={formData.availableFrom || ''}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-sm"
        />
      </label>
    </div>

    <div className="space-y-4 pt-1 sm:pl-6 lg:pl-0 border-slate-200 dark:border-slate-700">
      <label className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
          <span className="w-1 h-1 bg-emerald-600 rounded-full"></span> Operation To
        </span>
        <input 
          type="date" 
          name="availableTo"
          value={formData.noAvailableTo ? '' : (formData.availableTo || '')}
          onChange={handleChange}
          disabled={formData.noAvailableTo}
          className={`w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-sm ${formData.noAvailableTo ? 'opacity-40 cursor-not-allowed' : ''}`}
        />
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input 
          type="checkbox" 
          checked={formData.noAvailableTo || false}
          onChange={(e) => setFormData(prev => ({ ...prev, noAvailableTo: e.target.checked, availableTo: e.target.checked ? '' : prev.availableTo }))}
          className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
        />
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">No end date (ongoing)</span>
      </label>
    </div>
  </div>
</div>
</form>
{/* Form Actions Footer */}
<div className="bg-slate-50 dark:bg-slate-800/50 px-6 md:px-8 py-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 rounded-b-xl">
<button 
  onClick={() => navigate('/admin')}
  className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent" type="button">
                    Discard Draft
                </button>
<button 
  onClick={(e) => {
    setFormData(prev => ({ ...prev, status: 'draft' }));
    setTimeout(() => handleSubmit(e), 0);
  }}
  className="px-5 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors border border-primary/20" type="button">
                    Save as Draft
                </button>
<button 
  type="button"
  onClick={handleSubmit}
  className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all shadow-sm flex items-center gap-2"
>
<span className="material-symbols-outlined text-sm">check_circle</span>
                    {isEdit ? 'Update Tour' : 'Publish Tour'}
                </button>
</div>
</div>
</main>
</div>
      </div>
    </div>
  );
};

export default AdminNewTourUploadForm;
