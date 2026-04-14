---
title: Cache - 设计原则
description: Cache 模块的设计原则与设计决策
tag:
  - fqbase
  - cache
---

# Cache - 设计原则

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → **[设计原则](./design.md)** → [API参考](./api.md) → [开发指南](./development.md) → [最佳实践](./best-practices.md) |
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → **[设计原则](./design.md)** → [决策指南](./decision-guide.md) |

## 设计原则

| 原则 | 应用 |
|------|------|
| 接口隔离 | 定义 CacheInterface，不同缓存实现实现同一接口 |
| 单一职责 | LocalCache 专注本地缓存，RedisCacheAdapter 专注 Redis |
| 开闭原则 | 新增缓存实现无需修改现有代码 |
| 依赖倒置 | 应用依赖抽象接口，不依赖具体实现 |
| 最小惊讶 | API 设计符合直觉，减少学习成本 |

## 设计决策

### 决策 1: 为什么使用装饰器模式？

**上下文：** 为函数提供缓存能力

**决策：** 使用装饰器模式（@local_cache、@redis_cache）

**后果：**
- 正面：非侵入式、代码简洁、可组合、透明缓存
- 负面：调试时需注意装饰器链路

### 决策 2: 为什么支持三种缓存？

**上下文：** 缓存后端选择

**决策：** 支持 LocalCache、RedisCacheAdapter、MongoCacheAdapter

**后果：**
- 正面：灵活适应不同场景、本地开发无需 Redis
- 负面：学习成本增加、选择困难

### 决策 3: 为什么使用单例模式？

**上下文：** 缓存实例管理

**决策：** LocalCache 和 Redis 连接使用单例模式

**后果：**
- 正面：减少资源占用、相同配置共享缓存
- 负面：配置变更需要新建实例

### 决策 4: 为什么使用惰性清理？

**上下文：** 过期缓存清理

**决策：** LocalCache 采用惰性清理，仅在访问时清理过期项

**后果：**
- 正面：减少 CPU 开销、无后台线程开销
- 负面：过期数据仍占用内存、直至访问

### 决策 5: 为什么支持双重序列化？

**上下文：** 数据序列化

**决策：** 支持 pickle 和 msgpack，pickle_first 参数控制优先级

**后果：**
- 正面：灵活性、兼容性和性能平衡
- 负面：需要理解序列化差异

## 使用的模式

| 模式 | 位置 | 用途 |
|------|------|------|
| 装饰器模式 | @local_cache, @redis_cache | 函数缓存 |
| 单例模式 | _RedisClientManager, LocalCache | 资源复用 |
| 享元模式 | LocalCache 实例缓存 | 减少对象创建 |
| 代理模式 | CacheInterface | 统一访问接口 |
| 策略模式 | 驱逐策略 LRU/FIFO | 算法可切换 |

## 扩展点

| 扩展点 | 方法 | 描述 |
|--------|------|------|
| 自定义 TTL | key_ttl_func | per-key TTL |
| 自定义序列化 | serialize_value | 扩展序列化 |
| 自定义驱逐策略 | eviction 参数 | LRU/FIFO |

---

## 相关文档

- [框架集成](./framework.md)
- [技术架构](./architecture.md)
- [最佳实践](./best-practices.md)
- [三种缓存机制对比](./cache_comparison.md)
