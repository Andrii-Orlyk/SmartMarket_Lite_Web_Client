import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CartQuantityForm } from '../../src/features/cart/components/CartQuantityForm';

describe('CartQuantityForm', () => {
  it('shows validation error when quantity is zero', async () => {
    const onSubmit = vi.fn();
    render(<CartQuantityForm defaultQuantity={1} onSubmit={onSubmit} />);

    const quantityInput = screen.getByLabelText('Quantity');
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, '0');
    await userEvent.click(screen.getByRole('button', { name: /update/i }));

    expect(await screen.findByText('Quantity must be greater than 0')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
