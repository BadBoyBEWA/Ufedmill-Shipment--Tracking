import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

function PublicNavbar({ path }) {
  const getLinkClasses = (targetPath) => {
    // Audit link active state
    if (path === targetPath) {
      return "text-[#fea619] font-bold border-b-2 border-[#fea619] font-sans text-sm uppercase tracking-widest transition-all duration-300";
    }
    return "text-[#43474e] dark:text-[#d3e4fe]/70 font-sans text-sm font-medium uppercase tracking-widest hover:text-[#fea619] transition-all duration-300";
  };

  return (
    <header className="bg-slate-50/80 dark:bg-[#0b1c30]/80 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-[0_12px_40px_rgba(11,28,48,0.06)]">
      <div className="flex justify-between items-center px-8 py-4 w-full max-w-full">
        <Link to="/" className="flex items-center gap-4">
          <span className="font-sans font-black tracking-tighter text-[#002045] dark:text-[#f8f9ff] text-2xl">Ufedmill</span>
        </Link>
        <nav className="hidden md:flex gap-8 items-center ml-auto">
          <Link className={getLinkClasses('/admin/login')} to="/admin/login">Login</Link>
          <Link className={getLinkClasses('/tracking')} to="/tracking">Shipments</Link>
          <Link className={getLinkClasses('/audit')} to="/audit">Get Audit</Link>
          <Link className={getLinkClasses('/services')} to="/services">Services</Link>
        </nav>
      </div>
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="bg-[#002045] dark:bg-[#050b14] w-full py-12 px-8 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <div className="space-y-6">
          <span className="font-sans font-black text-[#fea619] text-2xl mb-4 block uppercase tracking-tighter">Ufedmill</span>
          <p className="text-white/60 font-sans text-xs max-w-sm mb-6 leading-relaxed">
            Architectural Precision in Motion. Elevating global logistics through technology, command-level oversight, and strategic design.
          </p>
          <p className="text-white font-sans text-xs tracking-wide opacity-80">© 2026 Ufedmill. All rights reserved.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-[#fea619] font-bold text-sm uppercase tracking-widest">Protocol</h4>
            <nav className="flex flex-col gap-3 mt-4">
              <Link className="text-slate-400 hover:text-[#fea619] transition-colors text-xs font-medium uppercase tracking-widest" to="#">Network Status</Link>
              <Link className="text-slate-400 hover:text-[#fea619] transition-colors text-xs font-medium uppercase tracking-widest" to="#">Global Terms</Link>
            </nav>
          </div>
          <div className="space-y-3">
            <h4 className="text-[#fea619] font-bold text-sm uppercase tracking-widest">Support</h4>
            <nav className="flex flex-col gap-3 mt-4">
              <Link className="text-slate-400 hover:text-[#fea619] transition-colors text-xs font-medium uppercase tracking-widest" to="#">Privacy Protocol</Link>
              <Link className="text-slate-400 hover:text-[#fea619] transition-colors text-xs font-medium uppercase tracking-widest" to="#">Contact Command</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

function MobileBottomNav({ path }) {
  const getNavClasses = (targetPath) => {
    return path === targetPath
      ? "flex flex-col items-center justify-center bg-[#1a365d] dark:bg-[#fea619] text-white dark:text-[#684000] rounded-2xl px-6 py-2 scale-90 active:scale-100 transition-all font-bold"
      : "flex flex-col items-center justify-center text-[#43474e] dark:text-[#d3e4fe]/50 px-6 py-2";
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center p-4 pb-8 bg-white/90 dark:bg-[#0b1c30]/90 backdrop-blur-lg rounded-t-3xl z-50 shadow-[0_-10px_30px_rgba(11,28,48,0.08)] border-t border-slate-100 dark:border-slate-800/20">
      <Link className={getNavClasses('/')} to="/">
        <span className="material-symbols-outlined">home</span>
        <span className="font-sans text-[10px] font-bold uppercase mt-1">Home</span>
      </Link>
      <Link className={getNavClasses('/tracking')} to="/tracking">
        <span className="material-symbols-outlined">query_stats</span>
        <span className="font-sans text-[10px] font-bold uppercase mt-1">Track</span>
      </Link>
      <Link className={getNavClasses('/services')} to="/services">
        <span className="material-symbols-outlined">hub</span>
        <span className="font-sans text-[10px] font-bold uppercase mt-1">Services</span>
      </Link>
    </nav>
  );
}

export default function PublicLayout() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="bg-[var(--color-surface)] text-[var(--color-on-surface)] font-body selection:bg-[var(--color-secondary-container)]/30 min-h-screen flex flex-col relative w-full overflow-x-hidden">
      <PublicNavbar path={path} />
      <div className="flex-grow flex flex-col w-full relative">
        <Outlet />
      </div>
      <PublicFooter />
      <MobileBottomNav path={path} />
    </div>
  );
}
