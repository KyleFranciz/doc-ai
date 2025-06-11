// tailwind.config.ts
import type { Config } from "tailwindcss";
import plugin from "tailwind-scrollbar";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust to your file paths
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin, // tailwind-scrollbar plugin
  ],
};

export default config;
