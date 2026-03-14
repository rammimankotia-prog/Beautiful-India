
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Auto-generated from: admin_new_tour_upload_form/code.html
 * Group: admin | Path: /admin/tours/new
 */
import { useNavigate, useParams } from 'react-router-dom';

const AdminNewTourUploadForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    destination: '',
    stateRegion: '',
    subregion: '',
    duration: '',
    price: '',
    priceBasis: 'per_person', // 'per_person', 'per_package'
    minPersons: 1,
    status: 'active',
    order: 0,
    theme: '',
    nature: 'group',
    style: '',
    priceCategory: '',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200',
    inclusions: '',
    exclusions: '',
    highlights: '',
    isFeatured: false,
    itinerary: [{ day: 1, title: '', description: '' }],
    faq: [{ question: '', answer: '' }],
    bookingStart: '',
    bookingEnd: '',
    availableFrom: '',
    availableTo: '',
    cityPath: ''
  });

  const [categories, setCategories] = React.useState({
    destinations: ['India', 'International', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania'],
    destinationStates: {
      'India': [
        'Himachal Pradesh', 'Kashmir', 'Rajasthan', 'Kerala', 'Ladakh', 'Goa',
        'Uttarakhand', 'Andaman Islands', 'Sikkim', 'Assam', 'Meghalaya',
        'Arunachal Pradesh', 'Odisha', 'Karnataka', 'Tamil Nadu', 'Maharashtra',
        'Gujarat', 'Madhya Pradesh', 'Uttar Pradesh', 'Bihar', 'West Bengal',
        'Telangana', 'Andhra Pradesh', 'Punjab', 'Haryana', 'Himachal Pradesh',
        'Jammu', 'Lakshadweep', 'Puducherry', 'Northeast India'
      ],
      'International': ['Thailand', 'Bali', 'Dubai', 'Singapore', 'Maldives', 'Sri Lanka', 'Nepal', 'Bhutan'],
      'Asia': ['Japan', 'Vietnam', 'Cambodia', 'Myanmar', 'Philippines', 'Malaysia'],
      'Europe': ['France', 'Italy', 'Switzerland', 'Greece', 'Spain', 'Portugal', 'Germany'],
      'Americas': ['USA', 'Canada', 'Mexico', 'Brazil', 'Peru', 'Argentina'],
      'Africa': ['Kenya', 'Tanzania', 'South Africa', 'Morocco', 'Egypt'],
      'Oceania': ['Australia', 'New Zealand', 'Fiji'],
    },
    subregionsByState: {
      'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala', 'Kasol', 'Spiti Valley', 'Kullu', 'Dalhousie', 'Bir Billing', 'Kinnaur', 'Kufri'],
      'Kashmir': ['Srinagar', 'Gulmarg', 'Pahalgam', 'Sonamarg', 'Yusmarg', 'Dal Lake', 'Betaab Valley'],
      'Rajasthan': ['Jaipur', 'Udaipur', 'Jaisalmer', 'Jodhpur', 'Pushkar', 'Ranthambore', 'Mount Abu', 'Bikaner'],
      'Kerala': ['Munnar', 'Alleppey', 'Wayanad', 'Thekkady', 'Kovalam', 'Varkala', 'Kochi', 'Kottayam'],
      'Ladakh': ['Leh', 'Pangong Lake', 'Nubra Valley', 'Tso Moriri', 'Zanskar', 'Khardung La', 'Magnetic Hill'],
      'Goa': ['North Goa', 'South Goa', 'Panaji', 'Old Goa', 'Calangute', 'Anjuna', 'Dudhsagar'],
      'Uttarakhand': ['Rishikesh', 'Haridwar', 'Nainital', 'Mussoorie', 'Jim Corbett', 'Kedarnath', 'Badrinath', 'Auli', 'Lansdowne'],
      'Andaman Islands': ['Port Blair', 'Havelock Island', 'Neil Island', 'Ross Island', 'Baratang', 'Diglipur'],
      'Sikkim': ['Gangtok', 'Pelling', 'Lachung', 'Ravangla', 'Namchi'],
    },
    // Homepage themes — these match exactly what shows on /tours?theme=X
    themes: [
      { value: 'honeymoon', label: 'Honeymoon', icon: '💍' },
      { value: 'family',    label: 'Family',    icon: '👨‍👩‍👧‍👦' },
      { value: 'solo',      label: 'Solo',      icon: '🎒' },
      { value: 'group',     label: 'Group',     icon: '🤝' },
      { value: 'adventure', label: 'Adventure', icon: '🏔️' },
      { value: 'pilgrimage',label: 'Pilgrimage',icon: '🙏' },
      { value: 'photography',label:'Photography',icon:'📸' },
      { value: 'luxury',    label: 'Luxury',    icon: '💎' },
      { value: 'trekking',  label: 'Trekking',  icon: '🥾' },
      { value: 'beach',     label: 'Beach',     icon: '🏖️' },
      { value: 'wildlife',  label: 'Wildlife',  icon: '🐅' },
      { value: 'cultural',  label: 'Cultural',  icon: '🏛️' },
    ],
    natures: ['group', 'private', 'self-drive', 'cruise', 'solo', 'honeymoon'],
    styles: ['budget', 'standard', 'comfort', 'luxury', 'ultra-luxury']
  });

  // Canonical theme icon/label map — source of truth for the chip renderer
  const THEME_MAP = {
    honeymoon:   { label: 'Honeymoon',   icon: '💍' },
    family:      { label: 'Family',      icon: '👨‍👩‍👧‍👦' },
    solo:        { label: 'Solo',        icon: '🎒' },
    group:       { label: 'Group',       icon: '🤝' },
    adventure:   { label: 'Adventure',   icon: '🏔️' },
    pilgrimage:  { label: 'Pilgrimage',  icon: '🙏' },
    photography: { label: 'Photography', icon: '📸' },
    luxury:      { label: 'Luxury',      icon: '💎' },
    trekking:    { label: 'Trekking',    icon: '🥾' },
    beach:       { label: 'Beach',       icon: '🏖️' },
    wildlife:    { label: 'Wildlife',    icon: '🐅' },
    cultural:    { label: 'Cultural',    icon: '🏛️' },
    relaxation:  { label: 'Relaxation',  icon: '🧘' },
    snow:        { label: 'Snow',        icon: '❄️' },
    desert:      { label: 'Desert',      icon: '🏜️' },
  };

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
    const saved = localStorage.getItem('wanderlust_admin_categories');
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
              return { value: t, ...(THEME_MAP[t] || { label: t.charAt(0).toUpperCase() + t.slice(1), icon: '🏷️' }) };
            }
            return t;
          });
        }
        setCategories(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to parse categories', e);
      }
    }
  }, []);

  React.useEffect(() => {
    if (isEdit) {
      fetch(`${import.meta.env.BASE_URL}data/tours.json`)
        .then(res => res.json())
        .then(data => {
          const matched = data.find(t => String(t.id) === String(id));
          if (matched) setFormData(matched);
        })
        .catch(err => console.error("Fetch tour error:", err));
    }
  }, [id, isEdit]);

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

  const handleAddDay = () => {
    const newItinerary = [...(formData.itinerary || [])];
    const nextDay = newItinerary.length > 0 ? newItinerary[newItinerary.length - 1].day + 1 : 1;
    newItinerary.push({ day: nextDay, title: '', description: '' });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Tour ${isEdit ? 'updated' : 'created'} (mocked):`, formData);
    alert(`Tour ${isEdit ? 'Updated' : 'Created'} Successfully (Mocked for static site)`);
    navigate('/admin');
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
<span className="material-symbols-outlined text-[20px] text-slate-500">map</span>
<span className="text-[15px] font-medium">Guides</span>
</Link>
<Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/guides/new">
<span className="material-symbols-outlined text-[20px] text-slate-500">edit_document</span>
<span className="text-[15px] font-medium">Write a Blog</span>
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
                <Link className="hover:text-primary" to="/admin">Tours</Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-slate-600 dark:text-slate-300">{isEdit ? 'Edit Tour' : 'Add New'}</span>
              </nav>
              <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight">{isEdit ? 'Edit Tour Package' : 'Create New Tour'}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal">{isEdit ? 'Modify the existing tour details below.' : 'Fill in the comprehensive details below to publish a new tour package.'}</p>
            </div>
{/* Form Container */}
<div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
<form className="p-6 md:p-8 space-y-8">
{/* Section 1: Basic Info */}
<div className="space-y-6">
<h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Basic Information</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* Title */}
<div className="col-span-1 md:col-span-2">
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
{/* Toolbar Mock */}
<div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 px-3 py-2 flex gap-2 text-slate-500 dark:text-slate-400">
<button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" type="button"><span className="material-symbols-outlined text-sm">format_bold</span></button>
<button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" type="button"><span className="material-symbols-outlined text-sm">format_italic</span></button>
<button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" type="button"><span className="material-symbols-outlined text-sm">format_underlined</span></button>
<div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1 self-center"></div>
<button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" type="button"><span className="material-symbols-outlined text-sm">format_list_bulleted</span></button>
<button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" type="button"><span className="material-symbols-outlined text-sm">link</span></button>
</div>
<textarea 
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
{/* Inclusions & Exclusions */}
<div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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
</div>

{/* Section 3: Availability & Booking Validity */}
<div className="space-y-6">
<h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Tour Availability & Booking Validity</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Booking Validity */}
  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
      <span className="material-symbols-outlined text-sm">calendar_month</span>
      Booking Validity Window
    </h3>
    <div className="grid grid-cols-1 gap-4">
      <label className="flex flex-col">
        <span className="text-slate-600 dark:text-slate-400 text-xs font-medium pb-1">Booking Start Date</span>
        <input 
          type="date" 
          name="bookingStart"
          value={formData.bookingStart || ''}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </label>
      <label className="flex flex-col">
        <span className="text-slate-600 dark:text-slate-400 text-xs font-medium pb-1">Booking End Date</span>
        <input 
          type="date" 
          name="bookingEnd"
          value={formData.bookingEnd || ''}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </label>
    </div>
  </div>

  {/* Tour Availability */}
  <div className="p-4 bg-primary/5 rounded-xl border border-dashed border-primary/20">
    <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
      <span className="material-symbols-outlined text-sm">event_available</span>
      Tour Operation Period
    </h3>
    <div className="grid grid-cols-1 gap-4">
      <label className="flex flex-col">
        <span className="text-primary/70 text-xs font-medium pb-1">Available From</span>
        <input 
          type="date" 
          name="availableFrom"
          value={formData.availableFrom || ''}
          onChange={handleChange}
          className="w-full rounded-lg border border-primary/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </label>
      <label className="flex flex-col">
        <span className="text-primary/70 text-xs font-medium pb-1">Available To</span>
        <input 
          type="date" 
          name="availableTo"
          value={formData.availableTo || ''}
          onChange={handleChange}
          className="w-full rounded-lg border border-primary/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </label>
    </div>
  </div>
</div>
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
  {/* Cascading Dropdowns below the quick-picks for full control */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Region</label>
      <select
        name="destination"
        value={formData.destination}
        onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value, stateRegion: '', subregion: '' }))}
        className="custom-select w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option disabled value="">Select region</option>
        {(categories.destinations || []).map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">State / Country</label>
      <select
        name="stateRegion"
        value={formData.stateRegion}
        onChange={(e) => setFormData(prev => ({ ...prev, stateRegion: e.target.value, subregion: '' }))}
        disabled={!formData.destination}
        className="custom-select w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-40"
      >
        <option disabled value="">{formData.destination ? 'Pick state' : '← Select region first'}</option>
        {availableStates.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Subregion / City</label>
      <select
        name="subregion"
        value={formData.subregion}
        onChange={handleChange}
        disabled={!formData.stateRegion}
        className="custom-select w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-40"
      >
        <option disabled value="">{formData.stateRegion ? (availableSubregions.length > 0 ? 'Pick city' : 'Enter below') : '← Select state first'}</option>
        {availableSubregions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
    </div>
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
    {categories.themes.map(t => (
      <button
        key={t.value}
        type="button"
        onClick={() => setFormData(prev => ({ ...prev, theme: t.value }))}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
          formData.theme === t.value
            ? 'bg-primary text-white border-primary shadow-sm'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
        }`}
      >
        <span>{t.icon}</span> {t.label}
      </button>
    ))}
  </div>
