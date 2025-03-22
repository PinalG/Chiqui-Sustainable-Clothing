
import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Public Pages
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import NotFound from "@/pages/NotFound";

// Protected Pages
import Dashboard from "@/pages/Dashboard";
import UserProfile from "@/pages/UserProfile";
import Donations from "@/pages/Donations";
import RetailDonations from "@/pages/RetailDonations";
import Marketplace from "@/pages/Marketplace";
import ProductDetails from "@/pages/ProductDetails";
import Rewards from "@/pages/Rewards";
import Checkout from "@/pages/Checkout";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UserManagement from "@/pages/admin/UserManagement";
import ReportingDashboard from "@/pages/admin/ReportingDashboard";

// Logistics Pages
import Logistics from "@/pages/logistics/Logistics";

// Settings Pages
import SettingsPage from "@/pages/settings/SettingsPage";
import SecurityPage from "@/pages/settings/SecurityPage";
import PrivacyPage from "@/pages/settings/PrivacyPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Index />} />
        
        {/* Auth Routes */}
        <Route path="auth">
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
        
        {/* Basic Protected Routes - Any authenticated user */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        
        <Route path="donations" element={
          <ProtectedRoute>
            <Donations />
          </ProtectedRoute>
        } />
        
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="products/:id" element={<ProductDetails />} />
        
        <Route path="rewards" element={
          <ProtectedRoute>
            <Rewards />
          </ProtectedRoute>
        } />
        
        <Route path="checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        
        {/* Role-specific Routes */}
        <Route path="retail-donations" element={
          <ProtectedRoute allowedRoles={["retailer", "admin"]}>
            <RetailDonations />
          </ProtectedRoute>
        } />
        
        <Route path="logistics" element={
          <ProtectedRoute allowedRoles={["logistics", "admin"]}>
            <Logistics />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="admin">
          <Route index element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="users" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="reports" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ReportingDashboard />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Settings Routes */}
        <Route path="settings">
          <Route index element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="security" element={
            <ProtectedRoute>
              <SecurityPage />
            </ProtectedRoute>
          } />
          <Route path="privacy" element={
            <ProtectedRoute>
              <PrivacyPage />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
