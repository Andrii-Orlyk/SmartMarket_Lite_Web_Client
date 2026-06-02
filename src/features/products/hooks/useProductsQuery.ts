import { useQuery } from '@tanstack/react-query';
import { smartMarketApi } from '../../../api/smartMarketApi';
import type { ProductsQueryParams } from '../../../types/api';
import { productsQueryKeys } from '../productQueryKeys';

export function useProductsQuery(params: ProductsQueryParams) {
  return useQuery({
    queryKey: productsQueryKeys.list(params),
    queryFn: () => smartMarketApi.products.list(params)
  });
}
