
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import analytics from "@/lib/analytics";

export function useAnalytics() {
  const location = useLocation();
  const { user } = useAuth();
  
  // Initialize analytics once
  useEffect(() => {
    try {
      analytics.init(user?.uid);
    } catch (error) {
      console.error("Failed to initialize analytics:", error);
    }
  }, [user?.uid]);
  
  // Track page views
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    
    try {
      analytics.trackPageView({
        path: currentPath,
        title: document.title,
        referrer: document.referrer,
      });
    } catch (error) {
      console.error("Failed to track page view:", error);
    }
    
    return () => {
      // Clean up or finalize tracking for this page view if needed
    };
  }, [location.pathname, location.search]);
  
  return analytics;
}

// Social sharing hook
export function useSocialSharing() {
  const { toast } = useToast();
  const analytics = useAnalytics();
  
  const shareContent = (options: {
    platform: string;
    text: string;
    url: string;
    title?: string;
    hashtags?: string[];
    media?: string;
    analyticsCategory?: string;
    analyticsAction?: string;
  }) => {
    const { 
      platform, 
      text, 
      url, 
      title = "Chiqui Sustainable Fashion", 
      hashtags = [],
      media,
      analyticsCategory = "Social",
      analyticsAction = "Share"
    } = options;
    
    // Create hashtag string if provided
    const hashtagString = hashtags.length > 0 ? hashtags.join(',') : '';
    
    let shareLink = '';
    
    switch(platform.toLowerCase()) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}${hashtagString ? `&hashtags=${hashtagString}` : ''}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`;
        break;
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
        break;
      case "pinterest":
        if (media) {
          shareLink = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(media)}&description=${encodeURIComponent(text)}`;
        } else {
          toast({
            title: "Missing Image",
            description: "Pinterest sharing requires an image.",
          });
          return false;
        }
        break;
      case "email":
        shareLink = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + " " + url)}`;
        break;
      case "native":
        if (navigator.share) {
          navigator.share({
            title,
            text,
            url,
          })
          .then(() => {
            analytics.trackEvent({
              category: analyticsCategory,
              action: analyticsAction,
              label: "Native",
            });
            
            toast({
              title: "Shared successfully!",
              description: "Your content has been shared.",
            });
          })
          .catch((error) => console.log('Error sharing:', error));
          return true;
        } else {
          toast({
            title: "Native Sharing Not Available",
            description: "Your browser doesn't support native sharing. Please use one of the other options.",
          });
          return false;
        }
    }
    
    if (shareLink) {
      window.open(shareLink, "_blank");
      
      // Track the share event
      analytics.trackEvent({
        category: analyticsCategory,
        action: analyticsAction,
        label: platform,
      });
      
      toast({
        title: "Shared successfully!",
        description: `Your content has been shared on ${platform}.`,
      });
      
      return true;
    }
    
    return false;
  };
  
  // Copy to clipboard helper
  const copyToClipboard = (text: string, trackingLabel?: string) => {
    navigator.clipboard.writeText(text);
    
    analytics.trackEvent({
      category: "Social",
      action: "Copy Link",
      label: trackingLabel,
    });
    
    toast({
      title: "Copied!",
      description: "Content has been copied to clipboard.",
    });
    
    return true;
  };
  
  return {
    shareContent,
    copyToClipboard
  };
}

// Need to import useToast
import { useToast } from "@/hooks/use-toast";
