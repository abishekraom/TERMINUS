/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        secondary: '#1E293B',
        cta: '#22C55E',
        background: '#020617',
        'text-main': '#F8FAFC',
        neon: '#00ff9f',
        cyan: '#4dc8ff',
        amber: '#d4943a',
        'amber-bright': '#f0a830',
        'surface': '#020617',
        'surface-light': '#0F172A',
        'surface-lighter': '#1E293B',
        'border-dim': 'rgba(255, 255, 255, 0.1)',
        'text-muted': '#94A3B8',
        'text-dim': '#64748B',
        'threat-red': '#EF4444',
        'green-active': '#22C55E',
      },
      fontFamily: {
        sans: ['"Fira Sans"', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
