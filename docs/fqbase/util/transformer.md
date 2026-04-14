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
    - to_json_from_pandas
    - to_json_from_dict
    - to_pandas_from_json
    - to_pandas_from_list
    - to_list_from_pandas
    - to_list_from_numpy
    - to_numpy_from_list
    - to_series_from_list
    - dict_to_json
    - json_to_dict
    - dict_to_df
    - df_to_dict
    - resample_ohlc
    - fill_missing_dates
---

# Transformer

## 一句话总览

📌 **数据格式转换工具，Pandas、JSON、NumPy、List互转**

**TL;DR**：
- 核心能力：DataFrame转JSON、JSON转DataFrame、List转NumPy、日期填充
- 入门难度：🟢 简单

## 快速开始

```python
from FQBase.Util.transformer import to_json_from_pandas, to_pandas_from_json

json_data = to_json_from_pandas(df)
df = to_pandas_from_json(json_data)
```

## 函数列表

### to_json_from_pandas

```python
from FQBase.Util.transformer import to_json_from_pandas

result = to_json_from_pandas(data)
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
json_data = to_json_from_pandas(df)
```

---

### to_json_from_dict

```python
from FQBase.Util.transformer import to_json_from_dict

result = to_json_from_dict(data)
```

**描述：** 将字典转换成 JSON 字符串（别名，推荐使用 dict_to_json）

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| data | Dict | 是 | 字典数据 |

**返回：** `str` - JSON字符串

**示例：**

```python
json_str = to_json_from_dict({'key': 'value'})
```

---

### to_pandas_from_json

```python
from FQBase.Util.transformer import to_pandas_from_json

result = to_pandas_from_json(data)
```

**描述：** 将 JSON 数据转换为 Pandas DataFrame

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| data | Dict \| List[Dict] | 是 | JSON数据 |

**返回：** `pd.DataFrame` - Pandas DataFrame

**示例：**

```python
df = to_pandas_from_json({'a': 1, 'b': 2})
```

---

### to_pandas_from_list

```python
from FQBase.Util.transformer import to_pandas_from_list

result = to_pandas_from_list(data)
```

**描述：** 将列表数据转换为 Pandas DataFrame

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| data | List | 是 | 列表数据 |

**返回：** `pd.DataFrame` - Pandas DataFrame

**示例：**

```python
df = to_pandas_from_list([1, 2, 3])
```

---

### to_list_from_pandas

```python
from FQBase.Util.transformer import to_list_from_pandas

result = to_list_from_pandas(data)
```

**描述：** 将 Pandas DataFrame 转换为列表

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| data | pd.DataFrame | 是 | Pandas DataFrame |

**返回：** `List` - 列表

**示例：**

```python
lst = to_list_from_pandas(df)
```

---

### to_list_from_numpy

```python
from FQBase.Util.transformer import to_list_from_numpy

result = to_list_from_numpy(data)
```

**描述：** 将 NumPy 数组转换为列表

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| data | np.ndarray | 是 | NumPy数组 |

**返回：** `List` - 列表

**示例：**

```python
lst = to_list_from_numpy(np.array([1, 2, 3]))
```

---

### to_numpy_from_list

```python
from FQBase.Util.transformer import to_numpy_from_list

result = to_numpy_from_list(data)
```

**描述：** 将列表转换为 NumPy 数组

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| data | List | 是 | 列表数据 |

**返回：** `np.ndarray` - NumPy数组

**示例：**

```python
arr = to_numpy_from_list([1, 2, 3])
```

---

### to_series_from_list

```python
from FQBase.Util.transformer import to_series_from_list

result = to_series_from_list(data, index=None)
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
s = to_series_from_list([1, 2, 3], index=['a', 'b', 'c'])
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

### resample_ohlc

```python
from FQBase.Util.transformer import resample_ohlc

result = resample_ohlc(df, freq, **kwargs)
```

**描述：** 重采样 OHLC 数据

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| df | pd.DataFrame | 是 | 原始 DataFrame，需包含 OHLCV 列 |
| freq | str | 是 | 重采样频率 ('1T', '5T', '1H', '1D' 等) |
| **kwargs | - | 否 | 其他参数 |

**返回：** `pd.DataFrame` - 重采样后的 DataFrame

**示例：**

```python
resampled = resample_ohlc(df, '1H')
```

---

### fill_missing_dates

```python
from FQBase.Util.transformer import fill_missing_dates

result = fill_missing_dates(df, start_date=None, end_date=None, date_column='date', fill_value=None)
```

**描述：** 填充缺失的日期

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| df | pd.DataFrame | 是 | DataFrame |
| start_date | str | 否 | 开始日期 |
| end_date | str | 否 | 结束日期 |
| date_column | str | 否 | 日期列名，默认 'date' |
| fill_value | Any | 否 | 填充值 |

**返回：** `pd.DataFrame` - 填充后的 DataFrame

**示例：**

```python
filled = fill_missing_dates(df, '2024-01-01', '2024-01-05')
```

---

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01-01 | 初始版本 |
