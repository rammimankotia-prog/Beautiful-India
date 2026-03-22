import React from 'react';
import { Link } from 'react-router-dom';

const BharatDarshanBanner = () => {
  return (
    <section style={{
      position: 'relative',
      width: 'calc(100% + 160px)',
      marginLeft: '-80px',
      minHeight: 520,
      background: 'linear-gradient(135deg, #f0fdf9 0%, #e6f7f5 55%, #fef9f0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      marginBottom: 80,
    }}>

      {/* Decorative background circles */}
      <div style={{ position: 'absolute', top: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(0,109,119,0.07)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: -80, right: -60, width: 340, height: 340, borderRadius: '50%', background: 'rgba(255,153,51,0.06)', zIndex: 0 }} />

      {/* Couple illustration — left */}
      <img
        src="/india_couple_hero.png"
        alt="Indian couple at Taj Mahal"
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: '105%',
          width: 'auto',
          objectFit: 'contain',
          objectPosition: 'bottom left',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Family illustration — right */}
      <img
        src="/india_family_hero.png"
        alt="Indian family at temple"
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          height: '100%',
          width: 'auto',
          objectFit: 'contain',
          objectPosition: 'bottom right',
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
        padding: '70px 32px 110px',
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
          fontSize: 50,
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
          marginBottom: 12,
        }}>
          <span className="material-symbols-outlined" style={{ color: '#006D77', marginRight: 8, fontSize: 22 }}>location_on</span>
          <input
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, fontFamily: 'Montserrat,sans-serif', fontWeight: 600, color: '#2C3E50', background: 'transparent', padding: '10px 4px' }}
            placeholder="Type a destination..."
            type="text"
          />
          <Link to="/tours">
            <button
              style={{ background: '#006D77', color: '#fff', border: 'none', borderRadius: 50, padding: '13px 30px', fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}
              onMouseEnter={e => e.currentTarget.style.background = '#004d55'}
              onMouseLeave={e => e.currentTarget.style.background = '#006D77'}
            >Explore</button>
          </Link>
        </div>

        <p style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>
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
        {[['2,500+', 'Packages'], ['50+', 'Destinations'], ['1 Lakh+', 'Happy Travelers'], ['100%', 'Customizable']].map(([n, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ color: '#006D77', fontWeight: 900, fontSize: 20 }}>{n}</div>
            <div style={{ color: '#5a7a7d', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{l}</div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default BharatDarshanBanner;
