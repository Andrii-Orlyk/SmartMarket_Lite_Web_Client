/** True when the dev server uses MSW mock API instead of a live backend. */
export const isMockApiEnabled =
  import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true';
