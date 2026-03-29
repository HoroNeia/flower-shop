import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/common/PageHeader";
import { 
  Phone, 
  MapPin, 
  Mail,
  Facebook, 
  Instagram, 
  Send,
  Loader2,
  CheckCircle2
} from "lucide-react";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";

const ContactUs = () => {
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      
      await addDoc(collection(db, "orders"), {
        type: "contact", 
        title: "New Contact Inquiry",
        message: formData.message,
        customerInfo: {
          email: formData.email,
          firstName: formData.name,
          lastName: "(Contact Form)"
        },
        customRequest: {
          subject: formData.subject,
          details: formData.message
        },
        status: "New",
        createdAt: serverTimestamp(),
      });

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans overflow-x-hidden">
      <Navbar />
      <PageHeader title="GET IN TOUCH" />

      
      <div className="max-w-7xl w-full mx-auto px-4 md:px-6 mt-10 md:mt-20">
        <div className="w-full h-[300px] md:h-[500px] bg-gray-100 overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-gray-100">
          <iframe
            title="Nesviera Shop Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3855.975440614833!2d120.7547!3d14.9392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDU2JzIxLjEiTiAxMjDCsDQ1JzE2LjkiRQ!5e0!3m2!1sen!2sph!4v1620000000000!5m2!1sen!2sph"
            className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700 contrast-[0.8] brightness-[1.1]"
            loading="lazy"
          />
        </div>
      </div>

      <main className="max-w-7xl w-full mx-auto px-4 md:px-6 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
          
          
          <div className="lg:col-span-4 flex flex-col space-y-10 md:space-y-12">
            <div>
              <span className="text-pink-500 font-black text-[8px] md:text-[10px] uppercase tracking-[0.3em] mb-4 block italic">
                Our Studio
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tighter uppercase italic leading-none">
                Contact<br className="hidden md:block"/> Details
              </h2>
            </div>
            
            <div className="space-y-6 md:space-y-8">
              <ContactInfoItem 
                icon={<Phone className="w-4 h-4 md:w-5 md:h-5" />} 
                title="Phone Number" 
                lines={["+63 917 983 8218", "+63 998 404 7156"]} 
              />
              <ContactInfoItem 
                icon={<Mail className="w-4 h-4 md:w-5 md:h-5" />} 
                title="Email Support" 
                lines={["Mmaglaqui31@gmail.com"]} 
              />
              <ContactInfoItem 
                icon={<MapPin className="w-4 h-4 md:w-5 md:h-5" />} 
                title="Visit Us" 
                lines={["Blue Arcade Bldg., San Vicente,", "Apalit, Pampanga"]} 
              />
            </div>

            <div className="pt-8 md:pt-10 border-t border-gray-100">
              <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Connect with us</h3>
              <div className="flex gap-6 text-gray-800">
                
                <SocialIcon 
                  link="https://www.facebook.com/nesvierasflowershop" 
                  icon={<Facebook size={18} />} 
                />
                <SocialIcon icon={<Instagram size={18} />} />
              </div>
            </div>
          </div>

          
          <div className="lg:col-span-8 bg-[#fdfdfd] p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] border border-gray-50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 md:p-12 opacity-5 text-gray-200 pointer-events-none">
              <Send size={150} />
            </div>

            <div className="relative z-10">
              <h2 className="text-xl md:text-2xl font-black text-gray-800 mb-8 md:mb-10 uppercase tracking-tight italic">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                {status === "success" ? (
                  <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mb-6 border-2 border-green-100">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-xl font-black uppercase italic text-gray-800 tracking-tighter">Inquiry Sent</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">We will bloom in your inbox soon.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <div className="space-y-2">
                        <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Identity</label>
                        <input 
                          required
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="e.g. Maria Clara" 
                          className="w-full bg-white border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-5 text-sm focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-50 transition-all font-bold text-gray-700 shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Terminal</label>
                        <input 
                          required
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="maria@example.com" 
                          className="w-full bg-white border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-5 text-sm focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-50 transition-all font-bold text-gray-700 shadow-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                      <input 
                        required
                        type="text" 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        placeholder="How can we help?" 
                        className="w-full bg-white border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-5 text-sm focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-50 transition-all font-bold text-gray-700 shadow-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">The Manifest (Message)</label>
                      <textarea 
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Tell us about your floral needs..." 
                        rows={4}
                        className="w-full bg-white border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-5 text-sm focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-50 transition-all font-bold text-gray-700 resize-none shadow-sm"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <button 
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full md:w-auto bg-[#1a1a1a] text-white px-10 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] hover:bg-pink-500 hover:-translate-y-1 transition-all duration-300 shadow-xl flex items-center justify-center gap-4 group disabled:bg-gray-200 italic"
                      >
                        {status === "loading" ? (
                          <Loader2 className="animate-spin" size={14} />
                        ) : (
                          <>
                            CONTACT
                            <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};


const ContactInfoItem = ({ icon, title, lines }: { icon: React.ReactNode, title: string, lines: string[] }) => (
  <div className="flex items-start gap-4 md:gap-6 group">
    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 text-pink-500 shadow-sm group-hover:bg-pink-500 group-hover:text-white transition-all duration-500">
      {icon}
    </div>
    <div className="flex flex-col pt-0.5 md:pt-1">
      <h4 className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</h4>
      {lines.map((line, i) => (
        <p key={i} className="text-gray-700 font-bold text-xs md:text-[15px] leading-tight italic">{line}</p>
      ))}
    </div>
  </div>
);

const SocialIcon = ({ icon, link }: { icon: React.ReactNode, link?: string }) => (
  <a 
    href={link || "#"} 
    target="_blank" 
    rel="noopener noreferrer"
    className="cursor-pointer text-gray-400 hover:text-pink-500 hover:scale-110 transition-all duration-300"
  >
    {icon}
  </a>
);

export default ContactUs;