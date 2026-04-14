---
title: Cache - 缓存层
description: FQBase 缓存模块，提供 LocalCache、RedisCacheAdapter、MongoCacheAdapter 三种缓存实现
tag:
  - fqbase
  - cache

summary:
  type: infrastructure
  complexity: medium
  maturity: stable
  size: m
  core_classes:
    - LocalCache
    - RedisCacheAdapter
    - MongoCacheAdapter
  key_functions:
    - local_cache
    - redis_cache
    - init_cache_adapter
    - get_cache_adapter
    - set_cache_adapter
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "频繁访问的数据需要缓存"
    - "需要分布式缓存时用 Redis"
    - "需要进程内缓存时用 LocalCache"
  warnings:
    - "缓存一致性问题需注意"
    - "Redis 连接失败会导致异常"
  limitations:
    - "不支持缓存穿透"
    - "不支持缓存失效策略"

relationships:
  belongs_to:
    - fquant.fqbase
  depends_on:
    - redis
    - pymongo

concepts:
  provides:
    - name: 本地缓存
      definition: 基于内存的缓存，支持 LRU/FIFO 驱逐和 TTL 过期
    - name: Redis 缓存
      definition: 基于 Redis 的分布式缓存，支持 String/Hash/List/Set 多种数据结构
    - name: MongoDB 缓存
      definition: 基于 MongoDB 的缓存，适用于文档存储场景
    - name: 函数缓存装饰器
      definition: @local_cache 和 @redis_cache 装饰器，为函数提供缓存能力
    - name: 单例模式
      definition: LocalCache 使用单例模式，相同配置共享实例
    - name: 惰性清理
      definition: LocalCache 采用惰性清理策略，仅在访问时清理过期项
    - name: 序列化
      definition: 支持 pickle 和 msgpack 序列化，自动处理 pandas/numpy 对象
---

