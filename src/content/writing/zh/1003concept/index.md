---
title: "Concept_Test-Time_Compute_1003"
description: "A first-principles study of test-time compute: how reasoning
  systems trade inference-time computation for better answers, why
  search, verification and adaptive compute matter, and why future AI
  may be defined by how intelligently it allocates thinking."
date: 2026-10-04
tags:
  - AI
draft: false
featured: false
---

# One Deep Concept #05 --- Test-Time Compute

> **Why More Thinking Can Be More Valuable Than a Bigger Model**

# Part I --- English Research Article

## 1. Concept

Test-time compute is computation spent **after model weights are
fixed**, while solving a particular problem.

``` text
Training-time scaling:
Data → Training Compute → Parameters

Test-time scaling:
Problem → Inference Compute → Better Search / Verification → Answer
```

If a fixed model is (f\_`\theta`{=tex}), ordinary inference samples a
trajectory from (f\_`\theta`{=tex}(y\|x)). Test-time scaling introduces
an inference algorithm (A) and budget (B):

\[ y\^\* = A(f\_`\theta`{=tex},x,B) \]

The new variable is (B): the amount of computation allocated to this
specific problem.

The same model can therefore exhibit different effective capability
under different inference budgets.

## 2. Background --- A Second Scaling Axis

The classic deep-learning recipe was:

``` text
more data + more parameters + more training compute → better model
```

This encouraged a view in which capability was largely baked into model
weights.

Reasoning models changed that picture. OpenAI reported that o1 improved
both with additional reinforcement-learning compute during training and
with more time spent reasoning at test time. Research on test-time
scaling then asked a broader question:

> Given a fixed inference budget, how should that compute be spent?

We now have two scaling axes:

``` text
Train-Time Scaling
+
Test-Time Scaling
```

## 3. Fundamental Problem --- The First Reasoning Path Is Not Necessarily the Best

Autoregressive reasoning is path-dependent:

``` text
Step 1
 ↓
Step 2
 ↓
Step 3
 ↓
Answer
```

An early error corrupts later context:

``` text
correct idea
 ↓
wrong turn
 ↓
plausible continuation
 ↓
confident wrong answer
```

A model may contain enough knowledge to solve a problem while failing to
sample the right reasoning trajectory on its first attempt.

So the fundamental question is:

> **Why should one sampled trajectory receive all of our trust?**

## 4. Previous Solutions

### Greedy decoding

Choose the most likely next token. Cheap, but local probability does not
guarantee globally correct reasoning.

### Sampling

Generate multiple candidates:

``` text
Problem
 ├── Candidate A
 ├── Candidate B
 ├── Candidate C
 └── Candidate D
```

This adds exploration, but more candidates alone do not tell us which
one is correct.

### Self-consistency

Generate multiple reasoning paths and select the most common answer.
Useful when independent paths converge, but consensus is not proof.

### Search

Explore a reasoning tree:

``` text
             Problem
          /     |      \
        A       B       C
       / \     / \     / \
     A1  A2  B1  B2  C1  C2
```

Spend more compute on promising branches.

### Verification

Separate generation from evaluation:

``` text
Generator → Candidates → Verifier → Select / Revise
```

This separation is one of the most important ideas in modern reasoning
systems.

## 5. Core Innovation --- Capability Becomes Compute-Elastic

With test-time scaling, solution quality is better represented as:

\[ Q = F(`\theta`{=tex},B,A,x) \]

where (`\theta`{=tex}) is the model, (B) the inference budget, (A) the
inference algorithm, and (x) the problem.

Capability now depends not only on parameters, but also on:

``` text
How much compute?
Depth or breadth?
Which search strategy?
Which verifier?
When to stop?
```

Intelligence becomes **compute-elastic**.

## 6. Two Ways to Spend More Compute

### Sequential scaling: think deeper

``` text
Question → Reason → Check → Backtrack → Continue → Answer
```

### Parallel scaling: explore broader

``` text
Question
 ├── Path A
 ├── Path B
 ├── Path C
 └── Path D
       ↓
   Verify / rank
```

