# DataStruct _indicators 模块

行情数据统计指标 Mixin 模块，提供各类技术指标和统计量计算。

## 模块结构

```
_indicators.py
```

## QuotationIndicatorsMixin

行情数据统计指标 Mixin，通过多重继承为数据结构提供指标计算功能。

**使用约束：**
- 此类仅用于多重继承，不能直接实例化
- 必须放在继承顺序中的 QuotationDataStructBase 之后
- 不应定义 __init__ 方法

---

## 统计指标

### 基础统计

| 属性 | 返回类型 | 说明 |
|------|----------|------|
| `max` | pd.Series | 最大值 |
| `min` | pd.Series | 最小值 |
| `mean` | pd.Series | 均值 |
| `variance` | pd.Series | 方差 |
| `stdev` | pd.Series | 样本标准差 |
| `pstdev` | pd.Series | 总体标准差 |

### 价格相关

| 属性 | 返回类型 | 说明 |
|------|----------|------|
| `price_diff` | pd.Series | 价格一阶差分 |
| `amplitude` | pd.Series | 振幅 (百分比) |

### K 线形态

| 属性 | 返回类型 | 说明 |
|------|----------|------|
| `bar_pct_change` | pd.Series | 单根 K 线涨跌幅 |
| `bar_amplitude` | pd.Series | 单根 K 线振幅 |

### 高级统计

| 属性 | 返回类型 | 说明 |
|------|----------|------|
| `mean_harmonic` | pd.Series | 调和平均数 |
| `mode` | pd.Series | 众数 |
| `skew` | pd.Series | 偏度 |
| `kurt` | pd.Series | 峰度 |

---

## 使用示例

### 基本使用

```python
from FQData.DataStruct import StockDayData

# 假设 stock 是 StockDayData 实例
print(f"最大值: {stock.max}")
print(f"最小值: {stock.min}")
print(f"均值: {stock.mean}")
```

### 价格分析

```python
# 价格差分
print(f"价格差分: {stock.price_diff}")

# 振幅
print(f"振幅: {stock.amplitude}")
```

### K 线分析

```python
# 单根 K 线涨跌幅
print(f"涨跌幅: {stock.bar_pct_change}")

# 单根 K 线振幅
print(f"振幅: {stock.bar_amplitude}")
```

### 高级统计

```python
# 偏度 (衡量分布偏斜程度)
print(f"偏度: {stock.skew}")

# 峰度 (衡量分布尖峭程度)
print(f"峰度: {stock.kurt}")
```

---

## 与基类结合使用

```python
from FQData.DataStruct._base import QuotationDataStructBase
from FQData.DataStruct._indicators import QuotationIndicatorsMixin
from FQData.DataStruct._operations import QuotationOperationsMixin
from FQData.DataStruct._io import QuotationIOSMixin

class MyDataStruct(
    QuotationDataStructBase,
    QuotationIndicatorsMixin,
    QuotationOperationsMixin,
    QuotationIOSMixin
):
    def resample(self, level):
        pass

# MyDataStruct 实例同时具有基类和 Mixin 的所有方法
data = MyDataStruct(df, dtype='stock_day')
print(f"最大值: {data.max}")
print(f"均值: {data.mean}")
print(f"偏度: {data.skew}")
```

---

## 相关文档

- [DataStruct README](README.md)
- [DataStruct API](api.md)
- [DataStruct _base](_base.md)