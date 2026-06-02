import { useMutation, useQueryClient } from '@tanstack/react-query';
import { smartMarketApi } from '../../../api/smartMarketApi';
import type { RegisterRequest } from '../../../types/api';
import { invalidateAuthUser } from '../../../hooks/cacheInvalidation';

interface UseRegisterMutationOptions {
  onAuthenticated?: (token: string) => void;
}

export function useRegisterMutation(options: UseRegisterMutationOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterRequest) => smartMarketApi.auth.register(payload),
    onSuccess: async (response) => {
      options.onAuthenticated?.(response.token);
      await invalidateAuthUser(queryClient);
    }
  });
}
