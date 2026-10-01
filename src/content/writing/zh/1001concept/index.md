---
title: "Concept_Speculative Decoding_1001"
description: "A first-principles study of speculative decoding: how cheap
  prediction plus exact verification converts part of autoregressive
  generation from a serial process into parallel work."
date: 2026-10-01
tags:
  - AI
draft: false
featured: false
---

# One Deep Concept #03 --- Speculative Decoding

> **Breaking the Serial Bottleneck of LLM Generation**

FlashAttention asks how one Attention operation can move less data.
PagedAttention asks how growing KV Cache can be managed more
efficiently. Speculative Decoding attacks a third bottleneck:

> **Why must a large language model pay for one expensive target-model
> decoding step for every output token?**

The core pattern is:

``` text
Cheap prediction
      ↓
Candidate future
      ↓
Parallel expensive verification
      ↓
Commit accepted work
      ↓
Correct mismatch
```

# Part I --- English Research Article

## 1. Concept --- What Is Speculative Decoding?

An autoregressive language model factorizes a sequence as

\[ p(x\_{1:T})=`\prod`{=tex}*{t=1}\^{T}p(x_t`\mid `{=tex}x*{\<t}) \]

creating a dependency chain:

``` text
Token 1 → Token 2 → Token 3 → Token 4 → ...
```

Classical decoding invokes the large target model once per new token.
Speculative decoding introduces a cheap **draft model** (q) and an
expensive authoritative **target model** (p). The draft proposes several
future tokens; the target scores the proposed continuation in parallel;
a mathematically corrected acceptance rule commits a valid prefix and
repairs the first rejection.

The essential separation is:

``` text
Proposal ≠ Authority
```

The draft may predict. The target still determines the final
distribution.

The original ICML 2023 work demonstrated 2--3× acceleration on T5-XXL in
its experiments without changing outputs; independent
speculative-sampling work reported roughly 2--2.5× speedup on
Chinchilla-70B in a distributed setup.

## 2. Background --- The Decode Bottleneck

LLM inference has two broad phases:

``` text
Prompt → Prefill → Decode → Output
```

Prefill processes many prompt tokens together and maps naturally to
large parallel matrix operations. Decode is different:

``` text
prefix
  ↓
predict one token
  ↓
append
  ↓
predict next token
  ↓
...
```

A 1,000-token answer therefore contains roughly 1,000 sequential
generation dependencies.

The issue is not simply model size. It is:

``` text
large model
+
autoregressive dependency
+
one-token-at-a-time execution
=
high latency
```

## 3. Fundamental Problem --- Serial Depth

Parallel systems care not only about total work but also about the
**critical path**.

``` text
A → B → C → D → E
```

cannot be accelerated indefinitely by adding processors because each
stage waits for the previous one.

Autoregressive generation has the same structure.

Speculative decoding asks:

> Can we cheaply predict several future dependencies, exposing work that
> the accelerator can verify in parallel?

## 4. Why Verification Can Be Parallel

Unknown future tokens must be generated sequentially. But once a draft
continuation is known, all candidate positions are available.

For a candidate:

``` text
The future of AI is collaborative
```

the target can evaluate positions with a causal mask:

``` text
position 1 sees prefix
position 2 sees prefix + token 1
position 3 sees prefix + tokens 1–2
...
```

Thus:

``` text
Unknown future → sequential generation
Known candidate future → parallel evaluation
```

This distinction is the foundation of speculative decoding.

## 5. Previous Solutions

Before speculation, inference acceleration commonly relied on smaller
models, quantization, optimized kernels, batching, or model parallelism.
These are valuable, but even a perfectly optimized target model still
faces one autoregressive dependency per output token.

Speculative decoding attacks a different quantity:

> **the number of expensive sequential target-model steps.**

## 6. Core Innovation --- Draft Cheaply, Verify Expensively

Suppose the draft proposes (`\gamma`{=tex}) tokens:

\[ x_1,x_2,`\dots`{=tex},x\_`\gamma`{=tex} \]

