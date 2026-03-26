import { collection, getDocs, doc, getDoc } from "firebase/firestore"; // 👈 Added doc and getDoc
import { db } from "../firebase"; 
import { Product } from "../types/product";

// This is your existing function (keep it!)
export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, "flowers"); 
    const snapshot = await getDocs(productsRef);
    const productsList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    return productsList;
  } catch (error) {
    console.error("Error fetching products: ", error);
    return [];
  }
};

// 🌟 ADD THIS NEW FUNCTION BELOW THE FIRST ONE
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    // 1. Create a reference to the specific document in the "flowers" collection
    const docRef = doc(db, "flowers", id);
    
    // 2. "Get" that document
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // 3. If it exists, return the data + the ID
      return { id: docSnap.id, ...docSnap.data() } as Product;
    } else {
      console.log("No such product found in Firebase!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching single product:", error);
    return null;
  }
};