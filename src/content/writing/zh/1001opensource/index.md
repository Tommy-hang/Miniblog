---
title: "AgentLightning_1001"
description: "A systems-level study of Microsoft Research's Agent Lightning v1.0 and its Harnessed Agentic RL paradigm: why real agent harnesses should participate directly in post-training, how the framework decouples agent execution from RL infrastructure, and what this means for the future of continuously improving AI systems."
date: 2026-10-01
tags:
  - AI
draft: false
featured: false
---


# Agent Lightning — Training the Agent You Actually Deploy

> **Daily Open Source Discovery · 2026-09-30**

---

# Part I — English Research Article

## 0. Today's Core Question

Modern agents have moved far beyond the simple pattern:

```text
User
 ↓
Prompt
 ↓
LLM
 ↓
Answer
```

A capable production agent increasingly looks like:

```text
Model
+
System Prompt
+
Tools
+
Memory
+
Context Management
+
Planner
+
Subagents
+
Sandbox
+
Environment
+
Control Flow
```

Together, these surrounding components form what is increasingly called an **agent harness**.

This creates a new training problem.

Suppose we build a coding agent that can inspect repositories, call shell tools, edit files, run tests, recover from errors, compress context, and delegate subtasks. We now want to improve the underlying model with reinforcement learning.

What exactly should we train?

The obvious answer is:

> Train the model on agent trajectories.

But the actual deployed system is not simply a model.

It is:

```text
Model
        inside
Agent Harness
        inside
Environment
```

If the RL framework reconstructs a simplified copy of the agent loop for training, then the system being optimized is no longer exactly the system being deployed.

Agent Lightning is built around a powerful architectural answer:

> **Do not rebuild the agent inside the RL framework. Let the real agent harness run, and train through it.**

The project calls this paradigm:

# Harnessed Agentic Reinforcement Learning

This makes Agent Lightning unusually valuable because it connects several trends:

```text
Agent Engineering
        +
Reinforcement Learning
        +
Coding Agents
        +
Distributed Systems
        +
Agent Harnesses
        +
Continuous Improvement
```

The project also reports strong coding-agent results on SWE-bench Verified, including improvements for Qwen3.5 models using relatively small RL datasets. Those benchmark numbers are notable, but the architecture behind them is more important.

---

# 1. Project Overview

## Project

**Agent Lightning v1.0**

## Organization

Microsoft Research

## Official Repository

https://github.com/microsoft/agent-lightning

## Technical Report

https://arxiv.org/abs/2608.17528

## Category

```text
Agentic Reinforcement Learning
+
Agent Infrastructure
+
Post-training
+
Coding Agents
+
Distributed Training
```

## Ecosystem Position

Agent Lightning sits at the intersection of two traditionally separate worlds:

```text
Agent Runtime / Harness
          +
RL Training Infrastructure
```

Most agent frameworks focus on execution:

- tools;
- planning;
- memory;
- orchestration;
- environments.

Most RL frameworks focus on optimization:

- rollout collection;
- reward;
- advantage estimation;
- loss;
- gradient updates.

Agent Lightning attempts to connect the two without forcing one side to absorb the other.

Its v1.0 architecture is deliberately lightweight and centers on three components:

```text
Trainer
API Gateway
Rollout Controller
```

The simplicity is not cosmetic. It reflects a systems principle:

> Use the smallest layer necessary to connect real agent execution with learning.

---

# 2. Problem — Why Does This Project Exist?

## 2.1 Traditional RL Post-Training

A simplified RL pipeline for an LLM looks like:

```text
Prompt
 ↓
Policy Model
 ↓
Response
 ↓
Reward
 ↓
Advantage
 ↓
Gradient Update
 ↓
Improved Policy
```

This works naturally when the model produces one coherent response.

But an agent trajectory is very different.

A coding agent may produce:

```text
Goal
 ↓
Model Call
 ↓
Repository Search
 ↓
Model Call
 ↓
Read File
 ↓
Model Call
 ↓
Edit
 ↓
Run Tests
 ↓
Failure
 ↓
Model Call
 ↓
Debug
 ↓
Edit
 ↓
Run Tests
 ↓
Success
```

The resulting learning problem is no longer “reward one answer.”

It becomes:

> **How do we learn from a sequence of model decisions embedded inside a larger software system?**

---

# 3. Previous Solution — Put the Agent Inside the Trainer

A straightforward design is:

```text
RL Trainer
│
├── Model
├── Agent Loop
├── Tool Calls
├── Environment
└── Reward
```

This gives the trainer complete control.

It is convenient for optimization.

But a production agent may actually look like:

```text
Production Harness
│
├── Custom Context Logic
├── MCP Tools
├── Memory
├── Sandbox
├── Retry Policy
├── Custom Prompts
├── Subagents
└── Framework-Specific Control Flow
```

To reproduce this inside the trainer, developers must rebuild large portions of the actual system.

Then:

```text
Training Agent
        ≠
Production Agent
```

This is the **training-deployment mismatch**.

---

# 4. Why Training-Deployment Mismatch Matters

Imagine the real deployed agent summarizes context after a large token threshold.

The training system does not.

Then:

```text
Training:
Full Historical Context

Deployment:
Compressed Context
```

Or production may use a repository-search tool while training uses a simplified simulator.

Again:

```text
Training Environment
        ≠
Deployment Environment
```

The learned policy can become specialized to conditions that do not match reality.

This resembles the **sim-to-real gap** in robotics.

```text
Train Harness
 ↓
Learn Policy
 ↓
Deploy in Different Harness
 ↓
Behavior Shift
```

Agent Lightning's answer is simple:

> **Train through the actual harness rather than reconstructing it.**

---

# 5. Core Idea — Harnessed Agentic RL

The architecture becomes:

```text
              TRAINING SYSTEM

                  Trainer
                     │
                     │ policy updates
                     ▼
                   Model
                     ▲
                     │
               API Gateway
                     ▲
                     │
                     │ normal model API
                     │
              REAL AGENT HARNESS
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
      Tools       Context      Control Flow
        │            │            │
        └────────────┼────────────┘
                     ▼
                Environment
```

The key inversion is:

> **The harness owns the interaction loop.**

The trainer does not attempt to control the entire application.

Instead, it observes model interactions through a stable boundary.

This is a profound architectural move because it separates:

```text
How the agent works
```

from:

```text
How the model learns
```

---

# 6. Architecture Deep Dive

A simplified v1.0 data path looks like:

```text
Task
 ↓
Rollout Controller
 ↓
Real Agent Harness
 ↓
API Gateway
 ↓
Policy Model
 ↓
Response
 ↓
Agent Tool / Environment Interaction
 ↓
Reward / Outcome
 ↓
Trajectory Data
 ↓
Trainer
 ↓
Policy Update
```

The three main pieces each solve a distinct problem.

---

# 7. Component One — Rollout Controller

The Rollout Controller answers:

> **Where and how should agents actually run?**

For a coding agent, a rollout may require:

```text
Repository
+
Python Environment
+
Dependencies
+
Shell
+
Tests
+
Filesystem
+
Network Policy
+
Agent Process
```

This is an execution workload, not just text generation.

Agent execution is often:

```text
I/O-heavy
Environment-heavy
Irregular
Long-running
```

Training is:

```text
GPU-heavy
Tensor-heavy
Batch-oriented
Compute-intensive
```

These are different workloads.

A better architecture separates them:

```text
Agent Execution
      ↓
CPU / Containers / Kubernetes

Training
      ↓
GPU Cluster
```

This is classic distributed-systems thinking:

> Separate subsystems with different resource characteristics.

---

# 8. Component Two — API Gateway

This is arguably the most elegant layer.

Most agents already call models through an API.

Normally:

