import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { Helmet } from 'react-helmet-async';
import BharatDarshanBanner from '../components/BharatDarshanBanner';

import { useData } from '../context/DataContext';

const BeautifulIndiaHome = () => {
    const { formatPrice } = useCurrency();
    const { tours, loading: dataLoading } = useData();
    const [themes, setThemes] = useState([]);

    useEffect(() => {
        // Fetch themes (themes.json is small, can stay local or move to context if needed)
        fetch(`${import.meta.env.BASE_URL}data/themes.json`)
            .then(res => res.json())
            .then(data => setThemes(data.sort((a,b) => (a.order || 0) - (b.order || 0))))
            .catch(() => setThemes([
                { id:'1', title: 'Solo', subtitle: '130+ destinations', image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=400&q=80' },
                { id:'2', title: 'Adventure', subtitle: '30+ destinations', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80' },
                { id:'3', title: 'Nature', subtitle: '100+ destinations', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80' },
                { id:'4', title: 'Religious', subtitle: '60+ destinations', image: '/religious_theme.png' },
                { id:'5', title: 'Wildlife', subtitle: '20+ destinations', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=400&q=80' },
                { id:'6', title: 'Water Activities', subtitle: '20+ destinations', image: '/water_activities_theme.png' }
            ]));
    }, []);

    const displayedTours = tours
        .filter(tour => (tour.status === 'active' || tour.status === undefined) && tour.isFeatured)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
        <div className="px-5 md:px-20 lg:px-32 xl:px-40">
            <Helmet>
                <title>The Beautiful India - Bharat Darshan | Explore India's Wonders</title>
                <meta name="description" content="Explore the incredible beauty of India with Bharat Darshan. Curated tour packages for Himachal, Kashmir, Rajasthan, Kerala, and more." />
                <meta property="og:title" content="The Beautiful India - Bharat Darshan" />
                <meta property="og:description" content="Discover India's beauty with Bharat Darshan. Curated tour packages for all major destinations." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://bhaktikishakti.com/" />
                <meta property="og:image" content="/beautiful_india_logo_1773142903437.png" />
            </Helmet>

            <BharatDarshanBanner />

            {/* ── Featured Tours ───────────────────────────────────────── */}
            <section style={{ marginBottom:60 }}>
                <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:32 }}>
                    <div>
                        <h2 style={{ color:'#006D77', fontSize:36, fontWeight:900, margin:'0 0 6px' }}>Featured Tours</h2>
                        <p style={{ color:'#7F8C8D', margin:0, fontWeight:500 }}>Handpicked experiences for your next getaway</p>
                    </div>
                    <Link to="/tours" style={{ display:'flex', alignItems:'center', gap:4, color:'#006D77', fontWeight:700, textDecoration:'none', fontSize:15 }}>
                        View All <span className="material-symbols-outlined" style={{ fontSize:16 }}>arrow_forward</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayedTours.map(tour => {
                        const detailUrl = `/tour/${tour.slug || tour.id}`;
                        
                        return (
                        <Link key={tour.id} to={detailUrl} style={{ textDecoration:'none', color:'inherit', display:'flex', flexDirection:'column', height:'100%' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background:'#fff', borderRadius:18, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.07)', border:'1.5px solid rgba(0,109,119,0.06)', transition:'box-shadow .2s' }}
                                 onMouseEnter={e => e.currentTarget.style.boxShadow='0 8px 30px rgba(0,109,119,0.18)'}
                                 onMouseLeave={e => e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.07)'}>
                                <div style={{ position:'relative', width:'100%', paddingTop:'75%', overflow:'hidden' }}>
                                    <div style={{ 
                                        position:'absolute', 
                                        inset:0, 
                                        backgroundImage:`url(${tour.image?.startsWith('/') ? (import.meta.env.BASE_URL + tour.image.slice(1)) : tour.image})`, 
                                        backgroundSize:'cover', 
                                        backgroundPosition:'center', 
                                        transition:'transform .4s' 
                                    }}
                                         onMouseEnter={e => e.currentTarget.style.transform='scale(1.08)'}
                                         onMouseLeave={e => e.currentTarget.style.transform='scale(1)'} />
                                    <div style={{ position:'absolute', top:12, right:12, background:'rgba(255,255,255,0.92)', borderRadius:50, padding:'4px 10px', display:'flex', alignItems:'center', gap:4 }}>
                                        <span className="material-symbols-outlined" style={{ fontSize:14, color:'#f59e0b' }}>star</span>
                                        <span style={{ fontSize:13, fontWeight:700 }}>{tour.rating}</span>
                                    </div>
                                </div>
                                <div style={{ padding:'18px 20px', display:'flex', flexDirection:'column', gap:8, flex: 1 }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:4, color:'#7F8C8D', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>
                                        <span className="material-symbols-outlined" style={{ fontSize:14 }}>schedule</span> {tour.duration}
                                        {tour.bestTimeToVisit && (
                                            <>
                                                <span style={{ margin: '0 4px', color: '#cbd5e1' }}>|</span>
                                                <span className="material-symbols-outlined" style={{ fontSize:14 }}>sunny</span> {tour.bestTimeToVisit}
                                            </>
                                        )}
                                    </div>
                                    <h3 style={{ margin:0, fontSize:17, fontWeight:800, color:'#2C3E50' }}>{tour.title}</h3>
                                    <p style={{ margin:0, color:'#7F8C8D', fontSize:13, lineHeight:1.5 }}>{tour.description}</p>
                                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid rgba(0,109,119,0.1)', paddingTop:14, marginTop:'auto' }}>
                                        <div>
                                            <div style={{ color:'#7F8C8D', fontSize:11 }}>From</div>
                                            <div style={{ color:'#006D77', fontSize:22, fontWeight:900 }}>{formatPrice(tour.price, true)}</div>
                                        </div>
                                        <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(0,109,119,0.1)', border:'none', color:'#006D77', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize:20 }}>arrow_forward</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        );
                    })}
                </div>
            </section>

            {/* ── Explore by Theme ───────────────────────────────────────── */}
            <section style={{ marginBottom:60 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                    <h2 style={{ color:'#2C3E50', fontSize:26, fontWeight:800, margin:0 }}>Explore destinations by theme</h2>
                    <div style={{ display:'flex', alignItems:'center', gap:8, color:'#7F8C8D', fontSize:15, fontWeight:600 }}>
                        <span className="material-symbols-outlined" style={{ fontSize:20 }}>call</span>
                        For best packages, call us at <span style={{ color:'#006D77', fontWeight:700 }}>+916005159433</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                    {themes.map(theme => (
                        <Link key={theme.title} to="/tours" style={{ textDecoration:'none', color:'inherit', display:'block' }}>
                            <div style={{ cursor:'pointer', transition:'transform .2s' }} 
                                 onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
                                 onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                                <div style={{ width:'100%', aspectRatio:'3/4', borderRadius:8, overflow:'hidden', marginBottom:12 }}>
                                    <img src={theme.image} alt={theme.title} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .5s' }}
                                         onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'}
                                         onMouseLeave={e => e.currentTarget.style.transform='scale(1)'} />
                                </div>
                                <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:'#2C3E50' }}>{theme.title}</h3>
                                <p style={{ margin:0, color:'#95A5A6', fontSize:12, fontWeight:500, marginTop:4 }}>{theme.subtitle}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Quick Nav ────────────────────────────────────────────── */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-16">
                {[
                    { icon:'travel_explore', label:'Browse All Tours',   sub:'500+ worldwide adventures', to:'/tours',      bg:'#006D77' },
                    { icon:'smart_toy',      label:'Bharat Bot AI',        sub:'AI-powered trip matching',  to:'/wanderbot',  bg:'#7b2d8b' },
                    { icon:'card_giftcard',  label:'Gift Cards',          sub:'Give the gift of travel',   to:'/gift-cards', bg:'#457b9d' },
                ].map(card => (
                    <Link key={card.to} to={card.to} style={{ textDecoration:'none' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:18, padding:'22px 24px', borderRadius:16, background:card.bg, color:'#fff', cursor:'pointer', transition:'opacity .15s' }}
                             onMouseEnter={e => e.currentTarget.style.opacity='0.88'}
                             onMouseLeave={e => e.currentTarget.style.opacity='1'}>
                            <span className="material-symbols-outlined" style={{ fontSize:40, opacity:0.9 }}>{card.icon}</span>
                            <div style={{ flex:1 }}>
                                <div style={{ fontWeight:900, fontSize:17 }}>{card.label}</div>
                                <div style={{ color:'rgba(255,255,255,0.75)', fontSize:13, marginTop:2 }}>{card.sub}</div>
                            </div>
                            <span className="material-symbols-outlined" style={{ fontSize:22, opacity:0.8 }}>arrow_forward</span>
                        </div>
                    </Link>
                ))}
            </section>

        </div>
    );
};

export default BeautifulIndiaHome;
