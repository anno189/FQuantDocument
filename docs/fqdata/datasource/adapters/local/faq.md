# Local 适配器常见问题

## 概述

本文档汇总了 Local 适配器的常见问题及解决方案。

---

## 基础问题

### Q1: 如何导入 Local 适配器？

**A:** 使用以下方式导入：

```python
from FQData.DataSource.adapters.local import LocalAdapter, CSVReader
```

---

### Q2: Local 适配器需要哪些依赖？

**A:** 主要依赖：

```bash
pip install pandas
```

Python 标准库：`pathlib`

---

### Q3: Local 适配器与其他数据源适配器有什么区别？

**A:** 对比：

| 适配器 | 数据来源 | 网络依赖 | 适用场景 |
|--------|----------|----------|----------|
| LocalAdapter | 本地文件 | 无 | 已有数据文件、本地缓存 |
| TdxAdapter | 通达信服务器 | 需要 | 实时行情、历史数据 |
| AkShareAdapter | AkShare | 需要 | 备用数据源 |

---

## 使用问题

### Q4: 读取 CSV 文件时出现乱码怎么办？

**A:** 尝试指定编码：

```python
df = adapter.read_csv("data.csv", encoding="gbk")
df = adapter.read_csv("data.csv", encoding="gb2312")
df = adapter.read_csv("data.csv", encoding="utf-8-sig")  # UTF-8 with BOM
```

---

### Q5: 如何读取大文件？

**A:** 有以下几种方式：

**1. 分块读取：**

```python
for chunk in pd.read_csv("large_file.csv", chunksize=10000):
    process(chunk)
```

**2. 只读取部分数据：**

```python
df = pd.read_csv("large_file.csv", nrows=1000)
```

**3. 使用 usecols 指定列：**

```python
df = pd.read_csv("large_file.csv", usecols=["date", "close"])
```

---

### Q6: 日期列无法正确解析怎么办？

**A:** 解决方案：

**1. 指定日期列：**

```python
df = reader.read_with_date_parse("data.csv", date_columns=["date"])
```

**2. 指定日期格式：**

```python
df = reader.read_with_date_parse("data.csv", date_format="%Y/%m/%d")
```

**3. 手动解析：**

```python
df = adapter.read_csv("data.csv")
df["date"] = pd.to_datetime(df["date"], format="%Y/%m/%d")
```

---

### Q7: 如何按日期范围读取数据？

**A:** 使用 `read_date_range` 方法：

```python
df = reader.read_date_range(
    "daily.csv",
    start="2024-01-01",
    end="2024-12-31"
)
```

---

### Q8: 如何读取指定的列？

**A:** 使用 `read_columns` 方法：

```python
df = reader.read_columns(
    "daily.csv",
    columns=["date", "open", "high", "low", "close", "volume"]
)
```

---

### Q9: 如何按条件过滤数据？

**A:** 使用 `read_with_filter` 方法：

```python
df = reader.read_with_filter(
    "daily.csv",
    filters={"code": "600000"}
)

df = reader.read_with_filter(
    "daily.csv",
    filters={"volume": (1000, 5000)}
)
```

---

### Q10: 文件不存在时返回什么？

**A:** 返回 `None`：

```python
df = adapter.read_csv("nonexistent.csv")
print(df)  # None
```

---

## 路径问题

### Q11: 相对路径和绝对路径有什么区别？

**A:** 处理方式不同：

```python
adapter = LocalAdapter(base_path="/data")

# 绝对路径：直接使用
adapter.read_csv("/data/file.csv")  # 读取 /data/file.csv

# 相对路径：以 base_path 为基准
adapter.read_csv("file.csv")  # 读取 /data/file.csv
```

---

### Q12: 如何设置基础路径？

**A:** 在初始化时或之后设置：

```python
# 初始化时设置
adapter = LocalAdapter(base_path="/data")

# 之后设置
adapter.set_base_path("/new/data/path")
```

---

### Q13: 如何获取当前的基础路径？

**A:** 使用 `get_base_path` 方法：

```python
path = adapter.get_base_path()
print(f"当前基础路径: {path}")
```

---

## 数据处理问题

### Q14: 如何检查文件是否存在？

**A:** 使用 `file_exists` 方法：