</div>

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

{/* Duration + Nature in a row */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="flex flex-col flex-1">
<span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Duration</span>
<input 
  name="duration"
  value={formData.duration}
  onChange={handleChange}
  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-400" 
  placeholder="e.g. 7 Days" 
  type="text"
/>
</label>
</div>
{/* Nature */}
<div>
<label className="flex flex-col flex-1">
<span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Tour Nature</span>
<select 
  name="nature"
  value={formData.nature}
  onChange={handleChange}
  className="custom-select w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
<option disabled value="">Select nature type</option>
{categories.natures.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
</select>
</label>
</div>
{/* Style */}
<div>
<label className="flex flex-col flex-1">
<span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Accommodation Style</span>
<select 
  name="style"
  value={formData.style}
  onChange={handleChange}
  className="custom-select w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
<option disabled value="">Select style</option>
{categories.styles.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
</select>
</label>
</div>
{/* Price Category */}
<div>
<label className="flex flex-col flex-1">
<span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Price Category</span>
<select 
  name="priceCategory"
  value={formData.priceCategory}
  onChange={handleChange}
  className="custom-select w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
<option disabled value="">Select category</option>
<option value="low">₹ (Economy)</option>
<option value="medium">₹₹ (Moderate)</option>
<option value="high">₹₹₹ (Premium)</option>
<option value="ultra">₹₹₹₹ (Ultra Luxury)</option>
</select>
</label>
</div>
{/* Pricing Basis */}
<div>
<label className="flex flex-col flex-1">
  <span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Pricing Basis</span>
  <select 
    name="priceBasis"
    value={formData.priceBasis}
    onChange={handleChange}
    className="custom-select w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
    <option value="per_person">Per Person</option>
    <option value="per_package">Per Package (Group / Honeymoon)</option>
  </select>
</label>
</div>
</div>{/* end Duration+Nature+Style+Pricing grid */}

{/* Base Price — full width row */}
<div>
  <label className="flex flex-col">
    <span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Base Price (INR) <span className="text-red-500">*</span></span>
    <div className="relative flex items-center">
      <span className="absolute left-4 text-slate-500 font-bold">₹</span>
      <input 
        name="price"
        value={formData.price}
        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value === '' ? '' : parseInt(e.target.value) }))}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white pl-8 pr-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-400 font-bold" 
        min="0" 
        placeholder="0" 
        type="number"
        required
      />
    </div>
  </label>
