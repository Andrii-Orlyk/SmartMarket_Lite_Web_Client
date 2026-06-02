import { http } from 'msw';
import type { LoginRequest, RegisterRequest } from '../types/api';
import {
  addCartItem,
  authenticate,
  checkout,
  clearCart,
  createProduct,
  createTokenForUser,
  findUserByEmail,
  findUserById,
  getCart,
  getOrder,
  getProduct,
  getUserIdFromToken,
  listOrders,
  listProducts,
  registerUser,
  removeCartItem,
  removeProduct,
  toPublicUser,
  updateCartItem,
  updateProduct
} from './store';
import { emptyResponse, errorResponse, jsonResponse } from './utils/responses';

function getAuthUserId(request: Request): string | null {
  return getUserIdFromToken(request.headers.get('Authorization'));
}

function requireAuth(request: Request): string | Response {
  const userId = getAuthUserId(request);
  if (!userId) {
    return errorResponse(401, 'auth.unauthorized', 'Your session is missing or expired.');
  }

  return userId;
}

export const handlers = [
  http.post('*/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as RegisterRequest;

    if (findUserByEmail(body.email)) {
      return errorResponse(409, 'auth.email_exists', 'Email is already registered.');
    }

    const user = registerUser(body);
    return jsonResponse({ token: createTokenForUser(user.id) });
  }),

  http.post('*/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginRequest;
    const user = authenticate(body.email, body.password);

    if (!user) {
      return errorResponse(401, 'auth.unauthorized', 'Invalid email or password.');
    }

    return jsonResponse({ token: createTokenForUser(user.id) });
  }),

  http.get('*/api/auth/me', ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof Response) {
      return auth;
    }

    const found = findUserById(auth);
    if (!found) {
      return errorResponse(401, 'auth.unauthorized', 'Your session is missing or expired.');
    }

    return jsonResponse(toPublicUser(found));
  }),

  http.get('*/api/products', ({ request }) => {
    const url = new URL(request.url);
    const params = {
      search: url.searchParams.get('search') ?? undefined,
      minPrice: url.searchParams.has('minPrice')
        ? Number(url.searchParams.get('minPrice'))
        : undefined,
      maxPrice: url.searchParams.has('maxPrice')
        ? Number(url.searchParams.get('maxPrice'))
        : undefined,
      page: url.searchParams.has('page') ? Number(url.searchParams.get('page')) : undefined,
      pageSize: url.searchParams.has('pageSize')
        ? Number(url.searchParams.get('pageSize'))
        : undefined
    };

    return jsonResponse(listProducts(params));
  }),

  http.get('*/api/products/:id', ({ params }) => {
    const product = getProduct(String(params.id));
    if (!product) {
      return errorResponse(404, 'product.not_found', 'Product not found.');
    }

    return jsonResponse(product);
  }),

  http.post('*/api/admin/products', async ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof Response) {
      return auth;
    }

    const body = (await request.json()) as import('../types/api').ProductFormValues;
    return jsonResponse(createProduct(body), 201);
  }),

  http.put('*/api/admin/products/:id', async ({ request, params }) => {
    const auth = requireAuth(request);
    if (auth instanceof Response) {
      return auth;
    }

    const body = (await request.json()) as import('../types/api').ProductFormValues;
    const updated = updateProduct(String(params.id), body);
    if (!updated) {
      return errorResponse(404, 'product.not_found', 'Product not found.');
    }

    return jsonResponse(updated);
  }),

  http.delete('*/api/admin/products/:id', ({ request, params }) => {
    const auth = requireAuth(request);
    if (auth instanceof Response) {
      return auth;
    }

    const removed = removeProduct(String(params.id));
    if (!removed) {
      return errorResponse(404, 'product.not_found', 'Product not found.');
    }

    return emptyResponse(204);
  }),

  http.get('*/api/cart', ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof Response) {
      return auth;
    }

    return jsonResponse(getCart(auth));
  }),

  http.post('*/api/cart/items', async ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof Response) {
      return auth;
    }

    const body = (await request.json()) as import('../types/api').AddCartItemRequest;
    const result = addCartItem(auth, body);

    if (result === 'inactive') {
      return errorResponse(409, 'checkout.product_unavailable', 'This product is no longer available.');
    }

    if (result === 'out_of_stock' || result === 'insufficient') {
      return errorResponse(409, 'cart.insufficient_stock', 'Not enough stock available.');
    }

    return jsonResponse(result);
  }),

  http.put('*/api/cart/items/:id', async ({ request, params }) => {
    const auth = requireAuth(request);
    if (auth instanceof Response) {
      return auth;
    }

    const body = (await request.json()) as import('../types/api').UpdateCartItemRequest;
    const result = updateCartItem(auth, String(params.id), body.quantity);

    if (result === 'not_found') {
      return errorResponse(404, 'resource.not_found', 'The requested item was not found.');
    }

    if (result === 'insufficient') {
      return errorResponse(409, 'cart.insufficient_stock', 'Not enough stock available.');
    }

    return jsonResponse(result);
  }),

  http.delete('*/api/cart/items/:id', ({ request, params }) => {
    const auth = requireAuth(request);
    if (auth instanceof Response) {
      return auth;
    }

    const result = removeCartItem(auth, String(params.id));
    if (result === 'not_found') {
      return errorResponse(404, 'resource.not_found', 'The requested item was not found.');
    }

    return jsonResponse(result);
  }),

  http.delete('*/api/cart', ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof Response) {
      return auth;
    }

    clearCart(auth);
    return emptyResponse(204);
  }),

  http.post('*/api/checkout', ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof Response) {
      return auth;
    }

    const result = checkout(auth);

    if (result === 'empty') {
      return errorResponse(409, 'checkout.empty_cart', 'Your cart is empty.');
    }

    if (result === 'inactive') {
      return errorResponse(409, 'checkout.product_unavailable', 'This product is no longer available.');
    }

    if (result === 'insufficient') {
      return errorResponse(409, 'cart.insufficient_stock', 'Not enough stock available.');
    }

    return jsonResponse(result);
  }),

  http.get('*/api/orders', ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof Response) {
      return auth;
    }

    return jsonResponse(listOrders(auth));
  }),

  http.get('*/api/orders/:id', ({ request, params }) => {
    const auth = requireAuth(request);
    if (auth instanceof Response) {
      return auth;
    }

    const order = getOrder(auth, String(params.id));
    if (!order) {
      return errorResponse(404, 'resource.not_found', 'The requested resource was not found.');
    }

    return jsonResponse(order);
  })
];
