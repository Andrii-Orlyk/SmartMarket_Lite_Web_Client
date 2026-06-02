export const checkoutQueryKeys = {
  all: ['checkout'] as const,
  mutation: () => [...checkoutQueryKeys.all, 'create'] as const
};
