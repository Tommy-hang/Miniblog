# MiniBlog

## Product · Design · UX · Engineering Specification

> **Simple, not crude.
> Minimal, not empty.
> Quiet, but memorable.**

---

# 0. 文档地位

本文件是 MiniBlog 项目的最高优先级指导文件。

任何 AI Coding Agent、Codex 或未来开发者在修改项目之前，都必须首先阅读本文件。

如果：

* 默认框架模板
* 所谓“最佳实践”
* AI 自己的偏好
* 某个 UI Library 的设计语言
* 自动生成的工程结构

与本文档冲突：

**以本文档为准。**

但如果本文档中某个具体技术 API 已经过时，则应：

> 保持本文档的设计原则和工程原则，使用当前稳定、现代、官方推荐的实现方式。

---

# 0.5 Brand Language vs Content Language

> V1.2 起，这是 MiniBlog 语言模型的最高优先级约束。未来版本不得违背。

## 原则

```text
The interface has a voice.
The content has a language.
```

- **品牌语言 / 界面语言固定为 English。** 导航（`Writing` / `Projects` / `About`）、首页文案（`Thinking in public.`、`Selected Writing`、`Currently`）、页脚、404 等所有品牌与 UI 文案，不随内容语言改变，也不提供全局语言切换。
- **内容语言可以是中文、English，或一对互译版本。** 首页与 Writing / Projects 归档同时展示两种语言的内容，用 `ZH` / `EN` 作为轻量 metadata。内容以目录（`zh/`、`en/`）作为语言的唯一来源。
- **翻译属于内容，不属于整个网站。** 语言切换只出现在内容详情页，并且只在对应翻译**已发布**时出现；不存在则完全不显示（没有 disabled state、没有 placeholder）。

## 由此确定的结构

```text
一个首页 /          （品牌英文 + 中英混合内容）
一个 /writing/      （中英混合归档）
一个 /projects/     （中英混合归档）
一个 /about/        （英文界面 + 中文正文）
```

内容详情保留稳定的语言路由：

```text
/writing/<slug>/       中文
/en/writing/<slug>/    English
/projects/<slug>/      中文
/en/projects/<slug>/   English
```

## 约束

- 不要重新引入全局语言切换器（dropdown / pill / globe / selector）。
- 不要重新建立 `/en/` 第二套首页或 `/en/about/` 第二套 About；旧 URL 只做静态重定向。
- 不要把 Header 导航根据当前文章语言翻译成中文。即使用户在读中文文章，Header 仍为英文。
- 不要为品牌页面维护 zh / en 两套文案字典。只有随内容语言变化的少量文案（如阅读时间、发布 / 更新、返回索引）才进入 `src/i18n/ui.ts`。
- Translation lookup 必须遵守 production visibility：draft 翻译不得被当作可访问翻译。
- Translation pair 仍以相同 slug 匹配，不引入 translation database 或额外 ID。

---

# 0.6 Editorial Prose System

> V1.3 建立。文章页面的一切排版决策都在此约束之下。

## 目标

```text
The homepage introduces the publication.
The article proves its quality.
```

文章是 MiniBlog 最重要的页面。**阅读永远高于品牌展示。**

## 三层宽度

```text
--measure-reading   阅读列（正文、列表、常规标题、脚注）
--measure-wide      宽媒体（wide 图片、图表、宽表格、特殊 figure）
--measure-hero      封面（cover，接近主 grid，但不 full bleed）
```

阅读列用于长时间阅读；宽媒体只是短暂突破；封面进一步接近 grid。不要使用 100vw full bleed。

## 标题层级

- H1 是文章最大的视觉元素（Display），但必须优雅处理长标题、2–3 行与移动端。
- H2 是章节（Major Chapter），不是第二个 Hero。
- H3 是局部小节（Local idea），与正文有明确区分。
- 正文标题不使用 uppercase；uppercase 只属于 metadata。
- 中文标题放松字距、提高行高，不继承英文的负 tracking。

## 阅读节奏

使用单一 `--flow` 变量驱动块间距：

- 段落之间紧凑；
- 章节前大留白，章节后小开口；
- 图片、代码、引用、表格前后有更大的呼吸；
- caption 紧贴图片。

不要回到“所有元素统一 margin-bottom”。

## 媒体层级

```text
默认图片   ![alt](./image.webp)           无边框，图片自己决定边界
宽图       ![alt](./image.webp "wide")    轻微突破阅读列
带框图片   ![alt](./image.webp "frame")   截图类需要 hairline 时使用
封面       cover: ./cover.webp            frontmatter，出现在标题之后
Caption    图片下一行的斜体段落            *图 1 — 说明。*
```

- 不强制所有图片加 border；圆角保持 0 或极小。
- cover 不等于正文第一张图；示例内容不要重复。
- 图片必须 responsive、有尺寸、防 CLS、alt 正确。

## 代码

- 使用 Astro 内置 Shiki 静态高亮，不引入客户端高亮。
- light / dark 双主题，通过 CSS 变量切换；代码表面使用 MiniBlog 自己的暖色 token（`--color-code`），而不是外部编辑器主题的背景。
- `pre` 必须 `overflow-x: auto`；移动端不撑破 viewport。
- 不增加 copy button、行号、文件名 tabs。

