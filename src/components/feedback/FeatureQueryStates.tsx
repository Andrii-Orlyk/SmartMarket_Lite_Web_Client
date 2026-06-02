import type { ReactNode } from 'react';
import { ApiErrorPanel } from './ApiErrorPanel';
import { EmptyState, LoadingState } from './FeedbackStates';

interface FeatureQueryStatesProps {
  query: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    error: unknown;
    refetch: () => void;
  };
  isEmpty?: boolean;
  loadingMessage: string;
  loadingAriaLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorFallbackMessage: string;
  children: ReactNode;
}

export function FeatureQueryStates({
  query,
  isEmpty = false,
  loadingMessage,
  loadingAriaLabel,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  errorFallbackMessage,
  children
}: FeatureQueryStatesProps) {
  if (query.isLoading) {
    return <LoadingState message={loadingMessage} ariaLabel={loadingAriaLabel} />;
  }

  if (query.isError) {
    return (
      <ApiErrorPanel
        error={query.error}
        fallbackMessage={errorFallbackMessage}
        onRetry={() => query.refetch()}
      />
    );
  }

  if (query.isSuccess && isEmpty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  if (query.isSuccess) {
    return <>{children}</>;
  }

  return null;
}
