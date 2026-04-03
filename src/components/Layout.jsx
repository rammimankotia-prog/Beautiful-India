import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from './Header';
import Footer from './Footer';
import TripPlannerWidget from './TripPlannerWidget';
import AdSenseScript from './AdSenseScript';

const Layout = () => {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');

    const pathSegments = location.pathname.split('/').filter(p => p !== '');
    const itemListElement = [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://bhaktikishakti.com"
        }
    ];

    let currentUrl = "https://bhaktikishakti.com";
    pathSegments.forEach((segment, index) => {
        currentUrl += `/${segment}`;
        const name = segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        itemListElement.push({
            "@type": "ListItem",
            "position": index + 2,
            "name": name,
            "item": currentUrl
        });
    });

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": itemListElement
    };

    const canonicalUrl = `https://bhaktikishakti.com${location.pathname.replace(/\/$/, '') || '/'}`;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 relative selection:bg-rose-100 selection:text-rose-900">
            {!isAdminPage && (
                <Helmet>
                    <link rel="canonical" href={canonicalUrl} />
                    <script type="application/ld+json">
                        {JSON.stringify(breadcrumbSchema)}
                    </script>
                </Helmet>
            )}
            <div className="float-element">
                <Header />
                {!isAdminPage && <AdSenseScript />}
            </div>
            <main className="flex-1">
                <Outlet />
            </main>
            <div className="float-element">
                <Footer />
            </div>
            {/* Floating Chat Widget - only on non-admin pages */}
            {!isAdminPage && <TripPlannerWidget />}
        </div>
    );
};

export default Layout;
