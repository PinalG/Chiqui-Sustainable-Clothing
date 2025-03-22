
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import RouteChangeTracker from '@/components/performance/RouteChangeTracker';
import { publicRoutes, protectedRoutes, roleSpecificRoutes, adminRoutes, errorRoutes } from '@/routes/routes';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { WebSocketProvider } from '@/contexts/WebSocketContext';
import { AuthProvider } from '@/contexts/AuthContext';
import './App.css';

// Define the type for route objects
interface RouteObject {
  path: string;
  element: React.ReactNode;
  children?: RouteObject[];
}

function App() {
  const location = useLocation();
  
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.info('Mock users for development: consumer@example.com / password123, retailer@example.com / password123, logistics@example.com / password123, admin@example.com / password123');
    }
  }, []);

  // Define all routes by combining route groups
  const allRoutes = [...publicRoutes, ...protectedRoutes, ...roleSpecificRoutes, ...adminRoutes, ...errorRoutes] as RouteObject[];

  return (
    <ThemeProvider defaultTheme="light" storageKey="chiqui-theme">
      <AuthProvider>
        <WebSocketProvider>
          <RouteChangeTracker />
          <Routes location={location}>
            {allRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element}>
                {route.children?.map((child) => (
                  <Route key={child.path} path={child.path} element={child.element} />
                ))}
              </Route>
            ))}
          </Routes>
          <Toaster />
        </WebSocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
