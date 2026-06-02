import { apiRequest, buildQueryString } from './httpClient';
import type {
  AddCartItemRequest,
  AuthResponse,
  CartDto,
  CheckoutResponse,
  CurrentUserDto,
  LoginRequest,
  OrderDto,
  OrderStatus,
  PagedResult,
  ProductDto,
  ProductFormValues,
  ProductsQueryParams,
  RegisterRequest,
  UpdateCartItemRequest,
  UpdateOrderStatusRequest
} from '../types/api';

export const smartMarketApi = {
  auth: {
    register: (body: RegisterRequest) =>
      apiRequest<AuthResponse, RegisterRequest>('/api/auth/register', {
        method: 'POST',
        body,
        token: null
      }),

    login: (body: LoginRequest) =>
      apiRequest<AuthResponse, LoginRequest>('/api/auth/login', {
        method: 'POST',
        body,
        token: null
      }),

    me: () => apiRequest<CurrentUserDto>('/api/auth/me')
  },

  products: {
    list: (params: ProductsQueryParams = {}) =>
      apiRequest<PagedResult<ProductDto>>(`/api/products${buildQueryString(params)}`),

    getById: (id: string) => apiRequest<ProductDto>(`/api/products/${id}`)
  },

  adminProducts: {
    create: (body: ProductFormValues) =>
      apiRequest<ProductDto, ProductFormValues>('/api/admin/products', {
        method: 'POST',
        body
      }),

    update: (id: string, body: ProductFormValues) =>
      apiRequest<ProductDto, ProductFormValues>(`/api/admin/products/${id}`, {
        method: 'PUT',
        body
      }),

    remove: (id: string) =>
      apiRequest<void>(`/api/admin/products/${id}`, {
        method: 'DELETE'
      })
  },

  cart: {
    get: () => apiRequest<CartDto>('/api/cart'),

    addItem: (body: AddCartItemRequest) =>
      apiRequest<CartDto, AddCartItemRequest>('/api/cart/items', {
        method: 'POST',
        body
      }),

    updateItem: (itemId: string, body: UpdateCartItemRequest) =>
      apiRequest<CartDto, UpdateCartItemRequest>(`/api/cart/items/${itemId}`, {
        method: 'PUT',
        body
      }),

    removeItem: (itemId: string) =>
      apiRequest<CartDto>(`/api/cart/items/${itemId}`, {
        method: 'DELETE'
      }),

    clear: () =>
      apiRequest<void>('/api/cart', {
        method: 'DELETE'
      })
  },

  checkout: {
    create: () =>
      apiRequest<CheckoutResponse>('/api/checkout', {
        method: 'POST'
      })
  },

  orders: {
    list: () => apiRequest<OrderDto[]>('/api/orders'),

    getById: (id: string) => apiRequest<OrderDto>(`/api/orders/${id}`)
  },

  adminOrders: {
    list: () => apiRequest<OrderDto[]>('/api/admin/orders'),

    updateStatus: (id: string, status: OrderStatus) =>
      apiRequest<OrderDto, UpdateOrderStatusRequest>(`/api/admin/orders/${id}/status`, {
        method: 'PATCH',
        body: { status }
      })
  }
};

export type SmartMarketApi = typeof smartMarketApi;
