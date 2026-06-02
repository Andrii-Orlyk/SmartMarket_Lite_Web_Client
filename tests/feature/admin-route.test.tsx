import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AdminRoute } from '../../src/features/auth/components/AdminRoute';

const useAuthMock = vi.fn();

vi.mock('../../src/features/auth/useAuth', () => ({
  useAuth: () => useAuthMock()
}));

describe('AdminRoute access control', () => {
  it('shows forbidden UI for authenticated non-admin users', () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
      isLoading: false
    });

    render(
      <MemoryRouter initialEntries={['/admin/products']}>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/admin/products" element={<div>Admin products</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/admin access required/i);
    expect(screen.queryByText('Admin products')).not.toBeInTheDocument();
  });

  it('renders child route for admin users', () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: true,
      isAdmin: true,
      isLoading: false
    });

    render(
      <MemoryRouter initialEntries={['/admin/products']}>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/admin/products" element={<div>Admin products</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin products')).toBeInTheDocument();
  });
});
