export const PRODUCTS_QUERY_KEY = 'products';

export const productsQueryKeys = {
  all: [PRODUCTS_QUERY_KEY] as const,
  lists: () => [...productsQueryKeys.all, 'list'] as const,
  list: (params: {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    pageSize?: number;
  }) => [...productsQueryKeys.lists(), params] as const,
  details: () => [...productsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...productsQueryKeys.details(), id] as const
};

/** @deprecated Use productsQueryKeys.list(params) */
export function productsListQueryKey(params: {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}) {
  return productsQueryKeys.list(params);
}
