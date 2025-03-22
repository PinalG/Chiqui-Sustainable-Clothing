
import { useCallback, useEffect, useRef } from 'react';
import { usePerformance } from '@/contexts/PerformanceContext';
import monitoring from '@/lib/monitoring';

export function useRouteTracking() {
  const { trackEvent } = usePerformance();
  const lastRouteRef = useRef<string>('');
  const routeStartTimeRef = useRef<number>(0);
  
  const trackRouteChange = useCallback((path: string) => {
    const currentTime = performance.now();
    
    // Track the time spent on the previous route if we have that data
    if (lastRouteRef.current && routeStartTimeRef.current) {
      const timeSpent = currentTime - routeStartTimeRef.current;
      
      // Track time spent on route
      monitoring.captureMetric('time_on_route', timeSpent, {
        route: lastRouteRef.current
      });
      
      trackEvent(
        'navigation',
        'routeDuration',
        lastRouteRef.current,
        Math.round(timeSpent)
      );
    }
    
    // Update refs for the new route
    lastRouteRef.current = path;
    routeStartTimeRef.current = currentTime;
  }, [trackEvent]);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      const currentTime = performance.now();
      if (lastRouteRef.current && routeStartTimeRef.current) {
        const timeSpent = currentTime - routeStartTimeRef.current;
        
        monitoring.captureMetric('time_on_route', timeSpent, {
          route: lastRouteRef.current
        });
      }
    };
  }, []);
  
  return { trackRouteChange };
}
