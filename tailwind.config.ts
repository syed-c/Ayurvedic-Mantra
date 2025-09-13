import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'ayurveda-pattern': "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><path d=\"M50 20c10 0 18 8 18 18s-8 18-18 18-18-8-18-18 8-18 18-18zm0 40c15 0 27 12 27 27s-12 27-27 27-27-12-27-27 12-27 27-27z\" fill=\"%23f0f8f0\" opacity=\"0.1\"/></svg>')",
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        // Ayurvedic Color Palette - Updated to use darker, more sophisticated greens
        sage: {
          50: '#f0f8f0',
          100: '#dbeede',
          200: '#b9dcc0',
          300: '#8fc49e',
          400: '#2D4A2D', // Changed to much darker green
          500: '#1f3b20', // Darker green (primary)
          600: '#0f1d10', // Very dark green
          700: '#0a150b', // Almost black green
          800: '#061008', // Deep forest green
          900: '#030805', // Nearly black
        },
        terracotta: {
          50: '#fef7f2',
          100: '#fdede2',
          200: '#fbd8c0',
          300: '#f8bc91',
          400: '#f4956a',
          500: '#D2691E',
          600: '#c25a1a',
          700: '#a14916',
          800: '#843b15',
          900: '#6b2f13',
        },
        turmeric: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fbbf24',
          400: '#E6B800',
          500: '#d69e2e',
          600: '#b7791f',
          700: '#975a16',
          800: '#744210',
          900: '#5a2d0c',
        },
        cream: {
          50: '#FAF8F5',
          100: '#f5f1eb',
          200: '#ede5d8',
          300: '#e0d2c1',
          400: '#d1bfa5',
          500: '#c0a989',
          600: '#a8926f',
          700: '#8a7458',
          800: '#6f5d47',
          900: '#5a4a39',
        },
        // Standard shadcn colors with Ayurvedic theming
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-gentle': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
