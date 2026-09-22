# MiniBlog

> **Simple, not crude. Minimal, not empty. Quiet, but memorable.**

[在线阅读](https://tommy-hang.github.io/Miniblog/) · [English Version](#english-version) · [源代码](https://github.com/Tommy-hang/Miniblog)

MiniBlog 是一个使用 Astro 构建的现代个人博客，也是一次关于“优秀体验究竟需要多少复杂度”的长期实验。

它试图证明：一个网站不需要庞大的技术栈、复杂的交互系统或大量视觉特效，也可以拥有成熟的审美、清晰的个性和舒服的阅读体验。

---

## 为什么做 MiniBlog

个人博客经常走向两个极端。

一端不断增加功能和技术：动画、组件库、状态管理、后台系统、分析工具，以及越来越难以理解的工程结构。另一端则把“极简”理解为没有设计：默认字体、单一容器和几行未经组织的文字。

MiniBlog 想寻找第三条路：

> **用尽可能克制的技术复杂度，创造真正精致、完整且经得起时间的数字阅读体验。**

这里的简单不是少做，而是在充分思考之后，只保留真正有价值的部分。这里的设计也不是增加装饰，而是认真处理字体、比例、网格、留白、节奏、颜色与反馈。

最终希望读者打开网站时觉得：“这里很安静，但每一个细节都经过了设计。”开发者阅读源码后则会觉得：“原来一个完整的现代博客可以这么清楚。”

## 两条核心边界

MiniBlog 的所有判断都发生在两条边界之间。

### Complexity Budget

每一个依赖、组件、配置、抽象和脚本都会产生长期成本。新增它们之前，需要先回答：它创造的体验价值是否明显高于它引入的复杂度？

这条边界防止项目为了所谓“专业”而不断膨胀。

### Quality Floor

简化不能损害完整视觉层级、舒适排版、成熟响应式、交互反馈、可访问性和品牌辨识度。如果删除一段实现会让产品变得粗糙，就不应该继续删除。

这条边界防止项目以“极简”为理由变得简陋。

因此 MiniBlog 追求的不是 `Less Code = Better`，而是：

```text
Excellent Experience + Low Complexity = Better
```

## 设计思想

MiniBlog 的视觉方向是 **Editorial Minimalism × Quiet Interaction × Contemporary Digital Publishing**。

- **Typography first**：字体不是装饰，而是主要界面。
- **Editorial grid**：不同页面拥有不同密度，而不是把所有内容塞进同一个居中容器。
- **Quiet richness**：用细微的字号、对齐、边线、颜色和动作形成丰富性，而不是依靠特效。
- **Reading first**：越深入文章，界面越安静，正文始终是页面中心。
- **Responsive by design**：移动端重新组织信息层级，而不是简单压缩桌面布局。
- **Designed dark mode**：深色模式拥有自己的背景、文字和对比关系，而不是机械反色。

MiniBlog 主动避开卡片堆叠、Bento Grid、毛玻璃、紫蓝渐变、发光边框、SaaS Hero 和无目的动画。它希望更像一本独立数字杂志，而不是一个套用了流行模板的网站。

## 工程思想

MiniBlog 使用 Astro、TypeScript、Markdown、Content Collections 和原生 CSS。页面在构建阶段生成，最终站点不包含客户端 JavaScript。

- Astro 负责静态生成、路由、布局与内容组织；
- Markdown 让文章保持为普通、可迁移的文本文件；
- Content Collections 在构建阶段验证文章数据；
- 原生 CSS 直接表达视觉系统，没有额外样式抽象；
- RSS 和 Sitemap 使用 Astro 官方生态完成；
- GitHub Actions 以最小工作流部署到 GitHub Pages。

没有数据库、后台、CMS、前端框架、状态管理、UI 组件库或动画库，因为 Core V1 并不需要它们。

## Core V1

- 具有明确视觉身份的首页
- Editorial Writing Index
- Markdown 文章与静态动态路由
- 标题、列表、引用、代码、表格和图片排版
- 构建期阅读时间与文章 metadata
- About 与设计化 404 页面
- 响应式布局和系统深色模式
- Hover、Focus、Selection 等基础微交互
- Canonical、Open Graph 与 Twitter Card
- RSS、robots.txt 和 Sitemap
- GitHub Pages 自动部署
- 3 篇用于验证排版系统的示例文章

## 本地运行

需要 Node.js 22.12 或更新版本。

```bash
git clone https://github.com/Tommy-hang/Miniblog.git
cd Miniblog
npm install
npm run dev
```

生产检查与预览：

```bash
npm run build
npm run preview
```

## 写一篇文章

在 `src/content/writing/` 创建 Markdown 文件：

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

文件名会成为 URL。例如 `quiet-interfaces.md` 对应 `/writing/quiet-interfaces/`。设置 `draft: true` 可以让文章暂时不进入网站和 RSS。

## 修改身份与设计

在 `src/site.ts` 修改博客名称、作者、介绍、所在地、GitHub 链接和首页 Currently 内容。

`src/styles/global.css` 顶部包含颜色、字体、间距和动效曲线等 Design Tokens。品牌资产位于 `public/favicon.svg` 与 `public/social-card.svg`。

## 部署到 GitHub Pages

仓库已经包含 `.github/workflows/deploy.yml`。

1. 打开仓库的 **Settings → Pages**。
2. 在 **Build and deployment** 中选择 **GitHub Actions**。
3. 向 `main` 分支推送代码，或在 Actions 页面手动运行工作流。

配置会自动识别用户站点与普通项目站点，并处理 GitHub Pages 子路径。

## 项目结构

```text
public/                     静态品牌与文章资源
src/
├── components/             Header、Footer 和文章索引
├── content/writing/        Markdown 文章
├── layouts/                基础页面和文章布局
├── pages/                  页面路由、RSS 与 robots.txt
├── styles/global.css       完整视觉系统
├── content.config.ts       文章 Schema
└── site.ts                 博客身份信息
.github/workflows/          GitHub Pages 部署
astro.config.mjs            构建与部署路径配置
```

## 推荐阅读顺序

1. `src/pages/index.astro` — 页面如何组合。
2. `src/styles/global.css` — Design Tokens 如何形成视觉语言。
3. `src/layouts/BaseLayout.astro` — HTML 文档、SEO 和公共结构。
4. `src/components/ArticleList.astro` — 内容如何成为复用界面。
5. `src/content.config.ts` — Markdown 数据如何验证。
6. `src/pages/writing/[...slug].astro` — 文章如何生成静态页面。
7. `src/pages/rss.xml.ts` — 同一份内容如何成为 RSS。
8. `astro.config.mjs` — 构建与部署需要多少配置。

## 刻意没有实现什么

Core V1 没有搜索、评论、CMS、登录、数据库、Analytics、手动主题切换、Projects 或复杂标签系统。

这不意味着这些功能永远不应该存在。它意味着在真实需求出现之前，不提前支付它们的复杂度成本。

MiniBlog 既是一个可以直接写作的博客，也是一个可以逐文件理解的现代 Web 学习项目。未来每一次扩展仍会回到三个问题：它是否真正改善体验？能否用更简单的方法实现？简化以后，是否依然漂亮、舒服并且完整？

## 开源许可与作者

MiniBlog 由 **张文曜（Tommy-hang）** 创建并维护。为了区分软件复用与内容传播，仓库采用双层许可：

- 程序代码、组件、样式和配置使用 [MIT License](LICENSE)。你可以自由使用、修改、分发和用于商业项目，但必须保留原版权与许可声明。
- 原创文章、说明文字和视觉内容使用 [CC BY 4.0](LICENSE-CONTENT.md)。你可以分享和改编，包括商业用途，但必须署名、提供许可证链接，并说明是否做过修改。

第三方内容若另有版权或许可声明，以其各自声明为准。

---

<a id="english-version"></a>

# MiniBlog — English Version

> **Beautiful by design. Simple by engineering.**

[Live site](https://tommy-hang.github.io/Miniblog/) · [Source](https://github.com/Tommy-hang/Miniblog) · [中文](#miniblog)

MiniBlog is a modern personal publication built with Astro and a long-term experiment around one question:

> **How little technical complexity does an excellent digital reading experience actually require?**

It is not an attempt to build the smallest possible website. It is an attempt to build a complete, refined, and memorable website whose implementation remains surprisingly easy to understand.

## Why MiniBlog exists

Personal websites often drift toward one of two extremes.

Some accumulate frameworks, dependencies, dashboards, effects, and abstractions until publishing an article requires understanding an entire software platform. Others mistake minimalism for the absence of design: default typography, one centered column, and little attention to hierarchy or rhythm.

MiniBlog explores a more demanding middle path:

> **Create a mature and lasting reading experience with deliberately restrained technical complexity.**

Simplicity here does not mean doing less thinking. It means making many careful decisions, then keeping only what meaningfully improves the result. Design is not decoration; it lives in typography, proportion, grid, spacing, color, rhythm, and feedback.

## Two governing constraints

### Complexity Budget

Every dependency, component, configuration file, abstraction, and script has a long-term cost. Before adding one, MiniBlog asks whether the experience it creates is clearly worth the complexity it introduces.

This prevents the system from expanding merely to look “professional.”

### Quality Floor

Simplification must never remove visual hierarchy, comfortable typography, responsive behavior, interaction feedback, accessibility, or identity. If deleting implementation makes the product feel crude, simplification has gone too far.

This prevents minimalism from becoming an excuse for unfinished design.

```text
Excellent Experience + Low Complexity = Better
```

## Design principles

The visual direction combines **Editorial Minimalism, Quiet Interaction, and Contemporary Digital Publishing**.

- **Typography first** — type is the primary interface, not decoration.
- **Editorial grid** — pages use different densities instead of repeating one centered container.
- **Quiet richness** — subtle scales, alignment, rules, color, and motion create depth without demanding attention.
- **Reading first** — the interface becomes quieter as the reader moves deeper into an article.
- **Responsive by design** — mobile reorganizes hierarchy instead of merely shrinking desktop layouts.
- **A designed dark mode** — backgrounds, muted text, borders, code, and accent colors work as a system.

The project deliberately avoids card grids, glassmorphism, glowing borders, generic SaaS heroes, and spectacle-driven animation. It should feel closer to an independent digital magazine than a fashionable template.

## Engineering principles

MiniBlog uses Astro, TypeScript, Markdown, Content Collections, and modern CSS. Pages are generated at build time, and the final site ships no client-side JavaScript.

- Astro handles static generation, routing, layouts, and content.
- Markdown keeps writing portable and ordinary.
- Content Collections validate metadata during the build.
- Native CSS expresses the visual system without another abstraction layer.
- Official Astro integrations generate RSS and the sitemap.
- A small GitHub Actions workflow deploys the site to GitHub Pages.

There is no database, backend, CMS, client framework, state manager, UI library, or animation dependency because Core V1 has no real need for them.

## What Core V1 includes

- An identity-led editorial homepage
- A complete writing index
- Markdown articles with static dynamic routes
- Designed typography for headings, lists, quotes, code, tables, and images
- Build-time reading time and metadata
- About and custom 404 pages
- Responsive layouts and system dark mode
- Hover, focus, selection, and link feedback
- Canonical URLs, Open Graph, and Twitter cards
- RSS, robots.txt, and sitemap
- Automated GitHub Pages deployment
- Three example essays that exercise the typography system

## Run locally

Node.js 22.12 or newer is required.

```bash
git clone https://github.com/Tommy-hang/Miniblog.git
cd Miniblog
npm install
npm run dev
```

Validate and preview the production build with:

```bash
npm run build
npm run preview
```

## Write an article

Create a Markdown file inside `src/content/writing/`:

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

The filename becomes the URL. Add `draft: true` to exclude an article from the site and RSS feed.

## Customize and deploy

Edit `src/site.ts` to change the publication identity. The tokens at the top of `src/styles/global.css` control color, typography, spacing, and motion.

To deploy, open **Settings → Pages**, choose **GitHub Actions**, and push to `main`. The included workflow handles the rest.

## Learn the project

Read the source in this order:

1. `src/pages/index.astro`
2. `src/styles/global.css`
3. `src/layouts/BaseLayout.astro`
4. `src/components/ArticleList.astro`
5. `src/content.config.ts`
6. `src/pages/writing/[...slug].astro`
7. `src/pages/rss.xml.ts`
8. `astro.config.mjs`

## What is intentionally absent

Core V1 does not include search, comments, a CMS, authentication, a database, analytics, a manual theme switcher, projects, or a complex tag system. These features are not forbidden; they simply have not earned their complexity yet.

MiniBlog believes that excellent engineering does not make complexity impressive—it makes complexity disappear behind a thoughtful experience.

## License and author

MiniBlog is created and maintained by **张文曜 (Tommy-hang)**. The repository uses two licenses so that software reuse and editorial reuse remain unambiguous:

- Source code, components, styles, and configuration are available under the [MIT License](LICENSE). You may use, modify, distribute, and use them commercially as long as the copyright and license notice are preserved.
- Original articles, written copy, and visual content are available under [CC BY 4.0](LICENSE-CONTENT.md). You may share and adapt them, including commercially, with appropriate credit, a license link, and an indication of changes.

Third-party material remains subject to its own copyright and license notices.

---

**Simple, not crude. Minimal, not empty. Quiet, but memorable.**