/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      fontFamily: {
        // Body text - Modern, clean, tech-forward
        sans: ['Exo 2', 'system-ui', 'sans-serif'],
        // Display/Headings - Crypto, Web3, futuristic
        display: ['Orbitron', 'Exo 2', 'sans-serif'],
      },
      keyframes: {
        orbit: {
          '0%': {
            transform: 'rotate(calc(var(--angle) * 1deg)) translateX(calc(var(--radius) * 1px)) rotate(calc(var(--angle) * -1deg))',
          },
          '100%': {
            transform: 'rotate(calc(360deg + var(--angle) * 1deg)) translateX(calc(var(--radius) * 1px)) rotate(calc(-360deg - var(--angle) * 1deg))',
          },
        },
      },
      animation: {
        orbit: 'orbit var(--duration) linear infinite',
      },
      colors: {
        // Fintech/Crypto optimized color palette
        primary: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // Main gold - trust, value, premium
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        secondary: {
          50: '#FEF9C3',
          100: '#FEF08A',
          200: '#FDE047',
          300: '#FACC15',
          400: '#EAB308',
          500: '#FBBF24', // Amber - energy, action
          600: '#F59E0B',
          700: '#D97706',
          800: '#B45309',
          900: '#92400E',
        },
        cta: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7', // Purple - innovation, tech
          600: '#9333EA',
          700: '#7E22CE',
          800: '#6B21A8',
          900: '#581C87',
        },
      },
    },
  },
  plugins: [],
}