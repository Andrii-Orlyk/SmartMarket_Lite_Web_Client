export const ordersQueryKeys = {
  all: ['orders'] as const,
  lists: () => [...ordersQueryKeys.all, 'list'] as const,
  list: () => [...ordersQueryKeys.lists()] as const,
  details: () => [...ordersQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...ordersQueryKeys.details(), id] as const,
  adminLists: () => [...ordersQueryKeys.all, 'admin', 'list'] as const,
  adminList: () => [...ordersQueryKeys.adminLists()] as const
};
