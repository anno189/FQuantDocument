---
title: FQBase - 变更日志
description: FQBase 版本历史与更新说明
tag:
  - fquant
  - fqbase

summary:
  purpose: changelog
---

# FQBase - 变更日志

## 阅读路径

全部角色：README → changelog

## v2.0.0 (2026-04)

### 新增

- Infrastructure 层重构，增加依赖注入容器
- Foundation 层新增 event_bus_celery 模块，支持 Celery 集成
- Cache 层新增 MongoCacheAdapter，支持 MongoDB 作为缓存后端
- 新增 CircuitBreakerManager 管理多个熔断器

### 更改

- 重构导入结构，取消包级别便捷导入，必须通过子模块导入
- Config 层配置监听改为 ConfigWatcher 统一管理
- 事件总线支持异步处理

### 修复

- 修复单例模式在多进程环境下的并发问题
- 修复重试装饰器在异常时不释放资源的问题

## v1.5.0 (2025-12)

### 新增

- Cache 层支持 Redis Sentinel 模式
- 新增 ConfigWatcher 配置监听机制
- Foundation 层新增通知模板功能

### 更改

- 日志系统支持结构化日志
- 熔断器支持自定义状态转换回调

## v1.0.0 (2025-06)

### 新增

- 首次发布
- Infrastructure 层：单例、日志、异常、重试
- Foundation 层：Dotty、生命周期、通知
- Config 层：环境变量、MongoDB 配置
- Cache 层：Redis、Memory 缓存
- DataStore 层：MongoDB CRUD
- Util 层：转换器、文件、网络、并行
- Crawler 层：Selenium 爬虫

---

## 弃用追踪

> 本章节追踪已弃用的功能，帮助迁移

| 弃用项 | 替代方案 | 迁移指南 | 弃用版本 |
|--------|---------|---------|---------|
| `from FQBase import singleton` | `from FQBase.Infrastructure import singleton` | 修改导入路径 | v2.0.0 |
| `FQBase.Config.env` 直接导入 | 通过 `FQBase.Config` 导入 | `from FQBase.Config import get_env` | v2.0.0 |

## 相关文档

- [README](./README.md)
