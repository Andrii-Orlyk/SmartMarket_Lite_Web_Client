import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState, ErrorState, ForbiddenState, LoadingState } from '../../src/components/feedback';

describe('feedback components', () => {
  it('renders loading state with status role', () => {
    render(<LoadingState message="Loading cart…" ariaLabel="Loading cart" />);

    expect(screen.getByRole('status', { name: /loading cart/i })).toHaveTextContent('Loading cart…');
  });

  it('renders empty state with action', async () => {
    const onAction = vi.fn();
    render(
      <EmptyState
        title="Cart is empty"
        description="Add products to continue."
        actionLabel="Browse products"
        onAction={onAction}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Browse products' }));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it('renders error state with retry action', async () => {
    const onRetry = vi.fn();
    render(<ErrorState title="Unable to load" message="Try again later." onRetry={onRetry} />);

    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('renders forbidden state for admin-only access', () => {
    render(
      <ForbiddenState
        title="Admin access required"
        message="You do not have permission to access this resource."
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/admin access required/i);
  });
});
