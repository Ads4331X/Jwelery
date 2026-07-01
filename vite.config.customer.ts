import { defineConfig } from "vite";
import baseConfig from "./vite.config";

export default defineConfig({
  ...baseConfig,
  server: {
    ...(baseConfig.server ?? {}),
    port: 5174,
  },
});
