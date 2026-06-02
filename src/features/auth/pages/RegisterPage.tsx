import { RegisterForm } from '../components/RegisterForm';

export function RegisterPage() {
  return (
    <section className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Authentication</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">Create account</h1>
      <p className="mt-2 text-sm text-slate-600">Register to shop, save your cart, and track orders.</p>
      <div className="mt-6">
        <RegisterForm />
      </div>
    </section>
  );
}
