import { z } from 'zod';
import { cartItemQuantitySchema } from '../../cart/schemas/cartSchemas';

export function createAddToCartQuantitySchema(maxQuantity: number) {
  return cartItemQuantitySchema.refine((values) => values.quantity <= maxQuantity, {
    message: `Only ${maxQuantity} items available in stock`,
    path: ['quantity']
  });
}

export type AddToCartQuantityFormValues = z.infer<typeof cartItemQuantitySchema>;
