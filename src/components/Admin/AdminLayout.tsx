import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import Logo from '../../assets/logo/logo.png';
import { useToast } from '../Toast/ToastProvider';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const navItems = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: 'bxs-dashboard',
    badge: null
  },
  {
    name: 'About Us',
    path: '/admin/about',
    icon: 'bxs-info-circle',
    badge: 'Content'
  },
  {
    name: 'Services',
    path: '/admin/services',
    icon: 'bxs-shopping-bag',
    badge: null
  },
  {
    name: 'Gallery',
    path: '/admin/gallery',
    icon: 'bxs-photo-album',
    badge: null
  },
  {
    name: 'Contact & Socials',
    path: '/admin/contact-settings',
    icon: 'bxs-contact',
    badge: 'Common'
  }
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    showToast('You have been logged out successfully.', 'info');
    navigate('/admin/login');
  };

  const getPageTitle = () => {
    const current = navItems.find(item => item.path === location.pathname);
    if (current) return current.name;
    if (location.pathname.startsWith('/admin/services')) return 'Services Management';
    if (location.pathname.startsWith('/admin/gallery')) return 'Gallery Management';
    return 'Admin Portal';
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col font-['Poppins',sans-serif]">
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Responsive Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 bg-[#1F1215] text-white/90 flex flex-col transition-all duration-300 ease-in-out shadow-2xl border-r border-[#3D252B]
          ${isSidebarCollapsed ? 'w-20' : 'w-72'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between min-h-[76px]">
          <Link 
            to="/admin/dashboard" 
            className="flex items-center gap-3 overflow-hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img 
              src={Logo} 
              alt="Sumangali Logo" 
              className="h-10 w-auto object-contain bg-white/10 rounded-lg p-1 shrink-0" 
            />
            {!isSidebarCollapsed && (
              <div className="flex flex-col">
                <span className="font-['Playfair_Display'] font-bold text-base text-[#D9AD5B] leading-tight">
                  Sumangali Pattu
                </span>
                <span className="text-[11px] text-white/60 uppercase tracking-widest font-medium">
                  Admin Portal
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Button */}
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 items-center justify-center text-white/70 hover:text-white transition-colors"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <i className={`bx ${isSidebarCollapsed ? 'bx-chevron-right' : 'bx-chevron-left'} text-xl`}></i>
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-xl"
          >
            <i className="bx bx-x"></i>
          </button>
        </div>

        {/* Status Indicator */}
        {!isSidebarCollapsed && (
          <div className="px-4 py-3 bg-[#2A171C] mx-3 my-3 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-white/80">System Online</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#D9AD5B]/20 text-[#D9AD5B]">
              Ready
            </span>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {!isSidebarCollapsed && (
            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-white/40">
              Navigation
            </p>
          )}

          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 relative
                  ${isActive 
                    ? 'bg-gradient-to-r from-[#6A0F1F] to-[#8C162B] text-white shadow-lg shadow-[#6A0F1F]/30 font-semibold' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }
                  ${isSidebarCollapsed ? 'justify-center' : ''}
                `}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <i className={`bx ${item.icon} text-xl shrink-0 ${isActive ? 'text-[#D9AD5B]' : 'text-white/60 group-hover:text-white'}`}></i>
                
                {!isSidebarCollapsed && (
                  <>
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.badge && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-[#D9AD5B] text-[#1F1215]' : 'bg-white/10 text-white/70'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#D9AD5B] rounded-r-full"></span>
                )}
              </Link>
            );
          })}

          {!isSidebarCollapsed && (
            <div className="pt-6 pb-2 px-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/40">
                Quick Shortcuts
              </p>
            </div>
          )}

          {/* Quick link to live public site */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-white/70 hover:bg-white/5 hover:text-[#D9AD5B] transition-colors border border-white/5
              ${isSidebarCollapsed ? 'justify-center' : ''}
            `}
            title="Open Live Public Website in New Tab"
          >
            <i className="bx bx-globe text-lg shrink-0 text-[#D9AD5B]"></i>
            {!isSidebarCollapsed && <span>View Live Website</span>}
          </a>
        </div>

        {/* Footer Admin Profile & Logout */}
        <div className="p-3 border-t border-white/10 bg-[#160B0E]">
          <div className={`flex items-center gap-3 p-2 rounded-xl bg-white/5 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 rounded-full bg-[#6A0F1F] border border-[#D9AD5B]/40 flex items-center justify-center text-white font-bold text-sm shrink-0">
              A
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">Administrator</p>
                <p className="text-[11px] text-white/50 truncate">admin@sumangali.com</p>
              </div>
            )}
            {!isSidebarCollapsed && (
              <button
                type="button"
                onClick={handleLogout}
                className="w-8 h-8 rounded-lg hover:bg-red-500/20 text-white/70 hover:text-red-400 flex items-center justify-center transition-colors"
                title="Logout"
              >
                <i className="bx bx-log-out text-lg"></i>
              </button>
            )}
          </div>
          {isSidebarCollapsed && (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 w-full py-2 rounded-lg hover:bg-red-500/20 text-white/70 hover:text-red-400 flex items-center justify-center transition-colors"
              title="Logout"
            >
              <i className="bx bx-log-out text-lg"></i>
            </button>
          )}
        </div>
      </aside>

      {/* Main Workspace on Right */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}
        `}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#6A0F1F] flex items-center justify-center text-2xl transition-colors"
              aria-label="Open Navigation Drawer"
            >
              <i className="bx bx-menu"></i>
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                <Link to="/admin/dashboard" className="hover:text-[#6A0F1F]">Admin</Link>
                <span>/</span>
                <span className="text-[#6A0F1F]">{getPageTitle()}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#1F1215] leading-tight">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#FCF9F4] hover:bg-[#FFF9E8] text-[#6A0F1F] border border-[#E5D3A3] text-xs font-bold transition-all shadow-xs"
            >
              <i className="bx bx-external-link text-base text-[#D9AD5B]"></i>
              <span>Live Site</span>
            </a>

            <div className="h-8 w-px bg-stone-200 hidden sm:block"></div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-600 text-xs font-semibold transition-all border border-stone-200"
            >
              <i className="bx bx-log-out text-base"></i>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Screen Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
