import { z } from 'zod';

export const cartItemQuantitySchema = z.object({
  quantity: z.coerce
    .number({ message: 'Quantity is required' })
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be greater than 0')
});

export type CartItemQuantityFormValues = z.infer<typeof cartItemQuantitySchema>;

export const cartQuantityFieldMap = {
  Quantity: 'quantity'
} as const satisfies Record<string, keyof CartItemQuantityFormValues>;
