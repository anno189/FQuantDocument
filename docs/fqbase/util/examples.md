---
title: Util - 示例
description: Util 完整案例和动手实验
tag:
  - fquant
  - fqbase
  - util

summary:
  purpose: examples
---

# Util - 示例

## 阅读路径

🟢🔵 **新手+开发者**：README → quick-start → examples → concepts

## 案例1：数据处理流水线

```python
from FQBase.Util.converters import parse_number, percentage_change
from FQBase.Util.transformer import dict_to_df, pandas_to_json

data = {
    'symbol': ['AAPL', 'GOOGL', 'MSFT'],
    'price': ['150.25', '2800.50', '300.75'],
    'volume': ['1000000', '500000', '750000']
}

df = dict_to_df(data)
df['price'] = df['price'].apply(lambda x: parse_number(x, 0.0))
df['volume'] = df['volume'].apply(lambda x: parse_number(x, 0.0))

json_result = pandas_to_json(df)
print(f"Processed {len(json_result)} records")
```

## 案例2：批量文件哈希计算

```python
from FQBase.Util.file import file_md5, file_sha256
from FQBase.Util.parallel import ParallelProcess
import os

def hash_file(filepath):
    return {
        'file': filepath,
        'md5': file_md5(filepath),
        'sha256': file_sha256(filepath)
    }

files = [os.path.join('/data', f) for f in os.listdir('/data') if os.path.isfile(os.path.join('/data', f))]

runner = ParallelProcess(max_workers=4)
results = runner.map(hash_file, files)
```

## 相关文档

- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
- [API参考](./api.md)
