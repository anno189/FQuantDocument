---
title: Circuit Breaker 模块 - 案例研究
description: Circuit Breaker 熔断器实际案例分析与经验总结
tag:
  - fqbase
  - circuit_breaker
---

# Circuit Breaker 模块 - 案例研究

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → **[案例研究](./case-studies.md)** → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → **[案例研究](./case-studies.md)** → [决策指南](./decision-guide.md) → [数据流](./data-flow.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |


## 概述

本文档通过实际案例分析，帮助理解 Circuit Breaker 熔断器的应用场景和效果。

## 案例 1: 第三方支付 API 保护

### 背景

某电商系统调用第三方支付渠道 API，高峰期经常出现响应超时，导致整个交易流程卡顿。

### 挑战

- 第三方支付 API 响应不稳定
- 超时导致线程阻塞
- 大量超时请求堆积，引发系统雪崩

### 解决方案

```python
from FQBase.Foundation import circuit_breaker, CircuitBreakerOpenException

@circuit_breaker(
    name="payment_api",
    failure_threshold=10,     # 较高阈值，支付很重要
    success_threshold=3,      # 需要多次成功才信任
    recovery_timeout=120,     # 较长恢复时间
    excluded_exceptions=(     # 排除可忽略异常
        requests.exceptions.Timeout,
        requests.exceptions.ConnectionError
    )
)
def call_payment_channel(order):
    return payment_client.create_order(order)
```

### 实现

```python
def process_payment(order_id, amount):
    """带熔断保护的支付处理"""
    try:
        result = call_payment_channel({
            'order_id': order_id,
            'amount': amount
        })
        return {'status': 'success', 'result': result}
    except CircuitBreakerOpenException:
        # 降级：使用备用支付渠道
        return process_with_backup_channel(order_id, amount)
    except PaymentException as e:
        # 其他支付异常
        return {'status': 'failed', 'error': str(e)}
```

### 结果

| 指标 | 改善前 | 改善后 |
|------|--------|--------|
| 平均响应时间 | 15s | 200ms |
| 错误率 | 35% | < 1% |
| 系统可用性 | 85% | 99.9% |
| 支付成功率 | 65% | 99% |

### 经验教训

1. 阈值要根据业务重要性灵活调整
2. 必须配合降级逻辑使用
3. 排除可恢复的临时性异常

---

## 案例 2: 微服务调用保护

### 背景

订单服务依赖用户服务获取用户信息，用户服务偶尔不可用导致订单创建失败。

### 挑战

- 用户服务不可用时，订单服务也随之失败
- 缺乏容错机制
- 用户投诉订单创建失败

### 解决方案

```python
from FQBase.Foundation import CircuitBreaker, CircuitBreakerOpenException

user_breaker = CircuitBreaker(
    name="user_service",
    failure_threshold=5,      # 较低阈值，快速熔断
    success_threshold=1,      # 一次成功即恢复
    recovery_timeout=30,      # 较短恢复时间
)

def get_user_info(user_id):
    """带熔断的用户信息获取"""
    try:
        return user_breaker.call(user_client.get, user_id)
    except CircuitBreakerOpenException:
        # 降级：返回脱敏的默认信息
        return {'user_id': user_id, 'name': '未知用户', 'vip': False}
    except Exception:
        return {'user_id': user_id, 'name': '未知用户', 'vip': False}
```

### 实现

```python
def create_order(user_id, items):
    user_info = get_user_info(user_id)
    
    order = {
        'user_id': user_id,
        'user_name': user_info['name'],
        'items': items,
        'created_at': now()
    }
    
    return order_service.create(order)
```

### 结果

| 指标 | 改善前 | 改善后 |
|------|--------|--------|
| 订单创建成功率 | 70% | 99.5% |
| 用户服务依赖错误 | 30% | < 1% |
| 平均响应时间 | 800ms | 150ms |

### 经验教训

1. 微服务间调用必须使用熔断
2. 降级数据要保证业务可用
3. 监控熔断状态很重要

---

## 案例 3: 数据库连接池保护

### 背景

促销活动期间，数据库连接池耗尽，所有请求都等待连接，导致服务不可用。

### 挑战

- 高并发导致连接池耗尽
- 请求堆积，线程阻塞
- 数据库 CPU 100%

### 解决方案

```python
from FQBase.Foundation import CircuitBreaker

db_breaker = CircuitBreaker(
    name="db_primary",
    failure_threshold=20,     # 较高阈值
    success_threshold=5,
    recovery_timeout=60,
    excluded_exceptions=(     # 排除轻量级异常
        OperationalError,
    )
)

def execute_query(sql, *args):
    try:
        return db_breaker.call(
            lambda: db_pool.execute(sql, *args)
        )
    except CircuitBreakerOpenException:
        # 降级：查询只读副本
        return read_replica.execute(sql, *args)
    except OperationalError:
        # 数据库操作错误
        raise
```

### 结果

| 指标 | 改善前 | 改善后 |
|------|--------|--------|
| 服务可用性 | 50% | 99% |
| 数据库连接等待 | 30s | < 1s |
| 错误率 | 45% | < 2% |

### 经验教训

1. 数据库连接池也要保护
2. 配合读写分离效果更好
3. 及时监控连接池状态

---

## 相关文档

- [设计模式](./patterns.md)
- [技术权衡](./tradeoff.md)
- [决策指南](./decision-guide.md)
- [数据流](./data-flow.md)