</div>

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
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* Status */}
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
            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium pb-1">Day Description</span>
            <textarea 
              value={day.description || ''}
              onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px] resize-y" 
              placeholder="Describe the activities for this day..."
            ></textarea>
          </label>
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
{/* Section 5: Media Gallery */}
<div className="space-y-6">
  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Media Gallery</h2>
    <span className="text-xs text-slate-400">
      {normalizeImages(formData.images).length} photo{normalizeImages(formData.images).length !== 1 ? 's' : ''} · First photo is the primary cover
    </span>
  </div>

  {/* Drop Zone */}
  <label
    htmlFor="file-upload"
    className="flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 px-6 py-10 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-primary/50 transition-all group"
  >
    <span className="material-symbols-outlined text-5xl text-slate-400 group-hover:text-primary transition-colors mb-3">add_photo_alternate</span>
    <p className="text-sm font-semibold text-primary">Click to upload photos</p>
    <p className="text-xs text-slate-400 mt-1">Select multiple photos at once · JPG, PNG, WEBP</p>
    <p className="text-xs text-slate-400">Photos are auto-compressed to WebP for fast loading</p>
    <input
      onChange={handleImageUpload}
      accept="image/*"
      className="sr-only"
      id="file-upload"
      multiple
      name="file-upload"
      type="file"
    />
  </label>

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
  onClick={handleSubmit}
  className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all shadow-sm flex items-center gap-2" type="submit">
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
