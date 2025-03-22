
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DidAuthProvider } from "@/contexts/DidAuthContext";
import { PerformanceProvider } from "@/contexts/PerformanceContext";
import { I18nProvider } from "@/contexts/I18nContext";
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
  <div className="min-h-screen flex items-center justify-center" aria-live="polite" aria-busy="true">
    <LoadingAnimation size="lg" color="soft-pink" message="Loading..." />
  </div>
);

const App = () => {
  // Add keyboard shortcut to focus on accessibility settings
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + Shift + A
      if (event.altKey && event.shiftKey && event.key === 'A') {
        const accessibilitySettingsLink = document.querySelector('a[href="/settings/accessibility"]');
        if (accessibilitySettingsLink instanceof HTMLElement) {
          accessibilitySettingsLink.focus();
          accessibilitySettingsLink.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Add viewport meta tag for proper mobile scaling
  React.useEffect(() => {
    // Check if the viewport meta tag exists
    let viewport = document.querySelector('meta[name="viewport"]');
    
    // If it doesn't exist, create it
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    
    // Set the content with proper mobile viewport settings
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    
    // Cleanup function not needed since we want this to persist
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <I18nProvider>
          <DidAuthProvider>
            <PerformanceProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  {/* Skip to content link for keyboard users */}
                  <a href="#main-content" className="skip-nav">
                    Skip to main content
                  </a>
                  
                  <RouteChangeTracker />
                  <Suspense fallback={loadingFallback}>
                    <main id="main-content" className="prevent-overflow">
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
                    </main>
                  </Suspense>
                </BrowserRouter>
              </TooltipProvider>
            </PerformanceProvider>
          </DidAuthProvider>
        </I18nProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
