
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  
  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  
  // If user is logged in, redirect to dashboard
  return <Navigate to="/" replace />;
};

export default Index;
