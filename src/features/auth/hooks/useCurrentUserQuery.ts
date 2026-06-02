import { useQuery } from '@tanstack/react-query';
import { smartMarketApi } from '../../../api/smartMarketApi';
import { AUTH_ME_QUERY_KEY } from '../authQueryKeys';

interface UseCurrentUserQueryOptions {
  enabled?: boolean;
}

export function useCurrentUserQuery({ enabled = true }: UseCurrentUserQueryOptions = {}) {
  return useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: () => smartMarketApi.auth.me(),
    enabled,
    retry: false
  });
}
