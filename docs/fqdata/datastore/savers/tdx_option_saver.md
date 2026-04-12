# 期权数据持久化 (tdx_option_saver)

提供期权日线/分钟线数据保存功能，支持商品期权、50ETF期权、300ETF期权。

## 模块路径

```
FQData.DataStore.savers.tdx_option_saver
```

## 核心功能

| 功能 | 说明 |
|------|------|
| 商品期权 | 保存商品期权日线/分钟线数据 |
| 50ETF期权 | 保存50ETF期权日线/分钟线数据 |
| 300ETF期权 | 保存300ETF期权日线/分钟线数据 |
| 期权合约列表 | 保存期权合约列表 |
| 批量保存 | 批量保存所有期权数据 |

## 主要函数

### save_option_commodity_day

```python
def save_option_commodity_day(
    code: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> bool
```

保存商品期权日线数据。

**参数：**
- `code`: 期权代码
- `start_date`: 开始日期
- `end_date`: 结束日期

**返回：** 保存是否成功

---

### save_option_commodity_min

```python
def save_option_commodity_min(
    code: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    frequence: str = "1min"
) -> bool
```

保存商品期权分钟线数据。

---

### save_option_50etf_day

```python
def save_option_50etf_day(
    code: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> bool
```

保存50ETF期权日线数据。

---

### save_option_50etf_min

```python
def save_option_50etf_min(
    code: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    frequence: str = "1min"
) -> bool
```

保存50ETF期权分钟线数据。

---

### save_option_300etf_day

```python
def save_option_300etf_day(
    code: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> bool
```

保存300ETF期权日线数据。

---

### save_option_300etf_min

```python
def save_option_300etf_min(
    code: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    frequence: str = "1min"
) -> bool
```

保存300ETF期权分钟线数据。

---

### save_option_contract_list

```python
def save_option_contract_list() -> bool
```

保存期权合约列表。

**返回：** 保存是否成功

---

### save_option_day_all

```python
def save_option_day_all(
    code_list: Optional[list] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> int
```

批量保存所有期权日线数据。

**参数：**
- `code_list`: 期权代码列表，None 表示全部期权
- `start_date`: 开始日期
- `end_date`: 结束日期

**返回：** 成功保存的数量

---

### save_option_min_all

```python
def save_option_min_all(
    code_list: Optional[list] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    frequence: str = "1min"
) -> int
```

批量保存所有期权分钟线数据。

---

## 使用示例

### 保存期权合约列表

```python
from FQData import save_option_contract_list

result = save_option_contract_list()
print(f"保存结果: {result}")
```

### 批量保存期权数据

```python
from FQData import save_option_day_all, save_option_min_all

day_count = save_option_day_all(start_date='2024-01-01')
print(f"成功保存 {day_count} 个期权日线")

min_count = save_option_min_all(start_date='2024-01-01', frequence='5min')
print(f"成功保存 {min_count} 个期权分钟线")
```

---

## 数据源

- [TdxOptionAdapter](../datasource/adapters/tdx/option.md)
- [TdxExtensionAdapter](../datasource/adapters/tdx/extension.md)

## 相关文档

- [DataStore 模块](../README.md)
- [Savers 模块索引](README.md)
- [期权数据结构](../../datastruct/option.md)
