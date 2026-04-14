---
title: Dotty 嵌套字典 - 核心概念
description: 深入理解 Dotty 的核心概念
tag:
  - fqbase
  - dotty
---

# Dotty 嵌套字典 - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [术语表](./glossary.md) → **[核心概念](./concepts.md)** → [使用指南](./usage.md) |
| 🔵 开发者 | [README](./README.md) → [使用指南](./usage.md) → **[核心概念](./concepts.md)** → [API参考](./api.md) |


## 概述

Dotty 是一个字典包装器，提供对嵌套字典的点号深度访问能力。本文档深入解释其核心概念。

## 概念 1: 点号访问

### 概念解释

使用点号(`.`)连接键名，实现一键访问深层嵌套值。

### 原理

```
传统方式：
data = {'user': {'profile': {'name': '张三'}}}
name = data['user']['profile']['name']  # 多次索引

Dotty 方式：
d = dotty({'user': {'profile': {'name': '张三'}}})
name = d['user.profile.name']  # 一次访问
```

### 代码示例

```python
from FQBase.Foundation import dotty

data = {
    'user': {
        'profile': {
            'name': '张三',
            'age': 30
        }
    }
}

d = dotty(data)

# 点号访问
print(d['user.profile.name'])  # 张三
print(d['user.profile.age'])   # 30
```

## 概念 2: 属性访问

### 概念解释

除了使用 `[]` 访问，还可以像访问对象属性一样访问嵌套值。

### 代码示例

```python
d = dotty({'user': {'name': '张三'}})

# 属性访问
print(d.user.name)  # 张三

# 混合访问
print(d['user'].name)  # 张三
```

### 注意事项

- 属性访问使用 `__getattr__` 实现
- 键名不能以下划线(`_`)开头
- 如果键不存在，返回 `None`

## 概念 3: 深度赋值

### 概念解释

使用点号语法直接设置深层嵌套值，Dotty 会自动创建中间路径。

### 代码示例

```python
d = dotty()

# 深度赋值，自动创建中间结构
d['user.profile.name'] = '张三'
d['user.profile.age'] = 30

print(d.to_dict())
# {'user': {'profile': {'name': '张三', 'age': 30}}}
```

### 自动创建中间节点

```python
d = dotty()

# 逐层创建
d['a.b.c'] = 'value'

print(d.to_dict())
# {'a': {'b': {'c': 'value'}}}
```

## 概念 4: 列表索引与切片

### 概念解释

Dotty 支持对列表类型使用索引和切片操作。

### 代码示例

```python
data = {
    'items': [
        {'name': 'A', 'price': 10},
        {'name': 'B', 'price': 20},
        {'name': 'C', 'price': 30}
    ]
}
d = dotty(data)

# 索引访问
print(d['items.0.name'])  # A
print(d['items.1.name'])  # B

# 切片操作
print(d['items[0:2].name'])  # ['A', 'B']
print(d['items[::2].name'])   # ['A', 'C']
```

## 概念 5: 类型自动推断

### 概念解释

Dotty 能自动推断键的类型（字符串或数字），方便访问混合类型数据。

### 代码示例

```python
data = {
    'users': {
        0: {'name': '张三'},
        1: {'name': '李四'},
        'name': '全局名称'
    }
}
d = dotty(data)

# 自动推断为数字索引
print(d['users.0.name'])  # 张三
print(d['users.1.name'])  # 李四

# 字符串键
print(d['users.name'])     # 全局名称
```

## 概念 6: JSON 序列化

### 概念解释

Dotty 提供 `to_json()` 和 `to_dict()` 方法，方便与 JSON 数据互转。

### 代码示例

```python
d = dotty({'user': {'name': '张三'}})

# 转 JSON 字符串
json_str = d.to_json()
print(json_str)  # {"user": {"name": "张三"}}

# 转普通字典
plain_dict = d.to_dict()
print(plain_dict)  # {'user': {'name': '张三'}}
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [术语表](./glossary.md)
- [使用指南](./usage.md)
- [API参考](./api.md)
