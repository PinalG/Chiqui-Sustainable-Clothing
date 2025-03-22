
import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { usePerformanceContext } from '@/contexts/PerformanceContext';

export type PerformanceMetricType = 
  | 'pageLoad' 
  | 'componentLoad' 
  | 'apiCall' 
  | 'imageLoad' 
  | 'interaction'
  | 'custom';

export interface PerformanceMetric {
  name: string;
  type: PerformanceMetricType;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface UsePerformanceOptions {
  enableAutoPageTracking?: boolean;
  trackLCP?: boolean;
  trackFID?: boolean;
  trackCLS?: boolean;
  trackFCP?: boolean;
  trackTTFB?: boolean;
  sampleRate?: number; // 0-1 for sampling percentage
}

export function usePerformance(options: UsePerformanceOptions = {}) {
  const { 
    enableAutoPageTracking = true,
    trackLCP = true,
    trackFID = true,
    trackCLS = true,
    trackFCP = true,
    trackTTFB = true,
    sampleRate = 1,
  } = options;
  
  const location = useLocation();
  const { trackMetric, trackCustomMetric } = usePerformanceContext();
  const hasTrackedInitialLoad = useRef(false);

  // Sampling function - returns true if this session should be tracked
  const shouldTrackSession = useCallback(() => {
    return Math.random() <= sampleRate;
  }, [sampleRate]);

  // Track component render time
  const trackComponentLoad = useCallback((componentName: string, renderTime: number, metadata?: Record<string, any>) => {
    if (!shouldTrackSession()) return;
    
    trackMetric({
      name: `${componentName}_render`,
      type: 'componentLoad',
      value: renderTime,
      timestamp: Date.now(),
      metadata
    });
  }, [trackMetric, shouldTrackSession]);

  // Track API call time
  const trackApiCall = useCallback((apiName: string, duration: number, metadata?: Record<string, any>) => {
    if (!shouldTrackSession()) return;
    
    trackMetric({
      name: `api_${apiName}`,
      type: 'apiCall',
      value: duration,
      timestamp: Date.now(),
      metadata
    });
  }, [trackMetric, shouldTrackSession]);

  // Track image load time
  const trackImageLoad = useCallback((imageId: string, loadTime: number, metadata?: Record<string, any>) => {
    if (!shouldTrackSession()) return;
    
    trackMetric({
      name: `image_${imageId}`,
      type: 'imageLoad',
      value: loadTime,
      timestamp: Date.now(),
      metadata
    });
  }, [trackMetric, shouldTrackSession]);

  // Track user interaction time
  const trackInteraction = useCallback((interactionId: string, duration: number, metadata?: Record<string, any>) => {
    if (!shouldTrackSession()) return;
    
    trackMetric({
      name: `interaction_${interactionId}`,
      type: 'interaction',
      value: duration,
      timestamp: Date.now(),
      metadata
    });
  }, [trackMetric, shouldTrackSession]);

  // Measure time between two points
  const measurePerformance = useCallback(() => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      return end - start;
    };
  }, []);

  // Track page load performance
  useEffect(() => {
    if (enableAutoPageTracking && shouldTrackSession()) {
      const pathname = location.pathname;
      
      // Only track on first load
      if (!hasTrackedInitialLoad.current) {
        hasTrackedInitialLoad.current = true;
        
        // Track basic navigation timing
        if (window.performance && window.performance.timing) {
          const timing = window.performance.timing;
          const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
          const dnsTime = timing.domainLookupEnd - timing.domainLookupStart;
          const connectTime = timing.connectEnd - timing.connectStart;
          const ttfb = timing.responseStart - timing.requestStart;
          const domLoadTime = timing.domComplete - timing.domLoading;
          
          trackCustomMetric('initialPageLoad', pageLoadTime, {
            page: pathname,
            dns: dnsTime,
            connect: connectTime,
            ttfb: ttfb,
            domLoad: domLoadTime
          });
        }
      } else {
        // For subsequent navigations, measure from the navigation event
        const endMeasure = measurePerformance();
        
        // Use requestAnimationFrame to wait until after the next paint
        requestAnimationFrame(() => {
          setTimeout(() => {
            const loadTime = endMeasure();
            trackCustomMetric('pageNavigation', loadTime, { page: pathname });
          }, 0);
        });
      }
    }
  }, [location, enableAutoPageTracking, trackCustomMetric, measurePerformance, shouldTrackSession]);

  // Track core web vitals using web-vitals
  useEffect(() => {
    if (shouldTrackSession()) {
      // Modern browsers only - use dynamic import
      if (trackLCP || trackFID || trackCLS || trackFCP || trackTTFB) {
        import('web-vitals').then(({ getLCP, getFID, getCLS, getFCP, getTTFB }) => {
          if (trackLCP) {
            getLCP((metric) => {
              trackCustomMetric('lcp', metric.value, { page: location.pathname });
            });
          }
          
          if (trackFID) {
            getFID((metric) => {
              trackCustomMetric('fid', metric.value, { page: location.pathname });
            });
          }
          
          if (trackCLS) {
            getCLS((metric) => {
              trackCustomMetric('cls', metric.value, { page: location.pathname });
            });
          }
          
          if (trackFCP) {
            getFCP((metric) => {
              trackCustomMetric('fcp', metric.value, { page: location.pathname });
            });
          }
          
          if (trackTTFB) {
            getTTFB((metric) => {
              trackCustomMetric('ttfb', metric.value, { page: location.pathname });
            });
          }
        }).catch(error => {
          console.error("Failed to load web-vitals", error);
        });
      }
    }
  }, [
    trackLCP, 
    trackFID, 
    trackCLS, 
    trackFCP, 
    trackTTFB, 
    location, 
    trackCustomMetric, 
    shouldTrackSession
  ]);

  return {
    trackComponentLoad,
    trackApiCall,
    trackImageLoad,
    trackInteraction,
    measurePerformance,
    trackCustomMetric
  };
}
