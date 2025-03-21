
import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import analytics from "@/lib/analytics";
import monitoring from "@/lib/monitoring";

export function useRouteTracking() {
  const location = useLocation();
  const navigationType = useNavigationType();
  
  useEffect(() => {
    try {
      const path = location.pathname + location.search;
      
      // Track page view in analytics
      analytics.trackPageView({
        path,
        title: document.title,
        referrer: document.referrer,
      });
      
      // Track route change performance
      if (window.performance) {
        const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigationTiming) {
          monitoring.captureMetric('route_change_time', navigationTiming.duration, {
            path,
            navigationType,
          });
        }
      }
    } catch (error) {
      console.error("Failed to track route change:", error);
    }
  }, [location.pathname, location.search, navigationType]);
}
