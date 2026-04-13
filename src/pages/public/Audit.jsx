import React from 'react';

export default function Audit() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with Map */}
      <section className="relative w-full h-[614px] bg-[var(--color-primary)] overflow-hidden">
        <img 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" 
          alt="High-tech stylized world map" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFc5RSeInH2R2LlNR8RqJY5hp_yh6wCDmNPdzKe3ICaE8wVSpdM2nbF3J14ZELZbJv5EtWsRwkwr8IhCLFi1AtmkP8zkmMHQ7xI3-sVusT6eFB8kKxRlFn2nWCO7jM7rHcM6rUhLmoRQK0bDGzaUzZZcyFbt7gg6HWkp3uywbYCpWa4FkgDbDNNWcxSptvcLctalQE3E7pZRSCIX1J3aRs8F5iMeiR1S5RqCPZSfOxH038mdVtpOIFEEwAp22sc20hrCNICD3zRCY"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)] via-transparent to-[var(--color-primary)]/20"></div>
        
        {/* Interactive Markers (Simulated with Tailwind) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* New York Hub */}
          <div className="absolute top-[30%] left-[20%]" title="New York Hub">
            <div className="relative w-3 h-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-secondary)] opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-secondary)]"></span>
            </div>
          </div>
          {/* Rotterdam Hub */}
          <div className="absolute top-[45%] left-[50%]" title="Rotterdam Hub">
            <div className="relative w-3 h-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-secondary)] opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-secondary)]"></span>
            </div>
          </div>
          {/* Shanghai Hub */}
          <div className="absolute top-[35%] left-[80%]" title="Shanghai Hub">
            <div className="relative w-3 h-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-secondary)] opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-secondary)]"></span>
            </div>
          </div>
          {/* Sao Paulo Hub */}
          <div className="absolute top-[70%] left-[35%]" title="Sao Paulo Hub">
            <div className="relative w-3 h-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-secondary)] opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-secondary)]"></span>
            </div>
          </div>
          {/* Singapore Hub */}
          <div className="absolute top-[65%] left-[75%]" title="Singapore Hub">
            <div className="relative w-3 h-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-secondary)] opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-secondary)]"></span>
            </div>
          </div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
          <h2 className="text-white text-5xl md:text-7xl font-sans font-black tracking-tighter mb-4">
            Architectural <span className="text-[var(--color-secondary-container)]">Precision</span>.
          </h2>
          <p className="text-[var(--color-primary-container)] text-lg md:text-xl max-w-2xl font-light leading-relaxed text-white/80">
            Request a comprehensive operational audit. We analyze global flow patterns to identify structural efficiencies in your supply chain.
          </p>
        </div>
      </section>

      {/* Form & Bento Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Quote Request Form Card */}
          <div className="lg:col-span-7 bg-white rounded-xl p-8 md:p-12 shadow-[0_12px_40px_rgba(11,28,48,0.06)] border border-[var(--color-outline-variant)]/10">
            <div className="mb-10">
              <h3 className="text-3xl font-sans font-bold text-[var(--color-primary)] tracking-tight">Audit Parameters</h3>
              <p className="text-[var(--color-on-surface-variant)] mt-2">Submit your logistical profile for immediate command review.</p>
            </div>
            
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]/60">Company Name</label>
                  <input 
                    className="w-full bg-[var(--color-surface-container-high)] border-none border-b-2 border-transparent focus:border-[var(--color-primary)] focus:ring-0 rounded-t-lg p-4 transition-all duration-300 outline-none" 
                    placeholder="Global Dynamics Corp" 
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]/60">Contact Email</label>
                  <input 
                    className="w-full bg-[var(--color-surface-container-high)] border-none border-b-2 border-transparent focus:border-[var(--color-primary)] focus:ring-0 rounded-t-lg p-4 transition-all duration-300 outline-none" 
                    placeholder="logistics@global.com" 
                    type="email"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]/60">Primary Origin</label>
                  <div className="relative">
                    <input 
                      className="w-full bg-[var(--color-surface-container-high)] border-none border-b-2 border-transparent focus:border-[var(--color-primary)] focus:ring-0 rounded-t-lg p-4 pl-12 transition-all duration-300 outline-none" 
                      placeholder="e.g. Port of Ningbo" 
                      type="text"
                    />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)]/40">location_on</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]/60">Final Destination</label>
                  <div className="relative">
                    <input 
                      className="w-full bg-[var(--color-surface-container-high)] border-none border-b-2 border-transparent focus:border-[var(--color-primary)] focus:ring-0 rounded-t-lg p-4 pl-12 transition-all duration-300 outline-none" 
                      placeholder="e.g. Frankfurt Central" 
                      type="text"
                    />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)]/40">flag</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]/60">Shipment Details &amp; Volume</label>
                <textarea 
                  className="w-full bg-[var(--color-surface-container-high)] border-none border-b-2 border-transparent focus:border-[var(--color-primary)] focus:ring-0 rounded-t-lg p-4 transition-all duration-300 outline-none" 
                  placeholder="Describe cargo type, dimensions, and monthly container volume..." 
                  rows="4"
                ></textarea>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-4">
                <button 
                  className="w-full sm:w-auto bg-[var(--color-secondary-container)] hover:bg-[#ffb95f] text-[var(--color-on-secondary-container)] px-10 py-5 rounded-lg font-bold text-sm uppercase tracking-widest hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer" 
                  type="submit"
                >
                  Generate Audit
                  <span className="material-symbols-outlined">analytics</span>
                </button>
                <p className="text-xs text-[var(--color-on-surface-variant)] max-w-[200px] text-center sm:text-left mt-2 sm:mt-0">
                  By submitting, you agree to our Protocol of Governance.
                </p>
              </div>
            </form>
          </div>

          {/* Bento Info Sidebar */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-6">
            
            {/* High Priority Stats Card */}
            <div className="bg-gradient-to-br from-[#002045] to-[#1a365d] rounded-xl p-8 text-white flex flex-col justify-between shadow-lg">
              <div>
                <span className="bg-[#fea619]/20 text-[#fea619] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 inline-block">Real-time Metrics</span>
                <h4 className="text-4xl font-sans font-black tracking-tighter mb-2">99.8%</h4>
                <p className="text-[var(--color-primary-fixed-dim)]/80 text-sm font-light">Authority-verified precision in timeline forecasting for trans-continental routes.</p>
              </div>
              <div className="mt-8 flex gap-2">
                <div className="h-1 flex-1 bg-[var(--color-secondary-container)]"></div>
                <div className="h-1 flex-1 bg-white/20"></div>
                <div className="h-1 flex-1 bg-white/20"></div>
              </div>
            </div>

            {/* Visual Accent Card */}
            <div className="bg-[var(--color-surface-container-low)] rounded-xl overflow-hidden relative group h-48">
              <img 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt="Abstract architectural lines of a modern logistics terminal" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCt6W3jszmMO2KHKuCtjjoEhAUHKeVB_FEW4nnNb-_fn_cdqbW5J2wDqUZWj29MjsYrQz18zT1unvg5Spz8sL78ORrVKPNTY2m_mSLhBphE03mNGaXZimanY6Kcvg3n8iKso1cXqPFCXqgGn7U5DBV1uR6a9-mmqAJoLrlv7iAVBvUYSc8EWVGcjRYEbFeMMgkniaL625S66MXZ_fQ3JcagF5wYPIvEmJR13NkLaOKkvWHBkdKtm8tozLaUCApT1SiIHuvF0z1Pqfc"
              />
              <div className="absolute inset-0 bg-[var(--color-primary)]/40 backdrop-blur-[2px]"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-sans font-bold text-xl leading-tight">Infrastructure integrity at every node.</p>
              </div>
            </div>

            {/* Information Card */}
            <div className="bg-white border border-[var(--color-outline-variant)]/10 rounded-xl p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-[var(--color-secondary-container)] p-3 rounded-xl">
                  <span className="material-symbols-outlined text-[var(--color-on-secondary-container)]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                </div>
                <div>
                  <h5 className="text-[var(--color-primary)] font-bold">The Ufedmill Guarantee</h5>
                  <p className="text-[var(--color-on-surface-variant)] text-sm mt-1">Every audit is performed by senior logistics architects with a minimum of 15 years operational tenure.</p>
                </div>
              </div>
              <div className="pt-6 border-t border-[var(--color-surface-container-high)]">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-sm text-[var(--color-primary)] font-medium">
                    <span className="material-symbols-outlined text-[var(--color-secondary)] text-lg">check_circle</span>
                    Zero-Hidden-Fee Protocol
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[var(--color-primary)] font-medium">
                    <span className="material-symbols-outlined text-[var(--color-secondary)] text-lg">check_circle</span>
                    24-Hour Command Review
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[var(--color-primary)] font-medium">
                    <span className="material-symbols-outlined text-[var(--color-secondary)] text-lg">check_circle</span>
                    Global Compliance Verified
                  </li>
                </ul>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </main>
  );
}
