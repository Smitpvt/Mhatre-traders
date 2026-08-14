import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiFileText, FiDownload, FiTrash2, FiX, FiRefreshCw, FiDollarSign } from 'react-icons/fi';
import api from '../services/api.js';
import { BASE_URL } from '../../config/api.js';
import adminToast from '../utils/toast.js';
import { TableSkeleton } from '../components/ui/Skeleton.jsx';
import ButtonSpinner from '../components/ui/ButtonSpinner.jsx';

export const Billing = () => {
  const [bills, setBills] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Invoice creator form controls
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Form Fields State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [sendEmail, setSendEmail] = useState(false);
  const [customerGst, setCustomerGst] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState('Maharashtra');
  const [billType, setBillType] = useState('GST'); // 'GST', 'NON_GST'
  const [paymentMode, setPaymentMode] = useState('CASH'); // 'CASH', 'ONLINE', 'CHEQUE', 'BANK_TRANSFER'
  const [paymentStatus, setPaymentStatus] = useState('PENDING'); // 'PENDING', 'PARTIAL', 'PAID'
  const [gstCalculationMode, setGstCalculationMode] = useState('EXCLUSIVE'); // 'EXCLUSIVE', 'INCLUSIVE'
  const [flatDiscount, setFlatDiscount] = useState('0');
  const [notes, setNotes] = useState('');
  const [transportDetails, setTransportDetails] = useState('');
  
  const [items, setItems] = useState([
    { categoryId: '', productId: '', productName: '', sku: '', size: '', unit: '', quantity: 1, unitPrice: 0, defaultBillingRate: 0, gstRate: 0, discount: 0, subtotal: 0, gstAmount: 0, finalLineTotal: 0, maxStock: 0 }
  ]);

  // Fetch invoices list
  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/billing?search=${search}&page=${page}&limit=8`);
      if (res.success && res.data) {
        setBills(res.data.bills);
        setTotalPages(res.data.meta.totalPages || 1);
      }
    } catch (err) {
      adminToast.error(err.message || 'Failed to fetch billing invoices');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products catalog list for autofill options (limit 1000 so no products are missing)
  const fetchProductsList = async () => {
    try {
      const res = await api.get('/admin/products?limit=1000&status=ACTIVE');
      if (res.success && res.data) {
        setProductsList(res.data.products);
      }
    } catch (err) {
      console.error('Failed to load active products', err);
    }
  };

  // Fetch categories list for category selector
  const fetchCategoriesList = async () => {
    try {
      const res = await api.get('/admin/categories?limit=100');
      if (res.success && res.data) {
        setCategoriesList(res.data.categories);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  useEffect(() => {
    fetchProductsList();
    fetchCategoriesList();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBills();
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [search, page]);

  // Handle invoice downloads
  const handleDownloadPdf = async (billId, invoiceNo) => {
    adminToast.info(`Generating PDF document for invoice ${invoiceNo}...`);
    try {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`${BASE_URL}/admin/billing/${billId}/pdf`, {
        method: 'GET',
        headers,
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`Failed to generate PDF: ${response.statusText}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${invoiceNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      adminToast.success(`Invoice ${invoiceNo} PDF downloaded successfully`);
    } catch (err) {
      console.error(err);
      adminToast.error('Failed to download PDF invoice');
    }
  };
  const handleDeleteBill = async (billId, invoiceNo) => {
    if (!window.confirm(`Are you sure you want to permanently delete invoice ${invoiceNo}? This cannot be undone.`)) return;
    
    try {
      const res = await api.delete(`/admin/billing/${billId}`);
      if (res.success) {
        adminToast.success(`Invoice ${invoiceNo} deleted successfully`);
        fetchBills();
      }
    } catch (err) {
      adminToast.error(err.message || 'Failed to delete invoice');
    }
  };

  // Quick Payment status updates directly from table row
  const changePaymentStatus = async (billId, newStatus) => {
    try {
      const res = await api.put(`/admin/billing/${billId}/payment-status`, {
        paymentStatus: newStatus
      });
      if (res.success) {
        adminToast.success(`Payment status set to ${newStatus}`);
        setBills(bills.map(b => b.id === billId ? { ...b, paymentStatus: newStatus } : b));
      }
    } catch (err) {
      adminToast.error(err.message || 'Failed to update payment status');
    }
  };

  // Trigger modal open
  const openCreatorModal = () => {
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setSendEmail(false);
    setCustomerGst('');
    setBillingAddress('');
    setDeliveryAddress('');
    setPlaceOfSupply('Maharashtra');
    setBillType('GST');
    setPaymentMode('CASH');
    setPaymentStatus('PENDING');
    setGstCalculationMode('EXCLUSIVE');
    setFlatDiscount('0');
    setNotes('');
    setTransportDetails('');
    setItems([
      { categoryId: '', productId: '', productName: '', sku: '', size: '', unit: '', quantity: 1, unitPrice: 0, defaultBillingRate: 0, gstRate: 0, discount: 0, subtotal: 0, gstAmount: 0, finalLineTotal: 0, maxStock: 0 }
    ]);
    setShowCreateModal(true);
  };

  // Dynamic calculations helpers
  const calculateTotals = () => {
    let subtotalSum = 0;
    let gstSum = 0;
    let grandSum = 0;

    const calculatedItems = items.map(item => {
      if (!item.productId) return item;
      const rate = parseFloat(item.unitPrice || 0);
      const qty = parseInt(item.quantity || 0);
      const discPercent = parseFloat(item.discount || 0);
      const gstPercent = parseFloat(item.gstRate || 0);

      const grossAmount = rate * qty;
      const discAmount = grossAmount * (discPercent / 100);
      const netAmount = grossAmount - discAmount;

      let lineSub = 0;
      let lineGst = 0;
      let lineTotal = 0;

      if (billType === 'NON_GST') {
        lineSub = netAmount;
        lineGst = 0;
        lineTotal = lineSub;
      } else {
        if (gstCalculationMode === 'INCLUSIVE') {
          lineTotal = netAmount;
          lineSub = lineTotal / (1 + (gstPercent / 100));
          lineGst = lineTotal - lineSub;
        } else {
          // EXCLUSIVE
          lineSub = netAmount;
          lineGst = lineSub * (gstPercent / 100);
          lineTotal = lineSub + lineGst;
        }
      }

      subtotalSum += lineSub;
      gstSum += lineGst;
      grandSum += lineTotal;

      return {
        ...item,
        subtotal: lineSub,
        gstAmount: lineGst,
        finalLineTotal: lineTotal
      };
    });

    const discountVal = parseFloat(flatDiscount || 0);
    const finalBeforeRound = (subtotalSum + gstSum) - discountVal;
    const grandTotalVal = Math.round(finalBeforeRound);
    const roundOffVal = grandTotalVal - finalBeforeRound;

    return {
      items: calculatedItems,
      subtotal: subtotalSum,
      gstAmount: gstSum,
      roundOff: roundOffVal,
      grandTotal: grandTotalVal
    };
  };

  const totals = calculateTotals();

  // Add Item row
  const addItemRow = () => {
    setItems([
      ...items,
      { categoryId: '', productId: '', productName: '', sku: '', size: '', unit: '', quantity: 1, unitPrice: 0, defaultBillingRate: 0, gstRate: 0, discount: 0, subtotal: 0, gstAmount: 0, finalLineTotal: 0, maxStock: 0 }
    ]);
  };

  // Remove Item row
  const removeItemRow = (idx) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  // Select Category row and filter product options
  const handleItemCategorySelect = (idx, catId) => {
    const newItems = [...items];
    newItems[idx] = {
      ...newItems[idx],
      categoryId: catId,
      productId: '',
      productName: '',
      sku: '',
      unit: '',
      quantity: 1,
      unitPrice: 0,
      gstRate: 0,
      maxStock: 0
    };
    setItems(newItems);
  };

  // Select Product row and populate details
  const handleItemProductSelect = (idx, prodId) => {
    const selectedProd = productsList.find(p => p.id === prodId);
    if (!selectedProd) return;

    const currentStock = selectedProd.inventory?.currentStock || 0;
    if (currentStock <= 0) {
      adminToast.error(`⚠️ Out of Stock Alert: Product "${selectedProd.name}" (${selectedProd.sku}) has 0 stock available!`);
    } else if (currentStock <= 5) {
      adminToast.warning(`⚠️ Low Stock Warning: "${selectedProd.name}" only has ${currentStock} units remaining in stock.`);
    }

    const newItems = [...items];
    newItems[idx] = {
      ...newItems[idx],
      categoryId: selectedProd.categoryId || selectedProd.category?.id || newItems[idx].categoryId || '',
      productId: prodId,
      productName: selectedProd.name,
      sku: selectedProd.sku,
      size: selectedProd.size || newItems[idx].size || '',
      unit: selectedProd.unit,
      gstRate: selectedProd.pricing?.gstRate || 18.00,
      defaultBillingRate: selectedProd.pricing?.defaultBillingRate || 0,
      unitPrice: selectedProd.pricing?.defaultBillingRate || 0,
      maxStock: currentStock
    };
    setItems(newItems);
  };

  // Update item field value directly
  const handleItemFieldChange = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx] = {
      ...newItems[idx],
      [field]: value
    };

    if (field === 'quantity' && newItems[idx].productId) {
      const qty = parseInt(value || 0);
      const max = newItems[idx].maxStock || 0;
      if (max <= 0) {
        adminToast.error(`⚠️ Out of Stock Alert: Cannot select quantity for "${newItems[idx].productName}" (0 stock available).`);
      } else if (qty > max) {
        adminToast.warning(`⚠️ Stock Exceeded: Selected ${qty} units, but only ${max} units are available in stock.`);
      }
    }

    setItems(newItems);
  };

  // Generate bill action
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    // Verify all rows have products selected
    const invalidItem = items.find(item => !item.productId || parseInt(item.quantity) <= 0);
    if (invalidItem) {
      adminToast.error('Please select valid products and positive quantities for all items');
      return;
    }

    // Check for out-of-stock items
    const outOfStockItem = items.find(item => item.maxStock <= 0);
    if (outOfStockItem) {
      adminToast.error(`⚠️ Cannot Checkout: Product "${outOfStockItem.productName}" is OUT OF STOCK.`);
      return;
    }

    // Verify stock limits locally before checkout submit
    const stockShortItem = items.find(item => parseInt(item.quantity) > item.maxStock);
    if (stockShortItem) {
      adminToast.error(`⚠️ Cannot Checkout: Stock insufficient for ${stockShortItem.productName}. Maximum available: ${stockShortItem.maxStock} units.`);
      return;
    }

    setFormLoading(true);

    const payload = {
      customerName,
      customerPhone,
      customerEmail,
      sendEmail,
      customerGst: customerGst || undefined,
      billingAddress,
      deliveryAddress: deliveryAddress || billingAddress,
      placeOfSupply,
      billType,
      paymentMode,
      paymentStatus,
      gstCalculationMode,
      discount: parseFloat(flatDiscount || 0),
      notes,
      transportDetails: transportDetails || undefined,
      items: items.map(item => ({
        productId: item.productId,
        size: item.size || undefined,
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        discount: parseFloat(item.discount || 0),
        gstRate: parseFloat(item.gstRate || 0)
      }))
    };

    try {
      const res = await api.post('/admin/billing', payload);
      if (res.success && res.data) {
        adminToast.success(`Invoice ${res.data.bill.invoiceNumber} created successfully.`);
        setShowCreateModal(false);
        fetchBills();
      }
    } catch (err) {
      adminToast.error(err.message || 'Failed to checkout invoice');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="pb-4 border-b border-[#ECE7DF] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headings text-2xl font-bold">Billing & Invoicing</h1>
          <p className="text-xs text-[#676767]">Compile invoices and track customer transactions</p>
        </div>
        <button
          onClick={openCreatorModal}
          className="self-start sm:self-center flex items-center gap-2 bg-[#B56A45] hover:bg-[#A05C39] text-[#FFFFFF] text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <FiPlus className="w-4 h-4" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center bg-[#FFFFFF] border border-[#ECE7DF] px-4 py-2.5 rounded-xl max-w-md w-full text-sm">
        <FiSearch className="text-zinc-400 mr-2 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search by Invoice number, Client name, phone..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="bg-transparent border-0 focus:outline-hidden focus:ring-0 w-full"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-zinc-400 hover:text-zinc-600">
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Invoice Ledger Table */}
      {loading ? (
        <TableSkeleton rows={5} cols={7} />
      ) : bills.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] rounded-xl p-12 text-center text-zinc-400 text-sm">
          No invoices registered. Click "New Invoice" to checkout a sale.
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] rounded-xl overflow-hidden shadow-xs text-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FCFBF8] border-b border-[#ECE7DF] text-xs font-bold uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-4">Invoice No</th>
                  <th className="px-6 py-4">Invoice Date</th>
                  <th className="px-6 py-4">Customer Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Grand Total</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE7DF]">
                {bills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-[#FCFBF8]/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-[#B56A45]">{bill.invoiceNumber}</td>
                    <td className="px-6 py-4 text-zinc-400">{new Date(bill.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-800 leading-tight">{bill.customerName}</span>
                        <span className="text-[10px] text-zinc-500">{bill.customerPhone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        bill.billType === 'GST' ? 'bg-[#B56A45]/10 text-[#B56A45]' : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {bill.billType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-800">₹{parseFloat(bill.grandTotal).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <select
                        value={bill.paymentStatus}
                        onChange={(e) => changePaymentStatus(bill.id, e.target.value)}
                        className={`text-xs font-semibold py-1 px-2.5 rounded-lg border focus:outline-hidden ${
                          bill.paymentStatus === 'PAID'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : bill.paymentStatus === 'PARTIAL'
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-red-50 border-red-200 text-red-700'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PARTIAL">PARTIAL</option>
                        <option value="PAID">PAID</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDownloadPdf(bill.id, bill.invoiceNumber)}
                          className="flex items-center gap-1.5 bg-[#FFFFFF] hover:bg-[#FCFBF8] border border-[#ECE7DF] px-2.5 py-1.5 rounded-lg text-xs font-bold text-zinc-700 transition-colors cursor-pointer"
                          title="Download Invoice PDF"
                        >
                          <FiDownload className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                        <button
                          onClick={() => handleDeleteBill(bill.id, bill.invoiceNumber)}
                          className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-700 transition-colors cursor-pointer"
                          title="Delete Invoice"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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

      {/* FULLSCREEN CHECKOUT MODAL CREATOR */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1E1E1B]/35 backdrop-blur-xs" onClick={() => !formLoading && setShowCreateModal(false)} />
          
          <div className="relative w-full max-w-5xl bg-[#FFFFFF] border border-[#ECE7DF] rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col h-[90vh]">
            <div className="h-14 flex items-center justify-between px-6 border-b border-[#ECE7DF] bg-[#FCFBF8]">
              <h2 className="font-headings text-sm font-bold uppercase tracking-wider">Generate Sales Invoice</h2>
              <button onClick={() => !formLoading && setShowCreateModal(false)} className="text-zinc-400 hover:text-zinc-600 p-1">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
              
              {/* ROW 1: CUSTOMER METADATA */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#B56A45] border-b border-[#ECE7DF] pb-1">1. Customer Demographics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Customer Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Customer Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patil"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                    />
                  </div>

                  {/* Customer Phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 99887 76655"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                    />
                  </div>

                  {/* Customer Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Client Email (Optional)</label>
                    <input
                      type="email"
                      placeholder="e.g. ramesh@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                    />
                  </div>

                  {/* Customer GST (Optional) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Client GSTIN (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 27AAAAA0000A1Z5"
                      value={customerGst}
                      onChange={(e) => setCustomerGst(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Billing Address */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Billing Address</label>
                    <textarea
                      required
                      rows="2"
                      placeholder="Enter customer legal billing address..."
                      value={billingAddress}
                      onChange={(e) => setBillingAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45] resize-none"
                    />
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Delivery Site Address (Optional)</label>
                    <textarea
                      rows="2"
                      placeholder="Defaults to billing address if left empty..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* ROW 2: BILLING INVOICE OPTIONS */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#B56A45] border-b border-[#ECE7DF] pb-1">2. Billing Calculations Settings</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  
                  {/* Bill Type */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Bill Type</label>
                    <select
                      value={billType}
                      onChange={(e) => setBillType(e.target.value)}
                      className="w-full px-2 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-xs focus:outline-hidden text-zinc-700"
                    >
                      <option value="GST">GST Invoice</option>
                      <option value="NON_GST">Non-GST Simple</option>
                    </select>
                  </div>

                  {/* GST Mode */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">GST Mode</label>
                    <select
                      disabled={billType === 'NON_GST'}
                      value={gstCalculationMode}
                      onChange={(e) => setGstCalculationMode(e.target.value)}
                      className="w-full px-2 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-xs focus:outline-hidden text-zinc-700 disabled:bg-zinc-100 disabled:text-zinc-400"
                    >
                      <option value="EXCLUSIVE">Exclusive (+)</option>
                      <option value="INCLUSIVE">Inclusive (incl)</option>
                    </select>
                  </div>

                  {/* Place of Supply */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Place of Supply</label>
                    <input
                      type="text"
                      value={placeOfSupply}
                      onChange={(e) => setPlaceOfSupply(e.target.value)}
                      className="w-full px-2 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-xs focus:outline-hidden"
                    />
                  </div>

                  {/* Payment Mode */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Payment Mode</label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full px-2 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-xs focus:outline-hidden text-zinc-700"
                    >
                      <option value="CASH">CASH</option>
                      <option value="ONLINE">UPI / ONLINE</option>
                      <option value="CHEQUE">CHEQUE</option>
                      <option value="BANK_TRANSFER">BANK TRANSFER</option>
                    </select>
                  </div>

                  {/* Payment Status */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Payment Status</label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                      className="w-full px-2 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-xs focus:outline-hidden text-zinc-700"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PARTIAL">PARTIAL</option>
                      <option value="PAID">PAID</option>
                    </select>
                  </div>

                  {/* Transport Details (Optional) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Transport (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. MH-06-A-1234"
                      value={transportDetails}
                      onChange={(e) => setTransportDetails(e.target.value)}
                      className="w-full px-2 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-xs focus:outline-hidden"
                    />
                  </div>

                </div>
              </div>

              {/* ROW 3: DYNAMIC PRODUCTS MATRIX */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#ECE7DF] pb-1">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#B56A45]">3. Product Items checkout</h3>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="text-[#B56A45] hover:text-[#A05C39] text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <FiPlus className="w-3.5 h-3.5" /> Add Item Row
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center gap-4 bg-[#FCFBF8]/50 border border-[#ECE7DF] p-4 rounded-xl relative">
                      
                      {/* Category Selector */}
                      <div className="w-36 md:w-44 space-y-1">
                        <label className="text-[9px] font-bold uppercase text-zinc-500">Category</label>
                        <select
                          value={item.categoryId || ''}
                          onChange={(e) => handleItemCategorySelect(idx, e.target.value)}
                          className="w-full px-2 py-1.5 bg-[#FFFFFF] border border-[#ECE7DF] rounded-lg text-xs focus:outline-hidden text-zinc-700 font-medium"
                        >
                          <option value="">All Categories</option>
                          {categoriesList.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Product Selector */}
                      <div className="flex-1 space-y-1 min-w-[200px]">
                        <label className="text-[9px] font-bold uppercase text-zinc-500">Product SKU</label>
                        <select
                          required
                          value={item.productId}
                          onChange={(e) => handleItemProductSelect(idx, e.target.value)}
                          className="w-full px-2 py-1.5 bg-[#FFFFFF] border border-[#ECE7DF] rounded-lg text-xs focus:outline-hidden text-zinc-700"
                        >
                          <option value="">-- Choose SKU --</option>
                          {(item.categoryId 
                            ? productsList.filter(p => p.categoryId === item.categoryId || p.category?.id === item.categoryId)
                            : productsList
                          ).map(p => (
                            <option key={p.id} value={p.id}>
                              {p.sku} ({p.name}) [Stock: {p.inventory?.currentStock}]
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Product Size */}
                      <div className="w-24 space-y-1">
                        <label className="text-[9px] font-bold uppercase text-zinc-500">Size</label>
                        <input
                          type="text"
                          placeholder="e.g. 12mm"
                          value={item.size || ''}
                          onChange={(e) => handleItemFieldChange(idx, 'size', e.target.value)}
                          className="w-full px-2 py-1.5 bg-[#FFFFFF] border border-[#ECE7DF] rounded-lg text-xs focus:outline-hidden text-center font-medium"
                        />
                      </div>

                      {/* Display Unit */}
                      <div className="w-20 space-y-1">
                        <label className="text-[9px] font-bold uppercase text-zinc-500">Unit</label>
                        <input
                          type="text"
                          disabled
                          value={item.unit || '-'}
                          className="w-full px-2 py-1.5 bg-zinc-100 border border-[#ECE7DF] rounded-lg text-xs text-zinc-400 text-center"
                        />
                      </div>

                      {/* Quantity */}
                      <div className="w-24 space-y-1">
                        <label className="text-[9px] font-bold uppercase text-zinc-500">Quantity</label>
                        <input
                          type="number"
                          required
                          min="1"
                          max={item.maxStock || 1}
                          value={item.quantity}
                          onChange={(e) => handleItemFieldChange(idx, 'quantity', e.target.value)}
                          className="w-full px-2 py-1.5 bg-[#FFFFFF] border border-[#ECE7DF] rounded-lg text-xs focus:outline-hidden text-center font-bold"
                        />
                      </div>

                      {/* Rate / Unit Price */}
                      <div className="w-28 space-y-1">
                        <label className="text-[9px] font-bold uppercase text-zinc-500">Rate (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handleItemFieldChange(idx, 'unitPrice', e.target.value)}
                          className="w-full px-2 py-1.5 bg-[#FFFFFF] border border-[#ECE7DF] rounded-lg text-xs focus:outline-hidden text-right"
                        />
                      </div>

                      {/* Discount per Item */}
                      <div className="w-24 space-y-1">
                        <label className="text-[9px] font-bold uppercase text-zinc-500">Discount (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0%"
                          value={item.discount}
                          onChange={(e) => handleItemFieldChange(idx, 'discount', e.target.value)}
                          className="w-full px-2 py-1.5 bg-[#FFFFFF] border border-[#ECE7DF] rounded-lg text-xs focus:outline-hidden text-right font-medium"
                        />
                      </div>

                      {/* Display GST % */}
                      {billType === 'GST' && (
                        <div className="w-20 space-y-1">
                          <label className="text-[9px] font-bold uppercase text-zinc-500">GST %</label>
                          <input
                            type="number"
                            step="0.1"
                            value={item.gstRate}
                            onChange={(e) => handleItemFieldChange(idx, 'gstRate', e.target.value)}
                            className="w-full px-2 py-1.5 bg-[#FFFFFF] border border-[#ECE7DF] rounded-lg text-xs text-zinc-700 text-center font-semibold focus:outline-hidden"
                          />
                        </div>
                      )}

                      {/* Line subtotal */}
                      <div className="w-32 space-y-1 text-right">
                        <label className="text-[9px] font-bold uppercase text-zinc-500">Line Total (₹)</label>
                        <div className="py-1.5 font-bold text-zinc-700 pr-1">
                          ₹{parseFloat(totals.items[idx]?.finalLineTotal || 0).toFixed(2)}
                        </div>
                      </div>

                      {/* Delete row */}
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          className="absolute -top-2.5 -right-2.5 md:relative md:top-auto md:right-auto bg-[#FFFFFF] border border-[#ECE7DF] p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                    </div>
                  ))}
                </div>
              </div>

              {/* ROW 4: TOTALS PANEL & SUBMISSION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#ECE7DF] pt-6">
                {/* Notes and extra info */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Overall Billing Notes / Instructions</label>
                    <textarea
                      placeholder="Add descriptions or delivery terms to be printed on invoice PDF..."
                      rows="3"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Billing Summary Box */}
                <div className="bg-[#FCFBF8] border border-[#ECE7DF] p-6 rounded-xl space-y-4 shadow-2xs">
                  <div className="space-y-2 text-zinc-600 text-xs">
                    
                    <div className="flex justify-between items-center">
                      <span>Subtotal amount:</span>
                      <span className="font-semibold text-zinc-800">₹{parseFloat(totals.subtotal).toFixed(2)}</span>
                    </div>

                    {billType === 'GST' && (
                      <div className="flex justify-between items-center">
                        <span>GST Tax Amount (split CGST/SGST):</span>
                        <span className="font-semibold text-zinc-800">₹{parseFloat(totals.gstAmount).toFixed(2)}</span>
                      </div>
                    )}

                    {/* Overall Discount */}
                    <div className="flex justify-between items-center gap-4">
                      <span>Overall Bill Discount (₹):</span>
                      <input
                        type="number"
                        step="0.01"
                        value={flatDiscount}
                        onChange={(e) => setFlatDiscount(e.target.value)}
                        className="w-24 px-2 py-1 bg-[#FFFFFF] border border-[#ECE7DF] rounded focus:outline-hidden text-right text-xs"
                      />
                    </div>

                    {/* Round Off */}
                    <div className="flex justify-between items-center">
                      <span>Round Off differential:</span>
                      <span className="font-mono text-zinc-500">
                        {totals.roundOff >= 0 ? `+₹${parseFloat(totals.roundOff).toFixed(2)}` : `-₹${Math.abs(parseFloat(totals.roundOff)).toFixed(2)}`}
                      </span>
                    </div>

                    <hr className="border-[#ECE7DF] my-2" />

                    <div className="flex justify-between items-center text-sm font-bold text-zinc-800">
                      <span className="text-zinc-900 uppercase">Grand Total (₹):</span>
                      <span className="text-lg text-[#B56A45]">₹{parseFloat(totals.grandTotal).toFixed(2)}</span>
                    </div>

                  </div>

                  <div className="pt-4 flex justify-end gap-3 flex-wrap">
                    <div className="flex items-center gap-2 mr-auto">
                      <input
                        type="checkbox"
                        id="sendEmailCheckbox"
                        checked={sendEmail}
                        onChange={(e) => setSendEmail(e.target.checked)}
                        className="w-4 h-4 text-[#B56A45] bg-[#FCFBF8] border-[#ECE7DF] rounded focus:ring-[#B56A45] focus:ring-2"
                      />
                      <label htmlFor="sendEmailCheckbox" className="text-xs text-zinc-600 cursor-pointer font-medium">
                        Email Invoice to Client
                      </label>
                    </div>
                    <button
                      type="button"
                      disabled={formLoading}
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 bg-[#FFFFFF] border border-[#ECE7DF] text-zinc-600 hover:bg-[#FCFBF8] text-xs font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="px-6 py-2.5 bg-[#B56A45] hover:bg-[#A05C39] disabled:bg-zinc-300 text-[#FFFFFF] text-xs font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                    >
                      {formLoading && <ButtonSpinner />}
                      <span>Checkout & Generate</span>
                    </button>
                  </div>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Billing;
