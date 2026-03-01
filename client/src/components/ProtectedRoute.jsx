import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="section-shell py-20 text-slate-300">Loading secure workspace...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
