/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        accent: '#22c55e',
        'deep-blue': '#0f172a',
        'muted-surface': '#1e293b',
        'gradient-start': '#7c3aed',
        'gradient-end': '#db2777',
      },
    },
  },
  plugins: [],
}

