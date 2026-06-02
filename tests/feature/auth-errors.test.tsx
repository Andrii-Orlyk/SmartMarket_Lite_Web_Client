import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ApiClientError } from '../../src/lib/apiErrors';
import { LoginForm } from '../../src/features/auth/components/LoginForm';
import { RegisterForm } from '../../src/features/auth/components/RegisterForm';

const loginMock = vi.fn();
const registerMock = vi.fn();

vi.mock('../../src/features/auth/useAuth', () => ({
  useAuth: () => ({
    login: loginMock,
    register: registerMock,
    sessionExpired: false,
    clearSessionExpired: vi.fn()
  })
}));

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock
  };
});

describe('LoginForm API errors', () => {
  beforeEach(() => {
    loginMock.mockReset();
    navigateMock.mockReset();
  });

  it('shows invalid credentials message for 401 responses', async () => {
    loginMock.mockRejectedValue(
      new ApiClientError({
        statusCode: 401,
        httpStatus: 401,
        code: 'auth.unauthorized',
        message: 'Unauthorized.',
        errors: []
      })
    );

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText('Email'), 'buyer@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'wrong-password');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Invalid email or password.')).toBeInTheDocument();
  });

  it('shows connection message when server is unreachable', async () => {
    loginMock.mockRejectedValue(
      new ApiClientError({
        statusCode: 0,
        httpStatus: 0,
        code: 'network.unavailable',
        message: 'Unable to reach the server. Check your connection and try again.',
        errors: []
      })
    );

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText('Email'), 'buyer@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'secret123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      await screen.findByText('Unable to reach the server. Check your connection and try again.')
    ).toBeInTheDocument();
  });

  it('redirects to products after successful login', async () => {
    loginMock.mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText('Email'), 'buyer@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'secret123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/products', { replace: true });
    });
  });
});

describe('RegisterForm API errors', () => {
  beforeEach(() => {
    registerMock.mockReset();
  });

  it('shows duplicate email message for 409 responses', async () => {
    registerMock.mockRejectedValue(
      new ApiClientError({
        statusCode: 409,
        httpStatus: 409,
        code: 'auth.email_exists',
        message: 'Email is already registered.',
        errors: []
      })
    );

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText('First name'), 'Alex');
    await userEvent.type(screen.getByLabelText('Last name'), 'Buyer');
    await userEvent.type(screen.getByLabelText('Email'), 'buyer@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'secret123');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText('Email is already registered.')).toBeInTheDocument();
  });
});
