import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const path = location.pathname;

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

  return (
    <div className="text-[var(--color-on-surface)] bg-[var(--color-surface)] min-h-screen">
      {/* Navigation Drawer (SideNav) */}
      <aside className="h-screen w-72 flex-col fixed left-0 top-0 bg-[var(--color-primary)] z-40 hidden md:flex">
        <div className="px-8 py-10">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-10 h-10 bg-[var(--color-secondary)]/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[var(--color-secondary)] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>deployed_code</span>
            </div>
            <h2 className="text-white font-black text-xl tracking-tighter uppercase italic">Ufedmill</h2>
          </div>

          <nav className="flex flex-col gap-2">
            <Link 
              to="/admin/dashboard" 
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${path.includes('/dashboard') ? 'bg-[var(--color-primary-container)] text-white shadow-lg' : 'text-white/50 hover:bg-white/5'}`}
            >
              <span className={`material-symbols-outlined text-[22px] ${path.includes('/dashboard') ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>dashboard</span>
              <span className="font-bold text-sm">Dashboard</span>
            </Link>
            <Link 
              to="/admin/shipments" 
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${path.includes('/shipments') ? 'bg-[var(--color-primary-container)] text-white shadow-lg' : 'text-white/50 hover:bg-white/5'}`}
            >
              <span className={`material-symbols-outlined text-[22px] ${path.includes('/shipments') ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>inventory_2</span>
              <span className="font-bold text-sm">Shipments</span>
            </Link>
            <Link 
              to="/admin/chat" 
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${path.includes('/chat') ? 'bg-[var(--color-primary-container)] text-white shadow-lg' : 'text-white/50 hover:bg-white/5'}`}
            >
              <span className={`material-symbols-outlined text-[22px] ${path.includes('/chat') ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>forum</span>
              <span className="font-bold text-sm">Live Chat</span>
            </Link>
          </nav>
        </div>

        <div className="mt-auto p-6">
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
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
      </aside>

      {/* Main Panel */}
      <main className="md:ml-72 min-h-screen flex flex-col">
        {/* Top Command Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-[var(--color-outline-variant)]/10 px-8 flex items-center justify-between sticky top-0 z-30">
          <div>
            <p className="text-[var(--color-on-surface-variant)] text-[10px] font-black uppercase tracking-[0.2em]">{getPageTitle()}</p>
            <h1 className="text-[var(--color-primary)] font-black text-lg tracking-tight">Logistics Command Center</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/admin/chat')}>
              <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-secondary)] rounded-full border-2 border-[var(--color-surface)] flex items-center justify-center text-[10px] text-white font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <div className="h-8 w-[1px] bg-[var(--color-outline-variant)]/30"></div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] flex items-center justify-center text-white font-black text-xs">KA</div>
              <div className="hidden sm:block">
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
      </main>
    </div>
  );
}
