import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#070A12",
        muted: "#5E6575",
        line: "#E6EAF0",
        cloud: "#F7F9FC",
        blue: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          500: "#2563EB",
          600: "#1D4ED8",
          700: "#1E40AF"
        }
      },
      boxShadow: {
        soft: "0 24px 80px rgba(7, 10, 18, 0.08)",
        card: "0 1px 2px rgba(7, 10, 18, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
