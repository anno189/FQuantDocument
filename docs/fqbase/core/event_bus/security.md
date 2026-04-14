---
title: 事件总线 - 安全指南
description: 事件总线安全配置与最佳实践
tag:
  - fqbase
  - event_bus
---

# 事件总线 - 安全指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → **[安全指南](./security.md)** → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |


## 概述

事件总线主要在进程内使用，安全风险较低，但仍需注意以下方面。

## 安全考虑

### 数据隔离

**建议：** 事件数据应在进程内传递

```python
# 敏感数据不应通过事件总线传递到不受信任的代码
bus.publish(Event('sensitive_data', {'password': 'secret'}))
```

### 事件验证

**建议：** 验证事件数据

```python
def validated_handler(event):
    if not isinstance(event.data, dict):
        raise ValueError("数据必须是字典")
    if 'required_field' not in event.data:
        raise ValueError("缺少必需字段")
    process(event.data)

bus.subscribe('validated_event', validated_handler)
```

### 错误处理

**建议：** 防止敏感信息泄露

```python
import logging

logger = logging.getLogger("secure")

def safe_handler(event):
    try:
        process(event.data)
    except Exception as e:
        # 记录错误但不泄露敏感信息
        logger.warning(f"处理事件失败: {type(e).__name__}")
        # 不记录 event.data 防止敏感信息泄露
```

## 审计日志

**建议：** 记录重要事件

```python
import logging

logger = logging.getLogger("audit")

def audit_handler(event):
    # 记录事件元数据，不记录敏感数据
    logger.info(f"事件: {event.event_type}, 时间: {event.timestamp}")

bus.subscribe_global(audit_handler)
```

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [配置指南](./configuration.md)