```text
Agent
 ↓
Model API
```

Agent Lightning inserts itself into this boundary:

```text
Agent
 ↓
Agent Lightning Gateway
 ↓
Training Model
```

The agent still behaves as if it is calling a normal model endpoint.

The Gateway can observe:

```text
Request
Response
Metadata
Trajectory Association
```

This creates a powerful property:

> **The agent does not need to know that it is being trained.**

The real harness can remain almost unchanged.

---

# 9. Why the Gateway Abstraction Matters

This is a general systems principle:

> Find a stable interface boundary and instrument it.

Instead of separately modifying:

```text
LangChain Agent
AutoGen Agent
Custom Agent
Coding Agent
Search Agent
```

you instrument:

```text
Model API Boundary
```

Because all of them eventually ask a model to generate something.

Thus:

```text
Different Harnesses
        ↓
Common Model Interface
        ↓
Gateway
```

This resembles observability infrastructure.

Distributed tracing does not rewrite your application.

It instruments important boundaries.

Agent Lightning turns model invocation into a **training observability boundary**.

---

# 10. Component Three — Trainer

The Trainer performs learning.

Conceptually:

```text
Captured Agent Interactions
        ↓
Trajectory Assembly
        ↓
Training Sample Construction
        ↓
Reward
        ↓
Advantage Estimation
        ↓
Loss
        ↓
Gradient Update
        ↓
New Policy
```

This looks conventional until we notice that one task may contain many independent model calls.

That creates a hard problem:

# Credit Assignment

---

# 11. Credit Assignment — Who Deserves the Reward?

Imagine:

```text
Model Call A
 ↓
Wrong hypothesis

Model Call B
 ↓
Useful search

Model Call C
 ↓
Correct diagnosis

Model Call D
 ↓
Bad patch

Model Call E
 ↓
Correct patch
```

Final reward:

```text
Tests Passed = 1
```

Who deserves credit?

Equal reward would imply:

```text
A = good
B = good
C = good
D = good
E = good
```

But success actually came from:

```text
Helpful Decisions
+
Neutral Decisions
+
Wrong Decisions
+
Recovery
```

This is temporal credit assignment inside a complex agent system.

The core lesson is:

> A successful trajectory does not imply every local decision was good.

---

# 12. Why Agent RL Is Harder Than Chat RL

Chat RL often looks like:

```text
Prompt
 ↓
One Response
 ↓
Reward
```

Agent RL looks like:

```text
Prompt
 ↓
Response 1
 ↓
Tool
 ↓
Response 2
 ↓
Environment
 ↓
Response 3
 ↓
Tool
 ↓
Response 4
 ↓
Reward
```

Therefore the system must distinguish:

```text
Trajectory Boundary
Sample Boundary
Token Boundary
Reward Boundary
```

These are not necessarily the same.

That is a central conceptual lesson of agent RL.

---

# 13. Retokenization — A Small Detail With Large Consequences

Suppose rollout text is later re-tokenized during training.

Differences may arise because of:

- tokenizer versions;
- chat templates;
- special tokens;
- whitespace;
- tool-call serialization;
- server-side preprocessing.

Then:

```text
Rollout Tokens
        ≠
Training Tokens
```

Now the trainer may optimize probabilities over a sequence that differs from what the policy actually generated.

This **retokenization drift** illustrates a broader principle:

> In training systems, representation fidelity matters.

At the conceptual level:

```text
"Train on the agent output."
```

sounds simple.

At implementation level:

```text
Which exact tokens?
Which chat template?
Which policy version?
```

becomes critical.

---

# 14. Sample Merging

A task may produce:

```text
Call A
Call B
Call C
Call D
Call E
```

How should they become samples?

```text
[A][B][C][D][E]
```

or:

```text
[A+B+C+D+E]
```

or something hierarchical?

The decision affects:

- sequence length;
- gradient statistics;
- reward attribution;
- batching efficiency.

Therefore data construction is part of the optimization design.

---

# 15. Loss Normalization

Consider:

```text
Trajectory A:
2 model calls
1,000 tokens

Trajectory B:
18 model calls
12,000 tokens
```

Should B contribute twelve times more gradient simply because it contains more tokens?

Not necessarily.

Possible normalization units include:

```text
Per Token
Per Sequence
Per Agent Turn
Per Trajectory
```

Each choice implies a different answer to:

> What is the basic unit of learning?

This is why agent RL is not simply “PPO + tools.”

---

# 16. Backend Scheduling

Agent rollout durations are irregular.

Some tasks finish quickly.

Others take minutes.

Some fail.

Some wait on external services.

GPUs prefer large, regular batches.

So the system must bridge:

```text
Irregular Agent World
        ↓
Scheduling Layer
        ↓
Regular GPU Training World
```

Agent Lightning's disaggregated architecture makes this mismatch explicit.

The Controller manages execution.

The Trainer manages learning.

The Gateway connects them.

---

# 17. Synchronous vs Asynchronous Training

Synchronous training:

```text
Collect Rollouts
 ↓
Stop
 ↓
Train
 ↓
Update Policy
 ↓
Collect Again
```

is simple but may waste resources.

Asynchronous training:

```text
Agents collecting
      │
      ├─────────────┐
      ▼             │
Training            │
      │             │
      ▼             │
New Policy ─────────┘
```

improves throughput.

But it creates **policy staleness**:

```text
Current Policy = π_t

Trajectory Generated By = π_(t-k)
```

This creates the trade-off:

```text
Hardware Utilization
        vs
Policy Freshness
```

Again, agent RL becomes a runtime-coordination problem, not only an algorithm problem.

---

# 18. Real Harnesses Change the Learning Problem

Consider two agents with the same model.

Agent A:

```text
Model
+
Shell
+
Basic Prompt
```

Agent B:

```text
Same Model
+
Repository Search
+
Context Compression
+
Patch Tool
+
Test Runner
+
Planning
+
Retry Logic
```

Even though the model is identical, the learning environment is not.

The model experiences different:

```text
Observations
Actions
Feedback
State Transitions
```

Therefore:

```text
Agent Learning Problem
=
Model
+
Harness
+
Environment
+
Reward
```

not:

```text
Agent Learning Problem
=
Model
+
Reward
```

The harness partly defines the RL environment.

---

# 19. The Harness Becomes Part of Post-Training

Traditional development:

```text
Pretraining
 ↓
Post-training
 ↓
Deploy Model
 ↓
Build Product
```

Harnessed Agentic RL:

```text
Model
 ↓
Deploy Inside Harness
 ↓
Agent Interacts
 ↓
Collect Real Trajectories
 ↓
RL Training
 ↓
Improved Model
 ↓
Return to Same Harness
```

Now deployment architecture feeds back into model optimization.

The boundary between:

```text
Model Engineering
```

and:

```text
Application Engineering
```

starts to blur.

---

# 20. Why Agent Experience Is Valuable Training Data

Static supervised data:

```text
Input
 ↓
Ideal Answer
```

Agent experience:

```text
Goal
 ↓
Decision
 ↓
Action
 ↓
Environment Feedback
 ↓
Failure
 ↓
Recovery
 ↓
Outcome
```

This contains:

- planning;
- tool selection;
- information gathering;
- error recovery;
- stopping decisions;
- self-correction.

The environment provides **consequences**.

This suggests:

```text
Static Internet Data
        ↓
Pretraining

Human Preference Data
        ↓
Post-training

Agent Experience Data
        ↓
Environment-Grounded Improvement
```

Agent Lightning is infrastructure for the third category.

---

# 21. Reward Design — The Quietly Dangerous Layer

RL optimizes the reward that actually exists.

Not the intention behind it.

A naive coding reward:

```text
Tests Pass = +1
Tests Fail = 0
```

may encourage shortcuts such as:

