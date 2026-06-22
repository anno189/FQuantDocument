---
title: notification - 统一通知服务
description: 支持企业微信、Server酱、PushBear多渠道的通知发送服务
tag:
  - fquant
  - fqbase
  - foundation
  - notification

summary:
  type: service
  complexity: medium
  maturity: stable
  size: medium
  is_container: false
  api_exports:
    total: 9
    classes:
      - name: NotificationManager
        signature: "class NotificationManager"
        description: 单例模式的通知管理器，支持多渠道注册和发送
        source: "notification.py#L236"
      - name: NotificationHandler
        signature: "class NotificationHandler"
        description: 通知处理器基类
        source: "notification.py#L100"
      - name: WecomHandler
        signature: "class WecomHandler"
        description: 企业微信通知处理器
        source: "notification.py#L113"
      - name: ServerChanHandler
        signature: "class ServerChanHandler"
        description: Server酱通知处理器
        source: "notification.py#L155"
      - name: ServerChan
        signature: "class ServerChan"
        description: Server酱接口（兼容旧接口）
        source: "notification.py#L375"
      - name: PushBearHandler
        signature: "class PushBearHandler"
        description: PushBear通知处理器
        source: "notification.py#L195"
      - name: PushBear
        signature: "class PushBear"
        description: PushBear接口（兼容旧接口）
        source: "notification.py#L402"
    functions:
      - name: sendWechat
        signature: "(content: str, channel: str = 'DEFAULT') -> bool"
        description: 发送企业微信消息
        source: "notification.py#L362"
      - name: sendMessage2ServerChan
        signature: "(title: str, body: str)"
        description: 发送Server酱消息
        source: "notification.py#L396"
      - name: sendMessagetoAll
        signature: "(title: str, body: str)"
        description: 发送PushBear消息
        source: "notification.py#L423"
  features:
    has_async: true
    is_thread_safe: true
    has_config: true
    has_logging: true
    has_security: false
  design_patterns:
    - singleton
    - strategy
  environment_vars:
    - name: WECOM_CORPID
      description: 企业微信 CorpID
    - name: WECOM_AGENTID_{CHANNEL}
      description: 企业微信 AgentID（按渠道区分）
    - name: WECOM_SECRET_{CHANNEL}
      description: 企业微信 Secret（按渠道区分）
    - name: SERVERCHAN_KEY
      description: Server酱 Key
    - name: PUSHBEAR_KEY
      description: PushBear Key
  source_location: "Foundation/notification.py"
  source_mtime: 1776751707
  last_updated: "2026-04"

relationships:
  belongs_to:
    - fquant.fqbase.foundation
---

# notification - 统一通知服务

## 一句话总览

📌 **支持企业微信、Server酱、PushBear多渠道的通知发送服务，提供同步/异步发送、批量发送、渠道管理功能。**

---

## 核心 API

### NotificationManager

**位置：** `notification.py#L236`

**描述：** 单例模式的通知管理器，支持多渠道注册和发送

```python
from FQBase.Foundation.notification import NotificationManager

manager = NotificationManager()
manager.send('Order filled', channel='DEFAULT')
```

#### 渠道常量

| 渠道 | 描述 |
|------|------|
| DEFAULT | 默认渠道 |
| BOND | 债券渠道 |
| VOL_PRICE | 量价渠道 |
| HIGH | 高价渠道 |
| LIMIT | 涨停渠道 |
| INS | 指令渠道 |
| SYSTEM | 系统渠道 |

#### 核心方法

| 方法 | 描述 |
|------|------|
| `register(name, handler)` | 注册通知处理器 |
| `send(content, channel='DEFAULT')` | 发送通知 |
| `send_all(content)` | 向所有渠道发送 |
| `send_async(content, channel)` | 异步发送 |
| `get_handler(name)` | 获取处理器 |

---

### NotificationHandler

**位置：** `notification.py#L100`

**描述：** 通知处理器基类，所有处理器需继承此类

```python
class MyHandler(NotificationHandler):
    def send(self, content: str, **kwargs) -> bool:
        return True
```

