import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProductCard } from '../../src/features/products/components/ProductCard';
import { inactiveProductFixture, productFixture } from '../fixtures/apiFixtures';

describe('ProductCard', () => {
  it('maps ProductDto fields including formatted price', () => {
    render(
      <MemoryRouter>
        <ProductCard product={productFixture} />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: productFixture.name })).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText(productFixture.sku)).toBeInTheDocument();
    expect(screen.getByText('12 in stock')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('shows unavailable message for inactive products', () => {
    render(
      <MemoryRouter>
        <ProductCard product={inactiveProductFixture} />
      </MemoryRouter>
    );

    expect(screen.getAllByText('Unavailable').length).toBeGreaterThan(0);
  });
});
