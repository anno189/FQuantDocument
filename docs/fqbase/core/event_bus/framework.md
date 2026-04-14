---
title: 事件总线 - 框架集成
description: 事件总线与其他框架的集成方式
tag:
  - fqbase
  - event_bus
---

# 事件总线 - 框架集成

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → **[框架集成](./framework.md)** → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [最佳实践](./best-practices.md) |


## 概述

本章节介绍事件总线如何与其他框架和系统集成。

## Celery 集成

### 初始化

事件总线支持与 Celery Worker 生命周期集成：

```python
from FQBase.Core.event_bus_celery import setup_event_bus
from celery.signals import worker_process_init, worker_shutdown

@worker_process_init.connect
def on_worker_init(**kwargs):
    setup_event_bus()

@worker_shutdown.connect
def on_worker_shutdown(**kwargs):
    from FQBase.Core.event_bus_celery import clear_event_bus
    clear_event_bus()
```

### 使用 Celery 版本的事件总线

```python
from FQBase.Core.event_bus_celery import get_event_bus
from FQBase.Core.event_bus import Event

# 获取当前 Worker 的 EventBus
event_bus = get_event_bus()

if event_bus:
    event_bus.subscribe('task_result', handler)
    event_bus.publish(Event('task_result', result))
```

### 禁用自动初始化

```python
import os

# 在导入之前设置
os.environ['FQ_CELERY_AUTO_INIT'] = 'false'

from FQBase.Core.event_bus_celery import setup_event_bus

# 手动初始化
bus = setup_event_bus()
```

## 异步框架集成

### asyncio 集成

```python
import asyncio
from FQBase.Core.event_bus import get_event_bus, Event

bus = get_event_bus()

async def async_handler(event):
    await asyncio.sleep(0.1)
    print(f"异步处理: {event.data}")

bus.subscribe('async_event', async_handler)

async def main():
    await bus.publishAwait(Event('async_event', 'test'))

asyncio.run(main())
```

### 与 FastAPI 集成

```python
from fastapi import FastAPI
from FQBase.Core.event_bus import get_event_bus, Event
import asyncio

app = FastAPI()
bus = get_event_bus()

# 定义事件处理
async def notification_handler(event):
    # 发送通知
    print(f"通知: {event.data}")

bus.subscribe('order_created', notification_handler)

@app.post("/orders/")
async def create_order(order: dict):
    # 处理订单
    await bus.publishAwait(Event('order_created', order))
    return {"status": "created"}
```

### 与 Flask 集成

```python
from flask import Flask
from FQBase.Core.event_bus import get_event_bus, Event
import threading
import time

app = Flask(__name__)
bus = get_event_bus()

def background_handler(event):
    # 后台处理
    time.sleep(1)
    print(f"后台处理: {event.data}")

bus.subscribe('task', background_handler)

@app.route('/submit', methods=['POST'])
def submit():
    # 触发后台任务
    bus.publish(Event('task', {'id': 123}))
    return {"status": "submitted"}

# 启动后台线程处理事件
def event_loop():
    while True:
        time.sleep(0.1)

threading.Thread(target=event_loop, daemon=True).start()
```

## 消息队列集成

### 与 RabbitMQ 桥接

```python
import pika
from FQBase.Core.event_bus import get_event_bus, Event

bus = get_event_bus()

def publish_to_rabbitmq(event):
    """将事件发布到 RabbitMQ"""
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    
    channel.basic_publish(
        exchange='events',
        routing_key=event.event_type,
        body=str(event.data)
    )
    connection.close()

# 订阅并转发
bus.subscribe_global(publish_to_rabbitmq)
```

### 从 RabbitMQ 消费

```python
import pika
from FQBase.Core.event_bus import get_event_bus, Event

bus = get_event_bus()

def consume_from_rabbitmq():
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    
    def callback(ch, method, properties, body):
        event = Event(method.routing_key, body.decode())
        bus.publish(event)
    
    channel.basic_consume(queue='events', on_message_callback=callback)
    channel.start_consuming()

# 在独立线程中运行
import threading
threading.Thread(target=consume_from_rabbitmq, daemon=True).start()
```

## WebSocket 集成

```python
import asyncio
from FQBase.Core.event_bus import get_event_bus, Event

bus = get_event_bus()

class WebSocketManager:
    def __init__(self):
        self.clients = []
    
    async def broadcast(self, event):
        for client in self.clients:
            await client.send(str(event.data))

ws_manager = WebSocketManager()

async def ws_handler(event):
    await ws_manager.broadcast(event)

bus.subscribe('price_update', ws_handler)
```

## 日志框架集成

### 与 Python logging 集成

```python
import logging
from FQBase.Core.event_bus import get_event_bus, Event

logger = logging.getLogger(__name__)
bus = get_event_bus()

def log_handler(event):
    logger.info(f"事件: {event.event_type}, 数据: {event.data}")

bus.subscribe_global(log_handler)
```

### 与 structlog 集成

```python
import structlog
from FQBase.Core.event_bus import get_event_bus, Event

logger = structlog.get_logger()
bus = get_event_bus()

def structured_log_handler(event):
    logger.info(
        "event_received",
        event_type=event.event_type,
        data=event.data,
        timestamp=str(event.timestamp)
    )

bus.subscribe_global(structured_log_handler)
```

## 依赖注入集成

### 简单 DI 容器

```python
class DIContainer:
    def __init__(self):
        self.services = {}
    
    def register(self, name, instance):
        self.services[name] = instance
    
    def get(self, name):
        return self.services.get(name)

container = DIContainer()

from FQBase.Core.event_bus import get_event_bus

# 注册事件总线
container.register('event_bus', get_event_bus())

# 在处理函数中使用
def handler(event):
    bus = container.get('event_bus')
    bus.publish(Event('processed', event.data))
```

## 集成点

| 集成点 | 类型 | 说明 |
|--------|------|------|
| Celery | 生命周期 | Worker 启动/关闭时初始化/清理 |
| asyncio | 异步 | 支持 async/await 处理 |
| FastAPI | Web | 事件驱动 Web 请求 |
| Flask | Web | 事件驱动后台任务 |
| RabbitMQ | 消息队列 | 事件跨进程传递 |
| WebSocket | 实时通信 | 实时推送事件 |
| logging | 日志 | 事件日志记录 |

## 相关文档

- [技术架构](./architecture.md)
- [设计原则](./design.md)
- [API参考](./api.md)
