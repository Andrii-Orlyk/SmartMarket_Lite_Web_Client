import { z } from 'zod';

export const productFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200, 'Name is too long'),
  description: z.string().trim().max(2000, 'Description is too long').optional(),
  sku: z.string().trim().min(1, 'SKU is required').max(64, 'SKU is too long'),
  price: z.coerce.number({ message: 'Price is required' }).positive('Price must be greater than 0'),
  stockQuantity: z.coerce
    .number({ message: 'Stock quantity is required' })
    .int('Stock must be a whole number')
    .min(0, 'Stock must be 0 or greater'),
  isActive: z.boolean()
});

export type ProductFormSchemaValues = z.infer<typeof productFormSchema>;

export const productFormFieldMap = {
  Name: 'name',
  Description: 'description',
  Sku: 'sku',
  Price: 'price',
  StockQuantity: 'stockQuantity',
  IsActive: 'isActive'
} as const satisfies Record<string, keyof ProductFormSchemaValues>;

export const catalogFilterSchema = z
  .object({
    minPrice: z.string().trim(),
    maxPrice: z.string().trim()
  })
  .superRefine((values, context) => {
    const min = values.minPrice ? Number(values.minPrice) : undefined;
    const max = values.maxPrice ? Number(values.maxPrice) : undefined;

    if (values.minPrice && (min === undefined || Number.isNaN(min) || min < 0)) {
      context.addIssue({
        code: 'custom',
        message: 'Min price must be 0 or greater',
        path: ['minPrice']
      });
    }

    if (values.maxPrice && (max === undefined || Number.isNaN(max) || max < 0)) {
      context.addIssue({
        code: 'custom',
        message: 'Max price must be 0 or greater',
        path: ['maxPrice']
      });
    }

    if (min !== undefined && max !== undefined && !Number.isNaN(min) && !Number.isNaN(max) && min > max) {
      context.addIssue({
        code: 'custom',
        message: 'Min price cannot exceed max price',
        path: ['maxPrice']
      });
    }
  });

export type CatalogFilterFormValues = z.infer<typeof catalogFilterSchema>;
