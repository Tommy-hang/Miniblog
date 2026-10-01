---
title: "MCP_1001"
description: "A first-principles reverse engineering of the Model Context
  Protocol: why agents need a protocol layer, how hosts, clients,
  servers, tools, resources, transports, authorization, feedback loops,
  and asynchronous tasks fit together, and what MCP teaches us about
  designing agent infrastructure."
date: 2026-10-01
tags:
  - AI
  - Engineering
draft: false
featured: false
---

# Reverse Engineering MCP --- The Protocol Layer Behind the Agent Ecosystem

> Research objective: do not learn MCP as another API. Use it to answer
> a deeper question: **what infrastructure must exist when AI evolves
> from an isolated model into an agent that can continuously acquire
> tools, context, permissions, and external capabilities?**

# Part I --- English Research Article

## 1. Research Introduction

The easiest way to misunderstand the Model Context Protocol is to call
it "a standard for letting LLMs call tools."

Tool calling existed before MCP. A developer could always write:

``` text
if model_requests_weather:
    result = weather_api(...)
```

The deeper problem begins when an AI application no longer has five
hard-coded functions, but must operate inside an ecosystem containing
hundreds or thousands of independently developed capabilities.

The engineering question changes from:

``` text
How do I call this API?
```

to:

``` text
How does an AI application discover capabilities?
How are capabilities described?
How are schemas communicated?
How are local and remote capabilities invoked consistently?
How are permissions enforced?
How can hosts and capability providers evolve independently?
How do we avoid rebuilding every integration for every agent?
```

That is a protocol problem.

Official MCP SDK documentation describes MCP as an open standard for
connecting AI applications to systems containing data and tools. Servers
expose capabilities such as tools, resources, and prompts; clients
connect through standard transports such as stdio and Streamable HTTP.

The architectural keyword is **separation**:

``` text
Model reasoning
      ≠
Capability implementation
```

and:

``` text
AI application
      ≠
External-system integration
```

MCP is therefore interesting not because it adds another API, but
because it attempts to define a reusable boundary between
**intelligence** and **capability**.

------------------------------------------------------------------------

## 2. Evolution Background

### 2.1 Traditional software

Traditional applications contain explicit integrations:

``` text
Application
 ├── Database adapter
 ├── GitHub integration
 ├── Search API
 └── Payment API
```

The programmer knows the endpoints, arguments, return values,
permissions, and error handling in advance. The action space is mostly
fixed at development time.

### 2.2 Chatbots

A basic LLM changes the interface:

``` text
Human language
     ↓
    LLM
     ↓
Human language
```

Natural language becomes a universal semantic interface, but the model
remains passive. It can explain how to change a database without
actually changing it.

We can summarize this stage as:

``` text
High semantic flexibility
+
Low environmental agency
```

### 2.3 Tool-using LLMs

Function calling gives the model structured actions:

``` json
{
  "tool": "search_repository",
  "arguments": {
    "query": "authentication middleware"
  }
}
```

Now the loop becomes:

``` text
Model
 ↓
Tool selection
 ↓
Application
 ↓
External system
 ↓
Observation
 ↓
Model
```

The model starts behaving like a controller. But early tool systems are
application-specific, so each product creates its own schemas and
adapters.

### 2.4 Agent systems

An agent repeatedly interacts with the environment:

``` text
Goal
 ↓
Understand
 ↓
Plan
 ↓
Act
 ↓
Observe
 ↓
Evaluate
 ↓
Act again
```

Once a task requires twenty or fifty actions, the tool layer becomes
part of the reasoning environment.

A useful approximation is:

``` text
Effective Agent Capability
≈
Model Capability
× Context Quality
× Tool Quality
× Feedback Quality
```

The model is only one multiplier.

### 2.5 Agent ecosystem

Without a shared protocol, N agent applications integrating M external
systems trend toward an N×M integration surface.

A protocol introduces an intermediate abstraction:

``` text
AI Applications
      ↓
     MCP
      ↓
Capability Providers
```

This resembles recurring patterns in computing:

``` text
Applications → OS API → Hardware
Web clients → HTTP → Web servers
Applications → SQL → Database engines
AI hosts → MCP → Tools / Context / Services
```

The useful lesson is not that MCP is literally "USB for AI." It is that
MCP tries to reduce coupling between intelligence hosts and capability
providers.

------------------------------------------------------------------------

## 3. First-Principles Analysis

### Requirement

We want AI to dynamically:

``` text
read files
search documentation
query databases
create issues
run experiments
inspect telemetry
control workflows
use domain-specific software
```

### Constraint

External systems differ in authentication, schemas, transports, state,
latency, permissions, errors, and deployment.

If every host directly understands every implementation, the system
becomes tightly coupled.

### Technical principle

Software engineering handles heterogeneity through abstraction:

``` text
A understands interface I
B implements interface I
```

rather than:

``` text
A understands B's internals
```

This creates implementation independence, replaceability, and
composability.

### Design choice

MCP introduces protocol roles:

``` text
Host
 └── MCP Client
       ↕
    Transport
       ↕
    MCP Server
     ├── Tools
     ├── Resources
     └── Prompts
```

### Trade-off

Standardization reduces integration complexity but introduces protocol
complexity, version compatibility, security concerns, schema
constraints, and another abstraction layer.

