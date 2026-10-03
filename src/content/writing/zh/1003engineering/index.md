---
title: "Codex_Harness_1003"
description: "A first-principles reverse engineering of the Codex harness:
  how context, iterative tool use, execution environments, verification,
  recovery, safety boundaries, skills, and multi-agent infrastructure
  turn a language model into a practical engineering agent."
date: 2026-10-04
tags:
  - Engineering
  - AI
draft: false
featured: false
---

# Reverse Engineering the Codex Harness --- Why the Agent Loop Matters More Than the Model

> **Research objective:** This is not a Codex product review. It uses
> the Codex harness to study a deeper engineering question: **what must
> be built around a language model before it can reliably perform
> long-horizon work in a real environment?**

# Part I --- English Research Article

## 1. Research Introduction

AI coding systems are often compared by model intelligence. That
increasingly misses the system-level problem.

A model alone cannot inspect a repository, obey project instructions,
execute a compiler, modify files, observe test failures, recover from a
bad hypothesis, request permission for risky actions, preserve task
state, or coordinate parallel workers. Those capabilities exist
**around** the model.

That surrounding system is the **agent harness**.

OpenAI describes the Codex harness as the agent loop and execution logic
underlying Codex experiences. In the CLI, it repeatedly alternates
between model inference and tool execution until the model produces a
final response. The same core harness can sit behind different clients
through the Codex App Server, while the newer Agents API exposes related
managed harness and runtime infrastructure.

A useful equation is:

``` text
Model
+ Context
+ Tools
+ Execution Environment
+ Permissions
+ Feedback
+ State
+ Evaluation
= Working Agent
```

A strong model is potential intelligence. A strong harness determines
whether that intelligence becomes reliable work.

------------------------------------------------------------------------

## 2. Evolution Background

### Traditional Software

``` text
Input → Programmed Logic → Function Calls → Output
```

Behavior is explicit and predictable, but brittle when tasks cannot be
enumerated in advance.

### Chatbot

``` text
User Intent → Context → LLM → Generated Response
```

Natural language becomes a universal semantic interface, but the system
remains mostly passive.

### Tool-using LLM

``` text
Model → Structured Tool Call → External System → Observation → Model
```

Language becomes a control surface. The model can read files, search
code, run commands, or query APIs.

### Agent System

Useful engineering work is iterative:

``` text
Inspect → Hypothesize → Modify → Test → Observe → Correct
```

The central architecture becomes a loop:

``` text
User Goal
 ↓
Context Construction
 ↓
Model Inference
 ↓
Tool Call
 ↓
Environment
 ↓
Observation
 ↓
Updated Context
 └────────────→ Model Inference
```

### Agent Ecosystem

Once the loop works, the stack expands:

``` text
Single Agent
 ↓
Skills
 ↓
MCP / Plugins
 ↓
Subagents
 ↓
Isolated Worktrees / Sandboxes
 ↓
Automations
 ↓
Persistent Cloud Runtime
```

The bottleneck shifts from model intelligence alone toward environment
design, context quality, tools, feedback, safety, and orchestration.

------------------------------------------------------------------------

## 3. First-Principles Analysis

### Requirement

We want an AI system to accept an underspecified objective:

``` text
Fix the authentication regression,
add tests,
and preserve API compatibility.
```

and convert it into real work.

### Constraints

1.  The model cannot automatically see the repository.
2.  It cannot change files by thought alone.
3.  Its first hypothesis can be wrong.
4.  Context is finite.
5.  Shell, filesystem, network, and secrets create risk.
6.  Long tasks require state across many inference cycles.

### Technical Principle

The natural solution is a closed loop:

``` text
Sense → Reason → Act → Observe → Evaluate → Repeat
```

The same pattern appears in robotics, control theory, debugging, and
scientific experimentation.

### Design Choice

The harness owns responsibilities that should not live only inside model
reasoning:

``` text
Prompt construction
Tool registration
Tool execution
Sandbox enforcement
Conversation/task state
Environment metadata
Permission handling
Context management
Event streaming
Client protocol
```

The model proposes. The harness mediates. The environment determines
consequences.

### Trade-off

A chatbot is simple:

``` text
User → Model → Response
```

A production agent is complex:

``` text
User → Client → Harness → Model / Tools / Environment / Safety / State
```

The extra architecture buys agency, reliability, observability, and
safety.

------------------------------------------------------------------------

## 4. System Overview

The key abstraction is:

``` text
Codex Model ≠ Codex Agent
```

The model performs inference. The harness turns inference into a
stateful interaction process.

``` text
User
 ↓
Client / UI
 ↓
Codex Harness
 ├── Context Builder
 ├── Agent Loop
 ├── Tool Dispatcher
 ├── State Manager
 ├── Permission Policy
 └── Event Stream
 ↓                 ↓
Model          Environment
               shell/files/MCP
```

The App Server is architecturally important because it separates the
harness from individual user interfaces. CLI, IDE, desktop, or web
clients can talk to a stable agent boundary rather than reimplementing
the loop.