```text
Modify tests
Disable validation
Hard-code benchmark behavior
Exploit environment
```

This is reward hacking.

The systems lesson is:

> **Evaluation architecture is part of intelligence architecture.**

If the reward is wrong, the system can efficiently optimize the wrong behavior.

---

# 22. Engineering Trade-off I — Realism vs Control

Real harness:

```text
Deployment Fidelity ↑
```

but:

```text
Trainer Control ↓
```

Traditional integrated RL:

```text
Trainer owns everything
```

Harnessed RL:

```text
Harness owns execution
Trainer observes through boundary
```

So:

```text
Realism ↑
Integration burden ↓

but

Execution variability ↑
Debugging complexity ↑
```

Agent Lightning chooses realism.

---

# 23. Engineering Trade-off II — Flexibility vs Optimization

Supporting arbitrary harnesses increases compatibility:

```text
LangChain
AutoGen
Custom Agent
Coding Agent
Search Agent
```

but reduces aggressive framework-specific optimization.

The trade-off is:

```text
General Interface ↑
Interoperability ↑

Specialized Optimization ↓
```

The Gateway makes that compromise practical.

---

# 24. Engineering Trade-off III — Intelligence vs Cost

Agentic RL costs include:

```text
Model Inference
+
Environment Execution
+
Tool Calls
+
Sandbox
+
Training GPUs
+
Storage
```

Therefore sample efficiency is crucial.

The useful objective is not merely:

```text
Benchmark Score
```

but something closer to:

```text
Improvement
────────────
Total Training Cost
```

---

# 25. Engineering Trade-off IV — Speed vs Accuracy

Longer rollouts may allow:

```text
More Search
More Testing
More Recovery
```

but increase:

```text
Latency
Inference Cost
Trajectory Length
Training Complexity
```

Agent systems therefore have at least two reasoning budgets:

```text
Deployment Reasoning Budget
+
Training Rollout Budget
```

Jointly optimizing them is an important future systems problem.

---

# 26. Engineering Trade-off V — Generalization vs Control

A general harness may allow arbitrary:

```text
Tools
Control Flow
Subagents
Memory
```

but every degree of freedom complicates training.

Thus:

```text
Harness Freedom ↑
Training Predictability ↓
```

Agent Lightning does not standardize the implementation.

It standardizes the boundary.

This gives a transferable principle:

> When you cannot standardize the implementation, standardize the interface.

---

# 27. Why the Small Framework Matters

Research infrastructure can easily become too complicated to inspect.

Agent RL already includes:

```text
Distributed Execution
+
Inference
+
Training
+
Trajectory Processing
+
Reward
+
Scheduling
```

A lightweight framework is valuable because researchers can still answer:

> Why did this experiment behave this way?

This aligns strongly with the MiniMind philosophy:

> Reduce implementation complexity while preserving conceptual completeness.

---

# 28. Scalability — Why Kubernetes Appears

Large-scale agent rollout is naturally job-oriented.

A repository task may require:

```text
Fresh Container
Repository Checkout
Dependency Installation
Agent Execution
Tests
Cleanup
```

This maps naturally to:

```text
Kubernetes Job
```

Architecture:

```text
Rollout Controller
 ↓
Create Job
 ↓
Agent Container
 ↓
Repository Environment
 ↓
Gateway
 ↓
Model
 ↓
Reward
```

AI research here becomes distributed-systems engineering.

---

# 29. Security Considerations

Coding agents may have:

```text
Shell
Filesystem
Package Manager
Network
Repository
```

Training multiplies the number of executions.

Therefore safe infrastructure must consider:

```text
Container Isolation
Network Restrictions
Credential Isolation
Filesystem Boundaries
Resource Limits
Artifact Validation
Dependency Security
```

The broader lesson:

> Agent RL infrastructure is also sandbox infrastructure.

Training agents means executing many partially unpredictable programs.

---

# 30. Why Agent Lightning Is Worth Studying

It teaches several transferable principles.

## Principle 1 — Train the Real System

If production behavior depends on the harness, include the harness in the learning loop.

## Principle 2 — Decouple Through Stable Interfaces

Do not rewrite every agent.

Instrument a shared boundary.

## Principle 3 — Separate Different Workloads

Execution and training have different resource characteristics.

Disaggregate them.

## Principle 4 — Experience Is Data

Agent trajectories are potential training material.

## Principle 5 — Evaluation Is Part of the System

Reward design determines what the agent learns.

## Principle 6 — Simplicity Improves Researchability

A smaller framework makes system behavior easier to understand.

## Principle 7 — The Harness Defines the Learning Environment

Changing tools or context management changes what the model experiences.

---

# 31. Could I Rebuild It?

Do not reproduce the full production stack first.

Apply:

# The MiniMind Principle

```text
Preserve Architecture
Reduce Scale
```

---

# 32. Full Production Version

A production system may require:

```text
Agent RL Platform
│
├── Policy Model
├── Inference Server
├── API Gateway
├── Rollout Controller
├── Agent Harness
├── Environment Manager
├── Reward System
├── Trajectory Store
├── Sample Builder
├── RL Trainer
├── Checkpoint Manager
├── Scheduler
├── Sandbox
├── Observability
└── Distributed Infrastructure
```

Required knowledge:

- PyTorch;
- Transformers;
- vLLM;
- reinforcement learning;
- PPO / GRPO-style methods;
- distributed training;
- containers;
- Kubernetes;
- agent frameworks;
- model serving.

This is not a beginner starting point.

---

# 33. Simplified Learning Version — Mini Agent Lightning

A student version could be:

```text
MiniAgentLightning/
│
├── agent.py
├── model_server.py
├── gateway.py
├── environment.py
├── trajectory.py
├── reward.py
├── trainer.py
└── run.py
```

Architecture:

```text
Task
 ↓
Agent
 ↓
Gateway
 ↓
Small Model
 ↓
Agent Action
 ↓
Environment
 ↓
Reward
 ↓
Trajectory
 ↓
Trainer
```

The environment can be simple.

Example:

> Arithmetic tasks + calculator tool.

The agent learns:

```text
When should I calculate?
What should I ask the tool?
How should I use the result?
```

This preserves the core architecture.

---

# 34. Minimum Prototype

Initially, skip RL entirely.

Build the data path:

```text
Agent
 ↓
Proxy
 ↓
Model
 ↓
Response
 ↓
Proxy logs interaction
 ↓
Environment
 ↓
Reward
 ↓
trajectory.json
```

Example:

```json
{
  "task": "Calculate 37 * 18",
  "calls": [
    {
      "prompt": "...",
      "response": "...",
      "tool": "calculator"
    }
  ],
  "reward": 1
}
```

You have now reproduced the deepest architectural idea:

> **The real agent can run normally while an external learning system observes its model interactions.**

Only then should you add training.

---

# 35. Suggested Student Roadmap

```text
V0.1
Agent + Tool

↓

V0.2
Add Model Proxy

↓

V0.3
Record Trajectories

↓

V0.4
Add Automatic Reward

↓

V0.5
Create Training Samples

↓

V0.6
Supervised Fine-Tuning

↓

V0.7
Simple Policy Optimization

↓

V0.8
Multiple Parallel Agents
```

This sequence teaches architecture before mathematics overwhelms the project.

---

# 36. Connection to AI Agents

Most deployed agents are still effectively static.

Today:

```text
Agent
 ↓
Task
 ↓
Experience
 ↓
Discard
```

Agent Lightning suggests:

```text
Agent
 ↓
Task
 ↓
Experience
 ↓
Training Signal
 ↓
Model Improvement
 ↓
Better Agent
```

This closes the learning loop.

Memory stores experience.

Learning changes future behavior.

---

# 37. Connection to Workflow Design

