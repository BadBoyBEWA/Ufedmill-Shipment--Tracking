import React from 'react';
import { Link } from 'react-router-dom';

export default function Services() {
  return (
    <>
      <main className="w-full">
        {/* Hero Section */}
        <section className="relative w-full h-[614px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover" alt="Logistics Flow" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRFJcO8zLKajyM8684uxz9VSFU6lUImpQ3l-wDHECLpqkpWw4SHIVEHGCten-edfxKE3bneGgJH4Zfq116mK59v11pmMvImglA2pLiPBcrhNoo0cDfWrgYCUdSjR6LeI7G3bW37wMbobnGjBe9aNi7tQncRGnCVvmVHshkqZ4MQJjg_6CdaDud1B9R9yyqfAi_oHWPiIlW4OrRvqNVFNz8SQ2IsXtA5AyvOq6s7kIWRPZPqRbjPbf6v98gmNxF33AboE_Vl-qSoeQ"/>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)]/80 to-transparent"></div>
          </div>
          <div className="container mx-auto px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl">
            <div className="space-y-6">
              <h1 className="text-6xl font-black text-white tracking-tight leading-tight">
                Our Logistics <br/> <span className="text-[var(--color-secondary-container)]">Ecosystem</span>
              </h1>
              <p className="text-lg text-white/80 max-w-lg font-light leading-relaxed">
                We provide an architectural flow for global trade. From micro-delivery to intercontinental freight, Ufedmill orchestrates every movement with clinical precision.
              </p>
              <div className="flex gap-4">
                <Link to="/tracking" className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-container)] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform max-w-fit">
                  Track Shipment
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Service Cards Grid Section */}
        <section className="py-24 bg-[var(--color-surface)]">
          <div className="container mx-auto px-8 max-w-7xl">
            <div className="mb-16">
              <span className="text-[var(--color-secondary)] font-bold tracking-widest text-sm uppercase">Global Solutions</span>
              <h2 className="text-4xl font-black text-[var(--color-primary)] mt-2">Core Service Infrastructure</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Service Card 1: Express Delivery */}
              <div className="md:col-span-8 group relative overflow-hidden rounded-3xl bg-[var(--color-surface-container-low)] p-10 flex flex-col justify-between h-[400px]">
                <div className="relative z-10">
                  <span className="material-symbols-outlined text-4xl text-[var(--color-secondary)] mb-4">bolt</span>
                  <h3 className="text-3xl font-black text-[var(--color-primary)] mb-4">Express Delivery</h3>
                  <p className="text-[var(--color-on-surface-variant)] max-w-md leading-relaxed">
                    Time-critical logistics for the modern enterprise. We guarantee sub-24-hour delivery windows across metropolitan hubs using AI-optimized routing.
                  </p>
                </div>
                <div className="relative z-10 flex items-center text-[var(--color-primary)] font-bold gap-2 cursor-pointer group-hover:gap-4 transition-all">
                  Explore Network <span className="material-symbols-outlined">trending_flat</span>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 group-hover:opacity-20 transition-opacity">
                  <img className="w-full h-full object-cover grayscale" alt="Express vehicle" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy9907WAtIC2uYEyc99JHANNVPuX7WPtf14XKmJG0QO9ln1_U5ByOVqDqiNbv460j3wkcqfTCvj0h-l_79811H6Ber1Th_t9cMdedYMPSZDHCYVEp2QVCvh3Z4F4Q-UmZk-63onJQZyxZogSy7Gm0ufpRAaK3_J_RPT7lPSA1trp6l4PQWzECffmKj2lArHAuGuW7_1nd0G76lfASa4cc1PRpMJ6qlbj1OC0zVxWNIb1apUmwHV9vwV2BB1mZCDrDBVX7FkYtzyVE"/>
                </div>
              </div>
              
              {/* Service Card 2: Air Freight */}
              <div className="md:col-span-4 bg-[var(--color-primary)] text-white rounded-3xl p-10 flex flex-col justify-between h-[400px]">
                <div>
                  <span className="material-symbols-outlined text-4xl text-[var(--color-secondary-container)] mb-4">flight_takeoff</span>
                  <h3 className="text-2xl font-bold mb-4">Air Freight</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Global reach at terminal velocity. Our dedicated air fleet ensures your high-value cargo bypasses the friction of traditional borders.
                  </p>
                </div>
                <button type="button" className="bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] py-3 rounded-xl font-bold w-full cursor-pointer hover:bg-[#ffb95f]">Request Quote</button>
              </div>
              
              {/* Service Card 3: Ocean Freight */}
              <div className="md:col-span-4 bg-[var(--color-surface-container-highest)] rounded-3xl p-10 flex flex-col justify-between h-[450px]">
                <div className="w-full h-48 rounded-2xl overflow-hidden mb-6">
                  <img className="w-full h-full object-cover" alt="Ocean ship" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJHeROApGj2ClWHOe-mAce0Dt_a1w2wIYOlMJp2gd47RbEhsS1nyJn3SE71IpU7SqqsuO_9dpw8sb-wlUhs_bGViOo7PMhAODQiDzG_7K3_Hknq63XiAPyDJYn94koGxQauJjCMmqFlQbm5S8kx0vhN9yYbpnPP3U9SV4pyt7FZDw9_-OVwgQPadqLW5Y-z7uZ9VUBvYNv0zgCDcSF4IGndC-SedEE7R7T31f5epRLcF_3JFwZiLXvJoIdIIldWaD3D0KNu-4-2GY"/>
                </div>
                <div>
                  <span className="material-symbols-outlined text-3xl text-[var(--color-primary)] mb-2">directions_boat</span>
                  <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-2">Ocean Freight</h3>
                  <p className="text-[var(--color-on-surface-variant)] text-sm">Large scale transit for global volume. Cost-effective, sustainable maritime lanes for heavy industrial cargo.</p>
                </div>
              </div>
              
              {/* Service Card 4: Warehouse Solutions */}
              <div className="md:col-span-4 bg-[var(--color-surface-container-low)] rounded-3xl p-10 flex flex-col justify-between h-[450px]">
                <div>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                    <span className="material-symbols-outlined text-3xl text-[var(--color-secondary)]">inventory_2</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Warehouse Solutions</h3>
                  <ul className="space-y-3 text-[var(--color-on-surface-variant)] text-sm">
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-[var(--color-secondary)]">check_circle</span> Automated Inventory Tracking</li>
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-[var(--color-secondary)]">check_circle</span> Climate Controlled Storage</li>
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-[var(--color-secondary)]">check_circle</span> Last-Mile Integration</li>
                  </ul>
                </div>
                <div className="mt-auto pt-6 border-t border-[var(--color-primary)]/5">
                  <h5 className="text-[var(--color-primary)] font-bold">The Logistics Guarantee</h5>
                  <span className="text-[var(--color-primary)] font-bold text-sm cursor-pointer hover:underline">View 14 Global Sites</span>
                </div>
              </div>
              
              {/* Service Card 5: Global Customs Brokerage */}
              <div className="md:col-span-4 bg-gradient-to-br from-[var(--color-primary-container)] to-[var(--color-primary)] text-white rounded-3xl p-10 flex flex-col justify-between h-[450px]">
                <div>
                  <span className="material-symbols-outlined text-4xl text-[var(--color-secondary-container)] mb-4">gavel</span>
                  <h3 className="text-2xl font-bold mb-4">Global Customs Brokerage</h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-6">
                    Navigate the complexity of international trade law. Our legal experts ensure seamless transition across 180+ jurisdictions with zero compliance friction.
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="text-[10px] uppercase tracking-widest text-[var(--color-secondary-container)] font-bold mb-1">Status</div>
                  <div className="text-sm font-medium">Fully Bonded &amp; Certified</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contextual CTA Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-8 max-w-7xl">
            <div className="bg-[var(--color-surface-container-low)] rounded-[3rem] p-16 flex flex-col md:flex-row items-center justify-between gap-12 border border-[var(--color-outline-variant)]/10 text-center md:text-left">
              <div className="max-w-xl md:mx-0 mx-auto">
                <h2 className="text-4xl font-black text-[var(--color-primary)] mb-6">Ready to optimize your supply chain?</h2>
                <p className="text-[var(--color-on-surface-variant)] text-lg">Connect with our logistics architects to design a bespoke movement plan tailored to your business needs.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0 mx-auto md:mx-0">
                <Link to="/audit" className="bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-lg shadow-[var(--color-secondary)]/20 cursor-pointer text-center">
                  Get A Free Audit
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