Baseline:

``` text
Target → x1
Target → x2
Target → x3
Target → x4
```

Speculation:

``` text
Cheap draft → x1 → x2 → x3 → x4
                  ↓
       one target verification
                  ↓
        accept several tokens
```

The useful metric becomes:

# Accepted Tokens per Target Step

Ordinary decoding gives approximately one. Speculation attempts to make
this greater than one.

## 7. Exactness --- Why Naïve Acceptance Is Wrong

For stochastic sampling, simply accepting "plausible" draft tokens would
change the target distribution.

Let (q(x)) be the draft distribution and (p(x)) the target distribution.
Classical speculative sampling uses a rejection-sampling-style
correction with acceptance probability

\[
`\alpha`{=tex}(x)=`\min`{=tex}`\left`{=tex}(1,`\frac{p(x)}{q(x)}`{=tex}`\right`{=tex})
\]

and a residual correction distribution after rejection.

The important invariant is:

> **Execution changes; the target distribution can remain unchanged.**

This is the same systems philosophy seen in FlashAttention:

``` text
Preserve semantics → Redesign execution
```

## 8. Concrete Example

Draft:

``` text
The future of AI will change
```

Target verification:

``` text
The       ✓
future    ✓
of        ✓
AI        ✓
will      ✗
```

Four useful tokens may be committed from one verification cycle,
followed by correction at the rejection point.

The draft work is extra, but it can be profitable if it is cheap enough
relative to target execution.

## 9. The Real Speedup Equation

Let:

-   (T_t): target verification time;
-   (T_d): draft cost per cycle;
-   (A): average useful accepted tokens per cycle.

Then approximately:

\[ C\_{spec}`\approx`{=tex}`\frac{T_d+T_t}{A}`{=tex} \]

while baseline cost per token is

\[ C\_{base}`\approx `{=tex}T_t \]

Speculation helps when:

\[ A\>1+`\frac{T_d}{T_t}`{=tex} \]

This compact inequality exposes the engineering objective:

``` text
Draft cost ↓
Acceptance ↑
Accepted span ↑
Verification efficiency ↑
```

The smallest draft is not automatically best. The most accurate draft is
not automatically best. The optimum is system-level.

## 10. Draft--Target Alignment

A tiny draft may be fast but reject frequently. A larger draft may cost
more but produce longer accepted runs.

The relevant objective is closer to:

``` text
useful speculative progress
---------------------------
draft + verification cost
```

This motivated work such as DistillSpec, which explicitly improves
draft--target alignment through knowledge distillation.

## 11. How Far Should We Speculate?

Short lookahead:

``` text
low waste
low parallel opportunity
```

Long lookahead:

``` text
higher potential gain
higher drift / rejection risk
```

The optimum changes with workload and even with position inside one
generation. Dynamic Speculation Lookahead research showed that a fixed
lookahead can be suboptimal, motivating adaptive speculation.

## 12. Cross-Domain Connection --- CPU Branch Prediction

Modern CPUs predict branches before certainty arrives.

``` text
Predict path
   ↓
Execute ahead
   ↓
Verify
   ↓
Commit or rollback
```

Speculative decoding has a related pattern:

``` text
Predict future tokens
   ↓
Expose future work
   ↓
Verify
   ↓
Commit or recover
```

The general abstraction is:

# Predict → Execute → Verify → Commit / Recover

## 13. Medusa --- Removing the Separate Draft Model

Medusa adds multiple lightweight decoding heads to a target model:

``` text
Target hidden state
   ├─ Head 1 → t+1
   ├─ Head 2 → t+2
   ├─ Head 3 → t+3
   └─ Head 4 → t+4
```

Candidate continuations are organized and verified together. This moves
speculation from an external serving trick toward a model-native
future-prediction capability.

## 14. Lookahead Decoding --- Parallelism Without a Draft Model

Lookahead Decoding explores breaking sequential dependence without a
separate draft model, using parallel candidate discovery and
verification. This shows that the deeper research problem is no longer
one specific algorithm:

