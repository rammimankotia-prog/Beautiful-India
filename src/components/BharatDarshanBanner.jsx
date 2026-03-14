import React from 'react';
import { Link } from 'react-router-dom';

const BharatDarshanBanner = () => {
  return (
    <section className="bharat-darshan-banner" style={{
      position: 'relative',
      width: '100%',
      minHeight: '520px',
      borderRadius: '24px',
      overflow: 'hidden',
      marginBottom: '80px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      textAlign: 'center',
      padding: '80px 24px',
      background: '#015a4b' // Fallback teal
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,900&display=swap');

        .bharat-darshan-banner .bg-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
        }
        .bharat-darshan-banner .overlay {
          position: absolute;
          inset: 0;
          /* Lower opacity to let video show through, and added a slight cyan tint */
          background: linear-gradient(135deg, rgba(1, 122, 91, 0.75) 0%, rgba(1, 70, 60, 0.85) 100%);
          z-index: 2;
        }
        
        /* Decorative blobs to match user's design */
        .bharat-darshan-banner .blob {
          position: absolute;
          background: rgba(255, 255, 255, 0.05);
          filter: blur(60px);
          border-radius: 50%;
          z-index: 3;
          pointer-events: none;
        }
        .bharat-darshan-banner .blob-1 { width: 400px; height: 400px; top: -100px; left: -100px; }
        .bharat-darshan-banner .blob-2 { width: 300px; height: 300px; bottom: -50px; right: -50px; }

        .bharat-darshan-banner .content {
          position: relative;
          z-index: 10;
          max-width: 900px;
        }
        .bharat-darshan-banner .badge {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .bharat-darshan-banner .title {
          font-family: 'Playfair Display', serif;
          font-size: 68px;
          font-weight: 900;
          margin: 0 0 20px;
          line-height: 1.1;
          letter-spacing: -2px;
          color: #fff;
        }
        .bharat-darshan-banner .description {
          font-size: 19px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 40px;
          max-width: 760px;
          margin-left: auto;
          margin-right: auto;
          font-weight: 500;
        }
        .bharat-darshan-banner .btn-group {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-bottom: 60px;
        }
        .bharat-darshan-banner .btn-primary {
          background: #fff;
          color: #017a5b;
          padding: 16px 40px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 16px;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        .bharat-darshan-banner .btn-primary:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.25);
        }
        .bharat-darshan-banner .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 16px 40px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 16px;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.5);
          transition: all 0.3s;
          backdrop-filter: blur(8px);
        }
        .bharat-darshan-banner .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: #fff;
        }
        .bharat-darshan-banner .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          border-top: 1px solid rgba(255,255,255,0.25);
          padding-top: 40px;
        }
        .bharat-darshan-banner .stat-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .bharat-darshan-banner .stat-value {
          font-size: 28px;
          font-weight: 900;
          color: #fff;
        }
        .bharat-darshan-banner .stat-label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        
        @media (max-width: 1024px) {
          .bharat-darshan-banner .stats-row { gap: 20px; }
          .bharat-darshan-banner .title { font-size: 52px; }
        }
        
        @media (max-width: 768px) {
          .bharat-darshan-banner { padding: 60px 20px; min-height: auto; }
          .bharat-darshan-banner .title { font-size: 40px; }
          .bharat-darshan-banner .stats-row { grid-template-columns: repeat(2, 1fr); gap: 24px; }
          .bharat-darshan-banner .btn-group { flex-direction: column; align-items: stretch; }
          .bharat-darshan-banner .description { font-size: 16px; }
        }
      `}</style>

      {/* Background Video */}
      <video 
        className="bg-video"
        autoPlay 
        muted 
        loop 
        playsInline
        poster="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80"
      >
        {/* Using a highly reliable Pexels India video */}
        <source src="https://player.vimeo.com/external/494294683.hd.mp4?s=d0387431e6c38b80058b8d00511855a805f778d0&profile_id=174" type="video/mp4" />
      </video>
      
      {/* Teal Overlay */}
      <div className="overlay" />
      
      {/* Decorative Blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      {/* Content */}
      <div className="content">
        <div className="badge">IN BHARAT DARSHAN</div>
        <h2 className="title">Discover the Soul of India</h2>
        <p className="description">
          From the mighty Himalayas to palm-fringed beaches, from royal palaces to serene backwaters – 
          explore Bharat in all its glory with expertly curated packages tailored just for you.
        </p>

        <div className="btn-group">
          <Link to="/tours" className="btn-primary">Explore Destinations</Link>
          <Link to="/contact" className="btn-secondary">Get Free Quote</Link>
        </div>

        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-value">2,500+</span>
            <span className="stat-label">Packages</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">50+</span>
            <span className="stat-label">Destinations</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">1 Lakh+</span>
            <span className="stat-label">Happy Travelers</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">100%</span>
            <span className="stat-label">Customizable</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BharatDarshanBanner;
