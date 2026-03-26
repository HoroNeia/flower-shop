export interface Product {
  id: string | number; 
  name: string;
  imageUrl: string; 
  price: number;
  oldPrice?: number;
  rating?: number;
  sale?: number;
  category: string;
  color: string;
  size: string;
  description?: string;
  gallery?: string[];
  stock?: number;
  databaseCollection?: string; 
}