---
title: "9月24日AI探索速递"
description: "Five high-signal developments: Android Studio becomes
  agent-agnostic, Google turns REST APIs into MCP tools, Databricks adds
  a governance plane for coding agents, Google reproduces OLMo 3 across
  training stacks, and Microsoft extends Zero Trust to AI agents."
date: 2026-09-28
tags:
  - AI
draft: false
featured: false
---


# AI & Tech Daily Briefing --- September 24, 2026

Today's strongest signal is not a new flagship model. It is the
infrastructure around models becoming modular: **IDE ↔ agent, API ↔ MCP,
developer ↔ governance gateway, training recipe ↔ hardware, and agent ↔
security policy**.

The creative-AI news cycle was comparatively weak today, so this edition
deliberately favors deeper developer and systems signals rather than
filling a slot with a minor generative-media announcement.

## 1. Android Studio becomes agent-agnostic with Bring Your Own Agent

### English

Google announced **Bring Your Own Agent (BYOA)** for Android Studio,
rolling out in preview through Android Studio Rabbit 2 Canary.
Developers can connect Claude Agent, OpenAI Codex, Google Antigravity,
or other ACP-compliant agents instead of being locked to one built-in
assistant.

The important layer is **Agent Client Protocol (ACP)**. Android Studio
can supply project-graph and build context while injecting IDE-native
capabilities such as build diagnostics, Jetpack Compose previews,
Android SDK tools and emulator control. Agents can read and edit files,
run tests and shell commands, delegate to subagents, persist
configuration and pause for approval on riskier operations.

**Why it matters**

``` text
Developer → Android Studio → ACP → Agent of choice → Model of choice
                 │
      project graph / emulator / build / skills / permissions
```

The IDE is becoming an **agent runtime**, not an AI product tied to one
model. Workspace, agent harness and model are becoming separable layers,
so the environment can remain stable while the reasoning engine changes
underneath it.

**Dig deeper:**\
https://android-developers.googleblog.com/2026/09/build-your-way-use-any-ai-agent-in-android-studio.html

### 中文｜Android Studio 开始变成"Agent 无关"的开发环境

Google 推出了 **Bring Your Own Agent**：Android Studio
不再只让你选择模型，而是进一步允许你选择完整的 Coding Agent，例如 Claude
Agent、Codex 和 Google Antigravity。真正关键的是 ACP：IDE
自己掌握项目结构、Build、Compose Preview、Android SDK 与
Emulator，再把这些专业能力注入外部 Agent。

**为什么重要**

未来 IDE 的核心资产可能不再是"内置了哪个 AI"，而是：**能不能把任意优秀
Agent 安全、高效地接入真实开发环境。** 系统开始拆成
`Workspace ≠ Agent ≠ Model`，这比每家 IDE 永久绑定一个 Copilot
更开放，也更耐久。

**深入阅读：**\
https://android-developers.googleblog.com/2026/09/build-your-way-use-any-ai-agent-in-android-studio.html

------------------------------------------------------------------------

## 2. Google Cloud turns existing REST APIs into MCP tools at the gateway

### English

Google Cloud announced that **API Gateway can now act as a remote MCP
server in Public Preview**. Instead of building and operating a separate
MCP server, teams can annotate an existing OpenAPI 3 specification and
expose selected REST operations directly as agent-discoverable tools.

The gateway translates MCP `tools/call` requests into ordinary REST
requests and applies the authentication, quotas and logging already
configured for the API. REST and MCP therefore share one policy path
rather than creating parallel infrastructure stacks.

**Why it matters**

``` text
Old: Agent → custom MCP server → REST API → service
New: Agent → API Gateway/MCP → existing REST service
```

Most useful enterprise capability already exists behind APIs. If those
APIs can become agent-readable without being rewritten, MCP adoption
becomes less about rebuilding infrastructure and more about
**describing, governing and exposing existing capability**.

Google also notes that tool descriptions are a primary signal models use
when deciding whether to call a tool. API documentation is therefore
becoming part of the machine interface itself.

**Dig deeper:**\
https://developers.googleblog.com/turn-your-rest-apis-into-mcp-tools-with-google-cloud-api-gateway/

### 中文｜Google Cloud 正在把传统 REST 世界直接接到 MCP 世界

Google Cloud API Gateway 现在可以直接充当 Remote MCP
Server。你不必为了让 Agent 调用已有 API，再维护一套重复的 MCP Server；在
OpenAPI 3 中加入相应标注即可，而且原来的 Authentication、Quota 与
Logging 可以继续沿用。

**为什么重要**

互联网已经积累了几十年的 API。Agent
时代更可扩展的方向不是"全部重写"，而是：

``` text
Existing API → Machine-readable description → MCP exposure → Agent
```

MCP 因而可能逐渐成为旧 Web Infrastructure 与 Agent Infrastructure
之间的适配层。以后 API Description 也不只是写给人看的文档，它会直接影响
Agent 是否正确选择工具。