## 表格

- 桌面为编辑式表格：清晰表头、克制的分隔线、足够的单元格间距。
- 窄屏让表格自身横向滚动，页面 viewport 不横向滚动。
- 保持语义 `<table>`。

## 脚注

- 使用 Markdown 原生脚注。
- 低调：较小字号、较低对比、顶部 separator、可点击的引用编号与回链。

## 数学公式

V1.3 不引入数学公式渲染（避免为它引入 runtime 依赖）。列为 future enhancement。

## Responsive 哲学

- Mobile 是重新排版，不是压缩桌面版。
- 阅读列在 mobile 接近 viewport，但保留舒适边距。
- 中文长标题自然换行，不出现“一屏 5 个字”。
- 至少检查 360 / 390 / 768 / 1024 / 1440+。

## 作者体验

普通作者只需要 Markdown + frontmatter + 图片。`wide` / `frame` / caption 都是可选的极轻约定，不是必须。`.md` 仍是主要格式，不要 MDX-first。

---

# 1. MiniBlog 是什么

MiniBlog 是一个面向个人创作者、技术学习者和长期写作者的现代个人博客。

它不是一个普通的：

> “标题 + 文章列表 + 白色背景”

博客模板。

它也不是一个：

> 大量 3D、粒子、光效、滚动动画、WebGL

组成的实验艺术网站。

MiniBlog 希望探索的是中间这一条更困难的路线：

> **使用尽可能克制的技术复杂度，创造真正高级、舒服、完整、有个人辨识度的数字阅读体验。**

它必须同时满足：

### 审美

看起来高级。

### UX

使用起来舒服。

### Engineering

实现足够简单。

### Learning

代码能够被一个正在学习前端的人逐渐理解。

### Longevity

五年以后依然不会显得廉价或过时。

---

# 2. MiniBlog 最重要的原则

MiniBlog 的第一原则不是：

> 少写代码。

而是：

> **用尽可能少的复杂度，获得尽可能高的体验质量。**

因此：

```text
Minimal Complexity
≠
Minimal Design
```

MiniBlog 可以拥有：

* 精致 Typography
* 成熟 Layout
* 高级视觉层级
* 微交互
* 响应式设计
* Hover Feedback
* Page Transition
* 图片系统
* Dark Mode
* 精致文章排版
* 视觉节奏
* 完整导航体验

只是这些能力必须以：

**简单、稳定、克制**

的方法实现。

---

# 3. 最高优先级排序

当不同目标发生冲突时，按照以下顺序判断：

## 1. Visual Quality

审美品质。

## 2. User Experience

使用是否舒服。

## 3. Clarity

设计与代码是否清晰。

## 4. Simplicity

是否足够简单。

## 5. Performance

是否足够轻。

## 6. Extensibility

是否容易继续扩展。

注意：

**代码量不是第一目标。**

如果额外增加少量 CSS 可以显著提升页面质感：

应该增加。

如果一个小型交互脚本可以显著改善导航体验：

可以加入。

但如果引入 100 KB JavaScript 只是为了一个很小的视觉效果：

不要加入。

---

# 4. MiniBlog 对“简约”的定义

MiniBlog 所说的简约是：

## 简约，不是简陋。

## 简洁，不是空白。

## 克制，不是无设计。

真正的简约意味着：

经过大量设计判断之后，

只保留最值得存在的部分。

因此：

一个页面只有 6 个元素，

不代表它设计简单。

恰恰可能意味着：

这 6 个元素的：

* 比例
* 字号
* 字重
* 对齐
* 留白
* 颜色
* 节奏
* 位置

都经过精确处理。

---

# 5. 核心审美方向

MiniBlog 的整体设计方向定义为：

# Editorial Minimalism

×

# Quiet Interaction

×

# Contemporary Digital Publishing

中文可以理解为：

> **现代数字编辑设计 × 安静的高级交互。**

整体感觉应该是：

* 理性
* 年轻
* 克制
* 精确
* 安静
* 有文化感
* 有技术感
* 有个人气质
* 现代
* 长期耐看

---

# 6. MiniBlog 不应该像什么

必须主动避免以下视觉方向。

## 不要像普通 AI 生成网站

典型问题：

* 大圆角
* 大量卡片
* Bento Grid 滥用
* 紫蓝渐变
* 发光按钮
* Glow Border
* 毛玻璃
* 浮动 Orb
* AI SaaS Hero
* “Build the future with AI”
* 三列 feature card

MiniBlog 不是 SaaS Landing Page。

---

## 不要像廉价“极简博客模板”

例如：

```text
My Blog

Home About

Hello.
I write things.

Article 1
Article 2
Article 3
```

然后：

* Arial
* 黑白
* 800px 宽度
* 三条 border
* 没有层级
* 没有设计节奏

这不是 MiniBlog 的极简。

这是：

**缺少设计。**

---

## 不要像 Creative Coding 展示站

禁止为了视觉冲击大量加入：

