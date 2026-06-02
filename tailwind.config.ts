import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '360px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem'
      },
      spacing: {
        touch: '2.75rem'
      }
    }
  },
  plugins: []
} satisfies Config;
