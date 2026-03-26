import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// 👇 Make sure this path correctly points to your firebase config file!
import { auth } from "@/firebase"; 

// 🛑 Your VIP Admin Email List
const ADMIN_EMAILS = [
  "admin1@gmail.com"
];

const AdminProtectedRoute = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const authInstance = getAuth(); // Or use your imported 'auth' directly depending on your setup

  useEffect(() => {
    // Listens to Firebase to see exactly who is logged in right now
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
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
  }, [authInstance]);

  // While Firebase is checking, show a loading screen so it doesn't instantly kick them out
  if (isChecking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
        <p className="text-pink-500 font-bold text-xl animate-pulse">Verifying Admin Access...</p>
      </div>
    );
  }

  // If they are an admin, show the Outlet (the admin dashboard). If not, send to login!
  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminProtectedRoute;