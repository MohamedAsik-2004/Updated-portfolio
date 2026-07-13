import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col justify-center items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="w-full h-full rounded-full border-[3px] border-primary/10 border-t-primary animate-spin" />
        </div>
        <span className="mono-label text-[10px] text-primary tracking-wider">Verifying Admin Session...</span>
      </div>
    );
  }

  // Redirect to login if user session is invalid, preserving target location path
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
