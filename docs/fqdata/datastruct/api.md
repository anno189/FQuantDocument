---
title: DataStruct - API参考
description: DataStruct 数据结构模块 API 参考文档
tag:
  - fqdata
  - datastruct

summary:
  purpose: api-reference
  core_classes:
    - QuotationDataStructBase
    - StockDayData
    - StockMinData
    - IndexDayData
    - FutureDayData
---

# DataStruct - API参考

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → **[API参考](./api.md)** |


## 概述

DataStruct 模块 API 参考文档。

## 类

### QuotationDataStructBase

**位置：** `FQData/DataStruct/_base.py`

**描述：** 行情数据结构基类，所有具体数据类的父类

```python
from FQData.DataStruct import StockDayData

stock = StockDayData(data)
```

#### 参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| data | pd.DataFrame | 是 | - | 行情数据，必须包含 open/high/low/close/volume 列 |
| dtype | str | 否 | None | 数据类型 |
| if_fq | str | 否 | 'qfq' | 复权类型：'qfq'/'hfq'/'none' |
| market_type | str | 否 | None | 市场类型 |
| frequence | str | 否 | None | 数据频率：'day'/'min1'/'min5' 等 |

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| data | pd.DataFrame | 原始数据 |
| index | pd.Index | 数据索引 |
| open | pd.Series | 开盘价 |
| high | pd.Series | 最高价 |
| low | pd.Series | 最低价 |
| close | pd.Series | 收盘价 |
| volume | pd.Series | 成交量 |
| amount | pd.Series | 成交额 |

#### 方法

##### select_code

```python
result = stock.select_code('000001')
```

**描述：** 按股票代码筛选数据

**参数：**
| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| code | str | 是 | 股票代码 |

**返回：** `QuotationDataStructBase`

##### select_time

```python
result = stock.select_time('2024-01-01', '2024-01-31')
```

**描述：** 按时间范围筛选数据

**参数：**
| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| start_date | str | 是 | 开始日期 (YYYY-MM-DD) |
| end_date | str | 是 | 结束日期 (YYYY-MM-DD) |

**返回：** `QuotationDataStructBase`

##### to_df

```python
df = stock.to_df()
```

**描述：** 转换为 Pandas DataFrame

**返回：** `pd.DataFrame`

##### resample

```python
result = stock.resample('W')
```

**描述：** 重采样，转换为不同周期

**参数：**
| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| freq | str | 是 | 目标频率：'D'/'W'/'M' 等 |

**返回：** 重采样后的数据对象

---

### StockDayData

**位置：** `FQData/DataStruct/stock.py`

**描述：** 股票日线数据类

```python
from FQData.DataStruct import StockDayData

stock = StockDayData(data)
```

#### 特有属性

| 属性 | 类型 | 描述 |
|------|------|------|
| preclose | pd.Series | 昨收价 |
| change | pd.Series | 涨跌额 |
| pct_change | pd.Series | 涨跌幅 |
| amplitude | pd.Series | 振幅 |
| high_limit | pd.Series | 涨停价 |
| low_limit | pd.Series | 跌停价 |

---

### StockMinData

**位置：** `FQData/DataStruct/stock.py`

**描述：** 股票分钟线数据类

```python
from FQData.DataStruct import StockMinData

stock_min = StockMinData(data)
```

#### 特有属性

| 属性 | 类型 | 描述 |
|------|------|------|
| min5 | StockMinData | 5分钟线 |
| min15 | StockMinData | 15分钟线 |
| min30 | StockMinData | 30分钟线 |
| min60 | StockMinData | 60分钟线 |

---

### IndexDayData

**位置：** `FQData/DataStruct/index.py`

**描述：** 指数日线数据类

```python
from FQData.DataStruct import IndexDayData

index = IndexDayData(data)
```

---

### FutureDayData

**位置：** `FQData/DataStruct/future.py`

**描述：** 期货日线数据类

```python
from FQData.DataStruct import FutureDayData

future = FutureDayData(data)
```

---

## Mixin 类

### QuotationIndicatorsMixin

**描述：** 指标计算 Mixin，提供技术指标计算功能

```python
# 通过继承使用
class StockDayData(QuotationDataStructBase, QuotationIndicatorsMixin):
    pass
```

#### 方法

| 方法 | 返回类型 | 描述 |
|------|----------|------|
| max() | pd.Series | 最大值 |
| min() | pd.Series | 最小值 |
| mean() | pd.Series | 平均值 |
| stdev() | pd.Series | 标准差 |
| variance() | pd.Series | 方差 |
| pct_change() | pd.Series | 百分比变化 |
| amplitude() | pd.Series | 振幅 |

---

### QuotationOperationsMixin

**描述：** 数据操作 Mixin，提供数据筛选、切片等功能

#### 方法

| 方法 | 返回类型 | 描述 |
|------|----------|------|
| select_code() | QuotationDataStructBase | 按代码筛选 |
| select_time() | QuotationDataStructBase | 按时间筛选 |
| selects() | QuotationDataStructBase | 组合筛选 |
| head() | QuotationDataStructBase | 获取前 N 条 |
| tail() | QuotationDataStructBase | 获取后 N 条 |

---

### QuotationIOSMixin

**描述：** 序列化 IO Mixin，提供数据导入导出功能

#### 方法

| 方法 | 返回类型 | 描述 |
|------|----------|------|
| to_df() | pd.DataFrame | 转换为 DataFrame |
| to_csv() | str | 导出为 CSV |
| to_json() | str | 导出为 JSON |
| to_excel() | bytes | 导出为 Excel |
| to_pickle() | bytes | 导出为 Pickle |

---

## 异常

本模块定义的异常类型：

| 异常 | 描述 | 触发条件 | 解决方案 |
|------|------|---------|---------|
| ValueError | 值错误 | 代码或时间筛选无效 | 检查代码格式和时间范围 |
| KeyError | 键错误 | 列名不存在 | 检查数据列名 |
| RuntimeError | 运行时错误 | 格式不支持 | 检查数据格式 |

---

## API 示例

### 基本用法

```python
import pandas as pd
from FQData.DataStruct import StockDayData

# 创建数据
data = pd.DataFrame({
    'code': ['000001', '000001'],
    'date': ['2024-01-01', '2024-01-02'],
    'open': [10.0, 10.5],
    'high': [10.5, 11.0],
    'low': [9.5, 10.0],
    'close': [10.2, 10.8],
    'volume': [1000000, 1200000],
})
data['date'] = pd.to_datetime(data['date'])
data = data.set_index(['code', 'date'])

# 创建对象
stock = StockDayData(data)

# 筛选数据
result = stock.select_code('000001').select_time('2024-01-01', '2024-01-31')

# 获取统计
stats = result.mean()
print(stats)
```

### 更多示例

请参考 [快速入门](./quick-start.md) 和 [最佳实践](./best-practices.md)。

## 相关文档

- [使用指南](./usage.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
