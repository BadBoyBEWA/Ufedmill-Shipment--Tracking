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
    <main className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen lg:min-h-[870px] flex items-center overflow-hidden bg-[#002045] px-6 py-20 lg:px-8 w-full">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#002045]/80 via-[#002045]/60 to-[#002045] lg:bg-gradient-to-r lg:from-[#002045] lg:via-[#002045]/80 lg:to-transparent z-10"></div>
          <img className="w-full h-full object-cover" alt="Hero background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJiCquf5uPIgpj43jkYokOw5DRtkUKfJnBrp8ywpKzFjFG4L3gnGWgxjRHzLUSgTVo3tL02Vg0NQNaxS30dUzLJU7S1BjYDQ499GvSZMr5dOVfkoBG0fT8Wm0fZ00bOhKbRerl0WWzc3V97ytiOP7BLdHediTUx-qGPLQA6CAcw_rjcYy-KhV-68AKGrO7ZNo2IXhNqrxS5NFqS2iKsltR6AFXHivMCMXGpZejx4pHBhZ-T-uaZbycNgM75wgRw32Te801ngDdpKs"/>
        </div>
        
        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 w-full text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#fea619]/20 text-[#fea619] font-bold text-[10px] lg:text-xs tracking-widest uppercase mb-6">Global Network Live</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tighter mb-8">
              Architectural <br/><span className="text-[#fea619]">Flow.</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10 font-light">
              Precision-engineered logistics for the modern enterprise. We orchestrate the global supply chain with surgical accuracy.
            </p>
            
            {/* Tracking Input */}
            <form onSubmit={handleTrack} className="bg-white/10 backdrop-blur-md p-1.5 lg:p-2 rounded-2xl flex flex-col sm:flex-row items-center shadow-2xl border border-white/10 max-w-2xl mx-auto lg:mx-0 gap-2 sm:gap-0">
              <div className="flex items-center flex-grow w-full px-4">
                <span className="material-symbols-outlined text-white/50">local_shipping</span>
                <input 
                  className="bg-transparent border-none focus:ring-0 outline-none text-white placeholder-white/40 flex-grow py-4 px-3 font-medium text-sm lg:text-base" 
                  placeholder="Enter Tracking ID" 
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full sm:w-auto bg-[#fea619] hover:bg-[#ffb95f] text-[#001b3c] font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg cursor-pointer whitespace-nowrap">
                Track Shipment
              </button>
            </form>
          </div>
          
          {/* Stats Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 w-full max-w-md mx-auto">
            <div className="bg-white/5 backdrop-blur-sm p-6 lg:p-8 rounded-3xl border border-white/10 flex flex-col justify-center items-center lg:items-start">
              <p className="text-[#fea619] text-3xl lg:text-4xl font-black mb-1 lg:mb-2">99.8%</p>
              <p className="text-white/40 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-center lg:text-left">On-Time</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-6 lg:p-8 rounded-3xl border border-white/10 lg:mt-8 flex flex-col justify-center items-center lg:items-start">
              <p className="text-white text-3xl lg:text-4xl font-black mb-1 lg:mb-2">142</p>
              <p className="text-white/40 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-center lg:text-left">Global Ports</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-6 lg:p-8 rounded-3xl border border-white/10 flex flex-col justify-center items-center lg:items-start">
              <p className="text-white text-3xl lg:text-4xl font-black mb-1 lg:mb-2">24M</p>
              <p className="text-white/40 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-center lg:text-left">Annual Tons</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-6 lg:p-8 rounded-3xl border border-white/10 lg:mt-8 flex flex-col justify-center items-center lg:items-start">
              <p className="text-[#fea619] text-3xl lg:text-4xl font-black mb-1 lg:mb-2">0.04s</p>
              <p className="text-white/40 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-center lg:text-left">API Latency</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6 lg:px-8 bg-white w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-16 gap-8 text-center lg:text-left">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-5xl font-black text-[#002045] tracking-tighter mb-6">Our Operations.</h2>
              <p className="text-[#43474e] text-lg">Specialized infrastructure for high-velocity distribution and intelligent warehousing.</p>
            </div>
            <Link className="group flex items-center gap-3 text-[#002045] font-bold text-sm tracking-widest uppercase pb-2 border-b-2 border-[#002045]/10 rounded-sm" to="/services">
              Explore Ecosystem
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Cards */}
            {[
              { icon: 'flight', title: 'Priority Air Lift', desc: 'Next-day global delivery for time-critical sensitive assets with real-time tracking and priority customs clearance. Our dedicated fleet ensures your high-value cargo reaches its destination before the competition even takes off', status: 'Operational', offset: false },
              { icon: 'directions_boat', title: 'Oceanic Freight', desc: 'Mass-scale intercontinental maritime routes with live satellite tracking and AI-optimized shipping lanes. Cost-effective, sustainable ocean freight for heavy industrial cargo spanning 180+ global ports.', status: 'Heavy Traffic', offset: true },
              { icon: 'inventory_2', title: 'Smart Warehousing', desc: 'AI-driven inventory management and automated fulfillment centers with real-time stock visibility. Smart storage solutions featuring climate control, robotic picking, and seamless last-mile integration.', status: 'Automated', offset: false },
            ].map((service, index) => (
              <div 
                key={index}
                className={`group bg-[#eff4ff] p-8 lg:p-10 rounded-[2.5rem] hover:bg-[#002045] transition-all duration-500 flex flex-col justify-between h-[400px] lg:h-[450px] ${service.offset ? 'lg:translate-y-12' : ''}`}
              >
                <div>
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-[#002045] group-hover:bg-[#fea619] rounded-2xl flex items-center justify-center mb-8 transition-colors">
                    <span className="material-symbols-outlined text-white group-hover:text-[#001b3c] text-3xl">{service.icon}</span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-black text-[#002045] group-hover:text-white mb-4 tracking-tight">{service.title}</h3>
                  <p className="text-[#43474e] group-hover:text-white/60 leading-relaxed">{service.desc}</p>
                </div>
                <div className="border-t border-[#002045]/5 group-hover:border-white/10 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-[#855300] group-hover:text-[#fea619]">{service.status}</span>
                  <span className="material-symbols-outlined text-transparent group-hover:text-[#fea619] transition-all transform group-hover:translate-x-1">trending_flat</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Network Map Section */}
      <section className="py-24 lg:py-32 px-6 lg:px-8 bg-[#f8f9ff] w-full">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <h2 className="text-4xl lg:text-5xl font-black text-[#002045] tracking-tighter mb-10 leading-tight text-center lg:text-left">Every Corner. <br/> Every Time.</h2>
              <div className="space-y-10">
                {[
                  { num: '01', title: 'Localized Hubs', desc: 'Distribution centers in 42 strategic global trade zones.' },
                  { num: '02', title: 'Quantum Routing', desc: 'Real-time path optimization based on weather and geopolitics.' },
                  { num: '03', title: 'End-to-End Visibility', desc: 'Complete chain of custody with biometric validation.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <span className="text-[#fea619] font-black text-xl italic leading-none">{item.num}.</span>
                    <div>
                      <h4 className="font-bold text-[#002045] mb-2 text-lg">{item.title}</h4>
                      <p className="text-sm text-[#43474e] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center lg:text-left mt-12">
                <button type="button" className="w-full sm:w-auto bg-[#002045] text-white font-bold px-10 py-5 rounded-2xl shadow-xl hover:bg-[#1a365d] transition-all transform hover:scale-[1.02] cursor-pointer">
                  View Global Nodes
                </button>
              </div>
            </div>
            <div className="lg:col-span-7 relative order-1 lg:order-2">
              <div className="aspect-[4/3] lg:aspect-video w-full rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,32,69,0.12)] border-[6px] lg:border-[8px] border-white relative">
                <img className="w-full h-full object-cover" alt="Map graphic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHcfkaA-SYSHrxDlkJrS8V6gtvwMwAEkMmtYOZfoocfcPMTi3XwrM8wXJEg1Mq7PiSxejIum-4kM4QAGpgwucZRVVrUsS4X1U-zti0AMTWqBv2ufDDd-FYRgvSWHkFJ-E73fZ8Wn1feKAtKS71yBuJTQ0Jddq0prHaXkZPob3LUEPajyzH8mgwwDfsGMGi0B3PhN-Qd7wMz7fTAtCTfc16QuAulg3-4Uo48Nwu9Yheu4eHQ-GK8lPSQQOn4Zn0rGol_nJWN7wAkTA" />
                <div className="absolute inset-0 bg-[#002045]/5"></div>
                
                {/* Overlay UI elements */}
                <div className="absolute top-4 lg:top-8 right-4 lg:right-8 flex flex-col gap-2 lg:gap-3">
                  <div className="bg-white/95 backdrop-blur p-3 lg:p-4 rounded-xl lg:rounded-2xl shadow-lg border border-slate-100">
                    <p className="text-[8px] lg:text-[10px] font-black text-[#002045] uppercase tracking-widest mb-0.5 lg:mb-1">Live Vessels</p>
                    <p className="text-xl lg:text-2xl font-black text-[#855300]">3,492</p>
                  </div>
                  <div className="bg-white/95 backdrop-blur p-3 lg:p-4 rounded-xl lg:rounded-2xl shadow-lg border border-slate-100">
                    <p className="text-[8px] lg:text-[10px] font-black text-[#002045] uppercase tracking-widest mb-0.5 lg:mb-1">Active Flights</p>
                    <p className="text-xl lg:text-2xl font-black text-[#855300]">812</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Accent - Repositioned for mobile overlap or hidden */}
              <div className="absolute -bottom-6 -left-6 lg:-bottom-10 lg:-left-10 bg-[#fea619] p-6 lg:p-8 rounded-[2rem] shadow-2xl z-20 hidden sm:block">
                <span className="material-symbols-outlined text-[#001b3c] text-3xl lg:text-4xl mb-3">hub</span>
                <p className="text-[#001b3c] font-black text-lg lg:text-xl tracking-tight">Decentralized Control</p>
                <p className="text-[#001b3c]/80 text-[10px] lg:text-xs font-bold uppercase tracking-widest">Autonomous dispatch active</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
