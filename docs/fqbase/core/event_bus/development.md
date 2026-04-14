---
title: 事件总线 - 开发指南
description: 事件总线开发指南与贡献指南
tag:
  - fqbase
  - event_bus
---

# 事件总线 - 开发指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → **[开发指南](./development.md)** → [最佳实践](./best-practices.md) |


## 概述

本指南介绍如何开发和贡献事件总线模块，包括项目结构、代码规范和测试方法。

## 开发环境设置

### 前置要求

- Python 3.8+
- Git
- pip

### 设置

```bash
# 克隆仓库
git clone https://github.com/fquant/fquant.git
cd fquant

# 安装依赖
pip install -e FQuant.Server/FQBase

# 安装开发依赖
pip install -e "FQuant.Server/FQBase[dev]"
```

## 项目结构

```
FQBase/
├── FQBase/
│   ├── Core/
│   │   ├── __init__.py          # 模块导出
│   │   ├── event_bus.py         # 核心事件总线实现
│   │   ├── event_bus_celery.py  # Celery 集成
│   │   ├── logger.py            # 日志系统
│   │   └── notification.py      # 通知服务
│   ├── Foundation/
│   │   ├── singleton.py         # 单例模式
│   │   └── validators.py        # 验证器
│   └── ...
└── tests/
    └── test_event_bus.py        # 事件总线测试
```

## 代码规范

### 样式指南

- 遵循 PEP 8
- 使用类型提示
- 编写文档字符串（Google 风格）

### 代码示例

```python
from typing import Callable, Dict, List, Any, Optional
import threading

class EventBus:
    """事件总线 - 单例模式

    负责管理事件订阅者、发布事件到订阅者、委托历史记录管理给 EventHistory。

    Args:
        max_history: 最大历史记录数，默认 100
        auto_cleanup_interval: 自动清理死订阅者的间隔（发布次数），默认 100

    Attributes:
        _history: EventHistory 实例，管理事件历史
        _subscribers: Dict[str, List[Subscription]]，按事件类型存储订阅者

    Example:
        >>> bus = get_event_bus()
        >>> def on_data(event):
        ...     print(f"Got data: {event.data}")
        >>> bus.subscribe('data', on_data, priority=10)
        >>> bus.publish(Event('data', {'x': 1}))
        Got data: {'x': 1}
    """

    def __init__(self, max_history: int = 100, auto_cleanup_interval: int = 100):
        self._history = EventHistory(max_history=max_history)
        self._subscribers: Dict[str, List[Subscription]] = defaultdict(list)
        self._subscriber_lock = threading.Lock()

    def subscribe(
        self,
        event_type: str,
        callback: Callable,
        priority: int = 0,
        weak_ref: bool = False,
    ) -> str:
        """订阅事件

        Args:
            event_type: 事件类型
            callback: 回调函数
            priority: 优先级，数值越大越先执行（默认0）
            weak_ref: 是否使用弱引用（防止内存泄漏）

        Returns:
            str: 订阅ID，用于取消订阅

        Raises:
            ValueError: 如果回调不是可调用对象
        """
        if not callable(callback):
            raise ValueError("回调必须是可调用对象")
        
        with self._subscriber_lock:
            # ... 实现代码
            pass
```

## 测试

### 运行测试

```bash
# 运行所有测试
pytest tests/

# 运行特定测试
pytest tests/test_event_bus.py -v

# 带覆盖率运行
pytest --cov=FQBase.Core.event_bus tests/test_event_bus.py
```

### 编写测试

