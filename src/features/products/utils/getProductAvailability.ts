import type { ProductDto } from '../../../types/api';
import {
  getProductAvailabilityBadgeClass,
  getProductAvailabilityLabel
} from './productAvailability';

/** @deprecated Use productAvailability helpers directly. */
export function getProductAvailability(product: ProductDto): {
  label: string;
  className: string;
} {
  return {
    label: getProductAvailabilityLabel(product),
    className: getProductAvailabilityBadgeClass(product)
  };
}
