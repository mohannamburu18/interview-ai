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
        background: "#0a0a0a",
        foreground: "#ededed",
        card: "#111111",
        "card-border": "#222222",
        parakeet: {
          50: "#e6fff4",
          100: "#b3ffe0",
          400: "#33ffaa",
          500: "#00ff88", // Parakeet signature bright emerald green
          600: "#00cc6c",
          700: "#009951",
          900: "#004d29",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        'glow-green': '0 0 25px -5px rgba(0, 255, 136, 0.4)',
        'glow-green-sm': '0 0 15px -3px rgba(0, 255, 136, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;

