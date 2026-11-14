/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF7',
          100: '#FFF9EC',
          200: '#FBF0D9',
        },
        mint: {
          50: '#EEFBF5',
          100: '#D5F5E6',
          200: '#A9E8CB',
          500: '#3BB58A',
          700: '#1F7A5C',
          800: '#18604A',
          900: '#133F32',
        },
        peach: {
          50: '#FFF4EC',
          100: '#FFE4CC',
          200: '#FFCB9E',
          500: '#F08A3E',
          700: '#B45A17',
        },
        sunny: {
          50: '#FFFCEB',
          100: '#FFF5C2',
          200: '#FFEB85',
        },
        ink: {
          700: '#3D4A44',
          800: '#27322D',
          900: '#1A211E',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        display: ['Fredoka', 'Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 24px -12px rgba(31, 122, 92, 0.25)',
        lift: '0 18px 40px -18px rgba(31, 122, 92, 0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};
