---
title: "好用skill分享1"
description: "系统拆解gc-minimal-zine-poster-v0-3、pixel-style-poster-skill、photo-abstract-editorial、scenes-gathered-zine-v1-3四个视觉创作 Skill"
date: 2026-09-28
tags:
  - Skills
draft: false
featured: false
---


# 好用skill分享1

> AI时代真正重要的不只是会使用模型，而是理解如何组合 Skill
> 构建创造系统。

## 总览

  -----------------------------------------------------------------------------------
  Skill                          定位                    核心价值
  ------------------------------ ----------------------- ----------------------------
  gc-minimal-zine-poster-v0-3    极简纸感 editorial      将概念压缩成高级视觉语言
                                 poster                  

  pixel-style-poster-skill       bitmap editorial poster 生成细腻位图与印刷感设计

  photo-abstract-editorial       摄影抽象编辑            将照片转化为记忆化编辑作品

  scenes-gathered-zine-v1-3      场景纸刊                保留真实场景关系并重新编排

  scene-distillation-zine-v1-3   场景蒸馏                从照片提取情绪并重新创作
  -----------------------------------------------------------------------------------

# 1. gc-minimal-zine-poster-v0-3

## 定位

这是一个将主题、句子、文章想法、照片或参考图转化为极简 zine 海报的
Skill。

核心思想：

> 不是增加元素，而是压缩视觉信息。

## 工作流程

输入： 主题 / 文章 / 图片

↓

分析： 主体、情绪、视觉锚点、纸感、排版

↓

输出： 海报、Prompt、视觉规则

## 使用方法

安装：

``` bash
git clone https://github.com/LiamGvchi/gc-minimal-zine-poster.git ~/.codex/skills/gc-minimal-zine-poster-v0-3
```

调用：

``` text
Use $gc-minimal-zine-poster-v0-3 to make a poster about a rainy secondhand bookstore.
```

适合：

-   Blog封面
-   项目概念图
-   研究主题视觉化

# 2. pixel-style-poster-skill

## 定位

不是传统游戏像素风，而是 bitmap editorial poster。

核心元素：

-   点阵主体
-   halftone 印刷感
-   微文字
-   克制色彩

## 使用方法

安装：

``` bash
git clone https://github.com/v92388375-gif/pixel-style-poster-skill.git ~/.codex/skills/pixel-style-poster-skill
```

调用：

``` text
用 $pixel-style-poster-skill 做一张薄荷绿主题的百合花海报，小字和夜晚、宁静、露水有关
```

适合：

-   实验海报
-   植物主题
-   系列视觉设计

# 3. photo-abstract-editorial

## 定位

将照片转化为：

原始摄影区域 + 抽象记忆面板 + 诗意标题

它不是滤镜，也不是简单风格迁移。

核心原则：

> 照片提供事实，抽象面板提供解释。

## 使用方法

准备照片，然后：

``` text
使用 photo-abstract-editorial 将这张照片制作成摄影与抽象面板组合的编辑作品。
```

可调整：

-   图片与面板比例
-   色彩
-   抽象形式
-   标题风格
-   抽象程度

# 4. scenes-gathered-zine-v1-3

## 定位

场景阅读式 zine Skill。

流程：

照片

↓

观察现场

↓

提取关系

↓

重新编排

↓

纸刊作品

适合：

-   旅行照片
-   建筑照片
-   研究现场记录

调用：

``` text
用 $scenes-gathered-zine-v1-3 把这张照片做成一张拾景纸刊海报。
保留人物与空间关系。
```

# 5. scene-distillation-zine-v1-3

## 定位

与 gathered scenes 相反：

不保存照片本身，而保存照片背后的意义。

适合：

-   情绪表达
-   概念视觉
-   世界观设计

调用：

``` text
用 $scene-distillation-zine-v1-3 重新创作这张照片。
不要保留照片本身，让作品表达“靠近与错过”。
```

# Workflow组合

## 内容创作流程

GPT

↓

生成文章主题

↓

视觉 Skill

↓

封面图

↓

Miniblog

## 摄影流程

照片

↓

photo-abstract-editorial

↓

gathered scenes

↓

博客专题

## 高级创作系统

研究内容

↓

GPT分析核心概念

↓

选择 Skill

↓

生成视觉资产

↓

网站展示

# 与个人能力体系结合

## AI学习

训练：

-   Prompt设计
-   抽象能力
-   工作流设计

## Agent能力

Skill不是工具，而是节点：

输入

↓

Skill

↓

输出

↓

下一个Skill

## 航空研究

可以用于：

-   概念飞机视觉表达
-   研究报告封面
-   无人货运未来场景展示

# 最终 Skill Card

  Skill                      最佳用途
  -------------------------- ----------------
  gc-minimal-zine-poster     高级概念海报
  pixel-style-poster         位图实验视觉
  photo-abstract-editorial   摄影编辑作品
  scenes-gathered-zine       真实场景叙事
  scene-distillation-zine    情绪与概念重构

------------------------------------------------------------------------

核心思想：

> 未来创造者的能力，不是拥有最多工具，而是能够理解工具、组合工具，并设计自己的创造
> Workflow。
