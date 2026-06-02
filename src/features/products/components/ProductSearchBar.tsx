interface ProductSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function ProductSearchBar({ value, onChange, onSubmit }: ProductSearchBarProps) {
  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label className="sr-only" htmlFor="product-search">
        Search products
      </label>
      <input
        id="product-search"
        type="search"
        value={value}
        placeholder="Search by name or SKU"
        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:border-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        Search
      </button>
    </form>
  );
}
