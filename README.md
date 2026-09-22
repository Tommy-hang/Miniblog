# MiniBlog

[Live site](https://tommy-hang.github.io/Miniblog/) · [Source](https://github.com/Tommy-hang/Miniblog)

MiniBlog is a small, complete personal publication built with Astro. Its aim is not to remove design, but to deliver a refined reading experience with very little implementation complexity.

The site is statically generated, works without client-side JavaScript, follows the system color scheme, and includes responsive layouts, Markdown content, RSS, sitemap, SEO metadata, and a GitHub Pages workflow.

## Run locally

Install [Node.js](https://nodejs.org/) 22.12 or newer, then run:

```sh
npm install
npm run dev
```

Astro will print the local address. Use `npm run build` for the same production validation used before deployment, and `npm run preview` to inspect the built site.

## Write an article

Create a Markdown file in `src/content/writing/`:

```md
---
title: "A clear title"
description: "One sentence that explains the article."
date: 2026-09-22
tags:
  - Design
---

Start writing here.
```

The filename becomes the URL. For example, `quiet-interfaces.md` becomes `/writing/quiet-interfaces/`. Set `draft: true` to keep an article out of the generated site.

## Customize

Edit `src/site.ts` to change the publication name, introduction, author, location, contact links, and “currently” notes. This is the only file containing identity information.

The main visual decisions live at the top of `src/styles/global.css`. Change the color, spacing, and font tokens there; the rest of the site inherits them. The default font stacks require no font download.

Replace `public/favicon.svg` and `public/social-card.svg` if you want custom brand artwork.

## Deploy to GitHub Pages

1. Create a GitHub repository and push the project to its `main` branch.
2. In **Settings → Pages**, select **GitHub Actions** as the source.
3. Push to `main`, or run the “Deploy to GitHub Pages” workflow manually.

The Astro configuration reads GitHub’s repository environment automatically. It supports both `owner.github.io` repositories and project sites such as `owner.github.io/miniblog/`, including their asset and navigation paths.

For another host or a custom domain, set `SITE_URL` during the build. Set `BASE_PATH` too if the site lives below a path prefix.

## Structure

```text
public/                   Static brand and article assets
src/
├── components/           Header, footer, and shared article index
├── content/writing/      Markdown articles
├── layouts/              Shared document and article structure
├── pages/                File-based routes, RSS, and robots.txt
├── styles/global.css     Complete visual system
├── content.config.ts     Article schema
└── site.ts               Publication identity
.github/workflows/        GitHub Pages deployment
astro.config.mjs          Astro, sitemap, and deployment paths
```

## Suggested learning path

1. `src/pages/index.astro` — see how a page is composed.
2. `src/styles/global.css` — follow the design system from tokens to responsive rules.
3. `src/layouts/BaseLayout.astro` — understand the HTML document, SEO, and shared shell.
4. `src/components/ArticleList.astro` — see typed content rendered as reusable UI.
5. `src/content.config.ts` — understand content validation.
6. `src/pages/writing/[...slug].astro` — see static article routes and Markdown rendering.
7. `src/pages/rss.xml.ts` — see the same content become an open-web feed.
8. `astro.config.mjs` — understand the small amount of build and deployment configuration.

## Design philosophy

MiniBlog works between two constraints: a **Complexity Budget** prevents implementation from expanding without value, while a **Quality Floor** protects typography, responsive behavior, accessibility, interaction, and visual identity from being simplified away. The result should feel like an independent digital publication whose implementation happens to be easy to understand.
