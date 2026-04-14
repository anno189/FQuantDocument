---
title: Core - 常见问题
description: Core 基础设施核心层常见问题与解答
tag:
  - fqbase
  - core
---

# Core - 常见问题

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [故障排查](./troubleshooting.md) → **[常见问题](./faq.md)** |


## 一般问题

### Q: Core 模块是什么？

**A:** Core 是 FQBase 的基础设施核心层，作为一个容器模块聚合了事件总线、日志系统、通知服务等核心组件。

### Q: Core 与子模块的关系是什么？

**A:** Core 是聚合层，通过 `__init__.py` 统一导出各子模块的 API。子模块包括：
- event_bus: 事件总线
- logger: 日志系统
- notification: 通知服务
- notification_template: 通知模板
- event_bus_celery: Celery 集成

### Q: 如何选择使用 Core 还是直接使用子模块？

**A:** 
- 如果需要组合使用多个子模块，使用 Core 的统一导出
- 如果只需要一个子模块的功能，可以直接导入子模块

## 使用问题

### Q: 如何获取 EventBus 实例？

**A:** 使用 `get_event_bus()` 函数获取单例：

```python
from FQBase.Core import get_event_bus
event_bus = get_event_bus()
```

### Q: 事件订阅和发布的顺序重要吗？

**A:** 是的，必须先订阅再发布事件。事件发布时，只有已存在的订阅者才会收到通知。

### Q: 如何发送企业微信通知？

**A:**

```python
from FQBase.Core import NotificationManager
notifier = NotificationManager(
    wecom_corp_id='your_corp_id',
    wecom_secret='your_secret',
    wecom_agent_id='your_agent_id'
)
notifier.send('消息内容', channel='WECOM')
```

### Q: 如何使用通知模板？

**A:**

```python
from FQBase.Core import NotificationTemplate
message = NotificationTemplate.render(
    'trade_signal',
    strategy='均值回归',
    code='000001',
    price=12.50
)
```

## 故障排查

### Q: 发布事件后订阅者没有收到

**A:** 检查以下几点：
1. 订阅是否在发布之前完成
2. 事件类型是否匹配
3. 订阅者函数是否有异常

### Q: 通知发送失败

**A:** 检查以下几点：
1. 渠道配置是否正确
2. API 密钥是否过期
3. 网络是否通畅

### Q: 日志没有输出

**A:** 检查以下几点：
1. 日志级别是否设置正确
2. 是否调用了 `init_logging()` 初始化
3. 输出目标是否配置正确

## 性能问题

### Q: 事件订阅很多会影响性能吗？

**A:** EventBus 使用字典存储订阅，查找复杂度是 O(1)。大量订阅对性能影响较小，但如果订阅者执行耗时操作，可能影响事件分发速度。

### Q: 大量日志会影响系统性能吗？

**A:** 日志级别设置为 DEBUG 时会产生大量日志，影响性能。建议在生产环境使用 INFO 或更高级别。

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [故障排查](./troubleshooting.md)
- [最佳实践](./best-practices.md)
- [event_bus 子模块](./event_bus/)
- [logger 子模块](./logger/)
- [notification 子模块](./notification/)
