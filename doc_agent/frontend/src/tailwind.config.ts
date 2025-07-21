import type { Config } from "tailwindcss";
import scrollbar from "tailwind-scrollbar";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        instrumentSerif: ["'Instrument Serif'", "serif"],
      },
    },
  },
  plugins: [scrollbar],
};

export default config;
