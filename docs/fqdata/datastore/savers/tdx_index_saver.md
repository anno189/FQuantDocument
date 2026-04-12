# 指数/ETF 数据持久化 (tdx_index_saver)

提供指数和ETF日线/分钟线数据保存功能。

## 模块路径

```
FQData.DataStore.savers.tdx_index_saver
```

## 核心功能

| 功能 | 说明 |
|------|------|
| 指数日线 | 保存单只/批量指数日线数据 |
| 指数分钟线 | 保存单只/批量指数分钟线数据 |
| 指数列表 | 保存指数列表 |
| ETF日线 | 保存单只/批量ETF日线数据 |
| ETF分钟线 | 保存单只/批量ETF分钟线数据 |
| ETF列表 | 保存ETF列表 |

## 主要函数

### save_single_index_day

```python
def save_single_index_day(
    code: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> bool
```

保存单个指数日线数据，支持增量更新。

**参数：**
- `code`: 指数代码
- `start_date`: 开始日期，默认为数据库起始日期
- `end_date`: 结束日期，默认为今日

**返回：** 保存是否成功

**示例：**

```python
from FQData import save_single_index_day

result = save_single_index_day('000300', start_date='2024-01-01')
print(f"保存结果: {result}")
```

---

### save_index_day

```python
def save_index_day(
    code_list: Optional[List[str]] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> int
```

批量保存指数日线数据。

**参数：**
- `code_list`: 指数代码列表，None 表示全部指数
- `start_date`: 开始日期
- `end_date`: 结束日期

**返回：** 成功保存的数量

---

### save_single_index_min

```python
def save_single_index_min(
    code: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    frequence: str = "1min"
) -> bool
```

保存单个指数分钟线数据。

**参数：**
- `code`: 指数代码
- `start_date`: 开始日期
- `end_date`: 结束日期
- `frequence`: 频率，支持 "1min", "5min", "15min", "30min", "60min"

---

### save_index_min

```python
def save_index_min(
    code_list: Optional[List[str]] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    frequence: str = "1min"
) -> int
```

批量保存指数分钟线数据。

---

### save_index_list

```python
def save_index_list() -> bool
```

保存指数列表。

**返回：** 保存是否成功

---

### save_single_etf_day

```python
def save_single_etf_day(
    code: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> bool
```

保存单个ETF日线数据，支持增量更新。

**参数：**
- `code`: ETF代码
- `start_date`: 开始日期
- `end_date`: 结束日期

**示例：**

```python
from FQData import save_single_etf_day

result = save_single_etf_day('510300', start_date='2024-01-01')
```

---

### save_etf_day

```python
def save_etf_day(
    code_list: Optional[List[str]] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> int
```

批量保存ETF日线数据。

---

### save_single_etf_min

```python
def save_single_etf_min(
    code: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    frequence: str = "1min"
) -> bool
```

保存单个ETF分钟线数据。

---

### save_etf_min

```python
def save_etf_min(
    code_list: Optional[List[str]] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    frequence: str = "1min"
) -> int
```

批量保存ETF分钟线数据。

---

### save_etf_list

```python
def save_etf_list() -> bool
```

保存ETF列表。

**返回：** 保存是否成功

---

## 使用示例

### 完整指数数据保存

```python
from FQData import (
    save_single_index_day,
    save_index_day,
    save_index_list,
)

save_index_list()

result = save_index_day(start_date='2020-01-01')
print(f"成功保存 {result} 只指数")
```

### 增量更新指数数据

```python
from FQData import save_single_index_day

result = save_single_index_day('000300')
print(f"增量更新结果: {result}")
```

### ETF数据保存

```python
from FQData import save_etf_day, save_etf_list

save_etf_list()

etf_codes = ['510300', '510500', '159919']
result = save_etf_day(etf_codes, start_date='2024-01-01')
print(f"成功保存 {result} 只ETF")
```

---

## 数据源

- [TdxIndexAdapter](../datasource/adapters/tdx/index.md)
- [TdxStockAdapter](../datasource/adapters/tdx/stock.md)

## 相关文档

- [DataStore 模块](../README.md)
- [Savers 模块索引](README.md)
- [指数数据结构](../../datastruct/index.md)
