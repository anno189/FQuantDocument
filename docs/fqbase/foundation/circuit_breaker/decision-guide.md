---
title: Circuit Breaker 模块 - 决策指南
description: Circuit Breaker 熔断器技术选型决策指南
tag:
  - fqbase
  - circuit_breaker
---

# Circuit Breaker 模块 - 决策指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → **[决策指南](./decision-guide.md)** → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → **[决策指南](./decision-guide.md)** → [数据流](./data-flow.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |


## 概述

本文档帮助架构师判断何时使用 Circuit Breaker 熔断器以及如何选择合适的配置。

## 决策树

```
需要使用熔断器吗？
    │
    ├── 调用外部服务/第三方API？
    │       │
    │       ├── 是 ──▶ 继续
    │       │
    │       └── 否 ──▶ 可能不需要
    │
    ├── 服务可能失败/不稳定？
    │       │
    │       ├── 是 ──▶ 强烈推荐使用
    │       │
    │       └── 否 ──▶ 考虑其他方案
    │
    └── 需要高可用性？
            │
            ├── 是 ──▶ 必须使用
            │
            └── 否 ──▶ 可选
```

## 场景 1: 外部 API 调用

### 问题

调用第三方支付/用户 API，第三方服务可能不稳定

### 选项

| 选项 | 优点 | 缺点 |
|------|------|------|
| 无保护 | 简单 | 级联故障风险 |
| 重试 | 简单重试 | 放大故障 |
| 超时 | 简单 | 不够灵活 |
| **熔断器** | 快速失败 | 需要配置 |

### 决策

**推荐使用熔断器**

```python
@circuit_breaker(name="payment_api", failure_threshold=5)
def call_payment(order_id):
    return payment_service.process(order_id)
```

## 场景 2: 微服务间调用

### 问题

微服务架构中，服务 A 调用服务 B，服务 B 可能不可用

### 选项

| 选项 | 优点 | 缺点 |
|------|------|------|
| 无保护 | 简单 | 故障扩散 |
| 服务降级 | 保障可用 | 数据可能过期 |
| **熔断器** | 快速失败 | 需要实现降级 |

### 决策

**推荐使用熔断器 + 降级**

```python
@circuit_breaker(name="user_service", failure_threshold=3)
def get_user(user_id):
    return user_service.get(user_id)

# 调用方
def get_user_with_fallback(user_id):
    try:
        return get_user(user_id)
    except CircuitBreakerOpenException:
        return get_cached_user(user_id)
```

## 场景 3: 数据库访问

### 问题

主数据库连接池耗尽导致服务不可用

### 选项

| 选项 | 优点 | 缺点 |
|------|------|------|
| 增加连接池 | 简单 | 有上限 |
| 读写分离 | 缓解压力 | 延迟 |
| **熔断器** | 快速失败 | 需要备用 |

### 决策

**推荐使用熔断器 + 读写分离**

```python
db_breaker = CircuitBreaker(name="db_master", failure_threshold=10)

def query(sql):
    try:
        return db_breaker.call(lambda: master_db.execute(sql))
    except CircuitBreakerOpenException:
        return read_replica.execute(sql)
```

## 反模式警示

### 错误示例

**没有降级逻辑的熔断器**

```python
@circuit_breaker(failure_threshold=3)
def call_api():
    return api.request()

# 熔断打开后直接抛异常，没有任何处理
result = call_api()  # 可能抛出 CircuitBreakerOpenException
```

### 正确做法

```python
def robust_call():
    try:
        return call_api()
    except CircuitBreakerOpenException:
        # 必须有降级逻辑
        return fallback_data()
```

## 决策检查清单

在决定使用熔断器前，请检查：

- [ ] 是否调用外部服务/第三方 API？
- [ ] 服务是否有失败的可能？
- [ ] 系统是否需要高可用性？
- [ ] 是否有降级逻辑实现？
- [ ] 阈值是否根据服务特性设置？
- [ ] 是否有熔断器监控？

如果以上大部分是"是"，熔断器是一个好选择。

## 相关文档

- [技术架构](./architecture.md)
- [设计模式](./patterns.md)
- [技术权衡](./tradeoff.md)
- [案例研究](./case-studies.md)
- [数据流](./data-flow.md)
