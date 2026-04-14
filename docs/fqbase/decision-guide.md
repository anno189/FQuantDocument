---
title: FQBase - 决策指南
description: FQBase 技术选型决策指南
tag:
  - fqbase
---

# FQBase - 决策指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → **[决策指南](./decision-guide.md)** → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → **[决策指南](./decision-guide.md)** → [数据流](./data-flow.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |


## 概述

帮助架构师判断何时使用 FQBase 的各个组件。

## 决策树

```
需要使用 FQBase 吗？
    │
    ├── 需要事件驱动架构？
    │       │
    │       ├── 是 ──▶ 使用 EventBus
    │       │
    │       └── 否
    │
    ├── 需要日志系统？
    │       │
    │       ├── 是 ──▶ 使用 Logger
    │       │
    │       └── 否
    │
    ├── 需要通知服务？
    │       │
    │       ├── 是 ──▶ 使用 NotificationManager
    │       │
    │       └── 否
    │
    └── 需要数据验证？
            │
            ├── 是 ──▶ 使用 Validators
            │
            └── 否 ──▶ FQBase 不是必选
```

## 场景 1: 事件驱动架构

### 问题

需要在组件之间解耦通信？

### 选项

| 选项 | 优点 | 缺点 |
|------|------|------|
| 直接调用 | 简单直接 | 高耦合 |
| 消息队列 | 解耦强 | 需要额外基础设施 |
| EventBus | 解耦 + 轻量 | 同步调用有延迟 |

### 决策

如果：
- 组件在同一进程
- 需要轻量级解耦
- 不需要持久化消息

**推荐使用 EventBus**

## 场景 2: 重试策略

### 问题

需要处理不可靠的网络调用？

### 选项

| 选项 | 优点 | 缺点 |
|------|------|------|
| 手动重试 | 完全控制 | 代码冗余 |
| 循环重试 | 简单 | 不支持指数退避 |
| @retry 装饰器 | 支持退避 | 无法重试构造函数 |

### 决策

**推荐使用 @retry 装饰器**

## 场景 3: 熔断保护

### 问题

需要保护系统免受外部服务故障影响？

### 选项

| 选项 | 优点 | 缺点 |
|------|------|------|
| 超时控制 | 简单 | 无法防止雪崩 |
| 手动开关 | 完全控制 | 需要人工介入 |
| CircuitBreaker | 自动恢复 | 需要配置阈值 |

### 决策

**推荐使用 CircuitBreaker**

## 反模式警示

### 错误示例

```python
# 在循环中创建新的 EventBus
for i in range(100):
    eb = EventBus()  # 错误！每次创建新实例
    eb.subscribe(...)
```

### 正确做法

```python
# 使用单例
eb = get_event_bus()
for i in range(100):
    eb.subscribe(...)
```

## 决策检查清单

在决定使用 FQBase 组件前，请检查：

- [ ] 需要组件间通信 → EventBus
- [ ] 需要日志记录 → Logger
- [ ] 需要多渠道通知 → NotificationManager
- [ ] 需要数据验证 → Validators
- [ ] 需要重试机制 → @retry 装饰器
- [ ] 需要熔断保护 → CircuitBreaker

如果以上大部分是"是"，FQBase 是好选择。

## 相关文档

- [技术架构](./architecture.md)
- [设计模式](./patterns.md)
- [技术权衡](./tradeoff.md)
- [案例研究](./case-studies.md)
- [数据流](./data-flow.md)
