# MiniBlog

> **Simple, not crude. Minimal, not empty. Quiet, but memorable.**

[在线阅读](https://tommy-hang.github.io/Miniblog/) · [English Version](#miniblog--english-version) · [源代码](https://github.com/Tommy-hang/Miniblog)

MiniBlog 是一个使用 Astro 构建的现代个人出版物，也是一次关于“优秀体验究竟需要多少复杂度”的长期实验。

V1 建立了视觉与工程基础，V1.1 建立了内容基础。**V1.2 — Editorial Cleanup** 做的是精修：修正错误的抽象、删除不必要的复杂度、让已有系统更完整。

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

## V1.2 包含什么

- **单一品牌页面**：只有一个首页 `/`、一个 `/writing/`、一个 `/projects/`、一个 `/about/`
- **内容路由保留语言前缀**：中文在 `/writing/<slug>/`，英文在 `/en/writing/<slug>/`；项目同理
- **混合语言归档**：Writing 与 Projects 归档同时按日期倒序展示两种语言的内容，并标注 `ZH` / `EN`
- **翻译对应**：同 slug 的 zh / en 内容自动互相关联；详情页出现克制的语言链接，且只认已发布（非 draft）的翻译
- **内容包（Content Bundle）**：Markdown 与图片放在同一个文件夹里，构建期自动优化
- **中文与英文分别设计的排版**：中文放松字距、提高行高；英文保留更紧的 display tracking
- **图片三层层级**：普通图片、`wide` 宽图、`cover` 封面
- **项目在移动端的视觉标识**：桌面为 hover 浮动预览，触屏与窄屏为行内宽幅图片
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
npm run build   # 包含 astro check
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

## 修改身份与设计

- `src/site.ts` — 博客名称、作者、GitHub、所在地，以及首页 `Currently`（作者自己的话，可以用中文）。
- `src/i18n/ui.ts` — 只保存**随内容语言变化**的文案（如阅读时间、发布/更新、返回索引）。品牌界面文案直接写在组件里，固定英文。
- `src/styles/global.css` 顶部 — 颜色、字体、间距、动效曲线等 Design Tokens。`:lang(zh)` 段落是中文排版规则。
- `public/favicon.svg` 与 `public/social-card.svg` — 品牌资产。

## 项目结构

```text
public/                     静态品牌资产
src/
├── components/             Header、Footer、ArticleList、ProjectList
├── content/
│   ├── writing/            zh/ 与 en/ 下的文章 Content Bundle
│   └── projects/           zh/ 与 en/ 下的项目 Content Bundle
├── i18n/ui.ts              仅内容级文案 + 语言类型
├── lib/content.ts          locale/slug/过滤/排序/阅读时间/翻译匹配
├── layouts/                BaseLayout 与 ArticleLayout（文章和项目共用）
├── pages/                  单一品牌页面 + 语言前缀的内容详情页、RSS、重定向
├── styles/global.css       完整视觉系统（含中文排版规则）
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
/rss.xml                 中文 RSS
/en/rss.xml              English RSS
/en/  /en/about/  /en/writing/  /en/projects/
                         旧镜像 URL，静态重定向到对应品牌页面
```

## 推荐阅读顺序

1. `src/content.config.ts` — 内容模型如何定义
2. `src/lib/content.ts` — 目录如何变成 locale、slug、阅读时间，draft 如何过滤
3. `src/i18n/ui.ts` — 为什么只有内容级文案需要语言
4. `src/pages/writing/[slug].astro` — 内容如何变成页面
5. `src/layouts/ArticleLayout.astro` — 文章与项目如何共享一个版式
6. `src/styles/global.css` — 视觉系统（重点看 `:lang(zh)` 规则）
7. `src/pages/rss.xml.ts` — 同一份内容如何成为 RSS
8. `astro.config.mjs` — 构建与部署需要多少配置

## 部署到 GitHub Pages

仓库已经包含 `.github/workflows/deploy.yml`。

1. 打开仓库的 **Settings → Pages**。
2. 在 **Build and deployment** 中选择 **GitHub Actions**。
3. 向 `main` 分支推送代码，或在 Actions 页面手动运行工作流。

配置会自动识别用户站点与普通项目站点，并处理 GitHub Pages 子路径。

## 刻意没有实现什么

V1.2 没有搜索、评论、CMS、登录、数据库、Analytics、AI 助手、标签页、Series、相关文章算法、摄影画廊、Lightbox、前端框架、Tailwind 或动画库。中文与英文都使用高质量系统字体栈，没有引入任何 Web Font。

这不意味着这些功能永远不应该存在。它意味着在真实需求出现之前，不提前支付它们的复杂度成本。

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

V1 built the visual and engineering foundation, V1.1 built the content foundation. **V1.2 — Editorial Cleanup** refines both: it fixes incorrect abstractions, removes unnecessary complexity, and makes the existing system feel intentional.

## Brand Language ≠ Content Language

This is the central idea of V1.2, and a constraint for every future version.

**The interface has a voice; the content has a language.**

- **The brand and interface are fixed English.** Navigation (`Writing` / `Projects` / `About`), the homepage (`Thinking in public.`, `Selected Writing`, `Currently`), the footer, and the 404 page are always English — even while you read a Chinese article. That is intentional, not a missing translation.
- **Content may be Chinese, English, or a translation pair.** The homepage and the Writing / Projects archives show both languages together, marked `ZH` / `EN`.
- **Language switching belongs to content detail only.** A quiet `EN` or `中文` link appears only when a *published* counterpart actually exists. Otherwise nothing is shown — no disabled state, no placeholder.

So MiniBlog is not two mirrored sites. It is one publication with an English editorial shell and multilingual content.

## What V1.2 includes

- **One set of brand pages**: a single `/`, `/writing/`, `/projects/`, and `/about/`
- **Language-prefixed content routes**: Chinese at `/writing/<slug>/`, English at `/en/writing/<slug>/`; the same for projects
- **Mixed-language archives**: Writing and Projects list both languages by date, labelled `ZH` / `EN`
- **Translation pairing** by matching slug, with a restrained detail-page link that only trusts published translations
- **Content bundles**: Markdown and images live together and are optimized at build time
- **Typography designed separately** for Chinese and English
- **Three image levels**: default, `wide`, and `cover`
- **A real mobile identity for Projects**: a floating hover preview on pointer devices, an inline wide strip on touch and narrow screens
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

Validate and preview the production build with `npm run build` (includes `astro check`) and `npm run preview`.

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

## Customize and deploy

- `src/site.ts` — publication identity and the homepage `Currently` list (in any content language).
- `src/i18n/ui.ts` — only the strings that follow the content language; brand copy is fixed English in the components.
- `src/styles/global.css` — design tokens; the `:lang(zh)` block holds the Chinese typography rules.

To deploy, open **Settings → Pages**, choose **GitHub Actions**, and push to `main`. The included workflow handles base paths for both user sites and project sites.

## What is intentionally absent

No search, comments, CMS, authentication, database, analytics, AI assistant, tag pages, series, related-post algorithms, photography gallery, lightbox, client framework, Tailwind, or animation library. Both Chinese and English render with high-quality system stacks — no web font downloads.

These features are not forbidden; they simply have not earned their complexity yet.

## License and author

MiniBlog is created and maintained by **张文曜 (Tommy-hang)**.

- Source code, components, styles, and configuration are available under the [MIT License](LICENSE).
- Original articles, written copy, and visual content are available under [CC BY 4.0](LICENSE-CONTENT.md).

---

**Simple, not crude. Minimal, not empty. Quiet, but memorable.**
