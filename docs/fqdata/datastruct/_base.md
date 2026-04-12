# DataStruct _base 模块

行情数据结构核心基类，提供统一的数据结构和操作接口。

## 模块结构

```
_base.py
```

## QuotationDataStructBase

行情数据结构抽象基类，定义统一的行情数据接口。

### 继承关系

```
QuotationDataStructBase (ABC)
    ├── QuotationIndicatorsMixin (统计指标)
    ├── QuotationOperationsMixin (数据操作)
    └── QuotationIOSMixin (序列化 IO)
```

**MRO (Method Resolution Order):**
1. 子类 (如 StockDayData)
2. Mixin 类
3. 基类 (QuotationDataStructBase)

### 初始化参数

```python
from FQData.DataStruct import QuotationDataStructBase

class MyDataStruct(QuotationDataStructBase):
    def resample(self, level):
        pass
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | pd.DataFrame | - | DataFrame 格式的行情数据 |
| `dtype` | str | - | 数据类型标识 (如 'stock_day', 'index_min') |
| `if_fq` | str | 'bfq' | 复权类型 ('bfq'-不复权, 'qfq'-前复权, 'hfq'-后复权) |
| `market_type` | str | None | 市场类型 |
| `frequence` | str | None | 数据频率 |

---

## 属性

### 基本属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `data` | pd.DataFrame | 原始 DataFrame |
| `dtype` | str | 数据类型 |
| `if_fq` | str | 复权类型 |
| `market_type` | str | 市场类型 |
| `frequence` | str | 数据频率 |

### 价格属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `open` | pd.Series | 开盘价 |
| `high` | pd.Series | 最高价 |
| `low` | pd.Series | 最低价 |
| `close` | pd.Series | 收盘价 |
| `volume` / `vol` | pd.Series | 成交量 |
| `amount` | pd.Series | 成交额 |
| `price` | pd.Series | 均价 (OHLC 平均) |

### 索引属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `index` | pd.MultiIndex | 数据索引 (date, code) |
| `code` | pd.Index | 证券代码列表 |
| `date` | pd.DatetimeIndex | 交易日期 |
| `datetime` | pd.DatetimeIndex | 交易时间 |
| `dicts` | dict | 字典格式数据 |

### 便捷属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `len` | int | 数据长度 |
| `splits` | List | 按证券代码拆分列表 |
| `split_dicts` | dict | 拆分为 code:datastruct 字典 |

---

## 方法

### 创建与转换

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `new(data, dtype, if_fq)` | QuotationDataStructBase | 创建新实例 |
| `reverse()` | QuotationDataStructBase | 反转数据 |
| `to_df()` | pd.DataFrame | 转换为 DataFrame |
| `to_list()` | list | 转换为列表 |
| `to_numpy()` | np.ndarray | 转换为 numpy 数组 |
| `to_dict(orient)` | dict | 转换为字典 |

### 数据操作

| 方法 | 说明 |
|------|------|
| `__add__(other)` | 合并数据，去重 |
| `__sub__(other)` | 移除 other 中的数据 |
| `__getitem__(key)` | 支持切片访问 |
| `__iter__()` | 行迭代器 |
| `__len__()` | 数据长度 |
| `validate()` | 验证数据有效性 |

### 分组与聚合

| 方法 | 说明 |
|------|------|
| `groupby(by, level)` | 分组操作 |
| `apply(func, *args)` | 应用函数 |
| `add_func(func, *args)` | 按证券分组应用函数 |
| `agg(func)` | 聚合函数 |
| `aggregate(func)` | 聚合函数 (别名) |

### 查询

| 方法 | 说明 |
|------|------|
| `query(context)` | 查询数据表达式 |
| `find_bar(code, time)` | 查找指定时间和代码的 bar |
| `get_dict(time, code)` | 获取指定时间和代码的字典数据 |

### 迭代器

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `iterrows()` | Iterator | 行迭代器 |
| `items()` | Iterator | 列迭代器 |
| `itertuples()` | Iterator | 元组迭代器 |

### 生成器属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `panel_gen` | Generator | 面板数据迭代器 |
| `bar_gen` | Generator | K 线迭代器 |
| `security_gen` | Generator | 证券代码迭代器 |

### 抽象方法

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `resample(level)` | QuotationDataStructBase | 重采样 (子类必须实现) |

---

## 使用示例

### 创建数据结构

```python
import pandas as pd
from FQData.DataStruct import QuotationDataStructBase

df = pd.DataFrame({
    'open': [10.0, 10.5, 10.3],
    'high': [10.8, 10.9, 10.7],
    'low': [9.8, 10.2, 10.1],
    'close': [10.5, 10.6, 10.4],
    'volume': [1000000, 1200000, 1100000]
}, index=pd.MultiIndex.from_tuples([
    ('2024-01-01', '600000'),
    ('2024-01-02', '600000'),
    ('2024-01-03', '600000'),
], names=['date', 'code']))

class StockDayData(QuotationDataStructBase):
    def resample(self, level):
        pass

stock = StockDayData(df, dtype='stock_day', if_fq='qfq')
print(stock)
# < StockDayData with 1 securities >
```

### 数据操作

```python
# 切片
subset = stock[:2]

# 合并
combined = stock1 + stock2

# 移除
result = stock_all - stock_subset

# 反转
reversed_data = stock.reverse()
```

### 属性访问

```python
print(stock.open)
print(stock.high)
print(stock.low)
print(stock.close)
print(stock.volume)
print(stock.code)
print(stock.date)
```

### 查询

```python
# 表达式查询
result = stock.query('close > 10.5')

# 查找 bar
bar = stock.find_bar('600000', '2024-01-01')

# 获取字典
data = stock.get_dict('2024-01-01', '600000')
```

---

## Mixin 类

### QuotationIndicatorsMixin

统计指标混入类，提供指标计算功能。

### QuotationOperationsMixin

数据操作混入类，提供数据操作功能。

### QuotationIOSMixin

序列化 IO 混入类，提供序列化功能。

---

## 序列化

### Pickle 支持

```python
import pickle

# 序列化
with open('stock.pkl', 'wb') as f:
    pickle.dump(stock, f)

# 反序列化
with open('stock.pkl', 'rb') as f:
    stock = pickle.load(f)
```

**注意：** `@lru_cache` 装饰的属性在序列化后缓存会失效，反序列化后需要调用 `_init_subclass()` 重新初始化。

---

## 相关文档

- [DataStruct README](README.md)
- [DataStruct API](api.md)
- [DataStruct 使用指南](usage.md)