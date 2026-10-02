---
title: "10月2号航空探索速递"
description: "从GNSS干扰常态化与量子/磁导航进入无人机飞行验证出发，重新思考大型固定翼无人货机的自主性：真正的无人化是在导航、通信与外部数据源失效时仍保持可证明的安全能力。"
date: 2026-10-02
tags:
  - Aviation
draft: false
featured: false
---

# 每日航空灵感探索｜2026-10-02

> **今日主线：真正的 Autonomous
> Aircraft，不是"没有飞行员也能飞"，而是"外部依赖失效后仍然知道自己在哪里、还能安全地做决定"。**

10 月 1 日，ZenaDrone 推进面向 GPS-denied 环境的 quantum-navigation
无人机测试。把它放到 2026 年航空环境中更有意义：EASA 今年再次更新 GNSS
interference 安全公告，明确指出 jamming（压制干扰）和
spoofing（欺骗干扰）正变得更严重、更复杂；EASA 与 EUROCONTROL
也已发布专门 Action Plan。

> **今天真正的问题不是"量子导航能不能替代
> GPS？"，而是"大型无人货机是否应该从第一天就按 Degraded Navigation /
> Degraded Communication 条件设计？"**

## 01｜Global Scan · 全球扫描

| 观察线 | 最新信号 | 为什么值得注意 |
| ------ | -------- | -------------- |
| 无人航空 / Alternative PNT | 10 月 1 日报道显示 ZenaDrone 正推进 GPS-independent quantum navigation 测试，以高精度运动感知结合 AI path correction。 | GPS-independent navigation 正从实验室概念进入无人平台集成。 |
| 技术前沿 / Magnetic Navigation | 9 月 SandboxAQ 与 Northrop Grumman 已在 Group 3 UAS 上飞行验证 AQNav magnetic navigation。 | Alternative PNT 正形成多传感器、异构导航路线。 |
| 监管 / GNSS Interference | EASA 2026 年 7 月发布 SIB 2022-02R4，指出 GNSS jamming / spoofing 严重性与复杂度增加。 | GNSS degradation 已成为民航需要系统处理的运行风险。 |
| 空域 / Resilience | EASA 与 EUROCONTROL 2026 年 3 月发布联合 Action Plan，覆盖短、中、长期措施。 | Resilience 不只是机载设备问题，还影响 ATM、航路、程序与网络容量。 |
| 自主系统 / Assurance | NASA 的 Robust and Resilient Autonomy 研究强调 uncertainty propagation、competence quantification、fault detection 与 contingency replanning。 | 可认证自主系统必须能识别"不确定"和"能力下降"。 |

### 今日扫描判断

过去几天的研究链逐渐形成：

`Cargo Condition → Network Role → Cargo Value → System Resilience`

大型固定翼无人货机的顶层需求不能只有
`Payload / Range / Cost / Runway`，还必须加入：

> **Dependency Resilience｜依赖韧性**

飞机依赖 GNSS、Communication Link、Ground Control、Weather
Data、Surveillance、Digital Maps、Cargo Data 与 Airport
Infrastructure。真正的问题不是这些系统正常时飞机能做什么，而是：

> **其中一个、两个甚至多个同时失效时，飞机还能安全完成什么？**

## 02｜Three Anomalies · 三个异常点

### ① 为什么有人飞机遇到 GPS spoofing 可以"让飞行员识别异常"，无人飞机却不能简单照搬？

EASA 最新指导强调 pilot--ATC phraseology、operational
procedures、training、EFB support 与 ATC
capacity。现有民航韧性体系大量依赖 **Human Recognition + Human
Cross-check**。

有人机可以
`Compare → Suspect → Reject → Revert → Communicate`；大型无人货机没有驾驶舱飞行员，这些认知任务必须重新分配给：

`Aircraft Autonomy + Remote Operator + ATM`

真正重新设计的是：

> **Who detects? Who decides? Who has authority?**

### ② 为什么导航系统越多，不一定意味着飞机越安全？

最直觉的方案是：

`GNSS + INS + Vision + Magnetic + Radio Navigation`