```python
import pytest
from FQBase.Core.event_bus import EventBus, Event, get_event_bus

class TestEventBus:
    def test_subscribe_and_publish(self):
        """测试订阅和发布"""
        bus = EventBus()
        received = []
        
        def handler(event):
            received.append(event)
        
        bus.subscribe('test_event', handler)
        bus.publish(Event('test_event', {'data': 'test'}))
        
        assert len(received) == 1
        assert received[0].data == {'data': 'test'}
    
    def test_unsubscribe(self):
        """测试取消订阅"""
        bus = EventBus()
        
        def handler(event):
            pass
        
        sub_id = bus.subscribe('event', handler)
        bus.unsubscribe_by_id(sub_id)
        
        assert bus.get_subscriber_count('event') == 0
    
    def test_priority(self):
        """测试优先级"""
        bus = EventBus()
        order = []
        
        def handler1(event):
            order.append(1)
        
        def handler2(event):
            order.append(2)
        
        bus.subscribe('event', handler1, priority=1)
        bus.subscribe('event', handler2, priority=10)
        bus.publish(Event('event', None))
        
        assert order == [2, 1]  # 高优先级先执行
    
    def test_weak_ref_cleanup(self):
        """测试弱引用清理"""
        bus = EventBus()
        
        class Handler:
            def handle(self, event):
                pass
        
        handler = Handler()
        bus.subscribe('event', handler.handle, weak_ref=True)
        
        # 删除外部引用
        del handler
        
        # 触发清理
        bus.cleanup()
        
        # 订阅者应被清理
        assert bus.get_subscriber_count('event') == 0
    
    def test_global_subscribe(self):
        """测试全局订阅"""
        bus = EventBus()
        received = []
        
        def global_handler(event):
            received.append(event)
        
        bus.subscribe_global(global_handler)
        
        bus.publish(Event('event1', 'data1'))
        bus.publish(Event('event2', 'data2'))
        
        assert len(received) == 2
    
    def test_event_history(self):
        """测试事件历史"""
        bus = EventBus(max_history=10)
        
        for i in range(20):
            bus.publish(Event('test', i))
        
        history = bus.get_history('test')
        assert len(history) == 10  # 只保留最后10条
    
    def test_thread_safety(self):
        """测试线程安全"""
        import threading
        
        bus = EventBus()
        count = [0]
        lock = threading.Lock()
        
        def handler(event):
            with lock:
                count[0] += 1
        
        bus.subscribe('event', handler)
        
        threads = [
            threading.Thread(target=lambda: bus.publish(Event('event', None)))
            for _ in range(100)
        ]
        
        for t in threads:
            t.start()
        for t in threads:
            t.join()
        
        assert count[0] == 100
    
    def test_async_publish(self):
        """测试异步发布"""
        import asyncio
        
        bus = EventBus()
        received = []
        
        async def async_handler(event):
            await asyncio.sleep(0.01)
            received.append(event)
        
        bus.subscribe('async_event', async_handler)
        
        async def test():
            await bus.publishAwait(Event('async_event', 'test'))
        
        asyncio.run(test())
        
        assert len(received) == 1
```

## 调试

### 启用调试日志

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("FQBase.Core.event_bus")
logger.setLevel(logging.DEBUG)

# 添加控制台处理器
handler = logging.StreamHandler()
handler.setLevel(logging.DEBUG)
logger.addHandler(handler)

# 现在发布事件会输出调试信息
bus = get_event_bus()
bus.publish(Event('debug_event', 'test data'))
```

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 订阅者未收到事件 | 事件类型不匹配 | 检查 subscribe 的 event_type 与 publish 的一致性 |
| 内存持续增长 | 未使用弱引用 | 使用 `weak_ref=True` 参数 |
| 事件处理顺序混乱 | 未设置优先级 | 使用 priority 参数 |
| 异步事件未处理 | 未使用 publishAwait | 使用 `await bus.publishAwait()` |

## 贡献

1. Fork 仓库
2. 创建功能分支
3. 进行更改
4. 添加测试
5. 提交 Pull Request

### 提交规范

- 使用清晰的提交消息
- 包含测试用例
- 更新相关文档

## 相关文档

- [API参考](./api.md)
- [设计原则](./design.md)
- [最佳实践](./best-practices.md)
