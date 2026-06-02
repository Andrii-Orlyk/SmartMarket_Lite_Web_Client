import { productsQueryKeys } from '../products/productQueryKeys';

export const adminProductsQueryKeys = {
  all: [...productsQueryKeys.all, 'admin'] as const,
  lists: () => [...adminProductsQueryKeys.all, 'list'] as const,
  list: () => [...adminProductsQueryKeys.lists()] as const
};