# How can autoregressive generation expose more parallelism?

Possible answers include draft models, multiple heads, candidate trees,
lookahead search, hierarchical drafts, and learned future
representations.

## 15. 2026 Frontier --- Speculation as Scheduling

At low concurrency, spare accelerator capacity can make extra
verification attractive. At high concurrency, the target may already be
compute-bound; verifying many rejected candidates can hurt throughput.

Recent work such as ECHO reframes high-concurrency speculation as a
**budgeted scheduling problem**, allocating verification budget between
candidate depth and width.

This reveals a crucial distinction:

``` text
Latency optimization ≠ Throughput optimization
```

## 16. 2026 Frontier --- Optimizing the Draft Itself

A draft model is cheap, not free. Large vocabulary projections can
become meaningful overhead.

NanoSpec (ICML 2026) dynamically constructs a context-aware active
vocabulary and reports reducing average active vocabulary to below 3,000
tokens---more than 40× smaller than the full vocabulary in its
experiments.

The optimization chain becomes:

``` text
Target too expensive
   ↓
introduce draft
   ↓
draft becomes visible cost
   ↓
optimize draft
   ↓
new bottleneck appears
```

## 17. Hierarchical Speculation

Why use only two levels?

``` text
tiny → small → medium → large
```

A hierarchy can let each model propose and the next level verify.
Hierarchical Speculative Decoding formalizes this idea.

The deeper principle is:

> **Use the cheapest intelligence capable of resolving the current
> uncertainty; escalate only when necessary.**

This resembles cache hierarchies, multi-fidelity simulation, cascaded
classifiers, and human organizations.

## 18. Engineering Trade-offs

Advantages:

-   fewer expensive sequential target steps;
-   classical schemes can preserve target distribution;
-   existing target models can be accelerated without architecture
    changes.

Costs:

-   draft computation;
-   wasted rejected candidates;
-   verification overhead;
-   extra memory for draft deployment;
-   more complex batching, KV-cache and scheduling logic;
-   strong workload and concurrency dependence.

The right question is therefore not simply "Is speculative decoding
faster?" but:

> **Under which workload, hardware, concurrency, draft and acceptance
> regime does speculation reduce total system cost?**

## 19. System Perspective --- Uncertainty Management

Speculative decoding converts uncertainty into a resource-allocation
problem:

``` text
Uncertain expensive future
       ↓
Cheap predictor
       ↓
Candidate future
       ↓
Parallel expensive verification
       ↓
Commit high-value work
       ↓
Recover from mismatch
```

This pattern applies whenever exact decisions are expensive,
approximation is cheap, errors are detectable, and recovery costs less
than always waiting.

## 20. Researcher's View

### Confidence-Adaptive Speculation

``` text
high confidence → speculate farther
low confidence  → verify earlier
```

This connects inference to online control.

### Semantic Difficulty-Aware Compute

Easy language regions may support long speculation; novel reasoning
steps may require short speculation and more target-model involvement.

This points toward **adaptive intelligence allocation**.

### Intelligence Hierarchies

Future systems may route uncertainty through:

``` text
tiny predictor
  ↓
small reasoner
  ↓
medium verifier
  ↓
large authority
```

### Speculative Reasoning

The speculative unit may eventually grow from tokens to phrases,
reasoning steps, tool calls or subplans:

``` text
Token speculation
      ↓
Reasoning-step speculation
      ↓
Speculative planning
      ↓
Speculative agent workflows
```

Semantic verification is harder than token-distribution verification,
but the systems principle remains powerful.

## 21. Future Direction --- Predict--Verify Architectures

Speculation may evolve from a serving optimization into a native
architectural property:

``` text
2023
draft + target token speculation
        ↓
2024
multi-head / tree / lookahead methods
        ↓
2025–2026
adaptive verification
hierarchical drafting
production scheduling
specialized draft optimization
        ↓
Future
Predict–Verify AI Architectures
```

