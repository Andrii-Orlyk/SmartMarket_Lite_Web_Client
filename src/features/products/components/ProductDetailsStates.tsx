import type { ReactNode } from 'react';
import { FeatureQueryStates } from '../../../components/feedback';
import type { ProductDto } from '../../../types/api';
import { useProductQuery } from '../hooks/useProductQuery';

interface ProductDetailsStatesProps {
  productId: string | undefined;
  children: (product: ProductDto) => ReactNode;
}

export function ProductDetailsStates({ productId, children }: ProductDetailsStatesProps) {
  const productQuery = useProductQuery(productId);

  return (
    <FeatureQueryStates
      query={productQuery}
      loadingMessage="Loading product details…"
      loadingAriaLabel="Loading product details"
      emptyTitle="Product unavailable"
      emptyDescription="This product could not be loaded."
      errorFallbackMessage="Unable to load product details. Please try again."
    >
      {productQuery.data ? children(productQuery.data) : null}
    </FeatureQueryStates>
  );
}
