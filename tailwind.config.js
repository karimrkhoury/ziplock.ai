/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'bounce-slow': 'bounce 3s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s linear infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'fade-in-out': 'fadeInOut 2s ease-in-out',
        'bounce-once': 'bounce 0.6s ease-in-out',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'fade-in-delay': 'fadeIn 0.3s ease-out 0.2s forwards',
        'fade-message': 'fadeMessage 3s ease-in-out infinite',
        'cross-fade': 'crossFade 1s ease-in-out',
        'fade-out': 'fadeOut 0.2s ease-out forwards',
        ripple: 'ripple 0.6s ease-out',
        'number-increment': 'number-increment 1s ease-out forwards',
        'achievement-pop': 'achievement-pop 0.6s ease-out forwards',
        'linear-fade': 'linearFade 0.2s ease-out forwards',
        'linear-fade-delay': 'linearFade 0.2s ease-out 0.1s forwards',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-10deg)' },
          '75%': { transform: 'rotate(10deg)' },
        },
        fadeInOut: {
          '0%': { opacity: '0' },
          '10%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeMessage: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        crossFade: {
          '0%, 100%': { opacity: '1', transform: 'translateY(0)' },
          '50%': { opacity: '0', transform: 'translateY(-2px)' },
        },
        fadeOut: {
          '0%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
          '100%': { 
            opacity: '0',
            transform: 'translateY(-4px)'
          }
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' }
        },
        'number-increment': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'achievement-pop': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        linearFade: {
          from: { 
            opacity: '0',
            transform: 'translateY(4px)'
          },
          to: { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      colors: {
        gray: {
          850: '#1b1b1f', // Custom gray shade between 800 and 900
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        arabic: [
          'IBM Plex Sans Arabic',
          '-apple-system',
          'BlinkMacSystemFont',
          'Helvetica Neue',
          'Helvetica',
          'system-ui',
          'sans-serif'
        ],
      },
    },
  },
  plugins: [],
} 