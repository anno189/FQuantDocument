# NotificationTemplate API 参考

**模块路径**: `FQBase.Core.notification_template`
**源码**: [notification_template.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/notification_template.py)

---

## 一、NotificationTemplate 数据类

```python
@dataclass
class NotificationTemplate:
    """通知消息模板"""
    name: str
    title: str
    body_template: str
    level: str = 'info'
```

### `NotificationTemplate.render(**kwargs) -> str`

渲染模板为纯文本。

| 参数 | 类型 | 说明 |
|------|------|------|
| `**kwargs` | - | 模板变量 |

**返回值**: 渲染后的消息文本

### `NotificationTemplate.render_dict(**kwargs) -> Dict[str, Any]`

渲染模板为结构化字典。

| 参数 | 类型 | 说明 |
|------|------|------|
| `**kwargs` | - | 模板变量 |

**返回值**:
```python
{
    'name': 'trade_signal',
    'title': '【交易信号】',
    'body': '均值回归\n股票: 000001\n价格: 12.5\n时间: 2024-01-15 10:30:00',
    'level': 'info',
    'variables': {'strategy': '均值回归', 'code': '000001', ...}
}
```

---

## 二、NotificationTemplateRegistry 类

模板注册表管理器。

### `NotificationTemplateRegistry.register(template: NotificationTemplate)`

注册模板。

| 参数 | 类型 | 说明 |
|------|------|------|
| `template` | `NotificationTemplate` | 模板实例 |

### `NotificationTemplateRegistry.unregister(name: str) -> bool`

注销模板。

| 参数 | 类型 | 说明 |
|------|------|------|
| `name` | `str` | 模板名称 |

**返回值**: 是否成功注销

### `NotificationTemplateRegistry.get(name: str) -> Optional[NotificationTemplate]`

获取模板。

| 参数 | 类型 | 说明 |
|------|------|------|
| `name` | `str` | 模板名称 |

**返回值**: 模板实例或 None

### `NotificationTemplateRegistry.render(template_name: str, **kwargs) -> str`

渲染模板。

| 参数 | 类型 | 说明 |
|------|------|------|
| `template_name` | `str` | 模板名称 |
| `**kwargs` | - | 模板变量 |

**返回值**: 渲染后的消息文本

### `NotificationTemplateRegistry.render_dict(template_name: str, **kwargs) -> Dict[str, Any]`

渲染模板为字典。

| 参数 | 类型 | 说明 |
|------|------|------|
| `template_name` | `str` | 模板名称 |
| `**kwargs` | - | 模板变量 |

**返回值**: 结构化字典

### `NotificationTemplateRegistry.templates -> Dict[str, NotificationTemplate]`

获取所有模板。

**返回值**: 模板字典

### `NotificationTemplateRegistry.list_template_names() -> list`

列出所有模板名称。

**返回值**: 模板名称列表

---

## 三、NotificationTemplate 快捷类

模块级快捷访问接口。

### `NotificationTemplate.render(template_name: str, **kwargs) -> str`

渲染模板。

```python
NotificationTemplate.render('trade_signal',
    strategy='均值回归',
    code='000001',
    price=12.50,
    time='2024-01-15 10:30:00'
)
# 返回: '【交易信号】均值回归\n股票: 000001\n价格: 12.5\n时间: 2024-01-15 10:30:00'
```

### `NotificationTemplate.render_dict(template_name: str, **kwargs) -> Dict[str, Any]`

渲染模板为字典。

### `NotificationTemplate.register(template: NotificationTemplate)`

注册模板。

### `NotificationTemplate.get(name: str) -> Optional[NotificationTemplate]`

获取模板。

### `NotificationTemplate.list_names() -> list`

列出所有模板名称。

**返回值**: 模板名称列表

---

## 四、环境变量

NotificationTemplate 模块本身不依赖环境变量，但使用时会依赖 Notification 模块的环境变量：

| 变量名 | 说明 | 所属模块 |
|--------|------|----------|
| `WECOM_CORPID` | 企业微信企业ID | Notification |
| `WECOM_SECRET_*` | 企业微信应用密钥 | Notification |
| `WECOM_AGENTID_*` | 企业微信应用AgentID | Notification |
| `SERVERCHAN_KEY` | Server酱 Key | Notification |
| `PUSHBEAR_KEY` | PushBear Key | Notification |

详细说明请参考 [Notification API](notification/api.md)。

---

## 五、相关文档

| 文档 | 说明 |
|------|------|
| [Notification API](notification/api.md) | 通知服务 API |
| [Notification 使用指南](notification/usage.md) | 通知服务使用说明 |
| [framework.md](framework.md) | 框架概述 |
| [architecture.md](architecture.md) | 架构设计 |
| [design.md](design.md) | 设计决策 |
