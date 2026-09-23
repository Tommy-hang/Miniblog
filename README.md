# MiniBlog

> **Simple, not crude. Minimal, not empty. Quiet, but memorable.**

[在线阅读](https://tommy-hang.github.io/Miniblog/) · [English Version](#miniblog--english-version) · [源代码](https://github.com/Tommy-hang/Miniblog)

MiniBlog 是一个使用 Astro 构建的现代个人出版物，也是一次关于“优秀体验究竟需要多少复杂度”的长期实验。文章是 Markdown，界面固定英文，内容可以是中文或英文，整站静态生成、零客户端 JavaScript。

V1 系列（V1.0–V1.5）已经完成：内容架构、语言模型、文章排版、内容发现，以及一套让作者可以长期、低摩擦、低错误率使用的发布流程。

```text
想法 → npm run new → Markdown + 图片 → npm run verify → git push → 自动部署
```

---

## 理念

- **Content First**：内容与代码分离，日常只写 Markdown、放图片、提交 git。
- **Brand Language = English，Content Language = 中文 / English**：界面固定英文；内容语言由目录决定，互不影响。
- **Complexity Budget + Quality Floor**：用尽可能少的复杂度，获得尽可能高的体验质量。
- **Build-time over runtime**：没有数据库、没有 CMS、没有后台，页面在构建期生成。

---

## 快速开始

需要 Node.js 22.12 或更新版本。

```bash
git clone https://github.com/Tommy-hang/Miniblog.git
cd Miniblog
npm install
npm run dev
```

日常只需要记住四个命令：

```text
npm run new      创建内容
npm run remove   删除内容 / 标签（只改本地）
npm run dev      本地预览
npm run publish  验证并发布
```

创建第一篇文章：

```bash
npm run new
```

---

## 创建内容

`npm run new` 是一个很小的交互式脚本，会问几个问题，然后生成一个符合当前 schema 的 `index.md`。

```text
What do you want to create?
  1. Writing
  2. Project
  3. Translation of existing content
  4. Tag
```

- **Writing / Project**：选择语言（zh / en）→ 输入标题 → 确认 slug → 选择标签。
- **Tag**：单独注册一个新标签（见「标签」）。
- **slug**：小写 ASCII、kebab-case，例如 `understanding-attention`。中文标题不会自动转拼音，请手动输入一个稳定的英文 slug。
- **tags**：可选，只能使用 `src/lib/tags.ts` 中注册过的标签（见「标签」）。
- **新内容默认 `draft: true`**：创建不等于发布。

```text
Created:
  src/content/writing/zh/understanding-attention/index.md
```

脚本不会 git commit / push，也不会修改或覆盖任何已有文件；目标目录已存在时会直接拒绝。

---

## 写作

文章就是普通 Markdown。frontmatter 最小示例：

```yaml
---
title: "一个清楚的标题"
description: "一句话说明这篇文章。"
date: 2026-09-22
tags:
  - AI
draft: true
---
```

- `title` / `description` / `date` 必填（`description` 对 Archive、SEO、首页都很重要）。
- `tags` 可选，受控词表。
- `draft` / `featured` 默认 false；`updated` / `cover` 可选。
- 正文里的 `#` 标题会渲染成**居中、占满整行**的章节大标题；`##` / `###` 保持左对齐的小节样式。

### 目录即语言与 URL

```text
src/content/writing/zh/<slug>/index.md   →  /writing/<slug>/
src/content/writing/en/<slug>/index.md   →  /en/writing/<slug>/
```

同一个 slug 出现在两种语言目录下，就是一对翻译。项目同理（`src/content/projects/<locale>/<slug>/`）。

---

## 图片

图片与 `index.md` 放在同一个文件夹，相对引用：

```md
![清楚、有意义的 alt 文本](./diagram.webp)
```

更丰富的呈现（都是可选的极轻约定）：

- **宽图**：`![宽图](./diagram.webp "wide")` —— 轻微突破正文列宽。
- **封面**：frontmatter `cover: ./cover.webp` —— 出现在标题下方、比正文更宽。
- **Caption**：在图片下一行写一条斜体说明，例如 `*图 1 — 数据如何流动。*`
- **带细边框的图**：`"frame"`，可与 `wide` 组合，如 `"wide frame"`。

---

## 翻译

用同一套脚本：

```bash
npm run new
# 选择 3. Translation of existing content
```

选择内容类型、源语言、已有 slug、目标语言，脚本会在目标语言目录下用**相同 slug** 创建翻译版本，并复制 `date` / `tags`（项目还会复制 `status`），把标题与正文留成占位符。

- 只有**已发布**的翻译才会在文章页显示语言链接（`EN` / `中文`）。
- 不要求所有内容都双语；单语内容完全正常。

---

## 标签

标签是内容发现的第二轴，也是**受控词表**：

- 只能使用 `src/lib/tags.ts` 中注册的名字。写错（例如 `Contorl`）会在 `npm run check` / `npm run build` 阶段直接失败，不会生成 `/tags/contorl/`。
- 注册新标签有两种方式：
  - `npm run new` → `4. Tag`；或在创建 Writing / Project 时直接输入一个未注册的标签。脚本会先询问是否注册（**默认 No**），确认后才写入 `src/lib/tags.ts`。
  - 或者手动在 `src/lib/tags.ts` 里加一行 `{ name: "Control", slug: "control" }`。
- 新标签必须显式确认，并且仍然是受控词表——让创建分类变简单，但不要让它变随意。
- 一篇内容通常 1–3 个标签；标签是主题导航，不是 SEO 关键词。
- 标签跨 Writing / Projects；`/tags/<slug>/` 会自动生成，只对真正有内容的标签生成。

---

## 验证

发布前运行统一检查：

```bash
npm run verify
```

它会依次执行：

```text
npm run validate:content   跨内容完整性检查（只读）
npm run check              astro check（类型 + 内容 schema）
npm run build              静态构建
```

也可以单独运行 `npm run validate:content`。它只检查 schema 看不到的跨内容规则：

**Errors（会阻止部署）**

- 重复的内容身份（同 collection + locale + slug）
- `updated` 早于 `date`
- 已发布内容缺 `title` 或 `description`

**Warnings（只提示，不阻止）**

- `draft: true` 却 `featured: true`
- 已发布内容正文为空
- slug 不是小写 kebab-case
- slug 带语言后缀（翻译应使用相同 slug）

---

## 发布

写完、并在 `npm run dev` 里看过效果之后：

```bash
npm run publish
```

它会依次：

1. 检查 Git 状态（必须在 `main`，且没有已经 staged 的文件）。
2. 确认这次改动**只涉及 `src/content/`**，否则拒绝发布。
3. 检查 draft：如果是草稿，会先问你；确认后才会把 `draft: true` 改成 `draft: false`。
4. 显示即将发布的内容。
5. 运行 `npm run verify`（validate:content → check → build）。
6. 最后确认一次。
7. 只 stage `src/content/**`，自动生成 commit message，commit 并 push 到 `main`。

push 之后 GitHub Actions 会执行同一套 `verify`，通过后才部署到 GitHub Pages；任何一步失败都不会部署。

发布前清单：

```text
1. description 已填写
2. tags 合法
3. npm run verify 通过（publish 会自动运行）
4. npm run publish
```

### 手动发布

`npm run publish` 只是对底层流程的包装，高级用户仍然可以手动：

```bash
npm run verify
git add src/content src/lib/tags.ts
git commit -m "Publish: ..."
git push origin main
```

---

## 删除

```bash
npm run remove
```

交互式选择要删除的 **Writing / Project / Tag**。删除是破坏性的，所以这个命令刻意设计得很谨慎：

- 目标只能从发现到的内容里选，不能手输路径。
- 删除前先显示完整摘要（标题、语言、slug、状态、路径）。已发布的内容会额外警告：下次 publish 后它的公开链接会 404。
- 如果存在翻译版本，会问是只删当前语言还是两种语言一起删（默认保守）。
- 最后必须**原样输入 slug** 才能删除。
- 正在被内容引用的 Tag 会被拒绝，并列出引用它的文件；只有未使用的 Tag 才能删除。
- `npm run remove` **只改本地**，不会 commit / push。只有 `npm run publish` 才会把删除提交并推送。

删除后仍然可以通过 Git 恢复，直到你 publish：

```bash
git restore -- src/content/writing/zh/my-post
```

---

## 定制

- `src/site.ts` — 博客名称、作者、GitHub、所在地、首页 Currently。
- `src/lib/tags.ts` — 受控标签词表。
- `src/i18n/ui.ts` — 只保存随内容语言变化的少量文案。
- `src/styles/global.css` — Design Tokens、站点外观、导航、首页、发现页。
- `src/styles/prose.css` — Editorial Prose System（文章阅读与 Markdown 排版）。
- `public/favicon.svg` / `public/social-card.svg` — 品牌资产。

### 亮/暗模式

Header 右侧有一个安静的亮/暗切换：**默认跟随系统**（`prefers-color-scheme`），手动点一下会覆盖并记住选择。它是一段约十行的内联脚本 + 一组 `data-theme` 颜色变量，没有依赖、没有框架。两种模式在移动端和桌面端都已设计。

## 项目结构

```text
scripts/                    本地脚本：new-content、validate-content、共享工具
src/
├── components/             Header、Footer、ArticleRow、ArticleList、ProjectList、WritingArchive、TagLinks
├── content/                writing / projects（zh / en 内容包）
├── i18n/ui.ts              内容级文案 + 语言类型
├── lib/content.ts          locale / slug / 过滤 / 排序 / 分组 / 翻译匹配
├── lib/tags.ts             受控标签词表
├── layouts/                BaseLayout、ArticleLayout
├── pages/                  品牌页面、内容详情、/tags/<tag>/、RSS、重定向
├── styles/                 global.css、prose.css
├── content.config.ts       两个 Collection 的 Schema
└── site.ts                 博客身份
.github/workflows/          GitHub Pages 部署（含 quality gate）
astro.config.mjs            构建、部署路径、Sitemap 过滤
```

### 路由

```text
/                        首页
/writing/                Writing Archive（年 / 月分组 + 标签导航）
/writing/<slug>/         中文文章
/en/writing/<slug>/      English article
/projects/               Projects
/projects/<slug>/        中文项目
/en/projects/<slug>/     English project
/tags/<tag>/             标签页（自动生成）
/about/                  About
/rss.xml  /en/rss.xml    双语 RSS
```

## 部署到 GitHub Pages

仓库包含 `.github/workflows/deploy.yml`。在 **Settings → Pages** 中选择 **GitHub Actions**，然后 push 到 `main` 即可；workflow 会自动处理子路径。

## 刻意没有实现什么

V1.5 没有搜索、评论、CMS、登录、数据库、Analytics、AI 助手、Series、相关文章、上一篇 / 下一篇、目录、分页、Tag Cloud 或客户端过滤。**搜索是有意推迟的**：当前规模下，年 / 月时间轴加上标签已经足够找到内容。

## 开源许可与作者

MiniBlog 由 **张文曜（Tommy-hang）** 创建并维护。

- 程序代码、组件、样式和配置使用 [MIT License](LICENSE)。
- 原创文章、说明文字和视觉内容使用 [CC BY 4.0](LICENSE-CONTENT.md)。

---

<a id="miniblog--english-version"></a>

# MiniBlog — English Version

> **Beautiful by design. Simple by engineering.**

[Live site](https://tommy-hang.github.io/Miniblog/) · [Source](https://github.com/Tommy-hang/Miniblog) · [中文](#miniblog)

MiniBlog is a modern personal publication built with Astro and a long-term experiment around one question: how little technical complexity does an excellent digital reading experience actually require? Articles are Markdown, the interface is fixed English, content can be Chinese or English, and the whole site is static with zero client-side JavaScript.

The V1 series (V1.0–V1.5) is complete: content architecture, the language model, editorial typography, content discovery, and a publishing workflow that is low-friction and low-error for the author.

```text
idea → npm run new → Markdown + images → npm run verify → git push → deploy
```

## Philosophy

- **Content first**: content and code are separate; day to day you write Markdown, drop in images and commit.
- **Brand language is English, content language is Chinese / English**: the folder decides a piece's language.
- **Complexity budget + quality floor**: the least complexity that still delivers a high-quality experience.
- **Build-time over runtime**: no database, no CMS, no admin — pages are generated at build time.

## Quick start

Node.js 22.12 or newer is required.

```bash
git clone https://github.com/Tommy-hang/Miniblog.git
cd Miniblog
npm install
npm run dev
```

Day to day there are just four commands:

```text
npm run new      create content
npm run remove   remove content / a tag (local only)
npm run dev      preview locally
npm run publish  verify and publish
```

Create your first article with `npm run new`.

## Create content

`npm run new` is a tiny interactive script. It asks a few questions and writes an `index.md` that matches the current schema.

```text
What do you want to create?
  1. Writing
  2. Project
  3. Translation of existing content
  4. Tag
```

- **Writing / Project**: choose a language (zh / en) → title → slug → optional tags.
- **Tag**: register a single new tag (see "Tags").
- **Slug**: lowercase ASCII kebab-case, e.g. `understanding-attention`. Chinese titles are not transliterated; supply a stable English slug.
- **Tags**: optional, and limited to the names registered in `src/lib/tags.ts`.
- **New content starts as `draft: true`** — creating is not publishing.

The script never commits, pushes, edits or overwrites; it refuses if the target folder already exists.

## Write

Articles are plain Markdown. A minimal frontmatter:

```yaml
---
title: "A clear title"
description: "One sentence that explains the article."
date: 2026-09-22
tags:
  - AI
draft: true
---
```

The folder is the language and the URL:

```text
src/content/writing/zh/<slug>/index.md   →  /writing/<slug>/
src/content/writing/en/<slug>/index.md   →  /en/writing/<slug>/
```

The same slug under both locales is a translation pair. Projects work the same way.

A `#` heading inside the article body renders as a **centered, full-width** section title; `##` and `###` keep their usual left-aligned subsection style.

## Images

Keep images beside `index.md` and reference them relatively:

```md
![A clear, meaningful alt text](./diagram.webp)
```

Optional, very light conventions: `![Wide](./diagram.webp "wide")` for a wider image, `cover: ./cover.webp` in frontmatter for a cover, an italic line after an image for a caption, and `"frame"` (combinable as `"wide frame"`) for a hairline border.

## Translate

Run `npm run new` and pick **3. Translation of existing content**. Choose the content type, source locale, existing slug and target locale. The script creates the counterpart under the same slug, copying `date`, `tags` (and `status` for projects) while leaving the title and body as placeholders.

Only a **published** translation shows a language link on the article page. Single-language content is perfectly fine.

## Tags

Tags are the second discovery axis and a **controlled vocabulary**:

- Only names registered in `src/lib/tags.ts` are allowed. A typo fails `npm run check` / `npm run build` instead of creating `/tags/contorl/`.
- There are two ways to register a tag:
  - `npm run new` → `4. Tag`, or type an unregistered tag while creating Writing / Project. The script asks first (**default No**) and only then writes it to `src/lib/tags.ts`.
  - Or add one line by hand: `{ name: "Control", slug: "control" }`.
- New tags always require explicit confirmation and remain part of the controlled vocabulary — easy to create, never accidental.
- Use 1–3 tags per piece; tags navigate topics, they are not SEO keywords.
- Tags cross Writing and Projects; `/tags/<slug>/` is generated only for tags that have content.

## Validate

Run the unified check before publishing:

```bash
npm run verify
```

It runs, in order:

```text
npm run validate:content   cross-content integrity (read-only)
npm run check              astro check (types + content schema)
npm run build              static build
```

`npm run validate:content` only checks what a per-file schema cannot see:

**Errors (block a deploy)**

- duplicate content identity (same collection + locale + slug)
- `updated` earlier than `date`
- published content missing `title` or `description`

**Warnings (reported only)**

- `draft: true` together with `featured: true`
- published content with an empty body
- a slug that is not lowercase kebab-case
- a slug with a locale suffix (translations use an identical slug)

## Publish

Once you have written the piece and checked it with `npm run dev`:

```bash
npm run publish
```

It then:

1. Checks the Git state (must be on `main`, with nothing already staged).
2. Confirms the changes touch **only `src/content/`** — otherwise it refuses.
3. Checks for drafts: if a piece is still a draft it asks first, and only then flips `draft: true` to `draft: false`.
4. Shows what is about to be published.
5. Runs `npm run verify` (validate:content → check → build).
6. Asks for a final confirmation.
7. Stages only `src/content/**`, generates the commit message, commits and pushes to `main`.

Pushing to `main` runs the same `verify` in GitHub Actions; the site is deployed only if it passes.

### Manual publishing

`npm run publish` is only a wrapper around the underlying flow, so advanced users can still do it by hand:

```bash
npm run verify
git add src/content src/lib/tags.ts
git commit -m "Publish: ..."
git push origin main
```

## Remove

```bash
npm run remove
```

Interactively choose a **Writing / Project / Tag** to delete. Deletion is destructive, so the command is deliberately cautious:

- The target must be chosen from discovered content — you never type a path.
- It shows a full summary first (title, language, slug, status, path). Published content gets an extra warning that its public URL will 404 after the next publish.
- If a translation exists it asks whether to remove one or both languages (conservative by default).
- The last step requires typing the exact slug.
- A tag that is still referenced by content is refused, with the list of files using it; only unused tags can be removed.
- `npm run remove` only changes local files — it never commits or pushes. Only `npm run publish` commits and pushes the removal.

The removal stays recoverable through Git until you publish:

```bash
git restore -- src/content/writing/zh/my-post
```

## Customize

- `src/site.ts` — identity and the homepage `Currently` list.
- `src/lib/tags.ts` — the controlled tag vocabulary.
- `src/i18n/ui.ts` — the few strings that follow the content language.
- `src/styles/global.css` — design tokens and site chrome.
- `src/styles/prose.css` — the Editorial Prose System.

### Light / dark mode

The header carries a quiet light/dark toggle. It **follows the system** (`prefers-color-scheme`) by default; clicking it pins a manual choice that is remembered. It is a ~10-line inline script plus a small `data-theme` colour override — no dependency, no framework. Both modes are designed for mobile and desktop.

## Deploy

The repo includes `.github/workflows/deploy.yml`. Choose **GitHub Actions** under **Settings → Pages**, then push to `main`. The workflow handles the project base path.

## What is intentionally absent

No search, comments, CMS, authentication, database, analytics, AI assistant, series, related posts, previous/next, table of contents, pagination, tag cloud or client-side filtering. **Search is intentionally deferred**: at the current scale, year/month plus tags are enough.

## License and author

MiniBlog is created and maintained by **张文曜 (Tommy-hang)**. Source code is available under the [MIT License](LICENSE); original articles and visual content under [CC BY 4.0](LICENSE-CONTENT.md).

---

**Simple, not crude. Minimal, not empty. Quiet, but memorable.**
