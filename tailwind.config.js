/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          50: '#faf6f0',
          100: '#f4ece0',
          200: '#ebd8c0',
          300: '#ddbea0',
          400: '#ca9e7b',
          500: '#b8815a',
          600: '#a36b47',
          700: '#845339',
          800: '#6d4532',
          900: '#59392b',
          950: '#341f16',
        },
        parchment: {
          50: '#fbfaf5',
          100: '#f7f4ea',
          200: '#ede6d1',
          300: '#e0d4b2',
          400: '#d0be8f',
          500: '#c2a970',
          600: '#b19359',
          700: '#947746',
          800: '#79613c',
          900: '#645134',
        },
        asian: {
          red: '#c0262d',
          gold: '#eab308',
          blue: '#1e3a8a',
          green: '#047857',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        handwriting: ['"Dancing Script"', '"Caveat"', 'cursive'],
        sans: ['"Be Vietnam Pro"', 'Inter', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.8', filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.7))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 16px rgba(239, 68, 68, 1))' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        sway: 'sway 4s ease-in-out infinite',
        glow: 'glow 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
