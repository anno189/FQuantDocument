---
title: Config - 性能调优
description: FQBase 配置中心性能优化指南
tag:
  - fqbase
  - config
---

# Config - 性能调优

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) → **[性能调优](./performance.md)** |
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → **[性能调优](./performance.md)** |

## 子模块性能调优

| 子模块 | 性能调优 | 说明 |
|--------|----------|------|
| base | [性能调优](./base/performance.md) | 基础配置性能 |
| business | [性能调优](./business/performance.md) | 业务配置性能 |


## 概述

配置中心的性能优化指南，帮助提升配置访问和管理的性能。

## 性能指标

### 关键指标

| 指标 | 描述 | 目标 |
|------|------|------|
| 环境变量读取延迟 | get_env() 执行时间 | < 1ms |
| 数据库连接延迟 | DATABASE 首次连接时间 | < 100ms |
| 缓存配置读取 | CacheConfig 读取时间 | < 1ms |

### 测量性能

```python
import time
from FQBase.Config import get_env, SETTING, CacheConfig

# 测量环境变量读取
start = time.time()
for _ in range(1000):
    value = get_env('DEBUG', False)
elapsed = (time.time() - start) * 1000
print(f"1000次读取: {elapsed:.2f}ms")
print(f"单次平均: {elapsed/1000:.4f}ms")
```

## 优化策略

### 1. 环境变量缓存

**优化原理：** get_env() 底层使用字典查找，性能极高（<1ms），无需额外缓存。

```python
# 性能测试证明
import time

# 10000次读取
start = time.time()
for _ in range(10000):
    _ = get_env('DEBUG', False)
elapsed = time.time() - start
print(f"10000次: {elapsed*1000:.2f}ms")  # 约 1-2ms
```

### 2. 懒加载优化

**优化原理：** DATABASE 采用懒加载，避免应用启动时不必要的数据库连接。

```python
# 不使用懒加载（启动时就连接）
# from FQBase.Config import DATABASE
# db = DATABASE  # 立即连接

# 使用懒加载（首次使用时才连接）
from FQBase.Config import DATABASE
# 首次访问时才连接
db = DATABASE  # 延迟初始化
```

### 3. 单例模式

**优化原理：** SETTING 是单例，避免重复创建实例的开销。

```python
# 单例模式确保只创建一次
from FQBase.Config import SETTING

# 多次导入获取同一实例，无创建开销
s1 = SETTING
s2 = SETTING
print(s1 is s2)  # True
```

### 4. 缓存配置预加载

**优化原理：** 在应用启动时预加载缓存配置，避免运行时动态创建。

```python
from FQBase.Config import (
    load_env,
    get_env,
    get_cache_config,
    CacheConfig,
)

def init_cache():
    """应用启动时预加载缓存配置"""
    cache_type = get_env('CACHE_TYPE', 'redis')
    ttl = int(get_env('CACHE_TTL', 3600))
    
    # 预创建配置
    config = CacheConfig(cache_type=cache_type, ttl=ttl)
    return config

# 启动时调用
cache_config = init_cache()
```

## 性能最佳实践

1. **使用默认值减少条件判断**

```python
# 好：使用默认值
debug = get_env('DEBUG', False)  # 直接返回 False

# 不好：额外判断
debug = get_env('DEBUG')
if debug is None:
    debug = False
```

2. **批量获取相关配置**

```python
# 好：一次性获取多个配置
configs = {
    'debug': get_env('DEBUG', False),
    'db_url': get_env('MONGODB_URL'),
    'cache_type': get_env('CACHE_TYPE', 'redis'),
}
```

3. **避免频繁调用 load_env**

```python
# 好：只在启动时调用一次
load_env()  # 应用启动时

# 不好：每次获取配置都调用
value = get_env('KEY')  # 内部会重复加载
```

## 性能对比

| 操作 | 性能 | 说明 |
|------|------|------|
| get_env() | ~0.001ms | 字典查找，极快 |
| SETTING.get_mongo() | ~1ms | 字符串返回，极快 |
| DATABASE 首次访问 | ~50-100ms | 数据库连接 |
| CacheConfig() 创建 | ~0.1ms | 对象创建 |

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [技术架构](./architecture.md)
