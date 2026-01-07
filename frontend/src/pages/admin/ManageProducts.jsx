import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../services/api";
import { fetchProducts } from "../../features/products/productSlice";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import StarIcon from '@mui/icons-material/Star';
import WarningIcon from '@mui/icons-material/Warning';
import SaveIcon from '@mui/icons-material/Save';
import EmailIcon from '@mui/icons-material/Email';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';

const initialForm = { name: "", category: "Pipes", price: "", stock: "", description: "", shortDescription: "", featured: false, notifyUsers: true };
const categories = ["Pipes", "Motors", "Accessories", "Fittings", "Valves", "Pumps"];

const ManageProducts = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [notification, setNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }));
    setIsVisible(true);
  }, [dispatch]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length + existingImages.length > 5) {
      showNotification("Maximum 5 images allowed", "error");
      return;
    }
    
    setImages(prev => [...prev, ...files]);
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreview(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setImages(prev => prev.filter((_, i) => i !== index));
      URL.revokeObjectURL(imagePreview[index]);
      setImagePreview(prev => prev.filter((_, i) => i !== index));
    }
  };

  const openCreateModal = () => {
    setForm(initialForm);
    setImages([]);
    setImagePreview([]);
    setExistingImages([]);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      shortDescription: product.shortDescription || "",
      featured: product.featured || false,
      notifyUsers: false,
    });
    setImages([]);
    setImagePreview([]);
    setExistingImages(product.images || []);
    setEditingId(product._id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(initialForm);
    setImages([]);
    imagePreview.forEach(url => URL.revokeObjectURL(url));
    setImagePreview([]);
    setExistingImages([]);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      
      // Append form fields
      Object.keys(form).forEach(key => {
        if (key !== 'notifyUsers' || !editingId) {
          formData.append(key, form[key]);
        }
      });
      
      // Append new images
      images.forEach(image => {
        formData.append('images', image);
      });

      // For edit, if no new images but has existing, don't clear them
      if (editingId && images.length === 0 && existingImages.length > 0) {
        formData.append('keepExistingImages', 'true');
      }

      if (editingId) {
        await api.put(`/products/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showNotification("Product updated successfully!");
      } else {
        formData.append('notifyUsers', form.notifyUsers);
        await api.post("/products", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showNotification(form.notifyUsers ? "Product created & users notified!" : "Product created successfully!");
      }
      closeModal();
      dispatch(fetchProducts({ limit: 100 }));
    } catch (error) {
      showNotification(error.response?.data?.message || "Failed to save product", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      showNotification("Product deleted successfully!");
      dispatch(fetchProducts({ limit: 100 }));
    } catch (error) {
      showNotification("Failed to delete product", "error");
    }
    setDeleteConfirm(null);
  };

  const filteredProducts = items.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-4 rounded-2xl shadow-2xl animate-slide-in-right ${
          notification.type === "error" ? "bg-red-500" : "bg-brand-accent"
        } text-white font-semibold flex items-center gap-3`}>
          {notification.type === "error" ? (
            <ErrorIcon sx={{ fontSize: 20 }} />
          ) : (
            <CheckCircleIcon sx={{ fontSize: 20 }} />
          )}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
      }`}>
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Product Management</h1>
          <p className="text-slate-500 mt-1">Manage your inventory, add new products, and track stock levels</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center gap-2 self-start hover:scale-105 transition-transform"
        >
          <AddIcon sx={{ fontSize: 20 }} />
          Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className={`bg-gradient-to-r from-slate-50 to-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`} style={{ transitionDelay: "100ms" }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon sx={{ fontSize: 20 }} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search products by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 outline-none transition-all"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 outline-none transition-all min-w-[180px]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}

          </select>
        </div>
        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
            {filteredProducts.length} products found
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-secondary rounded-full"></span>
            {filteredProducts.filter(p => p.featured).length} featured
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            {filteredProducts.filter(p => p.stock < 10).length} low stock
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className={`bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`} style={{ transitionDelay: "200ms" }}>
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-500 mt-4">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <InventoryIcon sx={{ fontSize: 72, color: '#94a3b8' }} />
            <p className="text-slate-500 mt-4">No products found. Create your first product!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">Product</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">Category</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">Price</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">Stock</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">Status</th>
                  <th className="text-right py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product, index) => (
                  <tr
                    key={product._id}
                    className={`hover:bg-slate-50/50 transition-all duration-500 ${
                      isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
                    }`}
                    style={{ transitionDelay: `${200 + index * 30}ms` }}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex items-center justify-center overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.images[0].url}`}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <InventoryIcon sx={{ fontSize: 24, color: '#64748b' }} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{product.name}</p>
                          <p className="text-sm text-slate-500 line-clamp-1 max-w-xs">{product.shortDescription || product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-sm font-medium rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-800">₹ {product.price.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-semibold ${product.stock < 10 ? "text-red-500" : "text-slate-700"}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        {product.featured && (
                          <span className="inline-flex items-center gap-1 text-xs text-brand-secondary font-semibold">
                            <StarIcon sx={{ fontSize: 14 }} />
                            Featured
                          </span>
                        )}
                        {product.stock < 10 && (
                          <span className="inline-flex items-center gap-1 text-xs text-red-500 font-semibold">
                            <WarningIcon sx={{ fontSize: 14 }} />
                            Low Stock
                          </span>
                        )}
                        {!product.featured && product.stock >= 10 && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 font-semibold">
                            <CheckCircleIcon sx={{ fontSize: 14 }} />
                            In Stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-slate-500 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all"
                          title="Edit product"
                        >
                          <EditIcon sx={{ fontSize: 20 }} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product._id)}
                          className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete product"
                        >
                          <DeleteIcon sx={{ fontSize: 20 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal - Fixed to properly display full screen */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-start justify-center overflow-y-auto py-8" onClick={closeModal}>
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 my-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between rounded-t-3xl z-10">
              <div>
                <h2 className="text-2xl font-bold text-brand-dark">
                  {editingId ? "Edit Product" : "Create New Product"}
                </h2>
                <p className="text-slate-500 mt-1">
                  {editingId ? "Update the product details below" : "Fill in the details to add a new product"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <CloseIcon sx={{ fontSize: 24 }} className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g., PVC Pipe 4 inch"
                    className="input-styled w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="input-styled w-full"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹) *</label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    className="input-styled w-full"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Stock Quantity *</label>
                  <input
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="Enter stock quantity"
                    className="input-styled w-full"
                    required
                    min="0"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="featured"
                    id="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                  />
                  <label htmlFor="featured" className="text-sm font-semibold text-slate-700">
                    Mark as Featured Product
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Short Description</label>
                  <input
                    name="shortDescription"
                    value={form.shortDescription}
                    onChange={handleChange}
                    placeholder="Brief product summary (shown in listings)"
                    className="input-styled w-full"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Detailed product description..."
                    className="input-styled w-full h-32 resize-none"
                    required
                  />
                </div>

                {/* Image Upload Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <ImageIcon sx={{ fontSize: 18, marginRight: 1 }} />
                    Product Images (Max 5)
                  </label>
                  
                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-slate-500 mb-2">Current Images:</p>
                      <div className="flex flex-wrap gap-3">
                        {existingImages.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img.url}`}
                              alt={img.alt || 'Product'}
                              className="w-20 h-20 object-cover rounded-xl border-2 border-slate-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index, true)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <CloseIcon sx={{ fontSize: 14 }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Image Previews */}
                  {imagePreview.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-slate-500 mb-2">New Images:</p>
                      <div className="flex flex-wrap gap-3">
                        {imagePreview.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-xl border-2 border-brand-primary"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <CloseIcon sx={{ fontSize: 14 }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  {(images.length + existingImages.length) < 5 && (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-brand-primary hover:bg-slate-50 transition-all">
                      <CloudUploadIcon sx={{ fontSize: 40, color: '#94a3b8' }} />
                      <span className="text-sm text-slate-500 mt-2">Click to upload images</span>
                      <span className="text-xs text-slate-400">JPEG, PNG, WebP (max 5MB each)</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Email Notification Option - Only for new products */}
                {!editingId && (
                  <div className="md:col-span-2 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="notifyUsers"
                        id="notifyUsers"
                        checked={form.notifyUsers}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="notifyUsers" className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                        <EmailIcon sx={{ fontSize: 20 }} />
                        Notify all registered users via email about this new product
                      </label>
                    </div>
                    <p className="text-xs text-blue-600 mt-2 ml-8">
                      An email will be sent to all users announcing this new product
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon sx={{ fontSize: 20 }} />
                      {editingId ? "Update Product" : "Create Product"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 p-8 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DeleteIcon sx={{ fontSize: 32, color: '#ef4444' }} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Delete Product?</h3>
              <p className="text-slate-500 mt-2">This action cannot be undone. The product will be permanently removed from your inventory.</p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-6 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;