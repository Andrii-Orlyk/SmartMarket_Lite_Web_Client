import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FeatureQueryStates } from '../../../components/feedback';
import type { ProductsQueryParams } from '../../../types/api';
import { ProductCard } from '../components/ProductCard';
import { ProductFilters } from '../components/ProductFilters';
import { ProductSearchBar } from '../components/ProductSearchBar';
import { useProductsQuery } from '../hooks/useProductsQuery';

const DEFAULT_PAGE_SIZE = 12;

function parseNumberParam(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function buildQueryParams(searchParams: URLSearchParams): ProductsQueryParams {
  return {
    search: searchParams.get('search') ?? undefined,
    minPrice: parseNumberParam(searchParams.get('minPrice')),
    maxPrice: parseNumberParam(searchParams.get('maxPrice')),
    page: parseNumberParam(searchParams.get('page')) ?? 1,
    pageSize: DEFAULT_PAGE_SIZE
  };
}

export function ProductCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useMemo(() => buildQueryParams(searchParams), [searchParams]);

  const [searchDraft, setSearchDraft] = useState(searchParams.get('search') ?? '');
  const [minPriceDraft, setMinPriceDraft] = useState(searchParams.get('minPrice') ?? '');
  const [maxPriceDraft, setMaxPriceDraft] = useState(searchParams.get('maxPrice') ?? '');

  const productsQuery = useProductsQuery(queryParams);

  const applySearch = () => {
    const next = new URLSearchParams(searchParams);
    if (searchDraft.trim()) {
      next.set('search', searchDraft.trim());
    } else {
      next.delete('search');
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const applyFilters = () => {
    const next = new URLSearchParams(searchParams);

    if (minPriceDraft.trim()) {
      next.set('minPrice', minPriceDraft.trim());
    } else {
      next.delete('minPrice');
    }

    if (maxPriceDraft.trim()) {
      next.set('maxPrice', maxPriceDraft.trim());
    } else {
      next.delete('maxPrice');
    }

    next.set('page', '1');
    setSearchParams(next);
  };

  const resetFilters = () => {
    setSearchDraft('');
    setMinPriceDraft('');
    setMaxPriceDraft('');
    setSearchParams({});
  };

  const goToPage = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(page));
    setSearchParams(next);
  };

  const products = productsQuery.data?.items ?? [];
  const totalPages = productsQuery.data?.totalPages ?? 1;
  const currentPage = productsQuery.data?.page ?? queryParams.page ?? 1;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Catalog</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Products</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Browse available products, filter by price, and open a product for details.
        </p>
      </header>

      <ProductSearchBar value={searchDraft} onChange={setSearchDraft} onSubmit={applySearch} />

      <ProductFilters
        minPrice={minPriceDraft}
        maxPrice={maxPriceDraft}
        onMinPriceChange={setMinPriceDraft}
        onMaxPriceChange={setMaxPriceDraft}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      <FeatureQueryStates
        query={productsQuery}
        isEmpty={products.length === 0}
        loadingMessage="Loading products…"
        loadingAriaLabel="Loading products"
        emptyTitle="No products found"
        emptyDescription="Try adjusting your search or price filters to see more results."
        emptyActionLabel="Clear filters"
        onEmptyAction={resetFilters}
        errorFallbackMessage="Unable to load products. Please try again."
      >
        <>
          <p className="text-sm text-slate-600">
            Showing {products.length} of {productsQuery.data?.totalCount ?? 0} products
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
          {totalPages > 1 ? (
            <nav aria-label="Product pagination" className="flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={currentPage <= 1}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                onClick={() => goToPage(currentPage - 1)}
              >
                Previous
              </button>
              <p className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </p>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                onClick={() => goToPage(currentPage + 1)}
              >
                Next
              </button>
            </nav>
          ) : null}
        </>
      </FeatureQueryStates>
    </div>
  );
}
