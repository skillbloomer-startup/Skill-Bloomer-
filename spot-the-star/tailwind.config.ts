import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "#05060f", 900: "#0a0c1d", 800: "#11142b", 700: "#1a1e3d", 600: "#262b52" },
        neon: { cyan: "#22e4ff", pink: "#ff3ea5", lime: "#b6ff3b", violet: "#8b5cff", amber: "#ffb020" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(34,228,255,.35)",
        glowpink: "0 0 24px rgba(255,62,165,.35)",
      },
      keyframes: {
        scan: { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(100%)" } },
        pulseglow: { "0%,100%": { opacity: ".55" }, "50%": { opacity: "1" } },
      },
      animation: { scan: "scan 6s linear infinite", pulseglow: "pulseglow 2.4s ease-in-out infinite" },
    },
  },
  plugins: [],
} satisfies Config;
