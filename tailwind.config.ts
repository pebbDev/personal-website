import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "selector",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--foreground)",
        canvas: "var(--background)",
        muted: "var(--muted)",
        outline: "var(--border)",
      },
      fontFamily: {
        body: ["Inter", "system-ui", "sans-serif"],
        sub: ["Fustat", "Inter", "system-ui", "sans-serif"],
        display: ["Ortica", "Instrument Serif", "Georgia", "serif"],
      },
      maxWidth: {
        site: "1120px",
      },
    },
  },
  plugins: [],
};

export default config;
