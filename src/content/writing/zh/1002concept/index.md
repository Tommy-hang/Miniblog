---
title: "Concept_MoE_1002"
description: "A first-principles study of Mixture of Experts: how
  conditional computation separates total capacity from per-token
  compute, why routing and load balancing become the real engineering
  problem, and how MoE points toward dynamically allocated
  intelligence."
date: 2026-10-02
tags:
  - AI
draft: false
featured: false
---

# One Deep Concept #04 --- Mixture of Experts

> **Scaling Intelligence Without Activating the Whole Model**

# Part I --- English Research Article

## 1. Concept

Mixture of Experts (MoE) replaces selected dense Transformer
feed-forward networks with a bank of expert FFNs and a learned router.

``` text
Token
  ↓
Attention
  ↓
Router
  ├── Expert 1
  ├── Expert 2
  ├── ...
  └── Expert N
       ↓
Combine selected outputs
```

For each token, the router activates only a small Top-K subset. The
central idea is:

``` text
Total model capacity ≠ active compute per token
```

A model can own hundreds of billions of parameters without executing all
of them for every token.

## 2. Background and Fundamental Problem

Dense scaling couples capacity and cost. For a dense FFN,

\[ FFN(x)=W_2`\sigma`{=tex}(W_1x) \]

every token uses the same parameter matrices. Making the FFN larger
increases both capacity and per-token FLOPs.

But tokens about Python, French grammar, aerodynamics, or chemistry may
not need exactly the same transformation capacity. MoE asks whether a
model can keep a very large pool of knowledge while activating only the
subset useful for the current representation.

GShard demonstrated sparse MoE scaling beyond 600B parameters; Switch
Transformer simplified routing and trained models at trillion-parameter
scale. Modern systems such as DeepSeekMoE and DeepSeek-V3 further refine
specialization and balancing.

## 3. Previous Solutions

Dense scaling increases capacity but also compute. Model parallelism
makes a large dense model fit across devices but does not remove dense
computation. Pruning creates sparsity, often with a mostly static
pattern. Distillation lowers inference cost by compressing knowledge
into a smaller model, but reduces available capacity.

MoE is different:

> **The large capacity remains present, while the active computation
> changes with the input.**

This is conditional computation.

## 4. Core Innovation --- Routing

Let the experts be (E_1,`\dots`{=tex},E_N). A router maps token
representation (x) to scores:

\[ s=W_rx \]

and probabilities:

\[ p_i(x)=`\frac{\exp(s_i)}{\sum_j\exp(s_j)}`{=tex}. \]

The Top-K set is:

\[ `\mathcal `{=tex}T(x)=TopK(p(x),k) \]

and the layer output is approximately:

\[ y=`\sum`{=tex}\_{i`\in`{=tex}`\mathcal `{=tex}T(x)}p_i(x)E_i(x). \]

Only selected experts execute.

``` text
Large parameter pool
       +
Small active subset
       =
High capacity at controlled arithmetic cost
```

## 5. Expert Specialization

Experts are not normally assigned human labels such as "math" or
"French." Specialization is learned. It may follow language, syntax,
semantic structure, token type, representation geometry, or patterns
difficult for humans to name.

``` text
similar representations
       ↓
similar routing
       ↓
similar gradient updates
       ↓
emergent specialization
```

Open work such as OLMoE provides detailed routing analyses showing
substantial learned specialization.

## 6. The Real Difficulty --- Routing Is Also Scheduling

The router has two objectives:

``` text
ML objective:
send each token to useful experts

Systems objective:
keep expert workloads balanced
```

If one expert becomes too popular, its device becomes a straggler while
others wait. Capacity can overflow and underused experts receive less
training.

Thus routing is simultaneously:

``` text
Representation Learning
+
Resource Allocation
+
Distributed Scheduling
```

## 7. Load Balancing

Many systems use:

\[ L=L\_{task}+`\lambda `{=tex}L\_{balance}. \]

Too little balancing can produce overload or expert collapse. Too much
can force artificially uniform routing and interfere with
specialization.

DeepSeek-V3 is notable for reporting an auxiliary-loss-free
load-balancing strategy. The broader lesson is that if an operational
constraint can be enforced in the mechanism, it may be preferable to
forcing the primary learning objective to absorb the whole constraint.

## 8. DeepSeekMoE --- Fine-Grained and Shared Experts

DeepSeekMoE proposes finer expert segmentation:

``` text
[A] [B] [C]

becomes

[a1][a2][a3][a4]
[b1][b2][b3][b4]
[c1][c2][c3][c4]
```

and activates more small experts, creating a richer combinatorial space.

It also separates shared and routed experts:

``` text
Token
  ├── Shared experts → common knowledge
  └── Router
       └── Routed experts → specialized knowledge
```

The abstraction is:

