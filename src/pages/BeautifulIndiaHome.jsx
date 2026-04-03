import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useCurrency } from '../context/CurrencyContext';
import { Helmet } from 'react-helmet-async';

const BeautifulIndiaHome = () => {
    const { tours, themes, topDestinations, loading: dataLoading } = useData();
    const { formatPrice } = useCurrency();
    
    const displayedTours = tours
        .filter(tour => (tour.status === 'active' || tour.status === undefined) && tour.isFeatured)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

    // Skeleton Components for reduced Layout Shift (CLS)
    const TourSkeleton = () => (
        <div className="animate-pulse bg-white rounded-2xl overflow-hidden h-[420px] border border-slate-100">
            <div className="bg-slate-200 h-[220px] w-full" />
            <div className="p-5 space-y-4">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-6 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="pt-4 flex justify-between">
                    <div className="h-10 bg-slate-200 rounded w-1/2" />
                    <div className="h-10 bg-slate-200 rounded-full w-10" />
                </div>
            </div>
        </div>
    );

    const ThemeSkeleton = () => (
        <div className="animate-pulse flex flex-col gap-3">
            <div className="aspect-[3/4] bg-slate-200 rounded-lg w-full" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="h-3 bg-slate-200 rounded w-1/3" />
        </div>
    );

    return (
        <div className="px-5 md:px-20 lg:px-32 xl:px-40">
            <Helmet>
                <title>The Beautiful India | Bharat Darshan</title>
<truncated 303 lines>