> **The agent should be a service boundary, not a UI implementation
> detail.**

------------------------------------------------------------------------

## 5. Workflow Reverse Engineering

### 5.1 User Input --- Request to Goal State

Suppose the user asks:

``` text
Refactor the upload pipeline so large files do not exhaust memory.
Keep the public API compatible and add regression tests.
```

A weak system sees "generate code." A strong agent derives a target
state:

``` text
Memory behavior improved
AND API compatibility preserved
AND regression coverage added
AND repository remains healthy
```

The agent is moving an environment from state A to state B.

**Advantage:** multiple implementation strategies remain possible.\
**Trade-off:** natural-language goals are incomplete, so the agent may
need clarification or explicit assumptions.

### 5.2 Context Engineering --- Constructing the Agent's World

Codex can combine model instructions, sandbox rules, project
instructions, skill metadata, environment information, tool schemas,
conversation history, and the user's goal.

``` text
Base Instructions
+ Sandbox Policy
+ Project Instructions
+ Skill Metadata
+ Environment Context
+ Tools
+ History
+ User Goal
= Effective Context
```

Project-level instruction files such as `AGENTS.md` let organizational
knowledge live outside model weights.

This is more than prompting. It is **world construction**: the harness
chooses which parts of reality become visible to the model.

The optimization target is not maximum context, but:

``` text
Maximum Relevant Information / Context Token
```

### 5.3 Understanding --- Intent Meets Evidence

The model maps an abstract phrase such as "upload pipeline" to concrete
repository reality:

``` text
Intent → Search → Modules → Data Flow → Failure Mechanism
```

Reliable understanding combines:

``` text
Model Prior Knowledge + Environment Evidence
```

A coding agent should inspect *this* system rather than merely recall
how similar systems usually work.

### 5.4 Planning --- Externalized Task State

An explicit plan can act as a lightweight state machine:

``` text
Goal
 ↓
inspect
 ↓
diagnose
 ↓
modify
 ↓
test
 ↓
verify
```

For long tasks, the agent must track what is done, what remains, and
what failed.

Implicit planning is cheap and flexible for small tasks. Explicit
planning adds bookkeeping but improves observability and stability as
horizon length grows.

``` text
Task Complexity ↑ → Value of Explicit State ↑
```

### 5.5 Tool Calling --- Reasoning Becomes Side Effects

Tool definitions expose structured actions. A shell tool, for example,
can define command, working directory, and timeout; MCP tools can add
external capabilities.

``` text
Reasoning
 ↓
Structured Intent
 ↓
Harness Validation
 ↓
Tool Execution
 ↓
Side Effect
```

A good tool exposes the **smallest useful action surface**: broad enough
to compose, narrow enough to constrain ambiguity and risk.

### 5.6 Memory --- More Than a Vector Database

Coding-agent state includes:

``` text
Conversation History
Tool History
Filesystem State
Git State
Plan State
Project Instructions
Intermediate Artifacts
```

The filesystem is memory. Git is memory. Tests preserve expected
behavior. `AGENTS.md` is organizational memory. Skills are procedural
memory.

A richer taxonomy is:

``` text
Context Memory        — what the model currently sees
Environmental Memory  — persistent files/repository
Procedural Memory     — skills and reusable methods
Task Memory           — plan/progress/intermediate state
Organizational Memory — conventions and policy
```

### 5.7 Execution --- Environment Is Part of the Agent

Commands run in an environment containing some combination of
repository, compiler, test runner, package manager, Git, filesystem,
runtime, and dependencies.

A model without a compiler cannot empirically verify compilation. A
model without a browser cannot inspect a rendered UI.

Therefore:

``` text
Effective Agent Capability
≈ Reasoning Capability × Environment Capability
```

The environment is not plumbing. It is part of the cognitive system.

### 5.8 Observation --- New Evidence Changes the Policy

``` text
Action: run targeted tests
Observation: 2 failed, 41 passed
Evidence: stream closes before async flush completes
```

The next inference operates on a changed state.

``` text
Generate
```

becomes:

``` text
Hypothesize → Experiment → Observe → Update
```

This is closer to scientific reasoning than one-shot generation.

### 5.9 Evaluation --- Ground Truth Outside the Model

The model can believe its patch is correct and still be wrong.

External evaluators include:

``` text
Compiler
Linter
Type Checker
Unit Tests
Integration Tests
Screenshots
Benchmarks
Diff Review
```

The governing rule is:

> **Prefer executable feedback over self-confidence.**

In an agent-first engineering organization, designing tests,
observability, and feedback loops becomes part of designing the
environment in which agents can work.

### 5.10 Recovery --- Failure as Normal State Transition

Failure can mean:

``` text
command error
test failure
missing dependency
permission denied
wrong hypothesis
insufficient context
```

A robust loop treats failure as observation:

``` text
Failure → Interpret → Update Belief → Recover
```

Recovery may mean retry, change arguments, inspect more context, use
another tool, revert, re-plan, ask the user, escalate permission, or
stop safely.

### 5.11 Output --- The Message Is Not the Product

