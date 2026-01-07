import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById } from "../../features/products/productSlice";
import { addCartItem } from "../../features/cart/cartSlice";
import { toast } from "react-toastify";
import api from "../../services/api";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector((state) => state.products.selected);
  const { user } = useSelector((state) => state.auth);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState({ average: 0, count: 0 });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
    fetchReviews();
  }, [dispatch, id]);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const { data } = await api.get(`/products/${id}/reviews`);
      setReviews(data.data.reviews || []);
      setRatings(data.data.ratings || { average: 0, count: 0 });
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-500 mt-4">Loading product…</p>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast.info("Please login to add items to cart", {
        position: "top-center",
        autoClose: 2000,
      });
      navigate("/login");
      return;
    }

    setIsAdding(true);
    try {
      await dispatch(addCartItem({ productId: product._id, quantity: 1 })).unwrap();
      toast.success(`${product.name} added to cart!`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(error || "Failed to add item to cart", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info("Please login to submit a review", { position: "top-center" });
      navigate("/login");
      return;
    }

    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, reviewForm);
      toast.success("Review submitted successfully!");
      setReviewForm({ rating: 5, comment: "" });
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await api.delete(`/products/${id}/reviews/${reviewId}`);
      toast.success("Review deleted");
      fetchReviews();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const renderStars = (rating, interactive = false, size = 20) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (interactive) {
        stars.push(
          <button
            key={i}
            type="button"
            onClick={() => setReviewForm(prev => ({ ...prev, rating: i }))}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            {i <= rating ? (
              <StarIcon sx={{ fontSize: size, color: '#f59e0b' }} />
            ) : (
              <StarBorderIcon sx={{ fontSize: size, color: '#f59e0b' }} />
            )}
          </button>
        );
      } else {
        if (i <= Math.floor(rating)) {
          stars.push(<StarIcon key={i} sx={{ fontSize: size, color: '#f59e0b' }} />);
        } else if (i - 0.5 <= rating) {
          stars.push(<StarHalfIcon key={i} sx={{ fontSize: size, color: '#f59e0b' }} />);
        } else {
          stars.push(<StarBorderIcon key={i} sx={{ fontSize: size, color: '#d1d5db' }} />);
        }
      }
    }
    return stars;
  };

  const hasUserReviewed = reviews.some(review => review.user?._id === user?._id);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Product Header */}
        <div className="p-8">
          <p className="text-xs uppercase tracking-[0.5em] text-slate-400 mb-4">{product.category}</p>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <>
                    <img
                      src={`${apiUrl}${product.images[selectedImage]?.url}`}
                      alt={product.images[selectedImage]?.alt || product.name}
                      className="w-full h-full object-contain"
                    />
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                        >
                          <ChevronLeftIcon />
                        </button>
                        <button
                          onClick={() => setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                        >
                          <ChevronRightIcon />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon sx={{ fontSize: 120, color: '#cbd5e1' }} />
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-brand-primary ring-2 ring-brand-primary/30' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={`${apiUrl}${img.url}`}
                        alt={img.alt || `${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
                
                {/* Rating Summary */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center">
                    {renderStars(ratings.average)}
                  </div>
                  <span className="text-sm text-slate-500">
                    {ratings.average.toFixed(1)} ({ratings.count} {ratings.count === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              </div>

              <p className="text-brand-primary text-4xl font-bold">₹ {product.price.toLocaleString()}</p>
              
              {product.mrp && product.mrp > product.price && (
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 line-through text-lg">₹ {product.mrp.toLocaleString()}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </span>
                </div>
              )}

              <p className="text-slate-600 leading-relaxed">{product.description}</p>

              <div className="flex items-center gap-6 text-sm">
                <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `In stock: ${product.stock}` : 'Out of stock'}
                </span>
                {product.isLowStock && product.stock > 0 && (
                  <span className="text-amber-500 font-semibold">⚠️ Low stock alert</span>
                )}
              </div>

              <button 
                onClick={handleAddToCart} 
                disabled={isAdding || product.stock === 0}
                className="w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-dark text-white font-semibold hover:shadow-lg hover:shadow-brand-primary/30 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-3"
              >
                {isAdding ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : product.stock === 0 ? (
                  "Out of Stock"
                ) : (
                  <>
                    <ShoppingCartIcon sx={{ fontSize: 22 }} />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="border-t border-slate-100 p-8">
            <h3 className="text-sm uppercase tracking-[0.4em] text-slate-400 font-semibold mb-4">Specifications</h3>
            <div className="bg-slate-50 rounded-2xl p-6">
              <dl className="grid md:grid-cols-2 gap-4">
                {product.specifications.map((spec) => (
                  <div key={spec.key} className="flex justify-between text-sm py-2 border-b border-slate-200 last:border-0">
                    <dt className="text-slate-500">{spec.key}</dt>
                    <dd className="font-semibold text-slate-900">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="border-t border-slate-100 p-8">
          <h3 className="text-sm uppercase tracking-[0.4em] text-slate-400 font-semibold mb-6">Customer Reviews</h3>
          
          {/* Review Form */}
          {user && !hasUserReviewed && (
            <form onSubmit={handleSubmitReview} className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 mb-8 border border-slate-100">
              <h4 className="font-semibold text-slate-800 mb-4">Write a Review</h4>
              
              <div className="mb-4">
                <label className="block text-sm text-slate-600 mb-2">Your Rating</label>
                <div className="flex gap-1">
                  {renderStars(reviewForm.rating, true, 28)}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-slate-600 mb-2">Your Review</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience with this product..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 outline-none transition-all resize-none h-24"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-dark transition-all disabled:opacity-50"
              >
                {submittingReview ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <SendIcon sx={{ fontSize: 18 }} />
                    Submit Review
                  </>
                )}
              </button>
            </form>
          )}

          {!user && (
            <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-center">
              <p className="text-slate-600">
                <button onClick={() => navigate('/login')} className="text-brand-primary font-semibold hover:underline">
                  Login
                </button>
                {' '}to write a review
              </p>
            </div>
          )}

          {hasUserReviewed && (
            <div className="bg-green-50 rounded-2xl p-4 mb-8 text-center">
              <p className="text-green-700 font-medium">✓ You have already reviewed this product</p>
            </div>
          )}

          {/* Reviews List */}
          {loadingReviews ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center">
                        {review.user?.avatar ? (
                          <img src={review.user.avatar} alt={review.user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <PersonIcon sx={{ fontSize: 20, color: '#0A5C80' }} />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{review.user?.name || 'Anonymous'}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(review.rating, false, 16)}</div>
                      {(review.user?._id === user?._id || user?.role === 'admin') && (
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                          title="Delete review"
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-600 mt-3">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <StarBorderIcon sx={{ fontSize: 48, color: '#cbd5e1' }} />
              <p className="mt-2">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
