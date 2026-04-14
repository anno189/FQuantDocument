---
title: 事件总线 - 数据流
description: 事件总线数据流动的详细说明
tag:
  - fqbase
  - event_bus
---

# 事件总线 - 数据流

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → **[数据流](./data-flow.md)** |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → [决策指南](./decision-guide.md) → **[数据流](./data-flow.md)** → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |


## 概述

本章节详细说明事件总线中的数据流动过程。

## 数据流图

```
┌──────────────────────────────────────────────────────────────────┐
│                        数据流总览                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐    │
│  │ 发布者  │────▶│ EventBus │────▶│ 订阅者  │     │ 历史    │    │
│  │         │     │         │     │         │     │         │    │
│  │ publish │     │ subscribe     │ handle  │     │ add     │    │
│  └─────────┘     └─────────┘     └─────────┘     └─────────┘    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## 关键数据流

### 数据流 1: 同步发布

```
发布者 
    │
    │ 1. 创建 Event 对象
    ▼
Event(event_type, data, timestamp)
    │
    │ 2. publish(event)
    ▼
EventBus.publish()
    │
    ├── 3. 添加到历史
    │       ▼
    │   EventHistory.add()
    │       │
    │       └──▶ 环形缓冲区存储
    │
    ├── 4. 查找类型订阅者
    │       ▼
    │   _subscribers[event_type]
    │       │
    │       └──▶ 按优先级排序
    │
    ├── 5. 查找全局订阅者
    │       ▼
    │   _global_subscribers
    │       │
    │       └──▶ 按优先级排序
    │
    │ 6. 遍历调用
    ▼
订阅者.callback(event)
    │
    │ 7. 执行处理函数
    ▼
处理完成
```

### 数据流 2: 异步发布 (publishAwait)

```
发布者
    │
    │ await bus.publishAwait(event)
    ▼
EventBus.publishAwait()
    │
    ├── 1. 添加到历史（同上）
    │
    ├── 2. 获取订阅者列表
    │
    ├── 3. 为每个订阅者创建协程任务
    │       │
    │       ├── 异步函数 ──▶ asyncio.create_task()
    │       │
    │       └── 同步函数 ──▶ loop.run_in_executor()
    │
    │ 4. asyncio.gather(*tasks)
    ▼
所有任务完成
```

### 数据流 3: 弱引用处理

```
订阅 (weak_ref=True)
    │
    ▼
_create_weak_callback(callback)
    │
    ├── 实例方法 ──▶ weakref.WeakMethod(callback)
    │
    └── 普通函数 ──▶ weakref.ref(callback)
    │
    ▼
Subscription(weak_info=(weak_ref, is_method))
    │
    │ 发布事件时
    ▼
_resolve_weak_callback(weak_ref, is_method)
    │
    ▼
callback = weak_ref()
    │
    ├── callback is None ──▶ 跳过（对象已销毁）
    │
    └── callback is not None ──▶ 调用回调
```

## 性能考虑

### 瓶颈点

| 阶段 | 潜在瓶颈 | 优化建议 |
|------|---------|---------|
| 事件添加 | 锁竞争 | 使用小事务 |
| 订阅查找 | 字典查找 | 事件类型少用全局 |
| 回调调用 | 耗时处理 | 使用异步发布 |

### 优化策略

1. **减少锁粒度**：快速获取/释放锁
2. **异步处理**：耗时操作用异步
3. **批量发布**：频繁事件考虑批量

## 相关文档

- [技术架构](./architecture.md)
- [设计模式](./patterns.md)
- [性能调优](./performance.md)
- [案例研究](./case-studies.md)
