import { useState } from 'react';
import { FeatureQueryStates } from '../../../components/feedback';
import { SuccessBanner } from '../../../components/feedback/FeedbackStates';
import { isApiClientError, isValidationError } from '../../../lib/apiErrors';
import type { ProductDto } from '../../../types/api';
import type { ProductFormSchemaValues } from '../../products/schemas/productSchemas';
import { useProductsQuery } from '../../products/hooks/useProductsQuery';
import { AdminProductForm } from '../components/AdminProductForm';
import { AdminProductTable } from '../components/AdminProductTable';
import {
  useCreateAdminProductMutation,
  useUpdateAdminProductMutation
} from '../hooks/useAdminProductMutations';
import { productToFormValues } from '../utils/productToFormValues';

const ADMIN_PRODUCTS_PAGE_SIZE = 50;

export function AdminProductsPage() {
  const productsQuery = useProductsQuery({ page: 1, pageSize: ADMIN_PRODUCTS_PAGE_SIZE });
  const createProductMutation = useCreateAdminProductMutation();
  const updateProductMutation = useUpdateAdminProductMutation();

  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formErrorDetails, setFormErrorDetails] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const products = productsQuery.data?.items ?? [];
  const isEmpty = productsQuery.isSuccess && products.length === 0;

  const clearFormFeedback = () => {
    setFormError(null);
    setFormErrorDetails([]);
    setSuccessMessage(null);
  };

  const handleServerError = (error: unknown) => {
    if (isApiClientError(error)) {
      setFormError(error.error.message);
      setFormErrorDetails(isValidationError(error) ? error.error.errors : []);
      return;
    }

    setFormError('Unable to save the product. Please try again.');
    setFormErrorDetails([]);
  };

  const handleCreate = async (values: ProductFormSchemaValues) => {
    clearFormFeedback();

    try {
      await createProductMutation.mutateAsync(values);
      setSuccessMessage('Product created successfully.');
      setEditingProduct(null);
    } catch (error) {
      handleServerError(error);
    }
  };

  const handleUpdate = async (values: ProductFormSchemaValues) => {
    if (!editingProduct) {
      return;
    }

    clearFormFeedback();

    try {
      await updateProductMutation.mutateAsync({
        productId: editingProduct.id,
        payload: values
      });
      setSuccessMessage(`Product ${editingProduct.name} updated successfully.`);
      setEditingProduct(null);
    } catch (error) {
      handleServerError(error);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Manage products</h1>
        <p className="mt-2 text-sm text-slate-600">
          Create, update, activate, deactivate, and remove catalog products.
        </p>
      </header>

      {successMessage ? <SuccessBanner title="Saved" message={successMessage} /> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          {editingProduct ? `Edit ${editingProduct.name}` : 'Add product'}
        </h2>
        <div className="mt-4">
          <AdminProductForm
            key={editingProduct?.id ?? 'create'}
            defaultValues={editingProduct ? productToFormValues(editingProduct) : undefined}
            submitLabel={editingProduct ? 'Update product' : 'Create product'}
            submittingLabel={editingProduct ? 'Updating…' : 'Creating…'}
            formError={formError}
            formErrorDetails={formErrorDetails}
            onSubmit={editingProduct ? handleUpdate : handleCreate}
            onCancel={editingProduct ? () => setEditingProduct(null) : undefined}
          />
        </div>
      </section>

      <FeatureQueryStates
        query={productsQuery}
        isEmpty={isEmpty}
        loadingMessage="Loading products…"
        loadingAriaLabel="Loading admin products"
        emptyTitle="No products in catalog"
        emptyDescription="Create the first product using the form above."
        errorFallbackMessage="Unable to load products for admin management."
      >
        <AdminProductTable
          products={products}
          editingProductId={editingProduct?.id ?? null}
          onEdit={(product) => {
            clearFormFeedback();
            setEditingProduct(product);
          }}
        />
      </FeatureQueryStates>
    </div>
  );
}