This illustrates a general law:

> Abstraction rarely destroys complexity; it converts distributed
> complexity into a more centralized and manageable form.

------------------------------------------------------------------------

## 4. System Overview

A useful mental model is:

``` text
MCP is not the agent.
MCP is not the model.
MCP is not the planner.
MCP is not the memory system.

MCP is a communication boundary.
```

### Host

The host owns the user experience and agent behavior. It decides which
model reasons, which servers are trusted, which tools enter context,
when approval is required, and how observations are fed back into
reasoning.

MCP therefore does **not** replace the agent harness. It gives the
harness a standardized capability interface.

### Client

The client is the protocol participant on the host side:

``` text
Host → MCP Client → Protocol → MCP Server
```

A host may connect to many servers simultaneously.

### Server

A server wraps a concrete capability provider:

``` text
MCP Server
 ↓
Service-specific adapter
 ↓
Filesystem / SaaS / Database / Internal Service
```

Externally, it presents an MCP-compatible interface.

### Tools

Tools represent actions or computations:

``` text
search_code(query)
create_issue(title, body)
query_database(sql)
run_test(target)
```

For an agent, tool schemas form an **action vocabulary**.

Compare:

``` text
do_thing(data)
```

with:

``` text
search_repository(
    query: string,
    path?: string,
    max_results?: integer
)
```

The second schema constrains and explains the action space.

**Tool schema design is cognitive interface design for models.**

### Resources

Resources expose information that can become context.

``` text
Tool → do something
Resource → provide something to know
```

This distinction matters because reading context and modifying the world
have different semantics and risk.

### Prompts

Prompt templates can package recommended interaction patterns alongside
domain capabilities. This begins to resemble:

``` text
Capability
+
Usage knowledge
```

------------------------------------------------------------------------

## 5. Workflow Reverse Engineering

Assume the user asks:

``` text
Find the authentication regression introduced this week,
fix it, run the tests, and open a pull request.
```

### 5.1 User Input

This is a goal specification, not a tool call.

``` text
Natural-language goal
        ↓
Agent harness
        ↓
Reasoning state
```

MCP exposes capabilities; it does not supply task intelligence.

``` text
Capability exposure ≠ task intelligence
```

### 5.2 Context Engineering

The agent may need:

``` text
User request
System instructions
Repository instructions
Available servers
Available tools
Relevant resources
Previous observations
Task state
```

A naive system could insert every tool into context. With thousands of
tools, this creates token cost and action-selection ambiguity.

A scalable architecture may therefore become:

``` text
Capability Registry
        ↓
Tool Retrieval / Routing
        ↓
Relevant Tool Subset
        ↓
Model Context
```

MCP helps answer **how capabilities are represented**, but large systems
still need to solve **which capabilities matter now**.

### 5.3 Understanding

The model decomposes the goal:

``` text
inspect recent changes
locate authentication code
reproduce failure
edit implementation
run tests
verify behavior
create PR
```

Conceptually:

``` text
Goal Space
   ↓
Semantic Decomposition
   ↓
Action Space
```

Tool names, descriptions, and schemas become part of the model's
semantic environment.

### 5.4 Planning

The host might use ReAct, plan-and-execute, hierarchical planning,
workflow graphs, or multi-agent delegation.

MCP intentionally does not standardize the planning algorithm.

That reveals a protocol-design principle:

> Standardize the boundary that needs interoperability; do not
> prematurely standardize internal intelligence.

### 5.5 Tool Discovery and Selection

Suppose the model sees:

``` text
git.search_commits
filesystem.read_file
filesystem.write_file
shell.run
github.create_pull_request
```

The agent faces:

``` text
state s + available actions A → choose action a
```

which resembles:

``` text
π(a | s)
```

Tool descriptions and schemas therefore influence action-selection
quality.

### 5.6 Tool Calling

If the agent selects:

``` text
git.search_commits(
  since="7 days ago",
  query="auth"
)
```

the path is:

``` text
LLM
 ↓
Harness
 ↓
MCP Client
 ↓
Transport
 ↓
MCP Server
 ↓
Git implementation
```

and the result travels back upward.

Responsibilities remain separated:

``` text
Model → decides intention
Protocol → carries structured request
Server → implements capability
Harness → decides how observation affects reasoning
```

### 5.7 Memory

MCP is not memory, but it can expose memory systems:

``` text
Agent
 ↓
MCP
 ↓
Memory / Knowledge Server
 ↓
Database / Vector Store / Files
```

Different layers can be separated:

``` text
Model context = working memory
Conversation state = episodic task memory
Repository/database = persistent external memory
MCP tool/resource = access mechanism
```

This makes memory inspectable and replaceable instead of hiding all
state inside the model.

### 5.8 Execution

The server converts a standardized request into domain-specific work:

``` text
MCP Tool Call
 ↓
GitHub Adapter
 ↓
GitHub API
 ↓
Remote Repository
```

The server resembles an adapter or device driver.

But abstraction cannot remove underlying reality: rate limits,
permissions, eventual consistency, asynchronous jobs, and domain errors
still exist.

### 5.9 Observation

Execution returns an observation:

``` text
3 commits matched.
Commit 8af31c changed auth/session.ts.
```

The loop becomes:

