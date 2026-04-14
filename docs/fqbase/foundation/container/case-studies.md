---
title: 服务容器 - 案例研究
description: 服务容器实际案例分析与经验总结
tag:
  - fqbase
  - container
---

# 服务容器 - 案例研究

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → **[案例研究](./case-studies.md)** → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → **[案例研究](./case-studies.md)** → [决策指南](./decision-guide.md) → [数据流](./data-flow.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |


## 案例 1: 微服务架构中的依赖注入

### 背景

某金融科技公司需要构建一个交易系统，包含用户服务、订单服务、支付服务等多个微服务。

### 挑战

- 多个服务需要共享数据库连接、缓存等资源
- 需要在不同环境（开发、测试、生产）使用不同配置
- 单元测试需要能够 mock 依赖

### 解决方案

使用服务容器统一管理所有服务的依赖：

```python
from FQBase.Foundation.container import ServiceContainer

# 创建容器
container = ServiceContainer()

# 注册基础设施服务（所有环境共享）
container.register_singleton(
    DatabaseInterface,
    PostgreSQLAdapter
)
container.register_singleton(
    CacheInterface,
    RedisCacheAdapter
)
container.register_singleton(
    LoggerInterface,
    FileLogger
)

# 注册业务服务
container.register_transient(UserService, UserService)
container.register_transient(OrderService, OrderService)
container.register_transient(PaymentService, PaymentService)
```

### 实现

```python
# 用户服务
class UserService:
    def __init__(self, db: DatabaseInterface, cache: CacheInterface):
        self.db = db
        self.cache = cache
    
    def get_user(self, user_id):
        # 优先从缓存获取
        cached = self.cache.get(f"user:{user_id}")
        if cached:
            return cached
        
        # 缓存未命中，从数据库查询
        user = self.db.query(f"SELECT * FROM users WHERE id = {user_id}")
        self.cache.set(f"user:{user_id}", user)
        return user
```

### 结果

| 指标 | 改善前 | 改善后 |
|------|--------|--------|
| 数据库连接数 | 100+ | 10 |
| 响应时间 | 500ms | 150ms |
| 测试覆盖率 | 40% | 85% |
| 部署时间 | 30分钟 | 5分钟 |

### 经验教训

1. **生命周期选择很重要**：基础设施服务使用单例，业务服务使用瞬态
2. **依赖声明要明确**：显式声明依赖关系便于理解和测试
3. **配置分离**：不同环境使用不同配置

---

## 案例 2: 插件系统中的服务容器

### 背景

某数据分析平台需要支持可扩展的插件系统，允许第三方开发者开发插件。

### 挑战

- 插件需要访问平台的核心服务
- 插件之间可能存在依赖关系
- 需要支持插件的热插拔

### 解决方案

使用服务容器管理插件及其依赖：

```python
from FQBase.Foundation.container import ServiceContainer

# 创建应用容器
app_container = ServiceContainer()
app_container.register_singleton(DatabaseInterface, PostgreSQLAdapter)
app_container.register_singleton(CacheInterface, RedisCacheAdapter)

# 插件管理器
class PluginManager:
    def __init__(self, container: ServiceContainer):
        self.container = container
        self.plugins = {}
    
    def register_plugin(self, name: str, plugin_class: type, dependencies: list = None):
        # 为每个插件创建子容器
        plugin_container = ServiceContainer()
        
        # 复制应用容器的服务到插件容器
        for service_type, descriptor in app_container.registered_services.items():
            plugin_container.register_services[service_type] = descriptor
        
        # 注册插件及其依赖
        if dependencies:
            plugin_container.register_singleton(
                plugin_class,
                plugin_class,
                dependencies=dependencies
            )
        else:
            plugin_container.register_singleton(plugin_class, plugin_class)
        
        self.plugins[name] = plugin_container
```

### 实现

```python
# 定义数据处理插件接口
class DataProcessorInterface:
    def process(self, data): pass

# 第三方插件
class AdvancedFilter(DataProcessorInterface):
    def __init__(self, db: DatabaseInterface):
        self.db = db
    
    def process(self, data):
        # 使用数据库进行高级过滤
        return self.db.filter(data)

# 注册插件
manager = PluginManager(app_container)
manager.register_plugin(
    "advanced_filter",
    AdvancedFilter,
    dependencies=[DatabaseInterface]
)
```

### 结果

| 指标 | 改善前 | 改善后 |
|------|--------|--------|
| 插件开发时间 | 2周 | 2天 |
| 插件冲突数 | 10+ | 0 |
| 平台稳定性 | 95% | 99.9% |

### 经验教训

1. **容器隔离**：每个插件使用独立的容器，避免冲突
2. **依赖共享**：应用核心服务通过容器继承共享给插件
3. **生命周期管理**：合理选择单例和瞬态

---

## 案例 3: 遗留系统的现代化改造

### 背景

某传统企业有10年历史的单体应用，需要逐步迁移到现代化架构。

### 挑战

- 历史代码耦合严重
- 不能一次性重写
- 需要保持业务连续性

### 解决方案

使用服务容器进行渐进式改造：

```python
from FQBase.Foundation.container import ServiceContainer

# 第一步：创建容器
container = ServiceContainer()

# 第二步：注册遗留服务（不做改动）
container.register_singleton(
    LegacyDatabase,
    LegacyDatabase,
    dependencies=[LegacyConnectionPool]
)

# 第三步：注册新服务
container.register_singleton(
    NewCacheInterface,
    RedisCacheAdapter
)

# 第四步：使用适配器包装遗留服务
class LegacyDatabaseAdapter(DatabaseInterface):
    def __init__(self, legacy_db: LegacyDatabase):
        self.db = legacy_db
    
    def query(self, sql):
        # 适配新旧接口
        return self.db.execute(sql)
    
    def transaction(self, operations):
        # 适配事务接口
        return self.db.run_in_transaction(operations)

container.register_singleton(
    DatabaseInterface,
    LegacyDatabaseAdapter,
    dependencies=[LegacyDatabase]
)
```

### 实现

```python
# 新代码使用新接口
class NewUserService:
    def __init__(self, db: DatabaseInterface, cache: NewCacheInterface):
        self.db = db
        self.cache = cache
    
    def get_user(self, user_id):
        # 新代码使用新接口
        cached = self.cache.get(f"user:{user_id}")
        if cached:
            return cached
        return self.db.query(f"SELECT * FROM users WHERE id = {user_id}")

container.register_transient(NewUserService, NewUserService)
```

### 结果

| 指标 | 改造前 | 改造后 |
|------|--------|--------|
| 新功能开发速度 | 1个月/功能 | 1周/功能 |
| 代码耦合度 | 高 | 低 |
| 遗留代码比例 | 100% | 30% |
| 系统可测试性 | 差 | 好 |

### 经验教训

1. **适配器模式**：用适配器包装遗留代码，平滑迁移
2. **逐步替换**：先注册遗留服务，再逐步添加新服务
3. **接口先行**：先定义接口，再实现新服务

---

## 相关文档

- [设计模式](./patterns.md)
- [技术权衡](./tradeoff.md)
- [决策指南](./decision-guide.md)
- [数据流](./data-flow.md)
- [案例库](./examples.md)
