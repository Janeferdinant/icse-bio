/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fdf2f4',
          100: '#fbe6e9',
          200: '#f7cfd6',
          300: '#f0a9b6',
          400: '#e5778e',
          500: '#d54867',
          600: '#be2e51',
          700: '#9e223f',
          800: '#831f38',
          900: '#4a1120',
          950: '#2a0711',
        },
        burgundy: {
          800: '#380e1e',
          900: '#250813',
          950: '#15040a',
        },
        indigo: {
          950: '#0b091f',
        },
        slate: {
          850: '#151926',
          900: '#0e111a',
          950: '#07090e',
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        heading: ['"Nunito"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.25)',
        'wine-glow': '0 0 25px -5px rgba(190, 46, 81, 0.3)',
        'indigo-glow': '0 0 25px -5px rgba(99, 102, 241, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
