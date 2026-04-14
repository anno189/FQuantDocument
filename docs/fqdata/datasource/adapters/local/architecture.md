# Local 适配器架构说明

## 概述

Local 适配器是 FQData 框架中的本地文件数据访问组件，专门用于读取本地 CSV 文件数据。本文档详细说明其技术架构和设计决策。

---

## 整体架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           应用层                                        │
│                    DataStore / DataStruct / API                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         适配器层                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │LocalAdapter  │  │ TdxAdapter  │  │AkShareAdapter│  │EastMoney...│ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘ │
│         │                                                                   │
│         ▼                                                                   │
│  ┌──────────────┐                                                          │
│  │  CSVReader   │  (继承自 LocalAdapter)                                   │
│  └──────────────┘                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          文件系统                                         │
│                    本地 CSV 文件 / 其他数据文件                            │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 核心组件

### 1. LocalAdapter - 本地文件适配器基类

**位置：** `FQData/DataSource/adapters/local/base.py`

**职责：**

| 职责 | 说明 |
|------|------|
| 路径解析 | 支持绝对路径和相对路径 |
| 文件操作 | CSV 文件的读写 |
| 连接状态 | 管理适配器的连接状态 |

**类图：**

```
LocalAdapter
├── _name: str
├── _base_path: Path
├── _connected: bool
├── __init__(name, base_path)
├── _connect()
├── set_base_path(base_path)
├── get_base_path()
├── _resolve_path(file_path)
├── file_exists(file_path)
├── read_csv(file_path, encoding, **kwargs)
├── read_csv_with_date(file_path, date_column, encoding)
├── write_csv(df, file_path, encoding)
├── list_files(pattern)
└── health_check()
```

### 2. CSVReader - CSV 读取器

**位置：** `FQData/DataSource/adapters/local/csv_reader.py`

**继承关系：**

```
LocalAdapter
    │
    └── CSVReader
```

**职责：**

| 职责 | 说明 |
|------|------|
| 日期解析 | 自动检测和解析日期列 |
| 数据过滤 | 支持多种数据过滤方式 |
| 范围查询 | 按日期范围读取数据 |

**类图：**

```
CSVReader
├── _default_encoding: str
├── _default_date_format: str
├── __init__(base_path, default_encoding, default_date_format)
├── read(file_path, encoding, **kwargs)
├── read_with_date_parse(file_path, date_columns, date_format, encoding)
├── read_date_range(file_path, start, end, date_column, encoding)
├── read_columns(file_path, columns, encoding)
├── read_with_filter(file_path, filters, encoding)
├── _detect_date_columns(df)
├── _parse_dates(df, date_columns, date_format)
└── get_info(file_path)
```

---

## 路径解析机制

### 路径解析流程

```
用户传入 file_path
        │
        ▼
┌─────────────────┐
│  类型转换        │ str → Path
└─────────────────┘
        │
        ▼
┌─────────────────┐
│  是否绝对路径？    │
└─────────────────┘
        │
        ├── 是 → 直接返回
        │
        └── 否
            │
            ▼
┌─────────────────┐
│  base_path 存在？  │
└─────────────────┘
        │
        ├── 是 → base_path / file_path
        │
        └── 否 → 返回 file_path（相对路径）
```

### 代码实现

```python
def _resolve_path(self, file_path: Union[str, Path]) -> Path:
    if isinstance(file_path, str):
        file_path = Path(file_path)

    if file_path.is_absolute():
        return file_path

    if self._base_path is None:
        return file_path

    return self._base_path / file_path
```

---

## 数据读取流程

### 基础读取

```
read_csv(file_path, encoding)
        │
        ▼
resolve_path() → 获取完整路径
        │
        ▼
pd.read_csv(path, encoding) → DataFrame
        │
        ▼
返回 DataFrame 或 None
```

### 日期解析读取

```
read_csv_with_date(file_path, date_column)
        │
        ▼
read_csv() → DataFrame
        │
        ▼
检查 date_column 是否存在
        │
        ▼
pd.to_datetime(df[date_column]) → 转换日期
        │
        ▼
返回带日期类型的 DataFrame
```

