
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiresConsentVerification?: boolean;
}

const ProtectedRoute = ({ 
  children,
  allowedRoles, 
  requiresConsentVerification = false 
}: ProtectedRouteProps) => {
  const { user, userData, isLoading } = useAuth();
  const location = useLocation();
  
  // Auto-allow in preview environment (simplified for demo purposes)
  if (window.location.hostname.includes('lovable')) {
    console.log("Preview environment detected - skipping auth checks");
    return <>{children}</>;
  }

  // Show loading state while auth state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-soft-pink" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && userData && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if consent verification is required and the user hasn't updated their consent settings
  if (requiresConsentVerification && 
      userData && 
      (!userData.consentSettings || 
      !userData.consentSettings.lastUpdated)) {
    return <Navigate to="/settings/privacy" state={{ from: location }} replace />;
  }

  // Render children
  return <>{children}</>;
};

export default ProtectedRoute;