# Common Capacity + Conditional Capacity

## 9. Communication --- The Hidden Cost

Experts are often distributed across GPUs.

``` text
GPU0 → E1–E4
GPU1 → E5–E8
GPU2 → E9–E12
GPU3 → E13–E16
```

If a token on GPU0 selects E11, its hidden state must move to GPU2. At
scale:

``` text
Tokens
 ↓
Router
 ↓
Dispatch
 ↓
All-to-All
 ↓
Expert compute
 ↓
All-to-All
 ↓
Combine
```

Therefore:

> **Sparse FLOPs do not imply cheap execution.**

MoE can trade arithmetic for networking, scheduling, and memory
complexity.

## 10. Top-1, Top-2, Top-K

Top-1 minimizes expert compute and communication. Larger K provides
richer combinations but increases cost:

\[ K`\uparrow `{=tex}`\Rightarrow`{=tex}
capacity access`\uparrow`{=tex},; compute`\uparrow`{=tex},;
communication`\uparrow`{=tex},; sparsity`\downarrow`{=tex} \]

K controls a fundamental capability-efficiency trade-off.

## 11. Expert Choice --- Reverse Who Selects Whom

Traditional routing asks which experts a token chooses. Expert Choice
Routing asks which tokens an expert chooses. Fixed expert bucket sizes
naturally constrain load while tokens may receive variable numbers of
experts.

> **When allocation is unstable, reversing who chooses whom can change
> the optimization problem.**

## 12. MoE Changes the Meaning of Model Size

For MoE we need at least two numbers:

``` text
Total parameters
Active parameters per token
```

DeepSeek-V3 reports 671B total parameters and 37B activated per token.
Mistral Large 3 reports 675B total and 41B active.

Total parameters relate to capacity and storage; active parameters
relate more closely to per-token arithmetic. "A 600B model" is therefore
incomplete information.

## 13. Engineering Trade-offs

MoE offers capacity without proportional active compute, specialization,
and conditional resource allocation. But inactive experts still require
storage; expert parallelism introduces communication; poor routing
creates stragglers; training can destabilize; serving and batching are
harder; quantization is complicated by uneven expert calibration.

``` text
Dense compute complexity
        ↓
is partly exchanged for
        ↓
Routing + Communication + Scheduling + Memory complexity
```

Engineering optimization often moves complexity rather than eliminating
it.

## 14. System Perspective --- Computation as Resource Allocation

A dense network asks what computation every input should execute. MoE
asks what computation this particular input should receive.

``` text
OS scheduler → jobs to CPUs
Network router → packets to paths
Cloud balancer → requests to servers
MoE router → tokens to experts
```

MoE is therefore a resource-allocation architecture as much as a neural
architecture.

## 15. Researcher's View --- Should Every Token Get the Same Compute?

Why should punctuation and a difficult mathematical derivation receive
the same expert budget?

``` text
easy token   → 1 expert
normal token → 2 experts
hard token   → 6 experts
```

Routing can evolve from deciding **which capability** to deciding **how
much computation**. This leads to Adaptive Compute.

## 16. Future --- Intelligence Routing

Extend the router beyond FFNs:

``` text
Input
 ↓
Intelligence Router
 ↓
Small model
Large model
Coding expert
Retriever
Physics simulator
Tool
Memory
Planner
```

The decision evolves into:

``` text
Which model?
Which expert?
Which tool?
How much reasoning?
Which memory?
Which modality?
```

This suggests a broader architecture: **Intelligence Routing**.

## 17. Hierarchical MoE and Experts Beyond FFNs

With thousands of experts, flat routing may itself become costly:

``` text
Global Router
   ↓
Expert Group
   ↓
Local Router
   ↓
Fine Expert
```

And future experts need not be only FFNs. They may be reasoning modules,
coding models, vision systems, retrievers, simulators, planners,
memories, or external tools.

``` text
Mixture of Neural Experts
          ↓
Mixture of Computational Capabilities
```

## 18. Connecting the First Four Deep Concepts

``` text
LLM System
│
├── FlashAttention → Data Movement / IO
├── PagedAttention → KV-Cache Memory
├── Speculative Decoding → Serial Depth
└── Mixture of Experts → Capacity vs Active Compute
```

These attack different scarce resources: IO, memory, time, and
compute/capacity.

> **An LLM is not merely a Transformer equation; it is a
> resource-allocation system under compute, memory, communication, and
> latency constraints.**

## 19. Learning Reflection

MoE teaches:

``` text
Find an undesirable coupling:
capacity ↑ → per-input compute ↑
↓
Ask whether it is fundamental
↓
Introduce conditionality
↓
Selectively activate resources
↓
Observe new bottlenecks
↓
Optimize the whole new system
```

The pattern is:

# Decouple → Select → Route → Balance

The deepest lesson is:

