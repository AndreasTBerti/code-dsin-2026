/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Courier Prime"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        corp: {
          bg: '#0a0a0a',
          panel: '#141414',
          border: '#2c2c2c',
          alert: '#8b0000',
          glow: '#ff1a1a',
        }
      }
    },
  },
  plugins: [],
}