The actual output of a coding agent may be:

``` text
Modified code
Tests
Configuration
Artifact
Git diff
Deployment
Pull request
```

Agent UX must distinguish narrative output from environmental output.
Diffs, logs, worktrees, artifacts, and review surfaces therefore become
first-class interfaces.

------------------------------------------------------------------------

## 6. Architecture Diagrams

### Core Agent Loop

``` text
User Goal
 ↓
Context Builder
 ↓
Model
 ├── Final Response → Done
 └── Tool Request
        ↓
      Harness
        ↓
    Environment
        ↓
    Observation
        └────────→ Context → Model
```

### Context Construction

``` text
Model Instructions ─────┐
Sandbox Policy ─────────┤
Project Instructions ───┤
Skill Metadata ─────────┤
Tool Schemas ───────────┼──→ Effective Context
Environment State ──────┤
Conversation History ───┤
User Goal ──────────────┘
```

### Reliability Loop

``` text
Intent → Implementation → Executable Check → Observation
                           ↑                  │
                           └── Revision ← Diagnosis ← Failure
```

### Safety Boundary

``` text
Agent Intention
 ↓
Permission Policy
 ├── allowed → Sandbox → Execution
 └── boundary crossing → Review / Approval → Execution
```

------------------------------------------------------------------------

## 7. Core Design Decisions

### Stateless Requests and Prefix Preservation

OpenAI's Codex agent-loop engineering write-up explains that later
requests preserve the prior prompt as an exact prefix, enabling prompt
caching. Codex also favors stateless request construction rather than
depending entirely on server-side response state, including for
zero-data-retention compatibility.

This is a state-ownership decision:

``` text
Repeated payload + client-owned state
```

in exchange for:

``` text
Reproducibility
Statelessness
ZDR compatibility
Prompt-cache friendliness
```

### Native Sandbox Instead of Constant Approval

The two naive extremes are:

``` text
Ask before almost everything
```

or:

``` text
Give unrestricted access
```

Codex instead constrains the default environment and escalates
boundary-crossing operations.

``` text
Safe Autonomy
=
Constrained Default Environment
+
Exceptional Escalation
```

### Auto-Review as Separation of Powers

OpenAI has described an auto-review system in which a separate reviewer
agent evaluates boundary-crossing actions. Published results reported
roughly 200× fewer synchronous human interruptions than manual approval
mode, while about 99% of reviewed actions were approved.

The architecture matters more than the number:

``` text
Worker Agent
 ↓
Risky Action
 ↓
Reviewer Agent
 ↓
Approve / Deny / Escalate
```

The worker optimizes task completion; the reviewer optimizes policy
compliance. These objectives need not live in the same reasoning
process.

### App Server --- Harness / Interface Decoupling

Without a common boundary:

``` text
CLI Logic
IDE Logic
Desktop Logic
Web Logic
```

can diverge.

With App Server:

``` text
CLI ──────┐
IDE ──────┼──→ App Server → Harness
Desktop ──┤
Web ──────┘
```

The agent loop becomes reusable infrastructure.

### Skills --- Procedural Knowledge Outside Model Weights

Skills package instructions, resources, and scripts.

``` text
General Intelligence
+
External Procedural Knowledge
```

This creates two update speeds:

``` text
Model Weights = slow-changing general capability
Skills        = fast-changing organizational procedure
```

### Worktrees --- Parallel Intelligence Needs State Isolation

``` text
Agent A → Worktree A
Agent B → Worktree B
Agent C → Worktree C
```

Parallel agents become safer when mutable state is isolated, analogous
to process isolation in operating systems.

------------------------------------------------------------------------

## 8. Technical Principles

### Software Engineering --- Separation of Concerns

Client UI, harness, model, tools, environment, and safety policy can
evolve independently.

### Operating Systems --- Permissions and Isolation

A coding agent needs filesystem access, process execution, network
access, resource limits, and permissions. Sandboxing is therefore an OS
problem.

Future agent runtimes increasingly resemble:

``` text
Scheduler
+ Permission System
+ Process Isolation
+ Filesystem
+ IPC
+ Audit
```

### Distributed Systems --- Long-Running State

Cloud agents running for hours or days require durability, retries,
checkpointing, partial-failure handling, artifact persistence, and event
delivery.

Long-running agents are distributed systems with reasoning inside them.

### Control Theory --- Feedback Over One-Shot Intelligence

``` text
Goal → Controller → Action → Environment → Observation → Feedback
```

A slightly weaker model with excellent executable feedback can
outperform a stronger model operating open-loop.

``` text
Intelligence + Feedback > Intelligence Alone
```

### Machine Learning --- Context as Dynamic State

During a task, model weights are fixed while context evolves:

``` text
Action_t = Model(Context_t)
```

and:

``` text
Context_t+1 = Context_t + Action_t + Observation_t+1
```

The harness builds external recurrent state around stateless inference.

The agent is therefore the neural network **plus the state-transition
machinery around it**.

### HCI --- From Command Interface to Delegation Interface

