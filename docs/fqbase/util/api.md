---
title: Util - API参考
description: Util API 参考文档
tag:
  - fquant
  - fqbase
  - util

summary:
  purpose: api-reference
  core_functions:
    - parse_number
    - safe_divide
    - percentage_change
    - format_percentage
    - dict_to_df
    - df_to_dict
    - pandas_to_json
    - json_to_pandas
    - file_md5
    - file_sha256
    - file_size
    - web_ping
    - check_url_accessible
    - random_string
    - random_stock_code
---

# Util - API参考

## 阅读路径

🔵 **开发者**：README → api → usage → concepts → examples

## 转换器 (converters)

### parse_number

**位置：** `Util/converters.py#L16`

```python
from FQBase.Util import parse_number

num = parse_number("123.45", default=0.0)
```

**参数：**

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| value | Any | - | 待解析的值 |
| default | float | 0.0 | 默认值 |

**返回：** `float`

---

### safe_divide

**位置：** `Util/converters.py#L34`

```python
from FQBase.Util import safe_divide

result = safe_divide(10, 3, default=0.0)
```

**参数：**

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| a | float | - | 被除数 |
| b | float | - | 除数 |
| default | float | 0.0 | 默认值 |

**返回：** `float`

---

### percentage_change

**位置：** `Util/converters.py`

```python
from FQBase.Util import percentage_change

change = percentage_change(110, 100)
```

---

### format_percentage

**位置：** `Util/converters.py`

```python
from FQBase.Util import format_percentage

formatted = format_percentage(0.1234)
```

---

## 格式化 (transformer)

### dict_to_df

**位置：** `Util/transformer.py`

```python
from FQBase.Util import dict_to_df

df = dict_to_df({'name': ['张三'], 'age': [25]})
```

---

### df_to_dict

**位置：** `Util/transformer.py`

```python
from FQBase.Util import df_to_dict

data = df_to_dict(df)
```

---

### pandas_to_json

**位置：** `Util/transformer.py#L20`

```python
from FQBase.Util import pandas_to_json

json_data = pandas_to_json(df)
```

---

### json_to_pandas

**位置：** `Util/transformer.py#L39`

```python
from FQBase.Util import json_to_pandas

df = json_to_pandas({'name': '张三', 'age': 25})
```

---

### pandas_to_list

**位置：** `Util/transformer.py`

```python
from FQBase.Util import pandas_to_list

data = pandas_to_list(df)
```

---

### numpy_to_list

**位置：** `Util/transformer.py`

```python
from FQBase.Util import numpy_to_list

data = numpy_to_list(arr)
```

---

### list_to_numpy

**位置：** `Util/transformer.py`

```python
from FQBase.Util import list_to_numpy

arr = list_to_numpy([1, 2, 3])
```

---

### list_to_series

**位置：** `Util/transformer.py`

```python
from FQBase.Util import list_to_series

series = list_to_series([1, 2, 3])
```

---

### dict_to_json

**位置：** `Util/transformer.py`

```python
from FQBase.Util import dict_to_json

json_str = dict_to_json({'name': '张三', 'age': 25})
```

---

### json_to_dict

**位置：** `Util/transformer.py`

```python
from FQBase.Util import json_to_dict

data = json_to_dict('{"name": "张三"}')
```

---

## 文件处理 (file)

### file_md5

**位置：** `Util/file.py`

```python
from FQBase.Util import file_md5

md5 = file_md5('/path/to/file.txt')
```

---

### file_sha256

**位置：** `Util/file.py`

```python
from FQBase.Util import file_sha256

sha256 = file_sha256('/path/to/file.txt')
```

---

### file_size

**位置：** `Util/file.py`

```python
from FQBase.Util import file_size

size = file_size('/path/to/file.txt')
```

---

### file_exists

**位置：** `Util/file.py`

```python
from FQBase.Util import file_exists

exists = file_exists('/path/to/file.txt')
```

---

### dir_exists

**位置：** `Util/file.py`

```python
from FQBase.Util import dir_exists

exists = dir_exists('/path/to/directory/')
```

---

### ensure_dir

**位置：** `Util/file.py`

```python
from FQBase.Util import ensure_dir

ensure_dir('/path/to/directory/')
```

---

## 网络工具 (network)

### web_ping

**位置：** `Util/network.py`

```python
from FQBase.Util import web_ping

is_reachable = web_ping('baidu.com')
```

---

### check_url_accessible

**位置：** `Util/network.py`

```python
from FQBase.Util import check_url_accessible

is_valid = check_url_accessible('https://www.example.com')
```

---

## 并行计算 (parallel)

### ParallelProcess

**位置：** `Util/parallel.py#L15`

```python
from FQBase.Util import ParallelProcess

runner = ParallelProcess(max_workers=4)
results = runner.map(my_function, data_list)
```

---

### ParallelThread

**位置：** `Util/parallel.py`

```python
from FQBase.Util import ParallelThread

runner = ParallelThread(max_workers=8)
results = runner.map(my_function, data_list)
```

---

## 加密/随机 (crypto)

### random_string

**位置：** `Util/crypto.py`

```python
from FQBase.Util import random_string

s = random_string(length=32)
```

---

### random_stock_code

**位置：** `Util/crypto.py#L29`

```python
from FQBase.Util import random_stock_code

codes = random_stock_code(stock_number=10, markets=['SH', 'SZ'])
```

---

## 验证器 (validators)

### validate_code

**位置：** `Util/validators.py#L17`

```python
from FQBase.Util.validators import validate_code

is_valid = validate_code('600000')
```

---

### validate_date

**位置：** `Util/validators.py#L32`

```python
from FQBase.Util.validators import validate_date

is_valid = validate_date('2024-01-01')
```

---

### validate_date_range

**位置：** `Util/validators.py#L49`

```python
from FQBase.Util.validators import validate_date_range

is_valid = validate_date_range('2024-01-01', '2024-12-31')
```

---

### validate_market

**位置：** `Util/validators.py`

```python
from FQBase.Util.validators import validate_market

is_valid = validate_market('SH')
```

---

### validate_frequency

**位置：** `Util/validators.py`

```python
from FQBase.Util.validators import validate_frequency

is_valid = validate_frequency('1d')
```

---

## 相关文档

- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
