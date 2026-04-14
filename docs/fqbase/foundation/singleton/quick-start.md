---
title: 单例模式 - 快速入门
description: 5分钟快速上手单例模式
tag:
  - fqbase
  - singleton

summary:
  purpose: quick-start
  complexity: low
---

# 单例模式 - 快速入门

## 概述

单例模式确保类只有一个实例。

## 快速开始

```python
from FQBase.Foundation.singleton import Singleton
```

## 使用

```python
class MyClass(metaclass=Singleton):
    pass
```

## 相关文档

- [API参考](./api.md)
