# DataStruct 开发指南

## 模块简介

DataStruct 模块提供统一的行情数据结构，支持股票、指数、期货、债券等多种数据类型。

### 核心组件

| 组件 | 说明 |
|------|------|
| `QuotationDataStructBase` | 行情数据结构基类 |
| `StockDayData` | 股票日线数据 |
| `StockMinData` | 股票分钟数据 |
| `IndexDayData` | 指数日线数据 |
| `FutureDayData` | 期货日线数据 |

---

## 开发环境

### 环境要求

- Python 3.8+
- pandas
- numpy
- pytest

### 安装

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQData
pip install -e .
```

### 验证安装

```python
from FQData.DataStruct import StockDayData

print(StockDayData)  # <class 'FQData.DataStruct.stock.StockDayData'>
```

---

## 本地调试

### 基本调试流程

```python
import pandas as pd
from FQData.DataStruct import StockDayData

# 创建数据
df = pd.DataFrame({
    'code': ['600000'] * 10,
    'date': pd.date_range('2024-01-01', periods=10),
    'open': [10.0] * 10,
    'high': [10.5] * 10,
    'low': [9.5] * 10,
    'close': [10.2] * 10,
    'volume': [1000] * 10
})

# 创建数据结构
stock_data = StockDayData(df)
print(f"数据条数: {len(stock_data)}")
print(f"列名: {stock_data.columns}")
```

### 调试数据操作

```python
from FQData.DataStruct import StockDayData

# 获取数据
df = query_stock_day('600000', start='2024-01-01', end='2024-01-10')
stock_data = StockDayData(df)

# 调试：检查数据
print(f"列名: {stock_data.columns.tolist()}")
print(f"数据类型:\n{stock_data.dtypes}")
print(f"前5行:\n{stock_data.head()}")
```

### 调试重采样

```python
from FQData.DataStruct import min_resample

# 分钟重采样
min_5 = min_resample(stock_min, freq='5min')
print(f"5分钟数据条数: {len(min_5)}")

# 验证重采样结果
print(f"5分钟列名: {min_5.columns.tolist()}")
```

---

## 测试指南

### 运行测试

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQData
pytest -v FQData/DataStruct/
```

### 测试结构

```python
import pytest
import pandas as pd
from FQData.DataStruct import StockDayData, StockMinData

class TestStockDayData:
    def test_create_from_dataframe(self):
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
        assert len(stock) == 1
        assert stock.code[0] == '600000'

    def test_create_from_dict(self):
        data = {
            'code': '600000',
            'date': '2024-01-01',
            'open': 10.0,
            'high': 10.5,
            'low': 9.5,
            'close': 10.2,
            'volume': 1000
        }
        stock = StockDayData(data)
        assert len(stock) == 1

class TestResample:
    def test_min_to_day(self):
        from FQData.DataStruct import min_to_day
        df = query_stock_min('600000', freq='1min')
        daily = min_to_day(df)
        assert 'open' in daily.columns
        assert 'close' in daily.columns
```

---

## 代码规范

### 数据类命名

```python
# 推荐：明确的类型命名
class StockDayData:
    """股票日线数据"""
    pass

class FutureMinData:
    """期货分钟数据"""
    pass

# 避免：过于通用的命名
class Data:
    """数据类...什么数据？"""
    pass
```

### 列名规范

```python
# 标准 OHLCV 列名
STANDARD_COLUMNS = ['code', 'date', 'open', 'high', 'low', 'close', 'volume']

# 指标列使用清晰前缀
INDICATOR_COLUMNS = ['ma5', 'ma10', 'ma20', 'kdj_k', 'kdj_d', 'kdj_j']
```

---

## 调试技巧

### 打印数据结构

```python
from FQData.DataStruct import StockDayData

stock = StockDayData(df)

# 查看基本信息
print(f"类型: {type(stock)}")
print(f"形状: {stock.shape}")
print(f"列名: {stock.columns.tolist()}")

# 查看前几行
print(stock.head())

# 查看数据类型
print(stock.dtypes)
```

### 检查数据完整性

```python
def validate_stock_data(stock):
    """验证股票数据完整性"""
    checks = {
        'has_code': 'code' in stock.columns,
        'has_date': 'date' in stock.columns,
        'has_ohlcv': all(c in stock.columns for c in ['open', 'high', 'low', 'close', 'volume']),
        'high_ge_low': (stock['high'] >= stock['low']).all(),
        'volume_positive': (stock['volume'] > 0).all()
    }
    return checks
```

---

## 常见问题

### Q: 数据类型不匹配

```python
# 检查并转换数据类型
from FQData.DataStruct import StockDayData

# 确保列类型正确
df['date'] = pd.to_datetime(df['date'])
df['code'] = df['code'].astype(str)
df['close'] = df['close'].astype(float)

stock = StockDayData(df)
```

### Q: 如何扩展自定义指标

```python
from FQData.DataStruct import QuotationIndicatorsMixin

class CustomIndicatorsMixin:
    """自定义指标混入"""
    
    def custom_indicator(self):
        """自定义指标计算"""
        return self['close'] * 2

class EnhancedStockDayData(CustomIndicatorsMixin, StockDayData):
    """带自定义指标的股票数据"""
    pass
```

---

## 相关文档

- [API 参考](api.md)
- [使用指南](usage.md)
- [最佳实践](best-practices.md)
- [FAQ](faq.md)