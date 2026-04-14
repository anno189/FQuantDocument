---
title: FQBase - 变更日志
description: FQBase 版本历史与更新说明
tag:
  - fqbase
---

# FQBase - 变更日志

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 📖 索引 | [README](./README.md) → **[变更日志](./changelog.md)** |

## 子模块变更日志

| 子模块 | 变更日志 | 说明 |
|--------|----------|------|
| Core | [变更日志](./core/changelog.md) | 事件总线、日志、通知 |
| Foundation | [变更日志](./foundation/changelog.md) | 验证、异常、重试、单例 |
| Util | [变更日志](./util/changelog.md) | 工具函数 |
| Config | [变更日志](./config/changelog.md) | 配置管理 |
| Cache | [变更日志](./cache/changelog.md) | 缓存抽象 |
| Date | [变更日志](./date/changelog.md) | 日期时间 |
| DataStore | [变更日志](./datastore/changelog.md) | 数据存储 |
| Crawler | [变更日志](./crawler/changelog.md) | 网页爬虫 |


## v1.0.0 (2024-01)

### 新增

- 首次发布 FQBase 基础框架
- Core 模块：事件总线、日志系统、通知服务
- Foundation 模块：验证器、异常类、重试机制、单例模式
- Util 模块：工具函数集合
- Config 模块：环境变量配置管理
- Cache 模块：缓存抽象层
- Date 模块：日期时间处理
- DataStore 模块：MongoDB 客户端
- Crawler 模块：网页爬虫

### 核心功能

- 事件驱动架构（发布-订阅模式）
- 统一日志系统
- 多渠道通知（企业微信、Server酱、PushBear）
- 数据验证框架
- 带指数退避的重试装饰器
- 熔断器模式
- 统一异常体系
- 环境变量配置管理
- Redis 缓存适配器

### 文档

- L3 完整文档（26个文档）
- 子模块独立文档
- 完整的 API 参考

## 相关文档

- [README](./README.md)
