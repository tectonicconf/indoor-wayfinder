/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
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
