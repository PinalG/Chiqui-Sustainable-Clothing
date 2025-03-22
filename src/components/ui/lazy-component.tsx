
import React, { Suspense } from "react";
import { LoadingAnimation } from "@/components/ui/loading-animation";

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LazyComponent({
  children,
  fallback = <LoadingAnimation message="Loading component..." />,
}: LazyComponentProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
