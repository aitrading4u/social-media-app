import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  console.log('🔒 ProtectedRoute: isAuthenticated:', isAuthenticated);
  console.log('🔒 ProtectedRoute: user:', user);

  if (!isAuthenticated || !user) {
    console.log('🔒 ProtectedRoute: Redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 