This creates the classical search trade-off:

# Depth vs Breadth

A fixed 10,000-token budget could fund one long trajectory or many short
ones. Which is better depends on the problem and verifier.

## 7. Best-of-N and the Verification Bottleneck

Suppose one independent attempt succeeds with probability (p). With (N)
independent attempts:

\[ P(`\text{at least one correct}`{=tex})=1-(1-p)\^N \]

For (p=0.2):

``` text
N=1  → 20%
N=5  → 67.2%
N=10 → 89.3%
```

But this is only useful if the system can identify the correct
candidate.

``` text
Correct candidate exists
≠
System knows which candidate is correct
```

Therefore:

# Search quality is bounded by verification quality.

## 8. Generation and Verification Are Different Capabilities

In many domains, checking is easier than inventing:

``` text
Programming:
generate code → hard
run tests → easier

Mathematics:
discover proof → hard
check many steps → easier

Engineering:
invent design → hard
simulate constraints → easier
```

This asymmetry enables a powerful architecture:

``` text
Generate broadly
      ↓
Verify cheaply
      ↓
Keep promising candidates
      ↓
Spend more compute there
```

AlphaCode used massive sampling followed by filtering, clustering and
ranking. AlphaEvolve combines LLM-generated programs with automated
evaluators and an evolutionary loop.

The general pattern is:

# Generate → Evaluate → Select → Improve

## 9. Outcome vs Process Verification

An **outcome verifier** evaluates the final result:

``` text
Reasoning → Answer → Score
```

A **process verifier** evaluates intermediate steps:

``` text
Step 1 → score
Step 2 → score
Step 3 → score
```

Outcome verification is often easier to obtain. Process verification can
terminate bad branches earlier and guide search more efficiently.

A strong verifier functions like a heuristic in classical search.

## 10. Reasoning as Search

Let reasoning state be (s_t), next thought/action be (a_t), and
transition be:

\[ s\_{t+1}=T(s_t,a_t) \]

The language model induces a policy:

\[ `\pi`{=tex}(a_t\|s_t) \]

A verifier estimates something like:

\[ V(s_t) \]

Now reasoning resembles beam search, planning, reinforcement learning,
or Monte Carlo tree search.

The conceptual shift is:

> **Reasoning is not only text generation; it can be computation over a
> search space.**

## 11. Compute-Optimal Scaling

More compute is not automatically better.

Research by Snell et al. found that optimal test-time strategies vary
with prompt difficulty. Their compute-optimal strategy improved
inference-compute efficiency by more than 4× over a Best-of-N baseline
in their experiments, and in some FLOPs-matched regimes a smaller model
with test-time compute outperformed a 14× larger model.

The correct question is therefore:

> **Where does the next unit of compute have the highest expected
> value?**

Conceptually:

\[ `\text{Marginal Value of Compute}`{=tex} =
`\frac{\Delta \text{Expected Quality}}`{=tex}
{`\Delta `{=tex}`\text{Compute}`{=tex}} \]

Reasoning becomes resource allocation.

## 12. The Capability Frontier

Extra compute has different value across difficulty levels.

``` text
Easy problem
→ extra reasoning is wasteful

Near capability frontier
→ extra search/checking can change the result

Far beyond capability
→ modest extra compute may still fail
```

Test-time compute is often most valuable near the model's **capability
frontier**.

This is an important engineering insight: adaptive compute should follow
expected marginal benefit, not be distributed uniformly.

## 13. DeepSeek-R1 --- Learning How to Spend Reasoning Compute

DeepSeek-R1-Zero explored large-scale reinforcement learning without
supervised fine-tuning as the preliminary stage and reported emergent
extended reasoning, reflection and self-verification behaviors.
DeepSeek-R1 then used cold-start data and multi-stage training to
improve reasoning quality and readability.

The important lesson is not simply:

``` text
RL → longer answers
```

It is:

> **Training can improve how efficiently a model converts inference
> compute into useful reasoning progress.**

A useful conceptual metric is:

\[ `\text{Reasoning Efficiency}`{=tex} =
`\frac{\text{Useful Progress}}`{=tex} {`\text{Inference Compute}`{=tex}}
\]

