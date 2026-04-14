---
title: 重试机制 - 快速入门
description: 5分钟快速上手重试机制
tag:
  - fqbase
  - retry

summary:
  purpose: quick-start
  complexity: low
---

# 重试机制 - 快速入门

## 概述

重试机制提供失败自动重试功能。

## 快速开始

```python
from FQBase.Foundation.retry import retry
```

## 使用

```python
@retry(max_attempts=3)
def fetch_data():
    pass
```

## 相关文档

- [API参考](./api.md)