但如果不同系统给出矛盾位置，真正困难的已经不是 sensing，而是：

> **Integrity Decision｜完整性判定**

飞机必须判断哪个数据源失效、是 sensor fault 还是 external spoofing、当前
uncertainty 多大、是否还能继续航路。

> **Navigation redundancy ≠ Navigation resilience。**

只有飞机能够判断信息可信度，冗余才真正有意义。

### ③ 为什么"失去通信"对大型无人货机可能比失去 GPS 更值得研究？

GPS 失效仍可能通过 INS、VOR/DME、vision、terrain matching、magnetic
navigation 获得替代。但如果失去 **Command & Control Link（C2
Link）**，问题会迅速升级：

`Who authorizes diversion? / Who coordinates with ATC? / Who resolves airport closure? / Who handles simultaneous failures?`

因此真正关键的能力可能是：

> **Contingency Autonomy｜应急自主能力**

`Assess → Bound Risk → Select Safe Action → Execute → Recover / Terminate`

## 03｜Deep Dive · Graceful Degradation

### Fact

EASA 2026 年 7 月指出，自 2022 年以来 GNSS jamming 与 spoofing
显著增加，重点区域包括 Mediterranean、Black Sea、Middle East、Baltic Sea
与 Arctic。可能造成 navigation position discrepancy、ground speed / true
airspeed 异常、time shift、spurious TAWS alert、IRS/GNSS hybrid position
deviation 以及 rerouting / diversion。

与此同时，alternative navigation 已进入飞行验证：9 月 AQNav
在无人平台完成 magnetic-navigation flight testing；10 月 1 日又出现
ZenaDrone 推进 GPS-independent quantum-navigation 测试的消息。

**事实边界：** 这些测试不意味着 quantum / magnetic navigation
已经可以直接替代民航
GNSS，也不意味着已经达到大型民用无人货机适航成熟度。

### Need · 我们真正需要的不是"Backup GPS"

如果需求写成 `Aircraft shall have backup navigation`，仍然太模糊。

更好的思路可能是：

> **Aircraft shall maintain a defined minimum safe capability after loss
> or corruption of external PNT sources.**

定义的不是 Backup System，而是：

> **Minimum Remaining Capability｜最低剩余能力**

``` text
Normal
│
├─ GNSS degraded
│  └─ Continue with bounded accuracy
├─ GNSS unavailable
│  └─ Alternate PNT + route restriction
├─ GNSS + C2 degraded
│  └─ Autonomous contingency mode
└─ Navigation integrity uncertain
   └─ Safe diversion / hold / termination
```

这就是：

> **Graceful Degradation｜优雅降级**

系统不是 `100% → Failure`，而是：

`100% → 80% → 50% → Minimum Safe State`

### Design Logic

#### 1｜从 Sensor Redundancy 转向 Functional Diversity

`GPS 1 + GPS 2 + GPS 3` 如果受同一干扰源影响，并不形成真正独立的安全链。

更重要的是 **Dissimilar Redundancy｜异构冗余**：

-   Satellite-based：GNSS
-   Self-contained：INS
-   Environment-referenced：Vision / Terrain / Magnetic
-   Ground-referenced：DME / VOR / Surveillance

不同物理原理之间才更可能形成 failure independence。

#### 2｜建立 Navigation Confidence，而不仅是 Navigation Position

未来自主飞机可能需要输出：

``` text
Position: N xx / E xx
Confidence: High
Estimated Error: < 50 m
Trusted Sources: INS + MagNav
Rejected: GNSS
```

系统不再只问"我在哪里？"，还问：

> **"我有多确定自己在哪里？"**

这与 NASA 强调的 uncertainty propagation 与 competence quantification
思路一致。

#### 3｜让 Autonomy 根据 Confidence 改变行为

`Sensor → Confidence → Capability → Allowed Mission`

而不是：

`Sensor → Position → Autopilot`

当 Navigation Confidence 下降，系统可以依次限制 route / altitude /
approach type，再进入 divert / hold / return，最终进入 **Minimum Risk
Condition**。

#### 4｜把 C2 Link 纳入同一套逻辑

