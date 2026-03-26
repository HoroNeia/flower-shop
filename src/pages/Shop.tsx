import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import ShopSidebar from "@/components/shop/ShopSidebar";
import ShopToolbar from "@/components/shop/ShopToolbar";
import ProductCard from "@/components/shop/ProductCard";
import ProductCardList from "@/components/product/ProductCardList"; 
import Pagination from "@/components/shop/Pagination";
import Footer from "@/components/Footer";


import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase"; 
import { Product } from "@/types/product";

const Shop = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;


  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

 
  const [sortOption, setSortOption] = useState("Default");
  const [viewMode, setViewMode] = useState<'grid' | 'large-grid' | 'list'>('grid');

  
  useEffect(() => {
    const fetchAllProducts = async () => {
      setIsLoading(true);
      try {
        
        const metaRef = doc(db, "metadata", "collection_names");
        const metaSnap = await getDoc(metaRef);
        
        
        const collectionNames = metaSnap.exists() ? metaSnap.data().list || ["flowers"] : ["flowers"];

        
        const allProductsPromises = collectionNames.map(async (colName: string) => {
          const querySnapshot = await getDocs(collection(db, colName));
          return querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            databaseCollection: colName, 
            ...doc.data() 
          })) as Product[];
        });

        
        const results = await Promise.all(allProductsPromises);
        const combinedProducts = results.flat();

        setAllProducts(combinedProducts);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  
  const filteredProducts = allProducts.filter((product) => {
    const productName = product.name || "";
    const matchesSearch = productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category || "");
    const matchesColor = selectedColors.length === 0 || selectedColors.includes(product.color || "");
    const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(product.size || "");
    return matchesSearch && matchesCategory && matchesColor && matchesSize;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "Price Low → High") return (a.price || 0) - (b.price || 0);
    if (sortOption === "Price High → Low") return (b.price || 0) - (a.price || 0);
    return 0;
  });

 
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, selectedColors, selectedSizes, viewMode]);

 
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="bg-white min-h-screen">
      <PageHeader title="THE BLOOM SHOP" />

     
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          
          
          <aside className="w-full lg:w-1/4 shrink-0">
            <ShopSidebar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
              selectedSizes={selectedSizes}
              setSelectedSizes={setSelectedSizes}
            />
          </aside>

          
          <main className="flex-1">
            
            <ShopToolbar 
              totalResults={sortedProducts.length}
              showingResults={currentProducts.length}
              sortOption={sortOption}
              setSortOption={setSortOption}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            <div className="mt-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                  <Loader2 className="animate-spin text-pink-500" size={40} />
                  <p className="text-pink-500 font-black uppercase tracking-[0.3em] text-[10px]">Harvesting Blooms...</p>
                </div>
              ) : (
                <>
                  
                  <div className={
                    viewMode === 'list' 
                      ? "flex flex-col gap-4 md:gap-6" 
                      : `grid gap-6 md:gap-8 ${
                          viewMode === 'grid' 
                            ? 'grid-cols-2 md:grid-cols-2 xl:grid-cols-3' 
                            : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' 
                        }`
                  }>
                    {currentProducts.map((product) => (
                      viewMode === 'list' ? (
                        <ProductCardList 
                          key={product.id}
                          {...product}
                          id={product.id as string}
                        />
                      ) : (
                        <ProductCard
                          key={product.id}
                          {...product}
                          id={product.id as string} 
                        />
                      )
                    ))}
                  </div>

                  
                  {currentProducts.length === 0 && (
                    <div className="text-center py-24 border-2 border-dashed border-gray-50 rounded-[3rem]">
                      <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs italic">
                        No bouquets match your refinement.
                      </p>
                    </div>
                  )}

                  
                  {!isLoading && sortedProducts.length > productsPerPage && (
                    <div className="mt-16 md:mt-24 border-t border-gray-50 pt-10">
                      <Pagination
                        totalProducts={sortedProducts.length}
                        productsPerPage={productsPerPage}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;