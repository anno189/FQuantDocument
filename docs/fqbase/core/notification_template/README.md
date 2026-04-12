# NotificationTemplate 模块文档

**模块路径**: `FQBase.Core.notification_template`
**源码**: [notification_template.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/notification_template.py)

## 文档索引

| 文档 | 说明 |
|------|------|
| [framework.md](framework.md) | 框架概述、核心特性、预设模板 |
| [architecture.md](architecture.md) | 整体架构、组件架构、渲染流程 |
| [design.md](design.md) | 设计决策与权衡 |
| [api.md](api.md) | 详细 API 参考 |
| [usage.md](usage.md) | 使用指南、预设模板详情、量化交易场景 |
| [best-practices.md](best-practices.md) | 最佳实践 |

## 快速开始

```python
from FQBase.Core.notification_template import NotificationTemplate

message = NotificationTemplate.render(
    'trade_signal',
    strategy='均值回归',
    code='000001',
    price=12.50,
    time='2024-01-15 10:30:00'
)
```
