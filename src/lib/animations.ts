
import { animate, AnimationControls } from "framer-motion";

/**
 * Creates a default animation controller with presets for AI analysis
 */
export const createDefaultAnimate = () => {
  const defaultAnimationOptions = {
    duration: 0.5,
    ease: "easeInOut"
  };

  return {
    /**
     * Fade in an element
     */
    fadeIn: (element: HTMLElement, options = {}) => {
      if (!element) return;
      
      return animate(
        element, 
        { opacity: 1 }, 
        { ...defaultAnimationOptions, ...options, from: 0 }
      );
    },
    
    /**
     * Fade out an element
     */
    fadeOut: (element: HTMLElement, options = {}) => {
      if (!element) return;
      
      return animate(
        element, 
        { opacity: 0 }, 
        { ...defaultAnimationOptions, ...options, from: 1 }
      );
    },
    
    /**
     * Slide in an element from the bottom
     */
    slideInBottom: (element: HTMLElement, options = {}) => {
      if (!element) return;
      
      return animate(
        element,
        { y: 0 },
        { ...defaultAnimationOptions, ...options, from: 20 }
      );
    },
    
    /**
     * Slide out an element to the bottom
     */
    slideOutBottom: (element: HTMLElement, options = {}) => {
      if (!element) return;
      
      return animate(
        element,
        { y: 20 },
        { ...defaultAnimationOptions, ...options, from: 0 }
      );
    },
    
    /**
     * Pulse animation for loading indicators
     */
    pulse: (element: HTMLElement, options = {}) => {
      if (!element) return;
      
      // For pulse, we'll use keyframes to create the animation
      const opacityControl = animate(
        element,
        { opacity: [0.7, 1, 0.7] },
        { 
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
          ...options
        }
      );
      
      const scaleControl = animate(
        element,
        { scale: [1, 1.05, 1] },
        { 
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
          ...options
        }
      );
      
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
      
      const opacityControl = animate(
        element,
        { opacity: 1 },
        { ...defaultAnimationOptions, ...options, from: 0 }
      );
      
      const scaleControl = animate(
        element,
        { scale: 1 },
        { ...defaultAnimationOptions, ...options, from: 0.9 }
      );
      
      return {
        stop: () => {
          opacityControl.stop();
          scaleControl.stop();
        }
      };
    }
  };
};
