import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p>Loading...</p>; // Or a spinner component or a loading page full h center
  }

  if (user) {
    return children;
  }

  // If not authenticated, redirect to login with return path
  return <Navigate to="/login" state={location.pathname}  />;
};

export default PrivateRoutes;

