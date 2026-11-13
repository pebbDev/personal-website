import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--foreground)",
        canvas: "var(--background)",
        muted: "var(--muted)",
        outline: "var(--border)",
      },
      maxWidth: {
        site: "1120px",
      },
    },
  },
  plugins: [],
};

export default config;