Future models may be trained for future-token prediction, confidence
estimation, multi-token verification, hierarchical compute and adaptive
resource allocation from the beginning.

## 22. Connecting the First Three Deep Concepts

``` text
LLM Inference
│
├── Attention execution
│   └── FlashAttention
│       └── reduce data movement
│
├── KV-cache memory
│   └── PagedAttention
│       └── improve memory utilization
│
└── Autoregressive decoding
    └── Speculative Decoding
        └── reduce expensive serial depth
```

Each technique attacks a different scarce resource.

That systems map is more useful than memorizing three optimization
names.

## 23. Learning Reflection

The innovation path is:

``` text
Observation:
LLM decoding is slow

↓
Decomposition:
one expensive target step per token

↓
Invariant:
target behavior must remain authoritative

↓
Degree of freedom:
the target does not need to propose every candidate itself

↓
Cheap prediction

↓
future work becomes visible

↓
parallel verification

↓
recoverable correction

↓
same authority, different execution
```

The most important abstraction is:

``` text
Authority ≠ Proposal
```

and the reusable engineering pattern is:

# Predict → Parallelize → Verify → Commit

## 24. Deeper Principle

> **Sequential dependencies are not always immutable. Sometimes a cheap
> prediction of future states can expose parallel work, while
> verification preserves correctness.**

------------------------------------------------------------------------

# Part II --- 中文完整翻译与深度解释

# Speculative Decoding：怎样打破大模型"一次只能生成一个 Token"的串行瓶颈？

## 引言：真正昂贵的也许不是 Token，而是"必须等待下一步"

前两篇可以形成清晰的逻辑链：

``` text
FlashAttention
→ 一次 Attention 怎样少搬数据？

PagedAttention
→ KV Cache 怎样更高效地使用显存？

Speculative Decoding
→ 怎样减少昂贵 Target Model 的串行调用次数？
```

普通自回归生成：

``` text
大模型 → Token 1
          ↓
大模型 → Token 2
          ↓
大模型 → Token 3
          ↓
...
```

如果回答有 1000 个 Token，就存在大约 1000 个前后依赖的生成步骤。GPU
即使拥有巨大的并行能力，也无法直接生成第 501 个 Token，因为第 500
个还没有确定。

这不是单纯的"算力不足"，而是：

# Serial Dependency ------ 串行依赖

Speculative Decoding 的核心思想，是尝试把一部分串行依赖转换成并行工作。

## 1. 核心机制：先猜，再统一验证

准备两个角色：

``` text
Draft Model
小、快、便宜
负责提出候选

Target Model
大、贵、能力强
负责最终裁决
```

执行：

``` text
Draft
 ↓
先猜几个未来 Token

[x1][x2][x3][x4]

 ↓

Target
 ↓
一次性验证整段候选

 ↓

正确前缀全部接受
错误位置进行校正
```

关键不是"小模型代替大模型"，而是：

``` text
Proposal ≠ Authority
候选生成 ≠ 最终裁决
```

Target 仍然拥有最终权威。

## 2. 为什么生成串行，验证却可以并行？

生成时未来未知：

``` text
x2 必须等 x1
x3 必须等 x2
```

但 Draft 已经给出候选以后，未来序列暂时变成"已知候选"。

例如：

``` text
The future of AI is collaborative
```

Target 可以借助 Causal Mask 在一次 Forward Pass 中同时评价多个位置。

因此：

``` text
未知未来
→ 必须串行生成

已知候选未来
→ 可以并行评分
```

这就是整个方法成立的关键。

## 3. 真正优化的是 Critical Path

系统性能不能只看总 FLOPs，还要看最长的不可并行路径。

``` text
A → B → C → D → E
```

即使有很多 GPU，B 仍然必须等 A。

Speculative Decoding 甚至可能增加一些总计算------因为 Draft
也需要工作------但它用便宜计算换取更短的昂贵串行路径。

这和 FlashAttention 有共同的工程哲学：

``` text
FlashAttention:
多一点局部计算
换更少 IO

Speculative Decoding:
多一点便宜预测
换更少昂贵串行步骤
```

