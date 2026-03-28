import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  LogOut, 
  Settings, 
  Bell, 
  Menu, 
  X,
  User,
  CheckCheck, 
  Loader2
} from "lucide-react";
import { auth, db } from "@/firebase";
import { 
  collection, query, onSnapshot, orderBy, limit, 
  doc, getDoc, where, writeBatch, getDocs 
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// ✅ FIX: Added proper interface for the AdminLink props
interface AdminLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [notifHover, setNotifHover] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  
  const [adminData, setAdminData] = useState<{ name: string; photoURL: string | null }>({
    name: "Super Admin",
    photoURL: null
  });

  const [unreadCount, setUnreadCount] = useState(0);
  // ✅ FIX: Changed from <any> to a record type
  const [latestOrder, setLatestOrder] = useState<Record<string, any> | null>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setAdminData({
            name: `${data.firstName || "Super"} ${data.lastName || "Admin"}`,
            photoURL: data.photoURL || user.photoURL
          });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const qLatest = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(1));
    const unsubLatest = onSnapshot(qLatest, (snapshot) => {
      if (!snapshot.empty) {
        setLatestOrder({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      }
    });

    const qCount = query(collection(db, "orders"), where("status", "==", "New"));
    const unsubCount = onSnapshot(qCount, (snapshot) => {
      setUnreadCount(snapshot.size);
    });

    return () => { unsubLatest(); unsubCount(); };
  }, []);

  // ✅ FIX: Explicitly typed the mouse event
  const markAllAsRead = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (unreadCount === 0 || isClearing) return;

    setIsClearing(true);
    try {
      const q = query(collection(db, "orders"), where("status", "==", "New"));
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);

      querySnapshot.forEach((document) => {
        const docRef = doc(db, "orders", document.id);
        batch.update(docRef, { status: "Seen" }); 
      });

      await batch.commit();
    } catch (error) {
      console.error("Batch update failed:", error);
    } finally {
      setIsClearing(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#fff5f7] overflow-hidden" onClick={() => setSettingsOpen(false)}>
      
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#0F1113] text-white flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.05)] transition-transform duration-500 lg:relative lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button onClick={() => setMobileOpen(false)} className="lg:hidden absolute top-10 right-6 text-gray-400 hover:text-white"><X size={24} /></button>
        
        <div className="p-10">
          <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">Nesviera<span className="text-pink-500 text-4xl leading-none">.</span></h2>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 mt-2 italic">Management Portal</p>
        </div>

        <div className="mx-8 mb-12 p-5 bg-[#1A1D21] rounded-[2rem] flex items-center gap-4 border border-white/5 relative overflow-hidden group">
          <img 
            src={adminData.photoURL || `https://ui-avatars.com/api/?name=${adminData.name}&background=f472b6&color=fff&bold=true`} 
            alt="Admin" 
            className="w-12 h-12 rounded-2xl border-2 border-pink-500/20 object-cover cursor-zoom-in hover:scale-105 transition-transform"
            onClick={() => setIsImgModalOpen(true)}
          />
          <div className="flex flex-col z-10 min-w-0">
            <span className="text-sm font-black text-white italic uppercase tracking-tight truncate">{adminData.name}</span>
            <span className="text-[9px] uppercase tracking-widest text-pink-500 font-black">Authorized</span>
          </div>
        </div>

        <nav className="flex-1 px-8 space-y-4 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-6 ml-4 pr-4">
             <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">Main Menu</p>
             {unreadCount > 0 && (
               <button 
                 onClick={markAllAsRead} 
                 className="text-gray-500 hover:text-pink-500 transition-colors"
                 title="Mark all as seen"
               >
                 {isClearing ? <Loader2 size={12} className="animate-spin" /> : <CheckCheck size={14} />}
               </button>
             )}
          </div>
          
          <AdminLink to="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" active={isActive("/admin")} onClick={() => setMobileOpen(false)} />
          <AdminLink to="/admin/products" icon={<Package size={20} />} label="Products" active={isActive("/admin/products")} onClick={() => setMobileOpen(false)} />
          <AdminLink to="/admin/orders" icon={<ShoppingBag size={20} />} label="Orders" active={isActive("/admin/orders")} onClick={() => setMobileOpen(false)} />
          <AdminLink 
            to="/admin/notifications" 
            icon={<Bell size={20} />} 
            label="Notifications" 
            active={isActive("/admin/notifications")} 
            onClick={() => setMobileOpen(false)} 
            badge={unreadCount}
          />
        </nav>

        <div className="p-8">
          <Link to="/" className="flex items-center justify-center gap-3 px-4 py-4 bg-[#1A1D21] text-gray-500 rounded-2xl hover:text-white hover:bg-pink-500 transition-all duration-500 font-black text-[10px] uppercase tracking-[0.2em] italic shadow-lg">
            <LogOut size={14} strokeWidth={3} />Exit Terminal
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative">
        <header className="h-24 flex items-center justify-between px-6 md:px-12 bg-white/30 backdrop-blur-md border-b border-pink-100/50 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={(e) => { e.stopPropagation(); setMobileOpen(true); }} className="lg:hidden p-2 text-gray-600 hover:bg-pink-50 rounded-xl transition-all"><Menu size={24} /></button>
            <h1 className="text-lg md:text-xl font-black text-gray-800 uppercase italic tracking-tighter">
              {location.pathname === "/admin" ? "Analytics Overview" : location.pathname.split("/").pop()?.replace("-", " ")}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative" onMouseEnter={() => setNotifHover(true)} onMouseLeave={() => setNotifHover(false)}>
              <button onClick={() => navigate("/admin/notifications")} className="relative p-3 bg-white rounded-xl shadow-sm text-gray-400 hover:text-pink-500 transition-all">
                 <Bell size={20} />
                 {unreadCount > 0 && (
                   <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-pink-500 text-white text-[9px] font-black rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                     {unreadCount}
                   </span>
                 )}
              </button>

              {notifHover && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-[2rem] shadow-2xl border border-pink-50 p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <p className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-4 italic">Latest Feed</p>
                  {latestOrder ? (
                    <div className="flex items-start gap-4 p-3 bg-pink-50/30 rounded-2xl border border-pink-100">
                      <div className="bg-white p-2 rounded-xl shadow-sm"><ShoppingBag size={14} className="text-pink-500" /></div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-gray-800 uppercase truncate">Order from {latestOrder.customerInfo?.firstName || "Guest"}</p>
                        <p className="text-[9px] text-pink-500 font-bold mt-1">₱{Number(latestOrder.totalAmount || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  ) : <p className="text-xs text-gray-400 text-center py-4 italic">No recent activity...</p>}
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setSettingsOpen(!settingsOpen); }} className="p-3 bg-white rounded-xl shadow-sm text-gray-400 hover:text-pink-500 transition-all">
                 <Settings size={20} />
              </button>

              {settingsOpen && (
                <div className="absolute right-0 mt-4 w-48 bg-[#1a1a1a] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <Link to="/my-account" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-all">
                    <User size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">My Account</span>
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/5 rounded-xl transition-all">
                    <LogOut size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-6 md:p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* 🌟 IMAGE MODAL */}
      {isImgModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in" onClick={() => setIsImgModalOpen(false)}>
          <button className="absolute top-10 right-10 text-white/50 hover:text-white" onClick={() => setIsImgModalOpen(false)}><X size={32} /></button>
          <div className="relative max-w-2xl w-full aspect-square bg-white rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500" onClick={(e) => e.stopPropagation()}>
            <img src={adminData.photoURL || `https://ui-avatars.com/api/?name=${adminData.name}&background=f472b6&color=fff&bold=true&size=512`} className="w-full h-full object-cover" alt="Admin" />
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ FIX: Replaced 'any' with AdminLinkProps interface
const AdminLink = ({ to, icon, label, active, onClick, badge = 0 }: AdminLinkProps) => (
  <Link to={to} onClick={onClick} className={`flex items-center gap-5 px-6 py-4 rounded-[2rem] transition-all duration-500 group relative ${active ? "bg-pink-500 text-white shadow-[0_10px_20px_rgba(236,72,153,0.3)] scale-[1.02]" : "text-gray-500 hover:bg-[#1A1D21] hover:text-white"}`}>
    <div className={`${active ? "text-white" : "text-gray-600 group-hover:text-pink-500"} transition-colors`}>{icon}</div>
    <span className="font-black text-[11px] uppercase tracking-[0.15em] italic flex-1">{label}</span>
    {badge > 0 && !active && (
      <span className="bg-pink-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse">{badge}</span>
    )}
    {active && <div className="absolute right-4 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>}
  </Link>
);

export default AdminLayout;