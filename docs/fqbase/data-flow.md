---
title: FQBase - 数据流
description: FQBase 数据流动的详细说明
tag:
  - fqbase
---

# FQBase - 数据流

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → **[数据流](./data-flow.md)** |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → [决策指南](./decision-guide.md) → **[数据流](./data-flow.md)** → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |


## 概述

FQBase 数据流的详细说明。

## 数据流图

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   业务代码   │────►│  EventBus   │────►│  订阅者处理 │
└─────────────┘     └─────────────┘     └─────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  外部请求    │────►│  Validators │────►│  验证通过   │
└─────────────┘     └─────────────┘     └─────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  数据请求    │────►│   Cache     │────►│  缓存命中   │
└─────────────┘     └─────────────┘     └─────────────┘
         │               │
         │               ▼
         │         ┌─────────────┐
         └────────►│  外部 API   │────►│  缓存存储   │
                   └─────────────┘     └─────────────┘
```

## 关键数据流

### 数据流 1: 事件驱动流程

```
业务代码 → EventBus.publish() → 订阅者处理 → 日志/通知
```

**描述：** 业务代码产生事件，EventBus 分发给订阅者

**代码示例：**

```python
# 1. 业务代码发布事件
event_bus.publish(Event('trade', {'code': '000001', 'price': 12.5}))

# 2. EventBus 分发给订阅者
# 3. 订阅者处理（记录日志、发送通知）
```

### 数据流 2: 验证流程

```
用户输入 → validate_xxx() → 异常/通过
```

**描述：** 验证函数检查输入数据格式

**代码示例：**

```python
# 验证股票代码
validate_code('000001')  # 通过

validate_code('invalid')  # 抛出 ValidationError
```

### 数据流 3: 缓存流程

```
请求 → Cache.get() → 命中返回/未命中 → 外部API → Cache.set() → 返回
```

**描述：** 先从缓存获取，未命中再查询外部

**代码示例：**

```python
# 先从缓存获取
cached = cache.get(f"data:{key}")
if cached:
    return cached

# 缓存未命中，查询外部
data = external_api.get(key)

# 存入缓存
cache.set(f"data:{key}", data, ttl=300)
return data
```

### 数据流 4: 重试流程

```
请求 → 执行 → 失败 → 重试 → 成功/失败 → 最大重试
```

**描述：** 失败时自动重试指定次数

**代码示例：**

```python
@retry(max_attempts=3, delay=1)
def fetch_data():
    return api.get()  # 失败时自动重试
```

## 性能考虑

### 瓶颈点

| 阶段 | 潜在瓶颈 | 优化建议 |
|------|---------|---------|
| 事件分发 | 同步阻塞 | 使用异步分发 |
| 缓存未命中 | 外部API调用 | 增加缓存命中率 |
| 验证 | 正则匹配 | 预编译正则 |

### 优化策略

1. 使用缓存减少外部调用
2. 事件分发使用异步
3. 预编译验证正则表达式

## 相关文档

- [技术架构](./architecture.md)
- [设计模式](./patterns.md)
- [性能调优](./performance.md)
- [案例研究](./case-studies.md)
