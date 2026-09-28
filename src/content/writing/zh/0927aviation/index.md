---
title: "9月27日航空探索速递"
description: "下一代无人货机，也许不应该只会“执行航线”，而应该能够理解整个航空网络未来几小时会发生什么"
date: 2026-09-28
tags:
  - Aviation
draft: false
featured: false
---

# 每日航空灵感探索｜2026-09-27

> **今日主线：下一代无人货机，也许不应该只会"执行航线"，而应该能够理解整个航空网络未来几小时会发生什么。**
>
> 最新公开信息里，最值得深挖的不是一架新飞机，而是航空系统正在从
> **reactive（事后响应）** 向 **predictive（预测式管理）** 转变：FAA 的
> SMART 平台把天气、航迹、流量、管制员配置等约 200
> 条数据流集中起来，提前预测空域需求---容量冲突；ICAO 亚太 34
> 个国家和地区则刚刚承诺推进 trajectory-based
> operations（基于航迹的运行）、AI in
> ATM（空中交通管理中的人工智能）、跨境协调和供应链韧性。
>
> **如果未来空域本身越来越"可预测"，飞机是否也应该从固定任务执行器，变成一个能根据网络状态持续重算任务价值的节点？**

## 01｜Global Scan · 全球扫描

  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  观察线                  最新信号                                                                             为什么值得注意
  ----------------------- ------------------------------------------------------------------------------------ ------------------------------------------------------------------------------
  **空域 / 运行**         FAA 9 月 21 日启用 SMART 的 limited mode：平台汇集约 200 条数据流，用 AI             ATM 正从"堵了以后调流"转向提前数小时、数天甚至数周发现容量问题。
                          辅助预测天气、交通流、容量和管制员配置造成的冲突，并首先在华盛顿特区周边空域使用。   

  **无人航空 / 真实运行** FAA 9 月 23 日披露，North Carolina 成为 AAM Integration Pilot Program                监管机构正在用真实运行数据而不只是试验场性能来塑造下一代规则。
                          的第五个启动地点；Joby 的 remotely piloted J208 已执行区域机场---大型枢纽航段，BETA  
                          则完成多次医疗和灾害响应任务。                                                       

  **全球规则 / 网络**     ICAO 最新公布，亚太 34 个国家和地区同意推进跨境空管协调、trajectory-based            下一代航空网络的核心对象正在从"单架飞机"转向"跨区域流量与韧性"。
                          operations、AI in ATM，并强调 supply-chain resilience。                              

  **无人系统安全**        EASA Opinion 06/2026 提议强化 UAS operator identity verification、remote             大规模无人运行要求飞机不仅"安全"，还必须在数字系统里可识别、可追踪、可约束。
                          identification 与 geographical-zone 信息一致性。                                     

  **航空信息基础设施**    FAA 新一代 NOTAM 服务强调 near-real-time data exchange、scalable and resilient       无人航空基础设施正在逐渐具备 machine-readable、实时更新特征。
                          architecture。                                                                       
  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### 扫描后的第一判断

过去常把飞行任务想成：

`Mission Planning → Takeoff → Follow Route → Land`

如果空域、机场、天气、货运节点都逐渐能够实时提供数字状态，未来更可能是：

`Mission Intent → Network Prediction → Route / Slot Selection → Continuous Re-evaluation → Re-plan if Needed → Delivery`

飞机需要回答的问题不再只有 **"我能不能安全飞到 B？"**，还可能包括
**"现在去 B 还是最合理的吗？"**

这两者之间，是 **Flight Automation** 与 **Mission Autonomy** 的区别。

## 02｜Three Anomalies · 三个异常点

### ① 为什么 FAA 的新 AI 系统没有直接控制飞机？

SMART 使用 AI 汇总约 200
条数据流，并能够提前发现空域需求、天气与容量问题，但 FAA 明确强调：SMART
不取代管制员，也不控制飞机；它提供 recommendation，由人决定是否采用。

