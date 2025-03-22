
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import analytics from '@/lib/analytics';
import monitoring from '@/lib/monitoring';

export interface PerformanceMetric {
  name: string;
  type: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface PerformanceContextType {
  trackEvent: (category: string, action: string, label?: string, value?: number) => void;
  trackError: (error: Error | string, severity?: 'low' | 'medium' | 'high' | 'critical') => void;
  trackMetric: (metric: PerformanceMetric) => void;
  trackCustomMetric: (name: string, value: number, metadata?: Record<string, any>) => void;
  isMonitoringInitialized: boolean;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize services without router dependencies
  useEffect(() => {
    if (isInitialized) return;
    
    try {
      // Initialize analytics and monitoring with user ID if available
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
  }, [user?.uid, isInitialized]);
  
  // Utility functions
  const trackEvent = (category: string, action: string, label?: string, value?: number) => {
    analytics.trackEvent({ category, action, label, value });
  };
  
  const trackError = (error: Error | string, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium') => {
    monitoring.captureError(error, severity);
  };
  
  const trackMetric = (metric: PerformanceMetric) => {
    monitoring.captureMetric(metric.name, metric.value, metric.metadata);
  };
  
  const trackCustomMetric = (name: string, value: number, metadata?: Record<string, any>) => {
    monitoring.captureMetric(name, value, metadata);
  };
  
  return (
    <PerformanceContext.Provider
      value={{
        trackEvent,
        trackError,
        trackMetric,
        trackCustomMetric,
        isMonitoringInitialized: isInitialized
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformanceContext() {
  const context = useContext(PerformanceContext);
  
  if (!context) {
    throw new Error('usePerformanceContext must be used within a PerformanceProvider');
  }
  
  return context;
}

export function usePerformance() {
  return usePerformanceContext();
}
