import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const path = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    if (path.includes('/admin/dashboard')) return 'Operational Command';
    if (path.includes('/admin/shipments')) return 'Logistics Manifest';
    if (path.includes('/admin/chat')) return 'Secure Communication Bridge';
    return 'Console';
  };

  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await api.get('/dashboard/stats');
        const data = await api.parseResponse(res);
        setUnreadCount(data.unreadMessages || 0);
      } catch (err) {
        console.error('Failed to fetch unread count');
      }
    }
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu on path change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [path]);

  const navLinks = [
    { to: "/admin/dashboard", icon: "dashboard", label: "Dashboard" },
    { to: "/admin/shipments", icon: "inventory_2", label: "Shipments" },
    { to: "/admin/chat", icon: "forum", label: "Live Chat" },
  ];

  return (
    <div className="text-[var(--color-on-surface)] bg-[var(--color-surface)] min-h-screen">
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Navigation Drawer (SideNav) */}
      <aside className={`h-screen w-72 flex-col fixed left-0 top-0 bg-[var(--color-primary)] z-50 transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:flex`}>
        <div className="px-8 py-10 flex flex-col h-full">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[var(--color-secondary)]/10 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[var(--color-secondary)] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>deployed_code</span>
              </div>
              <h2 className="text-white font-black text-xl tracking-tighter uppercase italic">Ufed Express</h2>
            </div>
            {/* Close button for mobile */}
            <button 
              className="md:hidden text-white/60 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${path.includes(link.to) ? 'bg-[var(--color-primary-container)] text-white shadow-lg' : 'text-white/50 hover:bg-white/5'}`}
              >
                <span className={`material-symbols-outlined text-[22px] ${path.includes(link.to) ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>{link.icon}</span>
                <span className="font-bold text-sm">{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6">
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hidden md:block">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-4">Command Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-white text-xs font-bold uppercase tracking-tight">System Secured</span>
              </div>
            </div>
            
            <button 
              onClick={logout}
              className="w-full mt-4 flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all duration-300 group"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:rotate-180 transition-transform duration-500">logout</span>
              <span className="font-bold text-xs uppercase tracking-widest">Terminate Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="md:ml-72 min-h-screen flex flex-col pb-20 md:pb-0">
        {/* Top Command Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-[var(--color-outline-variant)]/10 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-[var(--color-primary)] hover:bg-[var(--color-surface-container)] rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <div>
              <p className="text-[var(--color-on-surface-variant)] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] line-clamp-1">{getPageTitle()}</p>
              <h1 className="text-[var(--color-primary)] font-black text-sm md:text-lg tracking-tight line-clamp-1">Logistics Command Center</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="relative cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/admin/chat')}>
              <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-secondary)] rounded-full border-2 border-[var(--color-surface)] flex items-center justify-center text-[10px] text-white font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <div className="h-8 w-[1px] bg-[var(--color-outline-variant)]/30 hidden sm:block"></div>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] flex items-center justify-center text-white font-black text-[10px] md:text-xs">KA</div>
              <div className="hidden lg:block">
                <p className="text-xs font-black text-[var(--color-primary)] leading-none uppercase">Admin Node</p>
                <p className="text-[10px] text-green-600 font-bold mt-1">Authorized</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <div className="flex-1 flex flex-col bg-[var(--color-surface)]">
          <Outlet />
        </div>

        {/* Bottom Navigation for Mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg flex justify-around items-center p-3 pb-6 z-40 border-t border-[var(--color-outline-variant)]/10 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          {navLinks.map((link) => (
            <Link 
              key={link.to}
              to={link.to} 
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${path.includes(link.to) ? 'text-[var(--color-primary)] scale-110 font-black' : 'text-[var(--color-on-surface-variant)]/50'}`}
            >
              <span className={`material-symbols-outlined text-2xl ${path.includes(link.to) ? 'fill-[1]' : ''}`} style={path.includes(link.to) ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {link.icon}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-tighter">{link.label}</span>
            </Link>
          ))}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-1 text-[var(--color-on-surface-variant)]/50"
          >
            <span className="material-symbols-outlined text-2xl">more_horiz</span>
            <span className="text-[9px] font-bold uppercase tracking-tighter">More</span>
          </button>
        </nav>
      </main>
    </div>
  );
}
