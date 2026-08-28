/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
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
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        'glow-green': '0 0 20px -3px rgba(0, 255, 136, 0.4)',
        'glow-green-sm': '0 0 10px -2px rgba(0, 255, 136, 0.3)',
      },
    },
  },
  plugins: [],
}

