# MongoClientManager 模块文档

**模块路径**: `FQBase.DataStore.mongo_client`
**源码**: [mongo_client.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/DataStore/mongo_client.py)

## 文档索引

| 文档 | 说明 |
|------|------|
| [framework.md](framework.md) | 框架概述、核心特性、设计模式 |
| [architecture.md](architecture.md) | 整体架构、组件架构、工作流程 |
| [design.md](design.md) | 设计决策与权衡 |
| [api.md](api.md) | 详细 API 参考 |
| [usage.md](usage.md) | 使用指南、代码示例 |
| [best-practices.md](best-practices.md) | 最佳实践，维护事宜 |

## 模块组件

| 组件 | 类型 | 说明 |
|------|------|------|
| `MongoClientManager` | 类 | MongoDB 客户端管理器（按 URI 单例） |
| `get_mongo_client_manager()` | 函数 | 获取管理器实例的工厂函数 |

## 快速开始

```python
from FQBase.DataStore.mongo_client import get_mongo_client_manager

manager = get_mongo_client_manager("mongodb://localhost:27017")

client = manager.client
if client:
    print("MongoDB 连接成功")
```

## 与 MongoDB 模块的关系

```
MongoClientManager
    │
    ├── 管理 MongoClient 实例
    ├── 连接池配置
    └── 被 MongoDB 类使用
```
