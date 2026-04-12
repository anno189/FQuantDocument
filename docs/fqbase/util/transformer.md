# Transformer 模块

数据格式转换工具，提供 DataFrame、JSON、字典、列表、numpy 数组之间的转换功能。

## DataFrame 转换

### dict_to_df

字典列表转换为 DataFrame。

```python
from FQBase.Util import dict_to_df

data = [
    {'name': 'Alice', 'age': 30},
    {'name': 'Bob', 'age': 25}
]

df = dict_to_df(data)
#     name  age
# 0  Alice   30
# 1    Bob   25
```

---

### df_to_dict

DataFrame 转换为字典。

```python
from FQBase.Util import df_to_dict

df = dict_to_df([{'name': 'Alice', 'age': 30}])

# 转换为字典列表
dicts = df_to_dict(df, orient='records')
# [{'name': 'Alice', 'age': 30}]

# 转换为字典
d = df_to_dict(df, orient='dict')
# {'name': {0: 'Alice'}, 'age': {0: 30}}
```

---

## JSON 转换

### to_json_from_pandas

DataFrame 转换为 JSON。

```python
from FQBase.Util import to_json_from_pandas

df = dict_to_df([{'name': 'Alice', 'age': 30}])
json_data = to_json_from_pandas(df)
# [{'name': 'Alice', 'age': 30}]
```

---

### to_pandas_from_json

JSON 转换为 DataFrame。

```python
from FQBase.Util import to_pandas_from_json

# 单个字典
json_data = {'name': 'Alice', 'age': 30}
df = to_pandas_from_json(json_data)

# 字典列表
json_data = [{'name': 'Alice', 'age': 30}, {'name': 'Bob', 'age': 25}]
df = to_pandas_from_json(json_data)
```

---

### dict_to_json

字典转 JSON 字符串。

```python
from FQBase.Util import dict_to_json

data = {'name': 'Alice', 'age': 30}
json_str = dict_to_json(data)
# '{"name": "Alice", "age": 30}'
```

---

### json_to_dict

JSON 字符串转字典。

```python
from FQBase.Util import json_to_dict

json_str = '{"name": "Alice", "age": 30}'
data = json_to_dict(json_str)
# {'name': 'Alice', 'age': 30}
```

---

## 列表转换

### to_list_from_pandas

DataFrame 转换为列表。

```python
from FQBase.Util import to_list_from_pandas

df = dict_to_df([{'a': 1, 'b': 2}, {'a': 3, 'b': 4}])
lst = to_list_from_pandas(df)
# [[1, 2], [3, 4]]
```

---

### to_list_from_numpy

numpy 数组转换为列表。

```python
from FQBase.Util import to_list_from_numpy
import numpy as np

arr = np.array([1, 2, 3, 4, 5])
lst = to_list_from_numpy(arr)
# [1, 2, 3, 4, 5]
```

---

### to_numpy_from_list

列表转换为 numpy 数组。

```python
from FQBase.Util import to_numpy_from_list

lst = [1, 2, 3, 4, 5]
arr = to_numpy_from_list(lst)
# array([1, 2, 3, 4, 5])
```

---

### to_series_from_list

列表转换为 pandas Series。

```python
from FQBase.Util import to_series_from_list

lst = [10, 20, 30, 40, 50]
series = to_series_from_list(lst)

# 带索引
series = to_series_from_list(lst, index=['a', 'b', 'c', 'd', 'e'])
# a    10
# b    20
# c    30
# d    40
# e    50
```

---

## OHLC 处理

### resample_ohlc

重采样 OHLC 数据。

```python
from FQBase.Util import resample_ohlc, dict_to_df

# 1 分钟线数据
df_1min = dict_to_df([
    {'date': '2024-01-01 09:30', 'open': 100, 'high': 101, 'low': 99, 'close': 100, 'volume': 1000},
    {'date': '2024-01-01 09:31', 'open': 100, 'high': 102, 'low': 99, 'close': 101, 'volume': 1500},
    # ... 更多数据
])

# 重采样为 5 分钟线
df_5min = resample_ohlc(df_1min, '5T')
```

**要求**：
- DataFrame 必须包含 `open`, `high`, `low`, `close`, `volume` 列
- 或包含 `date` 列用于设置索引

---

### fill_missing_dates

填充缺失的日期。

```python
from FQBase.Util import fill_missing_dates, dict_to_df

df = dict_to_df([
    {'date': '2024-01-01', 'value': 100},
    {'date': '2024-01-03', 'value': 200},  # 01-02 缺失
    {'date': '2024-01-05', 'value': 300},  # 01-04 缺失
])

# 填充缺失日期
filled = fill_missing_dates(df, '2024-01-01', '2024-01-05', fill_value=0)
# 会填充 01-02, 01-04 的数据
```

---

## 使用示例

### 数据导入导出

```python
from FQBase.Util import dict_to_df, df_to_dict, dict_to_json, json_to_dict

# 读取数据
data = json_to_dict(file_content)
df = dict_to_df(data)

# 处理数据
df['normalized'] = (df['value'] - df['value'].mean()) / df['value'].std()

# 导出数据
result = df_to_dict(df, orient='records')
json_output = dict_to_json(result)
```

### 批量数据处理

```python
from FQBase.Util import to_pandas_from_json, to_json_from_pandas, resample_ohlc
import json

# 从 API 获取的 JSON 数据
api_response = json.loads(response_text)
df = to_pandas_from_json(api_response)

# 重采样
daily_data = resample_ohlc(df, '1D')

# 导出
output_json = to_json_from_pandas(daily_data)
```

### numpy 数据交互

```python
from FQBase.Util import to_numpy_from_list, to_list_from_numpy, to_series_from_list
import numpy as np

# 列表转 numpy 进行计算
prices = [100, 101, 102, 101, 103]
np_prices = to_numpy_from_list(prices)

# 计算收益
returns = np.diff(np_prices) / np_prices[:-1]

# 转回列表
return_list = to_list_from_numpy(returns)

# 或转 Series 带日期索引
dates = ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04']
prices_series = to_series_from_list(prices, index=dates)
```

---

## 相关文档

- [Util 模块](../README.md)
- [数据转换](../converters.md)
- [并行计算](../parallel.md)