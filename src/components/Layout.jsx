import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import TripPlannerWidget from './TripPlannerWidget';
import AdSenseScript from './AdSenseScript';

const Layout = () => {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');

    return (
        <div className="flex flex-col min-h-screen">
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
