/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C63FF',
          dark: '#5a52e0',
          light: '#8b85ff',
        },
        secondary: '#FF6584',
        accent: '#43e97b',
        accent2: '#f7971e',
        bg: {
          primary: '#0a0a0f',
          secondary: '#111118',
          card: '#16161f',
          elevated: '#1e1e2e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
      },
      boxShadow: {
        purple: '0 8px 32px rgba(108, 99, 255, 0.3)',
        glow: '0 0 40px rgba(108, 99, 255, 0.15)',
        card: '0 4px 20px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-right': 'slideInRight 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)',
        'scale-in': 'scaleIn 0.3s ease forwards',
        'float': 'float 8s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'spin-slow': 'spin 0.8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          'from': { opacity: '0', transform: 'translateX(30px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.9)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '33%': { transform: 'translateY(-20px) scale(1.02)' },
          '66%': { transform: 'translateY(10px) scale(0.98)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
