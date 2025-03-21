
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import analytics from "@/lib/analytics";

export function useAnalytics() {
  const location = useLocation();
  const { user } = useAuth();
  
  // Initialize analytics once
  useEffect(() => {
    try {
      analytics.init(user?.uid);
    } catch (error) {
      console.error("Failed to initialize analytics:", error);
    }
  }, [user?.uid]);
  
  // Track page views
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    
    try {
      analytics.trackPageView({
        path: currentPath,
        title: document.title,
        referrer: document.referrer,
      });
    } catch (error) {
      console.error("Failed to track page view:", error);
    }
    
    return () => {
      // Clean up or finalize tracking for this page view if needed
    };
  }, [location.pathname, location.search]);
  
  return analytics;
}
