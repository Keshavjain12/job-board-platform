/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#16181D',
        surface: '#1F222A',
        'surface-light': '#262A33',
        'surface-hover': '#2D3140',
        border: '#2D313B',
        text: '#ECEDEE',
        muted: '#8B92A0',
        accent: '#F5A623',
        'accent-dim': '#C98A1A',
        teal: '#4FD1C5',
        danger: '#E5484D',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
