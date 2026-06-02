import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget =
    env.VITE_SMARTMARKET_API_BASE_URL?.trim() ||
    env.VITE_API_BASE_URL?.trim() ||
    'http://localhost:5000';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: apiTarget.replace(/\/$/, ''),
          changeOrigin: true
        }
      }
    },
    preview: {
      port: 4173,
      strictPort: true
    },
    test: {
      environment: 'jsdom',
      setupFiles: './tests/setup.ts',
      globals: true,
      css: true,
      exclude: ['node_modules/**', 'dist/**', 'tests/e2e/**']
    }
  };
});
