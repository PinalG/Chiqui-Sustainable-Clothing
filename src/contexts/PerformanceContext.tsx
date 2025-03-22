
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '@/lib/analytics';
import monitoring from '@/lib/monitoring';

interface PerformanceContextType {
  trackEvent: (category: string, action: string, label?: string, value?: any) => void;
  trackError: (message: string, severity?: string) => void;
  lastRenderTime: number;
  componentRenderTimes: Record<string, number>;
  recordComponentRender: (componentName: string, renderTime: number) => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const PerformanceProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [lastRenderTime, setLastRenderTime] = useState(0);
  const [componentRenderTimes, setComponentRenderTimes] = useState<Record<string, number>>({});

  // Initialize analytics and monitoring
  useEffect(() => {
    analytics.init();
    monitoring.init();
    
    return () => {
      monitoring.shutdown();
    };
  }, []);

  // Track route changes
  useEffect(() => {
    // Record route change time
    const routeChangeTime = performance.now();
    setLastRenderTime(routeChangeTime);
    
    // Track page view in analytics
    analytics.trackPageView({
      path: location.pathname,
      title: 'Chiqui - Sustainable Fashion Platform',
      referrer: document.referrer
    });
    
    // Track route change as custom event
    analytics.trackEvent({
      category: 'navigation',
      action: 'pageView',
      label: location.pathname
    });
    
    // Capture route change performance metric
    monitoring.captureMetric('route_change_time', routeChangeTime);
  }, [location.pathname]);

  // Global error handler
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      monitoring.captureError(event.error || event.message, 'high', {
        location: location.pathname,
        timestamp: new Date().toISOString()
      });
      
      // Track error as event
      analytics.trackEvent({
        category: 'error',
        action: 'runtime',
        label: event.message
      });
    };

    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, [location.pathname]);

  // Track event wrapper
  const trackEvent = (category: string, action: string, label?: string, value?: any) => {
    analytics.trackEvent({ 
      category, 
      action, 
      label, 
      value 
    });
  };

  // Track error wrapper
  const trackError = (message: string, severity: string = 'medium') => {
    monitoring.captureError(message, severity as any);
  };

  // Record component render time
  const recordComponentRender = (componentName: string, renderTime: number) => {
    setComponentRenderTimes(prev => ({
      ...prev,
      [componentName]: renderTime
    }));
    
    monitoring.captureMetric(`component_render_${componentName}`, renderTime);
  };

  return (
    <PerformanceContext.Provider
      value={{
        trackEvent,
        trackError,
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
