---
title: Foundation 模块 - 技术架构
description: Foundation 模块技术架构
tag:
  - fqbase
  - foundation
---

# Foundation 模块 - 技术架构

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → **[技术架构](./architecture.md)** |

## 子模块技术架构

| 子模块 | 技术架构 | 说明 |
|--------|----------|------|
| validators | [技术架构](./validators/architecture.md) | 输入验证 |
| exceptions | [技术架构](./exceptions/architecture.md) | 统一异常 |
| retry | [技术架构](./retry/architecture.md) | 重试装饰器 |
| dotty | [技术架构](./dotty/architecture.md) | 字典访问 |
| singleton | [技术架构](./singleton/architecture.md) | 单例模式 |
| lifecycle | [技术架构](./lifecycle/architecture.md) | 生命周期 |
| container | [技术架构](./container/architecture.md) | 依赖注入 |
| circuit_breaker | [技术架构](./circuit_breaker/architecture.md) | 熔断器 |

## 架构设计

### 模块层次

```
FQBase Foundation
├── 基础模式层
│   ├── singleton    # 单例模式
│   └── lifecycle   # 生命周期
├── 扩展机制层
│   ├── retry       # 重试装饰器
│   ├── circuit_breaker  # 熔断器
│   └── container   # 依赖注入
├── 工具层
│   ├── dotty      # 字典访问
│   └── validators # 验证器
└── 异常层
    └── exceptions  # 统一异常
```
