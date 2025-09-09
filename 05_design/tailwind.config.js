/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        muted: '#717182',
        destructive: '#D4183D',
        primary: {
          50: '#f6f6f7',
          100: '#e7e7ea',
          200: '#d1d1d6',
          300: '#b2b2bb',
          400: '#8a8a95',
          500: '#5d5d66',
          600: '#3f3f46',
          700: '#2f2f34',
          800: '#1f1f23',
          900: '#141417',
          950: '#0b0b0d'
        },
        ink: {
          900: '#0A0A0A',
          950: '#030213'
        }
      },
      borderRadius: {
  card: '12.75px',
  cardsm: '8.75px',
        btn: '6.75px'
      },
      fontSize: {
        xs2: '11.3px',
        sm2: '12.8px',
        base2: '13.2px'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
};
