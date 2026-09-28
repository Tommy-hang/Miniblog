---
title: "9月25日AI探索速递"
description: "Five high-signal developments: Microsoft reorganizes Copilot around persistent agency; Stanford challenges AI benchmark validity; Docker makes long-running agent sandboxes portable; Lovable reveals a durable agent control plane; and Next.js prepares a coordinated nine-vulnerability security release."
date: 2026-09-28
tags:
  - AI
draft: false
featured: false
---

# AI & Tech Daily Briefing — September 25, 2026

Today’s strongest signal is not a new flagship model. It is AI products becoming persistent systems with runtimes, identities, event logs, sandboxes, evaluation and security boundaries. The creative-AI cycle was comparatively weak today, so this edition favors deeper systems news rather than filling a slot with a minor media-model announcement.

## 1. Microsoft reorganizes Copilot around asking, delegating, building — and persistent work

### English

Microsoft unveiled a major redesign of Copilot on September 25 around **Home, Code and Autopilot**. Home combines conversational Chat with Cowork for delegated end-to-end tasks and embeds Word, Excel and PowerPoint into the experience. Code lets people describe small apps, dashboards, automations and workflows in natural language, backed by a governed Microsoft 365 runtime.

The more consequential addition is Autopilot, formerly Scout: a cloud-hosted digital teammate with its own identity, memory, computer and workspace. Give it a role and objective and it can continue monitoring channels, following up on threads and running recurring work while the user is away. Microsoft is also adding routing between Chat, Cowork and Code plus FinOps controls for usage-based agentic work.

**Why it matters**

```text
Ask now          → Chat
Delegate task    → Cowork
Build tool       → Code
Own ongoing work → Autopilot
```

A chat turn may last seconds; a persistent agent may live for months. The latter needs identity, memory, permissions, runtime, cost controls, auditability and recovery. Microsoft is effectively treating **persistence as a product primitive**.

**Dig deeper:**  
https://blogs.microsoft.com/blog/2026/09/25/introducing-the-new-copilot-with-home-code-and-autopilot/

### 中文｜Microsoft Copilot 开始围绕“提问、委派、构建、持续工作”重新组织

微软把 Copilot 重构成 Home、Code、Autopilot 三个核心入口。Home 合并即时 Chat 与端到端执行任务的 Cowork；Code 让非程序员也能通过自然语言构建 App、Dashboard 与 Workflow。Autopilot 则拥有自己的 Identity、Memory、Computer 与 Workspace，可以在用户离开以后继续执行职责。

**为什么重要**

“AI Assistant”正在被拆成不同的 Agency Mode。尤其当 Agent 从“一次 Task”变成“长期 Role”以后，Memory、Identity、Permission、Runtime、FinOps、Audit 与 Recovery 都会成为核心架构。微软真正产品化的不只是更聪明的 AI，而是 **Persistence as a primitive**。

**深入阅读：**  
https://blogs.microsoft.com/blog/2026/09/25/introducing-the-new-copilot-with-home-code-and-autopilot/

---

## 2. Stanford asks whether AI benchmarks actually measure what their names claim

### English

Stanford HAI highlighted two studies on September 25 applying measurement science and psychometrics to AI evaluation. Across 56 widely used benchmarks, researchers found recurring problems with **construct validity**: tests claiming to measure the same property can disagree, while a benchmark can accidentally measure a different capability from the one on its label.

A bias benchmark, for example, can reward a biased model that recognizes a trick question while penalizing an unbiased model with weaker reading comprehension. The score has entangled bias with test-taking ability.

**Why it matters**

```text
Model → Benchmark → Score → "Capability"
```

contains a hidden question: does the benchmark actually isolate that capability? As scores influence investment, routing, safety claims, procurement and regulation, weak measurement becomes an infrastructure problem. Agent builders should evaluate the **actual outcome they care about**, not merely a proxy that is easy to score.

**Dig deeper:**  
https://hai.stanford.edu/news/the-tests-that-grade-ai-may-be-getting-it-wrong

### 中文｜Stanford 追问：AI Benchmark 到底有没有测到它声称测的东西？

研究者没有继续造“更难的新 Benchmark”，而是把 Measurement Science 与 Psychometrics 用在 Benchmark 自己身上。56 个常用测试中反复出现 Construct Validity 问题：两个都声称测 Reasoning 或 Bias 的测试可能并不一致，一个 Bias Benchmark 甚至可能混入 Reading Comprehension 与 Test-taking Skill。

