import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.tsx", "./components/**/*.tsx"],
  theme: { extend: {
    colors: { japa: { black: "#0a0a0a", card: "#141414", graphite: "#1c1c1e", wine: "#3a0d14", orange: "#ff6a00", gold: "#ffc21a", red: "#e11d2e" } },
    fontFamily: { display: ["var(--font-display)", "Impact", "sans-serif"], sans: ["var(--font-body)", "system-ui", "sans-serif"] },
  } },
  plugins: [],
} satisfies Config;
