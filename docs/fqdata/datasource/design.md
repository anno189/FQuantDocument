# DataSource 模块 - 设计文档

## 设计原则

| 原则 | 应用 |
|------|------|
| **SOLID 原则** | 适配器继承单一职责，依赖倒置 |
| **DRY 原则** | 抽象基类避免重复代码 |
| **KISS 原则** | 简单直接的接口设计 |
| **适配器模式** | 统一接口封装不同数据源 |
| **单例模式** | 注册表全局唯一实例 |
| **工厂模式** | 适配器工厂延迟创建 |

## 核心设计决策

### 决策 1: 使用协议（Protocol）而非继承定义接口

**上下文：** 需要定义数据源应该支持的方法，但不希望强制所有适配器实现所有方法。

**决策：** 使用 Python Protocol（运行时协议检查）定义可选接口。

**实现：**
```python
@runtime_checkable
class StockDataSource(Protocol):
    def get_stock_day(self, code, start, end) -> Optional[pd.DataFrame]: ...
    def get_stock_min(self, code, start, end, frequence) -> Optional[pd.DataFrame]: ...
```

**后果：**
- ✅ 优点：适配器只需实现其支持的方法
- ✅ 优点：运行时类型检查灵活
- ❌ 缺点：IDE 自动补全支持有限

---

### 决策 2: Facade 模式统一入口

**上下文：** 用户需要简单一致的方式获取数据，不希望关心底层适配器细节。

**决策：** 提供 DataSource Facade 统一入口。

**实现：**
```python
class DataSource:
    def get_data(self, market, code, start, end, frequence, if_fq):
        """统一数据获取接口"""
        method_map = {
            ("stock", "day"): self.get_stock_day,
            ("index", "day"): self.get_index_day,
            # ...
        }
        return method_map.get((market, frequence))(code, start, end)
```

**后果：**
- ✅ 优点：用户接口简单
- ✅ 优点：内部可灵活切换适配器
- ❌ 缺点：可能有轻微性能损耗

---

### 决策 3: 回退机制确保高可用

**上下文：** 生产环境中数据源可能临时不可用，需要自动切换到备用数据源。

**决策：** 实现多级回退机制。

**实现：**
```python
def _fetch_with_fallback(self, data_type, fetch_func):
    if self._primary_source:
        try:
            return fetch_func(self._primary_source)
        except Exception as e:
            logger.warning(f"Primary source failed: {e}")

    for source in self._fallback_sources:
        try:
            return fetch_func(source)
        except Exception as e:
            logger.warning(f"Fallback source {source.name} failed: {e}")

    return None
```

**后果：**
- ✅ 优点：提高系统可用性
- ✅ 优点：用户无感知切换
- ❌ 缺点：增加调用延迟（回退时）

---

### 决策 4: 单例注册表管理适配器

**上下文：** 全局需要统一管理所有数据源适配器实例。

**决策：** 使用单例模式的注册表。

**实现：**
```python
@singleton
class DataSourceRegistry:
    def __init__(self):
        self._sources: Dict[str, DataSourceAdapter] = {}

    def register(self, name: str, source: DataSourceAdapter): ...
    def get(self, name: str) -> Optional[DataSourceAdapter]: ...
```

**后果：**
- ✅ 优点：全局唯一实例
- ✅ 优点：集中管理适配器
- ❌ 缺点：难以测试（单例）

---

### 决策 5: 延迟加载适配器

**上下文：** 适配器初始化可能较慢（如 TDX 连接），不应在模块导入时全部加载。

**决策：** 使用延迟加载（Lazy Loading）模式。

**实现：**
```python
def _lazy_import_tdx():
    """延迟导入 TDX 适配器"""
    from .adapters.tdx import (
        TdxStockAdapter, TdxIndexAdapter, TdxFutureAdapter,
        # ...
    )
    return {
        'stock': TdxStockAdapter,
        'index': TdxIndexAdapter,
        # ...
    }
```

**后果：**
- ✅ 优点：加快模块导入速度
- ✅ 优点：按需加载资源
- ❌ 缺点：首次调用有一定延迟

---

## 设计模式

### 1. 适配器模式 (Adapter Pattern)

```
┌─────────────────┐         ┌─────────────────┐
│   Target        │         │   Client        │
│   (接口)        │◄────────│   (用户)        │
└─────────────────┘         └─────────────────┘
         │                            │
         │                            │
         ▼                            ▼
┌─────────────────┐         ┌─────────────────┐
│    Adapter     │─────────►│    Adaptee     │
│  (DataSource) │         │  (TdxAdapter)  │
└─────────────────┘         └─────────────────┘
```

### 2. 门面模式 (Facade Pattern)

```
┌─────────────────────────────────────┐
│           DataSource Facade           │
│  ┌─────────────────────────────────┐ │
│  │  get_data()                     │ │
│  │  set_mode()                    │ │
│  │  health_check()                 │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────┐
│         Subsystem Classes            │
│  ┌──────────┐ ┌──────────┐        │
│  │ Registry │ │ Adapter1 │ ...    │
│  └──────────┘ └──────────┘        │
└─────────────────────────────────────┘
```

### 3. 注册表模式 (Registry Pattern)

```
┌─────────────────────────────────────┐
│      DataSourceRegistry (Singleton)   │
├─────────────────────────────────────┤
│  _sources: Dict[str, Adapter]        │
├─────────────────────────────────────┤
│  register(name, adapter)            │
│  unregister(name)                   │
│  get(name) -> adapter               │
│  list_sources() -> [names]          │
└─────────────────────────────────────┘
```

## 扩展点

### 1. 添加新的适配器

```python
from FQData.DataSource import DataSourceAdapter, register_source

class MyCustomAdapter(DataSourceAdapter):
    def __init__(self):
        super().__init__("my_custom")

    def health_check(self) -> bool:
        return True

    def get_stock_day(self, code, start, end, frequence="day"):
        # 实现获取逻辑
        return data

register_source('my_custom', MyCustomAdapter)
```

### 2. 自定义数据源模式

```python
from FQData.DataSource import DataSource, DataSourceMode

class CustomDataSource(DataSource):
    def __init__(self):
        super().__init__()
        self._mode = DataSourceMode.CUSTOM

    def _custom_routing(self, market, code):
        # 自定义路由逻辑
        pass
```

### 3. 扩展健康检查

```python
from FQData.DataSource import DataSourceHealthCheck, HealthStatus

class CustomHealthCheck(DataSourceHealthCheck):
    def check(self, name):
        status = super().check(name)
        if status.is_healthy:
            status.details['custom_check'] = self._do_custom_check()
        return status
```

## 异常设计

| 异常 | 继承 | 触发条件 |
|------|------|----------|
| `DataSourceError` | FQBase.DataSourceException | 数据源错误基类 |
| `DataSourceConnectionError` | DataSourceError | 连接失败 |
| `DataNotFoundError` | DataSourceError | 数据不存在 |
| `DataSourceAPIError` | DataSourceError | API 调用失败 |

```python
try:
    data = ds.get_stock_day('600000', '2024-01-01', '2024-12-31')
except DataSourceConnectionError:
    # 处理连接问题
    ds.add_fallback_source('akshare')
except DataNotFoundError:
    # 处理数据不存在
    pass
except DataSourceAPIError as e:
    # 处理 API 错误
    logger.error(f"API error: {e}")
```

## 相关文档

- [框架集成](./framework.md)
- [架构文档](./architecture.md)
- [API 参考](./api.md)
- [最佳实践](./best-practices.md)
