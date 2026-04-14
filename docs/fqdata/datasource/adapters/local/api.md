# Local 适配器 API 参考

## 概述

本文档提供 Local 适配器的完整 API 参考，包括所有类和方法的详细说明。

---

## 模块导入

```python
from FQData.DataSource.adapters.local import (
    LocalAdapter,
    CSVReader,
)
```

---

## LocalAdapter

### 类签名

```python
class LocalAdapter(DataSourceAdapter)
```

本地文件数据适配器基类，提供基础的本地文件读写功能。

```python
from FQData.DataSource.adapters.local import LocalAdapter

adapter = LocalAdapter(base_path="/data")
```

### 构造函数

#### `__init__(name: str = "local", base_path: Optional[str] = None)`

初始化 Local 适配器。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `str` | `"local"` | 适配器名称 |
| `base_path` | `str` | `None` | 基础路径，相对路径以此为基准 |

**示例：**

```python
adapter = LocalAdapter()
adapter = LocalAdapter(base_path="/data")
adapter = LocalAdapter(base_path="./data", name="my_local")
```

### 属性

| 属性 | 类型 | 只读 | 说明 |
|------|------|------|------|
| `name` | `str` | 是 | 适配器名称 |
| `is_connected` | `bool` | 是 | 连接状态 |
| `_base_path` | `Path` | 否 | 基础路径 |

### 方法

#### `set_base_path(base_path: str) -> None`

设置基础路径。

```python
adapter.set_base_path("/new/data/path")
```

#### `get_base_path() -> Optional[Path]`

获取基础路径。

```python
path = adapter.get_base_path()
print(f"基础路径: {path}")
```

#### `file_exists(file_path: Union[str, Path]) -> bool`

检查文件是否存在。

```python
exists = adapter.file_exists("data.csv")
```

#### `read_csv(file_path: Union[str, Path], encoding: str = "utf-8", **kwargs) -> Optional[pd.DataFrame]`

读取 CSV 文件。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `file_path` | `str` 或 `Path` | 必填 | 文件路径 |
| `encoding` | `str` | `"utf-8"` | 文件编码 |
| `**kwargs` | - | - | 传递给 `pd.read_csv` 的其他参数 |

**返回值：** `Optional[pd.DataFrame]` - 读取成功返回 DataFrame，失败返回 `None`

**示例：**

```python
df = adapter.read_csv("stock_data.csv")
df = adapter.read_csv("/data/stock_data.csv", encoding="gbk")
df = adapter.read_csv("data.csv", sep="\t")
```

---

#### `read_csv_with_date(file_path: Union[str, Path], date_column: str = "date", encoding: str = "utf-8", **kwargs) -> Optional[pd.DataFrame]`

读取 CSV 文件并转换日期列。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `file_path` | `str` 或 `Path` | 必填 | 文件路径 |
| `date_column` | `str` | `"date"` | 日期列名 |
| `encoding` | `str` | `"utf-8"` | 文件编码 |

**返回值：** `Optional[pd.DataFrame]` - 日期列已转换为 datetime 类型

**示例：**

```python
df = adapter.read_csv_with_date("daily.csv", date_column="date")
```

---

#### `write_csv(df: pd.DataFrame, file_path: Union[str, Path], encoding: str = "utf-8", **kwargs) -> bool`

写入 CSV 文件。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `df` | `pd.DataFrame` | 必填 | 要写入的数据 |
| `file_path` | `str` 或 `Path` | 必填 | 文件路径 |
| `encoding` | `str` | `"utf-8"` | 文件编码 |
| `**kwargs` | - | - | 传递给 `df.to_csv` 的其他参数 |

**返回值：** `bool` - 写入成功返回 `True`，失败返回 `False`

**示例：**

```python
success = adapter.write_csv(df, "output.csv")
success = adapter.write_csv(df, "/data/output.csv", encoding="gbk")
```

---

#### `list_files(pattern: str = "*") -> List[Path]`

列出匹配的文件。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `pattern` | `str` | `"*"` | glob 模式 |

**返回值：** `List[Path]` - 匹配的文件路径列表

**示例：**

```python
files = adapter.list_files("*.csv")
files = adapter.list_files("stock_*.csv")
files = adapter.list_files("**/*.csv")  # 递归
```

---

#### `health_check() -> bool`

健康检查。

**返回值：** `bool` - 适配器是否正常

**示例：**

```python
if adapter.health_check():
    print("适配器正常")
```

---

## CSVReader

### 类签名

```python
class CSVReader(LocalAdapter)
```

CSV 文件读取器，继承自 LocalAdapter，提供高级 CSV 读取功能。

```python
from FQData.DataSource.adapters.local import CSVReader

reader = CSVReader(
    base_path="/data",
    default_encoding="utf-8",
    default_date_format="%Y-%m-%d"
)
```

### 构造函数

#### `__init__(base_path: Optional[str] = None, default_encoding: str = "utf-8", default_date_format: str = "%Y-%m-%d")`

初始化 CSV 读取器。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `base_path` | `str` | `None` | 基础路径 |
| `default_encoding` | `str` | `"utf-8"` | 默认编码 |
| `default_date_format` | `str` | `"%Y-%m-%d"` | 默认日期格式 |

---

### 方法

#### `read(file_path: Union[str, Path], encoding: Optional[str] = None, **kwargs) -> Optional[pd.DataFrame]`

读取 CSV 文件。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `file_path` | `str` 或 `Path` | 必填 | 文件路径 |
| `encoding` | `str` | `None` | 编码，None 则使用默认值 |
| `**kwargs` | - | - | 传递给 `pd.read_csv` 的参数 |

