
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  className?: string;
  containerClassName?: string;
  loadingType?: "skeleton" | "blur" | "none";
  quality?: "low" | "medium" | "high" | "auto";
  lazyLoad?: boolean;
  threshold?: number;
  sizes?: string;
  webpSupport?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  fallback = "/placeholder.svg",
  aspectRatio = "auto",
  className,
  containerClassName,
  loadingType = "skeleton",
  quality = "auto",
  lazyLoad = true,
  threshold = 0.1,
  sizes = "100vw",
  webpSupport = true,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(lazyLoad ? "" : src);
  const { ref, isIntersecting } = useIntersectionObserver({ threshold });

  useEffect(() => {
    // Reset states when source changes
    setLoaded(false);
    setError(false);
    
    // If not using lazy loading or if in viewport, set the image source
    if (!lazyLoad || isIntersecting) {
      // Apply quality parameters to remote images (for services that support it)
      let optimizedSrc = src;
      
      if (src.includes("unsplash.com") || src.includes("cloudinary.com")) {
        // Apply quality parameters for these services
        const qualityMap = {
          low: "q=60&w=800",
          medium: "q=75&w=1200",
          high: "q=90&w=1800",
          auto: "q=auto&w=auto"
        };
        
        const qualityParam = qualityMap[quality];
        
        // Check if URL already has parameters
        optimizedSrc = src.includes('?') 
          ? `${src}&${qualityParam}` 
          : `${src}?${qualityParam}`;
      }
      
      setImageSrc(optimizedSrc);
    }
  }, [src, lazyLoad, isIntersecting, quality]);

  const handleLoad = () => setLoaded(true);
  const handleError = () => {
    setError(true);
    setImageSrc(fallback);
  };

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden",
        aspectRatioClasses[aspectRatio],
        containerClassName
      )}
      data-loaded={loaded}
    >
      {!loaded && loadingType === "skeleton" && (
        <Skeleton className="absolute inset-0 z-10" />
      )}
      
      {!loaded && loadingType === "blur" && (
        <div className="absolute inset-0 z-10 bg-muted animate-pulse" />
      )}
      
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "object-cover w-full h-full transition-opacity duration-300",
            !loaded && "opacity-0",
            loaded && "opacity-100",
            className
          )}
          loading={lazyLoad ? "lazy" : "eager"}
          decoding="async"
          sizes={sizes}
          {...props}
        />
      )}
    </div>
  );
}
