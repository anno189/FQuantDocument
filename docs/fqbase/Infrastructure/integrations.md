---
title: Infrastructure - 集成指南
description: Infrastructure 与其他模块的集成
tag:
  - fquant
  - fqbase
  - infrastructure

summary:
  purpose: integrations
---

# Infrastructure - 集成指南

## 阅读路径

🔵 **开发者**：README → integrations → configuration

## 集成架构

```
┌─────────────────────────────────────────────────┐
│              FQBase 其他模块                      │
│  (Foundation, Config, Cache, Crawler, DataStore)  │
└─────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│           FQBase.Infrastructure                  │
├─────────────────────────────────────────────────┤
│  singleton │ logger │ exceptions │ retry        │
│  circuit_breaker │ container │ _mongo           │
└─────────────────────────────────────────────────┘
```

## 被使用关系

Infrastructure 被以下模块使用：

| 模块 | 用途 |
|------|------|
| Foundation | 日志、单例、异常 |
| Config | 配置加载、验证 |
| Cache | Redis 连接、缓存 |
| DataStore | MongoDB 连接 |
| Crawler | 网络请求重试、熔断器 |
| FQData | 数据获取、存储 |

## 环境变量

| 变量 | 描述 | 默认值 |
|------|------|--------|
| FQ_LOGGING_CONFIG | 日志配置文件路径 | logging.yaml |
| FQ_LOG_DIR | 日志文件存储目录 | ./logs |
| FQ_CIRCUIT_BREAKER_DISABLED | 禁用熔断器 | false |

## 相关文档

- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
