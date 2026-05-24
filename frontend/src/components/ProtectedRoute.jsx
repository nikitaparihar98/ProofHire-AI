import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute component ensures that a user is authenticated and has an allowed role.
 * It can be used with a single `role` prop (string) or an `allowedRoles` array.
 * If the user is not authenticated, they are redirected to /login.
 * If the user lacks the required role, they are redirected to their appropriate dashboard.
 */
export default function ProtectedRoute({ children, role, allowedRoles = [] }) {
  const { user, loading, isAuthenticated } = useAuth();

  // Loading state while auth status is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        Loading...
      </div>
    );
  }

  // Not logged in – send to login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Determine allowed roles based on props
  const roles = allowedRoles.length > 0 ? allowedRoles : role ? [role] : [];

  // Role restriction – redirect to appropriate dashboard if role mismatch
  if (roles.length && !roles.includes(user.role)) {
    const redirectPath =
      user.role === "recruiter" ? "/recruiter-dashboard" : "/candidate/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  // All good – render protected content
  return <>{children}</>;
}