> **A large system does not need to activate all of its capability for
> every problem.**

------------------------------------------------------------------------

# Part II --- 中文完整翻译与深度解释

# Mixture of Experts：为什么一个拥有 671B 参数的模型，每个 Token 可以只激活 37B？

## 1. 从最简单的问题开始

Dense Transformer 默认所有 Token 都经过同一套 FFN。无论输入是
Python、法语、空气动力学还是有机化学，都会动用同一批参数。

于是 Dense Scaling 存在绑定：

``` text
总能力 ↑
  ↓
每个 Token 的计算成本也 ↑
```

MoE 的核心创新，就是质疑这个绑定：

> **模型拥有的全部能力，是否真的需要在每一个输入上全部激活？**

因此它把一个 FFN 变成多个 Expert，再增加 Router：

``` text
Token
 ↓
Router
 ↓
选择 Top-K Expert
 ↓
只运行被选中的 Expert
 ↓
合并结果
```

于是：

# Total Capacity ≠ Active Compute

## 2. Router 到底在做什么？

Router 对 Token 的 Hidden State 计算 Expert 分数，再选择 Top-K。不同
Token 因此走不同计算路径。

这意味着：

# Input-Dependent Computation

模型不再只是直觉上的固定计算图，而是动态选择子图。

## 3. Expert 真的是"数学专家、代码专家"吗？

不一定。Expert 的专业化通常不是人工规定，而是在训练中涌现：

``` text
相似表示
 ↓
相似路由
 ↓
相似梯度
 ↓
逐渐形成 specialization
```

它可能对应语言、语法、语义结构，也可能是人类难以命名的表示空间结构。

## 4. MoE 最难的其实是 Router

如果某个 Expert 特别受欢迎：

``` text
E7 ███████████████████
E1 ██
E2 █
E3 ██
```

模型角度也许合理，硬件角度却会造成 GPU 堵塞和等待。

所以 Router 同时是：

``` text
Machine Learning
+
Resource Allocation
+
Distributed Scheduling
```

这才是 MoE 真正精彩的地方。

## 5. Load Balancing 为什么难？

传统方法加入：

\[ L=L\_{task}+`\lambda `{=tex}L\_{balance} \]

平衡太弱会过载，太强又可能破坏 specialization。

因此：

``` text
模型最想怎么学
≠
硬件最希望怎么分配
```

DeepSeek-V3 的 auxiliary-loss-free load balancing
值得关注，因为它体现了一个更一般的原则：

> **如果工程约束能直接在机制层解决，就未必需要全部塞进学习目标。**

## 6. DeepSeekMoE：为什么把 Expert 切细？

``` text
[A] [B] [C]

→

[a1][a2][a3][a4]
[b1][b2][b3][b4]
[c1][c2][c3][c4]
```

细粒度 Expert 让一个 Token 可以组合多个小能力，组合空间更丰富。

它还区分：

``` text
Shared Experts → 公共能力
Routed Experts → 专门能力
```

即：

# Common Capacity + Conditional Capacity

## 7. 最大隐藏成本：通信

Expert 往往分布在不同 GPU。Token 选择远端 Expert 后，需要跨 GPU 发送
Hidden State：

``` text
Token
 ↓
Router
 ↓
All-to-All
 ↓
Expert Compute
 ↓
All-to-All
 ↓
Merge
```

所以：

> **Sparse FLOPs ≠ Cheap System**

少做矩阵乘法，可能换来更多网络通信。这与 FlashAttention
的系统思维完全一致：真实成本不能只看 FLOPs。

## 8. 为什么"模型参数量"一个数字不够用了？

DeepSeek-V3：

``` text
671B Total
37B Active / Token
```

Mistral Large 3：

``` text
675B Total
41B Active
```

Total 更接近容量和存储；Active 更接近单 Token 算术成本。

以后看到"600B 模型"，应该继续问：

``` text
Total 还是 Active？
Top-K 是多少？
Expert 怎么分布？
通信成本多大？
```

## 9. Expert Choice：一个很好的"反过来想"

普通 MoE：

``` text
Token 选择 Expert
```

Expert Choice：

``` text
Expert 选择 Token
```

这样 Expert 可以固定接收容量，负载更容易控制。

值得迁移的方法是：

> **当资源分配问题很难时，尝试反转"谁选择谁"。**

## 10. MoE 只是把复杂度搬走了吗？

某种意义上，是的：

``` text
Dense:
大量固定 Compute

MoE:
更少 Active Compute
+
Routing
+
Communication
+
Scheduling
+
Load Balancing
```

优秀工程设计经常不是消灭复杂度，而是把复杂度搬到更值得、也更可控的位置。

真正优化的是：

# Total System Cost

## 11. Researcher's View：为什么所有 Token 都固定 Top-2？

