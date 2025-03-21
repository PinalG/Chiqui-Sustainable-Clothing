
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import monitoring from '@/lib/monitoring';

export function useMonitoring() {
  const { user } = useAuth();
  
  useEffect(() => {
    // Initialize monitoring
    monitoring.init(user?.uid);
    
    // Clean up on unmount
    return () => {
      monitoring.shutdown();
    };
  }, [user?.uid]);
  
  return monitoring;
}
