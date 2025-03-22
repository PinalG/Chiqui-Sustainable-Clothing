
import React, { createContext, useContext, useEffect, useState } from 'react';
import analytics from '@/lib/analytics';
import monitoring from '@/lib/monitoring';

interface PerformanceContextType {
  trackEvent: (category: string, action: string, label?: string, value?: number) => void;
  trackError: (error: Error | string, severity?: 'low' | 'medium' | 'high' | 'critical') => void;
  trackMetric: (name: string, value: number, metadata?: Record<string, any>) => void;
  isMonitoringInitialized: boolean;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize services without immediate auth dependency
  useEffect(() => {
    if (isInitialized) return;
    
    try {
      // Initialize analytics and monitoring without user ID initially
      // User ID can be added later when available
      analytics.init();
      monitoring.init();
      
      setIsInitialized(true);
      
      // Track page load performance
      if (window.performance) {
        const timing = window.performance.timing;
        const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
        
        if (pageLoadTime > 0) {
          monitoring.captureMetric('page_load_time', pageLoadTime);
        }
      }
    } catch (error) {
      console.error("Failed to initialize performance monitoring:", error);
    }
    
    return () => {
      try {
        monitoring.shutdown();
      } catch (error) {
        console.error("Failed to shutdown monitoring:", error);
      }
    };
  }, [isInitialized]);
  
  // Later, we can update the user context when auth is available
  useEffect(() => {
    // This can be implemented later to associate analytics with user
    // We'll add this after providers are properly organized
    const updateUserContext = async () => {
      // Implementation can be added later when needed
    };
    
    if (isInitialized) {
      updateUserContext().catch(console.error);
    }
  }, [isInitialized]);
  
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
        isMonitoringInitialized: isInitialized
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
