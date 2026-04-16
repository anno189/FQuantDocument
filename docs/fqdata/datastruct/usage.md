---
title: DataStruct - 使用指南
description: DataStruct 数据结构模块详细使用指南
tag:
  - fqdata
  - datastruct
---

# DataStruct - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[使用指南](./usage.md)** |
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → **[使用指南](./usage.md)** |

## 概述

如何有效地使用 DataStruct 模块。

## 基本用法

### 安装

```bash
pip install fquant-fqdata
```

### 快速开始

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

# 创建实例
stock = StockDayData(data)

# 使用模块
result = stock.select_code('000001')
print(result)
```

## 常见用例

### 用例 1: 股票数据处理

**场景：** 处理股票日线数据

**代码：**

```python
# 第1步：获取数据（假设从数据源获取）
data = get_stock_data('000001', '2024-01-01', '2024-12-31')

# 第2步：创建数据对象
stock = StockDayData(data)

# 第3步：数据筛选
filtered = stock.select_time('2024-01-01', '2024-06-30')

# 第4步：计算指标
stats = filtered.mean()
print(stats)
```

### 用例 2: 期货分钟数据重采样

**场景：** 将分钟数据转换为日线

**代码：**

```python
# 获取分钟数据
min_data = FutureMinData(minute_data)

# 重采样为日线
daily_data = min_data.resample('D')

# 重采样为周线
weekly_data = min_data.resample('W')
```

### 用例 3: 多数据合并

**场景：** 合并多个数据源

**代码：**

```python
# 获取两个数据源的数据
data1 = datasource1.get_stock('000001')
data2 = datasource2.get_stock('000001')

# 创建数据对象
stock1 = StockDayData(data1)
stock2 = StockDayData(data2)

# 合并数据
combined = stock1 + stock2
```

## 配置

### 复权类型

```python
# 前复权（默认）
stock = StockDayData(data, if_fq='qfq')

# 后复权
stock = StockDayData(data, if_fq='hfq')

# 不复权
stock = StockDayData(data, if_fq='none')
```

### 数据频率

```python
# 日线
stock_day = StockDayData(data, frequence='day')

# 分钟线
stock_min = StockMinData(data, frequence='min1')
```

## 错误处理

```python
try:
    result = stock.select_code('000001')
except ValueError as e:
    print(f"值错误: {e}")
except KeyError as e:
    print(f"键错误: {e}")
```

## 相关文档

- [API参考](./api.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
