# MongoDB 最佳实践

**模块路径**: `FQBase.DataStore.mongo_db`
**源码**: [mongo_db.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/DataStore/mongo_db.py)

---

## 一、性能优化

### 1.1 创建索引

```python
db = get_mongo_db()

db.create_index("stock_daily", [("code", ASCENDING), ("date", DESCENDING)], unique=True)

db.create_index("orders", [("user_id", ASCENDING), ("created_at", DESCENDING)])
```

### 1.2 避免全表扫描

```python
db.find("users", {"_id": user_id})

db.find("stock_daily", {"date": {"$gte": "2024-01-01"}})

db.find("orders", {"status": "pending"}, limit=100)
```

### 1.3 使用投影减少传输

```python
db.find("users", {}, projection={"password": 0, "_id": 0})

db.find("orders", {}, projection={"order_id": 1, "status": 1, "total": 1})
```

### 1.4 批量操作

```python
documents = [{"name": f"user{i}", "age": i} for i in range(1000)]
db.insert_many("users", documents, ordered=False)
```

---

## 二、错误处理

### 2.1 基础错误处理

```python
from FQBase.Foundation.exceptions import (
    MongoDBException,
    MongoDBConnectionException,
    MongoDBOperationException,
)

try:
    db.insert_one("users", {"name": "test", "age": 25})
except MongoDBConnectionException as e:
    logger.error(f"数据库连接失败: {e}")
except MongoDBOperationException as e:
    logger.error(f"数据库操作失败: {e.details}")
except MongoDBException as e:
    logger.error(f"MongoDB 异常: {e}")
```

### 2.2 重试机制

```python
from FQBase.Foundation.retry import retry

class RetryMongoDB:
    @retry(stop_max_attempt_number=3, wait_random_min=100, wait_random_max=500)
    def insert_with_retry(self, collection, document):
        return db.insert_one(collection, document)
```

---

## 三、安全最佳实践

### 3.1 密码脱敏

```python
db = MongoDB(
    uri="mongodb://admin:****@localhost:27017",
    username="admin",
    password="actual_password"
)
```

### 3.2 避免注入

```python
user_input = request.args.get('name')

db.find("users", {"name": user_input})
```

---

## 四、连接管理

### 4.1 合理设置连接池

```python
db = MongoDB(
    max_pool_size=100,
    min_pool_size=20,
    connect_timeout_ms=10000,
    socket_timeout_ms=60000
)
```

### 4.2 使用上下文管理器

```python
with MongoDB() as db:
    db.insert_one("users", {"name": "test"})

# 自动关闭连接
```

### 4.3 健康检查

```python
if db.health_check():
    logger.info("MongoDB 连接正常")
else:
    logger.warning("MongoDB 连接异常，尝试重连")
    db.reset()
```

---

## 五、数据建模

### 5.1 集合命名

```python
"stock_daily"      # 股票日线数据
"user_positions"   # 用户持仓
"order_history"    # 订单历史
"backtest_results"  # 回测结果
```

### 5.2 文档结构

```python
{
    "code": "000001",
    "date": "2024-01-15",
    "open": 12.50,
    "high": 13.00,
    "low": 12.30,
    "close": 12.80,
    "volume": 1000000,
    "created_at": datetime.now()
}
```

### 5.3 嵌套文档

```python
{
    "user_id": "user1",
    "profile": {
        "name": "张三",
        "email": "zhangsan@example.com"
    },
    "settings": {
        "notifications": True,
        "theme": "dark"
    }
}
```

---

## 六、维护事宜

### 6.1 定期检查索引

```python
for collection in db.list_collections():
    indexes = db.list_indexes(collection)
    print(f"{collection}: {len(indexes)} indexes")
```

### 6.2 监控慢查询

```python
result = db.find_with_profiling(
    "stock_daily",
    {"date": {"$gte": "2024-01-01"}},
    slow_threshold_ms=500
)

if result['metrics']['is_slow']:
    logger.warning(f"慢查询: {result['metrics']['elapsed_ms']}ms")
```

### 6.3 定期备份

```bash
mongodump --uri="mongodb://localhost:27017/quant" --out=/backup/
```

### 6.4 压缩数据库

```python
result = db.compact_database()
logger.info(f"压缩前: {result['size_before_gb']}GB, 压缩后: {result['size_after_gb']}GB")
```

---

## 七、常见问题

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 连接超时 | 网络问题/MongoDB 未启动 | 检查网络和 MongoDB 服务状态 |
| 操作超时 | 查询太复杂/数据量太大 | 优化索引/分页查询 |
| 连接池耗尽 | 并发太高/连接未释放 | 增加 pool_size/检查 close() 调用 |
| 内存不足 | 查询返回太多数据 | 使用 limit/投影/分页 |
| 索引失效 | 索引未创建/查询条件不匹配 | 检查并重建索引 |

---

## 八、开发检查清单

| 检查项 | 说明 |
|--------|------|
| 创建必要索引 | 查询字段建立索引 |
| 异常处理 | 所有数据库操作捕获异常 |
| 连接关闭 | 使用 with 或显式 close() |
| 密码脱敏 | 日志中不显示密码 |
| 投影优化 | 只查询需要的字段 |
| 分页查询 | 大量数据时使用分页 |
| 慢查询监控 | 使用 find_with_profiling |
| 定期备份 | 配置备份策略 |
