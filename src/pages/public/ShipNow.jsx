import React from 'react';
import { Link } from 'react-router-dom';

export default function ShipNow() {
  return (
    <>

      <main className="max-w-6xl mx-auto px-6 py-12 mb-24 min-h-screen">
        {/* Page Headline */}
        <div className="mb-12 mt-8">
          <h2 className="text-5xl font-black tracking-tight text-[var(--color-primary)] mb-2">Create Shipment</h2>
          <p className="text-[var(--color-on-surface-variant)] text-lg max-w-2xl">Initialize a new logistical movement within the Ufedmill network. Precision starts with data.</p>
        </div>
        
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-16 relative">
          {/* Background Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-[var(--color-surface-container-highest)] -z-10 -translate-y-1/2"></div>
          {/* Step 1: Active */}
          <div className="flex flex-col items-center gap-3 bg-[var(--color-surface)] px-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white shadow-lg ring-4 ring-[var(--color-primary-container)]/20">
              <span className="material-symbols-outlined">person</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)]">Sender</span>
          </div>
          {/* Step 2: Upcoming */}
          <div className="flex flex-col items-center gap-3 bg-[var(--color-surface)] px-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-surface-container-highest)] flex items-center justify-center text-[var(--color-on-surface-variant)]">
              <span className="material-symbols-outlined">location_on</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]">Receiver</span>
          </div>
          {/* Step 3: Upcoming */}
          <div className="flex flex-col items-center gap-3 bg-[var(--color-surface)] px-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-surface-container-highest)] flex items-center justify-center text-[var(--color-on-surface-variant)]">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]">Package</span>
          </div>
          {/* Step 4: Upcoming */}
          <div className="flex flex-col items-center gap-3 bg-[var(--color-surface)] px-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-surface-container-highest)] flex items-center justify-center text-[var(--color-on-surface-variant)]">
              <span className="material-symbols-outlined">credit_card</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]">Review</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Form Section */}
          <div className="lg:col-span-8 bg-[var(--color-surface-container-low)] rounded-3xl p-8 md:p-12 shadow-sm border border-[var(--color-outline-variant)]/5">
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-2">Origin Details</h3>
              <p className="text-sm text-[var(--color-on-surface-variant)]">Provide the precise departure coordinates for this shipment.</p>
            </div>
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] px-1">Full Name</label>
                  <input className="bg-[var(--color-surface-container-high)] border-none border-b-2 border-transparent focus:border-[var(--color-primary)] focus:ring-0 h-14 px-4 rounded-t-lg transition-all outline-none" placeholder="Johnathan Ufedmill" type="text"/>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] px-1">Organization (Optional)</label>
                  <input className="bg-[var(--color-surface-container-high)] border-none border-b-2 border-transparent focus:border-[var(--color-primary)] focus:ring-0 h-14 px-4 rounded-t-lg transition-all outline-none" placeholder="Authority Logistics HQ" type="text"/>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] px-1">Departure Address</label>
                <input className="bg-[var(--color-surface-container-high)] border-none border-b-2 border-transparent focus:border-[var(--color-primary)] focus:ring-0 h-14 px-4 rounded-t-lg transition-all outline-none" placeholder="1245 Velocity Parkway, Tech District" type="text"/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] px-1">City</label>
                  <input className="bg-[var(--color-surface-container-high)] border-none border-b-2 border-transparent focus:border-[var(--color-primary)] focus:ring-0 h-14 px-4 rounded-t-lg transition-all outline-none" placeholder="San Francisco" type="text"/>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] px-1">Postal Code</label>
                  <input className="bg-[var(--color-surface-container-high)] border-none border-b-2 border-transparent focus:border-[var(--color-primary)] focus:ring-0 h-14 px-4 rounded-t-lg transition-all outline-none" placeholder="94105" type="text"/>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] px-1">Country</label>
                  <select className="bg-[var(--color-surface-container-high)] border-none border-b-2 border-transparent focus:border-[var(--color-primary)] focus:ring-0 h-14 px-4 rounded-t-lg transition-all outline-none appearance-none">
                    <option>United States</option>
                    <option>Germany</option>
                    <option>Singapore</option>
                  </select>
                </div>
              </div>
              <div className="pt-8 flex justify-end">
                <button className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-container)] text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 group hover:shadow-xl hover:scale-105 transition-all cursor-pointer" type="button">
                  Save &amp; Continue
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
          
          {/* Side Contextual Card */}
          <div className="lg:col-span-4 space-y-6">
            {/* Map Preview */}
            <div className="bg-[var(--color-surface-container-highest)] rounded-3xl overflow-hidden shadow-sm aspect-square relative border border-[var(--color-outline-variant)]/10">
              <img alt="Logistics Map View" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9wpFLlb8crluFb3Q6C4fgArSoPQdhwuycyuZUzRMcV_sGPcwm89Lw-2HVfiNNnN7RuJjey6WET7GKXfmhMtPYfCmbs3EggvXz8eu89PSi74brBvrkXEIBPWzv83hlxh3eomfta4tbHFrc2Olo7AxuDWSR636IGbEuKV6cm5fKFoH0zZJGAiB6qRZhivQptyhzTvTTWEQgufBs5Zvx3Ct--IB9Z7i29FljQ6X3HlwQAqePi5seA-bvMe2XL677DJC9GZEHAHEnlnM"/>
              <div className="absolute inset-0 bg-[var(--color-primary)]/20 backdrop-blur-[2px]"></div>
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-secondary-container)] animate-pulse"></div>
                  <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-tighter">Live Origin Preview</span>
                </div>
              </div>
            </div>
            
            {/* Info Card */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_12px_40px_rgba(11,28,48,0.06)] border border-[var(--color-surface-container)]">
              <span className="material-symbols-outlined text-[var(--color-secondary)] mb-4 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <h4 className="text-lg font-bold text-[var(--color-primary)] mb-2">Authority Protocol</h4>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">All sender data is encrypted under the Ufedmill Security Framework. Your coordinates are used solely for route optimization.</p>
            </div>
          </div>
        </div>
      </main>

    </>
  );
}