* Three.js
* WebGL
* shaders
* physics
* particle system
* cursor follower
* distortion
* 3D navigation
* continuous animations

除非未来某个独立实验明确需要。

---

# 7. MiniBlog 的设计目标

第一次打开 MiniBlog 时：

用户应该感受到：

> 这个网站非常干净。

再看几秒：

> 但它设计得很细。

继续阅读：

> 用起来非常舒服。

最终：

> 这个网站有自己的气质。

而不是：

> 这个网站有好多特效。

---

# 8. Quiet Richness

MiniBlog 引入一个重要概念：

# Quiet Richness

即：

> **安静的丰富性。**

页面可以包含大量经过设计的细节：

* 字号变化
* baseline
* line-height
* subtle borders
* index number
* metadata
* hover movement
* underline
* spacing
* image crop
* asymmetry
* sticky element
* reveal

但这些设计不会同时大声出现。

用户感受到的是：

**舒服。**

而不是：

**设计师正在表演。**

---

# 9. Design Density

MiniBlog 的重要设计指标：

```text
Design Density
=
Perceived Experience
/
Implementation Complexity
```

我们不是简单地减少体验。

而是寻找：

> **低实现成本、高感知价值**

的设计。

例如：

`clamp()` 实现响应式大标题。

CSS Grid 实现高级版式。

`:hover` 实现细微移动。

`::after` 实现 underline animation。

`position: sticky` 实现文章辅助导航。

几十行 CSS 就可以创造明显设计价值。

这类技术非常符合 MiniBlog。

---

# 10. 技术架构

默认技术栈：

```text
Astro
TypeScript
Markdown / MDX when truly needed
Astro Content Collections
Modern CSS
Git
GitHub
GitHub Pages
```

---

# 11. 关于 Astro

MiniBlog 是 Content-first 网站。

Astro 应主要负责：

* Static Generation
* Routing
* Content Collection
* Layout
* Components
* Markdown rendering
* Metadata
* RSS
* Sitemap
* Build

默认不要把整个网站变成 SPA。

---

# 12. JavaScript 原则

MiniBlog 不是：

> Zero JavaScript at all costs.

真正原则是：

> **No unnecessary JavaScript.**

可以使用 JavaScript 实现：

* 明确有价值的交互
* 无法通过 CSS 优雅实现的体验
* Theme Toggle（如果未来启用）
* 少量导航行为
* 特定 UI 状态

但必须保持：

* 少
* 清晰
* 局部
* 可解释

---

# 13. CSS 是 MiniBlog 的核心能力

大量 UI/UX 应优先通过 Modern CSS 实现。

鼓励使用：

```text
CSS Variables
Grid
Flexbox
clamp()
min()
max()
minmax()
aspect-ratio
object-fit
position: sticky
:has()
:hover
:focus-visible
::before
::after
media queries
container queries
prefers-reduced-motion
prefers-color-scheme
```

不要因为“原生 CSS”而只写最基础样式。

MiniBlog 应充分展示：

> **现代 CSS 本身已经是一套非常强大的设计工具。**

---

# 14. Design System

MiniBlog 必须具有一个：

**小而完整**

的 Design System。

不要创建企业级复杂 Design System。

但以下内容必须统一。

---

# 15. Color System

色彩数量应该少。

建议建立：

```css
--color-background
--color-surface
--color-text
--color-text-secondary
--color-text-tertiary
--color-border
--color-accent
--color-selection
```

允许根据视觉方案调整。

关键原则：

> 色彩承担层级，而不是承担装饰。

---

# 16. Background

背景不要默认纯白。

可以考虑：

非常轻微偏暖或偏冷的 off-white。

例如视觉上接近：

```text
paper white
warm ivory
soft gray
```

Dark Mode 同样避免纯黑。

目标：

长时间阅读舒服。

---

# 17. Accent Color

MiniBlog 可以拥有一个非常克制的品牌 Accent。

用于：

* link
* active state
* selection
* small indicator
* occasional graphic element

不要让 Accent 到处出现。

Accent 越少：

越有力量。

---

# 18. Typography 是第一视觉资产

MiniBlog 的 UI 设计核心不是 Card。

而是：

# Typography.

必须认真设计：

* Display
* H1
* H2
* H3
* Lead
* Body
* Caption
* Metadata
* Code

---

# 19. 字体策略

不要武断规定必须 System Font。

允许使用：

### 方案 A

优秀 System Stack。

### 方案 B

一套高品质 Web Font。

如果 Web Font：

* 明显提升品牌识别
* 文件合理
* 性能成本合理

则允许使用。

原则：

> Typography is infrastructure.

不是无意义装饰。

---

# 20. 字体数量

通常最多：

**1–2 个字体家族。**

例如：

一个 Sans：

负责 UI。

另一个 Serif：

负责 editorial accent 或正文。

或者：

只使用一套优秀字体。

不要为了“设计感”拼五套字体。

---

# 21. 字号体系

必须拥有清晰而大胆的尺度差。

例如：

```text
Display
72–120 responsive

H1
48–72

H2
30–42

H3
22–28

Body
17–20

Meta
12–14
```

