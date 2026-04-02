import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole, requiredRoles }) => {
  const { isAuthenticated, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offwhite">
        <div className="flex items-end gap-1 justify-center">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-4 bg-teal rounded-sm animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check single role
  if (requiredRole && profile?.role !== requiredRole) {
    // Allow admin to access any role-restricted page
    if (profile?.role !== 'admin') {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check multiple roles
  if (requiredRoles && !requiredRoles.includes(profile?.role)) {
    if (profile?.role !== 'admin') {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
