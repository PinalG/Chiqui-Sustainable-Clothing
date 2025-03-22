
import React, { useState } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { cn } from "@/lib/utils";
import { usePerformance } from "@/hooks/use-performance";

interface ImageGalleryProps {
  images: {
    src: string;
    alt: string;
  }[];
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  allowFullscreen?: boolean;
  thumbnails?: boolean;
  preloadFirst?: boolean;
}

export function ImageGallery({
  images,
  className,
  aspectRatio = "square",
  allowFullscreen = false,
  thumbnails = true,
  preloadFirst = true,
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const { trackImageLoad } = usePerformance();
  
  const handleImageLoad = (index: number, loadTime: number) => {
    trackImageLoad(`gallery-image-${index}`, loadTime, {
      position: index,
      isFirstImage: index === 0,
    });
  };

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
  };

  const toggleFullscreen = () => {
    if (allowFullscreen) {
      setFullscreen(!fullscreen);
    }
  };

  return (
    <div className={cn("relative", className, fullscreen && "fixed inset-0 z-50 bg-background")}>
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div 
                className={cn(
                  "overflow-hidden rounded-lg", 
                  fullscreen ? "h-screen w-screen" : ""
                )}
              >
                <OptimizedImage
                  src={image.src}
                  alt={image.alt}
                  aspectRatio={aspectRatio}
                  className={cn(
                    "cursor-pointer transition-transform duration-300 hover:scale-105",
                    allowFullscreen ? "cursor-zoom-in" : ""
                  )}
                  onClick={toggleFullscreen}
                  lazyLoad={!preloadFirst || index !== 0}
                  quality={fullscreen ? "high" : "auto"}
                  containerClassName="w-full h-full"
                  loadingType="blur"
                  onLoad={() => {
                    const loadTime = window.performance.now();
                    handleImageLoad(index, loadTime);
                  }}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      {thumbnails && images.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative h-16 w-16 rounded-md overflow-hidden border-2 transition-all",
                activeIndex === index 
                  ? "border-soft-pink ring-2 ring-soft-pink/20" 
                  : "border-gray-200 hover:border-soft-pink/50"
              )}
            >
              <OptimizedImage
                src={image.src}
                alt={`Thumbnail ${index + 1}`}
                aspectRatio="square"
                className="w-full h-full object-cover"
                lazyLoad={true}
                quality="low"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {fullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2"
          aria-label="Close fullscreen view"
        >
          X
        </button>
      )}
    </div>
  );
}
