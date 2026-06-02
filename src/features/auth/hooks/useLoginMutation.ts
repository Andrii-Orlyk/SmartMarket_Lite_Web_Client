import { useMutation, useQueryClient } from '@tanstack/react-query';
import { smartMarketApi } from '../../../api/smartMarketApi';
import type { LoginRequest } from '../../../types/api';
import { invalidateAuthUser } from '../../../hooks/cacheInvalidation';

interface UseLoginMutationOptions {
  onAuthenticated?: (token: string) => void;
}

export function useLoginMutation(options: UseLoginMutationOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => smartMarketApi.auth.login(credentials),
    onSuccess: async (response) => {
      options.onAuthenticated?.(response.token);
      await invalidateAuthUser(queryClient);
    }
  });
}
