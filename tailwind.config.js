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
        // Premium Navy Dark Theme (inspired by G.Take + Arctic)
        dark: {
          950: '#020617',  // Deepest background
          900: '#0B1120',  // Main background
          850: '#0F172A',  // Card base
          800: '#1E293B',  // Card backgrounds
          750: '#253551',  // Elevated surfaces  
          700: '#334155',  // Borders, dividers
          600: '#475569',  // Secondary borders
        },
        // Accent colors - Cyan/Teal focus (clean, premium)
        accent: {
          cyan: '#06B6D4',       // Primary accent
          'cyan-glow': '#22D3EE', // Glow variant
          teal: '#14B8A6',
          'teal-glow': '#2DD4BF',
          blue: '#3B82F6',
          'blue-glow': '#60A5FA',
          amber: '#F59E0B',      // Warm accent for variety
          'amber-glow': '#FBBF24',
        },
        // Status colors
        status: {
          locked: '#475569',    // Slate gray
          active: '#06B6D4',    // Cyan glow
          completed: '#14B8A6', // Teal
          overdue: '#EF4444',   // Red for warnings
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse-glow 3s ease-in-out infinite',
        'unlock': 'unlock 0.6s ease-out',
        'shake': 'shake 0.4s ease-in-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(6, 182, 212, 0.6)' },
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
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-subtle': 'linear-gradient(180deg, rgba(6, 182, 212, 0.1) 0%, transparent 100%)',
      },
    },
  },
  plugins: [],
}
