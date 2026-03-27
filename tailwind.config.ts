import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fomo: {
          bg: "#0a0a0f",
          card: "#111118",
          border: "#1a1a25",
          amber: "#f59e0b",
          yellow: "#eab308",
          muted: "#6b7280",
        },
      },
      animation: {
        pulse_urgent: "pulse_urgent 1s ease-in-out infinite",
        countdown: "countdown 1s linear infinite",
      },
      keyframes: {
        pulse_urgent: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