**为什么重要**

`Benchmark 高 → 能力强` 中间缺少关键问题：**这个测试真的隔离出了我们关心的能力吗？** 对 Agent Evaluation 同样如此：不要只测容易自动打分的 Proxy，而应尽量测真实任务最终有没有正确完成。

**深入阅读：**  
https://hai.stanford.edu/news/the-tests-that-grade-ai-may-be-getting-it-wrong

---

## 3. Docker makes long-running agent work portable between laptop and cloud

### English

Docker launched **Cloud Sandboxes** on September 24, extending its microVM-based agent isolation from local machines to Docker-managed cloud compute. Developers can start an agent locally, move the sandbox filesystem to the cloud with one command, close the laptop, and later bring the work back.

The product targets tasks lasting hours: refactors, migrations, long test loops and parallel agent jobs. Sandboxes carry agent kits, MCP connectivity, network policy and controlled secret access. Docker also proposed an open Sandbox Kit specification with CNCF participation, built on OCI, to describe not only the environment but **what authority the agent receives**.

**Why it matters**

```text
Laptop session
   ↓
portable sandbox
   ↓
cloud execution
   ↓
hours of autonomous work
   ↓
result returns
```

Once agents work asynchronously, execution location becomes infrastructure. More importantly, **authority as code** may become a core agent concept: containers standardized what software needs to run; agent kits may need to standardize what autonomous software is allowed to touch.

**Dig deeper:**  
https://www.docker.com/blog/introducing-cloud-sandboxes-start-on-your-laptop-finish-in-the-cloud/  
https://www.docker.com/blog/docker-sandbox-kit-spec-cncf/

### 中文｜Docker 让长时间 Agent 工作在“本地 ↔ 云端”之间迁移

Cloud Sandboxes 把 microVM Agent Sandbox 延伸到云端。你可以先在本地与 Agent 交互，任务变成长时间 Refactor、Migration 或 Test Loop 后，把整个 Sandbox State 移到云端，让电脑关机后任务继续。

**为什么重要**

Agent 的运行模式开始分化：Interactive Work 适合本地，Long-running Work 适合 Cloud，Parallel Swarm 需要 Elastic Sandboxes。Docker 同时推动 Sandbox Kit Specification，意味着未来不仅要描述“软件运行需要什么”，还要描述“**自主软件被允许做什么**”。这就是很值得记住的 **Authority as Code**。

**深入阅读：**  
https://www.docker.com/blog/introducing-cloud-sandboxes-start-on-your-laptop-finish-in-the-cloud/  
https://www.docker.com/blog/docker-sandbox-kit-spec-cncf/

---

## 4. Lovable reveals the control plane behind agents that survive deploys

### English

Lovable published a technical look on September 24 at the architecture behind its Chats system. Rather than treating conversation as one ephemeral request/response stream, it models agent activity as durable **trajectories** recorded in a Git-inspired event log.

Trajectories, inboxes and activations let agents receive events, resume work, fork into alternate paths and survive deployments. The agent’s “life” is therefore no longer identical to one process running on one server.

**Why it matters**

```text
Event log
   ↓
Trajectory
   ↕
Inbox ← external events
   ↓
Activation
   ↓
Agent step
   ↓
new events → Event log
```

This resembles event-sourced distributed systems more than a chatbot. Serious agent backends increasingly require queues, idempotency, durable state, event sourcing, resumability and observability—not just model APIs.

**Dig deeper:**  
https://lovable.dev/blog  
See “Inside Chats: How Lovable's Agents Work Together” — September 24, 2026.

### 中文｜Lovable 公布了“能够跨部署继续活着”的 Agent Control Plane

Lovable 用 Trajectory、Inbox、Activation 与类似 Git 的 Event Log，把 Agent 的执行过程持久化为可以恢复、Fork、继续运行的历史。Backend Deploy、页面刷新或外部 Event 延迟到达，都不必让 Agent 的工作随某一个 Process 消失。

**为什么重要**

Agent Backend 正越来越像 Distributed Systems，而不是简单的 `while True: call_llm()`。模型决定每一步有多聪明；**Control Plane 决定 Agent 能不能活得足够久、失败后能否恢复、多个 Agent 能否协作。** 这正是 Full-stack Engineering 与 Agent Engineering 的交汇处。

**深入阅读：**  
https://lovable.dev/blog

---

## 5. Next.js prepares a coordinated security release for nine vulnerabilities

### English

