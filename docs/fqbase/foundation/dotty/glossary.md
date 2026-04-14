---
title: Dotty 嵌套字典 - 术语表
description: Dotty 术语定义与解释
tag:
  - fqbase
  - dotty
---

# Dotty 嵌套字典 - 术语表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[术语表](./glossary.md)** → [核心概念](./concepts.md) → [使用指南](./usage.md) |


## 概述

本文档定义 Dotty 模块中的核心术语。

## 术语

### Dotty

**定义：** Dotty 是 FQBase 中的嵌套字典访问工具类，提供点号(.)深度访问功能。

**示例：**

```python
from FQBase.Foundation import dotty
d = dotty({'user': {'name': '张三'}})
print(d['user.name'])  # 张三
```

### 点号访问（Dot Notation）

**定义：** 使用点号(`.`)作为分隔符，连接键名实现一键访问深层嵌套值。

**示例：**

```python
d['user.profile.name']  # 访问 user -> profile -> name
```

### 属性访问（Attribute Access）

**定义：** 通过点号语法像访问对象属性一样访问字典值。

**示例：**

```python
d.user.profile.name  # 等同于 d['user.profile.name']
```

### 深度赋值（Deep Assignment）

**定义：** 使用点号语法直接设置深层嵌套值，Dotty 会自动创建中间路径。

**示例：**

```python
d = dotty()
d['a.b.c'] = 'value'  # 自动创建 {'a': {'b': {'c': 'value'}}}
```

### 列表切片（List Slice）

**定义：** 使用切片语法访问列表的部分元素。

**示例：**

```python
d['items[0:2].name']  # 访问 items[0] 和 items[1] 的 name
```

### 字典包装器（Dictionary Wrapper）

**定义：** Dotty 内部将原字典包装，代理对其内容的访问。

**示例：**

```python
data = {'user': {'name': '张三'}}
d = dotty(data)
# d 是 data 的包装器，操作直接反映到 data
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
