/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F7F7F5',
        ink: {
          DEFAULT: '#15171C',
          700: '#2B2E37',
          400: '#6B6F7B'
        },
        primary: {
          50: '#EEEEFC',
          100: '#D9D9F8',
          400: '#7C7CE8',
          500: '#5B5BD6',
          600: '#4747C2',
          700: '#3838A0',
          900: '#23235E'
        },
        amber: {
          400: '#F5B85C',
          500: '#F2A93B',
          600: '#DB8E1F'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' }
        }
      }
    }
  },
  plugins: []
}