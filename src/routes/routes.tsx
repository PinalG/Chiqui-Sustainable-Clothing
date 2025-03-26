
import { lazy } from 'react';
import { Error404 } from '@/pages/errors/404';

// Lazy-loaded components
const Home = lazy(() => import('@/pages/Home'));
const Marketplace = lazy(() => import('@/pages/Marketplace'));
const RetailDonations = lazy(() => import('@/pages/RetailDonations'));
const Donations = lazy(() => import('@/pages/Donations'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const TaxBenefits = lazy(() => import('@/pages/TaxBenefits'));
const Logistics = lazy(() => import('@/pages/Logistics'));
const Support = lazy(() => import('@/pages/Support'));
const Inventory = lazy(() => import('@/pages/Inventory'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('@/pages/admin/UserManagement'));
const Reports = lazy(() => import('@/pages/admin/Reports'));
const Permissions = lazy(() => import('@/pages/admin/Permissions'));
const SettingsAccessibility = lazy(() => import('@/pages/settings/SettingsAccessibility'));
const SettingsProfile = lazy(() => import('@/pages/settings/SettingsProfile'));
const RetailerMarketplace = lazy(() => import("@/pages/retailer/RetailerMarketplace"));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const VerifyEmail = lazy(() => import('@/pages/VerifyEmail'));

// Route Wrappers
import { PublicRoute } from '@/routes/PublicRoute';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { RoleProtectedRoute } from '@/routes/RoleProtectedRoute';
import { AdminRoute } from '@/routes/AdminRoute';

// Public routes - accessible without authentication
export const publicRoutes = [
  { path: '/login', element: <PublicRoute><Login /></PublicRoute> },
  { path: '/register', element: <PublicRoute><Register /></PublicRoute> },
  { path: '/forgot-password', element: <PublicRoute><ForgotPassword /></PublicRoute> },
  { path: '/reset-password/:token', element: <PublicRoute><ResetPassword /></PublicRoute> },
  { path: '/verify-email/:token', element: <PublicRoute><VerifyEmail /></PublicRoute> },
];

// Protected routes - accessible only to authenticated users
export const protectedRoutes = [
  { path: '/', element: <ProtectedRoute><Home /></ProtectedRoute> },
  { path: '/marketplace', element: <ProtectedRoute><Marketplace /></ProtectedRoute> },
  { path: '/support', element: <ProtectedRoute><Support /></ProtectedRoute> },
  { path: '/settings/accessibility', element: <ProtectedRoute><SettingsAccessibility /></ProtectedRoute> },
  { path: '/settings/profile', element: <ProtectedRoute><SettingsProfile /></ProtectedRoute> },
];

// Role-specific routes - accessible only to users with specific roles
export const roleSpecificRoutes = [
  {
    path: '/donations',
    element: <RoleProtectedRoute allowedRoles={['consumer']} requiresConsentVerification={false}><Donations /></RoleProtectedRoute>,
    allowedRoles: ['consumer'],
    requiresConsentVerification: false,
  },
  {
    path: '/retail-donations',
    element: <RoleProtectedRoute allowedRoles={['retailer']} requiresConsentVerification={true}><RetailDonations /></RoleProtectedRoute>,
    allowedRoles: ['retailer'],
    requiresConsentVerification: true,
  },
  {
    path: '/inventory',
    element: <RoleProtectedRoute allowedRoles={['retailer']} requiresConsentVerification={true}><Inventory /></RoleProtectedRoute>,
    allowedRoles: ['retailer'],
    requiresConsentVerification: true,
  },
  {
    path: '/analytics',
    element: <RoleProtectedRoute allowedRoles={['retailer']} requiresConsentVerification={true}><Analytics /></RoleProtectedRoute>,
    allowedRoles: ['retailer'],
    requiresConsentVerification: true,
  },
  {
    path: '/tax-benefits',
    element: <RoleProtectedRoute allowedRoles={['retailer']} requiresConsentVerification={true}><TaxBenefits /></RoleProtectedRoute>,
    allowedRoles: ['retailer'],
    requiresConsentVerification: true,
  },
  {
    path: '/logistics',
    element: <RoleProtectedRoute allowedRoles={['logistics']} requiresConsentVerification={false}><Logistics /></RoleProtectedRoute>,
    allowedRoles: ['logistics'],
    requiresConsentVerification: false,
  },
  {
    path: "/retailer/marketplace",
    element: <RoleProtectedRoute allowedRoles={["retailer", "admin"]} requiresConsentVerification={false}><RetailerMarketplace /></RoleProtectedRoute>,
    allowedRoles: ["retailer", "admin"],
    requiresConsentVerification: false,
  },
];

// Admin routes - accessible only to admin users
export const adminRoutes = [
  {
    path: '/admin/dashboard',
    element: <AdminRoute><AdminDashboard /></AdminRoute>,
  },
  {
    path: '/admin/users',
    element: <AdminRoute><UserManagement /></AdminRoute>,
  },
  {
    path: '/admin/reports',
    element: <AdminRoute><Reports /></AdminRoute>,
  },
  {
    path: '/admin/permissions',
    element: <AdminRoute><Permissions /></AdminRoute>,
  }
];

// Error routes - fallback routes for errors and unknown paths
export const errorRoutes = [
  { path: '*', element: <Error404 /> },
];

// Route Wrappers
export const PublicRouteWrapper = ({ children }: { children: React.ReactNode }) => (
  <PublicRoute>{children}</PublicRoute>
);

export const ProtectedRouteWrapper = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

export const RoleProtectedRouteWrapper = ({
  children,
  allowedRoles,
  requiresConsentVerification,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
  requiresConsentVerification?: boolean;
}) => (
  <RoleProtectedRoute allowedRoles={allowedRoles} requiresConsentVerification={requiresConsentVerification}>
    {children}
  </RoleProtectedRoute>
);

export const AdminRouteWrapper = ({ children }: { children: React.ReactNode }) => (
  <AdminRoute>{children}</AdminRoute>
);
