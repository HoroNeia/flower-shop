import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, Trash2, Loader2, CheckCircle2, 
  Clock, ExternalLink, MessageSquare, X, AlertTriangle 
} from "lucide-react";
import { 
  collection, query, onSnapshot, orderBy, limit, Timestamp, deleteDoc, doc 
} from "firebase/firestore";
import { db } from "@/firebase";
import { Link } from "react-router-dom";

interface Notification {
  id: string;
  type: 'order' | 'subscription' | 'custom';
  title: string;
  message: string;
  createdAt: Timestamp | null;
}

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 🌟 UI STATES
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: "" });

  const triggerToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs: Notification[] = snapshot.docs.map(doc => {
        const data = doc.data();
        const isSub = data.type === "subscription" || data.type === "contact";
        
        return {
          id: doc.id,
          type: isSub ? 'subscription' : 'order',
          title: isSub ? (data.type === "contact" ? "Contact Inquiry" : "Bespoke Request") : "New Purchase Received",
          message: isSub 
            ? `${data.customerInfo?.email || 'Inquiry'}: ${data.message || 'New Request'}` 
            : `Arrangement delivery for ${data.customerInfo?.firstName || 'Customer'}`,
          createdAt: data.createdAt as Timestamp,
        };
      });
      setNotifications(logs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handlePermanentDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteDoc(doc(db, "orders", confirmDeleteId));
      triggerToast("Record successfully purged from terminal.");
      setConfirmDeleteId(null);
    } catch (error) {
      triggerToast("Error: System failed to remove record.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-pink-500" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Accessing Logs</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 md:px-0 relative">
      
      {/* 🌟 DELETE NOTIFICATION TOAST */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
        <div className="bg-[#1a1a1a] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 min-w-[300px]">
          <div className="bg-red-500 p-1.5 rounded-lg shrink-0"><CheckCircle2 size={14} /></div>
          <p className="text-[10px] font-black uppercase tracking-widest flex-1">{toast.msg}</p>
        </div>
      </div>

      {/* 🌟 CONFIRMATION MODAL */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-sm w-full text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-red-100 -rotate-6">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2 uppercase italic tracking-tighter">Wipe Log?</h2>
            <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest leading-relaxed">
              This will permanently remove the entry from your database.
            </p>
            <div className="flex flex-col gap-3 mt-8">
              <button 
                onClick={handlePermanentDelete}
                className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-red-700 transition-all"
              >
                Confirm 
              </button>
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="w-full bg-gray-50 text-gray-400 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] italic hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-10">
        <span className="text-pink-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block italic">History</span>
        <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter italic leading-none">Live Feed</h2>
      </div>

      <div className="space-y-6">
        {notifications.map((notif) => (
          <div 
            key={notif.id}
            className="group bg-white rounded-[2rem] p-5 md:p-8 border border-gray-50 shadow-sm hover:shadow-xl hover:border-pink-100 transition-all duration-500 flex flex-col sm:flex-row items-start gap-4 md:gap-6 relative overflow-hidden"
          >
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${
              notif.type === 'subscription' ? "bg-gray-900 text-white" : "bg-pink-50 text-pink-500"
            }`}>
               {notif.type === 'subscription' ? <MessageSquare size={20} /> : <ShoppingBag size={20} />}
            </div>

            <div className="flex-1 min-w-0 w-full">
               <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-1">
                  <h3 className="font-black uppercase tracking-tighter italic text-base md:text-lg text-gray-800">{notif.title}</h3>
                  <span className="text-[8px] md:text-[9px] font-black text-gray-300 uppercase flex items-center gap-1.5">
                    <Clock size={10} /> 
                    {notif.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || "Just now"}
                  </span>
               </div>
               <p className="text-gray-500 text-xs md:text-sm font-medium mb-4 leading-relaxed break-words">{notif.message}</p>
               <Link to="/admin/orders" className="text-[9px] font-black uppercase tracking-widest text-pink-500 hover:text-gray-900 flex items-center gap-2 italic">
                 Manage Order <ExternalLink size={10} />
               </Link>
            </div>

            {/* Trash icon now triggers the modal instead of immediate delete */}
            <button 
              onClick={() => setConfirmDeleteId(notif.id)}
              className="p-2 text-gray-200 hover:text-red-500 transition-all absolute top-4 right-4 sm:relative sm:top-0 sm:right-0"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNotifications;