/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0F19',
        surface: '#111827',
        surfaceBorder: '#1F2937',
        textPrimary: '#F9FAFB',
        textMuted: '#9CA3AF',
        emerald: '#10B981',
        indigo: '#6366F1'
      },
      boxShadow: {
        glass: '0 10px 30px rgba(0,0,0,0.35)'
      }
    }
  },
  plugins: []
}

