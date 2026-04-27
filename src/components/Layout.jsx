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
    const [settings, setSettings] = useState({ 
        chatbotEnabled: true, 
        whatsappEnabled: true,
        visibility: { chatbot: { all: true }, whatsapp: { all: true } }
    });

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/settings.json?t=${Date.now()}`)
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(() => {});
    }, []);

    const isVisible = (type) => {
        if (!settings) return true;
        const config = settings.visibility?.[type];
        if (!config) return true;
        if (config.all) return true;

        const path = location.pathname;
        if (path === '/' || path === import.meta.env.BASE_URL) return config.home;
        if (path.includes('/tour')) return config.tours;
        if (path.includes('/train')) return config.trains;
        if (path.includes('/guide') || path.includes('/blog')) return config.guides;
        
        return false;
    };

    const showChatbot = !isAdminPage && settings.chatbotEnabled !== false && isVisible('chatbot');
    const showWhatsapp = !isAdminPage && settings.whatsappEnabled !== false && isVisible('whatsapp');

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

    const businessSchema = {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": "The Beautiful India - Bharat Darshan",
        "url": "https://bhaktikishakti.com",
        "logo": "https://bhaktikishakti.com/beautiful_india_logo_1773142903437.png",
        "description": "Premium travel and tour operator in India providing curated experiences for Himachal, Kashmir, Rajasthan, and more.",
        "telephone": "+916005159433",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Main Market",
            "addressLocality": "Dharamshala",
            "addressRegion": "Himachal Pradesh",
            "postalCode": "176215",
            "addressCountry": "IN"
        },
        "sameAs": [
            "https://www.facebook.com/honeymoon.package/",
            "https://www.facebook.com/TouristDestinationsofIndia",
            "https://www.plurk.com/HolidayDestinations",
            "https://www.reddit.com/r/holidaydestination/",
            "https://www.instagram.com/holidaydestinations9/"
        ]
    };

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
                    <script type="application/ld+json">
                        {JSON.stringify(businessSchema)}
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
            {!isAdminPage && (
                <div className="float-element">
                    <Footer />
                </div>
            )}
            {showChatbot && <BharatBotFloatingButton />}
            {showWhatsapp && <WhatsAppFloatingButton />}
        </div>
    );
};

export default Layout;
