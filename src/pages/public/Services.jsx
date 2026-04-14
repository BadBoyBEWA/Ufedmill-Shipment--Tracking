import React from 'react';
import { Link } from 'react-router-dom';

export default function Services() {
  return (
    <main className="w-full">
      {/* Desktop Hero Section (Hidden on Mobile) */}
      <section className="hidden md:flex relative w-full h-[614px] items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover" 
            alt="Ufedmill Logistics Hub" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRFJcO8zLKajyM8684uxz9VSFU6lUImpQ3l-wDHECLpqkpWw4SHIVEHGCten-edfxKE3bneGgJH4Zfq116mK59v11pmMvImglA2pLiPBcrhNoo0cDfWrgYCUdSjR6LeI7G3bW37wMbobnGjBe9aNi7tQncRGnCVvmVHshkqZ4MQJjg_6CdaDud1B9R9yyqfAi_oHWPiIlW4OrRvqNVFNz8SQ2IsXtA5AyvOq6s7kIWRPZPqRbjPbf6v98gmNxF33AboE_Vl-qSoeQ" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#002045] via-[#002045]/80 to-transparent"></div>
        </div>
        <div className="container mx-auto px-8 relative z-10 grid grid-cols-1 md:grid-cols-2">
          <div className="space-y-6">
            <h1 className="text-6xl lg:text-8xl font-black text-white tracking-tight leading-tight">
              Our Logistics <br/> <span className="text-[#fea619]">Ecosystem</span>
            </h1>
            <p className="text-xl text-white/80 max-w-lg font-light leading-relaxed">
              We provide an architectural flow for global trade. From micro-delivery to intercontinental freight, Ufedmill orchestrates every movement with clinical precision.
            </p>
            <div className="flex gap-4">
              <Link to="/ship-now" className="bg-gradient-to-r from-[#002045] to-[#1a365d] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                Schedule Consultation
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Hero Section (Hidden on Desktop) */}
      <section className="md:hidden px-8 pt-12 pb-8 bg-[#002045] text-white">
        <div className="max-w-md">
          <span className="text-[#fea619] font-black text-[10px] uppercase tracking-widest mb-4 block">Our Ecosystem</span>
          <h1 className="font-headline font-black text-4xl tracking-tight leading-tight mb-4">
            Global Logistics <br/><span className="text-[#fea619]">Redefined</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed font-light mb-8">
            Architectural precision in motion, bridging continents with speed and transparency.
          </p>
          <Link to="/ship-now" className="inline-flex items-center gap-2 bg-[#fea619] text-[#001b3c] px-6 py-3 rounded-xl font-bold">
            Get Started <span className="material-symbols-outlined">north_east</span>
          </Link>
        </div>
      </section>

      {/* Service Infrastructure Section */}
      <section className="py-24 bg-[#f8f9ff]">
        <div className="container mx-auto px-6 md:px-8">
          <div className="mb-16">
            <span className="text-[#855300] font-bold tracking-widest text-sm uppercase">Global Solutions</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#002045] mt-2 tracking-tighter">Core Service Infrastructure</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Express Delivery: Span 8 on Desktop */}
            <div className="md:col-span-8 group relative overflow-hidden rounded-[2.5rem] bg-[#eff4ff] p-8 flex flex-col justify-between h-[340px] border border-white transition-all duration-300">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-4xl text-[#fea619] mb-4">bolt</span>
                <h3 className="text-2xl md:text-3xl font-black text-[#002045] mb-2 tracking-tight">Express Delivery</h3>
                <p className="text-[#43474e] max-w-md leading-relaxed text-lg">
                  Time-critical logistics for the modern enterprise. We guarantee sub-24-hour delivery windows across metropolitan hubs using AI-optimized routing.
                </p>
              </div>
              <div className="relative z-10 flex items-center text-[#002045] font-bold gap-2 cursor-pointer group-hover:gap-4 transition-all">
                Explore Network <span className="material-symbols-outlined">trending_flat</span>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 group-hover:opacity-20 transition-opacity hidden md:block">
                <img 
                  className="w-full h-full object-cover grayscale" 
                  alt="Express motion" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy9907WAtIC2uYEyc99JHANNVPuX7WPtf14XKmJG0QO9ln1_U5ByOVqDqiNbv460j3wkcqfTCvj0h-l_79811H6Ber1Th_t9cMdedYMPSZDHCYVEp2QVCvh3Z4F4Q-UmZk-63onJQZyxZogSy7Gm0ufpRAaK3_J_RPT7lPSA1trp6l4PQWzECffmKj2lArHAuGuW7_1nd0G76lfASa4cc1PRpMJ6qlbj1OC0zVxWNIb1apUmwHV9vwV2BB1mZCDrDBVX7FkYtzyVE" 
                />
              </div>
            </div>

            {/* Air Freight: Span 4 on Desktop */}
            <div className="md:col-span-4 bg-[#002045] text-white rounded-[2.5rem] p-8 flex flex-col justify-between h-[340px] transition-all duration-300">
              <div>
                <span className="material-symbols-outlined text-4xl text-[#fea619] mb-4">flight_takeoff</span>
                <h3 className="text-2xl font-black mb-2 tracking-tight">Air Freight</h3>
                <p className="text-white/60 leading-relaxed">
                  Global reach at terminal velocity. Our dedicated air fleet ensures your high-value cargo bypasses the friction of traditional borders.
                </p>
              </div>
              <button className="bg-[#fea619] text-[#001b3c] py-4 rounded-2xl font-black w-full hover:bg-[#ffb95f] transition-colors">
                Request Quote
              </button>
            </div>

            {/* Ocean Freight: Span 4 on Desktop */}
            <div className="md:col-span-4 bg-white rounded-[2.5rem] p-8 flex flex-col justify-between h-[400px] shadow-sm border border-[#e5eeff] transition-all duration-300">
              <div className="w-full h-40 rounded-2xl overflow-hidden mb-4">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Cargo Ship" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJHeROApGj2ClWHOe-mAce0Dt_a1w2wIYOlMJp2gd47RbEhsS1nyJn3SE71IpU7SqqsuO_9dpw8sb-wlUhs_bGViOo7PMhAODQiDzG_7K3_Hknq63XiAPyDJYn94koGxQauJjCMmqFlQbm5S8kx0vhN9yYbpnPP3U9SV4pyt7FZDw9_-OVwgQPadqLW5Y-z7uZ9VUBvYNv0zgCDcSF4IGndC-SedEE7R7T31f5epRLcF_3JFwZiLXvJoIdIIldWaD3D0KNu-4-2GY" 
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-[#002045]">directions_boat</span>
                  <h3 className="text-2xl font-black text-[#002045] tracking-tight">Ocean Freight</h3>
                </div>
                <p className="text-[#43474e] text-sm leading-relaxed">Large scale transit for global volume. Cost-effective, sustainable maritime lanes for heavy industrial cargo.</p>
              </div>
            </div>

            {/* Warehouse Solutions: Span 4 on Desktop */}
            <div className="md:col-span-4 bg-[#eff4ff] rounded-[2.5rem] p-8 flex flex-col justify-between h-[400px] border border-white transition-all duration-300">
              <div>
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                  <span className="material-symbols-outlined text-2xl text-[#fea619]">inventory_2</span>
                </div>
                <h3 className="text-2xl font-black text-[#002045] mb-4 tracking-tight">Warehouse Solutions</h3>
                <ul className="space-y-4 text-[#43474e] font-medium">
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[#fea619] text-lg">check_circle</span> Automated Inventory Tracking</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[#fea619] text-lg">check_circle</span> Climate Controlled Storage</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[#fea619] text-lg">check_circle</span> Last-Mile Integration</li>
                </ul>
              </div>
              <div className="mt-auto pt-6 border-t border-[#002045]/5">
                <span className="text-[#002045] font-black text-sm cursor-pointer hover:underline">View 14 Global Sites</span>
              </div>
            </div>

            {/* Global Customs Brokerage: Span 4 on Desktop */}
            <div className="md:col-span-4 bg-gradient-to-br from-[#1a365d] to-[#002045] text-white rounded-[2.5rem] p-8 flex flex-col justify-between h-[400px] shadow-2xl transition-all duration-300">
              <div>
                <span className="material-symbols-outlined text-4xl text-[#fea619] mb-4">gavel</span>
                <h3 className="text-2xl font-black mb-2 tracking-tight">Global Customs</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-8">
                  Navigate the complexity of international trade law. Our legal experts ensure seamless transition across 180+ jurisdictions with zero compliance friction.
                </p>
              </div>
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="text-[10px] uppercase tracking-widest text-[#fea619] font-black mb-1">Status</div>
                <div className="text-sm font-bold">Fully Bonded & Certified</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contextual CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-8">
          <div className="bg-[#eff4ff] rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 border border-[#dce9ff]">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black text-[#002045] mb-6 tracking-tighter">Ready to optimize your supply chain?</h2>
              <p className="text-[#43474e] text-lg leading-relaxed">Connect with our logistics architects to design a bespoke movement plan tailored to your business needs.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
              <Link to="/audit" className="bg-[#fea619] text-[#001b3c] px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-xl shadow-[#fea619]/20 text-center">
                Get A Free Audit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
