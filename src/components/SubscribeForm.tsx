import React, { useState, useRef } from "react";
import { Send, CheckCircle2, Loader2, X, UploadCloud, FileText, Image as ImageIcon } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";

const SubscribeForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [customData, setCustomData] = useState({
    name: "",
    details: "",
    budget: "",
  });

  // 🌟 CLOUDINARY CONFIG (Matches your AdminProducts setup)
  const CLOUDINARY_UPLOAD_PRESET = "flowers_preset";
  const CLOUDINARY_CLOUD_NAME = "de92vq1qo";

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      let finalImageUrl = "";

      // 🌟 STEP 1: UPLOAD TO CLOUDINARY IF FILE EXISTS
      if (selectedFile) {
        const data = new FormData();
        data.append("file", selectedFile);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: data }
        );
        const fileData = await response.json();
        finalImageUrl = fileData.secure_url;
      }

      // 🌟 STEP 2: SAVE TO FIRESTORE
      await addDoc(collection(db, "orders"), {
        type: "subscription", 
        title: "Bespoke Customization",
        message: customData.details, // Using message as backup
        imageUrl: finalImageUrl,     // This is what the Admin Modal looks for!
        customerInfo: {
          email: email,
          firstName: customData.name || "Client",
          lastName: "Bespoke"
        },
        customRequest: {
          details: customData.details,
          budget: customData.budget,
          hasAttachment: !!selectedFile
        },
        status: "New",
        createdAt: serverTimestamp(),
      });

      setStatus("success");
      setIsModalOpen(false);
      setEmail("");
      setSelectedFile(null);
      setCustomData({ name: "", details: "", budget: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("idle");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white px-4 md:px-6 pt-4 pb-16 md:pb-24 animate-in fade-in duration-1000">
      <span className="text-pink-500 font-black text-[8px] md:text-[10px] uppercase tracking-[0.4em] mb-3 block italic">
        Bespoke Curation
      </span>
      <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-4 tracking-tighter uppercase italic leading-none text-center">
        Stay in Bloom
      </h2>
      
      <p className="text-gray-400 mb-8 md:mb-10 text-center text-[10px] md:text-sm font-bold uppercase tracking-[0.15em] md:tracking-widest max-w-[280px] md:max-w-md leading-relaxed">
        If you want to customize your arrangement, just email us at <span className="text-pink-400">blooms@nesviera.com</span>
      </p>

      <form onSubmit={handleSubscribeSubmit} className="w-full max-w-lg">
        <div className="relative group">
          <input
            type="email"
            required
            disabled={status === "success"}
            placeholder={status === "success" ? "" : "Enter your email address"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b-2 border-gray-100 focus:border-pink-500 outline-none py-4 text-sm md:text-lg text-gray-700 placeholder:text-gray-300 text-center bg-transparent transition-all font-bold uppercase tracking-tighter disabled:opacity-0"
          />
          
          {status === "success" && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 text-green-500 animate-in zoom-in duration-300">
              <CheckCircle2 size={18} className="md:w-5 md:h-5" />
              <span className="font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em]">Manifest Sent to Terminal</span>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={status !== "idle"}
            className="w-full sm:w-auto group relative overflow-hidden bg-[#1a1a1a] text-white font-black px-12 py-5 rounded-2xl hover:bg-pink-500 transition-all duration-500 text-[9px] md:text-[10px] tracking-[0.3em] uppercase shadow-xl italic"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
               Customize now
               <Send size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </form>

      {/* CUSTOMIZATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 w-full max-w-2xl shadow-2xl relative border border-gray-50 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-pink-500 transition-colors">
              <X size={24} />
            </button>
            
            <div className="mb-10">
              <span className="text-pink-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block italic text-center">Bespoke Manifest</span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tighter italic leading-none text-center">Custom Order Detail</h2>
            </div>
            
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Identity</label>
                  <input required className="w-full bg-gray-50 border-none p-4 rounded-2xl font-black text-gray-700 uppercase italic shadow-inner outline-none" placeholder="YOUR NAME" value={customData.name} onChange={(e) => setCustomData({...customData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Proposed Budget</label>
                  <input className="w-full bg-gray-50 border-none p-4 rounded-2xl font-black text-pink-500 shadow-inner outline-none" placeholder="₱ 0.00" value={customData.budget} onChange={(e) => setCustomData({...customData, budget: e.target.value})} />
                </div>
              </div>

              {/* UPLOAD UI */}
              <div onClick={() => fileInputRef.current?.click()} className="p-8 bg-pink-50/20 rounded-[2.5rem] border-2 border-dashed border-pink-100 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-pink-50/40 transition-all">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-pink-200 shadow-sm transition-all group-hover:scale-110">
                  {selectedFile ? <ImageIcon size={24} className="text-pink-500" /> : <UploadCloud size={24} />}
                </div>
                <p className="text-[9px] font-black text-pink-400 uppercase tracking-widest text-center">
                  {selectedFile ? selectedFile.name : "Attach Inspiration Image"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                <textarea required className="w-full bg-gray-50 border-none p-6 rounded-[2rem] h-32 outline-none font-medium text-sm shadow-inner resize-none" placeholder="Floral vision details..." value={customData.details} onChange={(e) => setCustomData({...customData, details: e.target.value})} />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] italic">Discard</button>
                <button type="submit" disabled={status === "loading"} className="px-12 py-4 bg-[#1a1a1a] text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl transition-all">
                  {status === "loading" ? <Loader2 className="animate-spin" size={16} /> : "Commit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscribeForm;