import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { Role } from "../api/client";

const ProtectedRoute: React.FC<{
  allowed: Role[];
  children: React.ReactElement;
}> = ({ allowed, children }) => {
  const { role, loading } = useAuth();
  if (loading) return null; // or a spinner
  if (!role) return <Navigate to="/login" replace />;
  if (!allowed.includes(role)) return <Navigate to="/unauthorized" replace />;
  return children;
};

export default ProtectedRoute;
