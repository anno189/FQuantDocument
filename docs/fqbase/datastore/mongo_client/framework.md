# MongoClientManager 框架文档

**模块路径**: `FQBase.DataStore.mongo_client`
**源码**: [mongo_client.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/DataStore/mongo_client.py)

---

## 一、概述

### 1.1 什么是 MongoClientManager

MongoClientManager 是 FQBase 框架的 **MongoDB 客户端管理器**，提供线程安全的 MongoClient 单例管理，支持延迟初始化、自动重连和引用计数自动清理。

**解决的问题**：
- MongoClient 实例重复创建，浪费资源
- 多线程访问 MongoDB 连接不安全
- 连接泄漏问题
- 程序退出时资源未正确释放

**核心价值**：
- **按 URI 单例**：同一 URI 只创建一个 MongoClient 实例
- **线程安全**：双锁机制保护实例创建和访问
- **延迟初始化**：首次使用时才创建连接
- **自动重连**：连接失败时自动重试
- **引用计数**：自动管理实例生命周期
- **程序退出清理**：atexit 自动关闭所有连接

### 1.2 与 MongoDB 的关系

```
┌─────────────────────────────────────────────────────────────────┐
│                      MongoDB 类                                  │
│   用户直接使用的数据库操作类                                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   MongoClientManager                              │
│   底层管理 MongoClient 实例                                      │
│   - 连接池配置                                                  │
│   - 重连机制                                                   │
│   - 线程安全                                                   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MongoClient                                  │
│   PyMongo 官方驱动                                              │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 何时使用

| 场景 | 使用 |
|------|------|
| 数据库 CRUD 操作 | 使用 `MongoDB` 类 |
| 获取原始 MongoClient | 使用 `MongoClientManager` |
| 自定义连接管理 | 使用 `MongoClientManager` |

---

## 二、核心特性

### 2.1 按 URI 单例

```python
MongoClientManager(uri, max_pool_size=50)
MongoClientManager(uri, max_pool_size=100)

# 同一个 URI 返回同一实例（忽略 max_pool_size 差异）
```

### 2.2 延迟初始化

```python
manager = MongoClientManager(uri)
# 此时不创建连接
client = manager.client  # 首次访问时创建
```

### 2.3 自动重连

```python
@retry_with_exponential_backoff(
    max_attempts=3,
    base_wait=100,
    max_wait=5000,
    retry_on_exception=(ConnectionFailure, ServerSelectionTimeoutError),
)
def _create_client(self):
    client = pymongo.MongoClient(...)
    client.admin.command('ping')
    return client
```

### 2.4 引用计数

```python
# 创建实例，引用计数 +1
manager = MongoClientManager(uri)

# 释放实例，引用计数 -1
MongoClientManager.release(uri)

# 引用计数为 0 时自动关闭
```

---

## 三、依赖说明

### 3.1 核心依赖

| 依赖 | 说明 |
|------|------|
| `pymongo` | MongoDB Python 驱动 |
| `threading` | 线程安全支持 |
| `atexit` | 程序退出时自动清理 |

### 3.2 系统依赖

| 依赖 | 说明 |
|------|------|
| MongoDB Server | 3.6+ |

---

## 四、设计模式

| 模式 | 应用 |
|------|------|
| 单例模式 | 按 URI 存储实例，`_instances` |
| 工厂模式 | `get_mongo_client_manager()` 函数 |
| 代理模式 | `client` 属性代理 MongoClient |
| 引用计数 | `_ref_counts` 管理生命周期 |
