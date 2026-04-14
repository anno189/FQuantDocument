---
title: 事件总线 - 故障排查
description: 事件总线常见问题与解决方案
tag:
  - fqbase
  - event_bus
---

# 事件总线 - 故障排查

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → **[故障排查](./troubleshooting.md)** → [常见问题](./faq.md) |


## 概述

本章节提供事件总线常见问题的诊断和解决方案。

## 常见问题

### 问题 1: 订阅者未收到事件

**症状：**
- 事件发布后，订阅的处理函数未被调用
- `get_subscriber_count()` 返回 0

**可能原因：**
- 事件类型不匹配
- 订阅在发布之前未完成
- 回调函数引用错误

**解决方案：**

1. 检查事件类型是否匹配：
```python
# 订阅时使用的事件类型
bus.subscribe('price_update', handler)

# 发布时使用的事件类型
bus.publish(Event('price_update', data))  # 匹配

# 错误：大小写或拼写不一致
bus.publish(Event('PriceUpdate', data))  # 不匹配！
```

2. 确保订阅在发布之前完成：
```python
# 正确顺序
bus.subscribe('event', handler)  # 先订阅
bus.publish(Event('event', data))  # 后发布

# 错误顺序
bus.publish(Event('event', data))  # 先发布
bus.subscribe('event', handler)  # 后订阅 - 收不到！
```

3. 检查回调函数是否正确：
```python
# 使用正确的函数引用
def my_handler(event):
    print(event.data)

bus.subscribe('event', my_handler)  # 正确

# 错误：lambda 表达式
bus.subscribe('event', lambda e: print(e.data))  # 可能有问题
```

---

### 问题 2: 内存持续增长

**症状：**
- 进程运行一段时间后，内存使用量不断增加
- `get_subscriber_count()` 返回的数量持续增长

**可能原因：**
- 未使用弱引用订阅，导致对象无法释放
- 订阅未取消，持续累积
- 历史记录过大

**解决方案：**

1. 使用弱引用订阅：
```python
# 对于类方法，使用 weak_ref=True
class Handler:
    def handle(self, event):
        pass

handler = Handler()
bus.subscribe('event', handler.handle, weak_ref=True)
```

2. 及时取消不再需要的订阅：
```python
# 保存订阅 ID
sub_id = bus.subscribe('event', handler)

# 不需要时取消
bus.unsubscribe_by_id(sub_id)
```

3. 设置合理的历史记录大小：
```python
# 减小历史记录
bus = EventBus(max_history=100)  # 默认 100
```

4. 手动触发清理：
```python
# 定期清理
cleaned = bus.cleanup()
print(f"清理了 {cleaned} 个失效订阅者")
```

---

### 问题 3: 事件处理顺序混乱

**症状：**
- 期望按特定顺序处理，但实际顺序不符合预期
- 高优先级处理未先执行

**可能原因：**
- 未设置优先级或优先级设置不当
- 多个订阅使用相同优先级

**解决方案：**

1. 明确设置优先级：
```python
# 高优先级先执行
bus.subscribe('event', handler1, priority=100)
bus.subscribe('event', handler2, priority=50)
bus.subscribe('event', handler3, priority=1)
# 执行顺序: handler1 -> handler2 -> handler3
```

2. 避免相同优先级：
```python
# 使用不同优先级确保顺序
bus.subscribe('event', handler1, priority=10)
bus.subscribe('event', handler2, priority=9)  # 明确不同
```

---

### 问题 4: 异步事件未处理

**症状：**
- 异步处理函数未被调用
- `publishAwait` 后异步处理未执行

**可能原因：**
- 未使用 `await` 调用 `publishAwait`
- 异步函数注册方式错误

**解决方案：**

1. 正确使用 await：
```python
import asyncio

async def async_handler(event):
    await process_async(event.data)

bus.subscribe('event', async_handler)

# 正确：使用 await
async def main():
    await bus.publishAwait(Event('event', data))

asyncio.run(main())

# 错误：没有 await
# bus.publishAwait(Event('event', data))  # 不会执行！
```

2. 确保处理函数是 async 函数：
```python
# 正确
async def async_handler(event):
    await asyncio.sleep(1)
    print(event.data)

# 错误：普通函数
def sync_handler(event):
    asyncio.sleep(1)  # 不会等待
    print(event.data)
```

---

### 问题 5: 多线程环境下的竞争

**症状：**
- 偶发性的订阅丢失
- 事件发布后部分订阅者未执行

**可能原因：**
- 并发订阅/取消订阅操作
- 线程安全问题

**解决方案：**

1. 使用线程安全的操作：
```python
# EventBus 内部已使用锁保护
# 但发布和订阅应在初始化阶段完成

# 初始化阶段注册所有订阅
def init_subscriptions():
    bus.subscribe('event1', handler1)
    bus.subscribe('event2', handler2)

# 运行时阶段发布事件
def run():
    bus.publish(Event('event1', data))
```

2. 避免在事件处理中修改订阅：
```python
# 不要在处理函数中订阅/取消订阅
def bad_handler(event):
    bus.subscribe('other_event', another_handler)  # 危险！

# 正确的做法
def good_handler(event):
    pass  # 只处理事件，不要修改订阅
```

---

## 错误参考

### 错误代码

| 代码 | 错误 | 描述 | 解决方案 |
|------|------|------|---------|
| N/A | 订阅未收到事件 | 事件类型不匹配 | 检查 event_type |
| N/A | 内存泄漏 | 未使用弱引用 | 使用 weak_ref=True |
| N/A | 异步未执行 | 未使用 await | 使用 await publishAwait |

### 错误处理模式

```python
from FQBase.Core.event_bus import get_event_bus, Event

bus = get_event_bus()

# 订阅带有错误处理
def safe_handler(event):
    try:
        process(event.data)
    except Exception as e:
        print(f"处理错误: {e}")
        # 记录或发布错误事件
        bus.publish(Event('handler_error', {'original': event, 'error': str(e)}))

bus.subscribe('event', safe_handler)
```

## 诊断工具

### 启用调试日志

```python
import logging

logging.basicConfig(level=logging.DEBUG)

# 启用事件总线调试日志
logger = logging.getLogger("FQBase.Core.event_bus")
logger.setLevel(logging.DEBUG)

# 添加处理器
handler = logging.StreamHandler()
handler.setLevel(logging.DEBUG)
logger.addHandler(handler)
```

### 检查订阅者状态

```python
# 查看所有订阅者
subscribers = bus.get_subscribers()
for sub in subscribers:
    print(f"ID: {sub['id']}, 类型: {sub['event_type']}, 优先级: {sub['priority']}")

# 查看特定类型订阅者
count = bus.get_subscriber_count('price_update')
print(f"price_update 订阅者数量: {count}")
```

### 检查事件历史

```python
# 查看最近事件
history = bus.get_history(limit=20)
for event in history:
    print(f"{event.timestamp} - {event.event_type}")

# 查看特定事件
events = bus.get_history(event_type='error', limit=10)
print(f"最近错误事件: {events}")
```

## 获取帮助

### 联系支持前

1. 启用调试日志观察行为
2. 检查订阅者列表状态
3. 查看事件历史
4. 记录重现步骤

### 联系支持

- 邮箱：support@fquant.com
- GitHub Issues：[链接](https://github.com/fquant/fquant/issues)

## 相关文档

- [常见问题](./faq.md)
- [最佳实践](./best-practices.md)
- [API参考](./api.md)
