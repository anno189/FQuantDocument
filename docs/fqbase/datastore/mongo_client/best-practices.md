# MongoClientManager 最佳实践

**模块路径**: `FQBase.DataStore.mongo_client`
**源码**: [mongo_client.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/DataStore/mongo_client.py)

---

## 一、连接池配置

### 1.1 根据并发量配置

```python
manager = get_mongo_client_manager(
    "mongodb://localhost:27017",
    max_pool_size=100,
    min_pool_size=20
)
```

### 1.2 根据超时要求配置

```python
manager = get_mongo_client_manager(
    "mongodb://localhost:27017",
    server_selection_timeout_ms=10000,
    connect_timeout_ms=10000,
    socket_timeout_ms=60000
)
```

---

## 二、健康检查

### 2.1 定期检查

```python
import threading

def health_check_loop():
    manager = get_mongo_client_manager("mongodb://localhost:27017")

    while True:
        if not manager.ping():
            logger.warning("MongoDB 连接断开，尝试重连...")
            manager.reset_client()
        time.sleep(60)

thread = threading.Thread(target=health_check_loop, daemon=True)
thread.start()
```

### 2.2 启动时检查

```python
manager = get_mongo_client_manager("mongodb://localhost:27017")

health = manager.health_check_detailed()
if not health['healthy']:
    raise RuntimeError(f"MongoDB 连接失败: {health['errors']}")

print(f"MongoDB 就绪，延迟: {health['latency_ms']}ms")
```

---

## 三、错误处理

### 3.1 捕获连接异常

```python
from pymongo.errors import PyMongoError, ConnectionFailure

try:
    manager = get_mongo_client_manager("mongodb://localhost:27017")
    health = manager.health_check_detailed()
except PyMongoError as e:
    logger.error(f"MongoDB 连接失败: {e}")
except Exception as e:
    logger.error(f"未知错误: {e}")
```

### 3.2 重试机制

```python
from FQBase.Foundation.retry import retry

class ResilientMongoClient:
    @retry(stop_max_attempt_number=3, wait_random_min=100, wait_random_max=500)
    def get_client_with_retry(self):
        manager = get_mongo_client_manager("mongodb://localhost:27017")
        if not manager.ping():
            manager.reset_client()
        return manager.client
```

---

## 四、资源管理

### 4.1 使用上下文管理器

```python
manager = get_mongo_client_manager("mongodb://localhost:27017")
try:
    client = manager.client
    # 使用客户端...
finally:
    manager.close()
```

### 4.2 程序退出自动清理

```python
import atexit

atexit.register(MongoClientManager.clear_all)
```

### 4.3 显式释放

```python
uri = "mongodb://localhost:27017"
manager = get_mongo_client_manager(uri)

try:
    # 使用...
finally:
    MongoClientManager.release(uri)
```

---

## 五、监控

### 5.1 记录连接统计

```python
def log_pool_stats(manager):
    stats = manager.get_pool_stats()
    logger.info(
        f"MongoDB Pool Stats: "
        f"connected={stats['connected']}, "
        f"pool={stats['min_pool_size']}/{stats['max_pool_size']}, "
        f"connect_time={stats['connect_time']}"
    )
```

### 5.2 监控实例数量

```python
count = MongoClientManager.get_instance_count()
ref_counts = {uri: MongoClientManager.get_ref_count(uri) for uri in uris}

logger.info(f"MongoDB 实例数: {count}, 引用计数: {ref_counts}")
```

---

## 六、维护事宜

### 6.1 定期重连

```python
def periodic_reset(interval=3600):
    manager = get_mongo_client_manager("mongodb://localhost:27017")
    while True:
        time.sleep(interval)
        logger.info("重置 MongoDB 连接...")
        manager.reset_client()
```

### 6.2 连接泄漏检查

```python
def check_leaks():
    count = MongoClientManager.get_instance_count()
    if count > 10:
        logger.warning(f"可能有连接泄漏，当前实例数: {count}")
        for i in range(count):
            stats = MongoClientManager.get_pool_stats()
            logger.info(f"实例 {i}: {stats['connected']}")
```

### 6.3 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 连接超时 | 网络问题/MongoDB 未启动 | 检查网络和服务状态 |
| `client` 返回 None | 连接创建失败 | 检查 URI 和凭据 |
| 实例数不断增长 | 未正确 release | 确保调用 release() |
| 连接池耗尽 | 并发太高 | 增加 max_pool_size |

---

## 七、开发检查清单

| 检查项 | 说明 |
|--------|------|
| URI 正确 | 包含正确的认证信息 |
| 连接池配置合理 | 根据并发量调整 |
| 健康检查 | 启动时验证连接 |
| 错误处理 | 捕获 PyMongoError |
| 资源释放 | 使用 release() 或 clear_all() |
| 监控日志 | 记录连接统计 |
| 超时配置 | 根据业务需求调整 |
