/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: '#00D1FF',
          'cyan-dark': '#00B8E0',
          'cyan-light': '#7EEEFF',
        },
        dark: {
          900: '#000000',
          800: '#0A0A0A',
          700: '#111111',
          600: '#1A1A1A',
          500: '#222222',
          400: '#2A2A2A',
        },
        surface: {
          light: '#F8F9FA',
          DEFAULT: '#FFFFFF',
          dark: '#F1F3F5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-cyan': 'pulseCyan 2s infinite',
        'shimmer': 'shimmer 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseCyan: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 209, 255, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(0, 209, 255, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'dot-pattern': 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundSize: {
        'dot-sm': '20px 20px',
        'dot-md': '30px 30px',
      },
    },
  },
  plugins: [],
};
