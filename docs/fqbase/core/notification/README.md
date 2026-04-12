# Notification 模块文档

**模块路径**: `FQBase.Core.notification`
**源码**: [notification.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/notification.py)

## 文档索引

| 文档 | 说明 |
|------|------|
| [framework.md](framework.md) | 框架概述、核心特性、支持渠道 |
| [architecture.md](architecture.md) | 整体架构、组件架构、发送流程 |
| [design.md](design.md) | 设计决策与权衡 |
| [api.md](api.md) | 详细 API 参考 |
| [usage.md](usage.md) | 使用指南、量化交易场景 |
| [best-practices.md](best-practices.md) | 最佳实践 |

## 快速开始

```python
from FQBase.Core.notification import NotificationManager, sendWechat

manager = NotificationManager()
manager.send("交易执行成功", channel='DEFAULT')

sendWechat("订单已成交", channel='DEFAULT')
```
