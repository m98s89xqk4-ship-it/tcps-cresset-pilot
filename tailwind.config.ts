import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        tcps: {
          maroon: "#0B5D3B",
          gold: "#D7A83D",
          ink: "#141414",
          cream: "#FBF7EF"
        }
      },
      boxShadow: { card: "0 14px 34px rgba(20, 20, 20, 0.09)" }
    }
  },
  plugins: []
};

export default config;
