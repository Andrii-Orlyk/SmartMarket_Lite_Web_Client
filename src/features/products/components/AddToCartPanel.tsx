import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';
import { ApiErrorPanel } from '../../../components/feedback/ApiErrorPanel';
import { SuccessBanner } from '../../../components/feedback/FeedbackStates';
import { Button } from '../../../components/ui/Button';
import { AuthFormField } from '../../auth/components/AuthFormField';
import { useAuth } from '../../auth/useAuth';
import { useAddCartItemMutation } from '../../cart/hooks/useCartMutations';
import type { ProductDto } from '../../../types/api';
import {
  createAddToCartQuantitySchema,
  type AddToCartQuantityFormValues
} from '../schemas/productDetailsSchemas';
import {
  canAddProductToCart,
  getAddToCartButtonLabel,
  getProductAvailabilityReason,
  getProductStockHint
} from '../utils/productAvailability';

interface AddToCartPanelProps {
  product: ProductDto;
}

export function AddToCartPanel({ product }: AddToCartPanelProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const addToCartMutation = useAddCartItemMutation();
  const [showSuccess, setShowSuccess] = useState(false);

  const isAddEnabled = canAddProductToCart(product);
  const disabledReason = getProductAvailabilityReason(product);
  const stockHint = getProductStockHint(product);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<AddToCartQuantityFormValues>({
    resolver: zodResolver(createAddToCartQuantitySchema(product.stockQuantity)) as Resolver<AddToCartQuantityFormValues>,
    mode: 'onBlur',
    defaultValues: {
      quantity: 1
    }
  });

  const onSubmit = async (values: AddToCartQuantityFormValues) => {
    setShowSuccess(false);
    await addToCartMutation.mutateAsync({
      productId: product.id,
      quantity: values.quantity
    });
    setShowSuccess(true);
    reset({ quantity: 1 });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Add to cart</h2>

      {stockHint ? (
        <p className="mt-2 text-sm text-slate-600" role="status">
          {stockHint}
        </p>
      ) : null}

      {!isAuthenticated ? (
        <p className="mt-3 text-sm text-slate-600">
          <Link
            to="/login"
            state={{ from: location.pathname }}
            className="font-medium text-slate-900 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Sign in
          </Link>{' '}
          to add this product to your cart.
        </p>
      ) : null}

      {isAuthenticated && !isAddEnabled && disabledReason ? (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-amber-800" role="status">
            {disabledReason}
          </p>
          <Button type="button" disabled className="w-full sm:w-auto">
            {getAddToCartButtonLabel(product)}
          </Button>
        </div>
      ) : null}

      {isAuthenticated && isAddEnabled ? (
        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          {showSuccess ? (
            <SuccessBanner
              title="Added to cart"
              message={`${product.name} was added to your cart.`}
            />
          ) : null}

          {addToCartMutation.isError ? (
            <ApiErrorPanel
              error={addToCartMutation.error}
              fallbackMessage="Unable to add this product to your cart."
              onRetry={() => addToCartMutation.reset()}
            />
          ) : null}

          <div className="max-w-xs">
            <AuthFormField
              label="Quantity"
              type="number"
              min="1"
              max={String(product.stockQuantity)}
              step="1"
              error={errors.quantity?.message}
              {...register('quantity')}
            />
          </div>

          <Button type="submit" disabled={isSubmitting || addToCartMutation.isPending}>
            {isSubmitting || addToCartMutation.isPending ? 'Adding…' : getAddToCartButtonLabel(product)}
          </Button>
        </form>
      ) : null}
    </section>
  );
};
