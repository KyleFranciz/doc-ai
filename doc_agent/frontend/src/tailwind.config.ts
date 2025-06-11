// tailwind.config.ts
import type { Config } from "tailwindcss";
import scrollbar from "tailwind-scrollbar";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust to your file paths
  ],
  theme: {
    extend: {},
  },
  plugins: [
    scrollbar, // tailwind-scrollbar plugin
  ],
};

export default config;
