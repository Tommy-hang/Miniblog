---
title: "Understanding Attention"
description: "Why Q, K, and V are simpler than they first appear."
date: 2026-09-22
tags:
  - AI
---

Attention is often introduced as a wall of notation. Underneath it is a small, useful question: **what should this word notice right now?**

## Start with relationships

A sentence is not a bag of isolated words. In “the river reached the bank,” the meaning of *bank* depends on the words around it. Attention gives a model a way to measure those relationships.

The familiar names describe three roles:

- **Query** — what am I looking for?
- **Key** — what do I contain?
- **Value** — what information can I contribute?

> Attention is not memory. It is a way of deciding where to look before gathering information.

<figure class="wide">
  <img src="../../attention-map.svg" width="1200" height="560" alt="A simple diagram showing query, key, and value flowing into a weighted result" loading="lazy" />
  <figcaption>A relationship becomes a weight; the weight decides how much information moves forward.</figcaption>
</figure>

## The smallest useful version

In simplified pseudocode, the mechanism is compact:

```ts
const scores = query.map((q) => keys.map((k) => similarity(q, k)));
const weights = softmax(scores);
const context = weightedSum(weights, values);
```

The code is not the hard part. The useful intuition is that relevance is calculated *for the current context*, rather than stored as a fixed rule.

### A practical reading strategy

When a technical explanation becomes dense, keep returning to three questions:

1. What information enters the operation?
2. What decision does it make?
3. What changes as a result?

That approach works well beyond attention. It is a reliable way to make any system less mysterious.

---

The equations matter, but understanding begins one layer earlier: with a clear picture of the job the equations are doing.
