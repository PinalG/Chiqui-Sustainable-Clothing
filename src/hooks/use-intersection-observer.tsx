
import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
  skip?: boolean;
}

export function useIntersectionObserver<T extends Element>({
  root = null,
  rootMargin = '0px',
  threshold = 0,
  triggerOnce = false,
  skip = false,
}: UseIntersectionObserverOptions = {}) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const previouslyIntersected = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<T | null>(null);

  const setRef = useCallback((node: T | null) => {
    if (targetRef.current) {
      observerRef.current?.unobserve(targetRef.current);
    }

    targetRef.current = node;

    if (node && observerRef.current && !skip) {
      observerRef.current.observe(node);
    }
  }, [skip]);

  useEffect(() => {
    if (skip) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        
        // Check if element is intersecting
        const isElementIntersecting = entry.isIntersecting;
        
        // If triggerOnce is true, only set to true if hasn't been intersected before
        if (triggerOnce) {
          if (isElementIntersecting && !previouslyIntersected.current) {
            setIsIntersecting(true);
            previouslyIntersected.current = true;
          }
        } else {
          setIsIntersecting(isElementIntersecting);
        }
      },
      { root, rootMargin, threshold }
    );

    observerRef.current = observer;

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [root, rootMargin, threshold, triggerOnce, skip]);

  return {
    ref: setRef,
    entry,
    isIntersecting,
  };
}
