---
title: Circuit Breaker 模块 - 数据流
description: Circuit Breaker 熔断器模块数据流动的详细说明
tag:
  - fqbase
  - circuit_breaker
---

# Circuit Breaker 模块 - 数据流

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → **[数据流](./data-flow.md)** |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → [决策指南](./decision-guide.md) → **[数据流](./data-flow.md)** → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |


## 概述

本文档详细介绍 Circuit Breaker 熔断器模块的数据流动过程。

## 数据流图

### 主数据流

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   客户端      │────►│  CircuitBreaker │────►│   目标函数       │
└──────────────┘     └─────────────────┘     └──────────────────┘
                            │
                            ▼
                    ┌─────────────────┐
                    │   状态判断       │
                    └─────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
       ┌──────────┐  ┌──────────┐  ┌──────────┐
       │  CLOSED  │  │   OPEN   │  │HALF_OPEN │
       └──────────┘  └──────────┘  └──────────┘
```

### 请求处理流程

```
请求进入
    │
    ▼
检查熔断器状态
    │
    ├─ CLOSED ──► 执行目标函数 ──► 记录成功 ──► 返回结果
    │
    ├─ OPEN ────► 记录拒绝 ──► 抛出异常 ──► 返回降级
    │
    └─ HALF_OPEN ──► 执行目标函数 ──► 记录结果 ──► 状态转换
```

## 关键数据流

### 数据流 1: 正常调用（CLOSED 状态）

```
客户端 ──call()──► CircuitBreaker.can_execute() ──► True
                                          │
                                          ▼
                                   func(*args, **kwargs)
                                          │
                              ┌────────────┼────────────┐
                              ▼            ▼            ▼
                         成功          异常(非排除)   异常(排除)
                              │            │            │
                              ▼            ▼            ▼
                      record_success()  record_failure()  不记录
                              │            │            │
                              └────────────┼────────────┘
                                           ▼
                                    更新指标
                                           │
                                           ▼
                                    返回结果/抛出异常
```

**代码路径：**

```python
def call(self, func, *args, **kwargs):
    if not self.can_execute():  # 状态检查
        self.record_rejection()
        raise CircuitBreakerOpenException(...)
    
    try:
        result = func(*args, **kwargs)  # 执行函数
        self.record_success()  # 记录成功
        return result
    except Exception as e:
        self.record_failure(e)  # 记录失败
        raise
```

### 数据流 2: 熔断打开（OPEN 状态）

```
客户端 ──call()──► CircuitBreaker.can_execute() ──► False
                                          │
                                          ▼
                                   record_rejection()
                                          │
                                          ▼
                                   CircuitBreakerOpenException
                                          │
                                          ▼
                                   返回降级响应
```

### 数据流 3: 状态恢复（HALF_OPEN 状态）

```
执行请求 ──成功──► record_success()
                            │
                            ▼
                    检查连续成功次数
                            │
                            ▼
              ┌─────────────┴─────────────┐
              ▼                           ▼
        >= success_threshold         < success_threshold
              │                           │
              ▼                           ▼
        _transition_to(CLOSED)      保持 HALF_OPEN
```

## 性能考虑

### 瓶颈点

| 阶段 | 潜在瓶颈 | 优化建议 |
|------|---------|---------|
| 状态检查 | 锁竞争 | 使用无锁数据结构 |
| 函数执行 | 外部调用超时 | 设置合理超时 |
| 指标更新 | 频繁写入 | 批量更新 |

### 优化策略

1. **减少锁粒度**
2. **异步指标更新**
3. **缓存状态副本**

## 相关文档

- [技术架构](./architecture.md)
- [设计模式](./patterns.md)
- [性能调优](./performance.md)
- [案例研究](./case-studies.md)
