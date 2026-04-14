---
title: 通知模板 - API参考
description: 通知模板 API 参考文档
tag:
  - fqbase
  - core
  - notification_template

summary:
  purpose: api-reference
  core_classes:
    - NotificationTemplate
    - NotificationTemplateRegistry
  core_functions:
    - NotificationTemplate.render
    - NotificationTemplate.render_dict
---

# 通知模板 - API参考

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → **[API参考](./api.md)** → [开发指南](./development.md) → [最佳实践](./best-practices.md) |


## 类

### NotificationTemplate (dataclass)

**位置：** `FQBase/Core/notification_template.py`

**描述：** 通知模板数据类，用于定义模板结构

```python
from FQBase.Core.notification_template import NotificationTemplate

template = NotificationTemplate(
    name='my_template',
    title='【标题】',
    body_template='内容: {content}',
    level='info'
)
```

#### 参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| name | str | 是 | - | 模板名称，唯一标识 |
| title | str | 是 | - | 消息标题前缀 |
| body_template | str | 是 | - | 消息正文模板，支持变量占位符 |
| level | str | 否 | 'info' | 通知级别：info/warning/error |

#### 方法

##### render

```python
result = template.render(**kwargs)
```

**描述：** 渲染模板为字符串

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| **kwargs | Any | 是 | - | 模板变量 |

**返回：** `str` - 渲染后的消息

**示例：**

```python
template = NotificationTemplate(
    name='test',
    title='【测试】',
    body_template='{name}: {value}'
)
result = template.render(name='金额', value=100)
# 输出: "测试\n金额: 100"
```

##### render_dict

```python
result = template.render_dict(**kwargs)
```

**描述：** 渲染模板为字典

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| **kwargs | Any | 是 | - | 模板变量 |

**返回：** `Dict[str, Any]` - 包含 name, title, body, level, variables 的字典

**示例：**

```python
result = template.render(name='金额', value=100)
# 输出: {'name': 'test', 'title': '【测试】', 'body': '金额: 100', 'level': 'info', 'variables': {'name': '金额', 'value': 100}}
```

---

### NotificationTemplateRegistry

**位置：** `FQBase/Core/notification_template.py`

**描述：** 通知模板注册表，管理所有模板

```python
from FQBase.Core.notification_template import NotificationTemplateRegistry

registry = NotificationTemplateRegistry()
```

#### 方法

##### __init__

```python
registry = NotificationTemplateRegistry()
```

**描述：** 初始化注册表，自动注册默认模板

##### register

```python
registry.register(template)
```

**描述：** 注册模板

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| template | NotificationTemplate | 是 | - | 模板实例 |

**返回：** `None`

##### unregister

```python
result = registry.unregister(name)
```

**描述：** 注销模板

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| name | str | 是 | - | 模板名称 |

**返回：** `bool` - 是否成功注销

##### get

```python
template = registry.get(name)
```

**描述：** 获取模板

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| name | str | 是 | - | 模板名称 |

**返回：** `Optional[NotificationTemplate]`

##### render

```python
result = registry.render(template_name, **kwargs)
```

**描述：** 渲染模板为字符串

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| template_name | str | 是 | - | 模板名称 |
| **kwargs | Any | 是 | - | 模板变量 |

**返回：** `str` - 渲染后的消息

##### render_dict

```python
result = registry.render_dict(template_name, **kwargs)
```

**描述：** 渲染模板为字典

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| template_name | str | 是 | - | 模板名称 |
| **kwargs | Any | 是 | - | 模板变量 |

**返回：** `Dict[str, Any]`

##### list_template_names

```python
names = registry.list_template_names()
```

**描述：** 列出所有模板名称

**返回：** `list`

##### templates

```python
all_templates = registry.templates
```

**描述：** 获取所有模板

**返回：** `Dict[str, NotificationTemplate]`

---

## 快捷访问类

### NotificationTemplate (class)

**位置：** `FQBase/Core/notification_template.py`

**描述：** 提供类方法接口的快捷访问类，内部使用全局注册表

```python
from FQBase.Core.notification_template import NotificationTemplate
```

#### 类方法

##### render

```python
result = NotificationTemplate.render(template_name, **kwargs)
```

**描述：** 渲染模板（快捷方法）

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| template_name | str | 是 | - | 模板名称 |
| **kwargs | Any | 是 | - | 模板变量 |

**返回：** `str` - 渲染后的消息

**示例：**

```python
result = NotificationTemplate.render('trade_signal', strategy='均值回归', code='000001')
```

##### render_dict

```python
result = NotificationTemplate.render_dict(template_name, **kwargs)
```

**描述：** 渲染模板为字典

**返回：** `Dict[str, Any]`

##### register

```python
NotificationTemplate.register(template)
```

**描述：** 注册模板

##### get

```python
template = NotificationTemplate.get(name)
```

**描述：** 获取模板

**返回：** `Optional[NotificationTemplate]`

##### list_names

```python
names = NotificationTemplate.list_names()
```

**描述：** 列出所有模板名称

**返回：** `list`

---

## 预设模板

### 模板列表

| 模板名称 | 标题 | 变量 |
|---------|------|------|
| trade_signal | 【交易信号】 | strategy, code, price, time |
| risk_alert | 【风险预警】 | risk_type, details, time |
| system_error | 【系统异常】 | error_type, details, time |
| order_update | 【订单更新】 | order_id, code, direction, volume, status |
| position_update | 【持仓更新】 | code, volume, cost, market_value |
| account_update | 【账户更新】 | account_id, cash, total_asset, profit_loss |
| backtest_complete | 【回测完成】 | strategy, return_rate, sharpe, max_drawdown |
| data_alert | 【数据警告】 | data_type, code, issue, time |

## 相关文档

- [使用指南](./usage.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
