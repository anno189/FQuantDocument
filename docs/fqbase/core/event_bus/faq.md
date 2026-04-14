---
title: 事件总线 - 常见问题
description: 事件总线常见问题与解答
tag:
  - fqbase
  - event_bus
---

# 事件总线 - 常见问题

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → **[常见问题](./faq.md)** |


## 一般问题

### Q: 事件总线和直接函数调用有什么区别？

**A:** 事件总线实现了发布-订阅模式，主要优势包括：

1. **松耦合**：发布者和订阅者不需要相互了解
2. **动态关系**：订阅关系可以在运行时建立或解除
3. **广播**：一个事件可以触发多个处理函数
4. **解耦业务逻辑**：不同模块可以独立开发和测试

适用场景：
- 模块间需要松耦合通信
- 一个事件需要触发多个处理
- 需要在运行时动态添加/移除处理逻辑

不适用场景：
- 简单的函数调用（直接调用更高效）
- 同步紧密耦合的模块

---

### Q: EventBus 是线程安全的吗？

**A:** 是的，EventBus 内部使用 `threading.Lock` 保护共享数据。以下操作都是线程安全的：

- `subscribe()` - 添加订阅
- `unsubscribe()` / `unsubscribe_by_id()` - 取消订阅
- `publish()` - 发布事件
- `get_subscriber_count()` - 获取订阅者数量

可以在多线程环境中安全使用。

---

### Q: 如何选择同步发布还是异步发布？

**A:** 根据场景选择：

| 发布方式 | 适用场景 | 特点 |
|----------|----------|------|
| `publish()` | 事件处理快速简单 | 阻塞式，实时性强 |
| `publish_async()` | 需要后台处理 | 返回 Future，不阻塞 |
| `publishAwait()` | 异步处理函数 | 支持 async/await |

示例：
```python
# 同步：立即处理
bus.publish(Event('log', data))  # 阻塞

# 异步：不等待处理完成
bus.publish_async(Event('log', data))

# 异步等待：等待所有处理完成
await bus.publishAwait(Event('log', data))
```

---

### Q: 弱引用订阅有什么作用？

**A:** 弱引用订阅用于防止内存泄漏。当订阅者（类实例的方法）不再被外部引用时，弱引用允许其被垃圾回收。

```python
# 普通订阅：类实例无法被释放
class Handler:
    def handle(self, event):
        pass

handler = Handler()
bus.subscribe('event', handler.handle)
del handler  # handler 不会被释放，因为 EventBus 持有引用

# 弱引用订阅：类实例可以被释放
bus.subscribe('event', handler.handle, weak_ref=True)
del handler  # handler 可以被释放，订阅自动失效
```

---

## 使用问题

### Q: 如何取消订阅？

**A:** 有三种方式取消订阅：

1. **通过回调函数**：
```python
def handler(event):
    pass

bus.subscribe('event', handler)
bus.unsubscribe('event', handler)
```

2. **通过订阅 ID**：
```python
sub_id = bus.subscribe('event', handler)
bus.unsubscribe_by_id(sub_id)
```

3. **通过全局订阅回调**：
```python
def global_handler(event):
    pass

bus.subscribe_global(global_handler)
bus.unsubscribe_global(global_handler)
```

---

### Q: 事件历史记录有什么作用？

**A:** 事件历史记录用于：

1. **调试**：查看事件发布的时序
2. **审计**：记录重要事件
3. **回溯**：重新处理历史事件

```python
# 获取历史
history = bus.get_history(event_type='trade', limit=100)

# 清除历史
bus.clear_history()
```

---

### Q: 优先级是如何工作的？

**A:** 优先级决定订阅者的执行顺序：

- 数值越**大**越先执行
- 相同优先级按订阅顺序执行

```python
# 执行顺序: high -> normal -> low
bus.subscribe('event', low_priority, priority=1)
bus.subscribe('event', normal_priority, priority=50)
bus.subscribe('event', high_priority, priority=100)
```

---

### Q: 可以订阅匿名函数（lambda）吗？

**A:** 可以但不推荐：

```python
# 可以工作，但有一些限制
bus.subscribe('event', lambda e: print(e.data))
```

问题：
- 无法取消订阅（没有回调引用）
- 可能导致意外行为

**推荐做法**：使用具名函数。

---

## 架构问题

### Q: 事件总线和消息队列有什么区别？

**A:** 对比：

| 特性 | 事件总线 | 消息队列 |
|------|----------|----------|
| 进程内通信 | ✅ | ❌ |
| 跨进程通信 | ❌ | ✅ |
| 消息持久化 | ❌ | ✅ |
| 性能 | 高 | 低 |
| 复杂性 | 低 | 高 |

事件总线适用于**同一进程内**的模块通信；消息队列适用于**分布式系统**间的通信。

---

### Q: 如何处理事件处理中的异常？

**A:** EventBus 会捕获并记录异常，不会中断其他订阅者：

```python
def error_handler(event):
    raise ValueError("模拟错误")

def safe_handler(event):
    print("安全处理")

bus.subscribe('event', error_handler)
bus.subscribe('event', safe_handler)

bus.publish(Event('event', 'data'))
# 输出: "安全处理"
# 错误会被记录到日志
```

建议在处理函数中也要有适当的异常处理。

---

### Q: 如何设计事件类型命名？

**A:** 建议使用有意义的命名空间式命名：

```python
# 推荐
'market.price_update'
'trade.order_executed'
'strategy.signal_generated'
'risk.alert'

# 避免
'update'
'event'
'temp'
```

---

## 性能问题

### Q: 大量事件发布会影响性能吗？

**A:** 会，以下是优化建议：

1. **使用历史记录限制**：
```python
bus = EventBus(max_history=1000)  # 限制内存
```

2. **使用异步发布**：
```python
# 对于耗时处理
await bus.publishAwait(Event('heavy', data))
# 或
bus.publish_async(Event('heavy', data))
```

3. **避免频繁发布**：
```python
# 不好：频繁发布
for tick in ticks:
    bus.publish(Event('tick', tick))

# 好：批量发布
bus.publish(Event('tick_batch', ticks))
```

---

### Q: 线程池大小如何配置？

**A:** 通过环境变量配置：

```bash
# 默认 4 个线程
export FQ_EVENTBUS_WORKERS=8
```

根据事件处理的复杂度调整：
- I/O 密集型：可以设置更大
- CPU 密集型：与 CPU 核心数相当

---

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
