# FQData 最佳实践

## 数据获取

### 使用单例模式

```python
from FQData import get_datasource, get_datastore

ds = get_datasource()
store = get_datastore()
```

### 合理设置时间范围

```python
ds = get_datasource()

data = ds.get_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31'
)
```

### 复权数据获取

```python
data_qfq = ds.get_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31',
    adjust='qfq'
)

data_hfq = ds.get_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31',
    adjust='hfq'
)
```

---

## 数据存储

### 批量保存

```python
from FQData import save_stock_day, save_index_day

save_stock_day(['600000', '000001', '000002'], {
    '600000': data1,
    '000001': data2,
    '000002': data3
})
```

### 并行保存提高效率

```python
from FQData import save_stock_day_parallel

result = save_stock_day_parallel(
    codes=['600000', '000001', '000002', '600036', '601318'],
    start='2024-01-01',
    end='2024-12-31',
    workers=4
)

print(f"成功: {result['success_count']}")
```

### 存储前验证

```python
def validate_and_save(data, code):
    if data is None or data.empty:
        print(f"数据为空: {code}")
        return False

    required = ['open', 'high', 'low', 'close', 'volume']
    if not all(col in data.columns for col in required):
        print(f"缺少必要列: {code}")
        return False

    return save_single_stock_day(code, data)
```

---

## 代码工具使用

### 统一代码格式

```python
from FQData.normalizer import code_to_market, get_stock_market

def process_stock(code):
    market = get_stock_market(code)
    print(f"代码: {code}, 市场: {market}")
```

### 正确分类处理

```python
from FQData.normalizer import for_sz, for_sh

def get_stock_type(code):
    if code.startswith('0') or code.startswith('3'):
        return for_sz(code)
    elif code.startswith('6'):
        return for_sh(code)
    return 'undefined'
```

---

## 性能优化

### 避免重复获取

```python
from FQData import get_datastore

store = get_datastore()

cache_key = f"stock_day:{code}:{start}:{end}"

cached = store.cache_get(cache_key)
if cached is not None:
    return cached

data = ds.get_stock_day(code=code, start=start, end=end)
store.cache_set(cache_key, data, ttl=600)

return data
```

### 分批处理大量数据

```python
def save_large_dataset(codes, start, end, batch_size=100):
    for i in range(0, len(codes), batch_size):
        batch = codes[i:i+batch_size]
        save_stock_day_parallel(
            codes=batch,
            start=start,
            end=end,
            workers=4
        )
```

---

## 数据一致性

### 使用事务

```python
from FQData import TransactionManager

tm = TransactionManager()

with tm.begin() as tx:
    tx.insert('stock_day', main_data)
    tx.insert('stock_day', backup_data)
    tx.update('stock_info', {'code': code}, info_data)

print("数据一致性保证")
```

### 异常回滚

```python
from FQData import TransactionManager

tm = TransactionManager()

try:
    with tm.begin() as tx:
        tx.insert('stock_day', data1)
        process_data(data1)
        tx.delete('temp', {'type': 'temp'})
except Exception as e:
    print(f"异常: {e}")
    print("事务已自动回滚")
```

---

## 错误处理

### 数据源错误

```python
from FQData import get_datasource

ds = get_datasource()

try:
    data = ds.get_stock_day(code='600000', start='2024-01-01')
except Exception as e:
    print(f"获取失败: {e}")
    data = None
```

### 存储错误

```python
from FQData import save_single_stock_day

try:
    result = save_single_stock_day('600000', data)
    if not result:
        print("保存返回失败")
except Exception as e:
    print(f"保存异常: {e}")
```

---

## 日志记录

```python
import logging

logger = logging.getLogger(__name__)

def fetch_and_save(code, start, end):
    logger.info(f"开始处理: {code}")

    try:
        data = ds.get_stock_day(code=code, start=start, end=end)
        save_single_stock_day(code, data)
        logger.info(f"完成: {code}, 数据量: {len(data)}")

    except Exception as e:
        logger.error(f"失败: {code}, 错误: {e}")
```

---

## 配置建议

### 开发环境

```python
ds = get_datasource()
ds.set_mode('tdx')

store = get_datastore('auto')
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

store = get_datastore()
store.set_primary_storage('mongodb')
```

---

## 监控指标

```python
from FQData import get_datasource, get_datastore

def get_system_metrics():
    ds = get_datasource()
    store = get_datastore()

    metrics = {
        'datasource_health': ds.health_check().is_healthy,
        'datastore_health': store.health_check().is_healthy,
        'current_storage': store.current_storage,
    }

    return metrics
```

---

## 依赖管理

FQData 依赖以下模块：

```python
import FQBase
import pandas
import numpy
import pymongo
import pytdx
```

确保所有依赖正确安装：

```bash
pip install FQBase pandas numpy pymongo pytdx
```

---

## 相关文档

- [README](README.md)
- [API 参考](api.md)
- [使用指南](usage.md)
- [开发指南](development.md)
- [FAQ](faq.md)
- [DataSource](datasource/README.md)
- [DataStore](datastore/README.md)
- [DataStruct](datastruct/README.md)