> **Prediction first, authority later.**

航空领域可能先让 AI
获得更大的信息视野、更强预测能力和方案生成能力，而暂时不直接给予最终控制权。

对大型无人货机而言，高等级自主不一定意味着每一个决策都由飞机独立完成，更可能是：

`Machine Prediction → Machine Recommendation → Human / Rule Approval → Machine Execution`

真正值得设计的是 **Authority Allocation（决策权分配）**。

### ② 为什么无人货机真正的优势可能不是"没有飞行员"，而是更容易接受动态调度？

有人航空运行存在 crew duty time、crew positioning、passenger
connections、fixed schedules、slot commitments
等约束。纯货运无人机队理论上可以少掉其中一部分。

如果空域系统能够提前预测机场拥堵、航路天气恶化和物流节点积压，无人货机的价值可能不只是
**Pilot Cost ↓**，而是：

> **Re-planning Freedom ↑**

这可能是一种比"省掉驾驶员工资"更大的无人化红利。

### ③ 为什么 ICAO 同时谈"空域协调"和"供应链韧性"很值得注意？

ICAO 最新亚太会议把 airspace coordination、airport
capacity、trajectory-based operations、AI in ATM 与 supply-chain
resilience 放进同一套区域行动框架。

对货运而言，它们都影响同一个结果：

> **Cargo 能否在承诺时间内可靠到达。**

因此飞机的 Reliability 不应该只定义为 **Aircraft Dispatch
Reliability**，还可以向外扩展为 **Mission Delivery
Reliability（任务交付可靠性）**。

## 03｜Deep Dive · Predictive Mission Autonomy

### Fact

FAA 的 SMART 已进入 limited operational mode。官方公开信息显示，它集中约
200 条数据流，包括 weather patterns、flight paths、traffic
flow、controller staffing metrics，并用 AI-supported engine
形成空域容量、航迹和潜在冲突的综合视图。

FAA 表示系统的目标是从 **Reactive Airspace Management** 转向
**Predictive Airspace
Management**，预测窗口可扩展到数小时、数天甚至数周。与此同时，ICAO
亚太国家正在推进 trajectory-based operations 与 AI-assisted ATM。

> **事实边界：** SMART
> 当前是地面决策支持工具，并不自动控制飞机；下面关于无人货机的推导属于项目分析与设计假设。

### Need

传统飞行管理系统主要解决：

> **How do I fly the planned mission efficiently and safely?**

大型无人货运网络真正关心的则可能是：

> **Which mission should this aircraft execute now, given the future
> state of the network?**

假设 Aircraft A 已准备好，但系统预测 Airport B 高拥堵、Airport C
货运需求上升、Route B 对流天气恶化、Airport D
容量充足，那么飞机是否仍应机械执行 `A → B`，还是重新评估 `A → C`，甚至
`A → D → B`？

这已经不是 Flight Control，而是 **Mission-level Optimization**。

### Design Logic

**1｜从 Flight Plan 转向 Mission Intent**

传统输入是
`Origin + Destination + Route + Altitude`。未来可以增加更高层的
**Mission Intent（任务意图）**，例如：

`Deliver 8 t medical cargo to Region X before 18:00`

系统可以在约束允许时优化 destination airport、route、departure
time、intermediate stop 与 aircraft assignment。

飞机执行的不再是一条绝对固定路线，而是：

> **满足任务目标的一组允许解。**

**2｜建立 Network State Vector**

飞机不能只知道 Aircraft State，还需要知道 Network State：

`Weather / Airspace Capacity / Airport Capacity / Runway Availability / Cargo Demand / Ground Handling Status / Energy Availability / Maintenance Resources / Fleet Position / Remote Operator Workload`

于是：

> **Aircraft State + Network State → Mission Decision**

这可能是 Mission Autonomy 真正的数学入口。

**3｜把"延误"从外部事件变成设计变量**

