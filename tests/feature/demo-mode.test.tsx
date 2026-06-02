import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

let mockApiEnabled = false;

vi.mock('../../src/lib/demoMode', () => ({
  get isMockApiEnabled() {
    return mockApiEnabled;
  }
}));

import { DemoModeBadge } from '../../src/components/layout/DemoModeBadge';

describe('Demo mode indicator', () => {
  it('shows Demo mode badge when mock API is enabled', () => {
    mockApiEnabled = true;
    render(<DemoModeBadge />);

    expect(screen.getByText('Demo mode')).toBeInTheDocument();
  });

  it('hides Demo mode badge when mock API is disabled', () => {
    mockApiEnabled = false;
    render(<DemoModeBadge />);

    expect(screen.queryByText('Demo mode')).not.toBeInTheDocument();
  });
});