Suppose an agent repeatedly discovers that:

```text
Search
 ↓
Read Relevant File
 ↓
Run Test
 ↓
Edit
 ↓
Run Test
```

works better than:

```text
Read Random Files
 ↓
Edit Immediately
```

RL can gradually shift the policy toward better workflow decisions.

This creates a hybrid:

```text
Human-Designed Harness
        +
Learned Local Decisions
```

which may be more practical than either:

```text
Everything Hard-Coded
```

or:

```text
Everything Autonomous
```

---

# 38. Connection to Human-AI Collaboration

A richer collaboration loop is:

```text
Human
 ↓
Define Goal
 ↓
Agent Works
 ↓
Human Evaluates
 ↓
Learning System
 ↓
Agent Improves
```

This is more powerful than repeatedly correcting the same static system.

---

# 39. Connection to Memory Systems

Memory and learning operate at different timescales.

Memory:

```text
"Remember that this repository uses uv."
```

Learning:

```text
"When repositories use uv, prefer uv-native commands."
```

A mature agent may contain:

```text
Working Context
+
Task Memory
+
Long-Term Memory
+
Skills
+
Learned Policy
```

Each solves a different problem.

---

# 40. Connection to Personal Intelligence Systems

Imagine a Personal Intelligence System running:

```text
Daily AI Exploration
Daily Open Source Discovery
Deep Concept Research
Engineering First Principles
Aviation Research
```

Each run produces experience.

For Open Source Discovery:

```text
Which sources were useful?
Which repositories were misleading?
Which architecture questions produced insight?
Which article structures worked?
```

For Aviation Research:

```text
Which sources consistently produced high-value information?
Which questions exposed important trade-offs?
```

If this experience is captured:

```text
Personal Research Agent
        ↓
Execute Workflow
        ↓
Evaluate Result
        ↓
Collect Experience
        ↓
Improve Policy / Skill / Routing
        ↓
Better Future Research
```

Agent Lightning suggests one missing layer:

> **How can experience flow back into the intelligence that produced it?**

---

# 41. Three Levels of Improvement

A personal agent can improve at three levels.

## Level 1 — Memory Improvement

```text
Remember better facts.
```

## Level 2 — Skill Improvement

```text
Develop better reusable procedures.
```

## Level 3 — Policy Improvement

```text
Change behavioral tendencies through training.
```

Together:

```text
Experience
   │
   ├── Facts ─────→ Memory
   │
   ├── Procedures → Skills
   │
   └── Behavior ──→ RL / Fine-tuning
```

This is much richer than storing all experience as RAG data.

---

# 42. Researcher's Notes

## Question 1 — What Should Be Learned by the Model?

If an agent fails because its tool description is poor, should we train the model or fix the tool?

```text
Failure
 ↓
Model problem?
Harness problem?
Tool problem?
Memory problem?
Reward problem?
```

Not every failure should become gradient descent.

---

## Question 2 — Can Harness and Model Co-Evolve?

Imagine:

```text
Model improves
 ↓
Optimal harness changes
 ↓
Harness improves
 ↓
New trajectories
 ↓
Model improves again
```

Then:

```text
Model
↕
Harness
```

becomes a joint optimization problem.

---

## Question 3 — Can We Learn Skills Instead of Weights?

Some experience may be better stored as a reusable skill than a model update.

```text
Experience
 ↓
Classifier
 ├── Store as Memory
 ├── Compile as Skill
 └── Use for Model Training
```

A future self-improving agent may choose the representation automatically.

---

## Question 4 — What Is the Right Unit of Experience?

Is the learning unit:

```text
Token
 ↓
Action
 ↓
Turn
 ↓
Subtask
 ↓
Trajectory
 ↓
Project
```

Different learning mechanisms may need different levels.

---

## Question 5 — Can Agents Generate Their Own Curriculum?

A future agent could:

```text
Failure History
 ↓
Identify Weakness
 ↓
Generate Practice Tasks
 ↓
Train
 ↓
Evaluate
 ↓
Repeat
```

This turns agent-learning infrastructure into a substrate for **self-directed agent education**.

---

# 43. If I Designed Agent Lightning 2.0

I would add an explicit **Experience Router**:

```text
                    Agent
                      │
                      ▼
                  Experience
                      │
                      ▼
                   Evaluator
                      │
                      ▼
              Experience Router
           ┌──────────┼───────────┐
           ▼          ▼           ▼
        Memory      Skill       Training
           │          │           │
           │          │           ▼
           │          │       RL Dataset
           │          │           │
           └──────────┼───────────┘
                      ▼
                Improved Agent
```

The system would ask:

> What is the cheapest durable way to preserve this lesson?

If it is a fact:

```text
Memory
```

If it is a procedure:

```text
Skill
```

If it reveals a broad behavioral weakness:

```text
Model Training
```

This avoids solving every problem with gradient updates.

---

# 44. A More General Architecture — The Learning Agent Stack

```text
                    Human Goals
                         │
                         ▼
                  Agent Harness
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
      Tools            Memory           Skills
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                    Environment
                         │
                         ▼
                    Experience
                         │
                         ▼
                    Evaluation
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
           Memory      Skills      RL Training
             │           │           │
             └───────────┼───────────┘
                         ▼
                 Improved System
```

Now the agent is not simply an inference product.

It becomes a learning system.

---

# 45. Learning Path

```text
Understand
 ↓
Use
 ↓
Modify
 ↓
Rebuild
 ↓
Innovate
```

## Stage 1 — Understand

Learn:

```text
Agent Harness
Training-Deployment Gap
Rollout
Trajectory
Reward
Credit Assignment
Policy
Gateway
```

Understand why the architecture exists before studying detailed RL mathematics.

## Stage 2 — Use

Run a small example and trace the data:

```text
Who launches the agent?
Where does the model call go?
What does the Gateway record?
Where does reward appear?
How does the Trainer consume it?
```

## Stage 3 — Modify

Change one variable such as the reward function or agent harness and observe how behavior changes.

## Stage 4 — Rebuild

Build a tiny version with:

```text
Python
FastAPI
Small LLM
Simple Tool
JSON Trajectory Store
Automatic Reward
```

Reproduce the data architecture first.

Add RL later.

## Stage 5 — Innovate

Adapt the architecture to a Personal Intelligence System:

```text
Research Agent
 ↓
Daily Research
 ↓
Source Selection
 ↓
Article Generation
 ↓
Evaluation
 ↓
Experience Router
 ├── Memory
 ├── Skill
 └── Training Data
```

Now Daily Open Source Discovery itself can become an experiment in self-improving agents.

---

# 46. Final Reflection

Agent Lightning looks like an RL framework.

But the deeper transition is:

```text
Train Model
```

becoming:

```text
Train Model
Inside the System
Where It Actually Works
```

Modern intelligence is distributed across:

```text
Model
+
Harness
+
Tools
+
Memory
+
Environment
+
Workflow
```

Therefore improving only the isolated model becomes increasingly insufficient.

The core loop is:

```text
Real Agent Harness
        ↓
Real Interaction
        ↓
Captured Experience
        ↓
Training
        ↓
Improved Model
        ↓
Back Into Real Harness
```

This connects:

```text
Deployment
```

with:

```text
Learning
```

A mature Personal Intelligence System may therefore evolve from:

```text
Knowledge
+
Memory
+
Tools
```

toward:

```text
Knowledge
+
Memory
+
Tools
+
Skills
+
Experience
+
Evaluation
+
Learning
```

The system does not merely accumulate information.

It accumulates **ability**.

The deeper progression becomes:

```text
Information
 ↓
Understanding
 ↓
Action
 ↓
Experience
 ↓
Learning
 ↓
Improved Action
 ↓
Innovation
```

The next frontier is not only building agents that can work.

