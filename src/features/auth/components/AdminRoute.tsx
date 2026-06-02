import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ForbiddenState } from '../../../components/feedback';
import { useAuth } from '../useAuth';
import { AuthLoadingState } from './AuthLoadingState';

export function AdminRoute() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingState />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, sessionExpired: true }}
      />
    );
  }

  if (!isAdmin) {
    return (
      <ForbiddenState
        title="Admin access required"
        message="This area is available only to administrator accounts. Sign in with an admin account or return to the catalog."
        actionLabel="Browse products"
        onAction={() => navigate('/products')}
      />
    );
  }

  return <Outlet />;
}
