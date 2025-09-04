import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bc: {
          red: '#C8102E',
          black: '#111111',
          warm: '#F9F9F7',
          blue: '#0052A5',
          gray: '#6B7280',
          gold: '#FFD700',
          bronze: '#CD7F32',
        },
      },
      borderRadius: {
        'xl2': '1rem',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
