import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 50px rgba(124, 58, 237, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
