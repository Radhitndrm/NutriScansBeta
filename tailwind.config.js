/** @type {import('tailwindcss').Config} */
module.exports = {
  // Beritahu Tailwind file mana saja yang pakai className
  content: ["./App.{js,jsx}", "./app/**/*.{js,jsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
