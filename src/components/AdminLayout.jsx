import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Auth Guard
  useEffect(() => {
    if (!user) {
      navigate('/signin', { state: { from: location } });
    }
  }, [user, navigate, location]);

  if (!user) return null; // Prevent flicker before redirect

  return (
    <div className="relative flex h-screen w-full flex-col group/design-root overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        
        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* Main Top Header with Breadcrumbs */}
          <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 lg:px-10 py-4 flex items-center justify-between sticky top-0 z-30">
            <nav className="flex text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 gap-2 items-center">
              <Link className="hover:text-[#0a6c75] transition-colors flex items-center gap-1.5" to="/admin">
                <span className="material-symbols-outlined text-[16px]">home</span>
                Admin
              </Link>
              {pathnames.map((name, index) => {
                if (name === 'admin' && index === 0) return null;
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                const formattedName = name.replace(/-/g, ' ');

                return (
                  <React.Fragment key={routeTo}>
                    <span className="material-symbols-outlined text-[14px] opacity-40">chevron_right</span>
                    {isLast ? (
                      <span className="text-slate-800 dark:text-slate-200 font-black">{formattedName}</span>
                    ) : (
                      <Link className="hover:text-[#0a6c75] transition-colors" to={routeTo}>
                        {formattedName}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2 group cursor-pointer">
                  <div className="text-right hidden sm:block">
                     <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Signed in as</p>
                     <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tighter">Bharat Admin</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-[#0a6c75]/10 flex items-center justify-center border border-[#0a6c75]/20 group-hover:bg-[#0a6c75]/20 transition-all shadow-sm">
                     <span className="material-symbols-outlined text-[20px] text-[#0a6c75]">person</span>
                  </div>
               </div>
            </div>
          </header>

          <div className="flex-1 p-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
