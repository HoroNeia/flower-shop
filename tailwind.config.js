/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        'luxury': '2.5rem',
      },
      zIndex: {
        '250': '250',
      }
    },
  },
  plugins: [],
}