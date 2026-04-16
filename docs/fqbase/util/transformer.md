---
title: Transformer
description: 数据格式转换工具，提供Pandas、JSON、NumPy、List之间的相互转换
tag:
  - fqbase
  - util
  - utility

summary:
  type: utility
  complexity: minimal
  maturity: stable
  functions:
    - pandas_to_json
    - json_to_pandas
    - pandas_to_list
    - numpy_to_list
    - list_to_numpy
    - list_to_series
    - dict_to_json
    - json_to_dict
    - dict_to_df
    - df_to_dict
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "DataFrame与JSON互转用于API数据传输"
    - "List与NumPy数组互转"
  warnings:
    - "使用 B_to_A 命名风格"
  limitations:
    - "仅支持标准数据格式"

relationships:
  belongs_to:
    - fquant.fqbase.util
  depends_on: []
  import_path:
    - from FQBase.Util.transformer import pandas_to_json, json_to_pandas
---

# Transformer

## 一句话总览

📌 **数据格式转换工具，Pandas、JSON、NumPy、List互转**

**TL;DR**：
- 核心能力：DataFrame转JSON、JSON转DataFrame、List转NumPy
- 入门难度：🟢 简单

## 快速开始

```python
from FQBase.Util.transformer import pandas_to_json, json_to_pandas

json_data = pandas_to_json(df)
df = json_to_pandas(json_data)
```

## 函数列表

### pandas_to_json

```python
from FQBase.Util.transformer import pandas_to_json

result = pandas_to_json(data)
```

**描述：** 将 Pandas DataFrame 转换成 JSON 格式

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| data | pd.DataFrame | 是 | Pandas DataFrame |

**返回：** `List[Dict]` - JSON列表

**示例：**

```python
df = pd.DataFrame({'a': [1, 2, 3]})
json_data = pandas_to_json(df)
```

---

### json_to_pandas

```python
from FQBase.Util.transformer import json_to_pandas

result = json_to_pandas(data)
```

**描述：** 将 JSON 数据转换为 Pandas DataFrame

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| data | Dict \| List[Dict] | 是 | JSON数据 |

**返回：** `pd.DataFrame` - Pandas DataFrame

**示例：**

```python
df = json_to_pandas({'a': 1, 'b': 2})
```

---

### pandas_to_list

```python
from FQBase.Util.transformer import pandas_to_list

result = pandas_to_list(data)
```

**描述：** 将 Pandas DataFrame 转换为列表

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| data | pd.DataFrame | 是 | Pandas DataFrame |

**返回：** `List` - 列表

**示例：**

```python
lst = pandas_to_list(df)
```

---

### numpy_to_list

```python
from FQBase.Util.transformer import numpy_to_list

result = numpy_to_list(data)
```

**描述：** 将 NumPy 数组转换为列表

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| data | np.ndarray | 是 | NumPy数组 |

**返回：** `List` - 列表

**示例：**

```python
lst = numpy_to_list(np.array([1, 2, 3]))
```

---

### list_to_numpy

```python
from FQBase.Util.transformer import list_to_numpy

result = list_to_numpy(data)
```

**描述：** 将列表转换为 NumPy 数组

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| data | List | 是 | 列表数据 |

**返回：** `np.ndarray` - NumPy数组

**示例：**

```python
arr = list_to_numpy([1, 2, 3])
```

---

### list_to_series

```python
from FQBase.Util.transformer import list_to_series

result = list_to_series(data, index=None)
```

**描述：** 将列表转换为 Pandas Series

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| data | List | 是 | 列表数据 |
| index | List | 否 | 索引 |

**返回：** `pd.Series` - Pandas Series

**示例：**

```python
s = list_to_series([1, 2, 3], index=['a', 'b', 'c'])
```

---

### dict_to_json

```python
from FQBase.Util.transformer import dict_to_json

result = dict_to_json(data)
```

**描述：** 字典转 JSON 字符串

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| data | Dict | 是 | 字典数据 |

**返回：** `str` - JSON字符串

**示例：**

```python
json_str = dict_to_json({'key': 'value'})
```

---

### json_to_dict

```python
from FQBase.Util.transformer import json_to_dict

result = json_to_dict(json_str)
```

**描述：** JSON 字符串转字典

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| json_str | str | 是 | JSON字符串 |

**返回：** `Dict` - 字典

**示例：**

```python
data = json_to_dict('{"key": "value"}')
```

---

### dict_to_df

```python
from FQBase.Util.transformer import dict_to_df

result = dict_to_df(data, **kwargs)
```

**描述：** 字典列表转换为 DataFrame

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| data | List[Dict] | 是 | 字典列表 |
| **kwargs | - | 否 | pandas.DataFrame 参数 |

**返回：** `pd.DataFrame` - DataFrame

**示例：**

```python
df = dict_to_df([{'a': 1}, {'a': 2}])
```

---

### df_to_dict

```python
from FQBase.Util.transformer import df_to_dict

result = df_to_dict(df, orient='records')
```

**描述：** DataFrame 转换为字典

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| df | pd.DataFrame | 是 | DataFrame |
| orient | str | 否 | 转换格式，默认 'records' |

**返回：** `Union[List[Dict], Dict]` - 字典或字典列表

**示例：**

```python
d = df_to_dict(df, orient='records')
```

---

## 已移除的函数

以下函数已移除或迁移：

| 函数 | 原因 |
|------|------|
| resample_ohlc | 已移除 |
| fill_missing_dates | 已迁移到 FQData.Date.trade |

---

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01-01 | 初始版本 |
| v2.0.0 | 2024-xx-xx | 重命名函数为 B_to_A 风格，移除 resample_ohlc |
