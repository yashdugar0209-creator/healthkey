// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4faf9",
          100: "#e6f4f1",
          500: "#0b8a7a",
        }
      },
      container: {
        center: true,
        padding: "1rem",
      }
    },
  },
  plugins: [],
};
