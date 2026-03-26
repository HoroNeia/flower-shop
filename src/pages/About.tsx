import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/common/PageHeader";
import { Leaf, Heart, Sparkles, Truck } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />
      <PageHeader title="OUR STORY" />

      <main className="flex-1 overflow-hidden">
        {/* HERO INTRODUCTION */}
        <section className="max-w-7xl w-full mx-auto px-6 py-12 md:py-20 text-center space-y-4 md:space-y-6">
          <h2 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tighter uppercase italic leading-none">
            Welcome to Nesviera
          </h2>
          <div className="w-16 md:w-24 h-1 bg-pink-500 mx-auto rounded-full" />
          <p className="max-w-3xl mx-auto text-sm md:text-lg text-gray-500 font-medium leading-relaxed uppercase tracking-wide px-2">
            Nesviera's Blooms is more than just an online flower shop. We are curators of emotion, 
            specializing in delivering the freshest petals and most avant-garde arrangements.
          </p>
        </section>

        {/* MISSION SECTION */}
        <section className="max-w-7xl w-full mx-auto px-6 py-12">
          {/* 🌟 RESPONSIVE GRID: Larger gap on desktop, tighter on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* 🌟 ORDER LOGIC: Image stays on top for mobile (order-1), text below (order-2) */}
            <div className="order-2 md:order-1 animate-in slide-in-from-left duration-700">
              <span className="text-pink-500 font-black text-[8px] md:text-[10px] uppercase tracking-[0.3em] mb-4 block italic">
                The Vision
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-gray-800 mb-6 uppercase tracking-tight italic">
                Our Mission
              </h3>
              <p className="text-gray-500 leading-relaxed md:leading-loose font-medium text-sm md:text-lg">
                To provide high-quality, ethically sourced flowers with exceptional service. 
                We believe in making every moment special—whether it’s a grand wedding or 
                a quiet gesture of "just because."
              </p>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative group">
                <div className="absolute inset-0 bg-pink-100 rounded-[1.5rem] md:rounded-[2rem] transform translate-x-3 translate-y-3 md:translate-x-4 md:translate-y-4 -z-10" />
                <img
                  src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80"
                  alt="Floral Workspace"
                  className="w-full h-[300px] md:h-[500px] object-cover rounded-[1.5rem] md:rounded-[2rem] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* VALUES SECTION (ALTERNATING) */}
        <section className="bg-[#fcfcfc] py-16 md:py-24 my-10 md:my-20">
          <div className="max-w-7xl w-full mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gray-200 rounded-[1.5rem] md:rounded-[2rem] transform -translate-x-3 translate-y-3 md:-translate-x-4 md:translate-y-4 -z-10" />
                  <img
                    src="https://substackcdn.com/image/fetch/$s_!yFKX!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8f344302-f350-47da-957c-213bddb09c77_1080x1080.png"
                    alt="Luxury Flower Arrangement"
                    className="w-full h-[300px] md:h-[500px] object-cover rounded-[1.5rem] md:rounded-[2rem] shadow-2xl"
                  />
                </div>
              </div>
              <div className="animate-in slide-in-from-right duration-700">
                <span className="text-pink-500 font-black text-[8px] md:text-[10px] uppercase tracking-[0.3em] mb-4 block italic">
                  The Core
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-gray-800 mb-6 uppercase tracking-tight italic">
                  Our Values
                </h3>
                <div className="space-y-6">
                  <ValueItem 
                    icon={<Sparkles className="w-4 h-4 md:w-5 md:h-5"/>} 
                    title="Excellence" 
                    desc="Quality and attention to detail are our signatures." 
                  />
                  <ValueItem 
                    icon={<Heart className="w-4 h-4 md:w-5 md:h-5"/>} 
                    title="Passion" 
                    desc="We take pride in every bouquet we create and every smile we deliver." 
                  />
                  <ValueItem 
                    icon={<Leaf className="w-4 h-4 md:w-5 md:h-5"/>} 
                    title="Sustainability" 
                    desc="We work with local growers to ensure fresh, earth-friendly blooms." 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US GRID */}
        <section className="max-w-7xl w-full mx-auto px-6 py-12 md:py-20 text-center">
          <h3 className="text-xl md:text-2xl font-black text-gray-800 mb-10 md:mb-16 uppercase tracking-widest italic">
            Why Nesviera?
          </h3>
          {/* 🌟 RESPONSIVE GRID: 1 col on mobile, 3 on md */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <FeatureBox 
              icon={<Truck className="mx-auto text-pink-500" size={32}/>}
              title="Next Day Delivery"
              desc="Freshness guaranteed from our studio to your doorstep within 24 hours."
            />
             <FeatureBox 
              icon={<Sparkles className="mx-auto text-pink-500" size={32}/>}
              title="Designer's Touch"
              desc="Every arrangement is curated by award-winning floral designers."
            />
             <FeatureBox 
              icon={<Heart className="mx-auto text-pink-500" size={32}/>}
              title="Happiness Promise"
              desc="Not happy with your blooms? We'll replace them, no questions asked."
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// Reusable Components
const ValueItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex gap-4">
    <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-pink-500 h-fit shrink-0">
      {icon}
    </div>
    <div className="text-left">
      <h4 className="font-black text-gray-800 uppercase text-[10px] md:text-xs tracking-widest mb-1">{title}</h4>
      <p className="text-gray-500 text-xs md:text-sm font-medium leading-snug">{desc}</p>
    </div>
  </div>
);

const FeatureBox = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-8 md:p-10 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
    <div className="mb-6">{icon}</div>
    <h4 className="font-black text-gray-800 uppercase text-xs md:text-sm tracking-widest mb-3">{title}</h4>
    <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed">{desc}</p>
  </div>
);

export default About;