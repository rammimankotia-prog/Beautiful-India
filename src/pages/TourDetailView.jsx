import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useData } from '../context/DataContext';
import { Helmet } from 'react-helmet-async';

// Helper: Normalize slugs for fuzzy matching
const fuzzySlug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const Thumb = ({ img, className = '', large = false, tourTitle = '', index = 0 }) => (
  <div className={`relative overflow-hidden rounded-2xl group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 ${className}`} style={{ background: '#f1f5f9' }}>
    <img
      src={(img?.url?.startsWith('/') ? (import.meta.env.BASE_URL + img.url.slice(1)) : img?.url) || ''}
      alt={img?.caption || tourTitle}
      fetchpriority={large && index === 0 ? "high" : "auto"}
      loading={large && index === 0 ? "eager" : "lazy"}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
    />
    <div className={`absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent transition-opacity duration-300 ${large ? 'opacity-80' : 'opacity-0 group-hover:opacity-100'}`} />
    {(img?.caption || tourTitle) && (
      <div className={`absolute bottom-0 left-0 right-0 px-4 py-3 transition-all duration-300 ${large ? '' : 'translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100'}`}>
        <p className="text-white text-sm font-semibold leading-snug drop-shadow">{img?.caption || tourTitle}</p>
      </div>
    )}
  </div>
);

const SERVICE_ICONS = {
<truncated 1845 lines>
