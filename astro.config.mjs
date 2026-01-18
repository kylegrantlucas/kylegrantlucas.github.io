// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://kylelucas.io",
  output: "static",
  publicDir: "./public",
  outDir: "./dist",
  build: {
    assets: "assets",
  },
  prefetch: {
    prefetchAll: true,
  },
  integrations: [sitemap()],
});