**深入阅读：**\
https://developers.googleblog.com/turn-your-rest-apis-into-mcp-tools-with-google-cloud-api-gateway/

------------------------------------------------------------------------

## 3. Databricks builds a control plane above competing coding agents

### English

Databricks introduced the **Unity Gateway CLI**, letting developers
continue to use coding agents such as Claude Code or Codex while
administrators centrally manage approved models, tools, authentication
and spending policies.

Developers can launch approved agents through commands such as
`ug claude` or `ug codex`; Unity Gateway applies organizational policy
underneath. Databricks frames the problem around a rapidly moving model
frontier: standardizing on one provider risks missing better options,
while supporting everything independently fragments budgets,
credentials, security rules and usage logs.

**Why it matters**

``` text
Developers
   ↓
Claude / Codex / other agents
   ↓
Governance Plane
(auth · budgets · tools · routing · policy · traces)
   ↓
Models + MCP + enterprise systems
```

Once many models and agents are available, the scarce resource is no
longer access to intelligence. It becomes **coordination and governance
of intelligence**. A durable agent architecture should therefore avoid
hard-wiring routing, cost telemetry, permissions and tool access to one
provider.

**Dig deeper:**\
https://www.databricks.com/blog/deploy-and-manage-coding-agents-scale-unity-gateway-cli

### 中文｜Databricks 开始在 Coding Agent 上面再建一层"控制平面"

Unity Gateway CLI 的思路不是再造一个 Coding Agent，而是让开发者自由使用
Claude Code、Codex 等 Agent，同时把 Authentication、Model、Tool、Budget
与 Policy 集中治理。

**为什么重要**

Agent 越来越多以后，问题会从"我有没有一个好
Agent？"变成"**我怎样管理很多不断变化的
Agent？**"这与云计算非常相似：实例变多以后，Orchestration
本身就成为基础设施。

对个人开发者同样有启发：Model Router、Cost Telemetry、Permission 与 Tool
Registry 最好逐渐从具体模型中解耦。

**深入阅读：**\
https://www.databricks.com/blog/deploy-and-manage-coding-agents-scale-unity-gateway-cli

------------------------------------------------------------------------

## 4. Google reproduces OLMo 3 7B across PyTorch/GPU and JAX/TPU --- and verifies the match properly

### English

Google and AI2 published a detailed reproduction of **OLMo 3 7B**
pre-training and mid-training in MaxText on Google Cloud TPUs. OLMo 3
exposes data, code, configurations, checkpoints, logs and evaluations,
giving the team an unusually strong independent reference for testing a
different framework and hardware stack.

The MaxText/JAX implementation matched the PyTorch reference on held-out
metrics rather than merely showing a similar training-loss curve. The
work reports cross-framework logit parity, exact checkpoint/resume
behavior in controlled comparisons, resizing a training job from 512 to
128 devices without changing the recipe, and moving a later stage to
another TPU generation. Held-out evaluation also caught a data-loader
bug that initially made the new implementation appear *better* because
it was memorizing data.

**Why it matters**

``` text
Same loss curve ≠ same behavior ≠ correct reproduction
```

Large-model engineering needs reproducibility surfaces: logits, held-out
evaluation, data order, checkpoint semantics, optimizer state and
downstream capability.

The work also shows why open models matter beyond "free weights." A
genuinely open training recipe becomes a **reference instrument** for
testing hardware, frameworks and optimization techniques.

**Dig deeper:**\
https://developers.googleblog.com/reproducing-olmo-3-7b-pre-training-in-maxtext-case-study-of-large-scale-training-on-tpus/

### 中文｜Google 用 OLMo 3 做了一次很"科学"的跨框架、跨硬件复现

Google 与 AI2 把 OLMo 3 7B 从 PyTorch/GPU 训练栈复现到了
MaxText/JAX/TPU，而且没有满足于"Loss Curve 看起来差不多"。他们检查 Logit
Parity、Held-out Metrics、Checkpoint Resume、Data Pipeline、不同 TPU
世代与训练集群规模变化。甚至有一次新实现看起来更强，最后通过 Held-out
Evaluation 发现其实是 Data Loader Bug 导致 Memorization。

**为什么重要**

这是一个值得建立的科研直觉：

``` text
Loss 差不多 ≠ 实现正确
```

模型训练是一整个系统。OLMo 真正开放的不只是 Weight，还有
Data、Code、Config、Log 与 Eval，因此它可以成为一种 **AI Training
Reference Instrument**。Open Model
的价值也因此不只是"免费使用"，还包括让行业拥有可验证新训练系统的公共参照物。

**深入阅读：**\
https://developers.googleblog.com/reproducing-olmo-3-7b-pre-training-in-maxtext-case-study-of-large-scale-training-on-tpus/

------------------------------------------------------------------------

## 5. Microsoft extends Zero Trust from human identities to AI agents

### English

