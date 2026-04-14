---
title: 通知服务 - 最佳实践
description: 通知服务最佳实践与建议
tag:
  - fqbase
  - core
  - notification
---

# 通知服务 - 最佳实践

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [使用指南](./usage.md) → **[最佳实践](./best-practices.md)** |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) → **[最佳实践](./best-practices.md)** |


## 概述

本章节提供有效使用通知服务模块的最佳实践，帮助开发者构建稳定、可靠的 notification 系统。

## 性能最佳实践

### 技巧 1: 使用异步发送

**建议：** 在高并发场景下使用异步发送

**代码 - 好：**
```python
from FQBase.Core.notification import NotificationManager

manager = NotificationManager()

# 异步发送，不阻塞
futures = []
for message in messages:
    future = manager.send_async(message, channel='DEFAULT')
    futures.append(future)

# 等待所有完成
for future in futures:
    result = future.result()
```

**代码 - 差：**

```python
# 同步发送，阻塞
for message in messages:
    manager.send(message, channel='DEFAULT')  # 每次等待完成
```

### 技巧 2: 批量处理

**建议：** 将多条消息合并为一条发送

**代码 - 好：**
```python
# 合并消息
messages = [f"任务 {i}: 完成" for i in range(100)]
combined = "\n".join(messages)
sendWechat(combined)
```

**代码 - 差：**

```python
# 逐条发送
for i in range(100):
    sendWechat(f"任务 {i}: 完成")  # N 次网络调用
```

### 技巧 3: 使用连接池

**建议：** 保持长连接，避免频繁创建连接

代码已经通过单例模式和管理器实现连接复用。

## 安全最佳实践

### 技巧 1: 使用环境变量存储密钥

**建议：** 永远不要硬编码 API 密钥

**代码 - 好：**

```python
# 使用环境变量（通过 .env 文件）
# .env: SERVERCHAN_KEY=your_key_here
from FQBase.Config.core.env import get_secure_env
key = get_secure_env('SERVERCHAN_KEY')
```

**代码 - 差：**

```python
# 永远不要这样做！
api_key = "sct1234567890abcdef"  # 硬编码凭据！
```

### 技巧 2: 敏感信息脱敏

**建议：** 不要在通知中发送敏感信息

**代码 - 好：**

```python
# 发送脱敏信息
message = "用户 138****1234 的订单已成交"
sendWechat(message)
```

**代码 - 差：**

```python
# 发送完整敏感信息
message = "用户身份证: 110101199001011234"  # 永远不要！
sendWechat(message)
```

### 技巧 3: 限制通知频率

**建议：** 实现限流避免频繁发送

```python
import time
from collections import defaultdict

class RateLimiter:
    def __init__(self, max_per_minute: int = 10):
        self.max_per_minute = max_per_minute
        self.requests = defaultdict(list)
    
    def can_send(self, channel: str) -> bool:
        now = time.time()
        self.requests[channel] = [
            t for t in self.requests[channel]
            if now - t < 60
        ]
        return len(self.requests[channel]) < self.max_per_minute
    
    def record(self, channel: str):
        self.requests[channel].append(time.time())

limiter = RateLimiter(max_per_minute=5)

if limiter.can_send('SYSTEM'):
    sendWechat("告警消息")
    limiter.record('SYSTEM')
else:
    print("超过限流阈值")
```

## 错误处理最佳实践

### 技巧 1: 优雅降级

**建议：** 发送失败时不要中断主流程

```python
def safe_send(message: str, channel: str = 'DEFAULT'):
    """安全发送，失败不影响主流程"""
    try:
        result = sendWechat(message, channel=channel)
        if not result:
            logger.warning(f"通知发送失败: {message}")
        return result
    except Exception as e:
        logger.error(f"通知发送异常: {e}")
        return False
```

### 技巧 2: 实现重试机制

**建议：** 失败时自动重试

```python
import time
from functools import wraps

def retry_on_failure(max_retries: int = 3, delay: float = 1.0):
    """重试装饰器"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_error = None
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_error = e
                    if attempt < max_retries - 1:
                        time.sleep(delay)
            raise last_error
        return wrapper
    return decorator

@retry_on_failure(max_retries=3, delay=1.0)
def send_with_retry(message: str, channel: str):
    return sendWechat(message, channel=channel)
```

### 技巧 3: 日志记录

**建议：** 记录发送日志便于排查

```python
from FQBase.Core.logger import get_logger

logger = get_logger(__name__)

def logged_send(message: str, channel: str):
    """带日志记录的发送"""
    logger.info(f"开始发送通知: channel={channel}, len={len(message)}")
    try:
        result = sendWechat(message, channel=channel)
        if result:
            logger.info(f"通知发送成功: channel={channel}")
        else:
            logger.warning(f"通知发送失败: channel={channel}")
        return result
    except Exception as e:
        logger.error(f"通知发送异常: channel={channel}, error={e}")
        return False
```

## 配置最佳实践

### 技巧 1: 使用配置文件

**建议：** 通过配置文件管理多环境配置

```yaml
# config/notification.yaml
development:
  serverchan_key: ""
  pushbear_key: ""
  wecom:
    DEFAULT:
      agentid: "1000010"
      secret: ""

production:
  serverchan_key: "${SERVERCHAN_KEY}"
  pushbear_key: "${PUSHBEAR_KEY}"
  wecom:
    DEFAULT:
      agentid: "${WECOM_AGENTID_DEFAULT}"
      secret: "${WECOM_SECRET_DEFAULT}"
```

### 技巧 2: 渠道分离

**建议：** 不同业务使用不同渠道

```python
# 交易相关 -> BOND 渠道
sendWechat("订单成交", channel='BOND')

# 系统告警 -> SYSTEM 渠道
sendWechat("CPU告警", channel='SYSTEM')

# 一般通知 -> DEFAULT 渠道
sendWechat("定时任务完成", channel='DEFAULT')
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [开发指南](./development.md)
- [故障排查](./troubleshooting.md)