这只是方向。

应通过 `clamp()` 做响应式缩放。

---

# 22. 留白

Whitespace 是 MiniBlog 的主要设计元素之一。

不要害怕空白。

但是：

空白必须有节奏。

而不是：

“什么都没放”。

---

# 23. Spacing System

建立少量统一间距变量。

例如：

```text
4
8
12
16
24
32
48
64
96
128
```

不要求完全照搬。

目标是：

避免每个元素出现随机 margin。

---

# 24. Layout Philosophy

MiniBlog 不应该一直采用：

```text
一个 800px container
所有东西全部居中
```

这会非常像普通博客模板。

应该适度使用：

* wide grid
* narrow reading column
* asymmetry
* oversized typography
* side metadata
* image bleed
* offset elements

创造 Editorial 版式。

---

# 25. Grid

Desktop 建议拥有隐含的：

**12-column 或类似比例 Grid**

但实现可以非常简单。

不用构建复杂 Grid Framework。

CSS Grid 足够。

---

# 26. 页面层级策略

MiniBlog 不同页面应该拥有不同视觉密度。

```text
HOME
最高 Identity

↓

WRITING
最高 Information

↓

ARTICLE
最高 Reading

↓

CONTENT
最低 Interface
```

即：

用户越深入内容，

界面越安静。

---

# 27. 首页设计原则

Homepage 不是普通博客文章列表。

首页承担：

# Identity

即：

> 这个人是谁？

首页应该具有整个 MiniBlog 最强的视觉记忆点。

---

# 28. 首页推荐结构

整体可以类似：

```text
MINIBLOG                         INDEX 01

THINKING
IN PUBLIC.

AI · ENGINEERING · DESIGN
AND THINGS I AM LEARNING.


                         ↓


SELECTED WRITING

01
Understanding Attention
A visual explanation of Q, K and V.

AI / 12 MIN
                              ↗


02
Building Small Systems

ENGINEERING / 8 MIN
                              ↗


03
Why Workflow Matters

AI SYSTEMS / 11 MIN
                              ↗


CURRENTLY

Learning small models.
Building interfaces.
Understanding systems.


2026                         BEIJING
```

不要机械复制。

这是：

**视觉逻辑参考。**

---

# 29. 首页 Hero

允许大型 Hero。

但是必须是：

# Editorial Hero

而不是：

# Marketing Hero

可以通过：

* 大字号文字
* 极强比例
* 少量副文本
* Grid
* 留白

建立力量。

不要出现：

```text
Start Now
Learn More
Join 10,000 users
```

MiniBlog 不是产品销售页。

---

# 30. 首页视觉核心

首页最好拥有：

**一个明确的 Visual Anchor。**

可能是：

### A

巨大 Typography。

### B

一张精选图像。

### C

Typography + Image。

### D

一个极简抽象视觉元素。

默认优先：

**Typography。**

因为实现简单、长期耐看。

---

# 31. Writing 页面

Writing 是完整文章索引。

不要默认卡片瀑布流。

优先：

# Editorial Index

例如：

```text
WRITING

01      Understanding Attention
        A visual explanation...
        AI                    22 SEP 2026

02      Why Workflow Matters
        Designing reliable...
        SYSTEMS               18 SEP 2026

03      Building MiniBlog
        Complexity as a design...
        WEB                   11 SEP 2026
```

---

# 32. Article List Interaction

文章列表应该有基础交互。

至少：

* hover feedback
* focus-visible
* title movement / arrow movement
* subtle color transition

可以考虑：

鼠标 hover 某一篇文章时：

其他内容轻微降低对比度。

但是：

不要影响可访问性。

不要制造大范围动画。

---

# 33. Article Preview Image

未来可以允许部分文章拥有：

`cover`

但不是每篇必须。

图片可以在：

* hover reveal
* inline preview
* featured article

中出现。

不要因此把所有文章强制变成卡片。

---

# 34. Article Page

文章页是整个网站最重要的页面。

这里：

**阅读永远高于品牌展示。**

---

# 35. Article Header

文章开头建议包含：

```text
CATEGORY / DATE / READING TIME

ARTICLE TITLE

Short description or lead.

Optional Cover Image
```

Title 可以非常大。

但进入正文之后视觉应快速安静下来。

---

# 36. Reading Column

正文宽度不能过宽。

推荐视觉宽度约：

```text
60–75 characters per line
```

目标：

长时间阅读舒适。

---

# 37. Article Typography

必须认真支持：

* h1
* h2
* h3
* paragraph
* strong
* em
* inline code
* code block
* blockquote
* ordered list
* unordered list
* links
* images
* captions
* horizontal rule
* table

Markdown 的默认浏览器样式不能直接使用。

必须有完整设计。

---

# 38. Heading Rhythm

文章标题之间必须拥有明显层级。

H2 应成为文章节奏节点。

可以使用：

```text
01
THE PROBLEM
```

或更克制的 section marker。

但不能强制所有文章使用复杂编号。

---

# 39. Code Blocks

MiniBlog 面向技术内容。

Code Block 是重要组件。

必须：