Traditional developer UX optimizes individual operations. Agent UX
optimizes delegation:

``` text
state intent
observe progress
review changes
intervene when necessary
```

The question changes from "How quickly can I perform this action?" to:

> **How confidently can I delegate this objective?**

That requires visibility, control, reviewability, interruptibility, and
calibrated trust.

------------------------------------------------------------------------

## 9. Reconstruction --- Build a Mini-Codex

### Stage 0 --- One-Shot Assistant

`User → LLM → Code`. Learn prompting.

### Stage 1 --- Read-Only Repository Agent

Add `list_files`, `read_file`, `search_text`. Learn tool-mediated
understanding.

### Stage 2 --- Writable Agent

Add `write_file` and `apply_patch`; show a Git diff. Learn environmental
state.

### Stage 3 --- Execution Agent

Add `run_command` and `run_tests`.

``` text
Edit → Execute → Observe → Correct
```

Learn closed-loop reasoning.

### Stage 4 --- Context Engineering

Add project instructions, environment context, and precise tool
descriptions. Learn context as architecture.

### Stage 5 --- Sandbox

Define writable roots, network policy, timeout, and process limits.
Learn safe agency.

### Stage 6 --- Permission Escalation

``` text
Safe → Auto
Boundary Crossing → Ask
Forbidden → Deny
```

Learn capability security.

### Stage 7 --- Explicit Evaluation

Require measurable completion conditions: tests pass, lint passes,
requested artifact exists, diff inspected.

### Stage 8 --- Skills

Create reusable `SKILL.md`, scripts, references, and templates. Learn
procedural memory.

### Stage 9 --- App Server

``` text
CLI ─┐
Web ─┼→ Agent Server → Harness
IDE ─┘
```

Learn platform architecture.

### Stage 10 --- Parallel Agents

``` text
Planner
 ├── Worker A → Worktree A
 ├── Worker B → Worktree B
 └── Worker C → Worktree C
```

Merge only validated outputs. At this point, you are building an **agent
runtime**, not merely an LLM app.

------------------------------------------------------------------------

## 10. Skill Extraction

### Repository Reconnaissance

`Inspect Tree → Locate Instructions → Entry Points → Dependencies → Architecture`

### Bug Diagnosis

`Reproduce → Evidence → Hypotheses → Discriminate → Root Cause`

### Safe Modification

`Define Invariant → Minimal Patch → Diff → Focused Validation → Broad Validation`

### UI Verification

`Implement → Run → Capture → Compare → Iterate`

### Research-to-Code

`Authoritative Docs → Constraints → Implementation Mapping → Build → Verify`

### Release Triage

`Collect Failures → Cluster → Prioritize → Investigate → Recommend`

A good skill is not merely a prompt. It encodes a **repeatable method**.

------------------------------------------------------------------------

## 11. General Agent Analysis Framework

For any future agent, ask:

**Goal:** What objective is delegated? What defines success?

**Context:** What is static, retrieved, compressed, or excluded?

**Reasoning:** Is planning explicit? How are long tasks decomposed?

**Tools:** What can the agent observe and modify? How are tools
selected? Which provide independent verification?

**Memory:** What persists in context, files, task state, and procedural
knowledge?

**Execution:** Where do actions run? What is isolated?

**Feedback:** How does the system know an action worked?

**Recovery:** What happens after tool failure or a wrong hypothesis?

**Safety:** What is sandboxed? What requires escalation? Is enforcement
outside model reasoning?

**Orchestration:** Can agents run in parallel? How is mutable state
isolated and merged?

**Economics:** Where do tokens, latency, cache opportunities, and
parallelism concentrate?

**UX:** Can users see progress, diffs, artifacts, and intervention
points?

**Architecture:** What belongs in the model, harness, environment, skill
layer, or protocol boundary?

------------------------------------------------------------------------

## 12. Future Research Questions

1.  **How thin can the harness become as models improve?** Does stronger
    planning eliminate external planning state, or will reliable
    autonomy always need explicit machinery outside the model?

2.  **Will harness quality matter more than model choice?** If frontier
    models converge in raw capability, differentiation may shift toward
    context, tools, environments, evals, skills, and orchestration.

3.  **Can excellent feedback let smaller models outperform stronger
    models in weak harnesses?** This is both a capability and an
    economic question.

4.  **What is the correct unit of procedural knowledge?** Prompt, skill,
    tool, workflow graph, program, or fine-tuning example?

5.  **How should multi-agent work be decomposed?** By file, subsystem,
    role, hypothesis, or verification stage?

6.  **Can evaluator agents safely replace human approvals?** How
    independent must reviewer evidence, prompts, models, or policies be?

7.  **What becomes the operating system of future agents?** If a runtime
    manages processes, permissions, memory, tools, files, network,
    subagents, scheduling, artifacts, and events, the OS analogy becomes
    increasingly literal.

------------------------------------------------------------------------

## 13. Research Insight

The deepest lesson from Codex is not that AI can write code.

It is that **reliable agency is an architectural property**.

