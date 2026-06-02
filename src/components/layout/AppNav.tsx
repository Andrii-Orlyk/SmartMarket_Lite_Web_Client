import { useEffect, useId, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { CurrentUserBar, LogoutButton, useAuth } from '../../features/auth';

const primaryLinks = [
  { to: '/products', label: 'Products' },
  { to: '/cart', label: 'Cart' },
  { to: '/orders', label: 'Orders' }
] as const;

const guestLinks = [
  { to: '/login', label: 'Sign in' },
  { to: '/register', label: 'Register' }
] as const;

function navLinkClass(isActive: boolean) {
  return twMerge(
    'flex min-h-touch items-center rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900',
    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
  );
}

export function AppNav() {
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    const handleChange = () => {
      if (mediaQuery.matches) {
        setMobileOpen(false);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <nav aria-label="Main navigation" className="relative flex items-center gap-2 sm:gap-3">
      <div className="hidden md:block">
        <CurrentUserBar />
      </div>

      <button
        ref={menuButtonRef}
        type="button"
        className="inline-flex min-h-touch min-w-touch items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 md:hidden"
        aria-expanded={mobileOpen}
        aria-controls={menuId}
        onClick={() => setMobileOpen((open) => !open)}
      >
        <span className="sr-only">{mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}</span>
        <span aria-hidden="true">{mobileOpen ? 'Close' : 'Menu'}</span>
      </button>

      <div
        id={menuId}
        className={twMerge(
          'absolute right-0 top-[calc(100%+0.5rem)] z-20 w-[min(100vw-2rem,16rem)] rounded-xl border border-slate-200 bg-white p-2 shadow-lg xs:w-64 md:static md:mt-0 md:flex md:w-auto md:items-center md:gap-1 md:border-0 md:bg-transparent md:p-0 md:shadow-none',
          mobileOpen ? 'block' : 'hidden md:flex'
        )}
      >
        <ul className="flex flex-col gap-1 md:flex-row md:items-center">
          {primaryLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => navLinkClass(isActive)}
                onClick={closeMobileMenu}
              >
                {label}
              </NavLink>
            </li>
          ))}

          {isAdmin ? (
            <li>
              <NavLink
                to="/admin/products"
                className={({ isActive }) => navLinkClass(isActive)}
                onClick={closeMobileMenu}
              >
                Admin
              </NavLink>
            </li>
          ) : null}

          <li className="hidden h-5 w-px bg-slate-200 md:mx-1 md:block" aria-hidden="true" />

          {isAuthenticated ? (
            <>
              <li className="px-3 py-2 text-sm text-slate-600 md:hidden">
                <CurrentUserBar />
              </li>
              <li className="md:flex md:items-center [&_button]:flex [&_button]:min-h-touch [&_button]:w-full [&_button]:items-center md:[&_button]:w-auto">
                <LogoutButton />
              </li>
            </>
          ) : (
            guestLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) => navLinkClass(isActive)}
                  onClick={closeMobileMenu}
                >
                  {label}
                </NavLink>
              </li>
            ))
          )}
        </ul>
      </div>
    </nav>
  );
}
