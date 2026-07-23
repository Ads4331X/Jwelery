import { defineConfig } from "vite";
import baseConfig from "./vite.config";

const CUSTOMER_PORT = process.env.VITE_CUSTOMER_PORT
  ? parseInt(process.env.VITE_CUSTOMER_PORT, 10)
  : 5173;

export default defineConfig({
  ...baseConfig,
  server: {
    ...(baseConfig.server ?? {}),
    port: CUSTOMER_PORT,
  },
});
