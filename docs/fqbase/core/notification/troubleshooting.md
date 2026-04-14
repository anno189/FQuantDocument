---
title: 通知服务 - 故障排查
description: 通知服务常见问题与解决方案
tag:
  - fqbase
  - core
  - notification
---

# 通知服务 - 故障排查

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → **[故障排查](./troubleshooting.md)** → [常见问题](./faq.md) |


## 概述

本章节提供通知服务模块的常见问题诊断和解决方案。

## 常见问题

### 问题 1: 企业微信发送失败

**症状：**
- 返回 `False`
- 日志显示 "WECOM_SECRET_xxx is not configured"

**可能原因：**
- 未配置环境变量 `WECOM_SECRET_{CHANNEL}`
- AgentID 或 CorpID 配置错误

**解决方案：**

1. 检查环境变量配置：

```bash
# 在 .env 文件中添加
WECOM_CORPID=your_corpid
WECOM_AGENTID_DEFAULT=1000010
WECOM_SECRET_DEFAULT=your_secret
```

2. 验证配置是否加载：

```python
from FQBase.Config.core.env import get_env

corpid = get_env('WECOM_CORPID')
secret = get_env('WECOM_SECRET_DEFAULT')
print(f"CorpID: {corpid}")
print(f"Secret: {secret}")
```

3. 测试企业微信连接：

```python
from corpwechatbot.app import AppMsgSender

sender = AppMsgSender(
    corpid='your_corpid',
    agentid='1000010',
    corpsecret='your_secret'
)
result = sender.send_text(content='测试消息')
print(f"结果: {result}")
```

---

### 问题 2: Server酱/PushBear 发送失败

**症状：**
- 返回 `False`
- 网络请求超时

**可能原因：**
- API Key 配置错误
- 网络连接问题
- 接口被限流

**解决方案：**

1. 验证 Key 配置：

```python
from FQBase.Config.core.env import get_env

serverchan_key = get_env('SERVERCHAN_KEY', '')
pushbear_key = get_env('PUSHBEAR_KEY', '')
print(f"ServerChan Key: {serverchan_key}")
print(f"PushBear Key: {pushbear_key}")
```

2. 直接测试 API 调用：

```python
import urllib.request
import urllib.parse

# 测试 Server酱
key = 'your_key'
url = f"https://sctapi.ftqq.com/{key}.send?text=测试&desp=内容"
response = urllib.request.urlopen(url, timeout=5).read()
print(response.decode('utf-8'))
```

---

### 问题 3: 异步发送阻塞

**症状：**
- 调用 `send_async()` 后仍然阻塞

**可能原因：**
- 线程池已满
- handler 不支持异步

**解决方案：**

1. 检查线程池配置：

```python
from FQBase.Core.notification import _executor

# 默认 max_workers=4
# 可以修改为更大的值
```

2. 使用底层异步方法：

```python
# ServerChanHandler 和 PushBearHandler 有 send_async 方法
handler = ServerChanHandler()
future = handler.send_async('消息', title='标题')
result = future.result()
```

---

### 问题 4: 渠道名称错误

**症状：**
- 警告 "No handler found for channel: xxx"

**可能原因：**
- 渠道名称大小写错误
- 使用了未定义的渠道名

**解决方案：**

使用正确的渠道名称（大写）：

```python
# 正确
manager.send('消息', channel='DEFAULT')
manager.send('消息', channel='BOND')
manager.send('消息', channel='SYSTEM')

# 错误 - 小写会找不到 handler
manager.send('消息', channel='default')  # 找不到！
```

---

## 错误参考

### 错误代码

| 场景 | 错误表现 | 解决方案 |
|------|---------|---------|
| 环境变量未配置 | 返回 False，debug 日志显示未配置 | 配置对应的环境变量 |
| 网络超时 | 请求超时 | 检查网络连接，增加超时时间 |
| API Key 错误 | 返回 False，API 返回错误码 | 检查 Key 是否正确 |
| 线程池满 | 异步任务排队 | 增加线程池大小 |

### 错误处理模式

```python
from FQBase.Core.notification import sendWechat, NotificationManager

# 简单错误处理
result = sendWechat('消息')
if not result:
    print("发送失败")

# 详细错误处理
manager = NotificationManager()

# 发送并记录详细日志
def send_with_logging(message: str, channel: str):
    from FQBase.Core.logger import get_logger
    logger = get_logger(__name__)
    
    logger.info(f"发送通知: channel={channel}")
    result = manager.send(message, channel=channel)
    
    if result:
        logger.info(f"发送成功")
    else:
        logger.warning(f"发送失败，channel={channel}")
    
    return result
```

---

## 诊断工具

### 启用调试日志

```python
import logging

logging.basicConfig(level=logging.DEBUG)

# 只启用通知模块的调试日志
logger = logging.getLogger("FQBase.Core.notification")
logger.setLevel(logging.DEBUG)

# 添加 handler
handler = logging.StreamHandler()
handler.setLevel(logging.DEBUG)
logger.addHandler(handler)
```

### 测试连接

```python
def test_notification_channels():
    """测试所有渠道的连接"""
    from FQBase.Core.notification import (
        NotificationManager,
        ServerChanHandler,
        PushBearHandler
    )
    
    manager = NotificationManager()
    results = {}
    
    # 测试企业微信各渠道
    for channel in ['DEFAULT', 'BOND', 'SYSTEM']:
        handler = manager.get_handler(f'wecom_{channel.lower()}')
        if handler:
            results[f'wecom_{channel}'] = 'Handler exists'
        else:
            results[f'wecom_{channel}'] = 'Handler not found'
    
    # 测试 ServerChan
    serverchan = ServerChanHandler()
    results['serverchan'] = f"Key configured: {bool(serverchan.serverchan_key)}"
    
    # 测试 PushBear
    pushbear = PushBearHandler()
    results['pushbear'] = f"Key configured: {bool(pushbear.send_key)}"
    
    for k, v in results.items():
        print(f"{k}: {v}")
    
    return results

test_notification_channels()
```

### 检查 Handler 状态

```python
manager = NotificationManager()

# 列出所有已注册的 handler
handlers = manager._handlers
print(f"已注册 handlers ({len(handlers)} 个):")
for name, handler in handlers.items():
    print(f"  - {name}: {type(handler).__name__}")
```

---

## 获取帮助

### 联系支持前

1. 启用调试日志并重现问题
2. 收集错误日志
3. 记录环境变量配置（隐藏敏感信息）
4. 记录重现步骤

### 联系支持

- 邮箱：support@fquant.com
- GitHub Issues：[链接](https://github.com/fquant/fquant/issues)

## 相关文档

- [常见问题](./faq.md)
- [最佳实践](./best-practices.md)
- [API参考](./api.md)
