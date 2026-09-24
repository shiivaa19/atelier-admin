import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          bg: "#0E0E10",
          surface: "#16161A",
          card: "#1C1C21",
          hover: "#232329",
          border: "#2A2A2E",
          gold: "#C9A961",
          goldHover: "#D4B76E",
          goldMuted: "#8C743E",
          goldLight: "rgba(201, 169, 97, 0.12)",
          text: "#F5F1E8",
          subtext: "#A1A1AA",
          muted: "#71717A",
        },
        // Light mode variant tokens
        ivory: {
          bg: "#FAF8F5",
          surface: "#FFFFFF",
          card: "#F5F2EC",
          border: "#E2DDD3",
          text: "#18181B",
          subtext: "#52525B",
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "Manrope", "system-ui", "sans-serif"],
      },
      boxShadow: {
        gold: "0 0 20px -5px rgba(201, 169, 97, 0.25)",
        luxury: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        toastIn: {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s infinite",
        fadeIn: "fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        toastIn: "toastIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
