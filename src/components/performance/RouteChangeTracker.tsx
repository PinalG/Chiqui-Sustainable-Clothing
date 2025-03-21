
import { FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRouteTracking } from '@/hooks/use-route-tracking';
import { usePerformance } from '@/contexts/PerformanceContext';

const RouteChangeTracker: FC = () => {
  const location = useLocation();
  const { trackEvent } = usePerformance();
  
  // Use the hook for tracking
  useRouteTracking();
  
  // Track initial page view and subsequent route changes
  useEffect(() => {
    try {
      trackEvent('navigation', 'pageView', location.pathname);
    } catch (error) {
      console.error('Error tracking route change:', error);
    }
  }, [location.pathname, trackEvent]);
  
  // This component doesn't render anything
  return null;
};

export default RouteChangeTracker;