* 清晰
* 可读
* 与正文协调
* mobile 可滚动

不要做成：

巨大的拟 Terminal UI。

代码就是代码。

---

# 40. Blockquote

Blockquote 应具有 Editorial 感。

不要：

灰色 Card + 大圆角。

可以通过：

* border
* typography
* indentation
* whitespace

完成。

---

# 41. Links

正文链接必须容易识别。

但不要使用默认刺眼蓝色。

可以通过：

* underline
* underline-offset
* color
* hover

实现。

---

# 42. Images

图片应当成为内容的重要视觉节奏。

支持：

### normal width

### wide

### full bleed

但实现保持简单。

图片必须：

* responsive
* 有正确尺寸
* alt
* 避免布局跳动

---

# 43. Article Metadata

建议支持：

```text
date
tags
reading time
description
```

阅读时间可在 build time 计算。

不要使用客户端 JS。

---

# 44. 文章结束体验

文章结束后不要突然结束。

可以提供一个非常克制的：

```text
NEXT

Why Workflow Matters →
```

或者：

```text
← All Writing
```

最多再提供：

相关的 1–2 篇文章。

不要建立复杂推荐系统。

---

# 45. About Page

About 页面不是传统 Resume。

它应该更像：

> 一段经过精心排版的自我介绍。

可以包含：

* Introduction
* What I am learning
* What I am building
* Interests
* Links

视觉上允许更自由的版式。

---

# 46. Projects

MiniBlog Core 第一版可以暂时不需要 Projects 页面。

如果个人版本确实需要：

可以未来扩展。

不要因为个人博客经常有 Projects 就提前加入。

---

# 47. Header

Header 应：

* 简洁
* 有品牌识别
* 清晰

例如：

```text
MINIBLOG                   WRITING  ABOUT
```

可以加入微小的：

index number / status / year

增强 editorial 感。

---

# 48. Sticky Header

允许轻量 sticky。

但避免：

巨大 floating pill navigation。

如果 sticky：

滚动时可以轻微：

* background
* border
* opacity

变化。

保持克制。

---

# 49. Mobile Navigation

如果导航数量少：

不要使用 Hamburger。

能直接显示就直接显示。

只有空间真正不足时：

再设计移动导航。

---

# 50. Footer

Footer 不是垃圾信息区。

建议：

```text
MiniBlog © 2026

GitHub
RSS

Built with curiosity.
```

布局可以具有设计感。

但保持非常少的内容。

---

# 51. Cursor

使用系统 Cursor。

不要 custom cursor。

除非未来独立实验明确需要。

---

# 52. Hover

Hover 是 MiniBlog 最重要的微交互之一。

可以通过：

* opacity
* translate
* underline
* border
* arrow
* image reveal

增加质感。

原则：

```text
small motion
high precision
```

---

# 53. Motion

MiniBlog 允许：

**基础但精致的 Motion。**

这是上一版必须修正的地方。

允许：

* page entrance
* hover transition
* link animation
* menu feedback
* article hover
* image reveal
* subtle scroll behavior

---

# 54. Motion Duration

建议：

```text
120–350ms
```

大部分交互。

更长动画只允许：

极少数品牌性进入效果。

---

# 55. Motion Curve

避免：

线性机械动画。

优先自然 easing。

但不要建立复杂 motion engine。

CSS `cubic-bezier()` 足够。

---

# 56. 首屏进入动画

可以有。

但只允许一次，非常克制。

例如：

标题：

```text
opacity
+
translateY
```

几十像素以内。

不要：

* 字符逐个飞入
* Glitch
* scramble
* cinematic intro
* loading sequence

用户不是来看片头的。

---

# 57. Scroll

不要滥用 Scroll Animation。

页面应该首先：

**正常滚动。**

如果使用 scroll-driven animation：

必须有明确价值。

---

# 58. Accessibility

基础体验必须完整。

必须支持：

* semantic HTML
* keyboard navigation
* focus-visible
* contrast
* alt
* proper heading hierarchy
* reduced motion
* usable mobile tap targets

不能因为设计感牺牲 usability。

---

# 59. Responsive Design

MiniBlog 必须在：

* desktop
* laptop
* tablet
* mobile

都保持设计完整性。

不是：

桌面设计完成以后把宽度压缩。

---

# 60. Mobile Design

Mobile 是重新排版。

但不是重新设计一个网站。

例如：

Desktop：

```text
01      TITLE                       DATE
```

Mobile：

```text
01

TITLE
DESCRIPTION

DATE
```

通过 Grid 自动重排。

---

# 61. Breakpoints

保持数量少。

避免：

```text
480
520
600
640
720
768
820
900
...
```

通常：

2–3 个核心断点已经足够。

---

# 62. Dark Mode

Dark Mode 是基础体验的一部分。

推荐第一版支持：

```text
prefers-color-scheme
```

Dark Mode 必须真正设计。

不是简单：

```text
white → black
black → white
```

注意：

* contrast
* muted text
* border
* code
* images
* accent

---

# 63. 是否需要 Theme Toggle

Core 第一版：

可以不提供。

系统自动切换即可。

