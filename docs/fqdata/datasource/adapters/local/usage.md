# Local 适配器使用指南

## 概述

本文档提供 Local 适配器的详细使用指南，包括基本用法和常见使用场景。

---

## 快速开始

### 安装

Local 适配器是 FQData 的一部分，无需单独安装。确保已安装 pandas：

```bash
pip install pandas
```

### 基本使用

```python
from FQData.DataSource.adapters.local import LocalAdapter

adapter = LocalAdapter(base_path="/path/to/data")

df = adapter.read_csv("stock_data.csv")
print(f"读取 {len(df)} 行数据")
```

---

## 基本操作

### 创建适配器

```python
from FQData.DataSource.adapters.local import LocalAdapter

# 无基础路径
adapter = LocalAdapter()

# 有基础路径
adapter = LocalAdapter(base_path="/data")
adapter = LocalAdapter(base_path="./data")
```

### 读取 CSV 文件

```python
# 基础读取
df = adapter.read_csv("data.csv")

# 指定编码
df = adapter.read_csv("data.csv", encoding="gbk")

# 使用 pandas 参数
df = adapter.read_csv("data.csv", sep="\t", nrows=1000)
```

### 写入 CSV 文件

```python
# 基本写入
success = adapter.write_csv(df, "output.csv")

# 指定编码
success = adapter.write_csv(df, "output.csv", encoding="gbk")

# 不写入索引
success = adapter.write_csv(df, "output.csv", index=False)
```

### 检查文件

```python
# 检查文件是否存在
if adapter.file_exists("data.csv"):
    print("文件存在")
else:
    print("文件不存在")
```

### 列出文件

```python
# 列出所有 CSV 文件
files = adapter.list_files("*.csv")

# 列出匹配的文件
files = adapter.list_files("stock_*.csv")

# 递归列出
files = adapter.list_files("**/*.csv")
```

---

## CSVReader 高级用法

### 创建读取器

```python
from FQData.DataSource.adapters.local import CSVReader

reader = CSVReader(
    base_path="/data",
    default_encoding="utf-8",
    default_date_format="%Y-%m-%d"
)
```

### 基本读取

```python
df = reader.read("stock_600000.csv")
```

### 日期解析

```python
# 自动检测日期列
df = reader.read_with_date_parse("daily.csv")

# 指定日期列
df = reader.read_with_date_parse("daily.csv", date_columns=["date"])

# 指定日期格式
df = reader.read_with_date_parse("daily.csv", date_format="%Y/%m/%d")
```

### 日期范围读取

```python
# 读取指定范围
df = reader.read_date_range(
    "daily.csv",
    start="2024-01-01",
    end="2024-12-31"
)

# 只有开始日期
df = reader.read_date_range(
    "daily.csv",
    start="2024-01-01"
)

# 只有结束日期
df = reader.read_date_range(
    "daily.csv",
    end="2024-12-31"
)
```

### 指定列读取

```python
df = reader.read_columns(
    "daily.csv",
    columns=["date", "open", "high", "low", "close", "volume"]
)
```

### 条件过滤

```python
# 精确匹配
df = reader.read_with_filter(
    "daily.csv",
    filters={"code": "600000"}
)

# 范围匹配
df = reader.read_with_filter(
    "daily.csv",
    filters={"volume": (10000, 50000)}
)

# 多条件
df = reader.read_with_filter(
    "daily.csv",
    filters={
        "code": "600000",
        "volume": (10000, 50000)
    }
)
```

### 获取文件信息

```python
info = reader.get_info("daily.csv")

print(f"路径: {info['path']}")
print(f"大小: {info['size_bytes'] / 1024:.2f} KB")
print(f"修改时间: {info['modified_time']}")
print(f"列: {info['columns']}")
print(f"行数: {info['row_count_estimate']}")
```

---

## 实际使用场景

### 场景 1：读取本地缓存的股票数据

```python
from FQData.DataSource.adapters.local import CSVReader

reader = CSVReader(base_path="/data/stocks")

df = reader.read_date_range(
    "600000_daily.csv",
    start="2024-01-01",
    end="2024-12-31"
)

print(df.head())
```

### 场景 2：批量读取多个文件

