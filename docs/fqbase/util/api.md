---
title: Util - API参考
description: Util 跨模块工具层 API 参考文档
tag:
  - fqbase
  - util
---

# Util - API参考

> **注意**: 部分功能已迁移到 FQData 模块
> - 股票代码格式转换 → `FQData.normalizer`
> - K线时间索引 → `FQData.DataStruct`

## 子模块索引

| 子模块 | 主要函数 |
|--------|---------|
| crypto | random_stock_code, random_string, random_with_topic |
| file | file_md5, file_sha256, file_size, file_exists, dir_exists, ensure_dir |
| network | web_ping, check_url_accessible |
| parallel | ParallelProcess, ParallelThread |
| converters | date_to_str, str_to_date, normalize_code, parse_number, safe_divide, percentage_change, format_percentage |
| transformer | dict_to_df, df_to_dict, pandas_to_json, json_to_pandas, pandas_to_list, numpy_to_list, list_to_numpy, list_to_series, dict_to_json, json_to_dict |

---

## crypto - 随机数生成

### random_stock_code
```python
random_stock_code(stock_number: int = 10, markets: Optional[List[str]] = None) -> List[str]
```
随机生成股票代码

### random_string
```python
random_string(topic: str = 'Acc', length: int = 8) -> str
```
生成随机字符串（加密安全）

### random_with_topic
```python
random_with_topic(topic: str = 'Acc', length: int = 8) -> str
```
生成带前缀的随机字符串（加密安全）

---

## file - 文件处理

### file_md5
```python
file_md5(filename: str) -> Optional[str]
```
计算文件 MD5

### file_sha256
```python
file_sha256(filename: str) -> Optional[str]
```
计算文件 SHA256

### file_size
```python
file_size(filename: str) -> Optional[int]
```
获取文件大小

### file_exists
```python
file_exists(path: str) -> bool
```
检查文件是否存在

### dir_exists
```python
dir_exists(path: str) -> bool
```
检查目录是否存在

### ensure_dir
```python
ensure_dir(path: str) -> bool
```
确保目录存在

---

## network - 网络工具

### web_ping
```python
web_ping(url: str, count: int = 1) -> Optional[int]
```
Ping URL

### check_url_accessible
```python
check_url_accessible(url: str, timeout: int = 5) -> bool
```
检查 URL 是否可访问

---

## parallel - 并行计算

### ParallelProcess
```python
class ParallelProcess(max_workers: Optional[int] = None)
```
多进程并行计算

### ParallelThread
```python
class ParallelThread(max_workers: Optional[int] = None)
```
多线程并行计算

---

## converters - 数据转换

### date_to_str
```python
date_to_str(date: Any, fmt: str = '%Y-%m-%d') -> str
```
日期转字符串

### str_to_date
```python
str_to_date(date_str: str, fmt: str = '%Y-%m-%d') -> datetime
```
字符串转日期

### normalize_code
```python
normalize_code(code: str) -> str
```
标准化股票代码

### parse_number
```python
parse_number(value: Any, default: float = 0.0) -> float
```
解析数字

### safe_divide
```python
safe_divide(a: float, b: float, default: float = 0.0) -> float
```
安全除法

### percentage_change
```python
percentage_change(current: float, previous: float) -> float
```
计算百分比变化

### format_percentage
```python
format_percentage(value: float, decimals: int = 2) -> str
```
格式化百分比

---

## transformer - 格式转换

### dict_to_df
```python
dict_to_df(data: List[Dict], **kwargs) -> pd.DataFrame
```
字典列表转 DataFrame

### df_to_dict
```python
df_to_dict(df: pd.DataFrame, orient: str = 'records') -> Union[List[Dict], Dict]
```
DataFrame 转字典

### pandas_to_json
```python
pandas_to_json(data: pd.DataFrame) -> List[Dict]
```
DataFrame 转 JSON

### json_to_pandas
```python
json_to_pandas(data: Union[Dict, List[Dict]]) -> pd.DataFrame
```
JSON 转 DataFrame

### pandas_to_list
```python
pandas_to_list(data: pd.DataFrame) -> List
```
DataFrame 转列表

### numpy_to_list
```python
numpy_to_list(data: np.ndarray) -> List
```
numpy 数组转列表

### list_to_numpy
```python
list_to_numpy(data: List) -> np.ndarray
```
列表转 numpy 数组

### list_to_series
```python
list_to_series(data: List, index: List = None) -> pd.Series
```
列表转 Series

### dict_to_json
```python
dict_to_json(data: Dict) -> str
```
字典转 JSON 字符串

### json_to_dict
```python
json_to_dict(json_str: str) -> Dict
```
JSON 字符串转字典

---

## 已迁移功能

以下功能已迁移到 FQData 模块：

| 原位置 | 新位置 | 函数 |
|--------|--------|------|
| Util.codec | FQData.normalizer | code_to_6digit, code_to_jqformat, code_adjust_ctp, code_to_list |
| Util.bar | FQData.DataStruct | make_min_index, make_hour_index, make_future_min_index, time_gap |

---

## 相关文档

- [使用指南](./usage.md)
