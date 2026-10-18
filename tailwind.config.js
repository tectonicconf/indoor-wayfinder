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
    },
  },
  plugins: [],
};
