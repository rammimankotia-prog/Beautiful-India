import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AntiGravityWrapper from './AntiGravityWrapper';
import TripPlannerWidget from './TripPlannerWidget';

const Layout = () => {
    return (
        <AntiGravityWrapper>
            <div className="flex flex-col min-h-screen">
                <div className="float-element">
                    <Header />
                </div>
                <main className="flex-1">
                    <Outlet />
                </main>
                <div className="float-element">
                    <Footer />
                </div>
                {/* Floating Chat Widget */}
                <TripPlannerWidget />
            </div>
        </AntiGravityWrapper>
    );
};

export default Layout;
