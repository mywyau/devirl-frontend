/** @type {import('tailwindcss').Config} */
export default {
  safelist: [
    {
      pattern: /bg-(red|blue|green|yellow|gray)-(400|500)/,
      variants: ['hover'],        // this adds hover:bg-*-400 & hover:bg-*-500
    },
  ],
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6366F1",   // Indigo 500
          light: "#A5B4FC",     // Indigo 300
          dark: "#4338CA",      // Indigo 700
        },
        surface: "#1F2937",      // Gray 800
        background: "#0F0F10",   // Near-black
        text: "#F9FAFB",         // White-ish

        // shadcn-vue compatibility
        primary: "#6366F1", // same as brand.DEFAULT
        "primary-foreground": "#FFFFFF",

        secondary: "#F3F4F6", // light gray bg
        "secondary-foreground": "#111827", // dark text

        destructive: "#EF4444", // red-500
        "destructive-foreground": "#FFFFFF",

        muted: "#E5E7EB", // gray-200
        "muted-foreground": "#6B7280", // gray-500

        accent: "#D1D5DB", // gray-300
        "accent-foreground": "#1F2937", // gray-800

        popover: "#FFFFFF",
        "popover-foreground": "#111827",

        card: "#1F2937", // surface
        "card-foreground": "#F9FAFB", // text
      },
      fontFamily: {
        sans: ["InterVariable", "sans-serif"],
      },
    },
  },
  plugins: [],
};