```python
if adapter.file_exists("data.csv"):
    print("文件存在")
else:
    print("文件不存在")
```

---

### Q15: 如何列出目录中的文件？

**A:** 使用 `list_files` 方法：

```python
files = adapter.list_files("*.csv")
files = adapter.list_files("stock_*.csv")
files = adapter.list_files("**/*.csv")  # 递归
```

---

### Q16: 如何获取文件信息？

**A:** 使用 `get_info` 方法：

```python
info = reader.get_info("data.csv")
print(f"路径: {info['path']}")
print(f"大小: {info['size_bytes']}")
print(f"修改时间: {info['modified_time']}")
print(f"列: {info['columns']}")
print(f"行数: {info['row_count_estimate']}")
```

---

### Q17: 如何自动检测日期列？

**A:** LocalAdapter 会自动尝试检测常见日期列名：

- `date`, `datetime`
- `时间`, `日期`
- `tradedate`, `trade_date`

```python
df = reader.read_with_date_parse("data.csv")  # 自动检测
```

---

## 写入问题

### Q18: 写入 CSV 文件失败怎么办？

**A:** 可能原因及解决方案：

**1. 目录不存在：**

```python
Path(file_path).parent.mkdir(parents=True, exist_ok=True)
```

**2. 权限问题：**

```python
import os
os.chmod(file_path, 0o644)
```

**3. 磁盘空间不足：**

```python
import shutil
disk_usage = shutil.disk_usage("/")
print(f"可用空间: {disk_usage.free / (1024**3):.2f} GB")
```

---

### Q19: 写入时如何避免覆盖原有数据？

**A:** 先备份或检查：

```python
import shutil

if adapter.file_exists("output.csv"):
    shutil.copy2("output.csv", "output.csv.bak")

adapter.write_csv(df, "output.csv")
```

---

### Q20: 如何写入不包含索引的 CSV？

**A:** 设置 `index=False`：

```python
adapter.write_csv(df, "output.csv", index=False)
```

---

## 性能问题

### Q21: 读取大量小文件很慢怎么办？

**A:** 优化建议：

```python
# 使用 glob 批量获取文件列表
files = adapter.list_files("*.csv")

# 批量读取
dfs = []
for f in files:
    df = adapter.read_csv(f)
    if df is not None:
        dfs.append(df)

combined = pd.concat(dfs, ignore_index=True)
```

---

### Q22: 如何提升写入性能？

**A:** 写入优化：

```python
# 分批写入
batch_size = 10000
for i in range(0, len(df), batch_size):
    batch = df.iloc[i:i+batch_size]
    adapter.write_csv(batch, f"output_{i}.csv")
```

---

## 错误处理

### Q23: 读取失败时返回什么？

**A:** 返回 `None`：

```python
df = adapter.read_csv("invalid.csv")
if df is None:
    print("读取失败")
```

---

### Q24: 如何处理多种可能的错误？

**A:** 防御性编程：

```python
def safe_read(file_path, encoding='utf-8'):
    if not adapter.file_exists(file_path):
        return None

    df = adapter.read_csv(file_path, encoding=encoding)
    if df is None:
        return None

    if df.empty:
        return None

    return df
```

---

## 扩展问题

### Q25: 如何扩展支持其他文件格式？

**A:** 可以扩展 LocalAdapter：

```python
class JSONReader(LocalAdapter):
    def read_json(self, file_path):
        import json
        resolved = self._resolve_path(file_path)
        with open(resolved) as f:
            return json.load(f)
```

---

### Q26: 如何自定义日期列检测逻辑？

**A:** 继承并覆盖方法：

```python
class CustomCSVReader(CSVReader):
    def _detect_date_columns(self, df):
        custom_date_names = ["trade_date", "transaction_date"]
        detected = []

        for col in df.columns:
            if col.lower() in custom_date_names:
                detected.append(col)

        return detected
```

---

## 相关文档

- [Local README](README.md)
- [Local 框架文档](framework.md)
- [Local 架构说明](architecture.md)
- [Local 设计文档](design.md)
- [Local API 参考](api.md)
- [Local 使用指南](usage.md)
- [Local 最佳实践](best-practices.md)
- [Local 更新日志](changelog.md)
- [DataSource 模块](../README.md)
- [DataSource API](../api.md)
- [适配器索引](./README.md)
