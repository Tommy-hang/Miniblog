import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const repository = process.env.GITHUB_REPOSITORY?.split("/")[1];
const owner = process.env.GITHUB_REPOSITORY_OWNER;
const isUserSite = repository === `${owner}.github.io`;

// Compatibility redirects from the old mirrored English pages.
const redirects = ["/en/", "/en/about/", "/en/writing/", "/en/projects/"];

export default defineConfig({
  site: process.env.SITE_URL ?? (owner ? `https://${owner}.github.io` : "https://example.com"),
  base: process.env.BASE_PATH ?? (repository && !isUserSite ? `/${repository}` : "/"),
  trailingSlash: "always",
  markdown: {
    // Shiki ships with Astro. Two themes, resolved entirely in CSS so the code
    // surface can match MiniBlog's warm palette instead of a foreign editor.
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        if (path.endsWith("/404/")) return false;
        return !redirects.some((redirect) => path.endsWith(redirect));
      },
    }),
  ],
});
