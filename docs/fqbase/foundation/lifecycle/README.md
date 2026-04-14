---
title: Lifecycle 模块
description: 生命周期管理接口，提供健康检查、初始化和关闭协议
tag:
  - fqbase
  - lifecycle
---

# Lifecycle 模块

生命周期管理接口，提供健康检查、初始化和关闭协议。

```yaml
summary:
  type: interface
  complexity: medium
  maturity: stable
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "服务启动前的健康检查"
    - "需要统一的初始化/关闭流程"
    - "需要监控服务状态"
  warnings:
    - "健康检查可能有副作用"
    - "初始化失败需正确处理"
  limitations:
    - "仅支持同步初始化"
    - "不支持依赖顺序"

relationships:
  depends_on: []
  import_path:
    - from FQBase.Foundation.lifecycle import HealthCheckable, HealthStatus
```

## 快速开始

### 实现健康检查

```python
from FQBase.Foundation import HealthCheckable, HealthStatus, ServiceStatus

class MyService(HealthCheckable):
    def health_check(self) -> HealthStatus:
        return HealthStatus(
            status=ServiceStatus.RUNNING,
            details={'connections': 10}
        )
```

### 组合健康检查

```python
from FQBase.Foundation import CompositeHealthCheck

checker = CompositeHealthCheck()
checker.register('database', db_service)
checker.register('cache', cache_service)

status = checker.check_all()
print(checker.is_all_healthy)
```

## 核心功能

| 协议 | 说明 |
|------|------|
| `HealthCheckable` | 健康检查协议 |
| `Initializable` | 初始化协议 |
| `Shutdownable` | 关闭协议 |
| `ServiceStatus` | 服务状态枚举 |
| `HealthStatus` | 健康状态类 |
| `CompositeHealthCheck` | 组合健康检查 |

## 文档索引

| 文档 | 说明 |
|------|------|
| [README](README.html) | 本文档，模块索引 |
| [框架](framework.html) | 模块架构与核心概念 |
| [架构](architecture.html) | 设计与工作流程 |
| [API](api.html) | 完整API参考 |
| [使用](usage.html) | 使用指南与示例 |
| [开发指南](development.html) | 开发环境、调试、测试 |
| [最佳实践](best-practices.html) | 开发建议与注意事项 |
| [设计](design.html) | 设计决策文档 |
| [FAQ](faq.html) | 常见问题解答 |
