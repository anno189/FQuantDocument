---
title: DataStruct - 案例库
description: DataStruct 数据结构模块实际应用场景与示例
tag:
  - fqdata
  - datastruct
---

# DataStruct - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[案例库](./examples.md)** |

## 场景 1: 股票技术指标分析

**业务需求：** 对股票进行技术指标分析，计算收益率、波动率等

```python
import pandas as pd
from FQData.DataStruct import StockDayData

# 假设从数据源获取数据
data = get_stock_daily('000001', '2024-01-01', '2024-12-31')
stock = StockDayData(data)

# 计算收益率
returns = stock.close.pct_change()

# 计算波动率（20日滚动标准差）
volatility = returns.rolling(20).std()

# 计算平均收益率
mean_return = returns.mean()

print(f"平均收益率: {mean_return:.2%}")
print(f"年化波动率: {volatility.iloc[-1] * sqrt(252):.2%}")
```

---

## 场景 2: 多股票对比分析

**业务需求：** 对比多只股票的表现

```python
from FQData.DataStruct import StockDayData

# 获取多只股票数据
stocks = ['000001', '000002', '600000']
results = {}

for code in stocks:
    data = get_stock_daily(code, '2024-01-01', '2024-12-31')
    stock = StockDayData(data)
    
    # 计算年化收益率
    returns = stock.close.pct_change()
    annual_return = returns.mean() * 252
    
    results[code] = annual_return

# 排序结果
sorted_results = sorted(results.items(), key=lambda x: x[1], reverse=True)
print("股票收益排名:", sorted_results)
```

---

## 场景 3: 期货周期转换

**业务需求：** 将期货分钟数据转换为日线、周线进行分析

```python
from FQData.DataStruct import FutureMinData

# 获取期货分钟数据
min_data = get_future_min('IF2401', '2024-01-01', '2024-01-31', 'min1')
future_min = FutureMinData(min_data)

# 转换为日线
daily = future_min.resample('D')

# 转换为周线
weekly = future_min.resample('W')

print("日线数据:", daily)
print("周线数据:", weekly)
```

---

## 场景 4: 数据合并去重

**业务需求：** 合并多个数据源并去重

```python
from FQData.DataStruct import StockDayData

# 从两个数据源获取数据
data1 = datasource1.get_stock('000001', '2024-01-01', '2024-06-30')
data2 = datasource2.get_stock('000001', '2024-04-01', '2024-12-31')

# 创建数据对象
stock1 = StockDayData(data1)
stock2 = StockDayData(data2)

# 合并数据（自动去重）
combined = stock1 + stock2

print(f"合并后数据量: {len(combined)}")
```

---

## 场景 5: 数据导出备份

**业务需求：** 将处理后的数据导出为多种格式

```python
from FQData.DataStruct import StockDayData

stock = StockDayData(data)

# 导出为 CSV
stock.to_csv('stock_data.csv')

# 导出为 Excel
stock.to_excel('stock_data.xlsx')

# 导出为 JSON
json_data = stock.to_json()

# 导出为 Pickle（保持 DataFrame 结构）
pickle_data = stock.to_pickle()
```

---

## 场景 6: 数据缺失值处理

**业务需求：** 处理数据中的缺失值

```python
from FQData.DataStruct import StockDayData

stock = StockDayData(data)

# 向前填充缺失值
filled = stock.fillna(method='ffill')

# 用0填充缺失值
filled_zero = stock.fillna(0)

# 删除含有缺失值的行
cleaned = stock.dropna()

print(f"填充后数据量: {len(filled)}")
```

---

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