一个逗号和一个复杂稳定性推导，真的需要同样的 Expert Budget 吗？

未来可能：

``` text
简单 Token → 1 Expert
普通 Token → 2 Experts
困难 Token → 6 Experts
```

Router 不仅决定"用谁"，还决定"用多少计算"。

这就是：

# Adaptive Compute

## 12. 从 Expert Routing 到 Intelligence Routing

继续向外推：

``` text
Which model?
Which expert?
Which tool?
Which memory?
How much reasoning?
Which modality?
```

未来系统可能：

``` text
User Request
 ↓
Intelligence Router
 ↓
├── Small Model
├── Large Model
├── Coding Expert
├── Retriever
├── Physics Simulator
├── Memory
└── Tool
```

这时 MoE 开始与 Agent Architecture 汇合。

## 13. Hierarchical MoE 与未来 Expert

如果有 10,000 个 Expert，可以使用：

``` text
Global Router
 ↓
Expert Group
 ↓
Local Router
 ↓
Specific Expert
```

而 Expert 也未必永远是 FFN，它可以成为 Reasoning Module、Coding
Model、Retriever、Simulator、Planner、Memory 或 Tool。

于是：

``` text
Mixture of Neural Experts
          ↓
Mixture of Computational Capabilities
          ↓
Mixture of Intelligence
```

## 14. 把前四篇 One Deep Concept 连起来

``` text
LLM System
│
├── FlashAttention → IO
├── PagedAttention → Memory
├── Speculative Decoding → Serial Depth
└── Mixture of Experts → Capacity / Active Compute
```

我们已经不再只是学习 Transformer，而是在建立 **LLM Systems Map**。

## 15. Personal Research Reflection

今天真正值得记住的不是：

> MoE = 很多 Expert + 一个 Router。

而是：

> **一个大型系统不需要在每一个问题上激活自己的全部能力。**

创新路径是：

``` text
发现不良绑定：
Capacity ↑ → Compute ↑
↓
质疑绑定是否必然
↓
发现不同输入需要不同能力
↓
引入 Conditional Computation
↓
Router 选择资源
↓
出现新瓶颈：
Load Balance / Communication / Scheduling
↓
继续优化整个系统
```

最终抽象成：

# Decouple → Select → Route → Balance

真正值得长期追踪的问题不是"Expert 会不会越来越多"，而是：

> **未来智能系统会不会从"一个越来越大的统一模型"，逐渐变成"一个巨大的能力池 +
> 一个极其聪明的调度系统"？**

如果答案是肯定的，Router 可能从今天 MoE 中一个很小的模块，逐渐变成整个
AI System 的核心控制层：

``` text
谁来思考？
思考多久？
调用什么工具？
使用多少计算？
访问什么记忆？
什么时候升级到更强模型？
```

这也许才是 MoE 最深远的意义。

# Research Map

``` text
Mixture of Experts
│
├── Core
│   ├── Conditional Computation
│   ├── Sparse Activation
│   └── Capacity ≠ Active Compute
├── Architecture
│   ├── Router
│   ├── Experts
│   └── Top-K
├── Training
│   ├── Specialization
│   ├── Load Balancing
│   └── Expert Collapse
├── Systems
│   ├── Expert Parallelism
│   ├── All-to-All
│   └── Scheduling
├── Modern Designs
│   ├── Switch Transformer
│   ├── Expert Choice
│   ├── DeepSeekMoE
│   └── Shared Experts
└── Future
    ├── Adaptive Compute
    ├── Hierarchical MoE
    ├── Tool Experts
    └── Intelligence Routing
```

# Further Reading

1.  Fedus, Zoph, Shazeer. **Switch Transformers**, JMLR 2022.\
    https://www.jmlr.org/papers/v23/21-0998.html
2.  Lepikhin et al. **GShard**, 2020.\
    https://arxiv.org/abs/2006.16668
3.  Zhou et al. **Mixture-of-Experts with Expert Choice Routing**,
    2022.\
    https://arxiv.org/abs/2202.09368
4.  Dai et al. **DeepSeekMoE**, 2024.\
    https://arxiv.org/abs/2401.06066
5.  DeepSeek-AI et al. **DeepSeek-V3 Technical Report**, 2024.\
    https://arxiv.org/abs/2412.19437
6.  Muennighoff et al. **OLMoE**, 2024.\
    https://arxiv.org/abs/2409.02060

# One-Sentence Takeaway

> **Mixture of Experts shows that scaling intelligence does not
> necessarily require scaling the computation used for every input: a
> system can own enormous capacity while dynamically activating only the
> capabilities each problem needs.**

> **Mixture of Experts
> 告诉我们：扩大智能的总容量，并不意味着每一个输入都必须付出同等规模的计算成本；真正高级的系统，也许不是永远"全力思考"，而是知道什么时候应该调用哪一部分智能。**
