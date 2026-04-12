# FAQ

## 基础问题

### Q: DataStore 模块提供什么功能？

DataStore 模块提供数据存储和查询功能：

| 功能 | 说明 |
|------|------|
| 统一存储 | `FQDataStore` 提供统一存储接口 |
| MongoDB 支持 | `MongoDBAdapter` MongoDB 存储适配器 |
| 数据查询 | `query_*` 系列查询函数 |
| 数据持久化 | `save_*` 系列持久化函数 |
| 事务管理 | `TransactionManager` 事务控制 |
| 工作单元 | `UnitOfWork` 工作单元模式 |

---

### Q: 如何连接 MongoDB？

```python
from FQData.DataStore import get_datastore

store = get_datastore()

# 默认配置连接
print(f"已连接到: {store._adapter._host}:{store._adapter._port}")

# 自定义连接
from FQData.DataStore import MongoDBAdapter

adapter = MongoDBAdapter(
    host='localhost',
    port=27017,
    db_name='fqdata'
)
```

---

## 数据查询问题

### Q: 如何查询股票日线？

```python
from FQData import query_stock_day

# 基本查询
df = query_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31'
)

# 复权查询
df = query_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31',
    adjust='qfq'  # 前复权
)
```

---

### Q: 如何查询分钟数据？

```python
from FQData import query_stock_min

# 5分钟线
df = query_stock_min(
    code='600000',
    freq='5min',
    start='2024-01-01 09:30:00',
    end='2024-01-01 15:00:00'
)

# 1分钟线
df = query_stock_min(
    code='600000',
    freq='1min',
    start='2024-01-01'
)
```

---

### Q: 支持哪些数据类型？

| 类型 | 查询函数 | 说明 |
|------|----------|------|
| 股票日线 | `query_stock_day` | A股日线 |
| 股票分钟 | `query_stock_min` | 1/5/15/30/60分钟 |
| 指数日线 | `query_index_day` | 上证/深证指数 |
| 指数分钟 | `query_index_min` | 指数分钟线 |
| 期货日线 | `query_future_day` | 商品/金融期货 |
| 期货分钟 | `query_future_min` | 期货分钟线 |
| 债券日线 | `query_bond2stock_day` | 国债/企业债 |
| 成交明细 | `query_stock_transaction` | 股票成交 |

---

## 数据持久化问题

### Q: 如何保存股票日线？

```python
from FQData import save_stock_day

# 保存单只股票
save_stock_day('600000', df)

# 批量保存
save_stock_day(['600000', '000001'], df_dict)
```

---

### Q: 如何并行保存数据？

```python
from FQData import save_stock_day_parallel

# 并行保存多只股票
save_stock_day_parallel(
    codes=['600000', '000001', '000002'],
    start='2024-01-01',
    end='2024-12-31',
    workers=4  # 并行工作数
)
```

---

### Q: 保存失败怎么办？

```python
from FQData import save_stock_day
from FQBase.Foundation.retry import retry

# 使用重试装饰器
@retry(stop_max_attempt_number=3, wait_random_min=1000, wait_random_max=3000)
def save_with_retry(code, df):
    save_stock_day(code, df)
    return True

save_with_retry('600000', df)
```

---

## 事务管理问题

### Q: 如何使用事务？

```python
from FQData.DataStore import TransactionManager

tm = TransactionManager()

# 使用上下文管理器
with tm.begin() as tx:
    tx.insert('stock_day', data1)
    tx.insert('stock_day', data2)
    tx.update('stock_info', {'code': '600000'}, data3)
# 自动提交

# 手动控制
tx = tm.begin()
try:
    tx.insert('stock_day', data1)
    tm.commit(tx)
except Exception as e:
    tm.rollback(tx)
    print(f"事务回滚: {e}")
```

---

### Q: 事务有哪些状态？

| 状态 | 说明 |
|------|------|
| `active` | 活跃，可执行操作 |
| `committed` | 已提交 |
| `rolled_back` | 已回滚 |

---

## 性能问题

### Q: 如何优化查询性能？

```python
# 1. 使用索引
from FQData.DataStore import MongoDBAdapter

adapter = MongoDBAdapter()
adapter.ensure_index('stock_day', ['code', 'date'])

# 2. 限制返回字段
store = get_datastore()
result = store.query('stock_day', {'code': '600000'}, fields=['date', 'close'])

# 3. 分页查询
result = store.query_paged('stock_day', {'code': '600000'}, page=1, page_size=100)
```

---

### Q: 批量操作性能差？

```python
# 使用 bulk_write 批量写入
from pymongo import BulkWriteOperation

adapter = MongoDBAdapter()
bulk = adapter.collection.initialize_unordered_bulk_op()

for doc in data_list:
    bulk.insert(doc)

adapter.collection.bulk_write(bulk)
```

---

## 错误处理

### Q: 常见错误及解决方案

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `MongoDBConnectionError` | MongoDB 未运行 | 启动 MongoDB |
| `DuplicateKeyError` | 主键冲突 | 使用 upsert |
| `TimeoutError` | 查询超时 | 增加 timeout 或分页 |
| `BulkWriteError` | 批量写入部分失败 | 检查 `details` |

---

## 相关文档

- [API 参考](api.md)
- [使用指南](usage.md)
- [开发指南](development.md)
- [最佳实践](best-practices.md)