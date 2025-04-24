/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{vue,js}",
    "./layouts/**/*.{vue,js}",
    "./pages/**/*.{vue,js}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6366F1",
          light: "#A5B4FC",
          dark: "#4338CA",
        },
        surface: "#1F2937",
        background: "#0F0F10",
        text: "#F9FAFB",
        brand: '#6366F1', // Indigo for hover and accent
      },
    },
  },
  plugins: [],
  fontFamily: {
    sans: ["InterVariable", "sans-serif"],
  },
};