``` text
State_t
 ↓
Action_t
 ↓
Environment
 ↓
Observation_t+1
 ↓
State_t+1
```

Tool calling without feedback is automation. Tool calling plus
observation and iterative reasoning becomes an agent loop.

### 5.10 Evaluation

After editing code, the agent might call:

``` text
test.run(target="auth")
```

Evaluation may progress through:

``` text
Syntax validity
 ↓
Unit tests
 ↓
Integration tests
 ↓
Behavioral verification
 ↓
Requirement satisfaction
```

A powerful principle follows:

> The tool that changes the world and the tool that measures the world
> should often be separate.

In engineering terms:

``` text
Actuator ≠ Sensor
```

### 5.11 Recovery

Failure requires policy:

``` text
Failure
 ↓
Classify
 ├── transient → retry
 ├── missing context → retrieve
 ├── permission → escalate
 ├── wrong plan → re-plan
 └── unsafe state → stop
```

The protocol communicates failure; the harness decides recovery.

``` text
Protocol ≠ Agent policy
```

### 5.12 Output

A four-line final answer may hide dozens of model calls, tool calls,
failed hypotheses, tests, and permission checks.

Agent evaluation therefore requires more than answer quality:

``` text
Success rate
Tool efficiency
Recovery quality
Cost
Latency
Safety
Traceability
Human intervention rate
```

Agent evaluation is systems evaluation.

------------------------------------------------------------------------

## 6. Architecture Diagrams

### 6.1 MCP inside an agent

``` text
┌────────────────────────────────────────────┐
│                  USER                      │
└────────────────────┬───────────────────────┘
                     │ Goal
                     ▼
┌────────────────────────────────────────────┐
│               AGENT HOST                   │
│  ┌────────────┐   ┌────────────────────┐  │
│  │   Model    │◄─►│   Agent Harness    │  │
│  └────────────┘   │ Plan/Memory/Eval   │  │
│                   └─────────┬──────────┘  │
│                       ┌─────▼─────┐       │
│                       │MCP Clients│       │
└───────────────────────┬───────────┬───────┘
                        │ Transport │
          ┌─────────────┼───────────┼────────────┐
          ▼             ▼           ▼
     Git Server    Database     Browser Server
          ▼             ▼           ▼
      External       External    External
       System         System      System
```

### 6.2 Cognitive feedback loop

``` text
Goal
 ↓
Context
 ↓
Reason
 ↓
Select Capability
 ↓
MCP Tool Call
 ↓
Environment
 ↓
Observation
 ↓
Evaluation
 ↓
Success? ──Yes──→ Output
   │
   No
   ↓
Re-plan
   └────────────→ Reason
```

### 6.3 Capability layers

``` text
Level 4: User Workflow
        "Fix bug and open PR"

Level 3: Agent Strategy
        inspect → diagnose → edit → test → review

Level 2: MCP Capabilities
        search_commits / read_file / run_tests / create_pr

Level 1: Concrete Systems
        Git / Filesystem / Shell / GitHub API
```

Higher layers express intent; lower layers provide mechanism.

------------------------------------------------------------------------

## 7. Core Design Decisions and Trade-offs

### Client--server separation

Direct integration creates tight coupling. MCP servers let the domain
adapter evolve separately from the intelligence host.

Cost: serialization, transport failures, version management, debugging
complexity.

Benefit: independent evolution and reuse.

### Structured schemas instead of free-form actions

Natural language is flexible but ambiguous. Structured schemas constrain
side effects and reduce the gap between semantic reasoning and
deterministic execution.

### Separate tools from resources

Context acquisition and world modification have different risk profiles.
Treating them differently supports better permission and safety models.

### Standardize transport, not intelligence

MCP does not prescribe planning, memory algorithms, model architecture,
or reasoning strategy. This keeps the protocol useful across different
agent designs.

### Stateless direction in modern MCP

Official 2026-era SDK documentation describes a modern stateless
lifecycle in which protocol version and capabilities are made explicit
per request rather than relying on the older session handshake model.

The distributed-systems motivation is recognizable:

``` text
Less hidden connection state
→ easier routing
→ easier horizontal scaling
→ fewer sticky-session assumptions
```

Trade-off:

``` text
implicit-state convenience
vs
explicit-state scalability
```

------------------------------------------------------------------------

## 8. Technical Principles

### Software Engineering --- Dependency Inversion

Instead of:

``` text
Agent → GitHub
Agent → Database
Agent → Browser
```

we get:

``` text
Agent → Protocol ← Service Adapter
```

High-level intelligence depends on an abstraction rather than every
implementation.

### Operating Systems --- System Calls and Drivers

A useful analogy:

``` text
Application → System Call → Kernel → Driver → Hardware
Model → Tool Intent → Harness → MCP → Adapter → External System
```

Both introduce a controlled boundary between abstract intention and
concrete side effects.

### Distributed Systems --- Partial Failure and Async Work

Remote servers introduce latency, retries, idempotency, authentication,
versioning, and asynchronous completion.

The official MCP Tasks extension allows a tool call to materialize an
asynchronous task handle that can later be queried or cancelled.

Real tools are often:

``` text
request
 ↓
long computation
 ↓
progress
 ↓
completion
```

