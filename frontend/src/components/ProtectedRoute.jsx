import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// This is the frontend equivalent of the "protect" middleware on the
// backend — except instead of blocking an API request, it blocks
// access to a whole page. If there's no logged-in user, redirect to /login.
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
