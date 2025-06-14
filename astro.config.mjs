// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "static",
  publicDir: "./public",
  outDir: "./dist",
  build: {
    assets: "assets",
  },
});
