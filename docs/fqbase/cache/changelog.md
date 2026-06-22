---
title: Cache - 变更日志
description: Cache 版本历史与更新说明
tag:
  - fquant
  - fqbase
  - cache

summary:
  purpose: changelog
---

# Cache - 变更日志

## 阅读路径

全部角色：README → changelog

## v2.8.1 (2026-04-22)

### 新增

- 将缓存适配器实现拆分到 local_cache.py, redis_adapter.py, mongo_adapter.py
- 本文件保留为向后兼容的重导出层

### 更改

- CacheAdapters.py 改为重导出层 + 全局适配器管理

## v2.8.0 (2026-03)

### 新增

- MongoCacheAdapter MongoDB 缓存适配器
- CacheMetricsCollector 缓存监控

### 更改

- 重构 CacheAdapters.py 结构

## v2.7.0 (2026-02)

### 新增

- @redis_cache 装饰器支持 key_ttl_func 动态 TTL
- 异步函数缓存支持

## v2.6.0 (2026-01)

### 新增

- CacheContext 上下文管理器
- 全局适配器管理

### 修复

- 修复 Redis 连接池泄漏问题

## v2.5.0 (2025-12)

### 新增

- LocalCache 本地内存缓存
- RedisCacheAdapter Redis 缓存适配器
- create_cache 工厂方法

---

## 弃用追踪

| 弃用项 | 替代方案 | 迁移指南 | 弃用版本 |
|--------|---------|---------|---------|
| 直接实例化适配器 | 使用 create_cache 工厂方法 | `create_cache(config)` | v2.5.0 |

## 相关文档

- [README](./README.md)
