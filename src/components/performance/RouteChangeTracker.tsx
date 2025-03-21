
import { FC } from 'react';
import { useRouteTracking } from '@/hooks/use-route-tracking';

const RouteChangeTracker: FC = () => {
  // This hook will handle all the tracking logic
  useRouteTracking();
  
  // This component doesn't render anything
  return null;
};

export default RouteChangeTracker;
