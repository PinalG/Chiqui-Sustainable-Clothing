
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import analytics from '@/lib/analytics';
import monitoring from '@/lib/monitoring';
import { useLocation, useNavigationType } from 'react-router-dom';

interface PerformanceContextType {
  trackEvent: (category: string, action: string, label?: string, value?: number) => void;
  trackError: (error: Error | string, severity?: 'low' | 'medium' | 'high' | 'critical') => void;
  trackMetric: (name: string, value: number, metadata?: Record<string, any>) => void;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigationType = useNavigationType();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize services
  useEffect(() => {
    if (isInitialized) return;
    
    analytics.init(user?.uid);
    monitoring.init(user?.uid);
    
    setIsInitialized(true);
    
    // Track page load performance
    if (window.performance) {
      const timing = window.performance.timing;
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      
      if (pageLoadTime > 0) {
        monitoring.captureMetric('page_load_time', pageLoadTime);
      }
    }
    
    return () => {
      monitoring.shutdown();
    };
  }, [user?.uid, isInitialized]);
  
  // Track page views
  useEffect(() => {
    if (!isInitialized) return;
    
    const path = location.pathname + location.search;
    
    // Track page view in analytics
    analytics.trackPageView({
      path,
      title: document.title,
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
  }, [location.pathname, location.search, navigationType, isInitialized]);
  
  // Utility functions
  const trackEvent = (category: string, action: string, label?: string, value?: number) => {
    analytics.trackEvent({ category, action, label, value });
  };
  
  const trackError = (error: Error | string, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium') => {
    monitoring.captureError(error, severity);
  };
  
  const trackMetric = (name: string, value: number, metadata?: Record<string, any>) => {
    monitoring.captureMetric(name, value, metadata);
  };
  
  return (
    <PerformanceContext.Provider
      value={{
        trackEvent,
        trackError,
        trackMetric,
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  
  return context;
}