所以：

> **最少 FLOPs 并不等于最快系统。**

## 4. 一个具体例子

Draft 猜：

``` text
The future of AI will change
```

Target 验证：

``` text
The      ✓
future   ✓
of       ✓
AI       ✓
will     ✗
```

于是前四个 Token 可以一次 Commit，然后从错误点按照 Target 分布校正。

原本可能需要四次昂贵 Target Decode 的进度，现在有机会通过一次 Target
Verification 获得。

## 5. 为什么不能"觉得差不多就接受"？

因为这样会改变 Target Model 的输出概率。

设：

``` text
p(x) = Target Distribution
q(x) = Draft Distribution
```

经典方法使用类似拒绝采样的校正：

\[ lpha(x)=`\min`{=tex}`\left`{=tex}(1,rac{p(x)}{q(x)}ight) \]

Draft 对某 Token
过度自信时，就不能无条件接受。拒绝后还需要根据残差概率进行校正。

真正重要的是结果：

``` text
执行方式改变
但最终 Distribution 可以保持 Target 的 Distribution
```

再次出现一个非常重要的工程思想：

# Preserve Semantics, Redesign Execution

保持语义，重新设计执行。

## 6. 什么时候才真的会更快？

设：

``` text
Tt = 一次 Target Verification 成本
Td = 一轮 Draft 成本
A  = 每轮平均接受 Token 数
```

则：

\[ C\_{spec}pproxrac{T_d+T_t}{A} \]

普通 Decode：

\[ C\_{base}pprox T_t \]

需要：

\[ A\>1+rac{T_d}{T_t} \]

才能形成优势。

所以优化目标是：

``` text
Draft Cost ↓
Acceptance Rate ↑
Accepted Span ↑
Verification Efficiency ↑
```

最小 Draft 不一定最好，最准 Draft 也不一定最好。

真正要优化的是：

# Total System Cost

## 7. Draft--Target Alignment

一个极小 Draft 很快，但可能频繁猜错；一个稍大 Draft
更慢，却可能一次通过很多 Token。

所以 Draft 真正需要擅长的未必是"独立成为最强小模型"，而是：

> **高效预测 Target 下一步会怎么做。**

这就是为什么 DistillSpec 等工作会专门优化 Draft 与 Target 的对齐。

## 8. 一次到底应该猜多远？

``` text
猜得短
→ 浪费少
→ 并行收益小

猜得长
→ 潜在收益大
→ 后段漂移概率高
```

而且最优长度会随着内容变化。

例如：

``` text
"The capital of France is ..."
```

未来高度可预测，可以大胆 Speculate。

复杂数学证明的新推导步骤则不确定性高，更适合尽早交回 Target。

因此未来自然走向：

# Adaptive Speculation

## 9. 与 CPU Branch Prediction 的连接

CPU 会：

``` text
预测分支
 ↓
提前执行
 ↓
验证
 ↓
Commit / Rollback
```

Speculative Decoding：

``` text
预测未来 Token
 ↓
提前暴露未来计算
 ↓
Target 验证
 ↓
Commit / Correct
```

共同抽象：

# Predict → Execute → Verify → Commit / Recover

这就是把一个具体 AI 技术提升成可迁移的工程模式。

## 10. Medusa：为什么必须再部署一个模型？

经典方法需要 Draft + Target，增加显存、KV Cache、调度和维护成本。

Medusa 让 Target 的 Hidden State 接多个未来预测头：

``` text
Target Hidden State
   ├─ Head 1 → t+1
   ├─ Head 2 → t+2
   ├─ Head 3 → t+3
   └─ Head 4 → t+4
```

这意味着 Speculation 可能从外部 Serving Trick 逐渐变成模型原生能力。

## 11. 2026：Speculation 开始变成 Scheduling Problem

低并发时，GPU 可能有闲置并行能力，多验证候选很划算。

高并发时，Target GPU 已经很忙，大量最终被拒绝的候选反而浪费 Compute。

