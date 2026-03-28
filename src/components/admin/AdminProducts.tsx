import React, { useState, useEffect, useCallback } from "react"; // ✅ Added useCallback
import { 
  Plus, Edit, Trash, X, ChevronLeft, ChevronRight, 
  UploadCloud, Loader2, FolderPlus, FolderMinus, 
  Trash2, Search, Filter
} from "lucide-react";
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, 
  doc, getDoc, setDoc, arrayRemove, arrayUnion, writeBatch 
} from "firebase/firestore"; 
import { db } from "@/firebase"; 

interface Product {
  id?: string;
  name: string;
  description: string;
  category: string;
  color: string;
  size: string;
  imageUrl: string;
  price: number;
  oldPrice: number;
  stock: number;
  sale: number;
  rating: number;
}

const CATEGORIES_LIST = ["Roses", "Tulips", "Sunflowers", "Lilies", "Orchids", "Peonies", "Mixed Bouquets", "Funeral"];
const COLORS_LIST = ["Red", "Pink", "White", "Yellow", "Purple", "Blue", "Orange"];
const SIZES_LIST = ["S", "M", "L", "X", "XL", "XXL"];

const initialFormState: Product = {
  name: "", description: "", category: "Roses", color: "Red", size: "M",
  imageUrl: "", price: 0, oldPrice: 0, stock: 0, sale: 0, rating: 5,
};

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isColModalOpen, setIsColModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'product' | 'collection' | 'bulk', id?: string, name?: string } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<'success' | 'delete'>('success');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Product>(initialFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [collectionsList, setCollectionsList] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const CLOUDINARY_UPLOAD_PRESET = "flowers_preset";
  const CLOUDINARY_CLOUD_NAME = "de92vq1qo";

  const triggerToast = (msg: string, type: 'success' | 'delete' = 'success') => {
    setToastMessage(msg); setToastType(type); setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // ✅ FIX: Wrapped in useCallback to prevent the "Missing Dependency" warning
  const fetchCollectionsMetadata = useCallback(async () => {
    try {
      const metaRef = doc(db, "metadata", "collection_names");
      const metaSnap = await getDoc(metaRef);
      if (metaSnap.exists()) {
        const names = metaSnap.data().list || [];
        setCollectionsList(names);
        if (names.length > 0 && !selectedCollection) setSelectedCollection(names[0]);
      } else {
        const defaultList = ["flowers"];
        await setDoc(metaRef, { list: defaultList });
        setCollectionsList(defaultList);
        setSelectedCollection("flowers");
      }
    } catch (error) { console.error(error); }
  }, [selectedCollection]);

  // ✅ FIX: Wrapped in useCallback to stabilize the function
  const fetchProducts = useCallback(async () => {
    if (!selectedCollection) return;
    try {
      const querySnapshot = await getDocs(collection(db, selectedCollection));
      const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      setProducts(productsData);
      setSelectedProductIds([]);
    } catch (error) { console.error(error); }
  }, [selectedCollection]);

  // ✅ FIX: Dependency arrays now only contain the stable functions
  useEffect(() => { 
    fetchCollectionsMetadata(); 
  }, [fetchCollectionsMetadata]);

  useEffect(() => { 
    setCurrentPage(1); 
    fetchProducts(); 
  }, [fetchProducts]);

  const handleAddCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newCollectionName.trim().toLowerCase().replace(/\s+/g, '_');
    
    if (!trimmedName) return;
    if (collectionsList.includes(trimmedName)) {
      triggerToast("Collection already exists!", "delete");
      return;
    }

    try {
      const metaRef = doc(db, "metadata", "collection_names");
      await updateDoc(metaRef, { list: arrayUnion(trimmedName) });
      setCollectionsList(prev => [...prev, trimmedName]);
      setSelectedCollection(trimmedName);
      setNewCollectionName("");
      setIsColModalOpen(false);
      triggerToast(`Collection '${trimmedName}' created`);
    } catch (error) {
      console.error(error);
      triggerToast("Error creating collection", "delete");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'collection') {
        const metaRef = doc(db, "metadata", "collection_names");
        await updateDoc(metaRef, { list: arrayRemove(selectedCollection) });
        setCollectionsList(prev => prev.filter(c => c !== selectedCollection));
        setSelectedCollection(collectionsList[0] || "flowers");
        triggerToast(`Collection deleted`, 'delete');
      } else if (deleteTarget.type === 'product' && deleteTarget.id) {
        await deleteDoc(doc(db, selectedCollection, deleteTarget.id));
        fetchProducts();
        triggerToast(`Product removed`, 'delete');
      } else if (deleteTarget.type === 'bulk') {
        const batch = writeBatch(db);
        selectedProductIds.forEach((id) => batch.delete(doc(db, selectedCollection, id)));
        await batch.commit();
        setSelectedProductIds([]);
        fetchProducts();
        triggerToast(`Bulk wipe complete`, 'delete');
      }
    } catch (error) { console.error(error); }
    finally { setIsDeleteModalOpen(false); setDeleteTarget(null); }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numberFields = ["price", "oldPrice", "stock", "sale", "rating"];
    setFormData({ ...formData, [name]: numberFields.includes(name) ? (value === "" ? 0 : Number(value)) : value });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalImageUrl = formData.imageUrl;
      if (imageFile) {
        const data = new FormData();
        data.append("file", imageFile);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: data });
        const fileData = await response.json();
        finalImageUrl = fileData.secure_url;
      }
      const submissionData = { ...formData, imageUrl: finalImageUrl };
      if (editingId) {
        await updateDoc(doc(db, selectedCollection, editingId), submissionData);
      } else {
        await addDoc(collection(db, selectedCollection), submissionData);
      }
      setIsModalOpen(false); fetchProducts(); triggerToast("Database Sync Complete");
    } catch (error) { console.error(error); } finally { setIsUploading(false); }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfFirstProduct = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfFirstProduct + itemsPerPage);

  return (
    <div className="p-4 md:p-6 font-sans bg-[#fcfcfc] min-h-screen relative pb-32 overflow-x-hidden">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight italic uppercase leading-none mb-1">Products</h1>
          <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.3em]">Database Master List</p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full xl:w-auto items-stretch sm:items-center gap-3">
          <div className="relative group flex-1 sm:flex-none">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-pink-400" size={14} />
            <input 
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-bold text-gray-600 outline-none w-full sm:w-64 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setIsColModalOpen(true)} className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-pink-500 shadow-sm flex-1 sm:flex-none justify-center flex transition-colors">
              <FolderPlus size={18} />
            </button>
            <div className="relative flex-1 sm:flex-none">
              <Filter size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400 z-10 pointer-events-none" />
              <select 
                value={selectedCollection} 
                onChange={(e) => setSelectedCollection(e.target.value)} 
                className="w-full pl-9 pr-8 py-3 bg-white text-gray-700 font-black text-[10px] uppercase tracking-widest shadow-sm border border-gray-100 rounded-xl outline-none appearance-none cursor-pointer"
              >
                {collectionsList.map((col) => <option key={col} value={col}>{col}</option>)}
              </select>
            </div>
            <button onClick={() => { if(selectedCollection === "flowers") return; setDeleteTarget({ type: 'collection', name: selectedCollection }); setIsDeleteModalOpen(true); }} disabled={selectedCollection === "flowers"} className="p-3 bg-white border border-gray-100 rounded-xl text-gray-300 hover:text-red-500 shadow-sm disabled:opacity-20 flex-1 sm:flex-none justify-center flex transition-colors">
              <FolderMinus size={18} />
            </button>
          </div>

          <button onClick={() => { setFormData(initialFormState); setEditingId(null); setIsModalOpen(true); }} className="bg-pink-500 hover:bg-black text-white px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-xl shadow-pink-100 font-black uppercase text-[10px] tracking-widest border-b-4 border-pink-700 active:border-b-0">
            <Plus size={14} /> Add Product
          </button>
        </div>
      </div>

      {/* TABLE/CARD CONTAINER */}
      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.25em] font-black border-b border-gray-100">
                <th className="p-8 w-10">
                   <input type="checkbox" className="w-4 h-4 border-2 border-gray-200 rounded" checked={selectedProductIds.length === currentProducts.length && currentProducts.length > 0} onChange={() => setSelectedProductIds(selectedProductIds.length === currentProducts.length ? [] : currentProducts.map(p => p.id!))} />
                </th>
                <th className="p-8">Visual</th>
                <th className="p-8">Details</th>
                <th className="p-8 text-center">Price</th>
                <th className="p-8 text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentProducts.map((product) => (
                <tr key={product.id} className="group hover:bg-pink-50/10 transition-colors">
                  <td className="p-8"><input type="checkbox" checked={selectedProductIds.includes(product.id!)} onChange={() => toggleSelectProduct(product.id!)} className="w-4 h-4" /></td>
                  <td className="p-8"><img src={product.imageUrl} className="w-16 h-16 rounded-2xl object-cover border" alt="" /></td>
                  <td className="p-8">
                    <div className="flex flex-col">
                      <span className="font-black text-gray-800 text-sm uppercase italic leading-none">{product.name}</span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2">{product.category} • {product.size}</span>
                    </div>
                  </td>
                  <td className="p-8 text-center"><span className="text-pink-500 font-black text-sm italic">₱{product.price.toLocaleString()}</span></td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => { setFormData(product); setEditingId(product.id!); setIsModalOpen(true); }} className="p-2.5 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 transition-colors"><Edit size={16} /></button>
                      <button onClick={() => { setDeleteTarget({ type: 'product', id: product.id, name: product.name }); setIsDeleteModalOpen(true); }} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"><Trash size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden divide-y divide-gray-100">
          {currentProducts.map((product) => (
            <div key={product.id} className="p-6 flex gap-4 items-center">
              <input type="checkbox" checked={selectedProductIds.includes(product.id!)} onChange={() => toggleSelectProduct(product.id!)} className="shrink-0 w-5 h-5 border-2 border-pink-100 rounded-lg checked:bg-pink-500" />
              <img src={product.imageUrl} className="w-20 h-20 rounded-2xl object-cover border flex-shrink-0" alt="" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase text-pink-500 mb-1">{product.category}</p>
                <h3 className="font-black text-gray-800 text-xs uppercase italic truncate">{product.name}</h3>
                <p className="text-sm font-black text-gray-800 mt-2">₱{product.price.toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => { setFormData(product); setEditingId(product.id!); setIsModalOpen(true); }} className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Edit size={18} /></button>
                <button onClick={() => { setDeleteTarget({ type: 'product', id: product.id, name: product.name }); setIsDeleteModalOpen(true); }} className="p-3 bg-red-50 text-red-500 rounded-xl"><Trash size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🌟 RESPONSIVE PAGINATION BAR */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4 py-8">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
            Showing <span className="text-gray-800">{indexOfFirstProduct + 1}</span> to <span className="text-gray-800">{Math.min(indexOfFirstProduct + itemsPerPage, filteredProducts.length)}</span> of <span className="text-gray-800">{filteredProducts.length}</span> manifests
          </p>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-pink-500 disabled:opacity-20 shadow-sm transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-pink-500 text-white shadow-lg shadow-pink-100' : 'bg-white text-gray-400 hover:text-pink-500 border border-gray-50'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-pink-500 disabled:opacity-20 shadow-sm transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* BULK ACTION BAR */}
      <div className={`fixed bottom-6 md:bottom-10 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-[150] transition-all duration-500 ${selectedProductIds.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'}`}>
        <div className="bg-[#111111] text-white px-6 md:px-10 py-5 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl flex flex-col sm:flex-row items-center gap-4 sm:gap-10 border border-white/5 ring-4 ring-pink-500/10">
          <div className="text-center sm:text-left">
             <p className="text-[8px] font-black uppercase tracking-[0.3em] text-pink-500 leading-none mb-1">Batch Operation</p>
             <p className="text-xs font-bold text-gray-400">{selectedProductIds.length} Items Locked</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => { setDeleteTarget({ type: 'bulk', name: `${selectedProductIds.length} items` }); setIsDeleteModalOpen(true); }} className="text-red-500 font-black uppercase text-[10px] tracking-widest px-4 py-2 hover:bg-red-500/10 rounded-xl">Wipe</button>
            <button onClick={() => setSelectedProductIds([])} className="text-gray-400 font-black uppercase text-[10px] tracking-widest px-4 py-2 hover:bg-white/10 rounded-xl">Cancel</button>
          </div>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      <div className={`fixed top-6 right-6 z-[300] transition-all duration-300 ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0 pointer-events-none'}`}>
         <div className={`px-6 py-4 rounded-xl shadow-lg font-black uppercase text-[10px] tracking-widest border-l-4 ${toastType === 'success' ? 'bg-white text-gray-800 border-pink-500' : 'bg-red-500 text-white border-red-700'}`}>
           {toastMessage}
         </div>
      </div>

      {/* PRODUCT ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-50">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 md:top-8 md:right-8 p-2 text-gray-400 hover:text-pink-500 transition-colors"><X size={24} /></button>
            <div className="mb-10">
              <span className="text-pink-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block italic">Database Editor</span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tighter italic leading-none">{editingId ? "Update Product" : "New Manifest"}</h2>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="col-span-1 md:col-span-6 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Identity</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-gray-50 border-none p-4 md:p-5 rounded-2xl md:rounded-[1.5rem] font-black text-gray-700 uppercase italic shadow-inner outline-none focus:ring-2 focus:ring-pink-100" placeholder="Product Name" />
                </div>
                <div className="col-span-1 md:col-span-3 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Price</label>
                  <input required type="number" name="price" value={formData.price || ""} onChange={handleInputChange} className="w-full bg-gray-50 border-none p-4 md:p-5 rounded-2xl md:rounded-[1.5rem] font-black text-pink-500 shadow-inner outline-none focus:ring-2 focus:ring-pink-100" placeholder="0.00" />
                </div>
                <div className="col-span-1 md:col-span-3 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Old</label>
                  <input type="number" name="oldPrice" value={formData.oldPrice || ""} onChange={handleInputChange} className="w-full bg-gray-50 border-none p-4 md:p-5 rounded-2xl md:rounded-[1.5rem] font-black text-gray-400 shadow-inner outline-none focus:ring-2 focus:ring-pink-100" placeholder="0.00" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Class</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-gray-50 border-none p-4 md:p-5 rounded-2xl font-black uppercase text-xs tracking-widest text-gray-600 appearance-none shadow-inner outline-none focus:ring-2 focus:ring-pink-100 cursor-pointer">
                    {CATEGORIES_LIST.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Hue</label>
                  <select name="color" value={formData.color} onChange={handleInputChange} className="w-full bg-gray-50 border-none p-4 md:p-5 rounded-2xl font-black uppercase text-xs tracking-widest text-gray-600 appearance-none shadow-inner outline-none focus:ring-2 focus:ring-pink-100 cursor-pointer">
                    {COLORS_LIST.map(col => <option key={col} value={col}>{col}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Scale</label>
                  <select name="size" value={formData.size} onChange={handleInputChange} className="w-full bg-gray-50 border-none p-4 md:p-5 rounded-2xl font-black uppercase text-xs tracking-widest text-gray-600 appearance-none shadow-inner outline-none focus:ring-2 focus:ring-pink-100 cursor-pointer">
                    {SIZES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="p-6 md:p-8 bg-pink-50/20 rounded-[2.5rem] border-2 border-dashed border-pink-100 flex flex-col gap-5">
                <input name="imageUrl" placeholder="CDN Image Link..." value={formData.imageUrl} onChange={handleInputChange} className="w-full bg-white p-4 rounded-xl text-xs font-bold shadow-sm outline-none focus:ring-2 focus:ring-pink-100" />
                <label className="flex flex-col items-center justify-center p-6 md:p-8 bg-white rounded-2xl border-2 border-pink-50 border-dashed cursor-pointer hover:bg-pink-50 transition-all">
                  {imageFile ? <span className="text-pink-600 font-black text-[10px] uppercase truncate max-w-xs">{imageFile.name}</span> : <UploadCloud size={32} className="text-pink-200" />}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                </label>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                <textarea required name="description" value={formData.description} onChange={handleInputChange} className="w-full bg-gray-50 border-none p-6 rounded-[2rem] h-32 outline-none font-medium text-sm shadow-inner focus:ring-2 focus:ring-pink-100 resize-none" placeholder="Tell a story..." />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-6 pt-6 border-t border-gray-50">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] italic order-2 sm:order-1 hover:text-gray-600 transition-colors">Discard</button>
                <button type="submit" disabled={isUploading} className="px-12 py-4 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 order-1 sm:order-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0">
                  {isUploading ? <Loader2 className="animate-spin" size={16} /> : "Commit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW COLLECTION MODAL */}
      {isColModalOpen && (
        <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-sm w-full text-center shadow-2xl relative border border-gray-50">
            <button onClick={() => setIsColModalOpen(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-pink-500 transition-colors"><X size={20} /></button>
            <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-pink-100"><FolderPlus size={32} /></div>
            <h2 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tighter italic">New Collection</h2>
            <p className="text-[9px] text-gray-400 mb-8 uppercase font-black tracking-widest leading-relaxed px-4">Create a new database category.</p>
            
            <form onSubmit={handleAddCollection} className="flex flex-col gap-4">
              <input 
                type="text" 
                required 
                value={newCollectionName} 
                onChange={(e) => setNewCollectionName(e.target.value)} 
                className="w-full bg-gray-50 border-none py-4 px-6 rounded-2xl font-black text-gray-800 uppercase text-xs tracking-widest shadow-inner text-center outline-none focus:ring-2 focus:ring-pink-100" 
                placeholder="Name..." 
              />
              <button type="submit" className="w-full bg-pink-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-pink-100 hover:bg-black transition-all">Add Category</button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-sm w-full text-center shadow-2xl relative border border-gray-50">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-red-100 -rotate-12"><Trash2 size={32} /></div>
            <h2 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tighter italic">Erase Record?</h2>
            <p className="text-[9px] text-gray-400 mb-8 uppercase font-black tracking-widest leading-relaxed px-4">This operation is irreversible.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => confirmDelete()} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-100 hover:bg-black transition-all">Yes, Delete</button>
              <button onClick={() => setIsDeleteModalOpen(false)} className="w-full bg-gray-50 text-gray-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest italic transition hover:bg-gray-100">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;