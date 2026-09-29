import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ role, allowedRoles }) {
  if (!role) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/billing" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
