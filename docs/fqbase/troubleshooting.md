---
title: FQBase - 故障排查
description: FQBase 常见问题与解决方案
tag:
  - fquant
  - fqbase

summary:
  purpose: troubleshooting
---

# FQBase - 故障排查

## 阅读路径

🟡🔵 **运维+开发者**：README → troubleshooting → configuration → best-practices

## 概述

本文档帮助您诊断和解决使用 FQBase 时的常见问题。

## 常见问题

### 问题 1: MongoDB 连接失败

**症状：**
- `MongoClient` 抛出 `ServerSelectionTimeoutError`
- 日志显示 `MongoDB connection failed`

**可能原因：**
- MongoDB 服务未启动
- 连接字符串错误
- 网络不可达
- 防火墙阻止

**解决方案：**

1. 检查 MongoDB 服务状态
```bash
systemctl status mongod  # Linux
brew services list | grep mongodb  # macOS
```

2. 验证连接字符串
```python
from FQBase.Config import SETTING
uri = SETTING.get_mongo()
print(f"Connecting to: {uri}")
```

3. 测试网络连接
```bash
nc -zv localhost 27017
```

### 问题 2: Redis 连接超时

**症状：**
- `CacheConnectionError` 异常
- 缓存操作卡住

**可能原因：**
- Redis 服务未启动
- 连接池耗尽
- 内存不足

**解决方案：**

1. 检查 Redis 状态
```bash
redis-cli ping
```

2. 配置连接池大小
```python
from FQBase.Cache import CacheConfig

config = CacheConfig(
    redis_host="localhost",
    redis_port=6379,
    redis_max_connections=50
)
```

### 问题 3: 熔断器触发

**症状：**
- `CircuitBreakerOpenException` 异常
- 某些操作快速失败

**可能原因：**
- 下游服务不可用
- 失败次数超过阈值
- 熔断器处于 open 状态

**解决方案：**

1. 检查下游服务状态
2. 等待恢复超时
3. 手动重置熔断器
```python
from FQBase.Infrastructure import CircuitBreakerManager

manager = CircuitBreakerManager()
breaker = manager.get("my_circuit")
breaker.reset()
```

### 问题 4: 单例实例未共享

**症状：**
- 不同地方获取到不同的单例实例

**可能原因：**
- 多进程环境下单例不跨进程
- 装饰器使用位置错误

**解决方案：**

1. 使用进程间共享存储（如 Redis）
```python
@ singleton
class SharedCache:
    def __init__(self):
        self.redis = create_redis_client()
```

2. 或使用单例元类
```python
from FQBase.Infrastructure import SingletonMeta

class MyClass(metaclass=SingletonMeta):
    pass
```

## 错误参考

| 代码 | 错误 | 描述 | 解决方案 |
|------|------|------|---------|
| E001 | MongoDBConnectionException | MongoDB 连接失败 | 检查服务状态和 URI |
| E002 | RedisConnectionException | Redis 连接失败 | 检查 Redis 服务 |
| E003 | CircuitBreakerOpenException | 熔断器打开 | 等待或手动重置 |
| E004 | RetryExhaustedException | 重试次数耗尽 | 检查上游服务 |
| E005 | ConfigValidationException | 配置验证失败 | 检查配置格式 |

## FAQ

### 一般问题

**Q: 为什么导入方式变了？**

**A:** v2.0.0 重构了导入结构，必须通过子模块导入。例如：`from FQBase.Infrastructure import singleton`

**Q: 单例模式在多进程下是否安全？**

**A:** 基础单例模式是线程安全但不是进程安全。对于多进程场景，建议使用 Redis 等共享存储。

### 使用问题

**Q: 如何选择缓存后端？**

**A:**
| 场景 | 推荐后端 |
|------|---------|
| 本地开发 | Memory (LocalCache) |
| 单机部署 | Redis |
| 分布式部署 | Redis Cluster |
| 持久化需求 | MongoDB |

**Q: 熔断器和重试如何选择？**

**A:**
- 熔断器：防止级联故障，快速失败
- 重试：处理临时性故障

可以同时使用：先重试，重试失败后触发熔断器。

### 性能问题

**Q: 如何提高缓存命中率？**

**A:**
1. 合理设置 TTL
2. 使用一致的缓存键命名
3. 预热热点数据

**Q: 数据库连接池大小如何设置？**

**A:** 建议设置为 CPU 核心数的 2-4 倍。

## 诊断工具

### 启用调试日志

```python
import logging
logging.basicConfig(level=logging.DEBUG)

from FQBase.Infrastructure import get_logger
logger = get_logger("FQBase")
logger.setLevel(logging.DEBUG)
```

### 健康检查

```python
from FQBase.Infrastructure._mongo import get_mongo_client_manager

manager = get_mongo_client_manager(uri)
health = manager.health_check_detailed()
print(f"MongoDB Health: {health}")
```

## 相关文档

- [最佳实践](./best-practices.md)
- [API参考](./api.md)
- [配置指南](./configuration.md)
