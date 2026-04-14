---
title: Cache - 技术权衡
description: Cache 模块设计中的技术权衡分析
tag:
  - fqbase
  - cache
---

# Cache - 技术权衡

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → **[技术权衡](./tradeoff.md)** → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → [决策指南](./decision-guide.md) → [数据流](./data-flow.md) → [设计模式](./patterns.md) → **[技术权衡](./tradeoff.md) |

## 概述

本文档分析 Cache 模块设计中的技术权衡。

## 权衡 1: 本地缓存 vs Redis 缓存

### 考量因素

| 因素 | 本地缓存 | Redis 缓存 |
|------|---------|-----------|
| 延迟 | ~100ns | ~1-10ms |
| 复杂度 | 低 | 中 |
| 共享性 | 单进程 | 多进程 |
| 持久性 | 进程内存 | Redis 服务器 |

### 决策

根据场景选择：
- 单进程、低延迟 → 本地缓存
- 多进程共享 → Redis 缓存

---

## 权衡 2: LRU vs FIFO

### 考量因素

| 因素 | LRU | FIFO |
|------|-----|------|
| 实现复杂度 | 中 | 低 |
| 命中率 | 高 | 中 |
| 适用场景 | 热点数据 | 周期性数据 |

### 决策

- 热点数据使用 LRU
- 周期性数据使用 FIFO

---

## 权衡 3: pickle vs msgpack

### 考量因素

| 因素 | pickle | msgpack |
|------|--------|---------|
| 性能 | 较快 | 快 |
| 安全性 | 低（有风险） | 高 |
| 兼容性 | 仅 Python | 跨语言 |

### 决策

- 安全优先 → msgpack
- 性能优先 → pickle
- 需要兼容 → msgpack

---

## 相关文档

- [设计模式](./patterns.md)
- [决策指南](./decision-guide.md)
- [案例研究](./case-studies.md)
