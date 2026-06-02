import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../useAuth';
import { AuthLoadingState } from './AuthLoadingState';

export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoadingState />;
  }

  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  return <Outlet />;
}
