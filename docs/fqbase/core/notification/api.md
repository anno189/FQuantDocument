# Notification API 参考

**模块路径**: `FQBase.Core.notification`
**源码**: [notification.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/notification.py)

---

## 一、NotificationHandler 基类

```python
class NotificationHandler:
    """通知处理器基类"""
    def send(self, content: str, **kwargs) -> bool:
        """发送通知"""
        raise NotImplementedError
```

---

## 二、WecomHandler

企业微信通知处理器。

### `WecomHandler.__init__(channel: str = 'DEFAULT')`

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `channel` | `str` | `'DEFAULT'` | 渠道标识 |

### `WecomHandler.send(content: str, **kwargs) -> bool`

发送企业微信消息。

**返回值**: 是否发送成功

---

## 三、ServerChanHandler

Server 酱通知处理器。

### `ServerChanHandler.__init__(serverchan_key: str = None)`

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `serverchan_key` | `str` | `None` | Server 酱 Key |

### `ServerChanHandler.send(content: str, **kwargs) -> bool`

发送 Server 酱消息。

### `ServerChanHandler.post(title: str, body: str = '')`

发送 POST 格式消息。

---

## 四、PushBearHandler

PushBear 通知处理器。

### `PushBearHandler.__init__(send_key: str = None)`

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `send_key` | `str` | `None` | PushBear Key |

### `PushBearHandler.send(content: str, **kwargs) -> bool`

发送 PushBear 消息。

### `PushBearHandler.post(title: str, body: str = '')`

发送 POST 格式消息。

---

## 五、NotificationManager

统一通知管理器。

### `NotificationManager.register(name: str, handler: NotificationHandler)`

注册通知处理器。

| 参数 | 类型 | 说明 |
|------|------|------|
| `name` | `str` | 处理器名称 |
| `handler` | `NotificationHandler` | 处理器实例 |

### `NotificationManager.send(content: str, channel: str = 'DEFAULT') -> bool`

发送通知。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `content` | `str` | - | 消息内容 |
| `channel` | `str` | `'DEFAULT'` | 渠道标识 |

**渠道列表**: DEFAULT, BOND, VOL_PRICE, HIGH, LIMIT, INS, SYSTEM

**返回值**: 是否发送成功

### `NotificationManager.send_all(content: str) -> Dict[str, bool]`

向所有已注册渠道发送通知。

| 参数 | 类型 | 说明 |
|------|------|------|
| `content` | `str` | 消息内容 |

**返回值**: 各渠道发送结果

### `NotificationManager.get_handler(name: str) -> Optional[NotificationHandler]`

获取指定名称的处理器。

| 参数 | 类型 | 说明 |
|------|------|------|
| `name` | `str` | 处理器名称 |

**返回值**: 处理器实例或 None

---

## 六、便捷函数

### `sendWechat(content: str, channel: str = 'DEFAULT') -> bool`

发送企业微信消息（兼容旧接口）。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `content` | `str` | - | 消息内容 |
| `channel` | `str` | `'DEFAULT'` | 渠道标识 |

### `sendMessage2ServerChan(title: str, body: str)`

发送 Server 酱消息。

### `sendMessagetoAll(title: str, body: str)`

发送 PushBear 消息。

---

## 七、兼容类

### `ServerChan`

Server 酱接口（兼容旧接口）。

```python
class ServerChan:
    def __init__(self, serverchan_key: str = None)
    def send(self, title: str, body: str = '')
    def post(self, title: str, body: str = '')
```

### `PushBear`

PushBear 接口（兼容旧接口）。

```python
class PushBear:
    def __init__(self, send_key: str = None)
    def send(self, title: str, body: str = '')
    def post(self, title: str, body: str = '')
```

---

## 八、环境变量

### 企业微信

| 变量名 | 说明 |
|--------|------|
| `WECOM_CORPID` | 企业 ID |
| `WECOM_SECRET_DEFAULT` | 默认渠道 Secret |
| `WECOM_AGENTID_DEFAULT` | 默认渠道 AgentID |
| `WECOM_SECRET_BOND` | 债券渠道 Secret |
| `WECOM_AGENTID_BOND` | 债券渠道 AgentID |

### Server 酱

| 变量名 | 说明 |
|--------|------|
| `SERVERCHAN_KEY` | Server 酱 Key |

### PushBear

| 变量名 | 说明 |
|--------|------|
| `PUSHBEAR_KEY` | PushBear Key |

---

## 九、相关文档

| 文档 | 说明 |
|------|------|
| [framework.md](framework.md) | 框架概述 |
| [architecture.md](architecture.md) | 架构设计 |
| [design.md](design.md) | 设计决策 |
| [usage.md](usage.md) | 使用指南 |
| [best-practices.md](best-practices.md) | 最佳实践 |
| [NotificationTemplate API](../notification_template/api.md) | 通知模板 API |