传统总体设计重点优化 Payload / Range / Cruise Speed / Fuel / Field
Performance。但货运网络真正关心的是 **Delivered Cargo / Time**。

因此可以提出候选指标：

> **Effective Delivery Velocity｜有效交付速度**

不是 `Aircraft Distance / Flight Time`，而是：

`Cargo Origin-to-Destination Distance / Total Mission Time`

其中 Total Mission Time 包含
`Waiting + Loading + Taxi + Flight + Diversion + Unloading + Transfer`。

**4｜把无人化红利定义成"可重规划自由度"**

前几天提出的 **Autonomy Design Dividend** 可以增加一个新维度：

> **Re-planning Dividend（重规划红利）**

即无人化究竟减少了多少 crew constraint、schedule rigidity、repositioning
cost 与 coordination delay，从而允许飞机更自由地响应 Network State。

### Trade-off

  Predictive Mission Autonomy 得到什么   同时付出什么
  -------------------------------------- --------------------------------
  更高网络利用率                         更复杂的软件与优化系统
  动态避开拥堵                           任务可预测性下降
  更高 fleet utilization                 对数据质量依赖增强
  更强 disruption recovery               需要实时通信
  更少无效等待                           机场与客户必须接受动态变化
  更高 delivery reliability              决策责任边界复杂
  网络级优化                             单架飞机可能接受局部"次优"方案

最值得注意的是：

> **Fleet-optimal ≠ Aircraft-optimal。**

为了让整个网络更高效，一架飞机可能需要多飞一点、少装一点、改去另一个机场或延后起飞。这对传统"单机性能最优"的飞机设计思维是一个重要挑战。

## 04｜Idea Explosion

1.  **如果空域能够提前预测拥堵，无人货机是否应该自动把预测延误纳入航线和目的地选择？**
2.  **我们的设计航程是否应该保留一部分 Network Re-routing
    Margin，而不仅是法规要求的 fuel reserve？**
3.  **如果一个小机场虽然跑道较短，却几乎没有拥堵，它是否可能比大型枢纽具有更高的货运网络价值？**
4.  **能否建立 Effective Delivery Velocity，而不是只比较 Cruise
    Speed？**
5.  **如果无人化最大的运营红利之一是 Re-planning
    Freedom，我们应该怎样量化它？**
6.  **Mission Intent 能否替代部分固定 Flight
    Plan，让系统自己寻找满足时间、成本和安全约束的方案？**
7.  **如果网络级最优要求某架飞机接受局部次优，谁有权改变它原来的任务？Aircraft、Fleet
    Manager、Remote Operator 还是 ATM？**
8.  **通信中断以后，飞机应该继续执行最后一个计划，还是切换到预先认证的
    conservative mission policy？**
9.  **如果预测系统本身判断错误，怎样避免整个无人机队同时作出同方向的错误重规划？**
10. **我们是否应该把"对外部实时数据的依赖程度"作为无人货机构型与运行方案的一个设计指标？**

## 05｜Inspiration Card · Network-Aware Aircraft

**今天看到的东西**\
FAA 已经开始用 SMART 把约 200
条数据流融合起来，从"发生拥堵以后处理"转向提前预测空域状态；ICAO
亚太框架同时推进 trajectory-based operations、AI in ATM 和跨境协调。

**一句话事实**\
未来飞机面对的空域环境，可能越来越不是一个静态约束，而是一个持续更新、可预测的数字系统。

**最意外的地方**\
无人货机最有价值的"智能"可能并不是自己操纵飞机，而是：

> **知道什么时候原来的任务已经不再是最优任务。**

**它解决的问题**\
让飞机从固定航线执行器变成能够响应空域、机场、物流和机队状态变化的网络节点。

**核心设计逻辑**\
`Aircraft State + Network Prediction + Mission Intent → Re-optimization → Approved Decision → Execution`

**Trade-off**\
更强的网络适应性意味着更强的数据、通信、软件和认证依赖，也可能降低单次任务的确定性。

