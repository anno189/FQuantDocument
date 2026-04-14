---
title: 统一日志系统 - 变更日志
description: 统一日志系统版本历史
tag:
  - fqbase
  - logger
---

# 统一日志系统 - 变更日志

## v1.0.0 (当前版本)

### 新增

- 首次发布统一日志系统
- FQLogger 类：多实例单例模式日志记录器
- get_logger() 函数：获取日志记录器实例
- init_logging() 函数：显式初始化日志系统
- 日志轮转支持（10MB/文件，保留5个备份）
- 第三方库日志控制（pymongo、asyncio、matplotlib）
- 配置文件加载支持

## 相关文档

- [README](./README.md)
