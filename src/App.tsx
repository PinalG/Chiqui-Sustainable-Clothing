
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PerformanceProvider } from "@/contexts/PerformanceContext";
import RouteChangeTracker from "@/components/performance/RouteChangeTracker";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import {
  publicRoutes,
  protectedRoutes,
  roleSpecificRoutes,
  adminRoutes,
  errorRoutes,
  PublicRouteWrapper,
  ProtectedRouteWrapper,
  RoleProtectedRouteWrapper,
  AdminRouteWrapper
} from "@/routes/routes";
import "./styles/accessibility.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

const loadingFallback = (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingAnimation size="lg" color="soft-pink" message="Loading..." />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PerformanceProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <RouteChangeTracker />
            <Suspense fallback={loadingFallback}>
              <Routes>
                {/* Public routes */}
                {publicRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<PublicRouteWrapper>{route.element}</PublicRouteWrapper>}
                  />
                ))}
                
                {/* Protected routes for all authenticated users */}
                {protectedRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<ProtectedRouteWrapper>{route.element}</ProtectedRouteWrapper>}
                  />
                ))}
                
                {/* Role-specific routes */}
                {roleSpecificRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <RoleProtectedRouteWrapper 
                        allowedRoles={route.allowedRoles}
                        requiresConsentVerification={route.requiresConsentVerification}
                      >
                        {route.element}
                      </RoleProtectedRouteWrapper>
                    }
                  />
                ))}
                
                {/* Admin routes */}
                {adminRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<AdminRouteWrapper>{route.element}</AdminRouteWrapper>}
                  />
                ))}
                
                {/* Error and fallback routes */}
                {errorRoutes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </PerformanceProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
