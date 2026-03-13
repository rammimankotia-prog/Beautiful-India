/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#006D77",
        "accent": "#FFDDD2",
        "background-light": "#EDF6F9",
        "background-dark": "#0B1A1C",
        "text-main": "#2C3E50",
        "text-muted": "#7F8C8D"
      },
      fontFamily: {
        "display": ["Montserrat", "sans-serif"]
      },
    },
  },
  plugins: [],
}
