# Local 本地文件适配器

Local 适配器模块提供读取本地文件数据的统一接口，支持 CSV 文件的读取、写入和基本的数据处理功能。

## 文档索引

| 文档 | 说明 |
|------|------|
| [README](README.md) | 模块总览和快速开始 |
| [框架文档](framework.md) | 框架集成、初始化、生命周期 |
| [架构说明](architecture.md) | 技术架构、核心组件、数据流程 |
| [设计文档](design.md) | 设计决策、模式应用、接口规范 |
| [API 参考](api.md) | 完整 API 文档 |
| [使用指南](usage.md) | 详细使用教程和示例 |
| [最佳实践](best-practices.md) | 性能优化、错误处理、缓存策略 |
| [FAQ](faq.md) | 常见问题解答 |
| [更新日志](changelog.md) | 版本历史和变更内容 |

## 模块结构

```
local/
├── __init__.py          # 模块入口
├── base.py              # 适配器基类
└── csv_reader.py        # CSV 文件读取器
```

## 核心组件

### LocalAdapter

本地文件适配器基类，提供基础的本地文件读写功能。

```python
from FQData.DataSource.adapters.local import LocalAdapter

adapter = LocalAdapter(base_path="/data")
```

| 方法 | 说明 |
|------|------|
| `read_csv(file_path, encoding)` | 读取 CSV 文件 |
| `read_csv_with_date(file_path, date_column)` | 读取 CSV 并解析日期列 |
| `write_csv(df, file_path)` | 写入 CSV 文件 |
| `list_files(pattern)` | 列出匹配的文件 |
| `file_exists(file_path)` | 检查文件是否存在 |

### CSVReader

CSV 文件读取器，提供高级 CSV 读取功能。

```python
from FQData.DataSource.adapters.local import CSVReader

reader = CSVReader(base_path="/data")
```

| 方法 | 说明 |
|------|------|
| `read(file_path)` | 读取 CSV 文件 |
| `read_with_date_parse(file_path)` | 读取并解析日期列 |
| `read_date_range(file_path, start, end)` | 按日期范围读取 |
| `read_columns(file_path, columns)` | 读取指定列 |
| `read_with_filter(file_path, filters)` | 按条件过滤读取 |
| `get_info(file_path)` | 获取文件信息 |

## 快速开始

### 基本使用

```python
from FQData.DataSource.adapters.local import LocalAdapter

adapter = LocalAdapter(base_path="/path/to/data")

df = adapter.read_csv("stock_data.csv")
print(f"读取 {len(df)} 行数据")
```

### 读取带日期的数据

```python
adapter = LocalAdapter(base_path="/path/to/data")

df = adapter.read_csv_with_date("daily_data.csv", date_column="date")
print(df.head())
```

### 使用 CSVReader

```python
from FQData.DataSource.adapters.local import CSVReader

reader = CSVReader(base_path="/data")

df = reader.read_with_date_parse("stock_600000.csv")
print(f"数据日期范围: {df['date'].min()} - {df['date'].max()}")
```

### 按日期范围读取

```python
df = reader.read_date_range(
    "daily_data.csv",
    start="2024-01-01",
    end="2024-12-31"
)
```

## 特点

- **简单轻量**：无需网络连接，直接读取本地文件
- **灵活路径**：支持绝对路径和相对路径
- **编码支持**：支持多种字符编码（UTF-8、GBK 等）
- **日期解析**：自动检测和解析日期列
- **数据过滤**：支持多种数据过滤方式

## 与其他适配器对比

| 适配器 | 数据来源 | 依赖 | 适用场景 |
|--------|----------|------|----------|
| LocalAdapter | 本地文件 | 无 | 已有数据文件、本地缓存 |
| TdxAdapter | 通达信服务器 | 网络 | 实时行情、历史数据 |
| AkShareAdapter | AkShare | 网络 | 备用数据源 |
| EastMoneyAdapter | 东方财富 | 网络 | 备用数据源 |

## 相关文档

- [DataSource 模块](../README.md)
- [DataSource API](../api.md)
- [适配器索引](./README.md)
