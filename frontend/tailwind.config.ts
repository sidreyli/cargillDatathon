import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          700: '#13315C',
          900: '#0B2545',
        },
        ocean: {
          500: '#1B6CA8',
          600: '#134074',
        },
        sky: {
          100: '#D6EAF8',
          400: '#48A9E6',
        },
        cloud: '#F7F9FC',
        teal: { 500: '#0FA67F' },
        coral: { 500: '#E74C5E' },
        amber: { 500: '#F5A623' },
        border: '#DCE3ED',
        'text-secondary': '#6B7B8D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(11, 37, 69, 0.08), 0 1px 2px rgba(11, 37, 69, 0.06)',
        'card-hover': '0 4px 12px rgba(11, 37, 69, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