Agent protocols therefore inevitably encounter distributed-job
semantics.

### Control Theory --- Closed-loop control

``` text
Goal
 ↓
Controller (LLM + Harness)
 ↓
Actuator (Tool)
 ↓
Plant (Environment)
 ↓
Sensor (Observation)
 ↓
Feedback
```

Open loop:

``` text
Plan → Execute → Assume success
```

Closed loop:

``` text
Plan → Execute → Measure → Correct
```

When uncertainty exists, reliable agents need the second.

### Machine Learning --- Tool selection as policy

Given state (s) and action set (A):

\[ a_t `\sim `{=tex}`\pi`{=tex}(a `\mid `{=tex}s_t, A) \]

After observation (o\_{t+1}):

\[ s\_{t+1} = f(s_t, a_t, o\_{t+1}) \]

This reveals multiple optimization targets besides the model:

``` text
state representation
tool descriptions
action-set retrieval
observation quality
evaluation quality
```

### HCI --- Interfaces for machines

Traditional HCI asks how to make interfaces understandable to humans.

Agent engineering adds:

> How do we design interfaces models can reliably understand and
> operate?

A model-friendly tool needs clear naming, precise descriptions,
constrained parameters, predictable outputs, useful errors, and low
ambiguity.

API design becomes **cognitive ergonomics for agents**.

------------------------------------------------------------------------

## 9. Security: Capability Is Attack Surface

Every tool expands useful behavior and possible harmful behavior.

A serious architecture needs layers:

``` text
Identity
 ↓
Authentication
 ↓
Authorization
 ↓
Tool allowlisting
 ↓
Argument validation
 ↓
User approval
 ↓
Sandbox
 ↓
Audit trail
```

Critical principle:

> A tool description is not a security boundary.

Security should be enforced outside model reasoning.

------------------------------------------------------------------------

## 10. Reconstruction --- Build a Mini-MCP Agent

### Stage 0: hard-coded tools

``` python
def get_weather(city): ...
def search_notes(query): ...

tools = {
    "weather": get_weather,
    "notes": search_notes,
}
```

Learn basic tool calling.

### Stage 1: described capabilities

Create explicit tool metadata and JSON Schema.

Conceptual transition:

``` text
Function → Described Capability
```

### Stage 2: separate server

``` text
Agent → Client → stdio → Tool Server
```

Now learn process boundaries.

### Stage 3: discovery

``` text
Agent starts
 ↓
Discover capabilities
 ↓
Receive schemas
 ↓
Build action context
```

The action space becomes dynamic.

### Stage 4: multiple servers

``` text
Agent
 ├── Files Server
 ├── Search Server
 └── Git Server
```

The problem shifts from connectivity to routing.

### Stage 5: evaluation

Add independent verification:

``` text
write_file()
run_tests()
inspect_diff()
```

The agent becomes closed-loop.

### Stage 6: permissions

Classify actions:

``` text
Read-only
Low-risk write
External side effect
Destructive
```

Map them to:

``` text
Auto / Ask / Deny
```

Autonomy becomes a permission-architecture problem.

### Stage 7: asynchronous tasks

``` text
tool_call()
 ↓
task_id
 ↓
poll/update
 ↓
result
```

The toy agent becomes a distributed system.

### Stage 8: capability retrieval

At hundreds or thousands of tools:

``` text
Task
 ↓
Tool Retriever
 ↓
Top-k Relevant Capabilities
 ↓
Model
```

You have moved from a tool-calling demo to agent infrastructure.

------------------------------------------------------------------------

## 11. Skill Extraction

### Capability Discovery Skill

``` text
Inspect servers
 ↓
Read metadata
 ↓
Filter relevant capabilities
 ↓
Expose minimal action set
```

### Safe Tool Invocation Skill

``` text
Interpret intent
 ↓
Choose tool
 ↓
Validate arguments
 ↓
Check permission
 ↓
Execute
 ↓
Record result
```

### Evidence-Gathering Skill

``` text
Question
 ↓
Identify source
 ↓
Retrieve
 ↓
Cross-check
 ↓
Update reasoning
```

### Closed-Loop Execution Skill

``` text
Goal → Act → Observe → Evaluate → Correct
```

### Failure-Recovery Skill

``` text
Detect
 ↓
Classify
 ↓
Select recovery policy
 ↓
Retry / Re-plan / Escalate
```

A mature agent should treat recovery as an explicit capability rather
than an exceptional afterthought.

------------------------------------------------------------------------

## 12. General Agent Reverse Engineering Framework

When studying any new agent, ask:

**Goal:** What objective does it accept? What defines success?

**Environment:** What can it observe and modify?

**Context:** What enters model context? What is dynamically retrieved?

**Reasoning:** Is planning explicit or implicit? How are long tasks
decomposed?

**Capabilities:** What tools exist? How are they discovered, described,
selected, and updated?

**Memory:** What is working memory? What persists? Who writes and
retrieves it?

**Execution:** Where do actions run? What side effects exist? Sync or
async?

**Feedback:** What observations return? What independently verifies
success?

**Recovery:** How does it classify failure? Retry, re-plan, escalate, or
stop?

**Safety:** What permissions, sandboxing, approvals, and audit trails
exist?

**Economics:** How many model/tool calls occur? Where are cost and
latency concentrated?

