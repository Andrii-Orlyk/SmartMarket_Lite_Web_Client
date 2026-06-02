import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../../src/components/layout/AppLayout';

vi.mock('../../src/features/auth/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isAdmin: false,
    isLoading: false,
    user: null,
    sessionExpired: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    clearSessionExpired: vi.fn()
  })
}));

describe('AppLayout', () => {
  it('renders skip link, header navigation, and routed content', () => {
    render(
      <MemoryRouter initialEntries={['/products']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/products" element={<h1>Catalog page</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute(
      'href',
      '#main-content'
    );
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Catalog page' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });
});
