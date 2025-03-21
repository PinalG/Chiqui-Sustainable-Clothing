
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Donations from "./pages/Donations";
import PaperDonations from "./pages/PaperDonations";
import Logistics from "./pages/logistics/Logistics";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import UserProfile from "./pages/UserProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import ReportingDashboard from "./pages/admin/ReportingDashboard";
import SettingsPage from "./pages/settings/SettingsPage";
import PrivacyPage from "./pages/settings/PrivacyPage";
import { UserRole } from "./contexts/AuthContext";
import "./styles/accessibility.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            
            {/* Routes for all authenticated users */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              } />
              <Route path="/marketplace" element={
                <MainLayout>
                  <Marketplace />
                </MainLayout>
              } />
              <Route path="/product/:id" element={
                <MainLayout>
                  <ProductDetails />
                </MainLayout>
              } />
              <Route path="/checkout" element={
                <MainLayout>
                  <Checkout />
                </MainLayout>
              } />
              <Route path="/profile" element={
                <MainLayout>
                  <UserProfile />
                </MainLayout>
              } />
              <Route path="/logistics" element={
                <MainLayout>
                  <Logistics />
                </MainLayout>
              } />
              <Route path="/settings" element={
                <MainLayout>
                  <SettingsPage />
                </MainLayout>
              } />
              <Route path="/settings/privacy" element={
                <MainLayout>
                  <PrivacyPage />
                </MainLayout>
              } />
            </Route>
            
            {/* Routes for consumers only */}
            <Route element={<ProtectedRoute allowedRoles={["consumer"] as UserRole[]} />}>
              <Route path="/donations" element={
                <MainLayout>
                  <Donations />
                </MainLayout>
              } />
            </Route>
            
            {/* Routes for retailers only */}
            <Route element={<ProtectedRoute allowedRoles={["retailer"] as UserRole[]} requiresConsentVerification={true} />}>
              <Route path="/paper-donations" element={
                <MainLayout>
                  <PaperDonations />
                </MainLayout>
              } />
            </Route>
            
            {/* Routes for admin only */}
            <Route element={<ProtectedRoute allowedRoles={["admin"] as UserRole[]} />}>
              <Route path="/admin/dashboard" element={
                <MainLayout>
                  <AdminDashboard />
                </MainLayout>
              } />
              <Route path="/admin/users" element={
                <MainLayout>
                  <UserManagement />
                </MainLayout>
              } />
              <Route path="/admin/reports" element={
                <MainLayout>
                  <ReportingDashboard />
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
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
