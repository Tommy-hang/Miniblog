---
title: "9月28号AI探索速递"
description: "Five high-signal developments across agent containment, AI
  product interfaces, persistent-agent economics, creative AI finishing
  workflows, and hybrid local/cloud agent architecture."
date: 2026-09-29
tags:
  - AI
draft: false
featured: false
---

# AI & Tech Daily Briefing --- September 28, 2026

## 1. NVIDIA moves agent safety below the application layer

### English

On September 28, NVIDIA launched the Open Agent Safety Platform,
combining OpenShell with the Sentry reference design. OpenShell
constrains agent access to resources; Sentry is an out-of-band watchdog
designed to run on BlueField-4 DPUs and quarantine an agent in
milliseconds if it moves outside its permitted software boundary.

The important architectural idea is separation between the agent and its
strongest enforcement layer. NVIDIA says more than 100 organizations are
working with the platform or related technologies.

**Why it matters:** Agent containment is emerging as its own
infrastructure category. The stack increasingly needs application
policy, secure runtime boundaries, independent monitoring, least
privilege, auditability and out-of-band shutdown.

**Dig deeper:**\
https://nvidianews.nvidia.com/news/open-agent-safety-platform\
https://developer.nvidia.com/blog/nvidia-open-agent-safety-platform-a-reference-for-continuous-in-silicon-agent-monitoring/

### 中文

9 月 28 日，NVIDIA 发布 Open Agent Safety Platform。核心是 OpenShell +
Sentry：前者约束 Agent 可以访问的资源，后者作为独立
Watchdog，在更低层监控 Agent，并可在越界时进行 Quarantine。

**为什么重要：** Agent Safety 正从"模型是否听话"下沉为完整 Systems
Security 问题。未来 Agent Runtime 很可能像 Cloud 一样，天然包含
Policy、Credential Boundary、Audit Trail 和 Out-of-band Kill Switch。

------------------------------------------------------------------------

## 2. Microsoft reorganizes Copilot around Home, Code and Autopilot

### English

Microsoft announced a redesigned Copilot on September 25 around Home,
Code and Autopilot. The information architecture separates general
interaction, software creation and longer-running delegated work instead
of forcing every AI capability through one conversation thread.

A chat box is an excellent universal starting interface, but becomes
awkward once AI can edit files, run code, create artifacts and continue
asynchronously.

**Why it matters:** The central UI object is shifting from the *message*
to the *task*.

``` text
Intent → work mode → persistent task → progress / artifacts / controls
```

AI frontends increasingly need resumability, background execution,
permissions, artifact views and intervention controls.

**Dig deeper:**\
https://blogs.microsoft.com/blog/2026/09/25/introducing-the-new-copilot-with-home-code-and-autopilot/

### 中文

Microsoft 用 Home、Code、Autopilot 重构
Copilot。真正重要的不是三个入口本身，而是
Conversation、Building、Delegation 被拆成不同工作模式。

**为什么重要：** AI 产品的核心对象正在从 Message 迁移到 Task。未来
Frontend 不只负责 Streaming Markdown，而要理解 Task State、Background
Execution、Permission、Artifact 和 Human Intervention。

------------------------------------------------------------------------

## 3. GPT-6 prompt caching targets persistent-agent economics

### English

OpenAI's September 23 technical update explains improved prompt caching
for GPT-6. Persistent agents repeatedly carry forward system
instructions, tool definitions and accumulated context across many API
calls. Reusing computation for stable prefixes can reduce latency and
provide discounts of up to 90% on cached input tokens.

The design implication is important: stable instructions and tool
definitions should remain consistent and precede rapidly changing task
state.

**Why it matters:** Prompt architecture is becoming systems
architecture. Stable prefixes, state management, compaction and
cache-aware routing can materially change agent cost and latency without
changing the model.

**Dig deeper:**\
https://openai.com/index/better-prompt-caching-for-gpt-6/\
https://developers.openai.com/api/docs/guides/prompt-caching

### 中文

GPT-6 的 Prompt Caching 更新明确面向 Persistent Agent。长时间运行的
Agent 会不断重复携带 System Instruction、Tool Definition 和历史
Context，因此 Cache Hit 会直接影响真实成本。

**为什么重要：** Stable Prefix、Conversation State、Compaction 和
Cache-aware Routing 已经不只是 Prompt 技巧，而是 Agent Runtime
的系统设计问题。

------------------------------------------------------------------------

## 4. Adobe completes Topaz Labs acquisition: creative AI shifts from generation to finishing

### English

Adobe announced on September 23 that it completed its acquisition of
Topaz Labs. Topaz remains a standalone brand while its image/video
enhancement technology increasingly enters Adobe workflows such as
Firefly and Photoshop.