**Architecture:** Which components are coupled? Which interfaces are
standardized? What breaks at 100× scale?

This transforms product observation into systems analysis.

------------------------------------------------------------------------

## 13. Future Research Questions

1.  What happens when an agent has 10,000 or 1,000,000 capabilities?
    Does tool selection become a search-engine problem?

2.  Can agents read arbitrary API documentation and automatically
    synthesize high-quality MCP interfaces?

3.  Where should long-term memory live: host, dedicated server, domain
    application, or a distributed combination?

4.  Will agents eventually negotiate for capabilities by constraints
    such as trust, latency, permission, price, and data locality?

5.  If MCP keeps adding tools, resources, tasks, discovery, and
    authorization, where is the boundary between a protocol and an agent
    runtime?

6.  How should we measure "agent usability" of a tool: selection
    accuracy, argument accuracy, token overhead, recovery rate, error
    informativeness?

7.  How will provenance and supply-chain security work when agents can
    discover capabilities from open ecosystems?

------------------------------------------------------------------------

## 14. Research Insight

The deepest lesson from MCP is not:

> "Agents can connect to more tools."

It is:

> **Once intelligence can act, interfaces become part of intelligence.**

A model's practical ability depends on what the surrounding system makes
visible, understandable, and actionable.

``` text
Raw Intelligence
        ↓
Interface
        ↓
Available World
        ↓
Possible Actions
        ↓
Observed Consequences
        ↓
Effective Intelligence
```

The first AI era focused heavily on:

``` text
Model Architecture
```

Agent engineering increasingly requires:

``` text
System Architecture
```

The engineer must reason about:

``` text
Models
+
Context
+
Protocols
+
Tools
+
Memory
+
Permissions
+
Evaluation
+
Feedback
```

The central question changes from:

> "How do we build a smarter model?"

to:

> **"How do we design an environment in which intelligence can reliably
> understand, act, observe, and correct itself?"**

That is the transition from **model engineering** to **agent systems
engineering**.

MCP matters because it exposes the architectural layer where isolated
intelligence begins to become an ecosystem.

------------------------------------------------------------------------

# Part II --- 中文完整翻译

# 逆向拆解 MCP ------ Agent 生态背后的协议层

> 研究目标：不要把 MCP 当作另一个 API 学习。真正的问题是：**当 AI
> 从孤立模型演化成可以不断获取工具、上下文、权限和外部能力的 Agent
> 时，底层需要什么基础设施？**

## 1. 研究引言

最容易误解 MCP 的方式，是把它概括成"让大模型调用工具的标准"。

Tool Calling 在 MCP 之前早已存在。真正的问题出现在 AI
应用不再只有五个写死的函数，而要面对数百、数千个独立开发的能力。

问题从：

``` text
怎样调用这个 API？
```

变成：

``` text
AI 怎样发现能力？
能力怎样描述？
Schema 怎样传递？
本地与远程能力怎样统一调用？
权限怎样执行？
Host 与能力提供者怎样独立演进？
怎样避免每个 Agent 重写所有 Integration？
```

这已经是协议问题。

官方 MCP SDK 把 MCP 描述为连接 AI
应用与数据、工具所在系统的开放标准。Server 暴露
Tools、Resources、Prompts 等能力，Client 通过 stdio、Streamable HTTP
等标准 Transport 连接。

最重要的架构关键词是**分离**：

``` text
Model Reasoning ≠ Capability Implementation
AI Application ≠ External-system Integration
```

所以 MCP 真正值得研究的原因，不是"多了一个 API"，而是它试图建立
**Intelligence 与 Capability 之间的可复用边界**。

------------------------------------------------------------------------

## 2. 演化背景

### 2.1 传统软件

传统 Application 直接写死 Integration：

``` text
Application
 ├── Database Adapter
 ├── GitHub Integration
 ├── Search API
 └── Payment API
```

Endpoint、参数、权限和错误处理都由程序员提前确定，Action Space
基本固定。

### 2.2 Chatbot

``` text
Human Language
     ↓
    LLM
     ↓
Human Language
```

自然语言成为通用语义接口，但 Model 仍然被动：

``` text
高语义灵活性 + 低环境行动能力
```

### 2.3 Tool-Using LLM

Function Calling 让 Model 输出结构化 Action：

``` text
Model → Tool Selection → Application → External System → Observation → Model
```

模型开始像 Controller，但每个 Application 都自己定义 Tool
Schema，生态会碎片化。

### 2.4 Agent System

Agent 的本质是循环：

``` text
Goal → Understand → Plan → Act → Observe → Evaluate → Act Again
```

当一个 Task 需要几十次 Action 时，Tool Layer 就成为 Reasoning
Environment 的一部分。

``` text
Effective Agent Capability
≈ Model Capability
× Context Quality
× Tool Quality
× Feedback Quality
```

Model 只是一个乘数。

### 2.5 Agent Ecosystem

没有协议时，N 个 Agent Application 与 M 个 Service 的集成面趋近 N×M。

MCP 引入中间层：

``` text
AI Applications
      ↓
     MCP
      ↓
Capability Providers
```

类似：

``` text
Applications → OS API → Hardware
Web Clients → HTTP → Web Servers
Applications → SQL → Databases
AI Hosts → MCP → Tools / Context / Services
```

