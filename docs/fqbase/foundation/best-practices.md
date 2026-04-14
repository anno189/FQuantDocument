---
title: Foundation 模块 - 最佳实践
description: Foundation 模块最佳实践
tag:
  - fqbase
  - foundation
---

# Foundation 模块 - 最佳实践

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [使用指南](./usage.md) → **[最佳实践](./best-practices.md)** |

## 子模块最佳实践

| 子模块 | 最佳实践 | 说明 |
|--------|----------|------|
| validators | [最佳实践](./validators/best-practices.md) | 输入验证 |
| exceptions | [最佳实践](./exceptions/best-practices.md) | 统一异常 |
| retry | [最佳实践](./retry/best-practices.md) | 重试装饰器 |
| dotty | [最佳实践](./dotty/best-practices.md) | 字典访问 |
| singleton | [最佳实践](./singleton/best-practices.md) | 单例模式 |
| lifecycle | [最佳实践](./lifecycle/best-practices.md) | 生命周期 |
| container | [最佳实践](./container/best-practices.md) | 依赖注入 |
| circuit_breaker | [最佳实践](./circuit_breaker/best-practices.md) | 熔断器 |

## 最佳实践

### 1. 优先使用依赖注入

使用容器管理依赖，便于测试和替换实现。

### 2. 合理选择生命周期

- 单例：全局配置、连接池
- 瞬态：业务处理器
- 作用域：请求上下文

### 3. 组合使用熔断器和重试

```python
@circuit_breaker(name="api", failure_threshold=3)
@retry(max_attempts=3)
def call_api():
    return api.get()
```