于是问题从：

``` text
怎样猜更多？
```

变成：

``` text
有限 Verification Budget
应该花在哪些候选上？
```

ECHO 等研究开始把它建模成 Budgeted Scheduling。

因此必须区分：

``` text
Latency Optimization
≠
Throughput Optimization
```

## 12. Draft 自己也会产生新瓶颈

当 Target 被加速后，Draft 成本开始变得可见。

大词表模型即使主体很小，最后：

``` text
Hidden State × Vocabulary Matrix
```

也可能不便宜。

NanoSpec 的思路是根据 Context 动态建立小型 Active Vocabulary。其 ICML
2026 实验报告平均活跃词表低于 3000 Token，比完整词表缩小 40× 以上。

这展示了系统优化的"剥洋葱"规律：

``` text
Target 太贵
 ↓
引入 Draft

Draft 成为成本
 ↓
优化 Draft

Vocabulary 成为成本
 ↓
继续优化

新的瓶颈再次出现
```

## 13. Hierarchical Speculation：建立"智能层级"

如果系统有：

``` text
Tiny
 ↓
Small
 ↓
Medium
 ↓
Large
```

为什么所有请求都直接进入 Large？

可以让 Tiny 先猜，Small 验证；仍不确定再升级到 Medium，最后才到 Large。

这与：

``` text
L1 → L2 → RAM → SSD
```

的 Memory Hierarchy 有深层相似性。

共同原则：

> **使用能够解决当前不确定性的最低成本资源，只在必要时升级。**

可以把它称为：

# Intelligence Hierarchy

## 14. Researcher's View：还能推导什么？

### Confidence-Adaptive Speculation

``` text
高置信度 → 猜更远
低置信度 → 尽快验证
```

这让 Decode 开始像在线控制系统：

``` text
Predict
 ↓
Estimate uncertainty
 ↓
Choose horizon
 ↓
Verify
 ↓
Feedback
```

### Semantic Difficulty-Aware Compute

不是所有 Token 都一样难。

未来系统可能：

``` text
简单区域
→ Small Model + Long Speculation

困难推理区域
→ Large Model + Short Speculation
```

这已经不只是 Adaptive Decoding，而是：

# Adaptive Intelligence Allocation

### Speculative Reasoning

今天猜 Token。

未来可能猜：

``` text
Phrase
 ↓
Reasoning Step
 ↓
Tool Call
 ↓
Subplan
```

于是逐渐出现：

``` text
Speculative Decoding
 ↓
Speculative Reasoning
 ↓
Speculative Planning
 ↓
Speculative Agent Workflow
```

真正困难的是：语义级验证比 Token 概率验证复杂得多。

但设计思想非常值得继续追踪。

## 15. 把前三篇 One Deep Concept 连起来

``` text
LLM Inference
│
├── Attention Execution
│   └── FlashAttention
│       └── 减少 Data Movement
│
├── KV Cache Memory
│   └── PagedAttention
│       └── 提高 Memory Utilization
│
└── Autoregressive Decode
    └── Speculative Decoding
        └── 减少 Expensive Serial Steps
```

三个技术分别攻击：

``` text
IO
Memory
Serial Depth
```

这开始形成真正的：

# LLM Systems Map

而不是三个孤立名词。

## 16. Personal Research Reflection

今天真正值得记住的不是：

> Speculative Decoding = 小模型先猜，大模型验证。

真正重要的是：

> **当一个昂贵系统被串行依赖限制时，可以尝试用廉价预测提前暴露未来工作，再通过验证机制保证正确性。**

抽象成：

``` text
Serial Expensive Process
        ↓
Cheap Prediction
        ↓
Expose Future Work
        ↓
Parallel Execution
        ↓
Verification
        ↓
Commit / Recover
```

即：

# Predict → Parallelize → Verify → Commit

这个模式可以迁移到：

``` text
CPU
→ Branch Prediction

Database
→ Speculative Execution

Network
→ Prefetch

Robotics
→ Predictive Control

AI Agent
→ Speculative Planning
```

