---
title: FQBase - 故障排查
description: FQBase 常见问题与解决方案
tag:
  - fqbase
---

# FQBase - 故障排查

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → **[故障排查](./troubleshooting.md)** → [常见问题](./faq.md) |

## 子模块故障排查

| 子模块 | 故障排查 | 说明 |
|--------|----------|------|
| Core | [故障排查](./core/troubleshooting.md) | 事件总线、日志、通知 |
| Foundation | [故障排查](./foundation/troubleshooting.md) | 验证、异常、重试、单例 |
| Config | [故障排查](./config/troubleshooting.md) | 配置管理 |
| Cache | [故障排查](./cache/troubleshooting.md) | 缓存抽象 |


## 概述

FQBase 的常见问题和解决方案。

## 常见问题

### 问题 1: 事件订阅不生效

**症状：** 订阅者没有收到事件

**可能原因：**
- 订阅在发布之前未完成
- 主题名称不匹配

**解决方案：**

1. 确保订阅在发布之前完成：

```python
# 正确顺序
event_bus = get_event_bus()
event_bus.subscribe('topic', handler)  # 先订阅
event_bus.publish(Event('topic', data))  # 后发布
```

2. 检查主题名称：

```python
# 确保主题名称一致
event_bus.subscribe('trade_signal', handler)
event_bus.publish(Event('trade_signal', data))  # 名称完全一致
```

---

### 问题 2: 通知发送失败

**症状：** 通知发送失败，无错误信息

**可能原因：**
- 渠道配置错误
- 网络问题
- API 密钥无效

**解决方案：**

1. 检查渠道配置：

```python
from FQBase.Core import NOTIFICATION_CHANNELS

print(NOTIFICATION_CHANNELS)  # 查看可用渠道
```

2. 启用调试日志：

```python
from FQBase.Core import init_logging

init_logging(level='DEBUG')
```

---

### 问题 3: 验证失败

**症状：** 验证函数抛出 ValidationError

**可能原因：**
- 输入格式不正确
- 验证规则不匹配

**解决方案：**

1. 检查输入格式：

```python
from FQBase.Foundation import validate_code

# 股票代码应为6位数字
validate_code('000001')  # 正确
validate_code('123456')  # 正确
validate_code('abc')     # 错误
```

---

### 问题 4: 重试不生效

**症状：** 装饰的重试函数没有重试

**可能原因：**
- 异常类型不匹配
- 超出最大重试次数

**解决方案：**

1. 指定正确的异常类型：

```python
from FQBase.Foundation import retry
import requests

@retry(max_attempts=3, exceptions=(requests.RequestException,))
def fetch_data():
    return requests.get(url).json()
```

---

### 问题 5: 缓存未命中

**症状：** 缓存未生效，每次都查询数据源

**可能原因：**
- TTL 设置过短
- 缓存键不一致

**解决方案：**

1. 检查 TTL 设置：

```python
cache.set('key', 'value', ttl=3600)  # 1小时
```

2. 确保缓存键一致：

```python
# 相同键
cache.get('user:123')
cache.set('user:123', data)  # 使用相同键
```

## 诊断工具

### 启用调试日志

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("FQBase")
```

### 健康检查

```python
from FQBase.Core import get_event_bus

event_bus = get_event_bus()
print(f"订阅者数量: {len(event_bus._subscriptions)}")
```

## 相关文档

- [常见问题](./faq.md)
- [最佳实践](./best-practices.md)
- [API参考](./api.md)
