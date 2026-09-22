---
title: "MiniBlog"
description: "一次关于低复杂度数字出版的实验。"
date: 2026-09-22
tags:
  - Web
  - Design
status: active
featured: true
cover: ./cover.svg
repo: https://github.com/Tommy-hang/Miniblog
demo: https://tommy-hang.github.io/Miniblog/
---

## 概览

MiniBlog 是一个现代个人出版物，也是一次长期实验：一个网站究竟需要多少复杂度，才能提供真正优秀的数字阅读体验？

它不是要构建尽可能小的网站，而是要构建一个完整、精致、令人难忘的网站——同时让它的实现简单到令人意外。

## 问题与背景

个人网站经常滑向两个极端。

一端不断堆积框架、依赖、后台、特效和抽象，直到发布一篇文章需要理解一整个软件平台。另一端把“极简”误解为没有设计：默认字体、一个居中容器，以及对层级和节奏的漠视。

MiniBlog 想探索的是中间这条更困难的路。

## 设计哲学

视觉方向由三个概念定义：

- **Editorial Minimalism** —— 像编辑设计一样思考，而不是像模板一样思考。
- **Quiet Interaction** —— 用细微的字号、对齐、边线和动作形成丰富性，而不是用特效。
- **Contemporary Digital Publishing** —— 像一本独立数字杂志，而不是一个产品控制台。

两条边界约束着所有决策：**复杂度预算**防止系统为了“专业”而膨胀，**质量底线**防止简化以粗糙告终。

## 工程结构

整个系统刻意保持透明：

- Astro 负责静态生成、路由与内容组织；
- Markdown 与 Content Collections 让写作保持为普通文本文件；
- 原生 CSS 直接表达视觉系统，没有额外的样式抽象；
- 最终页面不携带任何客户端 JavaScript。

内容与代码彻底分离：作者日常只需要写 Markdown、放图片、提交 git。

## 结果

V1.1 建立了真正的内容基础：中英双语的写作系统、独立的项目库、与内容同处的媒体资产工作流，以及为两种语言分别设计的排版。

它不是功能的堆积，而是出版基础的完善。
