import React, { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/common/PageHeader";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
// 🌟 Added X icon for closing modal
import { Camera, LogOut, User, Lock, MapPin, Loader2, X } from "lucide-react"; 
import { auth, db } from "@/firebase"; 
import { onAuthStateChanged, signOut, updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const MyAccount = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // --- UI STATES ---
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // 🌟 MODAL STATE FOR BIG IMAGE
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);

  // 🌟 TOAST NOTIFICATION STATES
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // --- ACCOUNT STATES ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  const CLOUDINARY_UPLOAD_PRESET = "flowers_preset"; 
  const CLOUDINARY_CLOUD_NAME = "de92vq1qo";

  // 🌟 TOAST HELPER FUNCTION
  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setEmail(currentUser.email || "");
        setPhotoURL(currentUser.photoURL);

        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setPhone(data.phone || "");
          setCompanyName(data.companyName || "");
          setStreetAddress(data.streetAddress || "");
          setCity(data.city || "");
          setState(data.state || "");
          setZip(data.zip || "");
        }
      } else {
        setPhotoURL(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      const newPhotoURL = data.secure_url;

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: newPhotoURL });
        await setDoc(doc(db, "users", auth.currentUser.uid), { photoURL: newPhotoURL }, { merge: true });
        setPhotoURL(newPhotoURL);
        setSuccess("Profile picture updated!");
        triggerToast("Profile picture updated!", "success"); // 🌟 Added Toast
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Failed to upload image.");
      triggerToast("Failed to upload image.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleAccountUpdate = async () => {
    setError(""); setSuccess("");
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: `${firstName} ${lastName}` });
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          firstName, lastName, email, phone,
          companyName, streetAddress, city, state, zip,
          updatedAt: new Date()
        }, { merge: true });

        if (email !== auth.currentUser.email) await updateEmail(auth.currentUser, email);
        setSuccess("Account information updated!");
        triggerToast("Account information updated!", "success"); // 🌟 Added Toast
      }
    } catch (err) { 
      const message = err instanceof Error ? err.message : String(err);
      setError(message); 
      triggerToast(message, "error");
    }
  };

  const handlePasswordChange = async () => {
    setError(""); setSuccess("");
    if (password !== confirmPassword) { 
      setError("Passwords do not match!"); 
      triggerToast("Passwords do not match!", "error"); // 🌟 Added Toast
      return; 
    }
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, password);
        setSuccess("Password updated successfully!");
        triggerToast("Password updated successfully!", "success"); // 🌟 Added Toast
        setPassword(""); setConfirmPassword("");
      }
    } catch (err) { 
      const message = err instanceof Error ? err.message : String(err);
      setError(message); 
      triggerToast(message, "error");
    }
  };

  // 🌟 NEW: Address Handlers
  const handleAddressEdit = () => {
    // You can expand this later to scroll to the edit fields if needed!
    triggerToast("Address editing enabled! Modify fields above and save.", "success");
  };

  const handleAddressDelete = () => {
    // Clears the UI state. User still needs to hit "Save Changes" to update DB.
    setStreetAddress("");
    setCity("");
    setState("");
    setZip("");
    triggerToast("Address cleared! Click 'Save Changes' to apply.", "error");
  };

  const handleLogout = async () => { await signOut(auth); window.location.href = "/login"; };

  // Profile URL helper to avoid repeating logic
  const currentAvatar = photoURL || `https://ui-avatars.com/api/?name=${firstName || 'User'}&background=fbcfe8&color=be185d&bold=true`;

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc] font-sans relative overflow-x-hidden">
      <Navbar />
      <PageHeader title="MY ACCOUNT" />
      {error && (
        <div className="mx-auto mb-6 w-full max-w-3xl rounded-3xl border border-red-100 bg-red-50 px-6 py-4 text-sm font-black uppercase tracking-[0.3em] text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mx-auto mb-6 w-full max-w-3xl rounded-3xl border border-emerald-100 bg-emerald-50 px-6 py-4 text-sm font-black uppercase tracking-[0.3em] text-emerald-700">
          {success}
        </div>
      )}
      
      {/* 🌟 GLOBAL TOAST NOTIFICATION CONTAINER */}
      <div className={`fixed top-24 right-6 z-[300] transition-all duration-300 ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0 pointer-events-none'}`}>
         <div className={`px-6 py-4 rounded-xl shadow-lg font-black uppercase text-[10px] tracking-widest border-l-4 ${toastType === 'success' ? 'bg-white text-gray-800 border-pink-500' : 'bg-red-500 text-white border-red-700'}`}>
           {toastMessage}
         </div>
      </div>

      <div className="flex-grow flex justify-center py-10 md:py-20">
        <div className="w-full max-w-5xl px-4 md:px-6">
          
          {/* PROFILE HEADER */}
          <div className="flex flex-col items-center mb-10 md:mb-16">
            <div className="relative group">
              {/* CLICKABLE AVATAR AREA */}
              <div 
                onClick={() => setIsImgModalOpen(true)}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-pink-50 relative cursor-zoom-in"
              >
                {uploading && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10 backdrop-blur-sm">
                    <Loader2 className="animate-spin text-white" />
                  </div>
                )}
                <img 
                  src={currentAvatar} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                  alt="Profile" 
                />
              </div>
              
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              
              {/* CAMERA BUTTON */}
              <button 
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                disabled={uploading}
                className="absolute bottom-1 right-1 bg-pink-500 p-2.5 rounded-full text-white cursor-pointer shadow-xl hover:bg-[#1a1a1a] transition-colors border-2 border-white z-20"
              >
                <Camera size={16}/>
              </button>
            </div>
            <h2 className="text-2xl md:text-3xl font-black mt-6 text-gray-800 tracking-tighter uppercase italic">
              Hello, {firstName || "Bloom"}
            </h2>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">{email}</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            
            {/* 1. ACCOUNT INFO */}
            <AccordionItem value="item-1" className="border border-gray-100 rounded-3xl px-4 md:px-8 py-2 bg-white shadow-sm overflow-hidden">
              <AccordionTrigger className="text-[10px] md:text-xs font-black uppercase tracking-widest hover:no-underline text-gray-800">
                <div className="flex items-center gap-3">
                  <User size={14} className="text-pink-500" />
                  1. Edit account information
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-6 md:pt-8 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                    <input className="w-full bg-[#fcfcfc] border border-gray-100 rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-pink-500 transition-all" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                    <input className="w-full bg-[#fcfcfc] border border-gray-100 rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-pink-500 transition-all" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input className="w-full bg-[#fcfcfc] border border-gray-100 rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-pink-500 transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>

                  <div className="md:col-span-2 pt-6 pb-2">
                    <span className="text-[9px] font-black text-pink-500 uppercase tracking-[0.3em] flex items-center gap-4 italic">
                      Billing & Delivery <div className="h-[1px] flex-1 bg-pink-100" />
                    </span>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Company (Optional)</label>
                    <input className="w-full bg-[#fcfcfc] border border-gray-100 rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-pink-500 transition-all" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Street Address</label>
                    <input className="w-full bg-[#fcfcfc] border border-gray-100 rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-pink-500 transition-all" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Town / City</label>
                    <input className="w-full bg-[#fcfcfc] border border-gray-100 rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-pink-500 transition-all" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">State / Province</label>
                    <input className="w-full bg-[#fcfcfc] border border-gray-100 rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-pink-500 transition-all" value={state} onChange={(e) => setState(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Postcode / ZIP</label>
                    <input className="w-full bg-[#fcfcfc] border border-gray-100 rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-pink-500 transition-all" value={zip} onChange={(e) => setZip(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone</label>
                    <input className="w-full bg-[#fcfcfc] border border-gray-100 rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-pink-500 transition-all" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
                <div className="flex justify-center md:justify-end mt-10">
                  <button onClick={handleAccountUpdate} className="w-full md:w-auto bg-[#1a1a1a] text-white px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-pink-500 transition-all shadow-lg italic">
                    Save Changes
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 2. CHANGE PASSWORD */}
            <AccordionItem value="item-2" className="border border-gray-100 rounded-3xl px-4 md:px-8 py-2 bg-white shadow-sm overflow-hidden">
              <AccordionTrigger className="text-[10px] md:text-xs font-black uppercase tracking-widest hover:no-underline text-gray-800">
                <div className="flex items-center gap-3">
                  <Lock size={14} className="text-pink-500" />
                  2. Change security key
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-6 md:pt-8 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-[#fcfcfc] border border-gray-100 rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-pink-500 transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-[#fcfcfc] border border-gray-100 rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-pink-500 transition-all" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                </div>
                <div className="flex justify-center md:justify-end mt-10">
                  <button onClick={handlePasswordChange} className="w-full md:w-auto bg-[#1a1a1a] text-white px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-pink-500 transition-all shadow-lg italic">
                    Update Password
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 3. ADDRESS BOOK */}
            <AccordionItem value="item-3" className="border border-gray-100 rounded-3xl px-4 md:px-8 py-2 bg-white shadow-sm overflow-hidden">
              <AccordionTrigger className="text-[10px] md:text-xs font-black uppercase tracking-widest hover:no-underline text-gray-800">
                <div className="flex items-center gap-3">
                  <MapPin size={14} className="text-pink-500" />
                  3. Primary address entry
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-6 md:pt-8 pb-4">
                <div className="bg-[#fcfcfc] p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="text-sm">
                    <p className="font-black text-gray-800 uppercase tracking-tighter italic">{firstName} {lastName}</p>
                    <p className="text-gray-500 mt-2 font-medium">{streetAddress || "No address saved yet"}</p>
                    <p className="text-gray-400 text-xs mt-1">{city} {state} {zip}</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {/* 🌟 ADDED onClick HANDLERS HERE */}
                    <button 
                      onClick={handleAddressEdit} 
                      className="flex-1 sm:flex-none bg-white border border-gray-100 text-[#1a1a1a] px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-pink-500 transition-all shadow-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={handleAddressDelete}
                      className="flex-1 sm:flex-none bg-[#1a1a1a] text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          <div className="text-center mt-16 md:mt-24 pt-8 border-t border-gray-100 flex flex-col items-center gap-4">
            <button onClick={handleLogout} className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-pink-500 transition-all">
              <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
              Sign out of my account
            </button>
          </div>
        </div>
      </div>

      {/* FULL SCREEN PROFILE IMAGE MODAL */}
      {isImgModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsImgModalOpen(false)}
        >
          <button 
            className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors"
            onClick={() => setIsImgModalOpen(false)}
          >
            <X size={32} />
          </button>
          
          <div 
            className="relative max-w-2xl w-full aspect-square bg-white rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={currentAvatar} 
              className="w-full h-full object-cover" 
              alt="Big Profile" 
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyAccount;