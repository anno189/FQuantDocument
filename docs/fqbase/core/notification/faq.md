---
title: 通知服务 - 常见问题
description: 通知服务常见问题与解答
tag:
  - fqbase
  - core
  - notification
---

# 通知服务 - 常见问题

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → **[常见问题](./faq.md)** |


## 一般问题

### Q: 如何选择通知渠道？

**A:** 选择通知渠道时需要考虑以下因素：

| 渠道 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| 企业微信 | 企业内部、交易通知 | 支持富文本、机器人 | 需要企业微信账号 |
| Server酱 | 个人开发者、简单通知 | 简单易用、免费 | 功能有限 |
| PushBear | 微信推送 | 绑定微信即可接收 | 需配合微信使用 |

### Q: 支持哪些通知渠道？

**A:** 目前支持三种通知渠道：
- 企业微信（Wecom）：通过 corpwechatbot 库发送
- Server 酱（ServerChan）：通过 sctapi.ftqq.com 发送
- PushBear：通过 pushbear.ftqq.com 发送

### Q: 如何添加新的通知渠道？

**A:** 可以通过继承 NotificationHandler 基类来添加新的渠道：

```python
from FQBase.Core.notification import NotificationHandler, NotificationManager

class MyCustomHandler(NotificationHandler):
    def __init__(self, config):
        self.config = config
    
    def send(self, content: str, **kwargs) -> bool:
        # 实现自定义发送逻辑
        return True

# 注册新渠道
manager = NotificationManager()
manager.register('custom', MyCustomHandler(config={}))
```

## 使用问题

### Q: 为什么发送失败返回 False 而不是抛出异常？

**A:** 设计上选择返回 False 而不是抛出异常的原因：
1. 通知发送失败通常不影响主业务流程
2. 让调用方决定如何处理失败情况
3. 避免异常滥用导致程序不稳定

可以通过检查返回值或启用调试日志来排查问题。

### Q: 如何实现消息重试？

**A:** 可以使用以下方式实现重试：

```python
import time

def send_with_retry(message: str, channel: str = 'DEFAULT', max_retries: int = 3):
    for attempt in range(max_retries):
        result = sendWechat(message, channel=channel)
        if result:
            return True
        if attempt < max_retries - 1:
            time.sleep(1)  # 等待后重试
    return False
```

### Q: 异步发送和同步发送有什么区别？

**A:** 
- **同步发送 (send)**：阻塞等待发送完成，返回发送结果
- **异步发送 (send_async)**：立即返回 Future 对象，不阻塞当前线程

### Q: NotificationManager 是单例吗？

**A:** 是的，NotificationManager 使用 `@singleton` 装饰器实现单例模式，多次调用返回同一实例：

```python
manager1 = NotificationManager()
manager2 = NotificationManager()
print(manager1 is manager2)  # True
```

## 故障排查

### Q: 发送失败但没有错误信息

**A:** 请启用调试日志查看详细原因：

```python
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("FQBase.Core.notification")
logger.setLevel(logging.DEBUG)
```

### Q: 环境变量配置不生效

**A:** 
1. 确认 `.env` 文件位于正确位置
2. 检查变量名称是否正确（注意大小写）
3. 重启应用让环境变量生效

### Q: 企业微信配置正确但仍然失败

**A:** 检查以下配置：
1. CorpID、AgentID、Secret 是否匹配
2. 企业微信应用是否启用
3. IP 是否在白名单中（如有配置）

## 性能问题

### Q: 大量通知发送时如何优化？

**A:** 
1. 使用异步发送 `send_async()`
2. 批量合并消息
3. 调整线程池大小

```python
from FQBase.Core.notification import _executor

# 修改线程池大小（在模块导入前）
_executor._max_workers = 10
```

### Q: 通知发送慢怎么办？

**A:** 
1. 检查网络连接
2. 使用异步发送避免阻塞
3. 考虑增加超时时间

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
