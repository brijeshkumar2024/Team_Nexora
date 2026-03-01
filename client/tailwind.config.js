/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#050a17",
        midnight: "#0a1024",
        aurum: "#c99a3b",
        aurumSoft: "#f4d28f",
        smoke: "#98a2b3"
      },
      boxShadow: {
        glow: "0 0 24px rgba(201, 154, 59, 0.22)",
        card: "0 20px 60px rgba(0, 0, 0, 0.4)"
      },
      backgroundImage: {
        "gold-radial":
          "radial-gradient(circle at 20% 20%, rgba(201,154,59,0.16), transparent 42%), radial-gradient(circle at 80% 70%, rgba(201,154,59,0.08), transparent 35%)"
      },
      fontFamily: {
        sans: ["Sora", "Segoe UI", "Arial", "sans-serif"],
        display: ["Outfit", "Segoe UI", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};
