# MongoClientManager 使用指南

**模块路径**: `FQBase.DataStore.mongo_client`
**源码**: [mongo_client.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/DataStore/mongo_client.py)

---

## 一、基本使用

### 1.1 获取管理器

```python
from FQBase.DataStore.mongo_client import get_mongo_client_manager

manager = get_mongo_client_manager("mongodb://localhost:27017")
```

### 1.2 获取客户端

```python
client = manager.client

if client:
    print("MongoDB 连接成功")
else:
    print("MongoDB 连接失败")
```

---

## 二、连接池配置

### 2.1 自定义连接池

```python
manager = get_mongo_client_manager(
    "mongodb://localhost:27017",
    max_pool_size=100,
    min_pool_size=20,
    server_selection_timeout_ms=10000,
    connect_timeout_ms=10000,
    socket_timeout_ms=60000
)
```

### 2.2 连接参数说明

| 参数 | 说明 |
|------|------|
| `max_pool_size` | 最大连接数，默认 50 |
| `min_pool_size` | 最小连接数，默认 10 |
| `server_selection_timeout_ms` | 服务器选择超时，默认 5000ms |
| `connect_timeout_ms` | 连接超时，默认 5000ms |
| `socket_timeout_ms` | Socket 超时，默认 30000ms |

---

## 三、连接管理

### 3.1 健康检查

```python
manager = get_mongo_client_manager("mongodb://localhost:27017")

if manager.is_connected():
    print("已连接")
else:
    print("未连接")
```

### 3.2 Ping 检查

```python
if manager.ping():
    print("MongoDB 服务器正常")
else:
    print("MongoDB 服务器无响应")
```

### 3.3 详细健康检查

```python
health = manager.health_check_detailed()
print(f"健康状态: {health['healthy']}")
print(f"延迟: {health['latency_ms']}ms")
print(f"服务器信息: {health['server_info']}")
if health['errors']:
    print(f"错误: {health['errors']}")
```

### 3.4 关闭连接

```python
manager.close()
print("连接已关闭")
```

### 3.5 重置连接

```python
manager.reset_client()
print("连接已重置")
```

---

## 四、统计信息

### 4.1 获取连接池统计

```python
stats = manager.get_pool_stats()
print(f"连接状态: {stats['connected']}")
print(f"最大连接数: {stats['max_pool_size']}")
print(f"URI: {stats['uri_safe']}")
print(f"服务器地址: {stats.get('server_address')}")
print(f"拓扑类型: {stats.get('topology_type')}")
```

---

## 五、实例管理

### 5.1 获取实例数量

```python
from FQBase.DataStore.mongo_client import MongoClientManager

count = MongoClientManager.get_instance_count()
print(f"当前实例数量: {count}")
```

### 5.2 获取引用计数

```python
ref_count = MongoClientManager.get_ref_count("mongodb://localhost:27017")
print(f"引用计数: {ref_count}")
```

### 5.3 释放实例

```python
MongoClientManager.release("mongodb://localhost:27017")
print("实例已释放")
```

### 5.4 清除所有实例

```python
MongoClientManager.clear_all()
print("所有实例已清除")
```

---

## 六、与 MongoDB 类配合使用

```python
from FQBase.DataStore.mongo_client import get_mongo_client_manager
from FQBase.DataStore import MongoDB

manager = get_mongo_client_manager("mongodb://localhost:27017")

print(f"管理器状态: {manager.is_connected()}")

db = MongoDB(database="mydb")
print(f"数据库状态: {db.is_connected()}")

stats = manager.get_pool_stats()
print(f"连接池统计: {stats}")
```

---

## 七、完整示例

```python
from FQBase.DataStore.mongo_client import get_mongo_client_manager, MongoClientManager

def main():
    uri = "mongodb://localhost:27017"

    manager = get_mongo_client_manager(
        uri,
        max_pool_size=50,
        min_pool_size=10
    )

    health = manager.health_check_detailed()
    if health['healthy']:
        print(f"MongoDB 连接成功，延迟: {health['latency_ms']}ms")
        print(f"版本: {health['server_info']['version']}")
    else:
        print(f"MongoDB 连接失败: {health['errors']}")

    stats = manager.get_pool_stats()
    print(f"连接池: {stats['max_pool_size']}/{stats['min_pool_size']}")

    print(f"当前实例数: {MongoClientManager.get_instance_count()}")
    print(f"引用计数: {MongoClientManager.get_ref_count(uri)}")

if __name__ == "__main__":
    main()
```