真正的意义是降低 Intelligence Host 与 Capability Provider 之间的
Coupling。

------------------------------------------------------------------------

## 3. 第一性原理

### Requirement

AI 希望动态读取文件、搜索文档、查询数据库、创建 Issue、运行实验、读取
Telemetry、控制 Workflow。

### Constraint

外部系统的
Authentication、Schema、Transport、State、Latency、Permission、Error
Model 完全不同。

如果 Host 必须理解所有实现，就会 Tight Coupling。

### Technical Principle

软件工程通过 Interface 处理异构：

``` text
A understands interface I
B implements interface I
```

而不是让 A 理解 B 的内部实现。

### Design Choice

``` text
Host
 └── MCP Client
       ↕
    Transport
       ↕
    MCP Server
     ├── Tools
     ├── Resources
     └── Prompts
```

### Trade-off

收益是 Interoperability、Discoverability、Reuse 与 Separation of
Concerns；代价是 Protocol Complexity、Version Compatibility、Security
Surface 与新的 Abstraction。

因此：

> 抽象不会消灭复杂度，而是把分散复杂度转换成更集中、更可管理的复杂度。

------------------------------------------------------------------------

## 4. MCP 到底是什么

最重要的心智模型：

``` text
MCP 不是 Agent。
MCP 不是 Model。
MCP 不是 Planner。
MCP 不是 Memory System。

MCP 是 Communication Boundary。
```

### Host

Host 拥有 User Experience 与 Agent Behavior，决定 Model、Trusted
Server、Tool Exposure、Approval 与 Observation 怎样重新进入 Context。

所以 MCP 不替代 Agent Harness，只给 Harness 一个标准 Capability
Interface。

### Client

``` text
Host → MCP Client → Protocol → MCP Server
```

一个 Host 可以同时连接多个 Server。

### Server

``` text
MCP Server
 ↓
Service Adapter
 ↓
Filesystem / SaaS / Database / Internal Service
```

Server 把领域实现包装成统一 Interface。

### Tools

Tool 是 Agent 的 Action Vocabulary。

``` text
do_thing(data)
```

远差于：

``` text
search_repository(
  query: string,
  path?: string,
  max_results?: integer
)
```

因此：

> **Tool Schema Design 是面向模型的 Cognitive Interface Design。**

### Resources

``` text
Tool → 做某件事
Resource → 提供需要知道的信息
```

Context Acquisition 与 World Modification 的风险不同，应该分开。

### Prompts

Prompt Template 可以把 Capability 与 Usage Knowledge
一起提供，开始接近可复用 Workflow Knowledge。

------------------------------------------------------------------------

## 5. Workflow Reverse Engineering

假设用户要求：

``` text
找出本周引入的身份验证回归问题，
修复、测试，并创建 Pull Request。
```

### User Input

这是 Goal Specification，不是 Tool Call。

``` text
Natural-language Goal → Agent Harness → Reasoning State
```

MCP 提供 Capability，不提供 Task Intelligence。

### Context Engineering

Agent 可能需要 User Request、System Instructions、Repository
Instructions、Available Servers、Tools、Resources、Previous Observations
和 Task State。

如果有 2,000 个 Tool，把全部 Schema 塞进 Prompt 会导致 Cost 与 Selection
Ambiguity。

于是自然出现：

``` text
Capability Registry
 ↓
Tool Retrieval / Routing
 ↓
Relevant Tool Subset
 ↓
Model Context
```

MCP 解决"能力怎样表示"，但大规模系统还必须解决"现在应该给模型哪些能力"。

### Understanding

``` text
Goal Space
 ↓
Semantic Decomposition
 ↓
Action Space
```

Tool Name、Description、Schema 都成为模型的 Semantic Environment。

### Planning

Host 可以使用 ReAct、Plan-and-Execute、Hierarchical Planning、Workflow
Graph 或 Multi-Agent。

MCP 不规定 Planning Algorithm。

这是一条重要原则：

> 只标准化需要互操作的边界，不要过早标准化 Intelligence 内部。

### Tool Discovery & Selection

``` text
git.search_commits
filesystem.read_file
filesystem.write_file
shell.run
github.create_pull_request
```

Agent 在做：

``` text
State s + Available Actions A → Action a
```

近似 Policy：

``` text
π(a | s)
```

因此 Tool Description 会影响 Agent Performance。

### Tool Calling

``` text
LLM
 ↓
Harness
 ↓
MCP Client
 ↓
Transport
 ↓
MCP Server
 ↓
Implementation
```

职责分离：

``` text
Model → 决定意图
Protocol → 传输结构化请求
Server → 实现能力
Harness → 决定 Observation 怎样影响下一步推理
```

### Memory

MCP 不是 Memory，但可以暴露 Memory：

``` text
Agent → MCP → Memory Server → Database / Vector Store / Files
```

可以区分：

``` text
Model Context = Working Memory
Conversation State = Episodic Memory
Database = Persistent External Memory
MCP Tool/Resource = Access Mechanism
```

### Execution

``` text
MCP Tool Call → Adapter → External API → Real System
```

抽象无法消灭 Rate Limit、Permission、Eventual Consistency、Async Job
等底层现实。

### Observation

