import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          darkest: '#1a1714',
          dark: '#2d2926',
          mid: '#5c5550',
          light: '#a39890',
          pale: '#e8e2da',
          cream: '#f5f1eb',
        },
        gold: {
          DEFAULT: '#b8975a',
          light: '#d4b47a',
          dark: '#8a6e3e',
        },
        offwhite: '#faf8f5',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