如果实现手动 Theme Toggle：

必须足够简单。

不能因此引入框架。

---

# 64. Selection

请设计：

```css
::selection
```

这是几乎零成本、但很有质感的细节。

---

# 65. Scrollbar

不要疯狂定制 scrollbar。

最多做非常轻微的视觉协调。

跨浏览器体验优先。

---

# 66. Favicon

需要一个非常简单但有辨识度的 favicon。

可以：

* 字母
* 几何符号
* 极简 monogram

不要生成复杂 Logo System。

---

# 67. Branding

MiniBlog 不需要正式品牌项目那样：

* logo suite
* mascot
* gradients
* brand book

品牌识别应该主要来自：

* typography
* grid
* tone
* spacing
* recurring small symbol

---

# 68. Content Architecture

文章使用 Markdown。

建议：

```text
src/content/blog/
```

单篇 metadata：

```yaml
---
title: "Understanding Attention"
description: "Why Q, K and V are simpler than they look."
date: 2026-09-22
tags:
  - AI
---
```

根据实际 Astro 当前版本使用官方推荐 schema。

---

# 69. Frontmatter

保持最小：

必须：

```text
title
description
date
```

可选：

```text
tags
cover
draft
```

只有真正使用时才加入。

---

# 70. Content Collections

使用 Astro Content Collections。

Schema 应负责：

* validation
* type safety
* build-time errors

不要建立额外数据库。

---

# 71. 页面结构

Core V1 推荐：

```text
/
/
/writing
/writing/[slug]
/about
/404
/rss.xml
```

如果使用 `/blog` 比 `/writing` 更简单，也可采用 `/blog`。

但全站必须统一。

默认推荐：

# `/writing`

因为更具有个人出版物气质。

---

# 72. URL

保持：

* 简洁
* 可读
* 稳定

例如：

```text
/writing/understanding-attention
```

不要：

```text
/posts?id=37
```

---

# 73. SEO

需要完整基础 SEO：

* title
* description
* canonical
* Open Graph
* Twitter/X card basics
* article metadata
* sitemap
* robots.txt

实现保持简单。

---

# 74. RSS

必须提供 RSS。

博客是开放 Web 的一部分。

RSS 是高价值、低复杂度功能。

---

# 75. Sitemap

通过 Astro 官方生态中简单稳定方式实现。

不要手写复杂 sitemap engine。

---

# 76. 404

404 需要设计。

不要只是：

```text
404 not found
```

可以：

```text
404

Nothing here.

← Return home
```

通过 Typography 和 spacing 让它依然属于 MiniBlog。

---

# 77. Performance

性能依然重要。

但不是为了追求：

Lighthouse 截图。

原则：

> 高级体验应该建立在轻量架构上。

---

# 78. 图片优化

如果 Astro 当前稳定版本拥有成熟图片工具：

使用。

要求：

* 正确尺寸
* lazy loading
* responsive
* prevent layout shift

---

# 79. Client Runtime

最终页面应保持：

**非常少的客户端 JavaScript。**

但不是机械追求：

0 KB。

如果 3 KB JS 显著改善 UX：

允许。

---

# 80. Dependency Philosophy

Dependency 不是敌人。

**不必要的 Dependency 才是敌人。**

增加 dependency 前：

1. 是否解决真实问题？
2. 自己实现是否反而更复杂？
3. 是否成熟？
4. 是否会明显增加长期认知成本？
5. 是否值得？

---

# 81. 允许的依赖类型

例如：

Astro 官方：

* RSS
* Sitemap

这类依赖非常合理。

如果未来需要：

* syntax highlighting

优先使用 Astro 内置或成熟方案。

---

# 82. 不要引入大型 UI Library

禁止默认加入：

* Material UI
* Ant Design
* Chakra
* shadcn full system
* Bootstrap

原因：

MiniBlog 的视觉语言必须自己掌控。

---

# 83. Tailwind

默认：

**不用。**

因为 MiniBlog 希望让 CSS 本身成为项目的一部分。

但这不是因为 Tailwind 不现代。

而是：

MiniBlog 当前规模下原生 CSS 更透明。

---

# 84. Component Strategy

建议只有真实组件存在。

例如：

```text
Header
Footer
ArticleList
ArticlePreview
```

如果能够直接写在页面里：

也可以。

---

# 85. Layout Components

建议：

```text
BaseLayout
ArticleLayout
```

足够。

不要创建十层 Layout。

---

# 86. 文件结构

建议：

```text
miniblog/
│
├── public/
│   ├── favicon.svg
│   └── ...
│
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── ArticleList.astro
│   │
│   ├── content/
│   │   └── blog/
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ArticleLayout.astro
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── writing/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   ├── about.astro
│   │   ├── 404.astro
│   │   └── rss.xml.ts
│   │
│   ├── styles/
│   │   └── global.css
│   │
│   └── content.config.ts
│
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── README.md
└── CODEX.md
```

实际根据当前 Astro 官方结构调整。

---

# 87. 不允许目录膨胀

不要提前创建：

```text
controllers
repositories
services
providers
stores
managers
api
lib
utils
helpers
hooks
```

