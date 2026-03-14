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

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Tours', path: '/tours' },
        { name: 'Destinations', path: '/guides' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' }
    ];

    return (
        <header className="flex flex-wrap items-center justify-between px-4 md:px-10 py-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <Link to="/" className="flex items-center gap-2 text-gray-900">
                    <img src="/beautiful_india_logo_1773142903437.png" alt="The Beautiful India" className="h-16 w-auto object-contain drop-shadow-sm hover:opacity-90 transition-opacity" />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-8 ml-8 flex-1 justify-center">
                {navLinks.map(link => {
                    const isActive = currentPath === link.path || (link.path === '/tours' && currentPath.startsWith('/tours'));
                    
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

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-auto relative">
                {/* Currency Switcher */}
                <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold rounded-lg block p-2 cursor-pointer focus:ring-primary focus:border-primary ml-2 uppercase"
                >
                    {currencies.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                
                {!user ? (
                    <button 
                        onClick={() => setIsSignInModalOpen(true)}
                        className="bg-primary hover:bg-[#005a63] text-white text-sm font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm ml-2"
                    >
                        Sign In
                    </button>
                ) : (
                    <div className="relative ml-2">
                        <div 
                            className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden cursor-pointer border-2 border-primary/50 hover:border-primary transition-colors flex items-center justify-center p-0.5"
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

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center ml-4">
                <button className="text-slate-300 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-2xl">menu</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
