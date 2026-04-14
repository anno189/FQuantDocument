---
title: 事件总线 - 性能调优
description: 事件总线性能优化指南
tag:
  - fqbase
  - event_bus
---

# 事件总线 - 性能调优

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) → **[性能调优](./performance.md)** |
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → **[性能调优](./performance.md)** |


## 概述

本指南介绍如何优化事件总线的性能，包括指标监控、瓶颈分析和优化策略。

## 性能指标

### 关键指标

| 指标 | 描述 | 目标 |
|------|------|------|
| 延迟 | 事件发布到处理完成的时间 | < 10ms |
| 吞吐量 | 每秒可处理的事件数 | > 10000 |
| CPU 使用率 | CPU 利用率 | < 50% |
| 内存 | 内存使用 | < 100MB |
| 订阅者数量 | 活跃订阅者数 | < 1000 |

### 测量性能

```python
import time
from FQBase.Core.event_bus import get_event_bus, Event

bus = get_event_bus()

def dummy_handler(event):
    pass

bus.subscribe('benchmark', dummy_handler)

# 测量延迟
start = time.time()
for _ in range(10000):
    bus.publish(Event('benchmark', None))
latency_ms = (time.time() - start) * 1000 / 10000

print(f"平均延迟: {latency_ms:.3f}ms")
print(f"吞吐量: {10000 / (time.time() - start):.0f} events/s")
```

## 优化策略

### 1. 减少事件处理时间

**优化前（耗时处理）：**

```python
# 同步处理每个事件
def slow_handler(event):
    time.sleep(0.1)  # 100ms 延迟
    save_to_database(event.data)

bus.subscribe('event', slow_handler)
```

**优化后（异步处理）：**

```python
# 使用异步发布
import asyncio

async def async_handler(event):
    await asyncio.sleep(0.1)
    await save_to_database(event.data)

bus.subscribe('event', async_handler)

async def main():
    await bus.publishAwait(Event('event', data))

asyncio.run(main())
```

### 2. 优化订阅结构

**优化前（全局订阅）：**

```python
# 需要过滤所有事件
def filter_handler(event):
    if event.event_type == 'target':
        process(event.data)

bus.subscribe_global(filter_handler)
```

**优化后（类型订阅）：**

```python
# 直接订阅目标类型
def target_handler(event):
    process(event.data)

bus.subscribe('target', target_handler)
```

### 3. 合理使用历史记录

**优化前（无限制）：**

```python
# 内存可能无限增长
bus = EventBus(max_history=1000000)
```

**优化后（合理限制）：**

```python
# 根据需求设置
bus = EventBus(max_history=1000)
```

### 4. 使用弱引用减少内存

**优化前（强引用）：**

```python
# 类实例无法释放
class Handler:
    def handle(self, event):
        pass

handler = Handler()
bus.subscribe('event', handler.handle)
# handler 永远不会被释放
```

**优化后（弱引用）：**

```python
# 类实例可以释放
handler = Handler()
bus.subscribe('event', handler.handle, weak_ref=True)
# handler 不再被引用时可以释放
```

### 5. 调整线程池配置

```python
import os

# 根据处理类型调整线程数
# I/O 密集型：可以设置更多
os.environ['FQ_EVENTBUS_WORKERS'] = '16'

# CPU 密集型：与 CPU 核心数相当
os.environ['FQ_EVENTBUS_WORKERS'] = '4'
```

## 资源限制

### 配置限制

```python
# 根据系统资源设置
bus = EventBus(
    max_history=1000,  # 限制历史记录
    auto_cleanup_interval=50  # 更频繁清理
)
```

### 监控资源使用

```python
# 获取订阅者数量
count = bus.get_subscriber_count()
print(f"活跃订阅者: {count}")

# 获取历史记录大小
history_count = bus.get_history().__len__()
print(f"历史记录: {history_count}")
```

## 基准测试

### 运行基准测试

```python
import time
import asyncio

def benchmark_sync_publish(iterations=10000):
    bus = EventBus()
    
    def handler(event):
        pass
    
    bus.subscribe('bench', handler)
    
    start = time.time()
    for _ in range(iterations):
        bus.publish(Event('bench', None))
    
    elapsed = time.time() - start
    print(f"同步发布: {iterations/elapsed:.0f} events/s, {elapsed*1000/iterations:.3f}ms/event")

async def benchmark_async_publish(iterations=10000):
    bus = EventBus()
    
    async def handler(event):
        pass
    
    bus.subscribe('bench', handler)
    
    start = time.time()
    for _ in range(iterations):
        await bus.publishAwait(Event('bench', None))
    
    elapsed = time.time() - start
    print(f"异步发布: {iterations/elapsed:.0f} events/s, {elapsed*1000/iterations:.3f}ms/event")

# 运行测试
benchmark_sync_publish(10000)
asyncio.run(benchmark_async_publish(10000))
```

## 性能最佳实践

1. **减少订阅者数量**：每个事件类型保持少量订阅者
2. **快速处理**：事件处理函数应快速返回
3. **使用异步**：耗时操作使用异步发布
4. **限制历史**：设置合理的 max_history
5. **使用弱引用**：类方法订阅使用 weak_ref=True
6. **批量发布**：频繁事件考虑批量处理

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [技术架构](./architecture.md)
