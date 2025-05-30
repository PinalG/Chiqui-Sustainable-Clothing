import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserRole } from "@/types/AuthTypes";
import { LazyComponent } from "@/components/ui/lazy-component";
import NotFound from "@/pages/NotFound";

// Lazy loaded components
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Marketplace = lazy(() => import("@/pages/Marketplace"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const Donations = lazy(() => import("@/pages/Donations"));
const RetailDonations = lazy(() => import("@/pages/RetailDonations"));
const Logistics = lazy(() => import("@/pages/logistics/Logistics"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Signup = lazy(() => import("@/pages/auth/Signup"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const UserProfile = lazy(() => import("@/pages/UserProfile"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("@/pages/admin/UserManagement"));
const ReportingDashboard = lazy(() => import("@/pages/admin/ReportingDashboard"));
const SettingsPage = lazy(() => import("@/pages/settings/SettingsPage"));
const PrivacyPage = lazy(() => import("@/pages/settings/PrivacyPage"));
const SecurityPage = lazy(() => import("@/pages/settings/SecurityPage"));
const Rewards = lazy(() => import("@/pages/Rewards"));
const AnalyticsDashboard = lazy(() => import("@/pages/analytics/AnalyticsDashboard"));
const InventoryPage = lazy(() => import("@/pages/inventory/InventoryPage"));
const RetailerMarketplace = lazy(() => import("@/pages/retailer/RetailerMarketplace"));
const Support = lazy(() => import("@/pages/Support"));
const TaxBenefitsPage = lazy(() => import("@/pages/TaxBenefitsPage"));

// Define route groups for better organization
export const publicRoutes = [
  {
    path: "/auth/login",
    element: <LazyComponent><Login /></LazyComponent>,
  },
  {
    path: "/auth/signup",
    element: <LazyComponent><Signup /></LazyComponent>,
  },
  {
    path: "/auth/forgot-password",
    element: <LazyComponent><ForgotPassword /></LazyComponent>,
  },
];

export const protectedRoutes = [
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/marketplace",
    element: <Marketplace />,
  },
  {
    path: "/product/:id",
    element: <ProductDetails />,
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Checkout />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: <UserProfile />,
  },
  {
    path: "/rewards",
    element: <Rewards />,
  },
  {
    path: "/analytics",
    element: <AnalyticsDashboard />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "/settings/privacy",
    element: <PrivacyPage />,
  },
  {
    path: "/settings/security",
    element: <SecurityPage />,
  },
  {
    path: "/support",
    element: <Support />,
  },
];

export const roleSpecificRoutes = [
  {
    path: "/donations",
    element: <Donations />,
    allowedRoles: ["consumer", "user"] as UserRole[],
    requiresConsentVerification: true,
  },
  {
    path: "/retail-donations",
    element: <RetailDonations />,
    allowedRoles: ["retailer", "admin", "consumer"] as UserRole[],
    requiresConsentVerification: false,
  },
  {
    path: "/logistics",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Logistics />
        </MainLayout>
      </ProtectedRoute>
    ),
    allowedRoles: ["logistics", "admin"] as UserRole[],
  },
  {
    path: "/inventory",
    element: <InventoryPage />,
    allowedRoles: ["retailer", "admin"] as UserRole[],
  },
  {
    path: "/tax-benefits",
    element: <TaxBenefitsPage />,
    allowedRoles: ["retailer", "admin"] as UserRole[],
  },
  {
    path: "/retailer/marketplace",
    element: <RetailerMarketplace />,
    allowedRoles: ["retailer", "admin", "consumer"] as UserRole[],
    requiresConsentVerification: false,
  },
];

export const adminRoutes = [
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/users",
    element: <UserManagement />,
  },
  {
    path: "/admin/reports",
    element: <ReportingDashboard />,
  },
];

export const errorRoutes = [
  {
    path: "/unauthorized",
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-4">You don't have permission to access this page.</p>
          <a href="/" className="text-soft-pink hover:underline">Return to Home</a>
        </div>
      </div>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export const ProtectedRouteWrapper = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <MainLayout>
      <LazyComponent>{children}</LazyComponent>
    </MainLayout>
  </ProtectedRoute>
);

export const RoleProtectedRouteWrapper = ({ 
  children, 
  allowedRoles,
  requiresConsentVerification = false 
}: { 
  children: React.ReactNode, 
  allowedRoles: UserRole[],
  requiresConsentVerification?: boolean
}) => (
  <ProtectedRoute allowedRoles={allowedRoles} requiresConsentVerification={requiresConsentVerification}>
    <MainLayout>
      <LazyComponent>{children}</LazyComponent>
    </MainLayout>
  </ProtectedRoute>
);

export const AdminRouteWrapper = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={["admin"] as UserRole[]}>
    <AdminLayout title="Admin Panel">
      <LazyComponent>{children}</LazyComponent>
    </AdminLayout>
  </ProtectedRoute>
);

export const PublicRouteWrapper = ({ children }: { children: React.ReactNode }) => (
  <LazyComponent>{children}</LazyComponent>
);
