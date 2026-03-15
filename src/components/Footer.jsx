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
    const metroCities = ["Delhi", "Mumbai", "Kolkatta", "Chennai"];
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
            <div className={`transition-all duration-300 overflow-hidden ${isSearchesOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                <div className="container mx-auto px-4 py-8 text-xs text-gray-400">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {/* More detailed travel searches could go here */}
                        <div className="space-y-2">
                           <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[10px]">Top Destinations</h4>
                           <ul className="space-y-1.5 opacity-80">
                             <li>Thailand</li>
                             <li>Singapore</li>
                             <li>Dubai</li>
                             <li>Bali</li>
                           </ul>
                        </div>
                        {/* Additional columns... */}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-10 py-10 max-w-7xl">
                {/* Top Links & Contact */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-10 pb-10 border-b border-[#3c4248]">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-gray-300 w-full lg:w-2/3">
                        {topLinks.map((link, i) => (
                            <Link key={i} to={link.path} className="hover:text-white transition-colors">{link.label}</Link>
                        ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-6 w-full lg:w-1/3 lg:items-end">
                        <div className="flex items-center gap-3 font-bold text-lg">
                            <span className="material-symbols-outlined text-[#ff3d31]">call</span>
                            <span>0000 0000 00</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="material-symbols-outlined text-gray-400">mail</span>
                            <span className="text-gray-300">customercare@beautifulindia.com</span>
                        </div>
                    </div>
                </div>

                {/* Footer Links Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                    {/* Domestic */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3 text-[11px] bg-[#343a40]/50 p-4 rounded-xl border border-white/5 shadow-sm">
                        <span className="font-bold text-white min-w-[160px] uppercase tracking-wider text-[10px] text-red-500">Domestic</span>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 flex-1">
                            {domestic.map((dest, i) => (
                                <React.Fragment key={i}>
                                    <Link to="#!" className="text-gray-400 hover:text-white whitespace-nowrap transition-colors">{dest}</Link>
                                    {i < domestic.length - 1 && <span className="text-gray-700">|</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Domestic Packages */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3 text-[11px] bg-[#343a40]/50 p-4 rounded-xl border border-white/5 shadow-sm">
                        <span className="font-bold text-white min-w-[160px] uppercase tracking-wider text-[10px] text-red-500">Domestic Packages</span>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 flex-1">
                            {domPackages.map((pkg, i) => (
                                <React.Fragment key={i}>
                                    <Link to="#!" className="text-gray-400 hover:text-white whitespace-nowrap transition-colors">{pkg}</Link>
                                    {i < domPackages.length - 1 && <span className="text-gray-700">|</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Metro Cities */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3 text-[11px] bg-[#343a40]/50 p-4 rounded-xl border border-white/5 shadow-sm">
                        <span className="font-bold text-white min-w-[160px] uppercase tracking-wider text-[10px] text-red-500">Top 4 Metro Cities</span>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 flex-1">
                            {metroCities.map((city, i) => (
                                <React.Fragment key={i}>
                                    <Link to="#!" className="text-gray-400 hover:text-white whitespace-nowrap transition-colors">{city}</Link>
                                    {i < metroCities.length - 1 && <span className="text-gray-700">|</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* International Packages */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3 text-[11px] bg-[#343a40]/50 p-4 rounded-xl border border-white/5 shadow-sm">
                        <span className="font-bold text-white min-w-[160px] uppercase tracking-wider text-[10px] text-red-500">International Packages</span>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 flex-1">
                            {intPackages.map((pkg, i) => (
                                <React.Fragment key={i}>
                                    <Link to="#!" className="text-gray-400 hover:text-white whitespace-nowrap transition-colors">{pkg}</Link>
                                    {i < intPackages.length - 1 && <span className="text-gray-700">|</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Blogs */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3 text-[11px] bg-[#343a40]/50 p-4 rounded-xl border border-white/5 shadow-sm">
                        <span className="font-bold text-white min-w-[160px] uppercase tracking-wider text-[10px] text-red-500">Explore Travel Blogs</span>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 flex-1">
                            {blogs.map((num, i) => (
                                <React.Fragment key={i}>
                                    <Link to="#!" className="text-gray-400 hover:text-white whitespace-nowrap transition-colors">{num}</Link>
                                    {i < blogs.length - 1 && <span className="text-gray-700">|</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Logo, Copyright & Sitemap */}
                <div className="mt-16 pt-8 border-t border-[#3c4248] flex flex-col md:flex-row items-center justify-between gap-8">
                   <Link to="/" className="flex items-center gap-2 group">
                        <img src={`${import.meta.env.BASE_URL}beautiful_india_logo_1773142903437.png`} alt="The Beautiful India" className="h-12 md:h-14 w-auto object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity" />
                   </Link>
                   <div className="flex flex-col md:flex-row items-center gap-6">
                     <Link
                       to="/nav"
                       className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-bold border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-full"
                     >
                       <span className="material-symbols-outlined text-[16px]">map</span>
                       Sitemap
                     </Link>
                     <p className="text-gray-500 text-[11px] font-medium tracking-wide">
                         © 2026 THE BEAUTIFUL INDIA. ALL RIGHTS RESERVED.
                     </p>
                   </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
