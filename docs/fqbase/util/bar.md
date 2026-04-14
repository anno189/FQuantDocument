---
title: Bar
description: 时间索引工具，提供股票和期货分钟线、小时线的时间索引生成功能
tag:
  - fqbase
  - util
  - utility

summary:
  type: utility
  complexity: minimal
  maturity: stable
  functions:
    - util_make_future_min_index
    - util_make_min_index
    - util_make_hour_index
    - util_time_gap
---

# Bar

## 一句话总览

📌 **时间索引工具，生成股票和期货分钟线、小时线的时间索引**

**TL;DR**：
- 核心能力：股票时间索引、期货时间索引、时间Gap计算
- 入门难度：🟢 简单

## 快速开始

```python
from FQBase.Util.bar import util_make_min_index

index = util_make_min_index('2024-01-01', '1min')
```

## 函数列表

### util_make_future_min_index

```python
from FQBase.Util.bar import util_make_future_min_index

index = util_make_future_min_index(day, type_='1min')
```

**描述：** 创建期货分钟线的 DatetimeIndex

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| day | str | 是 | 交易日，格式如 '2024-01-01' |
| type_ | str | 否 | 分钟周期，默认 '1min' |

**返回：** `DatetimeIndex` - 期货交易时间索引

**交易时间**：
- 夜盘：21:00 - 23:59
- 白盘：13:00 - 15:00

**示例：**

```python
index = util_make_future_min_index('2024-01-01', '1min')
print(index)
```

---

### util_make_min_index

```python
from FQBase.Util.bar import util_make_min_index

index = util_make_min_index(day, type_='1min')
```

**描述：** 创建股票分钟线的 DatetimeIndex

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| day | str | 是 | 交易日，格式如 '2024-01-01' |
| type_ | str | 否 | 分钟周期，默认 '1min' |

**返回：** `DatetimeIndex` - 股票交易时间索引

**交易时间**：
- 上午：09:30 - 11:30
- 下午：13:00 - 15:00

**示例：**

```python
index = util_make_min_index('2024-01-01', '1min')
print(index)
```

---

### util_make_hour_index

```python
from FQBase.Util.bar import util_make_hour_index

index = util_make_hour_index(day, type_='1h')
```

**描述：** 创建股票小时线的 DatetimeIndex

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| day | str | 是 | 交易日，格式如 '2024-01-01' |
| type_ | str | 否 | 小时周期，默认 '1h' |

**返回：** `DatetimeIndex` - 股票小时线时间索引

**示例：**

```python
index = util_make_hour_index('2024-01-01', '1h')
print(index)
```

---

### util_time_gap

```python
from FQBase.Util.bar import util_time_gap

result = util_time_gap(time, gap, methods, type_)
```

**描述：** 分钟线回测的时间Gap计算，按交易日往前或往后推算

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| time | str | 是 | 时间，格式如 '2024-01-01 10:30:00' |
| gap | int | 是 | Gap 值 |
| methods | str | 是 | 方向：'>', 'gt', '>=', 'gte', '<', 'lt', '<=', 'lte', '==', '=', 'eq' |
| type_ | str | 是 | 周期，如 '1min', '5min' |

**返回：** `Optional[str]` - 符合条件的起始时间字符串，不存在返回 None

**示例：**

```python
result = util_time_gap('2024-01-01 10:30:00', 5, '>', '1min')
print(result)
```

---

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01-01 | 初始版本 |
