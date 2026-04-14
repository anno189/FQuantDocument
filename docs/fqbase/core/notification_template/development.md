---
title: 通知模板 - 开发指南
description: 通知模板开发指南与贡献指南
tag:
  - fqbase
  - core
  - notification_template
---

# 通知模板 - 开发指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → **[开发指南](./development.md)** → [最佳实践](./best-practices.md) |


## 概述

本指南帮助开发者理解通知模板模块的内部实现，并提供开发贡献指导。

## 开发环境设置

### 前置要求

- Python 3.8+
- Git
- pip

### 设置

```bash
# 克隆仓库
git clone https://github.com/fquant/fquant.git
cd fquant

# 安装依赖
pip install -e FQuant.Server/FQBase
```

## 项目结构

```
FQBase/Core/
├── notification_template.py   # 模板实现
├── notification.py             # 通知服务
└── ...
```

## 代码规范

### 样式指南

- 遵循 PEP 8
- 使用类型提示
- 编写文档字符串

### 代码示例

```python
from typing import Dict, Any, Optional
from dataclasses import dataclass

@dataclass
class NotificationTemplate:
    """简短描述。

    更长的描述（如果需要）。

    参数:
        name: 模板名称
        title: 标题前缀
        body_template: 正文模板
        level: 通知级别

    示例:
        >>> template = NotificationTemplate(
        ...     name='test',
        ...     title='【测试】',
        ...     body_template='{content}',
        ...     level='info'
        ... )
        >>> template.render(content='Hello')
        'Hello'
    """

    name: str
    title: str
    body_template: str
    level: str = 'info'

    def render(self, **kwargs) -> str:
        """渲染模板

        参数:
            **kwargs: 模板变量

        返回:
            渲染后的消息
        """
        try:
            return self.body_template.format(**kwargs)
        except KeyError as e:
            return f"[Template Error: missing variable {e}] {self.body_template}"
```

## 扩展模板

### 添加新预设模板

```python
# 在 NotificationTemplateRegistry._register_default_templates() 中添加
self.register(NotificationTemplate(
    name='new_template',           # 模板名称
    title='【新模板】',            # 标题前缀
    body_template='{field1}\n{field2}',  # 模板内容
    level='info',                 # 通知级别
))
```

### 创建自定义模板类

```python
from typing import Dict, Any
from dataclasses import dataclass

@dataclass
class CustomTemplate:
    """自定义模板示例"""

    name: str
    fields: Dict[str, str]

    def render(self, data: Dict[str, Any]) -> str:
        """渲染自定义模板"""
        template = '\n'.join(f"{k}: {v}" for k, v in self.fields.items())
        return template.format(**data)
```

## 测试

### 运行测试

```bash
# 运行测试
pytest tests/

# 测试特定模块
pytest tests/fqbase/core/test_notification_template.py -v
```

### 编写测试

```python
import pytest
from FQBase.Core.notification_template import (
    NotificationTemplate,
    NotificationTemplateRegistry
)

class TestNotificationTemplate:
    def test_render_basic(self):
        """测试基本渲染"""
        template = NotificationTemplate(
            name='test',
            title='【测试】',
            body_template='{name}: {value}'
        )
        result = template.render(name='金额', value=100)
        assert result == "金额: 100"

    def test_render_missing_variable(self):
        """测试缺少变量"""
        template = NotificationTemplate(
            name='test',
            title='【测试】',
            body_template='{name}: {value}'
        )
        result = template.render(name='金额')
        assert 'Template Error' in result

    def test_render_dict(self):
        """测试渲染为字典"""
        template = NotificationTemplate(
            name='test',
            title='【测试】',
            body_template='{name}: {value}',
            level='info'
        )
        result = template.render_dict(name='金额', value=100)
        assert result['name'] == 'test'
        assert result['level'] == 'info'
        assert result['variables']['value'] == 100

class TestNotificationTemplateRegistry:
    def test_register_template(self):
        """测试注册模板"""
        registry = NotificationTemplateRegistry()
        template = NotificationTemplate(
            name='custom',
            title='【自定义】',
            body_template='{content}'
        )
        registry.register(template)
        assert registry.get('custom') is not None

    def test_unregister_template(self):
        """测试注销模板"""
        registry = NotificationTemplateRegistry()
        result = registry.unregister('trade_signal')
        assert result is True
        assert registry.get('trade_signal') is None

    def test_list_templates(self):
        """测试列出模板"""
        registry = NotificationTemplateRegistry()
        names = registry.list_template_names()
        assert 'trade_signal' in names
        assert 'risk_alert' in names
```

## 调试

### 启用调试日志

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("FQBase.Core.notification_template")
logger.setLevel(logging.DEBUG)
```

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 模板变量缺失 | 渲染时未提供所有必需的变量 | 检查变量名称是否匹配 |
| 模板不存在 | 使用了未注册的模板名称 | 先注册模板 |
| 渲染结果为空 | body_template 为空或变量未填充 | 检查模板定义 |

## 贡献

1. Fork 仓库
2. 创建功能分支
3. 进行更改
4. 添加测试
5. 提交 Pull Request

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
