import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { smartMarketApi } from '../../api/smartMarketApi';
import { isUnauthorizedError } from '../../lib/apiErrors';
import { clearAuthToken, hasAuthToken, setAuthToken } from '../../lib/authToken';
import { AUTH_ME_QUERY_KEY } from './authQueryKeys';
import { AuthContext, type AuthContextValue } from './context/AuthContext';

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [sessionExpired, setSessionExpired] = useState(false);
  const [tokenPresent, setTokenPresent] = useState(hasAuthToken());

  const currentUserQuery = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: () => smartMarketApi.auth.me(),
    enabled: tokenPresent,
    retry: false
  });

  const handleUnauthorizedSession = useCallback(() => {
    clearAuthToken();
    setTokenPresent(false);
    setSessionExpired(true);
    queryClient.setQueryData(AUTH_ME_QUERY_KEY, null);
  }, [queryClient]);

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type !== 'updated' || event.action.type !== 'error') {
        return;
      }

      if (!isUnauthorizedError(event.query.state.error)) {
        return;
      }

      handleUnauthorizedSession();
    });

    return unsubscribe;
  }, [handleUnauthorizedSession, queryClient]);

  const loginMutation = useMutation({
    mutationFn: smartMarketApi.auth.login,
    onSuccess: async (response) => {
      setAuthToken(response.token);
      setTokenPresent(true);
      setSessionExpired(false);
      await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
    }
  });

  const registerMutation = useMutation({
    mutationFn: smartMarketApi.auth.register,
    onSuccess: async (response) => {
      setAuthToken(response.token);
      setTokenPresent(true);
      setSessionExpired(false);
      await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
    }
  });

  const logout = useCallback(() => {
    clearAuthToken();
    setTokenPresent(false);
    setSessionExpired(false);
    queryClient.setQueryData(AUTH_ME_QUERY_KEY, null);
    queryClient.removeQueries({ queryKey: AUTH_ME_QUERY_KEY });
  }, [queryClient]);

  const clearSessionExpired = useCallback(() => {
    setSessionExpired(false);
  }, []);

  const user = tokenPresent && currentUserQuery.data ? currentUserQuery.data : null;
  const isLoading =
    tokenPresent && (currentUserQuery.isLoading || currentUserQuery.isFetching) && !currentUserQuery.data;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'Admin',
      sessionExpired,
      login: async (credentials) => {
        await loginMutation.mutateAsync(credentials);
      },
      register: async (payload) => {
        await registerMutation.mutateAsync(payload);
      },
      logout,
      clearSessionExpired
    }),
    [user, isLoading, sessionExpired, loginMutation, registerMutation, logout, clearSessionExpired]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
