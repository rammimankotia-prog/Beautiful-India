import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { name: 'Overview', path: '/admin/overview', icon: 'space_dashboard' },
    { name: 'Manage Tours', path: '/admin/tours', icon: 'tour' },
    { name: 'Bike Tours', path: '/admin/bike-tours', icon: 'pedal_bike' },
    { name: 'Train Queries', path: '/admin/train-queries', icon: 'train' },
    { name: 'Leads & Queries', path: '/admin/leads', icon: 'leaderboard' },
    { name: 'Bookings', path: '/admin/bookings', icon: 'group' },
    { name: 'Guides & Blogs', path: '/admin/guides', icon: 'menu_book' },
    { name: 'Categorization', path: '/admin/categorization', icon: 'category' },
    { name: 'Themes', path: '/admin/themes', icon: 'palette' },
    { name: 'Chatbot Flow', path: '/admin/chatbot-flow', icon: 'smart_toy' },
    { name: 'Support & Bot Info', path: '/admin/support', icon: 'contact_support' },
    { name: 'Financials', path: '/referral/dashboard', icon: 'payments' },
  ];

  // Add User Management if Master Admin
  if (user?.role === 'master_admin') {
    links.push({ name: 'User Management', path: '/admin/users', icon: 'manage_accounts' });
  }

  const isActive = (path) => {
    if (path === '/admin') return currentPath === '/admin' || currentPath === '/admin/';
    return currentPath.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col hidden lg:flex">
      <div className="p-8">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0a6c75] rounded-xl flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white">admin_panel_settings</span>
          </div>
          <span className="font-black text-xl tracking-tighter uppercase text-slate-800 dark:text-slate-100">Admin</span>
        </Link>
      </div>
      <nav className="flex-1 py-4 px-4 space-y-1.5 overflow-y-auto">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-[12px] transition-all group ${
              isActive(link.path)
                ? 'bg-[#0a6c75] text-white font-bold shadow-lg shadow-teal-900/20'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] transition-transform group-hover:scale-110 ${isActive(link.path) ? 'text-white' : 'text-slate-400'}`}>
              {link.icon}
            </span>
            <span className="text-[14px] uppercase tracking-wide">{link.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <Link to="/" className="flex items-center gap-2.5 px-3 py-2 text-[10px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-[0.2em]">
           <span className="material-symbols-outlined text-[18px]">open_in_new</span>
           Launch Website
        </Link>
        <button 
          onClick={() => {
            logout();
            navigate('/signin');
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[10px] font-black text-red-500 hover:bg-red-50 rounded-xl transition-all uppercase tracking-[0.2em]"
        >
           <span className="material-symbols-outlined text-[18px]">logout</span>
           Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
