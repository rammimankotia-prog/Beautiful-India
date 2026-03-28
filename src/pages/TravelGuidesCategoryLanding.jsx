
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Auto-generated from: travel_guides_category_landing/code.html
 * Group: content | Path: /guides
 */
const TravelGuidesCategoryLanding = () => {
  const [guides, setGuides] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Fetch Master List from Server with cache-busting
    fetch(`${import.meta.env.BASE_URL}data/guides.json?t=${Date.now()}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
      .then(res => res.json())
      .then(data => {
        setGuides(data);
        setIsLoaded(true);
      })
      .catch(err => {
        console.error("Error fetching guides:", err);
        setIsLoaded(true);
      });
  }, []);


  const filters = [
    { id: 'all', label: 'All Guides', icon: 'public' },
    { id: 'destination', label: 'Destinations', icon: 'location_on' },
    { id: 'tip', label: 'Tips & Hacks', icon: 'tips_and_updates' },
  ];

  const filteredGuides = guides.filter(g => {
    const isPublished = g.status !== 'draft';
    const matchesFilter = activeFilter === 'all' || g.type === activeFilter;
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.description.toLowerCase().includes(searchQuery.toLowerCase());
    return isPublished && matchesFilter && matchesSearch;
  });

  const destinationGuides = filteredGuides.filter(g => g.type === 'destination');
  const tipGuides = filteredGuides.filter(g => g.type === 'tip');
  const journalGuides = filteredGuides.filter(g => g.type === 'blog' || !g.type);

  const trendingTags = [
    { label: 'Adventure', icon: '🏔️' },
    { label: 'Honeymoon', icon: '💑' },
    { label: 'Budget Travel', icon: '💰' },
    { label: 'Gastronomy', icon: '🍜' },
    { label: 'Europe', icon: '🏰' },
    { label: 'Photography', icon: '📷' },
    { label: 'Backpacking', icon: '🎒' },
    { label: 'Beaches', icon: '🏖️' },
  ];

  return (
    <div data-page="travel_guides_category_landing" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        .guides-hero {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 3rem;
          min-height: 420px;
          display: flex;
          align-items: center;
        }
        .guides-hero-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .guides-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(10,10,40,0.85) 0%, rgba(75,0,130,0.55) 50%, rgba(0,100,200,0.4) 100%);
          z-index: 1;
        }
        .guides-hero-particles {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          overflow: hidden;
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          animation: float-particle linear infinite;
        }
        @keyframes float-particle {
          0% { transform: translateY(100%) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-120%) scale(1.5); opacity: 0; }
        }
        .guides-hero-content {
          position: relative;
          z-index: 10;
          padding: 3.5rem 3rem;
          width: 100%;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff;
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }
        .hero-title {
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 900;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }
        .hero-title span {
          background: linear-gradient(90deg, #a78bfa, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          color: rgba(255,255,255,0.8);
          font-size: 1.05rem;
          margin-bottom: 2rem;
          max-width: 520px;
          line-height: 1.7;
          font-weight: 400;
        }
        .hero-search-bar {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.97);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.2);
          padding: 6px 6px 6px 16px;
          max-width: 560px;
          gap: 10px;
        }
        .hero-search-icon {
          color: #7c3aed;
          font-size: 22px !important;
        }
        .hero-search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.95rem;
          color: #1e293b;
          font-family: inherit;
        }
        .hero-search-input::placeholder {
          color: #94a3b8;
        }
        .hero-search-btn {
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          color: #fff;
          border: none;
          padding: 12px 26px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .hero-search-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(124,58,237,0.4);
        }
        .hero-stats {
          display: flex;
          gap: 2rem;
          margin-top: 2rem;
        }
        .hero-stat {
          display: flex;
          flex-direction: column;
        }
        .hero-stat-num {
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          line-height: 1;
        }
        .hero-stat-label {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.6);
          margin-top: 2px;
        }

        /* Filter Pills */
        .filter-pills {
          display: flex;
          gap: 10px;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }
        .filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border-radius: 100px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.25s ease;
          font-family: inherit;
          background: #f1f5f9;
          color: #64748b;
        }
        .dark .filter-pill {
          background: rgba(255,255,255,0.05);
          color: #94a3b8;
        }
        .filter-pill:hover {
          background: rgba(124,58,237,0.08);
          color: #7c3aed;
          border-color: rgba(124,58,237,0.25);
        }
        .filter-pill.active {
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(124,58,237,0.35);
        }

        /* Section Header */
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.75rem;
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.4rem;
          font-weight: 800;
          color: #0f172a;
        }
        .dark .section-title { color: #f1f5f9; }
        .section-title-bar {
          width: 4px;
          height: 28px;
          border-radius: 4px;
          background: linear-gradient(to bottom, #7c3aed, #3b82f6);
        }
        .view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #7c3aed;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px;
          background: rgba(124,58,237,0.08);
          transition: all 0.2s;
        }
        .view-all-link:hover {
          background: rgba(124,58,237,0.15);
          gap: 8px;
        }

        /* Destination Cards */
        .destination-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 3.5rem;
        }
        .dest-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.07);
          border: 1px solid rgba(0,0,0,0.05);
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
          text-decoration: none;
          color: inherit;
          display: block;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.5s forwards;
        }
        .dark .dest-card {
          background: rgba(15,23,42,0.7);
          border-color: rgba(255,255,255,0.07);
        }
        .dest-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 20px 50px rgba(124,58,237,0.18), 0 8px 20px rgba(0,0,0,0.12);
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .dest-card-img-wrap {
          position: relative;
          height: 220px;
          overflow: hidden;
        }
        .dest-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
        }
        .dest-card:hover .dest-card-img { transform: scale(1.08); }
        .dest-card-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(8px);
          color: #7c3aed;
          border-radius: 100px;
          padding: 5px 13px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          box-shadow: 0 4px 14px rgba(0,0,0,0.12);
        }
        .dest-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%);
        }
        .dest-card-body {
          padding: 20px 22px 22px;
        }
        .dest-card-title {
          font-size: 1.1rem;
          font-weight: 800;
          margin-bottom: 8px;
          color: #0f172a;
          line-height: 1.35;
          transition: color 0.2s;
        }
        .dark .dest-card-title { color: #f1f5f9; }
        .dest-card:hover .dest-card-title { color: #7c3aed; }
        .dest-card-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #94a3b8;
          font-size: 12px;
          margin-bottom: 12px;
        }
        .dest-card-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .dest-card-desc {
          font-size: 0.88rem;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 18px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .dark .dest-card-desc { color: #94a3b8; }
        .dest-card-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(124,58,237,0.08), rgba(59,130,246,0.08));
          color: #7c3aed;
          font-weight: 700;
          font-size: 0.88rem;
          transition: all 0.25s;
          border: 1.5px solid rgba(124,58,237,0.15);
        }
        .dest-card:hover .dest-card-cta {
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 6px 18px rgba(124,58,237,0.3);
        }

        /* Tip Cards */
        .tips-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 3.5rem; }
        .tip-card {
          display: flex;
          gap: 20px;
          align-items: center;
          background: #fff;
          border-radius: 18px;
          padding: 18px;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 4px 16px rgba(0,0,0,0.05);
          text-decoration: none;
          color: inherit;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          opacity: 0;
          transform: translateX(-15px);
          animation: fadeRight 0.5s forwards;
        }
        .dark .tip-card {
          background: rgba(15,23,42,0.7);
          border-color: rgba(255,255,255,0.07);
        }
        @keyframes fadeRight {
          to { opacity: 1; transform: translateX(0); }
        }
        .tip-card:hover {
          transform: translateX(4px);
          box-shadow: 0 10px 30px rgba(124,58,237,0.14);
          border-color: rgba(124,58,237,0.2);
        }
        .tip-card-img-wrap {
          width: 130px;
          height: 90px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .tip-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .tip-card:hover .tip-card-img { transform: scale(1.1); }
        .tip-card-body { flex: 1; }
        .tip-card-title {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 6px;
          color: #0f172a;
          transition: color 0.2s;
          line-height: 1.35;
        }
        .dark .tip-card-title { color: #f1f5f9; }
        .tip-card:hover .tip-card-title { color: #7c3aed; }
        .tip-card-desc {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.55;
        }
        .dark .tip-card-desc { color: #94a3b8; }
        .tip-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .tip-read-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11.5px;
          color: #94a3b8;
        }
        .tip-read-more {
          font-size: 0.82rem;
          font-weight: 700;
          color: #7c3aed;
          display: flex;
          align-items: center;
          gap: 3px;
          transition: gap 0.2s;
        }
        .tip-card:hover .tip-read-more { gap: 7px; }

        /* Sidebar */
        .sidebar-widget {
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .sidebar-widget-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
        }
        .dark .sidebar-widget-header { color: #f1f5f9; }
        .sidebar-widget-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 18px !important;
        }

        /* Featured Tour Card */
        .featured-tour-card {
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 16px;
          text-decoration: none;
          color: inherit;
          display: block;
          transition: transform 0.3s;
        }
        .featured-tour-card:hover { transform: translateY(-3px); }
        .featured-tour-img-wrap {
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
          border-radius: 14px;
          margin-bottom: 12px;
        }
        .featured-tour-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .featured-tour-card:hover .featured-tour-img { transform: scale(1.06); }
        .tour-label {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .featured-tour-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
          transition: color 0.2s;
          line-height: 1.35;
        }
        .dark .featured-tour-title { color: #f1f5f9; }
        .featured-tour-card:hover .featured-tour-title { color: #7c3aed; }
        .featured-tour-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .featured-tour-info { font-size: 11.5px; color: #94a3b8; }
        .featured-tour-price { font-size: 1rem; font-weight: 800; color: #7c3aed; }
        .tour-divider { height: 1px; background: rgba(0,0,0,0.06); margin: 16px 0; }
        .dark .tour-divider { background: rgba(255,255,255,0.06); }

        /* Tags */
        .tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 14px;
          background: #f1f5f9;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: 1.5px solid transparent;
          color: #475569;
        }
        .dark .tag { background: rgba(255,255,255,0.06); color: #94a3b8; }
        .tag:hover {
          background: rgba(124,58,237,0.08);
          color: #7c3aed;
          border-color: rgba(124,58,237,0.25);
          transform: translateY(-2px);
        }

        /* Newsletter */
        .newsletter-widget {
          background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
          border-radius: 20px;
          padding: 28px 24px;
          color: #fff;
          position: relative;
          overflow: hidden;
        }
        .newsletter-glow-1 {
          position: absolute;
          top: -40px; right: -40px;
          width: 150px; height: 150px;
          background: radial-gradient(circle, rgba(124,58,237,0.4), transparent 70%);
          border-radius: 50%;
        }
        .newsletter-glow-2 {
          position: absolute;
          bottom: -30px; left: -30px;
          width: 120px; height: 120px;
          background: radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%);
          border-radius: 50%;
        }
        .newsletter-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          font-size: 22px !important;
        }
        .newsletter-title { font-size: 1.15rem; font-weight: 800; margin-bottom: 6px; }
        .newsletter-sub { font-size: 0.83rem; color: rgba(255,255,255,0.55); margin-bottom: 18px; line-height: 1.6; }
        .newsletter-input {
          width: 100%;
          background: rgba(255,255,255,0.08);
          border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 12px 16px;
          color: #fff;
          font-size: 0.88rem;
          font-family: inherit;
          margin-bottom: 10px;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s;
        }
        .newsletter-input::placeholder { color: rgba(255,255,255,0.35); }
        .newsletter-input:focus { border-color: rgba(124,58,237,0.6); }
        .newsletter-btn {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          color: #fff;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.25s;
          letter-spacing: 0.02em;
        }
        .newsletter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(124,58,237,0.45);
        }

        /* View More Tours btn */
        .view-tours-btn {
          width: 100%;
          margin-top: 20px;
          padding: 13px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          color: #fff;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.25s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .view-tours-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(124,58,237,0.4);
        }

        /* Empty state */
        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: #94a3b8;
        }
        .empty-state-icon { font-size: 48px !important; margin-bottom: 10px; opacity: 0.4; }

        @media (max-width: 768px) {
          .guides-hero-content { padding: 2.5rem 1.5rem; }
          .hero-title { font-size: 2rem; }
          .hero-stats { gap: 1.5rem; }
          .tip-card { flex-direction: column; }
          .tip-card-img-wrap { width: 100%; height: 160px; }
          .destination-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <main style={{ padding: '1.5rem 1rem 3rem', maxWidth: '1400px', margin: '0 auto' }}>

        {/* ── Hero Section ── */}
        <section className="guides-hero">
          <img
            className="guides-hero-bg"
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80"
            alt="Scenic mountain road"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80'; }}
          />
          <div className="guides-hero-overlay" />
          {/* Floating particles */}
          <div className="guides-hero-particles">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="particle" style={{
                width: `${6 + (i % 4) * 4}px`,
                height: `${6 + (i % 4) * 4}px`,
                left: `${(i * 8.3) % 100}%`,
                animationDuration: `${5 + (i % 5) * 2}s`,
                animationDelay: `${(i * 0.6) % 4}s`,
              }} />
            ))}
          </div>
          <div className="guides-hero-content">
            <div className="hero-badge">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>explore</span>
              The Beautiful India
            </div>
            <h1 className="hero-title">
              Ultimate<br /><span>Travel Guides</span>
            </h1>
            <p className="hero-subtitle">
              Expert insights, local secrets, and professional tips for your next unforgettable global adventure.
            </p>
            <div className="hero-search-bar">
              <span className="material-symbols-outlined hero-search-icon">search</span>
              <input
                className="hero-search-input"
                placeholder="Search destinations, tips, activities..."
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button className="hero-search-btn">Search</button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-num">150+</span>
                <span className="hero-stat-label">Destinations</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">500+</span>
                <span className="hero-stat-label">Expert Tips</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">98%</span>
                <span className="hero-stat-label">Satisfaction</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Filter Pills ── */}
        <div className="filter-pills">
          {filters.map(f => (
            <button
              key={f.id}
              className={`filter-pill ${activeFilter === f.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(f.id)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Layout: Main + Sidebar ── */}
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* ── Main Content ── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Travel Journal (New Section for Blogs) */}
            {(activeFilter === 'all' || activeFilter === 'blog') && journalGuides.length > 0 && (
              <section className="mb-14">
                <div className="section-header">
                  <h2 className="section-title">
                    <span className="section-title-bar" style={{ background: 'linear-gradient(to bottom, #ec4899, #8b5cf6)' }} />
                    Traveler's Journal
                  </h2>
                </div>
                <div className="destination-grid">
                  {journalGuides.map((guide, index) => (
                    <Link
                      to={`/guides/${guide.id}`}
                      key={guide.id}
                      className="dest-card border-none ring-1 ring-slate-200 dark:ring-white/10"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="dest-card-img-wrap">
                        <img className="dest-card-img" src={guide.image} alt={guide.title} />
                        <div className="dest-card-overlay" />
                        <span className="dest-card-badge" style={{ background: '#ec4899', color: '#fff' }}>Editorial</span>
                      </div>
                      <div className="dest-card-body">
                        <h3 className="dest-card-title">{guide.title}</h3>
                        <div className="dest-card-meta">
                          <span>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>history_edu</span>
                            Editorial
                          </span>
                          <span>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_today</span>
                            {guide.date}
                          </span>
                        </div>
                        <p className="dest-card-desc">{guide.description || guide.content?.substring(0, 100) + '...'}</p>
                        <div className="dest-card-cta">
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>menu_book</span>
                          Read Journal
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Popular Destinations */}
            {(activeFilter === 'all' || activeFilter === 'destination') && (
              <section>
                <div className="section-header">
                  <h2 className="section-title">
                    <span className="section-title-bar" />
                    Popular Destinations
                  </h2>
                  <a href="#" className="view-all-link">
                    View All
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                  </a>
                </div>
                <div className="destination-grid">
                  {destinationGuides.map((guide, index) => (
                    <Link
                      to={`/guides/${guide.id}`}
                      key={guide.id}
                      className="dest-card"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="dest-card-img-wrap">
                        <img className="dest-card-img" src={guide.image} alt={guide.title} />
                        <div className="dest-card-overlay" />
                        <span className="dest-card-badge">{guide.category}</span>
                      </div>
                      <div className="dest-card-body">
                        <h3 className="dest-card-title">{guide.title}</h3>
                        <div className="dest-card-meta">
                          <span>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
                            {guide.readTime}
                          </span>
                          <span>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_today</span>
                            {guide.date}
                          </span>
                        </div>
                        <p className="dest-card-desc">{guide.description}</p>
                        <div className="dest-card-cta">
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>menu_book</span>
                          Read Guide
                        </div>
                      </div>
                    </Link>
                  ))}
                  {destinationGuides.length === 0 && isLoaded && (
                    <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                      <span className="material-symbols-outlined empty-state-icon">location_off</span>
                      <p>No destination guides match your search.</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Travel Tips */}
            {(activeFilter === 'all' || activeFilter === 'tip') && (
              <section>
                <div className="section-header">
                  <h2 className="section-title">
                    <span className="section-title-bar" />
                    Travel Tips &amp; Hacks
                  </h2>
                </div>
                <div className="tips-list">
                  {tipGuides.map((tip, index) => (
                    <Link
                      to={`/guides/${tip.id}`}
                      key={tip.id}
                      className="tip-card"
                      style={{ animationDelay: `${index * 0.12}s` }}
                    >
                      <div className="tip-card-img-wrap">
                        <img className="tip-card-img" src={tip.image} alt={tip.title} />
                      </div>
                      <div className="tip-card-body">
                        <h3 className="tip-card-title">{tip.title}</h3>
                        <p className="tip-card-desc">{tip.description}</p>
                        <div className="tip-card-footer">
                          <span className="tip-read-time">
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>timer</span>
                            {tip.readTime}
                          </span>
                          <span className="tip-read-more">
                            Read More
                            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>arrow_forward</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {tipGuides.length === 0 && isLoaded && (
                    <div className="empty-state">
                      <span className="material-symbols-outlined empty-state-icon">lightbulb_off</span>
                      <p>No tips match your current filter.</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside style={{ width: '100%', maxWidth: '320px', flexShrink: 0 }}>

            {/* Curated Tours Widget */}
            <div className="sidebar-widget" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.04), rgba(59,130,246,0.04))', border: '1.5px solid rgba(124,58,237,0.12)' }}>
              <div className="sidebar-widget-header">
                <span className="material-symbols-outlined sidebar-widget-icon">auto_awesome</span>
                Curated Tours for You
              </div>

              <Link to="/tour/golden-triangle-delhi-agra-jaipur" className="featured-tour-card">
                <div className="featured-tour-img-wrap">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGCFXThfsSoiPSdQX5-y98NOuiBEIH70C7PxkszGP8xEA6jtTg46KE2jIOqyEsodJiVJqFNbdNwqDd0T_oEtBuqMDJ3JFjUlVXpWGbsT4U_D_2BaVDwf3Rt3CySyF8eyvwo6iLaqXlICQq5T5F-1bhIiOgD7i1KZnKtxFwcCVEFG1P6Ou_lcK2sfiXbak6XEzw98y5aXKgBqMfpB0w3rrdapUkY7Cl463xw_fpXRxJw6S09wHlPn5IbdOCJbMjqW42VaKXA8Laakgm"
                    className="featured-tour-img"
                    alt="Tokyo tour"
                  />
                  <span className="tour-label">⭐ Top Rated</span>
                </div>
                <h4 className="featured-tour-title">Tokyo Neon Nights Adventure</h4>
                <div className="featured-tour-meta">
                  <span className="featured-tour-info">🗓 7 Days • Tokyo, Japan</span>
                  <span className="featured-tour-price">$1,299</span>
                </div>
              </Link>

              <div className="tour-divider" />

              <div className="featured-tour-card">
                <div className="featured-tour-img-wrap">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXyJ-GXJB9QBvVkb10N4fJSvc900W3zP5lh5Klg9DEz8QANmEaRIoL3Z2xzelgp-kepgotyfoQGuQ1XVRmqzgRDdoRD_amFh5_GFaYK5MyOVUMib4rZTaWqCRTgESYFLYO_xggUjrYQXaE9gmr_7bj0fe-8-iA7OKWLoT9195Z3oawk-ZdB4rb2TOog28NdrHyBj3vccbeL6vUuLsy4Fz6aibr9WCmM1JgfRlZC_UhXyOLSQQTI8c6kfi2WY47OEkWZKEFq1GH1IiL"
                    className="featured-tour-img"
                    alt="Swiss Alps tour"
                  />
                  <span className="tour-label">🏔 Trending</span>
                </div>
                <h4 className="featured-tour-title">Swiss Alp Panorama Rail Tour</h4>
                <div className="featured-tour-meta">
                  <span className="featured-tour-info">🗓 5 Days • Interlaken, Swiss</span>
                  <span className="featured-tour-price">$849</span>
                </div>
              </div>

              <Link to="/tours" className="view-tours-btn">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>map</span>
                View All Tours
              </Link>
            </div>

            {/* Trending Tags Widget */}
            <div className="sidebar-widget" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <div className="sidebar-widget-header">
                <span className="material-symbols-outlined sidebar-widget-icon">local_fire_department</span>
                Trending Tags
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {trendingTags.map(tag => (
                  <span key={tag.label} className="tag">
                    {tag.icon} {tag.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Newsletter Widget */}
            <div className="newsletter-widget">
              <div className="newsletter-glow-1" />
              <div className="newsletter-glow-2" />
              <div style={{ position: 'relative', zIndex: 10 }}>
                <span className="material-symbols-outlined newsletter-icon">mail</span>
                <h3 className="newsletter-title">Get Inspired Weekly</h3>
                <p className="newsletter-sub">
                  Travel hacks, secret destinations, and curated itineraries — straight to your inbox.
                </p>
                <input
                  className="newsletter-input"
                  placeholder="Enter your email address"
                  type="email"
                />
                <button className="newsletter-btn">✈ Join the Club</button>
              </div>
            </div>

          </aside>
        </div>
      </main>
    </div>
  );
};

export default TravelGuidesCategoryLanding;
