# Notification 最佳实践

**模块路径**: `FQBase.Core.notification`
**源码**: [notification.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/notification.py)

---

## 一、配置管理

```python
# 环境变量配置
# 企业微信
WECOM_CORPID=your_corp_id
WECOM_SECRET_DEFAULT=your_secret
WECOM_AGENTID_DEFAULT=1000010
WECOM_SECRET_BOND=your_bond_secret
WECOM_AGENTID_BOND=1000011

# Server 酱
SERVERCHAN_KEY=your_serverchan_key

# PushBear
PUSHBEAR_KEY=your_pushbear_key
```

---

## 二、错误处理

```python
from FQBase.Core.notification import NotificationManager

manager = NotificationManager()

result = manager.send("消息内容", channel='DEFAULT')
if not result:
    logger.error("通知发送失败")

results = manager.send_all("告警消息")
failed = [name for name, success in results.items() if not success]
if failed:
    logger.error(f"以下渠道发送失败: {failed}")
```

---

## 三、异步发送

```python
import threading
from FQBase.Core.notification import NotificationManager

def async_send(content: str, channel: str = 'DEFAULT'):
    def _send():
        manager = NotificationManager()
        manager.send(content, channel)

    thread = threading.Thread(target=_send)
    thread.start()

async_send("交易完成通知")
```

---

## 四、日志集成

```python
import logging
from FQBase.Core.notification import NotificationManager

logger = logging.getLogger(__name__)

class LoggingNotificationManager(NotificationManager):
    def send(self, content: str, channel: str = 'DEFAULT') -> bool:
        logger.info(f"发送通知到 {channel}: {content}")
        result = super().send(content, channel)
        if result:
            logger.info(f"通知发送成功: {channel}")
        else:
            logger.error(f"通知发送失败: {channel}")
        return result
```

---

## 五、重试机制

```python
from FQBase.Core.notification import NotificationManager

def send_with_retry(content: str, channel: str = 'DEFAULT', max_retries: int = 3):
    manager = NotificationManager()

    for i in range(max_retries):
        if manager.send(content, channel):
            return True
        time.sleep(1)

    return False
```

---

## 六、维护事宜

### 6.1 添加新渠道

当需要新增通知渠道时，推荐按以下步骤操作：

**步骤 1：创建处理器类**
```python
from FQBase.Core.notification import NotificationHandler

class CustomHandler(NotificationHandler):
    def __init__(self):
        self.api_url = "https://custom.api/notify"
        self._lock = threading.Lock()

    def send(self, content: str, **kwargs) -> bool:
        with self._lock:
            try:
                response = requests.post(self.api_url, json={"content": content})
                return response.status_code == 200
            except Exception:
                return False
```

**步骤 2：注册处理器**
```python
manager = NotificationManager()
manager.register('custom', CustomHandler())
```

**步骤 3：使用新渠道**
```python
manager.send("消息内容", channel='custom')
```

### 6.2 添加新渠道分组

如果需要添加新的渠道分组（如 `VOL_PRICE`），需要在源码中修改 `WECOM_CHANNELS` 字典：

```python
# 源码中修改
WECOM_CHANNELS = {
    'DEFAULT': {...},
    'BOND': {...},
    'VOL_PRICE': {...},  # 新增
    'HIGH': {...},
    'LIMIT': {...},
    'INS': {...},
    'SYSTEM': {...},
}
```

### 6.3 团队协作规范

**渠道命名规范**
```python
# 渠道名称使用大写字母
'DEFAULT'     # 默认渠道
'BOND'        # 债券渠道
'HIGH'        # 高优先级

# 不推荐
'Default'    # 小写
'default'    # 全小写
'BondChannel' # 混合命名
```

**消息格式规范**
```python
# 推荐：使用模板渲染
message = NotificationTemplate.render('trade_signal', **data)
sendWechat(message, channel='DEFAULT')

# 不推荐：直接拼接字符串
message = f"订单成交: {order['code']}"
sendWechat(message)
```

**错误处理规范**
```python
# 推荐：检查返回值
result = manager.send(content, channel='DEFAULT')
if not result:
    logger.error(f"通知发送失败: {content}")

# 推荐：批量发送检查
results = manager.send_all("告警")
failed = [ch for ch, ok in results.items() if not ok]
if failed:
    logger.warning(f"以下渠道发送失败: {failed}")
```

### 6.4 渠道配置检查清单

新增或修改渠道时，确保完成以下检查：

| 检查项 | 说明 |
|--------|------|
| 环境变量配置完整 | 所有密钥、ID 等已配置 |
| 渠道名称正确 | 使用大写字母命名 |
| Handler 线程安全 | 使用锁保护共享状态 |
| 错误处理完善 | 捕获异常并返回 False |
| 测试验证通过 | 实际发送测试成功 |
