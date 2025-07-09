import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import * as React from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
} 