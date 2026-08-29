import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08080a",
        foreground: "#ededed",
        card: "#0f0f14",
        "card-border": "#1f1f2e",
        // Primary Light Orange / Amber Palette
        brand: {
          50: "#fff8f0",
          100: "#ffeed9",
          200: "#ffd9b0",
          300: "#ffbe7d",
          400: "#ffa44a",
          500: "#ff881a", // Signature vibrant light orange
          600: "#ea6e05",
          700: "#c25103",
          800: "#9a3f0a",
          900: "#7c350c",
        },
        // Secondary Electric Purple Palette
        purple: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7", // Signature electric purple
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        'glow-orange': '0 0 30px -5px rgba(255, 136, 26, 0.45)',
        'glow-orange-sm': '0 0 15px -3px rgba(255, 136, 26, 0.35)',
        'glow-purple': '0 0 30px -5px rgba(168, 85, 247, 0.45)',
        'glow-purple-sm': '0 0 15px -3px rgba(168, 85, 247, 0.35)',
        'glow-hybrid': '0 0 35px -5px rgba(255, 136, 26, 0.25), 0 0 35px -5px rgba(168, 85, 247, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
