---
title: Foundation - 最佳实践
description: Foundation 使用最佳实践
tag:
  - fquant
  - fqbase
  - foundation

summary:
  purpose: best-practices
---

# Foundation - 最佳实践

## 阅读路径

🔵🟡 **开发者+运维**：README → best-practices → configuration

## 事件总线最佳实践

### ✅ 推荐做法

1. **使用单例获取 EventBus**
   ```python
   from FQBase.Foundation import get_event_bus
   bus = get_event_bus()
   ```

2. **设置合理的优先级**
   ```python
   bus.subscribe('event', handler, priority=10)
   ```

3. **使用弱引用防止内存泄漏**
   ```python
   bus.subscribe('event', handler, weak_ref=True)
   ```

### ❌ 避免做法

1. **不要创建多个 EventBus 实例**
   ```python
   bus1 = EventBus()
   bus2 = EventBus()
   ```

2. **不要在订阅回调中阻塞**
   ```python
   def slow_handler(event):
       time.sleep(60)
   ```

## 生命周期最佳实践

### ✅ 推荐做法

1. **组合多个协议**
   ```python
   class MyService(HealthCheckable, Initializable, Shutdownable):
       pass
   ```

2. **返回详细的健康状态**
   ```python
   def health_check(self) -> HealthStatus:
       return HealthStatus(
           status=ServiceStatus.RUNNING,
           details={'connections': 10, 'cache_hits': 1000}
       )
   ```

## 通知服务最佳实践

### ✅ 推荐做法

1. **使用通知管理器统一管理**
   ```python
   manager = NotificationManager()
   manager.add_handler('wecom', webhook_url='...')
   ```

2. **使用模板发送格式化消息**
   ```python
   template = NotificationTemplate(name='alert', content='{symbol} price: {price}')
   template.render(symbol='AAPL', price=150)
   ```

## Dotty 最佳实践

### ✅ 推荐做法

1. **直接修改原字典**
   ```python
   d = dotty(data)
   d['key.nested'] = 'value'
   ```

2. **使用 no_list 参数处理特殊键**
   ```python
   d = dotty({'1': 'one'}, no_list=True)
   ```

## 相关文档

- [使用指南](./usage.md)
- [配置指南](./configuration.md)
