---
title: Util - 快速入门
description: 5分钟快速上手 Util 模块
tag:
  - fquant
  - fqbase
  - util

summary:
  purpose: quick-start
  complexity: low
---

# Util - 快速入门

## 阅读路径

🟢 **新手入门**：README → quick-start → examples

## 概述

本快速入门指南将帮助您在 5 分钟内理解 Util 模块并开始使用。

## 前置要求

- Python 3.8+

## 5分钟上手

### Step 1: 数据转换

```python
from FQBase.Util.converters import parse_number, safe_divide

num = parse_number("123.45")
result = safe_divide(10, 3)
```

### Step 2: 格式转换

```python
from FQBase.Util.transformer import dict_to_df, df_to_dict

data = {'name': ['张三', '李四'], 'age': [25, 30]}
df = dict_to_df(data)
back = df_to_dict(df)
```

### Step 3: 文件处理

```python
from FQBase.Util.file import file_md5, ensure_dir

md5 = file_md5('/path/to/file.txt')
ensure_dir('/path/to/dir/')
```

### Step 4: 网络工具

```python
from FQBase.Util.network import web_ping, check_url_accessible

is_reachable = web_ping('baidu.com')
is_valid = check_url_accessible('https://www.example.com')
```

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [API参考](./api.md)
- 查看 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [API参考](./api.md)
- [核心概念](./concepts.md)
