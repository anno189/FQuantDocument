---
title: Util - 核心概念
description: 深入理解 Util 的核心概念
tag:
  - fquant
  - fqbase
  - util

summary:
  purpose: concepts
  core_concepts:
    - converter
    - transformer
    - parallel
---

# Util - 核心概念

## 阅读路径

🟢🔵 **新手+开发者**：README → quick-start → concepts → api → usage

## 概述

Util 模块包含多个核心概念，理解这些概念对于正确使用工具函数至关重要。

## 概念1：数据转换器 (Converter)

### 概念解释

将一种数据类型转换为另一种，处理异常情况。

### 代码示例

```python
from FQBase.Util.converters import parse_number, safe_divide

num = parse_number("123.45", default=0.0)
ratio = safe_divide(10, 3, default=0.0)
```

## 概念2：格式转换器 (Transformer)

### 概念解释

在不同数据格式之间转换，如 dict ↔ DataFrame ↔ JSON。

### 代码示例

```python
from FQBase.Util.transformer import dict_to_df, pandas_to_json

df = dict_to_df({'name': ['张三'], 'age': [25]})
json_data = pandas_to_json(df)
```

## 概念3：并行计算 (Parallel)

### 概念解释

使用多进程或多线程加速计算密集型任务。

### 代码示例

```python
from FQBase.Util.parallel import ParallelProcess

runner = ParallelProcess(max_workers=4)
results = runner.map(my_function, data_list)
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [API参考](./api.md)
