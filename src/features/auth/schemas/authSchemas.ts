import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, 'First name is required').max(100, 'First name is too long'),
    lastName: z.string().trim().min(1, 'Last name is required').max(100, 'Last name is too long'),
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password is too long')
  })
  .strict();

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginFieldMap = {
  Email: 'email',
  Password: 'password'
} as const satisfies Record<string, keyof LoginFormValues>;

export const registerFieldMap = {
  FirstName: 'firstName',
  LastName: 'lastName',
  Email: 'email',
  Password: 'password'
} as const satisfies Record<string, keyof RegisterFormValues>;
