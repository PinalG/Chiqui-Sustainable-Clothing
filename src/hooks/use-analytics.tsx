
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import analytics from "@/lib/analytics";

export function useAnalytics() {
  const location = useLocation();
  const { user } = useAuth();
  
  // Initialize analytics once
  useEffect(() => {
    analytics.init(user?.uid);
  }, [user?.uid]);
  
  // Track page views
  useEffect(() => {
    const path = location.pathname + location.search;
    
    analytics.trackPageView({
      path,
      title: document.title,
      referrer: document.referrer,
    });
  }, [location.pathname, location.search]);
  
  return analytics;
}
