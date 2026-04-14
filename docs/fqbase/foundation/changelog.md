---
title: Foundation 模块 - 变更日志
description: Foundation 版本历史与更新说明
tag:
  - fqbase
  - foundation
---

# Foundation 模块 - 变更日志

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 📖 索引 | [README](./README.md) → **[变更日志](./changelog.md)** |

## 子模块变更日志

| 子模块 | 变更日志 | 说明 |
|--------|----------|------|
| validators | [变更日志](./validators/changelog.md) | 输入验证 |
| exceptions | [变更日志](./exceptions/changelog.md) | 统一异常 |
| retry | [变更日志](./retry/changelog.md) | 重试装饰器 |
| dotty | [变更日志](./dotty/changelog.md) | 字典访问 |
| singleton | [变更日志](./singleton/changelog.md) | 单例模式 |
| lifecycle | [变更日志](./lifecycle/changelog.md) | 生命周期 |
| container | [变更日志](./container/changelog.md) | 依赖注入 |
| circuit_breaker | [变更日志](./circuit_breaker/changelog.md) | 熔断器 |

## v1.0.0 (2024-01-15)

### 新增

- **validators**: 输入验证器（股票代码、日期、市场、频率等）
- **exceptions**: 统一异常体系（DataSource、Strategy、Config 等）
- **retry**: 重试装饰器（固定延迟、指数退避、异步支持）
- **dotty**: 嵌套字典点号访问（简化深层字典操作）
- **singleton**: 单例模式（线程安全、支持重置）
- **lifecycle**: 生命周期管理（健康检查、初始化、关闭）
- **container**: 依赖注入容器（单例、瞬态、作用域）
- **circuit_breaker**: 熔断器（故障隔离、状态机）

### 核心功能

| 子模块 | 功能 |
|--------|------|
| validators | 输入验证 |
| exceptions | 统一异常 |
| retry | 重试装饰器 |
| dotty | 字典访问 |
| singleton | 单例模式 |
| lifecycle | 生命周期 |
| container | 依赖注入 |
| circuit_breaker | 熔断器 |
