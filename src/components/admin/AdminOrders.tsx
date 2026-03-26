import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, CheckCircle, Truck, X, MapPin, 
  Calendar, AlertTriangle, Trash2, BellRing, Package, 
  MessageSquare, MoreVertical, FileText, ExternalLink 
} from "lucide-react";
import { 
  collection, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot 
} from "firebase/firestore"; 
import { db } from "@/firebase";

interface Order {
  id: string;
  customerInfo: any;
  items?: any[];
  totalAmount?: number;
  status: string;
  createdAt: any;
  type?: string; 
  imageUrl?: string; // 🌟 Added for Bespoke Images
  customRequest?: {
    details: string;
    budget: string;
    hasAttachment: boolean;
  };
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]); 
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); 
  const [pendingCount, setPendingCount] = useState(0); 
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null); 

  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'info' | 'error' | 'warning' }>({
    show: false, msg: "", type: 'success'
  });

  const triggerToast = (msg: string, type: 'success' | 'info' | 'error' | 'warning' = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setPendingCount(ordersData.filter(o => o.status === "Pending" || o.status === "New").length);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredOrders(orders);
    } else {
      const now = new Date();
      let startDate = new Date();
      if (filter === "last-day") startDate.setDate(now.getDate() - 1);
      else if (filter === "last-week") startDate.setDate(now.getDate() - 7);
      else if (filter === "last-month") startDate.setMonth(now.getMonth() - 1);

      const filtered = orders.filter(order => {
        const orderDate = order.createdAt?.toDate() || new Date();
        return orderDate >= startDate;
      });
      setFilteredOrders(filtered);
    }
  }, [filter, orders]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      triggerToast(`Status updated to ${newStatus}`, "info");
    } catch (error) { 
      triggerToast("Update failed", "error");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, "orders", orderId));
      setOrderToDelete(null);
      triggerToast("Entry deleted permanently", "error");
    } catch (error) { 
      triggerToast("Delete failed", "error");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-50 text-green-600 border-green-100";
      case "Shipped": return "bg-blue-50 text-blue-600 border-blue-100";
      case "Cancelled": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-orange-50 text-orange-600 border-orange-100 animate-pulse";
    }
  };

  return (
    <div className="animate-in fade-in duration-700 pb-10 font-sans relative px-2 md:px-0">
      
      {/* TOAST SYSTEM */}
      <div className={`fixed bottom-4 md:bottom-8 left-4 right-4 md:left-auto md:right-8 z-[500] transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
        <div className="bg-[#1a1a1a] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 w-full md:min-w-[320px]">
          <div className="flex-1">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-pink-400">Terminal Notification</p>
            <p className="text-sm font-bold text-gray-100 leading-tight">{toast.msg}</p>
          </div>
          <button onClick={() => setToast(prev => ({...prev, show: false}))} className="text-gray-500 hover:text-white"><X size={18} /></button>
        </div>
      </div>

      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tighter uppercase italic leading-none mb-2">Orders</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Bespoke & Retail Feed</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm w-full md:w-auto">
          <Calendar size={18} className="text-pink-500 ml-2" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="text-[10px] font-black uppercase tracking-widest text-gray-600 outline-none bg-transparent flex-1 md:pr-4 cursor-pointer">
            <option value="all">All Time</option>
            <option value="last-day">Last 24h</option>
            <option value="last-week">Last 7 Days</option>
            <option value="last-month">Last Month</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden relative">
        {pendingCount > 0 && (
          <div className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-pink-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg animate-in slide-in-from-left duration-500">
            <BellRing size={12} className="animate-bounce" /> {pendingCount} PENDING
          </div>
        )}

        {/* 💻 DESKTOP TABLE */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30 text-gray-400 text-[10px] uppercase tracking-[0.25em] font-black border-b border-gray-100">
                <th className="p-8">Reference</th>
                <th className="p-8">Client Details</th>
                <th className="p-8 text-center">Amount</th>
                <th className="p-8 text-center">Status</th>
                <th className="p-8 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => {
                const isSub = order.type === "subscription";
                return (
                  <tr key={order.id} className="hover:bg-pink-50/10 transition-colors group">
                    <td className="p-8">
                      <div className="flex items-center gap-3">
                        {isSub ? <MessageSquare size={14} className="text-gray-900" /> : <ShoppingBag size={14} className="text-pink-500" />}
                        <span className="font-mono text-[10px] text-gray-400 font-bold">#{order.id.slice(0, 8).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-800 text-sm uppercase tracking-tight italic">
                          {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{order.customerInfo?.email}</span>
                      </div>
                    </td>
                    <td className="p-8 text-center">
                      <span className={`font-black text-sm ${isSub ? 'text-gray-300 italic' : 'text-pink-500'}`}>
                        {isSub ? "Inquiry" : `₱${Number(order.totalAmount || 0).toLocaleString()}`}
                      </span>
                    </td>
                    <td className="p-8 text-center">
                      <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-8 text-right">
                      {/* 🌟 THREE DOTS BUTTON */}
                      <button onClick={() => setSelectedOrder(order)} className="p-3 text-gray-300 hover:text-pink-500 transition-all rounded-full hover:bg-white shadow-sm">
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 📱 MOBILE VIEW */}
        <div className="lg:hidden flex flex-col divide-y divide-gray-100 p-4 pt-16">
          {filteredOrders.map((order) => {
            const isSub = order.type === "subscription";
            return (
              <div key={order.id} className="py-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                     {isSub ? <MessageSquare size={16} className="text-gray-900" /> : <ShoppingBag size={16} className="text-pink-500" />}
                     <h3 className="text-sm font-black text-gray-800 uppercase italic truncate max-w-[150px]">
                       {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                     </h3>
                  </div>
                  <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-400 hover:text-pink-500"><MoreVertical size={20}/></button>
                </div>
                
                <div className="flex justify-between items-center px-1">
                   <span className="text-lg font-black text-pink-500">
                     {isSub ? <span className="text-gray-300 text-[10px] italic uppercase tracking-widest">Bespoke Inquiry</span> : `₱${Number(order.totalAmount || 0).toLocaleString()}`}
                   </span>
                   <span className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                     {order.status}
                   </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🌟 DYNAMIC MANIFEST MODAL (Handles Cart vs Subscription + Images) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto border border-gray-100 custom-scrollbar">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full text-gray-400"><X size={24} /></button>
            <span className="text-pink-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block italic">Detailed Log</span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-8 uppercase tracking-tighter italic leading-none">
                {selectedOrder.type === 'subscription' ? "Bespoke Request" : "Order Invoice"}
            </h2>
            
            <div className="space-y-6">
              {/* Destination Card */}
              <div className="flex items-start gap-4 p-5 bg-[#fcfcfc] rounded-[2rem] border border-gray-100">
                <div className="bg-pink-500 p-3 rounded-2xl text-white shrink-0 shadow-lg shadow-pink-100"><MapPin size={20}/></div>
                <div className="min-w-0">
                  <p className="font-black text-gray-400 text-[9px] uppercase tracking-widest mb-1">Target Destination</p>
                  <p className="font-bold text-gray-800 text-sm md:text-base tracking-tight uppercase italic truncate">
                    {selectedOrder.customerInfo?.streetAddress || "Email Lead / Inquiry"}
                  </p>
                  <p className="text-gray-500 text-[10px] mt-1 font-bold uppercase">{selectedOrder.customerInfo?.email}</p>
                </div>
              </div>

              {/* 🌟 IMAGE PREVIEW LOGIC */}
              {selectedOrder.imageUrl && (
                <div className="space-y-2">
                  <p className="font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] ml-2">Visual Inspiration</p>
                  <div className="rounded-[2.5rem] overflow-hidden border-4 border-gray-50 shadow-inner group relative">
                     <img 
                       src={selectedOrder.imageUrl} 
                       alt="Inspiration" 
                       className="w-full h-auto max-h-64 object-cover cursor-zoom-in transition-transform group-hover:scale-105 duration-700"
                       onClick={() => window.open(selectedOrder.imageUrl, '_blank')}
                     />
                  </div>
                </div>
              )}

              {/* Manifest Content */}
              <div className="p-6 border border-gray-100 rounded-[2.5rem]">
                 <p className="font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] mb-5 border-b border-gray-50 pb-3">Manifest Content</p>
                 
                 {selectedOrder.type === 'subscription' ? (
                   <div className="space-y-4">
                      <div className="bg-pink-50/30 p-5 rounded-2xl border border-pink-50">
                         <p className="text-[10px] font-black text-pink-500 uppercase mb-3 flex items-center gap-2 italic">
                           <FileText size={12} /> Client Vision:
                         </p>
                         <p className="text-gray-700 text-sm font-medium leading-relaxed italic">
                           "{selectedOrder.customRequest?.details || "No details provided."}"
                         </p>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                         <span className="text-[10px] font-black text-gray-400 uppercase italic">Proposed Budget:</span>
                         <span className="text-lg font-black text-gray-800">₱{selectedOrder.customRequest?.budget || "0.00"}</span>
                      </div>
                   </div>
                 ) : (
                   <div className="space-y-4">
                      {(selectedOrder.items || []).map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center py-1">
                          <div className="flex flex-col">
                             <span className="font-bold text-gray-800 text-xs uppercase italic truncate">{item.name}</span>
                             <span className="text-[9px] text-gray-400 font-bold uppercase">Qty: {item.quantity}</span>
                          </div>
                          <span className="font-black text-pink-500 text-xs italic">₱{(Number(item.price || 0) * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="border-t-2 border-dashed mt-6 pt-6 flex justify-between items-end">
                        <span className="text-[10px] font-black text-gray-400 uppercase italic">Total Revenue</span>
                        <span className="text-3xl font-black text-gray-800 tracking-tighter italic">₱{Number(selectedOrder.totalAmount || 0).toLocaleString()}</span>
                      </div>
                   </div>
                 )}
              </div>

              {/* Status Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                 <button onClick={() => updateStatus(selectedOrder.id, "Shipped")} className="bg-blue-50 text-blue-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 hover:text-white transition-all">Mark Shipped</button>
                 <button onClick={() => updateStatus(selectedOrder.id, "Completed")} className="bg-green-50 text-green-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-green-500 hover:text-white transition-all">Mark Complete</button>
                 <button onClick={() => setOrderToDelete(selectedOrder.id)} className="col-span-2 bg-red-50 text-red-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all mt-1">Delete Record</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {orderToDelete && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl relative border border-gray-100">
            <Trash2 size={40} className="text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-gray-800 mb-2 uppercase italic tracking-tighter">Wipe Entry?</h2>
            <div className="flex flex-col gap-3 mt-8">
              <button onClick={() => handleDeleteOrder(orderToDelete)} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Confirm Erase</button>
              <button onClick={() => setOrderToDelete(null)} className="w-full bg-gray-50 text-gray-400 py-5 rounded-2xl font-black uppercase text-[10px] italic transition hover:bg-gray-100">Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;