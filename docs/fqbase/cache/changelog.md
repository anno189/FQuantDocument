---
title: Cache - 变更日志
description: Cache 模块版本历史与更新说明
tag:
  - fqbase
  - cache
---

# Cache - 变更日志

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 📖 索引 | [README](./README.md) → **[变更日志](./changelog.md)** |

## v1.0.0 (当前版本)

### 新增

- 首次发布 Cache 模块
- **LocalCache**：本地内存缓存实现
  - 支持 LRU/FIFO 驱逐策略
  - 支持 TTL 过期（全局 + per-key）
  - 惰性清理
  - 线程安全
  - 单例模式
- **RedisCacheAdapter**：Redis 缓存适配器
  - 支持 String/Hash/List/Set 四种数据结构
  - prefix 键前缀隔离
  - Pipeline 批量操作
  - SCAN 键迭代
  - pickle/msgpack 双重序列化
  - pandas/numpy 自动序列化支持
  - 连接池管理
  - 健康检查（ping 方法）
- **MongoCacheAdapter**：MongoDB 缓存适配器
- **@local_cache**：本地缓存装饰器
- **@redis_cache**：Redis 缓存装饰器，支持异步函数
- 缓存接口层（CacheInterface）
- 全局适配器管理（init_cache_adapter、get_cache_adapter、set_cache_adapter）
- 缓存失效功能（invalidate_cache）
- 缓存统计功能

### 更改

- 统一缓存 API 接口
- 优化序列化性能
- 修复 prefix 参数未生效的问题
- 修复连接泄漏问题

### 已知问题

- LocalCache 在极高并发下可能存在锁竞争
- RedisCacheAdapter 的 safe_mode 参数需要进一步完善

---

## 相关文档

- [README](./README.md)
