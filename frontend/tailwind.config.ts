import type { Config } from 'tailwindcss';
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0B1220", light:"#162032" },
        gold: { DEFAULT: "#F5B800", dark:"#E6A800" }
      }
    }
  },
  plugins: []
};
export default config;