## 14. s1 and Budget Forcing

The s1 project demonstrated **budget forcing**. If the model attempts to
terminate reasoning early, inference can force continuation; the paper
used interventions such as appending "Wait", which can trigger further
checking.

The deeper idea is that reasoning effort can become explicitly
controllable:

``` text
minimum budget
maximum budget
stopping policy
```

Inference is no longer a passive decoding procedure. It becomes a
runtime that manages cognitive effort.

## 15. More Thinking Can Hurt

Longer reasoning is not monotonically better.

Research on thinking-optimal scaling found settings where excessive
chain-of-thought length reduced reasoning performance, and optimal
reasoning-length distributions differed across domains.

Possible failure modes include:

-   drifting away from a correct early insight;
-   introducing unnecessary hypotheses;
-   compounding arithmetic or logical errors;
-   rationalizing a bad branch;
-   consuming latency, context and money.

So a reasoning system must answer not only:

``` text
How should I think?
```

but:

# When should I stop thinking?

## 16. Stopping Is an Optimal-Control Problem

Suppose one more reasoning step costs (c), while the expected
improvement in success probability is (`\Delta `{=tex}P).

Continue only when the expected gain justifies the cost:

\[ `\Delta `{=tex}P \> `\lambda `{=tex}c \]

The system must estimate:

``` text
Am I making progress?
Am I stuck?
Should I branch?
Should I verify?
Should I call a tool?
Should I use a stronger model?
Should I stop?
```

This creates a feedback loop:

``` text
Think
 ↓
Observe progress
 ↓
Estimate uncertainty
 ↓
Allocate next compute
 ↓
Think / Search / Verify / Stop
```

## 17. Connection to Mixture of Experts

MoE asks:

``` text
Which parameters should this token activate?
```

Test-time scaling asks:

``` text
How much computation should this problem receive?
```

Combined:

``` text
Input
 ↓
Difficulty / uncertainty estimator
 ↓
Easy   → few resources → short reasoning
Medium → more resources → verification
Hard   → strong model → search + tools + larger budget
```

This leads to:

# Adaptive Intelligence Allocation

## 18. Connection to Speculative Decoding

Speculative decoding reduces compute where expensive serial computation
is redundant.

Test-time scaling adds compute where additional computation improves
answer quality.

Together:

``` text
Spend less compute where it is redundant.
Spend more compute where it creates intelligence.
```

The objective is not simply minimum FLOPs.

It is:

# Maximum Intelligence per Unit Compute

## 19. Connection to Classical Engineering

The same principle appears in adaptive numerical methods.

``` text
Adaptive mesh:
simple region → coarse mesh
complex region → fine mesh

ODE solver:
smooth dynamics → large timestep
rapid dynamics → small timestep

Adaptive integration:
easy interval → few evaluations
difficult interval → more evaluations
```

The shared abstraction is:

# Allocate computation where error or uncertainty is high.

Test-time scaling is the reasoning analogue of adaptive engineering
computation.

## 20. A Future Reasoning Runtime

A mature reasoning system may resemble a cognitive operating system:

``` text
                 User Problem
                      ↓
              Difficulty Estimator
                      ↓
               Compute Allocator
                      ↓
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
   Direct Solve     Search       Tool Use
        ↓             ↓             ↓
        └──────→ Candidate Pool ←───┘
                      ↓
                   Verifier
                      ↓
             Confidence Estimate
                      ↓
             ┌────────┴────────┐
             ↓                 ↓
          Accept            Continue
                               ↓
                     Allocate More Compute
```

The model becomes one component among search, verification, confidence
estimation, tools, memory, routing and stopping.

## 21. Researcher's View --- Compute Should Follow Uncertainty

A useful hypothesis is:

\[ `\text{Compute Budget}`{=tex} `\propto`{=tex}
`\text{Uncertainty}`{=tex} `\times`{=tex}
`\text{Value of Correctness}`{=tex} \]

A trivial translation should receive almost no search. A safety-critical
engineering design should receive retrieval, alternative solutions,
simulation, verification and perhaps multiple models.

