---
title: Util - 使用指南
description: Util 详细使用指南
tag:
  - fquant
  - fqbase
  - util

summary:
  purpose: usage
---

# Util - 使用指南

## 阅读路径

🔵 **开发者**：README → api → usage → concepts → examples

## 概述

本指南详细说明如何在各种场景下使用 Util 模块。

## 基本用法

### 数据转换

```python
from FQBase.Util.converters import parse_number, safe_divide

num = parse_number("123.45", default=0.0)
ratio = safe_divide(10, 3, default=0.0)
change = percentage_change(110, 100)
```

### 格式转换

```python
from FQBase.Util.transformer import dict_to_df, df_to_dict, pandas_to_json

df = dict_to_df({'name': ['张三', '李四'], 'age': [25, 30]})
json_data = pandas_to_json(df)
back = df_to_dict(df)
```

## 常见用例

### 用例 1: 批量文件处理

```python
from FQBase.Util.file import file_md5, ensure_dir
from FQBase.Util.parallel import ParallelProcess
import os

def compute_md5(filepath):
    return file_md5(filepath)

files = [f'/data/{f}' for f in os.listdir('/data')]
runner = ParallelProcess(max_workers=4)
md5_list = runner.map(compute_md5, files)
```

### 用例 2: 网络状态检测

```python
from FQBase.Util.network import web_ping, check_url_accessible

urls = ['https://api.example.com', 'https://backup.example.com']

for url in urls:
    if check_url_accessible(url):
        print(f"{url} is accessible")
```

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
