/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{ejs,tsx}"],
  plugins: [require('@tailwindcss/typography'),require("daisyui"),],
  daisyui: {
    themes: [ "light", "dark" ]
  },
}
