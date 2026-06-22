---
title: Foundation - 故障排查
description: Foundation 常见问题和解决方案
tag:
  - fquant
  - fqbase
  - foundation

summary:
  purpose: troubleshooting
---

# Foundation - 故障排查

## 阅读路径

🟡🔵 **运维+开发者**：README → troubleshooting → best-practices

## 常见问题

### Q1: 事件处理器没有收到事件

**可能原因：**
- 订阅时事件类型不匹配
- 订阅在发布之前没有完成

**解决方案：**
```python
bus.subscribe('update', handler)
bus.publish(Event('update', {'key': 'value'}))
```

### Q2: 内存泄漏（订阅者未释放）

**可能原因：**
- 未使用弱引用
- 订阅者对象被引用但不再需要

**解决方案：**
```python
bus.subscribe('event', handler, weak_ref=True)
```

### Q3: 通知发送失败

**可能原因：**
- webhook URL 配置错误
- 网络连接问题

**解决方案：**
```python
manager = NotificationManager()
manager.add_handler('wecom', webhook_url='correct_url')
```

### Q4: Celery 集成报错

**可能原因：**
- Celery 未安装
- 重复初始化

**解决方案：**
```bash
pip install celery
setup_event_bus()
```

## 相关文档

- [最佳实践](./best-practices.md)
- [使用指南](./usage.md)