It is building systems in which **work itself becomes training data for becoming better at work**.

That moves us closer to the Personal Intelligence System goal:

**Understanding Complex Systems → Designing New Systems → Creating in the AI Era.**

---

# Part II — 中文完整翻译

# Agent Lightning —— 训练那个真正被部署出去工作的 Agent

> **Daily Open Source Discovery · 2026-09-30**

---

# 0. 今天真正要研究的问题

现代 Agent 已经远远超出了：

```text
用户
 ↓
Prompt
 ↓
LLM
 ↓
回答
```

一个真正有能力完成复杂任务的 Agent 越来越接近：

```text
Model
+
System Prompt
+
Tools
+
Memory
+
Context Management
+
Planner
+
Subagents
+
Sandbox
+
Environment
+
Control Flow
```

这些外围结构共同形成了一个越来越重要的概念：

> **Agent Harness —— Agent 的运行框架与工作环境。**

于是一个新的问题出现了。

假设我们已经做出了一个成熟的 Coding Agent，它能够读取 Repository、调用 Shell、修改代码、运行 Test、处理 Error、压缩 Context，甚至把子任务交给 Subagent。

接下来我们希望通过 Reinforcement Learning 提升它。

问题是：

> **我们究竟在训练什么？**

最直觉的答案是：

> 收集 Agent Trajectory，然后训练模型。

但真正部署出去工作的系统并不是一个孤立的 Model。

而是：

```text
Model
       运行在
Agent Harness
       运行在
Environment
```

如果为了方便 RL Training，Framework 自己重新做一套简化版 Agent Loop，那么 Training 中被优化的系统和真正 Deployment 的系统就已经不一样了。

Agent Lightning 的核心答案是：

> **不要为了训练重新实现一遍 Agent。让真实 Agent Harness 正常运行，然后穿过这个 Harness 完成训练。**

它把这种范式称为：

# Harnessed Agentic Reinforcement Learning

这个项目特别值得研究，因为它把过去经常分开讨论的几个方向连接了起来：

```text
Agent Engineering
        +
Reinforcement Learning
        +
Coding Agent
        +
Distributed System
        +
Agent Harness
        +
Continuous Improvement
```

项目报告的 SWE-bench Verified Coding Agent 实验值得注意，但真正更有长期价值的，是支撑这些实验的系统架构。

---

# 1. Project Overview

## 项目

**Agent Lightning v1.0**

## 开发机构

Microsoft Research

## 官方仓库

https://github.com/microsoft/agent-lightning

## Technical Report

https://arxiv.org/abs/2608.17528

## Category

```text
Agentic Reinforcement Learning
+
Agent Infrastructure
+
Post-training
+
Coding Agent
+
Distributed Training
```

Agent Lightning 位于两个过去相对独立的世界中间：

```text
Agent Runtime / Harness
          +
RL Training Infrastructure
```

Agent Framework 通常解决：

- Tool；
- Planning；
- Memory；
- Workflow；
- Environment。

RL Framework 通常解决：

- Rollout；
- Reward；
- Advantage；
- Loss；
- Gradient Update。

Agent Lightning 的目标，是把两者连接起来，又不让其中一边吞掉另一边。

v1.0 的核心架构刻意保持很小：

```text
Trainer
API Gateway
Rollout Controller
```

这本身就是一种系统设计思想：

> **只增加连接真实 Agent Execution 与 Learning 所必需的最小结构。**

---

# 2. Problem —— 为什么需要 Agent Lightning？

传统 LLM RL 可以抽象成：

```text
Prompt
 ↓
Policy Model
 ↓
Response
 ↓
Reward
 ↓
Advantage
 ↓
Gradient Update
 ↓
Improved Policy
```

当模型只生成一段完整回答时，这非常自然。

但 Agent 的 Trajectory 完全不同。

一个 Coding Agent 可能经历：

```text
Goal
 ↓
Model Call
 ↓
Repository Search
 ↓
Model Call
 ↓
Read File
 ↓
Model Call
 ↓
Edit
 ↓
Run Tests
 ↓
Failure
 ↓
Model Call
 ↓
Debug
 ↓
Edit
 ↓
Run Tests
 ↓
Success
```

问题已经不再是：

> 如何给一段 Answer 一个 Reward？

而变成：

> **如何从一个大型软件系统内部的一连串 Model Decision 中学习？**

---

# 3. Previous Solution —— 把 Agent 放到 Trainer 内部

最直接的方式是：

```text
RL Trainer
│
├── Model
├── Agent Loop
├── Tool Calls
├── Environment
└── Reward
```

这样 Trainer 拥有所有 Control。

训练确实方便。

但真正部署的 Agent 可能是：

```text
Production Harness
│
├── Custom Context Logic
├── MCP Tools
├── Memory
├── Sandbox
├── Retry Policy
├── Custom Prompt
├── Subagents
└── Framework-Specific Control Flow
```

如果想在 Trainer 里训练真实 Agent，就必须重新实现这些结构。

最终：

```text
Training Agent
        ≠
Production Agent
```

这就是：

> **Training-Deployment Mismatch。**

---

# 4. 为什么这个 Gap 很危险？

假设真实 Agent 会在 Context 过大时自动 Summarize。

Training System 不会。

于是：

```text
Training:
Full Historical Context

Deployment:
Compressed Context
```

再比如真实系统使用复杂 Repository Search Tool，而 Training 中只是一个简化模拟器。

于是：

```text
Training Environment
        ≠
Deployment Environment
```

Model 很可能学会只在 Training 条件下有效的 Strategy。

这和 Robotics 的 **Sim-to-Real Gap** 很像：

```text
Train Harness
 ↓
Learn Policy
 ↓
Deploy in Different Harness
 ↓
Behavior Shift
```

Agent Lightning 的核心选择是：

> **直接穿过真实 Harness 训练。**

---

# 5. Core Idea —— Harnessed Agentic RL

整体结构：

```text
              TRAINING SYSTEM

                  Trainer
                     │
                     │ Policy Update
                     ▼
                   Model
                     ▲
                     │
               API Gateway
                     ▲
                     │
                     │ Normal Model API
                     │
              REAL AGENT HARNESS
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
      Tools       Context      Control Flow
        │            │            │
        └────────────┼────────────┘
                     ▼
                Environment
```

最重要的一次架构反转是：

> **Environment Interaction Loop 由 Harness 拥有，而不是由 Trainer 拥有。**

Trainer 不需要重建整个 Application。

它只需要通过稳定 Interface 观察 Model Interaction。

于是：

```text
How the Agent Works
```

与：

```text
How the Model Learns
```

真正被解耦。

---

# 6. Architecture Deep Dive

完整 Data Flow 可以抽象成：

```text
Task
 ↓
Rollout Controller
 ↓
Real Agent Harness
 ↓
API Gateway
 ↓
Policy Model
 ↓
Response
 ↓
Agent Tool / Environment Interaction
 ↓
Reward / Outcome
 ↓
Trajectory Data
 ↓
Trainer
 ↓
Policy Update
```

三个 Component 分别解决三个不同层次的问题。

---

# 7. Rollout Controller —— Agent 到底在哪里工作？

Coding Agent Rollout 可能需要：

```text
Repository
+
Python Environment
+
Dependencies
+
Shell
+
Tests
+
Filesystem
+
Network Policy
+
Agent Process
```

这实际上是一个真实 Execution Workload。

Agent Execution 往往：

```text
I/O Heavy
Environment Heavy
Irregular
Long-running
```

Training 则往往：

```text
GPU Heavy
Tensor Heavy
Batch-oriented
Compute-intensive
```

二者 Resource Characteristic 完全不同。

所以更合理的是：

