import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const [isSearchesOpen, setIsSearchesOpen] = useState(false);

    const topLinks = [
        { label: "About Us", path: "#!" }, 
        { label: "Team", path: "#!" }, 
        { label: "We are hiring!", path: "#!" }, 
        { label: "Testimonial", path: "#!" }, 
        { label: "Blog", path: "/guides" }, 
        { label: "Hindi Blog", path: "#!" }, 
        { label: "Terms and Conditions", path: "/terms" }, 
        { label: "Privacy Policy", path: "/privacy" },
        { label: "Travel Agent? Join Us", path: "#!" }, 
        { label: "FAQ", path: "#!" }, 
        { label: "Contact Us", path: "/contact" }
    ];

    const international = ["Thailand", "Singapore", "Malaysia", "Nepal", "Sri Lanka", "Europe", "Mauritius", "Maldives", "Egypt", "Africa", "Australia"];
    const domestic = ["Kerala", "Ladakh", "Goa", "Rajasthan", "Kashmir", "Andaman", "Andhra Pradesh", "Bihar", "Gujarat", "Himachal", "Karnataka"];
    const domPackages = ["1 to 3 Days Honeymoon Packages", "4 to 6 Days Honeymoon Packages", "7 to 9 Days Honeymoon Packages", "10 to 12 Days Honeymoon Packages"];
    const intPackages = ["1 to 3 Days Honeymoon Packages", "4 to 6 Days Honeymoon Packages", "7 to 9 Days Honeymoon Packages", "10 to 12 Days Honeymoon Packages"];
    const blogs = Array.from({length: 20}, (_, i) => (i + 1).toString());

    return (
        <footer className="bg-[#2c3238] font-sans text-white border-t-4 border-red-600 mt-auto">
            {/* Top Expandable Section */}
            <div 
                className="py-4 border-b border-[#3c4248] cursor-pointer hover:bg-[#343a40] transition-colors"
                onClick={() => setIsSearchesOpen(!isSearchesOpen)}
            >
                <div className="container mx-auto px-4 flex justify-center items-center">
                    <span className="text-sm font-bold tracking-wide">
                        Popular Travel Searches {isSearchesOpen ? '-' : '+'}
                    </span>
                </div>
            </div>

            {/* Expanded Content (Simulated for this implementation) */}
            <div className={`transition-all duration-300 overflow-hidden ${isSearchesOpen ? 'max-h-40' : 'max-h-0'}`}>
                <div className="container mx-auto px-4 py-4 text-xs text-gray-400 text-center">
                    Popular travel searches and trending destinations would appear here.
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-10 py-10 max-w-7xl">
                {/* Top Links & Contact */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-200 w-full lg:w-2/3">
                        {topLinks.slice(0, 8).map((link, i) => (
                            <Link key={i} to={link.path} className="hover:text-white transition-colors">{link.label}</Link>
                        ))}
                        <div className="w-full h-0 mb-1"></div>
                        {topLinks.slice(8).map((link, i) => (
                            <Link key={i} to={link.path} className="hover:text-white transition-colors">{link.label}</Link>
                        ))}
                    </div>
                    
                    <div className="flex flex-col gap-2 w-full lg:w-1/3 lg:items-end text-sm">
                        <div className="flex items-center gap-2 font-bold justify-end w-full">
                            <span className="material-symbols-outlined text-[18px]">call</span>
                            <span>0000 0000 00</span>
                        </div>
                        <div className="flex items-center gap-2 justify-end w-full">
                            <span className="material-symbols-outlined text-[18px]">mail</span>
                            <span className="text-gray-200">customercare@beautifulindia.com</span>
                        </div>
                    </div>
                </div>

                {/* Footer Links Matrix */}
                <div className="flex flex-col space-y-4">
                    {/* Domestic */}
                    <div className="flex flex-wrap items-center gap-3 text-xs bg-[#343a40] p-3 rounded-md shadow-sm">
                        <span className="font-bold text-white min-w-[140px]">Domestic</span>
                        {domestic.map((dest, i) => (
                            <React.Fragment key={i}>
                                <Link to="#!" className="text-gray-300 hover:text-white whitespace-nowrap">{dest}</Link>
                                {i < domestic.length - 1 && <span className="text-gray-600">|</span>}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Domestic Packages */}
                    <div className="flex flex-wrap items-center gap-3 text-xs bg-[#343a40] p-3 rounded-md shadow-sm">
                        <span className="font-bold text-white min-w-[140px]">Domestic Packages</span>
                        {domPackages.map((pkg, i) => (
                            <React.Fragment key={i}>
                                <Link to="#!" className="text-gray-300 hover:text-white whitespace-nowrap">{pkg}</Link>
                                {i < domPackages.length - 1 && <span className="text-gray-600">|</span>}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* International Packages */}
                    <div className="flex flex-wrap items-center gap-3 text-xs bg-[#343a40] p-3 rounded-md shadow-sm">
                        <span className="font-bold text-white min-w-[140px]">International Packages</span>
                        {intPackages.map((pkg, i) => (
                            <React.Fragment key={i}>
                                <Link to="#!" className="text-gray-300 hover:text-white whitespace-nowrap">{pkg}</Link>
                                {i < intPackages.length - 1 && <span className="text-gray-600">|</span>}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Blogs */}
                    <div className="flex flex-wrap items-center gap-3 text-xs bg-[#343a40] p-3 rounded-md shadow-sm">
                        <span className="font-bold text-white min-w-[140px]">Explore Travel Blogs</span>
                        {blogs.map((num, i) => (
                            <React.Fragment key={i}>
                                <Link to="#!" className="text-gray-300 hover:text-white whitespace-nowrap">{num}</Link>
                                {i < blogs.length - 1 && <span className="text-gray-600">|</span>}
                            </React.Fragment>
                        ))}
                    </div>

                </div>
                
                {/* Logo, Copyright & Sitemap */}
                <div className="mt-12 pt-6 border-t border-[#3c4248] flex flex-col md:flex-row items-center justify-between gap-6">
                   <Link to="/" className="flex items-center gap-2 text-white">
                        <img src="/beautiful_india_logo_1773142903437.png" alt="The Beautiful India" className="h-10 w-auto object-contain brightness-0 invert" />
                   </Link>
                   <div className="flex items-center gap-4">
                     <Link
                       to="/nav"
                       className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-xs font-semibold border border-gray-600 hover:border-gray-400 px-3 py-1.5 rounded-lg"
                     >
                       <span className="material-symbols-outlined text-[14px]">map</span>
                       Sitemap
                     </Link>
                     <p className="text-gray-400 text-xs text-center md:text-right">
                         © 2026 The Beautiful India. All rights reserved.
                     </p>
                   </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
