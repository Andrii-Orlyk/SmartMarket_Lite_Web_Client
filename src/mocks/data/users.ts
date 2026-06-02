import type { CurrentUserDto, RegisterRequest } from '../../types/api';

export interface MockUserRecord extends CurrentUserDto {
  password: string;
}

export const DEMO_CUSTOMER_EMAIL = 'customer@smartmarket.dev';
export const DEMO_ADMIN_EMAIL = 'admin@smartmarket.dev';
export const DEMO_PASSWORD = 'Password123!';

export function createSeedUsers(): MockUserRecord[] {
  return [
    {
      id: 'user-customer-1',
      email: DEMO_CUSTOMER_EMAIL,
      firstName: 'Demo',
      lastName: 'Customer',
      role: 'User',
      password: DEMO_PASSWORD
    },
    {
      id: 'user-admin-1',
      email: DEMO_ADMIN_EMAIL,
      firstName: 'Demo',
      lastName: 'Admin',
      role: 'Admin',
      password: DEMO_PASSWORD
    }
  ];
}

export function toPublicUser(user: MockUserRecord): CurrentUserDto {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role
  };
}

export function registerRequestToUser(body: RegisterRequest, id: string): MockUserRecord {
  return {
    id,
    email: body.email.toLowerCase(),
    firstName: body.firstName,
    lastName: body.lastName,
    role: 'User',
    password: body.password
  };
}
