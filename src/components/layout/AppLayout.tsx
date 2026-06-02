import { Link, Outlet } from 'react-router-dom';
import { AppNav } from './AppNav';
import { DemoModeBadge } from './DemoModeBadge';
import { SkipLink } from './SkipLink';

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-slate-50">
      <SkipLink />
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
          <div className="flex min-h-touch shrink-0 items-center gap-2">
            <Link
              to="/"
              className="text-base font-semibold text-slate-900 sm:text-lg"
            >
              SmartMarket Lite
            </Link>
            <DemoModeBadge />
          </div>
          <AppNav />
        </div>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8"
      >
        <Outlet />
      </main>
    </div>
  );
}
