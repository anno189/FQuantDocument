# 债券数据持久化 (tdx_bond_saver)

提供债券、可转债日线/分钟线数据保存功能。

## 模块路径

```
FQData.DataStore.savers.tdx_bond_saver
```

## 核心功能

| 功能 | 说明 |
|------|------|
| 债券日线 | 保存单只/批量债券日线数据 |
| 可转债日线 | 保存可转债（bond2stock）日线数据 |
| 债券分钟线 | 保存单只/批量债券分钟线数据 |
| 可转债分钟线 | 保存可转债分钟线数据 |
| 债券列表 | 保存债券列表、可转债列表 |
| 集思录数据 | 从集思录获取可转债实时数据 |

## 主要函数

### save_single_bond_day

```python
def save_single_bond_day(
    code: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> bool
```

保存单个债券日线数据。

**参数：**
- `code`: 债券代码
- `start_date`: 开始日期，默认为数据库起始日期
- `end_date`: 结束日期，默认为今日

**返回：** 保存是否成功

**示例：**

```python
from FQData import save_single_bond_day

result = save_single_bond_day('010107')
print(f"保存结果: {result}")
```

---

### save_bond_day

```python
def save_bond_day(
    code_list: Optional[List[str]] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> int
```

批量保存债券日线数据。

**参数：**
- `code_list`: 债券代码列表，None 表示全部债券
- `start_date`: 开始日期
- `end_date`: 结束日期

**返回：** 成功保存的数量

**示例：**

```python
from FQData import save_bond_day

codes = ['010107', '010303', '019547']
count = save_bond_day(codes, start_date='2024-01-01')
print(f"成功保存 {count} 只债券")
```

---

### save_bond2stock_day

```python
def save_bond2stock_day(
    code_list: Optional[List[str]] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> int
```

批量保存可转债日线数据。

**参数：**
- `code_list`: 可转债代码列表，None 表示全部可转债
- `start_date`: 开始日期
- `end_date`: 结束日期

**返回：** 成功保存的数量

**示例：**

```python
from FQData import save_bond2stock_day

count = save_bond2stock_day(start_date='2024-01-01')
print(f"成功保存 {count} 只可转债")
```

---

### save_single_bond_min

```python
def save_single_bond_min(
    code: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    frequence: str = "1min"
) -> bool
```

保存单个债券分钟线数据。

**参数：**
- `code`: 债券代码
- `start_date`: 开始日期
- `end_date`: 结束日期
- `frequence`: 频率，支持 "1min", "5min", "15min", "30min", "60min"

**返回：** 保存是否成功

---

### save_bond_min

```python
def save_bond_min(
    code_list: Optional[List[str]] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    frequence: str = "1min"
) -> int
```

批量保存债券分钟线数据。

---

### save_bond2stock_min

```python
def save_bond2stock_min(
    code_list: Optional[List[str]] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    frequence: str = "1min"
) -> int
```

批量保存可转债分钟线数据。

---

### save_bond_list

```python
def save_bond_list() -> bool
```

保存债券列表。

**返回：** 保存是否成功

---

### save_bond2stock_list

```python
def save_bond2stock_list() -> int
```

保存可转债列表。

**返回：** 保存的记录数量

---

### save_jisilu_bond_cbnewlist

```python
def save_jisilu_bond_cbnewlist(
    renew: bool = False,
    path: str = '/usr/bin/chromedriver'
) -> bool
```

从集思录保存可转债数据。

**参数：**
- `renew`: 是否覆盖已存在的数据
- `path`: ChromeDriver 路径

**返回：** 保存是否成功，None 表示数据已存在且不覆盖

**示例：**

```python
from FQData import save_jisilu_bond_cbnewlist

result = save_jisilu_bond_cbnewlist(renew=True)
```

---

### get_bond_cbnewlist

```python
def get_bond_cbnewlist(ma10: bool = False) -> pd.DataFrame
```

获取可转债代码及正股代码。

**参数：**
- `ma10`: 是否过滤MA10（未实现）

**返回：** 可转债列表 DataFrame

**示例：**

```python
from FQData import get_bond_cbnewlist

df = get_bond_cbnewlist()
print(df.head())
```

---

## 数据源

- [TdxBondAdapter](../datasource/adapters/tdx/bond.md)
- [TdxStockAdapter](../datasource/adapters/tdx/stock.md)
- [Jisilu Adapter](../datasource/adapters/jisilu.md)

## 相关文档

- [DataStore 模块](../README.md)
- [Savers 模块索引](README.md)
- [债券数据结构](../../datastruct/bond.md)
