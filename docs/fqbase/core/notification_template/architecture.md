# NotificationTemplate 架构文档

**模块路径**: `FQBase.Core.notification_template`
**源码**: [notification_template.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/notification_template.py)

---

## 一、整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        应用层代码                                │
│   NotificationTemplate.render('trade_signal', code='000001')   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│               NotificationTemplate (快捷类)                      │
│   render(), render_dict(), register(), get(), list_names()     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│            NotificationTemplateRegistry (单例)                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              _templates: Dict[str, Template]             │ │
│  │  trade_signal → NotificationTemplate                     │ │
│  │  risk_alert → NotificationTemplate                       │ │
│  │  ...                                                     │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  NotificationTemplate (数据类)                   │
│  name, title, body_template, level                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 二、组件架构

```
NotificationTemplateRegistry
├── _templates: Dict[str, NotificationTemplate]
│       └── {name: Template}
│
├── _register_default_templates()
│       └── 注册所有预设模板
│
└── 公共方法
        ├── register(template)
        ├── unregister(name)
        ├── get(name)
        ├── render(template_name, **kwargs)
        ├── render_dict(template_name, **kwargs)
        ├── templates (property)
        └── list_template_names()

NotificationTemplate (数据类)
├── name: str
├── title: str
├── body_template: str
├── level: str
│
└── 方法
        ├── render(**kwargs) -> str
        └── render_dict(**kwargs) -> Dict
```

---

## 三、渲染流程

```
NotificationTemplate.render('trade_signal', code='000001', price=12.50)
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│ 获取模板                                                        │
│ template = _registry.get('trade_signal')                      │
└───────────────────────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│ 渲染模板                                                        │
│ body = template.body_template.format(code='000001', price=12.50)│
└───────────────────────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│ 返回结果                                                        │
│ return f"【交易信号】\n股票: 000001\n价格: 12.5"               │
└───────────────────────────────────────────────────────────────┘
```