| Navigation | Communication | Possible Mode |
| ---------- | ------------- | ----------------------------------- |
| High | High | Normal autonomous operation |
| High | Low | Lost-link autonomous continuation |
| Low | High | Ground-assisted contingency |
| Low | Low | Minimum-risk autonomous mode |

这比简单写"飞机具有失链返航功能"更接近大型无人货机真正需要的系统架构。

### Trade-off

| Resilient Autonomy 带来的能力 | 代价 |
| ----------------------------- | ---- |
| GNSS-denied operation | 更多传感器重量 |
| 更强安全边界 | 软件复杂度上升 |
| 降低单点故障 | Verification 成本增加 |
| Lost-link autonomous action | Authority design 更困难 |
| 更高 mission completion rate | 系统价格提高 |
| 更少依赖地面人员 | Autonomy certification 更困难 |
| 多源导航 | Sensor disagreement management 复杂 |

最大的 Trade-off 可能不是重量，而是：

> **Capability vs. Certifiability**

每增加一种"聪明的应急行为"，就增加一种必须向适航机构证明它不会在合理边界条件下做出危险决定的行为。

因此最好的无人货机未必是"什么情况都会自己解决"，更可能是：

> **能够准确知道自己的能力边界，并在越界前进入可证明安全状态的飞机。**

## 04｜Idea Explosion · 灵感爆炸

1.  如果 GNSS 被 spoofing
    而不是完全消失，飞机怎样知道"一个看起来正常的位置其实是假的"？
2.  大型无人货机是否应该把 Navigation Confidence 作为 flight-control
    system 的正式输入？
3.  能否定义 Autonomous Capability
    Envelope --- 不同传感器和通信状态下允许执行哪些任务？
4.  失去 C2 Link
    后，飞机应该继续任务、返航、备降还是等待？决定规则由谁制定？
5.  如果 GNSS 和 C2 同时失效，飞机是否仍应被允许穿越繁忙民航空域？
6.  机场进近阶段的 PNT resilience 要求是否应该远高于巡航阶段？
7.  能否通过任务规划主动避开 GNSS interference
    hotspot，而不只依赖机载抗干扰？
8.  如果 alternative PNT 增加 50 kg
    重量，却扩大可运行空域，它的系统级收益是否值得？
9.  无人货机是否应该保留 VOR/DME 等传统导航能力？
10. Cargo Value 越高，是否应该要求更高等级的 navigation / communication
    redundancy？
11. 能否把 Mission Priority Class 与 Resilience State
    联动 --- 高价值货物只允许在更高系统完整性下起飞？
12. "知道自己不知道"是否比"永远尝试完成任务"更应该成为自主飞行系统的核心设计原则？

## 05｜Inspiration Card · Autonomous Capability Envelope

**今天看到的东西**\
GNSS jamming / spoofing 已成为 EASA 持续更新运行指导的现实问题，而
magnetic / quantum navigation 正逐渐进入无人平台飞行测试。

**一句话事实**\
自主飞机不能假设 GNSS、通信和地面系统永远可用。

**最意外的地方**\
无人化真正困难的部分可能不是正常飞行，而是：**当信息互相矛盾、通信消失、系统能力下降时，飞机还能否正确判断"自己现在还能做什么"。**

**它解决的问题**\
把"失效以后怎么办"从一个单独 emergency
procedure，提升为总体架构设计变量。

**核心设计逻辑**

`System State → Confidence Estimation → Available Capability → Allowed Mission → Safe Action`

**Trade-off**\
更强 resilience
提高运行范围和任务成功率，但显著增加传感器、软件、验证与适航复杂度。

**产生的问题**\
怎样定义 Confidence？谁批准 autonomous contingency
logic？怎样证明算法不会错误接受 spoofed data？

**对大型固定翼无人货运飞机项目的潜在启发**

``` text
Autonomous Operation
├── Normal Operation
├── Navigation Resilience
│   ├── GNSS Jamming
│   ├── GNSS Spoofing
│   ├── Alternative PNT
│   └── Navigation Integrity
├── Communication Resilience
│   ├── C2 Degradation
│   ├── Lost Link
│   └── Recovery
└── Contingency Autonomy
    ├── Fault Detection
    ├── Confidence Estimation
    ├── Mission Replanning
    └── Minimum Risk Condition
```

