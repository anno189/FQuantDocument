# EventBus 架构文档

**模块路径**: `FQBase.Core.event_bus`
**源码**: [event_bus.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/event_bus.py)

---

## 一、整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                         应用层代码                                │
│   订阅事件                    发布事件                          │
└─────────────────────────────────────────────────────────────────┘
            │                                       │
            ▼                                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EventBus (单例)                             │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    订阅者管理                              │ │
│  │  _subscribers: Dict[str, List[Subscription]]              │ │
│  │  _global_subscribers: List[Subscription]                  │ │
│  │  _subscriber_lock: threading.Lock                         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    事件历史                               │ │
│  │  EventHistory (环形缓冲区, maxlen=100)                    │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
            │                                       │
            ▼                                       ▼
┌─────────────────┐                      ┌─────────────────┐
│  Type Subscribers│                      │ Global Subscribers│
│  ─────────────── │                      │  ─────────────── │
│  order_submit   │                      │  log_all        │
│  trade_signal   │                      │  monitor        │
│  price_change   │                      │                 │
└─────────────────┘                      └─────────────────┘
```

---

## 二、核心组件

```
EventBus (单例)
├── 订阅者存储
│   ├── _subscribers: Dict[str, List[Subscription]]
│   ├── _global_subscribers: List[Subscription]
│   └── _subscriber_lock: threading.Lock
│
├── 订阅者ID管理
│   ├── _subscriber_id_counter: int
│   └── _subscriber_ids: Dict[int, tuple]
│
├── 历史记录
│   └── _history: EventHistory (环形缓冲区)
│
└── 线程池
    └── _executor: ThreadPoolExecutor (max_workers=4)
```

---

## 三、发布流程

```
bus.publish(Event("order", data={...}))
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│ 1. 添加到历史记录                                              │
│    _history.add(event)                                        │
└───────────────────────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│ 2. 获取类型订阅者列表 (快照)                                   │
│    type_subscribers = list(_subscribers.get(event_type, [])) │
└───────────────────────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│ 3. 执行类型订阅者 (按 priority 降序)                           │
│    for sub in type_subscribers:                              │
│        _invoke_callback(sub, event)                           │
└───────────────────────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│ 4. 执行全局订阅者 (按 priority 降序)                           │
│    global_subscribers = list(_global_subscribers)            │
│    for sub in global_subscribers:                            │
│        _invoke_callback(sub, event)                           │
└───────────────────────────────────────────────────────────────┘
```
