import React, { useState, useEffect, useCallback } from "react"; // ✅ Added useCallback
import { 
  Package, 
  Loader2, 
  Calendar, 
  XCircle, 
  TrendingDown,
  AlertTriangle,
  Trophy,
  BarChart3,
  ChevronDown
} from "lucide-react";
import { collection, getDocs, doc, getDoc, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/firebase";

interface OrderItemData {
  name?: string;
  quantity?: number;
}

interface DashboardOrder extends DocumentData {
  id: string;
  createdAt?: { toDate?: () => Date } | Date;
  customerInfo?: { firstName?: string; lastName?: string };
  totalAmount?: number;
}

const AdminDashboard = () => {
  const [filter, setFilter] = useState("last-month");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    cancelledOrders: 0,
    cancelledRevenue: 0,
    recentCancellations: [] as DashboardOrder[],
    topProducts: [] as { name: string, count: number }[],
    inStock: 0,
    outOfStock: 0,
    lowStockItems: [] as string[],
    loading: true
  });

  // ✅ FIX: Wrapped in useCallback to stabilize the function and satisfy the linter
  const fetchStats = useCallback(async () => {
    setStats(prev => ({ ...prev, loading: true }));
    try {
      const metaRef = doc(db, "metadata", "collection_names");
      const metaSnap = await getDoc(metaRef);
      const collectionNames = metaSnap.exists() ? metaSnap.data().list || [] : ["flowers"];

      const productPromises = collectionNames.map((name: string) => getDocs(collection(db, name)));
      const productSnapshots = await Promise.all(productPromises);

      let productCount = 0;
      let inStockCount = 0;
      let outOfStockCount = 0;
      const lowStockList: string[] = [];

      productSnapshots.forEach((colSnap) => {
        productCount += colSnap.size;
        colSnap.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          const stock = Number(data.stock || 0);
          if (stock > 0) {
            inStockCount++;
            if (stock <= 5) lowStockList.push(data.name);
          } else {
            outOfStockCount++;
          }
        });
      });

      const now = new Date();
      const startDate = new Date();
      if (filter === "last-day") startDate.setDate(now.getDate() - 1);
      else if (filter === "last-week") startDate.setDate(now.getDate() - 7);
      else if (filter === "last-month") startDate.setMonth(now.getMonth() - 1);
      else if (filter === "last-year") startDate.setFullYear(now.getFullYear() - 1);

      const ordersSnap = await getDocs(collection(db, "orders"));
      let revenue = 0;
      let orderCount = 0;
      let cancelledCount = 0;
      let lostRevenue = 0;
      const cancelledList: DashboardOrder[] = [];
      const productSalesMap: { [key: string]: number } = {};

      ordersSnap.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        const orderDate = data.createdAt?.toDate() || new Date();

        if (orderDate >= startDate) {
          orderCount++;
          if (data.status === "Cancelled") {
            cancelledCount++;
            lostRevenue += Number(data.totalAmount || 0);
            cancelledList.push({ id: doc.id, ...data });
          } else {
            revenue += Number(data.totalAmount || 0);
            if (data.items && Array.isArray(data.items)) {
              data.items.forEach((item: OrderItemData) => {
                if (item?.name) {
                  productSalesMap[item.name] = (productSalesMap[item.name] || 0) + (item.quantity || 1);
                }
              });
            }
          }
        }
      });

      const sortedTopProducts = Object.entries(productSalesMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const parseOrderDate = (value: DashboardOrder["createdAt"]) =>
        value && "toDate" in value && typeof value.toDate === "function"
          ? value.toDate()
          : value instanceof Date
          ? value
          : new Date(0);

      setStats({
        totalProducts: productCount,
        totalOrders: orderCount,
        totalRevenue: revenue,
        cancelledOrders: cancelledCount,
        cancelledRevenue: lostRevenue,
        recentCancellations: cancelledList
          .sort((a, b) => parseOrderDate(b.createdAt).getTime() - parseOrderDate(a.createdAt).getTime())
          .slice(0, 5),
        topProducts: sortedTopProducts,
        inStock: inStockCount,
        outOfStock: outOfStockCount,
        lowStockItems: lowStockList,
        loading: false
      });
    } catch (error) {
      console.error(error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  }, [filter]); // ✅ Added filter as dependency here

  // ✅ FIX: Now fetchStats is a stable dependency
  useEffect(() => { 
    fetchStats(); 
  }, [fetchStats]);

  if (stats.loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-pink-500" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Analytics</p>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700 pb-20 p-4 md:p-6 bg-[#fcfcfc]">
      {/* HEADER */}
      <div className="mb-8 md:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tighter italic uppercase leading-none">Overview</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Real-time Performance Metrics</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 md:px-5 md:py-3 rounded-2xl border border-gray-100 shadow-sm w-full sm:w-auto justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-pink-500" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)} 
              className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-600 outline-none cursor-pointer bg-transparent"
            >
              <option value="last-day">Past 24 Hours</option>
              <option value="last-week">Past Week</option>
              <option value="last-month">Past Month</option>
              <option value="last-year">Past Year</option>
            </select>
          </div>
          <ChevronDown size={14} className="text-gray-300 sm:hidden" />
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
        <StatCard title="Net Revenue" value={`₱${stats.totalRevenue.toLocaleString()}`} color="text-pink-600" />
        <StatCard title="Total Orders" value={stats.totalOrders} color="text-gray-800" />
        <StatCard title="Cancellations" value={stats.cancelledOrders} color="text-red-500" />
        <StatCard title="Lost Profit" value={`₱${stats.cancelledRevenue.toLocaleString()}`} color="text-gray-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* TOP SELLING PRODUCTS */}
        <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
           <div className="absolute top-[-20px] right-[-20px] opacity-5 text-pink-500 hidden sm:block">
             <Trophy size={120} />
           </div>
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
             <BarChart3 size={16} className="text-pink-500" /> Best Sellers
           </h3>
           <div className="space-y-6">
             {stats.topProducts.length > 0 ? stats.topProducts.map((prod, i) => (
               <div key={i} className="flex items-center justify-between gap-2">
                 <div className="flex items-center gap-3 overflow-hidden">
                   <span className="text-xs font-black text-pink-200 shrink-0">0{i+1}</span>
                   <p className="text-xs font-bold text-gray-700 truncate">{prod.name}</p>
                 </div>
                 <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-[9px] md:text-[10px] font-black shrink-0">{prod.count} Sold</span>
               </div>
             )) : <p className="text-[10px] text-gray-400 font-bold uppercase text-center py-10">No sales data yet</p>}
           </div>
        </div>

        {/* CANCELLATION LOG */}
        <div className="lg:col-span-2 bg-[#1a1a1a] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-gray-800">
          <div className="absolute top-[-20px] right-[-20px] p-10 opacity-10 text-white transform rotate-12 hidden sm:block">
            <TrendingDown size={140} />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500 mb-6 md:mb-8 flex items-center gap-2">
            <XCircle size={16} /> Recent Cancellations
          </h3>
          <div className="space-y-3 relative z-10">
            {stats.recentCancellations.length > 0 ? (
              stats.recentCancellations.map((order) => (
                <div key={order.id} className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 md:p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all gap-3 sm:gap-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 font-black text-xs uppercase shrink-0">
                      {order.customerInfo?.firstName?.[0] || "U"}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-black text-white uppercase tracking-tight truncate">
                        {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                      </p>
                      <p className="text-[8px] md:text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">ID: #{order.id.slice(0, 8)}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto pl-14 sm:pl-0">
                    <p className="text-sm font-black text-red-400">- ₱{order.totalAmount?.toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-3xl">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Zero lost orders</p>
              </div>
            )}
          </div>
        </div>

        {/* INVENTORY STATUS */}
        <div className="lg:col-span-3 bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center gap-6 md:gap-10">
          <div className="flex-1 w-full">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
              <Package size={16} className="text-pink-500" /> Stock Distribution
            </h3>
            <div className="w-full bg-gray-50 h-4 md:h-5 rounded-full overflow-hidden border border-gray-100 p-0.5 md:p-1">
              <div className="bg-pink-500 h-full rounded-full transition-all duration-1000" style={{ width: `${(stats.inStock / stats.totalProducts) * 100}%` }} />
            </div>
            <div className="flex justify-between mt-4">
              <p className="text-[9px] md:text-[10px] font-black text-green-500 uppercase tracking-widest">{stats.inStock} Active</p>
              <p className="text-[9px] md:text-[10px] font-black text-red-400 uppercase tracking-widest">{stats.outOfStock} Out</p>
            </div>
          </div>
          
          {stats.lowStockItems.length > 0 && (
            <div className="w-full lg:w-1/3 p-5 md:p-6 bg-orange-50 rounded-[1.5rem] md:rounded-[2rem] border border-orange-100">
              <p className="text-[9px] md:text-[10px] font-black text-orange-600 uppercase mb-3 flex items-center gap-2 italic">
                <AlertTriangle size={14} /> Attention Needed
              </p>
              <div className="flex flex-wrap gap-2">
                {stats.lowStockItems.slice(0, 3).map((item, i) => (
                  <span key={i} className="text-[8px] md:text-[9px] bg-white px-2.5 py-1.5 rounded-xl border border-orange-100 font-bold text-orange-700 shadow-sm truncate max-w-[120px]">{item}</span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }: { title: string, value: string | number, color: string }) => (
  <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
    <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-pink-400 transition-colors">{title}</p>
    <p className={`text-2xl md:text-3xl font-black tracking-tighter ${color}`}>{value}</p>
  </div>
);

export default AdminDashboard;