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
        // LevelUp Dark RPG Theme
        dark: {
          900: '#0A0A14',  // Deepest background
          800: '#12121F',  // Card backgrounds
          700: '#1A1A2E',  // Elevated surfaces
          600: '#252542',  // Borders, dividers
        },
        // Accent colors (glowing)
        accent: {
          purple: '#8B5CF6',
          'purple-glow': '#A78BFA',
          teal: '#14B8A6',
          'teal-glow': '#2DD4BF',
          blue: '#3B82F6',
          'blue-glow': '#60A5FA',
        },
        // Status colors
        status: {
          locked: '#4B5563',    // Gray
          active: '#8B5CF6',    // Purple glow
          completed: '#14B8A6', // Teal
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'unlock': 'unlock 0.6s ease-out',
        'shake': 'shake 0.4s ease-in-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.8)' },
        },
        'unlock': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
      },
    },
  },
  plugins: [],
}
