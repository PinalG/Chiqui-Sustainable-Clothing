
import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PerformanceProvider } from "@/contexts/PerformanceContext";
import RouteChangeTracker from "@/components/performance/RouteChangeTracker";
import { LazyComponent } from "@/components/ui/lazy-component";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { UserRole } from "./contexts/AuthContext";
import "./styles/accessibility.css";

// Lazy load all pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Donations = lazy(() => import("./pages/Donations"));
const PaperDonations = lazy(() => import("./pages/PaperDonations"));
const Logistics = lazy(() => import("./pages/logistics/Logistics"));
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const ReportingDashboard = lazy(() => import("./pages/admin/ReportingDashboard"));
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));
const PrivacyPage = lazy(() => import("./pages/settings/PrivacyPage"));
const Rewards = lazy(() => import("./pages/Rewards"));

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
            <Routes>
              {/* Auth Routes */}
              <Route path="/auth/login" element={
                <LazyComponent fallback={loadingFallback}>
                  <Login />
                </LazyComponent>
              } />
              <Route path="/auth/signup" element={
                <LazyComponent fallback={loadingFallback}>
                  <Signup />
                </LazyComponent>
              } />
              <Route path="/auth/forgot-password" element={
                <LazyComponent fallback={loadingFallback}>
                  <ForgotPassword />
                </LazyComponent>
              } />
              
              {/* Routes for all authenticated users */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={
                  <MainLayout>
                    <LazyComponent>
                      <Dashboard />
                    </LazyComponent>
                  </MainLayout>
                } />
                <Route path="/marketplace" element={
                  <MainLayout>
                    <LazyComponent>
                      <Marketplace />
                    </LazyComponent>
                  </MainLayout>
                } />
                <Route path="/product/:id" element={
                  <MainLayout>
                    <LazyComponent>
                      <ProductDetails />
                    </LazyComponent>
                  </MainLayout>
                } />
                <Route path="/checkout" element={
                  <MainLayout>
                    <LazyComponent>
                      <Checkout />
                    </LazyComponent>
                  </MainLayout>
                } />
                <Route path="/profile" element={
                  <MainLayout>
                    <LazyComponent>
                      <UserProfile />
                    </LazyComponent>
                  </MainLayout>
                } />
                <Route path="/logistics" element={
                  <MainLayout>
                    <LazyComponent>
                      <Logistics />
                    </LazyComponent>
                  </MainLayout>
                } />
                <Route path="/rewards" element={
                  <MainLayout>
                    <LazyComponent>
                      <Rewards />
                    </LazyComponent>
                  </MainLayout>
                } />
                <Route path="/settings" element={
                  <MainLayout>
                    <LazyComponent>
                      <SettingsPage />
                    </LazyComponent>
                  </MainLayout>
                } />
                <Route path="/settings/privacy" element={
                  <MainLayout>
                    <LazyComponent>
                      <PrivacyPage />
                    </LazyComponent>
                  </MainLayout>
                } />
              </Route>
              
              {/* Routes for consumers only */}
              <Route element={<ProtectedRoute allowedRoles={["consumer"] as UserRole[]} />}>
                <Route path="/donations" element={
                  <MainLayout>
                    <LazyComponent>
                      <Donations />
                    </LazyComponent>
                  </MainLayout>
                } />
              </Route>
              
              {/* Routes for retailers only */}
              <Route element={<ProtectedRoute allowedRoles={["retailer"] as UserRole[]} requiresConsentVerification={true} />}>
                <Route path="/paper-donations" element={
                  <MainLayout>
                    <LazyComponent>
                      <PaperDonations />
                    </LazyComponent>
                  </MainLayout>
                } />
              </Route>
              
              {/* Routes for admin only */}
              <Route element={<ProtectedRoute allowedRoles={["admin"] as UserRole[]} />}>
                <Route path="/admin/dashboard" element={
                  <MainLayout>
                    <LazyComponent>
                      <AdminDashboard />
                    </LazyComponent>
                  </MainLayout>
                } />
                <Route path="/admin/users" element={
                  <MainLayout>
                    <LazyComponent>
                      <UserManagement />
                    </LazyComponent>
                  </MainLayout>
                } />
                <Route path="/admin/reports" element={
                  <MainLayout>
                    <LazyComponent>
                      <ReportingDashboard />
                    </LazyComponent>
                  </MainLayout>
                } />
              </Route>
              
              {/* Unauthorized Route */}
              <Route path="/unauthorized" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center p-6 max-w-md">
                    <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                    <p className="mb-4">You don't have permission to access this page.</p>
                    <a href="/" className="text-soft-pink hover:underline">Return to Home</a>
                  </div>
                </div>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </PerformanceProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
