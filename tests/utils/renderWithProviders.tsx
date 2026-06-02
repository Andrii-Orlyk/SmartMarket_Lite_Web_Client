import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';
import type { ReactElement } from 'react';
import { AuthProvider } from '../../src/features/auth/AuthProvider';

interface RenderWithProvidersOptions extends MemoryRouterProps {
  withAuth?: boolean;
}

export function renderWithProviders(
  ui: ReactElement,
  { withAuth = false, ...routerProps }: RenderWithProvidersOptions = {},
  renderOptions?: Omit<RenderOptions, 'wrapper'>
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  const content = withAuth ? <AuthProvider>{ui}</AuthProvider> : ui;

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter {...routerProps}>{content}</MemoryRouter>
    </QueryClientProvider>,
    renderOptions
  );
}
