---
title: Cache - 术语表
description: Cache 模块术语定义与解释
tag:
  - fqbase
  - cache
---

# Cache - 术语表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[术语表](./glossary.md)** → [核心概念](./concepts.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) |

## 概述

本术语表定义 Cache 模块中使用的关键术语。

## 术语

### 缓存（Cache）

**定义：** 临时存储数据的技术，用于加速数据访问。

**示例：**
```python
cache.set('key', 'value')
value = cache.get('key')
```

### 缓存命中（Cache Hit）

**定义：** 请求的数据在缓存中存在。

**示例：**
```python
cache.set('key', 'value')
value = cache.get('key')  # 缓存命中
```

### 缓存未命中（Cache Miss）

**定义：** 请求的数据在缓存中不存在。

**示例：**
```python
value = cache.get('nonexistent')  # 缓存未命中，返回 None
```

### 命中率（Hit Rate）

**定义：** 缓存命中次数与总请求次数的比率。

**公式：** hit_rate = hits / (hits + misses)

### 驱逐（Eviction）

**定义：** 当缓存满时，移除旧条目以容纳新条目的过程。

### LRU（Least Recently Used）

**定义：** 最近最少使用驱逐策略。

### FIFO（First In First Out）

**定义：** 先进先出驱逐策略。

### TTL（Time To Live）

**定义：** 缓存条目的生存时间。

### 序列化（Serialization）

**定义：** 将对象转换为可存储格式的过程。

### 前缀（Prefix）

**定义：** 添加到缓存键前的字符串，用于隔离不同业务。

---

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