This points toward **uncertainty-aware inference**.

## 22. Heterogeneous Search

Why should every reasoning branch use the same model?

``` text
Problem
 ├── cheap model explores A
 │     └── verifier rejects
 ├── cheap model explores B
 │     ↓
 │   promising
 │     ↓
 │   strong model deepens
 └── tool branch
       ↓
    simulator
       ↓
    verified result
```

This combines model routing, MoE-like specialization, search, tools and
verification.

The unit of intelligence becomes the **system**, not one model.

## 23. From Token Budgets to Cognitive Budgets

Tokens and FLOPs are infrastructure metrics. A more useful abstraction
may be:

``` text
exploration budget
verification budget
reflection budget
retrieval budget
simulation budget
```

For example:

``` text
Cognitive Budget = 100

40 → hypotheses
25 → verification
20 → retrieval
10 → simulation
5  → synthesis
```

Reasoning starts to resemble project management: allocate scarce
resources across cognitive operations.

## 24. Future Direction --- Verifier-Centric AI

If generation becomes cheap and broad, verification may become the
bottleneck.

Where reliable evaluators exist, large search spaces become tractable:

``` text
Code → unit tests
Math → formal checking
Engineering → simulation
Optimization → objective function
Algorithms → benchmarks
```

A plausible future principle is:

> **The scalability of AI search may be bounded less by generation than
> by verification.**

This makes learned verifiers, formal verifiers, simulators, world models
and calibrated uncertainty central research areas.

## 25. Open-Loop to Closed-Loop Intelligence

Traditional generation:

``` text
Input → Generate → Output
```

is largely open-loop.

A future reasoning system:

``` text
Predict
 ↓
Evaluate
 ↓
Observe error
 ↓
Adjust
 ↓
Predict again
```

is closed-loop.

Feedback makes correction possible. This may become one of the most
important architectural shifts in AI.

## 26. Connecting the First Five Deep Concepts

``` text
LLM System
│
├── FlashAttention
│   └── Data Movement / IO
├── PagedAttention
│   └── Memory Allocation
├── Speculative Decoding
│   └── Serial Generation Cost
├── Mixture of Experts
│   └── Capacity vs Active Compute
└── Test-Time Compute
    └── Quality vs Reasoning Budget
```

Each is fundamentally a resource-allocation problem.

## 27. Learning Reflection

The transferable innovation path is:

``` text
Hidden assumption:
one prompt → one fixed inference effort
↓
Expose a hidden degree of freedom:
Compute Budget
↓
Make it controllable
↓
Allocate it according to difficulty / uncertainty
↓
Measure progress
↓
Close the feedback loop
```

The reusable pattern is:

# Expose a Hidden Resource → Make It Controllable → Allocate It Adaptively → Close the Feedback Loop

## 28. Deeper Principle

The deepest lesson is not:

> "Longer chain-of-thought makes models smarter."

That is too crude and sometimes false.

The deeper principle is:

> **Intelligence depends not only on how much capability is stored in
> parameters, but also on how computation is organized and allocated
> over time.**

The future scaling question may therefore shift from:

``` text
How large is the model?
```

toward:

``` text
How intelligently does the system spend computation?
```

------------------------------------------------------------------------

# Part II --- 中文完整翻译与深度解释

# Test-Time Compute：为什么"让模型多想一会儿"，可能比直接换一个更大的模型更重要？

## 1. 模型训练完成以后，能力真的固定了吗？

过去的大模型 Scaling 逻辑主要是：

``` text
更多数据
+
更多参数
+
更多训练算力
=
更强模型
```

这很容易让我们形成一个隐含假设：

``` text
Weights 固定
→ Capability 固定
```

Test-Time Compute 打破的正是这个假设。

它研究的是：

> **模型参数完全不变时，能不能仅仅通过给一个具体问题分配更多推理计算，让答案变得更好？**

如果固定模型是 (f\_`\theta`{=tex})，我们可以把推理系统写成：

\[ y\^\*=A(f\_`\theta`{=tex},x,B) \]