### 范围读取

```
read_date_range(file_path, start, end, date_column)
        │
        ▼
read_with_date_parse() → 带日期的 DataFrame
        │
        ▼
排序 date_column
        │
        ▼
按 start 和 end 过滤
        │
        ▼
返回过滤后的 DataFrame
```

---

## 日期列自动检测

### 检测逻辑

```python
def _detect_date_columns(self, df: pd.DataFrame) -> List[str]:
    common_date_names = [
        "date", "datetime", "时间", "日期",
        "tradedate", "trade_date"
    ]

    for col in df.columns:
        # 1. 检查列名是否匹配常见日期列名
        if col.lower() in common_date_names:
            detected.append(col)
            continue

        # 2. 尝试解析为日期
        try:
            pd.to_datetime(df[col].iloc[:10], errors='coerce')
            if df[col].iloc[:10].notna().sum() > 5:
                detected.append(col)
        except:
            pass

    return detected
```

---

## 数据过滤机制

### 过滤条件格式

```python
filters = {
    "code": "600000",              # 精确匹配
    "volume": (1000, 10000),       # 范围匹配
    "name": ["平安", "银行"]        # 多值匹配（TODO）
}
```

### 过滤实现

```python
for col, value in filters.items():
    if isinstance(value, (list, tuple)) and len(value) == 2:
        df = df[(df[col] >= value[0]) & (df[col] <= value[1])]
    else:
        df = df[df[col] == value]
```

---

## 文件信息获取

### get_info 返回结构

```python
{
    "path": "/data/stock_600000.csv",     # 文件完整路径
    "size_bytes": 1024000,               # 文件大小（字节）
    "modified_time": datetime(2024,1,1),  # 修改时间
    "columns": ["date", "open", ...],    # 列名列表
    "row_count_estimate": 50000           # 行数估算
}
```

---

## 设计特点

### 1. 简单轻量

- 无需网络连接
- 无外部依赖（仅 pandas）
- 快速响应

### 2. 路径灵活

- 支持绝对路径
- 支持相对路径
- 支持配置基础路径

### 3. 错误容忍

- 文件不存在返回 `None`
- 读取失败返回 `None`
- 不抛出异常，仅记录警告

### 4. 数据处理便捷

- 自动日期解析
- 支持多种过滤方式
- 支持按范围读取

---

## 与其他适配器的比较

| 特性 | LocalAdapter | TdxAdapter | AkShareAdapter |
|------|--------------|------------|----------------|
| 数据来源 | 本地文件 | 通达信服务器 | AkShare API |
| 网络依赖 | 无 | 需要 | 需要 |
| 响应速度 | 极快 | 较快 | 较快 |
| 数据类型 | CSV | 股票/期货/期权 | 多种 |
| 错误处理 | 返回 None | 抛出异常 | 抛出异常 |

---

## 扩展机制

### 扩展新的文件格式

```python
class JSONReader(LocalAdapter):
    """JSON 文件读取器"""

    def read_json(self, file_path, **kwargs):
        import json
        resolved = self._resolve_path(file_path)
        with open(resolved) as f:
            return json.load(f)
```

### 扩展新的过滤类型

```python
def read_with_advanced_filter(self, file_path, filters):
    df = self.read(file_path)

    for col, condition in filters.items():
        if condition.get("op") == "like":
            df = df[df[col].str.contains(condition["value"])]
        elif condition.get("op") == "in":
            df = df[df[col].isin(condition["value"])]

    return df
```

---

## 相关文档

- [Local README](README.md)
- [Local 框架文档](framework.md)
- [Local 设计文档](design.md)
- [Local API 参考](api.md)
- [Local 使用指南](usage.md)
- [Local 最佳实践](best-practices.md)
- [Local FAQ](faq.md)
- [Local 更新日志](changelog.md)
- [DataSource 模块](../README.md)
- [DataSource API](../api.md)
- [适配器索引](./README.md)
