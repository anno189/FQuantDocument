# ADR-005: 缓存适配器架构

## 状态
**Accepted** | 2024-04-22

## 背景
应用程序需要统一的缓存抽象，支持多种后端（Redis、Memory、MongoDB），同时保持代码接口一致。

## 决策
采用**适配器模式 + 工厂模式**：

### 接口协议
```python
@runtime_checkable
class CacheInterface(Protocol):
    def get(self, key: str, default: Any = None) -> Any: ...
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool: ...
    def delete(self, key: str) -> bool: ...
    def exists(self, key: str) -> bool: ...
    def clear(self) -> bool: ...
```

### 适配器实现
| 适配器 | 后端 | 用途 |
|--------|------|------|
| `LocalCache` | Python dict | 单进程内存缓存 |
| `RedisCacheAdapter` | Redis | 分布式缓存 |
| `MongoCacheAdapter` | MongoDB | 大数据量缓存 |

### 工厂注册机制
```python
def register_cache_adapter(cache_type: str, factory_func):
    _CACHE_ADAPTER_FACTORY_REGISTRY[cache_type] = factory_func

def create_cache(config: CacheConfigProtocol) -> CacheInterface:
    cache_type = getattr(config, 'cache_type', 'memory')
    factory = _CACHE_ADAPTER_FACTORY_REGISTRY.get(cache_type)
    return factory(config)
```

## 关键设计决策

### 1. Protocol 协议
使用 `@runtime_checkable` Protocol 定义接口，实现编译时类型检查 + 运行时验证。

### 2. 全局适配器
```python
_global_cache_adapter: Optional[CacheInterface] = None

def get_cache_adapter() -> Optional[CacheInterface]:
    return _global_cache_adapter
```
提供全局访问点。

### 3. 上下文管理器
```python
with CacheContext(my_adapter):
    cache = get_cache_adapter()  # 使用 my_adapter
```

## 后果

### 正面
- 接口统一，便于切换后端
- 工厂模式支持扩展新后端
- 全局访问点简化使用

### 负面
- 间接调用增加调试难度
- 多后端事务一致性需应用层处理

## 维护记录
| 日期 | 变更 |
|------|------|
| 2024-04-22 | 初始版本 |
