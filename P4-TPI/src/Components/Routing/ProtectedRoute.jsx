import { Navigate } from "react-router-dom";
import { useAuth } from "../../../CustomHooks/AuthContext";

// Generic auth/role gate. Pass `allowedRoles` to restrict to specific roles,
// or omit it to only require the user to be authenticated.
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;
