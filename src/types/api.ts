export interface ApiErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  errors: string[];
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface AuthResponse {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type UserRole = 'User' | 'Admin';

export interface CurrentUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface ProductDto {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormValues {
  name: string;
  description?: string;
  sku: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
}

export interface ProductsQueryParams {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

export interface CartItemDto {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPriceSnapshot: number;
  lineTotal: number;
}

export interface CartDto {
  id: string;
  userId: string;
  items: CartItemDto[];
  totalAmount: number;
}

export interface AddCartItemRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Paid' | 'Cancelled' | 'Completed';
export type PaymentStatus = 'NotRequired' | 'Pending' | 'Paid' | 'Failed';

export interface OrderItemDto {
  id: string;
  productId: string;
  productNameSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderDto {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  createdAt: string;
  items: OrderItemDto[];
}

export type CheckoutResponse = OrderDto;

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}
