import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchCurrentUser, setToken, logoutSuccess } from "../../features/auth/authSlice";
import { toast } from "react-toastify";

const AuthCallback = () => {
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuth = async () => {
      const token = params.get("token");
      const errorParam = params.get("error");

      if (errorParam) {
        const errorMessage = decodeURIComponent(errorParam);
        setError(errorMessage);
        toast.error(errorMessage, { toastId: 'auth-callback-error' });
        setTimeout(() => navigate("/login", { replace: true }), 2000);
        return;
      }

      if (token) {
        try {
          // Set token first
          dispatch(setToken(token));
          
          // Wait for user data to be fetched
          const result = await dispatch(fetchCurrentUser()).unwrap();
          
          // Show success message
          toast.success(`Welcome back, ${result.name}!`, { toastId: 'auth-welcome' });
          
          // Navigate based on user role
          if (result.role === "admin") {
            navigate("/admin", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        } catch (err) {
          console.error("Auth error:", err);
          // Clear any invalid token
          dispatch(logoutSuccess());
          setError("Failed to authenticate. Please try again.");
          toast.error("Authentication failed. Please try again.", { toastId: 'auth-failed' });
          setTimeout(() => navigate("/login", { replace: true }), 2000);
        }
      } else {
        navigate("/login", { replace: true });
      }
    };

    handleAuth();
  }, [dispatch, params, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">{error}</p>
          <p className="text-brand-slate">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
        <p className="text-brand-primary text-lg">Finalizing your secure session…</p>
      </div>
    </div>
  );
};

export default AuthCallback;

