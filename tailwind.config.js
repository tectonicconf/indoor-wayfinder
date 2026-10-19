/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Anybody", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        tectonic: {
          navy: "#050A2B",
          blue: "#2D74EE",
          cyan: "#02E3DE",
        },
      },
      keyframes: {
        // Cyan ring that grows and fades, to draw attention to an empty field.
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(2, 227, 222, 0.7)" },
          "70%": { boxShadow: "0 0 0 6px rgba(2, 227, 222, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(2, 227, 222, 0)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 1.6s ease-out infinite",
      },
    },
  },
  plugins: [],
};
