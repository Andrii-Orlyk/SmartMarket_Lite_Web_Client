import { FeedbackPanel } from '../../../components/feedback';

interface SessionExpiredBannerProps {
  onDismiss?: () => void;
}

export function SessionExpiredBanner({ onDismiss }: SessionExpiredBannerProps) {
  return (
    <FeedbackPanel
      title="Session expired"
      message="Your session expired. Sign in again to continue."
      tone="warning"
      actionLabel={onDismiss ? 'Dismiss' : undefined}
      onAction={onDismiss}
      className="p-4 text-left"
    />
  );
}
