# FAQ

## 基础问题

### Q: DataStruct 模块提供什么功能？

DataStruct 模块提供统一的数据结构，用于处理各种金融数据：

| 功能 | 说明 |
|------|------|
| 行情数据 | 股票、指数、期货、债券 |
| 实时数据 | 股票/期货实时行情 |
| 成交明细 | 逐笔成交数据 |
| 复权处理 | 前复权、后复权 |
| 重采样 | 分钟/日线转换 |
| 指标计算 | 技术指标混入 |

---

### Q: 如何创建数据结构？

```python
import pandas as pd
from FQData.DataStruct import StockDayData

# 从 DataFrame 创建
df = pd.DataFrame({
    'code': ['600000'],
    'date': ['2024-01-01'],
    'open': [10.0],
    'high': [10.5],
    'low': [9.5],
    'close': [10.2],
    'volume': [1000]
})

stock = StockDayData(df)
```

---

## 数据类型问题

### Q: 支持哪些数据类型？

| 类型 | 类 | 说明 |
|------|------|------|
| 股票日线 | `StockDayData` | A股日线 |
| 股票分钟 | `StockMinData` | 1/5/15/30/60分钟 |
| 指数日线 | `IndexDayData` | 上证/深证指数 |
| 指数分钟 | `IndexMinData` | 指数分钟线 |
| 期货日线 | `FutureDayData` | 商品/金融期货 |
| 期货分钟 | `FutureMinData` | 期货分钟线 |
| 债券日线 | `Bond2StockDayData` | 国债/企业债 |

---

### Q: 数据结构继承关系？

```
QuotationDataStructBase (基类)
├── QuotationIndicatorsMixin (指标混入)
├── QuotationOperationsMixin (操作混入)
├── QuotationIOSMixin (IO混入)
│
├── StockDayData
├── StockMinData
├── IndexDayData
├── IndexMinData
├── FutureDayData
└── FutureMinData
```

---

## 复权处理问题

### Q: 如何进行前复权？

```python
from FQData.DataStruct import fetch_stock_adj, data_stock_to_fq

# 获取复权因子
adj_data = fetch_stock_adj(code='600000', start='2024-01-01')

# 前复权转换
fq_data = data_stock_to_fq(original_data, adj_data)
```

---

### Q: 前复权和后复权区别？

| 类型 | 说明 | 公式 |
|------|------|------|
| 前复权 | 以最新价格为基准 | 复权后价格 = 原价格 × 复权因子 |
| 后复权 | 以历史价格为基准 | 复权后价格 = 原价格 ÷ 复权因子 |

```python
# 前复权
fq_data = data_stock_to_fq(original_data, adj_data)

# 后复权
fq_adj_data = data_stock_fq_adj(original_data, adj_data)
```

---

## 重采样问题

### Q: 如何将分钟数据转为日线？

```python
from FQData.DataStruct import min_to_day

# 分钟数据
min_data = query_stock_min('600000', freq='1min', start='2024-01-01')

# 转日线
daily_data = min_to_day(min_data)
```

---

### Q: 支持哪些重采样频率？

| 频率 | 说明 | 示例 |
|------|------|------|
| `1min` | 1分钟 | Tick → 1分钟 |
| `5min` | 5分钟 | 1分钟 → 5分钟 |
| `15min` | 15分钟 | 1分钟 → 15分钟 |
| `30min` | 30分钟 | 1分钟 → 30分钟 |
| `60min` | 60分钟 | 1分钟 → 60分钟 |
| `day/D` | 日线 | 分钟 → 日线 |
| `week/W` | 周线 | 日线 → 周线 |
| `month/M` | 月线 | 日线 → 月线 |

---

### Q: Tick 数据如何重采样？

```python
from FQData.DataStruct import tick_resample_1min

# Tick 数据
tick_data = query_stock_transaction('600000')

# 转 1 分钟
min_data = tick_resample_1min(tick_data)
```

---

## 指标计算问题

### Q: 如何计算技术指标？

```python
# DataStruct 通过 Mixin 提供指标计算
# 具体指标取决于 QuotationIndicatorsMixin 的实现

stock = StockDayData(df)

# 假设有以下指标方法
ma5 = stock.ma(5)    # 5日均线
ma10 = stock.ma(10)  # 10日均线
```

---

### Q: 如何添加自定义指标？

```python
from FQData.DataStruct import QuotationIndicatorsMixin

class CustomIndicators(QuotationIndicatorsMixin):
    """自定义指标混入"""

    def custom_ma(self, n):
        """自定义均线"""
        return self['close'].rolling(n).mean()
```

---

## 数据操作问题

### Q: 如何合并多个数据源？

```python
from FQData.DataStruct import StockDayData

# 多个数据
data1 = query_stock_day('600000', start='2024-01-01', end='2024-06-30')
data2 = query_stock_day('600000', start='2024-07-01', end='2024-12-31')

# 合并
combined = pd.concat([data1, data2])
stock = StockDayData(combined)
```

---

### Q: 如何过滤数据？

```python
stock = StockDayData(df)

# 按日期过滤
stock_2024 = stock[stock['date'] >= '2024-01-01']

# 按价格过滤
stock_above_10 = stock[stock['close'] > 10]

# 按成交量过滤
stock_active = stock[stock['volume'] > 1000]
```

---

## 性能问题

### Q: 大数据量处理慢？

```python
# 使用 chunk 处理大数据
def process_large_data(code, start, end, chunk_size=10000):
    for chunk in pd.read_csv(file, chunksize=chunk_size):
        stock = StockDayData(chunk)
        # 处理每个 chunk
        process(stock)

# 使用向量化操作
stock['returns'] = stock['close'].pct_change()  # 向量化
```

---

## 常见错误

### Q: 错误：列名不匹配

**原因**：列名与数据结构期望的不一致

```python
# 错误：列名不一致
df = pd.DataFrame({
    'stock_code': ['600000'],  # 应该是 'code'
    'price': [10.0]           # 应该是 'close'
})

# 解决：标准化列名
df = df.rename(columns={
    'stock_code': 'code',
    'price': 'close'
})

stock = StockDayData(df)
```

---

### Q: 错误：数据类型不对

**原因**：数据类型不符合要求

```python
# 错误：日期是字符串
df['date'] = '2024-01-01'  # 字符串

# 解决：转换为 datetime
df['date'] = pd.to_datetime(df['date'])

stock = StockDayData(df)
```

---

## 相关文档

- [API 参考](api.md)
- [使用指南](usage.md)
- [开发指南](development.md)
- [最佳实践](best-practices.md)