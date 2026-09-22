import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const repository = process.env.GITHUB_REPOSITORY?.split("/")[1];
const owner = process.env.GITHUB_REPOSITORY_OWNER;
const isUserSite = repository === `${owner}.github.io`;

export default defineConfig({
  site: process.env.SITE_URL ?? (owner ? `https://${owner}.github.io` : "https://example.com"),
  base: process.env.BASE_PATH ?? (repository && !isUserSite ? `/${repository}` : "/"),
  trailingSlash: "always",
  integrations: [sitemap({ filter: (page) => !page.endsWith("/404/") })],
});
