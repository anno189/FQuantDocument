# DataStore 开发指南

## 模块简介

DataStore 模块提供统一的数据存储接口，支持 MongoDB 等存储后端，提供数据查询、持久化、事务管理等功能。

### 核心组件

| 组件 | 说明 |
|------|------|
| `FQDataStore` | 存储统一入口 |
| `MongoDBAdapter` | MongoDB 存储适配器 |
| `TransactionManager` | 事务管理器 |
| `UnitOfWork` | 工作单元模式 |

---

## 开发环境

### 环境要求

- Python 3.8+
- pymongo
- pytest

### 安装

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQData
pip install -e .
```

### 验证安装

```python
from FQData.DataStore import get_datastore

store = get_datastore()
print(store)  # <FQData.DataStore.facade.FQDataStore object at ...>
```

---

## 本地调试

### 基本调试流程

```python
from FQData.DataStore import get_datastore

# 获取存储实例
store = get_datastore()

# 测试查询
result = store.query('stock_day', {'code': '600000', 'date': '2024-01-01'})
print(f"查询结果: {result}")
```

### 调试 MongoDB 连接

```python
from FQData.DataStore import MongoDBAdapter

adapter = MongoDBAdapter()

# 测试连接
try:
    adapter.connect()
    print("MongoDB 连接成功")
except Exception as e:
    print(f"MongoDB 连接失败: {e}")

# 检查连接状态
print(f"连接状态: {adapter.is_connected()}")
```

### 调试事务

```python
from FQData.DataStore import TransactionManager

tm = TransactionManager()

# 开始事务
tx = tm.begin()
print(f"事务状态: {tx.state}")
```

---

## 测试指南

### 运行测试

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQData
pytest -v FQData/DataStore/
```

### 测试结构

```python
import pytest
from FQData.DataStore import get_datastore, TransactionManager

class TestDataStore:
    def test_get_datastore_singleton(self):
        store1 = get_datastore()
        store2 = get_datastore()
        assert store1 is store2  # 单例模式

    def test_query(self):
        store = get_datastore()
        result = store.query('stock_day', {'code': '600000'})
        assert result is not None

class TestTransaction:
    def test_begin_commit(self):
        tm = TransactionManager()
        tx = tm.begin()
        assert tx.state == 'active'

        tx.insert('stock_day', {'code': '600000', 'date': '2024-01-01'})
        tm.commit(tx)

    def test_rollback(self):
        tm = TransactionManager()
        tx = tm.begin()

        tx.insert('stock_day', {'code': '600000'})
        tm.rollback(tx)

        assert tx.state == 'rolled_back'
```

---

## 代码规范

### 数据分类命名

```python
# 推荐：清晰的数据分类
DataCategory.STOCK_DAY      # 股票日线
DataCategory.STOCK_MIN      # 股票分钟
DataCategory.INDEX_DAY     # 指数日线
DataCategory.FUTURE_DAY    # 期货日线

# 避免：硬编码字符串
collection.insert({'code': '600000'})  # 不好
collection.insert({'category': 'stock_day'})  # 不好
```

### 查询函数命名

```python
# 推荐：清晰的查询命名
def query_stock_day(code, start, end, adjust=None):
    """查询股票日线"""
    pass

def query_stock_min(code, freq, start, end):
    """查询股票分钟"""
    pass

# 避免：模糊命名
def get_data(params):
    """获取数据"""
    pass
```

---

## 调试技巧

### 查看存储状态

```python
from FQData.DataStore import get_datastore

store = get_datastore()

# 查看连接状态
print(f"MongoDB 连接: {store._adapter.is_connected()}")

# 查看数据库信息
print(f"数据库名称: {store._adapter._db_name}")
```

### 追踪查询操作

```python
import logging

logging.basicConfig(level=logging.DEBUG)

# 开启查询日志
store = get_datastore()
store.enable_query_logging()

# 执行查询
result = store.query('stock_day', {'code': '600000'})

# 查看日志
# DEBUG: Query stock_day {'code': '600000'}
# DEBUG: Result: 100 documents
```

---

## 常见问题

### Q: MongoDB 连接失败

```python
# 检查 MongoDB 连接
from FQData.DataStore import MongoDBAdapter

adapter = MongoDBAdapter()

try:
    adapter.connect()
    print("连接成功")
except Exception as e:
    print(f"连接失败: {e}")

# 检查连接参数
print(f"主机: {adapter._host}")
print(f"端口: {adapter._port}")
print(f"数据库: {adapter._db_name}")
```

### Q: 如何使用事务？

```python
from FQData.DataStore import TransactionManager

tm = TransactionManager()

# 方式1：上下文管理器
with tm.begin() as tx:
    tx.insert('stock_day', data1)
    tx.update('stock_info', {'code': '600000'}, data2)
# 自动提交

# 方式2：手动管理
tx = tm.begin()
try:
    tx.insert('stock_day', data1)
    tx.insert('stock_day', data2)
    tm.commit(tx)
except Exception as e:
    tm.rollback(tx)
    print(f"事务失败: {e}")
```

---

## 相关文档

- [API 参考](api.md)
- [使用指南](usage.md)
- [最佳实践](best-practices.md)
- [FAQ](faq.md)