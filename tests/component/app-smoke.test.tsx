import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../../src/app/App';

vi.mock('../../src/api/smartMarketApi', () => ({
  smartMarketApi: {
    products: {
      list: vi.fn().mockResolvedValue({
        items: [],
        page: 1,
        pageSize: 12,
        totalCount: 0,
        totalPages: 0
      })
    },
    auth: {
      me: vi.fn()
    }
  }
}));

describe('App routing smoke', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/products');
  });

  it('renders products catalog shell at /products', async () => {
    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Products' })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    });
  });
});
