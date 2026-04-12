# DataStruct transaction 模块

交易数据结构模块，提供股票和指数分时成交数据结构的实现。

## 模块结构

```
transaction.py
```

---

## StockTransactionData

股票交易数据结构。

```python
from FQData.DataStruct import StockTransactionData

tx_data = StockTransactionData(df)
```

### 初始化参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `data` | pd.DataFrame | 分时成交数据 |

### 数据预处理

- 自动计算 `amount`（如果不存在）：`volume * price * 100`
- 自动删除 `_id` 列（如果存在）

---

## 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `buyorsell` | pd.Series | 买卖方向 (0-买入, 1-卖出, 2-中性) |
| `price` | pd.Series | 成交价格 |
| `volume` / `vol` | pd.Series | 成交量 |
| `amount` | pd.Series | 成交额 |
| `date` | pd.Series | 成交日期 |
| `datetime` | pd.Series | 成交时间 |
| `code` | pd.Series | 股票代码 |
| `time` | pd.Series | 成交时间（分钟级） |
| `order` | pd.Series | 委托订单号 |
| `index` | pd.Index | 交易索引 |

---

## 方法

### get_code

获取某只股票的交易数据。

```python
stock_tx = tx_data.get_code('600000')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | str | 股票代码 |

**返回：** StockTransactionData

---

### get_date

获取某一天的交易数据。

```python
day_tx = tx_data.get_date('2024-01-01')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `date` | str | 日期字符串 |

**返回：** StockTransactionData

---

### get_time_range

获取时间范围内的交易数据。

```python
range_tx = tx_data.get_time_range(
    start='2024-01-01 09:30:00',
    end='2024-01-01 15:00:00'
)
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `start` | str | 开始时间 |
| `end` | str | 结束时间 |

**返回：** StockTransactionData

---

### get_big_orders

获取大单（成交额大于等于阈值）。

```python
big_tx = tx_data.get_big_orders(bigamount=1000000)
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `bigamount` | int | 1000000 | 大单阈值 |

**返回：** StockTransactionData

---

### get_medium_order

获取中等单（成交额在范围内）。

```python
medium_tx = tx_data.get_medium_order(lower=200000, higher=1000000)
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `lower` | int | 200000 | 下限 |
| `higher` | int | 1000000 | 上限 |

**返回：** StockTransactionData

---

### get_small_order

获取小单（成交额小于等于阈值）。

```python
small_tx = tx_data.get_small_order(smallamount=200000)
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `smallamount` | int | 200000 | 小单阈值 |

**返回：** StockTransactionData

---

### resample

重采样为分钟线。

```python
min_tx = tx_data.resample('1min')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type_` | str | '1min' | 分钟周期 |

**返回：** StockTransactionData

---

### to_df

转换为 DataFrame。

```python
df = tx_data.to_df()
```

**返回：** pd.DataFrame

---

## IndexTransactionData

指数交易数据结构。

```python
from FQData.DataStruct import IndexTransactionData

index_tx = IndexTransactionData(df)
```

**与 StockTransactionData 接口相同**

---

## 使用示例

### 基本使用

```python
from FQData.DataStruct import StockTransactionData

tx_data = StockTransactionData(df)

print(f"成交数量: {len(tx_data)}")
print(f"买卖方向: {tx_data.buyorsell.value_counts()}")
```

### 筛选大单

```python
big_orders = tx_data.get_big_orders(bigamount=5000000)
print(f"大单数量: {len(big_orders)}")
```

### 时间范围查询

```python
morning_tx = tx_data.get_time_range(
    start='2024-01-01 09:30:00',
    end='2024-01-01 11:30:00'
)
```

### 重采样为分钟线

```python
min_tx = tx_data.resample('1min')
```

---

## 相关文档

- [DataStruct README](README.md)
- [DataStruct API](api.md)
- [DataStruct realtime](realtime.md)