```text
Agent Execution
 ↓
CPU / Container / Kubernetes

Training
 ↓
GPU Cluster
```

这是非常典型的 Distributed Systems 思想：

> **不同特征的 Workload 应该解耦。**

---

# 8. API Gateway —— 整个设计最漂亮的一层

绝大多数 Agent 都需要调用 Model API。

原本：

```text
Agent
 ↓
Model API
```

现在：

```text
Agent
 ↓
Agent Lightning Gateway
 ↓
Training Model
```

对 Agent 来说，一切仍然像普通 Model Endpoint。

但 Gateway 可以记录：

```text
Request
Response
Metadata
Trajectory Association
```

于是产生一个非常重要的特性：

> **Agent 不需要知道自己正在被训练。**

真实 Harness 几乎不用改变。

---

# 9. Gateway 为什么是一个非常优秀的抽象？

这是一个非常经典的 System Engineering 原则：

> **找到稳定 Boundary，然后 Instrument 它。**

不需要分别修改：

```text
LangChain Agent
AutoGen Agent
Custom Agent
Coding Agent
Search Agent
```

因为它们最终都必须：

```text
Call Model
```

于是：

```text
Different Harnesses
        ↓
Common Model Interface
        ↓
Gateway
```

这与 Distributed Tracing 很像。

Observability System 并不会重写整个 Application，而是观察关键边界。

Agent Lightning 把：

```text
Model Invocation
```

变成：

> **Training Observability Boundary。**

---

# 10. Trainer —— 真正进行 Learning 的地方

抽象之后：

```text
Captured Agent Interaction
        ↓
Trajectory Assembly
        ↓
Training Sample Construction
        ↓
Reward
        ↓
Advantage Estimation
        ↓
Loss
        ↓
Gradient Update
        ↓
New Policy
```

问题在于：

> 一个 Agent Episode 中可能拥有很多独立 Model Call。

于是马上遇到：

# Credit Assignment

---

# 11. 最后的成功究竟是谁的功劳？

假设：

```text
Model Call A
 ↓
错误 Hypothesis

Model Call B
 ↓
找到关键 File

Model Call C
 ↓
正确诊断

Model Call D
 ↓
错误 Patch

Model Call E
 ↓
正确 Patch
```

最终：

```text
Tests Passed = 1
```

如果全部获得相同 Reward：

```text
A = Good
B = Good
C = Good
D = Good
E = Good
```

显然是错的。

最终 Success 实际来自：

```text
Helpful Decisions
+
Neutral Decisions
+
Wrong Decisions
+
Recovery
```

所以：

> **Successful Trajectory 并不意味着其中每个 Local Decision 都是正确的。**

这就是 Agent RL 的核心难点之一。

---

# 12. 为什么 Agent RL 比 Chat RL 难很多？

Chat：

```text
Prompt
 ↓
One Response
 ↓
Reward
```

Agent：

```text
Prompt
 ↓
Response 1
 ↓
Tool
 ↓
Response 2
 ↓
Environment
 ↓
Response 3
 ↓
Tool
 ↓
Response 4
 ↓
Reward
```

因此必须区分：

```text
Trajectory Boundary
Sample Boundary
Token Boundary
Reward Boundary
```

这几个 Boundary 并不一定一致。

---

# 13. Retokenization —— 一个极容易被忽略的问题

Rollout 时 Model 生成了一串 Token。

训练时 Trainer 可能只保存 Text，然后重新 Tokenize。

但以下因素可能发生变化：

- Tokenizer Version；
- Chat Template；
- Special Token；
- Whitespace；
- Tool Call Serialization；
- Server Preprocessing。

于是：

```text
Rollout Tokens
        ≠
Training Tokens
```

Trainer 优化的 Sequence 可能已经不是 Model 当时真正生成的 Sequence。

这告诉我们：

> **Training System 中 Representation Fidelity 非常重要。**

概念层：

```text
"拿 Agent Output 训练"
```

工程层：

```text
到底是哪一串 Token？
使用什么 Template？
属于哪个 Policy Version？
```

难度完全不同。

---

# 14. Sample Merging

一个任务可能有：

```text
Call A
Call B
Call C
Call D
Call E
```

那么应该训练：

```text
[A][B][C][D][E]
```

还是：

```text
[A+B+C+D+E]
```

还是多层结构？

不同方法会影响：

- Sequence Length；
- Gradient Statistics；
- Reward Attribution；
- Batch Efficiency。

所以：

> Data Construction 本身就是 Optimization Design。

---

# 15. Loss Normalization

假设：

```text
Trajectory A:
2 Calls
1,000 Tokens

Trajectory B:
18 Calls
12,000 Tokens
```

B 是否应该因为 Token 多，就产生 12 倍 Gradient Influence？

不一定。

可以：

```text
Per Token
Per Sequence
Per Agent Turn
Per Trajectory
```

每一种方法都在回答：

> **Learning 的基本单位是什么？**

所以 Agent RL 并不是简单：

> PPO + Tool。

---

# 16. Backend Scheduling

Agent Rollout 非常不规则。

有些很快。

有些需要几分钟。

有些 Failure。

有些等待 Tool。

GPU 则喜欢：

```text
Large
Regular
Batch
```

于是必须解决：

```text
Irregular Agent World
        ↓
Scheduling
        ↓
Regular GPU Training World
```

Agent Lightning 把这个问题明确拆开：

```text
Controller → Execution
Trainer    → Learning
Gateway    → Connection
```

这是非常清晰的系统分工。

---

# 17. Synchronous vs Asynchronous Training

Synchronous：

```text
Collect
 ↓
Stop
 ↓
Train
 ↓
Update
 ↓
Collect
```

简单，但可能浪费 Hardware。

Asynchronous：

```text
Agents Collecting
      │
      ├─────────────┐
      ▼             │
Training            │
      │             │
      ▼             │
New Policy ─────────┘
```

Throughput 更高。

但会产生：

# Policy Staleness

```text
Current Policy = π_t

Trajectory Generated By = π_(t-k)
```

于是：

```text
Hardware Utilization
        vs
Policy Freshness
```

成为新的 Trade-off。

这说明：

> **Agent RL 是 Runtime Coordination Problem，而不仅是 Algorithm Problem。**

---

# 18. Real Harness 会改变 Learning Problem

两个 Agent 使用相同 Model：

Agent A：

```text
Model
+
Shell
+
Basic Prompt
```

Agent B：

```text
Same Model
+
Repository Search
+
Context Compression
+
Patch Tool
+
Test Runner
+
Planning
+
Retry Logic
```

虽然 Model 一样，但它们经历的：

```text
Observation
Action
Feedback
State Transition
```

完全不同。

因此：

```text
Agent Learning Problem
=
Model
+
Harness
+
Environment
+
Reward
```

而不是：

```text
Model
+
Reward
```

Harness 本身参与定义 RL Environment。

---

# 19. Harness 开始进入 Post-Training

传统流程：

```text
Pretraining
 ↓
Post-training
 ↓
Deploy Model
 ↓
Build Product
```

Harnessed Agentic RL：

```text
Model
 ↓
Deploy Inside Harness
 ↓
Real Interaction
 ↓
Collect Trajectory
 ↓
RL Training
 ↓
Improved Model
 ↓
Return to Same Harness
```

于是：

```text
Model Engineering
```

与：

```text
Application Engineering
```

开始融合。

---

# 20. 为什么 Agent Experience 是特殊的 Training Data？

Supervised Data：

```text
Input
 ↓
Ideal Answer
```

Agent Experience：

```text
Goal
 ↓
Decision
 ↓
Action
 ↓
Environment Feedback
 ↓
Failure
 ↓
Recovery
 ↓
Outcome
```

里面包含：

- Planning；
- Tool Selection；
- Error Recovery；
- Information Gathering；
- Stopping Decision；
- Self-Correction。

