---
title: 事件总线 - 技术架构
description: 事件总线的技术架构与组件设计
tag:
  - fqbase
  - event_bus
---

# 事件总线 - 技术架构

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → **[技术架构](./architecture.md)** → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [最佳实践](./best-practices.md) |
| 🟡 运维/安全 | [README](./README.md) → **[技术架构](./architecture.md)** → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |
| 🟠 架构师 | [README](./README.md) → **[技术架构](./architecture.md)** → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |


## 概述

事件总线采用分层架构设计，核心组件包括事件对象、订阅管理、发布分发和历史记录。

## 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      EventBus (单例)                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌──────────────────────────────────┐ │
│  │   订阅管理       │  │   事件发布分发                    │ │
│  │                 │  │                                  │ │
│  │ _subscribers    │  │ publish() ──────────────────┐   │ │
│  │  (Dict)         │  │ publish_async() ────────────┼──▶│ │
│  │                 │  │ publishAwait() ──────────────┼──▶│ │
│  │ _global_sub     │  │                              │   │ │
│  │  (List)         │  └──────────────────────────────┘   │ │
│  │                 │                                        │ │
│  │ _lock           │  ┌──────────────────────────────────┐ │
│  │  (threading)    │  │   事件历史                       │ │
│  └─────────────────┘  │                                  │ │
│                        │ EventHistory                      │ │
│  ┌─────────────────┐  │  (环形缓冲区 deque)              │ │
│  │   弱引用管理     │  │  maxlen=N                       │ │
│  │                 │  └──────────────────────────────────┘ │
│  │ _create_weak_   │                                        │
│  │   callback      │  ┌──────────────────────────────────┐ │
│  │                 │  │   异步支持                       │ │
│  │ _resolve_weak_  │  │                                  │ │
│  │   callback      │  │ ThreadPoolExecutor              │ │
│  └─────────────────┘  │ _executor                        │ │
│                        └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │      订阅者 (Subscribers)      │
              ├───────────────────────────────┤
              │  handler1 (priority=100)     │
              │  handler2 (priority=50)      │
              │  handler3 (priority=10)      │
              └───────────────────────────────┘
```

## 组件

### Event

**用途：** 事件对象，携带事件数据

**职责：**
- 封装事件类型、数据、时间戳
- 提供 extra 属性存储额外参数

```python
@dataclass
class Event:
    event_type: str
    data: Any = None
    timestamp: datetime = field(default_factory=datetime.now)
    extra: dict = field(default_factory=dict)
```

### EventBus

**用途：** 事件总线核心，管理订阅和发布

**职责：**
- 维护订阅者列表（按类型和全局）
- 实现多种发布方式（同步/异步）
- 管理事件历史
- 自动清理失效订阅

```python
class EventBus:
    def __init__(self, max_history=100, auto_cleanup_interval=100):
        self._subscribers = defaultdict(list)
        self._global_subscribers = []
        self._history = EventHistory(max_history)
        self._subscriber_lock = threading.Lock()
```

### EventHistory

**用途：** 管理事件历史记录

**职责：**
- 存储事件到环形缓冲区
- 提供历史查询接口
- 线程安全访问

```python
class EventHistory:
    def __init__(self, max_history=100):
        self._history = deque(maxlen=max_history)
        self._lock = threading.Lock()
```

### Subscription

**用途：** 包装订阅者信息

**职责：**
- 存储回调、优先级、订阅ID
- 支持弱引用

```python
@dataclass(order=True)
class Subscription:
    priority: int
    callback: Callable = field(compare=False)
    weak_info: Optional[tuple] = field(default=None, compare=False)
    subscriber_id: Optional[str] = field(default=None, compare=False)
```

## 数据流

### 同步发布流程

```
1. bus.publish(Event)
       │
       ▼
2. _history.add(event)  ──▶ EventHistory (环形缓冲区)
       │
       ▼
3. _publish_count++ 检查是否需要清理
       │
       ▼
4. 获取订阅者列表 (_subscriber_lock)
       │
       ▼
5. 遍历订阅者，按优先级排序
       │
       ▼
6. 调用每个订阅者的回调函数
       │
       ▼
7. 完成
```

### 异步发布流程

```
1. bus.publish_async(Event)
       │
       ▼
2. 获取事件循环
       │
       ▼
3. run_in_executor(_executor, _publish_sync, event, callback)
       │
       ▼
4. 在线程池中执行同步发布
       │
       ▼
5. Future 返回，发布完成
       │
       ▼
6. 可选：callback 被调用
```

### 异步等待发布流程

```
1. await bus.publishAwait(Event)
       │
       ▼
2. _history.add(event)
       │
       ▼
3. 获取订阅者列表
       │
       ▼
4. 为每个订阅者创建任务
       │
       ├── 异步函数 ──▶ asyncio.create_task()
       │
       └── 同步函数 ──▶ loop.run_in_executor()
       │
       ▼
5. asyncio.gather(*tasks)
       │
       ▼
6. 等待所有任务完成
       │
       ▼
7. 完成
```

## 依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| Python | >=3.8 | 基础运行时 |
| threading | 内置 | 线程安全 |
| asyncio | 内置 | 异步支持 |
| weakref | 内置 | 弱引用 |
| collections.deque | 内置 | 环形缓冲区 |
| FQBase.singleton | - | 单例模式 |
| FQBase.logger | - | 日志记录 |

## 环境配置

### 环境变量

| 变量 | 默认值 | 描述 |
|------|--------|------|
| FQ_EVENTBUS_WORKERS | 4 | 线程池大小 |
| FQ_CELERY_AUTO_INIT | true | Celery 自动初始化 |

## 相关文档

- [框架集成](./framework.md)
- [设计原则](./design.md)
- [API参考](./api.md)