除非真实复杂度出现。

---

# 88. CSS 文件

第一版甚至可以：

```text
global.css
```

一个核心 CSS 文件完成绝大多数系统。

如果明显过大：

再拆。

不要为了“专业”先拆 20 个 CSS 文件。

---

# 89. CSS Organization

即使一个文件，也应有清晰结构：

```text
1. Tokens
2. Reset / Base
3. Typography
4. Layout
5. Navigation
6. Components
7. Article
8. Utilities
9. Responsive
10. Motion / Accessibility
```

可用注释划分。

---

# 90. Engineering Minimalism

这里才轮到“极简工程”。

原则：

> 在达到目标设计品质以后，选择最简单实现。

顺序非常重要。

不是：

```text
最少代码
→
看看能做到什么
```

而是：

```text
先确定优秀体验
→
寻找最低复杂度实现
```

---

# 91. 避免 Overengineering

不要加入：

* state manager
* database
* backend
* auth
* CMS
* API layer
* Docker
* monorepo
* microservices
* dependency injection
* enterprise architecture

当前没有需求。

---

# 92. Code Quality

代码应该：

* 明确
* 简洁
* 可读
* 可解释

不是：

最短字符。

---

# 93. TypeScript

使用 TypeScript。

但不要类型体操。

TypeScript 用于：

> 帮助理解系统。

不是：

> 展示类型技巧。

---

# 94. Comments

注释解释：

**WHY**

而不是：

**WHAT**

---

# 95. AI 生成代码原则

AI 不允许因为：

> “常见个人博客都是这样。”

就复制模板。

必须根据 MiniBlog 的哲学进行独立设计。

---

# 96. AI 的视觉责任

Codex 不只是完成页面结构。

Codex 必须承担：

**前端视觉实现责任。**

不能出现：

> “结构已经实现，视觉以后再优化。”

视觉就是产品本身。

---

# 97. 视觉验收优先级

开发完成后必须主动检查：

### Typography

是否具有明显层级？

### Grid

是否精确？

### Spacing

是否舒服？

### Rhythm

页面是否有阅读节奏？

### Density

是否既不空洞也不拥挤？

### Identity

是否不像默认模板？

### Restraint

是否没有廉价炫技？

---

# 98. “AI 模板味”检查

如果页面出现：

* 大量 card
* 所有元素圆角
* SaaS Hero
* 渐变按钮
* Blur
* Glow
* Bento everywhere
* Icon + Title + Description 三连卡
* “modern minimalist”模板感

必须重新设计。

---

# 99. 示例文章

提供 3 篇左右。

目的：

验证：

* typography
* code
* heading
* list
* quote
* image
* links

不是填充内容数量。

---

# 100. MiniBlog Core

最终必须能够作为：

**干净模板。**

因此：

核心架构不应该强耦合个人身份。

---

# 101. Personal MiniBlog

我会基于 Core 创建自己的版本。

Core：

负责系统。

Personal：

负责：

* 我的名字
* 我的文章
* 我的项目
* 我的照片
* 我的个人介绍

---

# 102. README

README 应非常清晰。

必须告诉用户：

## What

MiniBlog 是什么。

## Why

为什么这样设计。

## Run

怎么运行。

## Write

怎么增加文章。

## Customize

怎么修改个人信息和视觉变量。

## Deploy

怎么部署。

## Learn

代码应该按什么顺序阅读。

---

# 103. Learning Path

README 可以给出：

```text
1. src/pages/index.astro
2. src/styles/global.css
3. BaseLayout
4. ArticleList
5. Content Collection
6. Dynamic Route
7. RSS
8. astro.config
```

让初学者逐渐理解整个系统。

---

# 104. GitHub Pages

必须能够部署。

如果需要 GitHub Actions：

创建最小、官方推荐的 workflow。

---

# 105. 开发流程

Codex 执行任务时遵循：

## Phase 1 — Inspect

检查当前仓库。

## Phase 2 — Understand

阅读 CODEX.md。

## Phase 3 — Design

先定义：

* Layout
* Typography
* Tokens
* UI hierarchy

不要直接写随机 CSS。

## Phase 4 — Architecture

确定最小结构。

## Phase 5 — Build

完成完整功能。

## Phase 6 — Visual Polish

这是必须阶段。

逐页面检查：

* typography
* spacing
* alignment
* hover
* responsive
* dark mode

## Phase 7 — Simplification

在不降低视觉和 UX 的情况下：

删除多余复杂度。

## Phase 8 — Validation

完整测试。

---

# 106. 注意：Simplification Pass 的顺序

不要出现：

为了删代码，

破坏设计。

正确顺序：

```text
Design Quality
保持

↓

UX
保持

↓

Function
保持

↓

删除 implementation complexity
```

---

# 107. 最低功能验收

必须存在：

* Home
* Writing
* Article
* About
* 404
* RSS
* Sitemap
* SEO
* Responsive
* Dark Mode
* Markdown
* Article Metadata
* 基础微交互

---

# 108. 最低 UI 验收

必须存在：