最关键的是：

> Environment 提供真正的 **Consequence**。

这使未来 Training Data 可能出现新的层次：

```text
Internet Data
 ↓
Pretraining

Human Preference Data
 ↓
Post-training

Agent Experience
 ↓
Environment-Grounded Learning
```

---

# 21. Reward Design —— Evaluation 本身就是 Intelligence Architecture

RL 优化真正存在的 Reward。

不是人类脑中想象的 Objective。

例如：

```text
Tests Pass = +1
```

Agent 可能发现：

```text
修改 Test
关闭 Validation
Hard-code Benchmark
Exploit Environment
```

也可以提高 Reward。

所以：

> **Reward 错误会导致 Agent 更高效地学会错误行为。**

这意味着：

> **Evaluation Architecture 是 Intelligence Architecture 的一部分。**

---

# 22. Engineering Trade-off —— Realism vs Control

真实 Harness：

```text
Deployment Fidelity ↑
```

但：

```text
Trainer Control ↓
```

所以：

```text
Realism ↑
Integration Burden ↓

但

Execution Variability ↑
Debugging Complexity ↑
```

Agent Lightning 明确选择更高的 Deployment Fidelity。

---

# 23. Engineering Trade-off —— Flexibility vs Optimization

支持不同 Agent Harness：

```text
LangChain
AutoGen
Custom Agent
Coding Agent
Search Agent
```

提高 Interoperability。

但降低针对单一 Framework 做极端 Optimization 的可能。

于是：

```text
General Interface ↑
Interoperability ↑

Specialized Optimization ↓
```

Gateway 是这个 Trade-off 的核心。

---

# 24. Engineering Trade-off —— Intelligence vs Cost

Agentic RL 的 Cost 包括：

```text
Model Inference
+
Environment Execution
+
Tool Calls
+
Sandbox
+
Training GPUs
+
Storage
```

因此真正应该优化的不是单独 Benchmark：

```text
Score
```

而更像：

```text
Improvement
────────────
Total Training Cost
```

---

# 25. Engineering Trade-off —— Speed vs Accuracy

更长 Rollout：

```text
More Search
More Testing
More Recovery
```

可能提高结果。

但也增加：

```text
Latency
Inference Cost
Trajectory Length
Training Complexity
```

所以未来可能需要同时优化：

```text
Deployment Reasoning Budget
+
Training Rollout Budget
```

---

# 26. Engineering Trade-off —— Generalization vs Control

Harness 越自由：

```text
Tools
Control Flow
Subagents
Memory
```

Training 越难预测。

于是：

```text
Harness Freedom ↑
Training Predictability ↓
```

Agent Lightning 的思想是：

> 不强行统一 Implementation，而统一 Interface。

这是非常通用的工程原则。

---

# 27. 为什么“小框架”本身有价值？

Agent RL 已经天然复杂：

```text
Distributed Execution
+
Inference
+
Training
+
Trajectory Processing
+
Reward
+
Scheduling
```

如果 Framework 再引入大量隐藏层，Researcher 会越来越难解释：

> 为什么这个 Experiment 得到这个结果？

所以：

> **小而透明的 Framework 本身就是研究优势。**

这和 MiniMind 的学习哲学高度一致：

> **缩小工程规模，但保留完整思想。**

---

# 28. Scalability —— 为什么会用到 Kubernetes？

大量 Agent Rollout 本质上是很多 Job。

一个 Repository Task 可能需要：

```text
Fresh Container
Repository Checkout
Dependency Installation
Agent Execution
Tests
Cleanup
```

所以天然适合：

```text
Kubernetes Job
```

架构：

```text
Rollout Controller
 ↓
Create Job
 ↓
Agent Container
 ↓
Repository Environment
 ↓
Gateway
 ↓
Model
 ↓
Reward
```

AI Research 在这里已经非常接近 Distributed Systems Engineering。

---

# 29. Security

Coding Agent 可能拥有：

```text
Shell
Filesystem
Package Manager
Network
Repository
```

RL 会把执行次数放大到成千上万。

因此必须考虑：

```text
Container Isolation
Network Restriction
Credential Isolation
Filesystem Boundary
Resource Limit
Artifact Validation
Dependency Security
```

所以：

> **Agent RL Infrastructure 同时也是 Sandbox Infrastructure。**

---

# 30. 为什么这个项目值得研究？

至少可以提炼七条通用原则。

## 1. Train the Real System

Production Behavior 强依赖 Harness，就应该让 Harness 进入 Learning Loop。

## 2. Stable Interface

不要重写每个 Agent。

寻找 Shared Boundary。

## 3. Workload Separation

Agent Execution 与 GPU Training 应该解耦。

## 4. Experience Is Data

Trajectory 不只是 Log。

它可能是极高价值 Training Data。

## 5. Evaluation Is Part of the System

Reward 决定 Agent 最终学会什么。

## 6. Simplicity Improves Researchability

越透明，越容易理解真正原因。

## 7. Harness Defines the Learning Environment

改变 Tool、Context、Workflow，就会改变 Model 实际经历的世界。

---

# 31. Could I Rebuild It?

不要一开始复制 Production System。

应该使用：

# MiniMind Principle

```text
Preserve Architecture
Reduce Scale
```

---

# 32. Full Production Version

可能包含：

```text
Agent RL Platform
│
├── Policy Model
├── Inference Server
├── API Gateway
├── Rollout Controller
├── Agent Harness
├── Environment Manager
├── Reward System
├── Trajectory Store
├── Sample Builder
├── RL Trainer
├── Checkpoint Manager
├── Scheduler
├── Sandbox
├── Observability
└── Distributed Infrastructure
```

需要：

- PyTorch；
- Transformers；
- vLLM；
- RL；
- PPO / GRPO 类算法；
- Distributed Training；
- Container；
- Kubernetes；
- Agent Framework；
- Model Serving。

显然不应该作为第一步。

---

# 33. Simplified Learning Version —— Mini Agent Lightning

学生版：

```text
MiniAgentLightning/
│
├── agent.py
├── model_server.py
├── gateway.py
├── environment.py
├── trajectory.py
├── reward.py
├── trainer.py
└── run.py
```

Architecture：

```text
Task
 ↓
Agent
 ↓
Gateway
 ↓
Small Model
 ↓
Agent Action
 ↓
Environment
 ↓
Reward
 ↓
Trajectory
 ↓
Trainer
```

Environment 可以只是：

> 数学题 + Calculator Tool。

Agent 学：

```text
什么时候使用 Calculator？
输入什么？
怎么利用 Result？
```

核心 Architecture 已经完整。

---

# 34. Minimum Prototype

甚至第一版完全不训练。

只做：

```text
Agent
 ↓
Proxy
 ↓
Model
 ↓
Response
 ↓
Proxy Log
 ↓
Environment
 ↓
Reward
 ↓
trajectory.json
```

例如：

```json
{
  "task": "Calculate 37 * 18",
  "calls": [
    {
      "prompt": "...",
      "response": "...",
      "tool": "calculator"
    }
  ],
  "reward": 1
}
```

做到这里，已经真正理解 Agent Lightning 最核心的 Architecture：

> **真实 Agent 正常工作，而 Learning System 在外部观察它。**

之后再加入 RL。

---

# 35. 推荐学习路线

```text
V0.1
Agent + Tool

↓

V0.2
Model Proxy

↓

V0.3
Trajectory Recording

↓

V0.4
Automatic Reward

↓

V0.5
Training Sample

↓

V0.6
Supervised Fine-Tuning

↓

V0.7
Simple Policy Optimization

↓

V0.8
Parallel Agents
```

先理解系统。

再理解数学。

---

# 36. Connection to AI Agents

