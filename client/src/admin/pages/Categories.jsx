import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiUpload, FiX } from 'react-icons/fi';
import api from '../services/api.js';
import adminToast from '../utils/toast.js';
import { TableSkeleton } from '../components/ui/Skeleton.jsx';
import ButtonSpinner from '../components/ui/ButtonSpinner.jsx';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal control states
  const [modalMode, setModalMode] = useState(null); // 'create', 'edit', 'delete', null
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Fetch categories with search and page parameters
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/categories?search=${search}&page=${page}&limit=8`);
      if (res.success && res.data) {
        setCategories(res.data.categories);
        setTotalPages(res.data.meta.totalPages || 1);
      }
    } catch (err) {
      adminToast.error(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCategories();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search, page]);

  // Open modal handler
  const openModal = (mode, category = null) => {
    setModalMode(mode);
    setSelectedCategory(category);
    setImageFile(null);
    setImagePreview(null);

    if (mode === 'edit' && category) {
      setValue('title', category.title);
      setValue('description', category.description);
      setValue('displayOrder', category.displayOrder);
      setValue('visibility', category.visibility);
      setImagePreview(category.imageUrl);
    } else {
      reset({
        title: '',
        description: '',
        displayOrder: 0,
        visibility: true
      });
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedCategory(null);
    setImageFile(null);
    setImagePreview(null);
    reset();
  };

  // Image change handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        adminToast.error('Please upload an image file');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Form Submit (Create/Edit)
  const onSubmit = async (data) => {
    setFormLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description || '');
    formData.append('displayOrder', data.displayOrder);
    formData.append('visibility', data.visibility);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      let res;
      if (modalMode === 'create') {
        if (!imageFile) {
          adminToast.error('Category image file is required');
          setFormLoading(false);
          return;
        }
        res = await api.post('/admin/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await api.put(`/admin/categories/${selectedCategory.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.success) {
        adminToast.success(`Category ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
        closeModal();
        fetchCategories();
      }
    } catch (err) {
      adminToast.error(err.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  // Confirm delete category
  const handleDelete = async () => {
    setFormLoading(true);
    try {
      const res = await api.delete(`/admin/categories/${selectedCategory.id}`);
      if (res.success) {
        adminToast.success('Category soft-deleted successfully');
        closeModal();
        fetchCategories();
      }
    } catch (err) {
      adminToast.error(err.message || 'Failed to delete category');
    } finally {
      setFormLoading(false);
    }
  };

  // Toggle Visibility status directly from the table row
  const toggleVisibility = async (category) => {
    try {
      const updatedVisibility = !category.visibility;
      const res = await api.put(`/admin/categories/${category.id}`, {
        visibility: updatedVisibility
      });
      if (res.success) {
        adminToast.success(`Category visibility set to ${updatedVisibility ? 'Visible' : 'Hidden'}`);
        // Quick update row state locally
        setCategories(categories.map(c => c.id === category.id ? { ...c, visibility: updatedVisibility } : c));
      }
    } catch (err) {
      adminToast.error(err.message || 'Failed to update visibility');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="pb-4 border-b border-[#ECE7DF] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headings text-2xl font-bold">Categories Directory</h1>
          <p className="text-xs text-[#676767]">Manage product classifications and catalog groups</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="self-start sm:self-center flex items-center gap-2 bg-[#B56A45] hover:bg-[#A05C39] text-[#FFFFFF] text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center bg-[#FFFFFF] border border-[#ECE7DF] px-4 py-2.5 rounded-xl max-w-md w-full">
        <FiSearch className="text-zinc-400 mr-2 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search categories by title, description..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="bg-transparent border-0 text-sm focus:outline-hidden focus:ring-0 w-full"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-zinc-400 hover:text-zinc-600">
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Live Categories Table */}
      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : categories.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] rounded-xl p-12 text-center text-zinc-400 text-sm">
          No categories found. Click "Add Category" to create one.
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#FCFBF8] border-b border-[#ECE7DF] text-xs font-bold uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">Slug Signature</th>
                  <th className="px-6 py-4">Order Index</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE7DF]">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-[#FCFBF8]/40 transition-colors">
                    <td className="px-6 py-4">
                      <img
                        src={category.imageUrl}
                        alt={category.title}
                        className="w-10 h-10 object-cover rounded-lg border border-[#ECE7DF]"
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-800">{category.title}</td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">{category.slug}</td>
                    <td className="px-6 py-4 text-zinc-600">{category.displayOrder}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleVisibility(category)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                          category.visibility
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                        }`}
                        title="Click to toggle visibility"
                      >
                        {category.visibility ? (
                          <>
                            <FiEye className="w-3 h-3" />
                            <span>Visible</span>
                          </>
                        ) : (
                          <>
                            <FiEyeOff className="w-3 h-3" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal('edit', category)}
                          className="p-1.5 text-zinc-600 hover:bg-[#FCFBF8] border border-transparent hover:border-[#ECE7DF] rounded-lg transition-all"
                          title="Edit Category"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openModal('delete', category)}
                          className="p-1.5 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-all"
                          title="Delete Category"
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

          {/* Pagination Controls */}
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

      {/* CREATE & EDIT DIALOG MODAL */}
      {modalMode && modalMode !== 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1E1E1B]/30 backdrop-blur-xs" onClick={closeModal} />
          
          <div className="relative w-full max-w-lg bg-[#FFFFFF] border border-[#ECE7DF] rounded-xl shadow-xl overflow-hidden z-50 flex flex-col max-h-[90vh]">
            <div className="h-14 flex items-center justify-between px-6 border-b border-[#ECE7DF] bg-[#FCFBF8]">
              <h2 className="font-headings text-sm font-bold uppercase tracking-wider">
                {modalMode === 'create' ? 'Add New Category' : 'Edit Category details'}
              </h2>
              <button onClick={closeModal} className="text-zinc-400 hover:text-zinc-600 p-1">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* Category Title */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Category Title</label>
                <input
                  type="text"
                  placeholder="e.g. Cement & Aggregates"
                  {...register('title', { required: 'Category Title is required' })}
                  className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                />
                {errors.title && (
                  <span className="text-xs text-red-500">{errors.title.message}</span>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Description</label>
                <textarea
                  placeholder="Summarize products categorized under this group..."
                  rows="3"
                  {...register('description')}
                  className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Order Index */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Order Position</label>
                  <input
                    type="number"
                    {...register('displayOrder', { valueAsNumber: true })}
                    className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                  />
                </div>

                {/* Status Visibility Checkbox */}
                <div className="flex flex-col justify-center space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Catalog Visibility</label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      {...register('visibility')}
                      className="w-4 h-4 text-[#B56A45] border-[#ECE7DF] rounded focus:ring-[#B56A45]"
                    />
                    <span className="text-xs text-zinc-700">Display on Public Site</span>
                  </label>
                </div>
              </div>

              {/* File Image Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Category Banner Image</label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border border-[#ECE7DF]"
                    />
                  )}
                  <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#ECE7DF] rounded-lg p-4 bg-[#FCFBF8] cursor-pointer hover:bg-zinc-50 transition-colors">
                    <FiUpload className="w-5 h-5 text-zinc-400 mb-1" />
                    <span className="text-xs font-semibold text-zinc-600">Select Banner File</span>
                    <span className="text-[10px] text-zinc-400 mt-0.5">JPEG, PNG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Modal Action buttons */}
              <div className="pt-4 border-t border-[#ECE7DF] flex items-center justify-end gap-3">
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
                  <span>{modalMode === 'create' ? 'Create' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM SOFT DELETE DIALOG */}
      {modalMode === 'delete' && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1E1E1B]/30 backdrop-blur-xs" onClick={closeModal} />
          
          <div className="relative w-full max-w-md bg-[#FFFFFF] border border-[#ECE7DF] rounded-xl shadow-xl p-6 z-50 space-y-4">
            <h2 className="font-headings text-sm font-bold uppercase tracking-wider text-zinc-800">Confirm Deletion</h2>
            <p className="text-xs text-zinc-600">
              Are you sure you want to delete category <strong>{selectedCategory.title}</strong>? This will soft-delete the classification and remove it from catalog displays.
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-[10px] text-amber-700 font-medium">
              ⚠️ Deletion is only allowed if there are no active products inside this category.
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
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Categories;
