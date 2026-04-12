# FQBase Cache 模块文档

**模块路径**: `FQBase.Cache`
**源码**: [FQBase/Cache](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Cache)
**版本**: 2.7.0

---

## 文档索引

### 核心文档

| 文档 | 说明 |
|------|------|
| [框架文档](framework.md) | 模块概述、快速开始、框架结构 |
| [架构文档](architecture.md) | 架构设计、组件关系、数据流 |
| [设计文档](design.md) | 设计决策、权衡分析、技术选型 |

### API 与开发

| 文档 | 说明 |
|------|------|
| [API 文档](api.md) | 详细 API 参考、参数说明、返回值 |
| [开发指南](development.md) | 开发规范、最佳实践、调试方法 |
| [缓存适配器](cache_adapters.md) | LocalCache、RedisCacheAdapter、MongoCacheAdapter 详解 |
| [LocalCache 作用域](cache_scope.md) | LocalCache 实例隔离、单例模式、命名空间隔离策略 |

### 应用示例

| 文档 | 说明 |
|------|------|
| [应用示例](examples.md) | 10 个应用场景代码示例 |
| [Cache Prefix 使用场景](Cache_Prefix_使用场景.md) | prefix 隔离策略详解 |

---

## 模块结构

```
FQBase.Cache
├── LocalCache           # 本地内存缓存 (LRU/FIFO + TTL)
├── RedisCacheAdapter    # Redis 分布式缓存
├── MongoCacheAdapter    # MongoDB 缓存
├── local_cache          # 本地缓存装饰器
├── redis_cache          # Redis 缓存装饰器
└── CacheContext         # 缓存上下文管理器
```

---

## 快速导航

### 新手入门
1. 阅读 [框架文档](framework.md) 了解模块概述
2. 阅读 [应用示例](examples.md) 学习基本用法
3. 阅读 [开发指南](development.md) 掌握开发规范

### 深入了解
1. 阅读 [架构文档](architecture.md) 理解架构设计
2. 阅读 [设计文档](design.md) 了解设计决策
3. 阅读 [API 文档](api.md) 掌握详细 API

### 专项主题
- [LocalCache 作用域](cache_scope.md) - 实例隔离、单例模式、命名空间隔离
- [Cache Prefix 使用场景](Cache_Prefix_使用场景.md) - prefix 命名空间隔离
- [缓存适配器](cache_adapters.md) - 各适配器详细说明
- [CacheAdapters 与 DirectRedis 比较](cache_adapters_directredis.md) - 旧系统迁移指南
- [CacheAdapters 与 JsonStorage 比较](cache_adapters_jsonstorage.md) - Redis 操作封装对比

---

## 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 2.7.0 | 2026-03-29 | 修复 keys() prefix 处理、expire() TTL 验证 |
| 2.6.0 | 2026-03-29 | 删除重复函数、统一 bytes 解码、LRU 驱逐清理 |
| 2.2.0 | 2026-03-29 | 支持 per-key TTL、key_ttl_func |
| 2.0.0 | 2026-03-29 | 统一 prefix 策略，优化性能 |

---

## 相关链接

- [FQBase 主文档](../README.md)
- [Config 模块](../config/README.md)
- [Core 模块](../core/README.md)
- [DataStore 模块](../datastore/README.md)