# Cache - 缓存层

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → [使用指南](./usage.md) → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [最佳实践](./best-practices.md) |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → [决策指南](./decision-guide.md) → [数据流](./data-flow.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |
| 📖 索引 | [README](./README.md) → [变更日志](./changelog.md) |

## 一句话总览

📌 **FQBase 统一的缓存抽象层，支持本地内存、Redis、MongoDB 三种缓存实现**

**TL;DR**：
- 解决什么问题：统一缓存 API，屏蔽不同缓存实现的差异，提供 LocalCache、RedisCacheAdapter、MongoCacheAdapter 三种实现
- 核心能力：本地缓存（LRU/FIFO驱逐+TTL）、Redis缓存（多种数据结构+prefix）、装饰器缓存
- 入门难度：🔵 中等

**快速判断**：当您需要缓存数据时，使用本模块。

## 知识脉络

🧑‍🎓 **从零到精通的推荐学习顺序**：

1. [快速入门](./quick-start.md) - 5 分钟上手
2. [核心概念](./concepts.md) - 理解 LocalCache、RedisCacheAdapter、序列化等核心概念
3. [技术架构](./architecture.md) - 理解分层设计和组件关系
4. [使用指南](./usage.md) - 深入学习三种缓存的使用方法
5. [动手实验室](./workshop.md) - 实践练习
6. [最佳实践](./best-practices.md) - 升华理解

⏱️ 预计学习时间：2-3 小时

## 前置知识

在开始学习本模块前，建议先掌握：

| 知识领域 | 建议资源 | 状态 |
|---------|---------|------|
| Python 基础 | [官方教程](https://docs.python.org/zh-cn/3/tutorial/) | ⬜ |
| Redis 基础 | [Redis 文档](https://redis.io/docs/) | ⬜ |
| 缓存概念 | [Wikipedia](https://en.wikipedia.org/wiki/Cache_(computing)) | ⬜ |

## 适用场景

✅ **推荐使用**：
- 需要缓存函数计算结果（使用 @local_cache 或 @redis_cache 装饰器）
- 需要缓存数据库查询结果（跨进程共享使用 RedisCacheAdapter）
- 需要跨进程共享缓存数据（Redis/MongoDB 缓存）
- 需要缓存热点数据（支持 TTL 过期）
- 需要缓存 pandas DataFrame/numpy 数组（内置序列化支持）

❌ **不推荐使用**：
- 对延迟极其敏感的超高频场景（考虑直接内存访问）
- 超大数据量缓存（考虑专门的数据存储如 HBase）

💡 **与其他模块的关系**：
- 被 [FQData](../fqdata/README.md) 中的查询模块使用
- 被 [FQFactor](../fqfactor/README.md) 中的因子计算使用

## 概述

Cache 模块是 FQBase 的缓存抽象层，提供统一的缓存接口，支持三种缓存实现：

| 缓存类型 | 类/函数 | 适用场景 | 核心特性 |
|---------|---------|---------|---------|
| 本地内存缓存 | `LocalCache`, `@local_cache` | 单进程、简单场景、低延迟需求 | LRU/FIFO 驱逐、TTL 过期、惰性清理、线程安全、单例模式 |
| Redis 缓存 | `RedisCacheAdapter`, `@redis_cache` | 分布式、多进程共享、多种数据结构 | String/Hash/List/Set、prefix 前缀、Pipeline 批量、SCAN 迭代 |
| MongoDB 缓存 | `MongoCacheAdapter` | 文档存储、需要复杂查询 | 自动索引、TTL 索引、文档模型 |

## 核心组件

| 组件 | 说明 | 文档 |
|------|------|------|
| LocalCache | 本地内存缓存，支持 LRU/FIFO 和 TTL | [API](./api.md#localcache) |
| RedisCacheAdapter | Redis 缓存适配器，支持多种数据结构 | [API](./api.md#rediscacheadapter) |
| MongoCacheAdapter | MongoDB 缓存适配器 | [API](./api.md#mongocacheadapter) |
| local_cache | 本地缓存装饰器 | [API](./api.md#local_cache) |
| redis_cache | Redis 缓存装饰器，支持异步 | [API](./api.md#redis_cache) |
| _serializers | 序列化模块，支持 pickle/msgpack | [API](./api.md#序列化) |

## 关键特性详解

### LocalCache 特性

1. **双驱逐策略**：支持 LRU（最近最少使用）和 FIFO（先进先出）
2. **TTL 过期**：支持全局 TTL 和 per-key TTL
3. **惰性清理**：仅在访问时清理过期项，减少 CPU 开销
4. **单例模式**：相同 (name, maxsize, ttl, eviction) 配置共享实例
5. **实例数量限制**：默认最多 100 个实例，可通过环境变量配置
6. **后台清理线程**：可选的后台线程定期清理过期实例
7. **批量操作**：get_many、set_many、delete_many 优化性能

### RedisCacheAdapter 特性

1. **多种数据结构**：String、Hash、List、Set
2. **prefix 前缀**：自动为键添加前缀，支持键隔离
3. **Pipeline 批量**：减少网络往返，提高批量操作性能
4. **SCAN 迭代**：安全地遍历大量键（替代 KEYS 命令）
5. **双重序列化**：支持 pickle（默认）和 msgpack，可选 safe_mode
6. **连接池管理**：_RedisClientManager 单例管理连接池
7. **健康检查**：ping() 方法检测连接状态
8. **自动重连**：_ensure_connected() 自动重连断开的连接

### 装饰器特性

1. **@local_cache**：为函数提供本地缓存能力
2. **@redis_cache**：为函数提供 Redis 缓存能力，支持异步函数
3. **自定义 TTL 函数**：key_ttl_func 参数支持 per-key TTL
4. **key_prefix**：统一缓存键前缀，避免冲突

## 快速链接

| 文档 | 说明 |
|------|------|
| [快速入门](./quick-start.md) | 5分钟快速上手 |
| [术语表](./glossary.md) | 术语定义 |
| [核心概念](./concepts.md) | 核心概念详解 |
| [框架集成](./framework.md) | 框架集成方式 |
| [技术架构](./architecture.md) | 技术架构说明 |
| [API参考](./api.md) | API参考文档 |
| [案例库](./examples.md) | 案例库 |
| [速查表](./cheatsheet.md) | 快速参考 |
| [动手实验室](./workshop.md) | 动手练习 |

## 快速定位

我不知道这个，应该去哪找？

| 场景 | 文档 |
|------|------|
| 我不了解这个术语 | [术语表](./glossary.md) |
| 三种缓存怎么选？ | [技术架构](./architecture.md) 或 [决策指南](./decision-guide.md) |
| 遇到错误/问题 | [故障排查](./troubleshooting.md) |
| 如何配置选项？ | [配置指南](./configuration.md) |
| 如何优化性能？ | [性能调优](./performance.md) |
| 如何与其他模块集成？ | [集成指南](./integrations.md) |
| 需要参考实际案例 | [案例库](./examples.md) |
| LocalCache 和 Redis 怎么选？ | [三种缓存机制的场景化对比分析](./cache_comparison.md) |
| RedisCacheAdapter 和 DirectRedis 有什么区别？ | [CacheAdapters 与 DirectRedis 比较](./cache_adapters_directredis.md) |

## 安装

```bash
pip install fquant-base
```

Redis 额外依赖：
```bash
pip install fquant-base[redis]
```

MongoDB 额外依赖：
```bash
pip install fquant-base[mongo]
```

## 相关文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 项目首页 | FQBase 首页 | [README](../README.md) |
| 快速入门 | 快速入门 | [快速入门](./quick-start.md) |
| 架构 | 系统架构 | [技术架构](./architecture.md) |
| 对比分析 | 三种缓存机制对比 | [cache_comparison.md](./cache_comparison.md) |
| 对比分析 | Redis 客户端对比 | [cache_adapters_directredis.md](./cache_adapters_directredis.md) |
| 对比分析 | JsonStorage 对比 | [cache_adapters_jsonstorage.md](./cache_adapters_jsonstorage.md) |
| 对比分析 | 缓存作用域分析 | [cache_scope.md](./cache_scope.md) |
