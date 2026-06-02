import type { ProductDto } from '../../../types/api';
import type { ProductFormSchemaValues } from '../../products/schemas/productSchemas';

export function productToFormValues(product: ProductDto): ProductFormSchemaValues {
  return {
    name: product.name,
    description: product.description ?? '',
    sku: product.sku,
    price: product.price,
    stockQuantity: product.stockQuantity,
    isActive: product.isActive
  };
}
