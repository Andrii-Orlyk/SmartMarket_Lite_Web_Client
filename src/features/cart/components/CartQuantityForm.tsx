import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { AuthFormField } from '../../auth/components/AuthFormField';
import { cartItemQuantitySchema, type CartItemQuantityFormValues } from '../schemas/cartSchemas';

interface CartQuantityFormProps {
  defaultQuantity: number;
  isSubmitting?: boolean;
  onSubmit: (values: CartItemQuantityFormValues) => Promise<void>;
}

export function CartQuantityForm({
  defaultQuantity,
  isSubmitting: isSubmittingExternal = false,
  onSubmit
}: CartQuantityFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting }
  } = useForm<CartItemQuantityFormValues>({
    resolver: zodResolver(cartItemQuantitySchema) as Resolver<CartItemQuantityFormValues>,
    mode: 'onBlur',
    defaultValues: {
      quantity: defaultQuantity
    }
  });

  const isSubmitting = isSubmittingExternal || isFormSubmitting;

  return (
    <form
      className="flex items-start gap-2"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="w-24">
        <AuthFormField
          label="Quantity"
          type="number"
          min="1"
          step="1"
          error={errors.quantity?.message}
          {...register('quantity')}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        {isSubmitting ? 'Updating…' : 'Update'}
      </button>
    </form>
  );
}
