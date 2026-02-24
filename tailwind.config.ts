import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        // Component-specific animations will be added here as needed
      },
      keyframes: {
        // Component-specific keyframes will be added here as needed
      },
    },
  },
  plugins: [],
} satisfies Config
