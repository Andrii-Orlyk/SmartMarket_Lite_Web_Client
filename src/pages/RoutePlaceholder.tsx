import { Link } from 'react-router-dom';

interface RoutePlaceholderProps {
  title: string;
  description: string;
  badge?: string;
  backTo?: { label: string; href: string };
}

export function RoutePlaceholder({ title, description, badge, backTo }: RoutePlaceholderProps) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      {badge ? (
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">{badge}</p>
      ) : null}
      <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h1>
      <p className="mt-3 max-w-3xl text-slate-600">{description}</p>
      {backTo ? (
        <p className="mt-6">
          <Link
            to={backTo.href}
            className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            ← {backTo.label}
          </Link>
        </p>
      ) : null}
    </section>
  );
}
