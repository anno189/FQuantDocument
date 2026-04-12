# Bar 模块

时间索引工具，提供股票和期货分钟线、小时线的时间索引生成功能。

## 函数

### util_make_future_min_index

创建期货分钟线的 DatetimeIndex。

```python
from FQBase.Util import util_make_future_min_index

# 创建 1 分钟线索引
index = util_make_future_min_index('2024-01-01', '1min')

# 创建 5 分钟线索引
index = util_make_future_min_index('2024-01-01', '5min')
```

**交易时间**：
- 夜盘：21:00 - 23:59
- 白盘：13:00 - 15:00

**参数**：
| 参数 | 类型 | 说明 |
|------|------|------|
| `day` | `str` | 交易日 |
| `type_` | `str` | 分钟周期，默认 `'1min'` |

---

### util_make_min_index

创建股票分钟线的 DatetimeIndex。

```python
from FQBase.Util import util_make_min_index

# 创建 1 分钟线索引
index = util_make_min_index('2024-01-01', '1min')

# 创建 5 分钟线索引
index = util_make_min_index('2024-01-01', '5min')
```

**交易时间**：
- 上午：09:30 - 11:30
- 下午：13:00 - 15:00

---

### util_make_hour_index

创建股票小时线的 DatetimeIndex。

```python
from FQBase.Util import util_make_hour_index

# 创建 1 小时线索引
index = util_make_hour_index('2024-01-01', '1h')
```

---

### util_time_gap

计算分钟线回测的时间 gap，按交易日往前往后推。

```python
from FQBase.Util import util_time_gap

# 获取当前时间往后第5个5分钟线
next_time = util_time_gap('2024-01-01 09:35:00', 5, '>', '5min')

# 获取往前第5个5分钟线
prev_time = util_time_gap('2024-01-01 09:35:00', 5, '<', '5min')
```

**参数**：
| 参数 | 类型 | 说明 |
|------|------|------|
| `time` | `str` | 时间（`'YYYY-MM-DD HH:MM:SS'`） |
| `gap` | `int` | gap 值 |
| `methods` | `str` | 方向：`'>'`, `'>='`, `'<'`, `'<='`, `'=='` |
| `type_` | `str` | 周期（如 `'1min'`, `'5min'`） |

---

## 使用示例

### 生成分钟线时间索引

```python
from FQBase.Util import util_make_min_index
import pandas as pd

# 生成交易日 9:30-11:30 和 13:00-15:00 的分钟索引
index = util_make_min_index('2024-01-01', '5min')

# 转换为 DataFrame
df = pd.DataFrame({'time': index})
print(df.head(10))
```

### 生成期货分钟线

```python
from FQBase.Util import util_make_future_min_index

# 期货夜盘 + 白盘
index = util_make_future_min_index('2024-01-02', '1min')

print(f"索引数量: {len(index)}")
print(f"夜盘: {index[0]} - {index[len(index)//2]}")
print(f"白盘: {index[len(index)//2+1]} - {index[-1]}")
```

### 回测时间计算

```python
from FQBase.Util import util_time_gap

# 假设当前时间是 2024-01-01 09:35:00
current_time = '2024-01-01 09:35:00'

# 往后推 5 个 5 分钟
next_5 = util_time_gap(current_time, 5, '>', '5min')
print(f"当前时间: {current_time}")
print(f"往后第5个5分钟: {next_5}")

# 往前推 5 个 5 分钟
prev_5 = util_time_gap(current_time, 5, '<', '5min')
print(f"往前第5个5分钟: {prev_5}")
```

### 生成 OHLC 数据框架

```python
from FQBase.Util import util_make_min_index
import pandas as pd
import numpy as np

# 生成 5 分钟线时间索引
times = util_make_min_index('2024-01-01', '5min')

# 生成模拟 OHLC 数据
n = len(times)
df = pd.DataFrame({
    'datetime': times,
    'open': np.random.randn(n).cumsum() + 100,
    'high': np.random.randn(n).cumsum() + 102,
    'low': np.random.randn(n).cumsum() + 98,
    'close': np.random.randn(n).cumsum() + 100,
    'volume': np.random.randint(1000, 10000, n)
})

print(df.head())
```

---

## 内部函数

### FQ_util_make_min_index

股票分钟线索引生成（内部使用）。

### FQ_util_make_hour_index

股票小时线索引生成（内部使用）。

---

## 相关文档

- [Util 模块](../README.md)
- [日期工具](../date/README.md)
- [数据转换](../converters.md)
- [格式转换](../transformer.md)