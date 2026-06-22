---
title: Foundation - 开发指南
description: 如何参与 Foundation 开发与扩展
tag:
  - fquant
  - fqbase
  - foundation

summary:
  purpose: development
---

# Foundation - 开发指南

## 阅读路径

🔵 **开发者**：README → development → patterns

## 开发环境

### 前置要求

- Python 3.8+
- FQBase.Infrastructure 已安装

### 初始化

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQBase
python -c "from FQBase.Infrastructure import init; init()"
```

## 添加新通知渠道

### Step 1: 创建 Handler

```python
from FQBase.Foundation.notification import NotificationHandler

class SlackHandler(NotificationHandler):
    def __init__(self, webhook_url: str):
        self.webhook_url = webhook_url

    def send(self, message: str, **kwargs) -> bool:
        # 实现发送逻辑
        return True

    def _validate_config(self) -> bool:
        return bool(self.webhook_url)
```

### Step 2: 注册 Handler

```python
from FQBase.Foundation.notification import NotificationManager

manager = NotificationManager()
manager.add_handler('slack', SlackHandler(webhook_url='...'))
```

## 添加新事件类型

### Step 1: 定义事件常量

```python
class EventTypes:
    DATA_UPDATE = 'data_update'
    PRICE_CHANGE = 'price_change'
    SYSTEM_ALERT = 'system_alert'
```

### Step 2: 发布事件

```python
from FQBase.Foundation import Event, get_event_bus

bus = get_event_bus()
bus.publish(Event(EventTypes.DATA_UPDATE, {'key': 'value'}))
```

## 测试

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQBase
python -m pytest tests/Foundation/
```

## 代码风格

- 遵循 PEP8
- 使用类型注解
- 所有公共 API 必须有 docstring
- 使用 get_logger 记录日志

## 相关文档

- [设计模式](./patterns.md)
- [API参考](./api.md)