A model may contain enormous latent capability, but a weak surrounding
system leaves it as an impressive text generator.

The harness converts latent intelligence into operational intelligence:

``` text
Model Capability
 ↓
Context
 ↓
Action Interface
 ↓
Environment
 ↓
Observation
 ↓
Evaluation
 ↓
Recovery
 ↓
Reliable Work
```

The scarce engineering skill therefore moves from:

``` text
"How do I make the model answer?"
```

toward:

``` text
"How do I design a system in which the model can work?"
```

That requires thinking like a software architect, operating-system
designer, control engineer, HCI designer, security engineer, evaluation
engineer, and workflow designer at the same time.

The progression is:

``` text
Prompt Engineering
      ↓
Context Engineering
      ↓
Harness Engineering
      ↓
Agent Systems Engineering
```

The central principle is:

> **Do not ask intelligence to be reliable by itself. Build an
> environment that makes reliable behavior easier to produce, easier to
> verify, and safer to execute.**

------------------------------------------------------------------------

# Part II --- 中文完整翻译

# 逆向拆解 Codex Harness ------ 为什么 Agent Loop 可能比模型本身更重要

> **研究目标：** 这不是 Codex 产品评测。我们借 Codex Harness
> 研究一个更重要的问题：**一个语言模型周围究竟需要构建什么，才能让它在真实环境中可靠完成长程任务？**

## 1. 研究引言

比较 AI Coding Agent 时，人们常先比较模型：谁的 Benchmark
更高、代码更好、推理更强。但这越来越无法覆盖真正的系统问题。

单独一个模型不能自动检查 Repository、遵守项目规则、执行 Compiler、修改
File、观察 Test Failure、从错误 Hypothesis
中恢复、为危险操作请求权限、保存 Task State，或协调并行
Worker。这些能力都存在于模型**周围**。

这个外围系统就是 **Agent Harness**。

OpenAI 将 Codex Harness 描述为支撑 Codex 体验的 Agent Loop 与 Execution
Logic。在 CLI 中，Harness 会在 Model Inference 与 Tool Execution
之间循环，直到模型产生最终 Response。同一核心 Harness 还可以通过 App
Server 服务不同 Client；更新的 Agents API 则进一步提供托管 Harness 与
Runtime Infrastructure。

因此：

``` text
Model
+ Context
+ Tools
+ Execution Environment
+ Permissions
+ Feedback
+ State
+ Evaluation
= Working Agent
```

强模型代表潜在 Intelligence；强 Harness 决定这些 Intelligence
能否转化为可靠工作。

------------------------------------------------------------------------

## 2. 演化背景

### Traditional Software

``` text
Input → Programmed Logic → Function Calls → Output
```

逻辑显式、可预测，但难以处理无法提前枚举的任务。

### Chatbot

``` text
User Intent → Context → LLM → Generated Response
```

自然语言成为通用语义接口，但系统仍然主要是被动的。

### Tool-Using LLM

``` text
Model → Structured Tool Call → External System → Observation → Model
```

语言开始成为 Control Surface，模型可以读文件、搜索代码、运行命令、调用
API。

### Agent System

工程工作天然是迭代的：

``` text
Inspect → Hypothesize → Modify → Test → Observe → Correct
```

于是核心变成 Agent Loop：

``` text
User Goal
 ↓
Context Construction
 ↓
Model Inference
 ↓
Tool Call
 ↓
Environment
 ↓
Observation
 ↓
Updated Context
 └────────────→ Model Inference
```

### Agent Ecosystem

基础 Loop 成立后继续扩展：

``` text
Single Agent
 ↓
Skills
 ↓
MCP / Plugins
 ↓
Subagents
 ↓
Worktrees / Sandboxes
 ↓
Automations
 ↓
Persistent Cloud Runtime
```

瓶颈逐渐从 Model Intelligence 本身迁移到
Environment、Context、Tools、Feedback、Safety 与 Orchestration。

------------------------------------------------------------------------

## 3. 第一性原理

### Requirement

我们希望 AI 接受：

``` text
修复身份验证回归，
增加测试，
保持 API 兼容。
```

并真正完成工作。

### Constraints

1.  Model 不会自动看到 Repository。
2.  Model 不能靠思考修改文件。
3.  第一次 Hypothesis 可能错误。
4.  Context 有限。
5.  Shell、Filesystem、Network、Secrets 有风险。
6.  长任务需要跨多个 Inference Cycle 保存 State。

### Technical Principle

自然得到 Closed Loop：

``` text
Sense → Reason → Act → Observe → Evaluate → Repeat
```

这与 Robotics、Control Theory、Debugging 和 Scientific Experiment 同构。

### Design Choice

Harness 负责：

``` text
Prompt Construction
Tool Registration
Tool Execution
Sandbox
Conversation / Task State
Environment Metadata
Permission Handling
Context Management
Event Streaming
Client Protocol
```

Model 提议，Harness 调解，Environment 决定真实后果。

### Trade-off

Chatbot 很简单：

``` text
User → Model → Response
```

