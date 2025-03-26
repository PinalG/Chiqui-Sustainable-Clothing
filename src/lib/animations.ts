
import { animate, Easing } from "framer-motion";

/**
 * Creates a default animation controller with presets for AI analysis
 */
export const createDefaultAnimate = () => {
  const defaultAnimationOptions = {
    duration: 0.5,
    ease: "easeInOut" as Easing
  };

  return {
    /**
     * Fade in an element
     */
    fadeIn: (element: HTMLElement, options = {}) => {
      if (!element) return;
      
      return animate(element.style, {
        opacity: ["0", "1"]
      }, {
        ...defaultAnimationOptions,
        ...options
      });
    },
    
    /**
     * Fade out an element
     */
    fadeOut: (element: HTMLElement, options = {}) => {
      if (!element) return;
      
      return animate(element.style, {
        opacity: ["1", "0"]
      }, {
        ...defaultAnimationOptions,
        ...options
      });
    },
    
    /**
     * Slide in an element from the bottom
     */
    slideInBottom: (element: HTMLElement, options = {}) => {
      if (!element) return;
      
      return animate(element.style, {
        transform: ["translateY(20px)", "translateY(0px)"]
      }, {
        ...defaultAnimationOptions,
        ...options
      });
    },
    
    /**
     * Slide out an element to the bottom
     */
    slideOutBottom: (element: HTMLElement, options = {}) => {
      if (!element) return;
      
      return animate(element.style, {
        transform: ["translateY(0px)", "translateY(20px)"]
      }, {
        ...defaultAnimationOptions,
        ...options
      });
    },
    
    /**
     * Pulse animation for loading indicators
     */
    pulse: (element: HTMLElement, options = {}) => {
      if (!element) return;
      
      // For pulse animation
      const opacityControl = animate(element.style, {
        opacity: ["0.7", "1", "0.7"]
      }, { 
        duration: 1.5,
        ease: "easeInOut" as Easing,
        repeat: Infinity,
        ...options
      });
      
      const scaleControl = animate(element.style, {
        transform: ["scale(1)", "scale(1.05)", "scale(1)"]
      }, { 
        duration: 1.5,
        ease: "easeInOut" as Easing,
        repeat: Infinity,
        ...options
      });
      
      // Return an object with controls for both animations
      return {
        stop: () => {
          opacityControl.stop();
          scaleControl.stop();
        }
      };
    },
    
    /**
     * Scale up an element
     */
    scaleUp: (element: HTMLElement, options = {}) => {
      if (!element) return;
      
      const opacityControl = animate(element.style, {
        opacity: ["0", "1"]
      }, {
        ...defaultAnimationOptions,
        ...options
      });
      
      const scaleControl = animate(element.style, {
        transform: ["scale(0.9)", "scale(1)"]
      }, {
        ...defaultAnimationOptions,
        ...options
      });
      
      return {
        stop: () => {
          opacityControl.stop();
          scaleControl.stop();
        }
      };
    }
  };
};
