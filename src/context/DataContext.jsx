import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { safeCacheTours, STORAGE_KEYS } from '../utils/storage';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [tours, setTours] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (force = false) => {
        setLoading(true);
        try {
            // Use Cache-Busting only if forced
            const cacheBust = force ? `?t=${Date.now()}` : '';
            
            // Fetch Tours
            const baseUrl = import.meta.env.BASE_URL || '/';
            const toursUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}data/tours.json${cacheBust}`;
            const toursRes = await fetch(toursUrl);
            if (toursRes.ok) {
                const toursData = await toursRes.json();
                const validTours = Array.isArray(toursData) ? toursData.filter(Boolean) : [];
                setTours(validTours);
                safeCacheTours(STORAGE_KEYS.TOURS, validTours);
            } else {
                // Fallback to localStorage if fetch fails
                const savedTours = localStorage.getItem(STORAGE_KEYS.TOURS);
                if (savedTours) setTours(JSON.parse(savedTours));
            }

            // Fetch Reviews
            const reviewsUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}data/reviews.json${cacheBust}`;
            const reviewsRes = await fetch(reviewsUrl);
            if (reviewsRes.ok) {
                const reviewsData = await reviewsRes.json();
                setReviews(Array.isArray(reviewsData) ? reviewsData : []);
                localStorage.setItem('beautifulindia_cache_reviews', JSON.stringify(reviewsData));
            } else {
                const savedReviews = localStorage.getItem('beautifulindia_cache_reviews');
                if (savedReviews) setReviews(JSON.parse(savedReviews));
            }

            setError(null);
        } catch (err) {
            console.error("DataContext Fetch Error:", err);
            setError("Failed to load data. Please refresh.");
            
            // Final fallback to localStorage
            const savedTours = localStorage.getItem(STORAGE_KEYS.TOURS);
            const savedReviews = localStorage.getItem('beautifulindia_cache_reviews');
            if (savedTours) setTours(JSON.parse(savedTours));
            if (savedReviews) setReviews(JSON.parse(savedReviews));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refreshData = () => fetchData(true);

    return (
        <DataContext.Provider value={{ tours, reviews, loading, error, refreshData, setTours }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
