/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0F1826",
          900: "#0A111C",
          800: "#0F1826",
          700: "#1C2A3C",
          600: "#2E4055",
          500: "#4A5E75",
          400: "#6E8299",
          300: "#9CAEC2",
        },
        surface: {
          DEFAULT: "#FAF7F1",
          raised: "#FFFFFF",
          sunk: "#F1EBE0",
          line: "#E0D7C8",
        },
        safety: {
          DEFAULT: "#FF6A13",
          dark: "#D1490A",
          soft: "#FFF0E4",
        },
        ok: { DEFAULT: "#17663D", soft: "#E6F2EB" },
        warn: { DEFAULT: "#9A5B00", soft: "#FCF1DC" },
        bad: { DEFAULT: "#A3231C", soft: "#FBEAE8" },
      },
      fontFamily: {
        head: ['"Barlow Condensed"', '"Arial Narrow"', "Impact", "sans-serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 24, 38, 0.06), 0 1px 3px rgba(15, 24, 38, 0.04)",
        lift: "0 8px 24px rgba(15, 24, 38, 0.12)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-out": { from: { opacity: "1" }, to: { opacity: "0" } },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-right": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
        "slide-in-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "pop-in": {
          from: { opacity: "0", transform: "translateY(6px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "sweep": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(400%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 150ms ease-out",
        "fade-out": "fade-out 150ms ease-in",
        "slide-in-right": "slide-in-right 220ms cubic-bezier(0.22,1,0.36,1)",
        "slide-out-right": "slide-out-right 180ms ease-in",
        "slide-in-bottom": "slide-in-bottom 220ms cubic-bezier(0.22,1,0.36,1)",
        "pop-in": "pop-in 140ms ease-out",
        "sweep": "sweep 1.1s linear infinite",
      },
    },
  },
  plugins: [],
};
