import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'rw-black': '#0B0B0B',
        'rw-dark': '#111111',
        'rw-gold': '#C8A96A',
        'rw-gold-light': '#D4B896',
        'rw-gold-dark': '#A8894A',
        'rw-gray': '#6B6B6B',
        'rw-light': '#F7F5F2',
        'rw-border': '#E8E4DF',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

export default config
