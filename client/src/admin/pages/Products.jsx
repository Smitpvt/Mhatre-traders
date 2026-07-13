import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiUpload, FiX, FiInfo, FiLock } from 'react-icons/fi';
import api from '../services/api.js';
import adminToast from '../utils/toast.js';
import { TableSkeleton } from '../components/ui/Skeleton.jsx';
import ButtonSpinner from '../components/ui/ButtonSpinner.jsx';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal controls
  const [modalMode, setModalMode] = useState(null); // 'create', 'edit', 'delete', null
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);
  const [formLoading, setFormLoading] = useState(false);

  const units = ['BAG', 'PIECE', 'KG', 'TON', 'BOX', 'BUNDLE', 'FEET', 'METER', 'SHEET'];
  const statuses = ['ACTIVE', 'INACTIVE', 'DRAFT'];

  const { register, handleSubmit, reset, setValue, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      specifications: [{ key: '', value: '' }]
    }
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control,
    name: 'specifications'
  });

  // Fetch categories list for form selector
  const fetchCategoriesList = async () => {
    try {
      const res = await api.get('/admin/categories?limit=50');
      if (res.success && res.data) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  // Fetch products with search, pagination, and category filtering
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const categoryQuery = selectedCategoryFilter ? `&categoryId=${selectedCategoryFilter}` : '';
      const res = await api.get(`/admin/products?search=${search}&page=${page}&limit=8${categoryQuery}`);
      if (res.success && res.data) {
        setProducts(res.data.products);
        setTotalPages(res.data.meta.totalPages || 1);
      }
    } catch (err) {
      adminToast.error(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesList();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [search, selectedCategoryFilter, page]);

  // Open modal handler
  const openModal = (mode, product = null) => {
    setModalMode(mode);
    setSelectedProduct(product);
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setDeletedImageIds([]);

    if (mode === 'edit' && product) {
      setValue('sku', product.sku);
      setValue('name', product.name);
      setValue('brand', product.brand || '');
      setValue('description', product.description);
      setValue('unit', product.unit);
      setValue('status', product.status);
      setValue('featured', product.featured);
      setValue('categoryId', product.categoryId);
      setValue('applications', product.applications ? product.applications.join(', ') : '');
      setValue('seoTitle', product.seoTitle || '');
      setValue('seoDescription', product.seoDescription || '');
      setValue('seoKeywords', product.seoKeywords || '');

      // Load pricing nested values
      setValue('purchasePrice', product.pricing?.purchasePrice || 0);
      setValue('sellingPrice', product.pricing?.sellingPrice || 0);
      setValue('defaultBillingRate', product.pricing?.defaultBillingRate || 0);
      setValue('gstRate', product.pricing?.gstRate || 18.00);
      setValue('hsnCode', product.pricing?.hsnCode || '');

      // Load inventory values
      setValue('reorderLevel', product.inventory?.reorderLevel || 5);

      // Load specifications
      const specs = product.specifications || {};
      const specsArray = Object.keys(specs).map(key => ({ key, value: specs[key] }));
      reset({
        ...watch(),
        specifications: specsArray.length > 0 ? specsArray : [{ key: '', value: '' }]
      });

      // Load existing image previews
      if (product.images) {
        setExistingImages(product.images);
      }
    } else {
      reset({
        sku: '',
        name: '',
        brand: '',
        description: '',
        unit: 'BAG',
        status: 'DRAFT',
        featured: false,
        categoryId: categories[0]?.id || '',
        applications: '',
        purchasePrice: 0,
        sellingPrice: 0,
        defaultBillingRate: 0,
        gstRate: 18.00,
        hsnCode: '',
        currentStock: 0,
        reorderLevel: 5,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
        specifications: [{ key: '', value: '' }]
      });
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedProduct(null);
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setDeletedImageIds([]);
    reset();
  };

  // Image files picker
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const validFiles = files.filter(file => file.type.startsWith('image/'));
      if (validFiles.length !== files.length) {
        adminToast.warn('Only image files are allowed. Other formats were skipped.');
      }
      setImageFiles([...imageFiles, ...validFiles]);
      
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const handleDeleteExistingImage = (imageId) => {
    setDeletedImageIds([...deletedImageIds, imageId]);
    setExistingImages(existingImages.filter(img => img.id !== imageId));
  };

  const handleDeleteNewImage = (idx) => {
    const updatedFiles = [...imageFiles];
    updatedFiles.splice(idx, 1);
    setImageFiles(updatedFiles);

    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(idx, 1);
    setImagePreviews(updatedPreviews);
  };

  // Form submit handler
  const onSubmit = async (data) => {
    setFormLoading(true);

    const formData = new FormData();
    formData.append('sku', data.sku);
    formData.append('name', data.name);
    formData.append('brand', data.brand || '');
    formData.append('description', data.description || '');
    formData.append('unit', data.unit);
    formData.append('status', data.status);
    formData.append('featured', data.featured);
    formData.append('categoryId', data.categoryId);
    formData.append('seoTitle', data.seoTitle || '');
    formData.append('seoDescription', data.seoDescription || '');
    formData.append('seoKeywords', data.seoKeywords || '');
    
    // Parse specifications back to standard key-value map
    const specsMap = {};
    if (data.specifications) {
      data.specifications.forEach(item => {
        if (item.key && item.value) {
          specsMap[item.key.trim()] = item.value.trim();
        }
      });
    }
    formData.append('specifications', JSON.stringify(specsMap));

    // Parse applications comma string to array
    const appsArray = data.applications 
      ? data.applications.split(',').map(app => app.trim()).filter(Boolean) 
      : [];
    formData.append('applications', JSON.stringify(appsArray));

    // Nest pricing fields
    formData.append('purchasePrice', data.purchasePrice);
    formData.append('sellingPrice', data.sellingPrice);
    formData.append('defaultBillingRate', data.defaultBillingRate);
    formData.append('gstRate', data.gstRate);
    formData.append('hsnCode', data.hsnCode || '');

    // Nest inventory details
    formData.append('reorderLevel', data.reorderLevel);
    if (modalMode === 'create') {
      formData.append('currentStock', data.currentStock || 0);
    }

    // Append newly selected image files
    if (imageFiles.length > 0) {
      imageFiles.forEach(file => {
        formData.append('images', file);
      });
    }

    if (deletedImageIds.length > 0) {
      formData.append('deletedImageIds', JSON.stringify(deletedImageIds));
    }

    try {
      let res;
      if (modalMode === 'create') {
        res = await api.post('/admin/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await api.put(`/admin/products/${selectedProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.success) {
        adminToast.success(`Product SKU ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
        closeModal();
        fetchProducts();
      }
    } catch (err) {
      adminToast.error(err.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  // Product soft delete
  const handleDelete = async () => {
    setFormLoading(true);
    try {
      const res = await api.delete(`/admin/products/${selectedProduct.id}`);
      if (res.success) {
        adminToast.success('Product soft-deleted successfully');
        closeModal();
        fetchProducts();
      }
    } catch (err) {
      adminToast.error(err.message || 'Failed to delete product');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="pb-4 border-b border-[#ECE7DF] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headings text-2xl font-bold">Products Catalog</h1>
          <p className="text-xs text-[#676767]">Manage structural building materials and SKUs</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="self-start sm:self-center flex items-center gap-2 bg-[#B56A45] hover:bg-[#A05C39] text-[#FFFFFF] text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Product SKU</span>
        </button>
      </div>

      {/* Filter and Search Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="flex items-center bg-[#FFFFFF] border border-[#ECE7DF] px-4 py-2 rounded-xl text-sm">
          <FiSearch className="text-zinc-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by SKU, Name, description..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="bg-transparent border-0 focus:outline-hidden focus:ring-0 w-full"
          />
        </div>

        {/* Category Filter */}
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] px-3 py-2 rounded-xl text-sm">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => { setSelectedCategoryFilter(e.target.value); setPage(1); }}
            className="w-full bg-transparent border-0 focus:outline-hidden text-zinc-700"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : products.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] rounded-xl p-12 text-center text-zinc-400 text-sm">
          No products matched search parameters. Click "Add Product" to create one.
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#FCFBF8] border-b border-[#ECE7DF] text-xs font-bold uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Bill Rate</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE7DF]">
                {products.map((product) => {
                  const isLowStock = product.inventory && product.inventory.currentStock <= product.inventory.reorderLevel;
                  const isOutOfStock = product.inventory && product.inventory.currentStock === 0;

                  return (
                    <tr key={product.id} className="hover:bg-[#FCFBF8]/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-zinc-600">{product.sku}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.images && product.images[0] && (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-8 h-8 object-cover rounded border border-[#ECE7DF]"
                            />
                          )}
                          <div className="flex flex-col">
                            <span className="font-semibold text-zinc-800 leading-tight">{product.name}</span>
                            <span className="text-[10px] text-zinc-400">{product.unit}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-600">{product.category?.title}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`font-semibold ${
                            isOutOfStock ? 'text-red-600' : isLowStock ? 'text-[#B56A45]' : 'text-zinc-800'
                          }`}>
                            {product.inventory?.currentStock || 0}
                          </span>
                          {isOutOfStock ? (
                            <span className="text-[9px] text-red-500 uppercase font-semibold">Out of Stock</span>
                          ) : isLowStock ? (
                            <span className="text-[9px] text-[#B56A45] uppercase font-semibold">Low Stock</span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-zinc-700">₹{parseFloat(product.pricing?.defaultBillingRate || 0).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          product.status === 'ACTIVE'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : product.status === 'DRAFT'
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openModal('edit', product)}
                            className="p-1.5 text-zinc-600 hover:bg-[#FCFBF8] border border-transparent hover:border-[#ECE7DF] rounded-lg transition-all"
                            title="Edit Product"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openModal('delete', product)}
                            className="p-1.5 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-all"
                            title="Delete Product"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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

      {/* CREATE & EDIT FORM MODAL CONTAINER */}
      {modalMode && modalMode !== 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1E1E1B]/30 backdrop-blur-xs" onClick={closeModal} />
          
          <div className="relative w-full max-w-3xl bg-[#FFFFFF] border border-[#ECE7DF] rounded-xl shadow-xl overflow-hidden z-50 flex flex-col max-h-[90vh]">
            <div className="h-14 flex items-center justify-between px-6 border-b border-[#ECE7DF] bg-[#FCFBF8]">
              <h2 className="font-headings text-sm font-bold uppercase tracking-wider">
                {modalMode === 'create' ? 'Add Product SKU' : 'Modify Product configurations'}
              </h2>
              <button onClick={closeModal} className="text-zinc-400 hover:text-zinc-600 p-1">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* SECTION A: CATALOG BASE INFO */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#B56A45] border-b border-[#ECE7DF] pb-1">1. Catalog Metadata</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* SKU */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Unique SKU Code</label>
                    <input
                      type="text"
                      placeholder="e.g. CEMENT-UT"
                      {...register('sku', { required: 'SKU is required' })}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                    />
                    {errors.sku && <span className="text-xs text-red-500">{errors.sku.message}</span>}
                  </div>

                  {/* Name */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Product Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ultratech Cement"
                      {...register('name', { required: 'Product name is required' })}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                    />
                    {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                  </div>

                  {/* Brand */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Brand Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ultratech, JSW (Optional)"
                      {...register('brand')}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Category</label>
                    <select
                      {...register('categoryId', { required: 'Category is required' })}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45] text-zinc-700"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Unit Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Unit Type</label>
                    <select
                      {...register('unit', { required: 'Unit is required' })}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45] text-zinc-700"
                    >
                      {units.map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Product Status</label>
                    <select
                      {...register('status')}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45] text-zinc-700"
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Description</label>
                  <textarea
                    placeholder="Provide description specifications..."
                    rows="3"
                    {...register('description')}
                    className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                  />
                </div>
              </div>

              {/* SECTION B: ADMIN FINANCIAL PRICING */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-[#ECE7DF] pb-1">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#B56A45]">2. Internal Pricing & HSN</h3>
                  <div className="text-[10px] text-zinc-400 flex items-center gap-0.5" title="These parameters are strictly locked and are never exposed to public APIs or product pages">
                    <FiLock className="w-3.5 h-3.5" />
                    <span>Admin Only</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Purchase Price */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Purchase Cost (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('purchasePrice', { valueAsNumber: true })}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                    />
                  </div>

                  {/* Selling Price */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Retail Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('sellingPrice', { valueAsNumber: true })}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                    />
                  </div>

                  {/* Billing Rate */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Bill Rate (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('defaultBillingRate', { valueAsNumber: true })}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                    />
                  </div>

                  {/* GST */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">GST %</label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('gstRate', { valueAsNumber: true })}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                    />
                  </div>

                  {/* HSN Code */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">HSN Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 2523"
                      {...register('hsnCode')}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: INVENTORY STOCKS */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#B56A45] border-b border-[#ECE7DF] pb-1">3. Inventory Stock Configuration</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Initial Stock (Only at create time) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      {modalMode === 'create' ? 'Initial Stock Level' : 'Stock Quantity (Managed via Inventory Panel)'}
                    </label>
                    <input
                      type="number"
                      disabled={modalMode !== 'create'}
                      {...register('currentStock', { valueAsNumber: true })}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45] disabled:bg-zinc-100 disabled:text-zinc-400"
                    />
                  </div>

                  {/* Reorder Level */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Reorder Threshold Level</label>
                    <input
                      type="number"
                      {...register('reorderLevel', { valueAsNumber: true })}
                      className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION D: SPECIFICATIONS & APPLICATIONS */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#B56A45] border-b border-[#ECE7DF] pb-1">4. Technical Specifications & Usages</h3>

                {/* Applications list */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Applications (Comma separated list)</label>
                  <input
                    type="text"
                    placeholder="e.g. Columns, Foundation, Roof slabs..."
                    {...register('applications')}
                    className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                  />
                </div>

                {/* Specs Grid */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Technical Specifications Grid</label>
                    <button
                      type="button"
                      onClick={() => appendSpec({ key: '', value: '' })}
                      className="text-[#B56A45] hover:text-[#A05C39] text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <FiPlus className="w-3.5 h-3.5" /> Add Attribute
                    </button>
                  </div>

                  <div className="space-y-2">
                    {specFields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-center">
                        <input
                          type="text"
                          placeholder="Property Key (e.g. Size)"
                          {...register(`specifications.${index}.key`)}
                          className="flex-1 px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                        />
                        <input
                          type="text"
                          placeholder="Property Value (e.g. 12mm)"
                          {...register(`specifications.${index}.value`)}
                          className="flex-1 px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpec(index)}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION E: UPLOAD MEDIA FILE GALLERY */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#B56A45] border-b border-[#ECE7DF] pb-1">5. Product Gallery</h3>
                
                <div className="space-y-3">
                  {(existingImages.length > 0 || imagePreviews.length > 0) && (
                    <div className="flex flex-wrap gap-3">
                      {/* Existing Images */}
                      {existingImages.map((img, idx) => {
                        const isMain = idx === 0;
                        return (
                          <div key={img.id} className="relative w-16 h-16 border border-[#ECE7DF] rounded-lg overflow-hidden group">
                            <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                            {isMain && (
                              <span className="absolute bottom-0 inset-x-0 bg-[#B56A45] text-[#FFFFFF] text-[8px] text-center py-0.5 font-bold uppercase">Main</span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteExistingImage(img.id)}
                              className="absolute top-1 right-1 p-0.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete Image"
                            >
                              <FiX className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}

                      {/* Newly selected image previews */}
                      {imagePreviews.map((url, idx) => {
                        const isMain = existingImages.length === 0 && idx === 0;
                        return (
                          <div key={idx} className="relative w-16 h-16 border border-[#ECE7DF] rounded-lg overflow-hidden group">
                            <img src={url} alt="New Preview" className="w-full h-full object-cover" />
                            {isMain && (
                              <span className="absolute bottom-0 inset-x-0 bg-[#B56A45] text-[#FFFFFF] text-[8px] text-center py-0.5 font-bold uppercase">Main</span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteNewImage(idx)}
                              className="absolute top-1 right-1 p-0.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove Image"
                            >
                              <FiX className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#ECE7DF] rounded-lg p-6 bg-[#FCFBF8] cursor-pointer hover:bg-zinc-50 transition-colors text-center">
                    <FiUpload className="w-6 h-6 text-zinc-400 mb-1" />
                    <span className="text-xs font-semibold text-zinc-600">Select Image Files</span>
                    <span className="text-[10px] text-zinc-400 mt-0.5">JPEG, PNG up to 5MB (Upload multiple)</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>


              {/* Form buttons */}
              <div className="pt-4 border-t border-[#ECE7DF] flex items-center justify-end gap-3 sticky bottom-0 bg-[#FFFFFF]">
                <button
                  type="button"
                  onClick={closeModal}
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
                  <span>{modalMode === 'create' ? 'Create SKU' : 'Save Changes'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {modalMode === 'delete' && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1E1E1B]/30 backdrop-blur-xs" onClick={closeModal} />
          
          <div className="relative w-full max-w-md bg-[#FFFFFF] border border-[#ECE7DF] rounded-xl shadow-xl p-6 z-50 space-y-4">
            <h2 className="font-headings text-sm font-bold uppercase tracking-wider text-zinc-800">Confirm Product Deletion</h2>
            <p className="text-xs text-zinc-600">
              Are you sure you want to delete product SKU <strong>{selectedProduct.sku}</strong> ({selectedProduct.name})? This will soft-delete the product from stock logs.
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-[10px] text-amber-700 font-medium">
              ⚠️ Warning: Existing billing history and stock logs will remain intact, but the SKU will be removed from new invoice selections.
            </div>
            
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-[#FFFFFF] border border-[#ECE7DF] text-zinc-600 hover:bg-[#FCFBF8] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={formLoading}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-red-600 hover:bg-red-700 disabled:bg-zinc-300 text-[#FFFFFF] rounded-lg transition-colors cursor-pointer flex items-center gap-2"
              >
                {formLoading && <ButtonSpinner />}
                <span>Confirm Soft Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;
