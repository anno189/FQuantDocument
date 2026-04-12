# FQData 使用指南

## 基本使用

### 获取数据源

```python
from FQData import get_datasource

ds = get_datasource()
print(ds)
```

### 获取存储

```python
from FQData import get_datastore

store = get_datastore()
print(store)
```

---

## 数据获取

### 股票数据

```python
from FQData import get_datasource

ds = get_datasource()

stock_day = ds.get_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31',
    adjust='qfq'
)

stock_min = ds.get_stock_min(
    code='600000',
    freq='5min',
    start='2024-01-01 09:30:00',
    end='2024-01-01 15:00:00'
)
```

### 指数数据

```python
index_day = ds.get_index_day(
    code='000001',
    start='2024-01-01',
    end='2024-12-31'
)

index_min = ds.get_index_min(
    code='000001',
    freq='1min',
    start='2024-01-01'
)
```

### 期货数据

```python
future_day = ds.get_future_day(
    code='IF2401',
    start='2024-01-01',
    end='2024-12-31'
)

future_min = ds.get_future_min(
    code='IF2401',
    freq='5min',
    start='2024-01-01'
)
```

---

## 数据存储

### 保存股票数据

```python
from FQData import save_single_stock_day, save_stock_day

data = pd.DataFrame({...})

save_single_stock_day('600000', data)

save_stock_day(['600000', '000001'], {
    '600000': data1,
    '000001': data2
})
```

### 保存指数/ETF

```python
from FQData import save_index_day, save_etf_day

save_index_day(['000001', '399001'])

save_etf_day(['510300', '510050'])
```

### 保存期货

```python
from FQData import save_future_day, save_future_list

save_future_day(['IF2401', 'IC2401'])

save_future_list()
```

### 保存债券

```python
from FQData import save_bond_day, save_bond_list

save_bond_day(['113009', '110081'])

save_bond_list()
```

---

## 数据查询

### 查询股票

```python
from FQData import query_stock_day, query_stock_min

df = query_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31'
)

df_min = query_stock_min(
    code='600000',
    freq='5min',
    start='2024-01-01',
    end='2024-01-31'
)
```

### 查询指数

```python
from FQData import query_index_day, query_index_min

df = query_index_day(
    code='000001',
    start='2024-01-01',
    end='2024-12-31'
)
```

### 查询期货

```python
from FQData import query_future_day, query_future_min

df = query_future_day(
    code='IF2401',
    start='2024-01-01',
    end='2024-12-31'
)
```

### 查询除权数据

```python
from FQData import query_stock_xdxr

df = query_stock_xdxr(code='600000')
```

### 查询交易日

```python
from FQData import query_trade_date

dates = query_trade_date(start='2024-01-01', end='2024-12-31')
```

---

## 事务管理

```python
from FQData import TransactionManager, UnitOfWork

tm = TransactionManager()

with tm.begin() as tx:
    tx.insert('stock_day', data1)
    tx.update('stock_info', {'code': '600000'}, update_data)
    tx.delete('temp', {'type': 'temp'})

uw = UnitOfWork()
uw.register_new('stock_day', new_data)
uw.register_modified('stock_info', modified_data)
uw.register_removed('temp', to_delete)

tm.commit(uw)
```

---

## 代码工具

### 代码分类

```python
from FQData.normalizer import for_sz, for_sh

type_sz = for_sz('000001')
type_sh = for_sh('600000')

print(f"000001 类型: {type_sz}")
print(f"600000 类型: {type_sh}")
```

### 市场转换

```python
from FQData.normalizer import code_to_market, code_to_market_full, get_stock_market

market = code_to_market('600000')
market_full = code_to_market_full('600000')
market_name = get_stock_market('600000')

print(f"市场: {market}")
print(f"完整标识: {market_full}")
print(f"市场名称: {market_name}")
```

### K线频率转换

```python
from FQData.normalizer import _select_type

freq_code = _select_type('5min')
print(f"5分钟频率代码: {freq_code}")

freq_code = _select_type('day')
print(f"日线频率代码: {freq_code}")
```

---

## 并行处理

### 并行保存股票

```python
from FQData import save_stock_day_parallel

result = save_stock_day_parallel(
    codes=['600000', '000001', '000002', '600036', '601318'],
    start='2024-01-01',
    end='2024-12-31',
    workers=4
)

print(f"成功: {result['success_count']}")
print(f"失败: {result['failed_count']}")
```

### 并行保存指数

```python
from FQData import save_index_day_parallel

result = save_index_day_parallel(
    codes=['000001', '399001'],
    start='2024-01-01',
    end='2024-12-31',
    workers=2
)
```

---

## 数据持久化流程

### 完整流程示例

```python
from FQData import (
    get_datasource,
    get_datastore,
    save_stock_day,
    query_stock_day,
)

ds = get_datasource()
store = get_datastore()

data = ds.get_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31'
)

save_stock_day('600000', data)

df = query_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31'
)

print(f"获取数据: {len(data)} 条")
print(f"存储数据: {len(df)} 条")
```

---

## 数据结构使用

### 创建数据结构

```python
from FQData.DataStruct import StockDayData

stock_day = StockDayData(df)

print(f"代码: {stock_day.code.tolist()}")
print(f"开盘: {stock_day.open.head()}")
print(f"收盘: {stock_day.close.head()}")
```

### 复权处理

```python
from FQData.DataStruct import fetch_stock_adj, data_stock_to_fq

adj_data = fetch_stock_adj(code='600000', start='2024-01-01')

fq_data = data_stock_to_fq(original_data, adj_data)
```

### 重采样

```python
from FQData.DataStruct import min_resample, min_to_day, day_resample

data_5min = min_resample(min_data, freq='5min')

daily = min_to_day(min_data)

weekly = day_resample(daily, freq='W')
```

---

## 常见操作

### 批量获取多只股票

```python
codes = ['600000', '000001', '000002']

for code in codes:
    data = ds.get_stock_day(code=code, start='2024-01-01')
    save_stock_day(code, data)
```

### 检查存储健康状态

```python
from FQData import get_datastore

store = get_datastore()
status = store.health_check()

if status.is_healthy:
    print("存储服务正常")
else:
    print(f"异常: {status.details}")
```

---

## 相关文档

- [README](README.md)
- [API 参考](api.md)
- [最佳实践](best-practices.md)
- [开发指南](development.md)
- [FAQ](faq.md)
- [DataSource](datasource/README.md)
- [DataStore](datastore/README.md)
- [DataStruct](datastruct/README.md)