```python
from FQData.DataSource.adapters.local import LocalAdapter

adapter = LocalAdapter(base_path="/data")

codes = ["600000", "600036", "601318"]
data_dict = {}

for code in codes:
    df = adapter.read_csv(f"{code}_daily.csv")
    if df is not None:
        data_dict[code] = df
```

### 场景 3：数据导出

```python
from FQData.DataSource.adapters.local import LocalAdapter

adapter = LocalAdapter(base_path="/data/output")

# 写入数据
success = adapter.write_csv(result_df, "analysis_result.csv")

if success:
    print("数据已保存")
else:
    print("保存失败")
```

### 场景 4：数据备份

```python
from FQData.DataSource.adapters.local import LocalAdapter
from datetime import datetime

adapter = LocalAdapter(base_path="/data")

# 按日期备份
today = datetime.now().strftime("%Y%m%d")
backup_file = f"backup_{today}.csv"

success = adapter.write_csv(source_df, backup_file)
```

### 场景 5：增量更新数据

```python
from FQData.DataSource.adapters.local import CSVReader

reader = CSVReader(base_path="/data")

existing_file = "daily.csv"
new_data_file = "new_daily.csv"

existing = reader.read_date_range(existing_file, end="2024-06-30")
new_data = reader.read_date_range(new_data_file, start="2024-07-01")

if new_data is not None and not new_data.empty:
    combined = pd.concat([existing, new_data]).drop_duplicates()
    combined = combined.sort_values("date")
    reader.write_csv(combined, existing_file)
```

---

## 错误处理

### 检查返回值

```python
from FQData.DataSource.adapters.local import LocalAdapter

adapter = LocalAdapter(base_path="/data")

df = adapter.read_csv("data.csv")

if df is None:
    print("读取失败，请检查文件是否存在")
else:
    print(f"读取成功，{len(df)} 行")
```

### 文件不存在处理

```python
file_path = "data.csv"

if adapter.file_exists(file_path):
    df = adapter.read_csv(file_path)
else:
    print(f"文件 {file_path} 不存在")
    df = None
```

### 写入失败处理

```python
success = adapter.write_csv(df, "output.csv")

if not success:
    print("写入失败，请检查路径和权限")
```

---

## 路径使用技巧

### 绝对路径

```python
adapter = LocalAdapter()

df = adapter.read_csv("/data/stock_600000.csv")
```

### 相对路径 + 基础路径

```python
adapter = LocalAdapter(base_path="/data")

df = adapter.read_csv("stocks/600000.csv")
# 实际读取: /data/stocks/600000.csv
```

### 动态路径

```python
import os

base = os.path.dirname(__file__)
data_path = os.path.join(base, "data")

adapter = LocalAdapter(base_path=data_path)
```

---

## 数据处理示例

### 读取后处理

```python
reader = CSVReader(base_path="/data")

df = reader.read_with_date_parse("stock_600000.csv")

df["returns"] = df["close"].pct_change()
df["MA5"] = df["close"].rolling(5).mean()
df["MA10"] = df["close"].rolling(10).mean()

reader.write_csv(df, "stock_600000_processed.csv")
```

### 合并多个数据源

```python
reader = CSVReader(base_path="/data")

stocks = ["600000", "600036", "601318"]
dfs = []

for code in stocks:
    df = reader.read(f"{code}.csv")
    if df is not None:
        df["code"] = code
        dfs.append(df)

combined = pd.concat(dfs, ignore_index=True)
```

---

## 常见问题

### 1. 中文字符乱码

**解决方案：** 指定正确的编码

```python
df = adapter.read_csv("data.csv", encoding="gbk")
```

### 2. 日期列无法解析

**解决方案：** 检查日期格式或手动指定

```python
df = reader.read_with_date_parse("data.csv", date_format="%Y/%m/%d")
```

### 3. 文件太大读取慢

**解决方案：** 分块读取

```python
for chunk in pd.read_csv("large_file.csv", chunksize=10000):
    process(chunk)
```

---

## 相关文档

- [Local README](README.md)
- [Local 框架文档](framework.md)
- [Local 架构说明](architecture.md)
- [Local 设计文档](design.md)
- [Local API 参考](api.md)
- [Local 最佳实践](best-practices.md)
- [Local FAQ](faq.md)
- [Local 更新日志](changelog.md)
- [DataSource 模块](../README.md)
- [DataSource API](../api.md)
- [适配器索引](./README.md)
