import { Navigate } from "react-router-dom";
import { useApp } from "../states/AppProvider";

export default function ProtectedRoute({ children }) {
  const { sessionUserId } = useApp();
  if (!sessionUserId) return <Navigate to="/login" replace />;
  return children ? children : null;
}