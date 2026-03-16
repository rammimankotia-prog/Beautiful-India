import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import SignInModal from './SignInModal';

const Header = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const { currency, setCurrency, currencies } = useCurrency();
    const { user, logout } = useAuth();
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isToursDropdownOpen, setIsToursDropdownOpen] = useState(false);
    const [isMobileToursOpen, setIsMobileToursOpen] = useState(false);

    const navLinks = [
        { name: 'Home', path: '/' },
        { 
            name: 'Tours', 
            path: '/tours',
            subItems: [
                { name: 'All Tours', path: '/tours', icon: 'explore' },
                { name: 'Tours by Train', path: '/tours/tours-by-train', icon: 'train' }
            ]
        },
        { name: 'Destinations', path: '/guides' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' }
    ];

    return (
        <header className="flex flex-wrap items-center justify-between px-4 md:px-10 py-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <Link to="/" className="flex items-center gap-2 text-gray-900">
                    <img src={`${import.meta.env.BASE_URL}beautiful_india_logo_1773142903437.png`} alt="The Beautiful India" className="h-12 md:h-16 w-auto object-contain drop-shadow-sm hover:opacity-90 transition-opacity" />
                </Link>
            </div>

            {/* Navigation (Desktop) */}
            <nav className="hidden lg:flex items-center gap-8 ml-8 flex-1 justify-center">
                {navLinks.map(link => {
                    const isActive = currentPath === link.path || (link.path === '/tours' && currentPath.startsWith('/tours'));
                    
                    if (link.subItems) {
                        return (
                            <div 
                                key={link.name}
                                className="relative group"
                                onMouseEnter={() => setIsToursDropdownOpen(true)}
                                onMouseLeave={() => setIsToursDropdownOpen(false)}
                            >
                                <button 
                                    className={`flex items-center gap-1 text-[15px] font-medium transition-colors ${isActive ? 'text-white font-bold' : 'text-slate-300 hover:text-white'}`}
                                >
                                    {link.name}
                                    <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${isToursDropdownOpen ? 'rotate-180' : ''}`}>
                                        expand_more
                                    </span>
                                    {isActive && (
                                        <div className="absolute -bottom-[22px] left-0 right-0 h-0.5 bg-primary"></div>
                                    )}
                                </button>

                                {/* Dropdown Menu */}
                                <div className={`absolute left-1/2 -translate-x-1/2 mt-[12px] w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-3 transition-all duration-300 origin-top overflow-hidden z-50 ${isToursDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xl -z-10"></div>
                                    {link.subItems.map(subItem => (
                                        <Link
                                            key={subItem.name}
                                            to={subItem.path}
                                            className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all font-medium"
                                        >
                                            <span className="material-symbols-outlined text-[20px] text-primary">{subItem.icon}</span>
                                            {subItem.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <Link 
                            key={link.name} 
                            to={link.path} 
                            className={`relative text-[15px] font-medium transition-colors ${isActive ? 'text-white font-bold' : 'text-slate-300 hover:text-white'}`}
                        >
                            {link.name}
                            {isActive && (
                                <div className="absolute -bottom-[22px] left-0 right-0 h-0.5 bg-primary"></div>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Right Actions (Desktop) */}
            <div className="hidden md:flex items-center gap-2 md:gap-4 ml-auto relative">
                {/* Currency Switcher */}
                <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-slate-200 text-xs md:text-sm font-semibold rounded-lg block p-1.5 md:p-2 cursor-pointer focus:ring-primary focus:border-primary ml-1 md:ml-2 uppercase"
                >
                    {currencies.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                
                {!user ? (
                    <button 
                        onClick={() => setIsSignInModalOpen(true)}
                        className="bg-primary hover:bg-[#005a63] text-white text-[12px] md:text-sm font-bold py-2 md:py-2.5 px-4 md:px-6 rounded-lg transition-colors shadow-sm ml-1 md:ml-2"
                    >
                        Sign In
                    </button>
                ) : (
                    <div className="relative ml-2">
                        <div 
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 overflow-hidden cursor-pointer border-2 border-primary/50 hover:border-primary transition-colors flex items-center justify-center p-0.5"
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        >
                            <img 
                                src={user.avatar} 
                                alt="User Avatar" 
                                className="w-full h-full object-cover rounded-full bg-white"
                            />
                        </div>

                        {/* Dropdown Menu */}
                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg shadow-black/10 border border-slate-100 py-2 z-50 transform origin-top-right transition-all">
                                <div className="px-4 py-3 border-b border-slate-100/50">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                </div>
                                <div className="py-1">
                                    <Link to="/admin" className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-[20px] mr-2">dashboard</span>
                                        Dashboard
                                    </Link>
                                    <button 
                                        onClick={() => {
                                            logout();
                                            setIsUserMenuOpen(false);
                                        }}
                                        className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px] mr-2">logout</span>
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <SignInModal 
                isOpen={isSignInModalOpen} 
                onClose={() => setIsSignInModalOpen(false)} 
            />

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center ml-2">
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-slate-300 hover:text-white transition-colors p-1"
                >
                    <span className="material-symbols-outlined text-2xl">
                        {isMobileMenuOpen ? 'close' : 'menu'}
                    </span>
                </button>
            </div>

            {/* Mobile Menu Drawer */}
            <div className={`lg:hidden fixed inset-0 z-[60] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                
                {/* Content */}
                <div className={`absolute right-0 top-0 bottom-0 w-64 bg-slate-900 shadow-2xl transition-transform duration-300 p-6 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex justify-between items-center mb-10">
                        <img src={`${import.meta.env.BASE_URL}beautiful_india_logo_1773142903437.png`} alt="Logo" className="h-10 w-auto" />
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <nav className="flex flex-col gap-2">
                        {navLinks.map(link => {
                            const isActive = currentPath === link.path || (link.path === '/tours' && currentPath.startsWith('/tours'));
                            
                            if (link.subItems) {
                                return (
                                    <div key={link.name} className="flex flex-col">
                                        <button 
                                            onClick={() => setIsMobileToursOpen(!isMobileToursOpen)}
                                            className={`flex items-center justify-between text-lg font-medium py-3 transition-colors ${isActive ? 'text-primary' : 'text-slate-300 hover:text-white'}`}
                                        >
                                            {link.name}
                                            <span className={`material-symbols-outlined transition-transform duration-300 ${isMobileToursOpen ? 'rotate-180' : ''}`}>
                                                expand_more
                                            </span>
                                        </button>
                                        
                                        <div className={`flex flex-col gap-2 pl-4 overflow-hidden transition-all duration-300 ${isMobileToursOpen ? 'max-h-40 opacity-100 mt-1 mb-3' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                            {link.subItems.map(subItem => (
                                                <Link 
                                                    key={subItem.name} 
                                                    to={subItem.path}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className={`flex items-center gap-2 text-sm py-2 transition-colors ${currentPath === subItem.path ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                                                >
                                                    <span className="material-symbols-outlined text-[18px] text-primary">{subItem.icon}</span>
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <Link 
                                    key={link.name} 
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`text-lg font-medium py-3 transition-colors ${isActive ? 'text-primary' : 'text-slate-300 hover:text-white'}`}
                                >
                                    {link.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Mobile Actions */}
                    <div className="mt-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Currency</span>
                            <select 
                                value={currency} 
                                onChange={(e) => setCurrency(e.target.value)}
                                className="bg-transparent text-white text-sm font-bold focus:outline-none uppercase"
                            >
                                {currencies.map(c => (
                                    <option key={c} value={c} className="bg-slate-900">{c}</option>
                                ))}
                            </select>
                        </div>
                        
                        {!user ? (
                            <button 
                                onClick={() => {
                                    setIsSignInModalOpen(true);
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full bg-primary hover:bg-[#005a63] text-white font-bold py-3 rounded-xl transition-colors shadow-lg"
                            >
                                Sign In
                            </button>
                        ) : (
                            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                                <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full bg-white" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                    <button onClick={logout} className="text-xs text-red-400 font-bold hover:text-red-300">Sign Out</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-10 pt-10 border-t border-slate-800 flex flex-col gap-4">
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">Connect With Us</div>
                        <div className="flex gap-4">
                            <span className="material-symbols-outlined text-slate-400">call</span>
                            <span className="text-slate-300 text-sm">0000 0000 00</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="material-symbols-outlined text-slate-400">mail</span>
                            <span className="text-slate-300 text-sm">info@beautifulindia.com</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