**产生的问题**\
网络信息应该进入飞机到什么程度？哪些决策可以自动改变？预测错误如何隔离？失联时如何优雅降级？

**对大型固定翼无人货运飞机项目的潜在启发**\
建议未来在需求树中增加候选分支
`Mission & Network Awareness`。它不意味着现在就开发复杂
AI，而是提醒我们：**飞机总体设计应该为未来的网络级自主留出信息接口和决策接口。**

**状态**\
`🔍 Explore → Insight Candidate`

## 06｜Project Translation · 项目转化

  ----------------------------------------------------------------------------------------------------------
  维度                    今天可能产生的影响                                         强度
  ----------------------- ---------------------------------------------------------- -----------------------
  **需求**                候选增加 Network Awareness、Mission Re-planning、data      **非常高**
                          interface                                                  

  **场景**                加入机场拥堵、天气变化、节点关闭、航路容量下降等动态场景   **非常高**

  **构型**                对气动外形直接影响有限，但可能影响航程余度、通信 /         **中**
                          航电架构                                                   

  **机场运行**            小机场的低拥堵可能成为新的网络优势                         **高**

  **无人化**              Flight Autonomy → Predictive Mission Autonomy              **非常高**

  **物流网络**            飞机开始成为可动态调度的网络资源                           **非常高**

  **适航**                自动重规划的                                               **很高**
                          authority、数据可信度、失联策略需要明确保证边界            

  **商业模式**            高利用率与 disruption recovery                             **很高**
                          可能成为无人机队的重要经济来源                             
  ----------------------------------------------------------------------------------------------------------

### 候选需求树分支

`Mission & Network Awareness → Network State Acquisition / Airspace-Weather Prediction Interface / Airport State Awareness / Mission Re-planning / Fleet Coordination / Decision Authority Management / Data Confidence / Degraded-Lost-link Policy`

这里仍应标记为 **Candidate Requirements / Architecture
Hypothesis**，而不是直接冻结成正式系统需求。

真正值得下一步验证的问题是：

> **在大型固定翼货运场景中，动态重规划究竟能够创造多少真实经济收益？**

如果收益很小，它只是漂亮的软件功能；如果收益足够大，它就可能反过来影响航程、备份机场策略、通信系统、远程运行中心，甚至整个物流网络设计。

## 07｜今日一句洞察

> **未来无人货机的"自主"，可能不是让一架飞机独立完成一个固定任务，而是让整个机队持续理解：在不断变化的航空网络里，此刻最值得执行的任务是什么。**

> **The aircraft should not only know how to fly the mission. It should
> know when the mission itself should change.**

## 值得以后回看的 3 个关键词

`Predictive Mission Autonomy` --- **预测式任务自主**

`Re-planning Dividend` --- **重规划红利**

`Effective Delivery Velocity` --- **有效交付速度**

## Sources

-   FAA --- *Strategic Management of Airspace, Routes and Trajectories
    (SMART)*, 2026-09-21.
    https://www.faa.gov/newsroom/trumps-transportation-secretary-sean-p-duffy-delivers-state-art-air-traffic-control
-   FAA --- *Federal eVTOL Pilot Program Launch in North Carolina*,
    2026-09-23.
    https://www.faa.gov/newsroom/trumps-transportation-secretary-sean-p-duffy-celebrates-launch-federal-evtol-pilot-0
-   ICAO --- *Asia-Pacific aviation leaders agree on landmark measures
    to improve safety, sustainability and accountability*, 2026-09-25.
    https://www.icao.int/news/asia-pacific-aviation-leaders-agree-landmark-measures-improve-safety-sustainability-and
-   EASA --- *Opinion No 06/2026 --- Regular update of Regulations (EU)
    2019/947 and (EU) 2019/945 --- Security*, 2026-09-18.
    https://www.easa.europa.eu/en/document-library/opinions/opinion-no-062026
-   FAA --- *NOTAM Management Service*.
    https://www.faa.gov/about/initiatives/notam
