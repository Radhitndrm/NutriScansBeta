/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx}", "./app/**/*.{js,jsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        smoke: "#4a4f42",
        "sky-warm": "#ccc9be",
      },
      fontFamily: {
        sans:            ["Inter_400Regular"],
        inter:           ["Inter_400Regular"],
        "inter-medium":  ["Inter_500Medium"],
        "inter-semibold":["Inter_600SemiBold"],
        "inter-bold":    ["Inter_700Bold"],
      },
    },
  },
  plugins: [],
};