Production Agent 更复杂，但额外架构换来了
Agency、Reliability、Observability 与 Safety。

------------------------------------------------------------------------

## 4. System Overview

关键抽象：

``` text
Codex Model ≠ Codex Agent
```

Model 做 Inference，Harness 把 Inference 变成 Stateful Interaction
Process。

``` text
User
 ↓
Client / UI
 ↓
Codex Harness
 ├── Context Builder
 ├── Agent Loop
 ├── Tool Dispatcher
 ├── State Manager
 ├── Permission Policy
 └── Event Stream
 ↓                 ↓
Model          Environment
               shell/files/MCP
```

App Server 的意义是把 Harness 与具体 UI 解耦。

> **Agent 应该成为 Service Boundary，而不是 UI Implementation Detail。**

------------------------------------------------------------------------

## 5. Workflow Reverse Engineering

### User Input ------ 从 Request 到 Goal State

例如：

``` text
重构 Upload Pipeline，
避免大文件耗尽内存；
保持 Public API 兼容；
增加 Regression Tests。
```

弱系统看到"生成代码"，强 Agent 推导 Target State：

``` text
Memory Behavior Improved
AND API Compatibility Preserved
AND Regression Coverage Added
AND Repository Healthy
```

Agent 的目标不是生成 Code，而是把 Environment 从 State A 推到 State B。

### Context Engineering ------ 构造 Agent 的世界

有效 Context 可以组合：

``` text
Base Instructions
+ Sandbox Policy
+ Project Instructions
+ Skill Metadata
+ Environment Context
+ Tools
+ History
+ User Goal
```

`AGENTS.md` 这类项目指令使 Organizational Knowledge 可以存在 Model
Weight 外。

这不是普通 Prompting，而是 **World Construction**：Harness
决定现实中的哪些部分可以被模型看见。

目标不是 Maximum Context，而是：

``` text
Maximum Relevant Information / Context Token
```

### Understanding ------ Intent 与 Evidence 相遇

``` text
Intent → Search → Modules → Data Flow → Failure Mechanism
```

可靠理解来自：

``` text
Model Prior Knowledge + Environment Evidence
```

Coding Agent 应该检查"这个系统"，而不是只回忆类似系统通常怎样工作。

### Planning ------ Externalized Task State

``` text
Goal → inspect → diagnose → modify → test → verify
```

Plan 可以成为 Lightweight State Machine。任务越长，Explicit State
的价值越高。

### Tool Calling ------ Reasoning 变成 Side Effect

``` text
Reasoning
 ↓
Structured Intent
 ↓
Harness Validation
 ↓
Tool Execution
 ↓
Side Effect
```

优秀 Tool 应暴露"最小但足够有用"的 Action Surface。

### Memory ------ 不只是 Vector Database

Coding Agent 的 State 包括 Conversation、Tool
History、Filesystem、Git、Plan、Project Instructions 与 Artifacts。

因此 Memory 可以分成：

``` text
Context Memory
Environmental Memory
Procedural Memory
Task Memory
Organizational Memory
```

Filesystem 是 Memory，Git 是 Memory，Tests 保存 Expected
Behavior，Skills 是 Procedural Memory。

### Execution ------ Environment 是 Agent 的一部分

Environment 包含 Repository、Compiler、Tests、Package
Manager、Git、Filesystem、Runtime、Dependencies。

所以：

``` text
Effective Agent Capability
≈ Reasoning Capability × Environment Capability
```

Environment 不是 Plumbing，而是 Cognitive System 的一部分。

### Observation ------ 新 Evidence 改变下一步 Policy

``` text
Action: run tests
Observation: 2 failed, 41 passed
Evidence: stream closes before async flush
```

Agent 从：

``` text
Generate
```

升级为：

``` text
Hypothesize → Experiment → Observe → Update
```

### Evaluation ------ Ground Truth 必须来自 Model 外

Model 可以自信但错误，所以需要 Compiler、Linter、Type
Checker、Tests、Screenshot、Benchmark、Diff Review。

核心原则：

> **Prefer executable feedback over self-confidence.**

### Recovery ------ Failure 是正常 State Transition

``` text
Failure → Interpret → Update Belief → Recover
```

Recovery 可以是 Retry、换参数、获取更多 Context、换
Tool、Revert、Re-plan、Ask User、Escalate Permission 或 Safe Stop。

### Output ------ Message 不是 Product

真实 Output 可能是 Modified Code、Tests、Config、Artifact、Git
Diff、Deployment、Pull Request。

因此 Agent UX 必须把 Narrative Output 与 Environmental Output 分开。

------------------------------------------------------------------------

## 6. Architecture Diagrams

``` text
User Goal
 ↓
Context Builder
 ↓
Model
 ├── Final Response → Done
 └── Tool Request
        ↓
      Harness
        ↓
    Environment
        ↓
    Observation
        └────────→ Context → Model
```

``` text
Model Instructions ─────┐
Sandbox Policy ─────────┤
Project Instructions ───┤
Skill Metadata ─────────┤
Tool Schemas ───────────┼──→ Effective Context
Environment State ──────┤
Conversation History ───┤
User Goal ──────────────┘
```

