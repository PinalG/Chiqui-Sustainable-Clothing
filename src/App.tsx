
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import RouteChangeTracker from '@/components/performance/RouteChangeTracker';
import routes from '@/routes/routes';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { WebSocketProvider } from '@/contexts/WebSocketContext';
import './App.css';

function App() {
  const location = useLocation();
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.info('Mock users for development: consumer@example.com / password123, retailer@example.com / password123, logistics@example.com / password123, admin@example.com / password123');
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="chiqui-theme">
      <WebSocketProvider>
        <RouteChangeTracker />
        <Routes location={location}>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element}>
              {route.children &&
                route.children.map((child) => (
                  <Route key={child.path} path={child.path} element={child.element} />
                ))}
            </Route>
          ))}
        </Routes>
        <Toaster />
      </WebSocketProvider>
    </ThemeProvider>
  );
}

export default App;
