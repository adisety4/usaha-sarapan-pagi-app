/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#14b8a6", // teal-500
        primaryDark: "#0f766e", // teal-700
        background: "#f8fafc", // slate-50
        surface: "#ffffff",
      }
    },
  },
  plugins: [],
}
