---
title: Retry 模块
description: 重试装饰器，提供重试次数限制、重试延迟策略、异常类型过滤等功能
tag:
  - fqbase
  - retry
---

# Retry 模块

重试装饰器，提供重试次数限制、重试延迟策略、异常类型过滤等功能。支持同步和异步函数。

```yaml
summary:
  type: utility
  complexity: low
  maturity: stable
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "网络请求失败时自动重试"
    - "外部API调用需要容错"
    - "需要指数退避策略"
  warnings:
    - "重试会延长执行时间"
    - "需设置最大重试次数防止无限重试"
    - "不是所有异常都需要重试"
  limitations:
    - "不支持异步重试（仅有装饰器）"
    - "不能用于生成器"

relationships:
  depends_on: []
  import_path:
    - from FQBase.Foundation import retry
```

## 快速开始

### 基本重试

```python
from FQBase.Foundation import retry

@retry(stop_max_attempt_number=3, wait_random_min=100, wait_random_max=500)
def fetch_data():
    return api.get()
```

### 指数退避

```python
from FQBase.Foundation import retry_with_exponential_backoff

@retry_with_exponential_backoff(max_attempts=5, base_wait=100, max_wait=5000)
def fetch_with_backoff():
    return api.get()
```

### 异常过滤

```python
@retry(retry_on_exception=(ConnectionError, TimeoutError))
def fetch_data():
    return api.get()
```

## 核心功能

| 功能 | 说明 |
|------|------|
| `retry` | 固定/随机延迟重试装饰器 |
| `retry_with_exponential_backoff` | 指数退避重试装饰器 |
| `async_retry_with_exponential_backoff` | 异步指数退避重试 |
| `RetryContext` | 重试上下文，手动控制重试 |
| `RetryError` | 重试失败异常 |

## 重试策略

| 策略 | 等待时间 | 适用场景 |
|------|----------|----------|
| 固定随机 | random(min, max) | 快速恢复的临时故障 |
| 指数退避 | base * 2^(attempt-1) | 网络抖动、限流 |

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