其中 (B) 就是这个问题获得的 **Compute Budget**。

于是同一个模型，在不同计算预算下可以表现出不同的有效能力。

## 2. 为什么第一次推理路径不值得完全信任？

大模型推理具有路径依赖：

``` text
Step 1
 ↓
Step 2
 ↓
Step 3
 ↓
Answer
```

如果 Step 2 错了：

``` text
正确
 ↓
错误转弯
 ↓
基于错误继续合理推导
 ↓
越来越完整
 ↓
得到非常自信的错误答案
```

所以真正的问题是：

> **为什么模型第一次采样出来的推理路径，就一定是它能够找到的最好路径？**

答案显然是否定的。

这就给 Search、Retry、Verification、Reflection 留出了空间。

## 3. 最简单的办法：多生成几个 Candidate

如果一次独立尝试正确的概率是 (p)，生成 (N)
次以后至少出现一次正确答案的概率：

\[ 1-(1-p)\^N \]

例如 (p=0.2)：

``` text
1 次  → 20%
5 次  → 67.2%
10 次 → 89.3%
```

但这里有一个决定性问题：

``` text
正确答案已经出现
≠
系统知道哪个是正确答案
```

因此 Test-Time Scaling 真正的瓶颈很快从：

``` text
Generation
```

转向：

# Verification

## 4. 为什么 Verification 如此重要？

很多领域中，"检查"比"创造"容易。

``` text
编程：
写出正确程序 → 难
跑测试 → 相对容易

数学：
发现证明 → 难
检查证明步骤 → 往往更容易

工程：
提出优秀构型 → 难
检查重量、性能、约束 → 相对容易
```

于是可以建立：

``` text
Generator
 ↓
大量 Candidate
 ↓
Verifier
 ↓
淘汰
 ↓
保留高价值路线
 ↓
继续投入 Compute
```

这也是 AlphaCode、AlphaEvolve 一类系统背后的重要思想。

真正强大的系统不一定要求：

``` text
第一次就想对
```

而可以：

# Generate → Evaluate → Select → Improve

## 5. Reasoning 本质上可以被看成 Search

设当前推理状态是 (s_t)，下一步思考是 (a_t)：

\[ s\_{t+1}=T(s_t,a_t) \]

模型提供：

\[ `\pi`{=tex}(a_t\|s_t) \]

即"下一步可能往哪里想"。

Verifier 提供：

\[ V(s_t) \]

即"这条路线是否值得继续"。

于是 LLM Reasoning 开始与经典 AI 的 Beam Search、Planning、MCTS、RL
发生连接。

这带来一个重要认知升级：

> **Reasoning
> 不一定只是生成一串文字，也可以理解为在问题空间里进行搜索。**

## 6. Depth vs Breadth

额外算力主要有两种花法。

### 一条路线想得更深

``` text
问题
 ↓
思考
 ↓
检查
 ↓
回退
 ↓
继续
```

### 同时探索更多路线

``` text
问题
 ├── 路线 A
 ├── 路线 B
 ├── 路线 C
 └── 路线 D
```

因此出现：

# Depth vs Breadth

同样 10,000 Token：

``` text
一条路线想 10,000 Token？
```

还是：

``` text
10 条路线各想 1,000 Token？
```

没有统一答案。最优方案依赖问题难度、模型能力、Verifier 质量与错误类型。

## 7. Compute-Optimal Scaling

真正的问题不是：

> 能给模型多少 Compute？

而是：

> **下一单位 Compute 花在哪里，Expected Improvement 最大？**

可以定义直觉指标：

\[ Marginal Value of Compute =
`\frac{\Delta Quality}{\Delta Compute}`{=tex} \]

Snell 等人的研究显示，不同难度问题适合不同 Test-Time Strategy；其
compute-optimal 策略在实验中相对 Best-of-N
显著提高计算效率，并展示了小模型通过合理分配 Test-Time Compute
超越更大模型的某些 FLOPs-matched 区域。

这说明 Reasoning 本质上正在变成：

# Resource Allocation

## 8. Test-Time Compute 最有价值的位置：Capability Frontier

