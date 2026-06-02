import type { ProductDto } from '../../../types/api';
import { useUpdateAdminProductMutation } from '../hooks/useAdminProductMutations';
import { productToFormValues } from '../utils/productToFormValues';

interface ProductStatusToggleProps {
  product: ProductDto;
}

export function ProductStatusToggle({ product }: ProductStatusToggleProps) {
  const updateProductMutation = useUpdateAdminProductMutation();

  const handleToggle = () => {
    updateProductMutation.mutate({
      productId: product.id,
      payload: {
        ...productToFormValues(product),
        isActive: !product.isActive
      }
    });
  };

  return (
    <button
      type="button"
      disabled={updateProductMutation.isPending}
      onClick={handleToggle}
      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
    >
      {updateProductMutation.isPending
        ? 'Updating…'
        : product.isActive
          ? 'Deactivate'
          : 'Activate'}
    </button>
  );
}
