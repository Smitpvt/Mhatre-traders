import React, { useState, useEffect } from 'react';
import { FiSearch, FiEdit, FiList, FiTrendingUp, FiTrendingDown, FiSliders, FiX, FiCheck } from 'react-icons/fi';
import api from '../services/api.js';
import adminToast from '../utils/toast.js';
import { TableSkeleton } from '../components/ui/Skeleton.jsx';
import ButtonSpinner from '../components/ui/ButtonSpinner.jsx';

export const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'LOW_STOCK', 'OUT_OF_STOCK'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Adjustment Modal Controls
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentStockInput, setCurrentStockInput] = useState('');
  const [reorderLevelInput, setReorderLevelInput] = useState('');
  const [unitInput, setUnitInput] = useState('PIECE');
  const [increaseStockInput, setIncreaseStockInput] = useState('');
  const [reduceStockInput, setReduceStockInput] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Purchase Modal Controls
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [purchaseForm, setPurchaseForm] = useState({
    productId: '',
    manualProductName: '',
    manualProductUnit: 'PIECE',
    quantity: '',
    supplierName: '',
    unitPrice: '',
    totalPrice: '',
    transactionDate: new Date().toISOString().split('T')[0]
  });

  const fetchAllProducts = async () => {
    try {
      const res = await api.get('/admin/products?limit=200');
      if (res.success && res.data) {
        setAllProducts(res.data.products);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openPurchaseModal = () => {
    fetchAllProducts();
    setPurchaseForm({
      productId: '',
      manualProductName: '',
      manualProductUnit: 'PIECE',
      quantity: '',
      supplierName: '',
      unitPrice: '',
      totalPrice: '',
      transactionDate: new Date().toISOString().split('T')[0]
    });
    setShowPurchaseModal(true);
  };

  const closePurchaseModal = () => setShowPurchaseModal(false);

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await api.post('/admin/inventory/purchase', purchaseForm);
      if (res.success) {
        adminToast.success('Purchase recorded successfully');
        closePurchaseModal();
        fetchInventory();
        fetchHistory();
      }
    } catch (err) {
      adminToast.error(err.message || 'Failed to record purchase');
    } finally {
      setFormLoading(false);
    }
  };

  // Fetch stock levels
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const typeQuery = filterType !== 'ALL' ? `&filterType=${filterType}` : '';
      const res = await api.get(`/admin/inventory?search=${search}&page=${page}&limit=8${typeQuery}`);
      if (res.success && res.data) {
        setInventory(res.data.inventory);
        setTotalPages(res.data.meta.totalPages || 1);
      }
    } catch (err) {
      adminToast.error(err.message || 'Failed to fetch inventory levels');
    } finally {
      setLoading(false);
    }
  };

  // Fetch transaction history
  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await api.get('/admin/inventory/history?limit=10');
      if (res.success && res.data) {
        setHistory(res.data.history);
      }
    } catch (err) {
      console.error('Failed to load stock audit trails', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchInventory();
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [search, filterType, page]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const openAdjustModal = (item) => {
    setSelectedItem(item);
    setCurrentStockInput(String(item.currentStock));
    setReorderLevelInput(String(item.reorderLevel));
    setUnitInput(item.product?.unit || 'PIECE');
    setIncreaseStockInput('');
    setReduceStockInput('');
    setShowAdjustModal(true);
  };

  const closeAdjustModal = () => {
    setShowAdjustModal(false);
    setSelectedItem(null);
    setCurrentStockInput('');
    setReorderLevelInput('');
    setUnitInput('PIECE');
    setIncreaseStockInput('');
    setReduceStockInput('');
  };

  // Process adjustment
  const handleAdjustSubmit = async (e) => {
    e.preventDefault();

    setFormLoading(true);

    const payload = {
      currentStock: parseInt(currentStockInput),
      reorderLevel: parseInt(reorderLevelInput),
      unit: unitInput
    };

    if (increaseStockInput && !isNaN(parseInt(increaseStockInput))) {
      payload.increaseStock = parseInt(increaseStockInput);
    }
    if (reduceStockInput && !isNaN(parseInt(reduceStockInput))) {
      payload.reduceStock = parseInt(reduceStockInput);
    }

    try {
      const res = await api.put(`/admin/inventory/${selectedItem.productId}`, payload);

      if (res.success) {
        adminToast.success('Inventory settings updated successfully');
        closeAdjustModal();
        fetchInventory();
        fetchHistory();
      }
    } catch (err) {
      adminToast.error(err.message || 'Failed to update stock levels');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="pb-4 border-b border-[#ECE7DF] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headings text-2xl font-bold">Stock Inventory</h1>
          <p className="text-xs text-[#676767]">Track stock quantities and log audit trails</p>
        </div>
        <button
          onClick={openPurchaseModal}
          className="bg-[#B56A45] hover:bg-[#A05C39] text-[#FFFFFF] font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          + Record Purchase
        </button>
      </div>

      {/* Filter and Search grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="flex items-center bg-[#FFFFFF] border border-[#ECE7DF] px-4 py-2 rounded-xl text-sm md:col-span-2">
          <FiSearch className="text-zinc-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search stocks by SKU, Product name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="bg-transparent border-0 focus:outline-hidden focus:ring-0 w-full"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex bg-[#FFFFFF] border border-[#ECE7DF] p-1 rounded-xl gap-1">
          {['ALL', 'LOW_STOCK', 'OUT_OF_STOCK'].map((type) => (
            <button
              key={type}
              onClick={() => { setFilterType(type); setPage(1); }}
              className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === type 
                  ? 'bg-[#B56A45] text-[#FFFFFF]' 
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {type === 'ALL' ? 'All' : type === 'LOW_STOCK' ? 'Low Stock' : 'Out of Stock'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stock Table */}
      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : inventory.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] rounded-xl p-12 text-center text-zinc-400 text-sm">
          No inventory stock matches the parameters.
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#FCFBF8] border-b border-[#ECE7DF] text-xs font-bold uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-4">SKU Code</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Current Level</th>
                  <th className="px-6 py-4">Reorder Limit</th>
                  <th className="px-6 py-4">Status Alert</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE7DF]">
                {inventory.map((item) => {
                  const isOutOfStock = item.currentStock === 0;
                  const isLowStock = item.currentStock <= item.reorderLevel;

                  return (
                    <tr key={item.id} className="hover:bg-[#FCFBF8]/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-zinc-500">{item.product?.sku}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-zinc-800 leading-tight">{item.product?.name}</span>
                          <span className="text-[9px] uppercase tracking-wider text-zinc-400 mt-0.5">{item.product?.unit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-zinc-700">{item.currentStock}</td>
                      <td className="px-6 py-4 text-zinc-500">{item.reorderLevel}</td>
                      <td className="px-6 py-4">
                        {isOutOfStock ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-red-50 border border-red-200 text-red-700">Out of Stock</span>
                        ) : isLowStock ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-50 border border-amber-200 text-[#B56A45]">Low Stock</span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-50 border border-emerald-200 text-emerald-700">Sufficient</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openAdjustModal(item)}
                          className="flex items-center gap-1.5 ml-auto bg-[#FFFFFF] hover:bg-[#FCFBF8] border border-[#ECE7DF] px-2.5 py-1.5 rounded-lg text-xs font-bold text-zinc-700 transition-colors cursor-pointer"
                        >
                          <FiEdit className="w-3 h-3" />
                          <span>Adjust Level</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-[#FCFBF8] px-6 py-4 border-t border-[#ECE7DF] flex items-center justify-between">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest bg-[#FFFFFF] border border-[#ECE7DF] text-zinc-600 hover:bg-[#FCFBF8] disabled:opacity-50 disabled:hover:bg-[#FFFFFF] rounded-lg transition-colors cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs text-zinc-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest bg-[#FFFFFF] border border-[#ECE7DF] text-zinc-600 hover:bg-[#FCFBF8] disabled:opacity-50 disabled:hover:bg-[#FFFFFF] rounded-lg transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Record Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1E1E1B]/30 backdrop-blur-xs" onClick={closePurchaseModal} />
          
          <div className="relative w-full max-w-lg bg-[#FFFFFF] border border-[#ECE7DF] rounded-xl shadow-xl overflow-hidden z-50">
            <div className="h-14 flex items-center justify-between px-6 border-b border-[#ECE7DF] bg-[#FCFBF8]">
              <h2 className="font-headings text-sm font-bold uppercase tracking-wider text-[#B56A45]">Record Purchase</h2>
              <button onClick={closePurchaseModal} className="text-zinc-400 hover:text-zinc-600 p-1">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePurchaseSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Target Product</label>
                <select
                  required={!purchaseForm.manualProductName}
                  value={purchaseForm.productId}
                  onChange={(e) => {
                    const pid = e.target.value;
                    const p = allProducts.find(x => x.id === pid);
                    setPurchaseForm({...purchaseForm, productId: pid, manualProductUnit: p ? p.unit : purchaseForm.manualProductUnit});
                  }}
                  className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                >
                  <option value="">--- Enter Manual Product ---</option>
                  {allProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>

              {!purchaseForm.productId && (
                <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-lg space-y-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Custom Product Name</label>
                    <input
                      type="text"
                      required={!purchaseForm.productId}
                      placeholder="e.g. Office Chairs"
                      value={purchaseForm.manualProductName}
                      onChange={(e) => setPurchaseForm({...purchaseForm, manualProductName: e.target.value})}
                      className="w-full px-3 py-2 bg-[#FFFFFF] border border-amber-200 rounded-lg text-sm focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                  <p className="text-[10px] text-amber-700 italic">This will log a purchase record without creating an inventory profile for it.</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Date of Purchase</label>
                  <input
                    type="date"
                    required
                    value={purchaseForm.transactionDate}
                    onChange={(e) => setPurchaseForm({...purchaseForm, transactionDate: e.target.value})}
                    className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Supplier Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter supplier name"
                    value={purchaseForm.supplierName}
                    onChange={(e) => setPurchaseForm({...purchaseForm, supplierName: e.target.value})}
                    className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 border-t border-[#ECE7DF]/50 pt-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Qty</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 50"
                    value={purchaseForm.quantity}
                    onChange={(e) => setPurchaseForm({...purchaseForm, quantity: e.target.value})}
                    className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Unit</label>
                  <select
                    value={purchaseForm.manualProductUnit}
                    onChange={(e) => setPurchaseForm({...purchaseForm, manualProductUnit: e.target.value})}
                    className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                  >
                    <option value="PIECE">PIECE</option>
                    <option value="KG">KG</option>
                    <option value="BAG">BAG</option>
                    <option value="TON">TON</option>
                    <option value="BOX">BOX</option>
                    <option value="BUNDLE">BUNDLE</option>
                    <option value="FEET">FEET</option>
                    <option value="METER">METER</option>
                    <option value="SHEET">SHEET</option>
                    <option value="CM">CM</option>
                    <option value="INCH">INCH</option>
                    <option value="LITER">LITER</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Unit Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={purchaseForm.unitPrice}
                    onChange={(e) => setPurchaseForm({...purchaseForm, unitPrice: e.target.value})}
                    className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Total Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={purchaseForm.totalPrice}
                    onChange={(e) => setPurchaseForm({...purchaseForm, totalPrice: e.target.value})}
                    className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#ECE7DF]">
                <button
                  type="button"
                  onClick={closePurchaseModal}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-[#FFFFFF] border border-[#ECE7DF] text-zinc-600 hover:bg-[#FCFBF8] rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-[#B56A45] hover:bg-[#A05C39] disabled:bg-zinc-300 text-[#FFFFFF] rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                >
                  {formLoading && <ButtonSpinner />}
                  <span>Save Purchase</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjust Modal */}
      {showAdjustModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1E1E1B]/30 backdrop-blur-xs" onClick={closeAdjustModal} />
          
          <div className="relative w-full max-w-md bg-[#FFFFFF] border border-[#ECE7DF] rounded-xl shadow-xl overflow-hidden z-50">
            <div className="h-14 flex items-center justify-between px-6 border-b border-[#ECE7DF] bg-[#FCFBF8]">
              <h2 className="font-headings text-sm font-bold uppercase tracking-wider">Adjust Stock Level</h2>
              <button onClick={closeAdjustModal} className="text-zinc-400 hover:text-zinc-600 p-1">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="p-6 space-y-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-400">Target Product</p>
                <p className="text-sm font-semibold text-zinc-800">{selectedItem.product?.name}</p>
                <p className="text-xs font-mono text-zinc-500 mt-0.5">SKU: {selectedItem.product?.sku} (Current Level: {selectedItem.currentStock})</p>
              </div>

              {/* Current Stock and Reorder Level Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Current Stock</label>
                  <input
                    type="number"
                    required
                    value={currentStockInput}
                    onChange={(e) => setCurrentStockInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Reorder Level</label>
                  <input
                    type="number"
                    required
                    value={reorderLevelInput}
                    onChange={(e) => setReorderLevelInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                  />
                </div>
              </div>

              {/* Unit Dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Product Unit</label>
                <select
                  value={unitInput}
                  onChange={(e) => setUnitInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45] text-zinc-700"
                >
                  {['BAG', 'PIECE', 'KG', 'TON', 'BOX', 'BUNDLE', 'FEET', 'METER', 'SHEET', 'CM', 'INCH', 'LITER', 'ROLL'].map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              {/* Relative Adjustments */}
              <div className="grid grid-cols-2 gap-4 border-t border-[#ECE7DF]/50 pt-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 text-emerald-600">Increase Stock by (+)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Add amount..."
                    value={increaseStockInput}
                    onChange={(e) => {
                      setIncreaseStockInput(e.target.value);
                      if (e.target.value) setReduceStockInput(''); // clear other
                    }}
                    className="w-full px-3 py-2 bg-[#FCFBF8] border border-emerald-100 rounded-lg text-sm focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 text-red-500">Reduce Stock by (-)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Subtract amount..."
                    value={reduceStockInput}
                    onChange={(e) => {
                      setReduceStockInput(e.target.value);
                      if (e.target.value) setIncreaseStockInput(''); // clear other
                    }}
                    className="w-full px-3 py-2 bg-[#FCFBF8] border border-red-100 rounded-lg text-sm focus:outline-hidden focus:border-red-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#ECE7DF]">
                <button
                  type="button"
                  onClick={closeAdjustModal}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-[#FFFFFF] border border-[#ECE7DF] text-zinc-600 hover:bg-[#FCFBF8] rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-[#B56A45] hover:bg-[#A05C39] disabled:bg-zinc-300 text-[#FFFFFF] rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                >
                  {formLoading && <ButtonSpinner />}
                  <span>Save Level</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION B: STOCK TRANSACTION AUDIT TRAILS */}
      <div className="space-y-4 border-t border-[#ECE7DF] pt-8">
        <div>
          <h2 className="font-headings text-lg font-bold">Inventory Audit Logs</h2>
          <p className="text-xs text-[#676767]">Historical record of stock changes and purchases</p>
        </div>

        {historyLoading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : history.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#ECE7DF] rounded-xl p-8 text-center text-zinc-400 text-xs">
            No audit logs recorded in database.
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#ECE7DF] rounded-xl overflow-hidden shadow-xs text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FCFBF8] border-b border-[#ECE7DF] font-bold text-zinc-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Product SKU</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Qty Changed</th>
                  <th className="px-6 py-3">Handled By</th>
                  <th className="px-6 py-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE7DF]">
                {history.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FCFBF8]/30 transition-colors">
                    <td className="px-6 py-3 text-zinc-400">{new Date(log.createdAt).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-800">{log.inventory ? log.inventory.product?.name : log.manualProductName}</span>
                        <span className="font-mono text-[9px] text-zinc-400 mt-0.5">{log.inventory ? `SKU: ${log.inventory.product?.sku}` : `Custom Purchase (${log.manualProductUnit})`}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 font-semibold">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] ${
                        log.type === 'BILL' || log.type === 'STOCK_OUT'
                          ? 'bg-red-50 text-red-600'
                          : log.type === 'PURCHASE'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className={`px-6 py-3 font-bold ${log.quantity < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {log.quantity > 0 ? `+${log.quantity}` : log.quantity}
                    </td>
                    <td className="px-6 py-3 text-zinc-600">{log.user?.name}</td>
                    <td className="px-6 py-3 text-zinc-500 italic max-w-xs truncate" title={log.notes}>{log.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Inventory;
