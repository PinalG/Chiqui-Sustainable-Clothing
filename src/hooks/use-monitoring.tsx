
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import monitoring from '@/lib/monitoring';

export function useMonitoring() {
  const { user } = useAuth();
  
  useEffect(() => {
    try {
      // Initialize monitoring
      monitoring.init(user?.uid);
      
      // Clean up on unmount
      return () => {
        try {
          monitoring.shutdown();
        } catch (error) {
          console.error("Error shutting down monitoring:", error);
        }
      };
    } catch (error) {
      console.error("Error initializing monitoring:", error);
    }
  }, [user?.uid]);
  
  return monitoring;
}
