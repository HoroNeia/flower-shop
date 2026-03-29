import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/common/PageHeader";
import { Link, useNavigate } from "react-router-dom";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  sendPasswordResetEmail // 🌟 Added this for recovery
} from "firebase/auth";
import { auth } from "@/firebase";
import { Eye, EyeOff, Lock, Mail, ArrowRight, X } from "lucide-react"; // 🌟 Added X icon

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🌟 FORGOT PASSWORD MODAL STATES
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); 
    } catch {
      setError("Invalid credentials. Please verify your bloom account.");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch {
      setError("Google authentication failed.");
    }
  };

  // 🌟 FIREBASE PASSWORD RESET FUNCTION
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetMessage("");
    setIsResetting(true);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("Recovery link sent! Please check your email inbox to safely update your security key.");
      
      // Auto-close modal after a few seconds of success
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setResetMessage("");
        setResetEmail("");
      }, 4000);
    } catch {
      setResetError("Failed to send recovery email. Please ensure the email is registered.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fff5f7]">
      <Navbar />
      <PageHeader title="AUTHENTICATION" />

      <div className="flex-grow flex flex-col items-center py-12 md:py-24 px-4">
        
        {/* Tab Headers: Login | Register */}
        <div className="flex items-center gap-6 md:gap-10 mb-10 md:mb-16">
          <Link to="/login" className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter italic border-b-4 border-pink-500 pb-2">
            Login
          </Link>
          <Link to="/register" className="text-2xl md:text-3xl font-black text-gray-300 hover:text-pink-400 transition-all uppercase tracking-tighter italic pb-2">
            Register
          </Link>
        </div>

        {/* Form Container - Responsive Padding */}
        <div className="w-full max-w-xl p-8 md:p-12 bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-pink-100/50 border border-pink-50 relative overflow-hidden">
          
          {/* Subtle Background Accent */}
          <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none hidden sm:block">
             <Lock size={200} className="text-pink-900" />
          </div>

          <form onSubmit={handleLogin} className="space-y-8 md:space-y-10 relative z-10">
            {error && (
              <div className="bg-pink-50 text-pink-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest py-3 px-4 rounded-xl text-center italic border border-pink-100">
                {error}
              </div>
            )}

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
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2 md:ml-4">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-300" size={18} />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-14 md:h-16 pl-14 pr-14 rounded-2xl border-none bg-[#fff5f7] focus-visible:ring-2 focus-visible:ring-pink-200 text-gray-700 font-bold placeholder:text-gray-300 transition-all text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-pink-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded-md border-pink-100 accent-pink-500 shrink-0" />
                <span className="group-hover:text-pink-500 transition-colors">Keep me signed in</span>
              </label>
              
              {/* 🌟 UPDATED FORGOT PASSWORD BUTTON */}
              <button 
                type="button" 
                onClick={() => setIsForgotModalOpen(true)}
                className="hover:text-pink-500 transition-all italic underline underline-offset-4 decoration-pink-200"
              >
                Forgot Password?
              </button>
            </div>

            <div className="pt-2 md:pt-4">
              <Button 
                type="submit" 
                className="w-full bg-[#1a1a1a] hover:bg-pink-500 text-white h-14 md:h-16 rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-gray-200 group italic"
              >
                <span className="flex items-center justify-center gap-3">
                  Sign into Account
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </form>

          {/* Social Login */}
          <div className="mt-10 md:mt-12 relative z-10">
            <div className="relative flex items-center justify-center mb-8 md:mb-10">
              <span className="absolute bg-white px-4 md:px-6 text-[8px] md:text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] italic">
                Social Gateway
              </span>
              <div className="w-full border-t border-pink-50"></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 md:gap-4 border-2 border-pink-50 py-4 md:py-5 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 hover:bg-[#fff5f7] hover:border-pink-200 transition-all shadow-sm group"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
              Continue with Google
            </button>
          </div>

        </div>

        <p className="mt-12 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 italic text-center">
          Nesviera • Botanical Luxury • Est. 2026
        </p>
      </div>

      {/* 🌟 FORGOT PASSWORD MODAL */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2rem] p-8 md:p-10 w-full max-w-md relative shadow-2xl animate-in zoom-in-95">
            <button 
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-6 right-6 text-gray-300 hover:text-pink-500 transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter italic mb-2">
              Recover Access
            </h2>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">
              We will send a secure reset link to your email.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-6">
              {resetError && (
                <div className="bg-red-50 text-red-500 text-[9px] font-black uppercase tracking-widest py-3 px-4 rounded-xl text-center italic border border-red-100">
                  {resetError}
                </div>
              )}
              {resetMessage && (
                <div className="bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-widest py-3 px-4 rounded-xl text-center italic border border-green-100">
                  {resetMessage}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-300" size={16} />
                  <Input
                    type="email"
                    placeholder="name@example.com" 
                    className="h-14 pl-12 pr-6 rounded-2xl border-none bg-[#fff5f7] focus-visible:ring-2 focus-visible:ring-pink-200 text-gray-700 font-bold placeholder:text-gray-300 text-sm"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isResetting}
                className="w-full bg-pink-500 hover:bg-[#1a1a1a] text-white h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-pink-100 disabled:opacity-50"
              >
                {isResetting ? "Sending..." : "Send Link"}
              </Button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default LoginPage;