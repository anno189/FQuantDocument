---
title: Circuit Breaker 模块 - 变更日志
description: Circuit Breaker 熔断器模块版本历史与更新说明
tag:
  - fqbase
  - circuit_breaker
---

# Circuit Breaker 模块 - 变更日志

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 📖 索引 | [README](./README.md) → **[变更日志](./changelog.md)** |


## v1.0.0 (2024-01-15)

### 新增

- 首次发布 Circuit Breaker 熔断器模块
- 三态状态机实现（CLOSED / OPEN / HALF_OPEN）
- 失败计数与阈值判定机制
- 恢复超时自动状态转换
- 详细熔断器指标记录
- 线程安全实现
- `@circuit_breaker` 装饰器支持
- `CircuitBreakerManager` 单例管理器
- 同步与异步函数支持
- 上下文管理器支持
- 状态变更回调机制
- 排除异常配置
- 环境变量控制 (`FQ_CIRCUIT_BREAKER_DISABLED`)

### 核心类

| 类 | 说明 |
|------|------|
| `CircuitBreaker` | 熔断器核心类 |
| `CircuitBreakerManager` | 熔断器管理器（单例） |
| `CircuitBreakerMetrics` | 熔断器指标数据类 |
| `CircuitBreakerOpenException` | 熔断器打开异常 |
| `CircuitState` | 熔断器状态枚举 |

### 装饰器

```python
@circuit_breaker(name="api", failure_threshold=5, recovery_timeout=60)
def call_api():
    return api.request()
```

### 使用方式

- 装饰器方式（推荐）
- 上下文管理器方式
- 手动调用方式
- 管理器集中管理方式

## 相关文档

- [README](./README.md)
- [API参考](./api.md)
- [使用指南](./usage.md)
