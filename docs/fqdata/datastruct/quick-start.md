---
title: DataStruct - 快速入门
description: 10分钟快速上手 DataStruct 数据结构模块
tag:
  - fqdata
  - datastruct

summary:
  purpose: quick-start
  complexity: low
---

# DataStruct - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [速查表](./cheatsheet.md) → [使用指南](./usage.md) → [案例库](./examples.md) |


## 概述

10分钟快速上手 DataStruct 数据结构模块。

## 前置要求

- Python 3.8+
- pip
- pandas
- numpy

## 安装

```bash
pip install fquant-fqdata
```

## 10分钟上手

### Step 1: 导入模块

```python
from FQData.DataStruct import StockDayData, IndexDayData, FutureDayData
```

### Step 2: 创建数据实例

```python
import pandas as pd

# 创建示例数据
data = pd.DataFrame({
    'code': ['000001', '000001', '000002', '000002'],
    'date': ['2024-01-01', '2024-01-02', '2024-01-01', '2024-01-02'],
    'open': [10.0, 10.5, 20.0, 20.5],
    'high': [10.5, 11.0, 20.5, 21.0],
    'low': [9.5, 10.0, 19.5, 20.0],
    'close': [10.2, 10.8, 20.2, 20.8],
    'volume': [1000000, 1200000, 800000, 900000],
})
data['date'] = pd.to_datetime(data['date'])
data = data.set_index(['code', 'date'])

# 创建股票日线数据对象
stock = StockDayData(data)
print(stock)
```

### Step 3: 数据筛选

```python
# 按代码筛选
selected = stock.select_code('000001')
print(selected)

# 按时间筛选
selected = stock.select_time('2024-01-01', '2024-01-02')
print(selected)

# 组合筛选
selected = stock.selects(code='000001', start_date='2024-01-01', end_date='2024-01-02')
```

### Step 4: 数据操作

```python
# 获取 DataFrame
df = stock.to_df()
print(df.head())

# 迭代数据
for row in stock:
    print(row)

# 合并数据
stock1 = StockDayData(data1)
stock2 = StockDayData(data2)
combined = stock1 + stock2  # 合并并去重
```

### Step 5: 完成！

恭喜！你已经学会了 DataStruct 的基本用法。

## ⚠️ 常见陷阱

1. **陷阱 1：Mixin 类不能直接实例化**
   - ❌ 错误做法：`from FQData.DataStruct import QuotationOperationsMixin; obj = QuotationOperationsMixin()`
   - ✅ 正确做法：`from FQData.DataStruct import StockDayData; obj = StockDayData(data)`

2. **陷阱 2：数据索引必须是 MultiIndex**
   - ❌ 错误做法：`data = data.set_index('date')`
   - ✅ 正确做法：`data = data.set_index(['code', 'date'])`

3. **陷阱 3：时间字符串格式**
   - ❌ 错误做法：`stock.select_time('2024/01/01', '2024/01/02')`
   - ✅ 正确做法：`stock.select_time('2024-01-01', '2024-01-02')`

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [术语表](./glossary.md)
- 查看 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [术语表](./glossary.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
