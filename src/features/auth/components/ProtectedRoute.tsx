import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../useAuth';
import { AuthLoadingState } from './AuthLoadingState';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingState />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, sessionExpired: location.pathname !== '/login' }}
      />
    );
  }

  return <Outlet />;
}