可以把问题分成三类：

``` text
太简单
→ 不需要额外思考

模型能力边缘
→ 多检查、多搜索可能改变结果

远超模型能力
→ 再想很多也未必有用
```

因此额外推理计算往往在：

# Capability Frontier

最有价值。

这与工程中的 Adaptive Computation
完全一致：资源不应该平均撒出去，而应该投向边际收益最高的位置。

## 9. DeepSeek-R1 真正说明了什么？

DeepSeek-R1-Zero 的重要意义之一，是通过大规模 RL
激励推理，并观察到延长推理、反思、自我验证等行为。

真正应该记住的不是：

``` text
RL → 更长答案
```

而是：

> **训练可以让模型学习怎样更有效地使用 Test-Time Compute。**

如果模型写 20,000 个 Token 却没有任何进展，那不是高级 Reasoning。

更合理的指标是：

\[ Reasoning Efficiency =
`\frac{Useful\ Progress}{Inference\ Compute}`{=tex} \]

## 10. s1 的 Budget Forcing 为什么有启发？

s1 展示了 Budget
Forcing：当模型准备过早停止时，可以通过推理时干预迫使它继续检查。

真正值得学习的不是某个具体的 `"Wait"` Token，而是：

> **Reasoning Budget 可以从隐式行为变成系统显式控制的变量。**

于是可以设计：

``` text
Minimum Budget
Maximum Budget
Stopping Policy
```

Inference 不再只是 Decode，而开始像一个管理认知资源的 Runtime。

## 11. 为什么"多想"可能反而变差？

一个非常危险的误解是：

``` text
Reasoning Token 越多
=
模型越聪明
```

模型可能：

``` text
一开始已经想对
 ↓
继续怀疑
 ↓
引入错误假设
 ↓
把自己绕进去
```

也可能：

``` text
走错路线
 ↓
继续生成很多 Token
 ↓
越来越坚定地证明错误结论
```

因此存在：

# Overthinking

研究已经观察到部分领域中推理过长会降低表现，而且不同领域的最优思考长度并不相同。

所以高级 Reasoning System 必须解决两个问题：

``` text
How to think?
```

以及：

# When to stop thinking?

## 12. 停止思考其实是 Optimal Control

如果继续一步的成本是 (c)，成功概率的预期提升是
(`\Delta `{=tex}P)，那么只有当：

\[ `\Delta `{=tex}P\>`\lambda `{=tex}c \]

继续才值得。

系统需要实时判断：

``` text
我有没有进展？
我是不是卡住了？
应该换路线吗？
应该调用 Tool 吗？
应该换更强模型吗？
应该停止吗？
```

这已经很像反馈控制：

``` text
Think
 ↓
Observe
 ↓
Estimate
 ↓
Allocate Compute
 ↓
Think / Search / Verify / Stop
```

## 13. 和 MoE 连起来：Adaptive Intelligence Allocation

上一篇 MoE 问：

``` text
这个 Token 应该激活哪些参数？
```

Test-Time Compute 问：

``` text
这个问题应该得到多少推理算力？
```

组合以后：

``` text
Input
 ↓
Difficulty / Uncertainty Estimator
 ↓
Easy
→ 少量资源
→ Short Reasoning

Medium
→ 更多资源
→ Verification

Hard
→ Strong Model
→ Search
→ Tools
→ Larger Budget
```

于是出现一个更大的概念：

# Adaptive Intelligence Allocation

## 14. 和 Speculative Decoding 连起来

Speculative Decoding：

``` text
减少低价值、重复的昂贵计算
```

Test-Time Scaling：

``` text
增加真正能改善答案的计算
```

两者的统一目标是：

> **把 Compute 从低价值位置搬到高价值位置。**

所以真正的系统目标不是：

``` text
Minimize FLOPs
```

而是：

# Maximize Intelligence per Unit Compute

## 15. 这其实是经典工程思想

Adaptive Mesh：

``` text
简单区域 → 粗网格
复杂区域 → 细网格
```

ODE Solver：

``` text
平缓区域 → 大步长
剧烈变化 → 小步长
```

