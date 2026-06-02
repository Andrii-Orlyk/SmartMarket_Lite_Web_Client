import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { catalogFilterSchema, type CatalogFilterFormValues } from '../schemas/productSchemas';

interface ProductFiltersProps {
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export function ProductFilters({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onApply,
  onReset
}: ProductFiltersProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<CatalogFilterFormValues>({
    resolver: zodResolver(catalogFilterSchema),
    defaultValues: {
      minPrice,
      maxPrice
    }
  });

  useEffect(() => {
    setValue('minPrice', minPrice);
    setValue('maxPrice', maxPrice);
  }, [minPrice, maxPrice, setValue]);

  const onSubmit = handleSubmit(() => {
    onApply();
  });

  return (
    <form
      className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4"
      onSubmit={onSubmit}
      noValidate
    >
      <div className="space-y-1">
        <label htmlFor="min-price" className="block text-sm font-medium text-slate-700">
          Min price
        </label>
        <input
          id="min-price"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:border-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          aria-invalid={errors.minPrice ? true : undefined}
          aria-describedby={errors.minPrice ? 'min-price-error' : undefined}
          {...register('minPrice', {
            onChange: (event) => onMinPriceChange(event.target.value)
          })}
        />
        {errors.minPrice ? (
          <p id="min-price-error" className="text-sm text-red-600" role="alert">
            {errors.minPrice.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-1">
        <label htmlFor="max-price" className="block text-sm font-medium text-slate-700">
          Max price
        </label>
        <input
          id="max-price"
          type="number"
          min="0"
          step="0.01"
          placeholder="999.99"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:border-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          aria-invalid={errors.maxPrice ? true : undefined}
          aria-describedby={errors.maxPrice ? 'max-price-error' : undefined}
          {...register('maxPrice', {
            onChange: (event) => onMaxPriceChange(event.target.value)
          })}
        />
        {errors.maxPrice ? (
          <p id="max-price-error" className="text-sm text-red-600" role="alert">
            {errors.maxPrice.message}
          </p>
        ) : null}
      </div>
      <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Apply filters
        </button>
        <button
          type="button"
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          onClick={() => {
            reset({ minPrice: '', maxPrice: '' });
            onReset();
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
}
