import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../useAuth';
import { loginFieldMap, loginSchema, type LoginFormValues } from '../schemas/authSchemas';
import { applyFormServerErrors } from '../utils/applyFormServerErrors';
import { mapAuthErrorMessage } from '../utils/mapAuthErrorMessage';
import { AuthFormField } from './AuthFormField';
import { FormErrorAlert } from './FormErrorAlert';
import { SessionExpiredBanner } from './SessionExpiredBanner';

interface LoginLocationState {
  from?: string;
  sessionExpired?: boolean;
}

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, sessionExpired, clearSessionExpired } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [formErrorDetails, setFormErrorDetails] = useState<string[]>([]);
  const locationState = (location.state as LoginLocationState | null) ?? {};
  const showSessionBanner = sessionExpired || locationState.sessionExpired;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setFormErrorDetails([]);

    try {
      await login(values);
      navigate(locationState.from ?? '/products', { replace: true });
    } catch (error) {
      const serverErrors = applyFormServerErrors(error, setError, loginFieldMap);

      if (serverErrors) {
        setFormError(serverErrors.formMessage);
        setFormErrorDetails(serverErrors.fieldErrors);
        return;
      }

      setFormError(mapAuthErrorMessage(error, 'Unable to sign in. Please try again.'));
    }
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      {showSessionBanner ? (
        <SessionExpiredBanner
          onDismiss={() => {
            clearSessionExpired();
          }}
        />
      ) : null}

      {formError ? (
        <FormErrorAlert title="Sign in failed" message={formError} details={formErrorDetails} />
      ) : null}

      <AuthFormField
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <AuthFormField
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>

      <p className="text-sm text-slate-600">
        Need an account?{' '}
        <Link
          to="/register"
          className="font-medium text-slate-900 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
