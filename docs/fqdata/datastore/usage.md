# DataStore 使用指南

## 基本使用

### 初始化存储

```python
from FQData.DataStore import get_datastore

store = get_datastore()
print(store)
# <FQDataStore storage=mongodb connected=True>
```

### 保存数据

```python
import pandas as pd

data = pd.DataFrame({
    'date': pd.date_range('2024-01-01', periods=100),
    'code': '600000',
    'open': 10.0,
    'high': 10.5,
    'low': 9.8,
    'close': 10.2,
    'volume': 1000000
})

result = store.save_stock_day(data, code='600000')
print(f"保存结果: {result}")
```

### 查询数据

```python
df = store.query_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-06-30'
)
print(df.head())
```

---

## 数据分类操作

### 动态方法调用

FQDataStore 支持 `save_{category}` 和 `query_{category}` 格式的动态方法：

```python
# 保存股票日线
store.save_stock_day(data, code='600000')

# 查询股票分钟线
df = store.query_stock_min(
    code='600000',
    freq='5min',
    start='2024-01-01',
    end='2024-01-31'
)

# 保存指数日线
store.save_index_day(index_data, code='000001')

# 查询期货日线
df = store.query_future_day(
    code='IF2401',
    start='2024-01-01',
    end='2024-12-31'
)
```

### 支持的数据类别

```python
# 股票
store.save_stock_day(data, code='600000')
store.save_stock_min(data, code='600000', frequence='5min')

# 指数
store.save_index_day(data, code='000001')
store.save_index_min(data, code='000001', frequence='1min')

# 期货
store.save_future_day(data, code='IF2401')
store.save_future_min(data, code='IF2401', frequence='5min')

# 债券
store.save_bond_day(data, code='110001')
store.save_bond2stock_day(data, code='113009')

# ETF
store.save_etf_day(data, code='510300')
```

---

## 通用查询接口

### 直接查询方法

```python
from FQData.DataStore import query_stock_day, query_stock_min
from FQData.DataStore import query_index_day, query_index_min
from FQData.DataStore import query_future_day, query_future_min

# 股票日线查询
df = query_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31'
)

# 股票分钟线查询
df = query_stock_min(
    code='600000',
    freq='5min',
    start='2024-01-01 09:30:00',
    end='2024-01-01 15:00:00'
)

# 指数日线查询
df = query_index_day(
    code='000001',
    start='2024-01-01',
    end='2024-12-31'
)

# 期货日线查询
df = query_future_day(
    code='IF2401',
    start='2024-01-01',
    end='2024-12-31'
)
```

### 批量查询

```python
# 批量查询股票
codes = ['600000', '000001', '000002']
df = query_stock_day(
    code=codes,
    start='2024-01-01',
    end='2024-06-30'
)
```

---

## 事务管理

### 基本事务

```python
from FQData.DataStore import TransactionManager

tm = TransactionManager()

with tm.begin() as tx:
    tx.insert('stock_day', stock_data)
    tx.insert('index_day', index_data)
    tx.update('stock_info', {'code': '600000'}, {'$set': {'name': '浦东银行'}})

print("事务提交成功")
```

### 工作单元模式

```python
from FQData.DataStore import TransactionManager, UnitOfWork

tm = TransactionManager()
uw = UnitOfWork()

uw.register_new('stock_day', new_stock_data)
uw.register_modified('stock_info', modified_info)
uw.register_removed('temp_table', temp_data)

tm.commit(uw)
```

---

## 缓存使用

### 基本缓存操作

```python
from FQData.DataStore import get_cache

cache = get_cache()

# 设置缓存
cache.set('stock_600000', data, ttl=3600)

# 获取缓存
cached_data = cache.get('stock_600000')

# 删除缓存
cache.delete('stock_600000')

# 批量操作
cache.set_many({'key1': val1, 'key2': val2}, ttl=1800)
values = cache.get_many(['key1', 'key2'])
cache.delete_many(['key1', 'key2'])
```

### 在存储中使用缓存

```python
from FQData.DataStore import get_datastore

store = get_datastore()

cache_key = f"stock_day:600000:2024"

cached = store.cache_get(cache_key)
if cached is None:
    df = store.query_stock_day(code='600000', start='2024-01-01')
    store.cache_set(cache_key, df, ttl=300)
else:
    df = cached
```

---

## 高级查询

### 高级股票查询

```python
from FQData import query_adv_stock_day, query_adv_stock_min

# 自动处理复权的高级查询
df = query_adv_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31',
    adjust='qfq'
)

# 高级分钟查询
df = query_adv_stock_min(
    code='600000',
    freq='5min',
    start='2024-01-01',
    end='2024-01-31'
)
```

### 异步查询

```python
import asyncio
from FQData import query_async_stock_day, query_async_stock_min

async def fetch_data():
    df1 = await query_async_stock_day(
        code='600000',
        start='2024-01-01',
        end='2024-06-30'
    )

    df2 = await query_async_stock_min(
        code='600000',
        freq='15min',
        start='2024-01-01',
        end='2024-01-31'
    )

    return df1, df2

stock_day, stock_min = asyncio.run(fetch_data())
```

---

## 存储健康检查

```python
from FQData.DataStore import get_datastore

store = get_datastore()

status = store.health_check()
print(f"状态: {status.status}")
print(f"消息: {status.message}")
print(f"详情: {status.details}")

if status.is_healthy:
    print("所有存储服务正常")
else:
    print("部分存储服务异常")
```

---

## 并行数据保存

```python
from FQData.DataStore import save_with_parallelism

data_list = [df1, df2, df3, df4, df5]
metadata_list = [
    {'code': '600000', 'start': '2024-01-01'},
    {'code': '000001', 'start': '2024-01-01'},
    {'code': '000002', 'start': '2024-01-01'},
    {'code': '600036', 'start': '2024-01-01'},
    {'code': '601318', 'start': '2024-01-01'},
]

result = store.save_with_parallelism(
    data_list=data_list,
    data_type='stock_day',
    metadata_list=metadata_list,
    max_workers=4
)

print(f"成功: {result['success_count']}")
print(f"失败: {result['failed_count']}")
```

---

## 数据格式转换

### DataFrame 转记录

```python
records = store._dataframe_to_records(df, metadata)
print(f"记录数: {len(records)}")
```

### 记录转 DataFrame

```python
df = store._records_to_dataframe(records)
print(df.head())
```

---

## 错误处理

```python
from FQBase.Foundation.exceptions import FQException

try:
    store.save_stock_day(data, code='600000')
except FQException as e:
    print(f"存储异常: {e}")
```

---

## 相关文档

- [README](README.md)
- [API 参考](api.md)
- [最佳实践](best-practices.md)
- [开发指南](development.md)
- [FAQ](faq.md)