* 明确 Typography System
* 明确 spacing rhythm
* 现代 Grid
* Responsive typography
* 高质量 Article layout
* hover states
* focus states
* selection
* designed footer
* designed 404
* mobile adaptation

---

# 109. 不接受的结果

以下结果视为失败：

## A

功能完整，

但像默认 Astro 模板。

失败。

---

## B

代码极少，

但页面粗糙。

失败。

---

## C

设计很炫，

但大量 JS、依赖和特效。

失败。

---

## D

UI 很漂亮，

但文章阅读困难。

失败。

---

## E

所有内容都塞进圆角卡片。

失败。

---

# 110. 成功标准

成功的 MiniBlog 应同时让人产生：

### 第一感觉

“很好看。”

### 第二感觉

“很舒服。”

### 第三感觉

“好像没有做很多东西。”

### 看源码之后

“居然这么简单。”

这就是 MiniBlog 最理想的状态。

---

# 111. MiniBlog 的核心矛盾

项目最值得探索的就是：

> **高级体验与极低复杂度能否同时存在？**

不要通过降低体验解决这个问题。

而应该通过：

**更聪明的设计。**

---

# 112. 一个具体判断方法

每增加一个功能或视觉元素时问：

## Does it improve experience?

如果否：

删除。

如果是：

继续。

## Can it be simpler?

如果是：

简化。

## Does simplification reduce quality?

如果是：

不要继续简化。

这是最重要的边界。

---

# 113. Complexity Budget

MiniBlog 有 Complexity Budget。

但同样存在：

# Quality Floor

Complexity Budget：

防止越来越复杂。

Quality Floor：

防止越来越简陋。

二者缺一不可。

---

# 114. Quality Floor

无论如何简化，都不能低于：

* 完整视觉层级
* 舒服排版
* 成熟响应式
* 基础交互反馈
* 良好可访问性
* 精致细节
* 品牌辨识度

如果降低复杂度导致这些能力消失：

**停止简化。**

---

# 115. UI 与代码的关系

MiniBlog 不是：

```text
Less Code
=
Better
```

而是：

```text
Excellent Experience
+
Low Complexity
=
Better
```

---

# 116. 未来扩展

未来可以自然增加：

* Tags
* Search
* Projects
* Photography
* Notes
* Comments
* Manual theme
* Internationalization
* Analytics
* AI

但第一版不要全部实现。

---

# 117. 扩展接口原则

不要为了未来扩展提前制造复杂系统。

只需要：

> 当前结构不会阻止未来增加。

---

# 118. 最终视觉气质

MiniBlog 应该接近：

**独立出版物**

而不是：

**模板网站。**

接近：

**个人数字杂志**

而不是：

**产品控制台。**

接近：

**现代编辑设计**

而不是：

**前端特效展厅。**

---

# 119. 最终设计关键词

开发过程中随时回到这些词：

```text
Quiet
Precise
Editorial
Contemporary
Personal
Intelligent
Readable
Restrained
Refined
Timeless
```

---

# 120. MiniBlog 最终宣言

MiniBlog 相信：

**简约不是减少设计。**

而是：

**减少没有价值的设计。**

MiniBlog 相信：

**高级感不是增加特效。**

而是：

**让每一个比例、文字、间距和动作都显得恰到好处。**

MiniBlog 相信：

**优秀工程不是让用户看到复杂度。**

而是：

**让复杂度消失在体验背后。**

因此：

我们不追求最少的页面。

不追求最少的 CSS。

不追求绝对零 JavaScript。

也不追求技术炫耀。

我们追求的是：

> **用最清晰的技术，实现最舒服的体验。**

---

# 121. Codex 最终任务

完整阅读本文件后：

请从当前仓库状态开始构建 MiniBlog Core V1。

首先检查已有项目。

然后制定实现计划。

之后直接完成：

* Architecture
* Content system
* UI
* UX
* Responsive
* Dark mode
* SEO
* RSS
* GitHub Pages
* README

不要等待逐项确认。

完成以后：

进行：

### Visual Polish Pass

然后：

### Simplification Pass

最后：

### Production Validation

---

# 122. 最终报告要求

任务完成后告诉我：

### 1

最终实现了什么。

### 2

项目结构。

### 3

用了什么依赖。

### 4

哪些部分包含 JavaScript。

### 5

如何启动。

### 6

如何写文章。

### 7

如何修改博客身份信息。

### 8

如何修改主要 Design Tokens。

### 9

如何部署。

### 10

让我按照什么顺序阅读代码。

### 11

你为了保持 MiniBlog 简单，主动没有实现哪些东西。

### 12

你为了保证审美品质，哪些地方刻意没有继续简化。

---

# 123. 最后一条原则

当你不知道某个东西该不该存在时：

不要只问：

> “能不能删除？”

同时问：

> “删除以后，还漂亮吗？”

> “删除以后，还舒服吗？”

> “删除以后，还像一个认真设计过的产品吗？”

如果答案是否定的：

**不要删除。**

---

# MiniBlog

**Simple, not crude.**

**Minimal, not empty.**

**Beautiful by design.**

**Simple by engineering.**

**Quiet, but memorable.**
