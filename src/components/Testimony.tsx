import * as React from "react"
import { useState, useEffect } from "react"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"
import { ChevronRight, Quote } from "lucide-react"
import { useNavigate } from "react-router-dom" // 🌟 New Import

const testimonials = [
  {
    name: "Grace Alvarado",
    role: "Customer",
    text: "Nesviera truly has a gift for curation. Every petal was fresh and the delivery was perfectly on time for our anniversary.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=crop"
  },
  {
    name: "Maria Santos",
    role: "Verified Buyer",
    text: "The arrangement was breathtaking. A harmonious blend of nature's best and playful, elegant balloons.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&auto=crop"
  }
]

const promoFlowers = [
  { title: "Balloons", price: "₱350.00", image: "https://plus.unsplash.com/premium_photo-1681488068521-8912e7d5d5fd?q=80&w=1183&auto=format&fit=crop" },
  { title: "Funerals", price: "₱25,500.00", image: "https://cdn.shopify.com/s/files/1/1162/6338/files/wildflowermemorialflorals_1024x1024.png?v=1735312320" },
  { title: "Bouquets", price: "₱700.00", image: "https://www.floralsilk.co.uk/Images/CategoryBanner/small/bouquets_smallban.jpg" },
]

export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const navigate = useNavigate() // 🌟 Initialize Navigation

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="w-full pt-16 md:pt-32 pb-16 md:pb-20 bg-white flex flex-col items-center overflow-hidden">
      
      {/* 1. CAROUSEL TESTIMONY PART */}
      <div className="relative w-full max-w-5xl px-6 mb-16 md:mb-24 group">
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-700" key={activeIndex}>
          <div className="relative mb-6 md:mb-8">
            <div className="absolute -top-2 -left-2 md:-top-4 md:-left-4 text-pink-100 scale-[2] md:scale-[3]">
                <Quote fill="currentColor" size={24} />
            </div>
            <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-white shadow-2xl relative z-10">
              <AvatarImage src={testimonials[activeIndex].image} alt={testimonials[activeIndex].name} />
              <AvatarFallback>{testimonials[activeIndex].name.substring(0,2)}</AvatarFallback>
            </Avatar>
          </div>
          <p className="max-w-4xl text-center text-gray-500 italic text-lg md:text-2xl leading-relaxed font-medium mb-8 md:mb-10 px-2 md:px-12">
            "{testimonials[activeIndex].text}"
          </p>
          <div className="text-center">
            <h3 className="text-[11px] md:text-[12px] font-black tracking-[0.3em] text-gray-800 uppercase italic">
                {testimonials[activeIndex].name}
            </h3>
            <p className="text-[8px] md:text-[9px] text-pink-400 tracking-[0.4em] mt-2 uppercase font-black">
                {testimonials[activeIndex].role}
            </p>
          </div>
        </div>
      </div>

      {/* 2. THE 3 PROMO BOXES */}
      <div className="w-full max-w-7xl px-4 md:px-6">
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 pb-4 md:grid md:grid-cols-3 md:gap-10 md:pb-0 md:overflow-visible">
          {promoFlowers.map((flower, index) => (
            <div 
              key={index} 
              onClick={() => navigate("/shop")} // 🌟 Logic: Click Card goes to shop
              className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] bg-[#fcfcfc] border border-gray-50 shadow-sm transition-all duration-500 shrink-0 w-[85%] snap-center md:w-full md:snap-align-none"
            >
              {/* Image Layer */}
              <div className="aspect-[16/9] md:aspect-[4/3] overflow-hidden">
                  <img 
                    src={flower.image} 
                    alt={flower.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
              </div>
              
              {/* Text Overlay */}
              <div className="absolute top-6 left-6 md:top-10 md:left-10 z-10">
                <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic drop-shadow-lg mb-1">
                  {flower.title}
                </h3>
                <p className="text-[9px] md:text-[10px] font-black text-white/90 uppercase tracking-[0.2em] bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full w-fit">
                  From <span className="text-pink-300 ml-1">{flower.price}</span>
                </p>
              </div>

              {/* Visual Flare Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* 🌟 ACTION BUTTON (Matches image_2f36ad.jpg) */}
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 transform translate-y-0 md:translate-y-4 opacity-100 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white flex items-center justify-center text-pink-500 shadow-xl hover:bg-pink-500 hover:text-white transition-all">
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 📱 MOBILE INDICATOR */}
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          {promoFlowers.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-pink-200" />
          ))}
        </div>
      </div>
    </section>
  )
}