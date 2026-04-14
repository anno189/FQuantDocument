---
title: Cache - 决策指南
description: Cache 模块技术选型决策指南
tag:
  - fqbase
  - cache
---

# Cache - 决策指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → **[决策指南](./decision-guide.md)** → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → **[决策指南](./decision-guide.md)** → [数据流](./data-flow.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |

## 概述

本指南帮助架构师判断何时使用 Cache 模块以及如何选择缓存实现。

## 决策树

```
需要缓存?
    │
    ├── 是否跨多进程/实例共享?
    │   ├── YES → RedisCacheAdapter
    │   └── NO
    │       │
    │       是否需要 TTL?
    │       ├── YES → @local_cache
    │       └── NO
    │           │
    │           高频调用?
    │           ├── YES → @lru_cache (Python内置)
    │           └── NO → @local_cache
```

## 场景 1: Web 应用缓存

### 问题

Web 应用需要缓存用户会话和查询结果。

### 选项

| 选项 | 优点 | 缺点 |
|------|------|------|
| 本地缓存 | 速度快 | 无法跨进程 |
| Redis | 跨进程共享 | 需要额外服务 |

### 决策

**推荐：Redis 缓存**
- 用户会话需要跨进程共享
- 查询结果需要分布式缓存

---

## 场景 2: 定时任务结果缓存

### 问题

定时任务需要缓存计算结果。

### 决策

**推荐：Redis 缓存**
- 定时任务可能多实例运行
- 结果需要跨实例共享

---

## 反模式警示

### 错误示例

使用本地缓存用于跨进程共享场景。

```python
# 错误：多进程环境下使用本地缓存
@local_cache
def get_data():
    return fetch_data()
```

### 正确做法

```python
# 正确：跨进程使用 Redis 缓存
@redis_cache
def get_data():
    return fetch_data()
```

---

## 决策检查清单

在决定使用缓存前，请检查：

- [ ] 是否需要缓存？（性能瓶颈在哪里）
- [ ] 是否需要跨进程共享？
- [ ] 数据更新频率是多少？
- [ ] 缓存多大合适？

---

## 相关文档

- [技术架构](./architecture.md)
- [设计模式](./patterns.md)
- [技术权衡](./tradeoff.md)
- [案例研究](./case-studies.md)
- [数据流](./data-flow.md)
