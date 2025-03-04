/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,vue}"],
  theme: {
    extend: {
      colors: {
        "netflix-red": "#E50914",
        "netflix-black": "#141414",
        "netflix-dark": "#181818",
      },
    },
  },
  plugins: [],
};
