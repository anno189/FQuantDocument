---
title: Dotty 嵌套字典 - 快速入门
description: 5分钟快速上手 Dotty 嵌套字典访问工具
tag:
  - fqbase
  - dotty

summary:
  purpose: quick-start
  complexity: low
---

# Dotty 嵌套字典 - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [术语表](./glossary.md) → [核心概念](./concepts.md) → [使用指南](./usage.md) |


## 概述

Dotty 是一个轻量级工具，提供对嵌套字典的点号深度访问功能。5分钟让您掌握基本用法。

## 前置要求

- Python 3.6+
- FQBase 已安装

## 5分钟上手

### Step 1: 导入模块

```python
from FQBase.Foundation import dotty
```

### Step 2: 创建 Dotty 实例

```python
# 方式1：从现有字典创建
data = {'user': {'name': '张三', 'age': 30}}
d = dotty(data)

# 方式2：创建空 Dotty
d = dotty()
```

### Step 3: 读取嵌套值

```python
# 使用点号访问
name = d['user.name']
print(name)  # 张三

# 或者使用属性访问
name = d.user.name
print(name)  # 张三
```

### Step 4: 修改嵌套值

```python
# 设置值
d['user.age'] = 31
print(d['user.age'])  # 31

# 属性方式
d.user.age = 32
print(d.user.age)  # 32
```

### Step 5: 完成！

```python
# 完整示例
from FQBase.Foundation import dotty

data = {'user': {'profile': {'name': '张三', 'age': 30}}}
d = dotty(data)

# 读取
print(d['user.profile.name'])  # 张三

# 修改
d['user.profile.age'] = 31

# 转回普通字典
result = d.to_dict()
print(result)  # {'user': {'profile': {'name': '张三', 'age': 31}}}
```

## ⚠️ 常见陷阱

### 陷阱 1：使用未定义的键

```python
# ❌ 错误：键不存在会返回 None
d = dotty({'user': {'name': '张三'}})
print(d['user.email'])  # None（不会报错！）

# ✅ 正确：使用 get 方法设置默认值
print(d.get('user.email', '未设置'))  # 未设置
```

### 陷阱 2：直接修改原字典

```python
# ⚠️ 注意：Dotty 直接修改原字典
data = {'user': {'name': '张三'}}
d = dotty(data)
d['user.age'] = 30

# 原字典也被修改了！
print(data)  # {'user': {'name': '张三', 'age': 30}}

# ✅ 正确：使用 copy() 创建副本
d = dotty(data.copy())
d['user.age'] = 30
print(data)  # {'user': {'name': '张三'}}（原字典不变）
```

### 陷阱 3：数字键访问

```python
data = {'items': [{'name': 'A'}, {'name': 'B'}]}
d = dotty(data)

# ❌ 错误：字符串索引
print(d['items.0.name'])  # KeyError

# ✅ 正确：数字索引
print(d['items[0].name'])  # A
# 或
print(d['items.0.name'])  # A（自动转换）
```

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [术语表](./glossary.md)
- 查看 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [术语表](./glossary.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
