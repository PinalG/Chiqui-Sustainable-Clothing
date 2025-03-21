
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
    try {
      const path = location.pathname + location.search;
      
      analytics.trackPageView({
        path,
        title: document.title,
        referrer: document.referrer,
      });
    } catch (error) {
      console.error("Failed to track page view:", error);
    }
  }, [location.pathname, location.search]);
  
  return analytics;
}
