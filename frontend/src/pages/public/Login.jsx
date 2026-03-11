import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { loginUser, clearError } from "../../features/auth/authSlice";
import { useTheme } from "../../context/ThemeContext";
import AnimatedBackground from "../../components/common/AnimatedBackground";
import { toast } from "react-toastify";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "http://localhost:5000";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { loading, error, user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleHovered, setIsGoogleHovered] = useState(false);

  useEffect(() => {
    // Check for OAuth error in URL
    const errorParam = searchParams.get("error");
    if (errorParam) {
      toast.error(decodeURIComponent(errorParam), { toastId: 'oauth-error' });
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error, { toastId: 'login-error' });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    dispatch(loginUser(formData));
  };

  const handleGoogleLogin = () => {
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  const { darkMode } = useTheme();

  return (
    <section className={`min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
      {/* Animated Background */}
      <AnimatedBackground />

      <div className="max-w-md w-full animate-scale-in relative z-10">
        <div className={`rounded-3xl border shadow-2xl p-8 md:p-10 relative overflow-hidden backdrop-blur-sm ${darkMode ? 'bg-dark-card/95 border-dark-border' : 'bg-white border-brand-primary/10'}`}>
          {/* Decorative */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-full blur-2xl"></div>
          
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/logo.png" 
              alt="Shri Venkatesan Traders" 
              className="h-16 w-auto object-contain"
            />
          </div>

          <p className={`text-xs uppercase tracking-[0.5em] text-center font-medium ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>Welcome back</p>
          <h1 className={`text-3xl font-display font-bold mt-3 text-center ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Sign In</h1>
          <p className={`mt-2 text-center text-sm font-display ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>
            Access your account to continue shopping
          </p>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleLogin}
            onMouseEnter={() => setIsGoogleHovered(true)}
            onMouseLeave={() => setIsGoogleHovered(false)}
            className={`mt-6 w-full flex items-center justify-center gap-3 border-2 rounded-full py-3.5 font-semibold transition-all duration-300 ${
              darkMode ? 'bg-dark-bg border-dark-border hover:border-brand-primary' : 'bg-white border-slate-200'
            } ${
              isGoogleHovered ? "border-brand-primary shadow-lg shadow-brand-primary/20 scale-[1.02]" : ""
            }`}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className={darkMode ? 'text-dark-text' : 'text-slate-700'}>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className={`flex-1 h-px ${darkMode ? 'bg-dark-border' : 'bg-brand-primary/20'}`}></div>
            <span className={`text-xs uppercase tracking-wider font-medium ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>or sign in with email</span>
            <div className={`flex-1 h-px ${darkMode ? 'bg-dark-border' : 'bg-brand-primary/20'}`}></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-5 py-3.5 rounded-full border-2 outline-none transition-all ${darkMode ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20' : 'border-brand-primary/20 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 bg-white'}`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full px-5 py-3.5 rounded-full border-2 outline-none transition-all pr-12 ${darkMode ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20' : 'border-brand-primary/20 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 bg-white'}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-dark-muted hover:text-dark-text' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {showPassword ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-secondary hover:shadow-lg hover:shadow-brand-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className={`mt-6 text-center text-sm ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>
            Don't have an account?{" "}
            <Link to="/register" className="text-brand-primary font-semibold hover:text-brand-accent transition-colors">
              Create account
            </Link>
          </p>

          {/* Admin Login Link */}
          <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-dark-border' : 'border-brand-primary/10'}`}>
            <Link 
              to="/admin/login" 
              className={`flex items-center justify-center gap-2 text-sm transition-colors ${darkMode ? 'text-dark-muted hover:text-brand-primary' : 'text-brand-slate hover:text-brand-primary'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Admin Login
            </Link>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex justify-center gap-6 text-slate-400">
          <div className="flex items-center gap-2 text-xs">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>256-bit SSL</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Secure Login</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;

