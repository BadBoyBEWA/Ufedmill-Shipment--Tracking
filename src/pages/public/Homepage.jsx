import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Homepage() {
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      navigate(`/tracking?id=${trackingNumber}`);
    }
  };

  return (
    <>
      <main className="w-full">
        {/* Hero Section */}
        <section className="relative min-h-[870px] flex items-center overflow-hidden bg-[var(--color-primary)] px-8 w-full">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)]/80 to-transparent z-10"></div>
            <img className="w-full h-full object-cover" alt="Hero background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJiCquf5uPIgpj43jkYokOw5DRtkUKfJnBrp8ywpKzFjFG4L3gnGWgxjRHzLUSgTVo3tL02Vg0NQNaxS30dUzLJU7S1BjYDQ499GvSZMr5dOVfkoBG0fT8Wm0fZ00bOhKbRerl0WWzc3V97ytiOP7BLdHediTUx-qGPLQA6CAcw_rjcYy-KhV-68AKGrO7ZNo2IXhNqrxS5NFqS2iKsltR6AFXHivMCMXGpZejx4pHBhZ-T-uaZbycNgM75wgRw32Te801ngDdpKs"/>
          </div>
          <div className="relative z-20 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-secondary-container)]/20 text-[var(--color-secondary-container)] font-bold text-xs tracking-widest uppercase mb-6">Global Network Live</span>
              <h1 className="text-6xl md:text-8xl font-black text-white leading-tight tracking-tighter mb-8">
                Architectural <br/><span className="text-[var(--color-secondary-container)]">Flow.</span>
              </h1>
              <p className="text-xl text-white/70 max-w-xl leading-relaxed mb-10 font-light">
                Precision-engineered logistics for the modern enterprise. We don't just move freight; we orchestrate the global supply chain with surgical accuracy.
              </p>
              
              {/* Tracking Input */}
              <form onSubmit={handleTrack} className="bg-white/10 backdrop-blur-md p-2 rounded-2xl flex items-center shadow-2xl border border-white/10 max-w-2xl">
                <span className="material-symbols-outlined text-white/50 px-4">local_shipping</span>
                <input 
                  className="bg-transparent border-none focus:ring-0 outline-none text-white placeholder-white/40 flex-grow py-4 font-medium" 
                  placeholder="Enter Tracking ID or Waybill Number" 
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
                <button type="submit" className="bg-[var(--color-secondary-container)] hover:bg-[#ffb95f] text-[var(--color-on-secondary-container)] font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg cursor-pointer">
                  Track Shipment
                </button>
              </form>
            </div>
            
            {/* Stats Bento */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10">
                <p className="text-[var(--color-secondary-container)] text-4xl font-black mb-2">99.8%</p>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">On-Time Precision</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 mt-8">
                <p className="text-white text-4xl font-black mb-2">142</p>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Global Ports</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10">
                <p className="text-white text-4xl font-black mb-2">24M</p>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Annual Tons</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 mt-8">
                <p className="text-[var(--color-secondary-container)] text-4xl font-black mb-2">0.04s</p>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">API Latency</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid - Asymmetric Layout */}
        <section className="py-24 px-8 bg-[var(--color-surface)] w-full">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-5xl font-black text-[var(--color-primary)] tracking-tighter mb-6">Our Operations.</h2>
                <p className="text-[var(--color-on-surface-variant)] text-lg">We provide specialized infrastructure for high-velocity distribution, multi-modal transport, and intelligent warehousing.</p>
              </div>
              <Link className="group flex items-center gap-3 text-[var(--color-primary)] font-bold text-sm tracking-widest uppercase pb-2 border-b-2 border-[var(--color-primary)]/10 rounded-sm" to="/services">
                Explore Ecosystem
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Service Card 1 */}
              <div className="group bg-[var(--color-surface-container-low)] p-10 rounded-[2.5rem] hover:bg-[var(--color-primary)] transition-all duration-500 flex flex-col justify-between h-[450px]">
                <div>
                  <div className="w-16 h-16 bg-[var(--color-primary)] group-hover:bg-[var(--color-secondary-container)] rounded-2xl flex items-center justify-center mb-8 transition-colors">
                    <span className="material-symbols-outlined text-white group-hover:text-[var(--color-on-secondary-container)] text-3xl">flight</span>
                  </div>
                  <h3 className="text-3xl font-black text-[var(--color-primary)] group-hover:text-white mb-4 tracking-tight">Priority Air Lift</h3>
                  <p className="text-[var(--color-on-surface-variant)] group-hover:text-white/60">Next-day global delivery for time-critical sensitive assets.</p>
                </div>
                <div className="pt-8 border-t border-[var(--color-outline-variant)]/20 group-hover:border-white/10">
                  <span className="text-xs font-black uppercase tracking-tighter text-[var(--color-secondary)] group-hover:text-[var(--color-secondary-container)]">Status: Operational</span>
                </div>
              </div>
              {/* Service Card 2 (Offset) */}
              <div className="group bg-[var(--color-surface-container-low)] p-10 rounded-[2.5rem] hover:bg-[var(--color-primary)] transition-all duration-500 flex flex-col justify-between h-[450px] md:translate-y-12">
                <div>
                  <div className="w-16 h-16 bg-[var(--color-primary)] group-hover:bg-[var(--color-secondary-container)] rounded-2xl flex items-center justify-center mb-8 transition-colors">
                    <span className="material-symbols-outlined text-white group-hover:text-[var(--color-on-secondary-container)] text-3xl">directions_boat</span>
                  </div>
                  <h3 className="text-3xl font-black text-[var(--color-primary)] group-hover:text-white mb-4 tracking-tight">Oceanic Freight</h3>
                  <p className="text-[var(--color-on-surface-variant)] group-hover:text-white/60">Mass-scale intercontinental maritime routes with live satellite tracking.</p>
                </div>
                <div className="pt-8 border-t border-[var(--color-outline-variant)]/20 group-hover:border-white/10">
                  <span className="text-xs font-black uppercase tracking-tighter text-[var(--color-secondary)] group-hover:text-[var(--color-secondary-container)]">Status: Heavy Traffic</span>
                </div>
              </div>
              {/* Service Card 3 */}
              <div className="group bg-[var(--color-surface-container-low)] p-10 rounded-[2.5rem] hover:bg-[var(--color-primary)] transition-all duration-500 flex flex-col justify-between h-[450px]">
                <div>
                  <div className="w-16 h-16 bg-[var(--color-primary)] group-hover:bg-[var(--color-secondary-container)] rounded-2xl flex items-center justify-center mb-8 transition-colors">
                    <span className="material-symbols-outlined text-white group-hover:text-[var(--color-on-secondary-container)] text-3xl">inventory_2</span>
                  </div>
                  <h3 className="text-3xl font-black text-[var(--color-primary)] group-hover:text-white mb-4 tracking-tight">Smart Warehousing</h3>
                  <p className="text-[var(--color-on-surface-variant)] group-hover:text-white/60">AI-driven inventory management and automated fulfillment centers.</p>
                </div>
                <div className="pt-8 border-t border-[var(--color-outline-variant)]/20 group-hover:border-white/10">
                  <span className="text-xs font-black uppercase tracking-tighter text-[var(--color-secondary)] group-hover:text-[var(--color-secondary-container)]">Status: Automated</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Network Map Section */}
        <section className="py-32 px-8 bg-[var(--color-surface-container-low)] w-full">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-4">
                <h2 className="text-5xl font-black text-[var(--color-primary)] tracking-tighter mb-8 leading-tight">Every Corner. <br/> Every Time.</h2>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <span className="text-[var(--color-secondary-container)] font-black text-xl italic">01.</span>
                    <div>
                      <h4 className="font-bold text-[var(--color-primary)] mb-2">Localized Hubs</h4>
                      <p className="text-sm text-[var(--color-on-surface-variant)]">Primary distribution centers located in 42 strategic global trade zones.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <span className="text-[var(--color-secondary-container)] font-black text-xl italic">02.</span>
                    <div>
                      <h4 className="font-bold text-[var(--color-primary)] mb-2">Quantum Routing</h4>
                      <p className="text-sm text-[var(--color-on-surface-variant)]">Real-time path optimization based on weather, congestion, and geopolitics.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <span className="text-[var(--color-secondary-container)] font-black text-xl italic">03.</span>
                    <div>
                      <h4 className="font-bold text-[var(--color-primary)] mb-2">End-to-End Visibility</h4>
                      <p className="text-sm text-[var(--color-on-surface-variant)]">Complete chain of custody reporting with biometric hand-off validation.</p>
                    </div>
                  </div>
                </div>
                <button type="button" className="mt-12 bg-[var(--color-primary)] text-white font-bold px-10 py-5 rounded-xl shadow-xl hover:bg-[var(--color-primary-container)] transition-all cursor-pointer">
                  View Global Nodes
                </button>
              </div>
              <div className="lg:col-span-8 relative">
                <div className="aspect-video w-full rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,32,69,0.15)] border-8 border-white">
                  <img className="w-full h-full object-cover" alt="Map graphic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHcfkaA-SYSHrxDlkJrS8V6gtvwMwAEkMmtYOZfoocfcPMTi3XwrM8wXJEg1Mq7PiSxejIum-4kM4QAGpgwucZRVVrUsS4X1U-zti0AMTWqBv2ufDDd-FYRgvSWHkFJ-E73fZ8Wn1feKAtKS71yBuJTQ0Jddq0prHaXkZPob3LUEPajyzH8mgwwDfsGMGi0B3PhN-Qd7wMz7fTAtCTfc16QuAulg3-4Uo48Nwu9Yheu4eHQ-GK8lPSQQOn4Zn0rGol_nJWN7wAkTA" />
                  {/* Overlay UI elements for "Map" feel */}
                  <div className="absolute top-8 right-8 flex flex-col gap-3">
                    <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-lg border border-slate-100">
                      <p className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-1">Live Vessels</p>
                      <p className="text-2xl font-black text-[var(--color-secondary)]">3,492</p>
                    </div>
                    <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-lg border border-slate-100">
                      <p className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-1">Active Flights</p>
                      <p className="text-2xl font-black text-[var(--color-secondary)]">812</p>
                    </div>
                  </div>
                </div>
                {/* Floating Accent */}
                <div className="absolute -bottom-10 -left-10 bg-[var(--color-secondary-container)] p-8 rounded-3xl shadow-2xl hidden md:block">
                  <span className="material-symbols-outlined text-[var(--color-on-secondary-container)] text-4xl mb-4">hub</span>
                  <p className="text-[var(--color-on-secondary-container)] font-black text-xl tracking-tight">Decentralized Control</p>
                  <p className="text-[var(--color-on-secondary-container)]/80 text-sm">Autonomous dispatch active</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
