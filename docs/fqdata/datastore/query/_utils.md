# DataStore query _utils 模块

数据查询工具函数模块，提供日期处理、代码验证、结果格式化等辅助功能。

## 模块结构

```
_utils.py
```

---

## 日期处理

### _normalize_date

统一日期参数处理，自动转换为交易日期。

```python
from FQData.DataStore.query._utils import _normalize_date

date_str = _normalize_date('2024-01-01')  # '2024-01-02' (如果是交易日)

date_str = _normalize_date(None)  # 自动使用上一交易日

date_str = _normalize_date(None, default='2024-01-01')  # 使用指定默认日期
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `date_val` | Any | - | 日期值（str/date/datetime/None） |
| `default` | str | None | 默认日期 |

**返回：** str - YYYY-MM-DD 格式的交易日期

**处理规则：**
1. 如果 `date_val` 为 `None`，返回上一交易日（或 `default`）
2. 如果是字符串，截取前10个字符获取 YYYY-MM-DD 格式
3. 自动调用 `util_get_real_date` 确保返回的是交易日

---

## 代码验证

### _validate_code_list

验证并标准化代码列表。

```python
from FQData.DataStore.query._utils import _validate_code_list

codes = _validate_code_list('600000')  # ['600000']
codes = _validate_code_list(['600000', '000001'])  # ['600000', '000001']
codes = _validate_code_list(123)  # []
codes = _validate_code_list(None)  # []
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | str/List[str]/Any | 输入的代码 |

**返回：** List[str] - 标准化后的代码列表

**处理规则：**
- str: 包装为单元素列表
- list: 直接返回
- 其他: 返回空列表

---

## 频率映射

### _FREQUENCE_MAP

频率字符串映射表。

```python
from FQData.DataStore.query._utils import _FREQUENCE_MAP

freq = _FREQUENCE_MAP.get('5min')  # '5min'
freq = _FREQUENCE_MAP.get('5m')     # '5min'
freq = _FREQUENCE_MAP.get('1min')   # '1min'
freq = _FREQUENCE_MAP.get('60min') # '60min'
```

**支持的映射：**

| 键 | 值 |
|----|----|
| '1min', '1m' | '1min' |
| '5min', '5m' | '5min' |
| '15min', '15m' | '15min' |
| '30min', '30m' | '30min' |
| '60min', '60m' | '60min' |

---

## 结果处理

### _process_day_result

处理日线查询结果的公共逻辑。

```python
from FQData.DataStore.query._utils import _process_day_result

result = _process_day_result(res, format='pd', columns=['open', 'high', 'low', 'close'])
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `res` | pd.DataFrame | - | 查询结果 |
| `format` | str | 'pd' | 返回格式 |
| `columns` | List[str] | None | 需要保留的列 |
| `logger_name` | str | None | 日志名称前缀 |

**返回：** DataFrame/numpy/list/dict - 格式化后的数据

---

### _process_min_result

处理分钟线查询结果的公共逻辑。

```python
from FQData.DataStore.query._utils import _process_min_result

result = _process_min_result(res, format='pd')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `res` | pd.DataFrame | - | 查询结果 |
| `format` | str | 'pd' | 返回格式 |
| `logger_name` | str | None | 日志名称前缀 |

**返回：** DataFrame/numpy/list/dict - 格式化后的数据

---

### _return_format

根据格式返回数据。

```python
from FQData.DataStore.query._utils import _return_format

df = pd.DataFrame({'a': [1, 2, 3]})

pd_result = _return_format(df, 'pd')      # DataFrame
np_result = _return_format(df, 'numpy')  # numpy array
lst_result = _return_format(df, 'list')  # list
dict_result = _return_format(df, 'dict')  # dict
```

**支持的格式：**

| 格式 | 说明 |
|------|------|
| 'pd', 'pandas' | 返回 pandas DataFrame |
| 'numpy', 'n', 'np' | 返回 numpy 数组 |
| 'list', 'l' | 返回列表 |
| 'dict', 'd', 'json' | 返回字典 |

---

## 使用示例

### 日期标准化

```python
from FQData.DataStore.query._utils import _normalize_date

date_str = _normalize_date('2024-01-01')
date_str = _normalize_date('2024/01/01')
date_str = _normalize_date(None)
```

### 代码列表验证

```python
from FQData.DataStore.query._utils import _validate_code_list

codes = _validate_code_list('600000')
codes = _validate_code_list(['600000', '000001', '000002'])
codes = _validate_code_list(None)
```

### 频率映射

```python
from FQData.DataStore.query._utils import _FREQUENCE_MAP

for freq_input in ['5min', '5m', '1min', '60min']:
    freq = _FREQUENCE_MAP.get(freq_input, freq_input)
    print(f"{freq_input} -> {freq}")
```

---

## 相关文档

- [query/README](README.md)
- [query/query](query.md)