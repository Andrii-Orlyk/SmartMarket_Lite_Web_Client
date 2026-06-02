import { isMockApiEnabled } from '../../lib/demoMode';

export function DemoModeBadge() {
  if (!isMockApiEnabled) {
    return null;
  }

  return (
    <span
      className="hidden rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-900 sm:inline"
      role="status"
    >
      Demo mode
    </span>
  );
}
