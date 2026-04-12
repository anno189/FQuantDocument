# NotificationTemplate 设计文档

**模块路径**: `FQBase.Core.notification_template`
**源码**: [notification_template.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/notification_template.py)

---

## 一、数据类设计

```python
@dataclass
class NotificationTemplate:
    """通知消息模板"""
    name: str                    # 模板名称
    title: str                   # 消息标题
    body_template: str           # 消息体模板
    level: str = 'info'         # 消息级别
```

**决策**: 使用 `@dataclass` 简化数据类定义，自动生成 `__init__` 等方法。

---

## 二、注册表模式

```python
_registry = NotificationTemplateRegistry()  # 模块级单例

class NotificationTemplate:
    """通知模板快捷访问类"""
    @classmethod
    def render(cls, template_name: str, **kwargs) -> str:
        return _registry.render(template_name, **kwargs)
```

**决策**: 使用模块级注册表单例 + 快捷类，提供简洁的 API。

---

## 三、模板渲染安全

```python
def render(self, **kwargs) -> str:
    try:
        return self.body_template.format(**kwargs)
    except KeyError as e:
        return f"[Template Error: missing variable {e}] {self.body_template}"
```

**决策**: 模板变量缺失时返回错误信息，便于排查问题。

---

## 四、双重渲染输出

```python
def render(self, **kwargs) -> str:
    """渲染为纯文本"""

def render_dict(self, **kwargs) -> Dict[str, Any]:
    """渲染为结构化字典"""
    return {
        'name': self.name,
        'title': self.title,
        'body': self.render(**kwargs),
        'level': self.level,
        'variables': kwargs,
    }
```

**决策**: 同时支持纯文本和结构化字典输出，适应不同场景。
