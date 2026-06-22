# ADR-003: 事件总线 (EventBus) 架构

## 状态
**Accepted** | 2024-04-22

## 背景
应用程序组件之间需要松耦合的通信机制。直接调用会导致组件之间紧耦合，测试困难。

## 决策
实现基于**观察者模式**的 EventBus，支持：
- **类型订阅**：只接收特定类型的事件
- **全局订阅**：接收所有事件
- **优先级**：高优先级订阅者先执行
- **弱引用**：可选，防止内存泄漏
- **异步发布**：支持异步/等待模式

## 实施方案

```python
@singleton
class EventBus:
    def subscribe(self, event_type: str, callback, priority: int = 0):
        """订阅事件"""
        ...

    def publish(self, event: Event):
        """同步发布事件"""
        ...

    async def publishAwait(self, event: Event):
        """异步等待发布"""
        ...
```

### 事件对象
```python
@dataclass
class Event:
    event_type: str
    data: Any
    timestamp: datetime
```

## 关键设计决策

### 1. 单例模式
EventBus 使用 `@singleton` 装饰器确保全局唯一实例。

### 2. 环形缓冲区历史记录
```python
class EventHistory:
    def __init__(self, max_history: int = 100):
        self._history = deque(maxlen=max_history)
```
自动淘汰旧事件，限制内存使用。

### 3. 弱引用订阅
```python
if weak_ref:
    weak_info = _create_weak_callback(callback)
```
防止订阅者被垃圾回收时内存泄漏。

## 后果

### 正面
- 组件完全解耦
- 支持多订阅者同一事件
- 异步支持高性能场景

### 负面
- 调试困难（调用栈不直观）
- 事件顺序不确定
- 内存泄漏风险（如果不用弱引用）

## 相关决策
- ADR-002: 单例模式实现

## 维护记录
| 日期 | 变更 |
|------|------|
| 2024-04-22 | 初始版本 |
