import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../../src/features/auth/components/ProtectedRoute';

const useAuthMock = vi.fn();

vi.mock('../../src/features/auth/useAuth', () => ({
  useAuth: () => useAuthMock()
}));

describe('ProtectedRoute access control', () => {
  it('redirects unauthenticated users to login', () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: false,
      isLoading: false
    });

    render(
      <MemoryRouter initialEntries={['/cart']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<div>Cart page</div>} />
          </Route>
          <Route path="/login" element={<h1>Sign in</h1>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.queryByText('Cart page')).not.toBeInTheDocument();
  });

  it('renders protected content for authenticated users', () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: true,
      isLoading: false
    });

    render(
      <MemoryRouter initialEntries={['/cart']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<div>Cart page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Cart page')).toBeInTheDocument();
  });
});
