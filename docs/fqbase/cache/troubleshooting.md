---
title: Cache - 故障排查
description: Cache 常见问题与解决方案
tag:
  - fquant
  - fqbase
  - cache

summary:
  purpose: troubleshooting
---

# Cache - 故障排查

## 阅读路径

🟡🔵 **运维+开发者**：README → troubleshooting → configuration → best-practices

## 概述

本文档帮助您诊断和解决使用 Cache 模块时的常见问题。

## 常见问题

### 问题 1: Redis 连接失败

**症状：**
- `CacheConnectionError` 异常
- 日志显示 "Redis 初始化失败"

**可能原因：**
- Redis 服务未启动
- 连接配置错误（host/port）
- 网络不可达
- 密码错误

**解决方案：**

1. 检查 Redis 服务
```bash
redis-cli ping
```

2. 验证连接配置
```python
from FQBase.Cache import RedisCacheAdapter
adapter = RedisCacheAdapter()
print(adapter.ping())
```

3. 检查降级是否生效
```python
from FQBase.Cache import get_cache_adapter
adapter = get_cache_adapter()
print(type(adapter).__name__)
```

### 问题 2: 缓存未生效

**症状：**
- 每次调用都执行原函数
- 缓存键不存在

**可能原因：**
- 缓存适配器未初始化
- TTL 设置为 0
- 函数返回 None 被缓存

**解决方案：**

1. 确保初始化
```python
from FQBase.Cache import init_cache_adapter
init_cache_adapter()
```

2. 检查 TTL
```python
@redis_cache(ttl=300)  # 确保 TTL > 0
def func():
    pass
```

3. 检查函数返回值
```python
@redis_cache(ttl=60)
def func():
    return fetch_data() or "EMPTY_PLACEHOLDER"
```

### 问题 3: 缓存数据不一致

**症状：**
- 数据库已更新但缓存返回旧数据
- 多进程环境下数据不同步

**可能原因：**
- TTL 过长
- 缓存未及时失效
- 多进程写入竞争

**解决方案：**

1. 缩短 TTL
```python
@redis_cache(ttl=60)  # 缩短过期时间
def get_data():
    return fetch_data()
```

2. 主动失效缓存
```python
def update_data():
    update_db()
    update_data.cache_clear()  # 清除缓存
```

### 问题 4: 序列化错误

**症状：**
- `CacheSerializationError` 异常
- 无法缓存 pandas DataFrame

**可能原因：**
- 对象包含不可序列化类型
- 自定义类未实现序列化

**解决方案：**

1. 使用支持的格式
```python
import pandas as pd

@redis_cache(ttl=300)
def get_df():
    df = fetch_df()
    return df.to_dict('records')  # 转为可序列化格式
```

### 问题 5: 内存占用过高

**症状：**
- LocalCache 使用大量内存
- 进程内存持续增长

**可能原因：**
- TTL 设置过长
- 缓存大量数据
- 缓存未清理

**解决方案：**

1. 设置合理的 TTL
```python
cache = LocalCache(name="my", ttl=3600)  # 1小时后过期
```

2. 定期清理
```python
cache.clear()  # 清空所有缓存
```

## 错误参考

| 代码 | 错误 | 描述 | 解决方案 |
|------|------|------|---------|
| E101 | CacheConnectionError | Redis 连接失败 | 检查 Redis 服务和配置 |
| E102 | CacheTimeoutError | 缓存操作超时 | 增加超时时间 |
| E103 | CacheSerializationError | 对象序列化失败 | 检查数据类型 |
| E104 | CacheKeyError | 缓存键无效 | 检查键格式 |
| E105 | CacheOperationError | 缓存操作失败 | 查看日志 |

## FAQ

### 一般问题

**Q: 如何选择缓存后端？**

**A:**
| 场景 | 推荐 |
|------|------|
| 开发调试 | LocalCache |
| 单进程生产 | LocalCache |
| 多进程/分布式 | Redis |
| 需要持久化 | MongoDB |

**Q: @redis_cache 和手动 set/get 如何选择？**

**A:**
- `@redis_cache`：适合函数结果缓存，自动管理键和 TTL
- `set/get`：适合需要细粒度控制的场景

### 使用问题

**Q: 如何实现缓存预热？**

**A:**
```python
from FQBase.Cache import create_cache

cache = create_cache()
for symbol in热门symbols:
    cache.set(f"stock:{symbol}", fetch_stock(symbol))
```

**Q: 如何监控缓存命中率？**

**A:**
```python
from FQBase.Cache import CacheMetricsCollector

collector = CacheMetricsCollector()
stats = collector.get_stats()
print(f"命中率: {stats['hit_rate']}")
```

## 诊断工具

### 启用调试日志

```python
import logging
logging.getLogger('FQBase.Cache').setLevel(logging.DEBUG)
```

### 检查缓存状态

```python
from FQBase.Cache import get_cache_adapter

adapter = get_cache_adapter()
print(f"类型: {type(adapter).__name__}")
print(f"键数量: {len(adapter.keys())}")
```

## 相关文档

- [最佳实践](./best-practices.md)
- [API参考](./api.md)
- [配置指南](./configuration.md)
