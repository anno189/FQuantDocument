# Dotty 模块

嵌套字典点号访问工具，提供对嵌套字典的深度键值访问，使用点号(`.`)连接链式访问。

## 快速开始

### 基本用法

```python
from FQBase.Foundation import dotty

data = {'user': {'profile': {'name': '张三', 'age': 30}}}
d = dotty(data)

name = d['user.profile.name']
print(name)  # '张三'

d['user.profile.age'] = 31
print(d['user.profile.age'])  # 31
```

### 属性访问

```python
d = dotty({'user': {'name': '张三'}})

name = d.user.name
print(name)  # '张三'
```

### 列表访问

```python
data = {'users': [{'name': '张三'}, {'name': '李四'}]}
d = dotty(data)

print(d['users.0.name'])  # '张三'
print(d['users.1.name'])  # '李四'
```

## 核心功能

| 功能 | 说明 |
|------|------|
| 点号访问 | `d['a.b.c']` 访问深层嵌套 |
| 属性访问 | `d.a.b.c` 属性链式访问 |
| 列表索引 | `d['list.0']` 访问列表元素 |
| 切片操作 | `d['prices.0:3']` 列表切片 |
| 自动类型转换 | 数字字符串自动匹配键类型 |
| 直接修改 | 操作直接反映到原字典 |

## 文档索引

| 文档 | 说明 |
|------|------|
| [README](README.html) | 本文档，模块索引 |
| [框架](framework.html) | 模块架构与核心概念 |
| [架构](architecture.html) | 设计与工作流程 |
| [API](api.html) | 完整API参考 |
| [使用](usage.html) | 使用指南与示例 |
| [开发指南](development.html) | 开发环境、调试、测试 |
| [最佳实践](best-practices.html) | 开发建议与注意事项 |
| [设计](design.html) | 设计决策文档 |
| [FAQ](faq.html) | 常见问题解答 |

## 来源信息

本模块基于 [Pawel Zadrozny](https://github.com/pawelzny) 的 dotty 库，集成到 FQuant 框架。
