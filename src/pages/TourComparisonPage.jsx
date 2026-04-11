import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { safeCacheTours, STORAGE_KEYS } from '../utils/storage';

/* ── helpers ──────────────────────────────────────────────────────────────── */
const arr = (v) => (Array.isArray(v) ? v : v ? [v] : []);
const str = (v) => arr(v).filter(Boolean).join(', ') || '—';

const Badge = ({ children, color = 'teal' }) => {
  const colors = {
    teal:   'bg-teal-50 text-teal-700 border-teal-200',
    amber:  'bg-amber-50 text-amber-700 border-amber-200',
    rose:   'bg-rose-50  text-rose-700  border-rose-200',
    slate:  'bg-slate-100 text-slate-500 border-slate-200',
    green:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${colors[color] || colors.slate} mr-1 mb-1`}>
      {children}
    </span>
  );
};

const Check = ({ yes }) => yes
  ? <span className="material-symbols-outlined text-emerald-500 text-[20px]" style={{ fontVariationSettings:"'FILL' 1" }}>check_circle</span>
  : <span className="material-symbols-outlined text-slate-300 text-[20px]">cancel</span>;

/* ── Meal Plan label helper ──────────────────────────────────────────────── */
const mealLabel = (t) => {
  const plans = arr(t.mealPlan);
  if (plans.length) return plans.join(', ');
  // fall back to free-text field some tours use
  if (t.meals) return t.meals;
  return '—';
};

/* ── Hotel stars helper ──────────────────────────────────────────────────── */
const hotelLabel = (t) => {
  const cats = arr(t.hotelCategory);
  if (cats.length) return cats.map(c => c.replace(/_/g, ' ')).join(', ');
  if (t.hotelQuality) return t.hotelQuality;
  return '—';
};

/* ── Stars display ─────────────────────────────────────────────────────────── */
const Stars = ({ label }) => {
  if (!label || label === '—') return <span className="text-slate-400">—</span>;
  const num = parseFloat(label); // e.g. "3" or "4" or "3/4"
  const count = isNaN(num) ? 0 : num;
  return (
    <span className="flex items-center gap-0.5 text-amber-400">
      {[...Array(Math.min(Math.round(count), 5))].map((_, i) => (
        <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings:"'FILL' 1" }}>star</span>
      ))}
      <span className="text-[13px] font-bold text-amber-700 ml-1">{label}</span>
    </span>
  );
};

/* ── Column header row ───────────────────────────────────────────────────── */
const TourHeader = ({ tour, onRemove }) => {
  const detailUrl = `/tour/${tour.slug || tour.id}`;
  return (
    <th className="p-5 align-top min-w-[240px] relative border-r border-slate-100 last:border-r-0">
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 text-slate-300 hover:text-red-500 w-7 h-7 rounded-full flex items-center justify-center transition-all bg-white shadow-sm z-10"
        title="Remove"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
      <div className="h-[130px] rounded-xl overflow-hidden mb-3 relative">
        <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {tour.duration && (
          <span className="absolute bottom-2 left-2 text-[10px] font-black text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {tour.duration}
          </span>
        )}
      </div>
      <h3 className="font-bold text-slate-900 text-[15px] leading-snug mb-3 min-h-[44px] line-clamp-2">
        {tour.title}
      </h3>
      <Link
        to={detailUrl}
        className="block w-full text-center px-4 py-2.5 bg-primary text-white font-black text-[12px] rounded-xl hover:bg-primary/90 transition-all"
      >
        View Details
      </Link>
    </th>
  );
};

/* ── attribute row list ─────────────────────────────────────────────────── */
const buildAttributes = (formatPrice) => [
  /* ── PRICING ── */
  { section: 'Pricing', key: 'price', label: 'Starting Price', icon: 'payments',
    render: (t) => <span className="text-xl font-black text-primary">{formatPrice(t.price, true)}</span> },
  { key: 'crossedOutPrice', label: 'Original / MRP', icon: 'sell',
    render: (t) => t.crossedOutPrice
      ? <span className="line-through text-slate-400 font-medium">{formatPrice(t.crossedOutPrice, true)}</span>
      : <span className="text-slate-300">—</span> },
  { key: 'groupDiscount', label: 'Group Discount', icon: 'group',
    render: (t) => t.groupDiscountPercentage
      ? <Badge color="green">
          <span className="material-symbols-outlined text-[12px]">celebration</span>
          {t.groupDiscountPercentage}% off ≥ {t.groupDiscountMinGuests || 4} guests
        </Badge>
      : <span className="text-slate-300">—</span> },

  /* ── BASICS ── */
  { section: 'Tour Details', key: 'duration', label: 'Duration', icon: 'schedule',
    render: (t) => <span className="font-bold">{t.duration || '—'}</span> },
  { key: 'destination', label: 'Destination', icon: 'public',
    render: (t) => <span className="font-medium">{str(t.destination)}</span> },
  { key: 'stateRegion', label: 'State / Region', icon: 'location_on',
    render: (t) => <span className="font-medium">{str(t.stateRegion)}</span> },
  { key: 'cityPath', label: 'Route / Cities', icon: 'route',
    render: (t) => t.cityPath
      ? <span className="text-[12px] text-slate-600 leading-relaxed">{t.cityPath}</span>
      : <span className="text-slate-300">—</span> },
  { key: 'style', label: 'Travel Style', icon: 'group',
    render: (t) => t.style ? <Badge color="teal">{t.style}</Badge> : <span className="text-slate-300">—</span> },
  { key: 'theme', label: 'Theme', icon: 'category',
    render: (t) => t.theme ? <Badge color="amber">{t.theme}</Badge> : <span className="text-slate-300">—</span> },
  { key: 'bestTimeToVisit', label: 'Best Time to Visit', icon: 'wb_sunny',
    render: (t) => t.bestTimeToVisit
      ? <span className="font-medium">{t.bestTimeToVisit}</span>
      : <span className="text-slate-300">—</span> },

  /* ── ACCOMMODATION ── */
  { section: 'Accommodation & Meals', key: 'hotelCategory', label: 'Hotel Category', icon: 'hotel',
    render: (t) => {
      const label = hotelLabel(t);
      if (label === '—') return <span className="text-slate-300">—</span>;
      return <Stars label={label} />;
    }},
  { key: 'mealPlan', label: 'Meal Plan', icon: 'restaurant',
    render: (t) => {
      const label = mealLabel(t);
      if (label === '—') return <span className="text-slate-300">—</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {label.split(/[,\/]/).map(m => m.trim()).filter(Boolean).map(m => (
            <Badge key={m} color="green">
              <span className="material-symbols-outlined text-[11px]">restaurant_menu</span>
              {m}
            </Badge>
          ))}
        </div>
      );
    }},

  /* ── TRANSPORT ── */
  { section: 'Transport', key: 'transport', label: 'Transport', icon: 'directions_car',
    render: (t) => t.transport
      ? <Badge color="teal">
          <span className="material-symbols-outlined text-[12px]">directions_car</span>
          {t.transport}
        </Badge>
      : <span className="text-slate-300">—</span> },
  { key: 'flights', label: 'Flights Included', icon: 'flight',
    render: (t) => {
      const incl = arr(t.inclusions).some(i => {
        const text = typeof i === 'object' ? i.text : i;
        return text && /flight|airfare|air ticket/i.test(text);
      });
      return <Check yes={incl} />;
    }},

  /* ── INCLUSIONS ── */
  { section: 'Key Inclusions', key: 'inclusions', label: 'Included Highlights', icon: 'check_circle',
    render: (t) => {
      const items = arr(t.inclusions).slice(0, 5);
      if (!items.length) return <span className="text-slate-300">—</span>;
      return (
        <ul className="space-y-1">
          {items.map((item, i) => {
            const text = typeof item === 'object' ? item.text : item;
            return (
              <li key={i} className="flex items-start gap-1.5 text-[12px] text-slate-700">
                <span className="material-symbols-outlined text-emerald-500 text-[14px] shrink-0 mt-px" style={{ fontVariationSettings:"'FILL' 1" }}>check_circle</span>
                {text}
              </li>
            );
          })}
          {arr(t.inclusions).length > 5 && (
            <li className="text-[11px] text-slate-400 font-bold mt-1">+{arr(t.inclusions).length - 5} more</li>
          )}
        </ul>
      );
    }},
  { key: 'exclusions', label: 'Notable Exclusions', icon: 'cancel',
    render: (t) => {
      const items = arr(t.exclusions).slice(0, 4);
      if (!items.length) return <span className="text-slate-300">—</span>;
      return (
        <ul className="space-y-1">
          {items.map((item, i) => {
            const text = typeof item === 'object' ? item.text : item;
            return (
              <li key={i} className="flex items-start gap-1.5 text-[12px] text-slate-500 line-through decoration-slate-300">
                <span className="material-symbols-outlined text-rose-400 text-[14px] shrink-0 mt-px no-underline" style={{ fontVariationSettings:"'FILL' 1", textDecoration: 'none' }}>cancel</span>
                <span className="no-underline" style={{ textDecoration: 'none' }}>{text}</span>
              </li>
            );
          })}
        </ul>
      );
    }},

  /* ── ITINERARY ── */
  { section: 'Itinerary', key: 'itinerary', label: 'Itinerary Days', icon: 'calendar_month',
    render: (t) => {
      const days = arr(t.itinerary);
      if (!days.length) return <span className="text-slate-300">—</span>;
      return (
        <ul className="space-y-1">
          {days.slice(0, 4).map((day, i) => (
            <li key={i} className="text-[12px] text-slate-600">
              <span className="font-bold text-primary">Day {i + 1}:</span>{' '}
              {typeof day === 'string' ? day.slice(0, 60) : (day.title || day.day || '').slice(0, 60)}
              {(typeof day === 'string' ? day : day.title || '').length > 60 ? '…' : ''}
            </li>
          ))}
          {days.length > 4 && <li className="text-[11px] text-slate-400 font-bold">+{days.length - 4} more days</li>}
        </ul>
      );
    }},

  /* ── TOUR FEATURES ── */
  { section: 'Features', key: 'tourFeatures', label: 'Tour Features', icon: 'featured_play_list',
    render: (t) => {
      const features = arr(t.tourFeatures);
      if (!features.length) return <span className="text-slate-300">—</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {features.map(f => <Badge key={f} color="slate">{f}</Badge>)}
        </div>
      );
    }},
  { key: 'isFeatured', label: 'Featured / Best Seller', icon: 'star',
    render: (t) => <Check yes={t.isFeatured} /> },
];

/* ── Main Component ───────────────────────────────────────────────────────── */
const TourComparisonPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const idsParam = searchParams.get('ids');
  const [toursToCompare, setToursToCompare] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (!idsParam) { setLoading(false); return; }

    const ids = idsParam.split(',').map(s => s.trim());

    const fetchComparisonTours = async () => {
      try {
        let allToursList = [];
        const res = await fetch(`${import.meta.env.BASE_URL}data/tours.json?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data)) {
            allToursList = data.filter(Boolean);
            safeCacheTours(STORAGE_KEYS.TOURS, allToursList);
          }
        } else {
          const saved = localStorage.getItem(STORAGE_KEYS.TOURS);
          if (saved) {
            try { const p = JSON.parse(saved); if (Array.isArray(p)) allToursList = p.filter(Boolean); } catch(e) {}
          }
        }

        const active = allToursList.filter(t => t.status !== 'paused' && t.status !== 'draft');

        // Match by slug OR id (supports both numeric ids and slug-based URLs)
        const ordered = ids.map(id => {
          return active.find(t =>
            t.slug === id ||
            String(t.id) === id ||
            (t.slug && t.slug.toLowerCase() === id.toLowerCase())
          );
        }).filter(Boolean);

        setToursToCompare(ordered);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch tours for comparison:', err);
        setLoading(false);
      }
    };

    fetchComparisonTours();
  }, [idsParam]);

  const removeTour = (idToRemove) => {
    const remaining = toursToCompare.filter(t => t.id !== idToRemove);
    if (remaining.length === 0) { navigate('/tours'); return; }
    navigate(`/tours/compare?ids=${remaining.map(t => t.slug || t.id).join(',')}`, { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (toursToCompare.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <span className="material-symbols-outlined text-6xl text-slate-300">compare_arrows</span>
        <h2 className="text-2xl font-black text-slate-800">No Tours Found for Comparison</h2>
        <p className="text-slate-500 text-sm">The tours you selected may have been removed or the IDs are invalid.</p>
        <Link to="/tours" className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
          Browse Tours
        </Link>
      </div>
    );
  }

  const attributes = buildAttributes(formatPrice);
  let lastSection = null;

  return (
    <div className="min-h-screen bg-slate-50 py-10" data-page="tour_comparison">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <Link to="/tours" className="text-primary font-bold text-sm flex items-center gap-1 mb-2 hover:underline">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Tours
            </Link>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-4xl">compare_arrows</span>
              Compare Packages
            </h1>
            <p className="text-slate-500 text-sm mt-1">Comparing {toursToCompare.length} tour{toursToCompare.length > 1 ? 's' : ''} side-by-side</p>
          </div>
          {toursToCompare.length < 4 && (
            <Link to="/tours" className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Another Tour
            </Link>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-x-auto">
          <table className="w-full text-left border-collapse" style={{ minWidth: `${200 + toursToCompare.length * 250}px` }}>
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {/* Sticky label column */}
                <th className="p-5 sticky left-0 z-20 bg-slate-50 w-[200px] min-w-[200px] border-r border-slate-200 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.08)]">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Features</span>
                </th>
                {toursToCompare.map(tour => (
                  <TourHeader key={`hdr-${tour.id}`} tour={tour} onRemove={() => removeTour(tour.id)} />
                ))}
                {[...Array(Math.max(0, 2 - toursToCompare.length))].map((_, i) => (
                  <th key={`empty-hdr-${i}`} className="p-5 bg-slate-50/50 min-w-[240px]" />
                ))}
              </tr>
            </thead>
            <tbody>
              {attributes.map((attr, index) => {
                const isNewSection = attr.section && attr.section !== lastSection;
                if (attr.section) lastSection = attr.section;
                const isEven = index % 2 === 0;

                return (
                  <React.Fragment key={attr.key}>
                    {/* Section header row */}
                    {isNewSection && (
                      <tr>
                        <td
                          colSpan={1 + toursToCompare.length + Math.max(0, 2 - toursToCompare.length)}
                          className="px-5 pt-5 pb-2 bg-slate-50 border-t border-b border-slate-100"
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">{attr.section}</span>
                        </td>
                      </tr>
                    )}
                    {/* Data row */}
                    <tr className={isEven ? 'bg-white' : 'bg-slate-50/40'}>
                      {/* Sticky label */}
                      <td className="p-5 border-r border-slate-200 sticky left-0 z-10 bg-inherit shadow-[4px_0_10px_-5px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center gap-2 text-slate-600 font-semibold text-[13px]">
                          <span className="material-symbols-outlined text-slate-400 text-[18px]">{attr.icon}</span>
                          {attr.label}
                        </div>
                      </td>
                      {/* Tour value cells */}
                      {toursToCompare.map(tour => (
                        <td key={`cell-${tour.id}-${attr.key}`} className="p-5 text-slate-700 border-r border-slate-100 last:border-r-0 align-top text-[13px]">
                          {attr.render(tour)}
                        </td>
                      ))}
                      {/* Placeholder columns */}
                      {[...Array(Math.max(0, 2 - toursToCompare.length))].map((_, i) => (
                        <td key={`empty-cell-${attr.key}-${i}`} className="p-5 bg-slate-50/20" />
                      ))}
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default TourComparisonPage;