``` text
State_t
 ↓
Action_t
 ↓
Environment
 ↓
Observation_t+1
 ↓
State_t+1
```

只有 Tool Calling 是 Automation；Tool + Observation + Iterative
Reasoning 才真正形成 Agent Loop。

### Evaluation

``` text
Syntax
 ↓
Unit Test
 ↓
Integration Test
 ↓
Behavior Verification
 ↓
Requirement Satisfaction
```

重要原则：

> 改变世界的 Tool 与测量世界的 Tool 最好分离。

``` text
Actuator ≠ Sensor
```

### Recovery

``` text
Failure
 ↓
Classify
 ├── transient → retry
 ├── missing context → retrieve
 ├── permission → escalate
 ├── wrong plan → re-plan
 └── unsafe → stop
```

Protocol 负责表达 Failure，Harness 负责 Recovery Policy。

### Output

最终四行回答背后可能有几十次 Model Call 与 Tool Call。

因此 Agent Evaluation 应关注：

``` text
Success Rate
Tool Efficiency
Recovery Quality
Cost
Latency
Safety
Traceability
Human Intervention Rate
```

Agent Evaluation 本质是 Systems Evaluation。

------------------------------------------------------------------------

## 6. 架构图

``` text
USER
 │ Goal
 ▼
AGENT HOST
 ├── Model ◄──► Agent Harness
 │              Plan / Memory / Evaluation
 │
 └── MCP Clients
        │
   stdio / HTTP
        │
   ┌────┼─────────┐
   ▼    ▼         ▼
 Git  Database  Browser
Server Server    Server
   │    │         │
   ▼    ▼         ▼
External Systems
```

认知闭环：

``` text
Goal
 ↓
Context
 ↓
Reason
 ↓
Select Capability
 ↓
MCP Tool Call
 ↓
Environment
 ↓
Observation
 ↓
Evaluation
 ↓
Success? ──Yes→ Output
   │
   No
   ↓
Re-plan ─────→ Reason
```

------------------------------------------------------------------------

## 7. 核心设计决策

**Client--Server Separation：** 用额外 Transport 与 Version Complexity
换 Independent Evolution 与 Reuse。

**Structured Schema：** 用受约束 Action 缩短 Semantic Reasoning 与
Deterministic Execution 的距离。

**Tools 与 Resources 分离：** 因为"获取信息"和"改变世界"风险不同。

**只标准化边界：** MCP 不规定 Model 怎样 Planning、Memory 或
Reasoning，避免 Protocol 限制 Intelligence Innovation。

**Stateless Direction：** 2026-era 官方 SDK 文档描述了更显式的 Stateless
Lifecycle。其逻辑类似 Distributed Systems：

``` text
Less Hidden State
→ Easier Routing
→ Horizontal Scaling
```

代价是更多 State 必须显式表达。

------------------------------------------------------------------------

## 8. 与其他工程学科的连接

### Software Engineering

``` text
Agent → Protocol ← Service Adapter
```

体现 Dependency Inversion。

### Operating Systems

``` text
Application → System Call → Kernel → Driver → Hardware
Model → Tool Intent → Harness → MCP → Adapter → External System
```

共同思想：Abstract Intention 与 Concrete Side Effect 之间需要 Controlled
Interface。

### Distributed Systems

Remote Tool 会遇到 Partial
Failure、Latency、Retry、Idempotency、Authentication、Versioning、Async
Completion。

官方 Tasks Extension 已支持 Async Task Handle。

### Control Theory

``` text
Goal
 ↓
Controller (LLM + Harness)
 ↓
Actuator (Tool)
 ↓
Plant (Environment)
 ↓
Sensor (Observation)
 ↓
Feedback
```

可靠 Agent 应该从 Open-loop 走向 Closed-loop。

### Machine Learning

\[ a_t `\sim `{=tex}`\pi`{=tex}(a `\mid `{=tex}s_t, A) \]

\[ s\_{t+1} = f(s_t, a_t, o\_{t+1}) \]

因此可以优化的不只有 Model，还有 State Representation、Tool
Description、Action Retrieval、Observation 与 Evaluator。

### HCI

传统 HCI 问"人怎样理解 Interface"。

Agent Engineering 开始问：

> 模型怎样稳定理解并操作 Interface？

API Design 正在成为 Agent 的 **Cognitive Ergonomics**。

------------------------------------------------------------------------

## 9. Security

``` text
Identity
 ↓
Authentication
 ↓
Authorization
 ↓
Tool Allowlisting
 ↓
Argument Validation
 ↓
User Approval
 ↓
Sandbox
 ↓
Audit Trail
```

最重要原则：

> **Tool Description 不是 Security Boundary。**

"模型认为不应该做"永远弱于"系统没有权限就无法做"。

------------------------------------------------------------------------

## 10. Reconstruction：从零做 Mini-MCP Agent

**Stage 0：** Hard-coded Function，学习基础 Tool Calling。

**Stage 1：** 把 Function 变成 Schema：

``` text
Function → Described Capability
```

**Stage 2：** 独立 Tool Server：

``` text
Agent → Client → stdio → Server
```

**Stage 3：** Capability Discovery，让 Action Space 动态化。

**Stage 4：** Multiple Servers，此时问题从 Connectivity 转为 Routing。

