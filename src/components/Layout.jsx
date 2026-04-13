import React, { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from './Header';
import Footer from './Footer';
import AdSenseScript from './AdSenseScript';
import BharatBotFloatingButton from './BharatBotFloatingButton';
import WhatsAppFloatingButton from './WhatsAppFloatingButton';

const Layout = () => {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');

    // Breadcrumb logic
    const pathnames = location.pathname.split('/').filter((x) => x);
    const itemListElement = [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://bhaktikishakti.com"
        }
    ];

    pathnames.forEach((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const currentUrl = `https://bhaktikishakti.com${routeTo}`;
        
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
            {!isAdminPage && <BharatBotFloatingButton />}
            {!isAdminPage && <WhatsAppFloatingButton />}
        </div>
    );
};

export default Layout;
