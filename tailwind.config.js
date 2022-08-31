/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      Jost: ["Jost-Regular"],
    },
    extend: {},
  },
  plugins: [require("daisyui")],
};
