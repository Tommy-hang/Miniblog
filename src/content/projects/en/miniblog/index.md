---
title: "MiniBlog"
description: "A study in low-complexity digital publishing."
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

## Overview

MiniBlog is a modern personal publication and a long-running experiment: how much technical complexity does a website actually need in order to deliver an excellent digital reading experience?

It is not an attempt to build the smallest possible website. It is an attempt to build a complete, refined, and memorable website whose implementation stays surprisingly easy to understand.

## Problem and context

Personal websites tend to drift toward one of two extremes.

Some accumulate frameworks, dependencies, dashboards, effects, and abstractions until publishing an article requires understanding an entire software platform. Others mistake minimalism for the absence of design: default typography, one centered container, and little attention to hierarchy or rhythm.

MiniBlog explores the harder path between them.

## Design philosophy

The visual direction is defined by three ideas:

- **Editorial Minimalism** — think like an editor, not like a template.
- **Quiet Interaction** — richness through subtle scale, alignment, rules, and motion rather than spectacle.
- **Contemporary Digital Publishing** — closer to an independent digital magazine than a product console.

Two constraints govern every decision: a **complexity budget** that keeps the system from expanding to look professional, and a **quality floor** that keeps simplification from turning crude.

## Engineering

The whole system is deliberately transparent:

- Astro handles static generation, routing, and content.
- Markdown and Content Collections keep writing as ordinary text files.
- Native CSS expresses the visual system without another abstraction layer.
- The final pages ship no client-side JavaScript.

Content and code are fully separated: day to day, the author only writes Markdown, drops in images, and commits to git.

## Result

V1.1 establishes a true content foundation: a bilingual writing system, a dedicated project collection, media assets that live next to their content, and typography designed separately for each language.

It is not a pile of features. It is a better publishing foundation.
