---
title: Circuit Breaker 模块
description: 熔断器模式实现
tag:
  - fqbase
  - circuit_breaker
---

# Circuit Breaker 模块

熔断器模式实现，用于防止级联故障。当服务连续失败达到阈值时打开熔断器，后续请求直接拒绝而非继续尝试，一段时间后进入半开状态尝试恢复。

```yaml
summary:
  type: design_pattern
  complexity: medium
  maturity: stable
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "防止外部服务故障导致系统崩溃"
    - "需要故障隔离时"
    - "需要自动恢复机制"
  warnings:
    - "熔断打开时会直接失败"
    - "failure_threshold 设置需合理"
    - "recovery_timeout 决定恢复时间"
  limitations:
    - "不支持分布式熔断"
    - "仅支持函数级别"

relationships:
  depends_on: []
  import_path:
    - from FQBase.Foundation.circuit_breaker import circuit_breaker
```

## 快速开始

### 装饰器使用

```python
from FQBase.Foundation import circuit_breaker

@circuit_breaker(name="user_api", failure_threshold=5, recovery_timeout=60)
def get_user(user_id):
    return user_service.get(user_id)
```

### 手动管理

```python
from FQBase.Foundation import CircuitBreaker

breaker = CircuitBreaker(
    name="payment_api",
    failure_threshold=5,
    success_threshold=2,
    recovery_timeout=60
)

result = breaker.call(call_payment_service)
```

### 状态机

```
CLOSED ──(失败次数 ≥ threshold)──► OPEN
  ▲                                  │
  │                              (超时)
  │                                  │
  └──(成功次数 ≥ threshold)── HALF_OPEN ──(失败)──► OPEN
```

## 核心功能

| 功能 | 说明 |
|------|------|
| 三态状态机 | CLOSED、OPEN、HALF_OPEN |
| 失败计数 | 连续失败达到阈值打开熔断器 |
| 恢复超时 | OPEN 状态等待后进入 HALF_OPEN |
| 指标记录 | 详细记录调用成功、失败、拒绝次数 |
| 线程安全 | 所有操作线程安全 |
| 装饰器支持 | `@circuit_breaker` 装饰器 |
| 上下文管理器 | `with CircuitBreaker()` 语法 |

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
