import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#181c26",
        canvas: "#ffffff",
        muted: "#667085",
        outline: "#e6e9f0",
      },
      maxWidth: {
        site: "1120px",
      },
    },
  },
  plugins: [],
};

export default config;
