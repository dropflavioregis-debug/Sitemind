import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pitch: {
          blue: "#2563eb",
          muted: "#64748b",
        },
      },
    },
  },
  plugins: [],
};
export default config;
