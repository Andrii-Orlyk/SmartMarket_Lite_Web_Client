import { Link, useParams } from 'react-router-dom';
import { AddToCartPanel } from '../components/AddToCartPanel';
import { ProductDetailsStates } from '../components/ProductDetailsStates';
import { ProductInfoPanel } from '../components/ProductInfoPanel';

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <Link
        to="/products"
        className="inline-flex text-sm font-medium text-slate-700 underline-offset-2 hover:text-slate-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        ← Back to products
      </Link>

      <ProductDetailsStates productId={id}>
        {(product) => (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <ProductInfoPanel product={product} />
            <AddToCartPanel product={product} />
          </div>
        )}
      </ProductDetailsStates>
    </div>
  );
}
