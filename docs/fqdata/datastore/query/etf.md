# ETF 查询

提供 ETF 列表和名称查询功能。

## 导入

```python
from FQData.DataStore.query import (
    query_etf_list,
    query_etf_name,
)
```

## query_etf_list

查询 ETF 列表。

```python
def query_etf_list() -> pd.DataFrame
```

**返回**: DataFrame，包含 ETF 代码、名称、跟踪指数等信息

**示例**:

```python
# 查询 ETF 列表
etf_list = query_etf_list()
print(f"ETF 数量: {len(etf_list)}")
print(etf_list.head())
```

## query_etf_name

查询 ETF 名称。

```python
def query_etf_name(code: str) -> str
```

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str | ETF 代码 |

**返回**: ETF 名称字符串

**示例**:

```python
# 查询 ETF 名称
name = query_etf_name('510300')
print(f"ETF 名称: {name}")  # 沪深300ETF
```

## 相关文档

- [Query 模块 README](./README.md)
- [股票查询](./stock.md)
- [债券查询](./bond.md)
