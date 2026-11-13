import nextVitals from "eslint-config-next/core-web-vitals";

const config = [{ ignores: ["public/assets/**"] }, ...nextVitals];

export default config;
