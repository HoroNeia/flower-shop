import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/common/PageHeader";
import ProductTabs from "@/components/product/ProductTabs";
import ProductCard from "@/components/shop/ProductCard";
import { Facebook, Twitter, Instagram, Minus, Plus, Share2, Loader2, ChevronRight } from "lucide-react";

// Services and Context
import { getProductById, getProducts } from "@/services/productService";
import { Product } from "@/types/product";
import { useCart } from "@/context/useCart";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getProductById(id);
        if (data) {
          setProduct(data);
          setSelectedImage(data.imageUrl);
          
          const allProds = await getProducts();
          const related = allProds
            .filter((p) => p.category === data.category && p.id !== id)
            .slice(0, 4); 
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0); 
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-pink-500" size={48} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Product</p>
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <PageHeader title="NOT FOUND" />
        <div className="text-center py-40 px-6">
           <h2 className="text-2xl font-black text-gray-800 uppercase italic">Product not found</h2>
           <button onClick={() => navigate("/shop")} className="mt-6 text-pink-500 font-black uppercase text-[10px] underline underline-offset-4 tracking-widest">Return to Shop</button>
        </div>
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, qty);
    window.dispatchEvent(new Event('open-mini-cart'));
  };

  return (
    <div className="bg-white">
      <Navbar />
      <PageHeader title={product.name} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-20">
        {/* 🌟 RESPONSIVE GRID: Tightened gap for mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          
          {/* LEFT SIDE: Visuals */}
          <div className="space-y-4 md:space-y-6">
            <div className="relative aspect-[4/5] bg-[#fcfcfc] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-gray-100 group shadow-sm">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {product.sale && (
                <span className="absolute top-4 left-4 bg-[#1a1a1a] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                  -{product.sale}%
                </span>
              )}
            </div>

            {/* Gallery Thumbnails: Mobile scrollable */}
            {product.gallery && product.gallery.length > 0 && (
              <div className="flex lg:grid lg:grid-cols-4 gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
                {[product.imageUrl, ...product.gallery].map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square w-20 md:w-auto shrink-0 rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImage === img ? "border-pink-500 scale-95" : "border-transparent opacity-60"
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Details */}
          <div className="flex flex-col justify-center">
            <span className="text-pink-500 font-black text-[8px] md:text-[10px] uppercase tracking-[0.3em] mb-3 md:mb-4 block italic">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-gray-800 uppercase tracking-tighter italic leading-tight mb-4 md:mb-6">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
              <span className="text-2xl md:text-3xl font-black text-pink-500">₱{product.price.toLocaleString()}</span>
              {product.oldPrice && (
                <span className="text-lg md:text-xl font-medium text-gray-300 line-through italic">₱{product.oldPrice.toLocaleString()}</span>
              )}
            </div>

            {/* Rating Section */}
            <div className="flex items-center gap-1.5 text-yellow-400 mb-6 md:mb-8">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-sm ${i < (product.rating || 5) ? "fill-current" : "text-gray-200"}`}>★</span>
              ))}
              <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mt-0.5 border-l border-gray-100 pl-3">
                Premium Bloom
              </span>
            </div>

            <p className="text-gray-500 leading-relaxed md:leading-loose font-medium text-sm md:text-lg mb-8 md:mb-10 max-w-xl">
              {product.description || "A curated botanical masterpiece designed for your most precious moments."}
            </p>

            {/* Color & Size */}
            <div className="space-y-6 md:space-y-8 border-t border-gray-100 pt-8 md:pt-10">
              <div className="flex flex-wrap items-center gap-8 md:gap-12">
                <div>
                  <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Colorway</p>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border shadow-inner" style={{ backgroundColor: product.color?.toLowerCase() }} />
                    <span className="text-[10px] md:text-xs font-black text-gray-800 uppercase tracking-tight">{product.color}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Arrangement Size</p>
                  <span className="text-[10px] md:text-xs font-black text-gray-800 uppercase px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">{product.size}</span>
                </div>
              </div>

              {/* Add to Bag: Responsive Stack */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <div className="flex items-center justify-between sm:justify-start bg-gray-50 rounded-2xl p-1 border border-gray-100 shadow-inner">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-4 hover:text-pink-500 transition-colors"><Minus size={16}/></button>
                  <span className="w-12 text-center font-black text-gray-800">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="p-4 hover:text-pink-500 transition-colors"><Plus size={16}/></button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#1a1a1a] text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-pink-500 transition-all shadow-xl italic"
                >
                  Add to Bag
                </button>
              </div>
            </div>

            {/* Share & Icons */}
            <div className="mt-10 md:mt-12 flex items-center justify-between sm:justify-start gap-6 pt-8 border-t border-dashed border-gray-100">
               <span className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                 <Share2 size={14} /> <span className="hidden sm:inline">Share Arrangement</span>
               </span>
               <div className="flex gap-5 text-gray-300">
                 <Facebook size={16} className="hover:text-pink-500 cursor-pointer transition-colors" />
                 <Instagram size={16} className="hover:text-pink-500 cursor-pointer transition-colors" />
                 <Twitter size={16} className="hover:text-pink-500 cursor-pointer transition-colors" />
               </div>
            </div>
          </div>
        </div>

        {/* 🌟 POSITION 1: PRODUCT TABS */}
        <div className="mt-16 md:mt-24 border-t border-gray-50">
          <ProductTabs 
            description={product.description} 
            category={product.category} 
            size={product.size} 
          />
        </div>

        {/* 🌟 POSITION 2: RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 md:mt-24 pt-16 md:pt-20 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 md:mb-12">
              <div>
                <span className="text-pink-500 font-black text-[8px] md:text-[10px] uppercase tracking-[0.3em] mb-2 block italic">Complete the Look</span>
                <h3 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tighter italic leading-none">Related Products</h3>
              </div>
              <button 
                onClick={() => navigate("/shop")} 
                className="group text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-pink-500 transition-all flex items-center gap-2 border-b border-transparent hover:border-pink-500 pb-1"
              >
                View Collection <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            {/* 🌟 MOBILE GRID: 2 Columns for better display */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} {...item} id={item.id as string} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;