``` text
Intent → Implementation → Executable Check → Observation
                           ↑                  │
                           └── Revision ← Diagnosis ← Failure
```

------------------------------------------------------------------------

## 7. Core Design Decisions

### Stateless Request + Prefix Preservation

Codex 的工程文章说明，后续 Request 会保留旧 Prompt 作为 Exact
Prefix，从而利用 Prompt Cache；同时 Codex 偏向 Client-owned、Stateless
Request Construction，其中一个原因是支持 Zero Data Retention。

这是 State Ownership 的取舍：

``` text
Repeated Payload + Client-owned State
```

换来 Reproducibility、Statelessness、ZDR Compatibility 与 Cache
Friendliness。

### Native Sandbox

两个极端是"几乎什么都问用户"与"Full Access"。Codex 选择默认受限
Environment，仅对跨 Boundary 操作 Escalate：

``` text
Safe Autonomy
=
Constrained Default Environment
+
Exceptional Escalation
```

### Auto-Review ------ Agent 的 Separation of Powers

OpenAI 描述过独立 Reviewer Agent 审核 Boundary-crossing Action
的架构；公开结果中，同步人工中断约减少 200 倍，被 Review 的 Action 约
99% 获批。

``` text
Worker Agent → Risky Action → Reviewer Agent → Approve / Deny / Escalate
```

Worker 优化 Task Completion，Reviewer 优化 Policy Compliance。

### App Server

``` text
CLI ──────┐
IDE ──────┼──→ App Server → Harness
Desktop ──┤
Web ──────┘
```

Agent Loop 因此成为 Reusable Infrastructure。

### Skills

``` text
General Intelligence + External Procedural Knowledge
```

Model Weight 负责慢变化的 General Capability，Skills 负责快变化的
Organizational Procedure。

### Worktrees

``` text
Agent A → Worktree A
Agent B → Worktree B
Agent C → Worktree C
```

Parallel Intelligence 需要 Parallel State Isolation。

------------------------------------------------------------------------

## 8. Technical Principles

### Software Engineering

Client、Harness、Model、Tool、Environment、Safety Policy 分离，体现
Separation of Concerns。

### Operating Systems

Agent 需要 Filesystem、Process、Network、Resource Limit 与
Permission，因此 Sandbox 本质是 OS Problem。

未来 Agent Runtime 越来越像：

``` text
Scheduler + Permissions + Isolation + Filesystem + IPC + Audit
```

### Distributed Systems

Long-running Agent 必须处理 Durability、Retry、Checkpoint、Partial
Failure、Artifact Persistence 与 Event Delivery。

### Control Theory

``` text
Goal → Controller → Action → Environment → Observation → Feedback
```

结构上：

``` text
Intelligence + Feedback > Intelligence Alone
```

### Machine Learning

``` text
Action_t = Model(Context_t)
Context_t+1 = Context_t + Action_t + Observation_t+1
```

Harness 在 Stateless Inference 外部构建 External Recurrent State。

Agent 是 Neural Network **加上外围 State-transition Machinery**。

### HCI

传统 UX 优化 Operation；Agent UX 优化 Delegation。

问题从"怎样更快操作？"变成：

> **怎样更有信心地委托 Objective？**

因此需要 Visibility、Control、Reviewability、Interruptibility 与 Trust
Calibration。

------------------------------------------------------------------------

## 9. Reconstruction ------ 构建 Mini-Codex

**Stage 0:** `User → LLM → Code`，学习 Prompting。

**Stage 1:** 加 `list_files/read_file/search_text`，学习 Tool-mediated
Understanding。

**Stage 2:** 加 `write_file/apply_patch` 与 Git Diff，学习 Environmental
State。

**Stage 3:** 加 `run_command/run_tests`，形成
`Edit → Execute → Observe → Correct`。

**Stage 4:** 加 Project Instructions、Environment Context、Tool
Descriptions，学习 Context as Architecture。

**Stage 5:** 建 Sandbox，定义 Write Root、Network
Policy、Timeout、Process Limit。

**Stage 6:** Permission Escalation：

``` text
Safe → Auto
Boundary Crossing → Ask
Forbidden → Deny
```

**Stage 7:** Explicit Evaluation：Tests、Lint、Artifact、Diff 都成为
Completion Condition。

**Stage 8:** Skills：建立
`SKILL.md`、scripts、references、templates，学习 Procedural Memory。

**Stage 9:** App Server：

``` text
CLI ─┐
Web ─┼→ Agent Server → Harness
IDE ─┘
```

**Stage 10:** Parallel Agents + Isolated Worktrees，只 Merge 已验证
Output。

此时你构建的已经不是 LLM App，而是 **Agent Runtime**。

------------------------------------------------------------------------

## 10. Skill Extraction

**Repository Reconnaissance**\
`Inspect → Instructions → Entry Points → Dependencies → Architecture`

