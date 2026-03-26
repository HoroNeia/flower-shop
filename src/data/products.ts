// src/data/products.ts
export const allProducts = Array.from({ length: 45 }).map((_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  image: "https://via.placeholder.com/500x500",
  price: Math.floor(Math.random() * 1000) + 100,
  oldPrice: Math.floor(Math.random() * 1200) + 100,
  rating: Math.floor(Math.random() * 5) + 1,
  sale: Math.floor(Math.random() * 50),
  category: ["Fashion", "Men", "Women", "Electronics", "Flower", "Accessories"][i % 6],
  color: ["White", "Black", "Brown", "Blue"][i % 4],
  size: ["X", "M", "XL", "XXL"][i % 4],
  description: "Example description for the product.",
  gallery: [
    "https://via.placeholder.com/500x500",
    "https://via.placeholder.com/500x500/aaa",
    "https://via.placeholder.com/500x500/bbb",
    "https://via.placeholder.com/500x500/ccc",
  ],
}));