Microsoft's September 24 Security update focuses explicitly on AI agents
now running on employee devices, cloud platforms and developer
workflows. Its new controls include discovery and inventory for local AI
agents and an effort to extend Zero Trust concepts to agent traffic.

Traditional enterprise security assumes users, applications and devices
are the main actors. Agents create another category: software that can
read context, invoke tools and take actions on behalf of people, often
across several systems.

**Why it matters**

Security architecture must evolve from:

``` text
Who is the user?
Is this device trusted?
Can this app access X?
```

toward:

``` text
Which agent is this?
Who delegated authority to it?
What tools may it call?
What data may it see?
What action is it attempting?
Should that action require approval?
```

Agent identity, delegated authority, runtime intent and action-level
audit trails are becoming first-class security primitives. **Agent
Governance is becoming infrastructure**, not a feature added after an
agent is built.

**Dig deeper:**\
https://www.microsoft.com/en-us/security/blog/2026/09/24/whats-new-in-microsoft-security-september-2026/

### 中文｜微软开始把 Zero Trust 从"人和设备"扩展到 AI Agent

Microsoft 今天的 Security Update 明确把 Local AI Agent
当成需要被发现、Inventory、治理和限制的新型系统
Actor。传统安全模型主要围绕 User、Device 与 Application，而 Agent
可能代表一个人读取上下文、调用多个 Tool，并连续执行一串动作。

**为什么重要**

未来安全系统必须回答新的问题：这个 Agent
是谁？谁授权它行动？它能看什么、调用什么？这一次 Action
是否合理？是否需要人类批准？

所以 Agent Identity、Delegated Authority、Runtime Intent 与 Audit Trail
会越来越像 OAuth、IAM 一样成为基础设施。这说明 Agent Governance
已经从"以后再考虑的安全问题"进入 Agent Stack 的底层。

**深入阅读：**\
https://www.microsoft.com/en-us/security/blog/2026/09/24/whats-new-in-microsoft-security-september-2026/

------------------------------------------------------------------------

# 带你一起剖析今天的信号

今天没有一个"GPT-X 发布"式的大新闻，但技术结构反而异常清晰：

## AI 正在经历一次解耦

``` text
过去：
Product
  └─ One AI Model

正在形成：
Workspace
   ↓
Agent
   ↓
Harness / Protocol
   ↓
Governance
   ↓
Router
   ↓
Model(s)
   ↓
Tools / APIs
```

**Signal 1 --- 模型正在从"产品本身"变成可替换部件。** Android Studio
BYOA 与 Databricks Unity Gateway 都在表达同一个判断：不要把 Workflow
永久绑定到一个 Agent 或 Model。真正应该长期保存的是
Workspace、Context、Tool、Permission、Evaluation 与 Workflow。

**Signal 2 --- MCP 的真正意义可能不是"让 Agent 多几个 Tool"。**
如果大量已有 REST API 可以直接映射成 MCP，那么互联网可能逐渐出现一层
**Agent-readable capability surface**。HTML
标准化了"机器怎样读取信息"，MCP
类协议则可能帮助标准化"机器怎样发现和调用能力"。

**Signal 3 --- Agent 的瓶颈正在从 Intelligence 转向 Coordination。**
更多模型并不自动等于更好的系统，反而会带来 Model Choice、Tool
Choice、Cost、Permission、Identity、Routing 与 Observability。Android
Studio 需要 ACP，Databricks 需要 Gateway，Microsoft 需要 Agent Zero
Trust，本质上是同一问题的三个切面：**智能越来越便宜以后，组织智能变得更贵。**

**Signal 4 --- 可验证正在成为 AI 工程最重要但最不性感的能力之一。** OLMo
3 reproduction 提醒我们：Loss 更低、Benchmark
更高都不足以证明系统正确。Agent
同样如此：`Agent 完成任务 ≠ Agent 正确完成任务`。Evaluation、Observability、Reproducibility、Verification
与 Audit 会越来越重要。

## 今天最值得保留的 Mental Model

``` text
                 Human Intent
                      │
                      ▼
                   Workspace
                      │
                      ▼
               Agent / Harness
                      │
              ┌───────┴───────┐
              ▼               ▼
          Governance       Context
              │               │
              └───────┬───────┘
                      ▼
                    Router
               ┌──────┼──────┐
               ▼      ▼      ▼
             Model  Model  Local Model
                      │
                      ▼
              MCP / API / Tools
                      │
                      ▼
                    Action
                      │
                      ▼
                 Verification
                      │
                      └──── feedback ───→ Agent
```

过去 AI 学习很容易围绕"模型是怎么工作的？"；现在应该逐渐增加另一个问题：

> **模型周围的系统是怎么工作的？**

今天五条新闻共同说明，下一阶段真正有迁移价值的能力，很可能就是 **AI
Systems
Engineering**：能够把模型、Agent、协议、工具、权限、成本、验证和真实软件环境组织成一个清晰、可替换、可观察的系统。
