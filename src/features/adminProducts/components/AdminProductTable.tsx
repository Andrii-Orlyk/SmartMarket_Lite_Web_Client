import type { ProductDto } from '../../../types/api';
import { formatMoney } from '../../products/utils/formatMoney';
import { getProductAvailability } from '../../products/utils/getProductAvailability';
import { useDeleteAdminProductMutation } from '../hooks/useAdminProductMutations';
import { ProductStatusToggle } from './ProductStatusToggle';

interface AdminProductTableProps {
  products: ProductDto[];
  editingProductId: string | null;
  onEdit: (product: ProductDto) => void;
}

export function AdminProductTable({ products, editingProductId, onEdit }: AdminProductTableProps) {
  const deleteProductMutation = useDeleteAdminProductMutation();

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <caption className="sr-only">Admin product catalog</caption>
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left font-medium text-slate-700">
              Name
            </th>
            <th scope="col" className="px-4 py-3 text-left font-medium text-slate-700">
              SKU
            </th>
            <th scope="col" className="px-4 py-3 text-left font-medium text-slate-700">
              Price
            </th>
            <th scope="col" className="px-4 py-3 text-left font-medium text-slate-700">
              Stock
            </th>
            <th scope="col" className="px-4 py-3 text-left font-medium text-slate-700">
              Status
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium text-slate-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {products.map((product) => {
            const availability = getProductAvailability(product);
            const isDeleting =
              deleteProductMutation.isPending && deleteProductMutation.variables === product.id;

            return (
              <tr key={product.id} className={editingProductId === product.id ? 'bg-slate-50' : undefined}>
                <td className="px-4 py-3 font-medium text-slate-900">{product.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700">{product.sku}</td>
                <td className="px-4 py-3 text-slate-900">{formatMoney(product.price)}</td>
                <td className="px-4 py-3 text-slate-900">{product.stockQuantity}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${availability.className}`}>
                    {availability.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-900 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                    >
                      Edit
                    </button>
                    <ProductStatusToggle product={product} />
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => deleteProductMutation.mutate(product.id)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                    >
                      {isDeleting ? 'Removing…' : 'Remove'}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
