import { useAuth } from '../useAuth';

export function CurrentUserBar() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="text-right">
      <p className="text-sm font-medium text-slate-900">
        {user.firstName} {user.lastName}
      </p>
      <p className="text-xs text-slate-500">{user.role === 'Admin' ? 'Administrator' : 'Customer'}</p>
    </div>
  );
}
