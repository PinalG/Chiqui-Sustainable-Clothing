
/**
 * Application performance and error monitoring service
 * In production, this would be replaced with a real monitoring service like Sentry
 */

type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

interface ErrorReport {
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  url: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface PerformanceMetric {
  name: string;
  value: number;
  url: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

class MonitoringService {
  private initialized = false;
  private userId: string | null = null;
  private errorQueue: ErrorReport[] = [];
  private metricsQueue: PerformanceMetric[] = [];
  private flushInterval: ReturnType<typeof setInterval> | null = null;
  
  init(userId?: string) {
    if (this.initialized) return;
    
    this.initialized = true;
    if (userId) {
      this.userId = userId;
    }
    
    // Set up global error handler
    this.setupErrorHandler();
    
    // Set up performance monitoring
    this.setupPerformanceMonitoring();
    
    // Set up interval to flush queues
    this.flushInterval = setInterval(() => this.flushQueues(), 30000);
    
    console.log('Monitoring initialized', userId ? `for user ${userId}` : 'anonymously');
  }
  
  setUser(userId: string) {
    this.userId = userId;
  }
  
  captureError(error: Error | string, severity: ErrorSeverity = 'medium', metadata?: Record<string, any>) {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    const errorReport: ErrorReport = {
      message: errorObj.message,
      stack: errorObj.stack,
      severity,
      url: window.location.href,
      timestamp: Date.now(),
      metadata: {
        ...metadata,
        userId: this.userId,
      },
    };
    
    if (!this.initialized) {
      this.errorQueue.push(errorReport);
      return;
    }
    
    console.error('Monitoring error:', errorReport);
    // In production, this would send the error to a monitoring service
  }
  
  captureMetric(name: string, value: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      url: window.location.href,
      timestamp: Date.now(),
      metadata: {
        ...metadata,
        userId: this.userId,
      },
    };
    
    if (!this.initialized) {
      this.metricsQueue.push(metric);
      return;
    }
    
    console.log('Performance metric:', metric);
    // In production, this would send the metric to a monitoring service
  }
  
  private setupErrorHandler() {
    window.addEventListener('error', (event) => {
      this.captureError(event.error || event.message, 'high');
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        'high',
        { type: 'unhandledRejection' }
      );
    });
  }
  
  private setupPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        // Ensure we have valid timing values before calculating
        if (timing.loadEventEnd > 0 && timing.navigationStart > 0) {
          const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
          const domReadyTime = timing.domComplete - timing.domLoading;
          
          // Only capture positive values to avoid incorrect metrics
          if (pageLoadTime > 0) {
            this.captureMetric('page_load_time', pageLoadTime);
          }
          if (domReadyTime > 0) {
            this.captureMetric('dom_ready_time', domReadyTime);
          }
        }
      }
    });
    
    // Monitor long tasks using PerformanceObserver if available
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) {
              this.captureMetric('long_task_duration', entry.duration, {
                entryType: entry.entryType,
                name: entry.name,
              });
            }
          });
        });
        
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.error('PerformanceObserver for longtask not supported', e);
      }
    }
  }
  
  private flushQueues() {
    if (!this.initialized) return;
    
    // Process error queue
    if (this.errorQueue.length > 0) {
      console.log(`Flushing ${this.errorQueue.length} errors`);
      // In production, this would batch send errors to a monitoring service
      this.errorQueue = [];
    }
    
    // Process metrics queue
    if (this.metricsQueue.length > 0) {
      console.log(`Flushing ${this.metricsQueue.length} metrics`);
      // In production, this would batch send metrics to a monitoring service
      this.metricsQueue = [];
    }
  }
  
  shutdown() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    
    this.flushQueues();
    this.initialized = false;
  }
}

const monitoring = new MonitoringService();
export default monitoring;
