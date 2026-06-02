import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { Button } from '../../../components/ui/Button';
import { AuthFormField } from '../../auth/components/AuthFormField';
import { FormErrorAlert } from '../../auth/components/FormErrorAlert';
import { productFormSchema, type ProductFormSchemaValues } from '../../products/schemas/productSchemas';

interface AdminProductFormProps {
  defaultValues?: Partial<ProductFormSchemaValues>;
  submitLabel: string;
  submittingLabel: string;
  formError?: string | null;
  formErrorDetails?: string[];
  onSubmit: (values: ProductFormSchemaValues) => Promise<void>;
  onCancel?: () => void;
}

const emptyDefaults: ProductFormSchemaValues = {
  name: '',
  description: '',
  sku: '',
  price: 0,
  stockQuantity: 0,
  isActive: true
};

export function AdminProductForm({
  defaultValues,
  submitLabel,
  submittingLabel,
  formError = null,
  formErrorDetails = [],
  onSubmit,
  onCancel
}: AdminProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormSchemaValues>({
    resolver: zodResolver(productFormSchema) as Resolver<ProductFormSchemaValues>,
    mode: 'onBlur',
    defaultValues: {
      ...emptyDefaults,
      ...defaultValues
    }
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      {formError ? (
        <FormErrorAlert title="Product save failed" message={formError} details={formErrorDetails} />
      ) : null}

      <AuthFormField label="Name" error={errors.name?.message} {...register('name')} />
      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:border-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          aria-invalid={errors.description ? true : undefined}
          {...register('description')}
        />
        {errors.description ? (
          <p className="text-sm text-red-600" role="alert">
            {errors.description.message}
          </p>
        ) : null}
      </div>
      <AuthFormField label="SKU" error={errors.sku?.message} {...register('sku')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <AuthFormField
          label="Price"
          type="number"
          step="0.01"
          min="0"
          error={errors.price?.message}
          {...register('price')}
        />
        <AuthFormField
          label="Stock quantity"
          type="number"
          step="1"
          min="0"
          error={errors.stockQuantity?.message}
          {...register('stockQuantity')}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register('isActive')} />
        Product is active
      </label>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
        {onCancel ? (
          <button
            type="button"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            onClick={onCancel}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
