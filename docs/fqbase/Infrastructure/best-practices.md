---
title: Infrastructure - 最佳实践
description: Infrastructure 使用最佳实践
tag:
  - fquant
  - fqbase
  - infrastructure

summary:
  purpose: best-practices
---

# Infrastructure - 最佳实践

## 阅读路径

🔵🟡 **开发者+运维**：README → best-practices → configuration

## 日志最佳实践

### ✅ 推荐做法

1. **使用模块级 logger**
   ```python
   from FQBase.Infrastructure import get_logger

   logger = get_logger(__name__)
   ```

2. **初始化日志系统**
   ```python
   from FQBase.Infrastructure import init_logging

   init_logging()
   ```

## 单例最佳实践

### ✅ 推荐做法

1. **使用装饰器创建单例**
   ```python
   @singleton
   class MyService:
       pass
   ```

2. **测试时重置单例**
   ```python
   SingletonMeta.reset_singleton()
   ```

### ❌ 避免做法

1. **不要在多进程环境下直接使用单例**
   - 进程间不共享内存

## 重试最佳实践

### ✅ 推荐做法

1. **指定重试异常类型**
   ```python
   @retry(retry_on_exception=(ConnectionError, TimeoutError))
   def call_api():
       pass
   ```

2. **设置最大总等待时间**
   ```python
   @retry(max_total_wait=30.0)
   def call_api():
       pass
   ```

## 熔断器最佳实践

### ✅ 推荐做法

1. **合理设置阈值**
   ```python
   @circuit_breaker(failure_threshold=5, recovery_timeout=60)
   def call_api():
       pass
   ```

2. **监控熔断器状态**
   ```python
   breaker = CircuitBreaker(name='api')
   print(breaker.metrics.state)
   ```

## 依赖注入最佳实践

### ✅ 推荐做法

1. **面向接口编程**
   ```python
   container.register_singleton(ICache, RedisCache)
   cache = container.get(ICache)
   ```

## 相关文档

- [使用指南](./usage.md)
- [配置指南](./configuration.md)
