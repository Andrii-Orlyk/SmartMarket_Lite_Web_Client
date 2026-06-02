import type {
  AddCartItemRequest,
  CartDto,
  CartItemDto,
  OrderDto,
  ProductDto,
  ProductFormValues,
  ProductsQueryParams,
  RegisterRequest
} from '../types/api';
import { createSeedProducts } from './data/products';
import {
  createSeedUsers,
  DEMO_PASSWORD,
  registerRequestToUser,
  toPublicUser,
  type MockUserRecord
} from './data/users';
import { createOrderNumber, nextId } from './utils/ids';

const TOKEN_PREFIX = 'mock-demo-token:';

export interface MockStoreState {
  users: MockUserRecord[];
  products: ProductDto[];
  carts: Map<string, CartDto>;
  orders: Map<string, OrderDto[]>;
}

let state: MockStoreState = createInitialState();

function createInitialState(): MockStoreState {
  return {
    users: createSeedUsers(),
    products: createSeedProducts(),
    carts: new Map(),
    orders: new Map([
      [
        'user-customer-1',
        [
          {
            id: 'order-seed-1',
            orderNumber: 'ORD-1001',
            status: 'Pending',
            paymentStatus: 'Pending',
            totalAmount: 59.98,
            createdAt: '2026-01-20T14:00:00Z',
            items: [
              {
                id: 'order-item-seed-1',
                productId: 'product-mouse',
                productNameSnapshot: 'Wireless Mouse',
                unitPriceSnapshot: 29.99,
                quantity: 2,
                lineTotal: 59.98
              }
            ]
          }
        ]
      ]
    ])
  };
}

export function resetMockStore(): void {
  state = createInitialState();
}

export function getMockStore(): MockStoreState {
  return state;
}

export function createTokenForUser(userId: string): string {
  return `${TOKEN_PREFIX}${userId}`;
}

export function getUserIdFromToken(authorization: string | null): string | null {
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  const token = authorization.slice('Bearer '.length).trim();
  if (!token.startsWith(TOKEN_PREFIX)) {
    return null;
  }

  return token.slice(TOKEN_PREFIX.length);
}

export function findUserByEmail(email: string): MockUserRecord | undefined {
  return state.users.find((user) => user.email === email.toLowerCase());
}

export function findUserById(userId: string): MockUserRecord | undefined {
  return state.users.find((user) => user.id === userId);
}

export function registerUser(body: RegisterRequest): MockUserRecord {
  const user = registerRequestToUser(body, nextId('user'));
  state.users.push(user);
  return user;
}

export function authenticate(email: string, password: string): MockUserRecord | null {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return null;
  }

  return user;
}

function getOrCreateCart(userId: string): CartDto {
  const existing = state.carts.get(userId);
  if (existing) {
    return existing;
  }

  const cart: CartDto = {
    id: nextId('cart'),
    userId,
    items: [],
    totalAmount: 0
  };

  state.carts.set(userId, cart);
  return cart;
}

function recalculateCart(cart: CartDto): void {
  cart.totalAmount = cart.items.reduce((sum, item) => sum + item.lineTotal, 0);
}

function findProduct(productId: string): ProductDto | undefined {
  return state.products.find((product) => product.id === productId);
}

export function listProducts(params: ProductsQueryParams): {
  items: ProductDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
} {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 12;
  let items = [...state.products];

  if (params.search) {
    const term = params.search.toLowerCase();
    items = items.filter(
      (product) =>
        product.name.toLowerCase().includes(term) || product.sku.toLowerCase().includes(term)
    );
  }

  if (params.minPrice !== undefined) {
    items = items.filter((product) => product.price >= params.minPrice!);
  }

  if (params.maxPrice !== undefined) {
    items = items.filter((product) => product.price <= params.maxPrice!);
  }

  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    totalCount,
    totalPages
  };
}

export function getProduct(productId: string): ProductDto | undefined {
  return findProduct(productId);
}

export function createProduct(body: ProductFormValues): ProductDto {
  const now = new Date().toISOString();
  const product: ProductDto = {
    id: nextId('product'),
    name: body.name,
    description: body.description ?? null,
    sku: body.sku,
    price: body.price,
    stockQuantity: body.stockQuantity,
    isActive: body.isActive,
    createdAt: now,
    updatedAt: now
  };

  state.products.push(product);
  return product;
}

