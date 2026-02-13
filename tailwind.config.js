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
            DEFAULT: '#8B7355',
            dark: '#6D5A47',
            light: '#A0826D',
          },
          secondary: {
            DEFAULT: '#A0826D',
            light: '#D7CCC8',
            dark: '#795548',
          },
          accent: {
            DEFAULT: '#6B8E23',
            dark: '#556B2F',
            light: '#9ACD32',
          },
          earth: {
            cream: '#F5F1E8',
            sand: '#E6DDD8',
            surface: '#FAF8F3',
          },
          brown: {
            DEFAULT: '#3E2723',
            dark: '#6D4C41',      // ← INI SUDAH ADA
            light: '#6D4C41',
            lighter: '#A1887F',
          },
          'brown-dark': '#6D4C41',  // ← TAMBAH INI! (untuk class brown-dark)
          sienna: '#A0522D',
          olive: '#556B2F',
        },
        fontFamily: {
          sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        },
        boxShadow: {
          'earth-sm': '0 2px 4px rgba(62, 39, 35, 0.08)',
          'earth-md': '0 4px 12px rgba(62, 39, 35, 0.12)',
          'earth-lg': '0 8px 24px rgba(62, 39, 35, 0.16)',
        },
      },
    },
    plugins: [],
  }