**返回值：** `Optional[pd.DataFrame]`

**示例：**

```python
df = reader.read("data.csv")
df = reader.read("data.csv", encoding="gbk")
```

---

#### `read_with_date_parse(file_path: Union[str, Path], date_columns: Union[str, List[str]] = None, date_format: Optional[str] = None, encoding: Optional[str] = None, **kwargs) -> Optional[pd.DataFrame]`

读取 CSV 文件并解析日期列。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `file_path` | `str` 或 `Path` | 必填 | 文件路径 |
| `date_columns` | `str` 或 `List[str]` | `None` | 日期列名，None 则自动检测 |
| `date_format` | `str` | `None` | 日期格式，None 则自动解析 |
| `encoding` | `str` | `None` | 编码 |
| `**kwargs` | - | - | 传递给 `pd.read_csv` 的参数 |

**自动检测的日期列名：**

- `date`, `datetime`, `时间`, `日期`
- `tradedate`, `trade_date`

**返回值：** `Optional[pd.DataFrame]`

**示例：**

```python
df = reader.read_with_date_parse("daily.csv")
df = reader.read_with_date_parse("daily.csv", date_columns=["date", "trade_time"])
df = reader.read_with_date_parse("daily.csv", date_format="%Y/%m/%d")
```

---

#### `read_date_range(file_path: Union[str, Path], start: Optional[str] = None, end: Optional[str] = None, date_column: str = "date", encoding: Optional[str] = None, **kwargs) -> Optional[pd.DataFrame]`

读取 CSV 文件并按日期范围过滤。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `file_path` | `str` 或 `Path` | 必填 | 文件路径 |
| `start` | `str` | `None` | 开始日期（包含） |
| `end` | `str` | `None` | 结束日期（包含） |
| `date_column` | `str` | `"date"` | 日期列名 |
| `encoding` | `str` | `None` | 编码 |

**返回值：** `Optional[pd.DataFrame]`

**示例：**

```python
df = reader.read_date_range("daily.csv", "2024-01-01", "2024-12-31")
df = reader.read_date_range("daily.csv", start="2024-01-01")
df = reader.read_date_range("daily.csv", end="2024-06-30")
```

---

#### `read_columns(file_path: Union[str, Path], columns: List[str], encoding: Optional[str] = None, **kwargs) -> Optional[pd.DataFrame]`

读取 CSV 文件指定列。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `file_path` | `str` 或 `Path` | 必填 | 文件路径 |
| `columns` | `List[str]` | 必填 | 要读取的列名 |
| `encoding` | `str` | `None` | 编码 |

**返回值：** `Optional[pd.DataFrame]`

**示例：**

```python
df = reader.read_columns("daily.csv", ["date", "open", "high", "low", "close"])
```

---

#### `read_with_filter(file_path: Union[str, Path], filters: Dict[str, Any], encoding: Optional[str] = None, **kwargs) -> Optional[pd.DataFrame]`

读取 CSV 文件并按条件过滤。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `file_path` | `str` 或 `Path` | 必填 | 文件路径 |
| `filters` | `Dict[str, Any]` | 必填 | 过滤条件 |
| `encoding` | `str` | `None` | 编码 |

**filters 参数格式：**

```python
filters = {
    "code": "600000",              # 精确匹配
    "volume": (1000, 10000),       # 范围匹配
}
```

**返回值：** `Optional[pd.DataFrame]`

**示例：**

```python
df = reader.read_with_filter("daily.csv", {"code": "600000"})
df = reader.read_with_filter("daily.csv", {"volume": (1000, 5000)})
df = reader.read_with_filter("daily.csv", {"code": "600000", "volume": (1000, 5000)})
```

---

#### `get_info(file_path: Union[str, Path]) -> Optional[Dict[str, Any]]`

获取 CSV 文件信息。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `file_path` | `str` 或 `Path` | 是 | 文件路径 |

**返回值：** `Optional[Dict[str, Any]]`

**返回字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `path` | `str` | 文件完整路径 |
| `size_bytes` | `int` | 文件大小（字节） |
| `modified_time` | `datetime` | 修改时间 |
| `columns` | `List[str]` | 列名列表 |
| `row_count_estimate` | `int` | 行数估算 |

**示例：**

```python
info = reader.get_info("daily.csv")
print(f"文件: {info['path']}")
print(f"大小: {info['size_bytes']} bytes")
print(f"列: {info['columns']}")
print(f"行数: {info['row_count_estimate']}")
```

---

## 异常

Local 适配器不抛出异常，失败时返回 `None` 或 `False`。如需处理错误，请检查返回值：

```python
df = adapter.read_csv("file.csv")
if df is None:
    print("读取失败")

success = adapter.write_csv(df, "file.csv")
if not success:
    print("写入失败")
```

---

## 常量

### 日期列自动检测列表

```python
common_date_names = [
    "date", "datetime", "时间", "日期",
    "tradedate", "trade_date"
]
```

---

## 相关文档

- [Local README](README.md)
- [Local 框架文档](framework.md)
- [Local 架构说明](architecture.md)
- [Local 设计文档](design.md)
- [Local 使用指南](usage.md)
- [Local 最佳实践](best-practices.md)
- [Local FAQ](faq.md)
- [Local 更新日志](changelog.md)
- [DataSource 模块](../README.md)
- [DataSource API](../api.md)
- [适配器索引](./README.md)
