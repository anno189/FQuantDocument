# MongoDB 使用指南

**模块路径**: `FQBase.DataStore.mongo_db`
**源码**: [mongo_db.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/DataStore/mongo_db.py)

---

## 一、基本使用

### 1.1 初始化连接

```python
from FQBase.DataStore import MongoDB, get_mongo_db

db = MongoDB(database="mydb")

db = get_mongo_db(database="mydb")
```

### 1.2 上下文管理器

```python
with MongoDB(database="mydb") as db:
    db.insert_one("users", {"name": "test", "age": 25})
```

### 1.3 配置连接

```python
db = MongoDB(
    uri="mongodb://localhost:27017",
    database="mydb",
    username="admin",
    password="password",
    max_pool_size=50,
    min_pool_size=10
)
```

---

## 二、CRUD 操作

### 2.1 插入

```python
db = get_mongo_db()

db.insert_one("users", {"name": "test", "age": 25})

users = [
    {"name": "user1", "age": 20},
    {"name": "user2", "age": 30},
]
db.insert_many("users", users)
```

### 2.2 查询

```python
all_users = db.find("users")

young_users = db.find("users", {"age": {"$gte": 18}})

user = db.find_one("users", {"name": "test"})

user_by_id = db.find_by_id("users", "507f1f77bcf86cd799439011")

exists = db.exists("users", {"name": "test"})
```

### 2.3 更新

```python
db.update_one("users", {"name": "test"}, {"$set": {"age": 30}})

db.update_many("users", {"age": {"$lt": 18}}, {"$set": {"status": "minor"}})

db.upsert("users", {"name": "newuser"}, {"$set": {"name": "newuser", "age": 25}})
```

### 2.4 删除

```python
db.delete_one("users", {"name": "test"})

db.delete_many("users", {"age": {"$lt": 18}})
```

---

## 三、查询操作

### 3.1 条件查询

```python
db.find("users", {"age": {"$gte": 18, "$lte": 65}})

db.find("users", {"name": {"$regex": "^张"}})

db.find("users", {"tags": {"$in": ["vip", "active"]}})

db.find("users", {"$or": [{"age": {"$lt": 18}}, {"status": "inactive"}]})
```

### 3.2 字段投影

```python
db.find("users", {}, projection={"name": 1, "age": 1})

db.find("users", {}, projection={"password": 0})

db.find("users", {"_id": 0, "name": 1})
```

### 3.3 排序分页

```python
from pymongo import ASCENDING, DESCENDING

db.find("users", sort=[("age", ASCENDING)])

db.find("users", sort=[("age", DESCENDING), ("name", ASCENDING)])

db.find("users", skip=10, limit=20)
```

### 3.4 分页查询

```python
result = db.find_by_page("users", page=1, page_size=20)
print(result['data'])
print(f"Total: {result['total']}, Pages: {result['total_pages']}")
```

### 3.5 DataFrame

```python
df = db.find_as_dataframe("stocks", {"date": {"$gte": "2024-01-01"}})
print(df.head())
df.to_csv("stocks.csv")
```

---

## 四、聚合查询

### 4.1 基础聚合

```python
pipeline = [
    {"$match": {"status": "active"}},
    {"$group": {"_id": "$department", "count": {"$sum": 1}}},
    {"$sort": {"count": -1}}
]
result = db.aggregate("employees", pipeline)
```

### 4.2 多阶段聚合

```python
pipeline = [
    {"$match": {"date": {"$gte": "2024-01-01"}}},
    {"$group": {"_id": "$code", "avg_price": {"$avg": "$price"}, "total_volume": {"$sum": "$volume"}}},
    {"$sort": {"total_volume": -1}},
    {"$limit": 10}
]
top_stocks = db.aggregate("stock_daily", pipeline)
```

### 4.3 去重统计

```python
departments = db.distinct("employees", "department")

active_departments = db.distinct("employees", "department", {"status": "active"})
```

---

## 五、索引管理

### 5.1 创建索引

```python
from pymongo import ASCENDING, DESCENDING

db.create_index("users", "name", unique=True)

db.create_index("users", [("age", ASCENDING), ("name", DESCENDING)])
```

