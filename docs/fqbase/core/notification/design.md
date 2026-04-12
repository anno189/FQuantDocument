# Notification 设计文档

**模块路径**: `FQBase.Core.notification`
**源码**: [notification.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/notification.py)

---

## 一、处理器模式

```python
class NotificationHandler:
    """通知处理器基类"""
    def send(self, content: str, **kwargs) -> bool:
        raise NotImplementedError
```

**决策**: 使用基类定义接口，支持扩展新的通知渠道。

---

## 二、单例模式

```python
@singleton
class NotificationManager:
    """统一通知管理器"""
    pass
```

**决策**: 使用 `@singleton` 装饰器确保全局唯一实例。

---

## 三、线程安全

```python
class ServerChanHandler:
    def __init__(self, serverchan_key: str = None):
        self._lock = threading.Lock()

    def send(self, content: str, **kwargs) -> bool:
        with self._lock:  # 线程安全
            try:
                ...
```

**决策**: 每个 Handler 使用锁保证线程安全。

---

## 四、默认渠道初始化

```python
def _init_default_handlers(self):
    # 初始化所有企业微信渠道
    for channel in WECOM_CHANNELS.keys():
        self._handlers[f'wecom_{channel.lower()}'] = WecomHandler(channel=channel)
    # 初始化 Server 酱和 PushBear
    self._handlers['serverchan'] = ServerChanHandler()
    self._handlers['pushbear'] = PushBearHandler()
```

**决策**: 启动时自动初始化所有可用渠道。
