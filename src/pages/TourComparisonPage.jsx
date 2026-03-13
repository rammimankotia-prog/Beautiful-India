import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

const TourComparisonPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const idsParam = searchParams.get('ids');
  const [toursToCompare, setToursToCompare] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (!idsParam) {
      setLoading(false);
      return;
    }

    const ids = idsParam.split(',');
    
    fetch('http://localhost:3001/api/tours')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(t => ids.includes(t.id.toString()));
        // Keep order as requested in URL
        const ordered = ids.map(id => filtered.find(t => t.id.toString() === id)).filter(Boolean);
        setToursToCompare(ordered);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch tours for comparison:", err);
        setLoading(false);
      });
  }, [idsParam]);

  const removeTour = (idToRemove) => {
    const newIds = toursToCompare.filter(t => t.id !== idToRemove).map(t => t.id);
    if (newIds.length === 0) {
      navigate('/tours'); // Go back to tours if empty
    } else {
       navigate(`/tours/compare?ids=${newIds.join(',')}`, { replace: true });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#006D77] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (toursToCompare.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f7f6]">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">compare_arrows</span>
        <h2 className="text-2xl font-black text-slate-800 mb-2">No Tours Selected for Comparison</h2>
        <p className="text-slate-500 mb-8">Please select at least two tours to compare.</p>
        <Link to="/tours" className="px-8 py-3 bg-[#ff5a5f] text-white font-bold rounded-xl hover:bg-[#e0484d] transition-colors">
          Browse Tours
        </Link>
      </div>
    );
  }

  const attributes = [
    { key: 'price', label: 'Price (Starting From)', icon: 'payments', render: (t) => <span className="text-lg font-black text-[#006D77]">{formatPrice(t.price, true)}</span> },
    { key: 'duration', label: 'Duration', icon: 'schedule', render: (t) => t.duration },
    { key: 'style', label: 'Travel Style', icon: 'group', render: (t) => t.style || 'Group Tour' },
    { key: 'destination', label: 'Primary Destination', icon: 'location_on', render: (t) => t.destination || 'Various' },
    { key: 'hotel', label: 'Hotel Quality', icon: 'hotel', render: (t) => <span className="flex items-center gap-1 text-yellow-500"><span className="material-symbols-outlined text-[16px]">star</span>3/4 Star</span> },
    { key: 'meals', label: 'Meals Included', icon: 'restaurant', render: (t) => 'Breakfast & Dinner' },
    { key: 'cabs', label: 'Transfers', icon: 'directions_car', render: (t) => 'Private AC Vehicle' },
    { key: 'flights', label: 'Flights', icon: 'flight', render: (t) => <span className="text-slate-400">Not Included</span> }
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f6] py-12" data-page="tour_comparison">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
           <div>
             <Link to="/tours" className="text-[#006D77] font-bold text-sm flex items-center gap-1 mb-2 hover:underline">
               <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Tours
             </Link>
             <h1 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center gap-3">
               <span className="material-symbols-outlined text-[#ff5a5f] text-4xl">compare_arrows</span>
               Compare Packages
             </h1>
           </div>
           
           {toursToCompare.length < 4 && (
             <Link to="/tours" className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
               <span className="material-symbols-outlined text-[18px]">add</span>
               Add Another Tour
             </Link>
           )}
        </div>

        {/* Comparison Matrix */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-x-auto">
           <table className="w-full text-left border-collapse min-w-[800px]">
             <thead>
               <tr className="bg-slate-50 border-b border-slate-200">
                 {/* Feature Label Column */}
                 <th className="p-6 sticky left-0 z-20 bg-slate-50 w-1/5 min-w-[200px] border-r border-slate-200 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)]">
                   <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Compare Features</span>
                 </th>
                 
                 {/* Tour Image/Title Columns */}
                 {toursToCompare.map(tour => {
                    const tourDestSegment = encodeURIComponent((tour.destination || 'dest').toLowerCase().replace(/\s+/g, '-'));
                    const tourStateSegment = encodeURIComponent((tour.stateRegion || 'state').toLowerCase().replace(/\s+/g, '-'));
                    const tourSubSegment = encodeURIComponent((tour.subregion || 'subregion').toLowerCase().replace(/\s+/g, '-'));
                    const tourTitleSegment = encodeURIComponent((tour.title || 'tour').toLowerCase().replace(/\s+/g, '-'));
                    const detailUrl = `/tours/${tourDestSegment}/${tourStateSegment}/${tourSubSegment}/${tourTitleSegment}`;

                    return (
                        <th key={`header-${tour.id}`} className="p-6 align-top w-1/4 min-w-[250px] relative border-r border-slate-200 last:border-r-0">
                        <button 
                            onClick={() => removeTour(tour.id)}
                            className="absolute top-4 right-4 text-slate-300 hover:text-red-500 hover:bg-red-50 w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white shadow-sm z-10"
                            title="Remove from comparison"
                        >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                        <div className="h-[140px] rounded-2xl overflow-hidden mb-4 relative">
                            <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight mb-4 min-h-[50px]">
                            {tour.title}
                        </h3>
                        <Link 
                            to={detailUrl}
                            className="block w-full text-center px-4 py-3 bg-[#ff5a5f] text-white font-black rounded-xl hover:bg-[#e0484d] transition-colors"
                        >
                            View Details
                        </Link>
                        </th>
                    );
                 })}
                 {/* Empty Cells for alignment if < max */}
                 {[...Array(Math.max(0, 4 - toursToCompare.length))].map((_, i) => (
                    <th key={`empty-head-${i}`} className="p-6 align-top w-1/4 min-w-[250px] bg-slate-50/50"></th>
                 ))}
               </tr>
             </thead>
             <tbody>
                {attributes.map((attr, index) => (
                    <tr key={attr.key} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="p-6 font-bold text-slate-600 border-r border-slate-200 sticky left-0 z-10 bg-inherit shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)] flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-400">{attr.icon}</span>
                            {attr.label}
                        </td>
                        {toursToCompare.map(tour => (
                            <td key={`cell-${tour.id}-${attr.key}`} className="p-6 text-slate-700 font-medium border-r border-slate-100 last:border-r-0">
                                {attr.render(tour)}
                            </td>
                        ))}
                         {[...Array(Math.max(0, 4 - toursToCompare.length))].map((_, i) => (
                            <td key={`empty-cell-${attr.key}-${i}`} className="p-6 bg-slate-50/30"></td>
                         ))}
                    </tr>
                ))}
             </tbody>
           </table>
        </div>

      </div>
    </div>
  );
};

export default TourComparisonPage;