**Stage 5：** 增加 Verification Tool，形成 Closed Loop。

**Stage 6：** 建立 Read-only / Write / External Side Effect /
Destructive 的 Permission Class，并映射 Auto / Ask / Deny。

**Stage 7：** Async Task：

``` text
tool_call → task_id → poll/update → result
```

**Stage 8：** Tool Retrieval：

``` text
Task
 ↓
Tool Retriever
 ↓
Top-k Capabilities
 ↓
Model
```

此时你已经从 Tool Calling Demo 进入 Agent Infrastructure。

------------------------------------------------------------------------

## 11. Skill Extraction

### Capability Discovery

``` text
Inspect → Read Metadata → Filter → Expose Minimal Action Set
```

### Safe Tool Invocation

``` text
Intent → Choose → Validate → Permission → Execute → Record
```

### Evidence Gathering

``` text
Question → Source → Retrieve → Cross-check → Update Reasoning
```

### Closed-loop Execution

``` text
Goal → Act → Observe → Evaluate → Correct
```

### Failure Recovery

``` text
Detect → Classify → Recovery Policy → Retry / Re-plan / Escalate
```

成熟 Agent 应该把 Recovery 当作显式 Skill。

------------------------------------------------------------------------

## 12. 通用 Agent Reverse Engineering Framework

以后分析任何 Agent，都依次问：

**Goal：** 接受什么 Objective？怎样定义 Success？

**Environment：** 能观察和修改什么？

**Context：** 什么进入 Context？什么动态 Retrieval？

**Reasoning：** Planning 显式还是隐式？Long Task 怎样分解？

**Capability：** Tool 怎样 Discovery、Description、Selection、Update？

**Memory：** Working Memory 与 Persistent Memory 在哪里？谁写、谁取？

**Execution：** Action 在哪里执行？有什么 Side Effect？Sync 还是 Async？

**Feedback：** Observation 怎样返回？谁独立验证 Success？

**Recovery：** Failure 后 Retry、Re-plan、Escalate 还是 Stop？

**Safety：** Permission、Sandbox、Approval、Audit 怎样实现？

**Economics：** Model Call、Tool Call、Context、Latency、Cost
集中在哪里？

**Architecture：** 哪些模块 Tight Coupling？哪些 Interface
Standardized？Scale ×100 时哪里先崩？

这套框架把"看产品"升级为 **Systems Analysis**。

------------------------------------------------------------------------

## 13. Future Research Questions

1.  当 Agent 有 10,000 甚至 1,000,000 个 Capability 时，Tool Selection
    是否会变成 Search Engine Problem？

2.  Agent 能否读取任意 API Documentation，自动生成高质量 MCP Interface？

3.  Long-term Memory 应该属于 Host、Memory Server、Domain
    Application，还是分布式存在？

4.  Agent 是否会根据 Trust、Latency、Permission、Price、Data Locality
    主动协商 Capability？

5.  当 MCP 不断增加 Tool、Resource、Task、Discovery、Authorization
    时，Protocol 与 Agent Runtime 的边界在哪里？

6.  如何衡量 Tool 的 "Agent Usability"：Selection Accuracy、Argument
    Accuracy、Token Overhead、Recovery Rate、Error Informativeness？

7.  开放 Capability Ecosystem 中，Provenance 与 Supply-chain Security
    怎样规模化？

------------------------------------------------------------------------

## 14. Research Insight

MCP 最深层的启示不是：

> "Agent 可以连接更多工具。"

而是：

> **一旦 Intelligence 可以行动，Interface 本身就会成为 Intelligence
> 的一部分。**

模型真正能做到什么，取决于周围系统让什么世界变得：

``` text
Visible
+
Understandable
+
Actionable
```

于是：

``` text
Raw Intelligence
        ↓
Interface
        ↓
Available World
        ↓
Possible Actions
        ↓
Observed Consequences
        ↓
Effective Intelligence
```

AI Engineering 的中心因此开始从：

``` text
Model Architecture
```

扩展到：

``` text
System Architecture
```

工程师必须同时思考：

``` text
Models
+
Context
+
Protocols
+
Tools
+
Memory
+
Permissions
+
Evaluation
+
Feedback
```

核心问题也从：

> "怎样做出更聪明的 Model？"

逐渐变成：

> **"怎样设计一个 Environment，让 Intelligence
> 能够可靠地理解、行动、观察并修正自己？"**

这就是从 **Model Engineering** 向 **Agent Systems Engineering** 的转变。

MCP 值得研究，不是因为它只是新的 API，而是因为它暴露了一个关键架构层：

> **孤立的 Intelligence，究竟怎样开始成为一个 Ecosystem。**

------------------------------------------------------------------------

# Sources & Further Reading

-   Model Context Protocol TypeScript SDK v2:
    https://ts.sdk.modelcontextprotocol.io/v2/
-   Model Context Protocol Python SDK v2:
    https://py.sdk.modelcontextprotocol.io/
-   MCP Protocol Versions:
    https://ts.sdk.modelcontextprotocol.io/v2/protocol-versions
-   MCP Tasks Extension SEP-2663:
    https://tasks.extensions.modelcontextprotocol.io/seps/2663-tasks-extension
-   Official MCP Registry: https://registry.modelcontextprotocol.io/
