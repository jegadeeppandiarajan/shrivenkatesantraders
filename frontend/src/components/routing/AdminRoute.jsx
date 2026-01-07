import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const AdminRoute = () => {
  const { user, token, isAdmin, initialized, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading || (token && !initialized)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-white">Loading admin dashboard…</p>
        </div>
      </div>
    );
  }

  // Redirect to admin login if not authenticated
  if (!token || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Redirect to dashboard if authenticated but not admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
