# MiniBlog

> **Simple, not crude. Minimal, not empty. Quiet, but memorable.**

[在线阅读](https://tommy-hang.github.io/Miniblog/) · [English Version](#miniblog--english-version) · [源代码](https://github.com/Tommy-hang/Miniblog)

MiniBlog 是一个使用 Astro 构建的现代个人出版物，也是一次关于“优秀体验究竟需要多少复杂度”的长期实验。

V1 建立了视觉与工程基础，V1.1 建立了内容基础，V1.2 清理了语言模型与复杂度，V1.3 让文章本身值得认真坐下来阅读。**V1.4 — Discovery & Archive** 解决下一件事：当内容越来越多，人是否还能理解这里有什么，并找到感兴趣的部分。

```text
Code defines the publishing system.
Content fills the publishing system.
```

日常维护 MiniBlog 不需要编辑任何 Astro 页面、组件或 CSS。工作流只有四步：

```text
新建内容文件夹 → 写 Markdown → 放入图片 → git commit / push
```

---

## 核心语言模型：Brand Language ≠ Content Language

这是 V1.2 最重要的原则，也是未来版本的约束。

**界面有它的声音；内容有它的语言。**

- **品牌语言 / 界面语言固定为 English。** 导航（`Writing` / `Projects` / `About`）、首页文案（`Thinking in public.`、`Selected Writing`、`Currently`）、页脚、404 永远是英文，即使你正在读一篇中文文章。这不是翻译遗漏，而是有意的设计。
- **内容语言可以是中文、English，或一对互译版本。** 首页、Writing 归档、Projects 归档可以同时出现中文与英文内容，用 `ZH` / `EN` 标记语言。
- **语言切换只属于内容详情页。** 只有当一篇内容真的存在已发布的另一种语言版本时，文章/项目页才会出现一个克制的 `EN` 或 `中文` 链接。不存在就不显示——没有灰掉的按钮，没有 placeholder。

因此 MiniBlog 不是“中文站 + English 站”两个镜像网站，而是：

```text
ONE BRAND              English editorial interface
+
MULTILINGUAL CONTENT   Chinese / English
+
TWO CONTENT TYPES      Writing / Projects
+
LOCAL MEDIA            Markdown + images
+
STATIC SYSTEM          Astro
```

## V1.4 包含什么

- **Writing 本身就是 Archive**：`/writing/` 自动按 **年 → 月** 分组，由真实 `date` 生成，新增文章自动进入正确的年份与月份
- **时间是第一发现轴**：Archive 永远按发布日期排序，`featured` 只影响首页
- **标签是第二发现轴**：`tags` 变成真正可点击的导航，汇聚成 `/tags/<tag>/` 页面
- **受控标签词表**：标签在 `src/lib/tags.ts` 注册，拼错会在构建期直接报错，不会静默生成 `/tags/contorl/`
- **跨内容类型**：同一个标签页可以同时展示 Writing 与 Projects
- **Editorial Prose System**：一套共享的阅读排版系统，Writing 与 Projects 复用同一套正文
- **三层宽度**：阅读列（`--measure-reading`）、宽媒体（`--measure-wide`）、封面（`--measure-hero`）
- **真正的阅读节奏**：段落之间紧凑，章节、图片与分隔线之间留出呼吸
- **克制的标题层级**：H2 是章节，不再像第二个 Hero；H3 是局部小节
- **媒体层级**：普通图片、`wide` 宽图、`cover` 封面，以及图片下方的 caption
- **代码与主题一体**：Shiki 静态高亮，light / dark 双主题，落在 MiniBlog 自己的暖色表面上
- **表格**：桌面为编辑式表格，窄屏自动横向滚动，不会撑破页面
- **脚注**：原生 Markdown 脚注，低调的引用编号与回链
- **中文与英文分别设计的排版**：中文放松字距、提高行高；英文保留更紧的 display tracking
- **单一品牌页面**：只有一个首页 `/`、一个 `/writing/`、一个 `/projects/`、一个 `/about/`
- **内容路由保留语言前缀**：中文在 `/writing/<slug>/`，英文在 `/en/writing/<slug>/`；项目同理
- **混合语言归档**：Writing 与 Projects 归档同时按日期倒序展示两种语言的内容，并标注 `ZH` / `EN`
- **翻译对应**：同 slug 的 zh / en 内容自动互相关联；详情页出现克制的语言链接，且只认已发布（非 draft）的翻译
- **内容包（Content Bundle）**：Markdown 与图片放在同一个文件夹里，构建期自动优化
- **内容驱动首页**：`featured: true` 自动进入精选区域，无精选时回退到最新内容
- 构建期阅读时间（中文按字数、英文按词数）、双语 RSS、draft 过滤、Sitemap、完整 SEO
- **零客户端 JavaScript**，**没有新增任何依赖**

---

## 快速开始

需要 Node.js 22.12 或更新版本。

```bash
git clone https://github.com/Tommy-hang/Miniblog.git
cd Miniblog
npm install
npm run dev
```

生产检查与预览：

```bash
npm run check    # astro check（类型与内容 schema）
npm run build    # 包含 astro check，并生成静态站点
npm run preview
```

---

## 内容工作流

### 发布一篇中文文章

在 `src/content/writing/zh/` 下新建一个文件夹，文件夹名就是 URL：

```text
src/content/writing/zh/my-new-post/
├── index.md
└── cover.webp        # 可选
```

`index.md` 的 frontmatter：

```yaml
---
title: "一个清楚的标题"
description: "一句话说明这篇文章。"
date: 2026-09-22
tags:
  - Design
---
```

push 后文章自动出现在 `/writing/my-new-post/`，同时进入 `/writing/` 索引、`/rss.xml` 和 Sitemap。不需要修改任何代码。

### 发布一篇 English article

在 `src/content/writing/en/my-new-post/` 创建 `index.md`。文章自动出现在 `/en/writing/my-new-post/`，阅读时间与日期按英文计算。它会和中文文章一起出现在同一个 `/writing/` 归档里。

### 添加图片

把图片放进文章文件夹，在 Markdown 里相对引用：

```md
![清楚、有意义的 alt 文本](./diagram.webp)
```

图片在构建期自动优化（响应式、懒加载、防布局跳动），并正确适配 GitHub Pages 子路径。

想要一张轻微突破正文列宽的图片，加上 `"wide"`：

```md
![宽图](./diagram.webp "wide")
```

封面用 frontmatter 的 `cover`：

```yaml
cover: ./cover.webp
```

### 创建翻译版本

在另一种语言目录下使用**相同的文件夹名**：

```text
src/content/writing/zh/attention/
src/content/writing/en/attention/
```

两个版本自动识别为翻译对应关系。详情页会出现克制的语言链接（中文文章显示 `EN`，英文文章显示 `中文`），并输出正确的 hreflang。**只有对应版本已发布时才显示**：如果英文版仍是 `draft: true`，中文文章不会显示 `EN` 链接。只有单语版本也完全没问题。

### 发布一个项目

在 `src/content/projects/zh/<slug>/` 创建内容包：

```yaml
---
title: "MiniBlog"
description: "一次关于低复杂度数字出版的实验。"
date: 2026-09-22
tags:
  - Web
  - Design
status: active        # 可选
featured: true        # 可选，进入首页精选
cover: ./cover.webp   # 可选
repo: https://github.com/...   # 可选
demo: https://...              # 可选
---
```

正文自由使用 Markdown，不需要固定的 Problem / Solution / Result 结构。项目自动进入 `/projects/` 索引和 `/projects/<slug>/` 详情页。

### Draft

设置 `draft: true` 的内容不会进入索引、首页、RSS 和 Sitemap；开发环境（`npm run dev`）中仍可预览。

### Featured

设置 `featured: true` 的内容自动进入首页“精选”区域；多个精选按日期倒序；没有精选时首页优雅回退到最新内容。

---

## 写出更丰富的文章

文章仍然是普通 Markdown，日常写作不需要任何组件：

```md
## 一个章节

普通段落，可以包含 `inline code`、[链接](https://example.com) 和 **强调**。

![普通图片](./diagram.webp)
```

需要时，用很少的约定就能获得更丰富的呈现：

- **封面**：frontmatter 里写 `cover: ./cover.webp`，显示在标题下方、比正文更宽。
- **宽图**：给图片加 `"wide"`，轻微突破正文列宽 —— `![宽图](./diagram.webp "wide")`。
- **Caption**：在图片下一行写一条斜体说明，它会被渲染成图注：

  ```md
  ![流程图](./flow.webp)
  *图 1 — 数据如何流动。*
  ```

- **带细边框的图**：截图类图片用 `"frame"`，可与 `wide` 组合，如 `"wide frame"`。
- **脚注**：使用标准 Markdown 脚注语法 `[^1]`。
- **表格与代码**：直接写 Markdown 表格与围栏代码块即可，无需额外配置。

`wide` / `frame` 只是图片 title 里的关键字，可以自由组合。普通文章完全不使用它们，也已经足够漂亮。

---

## 标签与归档

Writing 归档会自动按 **年 → 月** 分组，全部来自 frontmatter 的 `date`，不需要改任何代码。你只需要给文章加标签：

```yaml
tags:
  - AI
  - Design
```

- 标签是**受控词表**，只能使用 `src/lib/tags.ts` 里注册过的名字。写错（例如 `Contorl`）会在 `npm run build` 时直接报错，而不是生成一个错误的 `/tags/contorl/`。
- 想新增一个标签，就在 `src/lib/tags.ts` 里加一行 `{ name: "Control", slug: "control" }`，之后内容就可以使用它。slug 一旦发布应保持稳定。
- 标签是跨内容类型的：同一篇文章和项目使用同一个标签，它们会出现在同一个 `/tags/<slug>/` 页面里。
- 一篇文章通常使用 **1–3 个** 标签。标签用于导航主题，不是 SEO 关键词。

Writing 页顶部的 `ALL / AI / DESIGN / …` 导航，以及每个 `/tags/<tag>/` 页面，都会根据真实内容自动生成；没有内容使用的标签不会生成页面。

---

## 修改身份与设计

- `src/site.ts` — 博客名称、作者、GitHub、所在地，以及首页 `Currently`（作者自己的话，可以用中文）。
- `src/i18n/ui.ts` — 只保存**随内容语言变化**的文案（如阅读时间、发布/更新、返回索引）。品牌界面文案直接写在组件里，固定英文。
- `src/styles/global.css` 顶部 — 颜色、字体、间距、动效曲线等 Design Tokens。`:lang(zh)` 段落是中文排版规则。
- `src/styles/prose.css` — Editorial Prose System：阅读宽度、标题层级、节奏、图片、代码、表格、脚注。
- `public/favicon.svg` 与 `public/social-card.svg` — 品牌资产。

## 项目结构

```text
public/                     静态品牌资产
src/
├── components/             Header、Footer、ArticleRow、ArticleList、ProjectList、WritingArchive、TagLinks
├── content/
│   ├── writing/            zh/ 与 en/ 下的文章 Content Bundle
│   └── projects/           zh/ 与 en/ 下的项目 Content Bundle
├── i18n/ui.ts              仅内容级文案 + 语言类型
├── lib/content.ts          locale/slug/过滤/排序/阅读时间/翻译匹配/年-月分组
├── lib/tags.ts             受控标签词表（name + slug）
├── layouts/                BaseLayout 与 ArticleLayout（文章和项目共用）
├── pages/                  品牌页面 + 语言前缀内容页 + /tags/<tag>/ + RSS + 重定向
├── styles/global.css       站点外观（tokens、布局、导航、首页、页脚）
├── styles/prose.css        Editorial Prose System（文章阅读与 Markdown 排版）
├── content.config.ts       writing / projects 两个 Collection 的 Schema
└── site.ts                 博客身份信息
.github/workflows/          GitHub Pages 部署
astro.config.mjs            构建、部署路径、Sitemap 过滤
```

### 路由一览

```text
/                        首页（品牌英文 + 中英混合内容）
/writing/                Writing 归档（中英混合）
/writing/<slug>/         中文文章
/en/writing/<slug>/      English article
/projects/               Projects 归档（中英混合）
/projects/<slug>/        中文项目
/en/projects/<slug>/     English project
/about/                  About（英文界面 + 中文正文）
/tags/<tag>/             标签页（自动生成，可同时含 Writing 与 Projects）
/rss.xml                 中文 RSS
/en/rss.xml              English RSS
/en/  /en/about/  /en/writing/  /en/projects/
                         旧镜像 URL，静态重定向到对应品牌页面
```

## 推荐阅读顺序

1. `src/content.config.ts` — 内容模型如何定义，标签如何在 schema 里被约束
2. `src/lib/content.ts` — 目录如何变成 locale、slug、阅读时间，以及年-月分组
3. `src/lib/tags.ts` — 受控标签词表
4. `src/i18n/ui.ts` — 为什么只有内容级文案需要语言
5. `src/pages/writing/index.astro` — Writing 如何成为按时间归档的 Archive
6. `src/pages/tags/[tag].astro` — 标签页如何自动生成
7. `src/layouts/ArticleLayout.astro` — 文章与项目如何共享一个版式
8. `src/styles/prose.css` — Editorial Prose System（文章阅读与 Markdown 排版）
9. `astro.config.mjs` — 构建与部署需要多少配置

## 部署到 GitHub Pages

仓库已经包含 `.github/workflows/deploy.yml`。

1. 打开仓库的 **Settings → Pages**。
2. 在 **Build and deployment** 中选择 **GitHub Actions**。
3. 向 `main` 分支推送代码，或在 Actions 页面手动运行工作流。

配置会自动识别用户站点与普通项目站点，并处理 GitHub Pages 子路径。

## 刻意没有实现什么

V1.4 没有搜索、评论、CMS、登录、数据库、Analytics、AI 助手、Series、相关文章算法、摄影画廊、Lightbox、前端框架、Tailwind、动画库或客户端语法高亮。中文与英文都使用高质量系统字体栈，没有引入任何 Web Font。

**搜索是有意推迟的**：当前规模下，年 / 月时间轴加上标签已经足够找到内容；只有当 Archive 真的难以浏览时，搜索才值得它的复杂度。Series、上一篇 / 下一篇、相关文章、目录也出于同样理由推迟。

## 开源许可与作者

MiniBlog 由 **张文曜（Tommy-hang）** 创建并维护。仓库采用双层许可：

- 程序代码、组件、样式和配置使用 [MIT License](LICENSE)。
- 原创文章、说明文字和视觉内容使用 [CC BY 4.0](LICENSE-CONTENT.md)。

---

<a id="miniblog--english-version"></a>

# MiniBlog — English Version

> **Beautiful by design. Simple by engineering.**

[Live site](https://tommy-hang.github.io/Miniblog/) · [Source](https://github.com/Tommy-hang/Miniblog) · [中文](#miniblog)

MiniBlog is a modern personal publication built with Astro and a long-term experiment around one question:

> **How little technical complexity does an excellent digital reading experience actually require?**

V1 built the visual and engineering foundation, V1.1 the content foundation, V1.2 cleaned up the language model, V1.3 made the article worth sitting down to read. **V1.4 — Discovery & Archive** answers the next question: as content grows, can a reader still understand what is here and find what interests them?

## Brand Language ≠ Content Language

This is the central idea of V1.2, and a constraint for every future version.

**The interface has a voice; the content has a language.**

- **The brand and interface are fixed English.** Navigation (`Writing` / `Projects` / `About`), the homepage (`Thinking in public.`, `Selected Writing`, `Currently`), the footer, and the 404 page are always English — even while you read a Chinese article. That is intentional, not a missing translation.
- **Content may be Chinese, English, or a translation pair.** The homepage and the Writing / Projects archives show both languages together, marked `ZH` / `EN`.
- **Language switching belongs to content detail only.** A quiet `EN` or `中文` link appears only when a *published* counterpart actually exists. Otherwise nothing is shown — no disabled state, no placeholder.

So MiniBlog is not two mirrored sites. It is one publication with an English editorial shell and multilingual content.

## What V1.4 includes

- **Writing is the archive**: `/writing/` groups itself by **year → month**, generated from the real `date` — new articles land in the right place with no code changes
- **Time is the first discovery axis**: the archive is always ordered by publication date; `featured` only affects the homepage
- **Tags are the second axis**: tags become real navigation that gathers into `/tags/<tag>/` pages
- **A controlled vocabulary**: tags are registered in `src/lib/tags.ts`, so a typo fails the build instead of silently creating `/tags/contorl/`
- **Cross-content discovery**: a single tag page can show both Writing and Projects
- **Editorial Prose System**: one shared reading system, reused by both Writing and Projects
- **Three structural widths**: reading (`--measure-reading`), wide media (`--measure-wide`), and cover (`--measure-hero`)
- **Real reading rhythm**: paragraphs stay tight, while chapters, media, and rules get breathing room
- **A restrained heading hierarchy**: H2 is a chapter, no longer a second hero; H3 is a local idea
- **A media hierarchy**: default image, `wide`, `cover`, and captions
- **Code that belongs to the theme**: static Shiki highlighting with light / dark themes on MiniBlog's own warm surface
- **Tables**: editorial on wide screens, horizontally scrollable on narrow ones — the page never overflows
- **Footnotes**: native Markdown footnotes with quiet references and backlinks
- **Typography designed separately** for Chinese and English
- **One set of brand pages**: a single `/`, `/writing/`, `/projects/`, and `/about/`
- **Language-prefixed content routes**: Chinese at `/writing/<slug>/`, English at `/en/writing/<slug>/`; the same for projects
- **Mixed-language archives**: Writing and Projects list both languages by date, labelled `ZH` / `EN`
- **Translation pairing** by matching slug, with a restrained detail-page link that only trusts published translations
- **Content bundles**: Markdown and images live together and are optimized at build time
- **Content-driven homepage**: `featured: true` drives the selected sections, falling back to the latest content
- Build-time reading time, bilingual RSS, draft filtering, sitemap, full SEO
- **Zero client-side JavaScript**, with **no new dependencies**

## Run locally

Node.js 22.12 or newer is required.

```bash
git clone https://github.com/Tommy-hang/Miniblog.git
cd Miniblog
npm install
npm run dev
```

Validate types and content schemas with `npm run check`, then build and preview with `npm run build` and `npm run preview`.

## Publish content

**Article (Chinese):** create `src/content/writing/zh/<slug>/index.md` (folder name = URL slug). **English:** same under `src/content/writing/en/`; it appears at `/en/writing/<slug>/` and joins the same `/writing/` archive. **Images:** put them in the same folder and reference them relatively — `![alt](./diagram.webp)`; add `"wide"` as the title for a wider image, or set `cover` in frontmatter. **Translation:** use the same folder slug under the other locale — the two pages link to each other, but only when both are published. **Project:** the same idea under `src/content/projects/<locale>/<slug>/` with optional `status`, `cover`, `repo`, and `demo` fields. **Draft:** `draft: true` (still previewable in dev). **Featured:** `featured: true`.

```yaml
---
title: "A clear title"
description: "One sentence that explains the article."
date: 2026-09-22
tags:
  - Design
---
```

## Writing rich articles

Articles are still plain Markdown, and everyday writing needs no components:

```md
## A section

A paragraph with `inline code`, a [link](https://example.com), and **emphasis**.

![A default image](./diagram.webp)
```

A few small conventions unlock richer presentation when you need it:

- **Cover**: set `cover: ./cover.webp` in frontmatter — it appears below the title, wider than the reading column.
- **Wide image**: add `"wide"` to break gently out of the reading column — `![Wide](./diagram.webp "wide")`.
- **Caption**: put an italic line directly after an image and it becomes the caption:

  ```md
  ![A diagram](./flow.webp)
  *Fig. 01 — How the data flows.*
  ```

- **Framed image**: add `"frame"` for screenshots, optionally combined — `"wide frame"`.
- **Footnotes**: standard Markdown `[^1]` syntax.
- **Tables and code**: plain Markdown tables and fenced code blocks, with no configuration.

`wide` / `frame` are just keywords in the image title and can be combined freely. Articles that never use them are already beautiful.

## Tags and the archive

The Writing archive groups itself by **year → month**, entirely from the frontmatter `date`, with no code changes. All you do is tag your content:

```yaml
tags:
  - AI
  - Design
```

- Tags are a **controlled vocabulary**: only names registered in `src/lib/tags.ts` are allowed. A typo (e.g. `Contorl`) fails `npm run build` instead of silently creating `/tags/contorl/`.
- To add a tag, add one line to `src/lib/tags.ts` — `{ name: "Control", slug: "control" }` — and content can use it. Once published, a slug should stay stable.
- Tags cross content types: the same tag on a writing piece and a project brings them together on one `/tags/<slug>/` page.
- Use **1–3 tags** per piece. Tags navigate topics; they are not SEO keywords.

The `ALL / AI / DESIGN / …` navigation on the Writing page and every `/tags/<tag>/` page are generated from real content; a tag with no published content produces no page.

## Customize and deploy

- `src/site.ts` — publication identity and the homepage `Currently` list (in any content language).
- `src/i18n/ui.ts` — only the strings that follow the content language; brand copy is fixed English in the components.
- `src/styles/global.css` — design tokens and site chrome; the `:lang(zh)` block holds the Chinese typography rules.
- `src/styles/prose.css` — the Editorial Prose System: reading width, heading hierarchy, rhythm, media, code, tables, and footnotes.

To deploy, open **Settings → Pages**, choose **GitHub Actions**, and push to `main`. The included workflow handles base paths for both user sites and project sites.

## What is intentionally absent

No search, comments, CMS, authentication, database, analytics, AI assistant, series, related-post algorithms, photography gallery, lightbox, client framework, Tailwind, or animation library. Both Chinese and English render with high-quality system stacks — no web font downloads.

Search is **intentionally deferred**: at the current scale, year/month plus tags are enough to find things, and search only earns its complexity once the archive is genuinely hard to browse. Series, previous/next, related posts, and a table of contents are deferred for the same reason.

## License and author

MiniBlog is created and maintained by **张文曜 (Tommy-hang)**.

- Source code, components, styles, and configuration are available under the [MIT License](LICENSE).
- Original articles, written copy, and visual content are available under [CC BY 4.0](LICENSE-CONTENT.md).

---

**Simple, not crude. Minimal, not empty. Quiet, but memorable.**