export function updateProduct(productId: string, body: ProductFormValues): ProductDto | null {
  const product = findProduct(productId);
  if (!product) {
    return null;
  }

  product.name = body.name;
  product.description = body.description ?? null;
  product.sku = body.sku;
  product.price = body.price;
  product.stockQuantity = body.stockQuantity;
  product.isActive = body.isActive;
  product.updatedAt = new Date().toISOString();
  return product;
}

export function removeProduct(productId: string): boolean {
  const index = state.products.findIndex((product) => product.id === productId);
  if (index === -1) {
    return false;
  }

  state.products.splice(index, 1);
  return true;
}

export function getCart(userId: string): CartDto {
  return getOrCreateCart(userId);
}

export function addCartItem(userId: string, body: AddCartItemRequest): CartDto | 'inactive' | 'out_of_stock' | 'insufficient' {
  const product = findProduct(body.productId);
  if (!product) {
    return 'out_of_stock';
  }

  if (!product.isActive) {
    return 'inactive';
  }

  if (product.stockQuantity <= 0) {
    return 'out_of_stock';
  }

  if (body.quantity < 1) {
    return 'insufficient';
  }

  const cart = getOrCreateCart(userId);
  const existing = cart.items.find((item) => item.productId === body.productId);
  const nextQuantity = (existing?.quantity ?? 0) + body.quantity;

  if (nextQuantity > product.stockQuantity) {
    return 'insufficient';
  }

  if (existing) {
    existing.quantity = nextQuantity;
    existing.lineTotal = existing.unitPriceSnapshot * nextQuantity;
  } else {
    const item: CartItemDto = {
      id: nextId('cart-item'),
      productId: product.id,
      productName: product.name,
      quantity: body.quantity,
      unitPriceSnapshot: product.price,
      lineTotal: product.price * body.quantity
    };
    cart.items.push(item);
  }

  recalculateCart(cart);
  return cart;
}

export function updateCartItem(
  userId: string,
  itemId: string,
  quantity: number
): CartDto | 'not_found' | 'insufficient' {
  const cart = getOrCreateCart(userId);
  const item = cart.items.find((entry) => entry.id === itemId);
  if (!item) {
    return 'not_found';
  }

  if (quantity < 1) {
    return 'insufficient';
  }

  const product = findProduct(item.productId);
  if (!product || quantity > product.stockQuantity) {
    return 'insufficient';
  }

  item.quantity = quantity;
  item.lineTotal = item.unitPriceSnapshot * quantity;
  recalculateCart(cart);
  return cart;
}

export function removeCartItem(userId: string, itemId: string): CartDto | 'not_found' {
  const cart = getOrCreateCart(userId);
  const index = cart.items.findIndex((entry) => entry.id === itemId);
  if (index === -1) {
    return 'not_found';
  }

  cart.items.splice(index, 1);
  recalculateCart(cart);
  return cart;
}

export function clearCart(userId: string): void {
  const cart = getOrCreateCart(userId);
  cart.items = [];
  cart.totalAmount = 0;
}

export function listOrders(userId: string): OrderDto[] {
  return [...(state.orders.get(userId) ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOrder(userId: string, orderId: string): OrderDto | undefined {
  return state.orders.get(userId)?.find((order) => order.id === orderId);
}

export function checkout(userId: string): OrderDto | 'empty' | 'insufficient' | 'inactive' {
  const cart = getOrCreateCart(userId);
  if (cart.items.length === 0) {
    return 'empty';
  }

  for (const item of cart.items) {
    const product = findProduct(item.productId);
    if (!product?.isActive) {
      return 'inactive';
    }

    if (!product || item.quantity > product.stockQuantity) {
      return 'insufficient';
    }
  }

  const orderItems = cart.items.map((item) => ({
    id: nextId('order-item'),
    productId: item.productId,
    productNameSnapshot: item.productName,
    unitPriceSnapshot: item.unitPriceSnapshot,
    quantity: item.quantity,
    lineTotal: item.lineTotal
  }));

  const order: OrderDto = {
    id: nextId('order'),
    orderNumber: createOrderNumber(),
    status: 'Pending',
    paymentStatus: 'Pending',
    totalAmount: cart.totalAmount,
    createdAt: new Date().toISOString(),
    items: orderItems
  };

  for (const item of cart.items) {
    const product = findProduct(item.productId);
    if (product) {
      product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
      product.updatedAt = new Date().toISOString();
    }
  }

  const userOrders = state.orders.get(userId) ?? [];
  userOrders.unshift(order);
  state.orders.set(userId, userOrders);

  clearCart(userId);
  return order;
}

export { DEMO_PASSWORD, toPublicUser };
