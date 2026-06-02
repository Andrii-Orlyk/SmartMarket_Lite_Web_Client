import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { server } from '../../src/mocks/node';
import { resetMockStore } from '../../src/mocks/store';
import { DEMO_ADMIN_EMAIL, DEMO_CUSTOMER_EMAIL, DEMO_PASSWORD } from '../../src/mocks/data/users';

const API = 'http://localhost/api';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  resetMockStore();
});

afterAll(() => {
  server.close();
});

async function login(email: string): Promise<string> {
  const response = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: DEMO_PASSWORD })
  });

  const body = (await response.json()) as { token: string };
  return body.token;
}

describe('mock auth handlers', () => {
  it('logs in customer demo user', async () => {
    const token = await login(DEMO_CUSTOMER_EMAIL);
    expect(token).toContain('mock-demo-token');

    const me = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(me.status).toBe(200);
    const user = await me.json();
    expect(user.email).toBe(DEMO_CUSTOMER_EMAIL);
  });

  it('logs in admin demo user', async () => {
    const token = await login(DEMO_ADMIN_EMAIL);
    const me = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const user = await me.json();
    expect(user.role).toBe('Admin');
  });

  it('returns 401 for invalid credentials', async () => {
    const response = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: DEMO_CUSTOMER_EMAIL, password: 'wrong' })
    });

    expect(response.status).toBe(401);
  });
});

describe('mock product availability', () => {
  it('includes out-of-stock and inactive products in catalog', async () => {
    const response = await fetch(`${API}/products?page=1&pageSize=20`);
    const page = await response.json();

    const outOfStock = page.items.find((p: { sku: string }) => p.sku === 'HP-004');
    const inactive = page.items.find((p: { sku: string }) => p.sku === 'WC-OLD');

    expect(outOfStock.stockQuantity).toBe(0);
    expect(inactive.isActive).toBe(false);
  });
});

describe('mock checkout flow', () => {
  it('creates pending order, clears cart, and reduces stock', async () => {
    const token = await login(DEMO_CUSTOMER_EMAIL);

    const addResponse = await fetch(`${API}/cart/items`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId: 'product-mouse', quantity: 2 })
    });
    expect(addResponse.status).toBe(200);

    const checkoutResponse = await fetch(`${API}/checkout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(checkoutResponse.status).toBe(200);
    const order = await checkoutResponse.json();
    expect(order.status).toBe('Pending');

    const cartResponse = await fetch(`${API}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const cart = await cartResponse.json();
    expect(cart.items).toHaveLength(0);

    const productResponse = await fetch(`${API}/products/product-mouse`);
    const product = await productResponse.json();
    expect(product.stockQuantity).toBe(10);
  });

  it('rejects add to cart for out-of-stock product', async () => {
    const token = await login(DEMO_CUSTOMER_EMAIL);

    const response = await fetch(`${API}/cart/items`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId: 'product-headphones', quantity: 1 })
    });

    expect(response.status).toBe(409);
    const body = await response.json();
    expect(body.message).toMatch(/not enough stock/i);
  });
});
