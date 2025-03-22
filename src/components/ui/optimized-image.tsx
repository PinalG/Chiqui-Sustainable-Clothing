
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  className?: string;
  containerClassName?: string;
  loadingType?: "skeleton" | "blur" | "none";
}

export function OptimizedImage({
  src,
  alt,
  fallback = "/placeholder.svg",
  aspectRatio = "auto",
  className,
  containerClassName,
  loadingType = "skeleton",
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(src);

  useEffect(() => {
    // Reset states when source changes
    setLoaded(false);
    setError(false);
    setImageSrc(src);
  }, [src]);

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
      className={cn(
        "relative overflow-hidden",
        aspectRatioClasses[aspectRatio],
        containerClassName
      )}
    >
      {!loaded && loadingType === "skeleton" && (
        <Skeleton className="absolute inset-0 z-10" />
      )}
      
      {!loaded && loadingType === "blur" && (
        <div className="absolute inset-0 z-10 bg-muted animate-pulse" />
      )}
      
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
        loading="lazy"
        {...props}
      />
    </div>
  );
}
