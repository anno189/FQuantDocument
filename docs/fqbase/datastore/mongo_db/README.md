# MongoDB 模块文档

**模块路径**: `FQBase.DataStore.mongo_db`
**源码**: [mongo_db.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/DataStore/mongo_db.py)

## 文档索引

| 文档 | 说明 |
|------|------|
| [framework.md](framework.md) | 框架概述、核心特性、设计模式 |
| [architecture.md](architecture.md) | 整体架构、组件架构、工作流程 |
| [design.md](design.md) | 设计决策与权衡 |
| [api.md](api.md) | 详细 API 参考 |
| [usage.md](usage.md) | 使用指南、代码示例 |
| [best-practices.md](best-practices.md) | 最佳实践、维护事宜 |

## 模块组件

| 组件 | 类型 | 说明 |
|------|------|------|
| `MongoDB` | 类 | MongoDB 通用操作类（单例模式） |
| `get_mongo_db()` | 函数 | 获取全局 MongoDB 单例实例 |
| `reset_mongo_db()` | 函数 | 重置全局 MongoDB 实例 |

## 快速开始

```python
from FQBase.DataStore import MongoDB, get_mongo_db

db = get_mongo_db(database="mydb")
db.insert_one("users", {"name": "test", "age": 25})
users = db.find("users", {"age": {"$gte": 18}})
df = db.find_as_dataframe("users", {"age": {"$gte": 18}})
```
