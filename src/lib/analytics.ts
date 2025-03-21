
// Simple analytics tracking utility
// This would be replaced with a real analytics service in production

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

interface PageView {
  path: string;
  title?: string;
  referrer?: string;
}

class AnalyticsService {
  private initialized = false;
  private userId: string | null = null;
  private queue: Array<{ type: 'event' | 'pageview', data: AnalyticsEvent | PageView }> = [];
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  
  init(userId?: string) {
    this.initialized = true;
    if (userId) {
      this.userId = userId;
    }
    
    console.log('Analytics initialized', userId ? `for user ${userId}` : 'anonymously');
    this.processQueue();
  }
  
  setUser(userId: string) {
    this.userId = userId;
    console.log(`Analytics user set to ${userId}`);
  }
  
  trackEvent({ category, action, label, value, nonInteraction = false }: AnalyticsEvent) {
    const event = { category, action, label, value, nonInteraction };
    
    if (!this.initialized) {
      this.queue.push({ type: 'event', data: event });
      return;
    }
    
    console.log('Analytics event:', event);
    
    // In a real implementation, this would send data to an analytics service
    // For example:
    // window.gtag('event', action, {
    //   event_category: category,
    //   event_label: label,
    //   value: value,
    //   non_interaction: nonInteraction
    // });
  }
  
  trackPageView({ path, title, referrer }: PageView) {
    if (!this.initialized) {
      this.queue.push({ type: 'pageview', data: { path, title, referrer } });
      return;
    }
    
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    this.debounceTimer = setTimeout(() => {
      console.log('Analytics pageview:', { path, title, referrer });
      
      // In a real implementation, this would send data to an analytics service
      // For example:
      // window.gtag('config', 'GA-TRACKING-ID', {
      //   page_path: path,
      //   page_title: title,
      //   page_referrer: referrer
      // });
    }, 300);
  }
  
  // Track sustainability impact specifically
  trackSustainabilityImpact(metrics: {
    co2Saved?: number;
    waterSaved?: number;
    energySaved?: number;
    itemsRecycled?: number;
  }) {
    if (!this.initialized) {
      this.queue.push({
        type: 'event',
        data: {
          category: 'Sustainability',
          action: 'Impact Metrics',
          label: JSON.stringify(metrics)
        }
      });
      return;
    }
    
    console.log('Sustainability Impact Metrics:', metrics);
    
    // Track each metric individually for better analytics
    if (metrics.co2Saved) {
      this.trackEvent({
        category: 'Sustainability',
        action: 'CO2 Saved',
        value: metrics.co2Saved
      });
    }
    
    if (metrics.waterSaved) {
      this.trackEvent({
        category: 'Sustainability',
        action: 'Water Saved',
        value: metrics.waterSaved
      });
    }
    
    if (metrics.energySaved) {
      this.trackEvent({
        category: 'Sustainability',
        action: 'Energy Saved',
        value: metrics.energySaved
      });
    }
    
    if (metrics.itemsRecycled) {
      this.trackEvent({
        category: 'Sustainability',
        action: 'Items Recycled',
        value: metrics.itemsRecycled
      });
    }
  }
  
  private processQueue() {
    if (!this.initialized || this.queue.length === 0) return;
    
    this.queue.forEach(item => {
      if (item.type === 'event') {
        this.trackEvent(item.data as AnalyticsEvent);
      } else if (item.type === 'pageview') {
        this.trackPageView(item.data as PageView);
      }
    });
    
    this.queue = [];
  }
}

const analytics = new AnalyticsService();
export default analytics;
