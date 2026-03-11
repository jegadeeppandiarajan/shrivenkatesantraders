import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../services/api";
import { useTheme } from "../../context/ThemeContext";
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
import LinkIcon from '@mui/icons-material/Link';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const initialForm = { name: "", category: "Pipes", price: "", stock: "", description: "", shortDescription: "", featured: false, notifyUsers: true };
const categories = ["Pipes", "Motors", "Accessories", "Fittings", "Valves", "Pumps"];

// Get base URL for images (strip /api suffix if present)
const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace(/\/api\/?$/, '');
};

const ManageProducts = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
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
  const [imageUploadMode, setImageUploadMode] = useState('upload');
  const [imageUrls, setImageUrls] = useState([]);
  const [urlInput, setUrlInput] = useState('');

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
    if (files.length === 0) return;
    
    if (files.length + getTotalImageCount() > 5) {
      showNotification("Maximum 5 images allowed", "error");
      e.target.value = ''; // Reset input
      return;
    }
    
    // Validate file sizes (5MB max each)
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        showNotification(`${file.name} is too large (max 5MB)`, "error");
        return false;
      }
      return true;
    });
    
    if (validFiles.length === 0) {
      e.target.value = ''; // Reset input
      return;
    }
    
    setImages(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreview(prev => [...prev, ...newPreviews]);
    
    // Reset input to allow selecting the same file again
    e.target.value = '';
  };

  const removeImage = (index, type = 'new') => {
    if (type === 'existing') {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else if (type === 'url') {
      setImageUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      setImages(prev => prev.filter((_, i) => i !== index));
      URL.revokeObjectURL(imagePreview[index]);
      setImagePreview(prev => prev.filter((_, i) => i !== index));
    }
  };

  const getTotalImageCount = () => images.length + existingImages.length + imageUrls.length;

  const handleAddImageUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      showNotification('Please enter a valid URL', 'error');
      return;
    }
    if (getTotalImageCount() >= 5) {
      showNotification('Maximum 5 images allowed', 'error');
      return;
    }
    setImageUrls(prev => [...prev, url]);
    setUrlInput('');
  };

  const openCreateModal = () => {
    setForm(initialForm);
    setImages([]);
    setImagePreview([]);
    setExistingImages([]);
    setImageUrls([]);
    setUrlInput('');
    setImageUploadMode('upload');
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
    setImageUrls([]);
    setUrlInput('');
    setImageUploadMode('upload');
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
    setImageUrls([]);
    setUrlInput('');
    setImageUploadMode('upload');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      
      // Append form fields with proper type conversion
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('price', Number(form.price));
      formData.append('stock', Number(form.stock));
      formData.append('description', form.description);
      formData.append('shortDescription', form.shortDescription || '');
      formData.append('featured', form.featured);
      
      // Append new images - must use the File objects directly
      if (images.length > 0) {
        console.log(`Uploading ${images.length} new image(s)`);
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          console.log(`Image ${i}: ${image.name}, size: ${image.size}, type: ${image.type}`);
          formData.append('images', image, image.name);
        }
      }

      // Append URL-based images
      if (imageUrls.length > 0) {
        formData.append('imageUrls', JSON.stringify(imageUrls));
      }

      // For edit, send existing images info
      if (editingId) {
        // Always send existing images array (even if empty or adding new ones)
        formData.append('existingImages', JSON.stringify(existingImages));
        
        // Don't set Content-Type header - let axios set it with proper boundary
        await api.put(`/products/${editingId}`, formData);
        showNotification("Product updated successfully!");
      } else {
        formData.append('notifyUsers', form.notifyUsers);
        // Don't set Content-Type header - let axios set it with proper boundary
        await api.post("/products", formData);
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
    <div className="p-4 sm:p-5 lg:p-8 space-y-4 sm:space-y-6">
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
          <p className="text-brand-slate mt-1">Manage your inventory, add new products, and track stock levels</p>
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
      <div className={`bg-gradient-to-r from-slate-50 to-white rounded-2xl p-4 sm:p-6 border border-brand-primary/10 shadow-sm transition-all duration-700 ${
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
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 outline-none transition-all"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 outline-none transition-all min-w-[180px]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}

          </select>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-brand-slate">
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
      <div className={`bg-white rounded-2xl border border-brand-primary/10 shadow-lg overflow-hidden transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`} style={{ transitionDelay: "200ms" }}>
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-brand-slate mt-4">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <InventoryIcon sx={{ fontSize: 72, color: '#94a3b8' }} />
            <p className="text-brand-slate mt-4">No products found. Create your first product!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-brand-primary/10">
                  <th className="text-left py-4 px-3 sm:px-4 lg:px-6 font-semibold text-slate-600 text-xs sm:text-sm uppercase tracking-wider">Product</th>
                  <th className="text-left py-4 px-3 sm:px-4 lg:px-6 font-semibold text-slate-600 text-xs sm:text-sm uppercase tracking-wider hidden sm:table-cell">Category</th>
                  <th className="text-left py-4 px-3 sm:px-4 lg:px-6 font-semibold text-slate-600 text-xs sm:text-sm uppercase tracking-wider">Price</th>
                  <th className="text-left py-4 px-3 sm:px-4 lg:px-6 font-semibold text-slate-600 text-xs sm:text-sm uppercase tracking-wider hidden md:table-cell">Stock</th>
                  <th className="text-left py-4 px-3 sm:px-4 lg:px-6 font-semibold text-slate-600 text-xs sm:text-sm uppercase tracking-wider hidden lg:table-cell">Status</th>
                  <th className="text-right py-4 px-3 sm:px-4 lg:px-6 font-semibold text-slate-600 text-xs sm:text-sm uppercase tracking-wider">Actions</th>
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
                    <td className="py-4 px-3 sm:px-4 lg:px-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0].url.startsWith('http') ? product.images[0].url : `${getBaseUrl()}${product.images[0].url}`}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#64748b"><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16z"/></svg>';
                              }}
                            />
                          ) : (
                            <InventoryIcon sx={{ fontSize: 24, color: '#64748b' }} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-brand-dark text-sm sm:text-base">{product.name}</p>
                          <p className="text-xs sm:text-sm text-brand-slate line-clamp-1 max-w-[120px] sm:max-w-xs">{product.shortDescription || product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 sm:px-4 lg:px-6 hidden sm:table-cell">
                      <span className="px-2 sm:px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs sm:text-sm font-medium rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-3 sm:px-4 lg:px-6">
                      <span className="font-bold text-brand-dark text-sm sm:text-base">₹ {product.price.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-3 sm:px-4 lg:px-6 hidden md:table-cell">
                      <span className={`font-semibold text-sm ${product.stock < 10 ? "text-red-500" : "text-slate-700"}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-3 sm:px-4 lg:px-6 hidden lg:table-cell">
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
                    <td className="py-4 px-3 sm:px-4 lg:px-6">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-brand-slate hover:text-brand-primary hover:bg-brand-primary/10 rounded-2xl transition-all"
                          title="Edit product"
                        >
                          <EditIcon sx={{ fontSize: 20 }} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product._id)}
                          className="p-2 text-brand-slate hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={closeModal}>
          <div
            className={`rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-scale-in ${darkMode ? 'bg-dark-card' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`shrink-0 border-b px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between rounded-t-3xl ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-brand-primary/10'}`}>
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>
                  {editingId ? "Edit Product" : "Create New Product"}
                </h2>
                <p className={`mt-1 ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>
                  {editingId ? "Update the product details below" : "Fill in the details to add a new product"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className={`p-2 rounded-2xl transition-colors ${darkMode ? 'hover:bg-dark-hover' : 'hover:bg-slate-100'}`}
              >
                <CloseIcon sx={{ fontSize: 24 }} className={darkMode ? 'text-dark-muted' : 'text-brand-slate'} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 overflow-y-auto flex-1">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>Product Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g., PVC Pipe 4 inch"
                    className={`w-full px-4 py-3 rounded-2xl border transition-all outline-none ${darkMode ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary' : 'bg-slate-50 border-slate-200 text-brand-dark focus:border-brand-primary focus:bg-white'}`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>Category *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-2xl border transition-all outline-none ${darkMode ? 'bg-dark-bg border-dark-border text-dark-text focus:border-brand-primary' : 'bg-slate-50 border-slate-200 text-brand-dark focus:border-brand-primary focus:bg-white'}`}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>Price (₹) *</label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    className={`w-full px-4 py-3 rounded-2xl border transition-all outline-none ${darkMode ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary' : 'bg-slate-50 border-slate-200 text-brand-dark focus:border-brand-primary focus:bg-white'}`}
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>Stock Quantity *</label>
                  <input
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="Enter stock quantity"
                    className={`w-full px-4 py-3 rounded-2xl border transition-all outline-none ${darkMode ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary' : 'bg-slate-50 border-slate-200 text-brand-dark focus:border-brand-primary focus:bg-white'}`}
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
                  <label htmlFor="featured" className={`text-sm font-semibold ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>
                    Mark as Featured Product
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>Short Description</label>
                  <input
                    name="shortDescription"
                    value={form.shortDescription}
                    onChange={handleChange}
                    placeholder="Brief product summary (shown in listings)"
                    className={`w-full px-4 py-3 rounded-2xl border transition-all outline-none ${darkMode ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary' : 'bg-slate-50 border-slate-200 text-brand-dark focus:border-brand-primary focus:bg-white'}`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>Full Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Detailed product description..."
                    className={`w-full px-4 py-3 rounded-2xl border transition-all outline-none h-32 resize-none ${darkMode ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary' : 'bg-slate-50 border-slate-200 text-brand-dark focus:border-brand-primary focus:bg-white'}`}
                    required
                  />
                </div>

                {/* Image Upload Section */}
                <div className="md:col-span-2">
                  <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>
                    <ImageIcon sx={{ fontSize: 18, marginRight: 1 }} />
                    Product Images (Max 5) — {getTotalImageCount()}/5 added
                  </label>

                  {/* All Image Previews */}
                  {(existingImages.length > 0 || imagePreview.length > 0 || imageUrls.length > 0) && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-3">
                        {existingImages.map((img, index) => (
                          <div key={`existing-${index}`} className="relative group">
                            <img
                              src={img.url.startsWith('http') ? img.url : `${getBaseUrl()}${img.url}`}
                              alt={img.alt || 'Product'}
                              className={`w-20 h-20 object-cover rounded-2xl border-2 ${darkMode ? 'border-dark-border' : 'border-slate-200'}`}
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=No+Image'; }}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index, 'existing')}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <CloseIcon sx={{ fontSize: 14 }} />
                            </button>
                          </div>
                        ))}
                        {imagePreview.map((url, index) => (
                          <div key={`new-${index}`} className="relative group">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-2xl border-2 border-brand-primary"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index, 'new')}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <CloseIcon sx={{ fontSize: 14 }} />
                            </button>
                          </div>
                        ))}
                        {imageUrls.map((url, index) => (
                          <div key={`url-${index}`} className="relative group">
                            <img
                              src={url}
                              alt={`URL ${index + 1}`}
                              className={`w-20 h-20 object-cover rounded-2xl border-2 border-indigo-400`}
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=Invalid'; }}
                            />
                            <div className={`absolute bottom-0 left-0 right-0 text-center text-[9px] font-medium py-0.5 rounded-b-2xl bg-indigo-500 text-white`}>URL</div>
                            <button
                              type="button"
                              onClick={() => removeImage(index, 'url')}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <CloseIcon sx={{ fontSize: 14 }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Mode Tabs */}
                  {getTotalImageCount() < 5 && (
                    <div>
                      <div className="flex mb-3 gap-1">
                        <button
                          type="button"
                          onClick={() => setImageUploadMode('upload')}
                          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl transition-all ${imageUploadMode === 'upload'
                            ? 'bg-brand-primary text-white shadow-sm'
                            : darkMode ? 'bg-dark-hover text-dark-muted hover:text-dark-text' : 'bg-slate-100 text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          <CloudUploadIcon sx={{ fontSize: 18 }} />
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageUploadMode('url')}
                          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl transition-all ${imageUploadMode === 'url'
                            ? 'bg-brand-primary text-white shadow-sm'
                            : darkMode ? 'bg-dark-hover text-dark-muted hover:text-dark-text' : 'bg-slate-100 text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          <LinkIcon sx={{ fontSize: 18 }} />
                          Image URL
                        </button>
                      </div>

                      {imageUploadMode === 'upload' ? (
                        <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${darkMode ? 'border-dark-border hover:border-brand-primary hover:bg-dark-hover' : 'border-slate-300 hover:border-brand-primary hover:bg-slate-50'}`}>
                          <CloudUploadIcon sx={{ fontSize: 32 }} className={darkMode ? 'text-dark-muted' : 'text-slate-400'} />
                          <span className={`text-sm mt-1 ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>Click to upload images</span>
                          <span className={`text-xs ${darkMode ? 'text-dark-muted' : 'text-slate-400'}`}>JPEG, PNG, WebP (max 5MB each)</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <div className={`flex gap-2`}>
                          <input
                            type="url"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); }}}
                            placeholder="https://example.com/image.jpg"
                            className={`flex-1 px-4 py-3 rounded-2xl border transition-all outline-none text-sm ${darkMode ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary' : 'bg-slate-50 border-slate-200 text-brand-dark focus:border-brand-primary focus:bg-white'}`}
                          />
                          <button
                            type="button"
                            onClick={handleAddImageUrl}
                            className="px-4 py-3 bg-brand-primary text-white font-semibold rounded-2xl hover:bg-brand-primary/90 transition-colors flex items-center gap-1.5"
                          >
                            <AddPhotoAlternateIcon sx={{ fontSize: 20 }} />
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Email Notification Option - Only for new products */}
                {!editingId && (
                  <div className={`md:col-span-2 p-4 rounded-2xl border ${darkMode ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-100'}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="notifyUsers"
                        id="notifyUsers"
                        checked={form.notifyUsers}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="notifyUsers" className={`flex items-center gap-2 text-sm font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                        <EmailIcon sx={{ fontSize: 20 }} />
                        Notify all registered users via email about this new product
                      </label>
                    </div>
                    <p className={`text-xs mt-2 ml-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      An email will be sent to all users announcing this new product
                    </p>
                  </div>
                )}
              </div>

              <div className={`flex items-center justify-end gap-4 pt-4 border-t ${darkMode ? 'border-dark-border' : 'border-brand-primary/10'}`}>
                <button
                  type="button"
                  onClick={closeModal}
                  className={`px-6 py-3 font-semibold rounded-2xl transition-colors ${darkMode ? 'text-dark-muted hover:bg-dark-hover' : 'text-slate-600 hover:bg-slate-100'}`}
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
            className={`rounded-3xl shadow-2xl w-full max-w-md mx-4 p-8 animate-scale-in ${darkMode ? 'bg-dark-card' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
                <DeleteIcon sx={{ fontSize: 32, color: '#ef4444' }} />
              </div>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Delete Product?</h3>
              <p className={`mt-2 ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>This action cannot be undone. The product will be permanently removed from your inventory.</p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className={`px-6 py-3 font-semibold rounded-2xl transition-colors ${darkMode ? 'text-dark-muted hover:bg-dark-hover' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-6 py-3 bg-red-500 text-white font-semibold rounded-2xl hover:bg-red-600 transition-colors"
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