今天很多 Agent：

```text
Agent
 ↓
Task
 ↓
Experience
 ↓
Discard
```

未来可能：

```text
Agent
 ↓
Task
 ↓
Experience
 ↓
Training Signal
 ↓
Model Improvement
 ↓
Better Agent
```

这才真正闭合 Learning Loop。

Memory 保存 Experience。

Learning 改变 Future Behavior。

---

# 37. Connection to Workflow Design

Agent 可能通过 Experience 学到：

```text
Search
 ↓
Read Relevant File
 ↓
Run Test
 ↓
Edit
 ↓
Run Test
```

比：

```text
Read Random Files
 ↓
Edit Immediately
```

更加稳定。

于是：

```text
Human-Designed Harness
        +
Learned Local Decisions
```

可能成为未来更现实的 Agent Architecture。

---

# 38. Connection to Human-AI Collaboration

未来 Human-AI Collaboration 可能是：

```text
Human
 ↓
Define Goal
 ↓
Agent Works
 ↓
Human Evaluates
 ↓
Learning System
 ↓
Agent Improves
```

这比不断手工纠正 Static Agent 更强。

---

# 39. Connection to Memory

Memory：

```text
"这个 Repository 使用 uv。"
```

Learning：

```text
"遇到 uv Repository 时优先使用 uv-native command。"
```

前者保存 Fact。

后者改变 Behavior。

未来 Agent 可能同时拥有：

```text
Working Context
+
Task Memory
+
Long-Term Memory
+
Skills
+
Learned Policy
```

---

# 40. Connection to Personal Intelligence System

Personal Intelligence System 每天可能执行：

```text
Daily AI Exploration
Daily Open Source Discovery
Deep Concept Research
Engineering First Principles
Aviation Research
```

每一次任务都会产生 Experience。

例如：

```text
哪些 Source 质量最高？
哪些 Architecture Question 最有洞察？
哪些 Research Workflow 最有效？
哪些文章结构最适合长期学习？
```

于是：

```text
Personal Research Agent
        ↓
Execute Workflow
        ↓
Evaluate
        ↓
Collect Experience
        ↓
Improve Memory / Skill / Policy
        ↓
Better Future Research
```

Agent Lightning 提供的一个关键思想就是：

> **Experience 怎样重新流回产生 Experience 的 Intelligence？**

---

# 41. 三种 Improvement

```text
Experience
   │
   ├── Facts ─────→ Memory
   │
   ├── Procedures → Skills
   │
   └── Behavior ──→ RL / Fine-tuning
```

于是 Personal Intelligence System 不只是 Knowledge Base。

它开始成为：

> **Learning System。**

---

# 42. Researcher's Notes

## Question 1

Failure 到底来自：

```text
Model?
Harness?
Tool?
Memory?
Reward?
```

不是所有 Failure 都应该用 Training 解决。

## Question 2

Model 与 Harness 能不能 Co-Evolve？

```text
Model Improves
 ↓
Optimal Harness Changes
 ↓
Harness Improves
 ↓
New Experience
 ↓
Model Improves
```

## Question 3

哪些 Experience 应该变成：

```text
Memory
```

哪些应该变成：

```text
Skill
```

哪些才值得：

```text
Model Training
```

## Question 4

Experience 的正确 Granularity 是什么？

```text
Token
 ↓
Action
 ↓
Turn
 ↓
Subtask
 ↓
Trajectory
 ↓
Project
```

## Question 5

Agent 能不能自己设计 Curriculum？

```text
Failure History
 ↓
Weakness Detection
 ↓
Generate Practice
 ↓
Train
 ↓
Evaluate
 ↓
Repeat
```

---

# 43. 如果我设计 Agent Lightning 2.0

我会加入：

# Experience Router

```text
                    Agent
                      │
                      ▼
                  Experience
                      │
                      ▼
                   Evaluator
                      │
                      ▼
              Experience Router
           ┌──────────┼───────────┐
           ▼          ▼           ▼
        Memory      Skill       Training
           │          │           │
           └──────────┼───────────┘
                      ▼
                Improved Agent
```

它要解决的问题是：

> **这一次 Lesson 最适合用什么方式保存？**

Fact：

```text
Memory
```

Procedure：

```text
Skill
```

General Behavioral Weakness：

```text
Training
```

这样 Self-Improvement 才不会只有 Gradient Descent 一种方法。

---

# 44. Learning Agent Stack

最终可以形成：

```text
                    Human Goals
                         │
                         ▼
                  Agent Harness
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
      Tools            Memory           Skills
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                    Environment
                         │
                         ▼
                    Experience
                         │
                         ▼
                    Evaluation
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
           Memory      Skills      RL Training
             │           │           │
             └───────────┼───────────┘
                         ▼
                 Improved System
```

Agent 从：

> Inference Product

走向：

> **Learning System。**

---

# 45. Learning Path

```text
Understand
 ↓
Use
 ↓
Modify
 ↓
Rebuild
 ↓
Innovate
```

## Understand

先学习：

```text
Agent Harness
Training-Deployment Gap
Rollout
Trajectory
Reward
Credit Assignment
Policy
Gateway
```

先理解 Architecture，再学习 PPO 数学。

## Use

运行最小 Example，追踪：

```text
Agent 谁启动？
Model Call 去哪里？
Gateway 记录什么？
Reward 在哪里？
Trainer 怎么消费 Data？
```

## Modify

改变 Reward 或 Agent Harness。

观察 Behavior 如何变化。

## Rebuild

实现：

```text
MiniAgentLightning
```

只使用：

```text
Python
FastAPI
Small LLM
Simple Tool
JSON Trajectory Store
Automatic Reward
```

先复现 Data Architecture，再加入 RL。

## Innovate

尝试连接 Personal Intelligence System：

```text
Research Agent
 ↓
Daily Research
 ↓
Evaluation
 ↓
Experience Router
 ├── Memory
 ├── Skill
 └── Training Data
```

这时 Daily Open Source Discovery 本身都可以成为：

> **Self-Improving Agent Experiment。**

---

# Final Reflection

Agent Lightning 第一眼看起来只是 RL Framework。

但真正重要的是：

```text
Train Model
```

正在变成：

```text
Train Model
Inside the System
Where It Actually Works
```

现代 Intelligence 已经分布在：

```text
Model
+
Harness
+
Tools
+
Memory
+
Environment
+
Workflow
```

之中。

所以只优化 Model 越来越不够。

真正的闭环是：

```text
Real Agent Harness
        ↓
Real Interaction
        ↓
Captured Experience
        ↓
Training
        ↓
Improved Model
        ↓
Back Into Real Harness
```

也就是把：

```text
Deployment
```

和：

```text
Learning
```

连接起来。

未来成熟的 Personal Intelligence System 可能不只是：

```text
Knowledge
+
Memory
+
Tools
```

而是：

```text
Knowledge
+
Memory
+
Tools
+
Skills
+
Experience
+
Evaluation
+
Learning
```

系统积累的不再只是信息。

而是：

> **Ability。**

最终形成：

```text
Information
 ↓
Understanding
 ↓
Action
 ↓
Experience
 ↓
Learning
 ↓
Improved Action
 ↓
Innovation
```

因此 Agent Lightning 真正值得带走的思想是：

> **下一阶段真正重要的问题，不只是让 Agent 能够完成工作，而是让每一次工作本身，都成为下一次把工作做得更好的学习材料。**

这正对应 Personal Intelligence System 的长期目标：

**Understanding Complex Systems → Designing New Systems → Creating in the AI Era.**

---

# Primary Sources

- Microsoft Research Agent Lightning GitHub: https://github.com/microsoft/agent-lightning
- Agent Lightning v1.0 Technical Report: https://arxiv.org/abs/2608.17528
