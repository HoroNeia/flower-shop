import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
// ✅ FIX: We are now using this 'auth' import directly
import { auth } from "@/firebase"; 

// 🛑 Your VIP Admin Email List
const ADMIN_EMAILS = [
  "admin1@gmail.com"
];

const AdminProtectedRoute = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // ✅ FIX: Using 'auth' directly here instead of calling getAuth() again
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email && ADMIN_EMAILS.includes(user.email)) {
        // They are logged in AND their email is on the VIP list
        setIsAdmin(true);
      } else {
        // Not logged in, or just a normal customer
        setIsAdmin(false);
      }
      setIsChecking(false);
    });

    return () => unsubscribe();
  }, []); // Removed authInstance dependency for a cleaner hook

  // While Firebase is checking, show a loading screen
  if (isChecking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
        <p className="text-pink-500 font-bold text-xl animate-pulse">Verifying Admin Access...</p>
      </div>
    );
  }

  // If they are an admin, show the Outlet. If not, send to login!
  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminProtectedRoute;