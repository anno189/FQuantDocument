# DataStruct resample 模块

数据重采样模块，提供 Tick 到分钟、分钟到日线、日线到周线等多种重采样功能。

## 模块结构

```
resample.py
```

## 常量

### A股交易时间

```python
from FQData.DataStruct.resample import (
    A_STOCK_MORNING_START,    # time(9, 25)
    A_STOCK_MORNING_END,      # time(11, 30)
    A_STOCK_AFTERNOON_START,  # time(13, 0)
    A_STOCK_AFTERNOON_END,    # time(15, 0)
    A_STOCK_MORNING_RESAMPLE_OFFSET,  # "30min"
    A_STOCK_AFTERNOON_RESAMPLE_OFFSET,  # "0min"
)
```

### 期货交易时间

```python
from FQData.DataStruct.resample import (
    CFFEX_MORNING_START,  # time(9, 30)
    CFFEX_MORNING_END,    # time(11, 30)
    CFFEX_AFTERNOON_START,  # time(13, 0)
    CFFEX_AFTERNOON_END,  # time(15, 0)
)
```

---

## 函数

### Tick 重采样

#### tick_resample_1min

Tick 数据采样为 1 分钟数据。

```python
from FQData.DataStruct.resample import tick_resample_1min

min_data = tick_resample_1min(tick_data, type_='1min', if_drop=True)
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `tick` | pd.DataFrame | - | Tick 数据 |
| `type_` | str | '1min' | 目标周期 |
| `if_drop` | bool | True | 是否丢弃 NA 值 |

**返回：** pd.DataFrame - 重采样后的分钟数据

**算法说明：**
1. 仅支持转换为 1 分钟数据
2. 与通达信 1 分钟数据一致
3. 可匹配 QA.QA_fetch_get_stock_transaction 得到的数据

---

#### tick_resample

Tick 数据采样为任意级别分钟线。

```python
from FQData.DataStruct.resample import tick_resample

min_data = tick_resample(tick_data, type_='5min')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `tick` | pd.DataFrame | - | Tick 数据 |
| `type_` | str | '1min' | 目标周期 |

**返回：** pd.DataFrame - 重采样后的分钟数据

---

#### ctptick_resample

CTP Tick 数据采样为任意级别分钟线。

```python
from FQData.DataStruct.resample import ctptick_resample

min_data = ctptick_resample(ctp_tick, type_='1min')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `tick` | pd.DataFrame | - | CTP Tick 数据 |
| `type_` | str | '1min' | 目标周期 |

**返回：** pd.DataFrame - 重采样后的分钟数据

---

### 分钟重采样

#### min_resample

分钟线采样成大周期（支持A股交易时间）。

```python
from FQData.DataStruct.resample import min_resample

data_5min = min_resample(min_data, type_='5min')
data_15min = min_resample(min_data, type_='15min')
data_30min = min_resample(min_data, type_='30min')
data_60min = min_resample(min_data, type_='60min')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `min_data` | pd.DataFrame | - | 分钟线数据 |
| `type_` | str | '5min' | 目标周期 |

**返回：** pd.DataFrame - 重采样后的数据

**聚合规则：**

| 字段 | 规则 |
|------|------|
| code | first |
| open | first |
| high | max |
| low | min |
| close | last |
| vol/volume | sum |
| amount | sum |

---

#### stockmin_resample

1 分钟线采样成 period 级别的分钟线。

```python
from FQData.DataStruct.resample import stockmin_resample

data_5min = stockmin_resample(min_data, period=5)
data_15min = stockmin_resample(min_data, period=15)
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `min_data` | pd.DataFrame | - | 1 分钟线数据 |
| `period` | int/str | 5 | 周期，可为 int 或 str |

**返回：** pd.DataFrame - 重采样后的分钟数据

---

### 分钟转日线

#### min_to_day

分钟线转日线。

```python
from FQData.DataStruct.resample import min_to_day

daily = min_to_day(min_data, type_='1D')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `min_data` | pd.DataFrame | - | 分钟线数据 |
| `type_` | str | '1D' | 目标周期 |

**返回：** pd.DataFrame - 日线数据

---

### 期货重采样

#### futuremin_resample

期货分钟线采样成大周期。

```python
from FQData.DataStruct.resample import futuremin_resample

data_5min = futuremin_resample(min_data, type_='5min')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `min_data` | pd.DataFrame | - | 期货分钟线数据 |
| `type_` | str | '5min' | 目标周期 |
| `exchange_id` | str | None | 交易所 ID |

**支持交易所：**
- CFFEX (中金所)
- SHFE (上期所)
- DCE (大商所)
- CZCE (郑商所)
- INE (上期能源)

---

#### futuremin_resample_tb_kq

期货分钟线采样（适用于 TB/快期）。

```python
from FQData.DataStruct.resample import futuremin_resample_tb_kq

data_5min = futuremin_resample_tb_kq(min_data, type_='5min')
```

---

#### futuremin_resample_tb_kq2

期货分钟线采样（适用于 TB/快期，快期2）。

```python
from FQData.DataStruct.resample import futuremin_resample_tb_kq2

data_5min = futuremin_resample_tb_kq2(min_data, type_='5min')
```

---

#### futuremin_resample_today

当日期货分钟线采样。

```python
from FQData.DataStruct.resample import futuremin_resample_today

today_data = futuremin_resample_today(min_data, type_='1D')
```

---

#### futuremin_resample_series

期货分钟线采样（按系列）。

```python
from FQData.DataStruct.resample import futuremin_resample_series

data_5min = futuremin_resample_series(min_data, key='open', type_='5min')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `min_data` | pd.DataFrame | - | 期货分钟线数据 |
| `key` | str | 'open' | 聚合字段 |
| `type_` | str | '5min' | 目标周期 |
| `exchange_id` | str | None | 交易所 ID |

---

### 日线重采样

#### day_resample

日线降采样（周/月/季/年）。

```python
from FQData.DataStruct.resample import day_resample

weekly = day_resample(daily, type_='w')      # 周线
monthly = day_resample(daily, type_='m')    # 月线
quarterly = day_resample(daily, type_='q')  # 季线
yearly = day_resample(daily, type_='y')     # 年线
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `day_data` | pd.DataFrame | - | 日线数据 |
| `type_` | str | 'w' | 目标周期 |

**返回：** pd.DataFrame - 重采样后的数据

---

#### futureday_resample

期货日线降采样。

```python
from FQData.DataStruct.resample import futureday_resample

weekly = futureday_resample(future_daily, type_='w')
```

---

## 使用示例

### Tick 转分钟

```python
import pandas as pd
from FQData.DataStruct.resample import tick_resample_1min

tick_data = pd.DataFrame({
    'date': ['2024-01-01'] * 100,
    'code': ['600000'] * 100,
    'price': [10.0 + i * 0.01 for i in range(100)],
    'vol': [100 for i in range(100)]
})

min_data = tick_resample_1min(tick_data)
```

### 分钟转日线

```python
from FQData.DataStruct.resample import min_to_day, min_resample

daily = min_to_day(min_5min)

data_30min = min_resample(min_5min, type_='30min')
```

### 日线转周线

```python
from FQData.DataStruct.resample import day_resample

weekly = day_resample(daily, type_='w')
```

### 期货重采样

```python
from FQData.DataStruct.resample import (
    futuremin_resample,
    futuremin_resample_tb_kq,
    ctptick_resample,
)

data_5min = futuremin_resample(future_min, type_='5min')

data_1min_tb = futuremin_resample_tb_kq(future_min, type_='1min')

min_data = ctptick_resample(ctp_tick, type_='1min')
```

---

## 相关文档

- [DataStruct README](README.md)
- [DataStruct API](api.md)
- [DataStruct _base](_base.md)