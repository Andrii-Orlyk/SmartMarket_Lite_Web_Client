import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <section className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Authentication</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">Sign in</h1>
      <p className="mt-2 text-sm text-slate-600">
        Access your cart, checkout, orders, and account-specific pages.
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </section>
  );
}
