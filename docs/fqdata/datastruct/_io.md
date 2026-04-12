# DataStruct _io 模块

行情数据序列化 Mixin 模块，提供数据导出、存储等 IO 相关方法。

## 模块结构

```
_io.py
```

## QuotationIOSMixin

行情数据序列化 Mixin，通过多重继承为数据结构提供各种导出功能。

---

## 序列化导出

### to_json

导出为 JSON 字符串。

```python
json_str = data.to_json(orient='index')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `orient` | str | 'index' | DataFrame to_json 参数 |

**返回：** str - JSON 字符串

---

### to_csv

导出为 CSV。

```python
csv_str = data.to_csv()

data.to_csv('data.csv')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `path` | str | None | 文件路径，None 时返回字符串 |
| `encoding` | str | 'utf-8' | 编码 |
| `index` | bool | True | 是否包含索引 |

**返回：** str - CSV 字符串或文件路径

---

### to_excel

导出为 Excel。

```python
data.to_excel('data.xlsx', sheet_name='Sheet1')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `path` | str | - | 文件路径 |
| `sheet_name` | str | 'Sheet1' | 工作表名称 |
| `encoding` | str | 'utf-8' | 编码 |
| `index` | bool | True | 是否包含索引 |

---

### to_clipboard

复制到剪贴板。

```python
data.to_clipboard(excel=True, sep='\t')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `excel` | bool | True | 是否为 Excel 格式 |
| `sep` | str | '\t' | 分隔符 |

---

## 列式存储格式

### to_hdf

导出为 HDF5 格式。

```python
data.to_hdf('data.h5', key='data')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `path` | str | - | 文件路径 |
| `key` | str | 'data' | 数据集名称 |
| `mode` | str | 'w' | 打开模式 |
| `format` | str | 'table' | 存储格式 |
| `complib` | str | 'blosc' | 压缩库 |
| `complevel` | int | 5 | 压缩级别 |

---

### to_parquet

导出为 Parquet 格式。

```python
data.to_parquet('data.parquet')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `path` | str | - | 文件路径 |
| `engine` | str | 'auto' | 引擎 |
| `compression` | str | 'snappy' | 压缩方式 |

---

### to_feather

导出为 Feather 格式。

```python
data.to_feather('data.feather')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `path` | str | - | 文件路径 |
| `compression` | str | 'uncompressed' | 压缩方式 |

---

## 文档格式

### to_html

导出为 HTML。

```python
html_str = data.to_html()

data.to_html('data.html')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `path` | str | None | 文件路径，None 时返回字符串 |
| `encoding` | str | 'utf-8' | 编码 |
| `border` | int | 1 | 边框宽度 |
| `table_id` | str | None | 表格 ID |
| `classes` | str | None | CSS 类 |

**返回：** str - HTML 字符串或文件路径

---

### to_markdown

导出为 Markdown 表格。

```python
md_str = data.to_markdown()

data.to_markdown('data.md')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `path` | str | None | 文件路径，None 时返回字符串 |

**返回：** str - Markdown 字符串或文件路径

**依赖：** 需要 tabulate 库（可选）

---

### to_latex

导出为 LaTeX 表格。

```python
latex_str = data.to_latex()

data.to_latex('data.tex')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `path` | str | None | 文件路径，None 时返回字符串 |
| `encoding` | str | 'utf-8' | 编码 |

**返回：** str - LaTeX 字符串或文件路径

---

## 其他格式

### to_pickle

导出为 pickle。

```python
data.to_pickle('data.pkl')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `path` | str | - | 文件路径 |
| `compression` | str | 'infer' | 压缩方式 |
| `protocol` | int | 5 | pickle 协议版本 |

---

### to_sql

导出为 SQL 数据库。

```python
data.to_sql(con, name='stock_data')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `con` | - | - | 数据库连接 |
| `name` | str | - | 表名 |
| `if_exists` | str | 'fail' | 表已存在时的行为 |
| `index` | bool | True | 是否包含索引 |
| `index_label` | str | None | 索引列名 |
| `chunksize` | int | None | 批量写入大小 |
| `dtype` | dict | None | 列类型 |

---

## 转换方法

### to_records

转换为记录数组。

```python
records = data.to_records(index=True)
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `index` | bool | True | 是否包含索引 |

**返回：** numpy 记录数组

---

### to_string

转换为格式化字符串。

```python
str_data = data.to_string()
```

**返回：** str - 格式化字符串

---

### to_xarray

转换为 xarray 数据结构。

```python
xr_data = data.to_xarray()
```

**返回：** xarray DataSet

---

## 索引转换

### to_period

转换为 PeriodIndex。

```python
period_data = data.to_period(freq='D')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `freq` | str | None | 频率 |

**返回：** QuotationDataStructBase - 新的数据实例

---

### to_timestamp

转换为 TimestampIndex。

```python
ts_data = data.to_timestamp(freq='D')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `freq` | str | None | 频率 |

**返回：** QuotationDataStructBase - 新的数据实例

---

## 使用示例

### 基本导出

```python
from FQData.DataStruct import StockDayData

# 假设 stock 是 StockDayData 实例

# 导出为 CSV
stock.to_csv('stock.csv')

# 导出为 Excel
stock.to_excel('stock.xlsx')

# 导出为 JSON
json_str = stock.to_json()
```

### 高效存储

```python
# HDF5 格式（推荐用于大量数据）
stock.to_hdf('stock.h5', key='data', complib='blosc', complevel=5)

# Parquet 格式（推荐用于跨平台）
stock.to_parquet('stock.parquet')

# Feather 格式（快速读写）
stock.to_feather('stock.feather')
```

### 文档导出

```python
# Markdown 表格
md = stock.to_markdown('stock.md')

# HTML
html = stock.to_html('stock.html')

# LaTeX
latex = stock.to_latex('stock.tex')
```

### 数据库导出

```python
from sqlalchemy import create_engine

engine = create_engine('sqlite:///:memory:')
stock.to_sql(engine, name='stock_data')
```

---

## 相关文档

- [DataStruct README](README.md)
- [DataStruct API](api.md)
- [DataStruct _base](_base.md)