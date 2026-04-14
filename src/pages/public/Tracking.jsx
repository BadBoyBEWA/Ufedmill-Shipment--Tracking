import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

const STATUS_STEPS = [
  { key: 'in_transit', label: 'Order Received', icon: 'receipt_long' },
  { key: 'store', label: 'Picked Up', icon: 'inventory_2' },
  { key: 'shipped', label: 'In Transit', icon: 'local_shipping' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: 'hail' },
  { key: 'delivered', label: 'Delivered', icon: 'verified' },
];

const STATUS_INDEX = { 
  in_transit: 0, 
  store: 1, 
  shipped: 2, 
  out_for_delivery: 3, 
  delivered: 4 
};

export default function Tracking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const trackingId = searchParams.get('id');
  const [inputVal, setInputVal] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const autoRefreshTimer = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const searchTracking = async (reference, silent = false) => {
    if (!reference) return;
    if (!silent) { setLoading(true); setError(''); setShipment(null); }
    try {
      const res = await api.get(`/shipments/track/${encodeURIComponent(reference)}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Shipment not found.');
      }
      const data = await res.json();
      setShipment(data);
    } catch (err) {
      setError(err.message);
      setShipment(null);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (trackingId) {
      searchTracking(trackingId);
    }
  }, [trackingId]);

  useEffect(() => {
    if (shipment?.tracking_id) {
      autoRefreshTimer.current = setInterval(() => {
        searchTracking(shipment.tracking_id, true);
      }, 10000);
    }
    return () => clearInterval(autoRefreshTimer.current);
  }, [shipment?.tracking_id]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputVal.trim()) setSearchParams({ id: inputVal.trim() });
  };

  if (!trackingId) {
    return <TrackingSearch inputVal={inputVal} setInputVal={setInputVal} handleSearch={handleSearch} />;
  }

  if (loading) {
    return <TrackingLoading />;
  }

  if (error) {
    return <TrackingError error={error} inputVal={inputVal} setInputVal={setInputVal} handleSearch={handleSearch} />;
  }

  if (!shipment) return null;

  return (
    <>
      {isMobile ? (
        <MobileResults 
          shipment={shipment} 
          inputVal={inputVal} 
          setInputVal={setInputVal} 
          handleSearch={handleSearch} 
        />
      ) : (
        <DesktopResults 
          shipment={shipment} 
          inputVal={inputVal} 
          setInputVal={setInputVal} 
          handleSearch={handleSearch} 
        />
      )}
      <ChatWidget trackingId={shipment.tracking_id} />
      <style>{`
        .vertical-lr { writing-mode: vertical-lr; }
        .mask-fade { -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%); mask-image: linear-gradient(to right, black 85%, transparent 100%); }
        .material-symbols-outlined { font-variation-settings: 'opsz' 20; }
        body { overflow-x: hidden; width: 100vw; }
      `}</style>
    </>
  );
}

/* --- Shared Components --- */
function QuickSearch({ inputVal, setInputVal, handleSearch, isMobile = false }) {
    return (
        <form onSubmit={handleSearch} className={`flex items-center gap-2 ${isMobile ? 'w-full' : 'max-w-md'}`}>
            <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] text-lg">search</span>
                <input
                    type="text"
                    className={`w-full bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] rounded-xl px-10 py-2.5 text-xs font-bold outline-none border border-transparent focus:border-[var(--color-primary)]/30 transition-all`}
                    placeholder="Quick search ID..."
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                />
            </div>
            <button 
              type="submit" 
              className="bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-primary-container)] transition-colors shadow-sm"
            >
              Update
            </button>
        </form>
    );
}

/* --- Search & States --- */
function TrackingSearch({ inputVal, setInputVal, handleSearch }) {
    return (
        <main className="max-w-7xl mx-auto px-4 py-32 w-full flex flex-col items-center sm:items-start justify-center min-h-[70vh]">
          <div className="max-w-2xl w-full text-center md:text-left">
            <span className="text-[#855300] font-bold tracking-[0.2em] uppercase text-[10px] mb-4 block">REAL-TIME UPDATES</span>
            <h1 className="text-[#002045] text-5xl md:text-7xl font-black tracking-tighter mb-4 uppercase">Track Shipment</h1>
            <p className="text-[#43474e] text-lg mb-12">Enter your Ufed Express tracking number to get the latest status update.</p>
            <form onSubmit={handleSearch} className="flex flex-col gap-6 w-full max-w-xl mx-auto md:mx-0">
              <input
                type="text"
                className="bg-[#e5eeff] text-[#0b1c30] rounded-2xl px-6 py-5 text-lg w-full border border-slate-200 outline-none focus:ring-2 focus:ring-[#002045]"
                placeholder="Enter tracking number (e.g. KN-5521-Z9)"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
              <button
                type="submit"
                className="bg-[#fea619] hover:bg-[#ffb95f] text-[#684000] flex items-center justify-center gap-3 px-8 py-5 rounded-2xl w-full font-black text-lg uppercase tracking-wider transition-all shadow-lg shadow-[#fea619]/20"
              >
                Track Package
              </button>
            </form>
          </div>
        </main>
    );
}

function TrackingLoading() {
    return (
        <main className="max-w-7xl mx-auto px-8 py-32 w-full flex flex-col items-center justify-center min-h-[70vh]">
          <div className="flex flex-col items-center gap-6 opacity-60">
            <div className="w-14 h-14 border-4 border-[#002045]/20 border-t-[#002045] rounded-full animate-spin"></div>
            <p className="text-[#43474e] font-bold tracking-widest uppercase text-sm">Locating shipment...</p>
          </div>
        </main>
    );
}

function TrackingError({ error, inputVal, setInputVal, handleSearch }) {
    return (
        <main className="max-w-7xl mx-auto px-4 py-32 w-full flex flex-col items-center sm:items-start justify-center min-h-[70vh]">
          <div className="max-w-2xl w-full">
            <div className="p-8 bg-red-50 border border-red-200 rounded-2xl mb-8">
              <h2 className="text-2xl font-black text-red-600 mb-2">Shipment Not Found</h2>
              <p className="text-red-500 text-sm">{error}</p>
            </div>
            <form onSubmit={handleSearch} className="flex gap-4">
              <input
                type="text"
                className="flex-1 bg-[#e5eeff] rounded-2xl px-6 py-4 text-sm border border-slate-200 outline-none focus:ring-2 focus:ring-[#002045]"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
              <button type="submit" className="bg-[#fea619] text-[#684000] px-6 py-4 rounded-2xl font-black text-sm">Search</button>
            </form>
          </div>
        </main>
    );
}

/* --- Mobile Results (DEDICATED VIEW) --- */
function MobileResults({ shipment, inputVal, setInputVal, handleSearch }) {
  const currentStepIdx = STATUS_INDEX[shipment.status] ?? 0;
  const history = [...(shipment.status_history || [])].reverse();

  const formatDateTime = (iso) => {
    if (!iso) return { date: '', time: '' };
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase(),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen overflow-x-hidden flex flex-col">
      {/* Mobile Top Bar */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm border-b border-slate-100 flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="font-black tracking-tighter text-[#002045] text-xl">Ufed Express</Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[8px] font-black uppercase tracking-widest text-[#43474e]">Support Online</span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </header>

      <main className="px-4 py-8 space-y-8 pb-32 flex-1 overflow-y-auto">
        {/* Mobile Hero */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <span className="text-[#855300] font-black text-[9px] uppercase tracking-[0.2em]">MANIFEST ID</span>
            <h1 className="text-3xl font-black tracking-tighter text-[#002045] uppercase break-all">{shipment.tracking_id}</h1>
          </div>
          <div className="inline-flex items-center gap-2 bg-[#fea619] px-4 py-2 rounded-full shadow-lg shadow-[#fea619]/20 text-[#684000]">
            <span className="material-symbols-outlined text-sm font-black" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
            <span className="font-black text-[10px] tracking-widest uppercase italic">{shipment.status?.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Mobile Shipment Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl relative overflow-hidden ring-1 ring-[#002045]/5">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#002045]/5 rounded-bl-full -mr-8 -mt-8"></div>
          
          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <span className="text-[#43474e] text-[9px] font-black uppercase tracking-widest opacity-60">Origin</span>
                <h3 className="font-black text-[#002045] text-sm">{shipment.origin_address?.split(',')[0]}</h3>
              </div>
              <div className="w-10 h-[1px] bg-slate-200 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                  <span className="material-symbols-outlined text-[10px] text-[#fea619]">arrow_forward</span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <span className="text-[#43474e] text-[9px] font-black uppercase tracking-widest opacity-60">Destination</span>
                <h3 className="font-black text-[#002045] text-sm">{shipment.destination_address?.split(',')[0]}</h3>
              </div>
            </div>

            <div className="py-4 px-2">
              <div className="w-full h-[2px] bg-[#dce9ff] relative rounded-full">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-[#002045] to-[#fea619] rounded-full" 
                  style={{ width: `${((currentStepIdx + 1) / STATUS_STEPS.length) * 100}%` }}
                ></div>
                <div 
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#fea619] text-white p-1 rounded-full text-xs shadow-lg transition-all duration-1000"
                  style={{ left: `${((currentStepIdx + 1) / STATUS_STEPS.length) * 100}%` }}
                >
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                     {shipment.shipping_type === 'air_freight' ? 'flight' : 'sailing'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
               <div>
                  <span className="block text-[9px] font-black text-[#43474e] uppercase mb-1 opacity-60">Est. Arrival</span>
                  <p className="font-black text-[#002045] text-xs">
                    {shipment.estimated_delivery_date 
                      ? new Date(shipment.estimated_delivery_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
                      : 'PENDING'}
                  </p>
               </div>
               <div className="text-right">
                  <span className="block text-[9px] font-black text-[#43474e] uppercase mb-1 opacity-60">Service</span>
                  <p className="font-black text-[#002045] text-xs underline decoration-[#fea619] decoration-2 underline-offset-4 uppercase tracking-tighter italic">
                    {shipment.shipping_type?.toLowerCase().includes('express') ? 'Ufed Express' : `Ufed Express ${shipment.shipping_type?.replace('_', ' ')}`.toUpperCase()}
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Mobile Map View */}
        <div className="bg-[#eff4ff] rounded-[2rem] p-2 overflow-hidden shadow-inner flex flex-col group">
          <div className="relative h-40 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
            <img 
                alt="Map" 
                className="w-full h-full object-cover opacity-80" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUwaRT4viUHl4uxrsVLQI5TbLkXNmTnsc_-K-FzGKm6utWTeAujnLp0TGlZrhpl7hRqh04hGNkF9SephDkuhyzy3vfc_u_g26OFZbydfWsAwSTvJfmmIqYc4LjsocoivevTIWSPH53tIL9kpy-YNO9qFyx5eT2lvLAZuTkzhbrQaTUNumH9bVVFWjmEwC-vMXlXY1MYHmIrqtuTfWkdQYDjJfnPjdt506NW8xO7Oyeqlbq5lS7zSORNk8_KXluiHFlnkQmDqpCAxI" 
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-5 h-5 bg-[#fea619] rounded-full flex items-center justify-center animate-pulse ring-4 ring-[#fea619]/20">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
            </div>
          </div>
          <div className="p-4 bg-white/50 backdrop-blur-sm rounded-b-2xl flex justify-between items-center">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#002045] mb-0.5">Current Position</p>
              <p className="text-[10px] font-bold text-[#0b1c30]">South China Sea Basin</p>
            </div>
            <span className="material-symbols-outlined text-[#fea619] text-sm animate-bounce">location_on</span>
          </div>
        </div>

        {/* Journey Status (Mobile Scrollable) */}
        <section className="bg-white/50 rounded-3xl p-6 border border-white">
          <h2 className="text-sm font-black text-[#002045] mb-6 uppercase tracking-widest">Active Progress</h2>
          <div className="overflow-x-auto pb-4 mask-fade no-scrollbar">
            <div className="min-w-[640px] relative px-4 pt-4">
              <div className="absolute top-9 left-0 w-full h-[2px] bg-[#dce9ff]"></div>
              <div 
                  className="absolute top-9 left-0 h-[2px] bg-[#002045] transition-all duration-1000" 
                  style={{ width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
              ></div>
              <div className="relative z-10 flex justify-between">
                {STATUS_STEPS.map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 w-24">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ring-[6px] ring-white shadow-sm transition-all duration-500 ${
                      i <= currentStepIdx ? (i === currentStepIdx ? 'bg-[#fea619] text-[#684000] scale-110 shadow-lg' : 'bg-[#002045] text-white') : 'bg-[#dce9ff] text-[#74777f]'
                    }`}>
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: i <= currentStepIdx ? "'FILL' 1" : "" }}>{s.icon}</span>
                    </div>
                    <div className="text-center">
                      <p className={`text-[8px] font-black uppercase tracking-widest leading-tight ${i <= currentStepIdx ? 'text-[#002045]' : 'text-[#74777f]'}`}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Timeline */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-[#002045] uppercase tracking-tighter">Event Log</h2>
            <div className="text-[9px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse border border-green-200">Live Updating</div>
          </div>
          <div className="space-y-0 relative">
            <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-[#dce9ff] rounded-full"></div>
            {history.map((h, i) => {
              const dt = formatDateTime(h.timestamp);
              return (
                <div key={i} className="relative pl-16 pb-12 group last:pb-0">
                  <div className={`absolute left-[27px] top-1 w-3 h-3 rounded-full border-2 border-white z-10 ${i === 0 ? 'bg-[#fea619] scale-150 shadow-lg shadow-[#fea619]/40' : 'bg-[#002045]'}`}></div>
                  <div className={`p-5 rounded-2xl border transition-all ${i === 0 ? 'bg-white border-[#fea619]/30 shadow-xl' : 'bg-white/40 border-slate-100 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black text-[#002045] text-[10px] uppercase tracking-wider">{h.status?.replace('_', ' ')}</h4>
                      <span className="text-[9px] font-black text-[#43474e] bg-[#e5eeff] px-2 py-0.5 rounded uppercase">{dt.time}</span>
                    </div>
                    <p className="text-[10px] text-[#43474e] leading-relaxed font-bold opacity-70">
                      {h.location || (h.status === 'shipped' 
                        ? 'at the Custom Office through international hub terminal.' 
                        : `Shipment arrived at ${shipment.destination_address?.split(',')[0]} regional sorting facility.`)}
                    </p>
                  </div>
                  <span className="absolute left-0 top-1 text-[8px] font-black text-[#002045] uppercase vertical-lr tracking-[0.2em] opacity-30 h-full">{dt.date}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Mobile Action Hub */}
        <div className="bg-[#002045] text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
            <h3 className="text-xl font-black mb-2 tracking-tighter uppercase italic">Customer Hub</h3>
            <p className="text-[11px] text-[#86a0cd] font-bold leading-relaxed mb-6 opacity-80 uppercase tracking-widest">Connect with our dedicated fleet coordinators for real-time adjustments.</p>
            <button className="w-full bg-[#fea619] text-[#684000] font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#fea619]/20 active:scale-95 transition-all">Secure Messaging</button>
        </div>

        {/* Quick Search at Bottom */}
        <section className="pt-4">
          <div className="bg-white/40 border border-slate-100 p-6 rounded-3xl">
            <h3 className="text-[10px] font-black text-[#002045] uppercase tracking-widest mb-4">Track Another Package</h3>
            <QuickSearch 
              inputVal={inputVal} 
              setInputVal={setInputVal} 
              handleSearch={handleSearch} 
              isMobile={true} 
            />
          </div>
        </section>
      </main>

      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl flex justify-around items-center px-4 py-3 pb-8 z-50 border-t border-slate-100 shadow-[0_-4px_30px_rgba(0,0,0,0.05)]">
        <Link to="/" className="flex flex-col items-center justify-center text-[#43474e] flex-1 py-1">
          <span className="material-symbols-outlined text-2xl">home</span>
          <span className="font-black text-[8px] uppercase mt-1 tracking-widest">Home</span>
        </Link>
        <div className="flex-1 flex justify-center">
          <Link to="/tracking" className="flex flex-col items-center justify-center bg-[#002045] text-white rounded-2xl px-6 py-2 shadow-xl shadow-[#002045]/20 ring-4 ring-[#002045]/5">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>query_stats</span>
            <span className="font-black text-[8px] uppercase mt-1 tracking-widest">Track</span>
          </Link>
        </div>
        <Link to="/admin" className="flex flex-col items-center justify-center text-[#43474e] flex-1 py-1">
          <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
          <span className="font-black text-[8px] uppercase mt-1 tracking-widest">Admin</span>
        </Link>
      </nav>
    </div>
  );
}

/* --- Desktop Results (EXISTING REFINED VIEW) --- */
function DesktopResults({ shipment, inputVal, setInputVal, handleSearch }) {
  const currentStepIdx = STATUS_INDEX[shipment.status] ?? 0;
  const history = [...(shipment.status_history || [])].reverse();

  const formatDate = (d) => {
    if (!d) return 'TBD';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (iso) => {
    if (!iso) return { date: '', time: '' };
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase(),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <main className="max-w-7xl mx-auto px-8 py-12 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-5xl font-black tracking-tighter text-[#002045] mb-2 uppercase">{shipment.tracking_id}</h1>
                <p className="text-[#43474e] font-medium tracking-wide text-lg">High-Priority Industrial Shipment</p>
              </div>
              <div className="flex items-center gap-2 bg-[#fea619] px-4 py-2 rounded-full shadow-sm text-[#684000]">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                <span className="font-bold text-[10px] tracking-widest uppercase italic">{shipment.status?.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-[0_12px_40px_rgba(11,28,48,0.06)] relative overflow-hidden group border border-slate-50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#002045]/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div className="space-y-1">
                  <span className="text-[#43474e] text-[10px] font-bold uppercase tracking-widest">Origin</span>
                  <h3 className="text-xl font-bold text-[#002045]">{shipment.origin_address?.split(',')[0]}</h3>
                  <p className="text-sm text-[#43474e]">{shipment.origin_address}</p>
                </div>
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-full h-[2px] bg-[#e5eeff] relative">
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-[#002045] to-[#fea619]" 
                      style={{ width: `${((currentStepIdx + 1) / STATUS_STEPS.length) * 100}%` }}
                    ></div>
                    <span 
                        className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white text-[#fea619] p-1 rounded-full text-xl shadow-sm border border-slate-100" 
                        style={{ fontVariationSettings: "'FILL' 1", left: `${((currentStepIdx + 1) / STATUS_STEPS.length) * 100}%` }}
                    >
                      {shipment.shipping_type === 'air_freight' ? 'flight' : 'sailing'}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[#43474e] text-[10px] font-bold uppercase tracking-widest">Destination</span>
                  <h3 className="text-xl font-bold text-[#002045]">{shipment.destination_address?.split(',')[0]}</h3>
                  <p className="text-sm text-[#43474e]">{shipment.destination_address}</p>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-[#f8f9ff] grid grid-cols-4 gap-6">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[#43474e] mb-1">Est. Delivery</span>
                  <p className="text-[#002045] font-bold text-sm">{formatDate(shipment.estimated_delivery_date)}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[#43474e] mb-1">Weight</span>
                  <p className="text-[#002045] font-bold text-sm">{shipment.reference_number || '14,250 KG'}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[#43474e] mb-1">Carrier</span>
                  <p className="text-[#002045] font-bold text-sm">Ufed Express Logistics</p>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[#43474e] mb-1">Service</span>
                  <p className="text-[#002045] font-bold text-sm underline decoration-[#fea619] decoration-2 underline-offset-4 capitalize">
                    {shipment.shipping_type?.toLowerCase().includes('express') 
                      ? 'Ufed Express' 
                      : `Ufed Express ${shipment.shipping_type?.replace('_', ' ')}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 h-full">
            <div className="bg-[#eff4ff] rounded-xl h-full p-2 overflow-hidden shadow-inner flex flex-col">
              <div className="relative flex-grow rounded-lg overflow-hidden grayscale">
                <img 
                    alt="Map" 
                    className="w-full h-full object-cover opacity-80" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUwaRT4viUHl4uxrsVLQI5TbLkXNmTnsc_-K-FzGKm6utWTeAujnLp0TGlZrhpl7hRqh04hGNkF9SephDkuhyzy3vfc_u_g26OFZbydfWsAwSTvJfmmIqYc4LjsocoivevTIWSPH53tIL9kpy-YNO9qFyx5eT2lvLAZuTkzhbrQaTUNumH9bVVFWjmEwC-vMXlXY1MYHmIrqtuTfWkdQYDjJfnPjdt506NW8xO7Oyeqlbq5lS7zSORNk8_KXluiHFlnkQmDqpCAxI" 
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <div className="w-6 h-6 bg-[#fea619] rounded-full flex items-center justify-center animate-pulse"><div className="w-2 h-2 bg-white rounded-full"></div></div>
                </div>
              </div>
              <div className="p-4 bg-white/50 backdrop-blur-sm rounded-b-lg">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#002045] mb-1">Last Transmission</p>
                <p className="text-sm font-medium text-[#0b1c30]">Lat: 1.2644, Long: 103.8226 (Active Monitoring)</p>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-black text-[#002045] tracking-tight mb-8">Journey Status</h2>
          <div className="relative px-4">
            <div className="absolute top-5 left-0 w-full h-1 bg-[#dce9ff] z-0"></div>
            <div 
                className="absolute top-5 left-0 h-1 bg-[#002045] z-0 transition-all duration-1000" 
                style={{ width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
            ></div>
            <div className="relative z-10 flex justify-between">
              {STATUS_STEPS.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center gap-4 group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm transition-all ${
                    idx <= currentStepIdx ? (idx === currentStepIdx ? 'bg-[#fea619] text-[#684000] scale-110 shadow-lg' : 'bg-[#002045] text-white') : 'bg-[#dce9ff] text-[#74777f]'
                  }`}>
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: idx <= currentStepIdx ? "'FILL' 1" : "" }}>{step.icon}</span>
                  </div>
                  <div className="text-center">
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${idx <= currentStepIdx ? 'text-[#002045]' : 'text-[#74777f]'}`}>{step.label}</p>
                    <p className="text-[9px] text-[#43474e] font-medium">{idx === currentStepIdx ? 'Active Now' : idx < currentStepIdx ? 'Confirm' : 'Pending'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-7">
            <h2 className="text-2xl font-black text-[#002045] tracking-tight mb-8">Event History</h2>
            <div className="space-y-0 relative">
              <div className="absolute left-10 top-0 bottom-0 w-2 bg-[#dce9ff] rounded-full"></div>
              {history.map((entry, idx) => {
                const dt = formatDateTime(entry.timestamp);
                return (
                  <div key={idx} className="relative pl-24 pb-12 group">
                    <div className={`absolute left-[30px] top-1 w-5 h-5 rounded-full border-4 border-white z-10 ${idx === 0 ? 'bg-[#fea619] shadow-lg scale-110' : 'bg-[#002045]'}`}></div>
                    <div className={`p-6 rounded-xl transition-all shadow-sm border ${idx === 0 ? 'bg-white border-l-4 border-l-[#fea619] shadow-md' : 'bg-[#f8f9ff]/50 border-transparent'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-[#002045]">{entry.status?.replace('_', ' ')}</h4>
                        <span className="text-[10px] font-bold text-[#43474e] bg-[#e5eeff] px-2 py-1 rounded">{dt.time}</span>
                      </div>
                      <p className="text-sm text-[#43474e] leading-relaxed">
                        {entry.location || (entry.status === 'shipped' 
                          ? 'at the Custom Office through international hub terminal.' 
                          : 'Processing through international hub terminal.')}
                      </p>
                    </div>
                    <span className="absolute left-0 top-1 text-[10px] font-black text-[#002045] uppercase vertical-lr tracking-tighter opacity-40">{dt.date}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-span-5 flex flex-col gap-6">
            <div className="bg-[#002045] text-white p-8 rounded-2xl shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 opacity-10 grayscale group-hover:scale-110 transition-transform duration-[5s]">
                    <img alt="BG" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1BMAyW6oPiGV-HdmwBn4rRB76CsJhm1n4M4IsF11kzaYO2S-i01UwCtU2zsSip9KTmQ58va7WcRWAsgUS8_yXdEfB2u0XEZz452uUgZlLLsBNRgwYoKxBh8k87egHcPPlBpBugW9F0azuZlFoAUTkBoxjKDdRcfpPRY7cWnkziKJ1pGOSEuwRdbpZDu_28bWneeXNkhJ0vqMy9nDFpgNBBFcuAAdY3UeXob_Um2HR_fjsCYITZL492x7GV_mYUoM5tFdnRQwrIM0" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-4 tracking-tight">Need Express Updates?</h3>
                    <p className="text-[#86a0cd] text-sm leading-relaxed mb-6">Receive real-time push notifications for every milestone change.</p>
                    <div className="flex gap-2">
                        <button className="bg-[#855300] px-6 py-3 rounded-lg text-white font-black text-[10px] uppercase tracking-widest shadow-lg">Enable SMS</button>
                    </div>
                </div>
            </div>

            {/* Desktop Quick Search at Bottom */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-black text-[#002045] uppercase tracking-widest mb-4">Track Another Shipment</h3>
                <QuickSearch inputVal={inputVal} setInputVal={setInputVal} handleSearch={handleSearch} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#eff4ff] p-6 rounded-xl space-y-2">
                    <span className="material-symbols-outlined text-[#855300]" style={{ fontVariationSettings: "'FILL' 1" }}>package_2</span>
                    <h4 className="font-bold text-[#002045] text-sm">Package Details</h4>
                </div>
                <div className="bg-[#eff4ff] p-6 rounded-xl space-y-2">
                    <span className="material-symbols-outlined text-[#855300]" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</span>
                    <h4 className="font-bold text-[#002045] text-sm">Terms</h4>
                </div>
            </div>
          </div>
        </div>
      </main>
  );
}

/* --- ChatWidget Component (STAYS DYNAMIC) --- */
function ChatWidget({ trackingId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    if (!trackingId || !isOpen) return;
    try {
      const res = await api.get(`/messages/${trackingId}`, true);
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data);
    } catch (err) { }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, trackingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !trackingId) return;
    try {
      const res = await api.post('/messages', { tracking_id: trackingId, content: inputText, sender_type: 'user' }, true);
      if (res.ok) {
        const newMessage = await res.json();
        setMessages([...messages, newMessage]);
        setInputText('');
      }
    } catch (err) { }
  };

  return (
    <div className={`fixed bottom-24 md:bottom-8 right-8 z-[60] flex flex-col items-end group shadow-2xl`}>
        {isOpen && (
            <div className="mb-4 w-[calc(100vw-64px)] sm:w-[350px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[480px]">
                <div className="bg-[#002045] p-6 text-white flex justify-between items-center">
                    <div>
                        <h4 className="font-black text-xs tracking-widest uppercase">Support Channel</h4>
                        <p className="text-[9px] opacity-60 font-bold uppercase mt-1">Ref: {trackingId}</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="material-symbols-outlined text-lg">close</button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f8f9ff]">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-xl text-[11px] font-bold ${msg.sender_type === 'user' ? 'bg-[#002045] text-white rounded-tr-none' : 'bg-white text-[#002045] rounded-tl-none border border-slate-100'}`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-50 flex gap-2">
                    <input type="text" className="flex-1 bg-[#f8f9ff] rounded-xl px-4 py-2 text-xs outline-none font-bold" placeholder="Type message..." value={inputText} onChange={(e) => setInputText(e.target.value)} />
                    <button type="submit" className="bg-[#fea619] text-[#684000] w-10 h-10 rounded-xl shadow-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm font-black">send</span>
                    </button>
                </form>
            </div>
        )}

        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 ${isOpen ? 'bg-[#002045] text-white rotate-90' : 'bg-[#fea619] text-[#684000]'}`}
        >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{isOpen ? 'close' : 'chat'}</span>
        </button>
    </div>
  );
}
