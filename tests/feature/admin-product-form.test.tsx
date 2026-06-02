import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AdminProductForm } from '../../src/features/adminProducts/components/AdminProductForm';

describe('AdminProductForm validation', () => {
  it('shows required field errors on empty submit', async () => {
    const onSubmit = vi.fn();

    render(
      <AdminProductForm
        submitLabel="Save product"
        submittingLabel="Saving…"
        onSubmit={onSubmit}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save product' }));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('SKU is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows price validation error for zero price', async () => {
    const onSubmit = vi.fn();

    render(
      <AdminProductForm
        submitLabel="Save product"
        submittingLabel="Saving…"
        onSubmit={onSubmit}
      />
    );

    await userEvent.type(screen.getByLabelText('Name'), 'New product');
    await userEvent.type(screen.getByLabelText('SKU'), 'NP-001');
    await userEvent.clear(screen.getByLabelText('Price'));
    await userEvent.type(screen.getByLabelText('Price'), '0');
    await userEvent.click(screen.getByRole('button', { name: 'Save product' }));

    expect(await screen.findByText('Price must be greater than 0')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
