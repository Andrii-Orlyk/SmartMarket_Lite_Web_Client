import type { ProductDto } from '../../../types/api';

export type ProductAvailabilityLabel = 'Available' | 'Out of stock' | 'Unavailable';

export function isProductAvailable(product: ProductDto): boolean {
  return product.isActive && product.stockQuantity > 0;
}

export function getProductAvailabilityLabel(product: ProductDto): ProductAvailabilityLabel {
  if (!product.isActive) {
    return 'Unavailable';
  }

  if (product.stockQuantity <= 0) {
    return 'Out of stock';
  }

  return 'Available';
}

export function getProductAvailabilityReason(product: ProductDto): string | null {
  if (!product.isActive) {
    return 'This product is no longer available.';
  }

  if (product.stockQuantity <= 0) {
    return 'This product is currently out of stock.';
  }

  return null;
}

export function getProductAvailabilityBadgeClass(product: ProductDto): string {
  const label = getProductAvailabilityLabel(product);

  if (label === 'Unavailable') {
    return 'bg-slate-100 text-slate-600';
  }

  if (label === 'Out of stock') {
    return 'bg-amber-100 text-amber-800';
  }

  return 'bg-emerald-100 text-emerald-800';
}

/** Human-readable stock line when stockQuantity is provided by the API. */
export function getProductStockHint(product: ProductDto): string | null {
  if (!product.isActive) {
    return null;
  }

  if (product.stockQuantity <= 0) {
    return 'Out of stock';
  }

  if (product.stockQuantity === 1) {
    return 'Only 1 left';
  }

  return `${product.stockQuantity} in stock`;
}

export function getAddToCartButtonLabel(product: ProductDto): string {
  if (!product.isActive) {
    return 'Unavailable';
  }

  if (product.stockQuantity <= 0) {
    return 'Out of stock';
  }

  return 'Add to cart';
}

export function canAddProductToCart(product: ProductDto): boolean {
  return isProductAvailable(product);
}

export function getAddToCartDisabledReason(product: ProductDto): string | null {
  return getProductAvailabilityReason(product);
}
