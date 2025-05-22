
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/AuthTypes';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiresConsentVerification?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  allowedRoles, 
  requiresConsentVerification = false 
}: ProtectedRouteProps) => {
  const { user, userData, isLoading } = useAuth();
  
  // Skip auth checks in preview mode to allow immediate access
  if (window.location.hostname.includes('lovable')) {
    console.log("Preview mode: bypassing auth checks");
    return <>{children}</>;
  }

  // Show loading state while auth is being checked
  if (isLoading) {
    // You can replace this with a proper loading component
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/auth/login" replace />;
  }

  // Role-based access control
  if (allowedRoles && userData?.role && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Consent verification check
  if (requiresConsentVerification && 
      userData?.consentSettings &&
      !userData.consentSettings.dataSharing) {
    return <Navigate to="/settings/privacy?redirect=consent-required" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