---

### WecomHandler

**位置：** `notification.py#L113`

**描述：** 企业微信通知处理器

```python
from FQBase.Foundation.notification import WecomHandler

handler = WecomHandler(channel='DEFAULT')
handler.send('Hello from FQuant')
```

#### 构造参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| channel | str | 'DEFAULT' | 渠道标识 |

---

### ServerChanHandler

**位置：** `notification.py#L155`

**描述：** Server酱通知处理器

```python
from FQBase.Foundation.notification import ServerChanHandler

handler = ServerChanHandler(serverchan_key='your_key')
handler.send('Title', title='Hello', body='Content')
handler.send_async('Title', title='Async message')
```

#### 构造参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| serverchan_key | str | None | Server酱 Key |

#### 核心方法

| 方法 | 描述 |
|------|------|
| `send(content, **kwargs)` | 同步发送 |
| `send_async(content, **kwargs)` | 异步发送 |
| `post(title, body)` | POST 发送 |

---

### PushBearHandler

**位置：** `notification.py#L195`

**描述：** PushBear通知处理器

```python
from FQBase.Foundation.notification import PushBearHandler

handler = PushBearHandler(send_key='your_key')
handler.send('Title', title='Hello', body='Content')
```

#### 构造参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| send_key | str | None | PushBear Key |

---

### sendWechat

**位置：** `notification.py#L362`

**描述：** 发送企业微信消息（便捷函数）

```python
from FQBase.Foundation.notification import sendWechat

sendWechat('Order executed', channel='BOND')
```

---

### sendMessage2ServerChan

**位置：** `notification.py#L396`

**描述：** 发送Server酱消息（便捷函数）

```python
from FQBase.Foundation.notification import sendMessage2ServerChan

sendMessage2ServerChan('Alert', 'Price threshold exceeded')
```

---

### sendMessagetoAll

**位置：** `notification.py#L423`

**描述：** 发送PushBear消息（便捷函数）

```python
from FQBase.Foundation.notification import sendMessagetoAll

sendMessagetoAll('System Alert', 'Service recovered')
```

---

## 环境配置

| 变量 | 描述 |
|------|------|
| WECOM_CORPID | 企业微信 CorpID |
| WECOM_AGENTID_{CHANNEL} | 企业微信 AgentID |
| WECOM_SECRET_{CHANNEL} | 企业微信 Secret |
| SERVERCHAN_KEY | Server酱 Key |
| PUSHBEAR_KEY | PushBear Key |

---

## 设计模式

- **单例模式**：NotificationManager 全局唯一
- **策略模式**：通过 NotificationHandler 接口支持多种通知渠道

## 核心特性

| 特性 | 描述 |
|------|------|
| 多渠道统一管理 | 通过 register() 注册自定义处理器 |
| 同步/异步发送 | send() 同步，send_async() 异步 |
| 批量发送 | send_all() 向所有已注册渠道发送 |
| 渠道隔离 | 通过 channel 参数指定发送渠道 |
| 线程安全 | 使用锁保护共享状态 |

## 使用场景

### 场景1：企业微信通知

```python
from FQBase.Foundation.notification import NotificationManager

manager = NotificationManager()
manager.send('Order executed: BUY 100 shares AAPL', channel='DEFAULT')
```

### 场景2：多渠道告警

```python
from FQBase.Foundation.notification import NotificationManager

manager = NotificationManager()
results = manager.send_all('System alert: High CPU usage!')
print(results)
```

### 场景3：异步通知

```python
from FQBase.Foundation.notification import ServerChanHandler

handler = ServerChanHandler()
future = handler.send_async('Title', title='Async message')
```

## 注意事项

1. **环境变量**：需要配置相应的渠道 Key 才能发送
2. **渠道名称**：企业微信渠道名称会自动转换为 `wecom_{channel.lower()}`
3. **异步发送**：send_async() 返回 Future，不会阻塞调用者
4. **线程安全**：所有公共方法都是线程安全的

## 相关文档

- [Foundation README](./README.md)
- [Foundation API](./api.md)