因此研究训练真正要完成的是：

``` text
技术
 ↓
理解机制
 ↓
抽象设计模式
 ↓
寻找跨领域同构
 ↓
重新组合
 ↓
产生新问题
```

这正是：

``` text
Understanding
      ↓
Decomposition
      ↓
Connection
      ↓
Creation
```

如果未来面对一个完全陌生的串行系统，我希望自己的第一反应不只是：

> 怎样让每一步更快？

而是进一步问：

> **有没有办法在结果真正确定以前，先廉价预测未来，从而提前完成一部分原本不可见的工作？**

这个问题本身，比记住 Speculative Decoding 这个名词更有价值。

------------------------------------------------------------------------

# Research Map

``` text
Speculative Decoding
│
├── Autoregressive Models
│   ├── Conditional Generation
│   └── Serial Dependency
│
├── Core Algorithm
│   ├── Draft Model
│   ├── Target Model
│   ├── Parallel Verification
│   ├── Acceptance
│   └── Rejection Correction
│
├── Systems
│   ├── Critical Path
│   ├── Latency
│   ├── Throughput
│   └── Scheduling
│
├── Related Ideas
│   ├── Branch Prediction
│   ├── Speculative Execution
│   └── Prefetching
│
├── Extensions
│   ├── Medusa
│   ├── Lookahead Decoding
│   ├── Dynamic Lookahead
│   ├── Hierarchical Speculation
│   └── Draft Optimization
│
└── Future
    ├── Adaptive Speculation
    ├── Semantic Difficulty Routing
    ├── Intelligence Hierarchy
    └── Speculative Reasoning
```

# Further Reading

1.  Yaniv Leviathan, Matan Kalman, Yossi Matias. **Fast Inference from
    Transformers via Speculative Decoding.** ICML 2023.\
    https://proceedings.mlr.press/v202/leviathan23a.html

2.  Charlie Chen et al. **Accelerating Large Language Model Decoding
    with Speculative Sampling.** 2023.\
    https://arxiv.org/abs/2302.01318

3.  Yongchao Zhou et al. **DistillSpec: Improving Speculative Decoding
    via Knowledge Distillation.** ICLR 2024.\
    https://research.google/pubs/distillspec-improving-speculative-decoding-via-knowledge-distillation/

4.  Jonathan Mamou et al. **Dynamic Speculation Lookahead Accelerates
    Speculative Decoding of Large Language Models.** 2024.\
    https://proceedings.mlr.press/v262/mamou24a.html

5.  Tianle Cai et al. **Medusa: Simple LLM Inference Acceleration
    Framework with Multiple Decoding Heads.** 2024.\
    https://arxiv.org/abs/2401.10774

6.  Yichao Fu et al. **Break the Sequential Dependency of LLM Inference
    Using Lookahead Decoding.** ICML 2024.\
    https://proceedings.mlr.press/v235/fu24a.html

7.  Xinyi Hu et al. **ECHO: Elastic Speculative Decoding with Sparse
    Gating for High-Concurrency Scenarios.** ICML 2026.\
    https://proceedings.mlr.press/v306/hu26ar.html

8.  Zhiyang Chen et al. **NanoSpec: Accelerating Speculative Decoding
    using Minimalist In-Context Vocabularies.** ICML 2026.\
    https://proceedings.mlr.press/v306/chen26fm.html

9.  Amir Globerson et al. **Fast Inference via Hierarchical Speculative
    Decoding.** 2025.\
    https://arxiv.org/abs/2510.19705

# One-Sentence Takeaway

> **Speculative Decoding shows that a sequential process can sometimes
> be accelerated not by making each expensive step faster, but by
> cheaply predicting the future, exposing parallel work, and using
> verification to preserve correctness.**

> **Speculative Decoding
> 告诉我们：面对一个昂贵的串行过程，突破口未必是让每一步更快，而可能是先廉价预测未来，把原本看不见的并行工作提前暴露出来，再用验证机制守住正确性。**
