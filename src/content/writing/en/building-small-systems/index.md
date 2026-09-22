---
title: "Building Small Systems"
description: "Complexity is a cost. Spend it only where people can feel the return."
date: 2026-09-16
tags:
  - Engineering
---

Small systems are not systems with fewer ambitions. They are systems where every moving part can explain why it exists.

## Complexity has carrying costs

Every dependency, abstraction, and configuration file asks for attention. The cost is rarely obvious on the day it is introduced. It appears later, when someone must update it, debug it, or decide whether it is still needed.

This does not mean complexity is always bad. It means complexity should purchase something valuable:

- a better experience;
- a safer constraint;
- a meaningful reduction in repeated work;
- or a capability that cannot be expressed simply.

## Quality is a constraint too

The opposite mistake is treating deletion as the only measure of elegance. A product can have very little code and still feel careless.

| Question | Useful test |
| --- | --- |
| Does it improve the experience? | Keep considering it. |
| Can it be simpler without losing quality? | Simplify it. |
| Does simplification make it crude? | Stop simplifying. |

The best result sits between a complexity budget and a quality floor.

> The goal is not the smallest implementation. It is the smallest implementation that fully carries the idea.

## Make the system legible

A system becomes easier to own when its structure matches its purpose. Put content where writers expect content. Put visual rules where designers expect visual rules. Prefer names that describe the product rather than the framework.

Clarity compounds. It makes the next decision less expensive.
