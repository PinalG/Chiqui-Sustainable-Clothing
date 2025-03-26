
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { usePerformance } from "@/contexts/PerformanceContext";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

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
        <p className="text-xl text-gray-600 mb-2">Oops! Page not found</p>
        <p className="text-gray-500 mb-6">
          The page "{location.pathname}" you're looking for doesn't exist or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline" className="flex gap-2 items-center">
            <Link to={-1 as any}>
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
          <Button asChild className="bg-soft-pink hover:bg-soft-pink/90 flex gap-2 items-center">
            <Link to="/">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
