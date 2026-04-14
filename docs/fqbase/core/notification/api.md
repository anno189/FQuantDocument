---
title: 通知服务 - API参考
description: 通知服务 API 参考文档
tag:
  - fqbase
  - core
  - notification

summary:
  purpose: api-reference
  core_classes:
    - NotificationManager
    - WecomHandler
    - ServerChanHandler
    - PushBearHandler
  core_functions:
    - sendWechat
    - sendMessage2ServerChan
    - sendMessagetoAll
---

# 通知服务 - API参考

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → **[API参考](./api.md)** → [开发指南](./development.md) → [最佳实践](./best-practices.md) |


## 类

### NotificationManager

**位置：** `FQBase/Core/notification.py`

**描述：** 统一通知管理器，单例模式，线程安全，支持多渠道注册和发送。延迟初始化：handlers 在首次访问时才创建。

```python
from FQBase.Core.notification import NotificationManager

manager = NotificationManager()
```

#### 方法

##### send

```python
result = manager.send(content, channel='DEFAULT')
```

**描述：** 发送通知到指定渠道

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| content | str | 是 | - | 消息内容 |
| channel | str | 否 | 'DEFAULT' | 渠道标识 |

**返回：** `bool` - 是否发送成功

**异常：** 无

**示例：**

```python
manager = NotificationManager()
result = manager.send('交易执行成功', channel='BOND')
print(f"发送结果: {result}")  # True 或 False
```

##### send_all

```python
results = manager.send_all(content)
```

**描述：** 向所有已注册渠道发送通知

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| content | str | 是 | - | 消息内容 |

**返回：** `Dict[str, bool]` - 各渠道发送结果

**示例：**

```python
results = manager.send_all('这是一条广播消息')
# {'wecom_default': True, 'wecom_bond': True, 'serverchan': False, ...}
```

##### send_async

```python
future = manager.send_async(content, channel='DEFAULT')
```

**描述：** 异步发送通知

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| content | str | 是 | - | 消息内容 |
| channel | str | 否 | 'DEFAULT' | 渠道标识 |

**返回：** `concurrent.futures.Future` - 异步任务

**示例：**

```python
future = manager.send_async('异步消息', channel='SYSTEM')
result = future.result()
```

##### register

```python
manager.register(name, handler)
```

**描述：** 注册自定义通知处理器

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| name | str | 是 | - | 处理器名称 |
| handler | NotificationHandler | 是 | - | 处理器实例 |

**返回：** `None`

##### get_handler

```python
handler = manager.get_handler(name)
```

**描述：** 获取指定名称的处理器

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| name | str | 是 | - | 处理器名称 |

**返回：** `Optional[NotificationHandler]`

---

### WecomHandler

**位置：** `FQBase/Core/notification.py`

**描述：** 企业微信通知处理器

```python
from FQBase.Core.notification import WecomHandler

handler = WecomHandler(channel='DEFAULT')
```

#### 初始化参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| channel | str | 否 | 'DEFAULT' | 渠道标识 |

#### 方法

##### send

```python
result = handler.send(content, **kwargs)
```

**描述：** 发送企业微信消息

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| content | str | 是 | - | 消息内容 |
| title | str | 否 | - | 标题（可选参数） |

**返回：** `bool` - 是否发送成功

---

### ServerChanHandler

**位置：** `FQBase/Core/notification.py`

**描述：** Server 酱通知处理器

```python
from FQBase.Core.notification import ServerChanHandler

handler = ServerChanHandler(serverchan_key='your_key')
```

#### 初始化参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| serverchan_key | str | 否 | get_env('SERVERCHAN_KEY') | Server 酱 Key |

#### 方法

##### send

```python
result = handler.send(content, title='', **kwargs)
```

**描述：** 同步发送 Server 酱消息

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| content | str | 是 | - | 消息正文 |
| title | str | 否 | '' | 标题 |

**返回：** `bool` - 是否发送成功

##### send_async

```python
future = handler.send_async(content, title='', **kwargs)
```

**描述：** 异步发送 Server 酱消息

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| content | str | 是 | - | 消息正文 |
| title | str | 否 | '' | 标题 |

**返回：** `concurrent.futures.Future`

##### post

```python
response = handler.post(title, body='')
```

**描述：** 使用 POST 方式发送消息

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| title | str | 是 | - | 标题 |
| body | str | 否 | '' | 消息正文 |

**返回：** `requests.Response`

---

### PushBearHandler

**位置：** `FQBase/Core/notification.py`

**描述：** PushBear 通知处理器

```python
from FQBase.Core.notification import PushBearHandler

handler = PushBearHandler(send_key='your_key')
```

#### 初始化参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| send_key | str | 否 | get_env('PUSHBEAR_KEY') | PushBear Key |

#### 方法

##### send

```python
result = handler.send(content, title='', **kwargs)
```

**描述：** 同步发送 PushBear 消息

##### send_async

```python
future = handler.send_async(content, title='', **kwargs)
```

**描述：** 异步发送 PushBear 消息

##### post

```python
response = handler.post(title, body='')
```

**描述：** 使用 POST 方式发送消息

---

## 函数

### sendWechat

**位置：** `FQBase/Core/notification.py`

```python
from FQBase.Core.notification import sendWechat

result = sendWechat(content, channel='DEFAULT')
```

**描述：** 发送企业微信消息的便捷函数（兼容旧接口）

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| content | str | 是 | - | 消息内容 |
| channel | str | 否 | 'DEFAULT' | 渠道标识 |

**返回：** `bool` - 是否发送成功

**示例：**

```python
sendWechat('订单执行成功', channel='BOND')
```

---

### sendMessage2ServerChan

**位置：** `FQBase/Core/notification.py`

```python
from FQBase.Core.notification import sendMessage2ServerChan

response = sendMessage2ServerChan(title, body)
```

**描述：** 发送 Server 酱消息的便捷函数（兼容旧接口）

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| title | str | 是 | - | 标题 |
| body | str | 是 | - | 消息正文 |

**返回：** `requests.Response`

---

### sendMessagetoAll

**位置：** `FQBase/Core/notification.py`

```python
from FQBase.Core.notification import sendMessagetoAll

response = sendMessagetoAll(title, body)
```

**描述：** 发送 PushBear 消息的便捷函数（兼容旧接口）

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| title | str | 是 | - | 标题 |
| body | str | 是 | - | 消息正文 |

**返回：** `requests.Response`

---

## 常量

| 常量 | 类型 | 值 | 描述 |
|------|------|-----|------|
| DEFAULT_TIMEOUT | int | 5 | 默认请求超时时间（秒） |
| NOTIFICATION_CHANNELS | dict | {...} | 支持的通知渠道配置 |
| WECOM_CHANNELS | dict | {...} | 企业微信渠道标识 |

### WECOM_CHANNELS

```python
{
    'DEFAULT': 'DEFAULT',
    'BOND': 'BOND',
    'VOL_PRICE': 'VOL_PRICE',
    'HIGH': 'HIGH',
    'LIMIT': 'LIMIT',
    'INS': 'INS',
    'SYSTEM': 'SYSTEM',
}
```

---

## 异常

| 异常 | 描述 |
|------|------|
| 无特定异常 | 本模块不抛出特定异常，错误通过返回 False 表示 |

## 相关文档

- [使用指南](./usage.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
