# DataStruct 最佳实践

## 数据验证

### 创建时验证

```python
import pandas as pd
from FQData.DataStruct import StockDayData

def validate_and_create(df, data_type='stock_day'):
    required_columns = ['open', 'high', 'low', 'close', 'volume']

    missing = set(required_columns) - set(df.columns)
    if missing:
        raise ValueError(f"缺少必要列: {missing}")

    if (df['high'] < df['low']).any():
        raise ValueError("最高价不能小于最低价")

    if (df[['open', 'high', 'low', 'close']] < 0).any().any():
        raise ValueError("价格不能为负数")

    if data_type == 'stock_day':
        return StockDayData(df)
    else:
        raise ValueError(f"不支持的数据类型: {data_type}")

df = pd.DataFrame({...})
stock_day = validate_and_create(df)
```

---

## 索引设置

### 推荐索引结构

```python
import pandas as pd

df = pd.DataFrame({...})

df = df.set_index(['date', 'code'])

if 'date' in df.index.names and 'code' in df.index.names:
    stock_day = StockDayData(df)
else:
    raise ValueError("索引必须包含 date 和 code")
```

---

## 内存优化

### 使用适当的数据类型

```python
import numpy as np

df['volume'] = df['volume'].astype(np.int64)
df['open'] = df['open'].astype(np.float32)
df['high'] = df['high'].astype(np.float32)
df['low'] = df['low'].astype(np.float32)
df['close'] = df['close'].astype(np.float32)

stock_day = StockDayData(df)
```

### 及时释放内存

```python
del large_dataframe

import gc
gc.collect()
```

---

## 复权处理

### 统一复权类型

```python
stock_day_qfq = StockDayData(df, if_fq='qfq')
stock_day_hfq = StockDayData(df, if_fq='hfq')
stock_day_bfq = StockDayData(df, if_fq='bfq')

returns_qfq = stock_day_qfq.returns()
returns_hfq = stock_day_hfq.returns()
```

### 复权数据缓存

```python
from FQData.DataStruct import fetch_stock_adj, data_stock_to_fq

adj_data = fetch_stock_adj(code='600000', start='2024-01-01')

fq_data = data_stock_to_fq(original_data, adj_data)
fq_data.to_pickle('/tmp/fq_cache/600000_qfq.pkl')
```

---

## 重采样

### 使用合适的重采样函数

```python
from FQData.DataStruct import (
    tick_resample_1min,
    min_resample,
    min_to_day,
    day_resample
)

if is_tick_data:
    min_data = tick_resample_1min(tick_data)
elif is_minute_data:
    min_5 = min_resample(min_data, freq='5min')
    daily = min_to_day(min_data)
elif is_daily_data:
    weekly = day_resample(daily, freq='W')
```

### 通达信格式期货数据

```python
from FQData.DataStruct import futuremin_resample_tb_kq

resampled = futuremin_resample_tb_kq(future_min)
```

---

## 批量处理

### 使用生成器处理大数据

```python
for stock in stock_day.security_gen:
    result = process_stock(stock)
    save_result(result)
```

### 分批处理避免内存溢出

```python
batch_size = 1000
for i in range(0, len(stock_day), batch_size):
    batch = stock_day[i:i+batch_size]
    process_batch(batch)
```

---

## 计算性能

### 避免循环中使用属性访问

```python
# 不推荐
for i in range(len(stock_day)):
    close = stock_day.close.iloc[i]

# 推荐
closes = stock_day.close
for i in range(len(stock_day)):
    close = closes.iloc[i]
```

### 使用向量化操作

```python
returns = stock_day.close.pct_change()

ma5 = stock_day.close.rolling(5).mean()

stock_day['ma5'] = ma5
```

---

## 数据合并

### 使用加法合并数据

```python
combined = stock_day_1 + stock_day_2

combined = stock_day_1.add(stock_day_2).drop_duplicates()
```

### 确保类型一致

```python
if not stock_day_1.is_same(stock_day_2):
    print("警告: 两个数据集类型不一致")

    stock_day_2 = StockDayData(
        stock_day_2.to_df(),
        dtype=stock_day_1.dtype,
        if_fq=stock_day_1.if_fq
    )
```

---

## 错误处理

### 处理空数据

```python
if stock_day.len == 0:
    print("警告: 数据为空")
elif stock_day.validate():
    print("数据有效")
else:
    print("错误: 数据无效")
```

### 处理无效索引

```python
try:
    bar = stock_day.find_bar('600000', '2024-01-15')
    if bar is not None:
        print(f"找到: {bar}")
except Exception as e:
    print(f"查询失败: {e}")
```

---

## 命名规范

### 变量命名

```python
stock_day_data = StockDayData(df)
stock_min_5min = StockMinData(min_5_df)
index_day_data = IndexDayData(index_df)
future_min_data = FutureMinData(future_min_df)
```

---

## 日志记录

```python
import logging

logger = logging.getLogger(__name__)

def create_data_struct(df, dtype):
    logger.info(f"创建数据结构: {dtype}, 数据量: {len(df)}")

    try:
        if dtype == 'stock_day':
            data_struct = StockDayData(df)
        elif dtype == 'stock_min':
            data_struct = StockMinData(df)
        else:
            raise ValueError(f"不支持的类型: {dtype}")

        logger.info(f"创建成功: {data_struct}")
        return data_struct

    except Exception as e:
        logger.error(f"创建失败: {e}")
        raise
```

---

## 序列化建议

```python
import pickle

stock_day = StockDayData(df)

with open('stock_day.pkl', 'wb') as f:
    pickle.dump(stock_day, f)

with open('stock_day.pkl', 'rb') as f:
    loaded = pickle.load(f)
```

---

## 最佳存储格式

| 数据类型 | 推荐格式 | 说明 |
|---------|---------|------|
| 短期使用 | pickle | 快速，保留 pandas 结构 |
| 长期存储 | parquet | 高压缩，跨平台兼容 |
| 传输使用 | json | 通用格式，易读 |
| 大数据分析 | parquet | 列式存储，查询高效 |

---

## 相关文档

- [README](README.md)
- [API 参考](api.md)
- [使用指南](usage.md)
- [开发指南](development.md)
- [FAQ](faq.md)