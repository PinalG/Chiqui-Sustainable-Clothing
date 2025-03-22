
import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import analytics from "@/lib/analytics";
import monitoring from "@/lib/monitoring";
import { usePerformance } from "@/contexts/PerformanceContext";

export function useRouteTracking() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const { trackMetric, isMonitoringInitialized } = usePerformance();
  const previousPathRef = useRef<string | null>(null);
  
  useEffect(() => {
    try {
      const path = location.pathname + location.search;
      
      // Avoid duplicate tracking for the same path
      if (previousPathRef.current === path) {
        return;
      }
      
      previousPathRef.current = path;
      
      // Only track if analytics and monitoring are properly initialized
      if (isMonitoringInitialized) {
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
            // Fix: Create a PerformanceMetric object to match the expected argument type
            trackMetric({
              name: 'route_change_time',
              type: 'navigation',
              value: navigationTiming.duration,
              timestamp: Date.now(),
              metadata: {
                path,
                navigationType,
              }
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to track route change:", error);
      // Fix: Make sure captureError is called with the correct number of arguments
      monitoring.captureError(error);
    }
  }, [location.pathname, location.search, navigationType, trackMetric, isMonitoringInitialized]);
}
