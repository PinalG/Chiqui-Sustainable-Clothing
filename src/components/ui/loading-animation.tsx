
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "default" | "soft-pink" | "heather-grey" | "white";
  message?: string;
}

export function LoadingAnimation({
  className,
  size = "md",
  color = "default",
  message,
}: LoadingAnimationProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const colorClasses = {
    default: "text-foreground",
    "soft-pink": "text-soft-pink",
    "heather-grey": "text-heather-grey",
    white: "text-white",
  };

  const dotVariants = {
    initial: { y: 0 },
    animate: { y: [-8, 0, -8] },
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="flex items-center justify-center space-x-2">
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatType: "loop",
              delay: dot * 0.2,
              ease: "easeInOut",
            }}
            className={cn(
              "rounded-full bg-current",
              sizeClasses[size],
              colorClasses[color]
            )}
          />
        ))}
      </div>
      {message && (
        <p className={cn("mt-4 text-center", colorClasses[color])}>
          {message}
        </p>
      )}
    </div>
  );
}
