import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        primary: {
          DEFAULT: "#1A56E8",
          foreground: "#FFFFFF"
        }
      },
      boxShadow: {
        soft: "0 18px 60px rgba(10, 10, 10, 0.08)",
        deep: "0 24px 80px rgba(10, 10, 10, 0.14)"
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        cursor: {
          "0%, 45%": { opacity: "1" },
          "46%, 100%": { opacity: "0" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        }
      },
      animation: {
        shimmer: "shimmer 1.8s ease-in-out infinite",
        cursor: "cursor 1s step-end infinite",
        float: "float 6s ease-in-out infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
