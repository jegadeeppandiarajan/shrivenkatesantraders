import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ProtectedRoute = () => {
  const { user, token, initialized, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading || (token && !initialized)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-brand-primary">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if no token or user
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
