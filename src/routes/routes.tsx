
import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { LazyComponent } from "@/components/ui/lazy-component";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import AdminLayout from "@/components/admin/AdminLayout";
import { UserRole } from "@/types/AuthTypes";
import NotFound from "@/pages/NotFound";

// Create a better lazy loading wrapper with loading animation
const lazyLoad = (
  importFn: () => Promise<any>, 
  loadingMessage = "Loading page...",
  minHeight = "60vh"
) => {
  const LazyComponent = lazy(importFn);
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingAnimation message={loadingMessage} size="lg" color="soft-pink" />
      </div>
    }>
      <LazyComponent />
    </Suspense>
  );
};

// Lazy loaded components with improved chunking patterns
const Dashboard = lazy(() => import(/* webpackChunkName: "dashboard" */ "@/pages/Dashboard"));
const Marketplace = lazy(() => import(/* webpackChunkName: "marketplace" */ "@/pages/Marketplace"));
const ProductDetails = lazy(() => import(/* webpackChunkName: "product-details" */ "@/pages/ProductDetails"));
const Checkout = lazy(() => import(/* webpackChunkName: "checkout" */ "@/pages/Checkout"));
const Donations = lazy(() => import(/* webpackChunkName: "donations" */ "@/pages/Donations"));
const RetailDonations = lazy(() => import(/* webpackChunkName: "retail-donations" */ "@/pages/RetailDonations"));
const Logistics = lazy(() => import(/* webpackChunkName: "logistics" */ "@/pages/logistics/Logistics"));
const Login = lazy(() => import(/* webpackChunkName: "auth" */ "@/pages/auth/Login"));
const Signup = lazy(() => import(/* webpackChunkName: "auth" */ "@/pages/auth/Signup"));
const ForgotPassword = lazy(() => import(/* webpackChunkName: "auth" */ "@/pages/auth/ForgotPassword"));
const UserProfile = lazy(() => import(/* webpackChunkName: "user" */ "@/pages/UserProfile"));
const AdminDashboard = lazy(() => import(/* webpackChunkName: "admin" */ "@/pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import(/* webpackChunkName: "admin" */ "@/pages/admin/UserManagement"));
const ReportingDashboard = lazy(() => import(/* webpackChunkName: "admin" */ "@/pages/admin/ReportingDashboard"));
const SettingsPage = lazy(() => import(/* webpackChunkName: "settings" */ "@/pages/settings/SettingsPage"));
const PrivacyPage = lazy(() => import(/* webpackChunkName: "settings" */ "@/pages/settings/PrivacyPage"));
const SecurityPage = lazy(() => import(/* webpackChunkName: "settings" */ "@/pages/settings/SecurityPage"));
const Rewards = lazy(() => import(/* webpackChunkName: "rewards" */ "@/pages/Rewards"));

// Route components that wrap routes with appropriate layouts and guards
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
    <AdminLayout title="Admin Dashboard">
      <LazyComponent>{children}</LazyComponent>
    </AdminLayout>
  </ProtectedRoute>
);

export const PublicRouteWrapper = ({ children }: { children: React.ReactNode }) => (
  <LazyComponent>{children}</LazyComponent>
);

// Define route groups for better organization
export const publicRoutes = [
  {
    path: "/auth/login",
    element: <PublicRouteWrapper><Login /></PublicRouteWrapper>,
  },
  {
    path: "/auth/signup",
    element: <PublicRouteWrapper><Signup /></PublicRouteWrapper>,
  },
  {
    path: "/auth/forgot-password",
    element: <PublicRouteWrapper><ForgotPassword /></PublicRouteWrapper>,
  },
];

export const protectedRoutes = [
  {
    path: "/",
    element: <ProtectedRouteWrapper><Dashboard /></ProtectedRouteWrapper>,
  },
  {
    path: "/marketplace",
    element: <ProtectedRouteWrapper><Marketplace /></ProtectedRouteWrapper>,
  },
  {
    path: "/product/:id",
    element: <ProtectedRouteWrapper><ProductDetails /></ProtectedRouteWrapper>,
  },
  {
    path: "/checkout",
    element: <ProtectedRouteWrapper><Checkout /></ProtectedRouteWrapper>,
  },
  {
    path: "/profile",
    element: <ProtectedRouteWrapper><UserProfile /></ProtectedRouteWrapper>,
  },
  {
    path: "/logistics",
    element: <ProtectedRouteWrapper><Logistics /></ProtectedRouteWrapper>,
  },
  {
    path: "/rewards",
    element: <ProtectedRouteWrapper><Rewards /></ProtectedRouteWrapper>,
  },
  {
    path: "/settings",
    element: <ProtectedRouteWrapper><SettingsPage /></ProtectedRouteWrapper>,
  },
  {
    path: "/settings/privacy",
    element: <ProtectedRouteWrapper><PrivacyPage /></ProtectedRouteWrapper>,
  },
  {
    path: "/settings/security",
    element: <ProtectedRouteWrapper><SecurityPage /></ProtectedRouteWrapper>,
  },
];

export const roleSpecificRoutes = [
  {
    path: "/donations",
    element: <RoleProtectedRouteWrapper allowedRoles={["consumer"] as UserRole[]}><Donations /></RoleProtectedRouteWrapper>,
  },
  {
    path: "/retail-donations",
    element: (
      <RoleProtectedRouteWrapper 
        allowedRoles={["retailer"] as UserRole[]} 
        requiresConsentVerification={true}
      >
        <RetailDonations />
      </RoleProtectedRouteWrapper>
    ),
  },
];

export const adminRoutes = [
  {
    path: "/admin/dashboard",
    element: <AdminRouteWrapper><AdminDashboard /></AdminRouteWrapper>,
  },
  {
    path: "/admin/users",
    element: <AdminRouteWrapper><UserManagement /></AdminRouteWrapper>,
  },
  {
    path: "/admin/reports",
    element: <AdminRouteWrapper><ReportingDashboard /></AdminRouteWrapper>,
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