Adaptive Integration：

``` text
容易区域 → 少采样
困难区域 → 多采样
```

共同原则：

# Compute follows Difficulty

Test-Time Scaling 可以理解成这个成熟工程原则在 AI Reasoning 中的对应物。

## 16. 未来 Reasoning System 可能更像 Cognitive Operating System

未来可能不再是：

``` text
Prompt → LLM → Answer
```

而是：

``` text
              Problem
                 ↓
        Difficulty Estimator
                 ↓
          Compute Allocator
                 ↓
     ┌───────────┼───────────┐
     ↓           ↓           ↓
 Direct Solve   Search      Tool
     ↓           ↓           ↓
     └────→ Candidate Pool ←─┘
                 ↓
              Verifier
                 ↓
          Confidence Estimate
                 ↓
        ┌────────┴────────┐
        ↓                 ↓
      Accept           Continue
                          ↓
                    More Compute
```

模型只是其中一个组件。

系统还需要 Search、Verification、Confidence、Stopping、Tool
Routing、Memory、Model Routing。

这就是为什么 Reasoning Research 正越来越像 Systems Research。

## 17. Compute 应该跟着 Uncertainty 走

可以提出一个值得长期研究的假设：

\[ Compute Budget `\propto`{=tex} Uncertainty `\times`{=tex}
Value of Correctness \]

简单翻译几乎不需要 Search。

复杂、安全关键的工程设计，则应该获得更多：

``` text
推理
检索
方案比较
仿真
验证
甚至多个模型
```

这指向：

# Uncertainty-Aware Inference

## 18. 为什么所有 Search Branch 都要用同一个模型？

未来可以：

``` text
Problem
 ├── Small Model 探索 A
 │     └── Verifier Reject
 ├── Small Model 探索 B
 │     ↓
 │   Promising
 │     ↓
 │   Large Model 深入
 └── Tool Branch
       ↓
    Simulator
       ↓
    Verified Result
```

于是 MoE、Model Routing、Test-Time Search、Tools、Verification
开始汇合。

这意味着：

> **未来真正的智能单位可能不是 Model，而是 System。**

## 19. 从 Token Budget 到 Cognitive Budget

未来也许不应该只用 Token 或 FLOPs 衡量推理资源，而应该设计：

``` text
Exploration Budget
Verification Budget
Reflection Budget
Retrieval Budget
Simulation Budget
```

例如：

``` text
Cognitive Budget = 100

40 → 探索方案
25 → 验证
20 → 检索
10 → 仿真
5  → 最终综合
```

Reasoning 开始像 Project Management：有限资源如何分配给不同认知活动？

## 20. Verifier-Centric AI

如果未来 Generator 可以很便宜地产生 10,000 个方案，真正的问题就会变成：

``` text
如何知道哪个最好？
```

在有可靠 Evaluator 的领域：

``` text
Coding → Unit Tests
Math → Formal Verification
Engineering → Simulation
Optimization → Objective Function
Algorithms → Benchmark
```

可以进行大规模搜索。

所以一个重要未来问题是：

> **AI Scaling 的瓶颈会不会逐渐从 Generation 转移到 Verification？**

## 21. Open-Loop AI → Closed-Loop AI

传统 LLM：

``` text
Input
 ↓
Generate
 ↓
Output
```

更接近 Open Loop。

未来：

``` text
Predict
 ↓
Evaluate
 ↓
Observe Error
 ↓
Correct
 ↓
Predict Again
```

则是 Closed Loop。

Feedback 带来纠错能力。这可能是 AI 架构最重要的变化之一。

## 22. 把前五篇 One Deep Concept 连起来

``` text
LLM System
│
├── FlashAttention → IO
├── PagedAttention → Memory
├── Speculative Decoding → Serial Compute
├── Mixture of Experts → Capacity / Active Compute
└── Test-Time Compute → Reasoning Budget
```

表面是五个不同技术，深层却都在问：

# 怎样分配稀缺资源？

现代 AI 越来越像复杂的资源调度系统。

## 23. Personal Research Reflection

今天真正值得记住的不是：

