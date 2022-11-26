/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fira: "'Fira Sans', sans-serif",
      },
      keyframes: {
        wiggle: {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-8deg)" },
          "75%": { transform: "rotate(8deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        "wiggle-sm": {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      animation: {
        wiggle:
          "wiggle var(--animation-duration) var(--animation-delay) var(--animation-repeat) var(--animation-timing-fn)",
        "wiggle-sm":
          "wiggle-sm var(--animation-duration) var(--animation-delay) var(--animation-repeat) var(--animation-timing-fn)",
      },
    },
  },
  plugins: [],
};
