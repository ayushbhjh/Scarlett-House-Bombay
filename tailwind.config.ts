import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        scarlett: {
          black: "#0c0b0a",
          wine: "#2a0f14",
          ruby: "#6d1f2b",
          cream: "#f4ece1",
          gold: "#c9a25a"
        }
      },
      boxShadow: {
        glow: "0 20px 45px rgba(201, 162, 90, 0.18)"
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"]
      },
      backgroundImage: {
        noise: "radial-gradient(circle at 20% 20%, rgba(201, 162, 90, 0.11) 0%, transparent 40%), radial-gradient(circle at 80% 0%, rgba(109, 31, 43, 0.28) 0%, transparent 45%), linear-gradient(140deg, #0c0b0a 0%, #19110f 45%, #2a0f14 100%)"
      }
    }
  },
  plugins: []
};

export default config;
