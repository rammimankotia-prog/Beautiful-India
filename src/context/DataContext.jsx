import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

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
            const toursRes = await fetch(`${import.meta.env.BASE_URL}data/tours.json${cacheBust}`);
            if (toursRes.ok) {
                const toursData = await toursRes.json();
                const validTours = Array.isArray(toursData) ? toursData.filter(Boolean) : [];
                setTours(validTours);
                localStorage.setItem('beautifulindia_cache_tours', JSON.stringify(validTours));
            } else {
                // Fallback to localStorage if fetch fails
                const savedTours = localStorage.getItem('beautifulindia_cache_tours');
                if (savedTours) setTours(JSON.parse(savedTours));
            }

            // Fetch Reviews
            const reviewsRes = await fetch(`${import.meta.env.BASE_URL}data/reviews.json${cacheBust}`);
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
            const savedTours = localStorage.getItem('beautifulindia_cache_tours');
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