**Bug Diagnosis**\
`Reproduce → Evidence → Hypotheses → Discriminate → Root Cause`

**Safe Modification**\
`Invariant → Minimal Patch → Diff → Focused Validation → Broad Validation`

**UI Verification**\
`Implement → Run → Capture → Compare → Iterate`

**Research-to-Code**\
`Authoritative Docs → Constraints → Mapping → Build → Verify`

**Release Triage**\
`Collect → Cluster → Prioritize → Investigate → Recommend`

真正优秀的 Skill 不是一段 Prompt，而是 **Repeatable Method**。

------------------------------------------------------------------------

## 11. General Agent Analysis Framework

以后分析任何 Agent，都依次问：

**Goal：** 委托什么 Objective？Success 怎样定义？

**Context：** 什么 Static、Retrieved、Compressed、Excluded？

**Reasoning：** Planning 是否 Explicit？Long Task 怎样分解？

**Tools：** Agent 能 Observe/Modify 什么？Tool 怎样选择？哪些 Tool
提供独立 Verification？

**Memory：** 什么存在 Context、Filesystem、Task State、Procedural
Knowledge？

**Execution：** Action 在哪里运行？什么被 Isolation？

**Feedback：** 怎样知道 Action 成功？

**Recovery：** Tool Failure 或 Wrong Hypothesis 后怎么办？

**Safety：** 什么 Sandbox？什么 Escalate？Enforcement 是否存在 Model
外？

**Orchestration：** Multi-Agent 怎样隔离 Mutable State、怎样 Merge？

**Economics：** Token、Latency、Cache、Parallelism 在哪里？

**UX：** 用户能否看到 Progress、Diff、Artifact、Intervention Point？

**Architecture：** 什么属于
Model、Harness、Environment、Skill、Protocol？

------------------------------------------------------------------------

## 12. Future Research Questions

1.  Model 越来越强以后，Harness 可以变得多薄？Reliable Autonomy
    是否永远需要 Model 外部 Explicit State？
2.  当 Frontier Model 能力逐渐接近时，Harness Quality 会不会比 Model
    Choice 更重要？
3.  优秀 Feedback Loop 能否让小模型在真实任务中击败弱 Harness
    中的大模型？
4.  Procedural Knowledge
    最合理的单位是什么：Prompt、Skill、Tool、Workflow Graph、Program
    还是 Fine-tuning Example？
5.  Multi-Agent 应该按 File、Subsystem、Role、Hypothesis 还是
    Verification Stage 分工？
6.  Evaluator Agent 能否安全替代 Human Approval？Reviewer 应该在
    Model、Prompt、Evidence、Policy 上多大程度独立？
7.  如果 Agent Runtime 管理
    Process、Permission、Memory、Tool、File、Network、Subagent、Scheduling、Artifact、Event，那么未来是否会出现真正标准化的
    **Agent Operating System Layer**？

------------------------------------------------------------------------

## 13. Research Insight

Codex 最深层的启示不是"AI 会写代码"。

而是：

> **Reliable Agency 是一种 Architecture Property。**

Model 拥有 Latent Capability；Harness 把它转换成 Operational
Intelligence：

``` text
Model Capability
 ↓
Context
 ↓
Action Interface
 ↓
Environment
 ↓
Observation
 ↓
Evaluation
 ↓
Recovery
 ↓
Reliable Work
```

稀缺能力正在从：

``` text
"How do I make the model answer?"
```

转向：

``` text
"How do I design a system in which the model can work?"
```

这要求工程师同时像 Software Architect、OS Designer、Control
Engineer、HCI Designer、Security Engineer、Evaluation Engineer 与
Workflow Designer 一样思考。

演化路径可以概括为：

``` text
Prompt Engineering
      ↓
Context Engineering
      ↓
Harness Engineering
      ↓
Agent Systems Engineering
```

最终原则是：

> **不要要求 Intelligence 自己变得可靠。要设计一个
> Environment，让可靠行为更容易产生、更容易验证，也更安全地执行。**

------------------------------------------------------------------------

# Sources & Further Reading

1.  OpenAI --- *Unrolling the Codex agent loop*\
    https://openai.com/index/unrolling-the-codex-agent-loop/

2.  OpenAI --- *Unlocking the Codex harness: how we built the App
    Server*\
    https://openai.com/index/unlocking-the-codex-harness/

3.  OpenAI --- *Harness engineering: leveraging Codex in an agent-first
    world*\
    https://openai.com/index/harness-engineering/

4.  OpenAI --- *Building a safe, effective sandbox to enable Codex on
    Windows*\
    https://openai.com/index/building-codex-windows-sandbox/

5.  OpenAI Alignment --- *Auto-review of agent actions without
    synchronous human oversight*\
    https://alignment.openai.com/auto-review

6.  OpenAI --- *Introducing the Agents API*\
    https://openai.com/index/introducing-the-agents-api/

7.  OpenAI --- *Introducing the Codex app*\
    https://openai.com/index/introducing-the-codex-app/

8.  OpenAI Codex --- Open-source repository\
    https://github.com/openai/codex
