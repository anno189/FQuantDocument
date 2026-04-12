# 分笔数据持久化 (tdx_transaction_saver)

提供股票和指数分笔（成交明细）数据保存功能。

## 模块路径

```
FQData.DataStore.savers.tdx_transaction_saver
```

## 核心功能

| 功能 | 说明 |
|------|------|
| 股票分笔 | 保存单只/批量股票分笔数据 |
| 指数分笔 | 保存单只/批量指数分笔数据 |

## 主要函数

### save_stock_transaction

```python
def save_stock_transaction(
    code: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> bool
```

保存股票分笔数据。

**参数：**
- `code`: 股票代码，None 表示全部股票
- `start_date`: 开始日期
- `end_date`: 结束日期

**返回：** 保存是否成功

**示例：**

```python
from FQData import save_stock_transaction

result = save_stock_transaction('600000', start_date='2024-01-01', end_date='2024-01-31')
print(f"保存结果: {result}")
```

---

### save_index_transaction

```python
def save_index_transaction(
    code: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> bool
```

保存指数分笔数据。

**参数：**
- `code`: 指数代码，None 表示全部指数
- `start_date`: 开始日期
- `end_date`: 结束日期

**返回：** 保存是否成功

---

## 使用示例

### 保存单只股票分笔

```python
from FQData import save_stock_transaction

result = save_stock_transaction('600000', start_date='2024-01-01')
```

### 批量保存所有股票分笔

```python
from FQData import save_stock_transaction

result = save_stock_transaction(start_date='2024-01-01')
print(f"保存结果: {result}")
```

### 保存指数分笔

```python
from FQData import save_index_transaction

result = save_index_transaction('000001', start_date='2024-01-01')
```

---

## 数据源

- [TdxTransactionAdapter](../datasource/adapters/tdx/transaction.md)
- [TdxIndexAdapter](../datasource/adapters/tdx/index.md)

## 相关文档

- [DataStore 模块](../README.md)
- [Savers 模块索引](README.md)
