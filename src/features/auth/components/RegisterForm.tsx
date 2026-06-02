import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../useAuth';
import { registerFieldMap, registerSchema, type RegisterFormValues } from '../schemas/authSchemas';
import { applyFormServerErrors } from '../utils/applyFormServerErrors';
import { mapRegisterErrorMessage } from '../utils/mapAuthErrorMessage';
import { AuthFormField } from './AuthFormField';
import { FormErrorAlert } from './FormErrorAlert';

export function RegisterForm() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [formErrorDetails, setFormErrorDetails] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setFormErrorDetails([]);

    try {
      await registerUser(values);
      navigate('/products', { replace: true });
    } catch (error) {
      const serverErrors = applyFormServerErrors(error, setError, registerFieldMap);

      if (serverErrors) {
        setFormError(serverErrors.formMessage);
        setFormErrorDetails(serverErrors.fieldErrors);
        return;
      }

      setFormError(mapRegisterErrorMessage(error, 'Unable to create your account. Please try again.'));
    }
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      {formError ? (
        <FormErrorAlert title="Registration failed" message={formError} details={formErrorDetails} />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <AuthFormField
          label="First name"
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <AuthFormField
          label="Last name"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>
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
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </Button>

      <p className="text-sm text-slate-600">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-slate-900 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