Topaz operates downstream of generation: restoration, denoising, detail
recovery, upscaling and temporal consistency. Adobe also highlights
Topaz's Neurostream technology for running complex enhancement models
on-device or in the cloud.

**Why it matters:** Professional Creative AI is becoming a pipeline
problem:

``` text
Idea → Generation → Selection → Edit → Enhance → Consistency → Delivery
```

The competitive advantage moves from owning one generator toward
orchestrating a portfolio of specialized models across production.

**Dig deeper:**\
https://blog.adobe.com/en/publish/2026/09/23/adobe-completes-acquisition-of-topaz-labs

### 中文

Adobe 完成 Topaz Labs 收购。Topaz
的价值主要在"生成之后"：Restoration、Denoising、Detail
Recovery、Upscaling 与 Temporal Consistency。

**为什么重要：** Creative AI 正从 Generation Competition 进入 Pipeline
Competition。真正成熟的工作流需要生成、选择、编辑、增强、一致性控制和最终交付，多模型编排的重要性会越来越高。

------------------------------------------------------------------------

## 5. Google demonstrates a cloud-planner / local-executor agent architecture

### English

Google's September 23 Antigravity SDK update supports offline local
agent workflows, initially optimized for Gemma 4 26B A4B through LiteRT.
The deeper signal is its Architect--Builder demo: Gemini 3.8 Flash
receives filenames and task descriptions and plans the work, while local
Gemma instances inspect source code, reproduce vulnerabilities, write
fixes, critique patches and run regression tests.

Google reports that its recorded three-file audit used only 95 cloud
tokens, uploaded no source code and processed 97.2% of tokens locally.
These are Google's demo figures rather than an independent benchmark.

**Why it matters:** The useful architecture is not Cloud AI *versus*
Local AI, but sparse frontier planning plus high-volume private local
execution.

``` text
Cloud planner → privacy boundary → local executors → files/tools → verification
```

This separates reasoning scarcity from context volume and enables
routing by capability, privacy, latency and cost.

**Dig deeper:**\
https://developers.googleblog.com/introducing-support-for-local-ai-models-in-the-antigravity-sdk/

### 中文

Google Antigravity 最值得学习的是 Architect--Builder：Cloud Gemini 只看
Filename 与 Task Description 做高层 Planning；Local Gemma
读取完整代码、修漏洞、Critique 并运行测试。

**为什么重要：** 不必再把 Local AI 与 Cloud AI 看成二选一。更合理的是让
Frontier Model 稀疏承担高级推理，让 Local Model 消化大量敏感 Context
与执行工作，再通过 Verification Layer 检查结果。

------------------------------------------------------------------------

# 带你一起剖析今天的信号

今天五条新闻可以拼成一套越来越成熟的 AI Systems Stack：

``` text
Human intent / judgment
        ↓
Product interface
        ↓
Agent runtime
   ┌────┴────┐
Cloud      Local
planner   executors
   └────┬────┘
        ↓
Tools / files
        ↓
Secure runtime
        ↓
Independent enforcement
```

**信号一：Agent Safety 正从模型行为问题变成计算机系统问题。** NVIDIA 把
Enforcement 下沉到 Agent 更难控制的层，本质上是在把经典的 Defense in
Depth、Least Privilege 与 Out-of-band Monitoring 引入 Agent Runtime。

**信号二："一个模型解决全部问题"的架构正在松动。** Stable Context 可以
Cache；Sensitive / High-volume Context 可以 Local；Hard Reasoning
可以交给 Frontier Cloud Model；Safety-critical Enforcement 可以交给独立
Runtime 或 Hardware。未来优化单位越来越像 Token / Task
Routing，而不是单一 Model。

**信号三：UI 的核心对象从 Conversation 变成 Work。** Agent
时代真正需要展示的是
Task、State、Files、Tools、Progress、Decisions、Artifacts 与
Permissions。核心 HCI
问题变成：怎样让人理解、监督并及时干预一个正在自主工作的系统？

**信号四：Creative AI 从 Model Competition 进入 Pipeline Competition。**
当 Generation 越来越便宜，瓶颈会后移到
Selection、Consistency、Enhancement、Editing 与 Delivery。Workflow
Thinking 因此比记住某一个模型更有长期迁移价值。

今天最值得保留的 Mental Model：

``` text
Good AI System
=
Task Decomposition
× Model Routing
× State Management
× Tool Execution
× Human Interface
× Containment
```

未来更有价值的问题不再只是 "Which model is best?"，而是：

> **Which architecture allocates each kind of work to the right
> intelligence, runtime and control layer?**

如果今天只做一个实验，可以画一张自己的 Hybrid Agent Architecture：Cloud
Planner 只看任务摘要，本地模型读取完整项目，Tools 在 Sandbox
中运行，再设计独立 Verification Layer；标清 Data Flow、Trust
Boundary、Token Flow 和 Human Decision Point。