### 5.2 批量创建

```python
indexes = [
    {"keys": [("code", ASCENDING), ("date", DESCENDING)]},
    {"keys": "created_at", "unique": False},
    {"keys": [("status", ASCENDING), ("priority", DESCENDING)], "unique": False}
]
db.create_indexes("tasks", indexes)
```

### 5.3 索引操作

```python
indexes = db.list_indexes("users")
for idx in indexes:
    print(idx['name'], idx['key'])

db.drop_index("users", "name_1")
```

---

## 六、事务操作

### 6.1 转账示例

```python
def transfer_funds(db, from_id, to_id, amount):
    db.update_one("accounts", {"_id": from_id}, {"$inc": {"balance": -amount}})
    db.update_one("accounts", {"_id": to_id}, {"$inc": {"balance": amount}})
    return True

result = db.with_transaction(
    lambda db: transfer_funds(db, "A", "B", 100)
)
```

### 6.2 批量写入

```python
operations = [
    {"type": "insert_one", "document": {"name": "user1", "age": 20}},
    {"type": "update_one", "query": {"name": "user2"}, "update": {"$set": {"age": 30}}},
    {"type": "delete_one", "query": {"name": "user3"}},
]
result = db.bulk_write("users", operations)
print(result)
```

---

## 七、量化交易场景

### 7.1 存储股票数据

```python
db.insert_one("stock_daily", {
    "code": "000001",
    "date": "2024-01-15",
    "open": 12.50,
    "high": 13.00,
    "low": 12.30,
    "close": 12.80,
    "volume": 1000000
})
```

### 7.2 查询股票数据

```python
df = db.find_as_dataframe("stock_daily", {
    "code": "000001",
    "date": {"$gte": "2024-01-01", "$lte": "2024-12-31"}
}, sort=[("date", ASCENDING)])
```

### 7.3 计算日收益率

```python
pipeline = [
    {"$match": {"code": "000001", "date": {"$gte": "2024-01-01"}}},
    {"$sort": {"date": 1}},
    {"$project": {"code": 1, "date": 1, "close": 1, "prev_close": {"$shift": {"output": "$close", "by": -1, "default": None}}}},
    {"$addFields": {"return": {"$cond": [{"ne": ["$prev_close", None]}, {"$divide": [{"$subtract": ["$close", "$prev_close"]}, "$prev_close"]}, None]}}},
]
result = db.aggregate("stock_daily", pipeline)
```

### 7.4 存储回测结果

```python
db.insert_one("backtest_results", {
    "strategy": "均值回归",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "total_return": 0.156,
    "sharpe_ratio": 2.1,
    "max_drawdown": 0.083,
    "trades": [...]
})
```

### 7.5 存储用户持仓

```python
db.update_one("positions", {"user_id": "user1", "code": "000001"}, {
    "$set": {"volume": 1000, "avg_price": 12.50, "updated_at": "2024-01-15"}
}, upsert=True)
```

---

## 八、完整示例

```python
from FQBase.DataStore import MongoDB, get_mongo_db
from pymongo import ASCENDING

class StockDataManager:
    def __init__(self):
        self.db = get_mongo_db(database="quant")

    def save_daily_data(self, code, date, data):
        doc = {
            "code": code,
            "date": date,
            **data
        }
        self.db.upsert("stock_daily", {"code": code, "date": date}, {"$set": doc})

    def get_stock_data(self, code, start_date, end_date):
        return self.db.find_as_dataframe("stock_daily", {
            "code": code,
            "date": {"$gte": start_date, "$lte": end_date}
        }, sort=[("date", ASCENDING)])

    def get_top_volume(self, date, limit=10):
        pipeline = [
            {"$match": {"date": date}},
            {"$sort": {"volume": -1}},
            {"$limit": limit},
            {"$project": {"code": 1, "volume": 1, "close": 1}}
        ]
        return self.db.aggregate("stock_daily", pipeline)

manager = StockDataManager()
manager.save_daily_data("000001", "2024-01-15", {"close": 12.50, "volume": 1000000})
df = manager.get_stock_data("000001", "2024-01-01", "2024-12-31")
```
