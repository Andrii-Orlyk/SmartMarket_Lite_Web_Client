import {
  ConflictState,
  ErrorState,
  ForbiddenState,
  NotFoundState
} from './FeedbackStates';
import { getUiErrorPresentation } from './getUiErrorPresentation';

interface ApiErrorPanelProps {
  error: unknown;
  fallbackMessage: string;
  onRetry?: () => void;
}

export function ApiErrorPanel({ error, fallbackMessage, onRetry }: ApiErrorPanelProps) {
  const presentation = getUiErrorPresentation(error, fallbackMessage);

  switch (presentation.variant) {
    case 'forbidden':
      return <ForbiddenState title={presentation.title} message={presentation.message} />;
    case 'notFound':
      return (
        <NotFoundState
          title={presentation.title}
          message={presentation.message}
          actionLabel="Go back"
          onAction={() => window.history.back()}
        />
      );
    case 'conflict':
      return <ConflictState title={presentation.title} message={presentation.message} />;
    default:
      return (
        <ErrorState
          title={presentation.title}
          message={presentation.message}
          onRetry={presentation.retryable ? onRetry : undefined}
        />
      );
  }
}
