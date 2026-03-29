import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/common/PageHeader";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase";
import { User, Mail, Lock, ArrowRight, UserPlus, Loader2 } from "lucide-react"; 

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      navigate("/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message.includes("email-already-in-use") 
        ? "This email is already blooming elsewhere." 
        : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fff5f7]">
      <Navbar />
      <PageHeader title="AUTHENTICATION" />

      <div className="flex-grow flex flex-col items-center py-12 md:py-24 px-4">
        
        {/* Tab Headers: Responsive sizes */}
        <div className="flex items-center gap-6 md:gap-10 mb-10 md:mb-16">
          <Link to="/login" className="text-2xl md:text-3xl font-black text-gray-300 hover:text-pink-400 transition-all uppercase tracking-tighter italic pb-2">
            Login
          </Link>
          <Link to="/register" className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter italic border-b-4 border-pink-500 pb-2">
            Register
          </Link>
        </div>

        {/* Form Container - Responsive Padding & Radius */}
        <div className="w-full max-w-xl p-8 md:p-12 bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-pink-100/50 border border-pink-50 relative overflow-hidden">
          
          {/* Subtle Background Watermark - Hidden on mobile for clarity */}
          <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none hidden sm:block">
             <UserPlus size={220} className="text-pink-900" />
          </div>

          <form onSubmit={handleRegister} className="space-y-8 md:space-y-10 relative z-10">
            {error && (
              <div className="bg-pink-50 text-pink-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest py-3 px-4 rounded-xl text-center italic border border-pink-100">
                {error}
              </div>
            )}

            {/* Full Name Field */}
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2 md:ml-4">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-300" size={18} />
                <Input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  className="h-14 md:h-16 pl-14 pr-6 rounded-2xl border-none bg-[#fff5f7] focus-visible:ring-2 focus-visible:ring-pink-200 text-gray-700 font-bold placeholder:text-gray-300 transition-all text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2 md:ml-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-300" size={18} />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="h-14 md:h-16 pl-14 pr-6 rounded-2xl border-none bg-[#fff5f7] focus-visible:ring-2 focus-visible:ring-pink-200 text-gray-700 font-bold placeholder:text-gray-300 transition-all text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2 md:ml-4">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-300" size={18} />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-14 md:h-16 pl-14 pr-6 rounded-2xl border-none bg-[#fff5f7] focus-visible:ring-2 focus-visible:ring-pink-200 text-gray-700 font-bold placeholder:text-gray-300 transition-all text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="pt-2 md:pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#1a1a1a] hover:bg-pink-500 text-white h-14 md:h-16 rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-gray-200 group italic"
              >
                <span className="flex items-center justify-center gap-3">
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>
                      Create Membership
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </Button>
            </div>
          </form>

          <p className="mt-8 md:mt-10 text-center text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed px-4">
            By registering, you agree to our <span className="text-pink-500 cursor-pointer hover:underline">Terms of Bloom</span> and privacy policy.
          </p>
        </div>

        <p className="mt-12 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 italic text-center">
          Nesviera • Botanical Luxury • Est. 2026
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;