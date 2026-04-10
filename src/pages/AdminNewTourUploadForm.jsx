import React from "react";
import { Link } from "react-router-dom";
import categoriesData from "../data/categories.json";
import { safeCacheTours, STORAGE_KEYS } from "../utils/storage";

/**
 * Auto-generated from: admin_new_tour_upload_form/code.html
 * Group: admin | Path: /admin/tours/new
 */
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

/* ─────────────────────────────────────────────
   Format Content Helper 
 ───────────────────────────────────────────── */
const formatContent = (content) => {
  if (!content) return '';
  if (/<(p|div|h[1-6]|ul|ol|li|blockquote|section|article|span|br)/i.test(content)) {
    return content;
  }
  return content
    .split(/\n\s*\n/)
    .map((para) => {
      let text = para.trim();
      if (!text) return '';
      text = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br />');
      if (text.startsWith('>')) return `<blockquote>${text.substring(1).trim()}</blockquote>`;
      return `<p>${text}</p>`;
    })
    .join('');
};

/* ─────────────────────────────────────────────
   Rich Text Editor Component
 ───────────────────────────────────────────── */
const RichTextEditor = ({ value, onChange, placeholder, minHeight = "min-h-[160px]" }) => {
  const [mode, setMode] = React.useState('visual');
  const editorRef = React.useRef(null);
  
  React.useEffect(() => {
    if (mode === 'visual' && editorRef.current && editorRef.current.innerHTML !== (value || '')) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value, mode]);

  const handleVisualInput = (e) => {
    onChange(e.currentTarget.innerHTML);
  };

  const execCommand = (command, val = null) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
        editorRef.current.focus();
    }
  };

  return (
    <div className="border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all bg-white dark:bg-slate-900 flex flex-col shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 p-2.5 bg-slate-50 dark:bg-slate-900/50">
        <div className={`flex flex-wrap gap-1 items-center transition-all ${mode === 'html' ? 'opacity-30 pointer-events-none blur-[1px]' : ''}`}>
          {[
              { cmd: 'bold', icon: 'format_bold', label: 'Bold' },
              { cmd: 'italic', icon: 'format_italic', label: 'Italic' },
              { cmd: 'underline', icon: 'format_underlined', label: 'Underline' },
              { divider: true },
              { cmd: 'formatBlock', val: '<h2>', label: 'H2', text: 'H2' },
              { cmd: 'formatBlock', val: '<h3>', label: 'H3', text: 'H3' },
              { divider: true },
              { cmd: 'insertUnorderedList', icon: 'format_list_bulleted', label: 'Bullet List' },
              { cmd: 'createLink', prompt: 'Enter URL (e.g. https://google.com):', icon: 'link', label: 'Add Link' }
          ].map((btn, i) => (
              btn.divider ? (
                  <div key={i} className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1.5"></div>
              ) : (
                  <button 
                      key={i}
                      type="button"
                      onClick={() => {
                        if (btn.cmd === 'createLink') {
                          const url = prompt(btn.prompt);
                          if (url) execCommand(btn.cmd, url);
                        } else {
                          execCommand(btn.cmd, btn.val);
                        }
                      }} 
                      className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary hover:shadow-sm rounded-lg transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      title={btn.label}
                  >
                      {btn.icon ? <span className="material-symbols-outlined text-[18px]">{btn.icon}</span> : <span className="font-black text-[10px] tracking-tight">{btn.text}</span>}
                  </button>
              )
          ))}
        </div>

        <div className="flex bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 h-[34px] self-start sm:self-auto shrink-0 shadow-inner">
            <button 
                type="button"
                onClick={() => setMode('visual')}
                className={`px-4 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${mode === 'visual' ? 'bg-white shadow-md dark:bg-slate-700 text-primary scale-[1.02]' : 'text-slate-500 hover:text-slate-400'}`}
            >
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                Aesthetics
            </button>
            <button 
                type="button"
                onClick={() => setMode('html')}
                className={`px-4 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${mode === 'html' ? 'bg-white shadow-md dark:bg-slate-700 text-primary scale-[1.02]' : 'text-slate-500 hover:text-slate-400'}`}
            >
                <span className="material-symbols-outlined text-[14px]">code</span>
                Raw Code
            </button>
        </div>
      </div>
      
      <div className="relative bg-white dark:bg-slate-900">
        {mode === 'html' ? (
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full bg-slate-950 text-emerald-400 font-mono text-[13px] p-5 border-0 focus:ring-0 resize-y placeholder-slate-800 ${minHeight} leading-relaxed selection:bg-emerald-500/20`}
            spellCheck="false"
            placeholder={`<!--\n${placeholder}\n-->`}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleVisualInput}
            className={`w-full p-5 outline-none prose prose-sm dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 ${minHeight} overflow-auto cursor-text leading-relaxed marker:text-primary list-disc selection:bg-primary/10`}
            suppressContentEditableWarning
            data-placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
};

const AdminNewTourUploadForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ─── Normalization Helpers (Synced with Discovery Page) ───
  const normalizeBucket = (s) => {
      const val = String(s || "").toLowerCase().trim();
      if (val === 'kashmir' || val === 'jammu' || val === 'jammu and kashmir' || val === 'jammu & kashmir') return 'jammu and kashmir';
      return val;
  };

  const displayState = (s) => {
      const val = normalizeBucket(s);
      if (val === 'jammu and kashmir') return 'Jammu and Kashmir';
      return String(s || "").trim();
  };
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  const typeParam = searchParams.get("type");
  const [loading, setLoading] = React.useState(false);
  const [idExists, setIdExists] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState({});

  // Buffer state to prevent cursor jumping for comma-separated inputs
  const [_tempTags, setTempTags] = React.useState({});
  const [formData, setFormData] = React.useState({
    slug: "",
    title: "",
    description: "",
    destination: "",
    stateRegion: "",
    subregion: "",
    duration: "",
    bestTimeToVisit: "",
    price: "",
    priceBasis: "per_person", // 'per_person', 'per_package'
    pricePerPerson: "",
    pricePerCouple: "",
    pricePerGroup: "",
    groupSize: 10,
    minPersons: 1,
    status: "active",
    order: 0,
    theme: "",
    nature: "group",
    style: "",
    priceCategory: "",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200",
    images: [],
    inclusions: [{ text: "", option: "" }],
    exclusions: [{ text: "", option: "" }],
    highlights: "",
    isFeatured: false,
    itinerary: [{ day: 1, title: "", description: "", tags: [], services: [] }],
    faq: [{ question: "", answer: "" }],
    bookingStart: "",
    bookingEnd: "",
    availableFrom: "",
    availableTo: "",
    cityPath: "",
    duration: "",
    isDayTour: false,
    hotelCategory: [],
    accommodationType: "mixed",
    mixedAccommodations: [],
    mealPlan: [],
    tourFeatures: ["accommodation", "sightseeing", "stay", "transfers"],
    transport: typeParam === "train" ? "train" : "mixed",
    mixedTransports: [],
    homePagePlacements: [],
    noBookingEnd: false,
    noAvailableTo: false,
  });

  const [destSearchQuery, setDestSearchQuery] = React.useState("");
  const [subreqSearchQuery, setSubreqSearchQuery] = React.useState("");
  const [dayEditorModes, setDayEditorModes] = React.useState({});

  const [categories, setCategories] = React.useState({
    ...categoriesData.categories,
    destinationStates: categoriesData.categories.destinationStates || {
      India: categoriesData.categories.states,
      International: [
        "Thailand",
        "Bali",
        "Dubai",
        "Singapore",
        "Maldives",
        "Sri Lanka",
        "Nepal",
        "Bhutan",
      ],
    },
    subregionsByState: categoriesData.categories.subregionsByState || {
      "Himachal Pradesh": [
        "Shimla",
        "Manali",
        "Dharamshala",
        "Kasol",
        "Spiti Valley",
      ],
      "Jammu and Kashmir": ["Srinagar", "Gulmarg", "Pahalgam", "Sonamarg"],
      Kerala: ["Munnar", "Alleppey", "Wayanad"],
      Ladakh: ["Leh", "Pangong Lake", "Nubra Valley"],
      Goa: ["North Goa", "South Goa"],
      Uttarakhand: ["Rishikesh", "Haridwar", "Nainital"],
      "Andaman Islands": ["Port Blair", "Havelock Island"],
    },
    hotelCategories: categoriesData.categories.hotelCategories || [
      { value: "3_star", label: "3 Star", icon: "⭐" },
      { value: "4_star", label: "4 Star", icon: "⭐⭐" },
      { value: "5_star", label: "5 Star", icon: "⭐⭐⭐" },
      { value: "budget", label: "Budget", icon: "💰" },
    ],
    accommodationTypes: categoriesData.categories.accommodationTypes || [
      { value: "hotel", label: "Hotel", icon: "🏨" },
      { value: "resort", label: "Resort", icon: "🌴" },
      { value: "houseboat", label: "Houseboat", icon: "🚢" },
    ],
    transports: categoriesData.categories.transports || [
      { value: "mixed", label: "Mixed", icon: "🚗" },
      { value: "train", label: "Train", icon: "🚆" },
    ],
    natures: categoriesData.categories.natures || [],
    styles: categoriesData.categories.styles || [],
  });

  // Derive THEME_MAP from dynamic themes + fallback defaults
  const THEME_MAP = React.useMemo(() => {
    const map = {};
    categories.themes.forEach((t) => {
      map[t.value] = { label: t.label, icon: t.icon };
    });
    return map;
  }, [categories.themes]);

  // Emoji map for state quick-picks — fallback icon for custom destinations
  const DEST_ICON_MAP = {
    "Himachal Pradesh": "🏔️",
    "Jammu and Kashmir": "❄️",
    Rajasthan: "🏯",
    Kerala: "🌿",
    Ladakh: "🚵",
    Goa: "🏖️",
    Uttarakhand: "🙏",
    "Andaman Islands": "🤿",
    Sikkim: "🌸",
    Assam: "🌿",
    Meghalaya: "⛅",
    "Arunachal Pradesh": "🏞️",
    Karnataka: "🕌",
    "Tamil Nadu": "🛕",
    Maharashtra: "🏙️",
    Gujarat: "🦁",
    "West Bengal": "🐯",
    "Madhya Pradesh": "🐘",
    "Uttar Pradesh": "🕌",
    Puducherry: "🌊",
    Darjeeling: "🍵",
    Coorg: "☕",
    Ooty: "🌄",
  };

  React.useEffect(() => {
    const saved = localStorage.getItem("beautifulindia_admin_categories");
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
          parsed.themes = parsed.themes.map((t) => {
            if (typeof t === "string") {
              return {
                value: t,
                label: t.charAt(0).toUpperCase() + t.slice(1),
                icon: "🏷️",
              };
            }
            return t;
          });
        }
        setCategories((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse categories", e);
      }
    }
  }, []); // Run only once on mount to avoid infinite loops with THEME_MAP

  React.useEffect(() => {
    if (id) {
      // First check localStorage for session changes
      const savedTours = localStorage.getItem(STORAGE_KEYS.TOURS);
      if (savedTours) {
        try {
          const tours = JSON.parse(savedTours);
          const matched = tours.find((t) => String(t.id) === String(id));
          if (matched) {
            // Normalize inclusions/exclusions if they are strings
            if (matched.inclusions && typeof matched.inclusions[0] === 'string') {
              matched.inclusions = matched.inclusions.map(text => ({ text, option: "Included" }));
            }
            if (matched.exclusions && typeof matched.exclusions[0] === 'string') {
              matched.exclusions = matched.exclusions.map(text => ({ text, option: "Extra Charges" }));
            }
            
            setFormData((prev) => ({
              ...prev,
              ...matched,
              slug: matched.slug || matched.id || "",
            }));
            console.log("Loaded tour from localStorage session");
            return;
          }
        } catch (e) {
          console.error("Local storage error:", e);
        }
      }

      fetch(`${import.meta.env.BASE_URL}data/tours.json`)
        .then((res) => res.json())
        .then((data) => {
          const matched = data.find((t) => String(t.id) === String(id));
          if (matched) {
            // Normalize inclusions/exclusions if they are strings
            if (matched.inclusions && typeof matched.inclusions[0] === 'string') {
              matched.inclusions = matched.inclusions.map(text => ({ text, option: "Included" }));
            }
            if (!matched.inclusions || matched.inclusions.length === 0) {
              matched.inclusions = [{ text: "", option: "" }];
            }
            if (matched.exclusions && typeof matched.exclusions[0] === 'string') {
              matched.exclusions = matched.exclusions.map(text => ({ text, option: "Extra Charges" }));
            }
            if (!matched.exclusions || matched.exclusions.length === 0) {
              matched.exclusions = [{ text: "", option: "" }];
            }

            setFormData((prev) => ({
              ...prev,
              ...matched,
              slug: matched.slug || matched.id || "",
            }));
          }
        })
        .catch((err) => {
          console.error("Failed to load tour:", err);
        });
    }
  }, [id]);

  // Handle auto-slug generation
  React.useEffect(() => {
    if (!isEdit && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      // Only auto-update if the user hasn't manually edited the slug yet
      // or if the slug is currently empty
      if (!formData.slug || formData.slug === (formData._lastAutoSlug || "")) {
        setFormData((prev) => ({
          ...prev,
          slug: generatedSlug,
          _lastAutoSlug: generatedSlug,
        }));
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...(formData.itinerary || [])];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setFormData((prev) => ({ ...prev, itinerary: newItinerary }));
  };

  const insertFormatting = (index, prefix, suffix = "", isMain = false) => {
    const textarea = isMain
      ? document.getElementById("main-description")
      : document.getElementById(`day-desc-${index}`);
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
      setFormData((prev) => ({ ...prev, description: newValue }));
    } else {
      handleItineraryChange(index, "description", newValue);
    }

    // Use a small delay to allow React to update the state before setting focus/cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos =
        start +
        prefix.length +
        (selection ? selection.length + suffix.length : 0);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const handleAddDay = () => {
    const newItinerary = [...(formData.itinerary || [])];
    const nextDay =
      newItinerary.length > 0
        ? newItinerary[newItinerary.length - 1].day + 1
        : 1;
    newItinerary.push({
      day: nextDay,
      title: "",
      description: "",
      tags: [],
      services: [],
    });
    setFormData((prev) => ({ ...prev, itinerary: newItinerary }));
  };

  const handleRemoveDay = (index) => {
    const newItinerary = [...(formData.itinerary || [])];
    newItinerary.splice(index, 1);
    // Re-index days safely
    const reindexedItinerary = newItinerary.map((item, i) => ({
      ...item,
      day: i + 1,
    }));
    setFormData((prev) => ({ ...prev, itinerary: reindexedItinerary }));
  };

  const handleFaqChange = (index, field, value) => {
    const newFaq = [...(formData.faq || [])];
    newFaq[index] = { ...newFaq[index], [field]: value };
    setFormData((prev) => ({ ...prev, faq: newFaq }));
  };

  const handleAddFaq = () => {
    const newFaq = [...(formData.faq || [])];
    newFaq.push({ question: "", answer: "" });
    setFormData((prev) => ({ ...prev, faq: newFaq }));
  };

  const handleRemoveFaq = (index) => {
    const newFaq = [...(formData.faq || [])];
    newFaq.splice(index, 1);
    setFormData((prev) => ({ ...prev, faq: newFaq }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.title?.trim()) e.title = "Title is required";
    if (!formData.destination?.trim()) e.destination = "Destination is required";
    if (!formData.duration?.trim()) e.duration = "Duration is required";
    if (!formData.description?.trim() && !formData.content?.trim()) e.content = "Description/Content is required";
    
    // Price validation
    const hasPrice = (
      (parseFloat(formData.pricePerPerson) > 0) || 
      (parseFloat(formData.pricePerCouple) > 0) || 
      (parseFloat(formData.pricePerGroup) > 0) ||
      (parseFloat(formData.price) > 0)
    );
    if (!hasPrice) e.price = "At least one price field must be greater than zero";

    // Main image
    if (!formData.image && (!formData.images || formData.images.length === 0)) e.image = "Main image is required";

    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const getInputClasses = (fieldName, extra = "") => {
    const base = "w-full rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-400 dark:placeholder-slate-500 transition-colors";
    const status = formErrors[fieldName] 
      ? "border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500" 
      : "border-slate-300 dark:border-slate-700";
    return `${base} ${status} ${extra}`;
  };

  const handleSubmit = async (e, forcedStatus = null) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Run validation
    if (!validateForm()) {
      const firstError = Object.keys(formErrors)[0];
      const errorEl = document.getElementsByName(firstError)[0] || document.getElementById(firstError);
      if (errorEl) errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);

    try {
      // Always fetch the latest tours from the server
      let tours = [];
      try {
        const res = await fetch(
          `${import.meta.env.BASE_URL}data/tours.json?t=${Date.now()}`,
        );
        if (res.ok) tours = await res.json();
      } catch (err) {
        console.error("Error fetching tours from server:", err);
      }

      const tourToSave = { ...formData };
      if (forcedStatus) {
        tourToSave.status = forcedStatus;
      }

      // Process itinerary tags: convert string to array
      if (tourToSave.itinerary) {
        tourToSave.itinerary = tourToSave.itinerary.map((day) => ({
          ...day,
          tags:
            typeof day.tags === "string"
              ? day.tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              : Array.isArray(day.tags)
                ? day.tags
                : [],
        }));
      }

      // Normalize highlights (legacy string to array)
      if (tourToSave.highlights && typeof tourToSave.highlights === 'string') {
        tourToSave.highlights = tourToSave.highlights.split('\n').map(s => s.trim()).filter(Boolean);
      } else if (!tourToSave.highlights) {
        tourToSave.highlights = [];
      }

      // Filter empty inclusions/exclusions
      tourToSave.inclusions = (tourToSave.inclusions || []).filter(item => item.text.trim());
      tourToSave.exclusions = (tourToSave.exclusions || []).filter(item => item.text.trim());

      // ─── Regional Normalization Safety Net ───
      if (tourToSave.stateRegion) {
        const rawRegions = Array.isArray(tourToSave.stateRegion) 
          ? tourToSave.stateRegion 
          : [tourToSave.stateRegion];
        
        // Flatten comma-separated strings and trim
        let flatRegions = [];
        rawRegions.forEach(r => {
          if (typeof r === 'string' && r.includes(',')) {
            flatRegions = flatRegions.concat(r.split(',').map(s => s.trim()));
          } else {
            flatRegions.push(String(r || "").trim());
          }
        });

        // Map all variants to "Jammu and Kashmir" and deduplicate
        const normalizedRegions = [...new Set(flatRegions.map(r => displayState(r)).filter(Boolean))];
        tourToSave.stateRegion = normalizedRegions;
      }

      if (tourToSave.subregion) {
        const subs = Array.isArray(tourToSave.subregion) 
          ? tourToSave.subregion 
          : [tourToSave.subregion];
        tourToSave.subregion = [...new Set(subs.map(s => String(s).trim()))].filter(Boolean);
      }


      // Generate ID from title slug (e.g. "Golden Triangle Tour" → "golden-triangle-tour")
      // NEW tours: always derive a fresh slug from the title — prevents numeric/timestamp IDs.
      // EDIT tours: keep the existing ID unchanged.
      if (!isEdit) {
        const baseSlug = (tourToSave.title || 'untitled-tour')
          .toLowerCase()
          .replace(/[^\u0000-\u007E]/g, '')  // Strip non-ASCII characters
          .replace(/[^a-z0-9\s-]/g, '')      // Remove remaining special chars
          .replace(/\s+/g, '-')              // Spaces → hyphens
          .replace(/-+/g, '-')               // Collapse multiple hyphens
          .replace(/^-|-$/g, '')             // Trim leading/trailing hyphens
          || 'untitled-tour';

        // Ensure uniqueness: if slug already exists, append a counter starting at 2
        let finalSlug = baseSlug;
        let counter = 2;
        while (tours.some((t) => String(t.id) === finalSlug)) {
          finalSlug = `${baseSlug}-${counter}`;
          counter++;
        }
        tourToSave.id = finalSlug;
        tourToSave.slug = finalSlug;
        console.log(`[Tour Save] Generated ID: "${finalSlug}" from title: "${tourToSave.title}"`);
      }

      // Sync new pricing fields to legacy 'price' field for backward compatibility
      // Prioritize pricePerPerson, then Couple, then Group
      const pPerson = parseFloat(tourToSave.pricePerPerson);
      const pCouple = parseFloat(tourToSave.pricePerCouple);
      const pGroup = parseFloat(tourToSave.pricePerGroup);

      if (!isNaN(pPerson) && pPerson > 0) {
        tourToSave.price = pPerson;
      } else if (!isNaN(pCouple) && pCouple > 0) {
        tourToSave.price = pCouple;
      } else if (!isNaN(pGroup) && pGroup > 0) {
        tourToSave.price = pGroup;
      }

      // Handle 'No end date' flags
      if (tourToSave.noBookingEnd) {
        tourToSave.bookingEnd = "";
      }
      if (tourToSave.noAvailableTo) {
        tourToSave.availableTo = "";
      }

      let updatedTours;
      if (isEdit) {
        updatedTours = tours.map((t) =>
          String(t.id) === String(id) ? tourToSave : t,
        );
        // If it wasn't found (first time editing), add it
        if (!tours.find((t) => String(t.id) === String(id))) {
          updatedTours = [...tours, tourToSave];
        }
      } else {
        updatedTours = [...tours, tourToSave];
      }

      // Save to server via PHP API
      // Use proxy-friendly absolute path for both local and live
      const targetUrl = '/api/save-tours';

      const response = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTours),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to save to server");
      }

      // Also update localStorage as a cache for faster page loads
      safeCacheTours(STORAGE_KEYS.TOURS, updatedTours);

      const statusMsg =
        tourToSave.status === "draft"
          ? "Draft Saved"
          : isEdit
            ? "Tour Updated"
            : "Tour Published";
      alert(`${statusMsg} Successfully!`);

      setLoading(false);
      navigate("/admin/tours");
    } catch (err) {
      console.error("Save error:", err);
      alert(`Error saving tour: ${err.message}. Please try again.`);
      setLoading(false);
    }
  };

  // ── Image helpers — images are stored as { url, caption } objects ──
  const normalizeImages = (raw) => {
    if (!raw || raw.length === 0) return [];
    return raw.map((img) => {
      if (typeof img === "string") return { url: img, caption: "" };
      if (img && img.url) return img;
      return { url: String(img), caption: "" };
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate each file size (User requested 5MB max)
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`Image "${file.name}" is too large (Max 5MB). Please use a smaller image.`);
        e.target.value = ''; // Reset
        return;
      }
    }

    Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement("canvas");
              let width = img.width,
                height = img.height;
              const MAX = 1200;
              if (width > height && width > MAX) {
                height *= MAX / width;
                width = MAX;
              } else if (height > MAX) {
                width *= MAX / height;
                height = MAX;
              }
              canvas.width = width;
              canvas.height = height;
              canvas.getContext("2d").drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL("image/webp", 0.85));
            };
            img.onerror = reject;
            img.src = ev.target.result;
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }),
    ).then((base64Urls) => {
      setFormData((prev) => {
        const existing = normalizeImages(
          prev.images && prev.images.length > 0
            ? prev.images
            : prev.image
              ? [prev.image]
              : [],
        );
        // Use filename (without extension) as default caption
        const newImgs = base64Urls.map((url, i) => ({
          url,
          caption: files[i].name.split(".").slice(0, -1).join("."),
        }));
        const final = [...existing, ...newImgs];
        return {
          ...prev,
          images: final,
          image: final[0]?.url || prev.image, // Fallback for legacy components
        };
      });
    });
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const updated = (prev.images || []).filter((_, i) => i !== index);
      return {
        ...prev,
        images: updated,
        image: updated.length > 0 ? updated[0].url : "",
      };
    });
  };

  const updateImageCaption = (index, newCaption) => {
    setFormData((prev) => {
      const updated = [...(prev.images || [])];
      updated[index] = { ...updated[index], caption: newCaption };
      return { ...prev, images: updated };
    });
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1240px] mx-auto space-y-10 animate-in fade-in duration-500">
      {/* Premium Sub-Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Link to="/admin" className="hover:text-primary transition-colors">Admin Dashboard</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link to="/admin/tours" className="hover:text-primary transition-colors">Inventory</Link>
          </nav>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            {isEdit ? "Update Tour Module" : "Launch New Tour"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold italic">
            Configure premium metadata and itinerary structure for better conversion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <select
              value={formData.status}
              onChange={(e) => handleChange(e)}
              name="status"
              className={`pl-10 pr-8 py-4 rounded-2xl font-black uppercase tracking-[2px] text-[10px] outline-none transition-all appearance-none cursor-pointer border shadow-sm ${
                formData.status === "active"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                  : "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
              }`}
            >
              <option value="active">Active Listing</option>
              <option value="draft">Review Draft</option>
              <option value="paused">Paused Listing</option>
            </select>
            <span
              className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] ${
                formData.status === "active"
                  ? "text-emerald-500 animate-pulse"
                  : "text-amber-500"
              }`}
            >
              {formData.status === "active"
                ? "online_prediction"
                : "edit_notifications"}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="group relative flex items-center gap-3 px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase text-xs tracking-[2px] transition-all hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 overflow-hidden"
          >
            <span
              className={`material-symbols-outlined transition-transform ${
                loading ? "animate-spin" : "group-hover:scale-110"
              }`}
            >
              {loading ? "progress_activity" : "verified_user"}
            </span>
            {loading ? "Syncing..." : isEdit ? "Sync Changes" : "Deploy Tour"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Core Data */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: Basic Metadata */}
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-6">
              <span className="material-symbols-outlined text-primary">
                auto_awesome
              </span>
              <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">
                Core Identity
              </h2>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Internal System ID (Auto-Sync)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className={getInputClasses("slug", "font-mono font-black text-xs h-[52px]")}
                    placeholder="e.g., golden-triangle-tour"
                  />
                  {formErrors.slug && <p className="text-[10px] text-red-500 font-bold italic ml-1 mt-1">*{formErrors.slug}</p>}
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Theme / Category
                  </label>
                  <div className="relative group">
                    <select
                      name="theme"
                      value={formData.theme}
                      onChange={handleChange}
                      className={getInputClasses("theme", "font-bold h-[52px] appearance-none cursor-pointer")}
                    >
                      <option value="">Select Theme Strategy</option>
                      {categories.themes.map((theme) => (
                        <option key={theme.value} value={theme.value}>
                          {theme.label}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform group-hover:translate-y-1">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Public Product Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={getInputClasses("title", "font-serif font-black text-2xl h-[72px] px-6 rounded-2xl")}
                  placeholder="e.g. Majestic Himalayan Expedition: 7 Days Luxury Special"
                />
                {formErrors.title && <p className="text-[10px] text-red-500 font-bold italic ml-1 mt-1">*{formErrors.title}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Duration
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                      schedule
                    </span>
                    <input
                      type="text"
                      name="duration"
                      id="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className={getInputClasses("duration", "pl-12 font-bold")}
                      placeholder="e.g. 5D/4N"
                    />
                  </div>
                  {formErrors.duration && <p className="text-[10px] text-red-500 font-bold italic ml-1">*{formErrors.duration}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Group Size
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                      groups
                    </span>
                    <input
                      type="number"
                      name="groupSize"
                      value={formData.groupSize}
                      onChange={handleChange}
                      className={getInputClasses("groupSize", "pl-12 font-bold")}
                    />
                  </div>
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Best Time to Experience
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                      calendar_month
                    </span>
                    <input
                      type="text"
                      name="bestTimeToVisit"
                      value={formData.bestTimeToVisit}
                      onChange={handleChange}
                      className={getInputClasses("bestTimeToVisit", "pl-12 font-bold")}
                      placeholder="e.g. Apr to Oct"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* New Section: Pricing Logic Hub */}
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-800 pb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  payments
                </span>
                <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">
                  Pricing Hierarchy
                </h2>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() =>
                    setFormData({ ...formData, priceBasis: "per_person" })
                  }
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                    formData.priceBasis === "per_person"
                      ? "bg-white shadow-xl dark:bg-slate-700 text-primary"
                      : "text-slate-400 opacity-60"
                  }`}
                >
                  B2C / Solo
                </button>
                <button
                  onClick={() =>
                    setFormData({ ...formData, priceBasis: "per_package" })
                  }
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                    formData.priceBasis === "per_package"
                      ? "bg-white shadow-xl dark:bg-slate-700 text-primary"
                      : "text-slate-400 opacity-60"
                  }`}
                >
                  B2B / Group
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  id: "person",
                  key: "pricePerPerson",
                  label: "Individual / Person",
                  icon: "person",
                },
                {
                  id: "couple",
                  key: "pricePerCouple",
                  label: "Couple / Duo",
                  icon: "favorite",
                },
                {
                  id: "group",
                  key: "pricePerGroup",
                  label: "Group (Min 4+)",
                  icon: "groups_3",
                },
              ].map((tier) => (
                <div
                  key={tier.id}
                  className={`p-6 rounded-3xl border transition-all ${
                    formData[tier.key] > 0
                      ? "bg-primary/5 border-primary/20 scale-[1.02]"
                      : "bg-slate-50 border-slate-100 dark:bg-slate-800/30 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        formData[tier.key] > 0
                          ? "text-primary"
                          : "text-slate-400"
                      }`}
                    >
                      {tier.icon}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {tier.label}
                    </span>
                  </div>
                  <div className="relative group">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-lg font-serif font-black text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      name={tier.key}
                      id="price"
                      value={formData[tier.key]}
                      onChange={handleChange}
                      className={`w-full bg-transparent border-0 border-b-2 pl-6 py-2 text-2xl font-serif font-black outline-none transition-all ${
                        formData[tier.key] > 0
                          ? "border-primary text-slate-800 dark:text-white"
                          : "border-slate-200 dark:border-slate-800 text-slate-400"
                      }`}
                      placeholder="0"
                    />
                  </div>
                </div>
              ))}
            </div>
            {formErrors.price && <p className="text-[10px] text-red-500 font-bold italic ml-1 text-center bg-red-50 dark:bg-red-900/10 py-3 rounded-2xl border border-red-100 dark:border-red-900/20">*{formErrors.price}</p>}
          </div>

          {/* New Section: Inclusions & Exclusions */}
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">lists</span>
                    <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Inventory Status (Inclusions / Exclusions)</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Inclusions */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                           <span className="material-symbols-outlined text-[18px]">add_task</span> Included Assets
                        </h3>
                        <button 
                            onClick={() => setFormData(prev => ({ ...prev, inclusions: [...prev.inclusions, { text: '', option: '' }] }))}
                            className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                        >
                            + Add Item
                        </button>
                    </div>
                    <div className="space-y-3">
                        {formData.inclusions.map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-center group">
                                <input 
                                    type="text" 
                                    placeholder="e.g. Daily Breakfast"
                                    value={item.text}
                                    onChange={(e) => {
                                        const newInc = [...formData.inclusions];
                                        newInc[idx].text = e.target.value;
                                        setFormData(prev => ({ ...prev, inclusions: newInc }));
                                    }}
                                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-emerald-500 transition-all font-bold"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Option..."
                                    value={item.option}
                                    onChange={(e) => {
                                        const newInc = [...formData.inclusions];
                                        newInc[idx].option = e.target.value;
                                        setFormData(prev => ({ ...prev, inclusions: newInc }));
                                    }}
                                    className="w-24 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-[10px] outline-none focus:border-emerald-500 transition-all font-black uppercase tracking-tighter text-emerald-600"
                                />
                                <button 
                                    onClick={() => {
                                        const newInc = [...formData.inclusions];
                                        newInc.splice(idx, 1);
                                        setFormData(prev => ({ ...prev, inclusions: newInc }));
                                    }}
                                    className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Exclusions */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 flex items-center gap-2">
                           <span className="material-symbols-outlined text-[18px]">cancel_schedule_send</span> Excluded Items
                        </h3>
                        <button 
                            onClick={() => setFormData(prev => ({ ...prev, exclusions: [...prev.exclusions, { text: '', option: '' }] }))}
                            className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                        >
                            + Add Item
                        </button>
                    </div>
                    <div className="space-y-3">
                        {formData.exclusions.map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-center group">
                                <input 
                                    type="text" 
                                    placeholder="e.g. Flight Tickets"
                                    value={item.text}
                                    onChange={(e) => {
                                        const newExc = [...formData.exclusions];
                                        newExc[idx].text = e.target.value;
                                        setFormData(prev => ({ ...prev, exclusions: newExc }));
                                    }}
                                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-rose-500 transition-all font-bold"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Option..."
                                    value={item.option}
                                    onChange={(e) => {
                                        const newExc = [...formData.exclusions];
                                        newExc[idx].option = e.target.value;
                                        setFormData(prev => ({ ...prev, exclusions: newExc }));
                                    }}
                                    className="w-24 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-[10px] outline-none focus:border-rose-500 transition-all font-black uppercase tracking-tighter text-rose-600"
                                />
                                <button 
                                    onClick={() => {
                                        const newExc = [...formData.exclusions];
                                        newExc.splice(idx, 1);
                                        setFormData(prev => ({ ...prev, exclusions: newExc }));
                                    }}
                                    className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>

          {/* Section: Rich Storytelling Content */}
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-800 pb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  description
                </span>
                <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">
                  Interactive Storyline
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Main Adventure Description
              </label>
              <div id="content">
                <RichTextEditor
                    value={formData.description || formData.content}
                    onChange={(val) => setFormData(prev => ({ ...prev, description: val, content: val }))}
                    placeholder="Describe the magical experience awaiting travellers... Markdown and HTML tags are supported."
                />
              </div>
              {formErrors.content && <p className="text-[10px] text-red-500 font-bold italic ml-1 mt-1">*{formErrors.content}</p>}
            </div>
          </div>

          {/* New Section: Itinerary Evolution */}
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  route
                </span>
                <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">
                  Progressive Itinerary
                </h2>
              </div>
              <button
                type="button"
                onClick={handleAddDay}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all"
              >
                <span className="material-symbols-outlined text-[14px]">
                  add_circle
                </span>
                Inscribe New Day
              </button>
            </div>

            <div className="space-y-8">
              {(formData.itinerary || []).map((day, index) => (
                <div
                  key={index}
                  className="group relative bg-slate-50 dark:bg-slate-800/20 rounded-[32px] border border-slate-100 dark:border-slate-800 p-8 transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="absolute -top-3 left-8 px-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                    Sequence {day.day}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveDay(index)}
                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all shadow-xl"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      close
                    </span>
                  </button>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                          Daily Milestone Title
                        </label>
                        <input
                          type="text"
                          value={day.title}
                          onChange={(e) =>
                            handleItineraryChange(index, "title", e.target.value)
                          }
                          className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                          placeholder="e.g. Arrival in Manali & Local Exploration"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                          Experience Tags
                        </label>
                        <input
                          type="text"
                          value={
                            Array.isArray(day.tags)
                              ? day.tags.join(", ")
                              : day.tags || ""
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            setTempTags((prev) => ({ ...prev, [index]: val }));
                            handleItineraryChange(index, "tags", val);
                          }}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 text-[11px] font-mono outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                          placeholder="Nature, Culture, Spa..."
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between ml-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Experience Narrative
                        </label>
                        <div className="flex bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl">
                          <button 
                            type="button"
                            onClick={() => setDayEditorModes(prev => ({...prev, [index]: 'visual'}))}
                            className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-tight transition-all ${(dayEditorModes[index] || 'visual') === 'visual' ? 'bg-white shadow text-primary' : 'text-slate-400'}`}
                          >Visual</button>
                          <button 
                            type="button"
                            onClick={() => setDayEditorModes(prev => ({...prev, [index]: 'html'}))}
                            className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-tight transition-all ${dayEditorModes[index] === 'html' ? 'bg-white shadow text-primary' : 'text-slate-400'}`}
                          >HTML</button>
                        </div>
                      </div>

                      <div className="relative border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                        <RichTextEditor
                            minHeight="min-h-[120px]"
                            value={day.description}
                            onChange={(val) => handleItineraryChange(index, "description", val)}
                            placeholder={`Narrate the wonders of Day ${day.day}...`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Taxonomies & Settings */}
        <div className="space-y-8">
          {/* Section: Regional Mapping */}
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-6">
              <span className="material-symbols-outlined text-primary">
                distance
              </span>
              <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">
                Geography Engine
              </h2>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Primary Destination
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(categories.destinationStates).map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          destination: dest,
                          stateRegion: "",
                          subregion: "",
                        }))
                      }
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-xs font-black ${
                        formData.destination === dest
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 translate-y-[-2px]"
                          : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {dest === "India" ? "temple_hindu" : "public"}
                      </span>
                      {dest}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const custom = prompt("Enter Custom Destination Hub:");
                      if (custom) setFormData({ ...formData, destination: custom });
                    }}
                    className="flex items-center justify-center p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase text-slate-400 hover:border-primary hover:text-primary transition-all"
                  >
                    + Custom Hub
                  </button>
                </div>
                {formErrors.destination && <p className="text-[10px] text-red-500 font-bold italic ml-1">*{formErrors.destination}</p>}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    State / Provencial Grid
                  </label>
                  <span className="text-[8px] font-black text-primary px-2 py-0.5 bg-primary/10 rounded-full animate-pulse">
                    Dynamic Search
                  </span>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    explore
                  </span>
                  <input
                    type="text"
                    placeholder="Search States..."
                    value={destSearchQuery}
                    onChange={(e) => setDestSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-xs font-bold outline-none focus:border-primary transition-all"
                  />
                  <div className="mt-4 flex flex-wrap gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {availableStates
                      .filter((s) =>
                        s.toLowerCase().includes(destSearchQuery.toLowerCase()),
                      )
                      .map((state) => {
                          const stateVal = String(state).toLowerCase();
                          const currentRegions = Array.isArray(formData.stateRegion) 
                            ? formData.stateRegion.map(r => String(r).toLowerCase())
                            : [String(formData.stateRegion || "").toLowerCase()];
                          const isActive = currentRegions.includes(stateVal);

                          return (
                            <button
                                key={state}
                                type="button"
                                onClick={() => {
                                    setFormData(prev => {
                                        const current = Array.isArray(prev.stateRegion) ? prev.stateRegion : (prev.stateRegion ? [prev.stateRegion] : []);
                                        const normalizedCurrent = current.map(c => normalizeBucket(c));
                                        const normalizedState = normalizeBucket(state);
                                        
                                        if (normalizedCurrent.includes(normalizedState)) {
                                            return { ...prev, stateRegion: current.filter(c => normalizeBucket(c) !== normalizedState) };
                                        } else {
                                            return { ...prev, stateRegion: [...current, displayState(state)] };
                                        }
                                    });
                                }}
                                className={`px-4 py-2.5 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-2 ${
                                    isActive
                                    ? "bg-slate-900 text-white border-slate-900 shadow-lg dark:bg-white dark:text-slate-900"
                                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-primary"
                                }`}
                            >
                                <span className="text-base leading-none">{DEST_ICON_MAP[state] || "📍"}</span>
                                {state}
                            </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => {
                          const custom = prompt("Enter Custom Region Name:");
                          if (custom) {
                            setFormData(prev => ({
                                ...prev,
                                stateRegion: Array.isArray(prev.stateRegion) ? [...prev.stateRegion, custom] : [custom]
                            }));
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase text-slate-400 hover:border-primary hover:text-primary transition-all"
                      >
                        + Custom State
                      </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Local District / Subregion
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    location_on
                  </span>
                  <input
                    type="text"
                    placeholder="Search Subregions..."
                    value={subreqSearchQuery}
                    onChange={(e) => setSubreqSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-xs font-bold outline-none focus:border-primary transition-all"
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {availableSubregions
                    .filter((s) => s.toLowerCase().includes(subreqSearchQuery.toLowerCase()))
                    .map((sub) => {
                        const currentSubs = Array.isArray(formData.subregion) ? formData.subregion : (formData.subregion ? [formData.subregion] : []);
                        const isActive = currentSubs.includes(sub);
                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => {
                                setFormData(prev => {
                                    const current = Array.isArray(prev.subregion) ? prev.subregion : (prev.subregion ? [prev.subregion] : []);
                                    if (current.includes(sub)) {
                                        return { ...prev, subregion: current.filter(c => c !== sub) };
                                    } else {
                                        return { ...prev, subregion: [...current, sub] };
                                    }
                                });
                            }}
                            className={`px-3 py-2 rounded-lg border text-[10px] font-black uppercase transition-all ${
                                isActive
                                ? "bg-primary/20 text-primary border-primary"
                                : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-primary"
                            }`}
                          >
                            {sub}
                          </button>
                        );
                    })}
                    <button
                        type="button"
                        onClick={() => {
                          const custom = prompt("Enter Custom Sub-location:");
                          if (custom) {
                            setFormData(prev => ({
                                ...prev,
                                subregion: Array.isArray(prev.subregion) ? [...prev.subregion, custom] : [custom]
                            }));
                          }
                        }}
                        className="px-3 py-2 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase text-slate-400 hover:border-primary hover:text-primary transition-all"
                      >
                        + Custom
                      </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Product Strategy */}
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-6">
              <span className="material-symbols-outlined text-primary">
                architecture
              </span>
              <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">
                Product Architecture
              </h2>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Tour Modality / Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.styles.map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, style: style.value })}
                      className={`flex flex-col items-start gap-1 p-4 rounded-2xl border transition-all ${
                        formData.style === style.value
                          ? "bg-primary border-primary shadow-lg shadow-primary/20"
                          : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      <span className={`text-[18px] ${formData.style === style.value ? "text-white" : "text-primary"}`}>{style.icon}</span>
                      <span className={`text-[11px] font-black uppercase tracking-tight ${formData.style === style.value ? "text-white" : "text-slate-800 dark:text-slate-200"}`}>
                        {style.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Nature of Expedition
                </label>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                  {categories.natures.map((nature) => (
                    <button
                      key={nature.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, nature: nature.value })
                      }
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        formData.nature === nature.value
                          ? "bg-white shadow-xl dark:bg-slate-700 text-primary scale-[1.05] z-10"
                          : "text-slate-400 opacity-60"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {nature.icon}
                      </span>
                      {nature.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-slate-900 rounded-3xl space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData({ ...formData, isFeatured: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-slate-700 rounded-full peer peer-checked:bg-primary transition-all shadow-inner"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-all shadow-lg"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-white uppercase tracking-widest group-hover:text-primary transition-colors">
                      Promote as Featured
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold italic">
                      Boost to homepage and top search results.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Section: Visual Gallery Vault */}
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-6">
              <span className="material-symbols-outlined text-primary">
                gallery_thumbnail
              </span>
              <h2 className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">
                Media Vault
              </h2>
            </div>

            <div className="space-y-6">
              <label id="image" className={`relative flex flex-col items-center justify-center w-full h-[240px] border-2 border-dashed rounded-[32px] cursor-pointer transition-all group overflow-hidden ${formErrors.image ? "border-red-500 bg-red-50/5" : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-primary hover:bg-slate-100"}`}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                />
                <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform">
                  <span className={`material-symbols-outlined text-4xl group-hover:text-primary transition-colors ${formErrors.image ? "text-red-400" : "text-slate-300"}`}>
                    {formErrors.image ? "warning" : "cloud_upload"}
                  </span>
                  <div className="text-center">
                    <p className={`text-sm font-black uppercase tracking-widest ${formErrors.image ? "text-red-600" : "text-slate-900 dark:text-white"}`}>
                      {formErrors.image ? formErrors.image : "Inscribe Journey Photos"}
                    </p>
                    <p className={`text-[10px] font-bold italic ${formErrors.image ? "text-red-400" : "text-slate-400"}`}>
                      Upload multiple JPEG/WebP assets (Max 5MB each)
                    </p>
                  </div>
                </div>
              </label>
              {formErrors.image && <p className="text-[10px] text-red-500 font-bold italic ml-1 text-center animate-bounce">*{formErrors.image}</p>}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {(formData.images || []).map((img, index) => (
                  <div
                    key={index}
                    className="group relative h-[180px] rounded-[24px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm"
                  >
                    <img
                      src={img.url}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={img.caption}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all p-4 flex flex-col justify-end gap-3">
                      <input
                        type="text"
                        value={img.caption}
                        onChange={(e) =>
                          updateImageCaption(index, e.target.value)
                        }
                        className="w-full bg-white/20 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1.5 text-[10px] text-white font-bold outline-none placeholder:text-white/40 shadow-xl"
                        placeholder="Inscribe caption..."
                      />
                      <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  image: img.url,
                                  images: [
                                    img,
                                    ...prev.images.filter((_, i) => i !== index),
                                  ],
                                }))
                              }
                          className="flex-1 py-1.5 bg-white text-slate-900 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-400 hover:text-white transition-all shadow-xl"
                        >
                          Main Hero
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="w-8 h-8 bg-white/10 backdrop-blur-md text-white rounded-lg flex items-center justify-center hover:bg-red-500 transition-all shadow-xl border border-white/10"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNewTourUploadForm;
