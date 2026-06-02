import {
  EmptyState,
  ErrorState,
  LoadingState
} from '../../../components/feedback';

interface CatalogLoadingStateProps {
  message?: string;
}

export function CatalogLoadingState({ message = 'Loading products…' }: CatalogLoadingStateProps) {
  return <LoadingState message={message} ariaLabel="Loading products" />;
}

interface CatalogEmptyStateProps {
  onReset: () => void;
}

export function CatalogEmptyState({ onReset }: CatalogEmptyStateProps) {
  return (
    <EmptyState
      title="No products found"
      description="Try adjusting your search or price filters to see more results."
      actionLabel="Clear filters"
      onAction={onReset}
    />
  );
}

interface CatalogErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function CatalogErrorState({ message, onRetry }: CatalogErrorStateProps) {
  return (
    <ErrorState
      title="Unable to load products"
      message={message}
      onRetry={onRetry}
    />
  );
}