The Next.js team announced on September 23 that it plans a coordinated security release for September 30 covering **nine vulnerabilities**: one critical, two high, five medium and one low. Planned patched releases are Next.js 16.3.7 and 15.5.27.

This follows an out-of-band September 22 update for a separate critical upstream issue. The team is giving advance notice so organizations can reserve an upgrade window without prematurely disclosing exploit details.

**Why it matters**

This deliberately non-AI item is a useful reality check:

```text
AI writes app faster
      ↓
More code ships
      ↓
Dependencies still exist
      ↓
Framework vulnerability
      ↓
Patch discipline still matters
```

Agents can automate advisory reading, upgrade branches, tests and migration summaries, but the final security boundary should remain deterministic: CI policies, version checks, scanners and explicit approvals.

**Dig deeper:**  
https://nextjs.org/blog

### 中文｜Next.js 提前预告 9 个漏洞的集中安全更新

Next.js 将在 9 月 30 日集中修复 9 个漏洞：1 Critical、2 High、5 Medium、1 Low，对应计划版本 16.3.7 与 15.5.27。此前 9 月 22 日才刚因另一个 Critical Upstream Issue 紧急更新。

**为什么重要**

AI 让写代码更快，并不会让 Dependency Risk 自动消失。反而代码产出越快，Supply-chain Hygiene 越重要。很适合自动化的 Agent Workflow 是：读取 Advisory → 建 Upgrade Branch → 跑 Test → 生成 Migration Summary → Human Approval → Merge；但安全边界仍应依赖 deterministic CI、Version Policy 与 Approval。

**深入阅读：**  
https://nextjs.org/blog

---

# 带你一起剖析今天的信号

今天最值得注意的变化是：

## Agent 正在从函数变成进程，再从进程变成“数字组织成员”

```text
早期 LLM:
input → model → output

早期 Agent:
goal → loop → tools → result

Persistent Agent:
Identity + Memory + Runtime + Events + Authority + Verification + Cost/Audit
```

Microsoft 的 Autopilot 需要 Identity、Memory、Computer 和 Workspace；Docker 解决 Agent 在哪里安全运行以及拥有什么 Authority；Lovable 解决 Agent 如何跨时间、Event 和 Deployment 连续存在。这三件事情其实拼出了同一台机器。

**Signal 1 — Persistence may be the next major capability axis.** 我们习惯比较 Reasoning、Coding、Math、Vision，但长期 Agent 多了一个完全不同的问题：它能不能可靠地活 1 小时、1 天、1 个月？持续时间越长，Action 和 State 越多，Drift 与 Failure 的机会越多，所以 Long-horizon Agent 并不只是 Context Window 更长，而是 **Distributed Systems + AI**。

**Signal 2 — Agent Runtime may become as important as the model.** 可以做一个 Mental Model：`Model ≈ CPU`，`Agent Runtime ≈ OS`，`Sandbox ≈ Process Isolation`，`Event Log ≈ Durable State`，`Tools ≈ System Calls`。CPU 再强，没有 OS 很难形成完整计算环境；Model 再强，没有 Runtime、Permission、Recovery 与 Verification，也很难形成可靠的长期 Agent。

**Signal 3 — Evaluation must move from scoring models to measuring systems.** Stanford 的研究提醒我们，静态模型的单一“Reasoning Score”都可能存在 Construct Validity 问题，更不用说一个运行数小时、调用几十个 Tool 的 Agent。未来 Agent Eval 更可能是：

```text
Task success
+ Time
+ Cost
+ Tool calls
+ Human interventions
+ Recovery rate
+ Security violations
+ Side effects
```

**Signal 4 — AI does not repeal software engineering.** Next.js 是今天很好的冷水。真实系统仍然有 Dependencies、CVE、Auth、Network、Runtime、Deployment、Rollback、Observability。AI 不会让这些层消失；真正发生的是 AI 正在进入这些层。

## 今天最值得保留的 Mental Model

```text
Useful Persistent Agent
=
Intelligence
× Runtime
× Memory
× Authority Control
× Observability
× Evaluation
× Recovery
```

这是乘法：其中任何一项接近 0，整个系统都可能失去实际价值。

最近高质量技术新闻越来越多地讨论 Sandbox、Gateway、Identity、Memory、Event Log、FinOps、Evaluation 和 Security，而不只是 Benchmark 又高了几个百分点。这不是 AI 热潮退潮，反而说明：

> **AI 正从 Demo 进入真正的软件工程阶段。**
