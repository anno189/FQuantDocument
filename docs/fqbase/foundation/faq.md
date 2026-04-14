---
title: Foundation 模块 - 常见问题
description: Foundation 模块常见问题解答
tag:
  - fqbase
  - foundation
---

# Foundation 模块 - 常见问题

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[常见问题](./faq.md)** |

## 子模块常见问题

| 子模块 | 常见问题 | 说明 |
|--------|----------|------|
| validators | [FAQ](./validators/faq.md) | 输入验证 |
| exceptions | [FAQ](./exceptions/faq.md) | 统一异常 |
| retry | [FAQ](./retry/faq.md) | 重试装饰器 |
| dotty | [FAQ](./dotty/faq.md) | 字典访问 |
| singleton | [FAQ](./singleton/faq.md) | 单例模式 |
| lifecycle | [FAQ](./lifecycle/faq.md) | 生命周期 |
| container | [FAQ](./container/faq.md) | 依赖注入 |
| circuit_breaker | [FAQ](./circuit_breaker/faq.md) | 熔断器 |

## 常见问题

### Q: 如何选择使用单例还是容器？

A: 
- 单例适用于：全局配置、日志、连接池
- 容器适用于：需要灵活切换实现、需要依赖注入

### Q: 熔断器和重试如何选择？

A:
- 熔断器：防止级联故障，用于外部服务调用
- 重试：处理临时失败，自动重试

### Q: dotty 和普通字典哪个性能好？

A: 普通字典性能更好，dotty 提供便捷的深层访问方式。

### Q: 如何扩展验证器？

A: 使用 `@register_validator` 装饰器添加自定义验证。
