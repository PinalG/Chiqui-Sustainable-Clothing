
import React, { Suspense, useCallback, useState, useEffect } from "react";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { motion } from "framer-motion";

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
  transitionDuration?: number;
  onLoad?: () => void;
  minHeight?: string;
}

export function LazyComponent({
  children,
  fallback = <LoadingAnimation message="Loading component..." />,
  delay = 0,
  transitionDuration = 0.3,
  onLoad,
  minHeight = "200px",
}: LazyComponentProps) {
  const [showFallback, setShowFallback] = useState(delay > 0);
  
  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setShowFallback(false);
      }, delay);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [delay]);
  
  const handleOnLoad = useCallback(() => {
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  return (
    <div style={{ minHeight }}>
      {showFallback ? (
        <div className="w-full h-full flex items-center justify-center">
          {fallback}
        </div>
      ) : (
        <Suspense fallback={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: transitionDuration }}
            className="w-full h-full flex items-center justify-center"
          >
            {fallback}
          </motion.div>
        }>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: transitionDuration }}
            onAnimationComplete={handleOnLoad}
          >
            {children}
          </motion.div>
        </Suspense>
      )}
    </div>
  );
}

// Create a HOC for lazy loading components with React.lazy
export function withLazyLoading<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<LazyComponentProps, 'children'>
) {
  return function LazyLoadedComponent(props: P) {
    return (
      <LazyComponent {...options}>
        <Component {...props} />
      </LazyComponent>
    );
  };
}
