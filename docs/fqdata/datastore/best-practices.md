# DataStore 最佳实践

## 连接管理

### 使用单例模式

始终使用 `get_datastore()` 获取实例，避免重复创建连接：

```python
from FQData.DataStore import get_datastore

store = get_datastore()
```

不要手动实例化 `FQDataStore`，单例模式确保连接池被复用。

### 连接健康检查

在长时间运行的任务中，定期检查连接状态：

```python
from FQData.DataStore import get_datastore

store = get_datastore()

status = store.health_check()
if not status.is_healthy:
    print(f"存储状态异常: {status.details}")
    store = get_datastore('auto')
```

---

## 数据保存

### 保存前验证

```python
import pandas as pd

def save_with_validation(store, data, category, code):
    if data is None or data.empty:
        print(f"警告: 数据为空，跳过保存 {code}")
        return False

    required_columns = ['open', 'high', 'low', 'close', 'volume']
    if not all(col in data.columns for col in required_columns):
        print(f"警告: 数据缺少必要列 {code}")
        return False

    return store.save(data, category, code=code)
```

### 使用批量保存

对于大量数据，使用并行保存提高性能：

```python
from FQData.DataStore import save_stock_day_parallel

save_stock_day_parallel(
    codes=['600000', '000001', '000002', '600036', '601318'],
    start='2024-01-01',
    end='2024-12-31',
    workers=4
)
```

### 事务批量操作

将相关操作放在一个事务中：

```python
from FQData.DataStore import TransactionManager

tm = TransactionManager()

with tm.begin() as tx:
    tx.insert('stock_day', stock_data)
    tx.insert('index_day', index_data)
    tx.update('stock_info', {'code': '600000'}, {'$set': info})

print("批量操作完成")
```

---

## 数据查询

### 合理使用缓存

```python
from FQData.DataStore import get_datastore, get_cache

store = get_datastore()
cache = get_cache()

cache_key = f"stock_day:{code}:{start}:{end}"

cached = cache.get(cache_key)
if cached is not None:
    return cached

df = store.query_stock_day(code=code, start=start, end=end)

cache.set(cache_key, df, ttl=600)
return df
```

### 缓存策略

| 数据类型 | 建议 TTL | 说明 |
|---------|---------|------|
| 实时行情 | 5-30 秒 | 需要及时更新 |
| 日线数据 | 5-30 分钟 | 历史数据变化少 |
| 分钟数据 | 1-5 分钟 | 根据频率调整 |
| 基本信息 | 1-24 小时 | 变化频率低 |

### 避免全量查询

```python
# 不推荐: 全量查询
df = query_stock_day(start='2020-01-01', end='2024-12-31')

# 推荐: 分段查询
for year in range(2020, 2025):
    df = query_stock_day(
        code='600000',
        start=f'{year}-01-01',
        end=f'{year}-12-31'
    )
```

---

## 性能优化

### 索引优化

确保查询字段有索引：

```python
result = store.query('stock_day', {
    'code': '600000',
    'date': {'$gte': '2024-01-01', '$lte': '2024-12-31'}
})
```

### 投影过滤

只查询需要的字段：

```python
result = store.query(
    'stock_day',
    {'code': '600000'},
    projection={'date': 1, 'open': 1, 'close': 1, 'volume': 1}
)
```

### 批量操作

```python
records = df.to_dict('records')

if len(records) > 0:
    store._primary_storage.insert_many('stock_day', records)
```

---

## 数据一致性

### 使用 UPSERT

更新或插入数据时使用 upsert 模式：

```python
result = store._primary_storage.update_one(
    'financial',
    {'code': '600000', 'report_date': '2024-03-31'},
    {'$set': financial_record},
    upsert=True
)
```

### 事务回滚

```python
from FQData.DataStore import TransactionManager

tm = TransactionManager()

try:
    with tm.begin() as tx:
        tx.insert('temp_data', temp_df)
        process_data(temp_df)
        tx.delete('temp_data', {'type': 'temp'})
except Exception as e:
    print(f"操作失败: {e}")
    print("事务已自动回滚")
```

---

## 错误处理

### 异常捕获

```python
from FQBase.Foundation.exceptions import FQException
from FQData.DataStore import get_datastore

store = get_datastore()

try:
    store.save_stock_day(data, code='600000')
except FQException as e:
    print(f"存储异常: {e}")
    # 降级处理: 保存到本地文件
    save_to_local_file(data)
except Exception as e:
    print(f"未知异常: {e}")
    raise
```

### 重试机制

```python
from FQBase.Foundation.retry import retry_with_exponential_backoff

@retry_with_exponential_backoff(max_retries=3, base_delay=1)
def save_with_retry(store, data, code):
    return store.save_stock_day(data, code=code)
```

---

## 日志记录

```python
import logging

logger = logging.getLogger(__name__)

def save_data(store, data, code):
    logger.info(f"开始保存数据: {code}")

    result = store.save_stock_day(data, code=code)

    if result:
        logger.info(f"数据保存成功: {code}")
    else:
        logger.warning(f"数据保存失败: {code}")

    return result
```

---

## 配置建议

### 开发环境

```python
store = get_datastore('auto')
store.set_primary_storage('mongodb')
```

### 生产环境

```python
from FQData.DataStore import MongoDBAdapter

mongo = MongoDBAdapter(
    host='mongodb.prod.internal',
    port=27017,
    database='fqdata',
    username='app_user',
    password='secure_password',
    max_pool_size=50,
    timeout=10000
)

store = FQDataStore(storage_adapter=mongo)
```

---

## 监控指标

```python
from FQData.DataStore import get_datastore

store = get_datastore()

def get_storage_metrics():
    metrics = {
        'connected': store.is_connected,
        'current_storage': store.current_storage,
        'available_storages': store.list_storages()
    }

    health = store.health_check()
    metrics['health'] = health.details

    return metrics

print(get_storage_metrics())
```

---

## 相关文档

- [README](README.md)
- [API 参考](api.md)
- [使用指南](usage.md)
- [开发指南](development.md)
- [FAQ](faq.md)