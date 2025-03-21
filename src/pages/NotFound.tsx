
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { usePerformance } from "@/contexts/PerformanceContext";

const NotFound = () => {
  const location = useLocation();
  const { trackError } = usePerformance();

  useEffect(() => {
    // Log the 404 error
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Track as an application error
    trackError(`404 Error: ${location.pathname}`, 'medium');
  }, [location.pathname, trackError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 rounded-lg bg-white shadow-lg max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-soft-pink">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <a 
          href="/" 
          className="px-4 py-2 bg-soft-pink text-white rounded-md hover:bg-soft-pink/90 transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
