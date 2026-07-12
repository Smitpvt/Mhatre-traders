import React, { useState, useEffect } from 'react';
import { FiBox, FiLayers, FiAlertTriangle, FiMail, FiFileText, FiShoppingCart } from 'react-icons/fi';
import api from '../services/api.js';
import adminToast from '../utils/toast.js';
import { DashboardSkeleton } from '../components/ui/Skeleton.jsx';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todayEnquiries, setTodayEnquiries] = useState(0);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard/stats');
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      adminToast.error(err.message || 'Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Read enquiries from local storage to calculate today's count
    const saved = localStorage.getItem('mhatre_enquiries');
    if (saved) {
      try {
        const enqs = JSON.parse(saved);
        const todayStr = new Date().toDateString();
        const count = enqs.filter(e => new Date(e.createdAt).toDateString() === todayStr).length;
        setTodayEnquiries(count);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 text-[#1E1E1B] font-sans">
      
      {/* Header */}
      <div className="pb-4 border-b border-[#ECE7DF]">
        <h1 className="font-headings text-2xl font-bold">Dashboard</h1>
        <p className="text-xs text-[#676767]">Business operations overview for Mhatre Traders</p>
      </div>

      {/* Grid of Core Business Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Categories */}
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] p-6 rounded-xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#676767] font-semibold mb-1">Total Categories</p>
            <p className="text-3xl font-headings font-bold">{stats?.totalCategories || 0}</p>
            <span className="text-[9px] text-zinc-400 mt-1 block">Active catalog divisions</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#FCFBF8] border border-[#ECE7DF] flex items-center justify-center text-[#B56A45]">
            <FiLayers className="w-5 h-5" />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] p-6 rounded-xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#676767] font-semibold mb-1">Total Products</p>
            <p className="text-3xl font-headings font-bold">{stats?.totalProducts || 0}</p>
            <span className="text-[9px] text-zinc-400 mt-1 block">Unique catalog items/SKUs</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#FCFBF8] border border-[#ECE7DF] flex items-center justify-center text-[#B56A45]">
            <FiBox className="w-5 h-5" />
          </div>
        </div>

        {/* Total Inventory Items */}
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] p-6 rounded-xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#676767] font-semibold mb-1">Total Inventory Items</p>
            <p className="text-3xl font-headings font-bold">{stats?.totalInventoryItems || 0}</p>
            <span className="text-[9px] text-zinc-400 mt-1 block">Sum of all physical stock in warehouse</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#FCFBF8] border border-[#ECE7DF] flex items-center justify-center text-[#B56A45]">
            <FiBox className="w-5 h-5" />
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] p-6 rounded-xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#676767] font-semibold mb-1">Low Stock Products</p>
            <p className="text-3xl font-headings font-bold text-[#B56A45]">{stats?.lowStockCount || 0}</p>
            <span className="text-[9px] text-zinc-400 mt-1 block">Items below reorder limit</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-[#B56A45]">
            <FiAlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Out of Stock Products */}
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] p-6 rounded-xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#676767] font-semibold mb-1">Out of Stock Products</p>
            <p className="text-3xl font-headings font-bold text-red-600">{stats?.outOfStockCount || 0}</p>
            <span className="text-[9px] text-zinc-400 mt-1 block">Items with zero stock quantity</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
            <FiAlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Today's Enquiries */}
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] p-6 rounded-xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#676767] font-semibold mb-1">Today's Enquiries</p>
            <p className="text-3xl font-headings font-bold text-emerald-600">{todayEnquiries}</p>
            <span className="text-[9px] text-zinc-400 mt-1 block">New client quotation requests today</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <FiMail className="w-5 h-5" />
          </div>
        </div>

        {/* Total Purchases */}
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] p-6 rounded-xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#676767] font-semibold mb-1">Monthly Purchases</p>
            <p className="text-3xl font-headings font-bold text-blue-600">₹{stats?.monthlyPurchases?.toLocaleString('en-IN') || 0}</p>
            <span className="text-[9px] text-zinc-400 mt-1 block">Total cost of stock purchased this month</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <FiShoppingCart className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Recent Bills (Optional) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Invoices */}
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] p-6 rounded-xl shadow-2xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#ECE7DF] pb-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-700 flex items-center gap-2">
              <FiFileText className="w-4 h-4 text-[#B56A45]" />
              <span>Recent Invoices</span>
            </h2>
          </div>

          {!stats?.recentBills || stats.recentBills.length === 0 ? (
            <div className="text-xs text-zinc-400 text-center py-12">
              No bills recorded. Go to the Billing module to generate one.
            </div>
          ) : (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#ECE7DF] text-zinc-500 font-bold uppercase">
                    <th className="py-2">Invoice No</th>
                    <th className="py-2">Client Name</th>
                    <th className="py-2 text-right">Grand Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE7DF]/50">
                  {stats.recentBills.map(bill => (
                    <tr key={bill.id} className="hover:bg-[#FCFBF8]/30 transition-colors">
                      <td className="py-3 font-mono font-bold text-[#B56A45]">{bill.invoiceNumber}</td>
                      <td className="py-3 text-zinc-700">{bill.customerName}</td>
                      <td className="py-3 font-semibold text-right">₹{parseFloat(bill.grandTotal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Purchases */}
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] p-6 rounded-xl shadow-2xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#ECE7DF] pb-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-700 flex items-center gap-2">
              <FiShoppingCart className="w-4 h-4 text-blue-600" />
              <span>Recent Purchases</span>
            </h2>
          </div>

          {!stats?.recentPurchases || stats.recentPurchases.length === 0 ? (
            <div className="text-xs text-zinc-400 text-center py-12">
              No purchases recorded. Go to the Inventory module to record one.
            </div>
          ) : (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#ECE7DF] text-zinc-500 font-bold uppercase">
                    <th className="py-2">Date</th>
                    <th className="py-2">Product</th>
                    <th className="py-2">Supplier</th>
                    <th className="py-2 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE7DF]/50">
                  {stats.recentPurchases.map(purchase => (
                    <tr key={purchase.id} className="hover:bg-[#FCFBF8]/30 transition-colors">
                      <td className="py-3 text-zinc-500">{new Date(purchase.transactionDate).toLocaleDateString('en-IN')}</td>
                      <td className="py-3 font-semibold text-zinc-800">
                        {purchase.inventory ? purchase.inventory.product?.name : purchase.manualProductName}
                        <span className="block text-[9px] text-zinc-400 font-normal">
                          +{purchase.quantity} {purchase.inventory ? purchase.inventory.product?.unit : purchase.manualProductUnit}
                        </span>
                      </td>
                      <td className="py-3 text-zinc-600">{purchase.supplierName}</td>
                      <td className="py-3 font-semibold text-blue-600 text-right">₹{parseFloat(purchase.totalPrice || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
