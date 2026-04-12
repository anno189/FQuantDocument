# Notification 使用指南

**模块路径**: `FQBase.Core.notification`
**源码**: [notification.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/notification.py)

---

## 一、基本使用

```python
from FQBase.Core.notification import NotificationManager

manager = NotificationManager()

manager.send("交易执行成功", channel='DEFAULT')

results = manager.send_all("系统告警")
print(results)
```

---

## 二、便捷函数

```python
from FQBase.Core.notification import sendWechat

sendWechat("订单已成交", channel='DEFAULT')

sendWechat("债券预警", channel='BOND')
```

---

## 三、Server 酱

```python
from FQBase.Core.notification import ServerChan, sendMessage2ServerChan

sc = ServerChan()
sc.send("标题", "内容")
sc.post("标题", "内容")

sendMessage2ServerChan("标题", "内容")
```

---

## 四、PushBear

```python
from FQBase.Core.notification import PushBear, sendMessagetoAll

pb = PushBear()
pb.send("标题", "内容")
pb.post("标题", "内容")

sendMessagetoAll("标题", "内容")
```

---

## 五、自定义处理器

```python
from FQBase.Core.notification import NotificationHandler, NotificationManager

class CustomHandler(NotificationHandler):
    def __init__(self):
        self.api_url = "https://custom.api/notify"

    def send(self, content: str, **kwargs) -> bool:
        return True

manager = NotificationManager()
manager.register('custom', CustomHandler())

manager.send("自定义消息", channel='custom')
```

---

## 六、量化交易场景

### 6.1 交易执行通知

```python
from FQBase.Core.notification import sendWechat

def on_trade_executed(order: dict):
    message = (
        f"订单成交通知\n"
        f"代码: {order['code']}\n"
        f"方向: {order['action']}\n"
        f"数量: {order['volume']}\n"
        f"价格: {order['price']}"
    )
    sendWechat(message, channel='DEFAULT')
```

### 6.2 风控告警

```python
from FQBase.Core.notification import NotificationManager

def send_risk_alert(message: str, level: str = 'HIGH'):
    manager = NotificationManager()

    if level == 'CRITICAL':
        results = manager.send_all(f"【严重告警】{message}")
    else:
        manager.send(f"【告警】{message}", channel='DEFAULT')
```

### 6.3 策略运行通知

```python
from FQBase.Core.notification import sendWechat

class StrategyRunner:
    def __init__(self):
        self.channel = 'SYSTEM'

    def on_strategy_start(self, strategy_name: str):
        sendWechat(f"策略开始运行: {strategy_name}", channel=self.channel)

    def on_strategy_stop(self, strategy_name: str, reason: str = '手动停止'):
        sendWechat(f"策略停止: {strategy_name}, 原因: {reason}", channel=self.channel)

    def on_strategy_error(self, strategy_name: str, error: str):
        sendWechat(f"策略异常: {strategy_name}, 错误: {error}", channel=self.channel)
```

### 6.4 数据下载进度

```python
from FQBase.Core.notification import sendWechat

def on_download_progress(current: int, total: int, code: str):
    if current % 100 == 0:
        percent = current / total * 100
        sendWechat(
            f"数据下载进度: {current}/{total} ({percent:.1f}%)",
            channel='DEFAULT'
        )

def on_download_complete(total: int, success: int, failed: int):
    sendWechat(
        f"数据下载完成\n总计: {total}\n成功: {success}\n失败: {failed}",
        channel='DEFAULT'
    )
```