**状态**：`💡 Insight → Project Candidate`

## 06｜Project Translation · 项目转化

| 维度 | 今天可能产生的影响 | 强度 |
| ---- | ------------------ | ---- |
| 需求 | 从"具备自主飞行"升级到"具备定义明确的 degraded-mode capability" | **非常高** |
| 场景 | 把 GNSS / C2 degraded scenarios 加入运行场景分析 | **非常高** |
| 构型 | Alternative PNT、INS 等可能影响设备布局与电磁环境 | **中---高** |
| 机场运行 | 进近阶段对导航完整性要求更高，可能限制可用机场与程序 | **高** |
| 无人化 | 从正常状态自动化转向 contingency autonomy | **非常高** |
| 物流网络 | 干扰热点、通信覆盖与备降机场进入 route/network planning | **高** |
| 适航 | Confidence estimation、fault detection、mode transition 需要安全保证 | **非常高** |
| 商业模式 | Resilient operation 提高可靠性，但需衡量设备与认证成本 | **中---高** |

### 今天最建议加入总体方案的一条原则

不要只写：

> **"实现自主起飞、巡航、降落。"**

更成熟的表达应同时包含：

> **Normal Autonomy + Degraded Autonomy + Minimum-Risk Behavior**

``` text
Can it fly by itself?
        ↓
Can it detect when its information is wrong?
        ↓
Can it understand what capability remains?
        ↓
Can it safely change behavior?
```

第四个问题，可能比第一个更能决定大型无人货机是否真正具备工程意义上的"自主"。

## 07｜今日一句洞察

> **自主系统最重要的能力，不是永远知道答案，而是知道自己的答案什么时候已经不再可信。**

> **Autonomy is not the absence of a pilot. It is the ability to remain
> safe when assumptions fail.**

因此今天可以给正在形成的设计思想再增加一层：

`Aircraft-Centric → Cargo-Centric → Network-Centric → Value-Centric → Resilience-Centric`

它们不是五种互相竞争的方法，而是大型固定翼无人货运飞机逐渐展开的五层系统问题：

> **飞机能不能飞 → 货物能不能完好抵达 → 网络是否需要它 →
> 运输是否创造价值 → 外部依赖失效后它是否仍然安全。**

## 值得以后回看的 3 个关键词

`Graceful Degradation` --- **优雅降级**

`Navigation Confidence` --- **导航可信度**

`Autonomous Capability Envelope` --- **自主能力包线**

## Sources

-   EASA --- *GNSS Outages and Alterations / SIB 2022-02R4*, updated
    2026-07-03:
    https://www.easa.europa.eu/en/domains/air-operations/global-navigation-satellite-system-outages-and-alterations
-   EASA --- *EASA and EUROCONTROL publish joint Action Plan to ensure
    safe operations during GNSS interference events*, 2026-03-25:
    https://www.easa.europa.eu/en/newsroom-and-events/press-releases/easa-and-eurocontrol-publish-joint-action-plan-ensure-safe
-   ICAO --- *Protect satellite navigation from interference, UN
    agencies urge*:
    https://www.icao.int/news/protect-satellite-navigation-interference-un-agencies-urge
-   NASA TechPort --- *Robust and Resilient Autonomy for Advanced Air
    Mobility (AVIATE)*: https://techport.nasa.gov/projects/106528
-   The Defense Post --- *ZenaDrone Adds a Quantum Backup for Drones
    When GPS Fails*, 2026-10-01.
-   SandboxAQ / Northrop Grumman --- AQNav magnetic-navigation UAS
    flight-test reporting, announced 2026-09-09.

> **Evidence note:**
> `Navigation Confidence`、`Autonomous Capability Envelope`、`Dependency Resilience`
> 与本文 Navigation--Communication
> 状态模型，是本报告基于公开航空安全与自主系统研究提出的设计概念，并非
> EASA、FAA、ICAO 或 NASA 的正式认证术语。
