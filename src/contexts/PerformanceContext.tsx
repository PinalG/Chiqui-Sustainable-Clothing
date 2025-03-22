
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '@/hooks/use-analytics';
import { useRouteTracking } from '@/hooks/use-route-tracking';
import { useMonitoring } from '@/hooks/use-monitoring';

interface PerformanceContextType {
  trackEvent: (category: string, action: string, label?: string, value?: any) => void;
  lastRenderTime: number;
  componentRenderTimes: Record<string, number>;
  recordComponentRender: (componentName: string, renderTime: number) => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const PerformanceProvider = ({ children }: { children: ReactNode }) => {
  const { trackEvent, trackPageview } = useAnalytics();
  const { trackRouteChange } = useRouteTracking();
  const { logError } = useMonitoring();
  const location = useLocation();
  const [lastRenderTime, setLastRenderTime] = useState(0);
  const [componentRenderTimes, setComponentRenderTimes] = useState<Record<string, number>>({});

  // Track route changes
  useEffect(() => {
    // Record route change time
    const routeChangeTime = performance.now();
    setLastRenderTime(routeChangeTime);
    
    // Track page view in analytics
    trackPageview({
      path: location.pathname,
      title: 'Chiqui - Sustainable Fashion Platform',
      referrer: document.referrer
    });
    
    // Track route change as custom event
    trackEvent(
      'navigation',
      'pageView',
      location.pathname
    );
    
    // Call custom route change tracking
    trackRouteChange(location.pathname);
  }, [location.pathname, trackPageview, trackEvent, trackRouteChange]);

  // Global error handler
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      logError({
        message: event.message,
        stack: event.error?.stack,
        type: 'runtime',
        location: location.pathname,
        timestamp: new Date().toISOString()
      });
      
      // Track error as event
      trackEvent('error', 'runtime', event.message);
    };

    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, [logError, trackEvent, location.pathname]);

  // Record component render time
  const recordComponentRender = (componentName: string, renderTime: number) => {
    setComponentRenderTimes(prev => ({
      ...prev,
      [componentName]: renderTime
    }));
  };

  return (
    <PerformanceContext.Provider
      value={{
        trackEvent,
        lastRenderTime,
        componentRenderTimes,
        recordComponentRender
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};
