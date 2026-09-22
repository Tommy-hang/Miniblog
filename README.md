# MiniBlog

> **Simple, not crude. Minimal, not empty. Quiet, but memorable.**

[在线阅读](https://tommy-hang.github.io/Miniblog/) · [English Version](#miniblog--english-version) · [源代码](https://github.com/Tommy-hang/Miniblog)

MiniBlog 是一个使用 Astro 构建的现代个人博客，也是一次关于“优秀体验究竟需要多少复杂度”的长期实验。

在 V1 证明“低复杂度的网站也可以拥有成熟的视觉品质”之后，**V1.1 — Content Foundation** 进一步证明：一个真正长期可维护的个人博客，可以让“内容”与“网站代码”彻底分离。

日常维护 MiniBlog 不需要编辑任何 Astro 页面、组件或 CSS。工作流只有四步：

```text
新建内容文件夹 → 写 Markdown → 放入图片 → git commit / push
```

网站会自动完成页面生成、索引、导航、metadata、RSS、Sitemap 等一切工作。

```text
Code defines the publishing system.
Content fills the publishing system.
```

---

## 为什么做 MiniBlog

个人博客经常走向两个极端。

一端不断增加功能和技术：动画、组件库、状态管理、后台系统、分析工具，以及越来越难以理解的工程结构。另一端则把“极简”理解为没有设计：默认字体、单一容器和几行未经组织的文字。

MiniBlog 想寻找第三条路：

> **用尽可能克制的技术复杂度，创造真正精致、完整且经得起时间的数字阅读体验。**

这里的简单不是少做，而是在充分思考之后，只保留真正有价值的部分。

## 两条核心边界

### Complexity Budget

每一个依赖、组件、配置、抽象和脚本都会产生长期成本。新增它们之前，需要先回答：它创造的体验价值是否明显高于它引入的复杂度？

### Quality Floor

简化不能损害完整视觉层级、舒适排版、成熟响应式、交互反馈、可访问性和品牌辨识度。如果删除一段实现会让产品变得粗糙，就不应该继续删除。

```text
Excellent Experience + Low Complexity = Better
```

## V1.1 — Content Foundation 包含什么

- **内容架构**：文章与项目都是自包含的内容包（Content Bundle），Markdown 与图片放在一起
- **双语言**：中文（默认，`/`）与 English（`/en/`），目录即语言，无需在 frontmatter 里声明
- **Projects 系统**：独立的项目内容库与 Selected Works 式索引页
- **媒体系统**：本地图片与内容同目录存放，构建期自动优化、响应式、防 CLS
- **中文排版**：为中文独立设计的字距、行高与节奏，不是英文模板换成中文
- **内容驱动首页**：`featured: true` 自动进入精选区域，无精选时优雅回退到最新内容
- 构建期阅读时间（中文按字数、英文按词数）与本地化日期
- 翻译对应：同 slug 的 zh/en 内容自动互相关联，提供克制的语言切换与 hreflang
- 双语 RSS（`/rss.xml` 中文、`/en/rss.xml` 英文）、draft 过滤、Sitemap、完整 SEO
- 仍然**零客户端 JavaScript**，没有新增任何依赖

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

push 后文章自动出现在 `/writing/my-new-post/`，同时进入索引、RSS 和 Sitemap。不需要修改任何代码。

### 发布一篇 English article

同样地，在 `src/content/writing/en/my-new-post/` 创建 `index.md`。网站自动生成 `/en/writing/my-new-post/`，界面、排版、日期和阅读时间全部为英文。

### 添加图片

把图片放进文章文件夹，在 Markdown 里相对引用：

```md
![清楚、有意义的 alt 文本](./diagram.webp)
```

图片会在构建期自动优化（响应式、懒加载、防布局跳动），并正确适配 GitHub Pages 的子路径。正文图片建议使用 WebP；示意图也可以使用 SVG。

### 创建翻译版本

在另一种语言目录下使用**相同的文件夹名**：

```text
src/content/writing/zh/attention/
src/content/writing/en/attention/
```

两个版本会自动识别为翻译对应关系：页面出现克制的语言切换入口，并输出正确的 hreflang alternate。只有中文或只有英文也完全没问题——不要求所有内容都是双语的。

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

正文自由使用 Markdown。项目自动进入 `/projects/` 索引和 `/projects/<slug>/` 详情页。

### Draft

设置 `draft: true` 的内容不会进入索引、首页和 RSS；开发环境（`npm run dev`）中仍可预览。

### Featured

设置 `featured: true` 的内容自动进入首页“精选文章 / 精选项目”区域；多个精选按日期倒序；没有精选时首页优雅回退到最新内容。

---

## 修改身份与设计

- `src/site.ts` — 博客名称、作者、GitHub、所在地与首页 Currently（中英文两版）。
- `src/i18n/ui.ts` — 全部界面文案的中英字典。
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
├── i18n/ui.ts              界面文案字典
├── lib/content.ts          locale/slug/过滤/排序/阅读时间/翻译匹配
├── layouts/                BaseLayout 与 ArticleLayout（文章和项目共用）
├── pages/                  页面路由（zh 根目录 + en/ 子目录）、RSS
├── styles/global.css       完整视觉系统（含中文排版规则）
├── content.config.ts       writing / projects 两个 Collection 的 Schema
└── site.ts                 博客身份信息
.github/workflows/          GitHub Pages 部署
astro.config.mjs            构建与部署路径配置
```

## 推荐阅读顺序

1. `src/content.config.ts` — 内容模型如何定义
2. `src/lib/content.ts` — 目录如何变成 locale、slug、阅读时间
3. `src/i18n/ui.ts` — 界面文案如何双语
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

配置会自动识别用户站点与普通项目站点，并处理 GitHub Pages 子路径（内部链接与图片路径都已验证）。

## 刻意没有实现什么

V1.1 没有搜索、评论、CMS、登录、数据库、Analytics、AI 助手、复杂标签页、Series、相关文章算法、摄影画廊、Lightbox、前端框架、Tailwind 或动画库。中文采用高质量系统字体栈，没有引入任何 Web Font 依赖。

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

V1 proved that a low-complexity site can still have a mature visual quality. **V1.1 — Content Foundation** goes one step further: a blog that is truly maintainable in the long run separates *content* from *site code* completely.

Day to day, you never edit an Astro page, component, or CSS file. The workflow is:

```text
Create a content folder → Write Markdown → Drop in images → git commit / push
```

The site takes care of pages, indexes, navigation, metadata, RSS, and the sitemap.

## What V1.1 includes

- **Content architecture**: articles and projects are self-contained content bundles — Markdown and images live together
- **Bilingual**: Simplified Chinese (default, at `/`) and English (at `/en/`); the folder is the language, no frontmatter needed
- **Projects collection**: a dedicated collection with a Selected Works-style index
- **Media system**: local images co-located with content, optimized at build time — responsive, lazy-loaded, no layout shift
- **Chinese typography**: tracking, line-height, and rhythm designed for Chinese — not an English template with Chinese text
- **Content-driven homepage**: `featured: true` drives the selected sections, falling back to the latest content
- Locale-aware reading time (characters for Chinese, words for English) and localized dates
- Translation pairing by matching slugs, with a quiet language switch and hreflang alternates
- Bilingual RSS (`/rss.xml` and `/en/rss.xml`), draft filtering, sitemap, full SEO
- Still **zero client-side JavaScript**, with no new dependencies

## Publish content

**Article (Chinese, default):** create `src/content/writing/zh/<slug>/index.md` (folder name = URL slug). **English:** same under `src/content/writing/en/`. **Images:** put them in the same folder and reference them relatively — `![alt](./diagram.webp)` — Astro optimizes them automatically. **Translation:** use the same folder slug under the other locale and the two pages link to each other. **Project:** same idea under `src/content/projects/<locale>/<slug>/` with optional `status`, `cover`, `repo`, and `demo` fields. **Draft:** `draft: true` (still previewable in dev). **Featured:** `featured: true`.

```yaml
---
title: "A clear title"
description: "One sentence that explains the article."
date: 2026-09-22
tags:
  - Design
---
```

## Run locally

Node.js 22.12 or newer is required.

```bash
git clone https://github.com/Tommy-hang/Miniblog.git
cd Miniblog
npm install
npm run dev
```

Validate and preview the production build with `npm run build` (includes `astro check`) and `npm run preview`.

## Customize and deploy

- `src/site.ts` — publication identity (both languages).
- `src/i18n/ui.ts` — the bilingual UI dictionary.
- `src/styles/global.css` — design tokens; the `:lang(zh)` block holds the Chinese typography rules.

To deploy, open **Settings → Pages**, choose **GitHub Actions**, and push to `main`. The included workflow handles base paths for both user sites and project sites.

## What is intentionally absent

No search, comments, CMS, authentication, database, analytics, AI assistant, tag pages, series, related-post algorithms, photography gallery, lightbox, client framework, Tailwind, or animation library. Chinese renders with a high-quality system CJK stack — no web font downloads.

These features are not forbidden; they simply have not earned their complexity yet.

## License and author

MiniBlog is created and maintained by **张文曜 (Tommy-hang)**.

- Source code, components, styles, and configuration are available under the [MIT License](LICENSE).
- Original articles, written copy, and visual content are available under [CC BY 4.0](LICENSE-CONTENT.md).

---

**Simple, not crude. Minimal, not empty. Quiet, but memorable.**
