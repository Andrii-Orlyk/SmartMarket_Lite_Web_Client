const DEFAULT_API_BASE_URL = 'http://localhost:5000';

/** Local SmartMarket API URLs that can be proxied by Vite in development. */
const LOCAL_API_PATTERN = /^https?:\/\/(localhost|127\.0\.0\.1):5000\/?$/i;

function readConfiguredBaseUrl(): string | undefined {
  const smartMarket = import.meta.env.VITE_SMARTMARKET_API_BASE_URL;
  const generic = import.meta.env.VITE_API_BASE_URL;

  if (typeof smartMarket === 'string' && smartMarket.trim().length > 0) {
    return smartMarket.trim();
  }

  if (typeof generic === 'string' && generic.trim().length > 0) {
    return generic.trim();
  }

  return undefined;
}

export function getApiBaseUrl(): string {
  const configured = readConfiguredBaseUrl();

  if (configured) {
    const normalized = configured.replace(/\/$/, '');

    // In dev, same-origin requests use the Vite /api proxy and avoid CORS failures.
    if (import.meta.env.DEV && LOCAL_API_PATTERN.test(normalized)) {
      return '';
    }

    return normalized;
  }

  if (import.meta.env.DEV) {
    return '';
  }

  return DEFAULT_API_BASE_URL;
}

export function getAppEnv(): string {
  return import.meta.env.VITE_APP_ENV ?? 'development';
}
