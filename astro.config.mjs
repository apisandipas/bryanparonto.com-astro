import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://bryanparonto.com",
  trailingSlash: "ignore",
  integrations: [sitemap()],
});
