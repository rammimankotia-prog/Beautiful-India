import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { Helmet } from 'react-helmet-async';
import BharatDarshanBanner from '../components/BharatDarshanBanner';

const BeautifulIndiaHome = () => {
    const { formatPrice } = useCurrency();
    const [tours, setTours] = useState([]);
    const [themes, setThemes] = useState([]);

    useEffect(() => {
        const fetchTours = async () => {
          try {
            let allToursList = [];
            const saved = localStorage.getItem('beautifulindia_admin_tours');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed)) allToursList = parsed.filter(Boolean);
                } catch(e) {}
            }
            if (allToursList.length === 0) {
                const res = await fetch(`${import.meta.env.BASE_URL}data/tours.json?t=${Date.now()}`);
                if (!res.ok) throw new Error('Failed to fetch tours');
                allToursList = await res.json();
                
                // If local storage was empty, but server has data, save it to local storage to keep them in sync
                if (allToursList && Array.isArray(allToursList) && allToursList.length > 0) {
                    localStorage.setItem('beautifulindia_admin_tours', JSON.stringify(allToursList));
                }
            }
            setTours(allToursList.filter(t => t.status !== 'paused' && t.status !== 'draft'));
          } catch (err) {
            setTours([
                { id:'1', title:'Kashmir Great Lakes Trek',       duration:'7 Days',  rating:4.9, price:1299, image:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80', description:'Experience the breathtaking beauty of the Himalayas on a guided trekking adventure.' },
                { id:'2', title:'Varkala Wellness Retreat', duration:'5 Days',  rating:4.8, price:899,  image:'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', description:'Rejuvenate your mind, body, and soul on the golden cliffs of Kerala.' },
                { id:'3', title:'Spiti Valley Expedition',  duration:'10 Days', rating:4.7, price:2499, image:'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80', description:'Journey to the cold desert and witness spectacular monasteries and landscapes.' },
                { id:'4', title:'Andaman Islands Getaway',     duration:'6 Days',  rating:4.9, price:1499, image:'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80', description:'Relax on pristine beaches overlooking the emerald waters of the Bay of Bengal.' },
            ]);
          }
        };
        fetchTours();

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
        <div style={{ padding:'0 80px' }}>
            <Helmet>
                <title>The Beautiful India - Bharat Darshan | Explore India's Wonders</title>
                <meta name="description" content="Explore the incredible beauty of India with Bharat Darshan. Curated tour packages for Himachal, Kashmir, Rajasthan, Kerala, and more." />
                <meta property="og:title" content="The Beautiful India - Bharat Darshan" />
                <meta property="og:description" content="Discover India's beauty with Bharat Darshan. Curated tour packages for all major destinations." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://bhaktikishakti.com/" />
                <meta property="og:image" content="/beautiful_india_logo_1773142903437.png" />
            </Helmet>

            {/* ── Hero (TravelTriangle-style) ──────────────────────────── */}
            <div className="hero-banner" style={{
                position: 'relative',
                minHeight: 500,
                borderRadius: 20,
                overflow: 'hidden',
                marginBottom: 56,
                background: 'linear-gradient(135deg, #f0fdf9 0%, #e6f7f5 50%, #fef9f0 100%)',
                boxShadow: '0 8px 40px rgba(0,109,119,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {/* Couple illustration — left */}
                <img
                    src={`${import.meta.env.BASE_URL}india_couple_hero.png`}
                    alt="Indian couple at Taj Mahal"
                    style={{
                        position: 'absolute',
                        left: -20,
                        bottom: 0,
                        height: '102%',
                        width: 'auto',
                        objectFit: 'contain',
                        objectPosition: 'bottom',
                        zIndex: 1,
                        pointerEvents: 'none',
                    }}
                />

                {/* Family illustration — right */}
                <img
                    src={`${import.meta.env.BASE_URL}india_family_hero.png`}
                    alt="Indian family at temple"
                    style={{
                        position: 'absolute',
                        right: -20,
                        bottom: 0,
                        height: '100%',
                        width: 'auto',
                        objectFit: 'contain',
                        objectPosition: 'bottom',
                        zIndex: 1,
                        pointerEvents: 'none',
                    }}
                />

                {/* Centre content */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    maxWidth: 620,
                    padding: '60px 24px 100px',
                }}>
                    {/* Brand pill */}
                    <span style={{
                        display: 'inline-block',
                        background: 'rgba(0,109,119,0.1)',
                        color: '#006D77',
                        fontWeight: 800,
                        fontSize: 11,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        borderRadius: 50,
                        padding: '5px 16px',
                        marginBottom: 20,
                        border: '1px solid rgba(0,109,119,0.2)',
                    }}>IN BHARAT DARSHAN</span>

                    <h1 style={{
                        color: '#0b1a1c',
                        fontSize: 52,
                        fontWeight: 900,
                        lineHeight: 1.12,
                        margin: '0 0 16px',
                        fontFamily: 'Montserrat, sans-serif',
                    }}>
                        Customize &amp; Book<br />
                        <span style={{ color: '#006D77' }}>Amazing Holiday Packages</span>
                    </h1>

                    <p style={{
                        color: '#5a7a7d',
                        fontSize: 16,
                        fontWeight: 500,
                        margin: '0 0 32px',
                        lineHeight: 1.6,
                    }}>
                        From the mighty Himalayas to palm-fringed beaches — explore Bharat in all its glory with expertly curated packages.
                    </p>

                    {/* Search bar */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: '#fff',
                        borderRadius: 50,
                        padding: '7px 7px 7px 22px',
                        boxShadow: '0 8px 32px rgba(0,109,119,0.18)',
                        border: '1.5px solid rgba(0,109,119,0.12)',
                    }}>
                        <span className="material-symbols-outlined" style={{ color: '#006D77', marginRight: 8, fontSize: 22 }}>location_on</span>
                        <input
                            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, fontFamily: 'Montserrat,sans-serif', fontWeight: 600, color: '#2C3E50', background: 'transparent', padding: '10px 4px' }}
                            placeholder="Type a destination..."
                            type="text"
                        />
                        <Link to="/tours">
                            <button style={{ background: '#006D77', color: '#fff', border: 'none', borderRadius: 50, padding: '13px 30px', fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background .2s' }}
                                onMouseEnter={e => e.currentTarget.style.background='#004d55'}
                                onMouseLeave={e => e.currentTarget.style.background='#006D77'}
                            >Explore</button>
                        </Link>
                    </div>

                    <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 12 }}>
                        Destination not sure?{' '}
                        <Link to="/wanderbot" style={{ color: '#006D77', fontWeight: 700 }}>Ask Bharat Bot ↗</Link>
                    </p>
                </div>

                {/* Stats strip */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(0,109,119,0.07)',
                    backdropFilter: 'blur(4px)',
                    borderTop: '1px solid rgba(0,109,119,0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 60,
                    padding: '14px 0',
                    zIndex: 2,
                }}>
                    {[['2,500+','Packages'],['50+','Destinations'],['1 Lakh+','Happy Travelers'],['100%','Customizable']].map(([n,l]) => (
                        <div key={l} style={{ textAlign: 'center' }}>
                            <div style={{ color: '#006D77', fontWeight: 900, fontSize: 20 }}>{n}</div>
                            <div style={{ color: '#5a7a7d', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{l}</div>
                        </div>
                    ))}
                </div>
            </div>
            
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

                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24 }}>
                    {displayedTours.map(tour => {
                        const tourDestSegment = encodeURIComponent((tour.destination || 'global').toLowerCase().replace(/\s+/g, '-'));
                        const tourStateSegment = encodeURIComponent((tour.stateRegion || 'state').toLowerCase().replace(/\s+/g, '-'));
                        const tourSubSegment = encodeURIComponent((tour.subregion || 'subregion').toLowerCase().replace(/\s+/g, '-'));
                        const tourTitleSegment = encodeURIComponent((tour.title || 'tour').toLowerCase().replace(/\s+/g, '-'));
                        const detailUrl = `/tours/${tourDestSegment}/${tourStateSegment}/${tourSubSegment}/${tourTitleSegment}`;
                        
                        return (
                        <Link key={tour.id} to={detailUrl} style={{ textDecoration:'none', color:'inherit', display:'flex', flexDirection:'column', height:'100%' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background:'#fff', borderRadius:18, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.07)', border:'1.5px solid rgba(0,109,119,0.06)', transition:'box-shadow .2s' }}
                                 onMouseEnter={e => e.currentTarget.style.boxShadow='0 8px 30px rgba(0,109,119,0.18)'}
                                 onMouseLeave={e => e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.07)'}>
                                <div style={{ position:'relative', width:'100%', paddingTop:'75%', overflow:'hidden' }}>
                                    <div style={{ position:'absolute', inset:0, backgroundImage:`url(${tour.image})`, backgroundSize:'cover', backgroundPosition:'center', transition:'transform .4s' }}
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

                <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:16 }}>
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
            <section style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginBottom:60 }}>
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
