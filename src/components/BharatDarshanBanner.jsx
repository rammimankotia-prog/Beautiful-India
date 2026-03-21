import React from 'react';
import { Link } from 'react-router-dom';

const BharatDarshanBanner = () => {
  return (
    <section className="bharat-darshan-banner" style={{
      position: 'relative',
      width: 'calc(100% + 160px)', // To break out of the 80px parent padding
      marginLeft: '-80px',
      aspectRatio: '1920/1080', // Approximate ratio for the image
      backgroundImage: 'url("/assets/images/bharat-darshan-hero.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      marginBottom: '80px',
      overflow: 'hidden'
    }}>
      {/* Invisible Overlay Link for "Discover India" button in the image */}
      <Link 
        to="/tours" 
        style={{ 
          position: 'absolute',
          bottom: '22%', 
          left: '50%',
          transform: 'translateX(-50%)',
          width: '240px', 
          height: '60px', 
          cursor: 'pointer',
          zIndex: 20
        }}
        aria-label="Discover India"
      />

      {/* Categories Overlay Links at the bottom of the image */}
      <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '10%', // Adjusting to the height of the bottom bar in image
          display: 'flex',
          zIndex: 20
      }}>
        {['Hills', 'Cities', 'Temples', 'Heritage', 'Beaches', 'Backwaters', 'Wildlife', 'Adventure'].map(cat => (
          <Link 
            key={cat} 
            to={`/tours?theme=${cat}`} 
            style={{ flex: 1, cursor: 'pointer' }}
            title={cat}
          />
        ))}
      </div>
    </section>
  );
};

export default BharatDarshanBanner;
