import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5ZknZN2sNDuGnwOFEuckPMheD8TgTqH8",
  authDomain: "flower-shop-44943.firebaseapp.com",
  projectId: "flower-shop-44943",
  storageBucket: "flower-shop-44943.firebasestorage.app",
  messagingSenderId: "599405999409",
  appId: "1:599405999409:web:8165223f4672bfe8c06c10",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;