> Test-Time Compute = 让模型多写一些思维链。

真正重要的是：

> **模型的智能不仅存在于参数中，也存在于系统如何在时间维度上组织计算。**

研究路径可以抽象成：

``` text
旧假设：
一个 Prompt → 固定推理成本

↓
质疑这个固定量

↓
暴露新的自由度：
Compute Budget

↓
让它变成可控变量

↓
按照 Difficulty / Uncertainty 动态分配

↓
观察是否取得进展

↓
形成 Feedback Loop
```

最终创新模式是：

# Expose a Hidden Resource

# → Make It Controllable

# → Allocate It Adaptively

# → Close the Feedback Loop

这个思想可以迁移到任何工程系统。

面对一个系统时，不只应该问：

``` text
怎样让核心模块更强？
```

还应该问：

> **有没有某个过去被默认固定的量，其实可以被动态控制？**

它可能是：

``` text
时间
计算
带宽
内存
控制权限
传感器频率
仿真精度
人力
```

一旦把一个固定量变成：

# Controllable Variable

就可能打开全新的设计空间。

未来 AI 的竞争也许会从：

``` text
谁拥有最大的模型？
```

逐渐转向：

> **谁能够更聪明地决定，在什么问题上，用多少智能、多少时间、多少搜索、多少验证和多少工具。**

# Intelligence is not only what you have.

# Intelligence is also how you allocate what you have.

------------------------------------------------------------------------

# Research Map

``` text
Test-Time Compute
│
├── Core
│   ├── Inference-Time Scaling
│   ├── Compute Budget
│   └── Compute-Elastic Capability
├── Methods
│   ├── Longer Reasoning
│   ├── Best-of-N
│   ├── Self-Consistency
│   ├── Search
│   └── Revision
├── Verification
│   ├── Outcome Verifier
│   ├── Process Verifier
│   └── Automated Evaluation
├── Control
│   ├── Difficulty Estimation
│   ├── Budget Allocation
│   ├── Stopping Policy
│   └── Uncertainty
├── Systems
│   ├── OpenAI o1
│   ├── DeepSeek-R1
│   ├── s1
│   ├── AlphaCode
│   └── AlphaEvolve
└── Future
    ├── Adaptive Compute
    ├── Cognitive Budgets
    ├── Verifier-Centric AI
    └── Closed-Loop Intelligence
```

# Further Reading

1.  Charlie Snell et al. **Scaling LLM Test-Time Compute Optimally can
    be More Effective than Scaling Model Parameters.** 2024.\
    https://arxiv.org/abs/2408.03314

2.  OpenAI. **Learning to Reason with LLMs.** 2024.\
    https://openai.com/index/learning-to-reason-with-llms/

3.  DeepSeek-AI et al. **DeepSeek-R1: Incentivizing Reasoning Capability
    in LLMs via Reinforcement Learning.** 2025.\
    https://arxiv.org/abs/2501.12948

4.  Niklas Muennighoff et al. **s1: Simple Test-Time Scaling.** 2025.\
    https://arxiv.org/abs/2501.19393

5.  Wenkai Yang et al. **Towards Thinking-Optimal Scaling of Test-Time
    Compute for LLM Reasoning.** 2025.\
    https://arxiv.org/abs/2502.18080

6.  Yanxi Chen et al. **Simple and Provable Scaling Laws for the
    Test-Time Compute of Large Language Models.** 2024.\
    https://arxiv.org/abs/2411.19477

7.  Google DeepMind. **AlphaCode 2 Technical Report.** 2023.\
    https://deepmind.google/AlphaCode2_Tech_Report.pdf

8.  Google DeepMind. **AlphaEvolve.** 2025.\
    https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/

# One-Sentence Takeaway

> **Test-time compute reveals that intelligence is not determined only
> by how large a model is, but also by how intelligently a system
> allocates computation, search, verification, and time to each
> problem.**

> **Test-Time Compute
> 告诉我们：智能不仅取决于模型拥有多少参数，还取决于系统能否针对不同问题，聪明地分配思考时间、搜索空间、验证资源与计算预算。**
