---
title: Circuit Breaker 模块 - 案例库
description: Circuit Breaker 熔断器实际应用场景与示例
tag:
  - fqbase
  - circuit_breaker
---

# Circuit Breaker 模块 - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → [使用指南](./usage.md) → **[案例库](./examples.md)** |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) |


## 概述

本文档展示 Circuit Breaker 熔断器的实际应用场景，重点介绍与 FQuant 其他模块的组合使用。

## 基础示例

### 示例 1：API 调用熔断保护

**场景描述：** 调用第三方支付 API，当服务不稳定时使用缓存数据

**代码实现：**

```python
from FQBase.Foundation import circuit_breaker, CircuitBreakerOpenException

# 装饰器方式
@circuit_breaker(name="payment_api", failure_threshold=3, recovery_timeout=30)
def call_payment_api(order_id):
    return payment_service.process(order_id)

def process_order(order_id):
    try:
        # 尝试调用支付 API
        result = call_payment_api(order_id)
        return {"status": "success", "data": result}
    except CircuitBreakerOpenException:
        # 熔断器打开，返回缓存数据
        cache_data = get_order_from_cache(order_id)
        return {"status": "degraded", "data": cache_data, "source": "cache"}
```

**适用场景：**
- 第三方 API 调用
- 外部服务集成

---

### 示例 2：数据库连接池熔断

**场景描述：** 当数据库连接池耗尽时快速失败

**代码实现：**

```python
from FQBase.Foundation import CircuitBreaker

# 手动管理方式
db_breaker = CircuitBreaker(
    name="db_connection",
    failure_threshold=10,
    success_threshold=3,
    recovery_timeout=60
)

def execute_query(sql):
    try:
        return db_breaker.call(db_pool.execute, sql)
    except CircuitBreakerOpenException:
        # 返回降级响应
        return {"error": "服务繁忙", "code": "DB_CIRCUIT_OPEN"}
```

**适用场景：**
- 数据库连接池保护
- 关键数据源保护

---

### 示例 3：异步服务调用

**场景描述：** 异步调用远程服务，支持自动熔断

**代码实现：**

```python
import asyncio
from FQBase.Foundation import circuit_breaker

@circuit_breaker(name="async_api", failure_threshold=5, recovery_timeout=60)
async def fetch_data_async(symbol):
    async with aiohttp.ClientSession() as session:
        async with session.get(f"/api/stock/{symbol}") as resp:
            return await resp.json()

async def get_stock_data(symbol):
    try:
        data = await fetch_data_async(symbol)
        return {"status": "ok", "data": data}
    except CircuitBreakerOpenException:
        # 降级到缓存
        return await get_cached_data(symbol)
```

**适用场景：**
- 异步 HTTP 请求
- 异步数据获取

---

## 跨模块集成示例

### 示例 4：熔断 + 重试组合

**场景描述：** 将熔断器与重试机制组合使用

**涉及模块：**
- [circuit_breaker](./) - 熔断保护
- [retry](../retry/) - 重试机制

**代码实现：**

```python
from FQBase.Foundation import circuit_breaker, CircuitBreakerOpenException
from FQBase.Foundation import retry, RetryExhaustedException

@circuit_breaker(name="reliable_api", failure_threshold=3)
@retry(max_attempts=3, delay=1, backoff=2)
def call_api_with_retry(params):
    return api.request(params)

def robust_call(params):
    """组合熔断和重试的可靠调用"""
    try:
        return call_api_with_retry(params)
    except CircuitBreakerOpenException:
        # 熔断器打开，不重试
        return fallback_response()
    except RetryExhaustedException:
        # 重试耗尽，可能触发熔断
        return fallback_response()
```

**适用场景：**
- 高可靠性要求
- 需要两层保护

---

### 示例 5：熔断 + 日志监控

**场景描述：** 熔断状态变更时记录日志并发送通知

**涉及模块：**
- [circuit_breaker](./) - 熔断保护
- [logger](../logger/) - 日志记录
- [notification](../notification/) - 通知推送

**代码实现：**

```python
from FQBase.Foundation import CircuitBreaker
from FQBase.Core import get_logger
from FQBase.Foundation import NotificationManager

logger = get_logger(__name__)
notifier = NotificationManager()

def on_state_change(breaker):
    """状态变更回调"""
    logger.warning(f"Circuit breaker '{breaker.name}' state changed to {breaker.state}")
    
    if breaker.state == CircuitState.OPEN:
        notifier.send(
            f"熔断器 {breaker.name} 已打开",
            channel="ALARM"
        )

breaker = CircuitBreaker(
    name="critical_api",
    on_state_change=on_state_change,
    failure_threshold=5
)
```

**适用场景：**
- 关键服务监控
- 实时告警

---

### 示例 6：多服务熔断管理

**场景描述：** 管理多个服务的熔断器，统一监控

**涉及模块：**
- [circuit_breaker](./) - 熔断器
- [singleton](../singleton/) - 单例模式

**代码实现：**

```python
from FQBase.Foundation import CircuitBreakerManager

manager = CircuitBreakerManager()

# 注册多个服务的熔断器
manager.register("user_service", failure_threshold=5, recovery_timeout=30)
manager.register("order_service", failure_threshold=3, recovery_timeout=60)
manager.register("payment_service", failure_threshold=10, recovery_timeout=120)

def get_all_service_status():
    """获取所有服务状态"""
    all_status = manager.get_all_status()
    
    for name, status in all_status.items():
        print(f"服务 {name}: {status['state']}")
        print(f"  - 成功率: {status['metrics']['success_rate']}")
        print(f"  - 连续失败: {status['metrics']['consecutive_failures']}")
    
    return all_status

def reset_all_circuits():
    """重置所有熔断器"""
    manager.reset_all()
```

**适用场景：**
- 微服务监控
- 统一熔断管理

---

### 示例 7：上下文管理器方式

**场景描述：** 使用上下文管理器简化熔断逻辑

**代码实现：**

```python
from FQBase.Foundation import CircuitBreaker

def process_with_circuit(name, func, *args, **kwargs):
    """使用上下文管理器的通用处理函数"""
    with CircuitBreaker(name=name) as breaker:
        try:
            return breaker.call(func, *args, **kwargs)
        except CircuitBreakerOpenException:
            # 统一降级处理
            return {"error": "service_unavailable", "circuit": name}

# 使用示例
result = process_with_circuit("user_api", fetch_user, user_id=123)
```

**适用场景：**
- 简化代码
- 统一异常处理

---

## 最佳实践

1. **合理设置阈值** - 根据服务稳定性设置 failure_threshold
2. **做好降级逻辑** - 熔断打开时必须有备选方案
3. **监控状态变更** - 记录熔断器状态变化以便分析
4. **组合使用** - 熔断 + 重试 + 超时提供多层保护

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [集成指南](./integrations.md)
- [案例研究](./case-studies.md)
