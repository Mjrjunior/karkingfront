/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pt-sans-narrow': ['"PT Sans Narrow"', 'sans-serif'],
        'poppins': ['"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

